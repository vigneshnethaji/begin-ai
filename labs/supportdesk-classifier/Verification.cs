namespace SupportDesk.Classifier;

internal static class Verification
{
    public static void Run(SupportClassifier classifier)
    {
        int passed = 0;
        void Check(string name, Action check)
        {
            check();
            Console.WriteLine($"PASS: {name}");
            passed++;
        }

        Check("valid commands and quoted prediction text", () =>
        {
            foreach (var name in new[] { "train", "evaluate", "--verify" })
                Require(Command.Parse([name]).Name == name, "Command was not recognized.");
            Require(Command.Parse(["predict", "My screen freezes"]).Text == "My screen freezes", "Prediction text changed.");
        });

        Check("empty text, invalid commands, and extra arguments are rejected", () =>
        {
            foreach (string[] arguments in new string[][]
            {
                [], ["unknown"], ["train", "extra"], ["evaluate", "extra"],
                ["--verify", "extra"], ["predict"], ["predict", ""],
                ["predict", " \t "], ["predict", "first", "second"]
            })
                Reject(() => Command.Parse(arguments));
        });

        Check("TSV validation rejects missing headers, empty files, wrong columns, empty text, and unknown labels", () =>
        {
            foreach (string[] lines in new string[][]
            {
                [], ["Label\tText"], ["Text\tLabel", "hello\tBilling"],
                ["Label\tText", "Billing"], ["Label\tText", "Billing\thello\textra"],
                ["Label\tText", "Billing\t   "], ["Label\tText", "Other\thello"],
                ["Label\tText", "General\thello"]
            })
                Reject(() => LabData.Parse(lines, "verification fixture"));
        });

        var train = LabData.Load("train.tsv");
        var test = LabData.Load("test.tsv");
        Check("separate nonempty splits, all three labels, and no normalized duplicates", () => LabData.ValidateSplit(train, test));
        Console.WriteLine($"Data: {train.Count} training; {test.Count} held-out test messages.");

        Check("split guard detects leakage, within-split duplicates, and absent categories", () =>
        {
            var leaked = new SupportMessage { Label = train[0].Label, Text = "  " + train[0].Text.ToUpperInvariant() + "!! " };
            Reject(() => LabData.ValidateSplit(train, [.. test, leaked]));
            Reject(() => LabData.ValidateSplit([.. train, leaked], test));
            Reject(() => LabData.ValidateSplit(train, [.. test, test[0]]));
            Reject(() => LabData.ValidateSplit(train.Where(row => row.Label != "Account").ToList(), test));
            Reject(() => LabData.ValidateSplit(train, test.Where(row => row.Label != "Technical").ToList()));
            Reject(() => LabData.ValidateSplit(train, []));
        });

        Check("baseline exactly matches the original refund-only Route, including substring matching and rejection", () =>
        {
            foreach (var (text, expected) in new[]
            {
                ("I need a refund", "Billing"), ("REFUND PLEASE", "Billing"),
                ("Please return my payment", "General"), ("I cannot sign in", "General"),
                ("   ", "Rejected"), ("", "Rejected"), ("\t\r\n", "Rejected"),
                ("The purchase is unrefunded", "Billing"),
                ("invoice password crash", "General"), ("Hello there", "General")
            })
                Require(SupportClassifier.KeywordBaseline(text) == expected, $"Wrong baseline for: {text}");
        });

        // Always retrain to test today's source data and the save operation; never fit test.tsv.
        var trained = classifier.Train();
        Check("training writes a nonempty saved model under the output artifacts directory", () =>
            Require(File.Exists(classifier.ModelPath) && new FileInfo(classifier.ModelPath).Length > 0, "Saved model is missing or empty."));
        var loaded = classifier.Load();
        Check("saved/reloaded predictions and scores match the in-memory trained model", () =>
        {
            foreach (var message in test)
            {
                var before = classifier.Predict(trained, message.Text);
                var after = classifier.Predict(loaded, message.Text);
                Require(LabData.Labels.Contains(after.Category), "Prediction has an unknown label.");
                Require(before.Category == after.Category, "Reload changed the predicted label.");
                Require(after.Scores.Length == 3 && before.Scores.Length == 3, "Expected three class scores.");
                Require(before.Scores.Zip(after.Scores).All(pair =>
                    float.IsFinite(pair.First) && float.IsFinite(pair.Second) &&
                    Math.Abs(pair.First - pair.Second) <= 0.000001f), "Reload changed scores or produced nonfinite values.");
            }
            Reject(() => classifier.Predict(loaded, ""));
            Reject(() => classifier.Predict(loaded, "   "));
        });

        var report = classifier.Evaluate(loaded, test);
        Check("evaluation covers every held-out row; model and baseline counts are bounded and consistent", () =>
        {
            Require(report.Total == test.Count, "Evaluation dropped or added rows.");
            Require(report.Correct >= 0 && report.Correct <= test.Count, "Model count out of bounds.");
            Require(report.BaselineCorrect >= 0 && report.BaselineCorrect <= test.Count, "Baseline count out of bounds.");
            int correct = 0, baselineCorrect = 0;
            for (int index = 0; index < test.Count; index++)
            {
                var expected = test[index];
                var actual = report.Cases[index];
                Require(actual.Text == expected.Text && actual.Expected == expected.Label, "Evaluation row alignment changed.");
                Require(actual.Predicted == classifier.Predict(loaded, expected.Text).Category, "Batch and single prediction disagree.");
                Require(actual.Baseline == SupportClassifier.KeywordBaseline(expected.Text), "Baseline result changed.");
                if (actual.Predicted == expected.Label) correct++;
                if (actual.Baseline == expected.Label) baselineCorrect++;
            }
            Require(report.Correct == correct && report.BaselineCorrect == baselineCorrect, "Incorrect correct-count calculation.");
            var fixture = classifier.Evaluate(loaded, new List<SupportMessage>
            {
                new() { Label = "Billing", Text = "Please refund my purchase" },
                new() { Label = "Billing", Text = "A question about my invoice" },
                new() { Label = "Account", Text = "Reset my password" },
                new() { Label = "Technical", Text = "The app crashes" }
            });
            Require(fixture.Total == 4 && fixture.BaselineCorrect == 1, "The original baseline must count General as wrong against the three target labels.");
            Require(fixture.Cases[0].Baseline == "Billing" && fixture.Cases.Skip(1).All(row => row.Baseline == "General"), "The baseline comparison no longer follows the original Route.");
            Reject(() => classifier.Evaluate(loaded, []));
        });
        report.Print();
        Console.WriteLine($"Verification passed: {passed}/{passed} checks. No accuracy threshold is required.");
    }

    private static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }

    private static void Reject(Action action)
    {
        try { action(); }
        catch (ArgumentException) { return; }
        catch (InvalidDataException) { return; }
        throw new InvalidOperationException("Expected invalid input to be rejected.");
    }
}
