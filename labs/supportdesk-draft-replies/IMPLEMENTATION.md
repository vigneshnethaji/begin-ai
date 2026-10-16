# Draft replies implementation plan

This independent third lab follows the user's approved implementation brief.
All work stays in this folder; no Git operations, secrets inspection or live calls.

Design: .NET 10 Blazor InteractiveServer, one IDraftReplyService contract returning
IAsyncEnumerable<string>, default fixed sample chunks, optional raw HttpClient
Responses provider. Server validates 1–2000 input characters, limits drafts to
6000 characters / 512 output tokens, and links cancellation to a 30 second timeout.
HTTP parsing requires response.completed; refusal, failure, incomplete and premature
EOF are errors. Razor renders plain text. Staff review is always required; no send.

Visual plan: academy charcoal canvas #121212, surface #1e1e1e, raised #272727,
text #eeeeee, muted #b7bdc6; Material Blue700 #1976d2 buttons with white text,
Blue200 #90caf9 links, Blue400 #42a5f5 highlights. System UI type, left aligned
input beside a draft workspace, stacking at mobile320; visible focus, 44px controls.

- [x] Write and run failing sample streaming, cancellation and validation checks.
- [x] Implement sample service and re-run the local runner.
- [x] Write fake-handler HTTP contract/parser/error/cancellation checks and see red.
- [x] Implement bounded HTTP streaming and re-run checks to green.
- [x] Build the InteractiveServer UI, explicit Stop/review states and local styles.
- [x] Document startup, synthetic data, env opt-in, file tree, sources and lessons.
- [x] Run dotnet build and dotnet run --project labs/supportdesk-draft-replies -- --verify.
- [x] Smoke-check localhost:5103 in sample mode; inspect the final scoped files.

Tests live only under Verification/. The fake HttpMessageHandler substitutes the
external transport; request JSON and real streamed service results are asserted.

Final local verification: 41/41 checks passed, build has zero warnings/errors.
Sample page and CSS returned HTTP 200 on localhost:5103. The bounded alternate
port was also smoke-checked on localhost:5104; both temporary hosts were stopped.
No live model calls or API credential reads were used. Actual browser interactions
are verified by the main integration workflow, not claimed by these local checks.

Bootstrap regression: Verification/browser-smoke.cjs first reproduced framework
script HTTP 404. Explicit UseStaticWebAssets + MapStaticAssets resolved it. The
same regression then passed app/CSS/bootstrap HTTP 200 and a live Chromium Blazor
circuit (Generate, streamed sample, completion and staff review). The 41 local
checks still pass; the temporary localhost:5104 host was stopped after verification.
