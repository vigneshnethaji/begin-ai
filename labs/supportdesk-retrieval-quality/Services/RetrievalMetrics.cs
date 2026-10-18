namespace SupportDesk.RetrievalQuality.Services;

public sealed record Metric(double Recall, double Rr, bool Labelled);
public sealed record Evaluation(string Ranking, double Recall, double Mrr);

public static class RetrievalMetrics
{
    public static Metric Measure(string[] retrieved, string[] relevant, int k)
    {
        var labels = relevant.ToHashSet(StringComparer.Ordinal);
        var top = retrieved.Take(Math.Max(0, k)).ToArray();
        int first = Array.FindIndex(top, labels.Contains);
        return new(labels.Count == 0 ? 0 : (double)top.Distinct().Count(labels.Contains) / labels.Count,
            first < 0 ? 0 : 1d / (first + 1), labels.Count != 0);
    }
}
