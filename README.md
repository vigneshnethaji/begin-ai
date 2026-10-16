# AI for .NET developers — learning workspace

A guided, mobile-first AI learning website for developers who know C#, ASP.NET Core, Blazor, SQL, and basic testing, but are new to AI.

## Open the preview

Double-click **index.html** in Edge or Chrome. No website build, account, server, CDN, or AI key is required. The website opens on **Home**, which explains its purpose, intended audience, learning method, project, and available content.

Use **Start the foundation lessons** to begin, or **Continue learning** when you have saved progress. **Learn** opens the next topic whose understanding check is unfinished. **Course map** shows the full proposed path; **My progress** shows evidence and backups. The logo always returns to Home. Phones have a persistent, labelled bottom navigation bar and a course drawer.

For a portable single-file edition, open **standalone.html**. It embeds the styling, lessons, interactions, and downloadable C# lab sources. Keep the original-v2 folder nearby only if you want the comparison link to the old academy to work.

Optional local hosting with Node:

```shell
node scripts/serve.cjs
```

Open http://127.0.0.1:4173. The host listens only on the local computer. Stop it with Ctrl+C.

## What is available

This is the representative preview approved in the design discussion, not the complete rewritten course. It includes:

- Six fully written foundation lessons: AI features; exact C# rules; models; training versus inference; prediction mistakes; selecting rules, a classifier, or an LLM.
- Five sections per lesson: Understand, Example, Try it, Check, and .NET.
- A unique offline exercise for each topic, with explanatory feedback.
- Explicit prerequisites and links from each concept to the SupportDesk application.
- Separate read markers, passed understanding checks, and self-reported lab completion.
- A runnable .NET 10 console lab with six executable checks and expected output.
- A searchable proposed course map from fundamentals through ML.NET, LLMs, tools, RAG, agents, and Azure operations. Later units are clearly labelled **Planned**.
- Progress export, confirmed import/reset, browser storage warnings, keyboard navigation, and a modal mobile course drawer.

Model outputs in the foundation exercises are authored examples, labelled in context. No real model or paid service runs in the preview. Coding labs are intended for a desktop; the explanations and experiments work on a phone.

The website uses a dark theme: charcoal canvas and reading surfaces, Material Blue 700 primary buttons, Blue 200 links, and Blue 400 highlights. The complete supplied Material Blue 50–900 palette remains available as design tokens. Navigation follows the established Fluent-referenced structure, with system typography and WCAG 2.2 AA as a target. Browser checks and visual review are recorded in the verification note; a comprehensive accessibility audit has not been performed.

## Learning progress

The new workspace uses its own key: `dotnet-ai-workspace-progress-v1`. It does not reinterpret the original academy’s day checkmarks. “Read” is self-reported; “Check” records a correct answer; the lab milestone is self-reported.

Progress stays in the browser for the current origin/file location. It does not automatically follow you to another browser, URL, device, or copy of the website. Use **My progress → Export progress** to back it up, and **Import backup** to restore. Import and reset ask before replacing data.

## Source structure

```text
index.html                      Website shell and semantic navigation
styles.css                      Tokens, desktop layout, mobile layout, focus styles
assets/
  curriculum.js                 Canonical authored lessons and proposed course map
  learning-core.js              Grading, prerequisites, progress and import validation
  experiments.js                Offline teaching exercises
  home.js                       Landing page: purpose, audience, usage and next step
  workspace.js                  Views, routing, navigation, backup and browser storage
labs/supportdesk-rules/          Runnable C# lab, verification cases and README
FOUNDATION_LESSONS.md            Generated readable edition of the new lessons
standalone.html                 Generated portable edition, including lab downloads
scripts/
  serve.cjs                     Optional local development host
  build-standalone.cjs           Generates standalone HTML and new lesson Markdown
tests/
  learning.test.cjs              Node tests for learning/progress behavior
  browser.cjs                   Real Chromium interaction and responsive checks
docs/superpowers/                Approved design, plan, and verification notes
original-v2/                    Untouched copy of all nine original ZIP files
```

The root `app.js`, `course-data.js`, `course-data.json`, `AI_LEARNING_ROADMAP.md`, and `DEVELOPER_HANDOFF_COMPLETE.md` remain original handoff material. The new entry point does **not** load that application or curriculum. Use **original-v2/index.html** for a complete, unchanged original experience.

## Maintain and verify

Edit the canonical sources in `assets/`, then regenerate derived editions:

```shell
node scripts/build-standalone.cjs
node --test tests/learning.test.cjs
dotnet run --project labs/supportdesk-rules -- --verify
```

For browser checks, start the local host in a separate terminal and run `node tests/browser.cjs`. The test uses an installed Playwright package or the bundled Codex runtime package on this machine. Other machines need Playwright and Chromium installed to run that developer-only check. Learners do not need Node or Playwright.

Verification screenshots/results are generated in ignored `.artifacts/`; C# build output is also ignored. No Git commit or publication is included in this delivery.

## Design references

- [Fluent 2 layout](https://fluent2.microsoft.design/layout)
- [Fluent 2 accessibility](https://fluent2.microsoft.design/accessibility)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Microsoft Learn: AI in .NET](https://learn.microsoft.com/en-us/dotnet/ai/overview)
- [Microsoft Learn: ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/mldotnet-api)
