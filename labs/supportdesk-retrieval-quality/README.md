# SupportDesk retrieval quality

An independent .NET 10 Blazor InteractiveServer learning app. All documents, identities and labels are synthetic. “Production retrieval” describes the concepts being taught; this is not a production-ready system.

## Run

Install the .NET 10 SDK. Extract the complete lab ZIP, preserving subfolders, and open a terminal in the folder containing `SupportDesk.RetrievalQuality.csproj`.

```powershell
dotnet --version
dotnet run
```

Open [http://127.0.0.1:5113](http://127.0.0.1:5113). Wait for Ready before using controls. Stop with Ctrl+C. No package dependencies, providers, keys, configuration files, databases or external network calls are required. `NuGet.Config` clears all package sources; the installed .NET shared framework supplies the application dependencies.

If the default port is busy, set this one supported environment variable in the same terminal:

```powershell
$env:RETRIEVAL_LAB_PORT = '5114'
dotnet run
# Open http://127.0.0.1:5114
# After stopping, remove the optional variable:
Remove-Item Env:RETRIEVAL_LAB_PORT
```

Only ASCII digits for ports 1024–65535 are accepted. The listener binds to 127.0.0.1. Other host/configuration environment variables are not loaded by the empty host builder. Run from the project folder so source static assets resolve correctly.

## Verification without a server

```powershell
dotnet run -- --verify
```

The verification branch runs before host construction and opens no listener. It uses the same `RetrievalEngine`, `RetrievalMetrics` and `LabPort` code as the app. It checks literal expected IDs/scores, whitespace-normalized cache keys in both request orders, tenant and document ACL filtering before top-k, replay authorization, revocation, held-response rechecks, source/index versions, tombstones, tiny evaluation metrics, injection permission invariants, safe traces, input bounds and loopback port validation. A failing assertion returns exit code 1.

The academy source checkout also supplies focused tests:

```powershell
node --test tests/retrieval.test.cjs
node tests/retrieval-exercises.cjs
node tests/retrieval-app-browser.cjs http://127.0.0.1:5113
```

Run these from the academy root. The browser tests require Playwright; they try the normal module first, then the documented Codex bundled runtime path. The app browser test accepts a loopback URL, so an independently extracted ZIP can run on 5114. It starts no server itself and closes its browser on success or failure. Screenshots are temporary build artifacts under `bin/verification`, excluded from the source download manifest.

## Work through the lab

1. Keep Team A reader, query `password reset`, blank target and k=1. Baseline returns A-102 historical notes. Tuned returns A-101 reset guide. Tuned means body token counts plus four times title token counts; this is a local toy formula, not a learned semantic reranker. It also admits title-only matches, so this compares candidate retrieval plus ranking rather than a pure second-stage reranker. With query `password` and k=3, baseline returns only A-102 while tuned can add A-101. A true second-stage reranker cannot introduce a candidate absent from its input set.
2. Compare tiny evaluation. Hand labels are `password reset → A-101` and `export timeout → A-105`. Baseline mean Recall@1/MRR@1 is 0.50/0.50, tuned is 1.00/1.00. Evaluation uses an independent original fixture session, not your edited index. Two cases are not a benchmark.
3. Target A-101 and retrieve twice. The second read shows a cache hit after scope recheck. Edit source to five minutes: the held result clears, but a new read still returns the indexed ten-minute text. Publish, retrieve again and observe document version 2, index revision 2 and five minutes.
4. Tombstone A-101. Reads are blocked immediately, including cache replay. Publish to remove the stale index entry too. Source tombstones remain in memory for the exercise.
5. Reload for a fresh demo circuit. Read A-101, revoke access and retry. It is unavailable. Editing the query or target cannot restore the held excerpt. Inaccessible B-201, manager-only A-104 and unknown A-999 all produce `Document unavailable.` with no hidden ID, title, body or count in the result/trace.
6. As Team A reader, query `injection`, target A-103. The hostile instruction and script-like characters display literally. Query `password reset`, target B-201: the document remains unavailable. No detector runs and no guarantee about future model behavior is implied.
7. Inspect trace stages, local request ID, index revision and authorized returned IDs. Baseline ranking, stale indexing and cache replay have different evidence paths. Traces omit full documents, queries, secrets and hidden candidate counts.

All inputs and mutations clear the held result and trace. Reloading establishes a new original fixture session; state is scoped to a temporary Blazor circuit and may survive a short reconnect while that circuit is retained. Closing a tab is not a durable deletion guarantee. Nothing is persisted to a database or written as business data.

## Boundaries and limitations

- Demo caller scopes are selected for teaching and enforced by a server-owned fixture table. The selector is not authentication, a login, a real token or production tenant security.
- Both tenant and document ACL filters run before scoring and top-k. Cache keys include caller, access revision, index revision, normalized query, ranking, k and target. Every cache return rechecks current access; revocation and tombstones also clear the cache.
- Text normalization is shared by cache identity and scoring: case folding and whitespace tokenization are consistent within each implementation. Raw query length is limited to 160 UTF-16 code units; target length to 16; k to 1–3. Unknown rankings and caller IDs fail closed. SignalR transport is independently bounded to 128 KiB.
- Documents are local immutable records. Source edits and published snapshots are separate, with a deliberately explicit atomic publish operation. This is not a production ingestion pipeline, distributed cache, search service or transactional indexing guarantee.
- Ranking uses lexical counts and a fixed title weight. There are no embeddings, trained models, semantic SDKs, generated answers, provider calls or MCP network integration.
- Razor displays excerpts as text, without `MarkupString`. Encoding prevents HTML execution here; model prompt injection is a different problem. Untrusted document instructions never change server permission.
- Diagnostics contain at most eight stage names and the at most three authorized returned IDs. Cache holds at most 32 request entries, clearing at capacity. No trace archive or full query/payload log exists.
- Data protection uses both an ephemeral provider and a separate in-memory XML key repository, preventing the default key preload from selecting disk persistence. Restarting invalidates local protection material.
- Recall counts distinct retrieved relevant IDs. RR@k uses the first relevant position. MRR@k averages RR across the two cases. Missing labels are marked unlabelled and return zero by explicit local convention; they are not evidence of relevance failure.
- Excerpts are evidence, not generated answers. Production authentication, authorization integration, durable ingestion, monitoring, broader evaluation, accessibility audit and deployment hardening remain separate work.

## File manifest

| File | Responsibility |
| --- | --- |
| `SupportDesk.RetrievalQuality.csproj` | .NET 10 Web SDK project, no package references |
| `NuGet.Config` | Clear external package sources |
| `Program.cs` | Verification branch, empty builder, loopback host, interactive registration |
| `Components/App.razor` | HTML shell and Blazor script |
| `Components/Routes.razor` | Component routing |
| `Components/_Imports.razor` | Razor imports |
| `Components/Pages/Home.razor` | Interactive retrieval/evaluation/freshness workspace |
| `Services/RetrievalEngine.cs` | Synthetic source/index, scopes, toy ranker, cache, traces |
| `Services/RetrievalMetrics.cs` | Recall/RR metrics and evaluation DTOs |
| `Services/LabPort.cs` | Validated optional local port |
| `Services/SessionDataProtection.cs` | Ephemeral provider and independent memory repository |
| `Verification/Verify.cs` | Executable checks over production service code |
| `wwwroot/app.css` | Material Blue, responsive down to 320px |
| `README.md` | These instructions and limitations |

`bin` and `obj` contain generated build/test output and are not source downloads. Each academy lesson links official primary documentation; the local code intentionally implements only the described approximations.
