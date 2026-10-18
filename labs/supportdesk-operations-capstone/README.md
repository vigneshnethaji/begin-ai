# SupportDesk operations capstone

A standalone .NET 10 Blazor Interactive Server teaching project. A real C# state machine evaluates authored synthetic measurements and performs a local in-memory release simulation. It does not call models, Azure, identity providers, billing systems or databases. The DEMO identity selector is a server-owned teaching policy, not authentication. No NuGet dependencies, external fonts, CDN, secrets or cloud setup are required.

## Run and verify

Install the .NET 10 SDK with its ASP.NET Core shared framework. Extract all source folders and run beside `SupportDesk.Operations.csproj`:

```powershell
dotnet --version
dotnet restore --configfile NuGet.Config
dotnet build --no-restore
dotnet run --no-build
```

Expected: SDK major version 10 or a compatible newer SDK, successful restore/build and a listener at `http://127.0.0.1:5119`. Open that URL and wait for **Interactive ready**. Until the interactive circuit is ready all actions are disabled. Stop with Ctrl+C before rebuilding on Windows. `NuGet.Config` clears all remote sources; the required targeting packs must already be installed.

For an alternate loopback port:

```powershell
$env:OPERATIONS_LAB_PORT = '5120'
dotnet run --no-build
```

Expected URL: `http://127.0.0.1:5120`. Only decimal digit strings from 1024 through 65535 are accepted. Blank, signed, whitespace-padded, URL-shaped and out-of-range values fail with exit code 1. An unset value defaults to 5119. This host uses an empty builder and deliberately does not load normal application configuration or user secrets. The one optional environment read selects the port.

Run the executable acceptance checks after stopping the host:

```powershell
dotnet run -- --verify
```

Expected: `PASS operations verification: ... checks; no host created.` and exit code 0. The count is printed by the verifier. It invokes the production `ReleaseSession`, `LabPort` and estimator directly, without mocks. It exits before host construction and even before the optional port read. It opens no listener and needs no browser. Unrecognized command arguments fail with exit code 1.

## Default candidate and policy

Active release starts as known healthy V1. Candidate revision is v2. Defaults: quality 95%, 100 samples, 0 safety failures, 1000 input tokens, 500 output tokens, 500 ms synthetic latency, budget 0.003 illustrative units, DEMO release policy and healthy provider fixture.

Illustrative input price is **1 unit per million** and output price **3 units per million**:

`1000 / 1000000 × 1 + 500 / 1000000 × 3 = 0.0025 units`.

These are authored counts and illustrative unit prices, not current Azure quotes, actual tokenization or provider billing. C# uses decimal cost arithmetic. Valid inputs are bounded before estimation; the public estimator rejects invalid counts.

Gates all have to pass:

- Revision is `v2` through `v999`, lowercase v plus a canonical positive integer (not v1, v02, blank or arbitrary text).
- Quality is finite and between 0 and 100, and must be at least 90.
- Samples are 1–10000, with at least 20 required to pass.
- Safety failures are 0–samples; only zero passes.
- Input and output tokens are each whole numbers from 1–100000.
- Budget is greater than zero and at most 1 illustrative unit; estimate must fit.
- Synthetic latency is 1–60000 ms; at most 2000 ms passes.
- Identity must match the server-owned `demo-release` policy. `demo-reader` is recognized but cannot pass release authorization. Unknown policy names block.
- Provider fixture must be `healthy`. Known `failed` and `unknown` do not pass. No provider call occurs.

Fields use smaller server-side limits than the 128 KiB interactive transport limit. Revision text is capped at 4 characters, numeric text at 16, identity/provider text at 24. Input events invalidate approval immediately while a text field is still focused; selectors invalidate on change. Invalid UI text invalidates approval and blocks checking until corrected. Oversized input is reduced for display, but its field retains an error until that same field is explicitly corrected; an unrelated edit cannot accept the truncated value. HTML input limits are only usability hints; service validation independently enforces bounds.

## Exact acceptance scenarios

Reload starts a fresh independent session with V1 and zero effects. State is not durable. Reloading is not a production recovery procedure.

| Scenario | Actions | Exact expected result |
|---|---|---|
| Healthy | Check gates → Approve exact snapshot → Promote locally → Healthy / Run smoke | Ready → Approved → AwaitingSmoke → Complete; active V2; effects 1 |
| Approval alone | Check → Approve | Approved; active V1; effects 0 |
| Stale review | Check → Approve → change quality to 96 and leave field | Idle; gates cleared; approval false; effects 0; Promote disabled |
| Safety | Set safety failures 1 → Check | Blocked; V1; effects 0 |
| Invalid evidence | Set samples 0 → Check | Blocked; invalid sample gate; approval disabled |
| Cost | Set budget 0.0024 → Check | Blocked; estimated 0.0025 exceeds allowance |
| Latency | Set latency 2501 → Check | Blocked; synthetic latency exceeds 2000 ms |
| Identity | Select DEMO reader → Check | Blocked; no Azure authentication is involved |
| Provider | Choose Failed or Unknown → Check | Blocked; no real provider is contacted |
| Denial | Check → Approve → Deny review | Denied; active V1; effects 0; Promote disabled |
| Cancellation | Check → Cancel release | Cancelled; active V1; effects 0 |
| Bad smoke | Check → Approve → Promote → Bad health / Run smoke | RolledBack; active V1; effects 1 |
| Unknown | Check → Approve → Promote → Unknown response / Run smoke | Unknown; active V2 (local promotion happened, health unconfirmed); effects 1 |
| Replay | Replay result after Complete, RolledBack or Unknown | Same status, revision and effect count; no duplicate promotion |

