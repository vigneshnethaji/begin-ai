using System.Text.Json;
using SupportDesk.RetrievalQuality.Services;

namespace SupportDesk.RetrievalQuality.Verification;

public static class Verify
{
    public static int Run()
    {
        int passed = 0;
        void Check(bool value, string label) { if (!value) throw new InvalidOperationException(label); passed++; Console.WriteLine($"PASS: {label}"); }
        try
        {
            var engine = new RetrievalEngine();
            foreach (var padded in new[] { "\tpassword", "password\n", " \tpassword\r\n ", "password\treset", "password\nreset" })
            {
                string plain = padded.Contains("reset") ? "password reset" : "password";
                (string, int)[] expected = plain == "password" ? [("A-101", 4), ("A-102", 3)] : [("A-101", 9), ("A-102", 6)];
                bool Matches(SearchResult result) => result.Items.Select(hit => (hit.Id, hit.Score)).SequenceEqual(expected);
                Check(Matches(new RetrievalEngine().Search("teamA", plain, "tuned", 2)), "cold plain query has literal IDs and scores");
                Check(Matches(new RetrievalEngine().Search("teamA", padded, "tuned", 2)), "cold padded query has literal IDs and scores");
                foreach (var order in new[] { new[] { padded, plain }, new[] { plain, padded } })
                {
                    var normalized = new RetrievalEngine();
                    Check(Matches(normalized.Search("teamA", order[0], "tuned", 2)), "first request keeps expected IDs and scores");
                    var replay = normalized.Search("teamA", order[1], "tuned", 2);
                    Check(Matches(replay) && replay.Cached, "equivalent second query shares a correctly scored cache entry");
                }
            }
            Check(engine.Search("teamA", "password reset", "baseline", 1).Items.Single().Id == "A-102", "baseline keyword distractor ranks first");
            Check(engine.Search("teamA", "password reset", "tuned", 1).Items.Single().Id == "A-101", "title-weighted toy reranking promotes labelled answer");
            Check(engine.Search("teamA", "password reset", "tuned", 1).Items.All(x => x.Id.StartsWith("A-")), "cross-tenant higher score excluded before top-k");
            foreach (var id in new[] { "B-201", "A-104", "A-999" })
            {
                var result = engine.Search("teamA", "password reset", "tuned", 1, id);
                Check(result.Message == "Document unavailable." && result.Items.Length == 0, $"generic unavailable for {id}");
                Check(!JsonSerializer.Serialize(result.Trace).Contains(id), "unavailable trace contains no requested inaccessible ID");
            }
            var original = engine.Search("teamA", "password reset", "tuned", 1, "A-101");
            Check(engine.Search("teamA", "password reset", "tuned", 1, "A-101").Cached, "matching request replays scoped cache");
            Check(!engine.Search("teamB", "password reset", "tuned", 1, "A-101").Cached, "cache never crosses caller scope");
            engine.RevokeReset();
            Check(engine.Search("teamA", "password reset", "tuned", 1, "A-101").Items.Length == 0, "revocation blocks cached disclosure");
            Check(engine.Recheck(original).Items.Length == 0, "previous response fails authorization recheck after edit/revocation");
            engine = new RetrievalEngine();
            engine.UpdateReset();
            Check(engine.Search("teamA", "password reset", "tuned", 1, "A-101").Items[0].Text.Contains("ten minutes"), "source edit leaves old snapshot until publication");
            engine.Publish();
            var updated = engine.Search("teamA", "password reset", "tuned", 1, "A-101");
            Check(updated.Revision == 2 && updated.Items[0].Version == 2 && updated.Items[0].Text.Contains("five minutes"), "published revision invalidates cache and serves updated version");
            Check(engine.Recheck(original).Items.Length == 0, "stale held response invalid after revision changes");
            engine.DeleteReset();
            Check(engine.Search("teamA", "password reset", "tuned", 1, "A-101").Items.Length == 0, "source tombstone blocks stale cached read immediately");
            engine.Publish();
            Check(engine.Search("teamA", "password reset", "tuned", 1, "A-101").Items.Length == 0, "published tombstone removes index entry");
            var injection = engine.Search("teamA", "injection", "tuned", 1, "A-103");
            Check(injection.Items.Single().Text.Contains("Ignore previous"), "injection fixture remains plain retrieved text");
            Check(engine.Search("teamA", "password reset", "tuned", 1, "B-201").Items.Length == 0, "injection cannot alter server scope");
            string trace = JsonSerializer.Serialize(injection.Trace);
            Check(!trace.Contains("Ignore previous") && !trace.Contains("B-201") && !trace.Contains("password"), "safe trace excludes query, content and hidden IDs");
            Check(injection.Trace.Stages.Length <= 8 && injection.Trace.ReturnedIds.SequenceEqual(new[] { "A-103" }), "bounded trace identifies only authorized returned IDs");
            var score = RetrievalMetrics.Measure(["x", "a", "b"], ["a", "b"], 2);
            Check(score.Recall == .5 && score.Rr == .5, "literal Recall@2=0.5 and RR@2=0.5");
            Check(RetrievalMetrics.Measure(["a", "a"], ["a", "b"], 2).Recall == .5, "duplicate result IDs do not inflate recall");
            Check(RetrievalMetrics.Measure([], ["a"], 2).Rr == 0, "missing relevant hit has reciprocal rank zero");
            Check(RetrievalMetrics.Measure(["a"], [], 2) is { Recall: 0, Rr: 0, Labelled: false }, "missing labels explicitly marked unlabelled, no division by zero");
            Check(RetrievalMetrics.Measure(["a"], ["a"], 0).Recall == 0, "zero cutoff returns zero");
            var evaluation = new RetrievalEngine().Evaluate();
            Check(evaluation[0].Recall == .5 && evaluation[0].Mrr == .5 && evaluation[1].Recall == 1 && evaluation[1].Mrr == 1, "literal tiny evaluation baseline 0.5/0.5 versus tuned 1/1");
            Check(engine.Search("teamA", new string('x', 161), "tuned", 1).Items.Length == 0, "oversized query rejected");
            Check(engine.Search("teamA", "password", "invented", 1).Items.Length == 0, "unknown ranking rejected");
            Check(engine.Search("teamA", "password", "tuned", 4).Items.Length == 0, "top-k bounded to three");
            Check(engine.Search("forged-admin", "password", "tuned", 1).Items.Length == 0, "unknown demo identity cannot grant access");
            Check(LabPort.Url(null) == "http://127.0.0.1:5113" && LabPort.Url("5114") == "http://127.0.0.1:5114", "default and optional ports stay loopback");
            foreach (var invalid in new[] { "0", "80", "65536", "5113;host", " 5113", "-1" })
            {
                bool rejected = false; try { LabPort.Url(invalid); } catch (ArgumentException) { rejected = true; }
                Check(rejected, "invalid port rejected");
            }
            Console.WriteLine($"PASS: {passed} retrieval checks; no listener started.");
            return 0;
        }
        catch (Exception error) { Console.Error.WriteLine($"FAIL after {passed} checks: {error.Message}"); return 1; }
    }
}
