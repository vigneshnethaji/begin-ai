# SupportDesk: ticket lookup

Unit 5 learning lab: tools and safe actions. Independent .NET 10 Blazor Interactive Server app, using only the installed shared framework. All identities, tickets and responses are fictional and local.

## Run and verify

From this directory:

```powershell
dotnet run
# http://127.0.0.1:5107

dotnet run -- --verify
```

Or from the repository root:

```powershell
dotnet run --project labs/supportdesk-ticket-lookup
dotnet run --project labs/supportdesk-ticket-lookup -- --verify
```

Optional `LOOKUP_LAB_PORT` accepts only an integer 1024–65535. Unset defaults to 5107; empty, whitespace, signs, URLs and out-of-range values fail startup. Binding always uses `127.0.0.1`. Stop the app with Ctrl+C. Verification exits before host creation and never starts a listener.

Startup uses `WebApplication.CreateEmptyBuilder`, `UseStaticWebAssets`, `MapStaticAssets`, and the local Blazor circuit. It does not load appsettings, user secrets or provider configuration. The only application environment setting read is `LOOKUP_LAB_PORT`. No model, provider, outbound network calls, credentials, real customer data, database, persistence, telemetry integration, or actual write actions are implemented. Browser-to-loopback HTTP/WebSocket traffic is necessary for Interactive Server. NuGet sources are cleared; no package dependencies are needed.

## Contract and trust boundary

`Services/SessionDataProtection.cs` keeps ASP.NET data protection memory-only: `UseEphemeralDataProtectionProvider` protects antiforgery payloads, and an explicit `KeyManagementOptions.XmlRepository` supplies a thread-safe in-memory XML repository for the default hosted key-ring preload. Both stored and returned XML elements are defensively cloned. The key manager cannot fall back to the user-profile key ring, so this configuration does not read or write key-ring files. Keys disappear when the runtime ends.

Normalized local proposal, with exact JSON property names:

```json
{"tool":"lookup_ticket","arguments":{"ticketId":"DEMO-104"}}
```

The proposal contains only `tool` and `arguments`; `arguments` contains only `ticketId`. Only `lookup_ticket` is allowlisted. Ticket IDs must match the ASCII format `DEMO-[0-9]{3}` exactly. The parser rejects unknown/missing/duplicate keys (including escaped duplicates), nulls, wrong types, arrays, comments, trailing commas, multiple documents, malformed Unicode, input over 4000 .NET characters, and JSON depth over 6. Whitespace and property order may vary; canonical output uses the shape above. Typed records are `ToolProposal(string Tool, LookupArguments Arguments)` and `LookupArguments(string TicketId)`.

No model-supplied caller, tenant, user, permission or approved flag is accepted. The C# service resolves the demo identity selector to server-owned `CallerScope(string Identity, string Team, bool CanLookup)` values. These are teaching simulations, **not real authentication or production authorization**.

| Selector value | Server-owned demo scope | Available fixture |
| --- | --- | --- |
| `billing` | teamA, lookup allowed | DEMO-104, duplicate charge |
| `technical` | teamB, lookup allowed | DEMO-205, export issue |
| `no-access` | teamA, lookup denied | none |

Unknown identities are denied. Missing ticket IDs and tickets outside the current team return identical Unavailable results and perform no invocation; the result reveals no other-team existence. The authorization routing metadata is fixed local fixture metadata. The counter measures actual local function reads, not metadata checks.

## Server API

There is no public JSON execution endpoint, provider tool interface, or direct database access. The Razor component calls one circuit-scoped `LookupExecutor`:

```csharp
ReviewResult Validate(Guid requestId, string raw, string identity, LookupScenario scenario);
bool Approve(Guid requestId, string raw, string identity, LookupScenario scenario);
LookupResult Invoke(Guid requestId, string raw, string identity, LookupScenario scenario);
void InvalidateReview();
int InvocationCount { get; }
int RecordCount { get; }
IReadOnlyList<AuditEntry> Audit { get; }
```

1. **Validate:** strict parsing and deterministic permission/team authorization. Produces canonical review data; no function invocation. Any validation attempt clears earlier approval.
2. **Approve:** explicit staff action. Server compares the current reviewed snapshot with canonical proposal + request ID + resolved demo identity + scenario, and rechecks authorization. A checkbox or forged JSON field cannot authorize a request.
3. **Invoke:** reparses and rechecks permission/team authorization on every call, including replay, then checks request conflicts and the server-held approval. Only then can it read a fixture or return a cached outcome. Changed inputs presented directly to the service cannot reuse an earlier approval. `InvalidateReview` explicitly revokes review/approval on all UI input changes, including change-and-revert sequences.
4. **Replay:** invokes with the same exact request ID, proposal, identity and scenario. It returns the saved outcome with `Replay = true`, without another read. It still requires authorization and a matching active approval.

`LookupScenario` values are `Normal`, `Transient`, `Unknown` (UI values `normal`, `transient`, `unknown`). Result outcomes are `Invalid`, `Denied`, `Unavailable`, `ApprovalRequired`, `Conflict`, `Success`, `Unknown`, `CapacityReached`; `Allowed` is the successful validation outcome. `LookupResult` has `Outcome`, a fixed safe `Message`, optional `Ticket`, `Attempts`, and `Replay`. `TicketView` exposes only `TicketId`, `Subject`, `Status`, and a fictional, redacted `Summary`. No contact, billing, payment or customer fields are present. Razor escapes all displayed content; no raw HTML rendering is used.

