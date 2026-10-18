using SupportDesk.SemanticSearch.Services;
namespace SupportDesk.SemanticSearch.Verification;

public static class Verify
{
    public static int Run()
    {
        var failures = 0; var passed = 0;
        void Check(string name, Action action)
        {
            try { action(); passed++; Console.WriteLine($"PASS {name}"); }
            catch (Exception error) { failures++; Console.Error.WriteLine($"FAIL {name}: {error.Message}"); }
        }
        void Require(bool condition) { if (!condition) throw new InvalidOperationException("Expected condition was false"); }
        void Reject(Action action)
        {
            try { action(); } catch (ArgumentException) { return; }
            throw new InvalidOperationException("Expected ArgumentException");
        }
        var engine = new SearchEngine();
        Check("identical direction is 1", () => Require(SearchEngine.Cosine([1, 0], [1, 0]) == 1));
        Check("orthogonal is 0", () => Require(SearchEngine.Cosine([1, 0], [0, 1]) == 0));
        Check("opposite direction is -1", () => Require(SearchEngine.Cosine([1, 0], [-1, 0]) == -1));
        Check("length normalized 3-4 vector", () => Require(Math.Abs(SearchEngine.Cosine([3, 4], [1, 0]) - 0.6) < 1e-12));
        Check("zero safe", () => Require(SearchEngine.Cosine([0, 0], [1, 0]) == 0));
        Check("dimension mismatch rejected", () => Reject(() => SearchEngine.Cosine([1], [1, 0])));
        Check("NaN rejected", () => Reject(() => SearchEngine.Cosine([float.NaN, 0], [1, 0])));
        Check("infinity rejected", () => Reject(() => SearchEngine.Cosine([1, 0], [float.PositiveInfinity, 0])));
        Check("empty vector rejected", () => Reject(() => SearchEngine.Cosine([], [])));
        Check("float extremes stay finite", () => Require(Math.Abs(SearchEngine.Cosine([float.MaxValue, float.MaxValue], [float.MaxValue, 0]) - 0.7071067811865475) < 1e-12));
        Check("synonyms are explicit toy axes", () => Require(SearchEngine.Vectorize("money back").SequenceEqual(new float[] { 2, 0, 0, 0 })));
        Check("lexical money back misses refund", () => Require(engine.Search("money back", "keyword").Count == 0));
        Check("vector money back finds refund", () => Require(engine.Search("money back", "vector", k: 1)[0].Article.Id == "ART-101"));
        Check("hybrid components literal score", () => { var hit = engine.Search("money back", k: 1)[0]; Require(hit.Article.Id == "ART-101" && hit.KeywordScore == 0 && hit.VectorScore == 1 && hit.Score == 0.65); });
        Check("filter BEFORE top-k", () => Require(engine.Search("refund password", "vector", "Account", 1)[0].Article.Id == "ART-201"));
        Check("no overlap returns empty", () => Require(engine.Search("unmapped vocabulary", "vector").Count == 0));
        Check("no category match returns empty", () => Require(engine.Search("refund", "vector", "Technical").Count == 0));
        Check("stable ordinal tie", () => {
            Article[] rows = [new("Z", "refund", "", "Billing", [1, 0, 0, 0], SearchEngine.ModelSpace), new("A", "refund", "", "Billing", [1, 0, 0, 0], SearchEngine.ModelSpace)];
            Require(engine.Search("refund", k: 2, articles: rows).Select(x => x.Article.Id).SequenceEqual(new[] { "A", "Z" }));
        });
        Check("empty query rejected", () => Reject(() => engine.Search(" ")));
        Check("query bound rejected", () => Reject(() => engine.Search(new string('x', 241))));
        Check("top-k min rejected", () => Reject(() => engine.Search("refund", k: 0)));
        Check("top-k max rejected", () => Reject(() => engine.Search("refund", k: 7)));
        Check("mode rejected", () => Reject(() => engine.Search("refund", "magic")));
        Check("category rejected", () => Reject(() => engine.Search("refund", category: "secret")));
        Check("same dimensions wrong model rejected", () => Reject(() => engine.Search("refund", space: "toy-topics/v2/4")));
        Check("stored model mismatch rejected", () => Reject(() => engine.Search("refund", articles: [new("X", "refund", "", "Billing", [1, 0, 0, 0], "other/4")])));
        Check("stored invalid dimensions rejected", () => Reject(() => engine.Search("refund", articles: [new("X", "refund", "", "Billing", [1, 0], SearchEngine.ModelSpace)])));
        Console.WriteLine($"Search verification: {passed} passed, {failures} failed.");
        return failures == 0 ? 0 : 1;
    }
}
