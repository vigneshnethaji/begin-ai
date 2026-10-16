# SupportDesk — C# rules baseline

Build the first code milestone in the AI for .NET developers preview. This is a deterministic console application, not a trained model. All messages are fictional. No account, API, database, or additional package is needed.

## Prerequisites

Use a desktop terminal with the .NET 10 SDK. `dotnet --version` should start with 10. Install the SDK from https://dotnet.microsoft.com/en-us/download/dotnet/10.0 if needed. Read the website lesson “When ordinary C# rules are enough” first.

## Run the supplied files

Put `SupportDesk.Rules.csproj` and `Program.cs` in the same folder. Open a terminal there:

```shell
dotnet run
```

Expected application output (the first run can also print SDK setup messages):

```text
I need a refund -> Billing
Please return my payment -> General
I cannot sign in -> General
<empty> -> Rejected
```

`IsNullOrWhiteSpace` rejects empty input. `Contains`, with ordinal case-insensitive comparison, routes text containing “refund” to Billing. Everything else goes to General.

## Verify the behavior

```shell
dotnet run -- --verify
```

```text
PASS: explicit refund
PASS: case-insensitive keyword
PASS: related wording has no keyword
PASS: unrelated message
PASS: whitespace is rejected
PASS: empty input is rejected
6/6 checks passed.
```

The verification process exits with 0 when all cases pass and 1 if any case fails. To see a real failure, temporarily change `Route` to return `Billing` for every message. Run the checks again, inspect the failures, then restore the rule.

## Start from a new project instead

In your own learning-code folder:

```shell
dotnet new console --name SupportDesk.Rules --framework net10.0
cd SupportDesk.Rules
```

Replace the generated `Program.cs` with the supplied file, then run the commands above. The shorter exercise shown inside the website illustrates routing; this supplied file also includes the `--verify` mode.

## Explain what happened

1. Why did “Please return my payment” go to General?
2. Why is rejecting empty input an application rule rather than a model task?
3. Would detecting the word “refund” be enough to authorize a refund? Explain why not.

Write one limitation and one testable strength of this approach in your own README. Later lessons will compare a small ML.NET classifier with this baseline on messages held out from training.

## Troubleshooting

- `dotnet` not recognized: install the SDK, then reopen the terminal.
- No project found: change into the folder containing the .csproj file.
- Target framework unsupported: use the .NET 10 SDK.
- Verification output missing: use the supplied Program.cs, not only the shorter website snippet.
- This demo checks substrings, not word meaning or intent. A model needs its own evaluation; it is not automatically an improvement.