## Duplicate requests and failure scenarios

The scoped executor serializes authorization, approval checks, duplicate detection, the local read and cache insertion under one lock. Concurrent duplicates produce one local read within this running session. A request ID is reserved to its first successful invocation's canonical proposal, identity and scenario; reusing it for different inputs is rejected or conflicts. The identity is part of the binding, so results cannot cross demo scopes.

- **Normal:** one attempt, one read.
- **Transient:** explicitly simulated failure on attempt 1 before any read; one retry only, with success on attempt 2 and one total read. No generic retry policy is applied.
- **Unknown:** explicitly simulated response loss after one read. Returns Unknown with no ticket payload; no automatic retry. All same-request replays preserve Unknown and never read again. This is a read-only cautionary example for writes: an ambiguous write would need reconciliation. No write action is implemented here.

The completed-request cache holds at most 128 records. It refuses new requests at capacity instead of evicting earlier records, so an Unknown record cannot be evicted and inadvertently executed again in the same session. Existing records can still replay after validation and approval. Open a new session to start a fresh demo after reaching capacity.

The invocation counter accumulates for the entire scoped executor, including identity/scenario changes; it does not reset with the editor. Validation, approval, denials, conflicts and cached replays add no reads.

## Approval, cache and audit are temporary

Approval, cache and audit live only in the scoped in-memory session. They vanish when the circuit/session is disposed or the app restarts. A disconnected circuit may be retained briefly by Blazor; this is not durable storage. A new session has no approval or deduplication history. **This lab makes no persisted or durable exactly-once guarantee.** Read-only fixtures mean repeated reads across new sessions do not mutate anything.

Every invocation decision adds an `AuditEntry` with only request ID, validated tool and ticket ID, resolved demo caller, outcome, attempts, replay and Unknown flags. Invalid proposals use `-` identifiers and unknown identities use `unrecognized`; raw JSON, arbitrary caller text and ticket content are never logged. Audit is a session-scoped FIFO bounded to the latest 128 decisions. Replays retain the original execution's attempt count and carry a separate replay flag.

## UI behavior and integration selectors

Starts with the valid DEMO-104 proposal, `billing`, `normal`, and counter 0. Controls wait for the interactive circuit (`interactiveReady`). Every proposal keystroke, identity change or scenario change clears review, approval and result, revokes the server approval, and assigns a fresh request ID. Denied execution remains disabled; the service also enforces the boundary if called directly.

| ID | Element / purpose |
| --- | --- |
| `lookup-proposal` | textarea, maxlength 4000 |
| `lookup-identity` | select: billing / technical / no-access |
| `lookup-scenario` | select: normal / transient / unknown |
| `validate-tool` | validate and authorize without reading |
| `approve-tool` | bind the server-held approval snapshot |
| `execute-tool` | invoke once after approval |
| `replay-tool` | replay the exact current request |
| `lookup-status` | live status |
| `lookup-result` | named result region |
| `lookup-audit` | named session audit region |
| `invocation-count` | numeric cumulative session read count |

The transport limit is independently bounded at 128 KiB to allow the event envelope and multibyte text; it does not expand the strict 4000-character parser limit. Dark Material Blue uses exactly `#121212`, `#1e1e1e`, `#272727`, `#eee`, `#b7bdc6`, primary `#1976d2` with white text, links `#90caf9`, highlight `#42a5f5`. System Segoe UI and Cascadia Code/Consolas need no font downloads. Controls have at least 44px targets, visible focus and a single-column mobile layout down to 320px.

## Verification

`Verification/Verify.cs` runs real production parsing and execution, with literal expected results and no mocks. It covers strict input parsing, Unicode, length/depth constraints, exact canonical output, loopback port validation, no reads during validation/approval, direct unapproved invocation, denied and cross-team scope checks, indistinguishable missing IDs, technical team access, approval invalidation, binding to request/identity/scenario/proposal, invoke and cached authorization, idempotent replay, changed-input conflicts, concurrent duplicates, bounded retry, terminal Unknown replay, record capacity, audit FIFO and independent sessions.

Build and verification create only ordinary `bin/` and `obj/` output underneath this directory.

Data-protection regression checks use the same registration helper as startup, instrument the real memory repository, and start/stop the actual registered `IHostedService` instances through DI without starting a web server. They assert preload reads and key creation in memory, successful protection round-trip, independent runtime keys, defensive XML cloning and concurrent repository access. A guard checks for an explicit repository before any hosted-service/key-manager resolution, so a regression fails without opening personal key files.

## Complete source manifest

```text
labs/supportdesk-ticket-lookup/
  SupportDesk.TicketLookup.csproj
  NuGet.Config
  Program.cs
  README.md
  IMPLEMENTATION.md
  Components/
    _Imports.razor
    App.razor
    Routes.razor
    Pages/Home.razor
  Services/
    LabPort.cs
    ProposalParser.cs
    LookupExecutor.cs
    SessionDataProtection.cs
  Verification/
    Verify.cs
  wwwroot/
    app.css
```

No files outside this lab are part of this implementation. No Git operations are needed or performed.
