# Learning website upgrade

Delivery record: 18 October 2026. Scope is the existing offline AI learning website for .NET full-stack developers. The unified SupportDesk application remains a separate later project, as requested. See [current scope](CURRENT_SCOPE.md); the earlier [quality review](QUALITY_REVIEW.md) is a historical verification snapshot.

## What changed

The existing 11-unit, 68-lesson course now includes:

- **68 code-to-concept references:** each lesson's .NET section identifies an actual distributable source file and method/type, distinguishes implementation from simulation, and gives a practice task, expected result and command. Commands are written for the extracted project folder. Download the complete project before running an individual source file.
- **11 unit review pages:** three scenario questions with explained answers, followed by an independent challenge, checking rubric and optional solution. Unit endings link to the review and project while leaving the next lesson accessible.
- **67 searchable glossary terms** with aliases and lesson links; a **.NET AI toolkit** that maps libraries and concepts to responsibilities and clearly states which integrations are not installed or executed.
- **16 optional microtopics** covering next-token prediction, output variation, MCP and local/ONNX model decisions. These are small explanations and prediction tasks, not live model integrations.
- **Conceptual prerequisites separated from reading order.** Recommended preparation does not lock a lesson. The old sequence is retained independently for maintenance and compatibility.
- **Full-content search:** searches explanations, examples, code symbols, practice references and mapped glossary aliases. Acronyms use token boundaries rather than matching arbitrary substrings. Code after line breaks remains discoverable.
- **True resume and saved lessons:** Resume reopens the last visited lesson section; Recommended next follows unchecked lessons and each unit's unfinished coding lab. Bookmarks appear in grouped progress.
- **Mobile reading and downloads:** repeated lesson goals/preparation expand on demand, progress is grouped by unit, and each project has a keyboard-accessible jump to its source/ZIP panel. Dark Material Blue styling remains.

Course-map milestone names remain ordinary links to project pages. There are no direct ZIP buttons on the map. All 11 project pages retain instructions and complete ZIP downloads, including in the isolated standalone edition.

## Teaching corrections

The Unit 4 browser prompt comparison and C# summary lab use identical prompt text, sign-in example, four authored cases, expected answers and per-case grading rules. They report 2/4 passing cases for v1 and 3/4 for v2, including the General-category regression. Shape, category, exact ordered facts and missing-information results remain separate. This tiny authored fixture is not a model benchmark or proof of factual correctness.

The first draft-reply startup commands explicitly select `DRAFT_REPLY_PROVIDER=Sample`. Integration tests verify that these commands override a dummy inherited provider setting in isolated PowerShell processes. They do not inspect real credentials or call a provider.

Replay exercises now explain authorization precedence: `Denied` and `Unavailable` can occur before replay comparison; `Conflict` applies to an otherwise authorized changed snapshot. Session-local replay storage is not durable exactly-once delivery.

## Progress and offline compatibility

Existing lesson IDs, original quiz answer indices, read/check/lab evidence and version-1 backups remain compatible. Displayed quiz choices use a stable shuffle without changing their grading indices. Optional resume and bookmark fields accept only known lessons/sections. Visiting, saving, reading recaps or opening solutions does not award checks or lab completion. Lab completion remains self-reported.

Cross-tab updates do not republish visits, clear an unfinished exercise, discard sidebar-link focus or leave read/lab checkboxes stale. Progress remains browser/origin-specific; export a backup before clearing data or moving between file and HTTP editions.

`standalone.html` embeds the new resources and the same lab source/ZIP downloads. `LEARNING_GUIDE.md` includes the code references, microtopics, unit reviews, challenges, glossary and toolkit for reading without JavaScript. The original academy remains separate and unchanged under `original-v2/`.

## Verification

Developer tooling is pinned in `package-lock.json`; it is not shipped as a learner runtime requirement. Run `npm ci --ignore-scripts` and, on a new development machine, `npx playwright install chromium`. Start `node scripts/serve.cjs` for browser checks. All browser checks use isolated developer-owned profiles, not the user's browser tab or saved progress.

