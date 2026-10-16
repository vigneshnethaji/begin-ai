using SupportDesk.TicketLookup.Services;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Xml.Linq;

namespace SupportDesk.TicketLookup.Verification;

public static class Verify
{
    public const string Valid = "{\"tool\":\"lookup_ticket\",\"arguments\":{\"ticketId\":\"DEMO-104\"}}";
    private static int passed;
    private static int failed;
    public static int Run()
    {
        passed = failed = 0;
        ParserCases();
        PortCases();
        ExecutorCases();
        DataProtectionCases();
        Console.WriteLine($"Verification: {passed} passed, {failed} failed.");
        return failed == 0 ? 0 : 1;
    }

    private static void Check(string name, Action body)
    {
        try { body(); passed++; Console.WriteLine($"PASS {name}"); }
        catch (Exception error) { failed++; Console.Error.WriteLine($"FAIL {name}: {error.Message}"); }
    }
    private static void Equal<T>(T expected, T actual)
    {
        if (!EqualityComparer<T>.Default.Equals(expected, actual))
            throw new InvalidOperationException($"Expected {expected}; got {actual}.");
    }
    private static void ParserCases()
    {
        Check("valid proposal parses to typed lookup arguments", () =>
        {
            var result = ProposalParser.Parse(Valid);
            Equal(true, result.IsValid);
            Equal("DEMO-104", result.Proposal!.Arguments.TicketId);
            Equal(Valid, ProposalParser.Canonical(result.Proposal));
        });
        Check("property order and whitespace normalize to the exact contract", () =>
            Equal(Valid, ProposalParser.Canonical(ProposalParser.Parse(" { \"arguments\": {\"ticketId\":\"DEMO-104\"}, \"tool\":\"lookup_ticket\" } ").Proposal!)));
        string?[] invalid = [null, "", "null", "[]", "{}", "{", Valid + "{}",
            Valid.Replace("lookup_ticket", "delete_ticket"), Valid.Replace("lookup_ticket", "Lookup_ticket"),
            Valid.Replace("\"lookup_ticket\"", "null"), Valid.Replace("\"lookup_ticket\"", "1"),
            Valid.Replace("\"arguments\":{\"ticketId\":\"DEMO-104\"}", "\"arguments\":null"),
            Valid.Replace("\"arguments\":{\"ticketId\":\"DEMO-104\"}", "\"arguments\":[]"),
            "{\"arguments\":{\"ticketId\":\"DEMO-104\"}}", "{\"tool\":\"lookup_ticket\"}",
            Valid.Replace("\"DEMO-104\"", "null"), Valid.Replace("\"DEMO-104\"", "104"),
            Valid.Replace("\"DEMO-104\"", "true"), Valid.Replace("ticketId", "TicketId"),
            Valid.Replace("DEMO-104", "demo-104"), Valid.Replace("DEMO-104", "DEMO-١٠٤"),
            Valid.Replace("DEMO-104", " DEMO-104"), Valid.Replace("DEMO-104", "DEMO-104\n"),
            Valid.Replace("DEMO-104", "DEMO-1044"), Valid.Replace("DEMO-104", "DEMO-10"),
            "{\"tool\":\"lookup_ticket\",\"arguments\":{}}",
            Valid.Replace("{\"tool\"", "{\"approved\":true,\"tool\""),
            Valid.Replace("{\"tool\"", "{\"tenant\":\"teamB\",\"tool\""),
            Valid.Replace("{\"tool\"", "{\"user\":\"billing\",\"tool\""),
            Valid.Replace("{\"tool\"", "{\"tool\":\"lookup_ticket\",\"tool\""),
            Valid.Replace("\"ticketId\":", "\"ticketId\":\"DEMO-205\",\"ticketId\":"),
            Valid.Replace("\"ticketId\":", "\"approved\":true,\"ticketId\":"),
            Valid.Replace("\"ticketId\":", "\"ticket\\u0049d\":\"DEMO-205\",\"ticketId\":"),
            "{\"tool\":\"lookup_ticket\",\"arguments\":{\"ticketId\":[[[[[[\"DEMO-104\"]]]]]]} }",
            Valid.Replace("}}", ",}}"), "/* comment */" + Valid];
        for (var i = 0; i < invalid.Length; i++)
        {
            var value = invalid[i];
            Check($"strict parser rejects malformed/unsafe case {i + 1}", () => Equal(false, ProposalParser.Parse(value).IsValid));
        }
        Check("4000 characters accepted; 4001 rejected server-side", () =>
        {
            Equal(true, ProposalParser.Parse(Valid.PadRight(4000)).IsValid);
            Equal(false, ProposalParser.Parse(Valid.PadRight(4001)).IsValid);
        });
        Check("malformed escaped Unicode is rejected without crashing the session", () =>
        {
            Equal(false, ProposalParser.Parse(Valid.Replace("DEMO-104", "DEMO-\\uD800")).IsValid);
            Equal(false, ProposalParser.Parse(Valid.Replace("ticketId", "\\uD800")).IsValid);
        });
    }
    private static void PortCases()
    {
        foreach (var (input, expected) in new (string?, int)[] { (null, 5107), ("1024", 1024), ("65535", 65535), ("5117", 5117) })
            Check($"loopback port {input ?? "default"}", () => { Equal(expected, LabPort.Parse(input)); Equal($"http://127.0.0.1:{expected}", LabPort.Url(input)); });
        foreach (var input in new[] { "", "1023", "65536", "-1", "+5107", " 5107", "5107 ", "abc", "http://0.0.0.0:5107", "5107.0" })
            Check($"reject port '{input}'", () =>
            {
                try { LabPort.Parse(input); }
                catch (ArgumentException) { return; }
                throw new InvalidOperationException("Invalid port was accepted.");
            });
    }

