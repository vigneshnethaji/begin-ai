# SupportDesk ticket lookup implementation plan

Approved scope: the user-supplied Unit 5 specification in this conversation. All files and build output stay in this lab. No Git operations.

The server-side pipeline is strict parse → deterministic permission/team check → explicit approval snapshot → local read. A scoped executor serializes invocation and retains at most 128 completed requests. At capacity it refuses new requests rather than evicting an unknown outcome and allowing an accidental repeat. Audit is a separate FIFO of at most 128 entries. No external dependencies or data stores.

UI follows the prior ticket-summary lab: EmptyBuilder, static web assets, InteractiveServer, readiness guard, 128 KiB transport, independently enforced 4000-character JSON limit. Dark Material Blue colors and Segoe UI/Cascadia fonts follow the requested academy tokens. Two work panels show proposal and approval; result and session audit follow below, stacking at mobile widths.

1. Write real parser/port tests in Verification/Verify.cs; observe failure, implement strict contract and loopback port configuration, rerun.
2. Write real executor tests for authorization, approval lifecycle, cached authorization, concurrent duplicates, conflicts, retry, unknown outcomes, bounds and session isolation; observe failure, implement Services/LookupExecutor.cs, rerun.
3. Connect Components/Pages/Home.razor to the same executor. Every edit revokes approval and clears review/result with a fresh request ID. Replay uses the exact previous request.
4. Build and run verification; inspect local HTTP/static assets, stop the owned host, and deliver README with API contract and complete source manifest. Main owns wider website/testing/packaging.

Test expectations use literal outcomes and real local reads, without mocks. Failure scenarios are explicit supported demo inputs, not test hooks. Cache and audit disappear with the scoped session or process; no durable exactly-once guarantee.
