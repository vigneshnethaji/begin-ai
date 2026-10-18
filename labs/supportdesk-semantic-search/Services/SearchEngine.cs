namespace SupportDesk.SemanticSearch.Services;

public sealed record Article(string Id, string Title, string Text, string Category, float[] Vector, string Space);
public sealed record SearchHit(Article Article, double Score, double VectorScore, double KeywordScore);

public sealed class SearchEngine
{
    public const string ModelSpace = "toy-topics/v1/4";
    public const int Dimensions = 4;
    private static readonly Article[] Corpus = [
        new("ART-101", "Request a refund", "Refund eligibility and returning a payment after cancellation.", "Billing", [1,0,0,0], ModelSpace),
        new("ART-102", "Download an invoice", "Invoice copies and billing receipt downloads.", "Billing", [0,1,0,0], ModelSpace),
        new("ART-201", "Reset a password", "Password reset steps for a locked login.", "Account", [0,0,1,0], ModelSpace),
        new("ART-202", "Unlock an account", "Account access recovery and login checks.", "Account", [0,0,1,0], ModelSpace),
        new("ART-301", "Repair an export", "Export troubleshooting when a CSV file is empty.", "Technical", [0,0,0,1], ModelSpace),
        new("ART-302", "Restart a sync", "Sync troubleshooting when a transfer stops.", "Technical", [0,0,0,1], ModelSpace)
    ];
    // Return copies: callers cannot mutate the shared teaching corpus.
    public static IReadOnlyList<Article> Articles => Corpus.Select(x => x with { Vector = [..x.Vector] }).ToArray();
    private static string[] Tokens(string value) => System.Text.RegularExpressions.Regex
        .Matches(value.ToLowerInvariant(), "[a-z0-9]+")
        .Select(match => match.Value).ToArray();
    private static void ValidateVector(float[] vector)
    {
        if (vector is null || vector.Length == 0 || vector.Length > 4096 || vector.Any(x => !float.IsFinite(x)))
            throw new ArgumentException("Vectors require 1–4096 finite float values.");
    }
    public static double Cosine(float[] left, float[] right)
    {
        ValidateVector(left); ValidateVector(right);
        if (left.Length != right.Length) throw new ArgumentException("Vector dimensions must match.");
        double dot = 0, leftSquared = 0, rightSquared = 0;
        for (var i = 0; i < left.Length; i++)
        {
            // Widen BEFORE multiplication; finite float extremes remain safe in double.
            double a = left[i], b = right[i];
            dot += a * b; leftSquared += a * a; rightSquared += b * b;
        }
        // Cosine is mathematically undefined for zero; the lab's safe policy is 0.
        if (leftSquared == 0 || rightSquared == 0) return 0;
        return Math.Clamp(dot / (Math.Sqrt(leftSquared) * Math.Sqrt(rightSquared)), -1, 1);
    }
    public static float[] Vectorize(string query)
    {
        if (query is null || query.Length > 240) throw new ArgumentException("Use at most 240 characters.");
        float[] vector = [0, 0, 0, 0];
        foreach (var token in Tokens(query))
        {
            var axis = token switch
            {
                "refund" or "refunds" or "money" or "back" or "return" or "returning" or "payment" or "cancellation" => 0,
                "invoice" or "invoices" or "receipt" or "billing" => 1,
                "password" or "reset" or "login" or "locked" or "unlock" or "account" or "access" => 2,
                "export" or "csv" or "sync" or "transfer" or "file" => 3,
                _ => -1
            };
            if (axis >= 0) vector[axis]++;
        }
        return vector;
    }
    public IReadOnlyList<SearchHit> Search(string query, string mode = "hybrid", string category = "All", int k = 3, string space = ModelSpace, IReadOnlyList<Article>? articles = null)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length > 240) throw new ArgumentException("Enter a query of 1–240 characters, such as money back.");
        if (mode is not ("keyword" or "vector" or "hybrid")) throw new ArgumentException("Choose keyword, vector, or hybrid mode.");
        if (category is not ("All" or "Billing" or "Account" or "Technical")) throw new ArgumentException("Choose a listed category.");
        if (k is < 1 or > 6) throw new ArgumentException("Top-k must be between 1 and 6.");
        if (space != ModelSpace) throw new ArgumentException("Model-space mismatch: query and articles must use toy-topics/v1/4. Equal dimensions alone are insufficient.");
        var rows = articles ?? Corpus;
        if (rows.Count > 100) throw new ArgumentException("This exact-scan lab supports at most 100 articles.");
        foreach (var row in rows)
        {
            ValidateVector(row.Vector);
            if (row.Space != space || row.Vector.Length != Dimensions) throw new ArgumentException("Stored article model space or dimension mismatch; rebuild compatible vectors first.");
        }
        var queryVector = Vectorize(query);
        var terms = Tokens(query).Distinct(StringComparer.Ordinal).ToArray();
        // Metadata filtering precedes scoring and Take(k). This is exact scan, not ANN.
        return rows.Where(row => category == "All" || row.Category == category).Select(row =>
        {
            var articleTerms = Tokens(row.Title + " " + row.Text).ToHashSet(StringComparer.Ordinal);
            var keyword = terms.Length == 0 ? 0 : (double)terms.Count(articleTerms.Contains) / terms.Length;
            var vector = Cosine(queryVector, row.Vector);
            var score = mode switch { "keyword" => keyword, "vector" => vector, _ => 0.65 * Math.Max(0, vector) + 0.35 * keyword };
            return new SearchHit(row with { Vector = [..row.Vector] }, score, vector, keyword);
        }).Where(hit => hit.Score > 0).OrderByDescending(hit => hit.Score)
          .ThenBy(hit => hit.Article.Id, StringComparer.Ordinal).Take(k).ToArray();
    }
}
