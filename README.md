# AI for .NET developers — learning workspace

A guided, mobile-first AI learning website for developers who know C#, ASP.NET Core, Blazor, SQL, and basic testing, but are new to AI.

See [current product scope](docs/CURRENT_SCOPE.md) for the up-to-date learning path and boundaries, [complete content pass](docs/CONTENT_COMPLETE.md) for the latest beginner-content delivery, [Units 1–3 content depth](docs/CONTENT_DEPTH.md) for the initial content pass, [learning upgrade](docs/LEARNING_UPGRADE.md) for the earlier resource/navigation delivery, and [quality review](docs/QUALITY_REVIEW.md) for the earlier accessibility snapshot. Dated design notes describe historical milestones, not missing units.

## Open the website

Double-click **index.html** in Edge or Chrome. No website build, account, server, CDN, or AI key is required. The website opens on **Home**, which explains its purpose, intended audience, learning method, project, and available content.

Use **Start the foundation lessons** to begin, **Recommended next step** to follow the learning sequence, or **Resume where I stopped** to return to your last lesson section. **Learn** recommends lessons and the current unit's unfinished project, then the next unit or final progress summary. **Course map** shows the complete path; **My progress** shows grouped evidence, saved lessons and backups. The logo always returns to Home. Phones have a persistent, labelled bottom navigation bar and a course drawer.

The learning resources include true **Resume where I stopped**, **Save lesson**, conceptual prerequisites, full-content/alias search, a searchable **108-term AI glossary**, the **.NET AI toolkit**, **68 source-file/method practice references**, and **11 unit recaps with independent challenges**. Every lesson across all 11 units also includes a **step-by-step worked trace, guided task, different .NET scenario and recall prompt**. The early units include local learning/metrics demonstrations. Learn offers the current unit's unfinished lab before the next unit. Course Map milestone names remain links; ZIP downloads and mobile download jumps stay on project pages. See [current delivery and verification](docs/CONTENT_COMPLETE.md).

Side navigation follows the active page: Course map lists all 11 units and jumps to the selected section, lessons show the current unit's lesson sequence, each desktop lab shows related prerequisites, and Progress shows relevant next actions. The map highlights the unit currently in view; all 11 units link to real lessons. The mobile course drawer follows the same context.

Each Course map milestone name links to its project page. Read the prerequisites, run commands and expected results there, then download the complete source ZIP if needed. All 11 units include a ZIP, including the C# rules baseline. Extract each ZIP into its own folder; the projects are independent. Project links and ZIP downloads also work in the portable standalone edition.

For a portable single-file edition, open **standalone.html**. It embeds the styling, lessons, interactions, and downloadable C# lab sources. Keep the original-v2 folder nearby only if you want the comparison link to the old academy to work. Keep **LEARNING_GUIDE.md** alongside it if you need the readable fallback with JavaScript disabled.

Optional local hosting with Node:

```shell
node scripts/serve.cjs
```

Open http://127.0.0.1:4173. The host listens only on the local computer. Stop it with Ctrl+C.

## What is available

All 11 units are available, with 68 complete lessons and 11 runnable labs. The complete beginner-to-advanced learning path is now published locally. Cloud deployment remains an explained concept and local simulation, not a provisioned Azure environment. It includes:

