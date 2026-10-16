using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.Extensions.Options;
using SupportDesk.TicketSummary.Services;

namespace SupportDesk.TicketSummary.Verification;

public static class Verify
{
    public static int Run()
    {
        var failures = 0;
        var count = 0;
        var validator = new SummaryValidator();
        const string good = "{\"title\":\"Duplicate charge\",\"category\":\"Billing\",\"facts\":[\"Two charges reported.\"],\"missingInformation\":[]}";
        void Check(string name, bool pass) { count++; Console.WriteLine($"{(pass ? "PASS" : "FAIL")} {name}"); if (!pass) failures++; }
        bool Accept(string json) => validator.Validate(new(SampleStatus.Completed, json)) is ValidSummary;
        Check("completed response produces typed facts", validator.Validate(new(SampleStatus.Completed, good)) is ValidSummary { Summary.Category: "Billing", Summary.Facts.Length: 1 });
        foreach (var state in new[] { SampleStatus.Refused, SampleStatus.Incomplete, SampleStatus.Failed })
            Check($"{state} cannot validate even with valid JSON", validator.Validate(new(state, good)) is InvalidSummary);
        foreach (var bad in new[] { "{", "null", "[]", "{}", good.Replace("\"title\":\"Duplicate charge\",", ""), good.Replace("Billing", "billing"), good.Replace("Billing", "Payments"), good.Replace("\"Duplicate charge\"", "null"), good.Replace("\"Duplicate charge\"", "42"), good.Replace("\"Duplicate charge\"", "\"  \""), good.Replace("\"facts\":[\"Two charges reported.\"]", "\"facts\":[]"), good.Replace("\"facts\":[\"Two charges reported.\"]", "\"facts\":[null]"), good.Replace("\"facts\":[\"Two charges reported.\"]", "\"facts\":\"text\""), good.Replace("\"missingInformation\":[]", "\"missingInformation\":null"), good.Replace("\"title\":", "\"Title\":"), good.Replace("{", "{\"extra\":true,"), good.Replace("{", "{\"title\":\"Other\","), good.Replace("{", "{\"\\u0074itle\":\"Other\","), new string(' ', 16001), "{\"title\":" + new string('[', 20) + "0" + new string(']', 20) + "}" })
            Check($"rejects invalid input #{count}", !Accept(bad));
        string Payload(int title, int facts, int factSize, int missing, int missingSize) => JsonSerializer.Serialize(new { title = new string('t', title), category = "General", facts = Enumerable.Repeat(new string('f', factSize), facts), missingInformation = Enumerable.Repeat(new string('m', missingSize), missing) });
        Check("accepts exact upper bounds", Accept(Payload(80, 4, 160, 3, 120)));
        foreach (var json in new[] { Payload(81, 1, 1, 0, 1), Payload(1, 5, 1, 0, 1), Payload(1, 1, 161, 0, 1), Payload(1, 1, 1, 4, 1), Payload(1, 1, 1, 1, 121), Payload(1, 1, 0, 0, 1), Payload(1, 1, 1, 1, 0) })
            Check("rejects bound violation", !Accept(json));
        foreach (var category in new[] { "Billing", "Account", "Technical", "General" }) Check($"accepts {category}", Accept(good.Replace("Billing", category)));
        Check("allows exactly 16000 characters", Accept(good.PadRight(16000)));
        Check("rejects at 16001 characters", !Accept(good.PadRight(16001)));
        foreach (var bad in new[] { "", "5103x", " 5105", "0", "1023", "65536", "http://remote:5105" })
        {
            var rejected = false;
            try { LabPort.Parse(bad); } catch (ArgumentException) { rejected = true; }
            Check("rejects invalid port", rejected);
        }
        Check("default port is isolated", LabPort.Parse(null) == 5105);
        Check("optional port", LabPort.Parse("5115") == 5115);
        var comparison = new PromptComparison(validator);
        Check("v1 hand-reviewed fixture totals", comparison.Evaluate("v1", Fixtures.ReviewedCases, false) == new ComparisonScore("v1", 4, 3, 2, 2));
        Check("v2 hand-reviewed fixture totals", comparison.Evaluate("v2", Fixtures.ReviewedCases, true) == new ComparisonScore("v2", 4, 4, 4, 4));
        var changed = new ReviewedCase("changed", "Ticket", "Billing", ["Required fact"], new(SampleStatus.Completed, good), new(SampleStatus.Completed, good));
        Check("evaluation compares required facts rather than hardcoded totals", comparison.Evaluate("custom", [changed], true) == new ComparisonScore("custom", 1, 1, 1, 0));
        Check("unsupported claim passes shape validation", validator.Validate(Fixtures.Scenarios.Single(s => s.Id == "unsupported-claim").Response) is ValidSummary);
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSessionDataProtection();
        using (var provider = services.BuildServiceProvider())
        {
            var repository = provider.GetRequiredService<IOptions<KeyManagementOptions>>().Value.XmlRepository;
            Check("key repository is explicitly memory-only", repository is SessionKeyRepository);
            if (repository is not SessionKeyRepository memory)
                throw new InvalidOperationException("Memory repository missing; refusing profile fallback before starting framework services.");
            foreach (var startup in provider.GetServices<IHostedService>()) startup.StartAsync(CancellationToken.None).GetAwaiter().GetResult();
            Check("framework startup preloads only the memory repository", memory.Reads > 0 && memory.Writes > 0);
            var protector = provider.GetRequiredService<IDataProtectionProvider>().CreateProtector("local-test");
            Check("ephemeral antiforgery protection round trips", protector.Unprotect(protector.Protect("fictional")) == "fictional");
            var copy = memory.GetAllElements();
            copy.First().RemoveAll();
            Check("repository returns defensive XML copies", memory.GetAllElements().First().HasElements);
        }
        Console.WriteLine($"{count - failures}/{count} passed; {failures} failed.");
        return failures == 0 ? 0 : 1;
    }
}
