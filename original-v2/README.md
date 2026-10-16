# .NET AI Engineering Academy — Version 2

A **complete, beginner-friendly, project-based AI learning website** built especially for people who already know **C#, ASP.NET Core, Blazor, SQL and Azure**.

No React, Python, Node build system, database or server is required to **use the learning website**. The **projects** introduce ML.NET, AI provider APIs, local vector databases, Microsoft Agent Framework and Azure gradually as needed.

## Start in under 60 seconds

1. Extract the ZIP file to any folder on your machine.
2. Double-click **`index.html`** in Microsoft Edge or Google Chrome.
3. Select **Start learning** to open **Day 1**.
4. Read **Understand it first**, complete **Try a tiny task**, verify **Check your result**, and tick the **Day complete** checkbox.
5. Press **Day 2**, and keep going until Day 360. Use the module page to see the deeper explanation, .NET analogy and C# starter example.

If you prefer one file without a folder, open **`dotnet-ai-academy-v2-standalone.html`**. Its entire design, course and scripts are embedded within the HTML file.

### How long does it take?

- Day 1 through Day 360 means **360 learning sessions**, **not a fixed 360-calendar-day commitment**.
- Some sessions are short (a diagram, tiny C# snippet or a review); project days may take multiple sittings.
- You can study at your own pace, repeat a topic and take rest days. There is **no “first 30 days only” cutoff**.
- Don't move forward until you can explain the concept in your own words and show the expected output.

## What's included

| Component | Count | Purpose |
| --- | ---: | --- |
| Phases | 12 | Foundations → applied engineering → advanced production |
| Modules | 72 | One small topic at a time, always ordered |
| Individual days | 360 | Each has *what it means → task → proof → references* |
| C# starter illustrations | 72 | One per module; snippets are explained as starter/architecture examples |
| Project milestones | 18 | Small ML.NET apps → chat → RAG → agents → final Azure platform |
| Plain-English glossary concepts | 208 | Searchable definitions in developer-friendly language |
| Official external resources | 51 | Microsoft Learn, Azure docs, GitHub C# samples, protocols and more |
| Optional advanced pathways | 12 | Specializations beyond the core full-stack engineering path |

## Course stages

1. **Days 001–030: Understand AI from scratch.** AI vs rules, ML vs GenAI, data labels, choosing a problem and safe C# setup.
2. **Days 031–060: Friendly math.** Vectors with `float[]`, cosine similarity, probability, precision and recall, fairness.
3. **Days 061–090: Traditional machine learning.** Train, test and deploy ML.NET sentiment/classification and regression services.
4. **Days 091–120: Neural network and LLM intuition.** Weights, attention, tokens, inference, context and limitations.
5. **Days 121–150: LLMs in C#.** Model APIs, credentials, prompt roles, history, streaming, ASP.NET and Blazor.
6. **Days 151–180: Reliable AI features.** Prompting, context engineering, typed JSON, validation, AI UI patterns, safety.
7. **Days 181–210: Tools and embeddings.** Function calling, authorization, embeddings, semantic search and vector databases.
8. **Days 211–240: Search and first RAG.** BM25, hybrid search, parsing documents, chunks, evidence and citations.
9. **Days 241–270: Better production RAG.** Retrieval evaluation, reranking, tenant security, freshness and Microsoft.Extensions.AI.
10. **Days 271–300: Agents and MCP.** Tool vs agent, memory, Agent Framework, approvals, workflows, MCP and A2A basics.
11. **Days 301–330: Multimodal and model depth.** Vision/OCR, speech, multi-input apps, Ollama, fine-tuning, ONNX and quantization.
12. **Days 331–360: Secure, measured production AI.** Security, evaluation, telemetry, cost, Azure deployment, CI/CD and full-stack capstone.

The course emphasizes **AI application engineering**, the natural progression for a .NET full-stack developer. Deeper ML research, transformer training, reinforcement learning and similar specialties appear as clearly optional pathways; it does **not** claim to encompass every research topic in all of AI.

## How the website works

- **Overview:** Continue your next unfinished day; see learning progress.
- **Day 1 → Day 360:** A dedicated, beginner-friendly screen for every single day; skip/jump/search if needed. Current module and phases are visible.
- **Learning path:** Browse all 72 modules by phase or difficulty; open .NET comparisons, sample code and day checklists. Checkboxes synchronize with the daily screen.
- **Build projects:** Follow all 18 projects in module order, with explicit acceptance criteria and official references.
- **AI glossary:** Search 208 unfamiliar concepts.
- **Setup & resources:** Copy C# setup commands, browse 51 reference links and discover optional specializations.
- **Progress:** Daily and project completion are stored in **your browser's localStorage**, not uploaded to a server.
- **Export/import:** Use **Setup & resources → Export progress** to save a JSON backup, and **Import progress** to restore it on another machine/browser.

**Version note:** Earlier 36-module/30-day starter progress has different lesson IDs. This V2 curriculum uses a new progress format and does not silently reinterpret earlier checkmarks. Keep your old progress archive if you need it.

## Files

```text
.NET AI Engineering Academy/
├── index.html                   # Multi-file website entry point
├── styles.css                   # Material Blue visual design + responsive layouts
├── app.js                       # UI interactions, routing and progress storage
├── course-data.js               # Full offline curriculum for website
├── course-data.json             # The same structured data for editing
├── standalone.html              # Fully self-contained website (same functionality)
├── AI_LEARNING_ROADMAP.md       # Every phase, every day, every project, all references
└── README.md                    # This guide
```

The multi-file site and standalone version are **vanilla HTML + CSS + JavaScript**, without external font/icon/CDN dependencies. External learning links require internet access, and actual AI API/cloud labs may incur costs. Many initial lessons can be completed entirely offline using .NET, fake data and console apps.

### Local progress notes

Most modern browsers allow localStorage for opened HTML files. Browser privacy policies may restrict it for `file://` URLs. If you see a progress-saving warning, open the folder using a simple local static web server or use the export/import buttons. Clearing browser site storage also clears checkmarks unless you have exported them.

## Suggested learner workspace

Your learning *code* goes in a separate repository:

```text
dotnet-ai-learning/
├── 01-foundations-mlnet/
├── 02-llm-console-chat/
├── 03-blazor-ai-playground/
├── 04-csharp-tool-calling/
├── 05-semantic-search/
├── 06-document-rag/
├── 07-advanced-rag-and-evaluation/
├── 08-agent-framework/
├── 09-mcp-tools/
├── 10-multimodal-and-local/
├── 11-azure-ai-platform/
├── tests/
└── README.md
```

Treat every project as familiar software engineering: commit code, write tests, document an architecture diagram, show API contracts and handle failure cases. **Never put API keys or real company/customer data in public GitHub repositories.**

## Key official references

- [.NET AI learning hub (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/ai/)
- [ML.NET C# sentiment analysis sample](https://github.com/dotnet/machinelearning-samples/tree/main/samples/csharp/getting-started/BinaryClassification_SentimentAnalysis)
- [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)
- [Official OpenAI .NET SDK](https://github.com/openai/openai-dotnet)
- [Microsoft.Extensions.AI (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai)
- [Azure Search RAG demo for C#](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)
- [Microsoft Agent Framework — .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet)
- [Official MCP C# SDK](https://github.com/modelcontextprotocol/csharp-sdk)
- [Microsoft Foundry docs](https://learn.microsoft.com/en-us/azure/foundry/)

Every module and day links to its relevant sources. Start with the single reference shown for the current lesson; don't try to consume every repository on Day 1.

---

**Getting started:** open `index.html` → click **Start learning** → complete **Day 001 — AI vs ordinary code**.
