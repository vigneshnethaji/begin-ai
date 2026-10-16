using Microsoft.ML.Data;
using System.Text.RegularExpressions;

namespace SupportDesk.Classifier;

public sealed class SupportMessage
{
    [LoadColumn(0)]
    public string Label { get; set; } = "";

    [LoadColumn(1)]
    public string Text { get; set; } = "";
}

public sealed class SupportPrediction
{
    [ColumnName("PredictedLabel")]
    public string Category { get; set; } = "";

    [ColumnName("Score")]
    public float[] Scores { get; set; } = [];
}

internal static class LabData
{
    public static readonly string[] Labels = ["Billing", "Account", "Technical"];
    public static List<SupportMessage> Load(string fileName)
    {
        // Use the executable's directory, never the caller's working directory.
        string path = Path.Combine(AppContext.BaseDirectory, "data", fileName);
        if (!File.Exists(path))
            throw new FileNotFoundException($"Data file missing: {path}. Run dotnet build to copy the bundled TSV files.");
        return Parse(File.ReadLines(path), fileName);
    }

    public static List<SupportMessage> Parse(IEnumerable<string> lines, string source)
    {
        using var iterator = lines.GetEnumerator();
        if (!iterator.MoveNext() || iterator.Current != "Label\tText")
            throw new InvalidDataException($"{source}: expected the header Label<TAB>Text.");
        var messages = new List<SupportMessage>();
        int lineNumber = 1;
        while (iterator.MoveNext())
        {
            lineNumber++;
            var columns = iterator.Current.Split('\t');
            if (columns.Length != 2 || !Labels.Contains(columns[0]) || string.IsNullOrWhiteSpace(columns[1]))
                throw new InvalidDataException($"{source}, line {lineNumber}: use exactly two tab-separated columns, a Billing/Account/Technical label, and nonempty text.");
            messages.Add(new SupportMessage { Label = columns[0], Text = columns[1] });
        }
        if (messages.Count == 0)
            throw new InvalidDataException($"{source}: add labeled messages below the header.");
        return messages;
    }

    public static void ValidateSplit(IReadOnlyList<SupportMessage> train, IReadOnlyList<SupportMessage> test)
    {
        var seen = new HashSet<string>(StringComparer.Ordinal);
        foreach (var (name, messages) in new[] { ("train", train), ("test", test) })
        {
            if (messages.Count == 0 || Labels.Any(label => !messages.Any(row => row.Label == label)))
                throw new InvalidDataException($"{name}: include messages for all three labels.");
            foreach (var message in messages)
            {
                if (!Labels.Contains(message.Label) || string.IsNullOrWhiteSpace(message.Text))
                    throw new InvalidDataException($"{name}: invalid label or empty message.");
                string normalized = string.Join(" ", Regex.Matches(message.Text.ToLowerInvariant(), @"[\p{L}\p{N}]+")
                    .Select(match => match.Value));
                if (normalized.Length == 0 || !seen.Add(normalized))
                    throw new InvalidDataException($"{name}: empty normalized text or duplicate message within/across splits: {message.Text}");
            }
        }
    }
}
