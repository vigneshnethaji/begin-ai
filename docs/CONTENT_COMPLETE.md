# Complete beginner-to-advanced content pass

Delivery record: 19 October 2026. This extends the approved [Units 1–3 pattern](CONTENT_DEPTH.md) to all remaining Units 4–11. The course still contains 11 available units, 68 lessons and 11 independent coding projects. It is not a combined SupportDesk deployment.

## What every lesson now provides

All 68 lessons have a short plain-English bridge, three sequential worked steps with concrete inputs/outcomes, guided practice with a hint and expected approach, a transfer question about a different fictional .NET feature, and a recall prompt for later self-explanation. That gives 204 worked steps, 68 guided tasks, 68 transfer scenarios and 68 recall prompts.

Understand, Example, Try it, Check and .NET retain their existing responsibilities. Hints and solutions open on demand; they do not award understanding checks, lab milestones or reminders. The actual browser exercises remain interactive and offline. The numeric learning and confusion-matrix demonstrations from the first pass remain available.

The glossary now has 108 terms, with unique headings and valid lesson links. The existing 26 optional microtopics remain. Dark Material Blue styling, mobile navigation, source references, conceptual prerequisites, resume/bookmarks and progress backups are preserved.

## New coverage by unit

| Unit | What the worked traces make concrete |
| --- | --- |
| 4. Reliable prompts and outputs | Instructions versus data, few-shot examples, evidence, JSON/DTO validation, response states and identical-case prompt comparisons with visible regressions |
| 5. Tools and safe actions | Typed requests, proposal versus execution, exact review/approval snapshots, authorization precedence, bounded retries, temporary replay records and unknown outcomes |
| 6. Vectors and semantic search | Coordinates, hand-calculated cosine and zero policy, authored versus learned representations, compatible model spaces, exact scans and hybrid ranking |
| 7. Grounded answers | Traceable chunks, evidence budgets, skipped overflowing chunks, extractive answers, selected-source citations and separate retrieval measures |
| 8. Production retrieval | Recall/rank arithmetic, candidate selection versus reranking, source/index versions, publication, deletion, access revocation, cache scope and diagnostic traces |
| 9. Agents and workflows | Who chooses the route, explicit state, consumed budgets, conceptual framework mapping, local MCP capability metadata, approval, replay and reconciliation |
| 10. Inputs and model choices | Conflicting image/transcript fixtures, review invalidation, profile eligibility and the distinction between model format, runtime, execution provider, quantization and fine-tuning |
| 11. Operations and deployment | Synthetic quality/cost gates, trusted demo identity, bounded traces, exact candidate approval, local promotion, smoke outcomes, rollback and Unknown |

Worked traces name actual files and symbols where describing running code. Proposed applications are labelled conceptual. Advanced projects still do not run learned embeddings, generated RAG answers, agent SDKs, live MCP transport, OCR/speech recognition, ONNX inference, fine-tuning or Azure deployment. No credential, paid provider, database or provisioning action is part of this delivery.

## Implementation and offline delivery

Four new authored modules own the remaining content: `assets/teaching-prompts-tools.js`, `assets/teaching-search-rag.js`, `assets/teaching-retrieval-workflows.js` and `assets/teaching-models-operations.js`. Each owns 12 lessons without changing earlier lessons. `assets/teaching-complete.js` combines all seven teaching modules for both browser and Node consumers. Existing rendering and styling are reused; no new dependency or learner installation is required.

The standalone builder includes the new modules and teaching registry. `LEARNING_GUIDE.md` includes every companion and its expected reasoning; `FOUNDATION_LESSONS.md` retains the earlier foundation material. Human prose mentioning HTML or generic syntax remains escaped for Markdown; fenced code remains verbatim. All 11 ZIPs and individual source downloads stay on their project pages, with inline milestone links on the map.

## Verification

With the local preview host running, the main reproducible checks are:

```shell
npm test
npm run test:teaching
npm run test:journey
node tests/browser.cjs
node tests/milestone-browser.cjs
node tests/advanced-browser.cjs
node tests/advanced-exercises.cjs
node tests/cross-tab-browser.cjs
node tests/beginner-journey.cjs
node tests/mobile-focus.cjs
node tests/accessibility-browser.cjs
node tests/accessibility-manual.cjs
npm run build
npm run check:distributions
```

Current measured results:

- 140 pure Node tests passed. The new consumer test failed on the missing Unit 4 worked flow before integration, then passed with all 68 lessons. It also checks encoded rendering and glossary integrity.
- All 68 explanation/worked/guided/transfer/recall journeys passed. Hints and expected approaches expand at 320px without horizontal overflow; recall works by keyboard. Read/check/lab evidence survives unchanged. Every unit opens in a freshly isolated standalone file, and all 68 portable companions match canonical browser/Node data.
- The 340-section/48-responsive-route suite and all-11 milestone/ZIP suite passed, including backups, mobile drawers and direct-file use.
- All six advanced units, 168 advanced responsive routes and all 36 advanced exercises passed. Beginner navigation/enlarged-text/no-JavaScript checks and 206 unobscured mobile focus stops passed.
- All 11 ZIPs, 143 source files and embedded source/archive copies match. No C# lab source was changed in this content pass.

Two independent read-only reviews covered all 48 new companions against the actual C# sources, plus registry/load ordering and offline/guide parity. No outstanding important findings remained. The final stable-source axe sweep passed **490 rendered states**, with zero actionable configured A/AA or best-practice violations and no page errors. It includes expanded teaching content and mobile worked examples from every remaining unit. Targeted engineering checks also passed 51 computed contrasts, with a minimum of 4.60:1, plus modal, reduced-motion, blocked-storage and standalone cases.

An early sample audit correctly rejected its result after a worker's final content edit. The portable artifacts were regenerated after that edit and the full passing run used frozen sources. A final sample rerun also passed all 148 states; the earlier stale-source result is not used as delivery evidence.

Evidence is retained in ignored `.artifacts/`, including the full accessibility record, `teaching-retrieval-mobile.png`, `teaching-workflow-mobile.png`, and isolated portable test folders. Tests use developer-owned profiles, never the user's browser progress. Raw/incomplete accessibility findings and enumerated modal SPA-route heuristic dispositions remain available. Engineering checks are not formal accessibility certification or proof that beginners learned the material.

## Review references and remaining boundaries

Content is grounded primarily in each distributed C# implementation. Conceptual review also uses official [Microsoft embeddings guidance](https://learn.microsoft.com/en-us/dotnet/ai/conceptual/embeddings), [RAG evaluation guidance](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase), [MCP tools specification](https://modelcontextprotocol.io/specification/latest/server/tools) and [ONNX Runtime quantization guidance](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html). These links do not enable live integrations or install packages.

Human beginner feedback remains valuable for adjusting explanation length and difficulty. No learner study, certification, production-readiness claim, Git commit or publication is included. The integrated SupportDesk application remains a separate later project, as requested.