| Check | Measured result |
| --- | --- |
| `npm test` | 131 pure Node tests passed; no C# builds or listeners in this suite |
| `npm run test:integration` | 7 tests passed: C#/browser fixture and prompt parity, extracted command-consumer behavior, and grounded-answer verification |
| `npm run test:journey` | All 68 code references; 11 reviews/challenges and focused download jumps; resume/bookmarks; mobile keyboard routes; responsive and isolated standalone flows passed |
| `node tests/cross-tab-browser.cjs` | Two real lesson visits produce two writes; unfinished input, navigation focus and remote read/lab control changes preserved |
| `npm run check:distributions` | All 11 ZIPs, 143 files and embedded ZIP/source copies match canonical source |
| Distribution negative tests | Corrupted payloads and missing/truncated ZIP central-directory/end records rejected |
| `node scripts/verify-advanced-packages.cjs summary` | Freshly extracted 14-file summary project built with zero warnings/errors; 71/71 C# checks and real Blazor responsive/circuit checks passed |
| `node tests/accessibility-manual.cjs` | 51 computed numeral/label/footnote contrast checks, minimum 4.60:1; named groups, modal containment, reduced motion, blocked storage and standalone handoff passed |
| `node tests/browser.cjs` | All 340 lesson sections, 48 responsive route checks, search, independent evidence, backup/export/import/reset, project downloads and direct-file/standalone flows passed |
| `node tests/advanced-browser.cjs` | All six advanced units, 168 responsive route checks, contextual navigation, evidence and portable ZIPs passed |
| `node tests/reliable-browser.cjs` | Unit 4 exercises, safe/stale/error handling, comparison regression and 28 responsive checks passed |
| `node tests/milestone-browser.cjs` | All 11 inline map references lead to the correct project and matching ZIP; keyboard, 320–1440px and isolated standalone flows passed |
| `node tests/beginner-journey.cjs`, `node tests/mobile-focus.cjs`, `node tests/course-completion.cjs` | Keyboard/drawer/enlarged-text/reset/no-JavaScript journeys, 206 unobscured mobile focus stops, and checks → unfinished labs → progress routing passed |
| `node tests/accessibility-browser.cjs` | Stable-source full sweep: 470 rendered states; zero actionable configured A/AA and best-practice violations, with raw/incomplete findings retained |

Two independent read-only reviews covered core/UI behavior and content/package correctness. All reported findings were corrected and signed off, including regressions first reproduced in search, cross-tab state/focus, ZIP structure and replay wording. Two older browser assertions were updated to expect full-content rather than title-only search results; relevant project mappings remain explicitly checked.

Evidence is retained in ignored `.artifacts/`, including `accessibility-full.json`, `accessibility-engineering.json` when generated by its checker, `browser-results.json`, `upgrade-mobile-lesson.png`, `upgrade-mobile-review.png` and fresh-package verification folders. Re-run checks rather than treating screenshots or this dated record as proof of later changes.

The accessibility configuration checks applicable WCAG A/AA and best-practice rules. Raw automated findings and incomplete results are retained. Known modal SPA-route skip-link heuristic findings are dispositioned only for enumerated routes whose real keyboard activation, drawer closure and heading focus are independently exercised. Closed native-dialog and contrast incompletes receive targeted engineering checks. This is **not a formal accessibility certification**, a comprehensive screen-reader audit, or a study with human beginners.

## Maintenance and boundaries

Canonical changes belong in `assets/` and `labs/`. Run `npm run build` to regenerate the standalone site, readable guides and ZIPs, then run `npm run check:distributions`. Do not edit generated copies independently. `scripts/lab-packages.cjs` owns the shared all-11 package manifest.

The normal learning path requires no account, paid call, model download, database, customer data or cloud resource. Advanced lessons continue to label authored embeddings, OCR/transcripts, model choices, MCP/agent and deployment demonstrations honestly. The toolkit does not install provider or agent SDKs. The independent labs are not one production system and do not certify deployment readiness.

No Git commit, publication or integrated-application implementation is part of this delivery.
