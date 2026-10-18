# SupportDesk semantic-search lab

An independent .NET 10 Blazor InteractiveServer app using only the ASP.NET Core shared framework. All six help articles are fictional. The app retrieves article records; it does not generate an answer.

## Run

Install the .NET 10 SDK. Extract the complete ZIP, keep its folder structure and open a terminal beside `SupportDesk.SemanticSearch.csproj`:

```powershell
dotnet --version
dotnet run
```

Open http://localhost:5109 after the listener starts. The app binds only to `127.0.0.1`. Wait for the Search articles button to become enabled: controls are gated by the interactive `OnAfterRender` lifecycle, not just prerendered markup. Stop with Ctrl+C.

There are no package references. `NuGet.Config` clears package sources; the installed SDK/shared framework supplies everything needed. No appsettings, user secrets, provider keys, model download, database or external service is required. First SDK use can perform its own initialization separately from the app. The running app communicates only with its local browser through Blazor.

If port 5109 is occupied, set the sole optional app environment value in PowerShell:

```powershell
$env:SEARCH_LAB_PORT='5110'
dotnet run
```

Open http://localhost:5110. Only ASCII digits representing 1024–65535 are accepted; empty, signed, whitespace, out-of-range or URL-shaped settings fail before creating a host. To restore the default for later runs:

```powershell
Remove-Item Env:SEARCH_LAB_PORT
```

## Explore

1. Query **money back**, mode **Keyword**, category **All**: no matches. Token matching is case-insensitive ASCII alphanumeric token overlap, not substring matching or BM25.
2. Switch to **Toy vector** and search: **ART-101, Request a refund**, cosine **1.0000**. Query vector **[2,0,0,0]**, stored article vector **[1,0,0,0]**, dimensions **4**, space **toy-topics/v1/4**.
3. Switch to **Hybrid**: ART-101 score **0.6500**, cosine **1.0000**, keyword **0.0000**. Query **refund** instead: both components and hybrid score **1.0000**.
4. Query **refund password**, vector mode, category **Account**, k **1**: **ART-201**. Category filtering precedes scoring and top-k; ordinal article IDs resolve ties. Changing k does not reduce the number of eligible vectors scored.
5. Select **toy-topics/v2/4**: explicit model-space mismatch, no stale results. Equal dimensions do not make different mappings compatible. The three-dimensional space option is also rejected.
6. Empty query: explanatory validation error. **reimburse me** or **unmapped vocabulary**: no toy vector match. **money back** filtered to Account: no results. Changing search controls clears previous ranks until another search.
7. Arithmetic panel: query [1,0] versus [2,0] gives 1, [0,1] gives 0, [1,1] gives approximately 0.7071, [-1,0] gives -1. A zero vector has mathematically undefined cosine; the explicit safe lab policy returns 0. Search excludes scores at or below zero.

## Representation and ranking

The four axes are **refund, invoice, account, technical**. Stored vectors are hand-assigned, while query vectors count explicit recognized tokens. The refund axis recognizes refund/refunds/money/back/return/returning/payment/cancellation. Invoice recognizes invoice/invoices/receipt/billing. Account recognizes password/reset/login/locked/unlock/account/access. Technical recognizes export/csv/sync/transfer/file. Unknown words contribute nothing. No stemming or general language understanding occurs.

These are toy deterministic topic/synonym vectors, **not pretrained or trained embeddings**. There is no LLM generation, SDK call, MCP network integration or persisted provider model. A real embedding model learns a representation through training; our visible rules only illustrate how representation affects ranking.

Keyword = number of unique query tokens present in the article title/body divided by the number of unique query tokens. Hybrid = **0.65 × max(0, cosine) + 0.35 × keyword**. This is a local teaching formula, not provider scoring, reciprocal rank fusion or a probability of correctness. The app displays both components in every mode.