- Six fully written foundation lessons: AI features; exact C# rules; models; training versus inference; prediction mistakes; selecting rules, a classifier, or an LLM.
- Eight ML.NET lessons: examples/datasets; features; labels; data quality; training/test separation; the pipeline; evaluation; saving/loading a model.
- Six language-model lessons: generated text; tokens/context; a C# provider boundary; server-only credentials; timeouts/cancellation; streaming into Blazor.
- Six reliable-output lessons: instructions/message roles; prompt examples; useful context; JSON and DTOs; validation/refusals; comparing prompt changes.
- Six tool lessons: callable functions; typed arguments; proposal versus execution; authorization/approval; safe retries/replays; audit and unknown results.
- Six vector/search lessons: numeric vectors, cosine similarity, embedding meaning, compatible storage, exact versus approximate indexes, and filtered/hybrid retrieval.
- Six grounded-answer lessons: retrieval first, chunks, evidence selection, bounded context, citations and support, and separate retrieval testing.
- Six retrieval-quality lessons: evaluation sets, ranking, index freshness, caller/document access, untrusted document instructions, and safe traces.
- Six workflow lessons: workflows versus agents, state, budgets, Microsoft Agent Framework concepts, MCP capabilities, and approvals/recovery.
- Six input/model-choice lessons: images and OCR, speech transcripts, combining evidence, local inference, ONNX/quantization, and fine-tuning decisions.
- Six operations lessons: identity/secrets, evaluation gates, observability, latency/cost, Azure release patterns, and capstone failure drills.
- Five sections per lesson: Understand, Example, Try it, Check, and .NET.
- A unique offline exercise for each topic, with explanatory feedback.
- Explicit prerequisites and links from each concept to the SupportDesk application.
- Separate read markers, passed understanding checks, and self-reported lab completion.
- The .NET 10 rules-baseline lab with six executable checks, plus a real ML.NET classifier lab with nine workflow checks, 54 synthetic training messages, and 18 separate test messages. Download the complete classifier source ZIP from its lab page.
- A .NET 10 Blazor Interactive Server draft-reply lab with free sample streaming, Stop, explicit staff review, and an optional server-only OpenAI Responses adapter. Download its complete source ZIP from the lab page. Local verification uses controlled HTTP fixtures and never makes paid calls.
- A free Blazor ticket-summary lab with authored JSON samples, strict C# shape/value validation, separate refusal/incomplete states, staff review, and a four-case prompt-fixture comparison. It makes no model calls and needs no credentials. Valid structure does not establish factual correctness.
- A free read-only ticket-lookup lab over fictional data: strict tool arguments, simulated caller scope, request-bound approval, deterministic authorization, bounded retries/replays, and audit. No model or external system is called; the identity picker is a learning simulation, not authentication.
- Four more complete .NET 10 Blazor projects: toy-vector article search, extractive evidence answers, retrieval quality/access checks, and a bounded support-triage state machine. These run without AI accounts, model downloads, provider calls or database setup. Each ZIP includes its source, README and executable checks.
- Two additional local Blazor projects: reviewed fictional attachment intake and an operations-readiness capstone. OCR/transcripts/model profiles and deployment measurements are authored samples; no model inference, Azure authentication or actual deployment runs.
- A searchable complete course map from fundamentals through ML.NET, LLMs, tools, RAG, agents, input/model choices, and Azure operations concepts.
- Progress export, confirmed import/reset, browser storage warnings, keyboard navigation, and a modal mobile course drawer.

Browser model outputs are authored teaching examples, labelled in context. The downloadable classifier lab trains a real local model using Microsoft.ML 5.0.1. Its first NuGet restore needs internet access; it needs no AI account or paid service. The Blazor lab starts in local sample mode; it does not run a model until explicitly configured for a provider. Live provider access and billing are not verified by local fixture tests. Coding labs are intended for a desktop; the explanations and experiments work on a phone.

The website uses a dark theme: charcoal canvas and reading surfaces, Material Blue 700 primary buttons, Blue 200 links, and Blue 400 highlights. The complete supplied Material Blue 50–900 palette remains available as design tokens. Navigation follows the established Fluent-referenced structure, with system typography and WCAG 2.2 AA as a target. Browser checks and visual review are recorded in the verification note; a comprehensive accessibility audit has not been performed.

## Learning progress

