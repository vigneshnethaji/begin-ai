# SupportDesk: a small ML.NET text classifier

A runnable beginner C# console lab that learns to route fictional support messages to **Billing**, **Account**, or **Technical**. All messages were written synthetically for this lab. They contain no customer data. The data is educational only, not a production benchmark.

This is local machine learning: no remote AI service, API key, database, web API, or downloaded pretrained model. NuGet access is needed for the first package restore; training and prediction run on your computer.

## Requirements and exact steps

Install the .NET 10 SDK. This lab targets `net10.0` and pins `Microsoft.ML` to exactly **5.0.1** using the NuGet range `[5.0.1]`. It was verified on Windows with SDK 10.0.401. The project uses its own `NuGet.Config` with NuGet.org for packages and vulnerability auditing, so unrelated corporate package feeds are not required.

In PowerShell, start in the lab directory:

```powershell
Set-Location C:\Users\vignesh.murugan\source\temp\newforai\labs\supportdesk-classifier
dotnet restore
dotnet build
dotnet run -- train
dotnet run -- evaluate
dotnet run -- predict "The application stops responding when I open a report"
dotnet run -- --verify
```

Use the commands in this order to see training, evaluation, and inference as separate operations. `dotnet run` builds the project if necessary. All successful commands return exit code 0; invalid inputs or failed verification return 1. The commands are case sensitive. Put the entire prediction message in double quotes.

From the workspace root, use `--project` before the argument separator:

```powershell
Set-Location C:\Users\vignesh.murugan\source\temp\newforai
dotnet run --project labs/supportdesk-classifier -- train
dotnet run --project labs/supportdesk-classifier -- evaluate
dotnet run --project labs/supportdesk-classifier -- predict "The application stops responding when I open a report"
dotnet run --project labs/supportdesk-classifier -- --verify
```

The project copies `data/train.tsv` and `data/test.tsv` to the executable's output directory at build time. Code resolves paths from `AppContext.BaseDirectory`, so the caller's working directory does not determine where data or the model is found. Edit the source TSV files, then build/run again to copy them. Do not edit the generated copies.

## What each command does

| Command | Behavior |
| --- | --- |
| `dotnet run -- train` | Reads **only** `train.tsv`, fits the complete pipeline, and saves/overwrites the model. Never reads `test.tsv`. |
| `dotnet run -- evaluate` | Loads the saved model, applies it to held-out `test.tsv`, and prints both classifiers' correct/total counts, percentages, count difference, and every wrong case. Does not train. |
| `dotnet run -- predict "message"` | Loads the saved model and predicts one category. Does not train. Empty or whitespace text is rejected. |
| `dotnet run -- --verify` | Runs validation and split checks, retrains using `train.tsv` only, saves and reloads the model, compares predictions/scores, and checks evaluation and baseline counts. `dotnet run` handles any needed build. |

The default saved file is:

```text
labs/supportdesk-classifier/bin/Debug/net10.0/artifacts/supportdesk-model.zip
```

The console also prints the full absolute path. The file lives under the build output, which the workspace ignores. Release builds have their own `bin/Release/net10.0/artifacts/` model; train in the same configuration you will use for prediction. Re-running training or verification replaces that configuration's model. Cleaning build output can remove it.

If evaluation or prediction says **No saved model**, run `dotnet run -- train` in the lab directory. Passing an unknown command, extra arguments, missing prediction text, or `dotnet run -- predict "   "` gives an error and a nonzero exit code. Deleting the model is unnecessary for ordinary use.

## Follow the data through the code

`data/train.tsv` has **54 messages: 18 per category**. `data/test.tsv` has **18 different messages: 6 per category**. Each has the header `Label<TAB>Text` and exactly two tab-separated columns. Tabs and embedded newlines are not supported inside a message.

`SupportMessage` in `LabData.cs` describes the input: `Label` is the known answer during training/evaluation; `Text` is the message to learn from. `[LoadColumn]` records the TSV column positions. The strict reader checks the header, column count, labels, and nonempty text before `LoadFromEnumerable` creates ML.NET's data view. `SupportPrediction` uses `[ColumnName("PredictedLabel")]` and `[ColumnName("Score")]` to bind model output to C# properties.

`SupportClassifier.cs` creates `MLContext(seed: 42)` and this pipeline:

1. `MapValueToKey` turns the three string labels into the numeric keys the trainer expects.
2. `FeaturizeText` turns **Text only** into a numeric `Features` vector using text patterns. The answer label is never included in `Features`.
3. `SdcaMaximumEntropy` learns a multiclass classifier from those features and labels. A single training thread reduces run-to-run variation in this small lab.
4. `MapKeyToValue` turns the predicted key back into a readable category.

