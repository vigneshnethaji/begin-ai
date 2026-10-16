using Microsoft.ML;
using System.Globalization;

namespace SupportDesk.Classifier;

public sealed class SupportClassifier
{
    private readonly MLContext ml = new(seed: 42);
    public string ModelPath => Path.Combine(AppContext.BaseDirectory, "artifacts", "supportdesk-model.zip");

    public ITransformer Train()
    {
        // ONLY training rows enter Fit, including fitting the text vocabulary.
        var messages = LabData.Load("train.tsv");
        if (LabData.Labels.Any(label => !messages.Any(row => row.Label == label)))
            throw new InvalidDataException("Training requires examples of Billing, Account, and Technical.");
        var trainingData = ml.Data.LoadFromEnumerable(messages);
        var pipeline = ml.Transforms.Conversion.MapValueToKey("Label", nameof(SupportMessage.Label))
            .Append(ml.Transforms.Text.FeaturizeText("Features", nameof(SupportMessage.Text)))
            .Append(ml.MulticlassClassification.Trainers.SdcaMaximumEntropy(
                new Microsoft.ML.Trainers.SdcaMaximumEntropyMulticlassTrainer.Options
                {
                    LabelColumnName = "Label",
                    FeatureColumnName = "Features",
                    NumberOfThreads = 1
                }))
            .Append(ml.Transforms.Conversion.MapKeyToValue("PredictedLabel"));

        var model = pipeline.Fit(trainingData);
        Directory.CreateDirectory(Path.GetDirectoryName(ModelPath)!);
        ml.Model.Save(model, trainingData.Schema, ModelPath);
        Console.WriteLine($"Trained on {messages.Count} messages from train.tsv ONLY.");
        foreach (string label in LabData.Labels)
            Console.WriteLine($"  {label}: {messages.Count(row => row.Label == label)}");
        Console.WriteLine($"Saved model: {ModelPath}");
        return model;
    }

    public ITransformer Load()
    {
        if (!File.Exists(ModelPath))
            throw new FileNotFoundException($"No saved model at {ModelPath}. Run dotnet run -- train first (from the lab directory).");
        return ml.Model.Load(ModelPath, out _);
    }

    public SupportPrediction Predict(ITransformer model, string text)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(text, nameof(text));
        // A short-lived engine is fine for this console lab; PredictionEngine is not thread-safe.
        using var engine = ml.Model.CreatePredictionEngine<SupportMessage, SupportPrediction>(model);
        return engine.Predict(new SupportMessage { Text = text });
    }

    public EvaluationReport Evaluate(ITransformer model, IReadOnlyList<SupportMessage> messages)
    {
        if (messages.Count == 0)
            throw new ArgumentException("Evaluation needs at least one held-out message.", nameof(messages));
        var data = ml.Data.LoadFromEnumerable(messages);
        // Transform applies the SAVED vocabulary and weights; it does not train.
        var predictions = ml.Data.CreateEnumerable<SupportPrediction>(model.Transform(data), reuseRowObject: false).ToArray();
        if (predictions.Length != messages.Count)
            throw new InvalidOperationException("Prediction count does not match the held-out row count.");
        return new EvaluationReport(messages.Select((message, index) => new EvaluationCase(
            message.Text, message.Label, predictions[index].Category, KeywordBaseline(message.Text))).ToArray());
    }

    public static string KeywordBaseline(string text)
    {
        // Exact Route behavior from the original supportdesk-rules lab.
        if (string.IsNullOrWhiteSpace(text))
            return "Rejected";

        return text.Contains("refund", StringComparison.OrdinalIgnoreCase)
            ? "Billing"
            : "General";
    }
}

public sealed record EvaluationCase(string Text, string Expected, string Predicted, string Baseline);

public sealed record EvaluationReport(IReadOnlyList<EvaluationCase> Cases)
{
    public int Total => Cases.Count;
    public int Correct => Cases.Count(row => row.Expected == row.Predicted);
    public int BaselineCorrect => Cases.Count(row => row.Expected == row.Baseline);
    public void Print()
    {
        string Percent(int count) => ((double)count / Total).ToString("P1", CultureInfo.InvariantCulture);
        Console.WriteLine($"Held-out test.tsv: {Total} messages (never used for training).");
        Console.WriteLine($"ML.NET correct: {Correct}/{Total} ({Percent(Correct)})");
        Console.WriteLine($"Original rules baseline correct: {BaselineCorrect}/{Total} ({Percent(BaselineCorrect)})");
        Console.WriteLine($"Difference in correct counts (model - baseline): {Correct - BaselineCorrect:+0;-0;0}");
        PrintWrong("ML.NET", row => row.Predicted);
        PrintWrong("Original rules baseline", row => row.Baseline);
        Console.WriteLine("Original rules: whitespace -> Rejected; contains 'refund' (case-insensitive substring) -> Billing; otherwise General.");
        Console.WriteLine("General is only the baseline fallback, not a model label. The original rule cannot predict Account or Technical.");
        Console.WriteLine("Tiny synthetic educational split: these counts are not a production benchmark or evidence of general superiority.");
    }

    private void PrintWrong(string name, Func<EvaluationCase, string> prediction)
    {
        Console.WriteLine($"{name} wrong cases:");
        var wrong = Cases.Where(row => row.Expected != prediction(row)).ToArray();
        if (wrong.Length == 0) Console.WriteLine("  None on this split.");
        foreach (var row in wrong)
            Console.WriteLine($"  Expected {row.Expected}; predicted {prediction(row)} | {row.Text}");
    }
}