The workspace uses its own key: `dotnet-ai-workspace-progress-v1`. Existing IDs, read/check/lab evidence and version-1 backups remain valid. The default sequence continues from foundations through ML.NET, language models, reliable outputs, tools, search, grounded answers, retrieval quality, workflows, model choices and operations. Learn offers each completed unit's unfinished lab before recommending the next unit. Once all checks and self-reported lab milestones are recorded, it opens the evidence summary. Resume stores only a validated lesson/section; bookmarks store known lesson IDs. Neither feature awards checks. Storage updates from another tab do not republish a visit or clear an unfinished lesson exercise. These records are not certification or proof of deployment, and do not reinterpret the original academy's separate day checkmarks.

Progress stays in the browser for the current origin/file location. It does not automatically follow you to another browser, URL, device, or copy of the website. Use **My progress → Export progress** to back it up, and **Import backup** to restore. Import and reset ask before replacing data.

## Source structure

```text
index.html                      Website shell and semantic navigation
styles.css                      Tokens, desktop layout, mobile layout, focus styles
assets/
  curriculum.js                 Canonical lessons, published map and support integration
  learning-support-{a,b}.js      Authored code references, glossary and unit practice
  learning-support.js           Combined support data and extracted-project commands
  teaching-*.js                 All 11 units' worked/guided/transfer/recall content
  teaching-complete.js          Shared all-unit teaching registry
  teaching-math.js              Local illustrative update and confusion-matrix arithmetic
  learning-resources.js         Glossary, toolkit, reviews and practice rendering
  mlnet-content.js              Eight small ML.NET lessons with explicit unit ownership
  language-content.js           Six small language-model lessons
  language-experiments.js       Offline generation, context, security and stream exercises
  reliable-content.js           Six prompt and structured-output lessons
  reliable-experiments.js       Offline instructions, JSON, failure and evaluation exercises
  summary-files.js              Complete summary source-distribution manifest
  summary-lab.js                Guided summary lab page
  tools-content.js              Six callable-tool and safety lessons
  tools-experiments.js          Offline proposal, permissions, retry and audit exercises
  lookup-files.js               Complete read-only tool lab source manifest
  lookup-lab.js                 Guided ticket-lookup lab page
  advanced-catalog.js           Unit6–11 metadata, navigation, preview and lab ownership
  search-*.js                   Unit6 lessons, exercises, manifest and guided search lab
  rag-*.js                      Unit7 lessons, exercises, manifest and grounded-answer lab
  retrieval-*.js                Unit8 lessons, exercises, manifest and retrieval-quality lab
  workflow-*.js                 Unit9 lessons, exercises, manifest and bounded-workflow lab
  inputs-*.js                   Unit10 lessons, exercises, manifest and attachment lab
  operations-*.js               Unit11 lessons, exercises, manifest and capstone lab
  draft-files.js                Complete Blazor source manifest for downloads
  draft-lab.js                  Guided Blazor lab page
  mlnet-experiments.js           Offline data, pipeline, evaluation and lifecycle exercises
  mlnet-lab.js                   Desktop classifier instructions and source downloads
  lab-files.js                   Complete classifier source-distribution manifest
  learning-core.js              Grading, prerequisites, progress and import validation
  experiments.js                Offline teaching exercises
  home.js                       Landing page: purpose, audience, usage and next step
  workspace.js                  Views, routing, navigation, backup and browser storage
labs/supportdesk-rules/          Runnable C# lab, verification cases and README
labs/supportdesk-classifier/     Real ML.NET classifier, synthetic splits and verification
labs/supportdesk-draft-replies/  Runnable Blazor lab, server-only adapter and local verification
labs/supportdesk-ticket-summary/ Free Blazor DTO-validation and prompt-fixture lab
labs/supportdesk-ticket-lookup/  Free reviewed C# lookup, demo scope, replay and audit
labs/supportdesk-semantic-search/ Toy-vector exact search and hybrid comparison
labs/supportdesk-grounded-answers/ Chunking, evidence budgets and extractive citations
labs/supportdesk-retrieval-quality/ Local evaluation, freshness and demo access boundaries
labs/supportdesk-bounded-workflow/ Bounded local state machine, review and recovery
labs/supportdesk-attachment-review/ Fictional multimodal evidence and review policy
labs/supportdesk-operations-capstone/ Local release gates, promotion/smoke/rollback
downloads/                     Generated complete source ZIPs for all 11 labs
FOUNDATION_LESSONS.md            Generated readable edition of the six foundation lessons
LEARNING_GUIDE.md                Generated readable edition of all 68 available lessons
standalone.html                 Generated portable edition, including lab downloads
scripts/
  serve.cjs                     Optional local development host
  build-standalone.cjs           Generates standalone HTML and new lesson Markdown
  verify-advanced-packages.cjs   Fresh ZIP builds, source hashes and real Blazor checks
tests/
  learning.test.cjs              Node tests for learning/progress behavior
  browser.cjs                   Real Chromium interaction and responsive checks
  milestone-browser.cjs         All 11 milestone references, project downloads and mobile/standalone flows
  language-browser.cjs          Third-unit routes, mobile drawer and portable downloads
  reliable-browser.cjs          Fourth-unit mapping, exercises, mobile and portable downloads
  summary-app-browser.cjs       Actual summary-lab Blazor circuit and responsive tests
  tools-browser.cjs             Fifth-unit mapping, exercises, mobile and portable downloads
  lookup-app-browser.cjs        Actual read-only tool lab execution and scope checks
  advanced-learning.test.cjs    Earlier advanced ownership and progress compatibility
  final-learning.test.cjs       Final units, complete path and independent evidence
  course-completion.cjs         Learn routes to unfinished labs then progress summary
  advanced-browser.cjs          Unit6–11 grading, contextual navigation, mobile and ZIPs
  advanced-exercises.cjs        All 36 advanced exercises through the integrated website
  {search,rag,retrieval,workflow,inputs,operations}.test.cjs  Focused new teaching-algorithm contracts
  {search,rag,retrieval,workflow,inputs,operations}-app-browser.cjs  Actual advanced Blazor circuits
docs/CURRENT_SCOPE.md            Current availability, delivery model and boundaries
docs/QUALITY_REVIEW.md           Usability/accessibility method, evidence and limits
docs/superpowers/                Historical design, plan and verification records
original-v2/                    Untouched copy of all nine original ZIP files
```

