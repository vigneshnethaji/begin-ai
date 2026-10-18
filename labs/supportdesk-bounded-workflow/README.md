# SupportDesk bounded workflow — Unit 9

A runnable .NET 10 Blazor Interactive Server learning app using only the ASP.NET Core shared framework. All examples are synthetic. This is deterministic C# orchestration: keyword classification, allowlisted local help, authored reply, review and a LOCAL preview. Nothing is sent. No model, trained embeddings, provider credentials, external network client, database, Microsoft Agent Framework SDK or MCP connection is involved.

## Run

Install the .NET 10 SDK. Extract the full project, keeping its folders. Open a terminal beside `SupportDesk.BoundedWorkflow.csproj`:

```powershell
dotnet --version
dotnet run
```

Open [http://localhost:5115](http://localhost:5115). Wait for **Interactive ready**. Stop the host with Ctrl+C. `NuGet.Config` clears all package sources; there are no package dependencies. An installed .NET 10 shared framework and SDK are required.

To use another port in the current PowerShell terminal:

```powershell
$env:WORKFLOW_LAB_PORT = '5116'
dotnet run
Remove-Item Env:WORKFLOW_LAB_PORT
```

The host always binds `127.0.0.1`. The optional port must contain decimal digits only, in 1024–65535; URLs, whitespace, signs and empty values are rejected. Other environment-based host URLs and appsettings are not loaded by the empty host builder. Browser access to the local host is required for Blazor; no external service is called.

## Verify without starting a listener

```powershell
dotnet run -- --verify
```

The command uses the same production `Workflow` service as the UI. It runs before host creation or port inspection, prints each PASS/FAIL and returns exit 0 only if all checks pass. Stop a running source host before rebuilding on Windows to avoid assembly locks.

The repository also contains focused academy and real browser checks (run from the academy root, not this extracted project):

```powershell
node --test tests/workflow.test.cjs
node tests/workflow-exercises.cjs
node tests/workflow-app-browser.cjs http://127.0.0.1:5115
```

The last command accepts any supplied local lab URL, including a separately extracted ZIP on port 5116. It does not spawn a server. Browser checks use Playwright, with the academy's documented bundled-runtime fallback when a normal package import is unavailable.

## Follow the normal path

1. Keep the default fictional billing request, normal fixture, five steps, one lookup and 10000 ms. Run to review.
2. Expect `AwaitingApproval`, steps 3, calls 1 and effects 0. The authored billing draft explains where to find the fictional invoice.
3. Approve the exact snapshot. Effects remain zero. Create local preview to reach `Complete`, steps 4 and effects 1.
4. Replay the exact request. Effects remain one. The result is a local receipt, not a sent message.

Use a distinct request text when starting another normal example: exact completed snapshots deliberately restore an existing receipt. Effects count all previews in this session, including earlier requests. To inspect a new example's effect count, compare before and after; a stopped run adds zero.

## Boundary and recovery scenarios

| Action | Expected observable result |
| --- | --- |
| Run then deny | `Denied`; no new effect |
| Approve then edit text/fixture/budgets | `Idle`, approval cleared, visible draft cleared |
| Request `Please help`, or `billing and login` | `NeedsInformation`; clarifying question; no lookup |
| Normal fixture with two steps | `BudgetExceeded` before draft |
| Normal fixture with three steps, then approve/preview | Review reached; preview stops `BudgetExceeded`; no effect |
| Loop fixture with three steps | `BudgetExceeded`, steps exactly 3, calls 0 |
| Zero maximum lookups | Lookup blocked; calls 0; `BudgetExceeded` |
| Slow fixture, Cancel while running | `Cancelled`; no effect and no success |
| Slow fixture, wall-clock budget 60 ms | `BudgetExceeded`; no effect |
| Unknown capability fixture | `Denied`; send_email never runs |
| Failed before preview, then Recover | `Failed` has no effect; returns to review with fresh approval required |
| Approve recovered failed run within original deadline | `Complete` at step 5; one preview effect |
| Acknowledgement lost after preview | `Unknown`; preview receipt exists, but success is not claimed |
| Recover/Replay an Unknown request | Still `Unknown`; no additional effect |
| Reconcile an Unknown request | Read the stored local receipt; `Complete`; no additional effect |
| Change away from a completed snapshot then return and Run/Replay | Same receipt; no additional effect |
| Inspect lookup_help / help://billing / triage_prompt | Tool definition / resource context / prompt template, no execution |
| Inspect send_email | Denied; no execution |

Each operation checks its budget before more work begins. The wall-clock deadline starts at Run and includes waiting for review; it is not an active-CPU timer. The default 10 seconds is deliberately small, so prepare the review steps before running or choose an allowance up to 30000 ms. Recovery retains the original counters and deadline. A budget stop cannot silently restart under the same snapshot; change the request deliberately to run a different example.

## Limits and honesty

- The classifier checks billing/invoice or login/password keywords. Missing or conflicting topics ask a question and halt. This is not semantic understanding.
- Help and replies are authored text. They are not generated by a language model. Help lookup is a local C# function; metadata inspection never invokes it.
- Approval is a teaching gate, not authentication or a real identity system. It binds the exact text, fixture, step/call/time allowances and current reviewed draft.
- The only effect is incrementing a session preview counter and storing an in-memory receipt. Unknown simulates a lost acknowledgement after that local receipt. Reconcile checks evidence the fixture actually controls. Do not infer that a button can resolve uncertainty in a real external system.
- At most 16 distinct effect receipts and 80 trace entries are retained per session. Existing receipts are not evicted to make room for duplicate effects; a new request is denied when the receipt limit is full. All checkpoints, receipts, approvals, traces and data protection keys are memory-only. Fresh sessions/process restarts lose them. This is not durable exactly-once execution.
- Request text is bounded at 2000 UTF-16 characters in both UI and service, steps 1–12, lookup allowance 0–3 and wall-clock allowance 20–30000 ms. The 128 KiB SignalR envelope is a separate transport bound, not permission to accept arbitrarily large business input.
- The host uses `CreateEmptyBuilder`, explicit loopback binding, `UseStaticWebAssets`, `MapStaticAssets` and an ephemeral data protection provider with a separate in-memory XML key repository. A framework warning about the absence of a key encryptor may appear, but this configured repository does not write to disk.
- Framework snippets in academy lessons are illustrative C# or clearly marked architecture pseudocode. No SDK version/API compatibility is claimed. Unit 10 remains planned.

## Primary references

- [Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/): agents, workflow execution paths, integrations and session concepts.
- [Blazor server-side state management](https://learn.microsoft.com/en-us/aspnet/core/blazor/state-management/server?view=aspnetcore-10.0): circuit state and explicitly designed persistence.
- [Cooperative .NET cancellation](https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads).
- [Retry pattern and idempotency](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry).
- MCP official [tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools), [resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources), [prompt templates in the 2025-06-18 specification](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts), [HTTP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) and [transports](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports). These describe protocol responsibilities; the inspector is authored local metadata.

References checked 2026-10-18; consult the applicable protocol/SDK documentation before implementing a real integration.

## File manifest

| File | Purpose |
| --- | --- |
| `SupportDesk.BoundedWorkflow.csproj` | .NET 10 web project; shared framework only |
| `NuGet.Config` | Clears package sources |
| `Program.cs` | Independent verification branch and loopback Blazor host |
| `Components/App.razor` | HTML shell and local Blazor script |
| `Components/Routes.razor` | Page routing |
| `Components/_Imports.razor` | Razor imports |
| `Components/Pages/Home.razor` | Interactive controls, review, recovery and metadata inspector |
| `Services/Workflow.cs` | Actual bounded C# state machine and receipt/approval policies |
| `Services/LabPort.cs` | Strict optional port validation |
| `Services/SessionDataProtection.cs` | Ephemeral provider and separate memory-only XML key repository |
| `Verification/Verify.cs` | Executable production-service behavior checks |
| `wwwroot/app.css` | Material Blue, visible focus, 44px controls and 320px layout |
| `README.md` | Run, verification, scenario and limitation guide |
