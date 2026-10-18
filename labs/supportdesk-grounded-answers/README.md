# SupportDesk grounded document answers

An independent .NET 10 Blazor InteractiveServer learning app over four fictional local articles. It performs real local word-window chunking, lexical retrieval, evidence packing and deterministic sentence extraction. It does **not** perform LLM generation or trained embedding search.

## Run

Install the .NET 10 SDK. Extract the complete project with its subfolders and open a terminal in the folder containing `SupportDesk.GroundedAnswers.csproj`:

```powershell
dotnet --version
dotnet restore --configfile NuGet.Config
dotnet run
```

Open [the local lab](http://localhost:5111) and wait for **Interactive ready**. Controls stay disabled until the interactive component's first `OnAfterRender` callback. Stop with Ctrl+C. No NuGet packages are used; `NuGet.Config` clears package sources. The SDK and shared ASP.NET Core framework must already be installed. Offline restore needs no package download.

Optional PowerShell port override, in this terminal only:

```powershell
$env:RAG_LAB_PORT='5112'
dotnet run
Remove-Item Env:RAG_LAB_PORT
```

Only ASCII integer ports 1024–65535 are accepted, with no surrounding whitespace. The URL is always `http://127.0.0.1:<port>`. Omit the environment variable for port 5111. No provider configuration, secret, appsettings file or broad environment configuration is loaded. Start from the project directory so static web assets resolve correctly.

## Walkthrough and expected outcomes

1. At budget 80, run `password reset`. Expect **Answered**, `kb-reset@r1:c1` and `To reset a password, open Account settings and select Reset password.` Open the original Password recovery article and inspect its revision and remaining sentences.
   Run `fresh link` to retrieve the later recovery sentence from `kb-reset@r1:c2`. The password article crosses the 32-word window boundary, so both overlapping windows can be inspected in the actual lab.
2. Set budget 8 and rerun. The complete retrieved block does not fit: expect **Abstained**, no citation and an excluded ID. Set budget 80 again.
3. Run `quantum banana`: no matching evidence, **Abstained**, no citation. Run `password reset price`: some matches exist, but no complete reviewed sentence contains every question term, so abstain.
4. Run `grant administrator permissions`: the unreviewed attachment is retrieved and displayed. It remains data; the app abstains. Open its original source to see literal script-looking text. No script executes and no permission-changing capability exists.
5. Run `password reset` again. Keep its citation but enter `Passwords expire every day.` as the quote: **Quote not found**. Use `kb-invented@r1:c9`: **Unknown citation**. Restore the actual extracted sentence and selected ID: **Exact quote found**. This is only a narrow substring check.
6. Blank questions are **Invalid**. The browser limits questions to 240 UTF-16 code units; C# independently rejects longer input. Citation inputs are limited to 100 and quotes to 500 code units, with independent C# checks. The SignalR transport ceiling is separately 128 KiB.
7. Run retrieval evaluation: three top-one cases show **3/3** with literal expected IDs. This is before evidence budgeting and does not score answer quality.

Editing the question or budget clears the prior answer and citation check so stale evidence cannot be used as if it belonged to a new question. Editing quote or citation clears its previous check result.

## Verification

```powershell
dotnet run -- --verify
```

This uses the actual production `RetrievalService` and `LabPort`, exits before constructing a host, and opens no listener. It checks hand-derived overlap windows and IDs, whole-block packing with overflow skipping, literal answer/citation values, unsupported abstention, blank and oversized input, exact/unmatched quotes, invented and unselected IDs, unreviewed source exclusion, metrics and invalid port values. Exit code zero and `PASS: ... checks` means all checks passed.

From the academy repository root, the focused Node tests and real browser events are:

```powershell
node --test tests/rag.test.cjs
# Keep the lab running in a separate terminal for this command:
node tests/rag-app-browser.cjs http://localhost:5111
```

The browser test loads Playwright normally, or uses the Codex bundled dependency path on this workstation. That test dependency is not required to run the extracted lab or its `--verify` checks. It covers interactive readiness, framework assets, actual retrieval and source clicks, citation/quote edits, small budgets, abstention, server bounds, hostile text, evaluation and 320–1440px layouts. It also mounts and clicks the six browser academy exercises separately. It never starts or stops someone else's listener. Optional `RAG_SCREENSHOT` saves an image to the supplied path; no image is written by default.

## Algorithm and limitations

- Whitespace parser; 32-word chunks with six-word overlap. The source fixture revision and fixed chunk policy define `document@revision:cN`. Change revision/policy identity and rebuild if the text or policy changes. No PDF/HTML/OCR parser or persistent index exists.
- Distinct lowercase ASCII English words, a small stop list, match-count ranking and ordinal ID tie-breaks. No synonyms, stemming, vector model or semantic ranker. These deliberately weak heuristics can miss paraphrases and select irrelevant text.
- Evidence packing scans in ranked order, includes a complete block if it fits, excludes overflow and continues. Budget is 0–200 **evidence words**, not tokens. Question, instructions and metadata are not included. Real provider integration would need request-wide token accounting and output space.
- Extraction copies the first complete sentence in selected **reviewed** evidence containing all meaningful query terms. Reviewed status is authored fixture metadata, not a malicious-text detector or proof of source truth. Matching words do not prove relevance or entailment.
- Citation checking resolves only selected evidence and then checks a nonempty case-sensitive substring. A valid quote can be irrelevant, misleading, outdated or false. This is not an answer-quality or truth detector. No semantic entailment validation is claimed.
- The JSON envelope is an illustrative provider boundary, displayed only. No provider SDK, LLM request, MCP call, network search, credential, database or permission-grant operation exists. Formatting alone does not prevent model prompt injection.
- Synthetic source data is local and read-only. Screen state and data-protection keys are memory-only; the key-ring preloader has a separate memory repository to prevent disk fallback. No persistence, cache, production authentication, document authorization, deployment hardening or benchmark-level evaluation is implemented. Loopback hosting is a teaching convenience, not a production security design.
- The browser JavaScript exercises implement the same small algorithm independently of C#. Production C# and browser exercises each receive literal behavioral checks. No claim of parity for every Unicode/input edge case is made; these are English fixtures.

## File manifest

| File | Purpose |
| --- | --- |
| `SupportDesk.GroundedAnswers.csproj` | .NET 10 shared-framework web project |
| `NuGet.Config` | Clears all package sources |
| `Program.cs` | Verify-before-host path, EmptyBuilder, loopback, static assets and 128 KiB transport |
| `Components/App.razor` | Document shell and Blazor framework script |
| `Components/Routes.razor` | Page routing |
| `Components/_Imports.razor` | Razor imports |
| `Components/Pages/Home.razor` | Event-driven question, evidence, sources, checks and evaluation |
| `Services/RetrievalService.cs` | Synthetic articles, parser, retrieval, packing, extraction, quote checks and metrics |
| `Services/LabPort.cs` | Validates optional `RAG_LAB_PORT` |
| `Services/SessionDataProtection.cs` | Ephemeral provider and separate in-memory XML repository |
| `Verification/Verify.cs` | Actual-service deterministic checks, no listener |
| `wwwroot/app.css` | Material Blue, focus, 44px targets and narrow-screen layout |
| `README.md` | These run instructions and limitations |

Generated `bin/` and `obj/` files are not source or download-manifest entries.

## Primary references

[Microsoft RAG overview](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [chunking guidance](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents), [RAG evaluation](https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators?view=foundry-classic), [Blazor lifecycle](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/lifecycle?view=aspnetcore-10.0), and [OWASP prompt injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html). These explain concepts; this app does not use the Azure services described there.