The root `app.js`, `course-data.js`, `course-data.json`, `AI_LEARNING_ROADMAP.md`, and `DEVELOPER_HANDOFF_COMPLETE.md` remain original handoff material. The new entry point does **not** load that application or curriculum. Use **original-v2/index.html** for a complete, unchanged original experience.

## Maintain and verify

Developer-only tooling is pinned in `package-lock.json`: run `npm ci --ignore-scripts`, then `npx playwright install chromium` on a new development machine. Learners need neither Node nor these packages. The local Codex runtime remains a fallback on the original machine.

- `npm test`: pure Node tests; no C# builds, providers or listeners.
- `npm run test:integration`: explicit .NET compilation/verification and isolated PowerShell command-consumer checks; no paid calls.
- `npm run test:journey`: new learning resources, resume/bookmarks, all references/recaps, mobile and standalone flows. Start the local host first.
- `npm run test:teaching`: all 68 enhanced lessons, local arithmetic demonstrations, no false credit, expanded mobile content and all-unit isolated standalone checks.
- `node tests/cross-tab-browser.cjs`: isolated shared-storage tabs; visit-loop, unfinished-input, focus and read/lab-control regressions.
- `npm run check:distributions`: read-only source/archive/embedded consistency for all 11 labs.
- `npm run build`: regenerate the portable site, readable guides and ZIPs after source changes.

Edit the canonical sources in `assets/`, then regenerate derived editions:

