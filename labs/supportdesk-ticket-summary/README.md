# SupportDesk · Validated ticket summary

Unit 4: Reliable prompts and outputs. An independent beginner .NET 10 Blazor InteractiveServer lab. Free authored samples only: no model, provider adapter, provider calls, credentials, external NuGet packages, sending, database or persistence. No account or API key is needed. Use synthetic data only.

## Run the extracted download

Install the .NET **10 SDK** (a runtime alone is insufficient). Extract the complete lab folder, including the project, Components, Services, Verification and wwwroot. In a terminal **inside the extracted `supportdesk-ticket-summary` folder**:

```powershell
dotnet run
```

Open `http://localhost:5105`. Wait for **Load sample response** to become enabled; controls wait for the real interactive circuit. Stop with Ctrl+C. The default port differs from Unit 3's 5103. The lab does not require the academy site or another lab to run.

If 5105 is occupied, choose an unused port with the one supported setting:

```powershell
$env:SUMMARY_LAB_PORT = '5115'
dotnet run
```

Open `http://localhost:5115`. Remove that setting afterward with `Remove-Item Env:SUMMARY_LAB_PORT`. Only decimal integers 1024–65535 are accepted; blank, whitespace, URLs and invalid ranges fail startup. Binding is always loopback (`localhost`), never a configurable host. No launch profile or `--urls` is needed. Other arguments are rejected except `--verify`.

The browser communicates with the local Blazor server. There is no external AI/network request, HTTP client or provider integration. `CreateEmptyBuilder` deliberately avoids default appsettings, secrets and broad environment configuration; application code reads only `SUMMARY_LAB_PORT`. `UseStaticWebAssets` plus `MapStaticAssets` serves the framework bootstrap script even outside Development. Do not remove this setup.

Local antiforgery protection is ephemeral. Its separate framework startup key repository is explicitly memory-only too; it never falls back to the profile key-ring directory. These keys vanish on process restart. `SessionDataProtection.cs` and its instrumented startup verification demonstrate both paths without inspecting personal key files. This configuration is for this loopback learning lab, not a production or multi-instance deployment.

## Six-topic learning path

1. Inspect the synthetic ticket and choose an authored response fixture.
2. Load the response, inspect/edit its JSON, and validate the exact contract.
3. Read the typed preview, compare facts with the source, and review locally.
4. Compare prompt v1's broad request with v2's request for reported facts and missing details.
5. Run the deterministic four-case reviewed fixture comparison and inspect its saved responses.
6. Complete the milestone: explain schema validation versus factual truth, status gating, and evaluation limits.

Try `valid`, then `malformed-json`, `missing-field`, `invalid-category`, `refused`, `incomplete`, `failed`, and `unsupported-claim`. The last fixture claims a refund was issued, but the ticket says no refund is confirmed. It intentionally passes structural checks. **A successful typed shape does not guarantee factual truth; staff review is always required.**

Selecting another fixture clears the loaded response, typed result, errors and review. Loading again or editing the raw response also clears the DTO and review. Editing text cannot convert a refused, incomplete or failed response into completed. Only a completed response can enter JSON validation; refusal text is never parsed into a DTO. The review checkbox is enabled only after successful validation of a completed response. Nothing is sent or persisted when checked. Reloading discards the session workspace.

## Exact contract

```csharp
SummaryDto {
    string Title;                 // nonblank, <=80 characters
    string Category;              // Billing | Account | Technical | General
    string[] Facts;               // 1..4 nonblank strings, each <=160
    string[] MissingInformation;  // 0..3 nonblank strings, each <=120
}
```

JSON keys are exactly `title`, `category`, `facts`, `missingInformation` (case-sensitive). All four are required. The service rejects extra or duplicate keys (including escaped duplicates), nulls, wrong types, blank values, invalid categories, out-of-range lengths, malformed JSON, comments, trailing commas, input over **16000 characters**, and nesting deeper than **8**. Length uses .NET string length (UTF-16 code units). The textarea limits normal input to 16000; the service independently enforces the boundary. Validation returns either `ValidSummary` containing the DTO or `InvalidSummary` containing errors, never a partly valid DTO.

Razor encodes preview text. For example, put `<b>Demo title</b>` in the title string: it displays literally and does not become HTML. The validator checks shape, not whether a fact is supported, a category is appropriate or required context is omitted. Human review remains necessary after every success.

## Prompt comparison: authored fixtures, not a benchmark

Prompt texts and saved responses live in `Services/Fixtures.cs`; neither prompt is executed. The browser Unit 4 `reliable-compare` activity and this C# lab use the **same four literal inputs, candidate objects and reviewed expectations**, covering Billing, Account, Technical and General. `PromptComparison.Evaluate` runs the existing production validator, compares categories exactly, and uses ordinal, ordered equality for the entire facts and missing-information lists. Additions, omissions, duplicates, reordering and different casing fail exact matching. All four rules must pass for a case to pass. Invalid responses count as failures for all measures, with a denominator of four in every column.

