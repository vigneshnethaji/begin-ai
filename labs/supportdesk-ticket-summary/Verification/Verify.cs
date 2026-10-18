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
        var v1 = comparison.Evaluate("v1", Fixtures.ReviewedCases, false);
        var v2 = comparison.Evaluate("v2", Fixtures.ReviewedCases, true);
        Check("v1 browser-parity shape/category/exact-facts totals", (v1.Total, v1.ValidShape, v1.CorrectLabels, v1.RequiredFactsPresent) == (4, 4, 3, 3));
        Check("v2 browser-parity shape/category/exact-facts totals", (v2.Total, v2.ValidShape, v2.CorrectLabels, v2.RequiredFactsPresent) == (4, 4, 3, 4));
        Check("v1 passes two cases and three missing-information lists", v1.CasesPassed == 2 && v1.CorrectMissingInformation == 3);
        Check("v2 passes three cases and four missing-information lists", v2.CasesPassed == 3 && v2.CorrectMissingInformation == 4);
        var general = Fixtures.ReviewedCases.Single(item => item.ExpectedCategory == "General");
        Check("General category passes v1 but regresses in v2", comparison.Evaluate("v1", [general], false).CorrectLabels == 1 && comparison.Evaluate("v2", [general], true).CorrectLabels == 0);
        var changed = new ReviewedCase("changed", "Ticket", "Billing", ["Required fact"], new(SampleStatus.Completed, good), new(SampleStatus.Completed, good));
        Check("evaluation compares exact facts rather than hardcoded totals", comparison.Evaluate("custom", [changed], true) == new ComparisonScore("custom", 1, 1, 1, 0) { CorrectMissingInformation = 1 });
        foreach (string[] actual in new string[][] { ["First", "Second", "Extra"], ["Second", "First"], ["First", "Second", "Second"], ["first", "Second"] })
        {
            var response = new SampleResponse(SampleStatus.Completed, JsonSerializer.Serialize(new SummaryDto("Facts", "Billing", actual, [])));
            var exact = new ReviewedCase("exact facts", "Ticket", "Billing", ["First", "Second"], response, response);
            Check("exact facts reject additions, reordering, duplicates and changed case", comparison.Evaluate("custom", [exact], true).RequiredFactsPresent == 0);
        }
        foreach (string[] actual in new string[][] { [], ["First"], ["First", "Second", "Extra"], ["Second", "First"], ["First", "Second", "Second"], ["first", "Second"] })
        {
            var response = new SampleResponse(SampleStatus.Completed, JsonSerializer.Serialize(new SummaryDto("Missing details", "Billing", ["Supported fact"], actual)));
            var exact = new ReviewedCase("exact missing information", "Ticket", "Billing", ["Supported fact"], response, response)
                { ExpectedMissingInformation = ["First", "Second"] };
            var score = comparison.Evaluate("custom", [exact], true);
            Check("missing-information mismatch alone fails a case", score is { ValidShape: 1, CorrectLabels: 1, RequiredFactsPresent: 1, CorrectMissingInformation: 0, CasesPassed: 0 });
        }
        var billing = Fixtures.ReviewedCases.Single(item => item.Name == "billing");
        var invalid = billing with { V2 = new(SampleStatus.Completed, "{}") };
        Check("invalid shape fails every comparison measure", comparison.Evaluate("custom", [invalid], true) == new ComparisonScore("custom", 1, 0, 0, 0));
        var refused = billing with { V2 = billing.V2 with { Status = SampleStatus.Refused } };
        Check("refusal blocks comparison even with a complete-looking object", comparison.Evaluate("custom", [refused], true) == new ComparisonScore("custom", 1, 0, 0, 0));
        Check("empty case set has zero counts and denominator", comparison.Evaluate("empty", [], true) == new ComparisonScore("empty", 0, 0, 0, 0));
        var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        bool[] CaseChecks(ReviewedCase item, bool useV2)
        {
            var score = comparison.Evaluate(useV2 ? "v2" : "v1", [item], useV2);
            return [score.ValidShape == 1, score.CorrectLabels == 1, score.RequiredFactsPresent == 1, score.CorrectMissingInformation == 1];
        }
        // Machine-readable verification output, using actual fixtures and evaluator.
        // The Node consumer compares it against the browser mount/click results.
        Console.WriteLine("PROMPT_COMPARISON_JSON " + JsonSerializer.Serialize(new
        {
            cases = Fixtures.ReviewedCases.Select(item => new
            {
                id = item.Name,
                input = item.Ticket,
                expected = new { category = item.ExpectedCategory, facts = item.RequiredFacts, missingInformation = item.ExpectedMissingInformation },
                v1 = JsonSerializer.Deserialize<JsonElement>(item.V1.Content),
                v2 = JsonSerializer.Deserialize<JsonElement>(item.V2.Content),
                checks = new[] { CaseChecks(item, false), CaseChecks(item, true) }
            }),
            scores = new[] { v1, v2 },
            prompts = new[] { Fixtures.PromptV1, Fixtures.PromptV2 }
        }, jsonOptions));
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