```shell
node scripts/build-standalone.cjs
node --test tests/*.test.cjs
dotnet run --project labs/supportdesk-rules -- --verify
dotnet run --project labs/supportdesk-classifier -- --verify
dotnet run --project labs/supportdesk-draft-replies -- --verify
dotnet run --project labs/supportdesk-ticket-summary -- --verify
dotnet run --project labs/supportdesk-ticket-lookup -- --verify

dotnet run --project labs/supportdesk-semantic-search -- --verify

dotnet run --project labs/supportdesk-grounded-answers -- --verify

dotnet run --project labs/supportdesk-retrieval-quality -- --verify

dotnet run --project labs/supportdesk-bounded-workflow -- --verify

dotnet run --project labs/supportdesk-attachment-review -- --verify

dotnet run --project labs/supportdesk-operations-capstone -- --verify
```

For browser checks, start the local host in a separate terminal and run `node tests/browser.cjs`, `node tests/milestone-browser.cjs`, `node tests/language-browser.cjs`, `node tests/reliable-browser.cjs`, `node tests/tools-browser.cjs`, and `node tests/advanced-browser.cjs`. These checks use an installed Playwright package or the bundled Codex runtime package on this machine. Other machines need Playwright and Chromium installed to run these developer-only checks. Learners do not need Node or Playwright.

For each new Blazor app, run `dotnet run` from its lab folder. Default loopback ports are 5109 (search), 5111 (grounded answers), 5113 (retrieval quality), 5115 (workflow), 5117 (attachments), and 5119 (operations). The corresponding `tests/*-app-browser.cjs` scripts accept an optional local URL argument, so extracted ZIPs can be checked on separate ports. The README in each source project documents its validated optional port setting.

## What the advanced labs demonstrate

The vector lab uses hand-designed topic features and an exact in-memory scan, not a trained embedding model or approximate vector database. The grounded-answer lab selects local source text, not generated model prose; citation matching is a narrow check and does not prove arbitrary factual correctness. Retrieval-quality scores use a tiny fictional evaluation set, not a production benchmark. Identity selectors demonstrate server-owned demo policies, not real authentication. The workflow is deterministic C# orchestration, not a model-directed agent, Microsoft Agent Framework runtime, or live MCP connection. Framework/provider integration points are explained separately and linked to official documentation.

All six advanced labs use temporary in-memory state. Attachment samples do not perform OCR, speech recognition, local/ONNX model inference, quantization or fine-tuning; the application teaches their boundaries using authored evidence and policy checks. The operations capstone runs local gates and simulated release/rollback, not Azure resource provisioning or real cloud authentication. They do not claim production readiness, durable checkpoints, durable exactly-once execution, or comprehensive prompt-injection prevention.

Run `node tests/advanced-exercises.cjs` for the 36 integrated advanced activities, and `node tests/rag-accessibility.cjs` for actual live-result updates in an isolated local component. After regenerating downloads, `node scripts/verify-advanced-packages.cjs` extracts fresh copies of all six advanced projects, compares source hashes, compiles and verifies C#, and tests their actual Blazor circuits. It requires Windows PowerShell for extraction and uses ports 5110/5112/5114/5116/5118/5120. Optional arguments `search`, `rag`, `retrieval`, `workflow`, `inputs`, or `operations` restrict the package checks. Temporary extracted folders and machine-readable results are retained in `.artifacts/`; the checker stops its own temporary app processes.

Verification screenshots/results are generated in ignored `.artifacts/`; C# build output is also ignored. No Git commit or publication is included in this delivery.

Use `node scripts/verify-advanced-packages.cjs summary` to verify the Unit 4 summary ZIP from a fresh extraction, including its C# checks and real Blazor UI on port 5122. With no selector, this script retains its six-advanced-project default.

## Design references

- [Fluent 2 layout](https://fluent2.microsoft.design/layout)
- [Fluent 2 accessibility](https://fluent2.microsoft.design/accessibility)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Microsoft Learn: AI in .NET](https://learn.microsoft.com/en-us/dotnet/ai/overview)
- [Microsoft Learn: ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/mldotnet-api)