| Authored set | Cases passed | Valid shape | Correct category | Exact facts | Exact missing information |
|---|---:|---:|---:|---:|---:|
| v1 | 2 / 4 | 4 / 4 | 3 / 4 | 3 / 4 | 3 / 4 |
| v2 | 3 / 4 | 4 / 4 | 3 / 4 | 4 / 4 | 4 / 4 |

Regression: **General passes v1 but fails v2**, because v2 incorrectly chooses Account. V1 also fails Billing evidence/missing information and Account category; Technical passes both versions.

These counts are authored simulations, **not a model benchmark and not evidence that v2 improves any real model**. Exact matching rejects extra fact strings but can reject a correct paraphrase; it does not perform semantic fact verification. Titles must pass the existing shape rules but do not need to equal a reviewed title. The fixture panel exposes expected categories, facts, missing information and saved outputs. The unsupported-claim scenario is a separate exercise, outside these four comparison cases.

The existing positional constructors for `ReviewedCase` and `ComparisonScore`, and the `PromptComparison.Evaluate` signature, remain available. `ReviewedCase.ExpectedMissingInformation` is an additive init property (default empty). `ComparisonScore.CorrectMissingInformation` and `CasesPassed` are additive counts. The legacy `RequiredFactsPresent` property now counts **exact fact-list matches**, not subset membership. `SummaryDto` and all production validator limits are unchanged.

## Verify

```powershell
dotnet run -- --verify
```

This runs deterministic, package-free C# checks and exits with zero on success or nonzero on failure; it starts no server and reads no application configuration or credentials. All test code lives in `Verification/`; parsing and evaluation live in production `Services/`. Tests cover valid typed data, strict shape, statuses, size/depth/bounds, allowed categories, loopback-port input, real comparison results and the deliberate factual-error example.

From the repository root, `node tests/prompt-parity-integration.cjs` also exercises the browser activity and executes C# `--verify` with build artifacts in a temporary directory. It compares every literal input, expected value, candidate and per-case rule result, then checks the aggregate scores and safe draft-lab first-run commands. C# verification emits a `PROMPT_COMPARISON_JSON` line containing only these authored fixtures and computed scores for that cross-runtime check.

Browser checks: load/validate valid, check review, edit JSON and confirm preview/review clear; validate malformed or refused and confirm no DTO; load unsupported-claim and confirm shape success plus unverified warning; render literal HTML text; compare four cases. Before checking the page, verify `http://localhost:5105/_framework/blazor.web.js` returns HTTP 200. An enabled Load button and a working Load/Validate click prove the interactive circuit, not merely prerendered HTML. Check at 320px and with keyboard focus. Stop the server after verification.

## Complete source tree

```text
supportdesk-ticket-summary/
  SupportDesk.TicketSummary.csproj
  NuGet.Config
  Program.cs
  README.md
  Components/
    _Imports.razor
    App.razor
    Routes.razor
    Pages/
      Home.razor
  Services/
    SummaryValidator.cs
    Fixtures.cs
    LabPort.cs
    SessionDataProtection.cs
  Verification/
    Verify.cs
  wwwroot/
    app.css
```

Keep this complete tree in the downloadable lab. Build-generated `bin/` and `obj/` are not source requirements.

## Browser selector contract

| Element | Stable ID |
|---|---|
| Fixture select | `summary-scenario` |
| Load button | `load-summary` |
| JSON textarea | `summary-json` |
| Validate button | `validate-summary` |
| Live status | `summary-status` |
| Error container | `summary-errors` |
| Typed result region | `summary-result` |
| Review checkbox | `review-summary` |
| Compare button | `compare-prompts` |
| Comparison region | `comparison-result` |

The select values are `valid`, `malformed-json`, `missing-field`, `invalid-category`, `refused`, `incomplete`, `failed`, `unsupported-claim`. Error/result containers remain present when empty. All actions initially wait for `OnAfterRender` to establish a live circuit. The theme uses academy canvas #121212, surface #1e1e1e, raised #272727, text #eee, muted #b7bdc6, primary Blue 700 #1976d2, white button text, Blue 200 #90caf9 links, Blue 400 #42a5f5 highlights, Segoe/system text and Cascadia/Consolas code; controls have 44px targets and visible focus.

The local Blazor circuit has a bounded 128 KiB incoming-message allowance so a
16,000-character candidate with multibyte text can reach validation without
disconnecting. The server still enforces the 16,000-character JSON boundary and
all field/depth limits. This is not an unlimited transport setting or production
capacity recommendation. See [Microsoft's SignalR guidance](https://learn.microsoft.com/en-us/aspnet/core/blazor/fundamentals/signalr?view=aspnetcore-10.0).