`Fit(trainingData)` learns the vocabulary, text transformations, and classifier weights from **train.tsv only**. Saving persists the whole fitted pipeline. `Transform(testData)` applies that existing pipeline; it does not fit a new vocabulary or update weights. A test label supplies the answer for counting correct predictions, not an input text feature. Prediction supplies only the message text; its unused label is empty.

Keeping `Fit` and `Transform` separate matters: fitting on test messages would leak information into the model and make the evaluation less honest. The test file contains separately authored messages with different wording, not copied training sentences. Verification rejects duplicates within or across splits after lowercasing and normalizing punctuation/whitespace. This catches normalized duplicates, not all paraphrases or semantic overlap; related support vocabulary is intentional.

## Compare against the original rules lab

The comparison reuses the **exact `Route` behavior from `labs/supportdesk-rules/Program.cs`**, with no extra keywords or categories. It is ordinary C#, not a second learned model:

```csharp
if (string.IsNullOrWhiteSpace(message))
    return "Rejected";

return message.Contains("refund", StringComparison.OrdinalIgnoreCase)
    ? "Billing"
    : "General";
```

Empty/whitespace text returns **Rejected**. The case-insensitive **substring** `refund` returns **Billing**, including inside a word such as `unrefunded`. Every other nonempty message returns **General**, even if it mentions invoices, payments, passwords, or crashes. The rules are fixed and learn nothing from either data file.

The ML.NET model still predicts only **Billing / Account / Technical**. **General is only the original baseline's fallback**, never a model label or a dataset label. The held-out file contains no empty messages, so the baseline's Rejected branch is exercised by verification rather than evaluation. Correct counts use exact label equality: a General result is wrong against any of the three dataset labels.

Evaluation applies both approaches to exactly the same held-out rows. In the updated verified run the model got **15/18** correct and the original baseline got **0/18**. None of the 18 held-out messages contains the substring `refund`, so the unchanged original rule returns General for every row. The synthetic data has not been altered to improve either result.

This comparison illustrates the original rule's limited scope and sensitivity to wording. The rule cannot output Account or Technical at all; these counts are **not a fair benchmark between equally capable three-category classifiers** or a promise that machine learning wins. Inspect the printed mistakes and outputs. Do not tune training data against this test set and then call it an independent benchmark; create a fresh unseen split for later experiments.

## What verification checks

The built-in verifier exercises the real pipeline without a separate test framework:

- Valid command parsing and preservation of quoted text; invalid commands, extra arguments, missing/empty/whitespace messages are rejected.
- Invalid/empty TSV input, wrong headers/column counts, and unknown labels are rejected.
- Both splits are nonempty, contain every category, and have no normalized duplicates. Deliberately constructed leakage, duplicate, and missing-category fixtures must fail the guard.
- Literal original-rule examples check case-insensitive substring handling, empty/whitespace rejection, and General fallback. A four-message evaluation fixture checks that only its explicit refund is correct and that General counts as wrong for the three dataset labels.
- Training creates a nonempty saved model; all held-out predictions have known labels and three finite scores, and saving/reloading preserves labels and scores within a small numeric tolerance.
- Evaluation covers every held-out row in order, agrees with single-message prediction, and returns bounded, independently recounted model/baseline correct counts. Empty evaluation is rejected.

It exits nonzero on the first failed invariant and prints its error. There is **no fragile accuracy threshold**; correctness of the workflow is distinct from quality of a tiny model. The verifier retrains on every run so changes to source data are exercised.

## Reuse the saved classifier from C#

The console command handler calls the reusable `SupportClassifier` class. After training, another console flow in the same project can use the saved model like this:

```csharp
using SupportDesk.Classifier;

var classifier = new SupportClassifier();
var savedModel = classifier.Load();
SupportPrediction result = classifier.Predict(savedModel, "My screen turns blank after refresh");
Console.WriteLine(result.Category);
```

This code loads existing weights and does no training. It illustrates C# reuse, not a web API implementation. `PredictionEngine` is not thread-safe; this lab creates and disposes one per console prediction. Hosting and concurrent serving are separate topics.

## Honest limits

There are only 72 fictional English messages, hand-labeled into three coarse categories. They do not represent real users, languages, class imbalance, ambiguous requests, sensitive content, or changing business rules. The model always chooses one of these three labels, even for an unrelated message; it has no “unknown” category or reliable abstention. Scores are not a guarantee of correctness or calibrated confidence, so the CLI prints a category rather than a confidence claim.

One changed prediction moves the test score by about 5.6 percentage points. A fixed seed helps repeatability, but results can still vary with runtime/package/platform changes. A useful real evaluation would need far more representative, appropriately handled data and an untouched test set. This lab teaches the local train/save/load/evaluate/predict workflow, not production readiness.

Reference: Microsoft's [ML.NET multiclass classification tutorial](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/github-issue-classification) explains the same core APIs. Package: [Microsoft.ML 5.0.1 on NuGet](https://www.nuget.org/packages/Microsoft.ML/5.0.1).