The algorithm is a **prefiltered exact in-memory scan**, not an ANN index. It validates stored model space and dimensions, applies category filtering, scores every eligible vector, drops nonpositive matches, sorts by descending score then ordinal ID and takes k. Scoring is O(n×d) plus matching-result sorting O(m log m). HNSW or another approximate index is not implemented. An exact baseline can support future recall/latency comparisons.

## Bounds and temporary state

- Query: 1–240 UTF-16 code units including a non-whitespace character; repeated tokens count once for keyword scoring but each recognized occurrence contributes to a toy vector.
- Top-k: integer 1–6. Category and mode must be allowlisted. Stored article list: at most 100; current corpus is six.
- General cosine: 1–4096 finite float coordinates, equal dimensions; lab search requires exactly four and space `toy-topics/v1/4` for query and articles. Floats widen to double before multiplication. Zero-vector policy is safe 0 after validation.
- Interactive transport envelope: 128 KiB, independently larger than the 240-character query boundary. C# enforces the query limit even if browser controls are bypassed.
- Hosting uses `CreateEmptyBuilder`, explicit Kestrel loopback binding, `UseStaticWebAssets`, and `MapStaticAssets`. No broad configuration binding.
- Antiforgery data protection uses an ephemeral provider **and a separate in-memory XML key repository**, including key-manager warmup. The framework may log a generic warning about absent XML encryption; repository storage is only memory. Keys disappear on shutdown.
- Search results and UI state are memory only. No persistence, authentication, production authorization, tenant isolation, durable cache or operational service guarantees. The category picker is a learning filter, not an access-control boundary. Use only synthetic data.

## Verification

From the extracted project folder:

```powershell
dotnet run -- --verify
```

Verification runs the actual production `SearchEngine`, exits before creating the host/configuration and opens no listener. It needs neither a browser nor a model. It covers literal arithmetic, zero/empty/NaN/infinite/dimension inputs, extreme finite floats, synonym/lexical/hybrid differences, filters before k, stable ID ties, unknown queries, bounds, and same-size model-space mismatch.

From an academy source checkout, run these focused tests from the academy root (Node.js required; browser scripts use Playwright, with the configured Codex runtime path as fallback):

```powershell
node --test tests/search.test.cjs
node tests/search-exercises.cjs
node tests/search-app-browser.cjs http://localhost:5109
```

Start this lab in a separate terminal before the final command and stop it afterwards. The browser script accepts a URL argument, including an alternate local port; it refuses non-loopback hostnames. It tests real interactive events, article IDs, numeric scores, filters, mismatch/error states, arithmetic, keyboard focus, 44px targets and 320px overflow. The exercises script mounts all six real browser experiments without requiring shared academy integration. These Node scripts are academy-source tests, not files in the standalone ZIP.

## Complete source manifest

```text
SupportDesk.SemanticSearch.csproj
NuGet.Config
Program.cs
Components/App.razor
Components/Routes.razor
Components/_Imports.razor
Components/Pages/Home.razor
Services/SearchEngine.cs
Services/LabPort.cs
Services/SessionDataProtection.cs
Verification/Verify.cs
wwwroot/app.css
README.md
```

Generated `bin/` and `obj/` are not source downloads. Main academy integration owns ZIP packaging; the complete archive is `downloads/supportdesk-semantic-search.zip`.

## Primary references

- [C# arrays](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/arrays)
- [Cosine similarity API and maths](https://learn.microsoft.com/en-us/dotnet/api/system.numerics.tensors.tensorprimitives.cosinesimilarity) — reference only; no tensor package is installed.
- [Embeddings in .NET](https://learn.microsoft.com/en-us/dotnet/ai/conceptual/embeddings)
- [Vector fields and index configuration](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-create-index)
- [Exact KNN and HNSW ranking](https://learn.microsoft.com/en-us/azure/search/vector-search-ranking)
- [Hybrid retrieval](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview) — service scoring differs from this lab's explicit formula.
- [ASP.NET Core static assets](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/static-files?view=aspnetcore-10.0)
