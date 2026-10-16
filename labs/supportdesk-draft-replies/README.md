# Lab 3: SupportDesk draft replies

An independent beginner lab using **.NET 10 Blazor InteractiveServer**. You do
not need to complete the rules or classifier labs first. No external packages,
database, model download or paid account is needed for the default experience.

Start with a fictional support ticket, generate a draft, watch its chunks arrive,
try Stop, then generate again and review the finished draft. This lab has **no
send operation**. A checked review box records only local UI state.

## Run the free sample

Prerequisite: the .NET 10 SDK. From the repository root:

```powershell
dotnet run --project labs/supportdesk-draft-replies
```

Open [http://localhost:5103](http://localhost:5103). Stop the server with Ctrl+C.
From this lab folder, `dotnet run` also works. Port 5103 is the default. If busy,
choose an alternate loopback port (integer 1024–65535) and use its matching URL:

```powershell
$env:DRAFT_REPLY_PORT = '5104'
dotnet run --project labs/supportdesk-draft-replies
# Open http://localhost:5104
```

Remove that override with `Remove-Item Env:DRAFT_REPLY_PORT` to use 5103 again.
The server always binds to localhost; this setting cannot select a network host.

Sample mode is the default. It streams **fixed, simulated text**, with short
delays between chunks. It uses no AI, makes no outbound call, costs nothing, and
returns the same reply for every valid ticket. This teaches streaming mechanics,
not model quality or ticket understanding. The page labels this explicitly.

If your shell previously selected a provider, explicitly choose the free mode:

```powershell
$env:DRAFT_REPLY_PROVIDER = 'Sample'
dotnet run --project labs/supportdesk-draft-replies
```

Use **synthetic information only**, even in sample mode: invent names, situations
and identifiers. Do not paste customer messages, personal data, secrets or
confidential workplace information. Inputs and drafts are kept in the current
Blazor circuit, with no application database or disk persistence. Reloading starts
a new workspace. This is a local teaching app without production authentication.

## What to notice

1. `IDraftReplyService.StreamAsync` returns `IAsyncEnumerable<string>`. Each
   `yield return` produces another piece of the draft.
2. The page uses `await foreach` and calls `StateHasChanged` as chunks arrive.
   InteractiveServer runs the C# code on the server and updates the browser over
   its Blazor connection.
3. Stop cancels a token. Providers link it to a 30-second timeout. Disposing the
   page also cancels work. Stopped or failed text remains visibly incomplete and
   cannot be reviewed as complete.
4. Only a completed stream enables staff review. Generating again or changing the
   ticket clears the previous review and draft. Ticket binding uses `oninput`.
5. Razor renders plain text. HTML-looking model content is encoded, never executed
   or converted into markup. Review facts, policy and tone before using any draft
   outside this lab; the lab never sends it.

Try an empty ticket, a 2000-character ticket, Stop during streaming, restart, check
the review box, then edit the ticket. Inspect how the status and review control
change. The server repeats validation rather than relying on browser maxlength.

## Optional OpenAI HTTP provider

**Optional live use may incur API charges.** It is never needed for this lab's
default experience or verification. No live requests were used to verify the lab.

Mode is selected **only through the server environment**. There is no browser
provider selector, API-key field, query parameter or client-side credential.
Setting a key/model alone does not activate live mode. An unknown mode fails
startup; OpenAI mode with missing configuration also fails, without sample fallback.

Configure these environment variables in the server process before startup:

| Server variable | Value / purpose |
| --- | --- |
| `DRAFT_REPLY_PROVIDER` | `Sample` (default) or explicitly `OpenAI` |
| `DRAFT_REPLY_PORT` | Optional integer 1024–65535; absent means 5103, always loopback |
| `OPENAI_MODEL` | Required in OpenAI mode: a Responses-compatible model your account can access; no model is hardcoded |
| `OPENAI_API_KEY` | Required in OpenAI mode: provided securely to the server environment, never to the browser |

Example setup (placeholders are documentation, not credentials):

```powershell
$env:DRAFT_REPLY_PROVIDER = 'OpenAI'
$env:OPENAI_MODEL = '<your Responses-compatible model>'
# Supply OPENAI_API_KEY through your secure server environment.
# Do not save a real key in this repository or in browser code.
dotnet run --project labs/supportdesk-draft-replies
```

Stop and restart after changing mode. To return to free operation, select
`DRAFT_REPLY_PROVIDER=Sample`. Sample startup does not read `OPENAI_API_KEY` or
`OPENAI_MODEL`; the host avoids automatically loading user secrets or the full
environment. Verification exits before any host or environment configuration.

`OpenAiDraftReplyService` uses raw `HttpClient` to POST
`https://api.openai.com/v1/responses` with server-only bearer authentication,
`model`, `input`, `instructions`, `stream: true`, `store: false` and
`max_output_tokens: 512`. There are no automatic retries or redirects.
`store: false` opts out of response storage for later API retrieval; it is not a
claim of zero provider data retention. Live input still goes to OpenAI.

The server limits tickets to 1–2000 characters, drafts to 6000 characters and
generation to 30 seconds. Token and character limits are different; the provider
may reach its token cap before producing a complete reply. The SSE reader bounds
each event to 64 Ki characters and total streamed text to 1 Mi characters.

The parser yields `response.output_text.delta`, requires `response.completed` with
completed status and usable text, and rejects refusal, failure, incomplete,
malformed JSON and premature EOF. It supports blank-line event boundaries,
comments, CRLF and multiline `data:`. Other lifecycle events add no draft text.
HTTP 429/500 are visible failures, without exposing upstream response bodies or
quietly substituting a sample. Partial content always needs a new successful run.

## Build and deterministic verification

From the repository root:

```powershell
dotnet build labs/supportdesk-draft-replies
dotnet run --project labs/supportdesk-draft-replies -- --verify
```

`--verify` runs local checks and returns exit code 0 only when every check passes.
It starts no web server, reads no API credentials and makes no live API calls.
`Verification/` contains the runner, fake HTTP handler and controlled streams;
production services contain no test branches or verification methods.

Checks exercise the real providers: sample streaming/cancellation/validation;
HTTP request URL, headers and JSON; incremental deltas; comments and multiline
SSE; completion; errors 429/500; refusal; failure; incomplete; malformed/truncated
streams; input/output/frame limits; pending HTTP/body cancellation and linked
timeout; default/alternate/invalid ports. The fake handler replaces only the
external network transport. Current local verification contains 41 checks.

TDD development recorded failing sample checks before sample implementation, then
failing HTTP checks before HTTP implementation. A separate optional browser
regression catches missing bootstrap assets and verifies a live Blazor circuit.
With a Sample-mode server running, and Playwright available in your development
tooling, run:

```powershell
node labs/supportdesk-draft-replies/Verification/browser-smoke.cjs http://localhost:5103
```

This checks page/CSS/framework script HTTP 200, then Generate, streamed text,
completion and review in Chromium. It writes no artifacts. The broader website
integration workflow owns Stop/restart, encoding and responsive browser checks.

`CreateEmptyBuilder` skips default static-web-asset setup. This local-only source
lab explicitly calls `UseStaticWebAssets()` to load build asset locations and
`MapStaticAssets()` to serve generated endpoints, including `/_framework/blazor.web.js`.
Without those endpoints the page can prerender while its controls never become
interactive. See [Microsoft's .NET 10 static asset guidance](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/static-files?view=aspnetcore-10.0).

## File tree and integration manifest

All source files are under `labs/supportdesk-draft-replies/`:

```text
labs/supportdesk-draft-replies/
├── SupportDesk.DraftReplies.csproj
├── Program.cs
├── NuGet.Config
├── README.md
├── IMPLEMENTATION.md
├── Components/
│   ├── _Imports.razor
│   ├── App.razor
│   ├── Routes.razor
│   └── Pages/
│       └── Home.razor
├── Services/
│   ├── IDraftReplyService.cs
│   ├── DraftLimits.cs
│   ├── DraftReplyException.cs
│   ├── LabMode.cs
│   ├── LabPort.cs
│   ├── SampleDraftReplyService.cs
│   ├── OpenAiDraftReplyService.cs
│   └── SseReader.cs
├── Verification/
│   ├── Verify.cs
│   ├── ConfigurationChecks.cs
│   ├── browser-smoke.cjs
│   └── HttpChecks.cs
└── wwwroot/
    └── app.css
```

For a downloadable source lab, include the files above and exclude `bin/` and
`obj/` build outputs. The main workflow owns website/download integration; this
lab does not modify those files.

Stable UI hooks for black-box checks:

| ID | Semantic label / purpose |
| --- | --- |
| `ticket` | textarea: Synthetic support ticket |
| `generate-draft` | button: Generate draft |
| `stop-draft` | button: Stop |
| `draft-output` | region: Draft reply; plain encoded text |
| `draft-status` | live status; Ready for staff review only after completion |
| `staff-review` | checkbox: I have checked this draft for accuracy and tone |
| `review-status` | Staff review required / Reviewed locally — nothing sent. |
| `provider-mode` | Clear simulated/free or live/provider mode label |

Styles use academy charcoal `#121212`, `#1e1e1e`, `#272727`; text `#eeeeee`, muted
`#b7bdc6`; Material Blue700 `#1976d2` buttons with white text; Blue200 `#90caf9`
links and Blue400 `#42a5f5` highlights. Controls have 44px minimum targets, visible
keyboard focus and a single-column mobile layout suitable for 320px widths.

## Official sources

Schema and event behavior were checked before implementation on 2026-10-16:

- [Streaming responses guide](https://developers.openai.com/api/docs/guides/streaming-responses)
- [API overview and server-side authentication](https://developers.openai.com/api/reference/overview)
- [Responses streaming event reference](https://developers.openai.com/api/reference/resources/responses/streaming-events)
- [Create response reference](https://developers.openai.com/api/reference/python/resources/responses/methods/create)

The create reference is linked in its Python rendering because the large generic
reference did not load in the documentation reader. The implementation uses raw
HTTP, not a Python or .NET OpenAI SDK.
