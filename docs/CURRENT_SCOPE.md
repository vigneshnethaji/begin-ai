# AI for .NET developers — current scope

Current as of 18 October 2026. This is the current product description. Dated design and implementation records under `docs/superpowers/` describe earlier milestones; their old preview counts and Planned labels are historical, not current availability.

## What learners can use

All 11 units are available: 68 short lessons, each with Understand, Example, Try it, Check and .NET sections; 11 independent coding labs; a searchable course map; progress and backup tools.

1. Foundations — 6 lessons; C# rules baseline.
2. Data and your first ML.NET model — 8 lessons; real synthetic-data training, evaluation and prediction.
3. Language models in C# — 6 lessons; Blazor draft replies with free authored samples and an optional server-only provider adapter.
4. Reliable prompts and outputs — 6 lessons; typed summary validation and review.
5. Tools and safe actions — 6 lessons; read-only fictional ticket lookup.
6. Vectors and semantic search — 6 lessons; hand-designed vectors and exact local search.
7. Answers grounded in documents — 6 lessons; extractive evidence and citations, not LLM generation.
8. Production retrieval — 6 lessons; fictional evaluation, publication and permission policies.
9. Agents and workflows — 6 lessons; deterministic bounded workflow and recovery.
10. More inputs and model choices — 6 lessons; authored multimodal evidence and model-choice policies.
11. Operate and deploy on Azure — 6 lessons; local release-readiness, approval, smoke and rollback simulation.

## How to learn

Start on Home, then select Start the foundation lessons. Read the explanation, inspect the example, change an exercise input, answer the check, and read the .NET connection. Recommended prerequisites do not lock lessons.

Each lab is its own project in `labs/`. Extract each download into a separate directory, follow its README and run its checks. SupportDesk connects the examples as one fictional scenario; the downloads are not one integrated application. Read on a phone; run .NET 10 coding projects on a desktop.

Learn resumes the next unchecked lesson. After all checks pass, it opens the next unfinished lab. Once checks and self-reported lab milestones are recorded, it opens the progress summary. Reading alone does not award understanding. Lab completion is self-reported, not certified or inferred from downloads.

## Interface and delivery

The dark Material Blue interface uses neutral charcoal surfaces, blue actions and highlights, system fonts, visible keyboard focus, semantic navigation and a modal mobile drawer. Both `index.html` and `standalone.html` work offline without a CDN or runtime package installation. The standalone includes lab downloads. `LEARNING_GUIDE.md` is the complete readable edition and the no-JavaScript fallback.

Progress is stored in this browser on this device. Export a backup before clearing site data, moving between file and HTTP origins, or resetting progress. Import and reset require confirmation. The original academy and its files remain under `original-v2/` with separate progress.

## Deliberate boundaries

Advanced activities use clearly labelled fictional fixtures. They do not execute OCR, speech recognition, ONNX inference, fine-tuning, live agent/MCP transport, Azure authentication, or cloud deployment. No paid call, database, customer data, credential or cloud resource is required for the normal learning path. An optional provider adapter is not permission to call it during tests.

These independent projects are not a production platform. They provide no durable orchestration, production identity boundary, exactly-once guarantee, certification or assurance of production readiness.

## Quality records and future work

See [quality review](QUALITY_REVIEW.md) for test commands, scope, accessibility findings and review limits. The automated and engineering walkthrough is not a study with human beginners or a screen-reader certification.

A unified SupportDesk application and live integrations are a separate future phase. They require their own design, provider/runtime choices and explicit decisions about credentials, cost, data and deployment; they are not unfinished units in this course.