Candidate edits invalidate gates and approval. Approval binds both the immutable candidate record and the exact numbered check snapshot. Rechecking clears approval and requires a new review. There is **no automatic short approval expiry**; synthetic latency is a candidate measurement, not a human review timer. Denial and cancellation are final for that candidate until an explicit candidate edit starts a new pre-effect attempt. After any promotion, candidate editing is frozen in that session. Repeated Promote is a no-op. Unknown cannot become Complete from Replay, Approve, Check or another Promote. Bad smoke restores the specifically known V1; unknown smoke has no evidence to justify either success or confirmed rollback.

## Safe observations

The screen exposes status, active revision, effect count, gates, check number and a bounded audit. Audit keeps only the latest 80 entries. Each entry contains a generated short ID, allowlisted operation and allowlisted outcome. It never includes full candidate payloads, prompts, credentials or attachment content.

`ReleaseTelemetry` uses the BCL `ActivitySource` and `Meter`. It emits allowlisted operation and outcome tags only. `StartActivity` can return null without a listener. There is no external exporter or Azure monitoring setup. The visible audit is a separate local observation, not proof that any monitoring service collected telemetry.

## Explanatory Azure release guide (no execution steps)

For a real release design, identify a supported App Service plan/slot topology, candidate artifact, trusted reviewer, resource permissions, readiness path and rollback target. A slot warm-up response does not prove the full application dependency path works. Define a smoke check for a small critical workflow after the swap, and establish evidence and escalation for unknown outcomes before enabling automated releases.

An app and its deployment slot have distinct managed identity settings. Managed identities do not swap with content. Validate the resource authorization of the identity used by the target slot, as well as slot-specific settings. A staging resource call succeeding under its identity does not prove the production identity will work. The DEMO selector cannot establish either fact.

This source contains no resource creation, deployment, login, credential inspection or provisioning commands. Its V1/V2 transitions are not Azure APIs. A production release orchestrator additionally needs durable receipts, concurrency controls, authenticated authorization, resource-specific health evidence, recovery and operational ownership, none of which this in-memory exercise claims to implement.

Official references checked for this unit:

- [App Service staging slots and swap behavior](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots)
- [App Service managed identities and slot identity](https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity)
- [Test and evaluate AI workloads](https://learn.microsoft.com/en-us/azure/well-architected/ai/test)
- [.NET tracing instrumentation](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing-instrumentation-walkthroughs)
- [.NET metrics instrumentation](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/metrics-instrumentation)
- [Safe deployment practices](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/safe-deployments)

## How this connects the 11 learning units

Earlier separate SupportDesk projects teach rules, measured classification, reviewed drafting, scoped retrieval, bounded workflows and attachment limits. This project evaluates authored release measurements; it does not host or deploy all those prior apps. Practice their acceptance questions independently, then use the release drills to explain what evidence is still required. All 11 learning units are available. Finish this capstone and review academy progress. The academy completion checkbox is self-reported and awards no certification.

## Developer headless browser checks

From the academy repository root, with this app listening locally:

```powershell
node --test tests/operations.test.cjs
node tests/operations-exercises.cjs
node tests/operations-app-browser.cjs http://127.0.0.1:5119
```

The browser script also accepts an alternate URL, such as `http://127.0.0.1:5120`, for independently extracted ZIP testing. It launches its own headless Playwright contexts and checks interactive readiness, invalid bounds, stale approval, denial, cancellation, rollback, Unknown, replay, visible focus, 44px targets and 320/390/768/1440 widths. Playwright is a developer check dependency, not a .NET app requirement. These three repository test scripts are not included inside the standalone source lab ZIP; the C# verifier is included.

## Troubleshooting and limits

- Missing SDK/targeting pack: install a .NET 10 compatible SDK before offline restore.
- Port busy: stop the owning application or set `OPERATIONS_LAB_PORT` to an available allowed loopback port.
- Static screen: wait for Interactive ready; check the local connection and framework script. Do not infer success from server-rendered HTML alone.
- Blocked: inspect all gate rows, correct invalid text and then run Check gates again.
- Approval cleared: editing any candidate field deliberately invalidates the reviewed snapshot.
- Unknown: inspect the unresolved state; Replay cannot supply missing evidence. This app has no remote reconciliation mechanism.
- Build locked: stop the local host with Ctrl+C before building again on Windows.
- New tab/restart loses state: release, audit, keys and approvals are memory-only. Data protection uses an ephemeral provider plus a separate in-memory XML key repository with no disk fallback.
- Single learner session: this lab provides no multiuser authentication, durable orchestration, distributed exactly-once guarantee, billing, real deployment or production certification.