    private static void ExecutorCases()
    {
        const string other = "{\"tool\":\"lookup_ticket\",\"arguments\":{\"ticketId\":\"DEMO-205\"}}";
        Check("validation and approval do not invoke; explicit execution reads redacted ticket", () =>
        {
            var executor = new LookupExecutor(); var id = Guid.NewGuid();
            Equal(LookupOutcome.Allowed, executor.Validate(id, Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(0, executor.InvocationCount);
            Equal(true, executor.Approve(id, Valid, "billing", LookupScenario.Normal));
            Equal(0, executor.InvocationCount);
            var result = executor.Invoke(id, Valid, "billing", LookupScenario.Normal);
            Equal(LookupOutcome.Success, result.Outcome); Equal("DEMO-104", result.Ticket!.TicketId);
            Equal("Duplicate charge", result.Ticket.Subject); Equal("Open", result.Ticket.Status);
            Equal("Fictional duplicate charge reported; staff review pending.", result.Ticket.Summary);
            Equal(1, executor.InvocationCount); Equal(1, result.Attempts); Equal(false, result.Replay);
        });
        Check("invoke cannot bypass staff approval or fabricate review", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid();
            Equal(false, e.Approve(id, Valid, "billing", LookupScenario.Normal));
            Equal(LookupOutcome.ApprovalRequired, e.Invoke(id, Valid, "billing", LookupScenario.Normal).Outcome);
            e.Validate(id, Valid, "billing", LookupScenario.Normal);
            Equal(LookupOutcome.ApprovalRequired, e.Invoke(id, Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(0, e.InvocationCount);
        });
        foreach (var (identity, raw, expected) in new[] {
            ("no-access", Valid, LookupOutcome.Denied), ("technical", Valid, LookupOutcome.Unavailable),
            ("billing", other, LookupOutcome.Unavailable), ("billing", Valid.Replace("104", "999"), LookupOutcome.Unavailable),
            ("invented", Valid, LookupOutcome.Denied) })
            Check($"{identity} rejected without invocation for {raw}", () =>
            {
                var e = new LookupExecutor(); var id = Guid.NewGuid();
                Equal(expected, e.Validate(id, raw, identity, LookupScenario.Normal).Outcome);
                Equal(false, e.Approve(id, raw, identity, LookupScenario.Normal));
                Equal(expected, e.Invoke(id, raw, identity, LookupScenario.Normal).Outcome);
                Equal(0, e.InvocationCount);
            });
        Check("missing and cross-team existence are indistinguishable", () =>
        {
            var e = new LookupExecutor();
            var hidden = e.Invoke(Guid.NewGuid(), other, "billing", LookupScenario.Normal);
            var missing = e.Invoke(Guid.NewGuid(), Valid.Replace("104", "999"), "billing", LookupScenario.Normal);
            Equal(hidden, missing); Equal(LookupOutcome.Unavailable, hidden.Outcome);
        });
        Check("technical identity can read its own team fixture", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id, other, "technical");
            var r = e.Invoke(id, other, "technical", LookupScenario.Normal);
            Equal(LookupOutcome.Success, r.Outcome); Equal("Export issue", r.Ticket!.Subject);
        });
        Check("request ID, proposal, identity and mode bind the approval snapshot", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id);
            Equal(false, e.Approve(Guid.NewGuid(), Valid, "billing", LookupScenario.Normal));
            Ready(e, id);
            Equal(LookupOutcome.ApprovalRequired, e.Invoke(Guid.NewGuid(), Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(LookupOutcome.ApprovalRequired, e.Invoke(id, Valid, "billing", LookupScenario.Transient).Outcome);
            Equal(LookupOutcome.Unavailable, e.Invoke(id, other, "billing", LookupScenario.Normal).Outcome);
            Equal(LookupOutcome.Unavailable, e.Invoke(id, Valid, "technical", LookupScenario.Normal).Outcome);
            Equal(0, e.InvocationCount);
        });
        Check("edits explicitly invalidate server approval and require revalidation", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id); e.InvalidateReview();
            Equal(false, e.Approve(id, Valid, "billing", LookupScenario.Normal));
            Equal(LookupOutcome.ApprovalRequired, e.Invoke(id, Valid, "billing", LookupScenario.Normal).Outcome);
            Ready(e, id); e.Validate(id, "{}", "billing", LookupScenario.Normal);
            Equal(LookupOutcome.ApprovalRequired, e.Invoke(id, Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(0, e.InvocationCount);
        });
        Check("canonical reordered proposal retains the same approved meaning", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id);
            Equal(LookupOutcome.Success, e.Invoke(id, " {\"arguments\":{\"ticketId\":\"DEMO-104\"},\"tool\":\"lookup_ticket\"} ", "billing", LookupScenario.Normal).Outcome);
        });
        Check("duplicate exact request returns cache with no second read", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id);
            e.Invoke(id, Valid, "billing", LookupScenario.Normal);
            var replay = e.Invoke(id, Valid, "billing", LookupScenario.Normal);
            Equal(LookupOutcome.Success, replay.Outcome); Equal(true, replay.Replay);
            Equal("DEMO-104", replay.Ticket!.TicketId); Equal(1, e.InvocationCount);
            Equal(2, e.Audit.Count); Equal(true, e.Audit[^1].Replay);
        });
        Check("authorization is rechecked before cache and approval is still required", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id); e.Invoke(id, Valid, "billing", LookupScenario.Normal);
            var forbidden = e.Invoke(id, Valid, "no-access", LookupScenario.Normal);
            Equal(LookupOutcome.Denied, forbidden.Outcome); Equal<TicketView?>(null, forbidden.Ticket);
            Equal(LookupOutcome.Unavailable, e.Invoke(id, Valid, "technical", LookupScenario.Normal).Outcome);
            e.InvalidateReview();
            Equal(LookupOutcome.ApprovalRequired, e.Invoke(id, Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(1, e.InvocationCount);
        });
        Check("same request ID with changed arguments or identity conflicts", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id); e.Invoke(id, Valid, "billing", LookupScenario.Normal);
            Ready(e, id, other, "technical");
            Equal(LookupOutcome.Conflict, e.Invoke(id, other, "technical", LookupScenario.Normal).Outcome);
            Ready(e, id, scenario: LookupScenario.Unknown);
            Equal(LookupOutcome.Conflict, e.Invoke(id, Valid, "billing", LookupScenario.Unknown).Outcome);
            Equal(1, e.InvocationCount);
        });
        Check("concurrent duplicates serialize into exactly one local read in this session", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id);
            using var start = new ManualResetEventSlim(false);
            var tasks = Enumerable.Range(0, 24).Select(_ => Task.Run(() => { start.Wait(); return e.Invoke(id, Valid, "billing", LookupScenario.Normal); })).ToArray();
            start.Set(); var results = Task.WhenAll(tasks).GetAwaiter().GetResult();
            Equal(24, results.Count(r => r.Outcome == LookupOutcome.Success));
            Equal(23, results.Count(r => r.Replay)); Equal(1, e.InvocationCount); Equal(1, e.RecordCount);
        });
        Check("transient before read retries once: two attempts, one actual read", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id, scenario: LookupScenario.Transient);
            var r = e.Invoke(id, Valid, "billing", LookupScenario.Transient);
            Equal(LookupOutcome.Success, r.Outcome); Equal(2, r.Attempts); Equal(1, e.InvocationCount);
            Equal(2, e.Audit.Single().Attempts);
            Equal(true, e.Invoke(id, Valid, "billing", LookupScenario.Transient).Replay); Equal(1, e.InvocationCount);
        });
        Check("lost response after read is terminal unknown, replay never repeats read", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id, scenario: LookupScenario.Unknown);
            var r = e.Invoke(id, Valid, "billing", LookupScenario.Unknown);
            Equal(LookupOutcome.Unknown, r.Outcome); Equal<TicketView?>(null, r.Ticket); Equal(1, r.Attempts); Equal(1, e.InvocationCount);
            for (var i = 0; i < 5; i++)
            {
                var replay = e.Invoke(id, Valid, "billing", LookupScenario.Unknown);
                Equal(LookupOutcome.Unknown, replay.Outcome); Equal(true, replay.Replay); Equal<TicketView?>(null, replay.Ticket);
            }
            Equal(1, e.InvocationCount); Equal(true, e.Audit[^1].Unknown);
        });
        Check("untrusted approval fields and invalid modes cannot reach the read", () =>
        {
            var e = new LookupExecutor(); var id = Guid.NewGuid(); Ready(e, id);
            Equal(LookupOutcome.Invalid, e.Invoke(id, Valid.Replace("{\"tool\"", "{\"approved\":true,\"tool\""), "billing", LookupScenario.Normal).Outcome);
            Equal(LookupOutcome.Invalid, e.Invoke(id, Valid, "billing", (LookupScenario)99).Outcome);
            Equal(LookupOutcome.Invalid, e.Invoke(Guid.Empty, Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(0, e.InvocationCount);
        });
        Check("record bound fails closed, keeps unknown tombstone and audit FIFO is bounded", () =>
        {
            var e = new LookupExecutor(); var unknownId = Guid.NewGuid(); Ready(e, unknownId, scenario: LookupScenario.Unknown);
            e.Invoke(unknownId, Valid, "billing", LookupScenario.Unknown);
            for (var i = 1; i < 128; i++) { var id = Guid.NewGuid(); Ready(e, id); e.Invoke(id, Valid, "billing", LookupScenario.Normal); }
            var overflow = Guid.NewGuid(); Ready(e, overflow);
            Equal(LookupOutcome.CapacityReached, e.Invoke(overflow, Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(128, e.RecordCount); Equal(128, e.InvocationCount); Equal(128, e.Audit.Count);
            Equal(overflow, e.Audit[^1].RequestId); Equal(false, e.Audit.Any(a => a.RequestId == unknownId));
            Ready(e, unknownId, scenario: LookupScenario.Unknown);
            var r = e.Invoke(unknownId, Valid, "billing", LookupScenario.Unknown);
            Equal(LookupOutcome.Unknown, r.Outcome); Equal(true, r.Replay); Equal(128, e.InvocationCount); Equal(128, e.Audit.Count);
        });
        Check("audit exposes safe identifiers/outcomes; sessions have independent counts and approvals", () =>
        {
            var first = new LookupExecutor(); var second = new LookupExecutor(); var id = Guid.NewGuid(); Ready(first, id);
            first.Invoke(id, Valid, "billing", LookupScenario.Normal);
            var audit = first.Audit.Single(); Equal(id, audit.RequestId); Equal("lookup_ticket", audit.Tool);
            Equal("DEMO-104", audit.TicketId); Equal("billing", audit.Caller); Equal(LookupOutcome.Success, audit.Outcome);
            Equal(LookupOutcome.ApprovalRequired, second.Invoke(id, Valid, "billing", LookupScenario.Normal).Outcome);
            Equal(0, second.InvocationCount); Equal(1, first.InvocationCount);
        });
    }
    private static void Ready(LookupExecutor executor, Guid id, string raw = Valid, string identity = "billing", LookupScenario scenario = LookupScenario.Normal)
    {
        Equal(LookupOutcome.Allowed, executor.Validate(id, raw, identity, scenario).Outcome);
        Equal(true, executor.Approve(id, raw, identity, scenario));
    }

    private static void DataProtectionCases()
    {
        Check("data protection hosted startup reads and creates keys only in the configured memory repository", () =>
        {
            var services = new ServiceCollection();
            services.AddLogging();
            SessionDataProtection.AddTo(services);
            RecordingXmlRepository? observed = null;
            services.PostConfigure<KeyManagementOptions>(options =>
            {
                // Guard before resolving IHostedService/IKeyManager: a broken
                // registration must fail without accessing personal key files.
                var memory = options.XmlRepository ?? throw new InvalidOperationException("Explicit in-memory XML repository missing; refusing profile fallback.");
                observed = new(memory);
                options.XmlRepository = observed;
            });
            using var provider = services.BuildServiceProvider();
            var configured = provider.GetRequiredService<IOptions<KeyManagementOptions>>().Value.XmlRepository;
            Equal(true, ReferenceEquals(configured, observed));
            var hosted = provider.GetServices<IHostedService>().ToArray();
            Equal(true, hosted.Length > 0);
            try
            {
                foreach (var service in hosted) service.StartAsync(CancellationToken.None).GetAwaiter().GetResult();
                // Assert before manually reading IKeyManager: these operations
                // must have been performed by the actual hosted preload path.
                Equal(true, observed!.ReadCount > 0);
                Equal(true, observed.WriteCount > 0);
                var key = provider.GetRequiredService<IKeyManager>().GetAllKeys().Single();
                Equal(false, key.IsRevoked);
                Equal(true, observed.GetAllElements().Any(element => element.Name == "key" && (string?)element.Attribute("id") == key.KeyId.ToString()));
                Equal(true, ReferenceEquals(configured, provider.GetRequiredService<IOptions<KeyManagementOptions>>().Value.XmlRepository));
                var protector = provider.GetRequiredService<IDataProtectionProvider>().CreateProtector("lookup-verification");
                var protectedValue = protector.Protect("fictional-session-value");
                Equal("fictional-session-value", protector.Unprotect(protectedValue));
                var secondServices = new ServiceCollection();
                secondServices.AddLogging();
                SessionDataProtection.AddTo(secondServices);
                using var second = secondServices.BuildServiceProvider();
                var secondProtector = second.GetRequiredService<IDataProtectionProvider>().CreateProtector("lookup-verification");
                try { secondProtector.Unprotect(protectedValue); }
                catch (CryptographicException) { return; }
                throw new InvalidOperationException("An independent runtime decrypted another runtime's ephemeral data.");
            }
            finally
            {
                foreach (var service in hosted.Reverse()) service.StopAsync(CancellationToken.None).GetAwaiter().GetResult();
            }
        });
        Check("in-memory XML repository clones stored input and every returned element", () =>
        {
            using var provider = MemoryProtectionServices();
            var repository = RequiredMemoryRepository(provider);
            var original = new XElement("fixture", new XElement("value", "original"));
            repository.StoreElement(original, "fictional");
            original.Element("value")!.Value = "changed-after-store";
            var first = repository.GetAllElements().Single();
            Equal("original", first.Element("value")!.Value);
            first.Element("value")!.Value = "changed-after-read";
            Equal("original", repository.GetAllElements().Single().Element("value")!.Value);
        });
        Check("concurrent XML stores and reads preserve independent snapshots with no lost entries", () =>
        {
            using var provider = MemoryProtectionServices();
            var repository = RequiredMemoryRepository(provider);
            Parallel.For(0, 64, index =>
            {
                var element = new XElement("fixture", new XAttribute("id", index), new XElement("value", "saved"));
                repository.StoreElement(element, "fictional");
                element.Element("value")!.Value = "input-mutated";
                foreach (var snapshot in repository.GetAllElements()) snapshot.RemoveNodes();
            });
            var final = repository.GetAllElements();
            Equal(64, final.Count);
            Equal(64, final.Select(element => (string?)element.Attribute("id")).Distinct().Count());
            Equal(true, final.All(element => element.Element("value")?.Value == "saved"));
            using var second = MemoryProtectionServices();
            Equal(0, RequiredMemoryRepository(second).GetAllElements().Count);
        });
    }

    private static ServiceProvider MemoryProtectionServices()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        SessionDataProtection.AddTo(services);
        return services.BuildServiceProvider();
    }
    private static IXmlRepository RequiredMemoryRepository(IServiceProvider provider) =>
        provider.GetRequiredService<IOptions<KeyManagementOptions>>().Value.XmlRepository ??
        throw new InvalidOperationException("Explicit in-memory XML repository missing; refusing profile fallback.");

    // Instrumentation forwards to the real production memory repository. No
    // key manager, hosted service or protection implementation is mocked.
    private sealed class RecordingXmlRepository(IXmlRepository inner) : IXmlRepository
    {
        private int reads;
        private int writes;
        public int ReadCount => Volatile.Read(ref reads);
        public int WriteCount => Volatile.Read(ref writes);
        public IReadOnlyCollection<XElement> GetAllElements()
        {
            Interlocked.Increment(ref reads);
            return inner.GetAllElements();
        }
        public void StoreElement(XElement element, string friendlyName)
        {
            inner.StoreElement(element, friendlyName);
            Interlocked.Increment(ref writes);
        }
    }
}
