# .NET AI Engineering Academy — Complete Day 1 to Day 360 Learning Guide

> A single, beginner-first, project-based learning journey for people who already know C#, ASP.NET Core, Blazor, SQL and Azure.

## How to follow this guide

Each **day is one learning session** (roughly 45–90 minutes). Day numbers are **not calendar deadlines**. If you need 3 days to understand Day 15, take 3 days. Do not race.

For each lesson: **(1) Read the idea. (2) Try the exact C#/.NET task. (3) Prove the result. (4) Check it off in the HTML website.** Every module is five sessions; every phase ends in a clear deliverable.

You need normal .NET development skills, **not Python**. Provider API access/cloud resources are introduced only when needed; use fake clients and synthetic data first. Paid cloud resources may incur costs; never commit credentials.

**Course:** 12 phases · 72 small modules · 360 guided learning sessions · 18 hands-on projects · 208 glossary concepts.

## Curriculum overview

- **Phase 01 — Start from zero: AI in everyday .NET apps** (Days 1–30, Beginner): Plain English first. Understand exactly when AI is useful—and when ordinary C# is better. Milestone: A short README explaining which customer-support features need AI, and which need only C#.
- **Phase 02 — Friendly math and reliable data** (Days 31–60, Beginner): Math you can feel through simple C# arrays and tests, with no calculus prerequisites. Milestone: A C# console tool for vector math, probability, data splitting and quality metrics.
- **Phase 03 — Build real machine learning with ML.NET** (Days 61–90, Beginner): Train and serve C# models to understand what inference really is. Milestone: A tested sentiment REST API plus three small ML.NET experiments.
- **Phase 04 — Understand neural networks and LLMs** (Days 91–120, Beginner): Explain the internals in simple words; you do not need to build a transformer. Milestone: A visual explanation of how text becomes tokens, vectors, attention and generated text.
- **Phase 05 — Make your first C# LLM application** (Days 121–150, Beginner): Now that the vocabulary is clear, call a real model and build a simple web interface. Milestone: A streamed C# chatbot and a basic Blazor chat page, with correct secret handling.
- **Phase 06 — Prompting, JSON and dependable AI endpoints** (Days 151–180, Beginner): Teach models a clear task and defend your .NET app against unpredictable output. Milestone: A support-ticket information extractor with typed JSON and tests.
- **Phase 07 — Connect AI to your C# code and semantic search** (Days 181–210, Intermediate): First let a model request safe actions. Next turn text into vectors and perform semantic search. Milestone: A database-backed order assistant and a product semantic-search API.
- **Phase 08 — Search fundamentals and your first RAG app** (Days 211–240, Intermediate): Build ingestion and retrieval separately, then combine them into evidence-grounded answers. Milestone: A file-upload PDF Q&A assistant with citations and honest “I do not know” answers.
- **Phase 09 — Make search and RAG production-ready** (Days 241–270, Intermediate): Measure retrieval before adding complexity, then secure, update and optimize the pipeline. Milestone: An enterprise RAG system with hybrid search, authorization and meaningful evaluation.
- **Phase 10 — Agents, stateful workflows and interoperable tools** (Days 271–300, Intermediate): Move from one tool request to safely controlled workflows—then learn the agent protocols. Milestone: A bounded support agent, a reviewer workflow and a C# MCP server/client.
- **Phase 11 — Beyond chat: multimodal, local and model internals** (Days 301–330, Advanced): Understand images, audio, local inference and when fine-tuning is appropriate. Milestone: One document/voice mini app and an evidence-based model-selection report.
- **Phase 12 — Secure, measure and ship an enterprise .NET AI platform** (Days 331–360, Advanced): Test security, evaluate quality, add telemetry and deploy with standard Azure engineering practices. Milestone: A documented, secured, observable Azure-hosted AI platform with CI/CD and an honest demo.

## The 360-session plan — no missing days

## Phase 01. Start from zero: AI in everyday .NET apps — Days 1–30

Plain English first. Understand exactly when AI is useful—and when ordinary C# is better. **Milestone:** A short README explaining which customer-support features need AI, and which need only C#.

### Module 01. What AI is (and is not) (Day 1–5)

**In simple words:** AI predicts or generates from patterns. Unlike an if-statement, output may vary.

**Think of it like .NET:** A normal C# service follows your explicit rules; an AI model uses patterns learned earlier.

**Example:** An order total uses ordinary C#; classifying a customer message may use ML.

**Build:** Create your AI vs normal code decision table

**Terms:** AI, Model, Deterministic code, Probabilistic output, Inference

#### Day 001: AI vs ordinary code

**What it means:** AI is not a replacement for every if/else. Use ordinary C# for exact business rules.

**Your small practical task:** List 5 existing web features; mark which need deterministic rules and which might benefit from AI.

**How you know you're done:** A table with 5 decisions

#### Day 002: What is a model?

**What it means:** A model is a reusable learned function: input in, prediction out.

**Your small practical task:** Draw Request → ASP.NET API → Model → Response. Label where your code validates inputs.

**How you know you're done:** One model call diagram

#### Day 003: Prediction is not a fact

**What it means:** Model answers can be wrong, so verification matters.

**Your small practical task:** Write a tiny C# endpoint that returns a fixed order total; contrast its certainty with sentiment prediction.

**How you know you're done:** Two outcomes compared

#### Day 004: When NOT to use AI

**What it means:** Exact arithmetic, authorization and transactions belong in code.

**Your small practical task:** Review 6 imagined feature requests and choose rules, ML or LLM for each.

**How you know you're done:** Six justified choices

#### Day 005: Explain AI to a teammate

**What it means:** Understanding beats memorizing buzzwords.

**Your small practical task:** Add a README: “AI is useful when …; ordinary C# wins when …” and give 3 examples.

**How you know you're done:** Three clear examples in README

**Starter illustration:**

```csharp
static decimal CalculateTotal(decimal price, int quantity)
    => price * quantity;
// This must be exact. An LLM is not needed for multiplication.
// Use AI for tasks like understanding the meaning of free-form text.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/), [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners)

---

### Module 02. AI, machine learning and generative AI (Day 6–10)

**In simple words:** AI is the big umbrella; ML learns patterns; generative AI creates new content.

**Think of it like .NET:** Vehicles → cars → electric cars: related categories, not the same thing.

**Example:** Spam detection is ML; drafting a support reply is generative AI.

**Build:** Draw the family tree with .NET examples

**Terms:** AI, Machine learning, Deep learning, Neural networks, Generative AI

#### Day 006: AI is the umbrella

**What it means:** AI includes search, planning, rules and machine learning.

**Your small practical task:** Draw AI as a large box, placing web recommendation and route planning inside.

**How you know you're done:** One AI category diagram

#### Day 007: Machine learning finds patterns

**What it means:** ML fits behavior to examples instead of hard-coded conditions.

**Your small practical task:** Compare 3 C# if/else examples with a trained spam detector on paper.

**How you know you're done:** A rules-vs-ML comparison

#### Day 008: Deep learning uses many layers

**What it means:** Deep learning is a subset of ML built from layered neural networks.

**Your small practical task:** Draw a simple network with input, hidden layer and output; do not derive equations.

**How you know you're done:** One annotated network sketch

#### Day 009: Generative AI makes content

**What it means:** GenAI can generate text, code, audio and images; generation is not validation.

**Your small practical task:** List where a product UI might create content, versus merely classify it.

**How you know you're done:** A 6-row examples table

#### Day 010: Choose the right family

**What it means:** The technique depends on the business task.

**Your small practical task:** Classify 10 tasks: rule, predictive ML, generative model or retrieval.

**How you know you're done:** 10 checked scenario choices

**Starter illustration:**

```csharp
enum SolutionType { CSharpRule, PredictiveML, GenerativeAI }
Console.WriteLine(SolutionType.CSharpRule); // exact order total
Console.WriteLine(SolutionType.PredictiveML); // predicted delivery delay
Console.WriteLine(SolutionType.GenerativeAI); // draft an email
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)

---

### Module 03. AI problem types before coding (Day 11–15)

**In simple words:** Classification, regression, clustering, recommendations and generation solve different problems.

**Think of it like .NET:** Think of choosing an ASP.NET endpoint: the response type tells you which operation you need.

**Example:** “Good/Bad” is classification; “delivery ETA” is regression.

**Build:** Build a task-to-model decision guide

**Terms:** Classification, Regression, Clustering, Recommendation, Generation

#### Day 011: Classification predicts a label

**What it means:** Labels are categories such as fraud/not fraud.

**Your small practical task:** Write a C# enum for ticket priority and invent 5 labelled examples.

**How you know you're done:** TicketPriority enum and examples

#### Day 012: Regression predicts a number

**What it means:** A regression model estimates a numeric value rather than a label.

**Your small practical task:** Create C# record OrderSize(decimal Total, int DaysToDeliver); identify target DaysToDeliver.

**How you know you're done:** One input-and-target record

#### Day 013: Clustering groups unlabeled data

**What it means:** You can group similar items even without known labels.

**Your small practical task:** Sort 12 imaginary support requests into groups without naming labels first.

**How you know you're done:** Three candidate clusters

#### Day 014: Recommendation ranks choices

**What it means:** Recommendations score and rank candidate items.

**Your small practical task:** Write a LINQ query ranking mock products by a simple rule; explain how ML ranking differs.

**How you know you're done:** A ranked C# list

#### Day 015: Generative vs predictive choice

**What it means:** Use a generator for natural-language creation and prediction for structured targets.

**Your small practical task:** Fill a technique decision table for 12 business use cases.

**How you know you're done:** A 12-case decision worksheet

**Starter illustration:**

```csharp
public record FeatureIdea(string Name, string Approach, string Reason);
var features = new[] {
    new FeatureIdea("Order total", "Rule", "Must be exact"),
    new FeatureIdea("Ticket sentiment", "ML", "Learn from examples"),
    new FeatureIdea("Email draft", "LLM", "Generate text")
};
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Microsoft ML for Beginners — conceptual](https://github.com/microsoft/ML-For-Beginners), [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners)

---

### Module 04. The whole AI application journey (Day 16–20)

**In simple words:** Separate data preparation, model training, inference and monitoring.

**Think of it like .NET:** Like your API build pipeline: prepare → build → deploy → observe.

**Example:** A sentiment classifier can be trained offline and served many times.

**Build:** Draw your first complete AI architecture

**Terms:** Data collection, Training, Validation, Inference, Monitoring

#### Day 016: Where data comes from

**What it means:** An ML model needs examples, labels and permissions to use them.

**Your small practical task:** Sketch sample customer reviews flowing into a CSV file.

**How you know you're done:** Review-data source diagram

#### Day 017: Training is a separate step

**What it means:** Training adjusts a model; it should not happen for every API request.

**Your small practical task:** Draw Train() happening before Deploy(), and Predict() happening inside ASP.NET.

**How you know you're done:** Training/inference comparison

#### Day 018: Inference means using a model

**What it means:** The API usually loads a ready model and predicts for a new request.

**Your small practical task:** Draft POST /api/predict request and response JSON contracts.

**How you know you're done:** One request/response contract

#### Day 019: Evaluation asks “is it good?”

**What it means:** Measure errors on unseen examples rather than trusting demo output.

**Your small practical task:** Add an Evaluation box between training and deployment in the diagram.

**How you know you're done:** A complete lifecycle diagram

#### Day 020: Monitoring never stops

**What it means:** Real data changes after deployment, so quality may fall.

**Your small practical task:** Write 3 things to log in a prediction service without collecting unnecessary PII.

**How you know you're done:** Three monitoring ideas

**Starter illustration:**

```csharp
public record AiRequest(string Input, string Task);
public record AiResult(string Answer, bool RequiresReview);
// Browser -> authenticated ASP.NET API -> AI service -> safe DTO.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/), [ML.NET sentiment classifier (C#)](https://github.com/dotnet/machinelearning-samples/tree/main/samples/csharp/getting-started/BinaryClassification_SentimentAnalysis)

---

### Module 05. Datasets, features, labels and data quality (Day 21–25)

**In simple words:** A bad dataset produces unreliable results regardless of the API framework.

**Think of it like .NET:** A DTO contains fields. A labelled row has feature fields and an expected answer.

**Example:** ReviewText is a feature; IsPositive is its label.

**Build:** Create a small, clean example dataset

**Terms:** Dataset, Feature, Label, Data quality, Data leakage

#### Day 021: One row is one example

**What it means:** Each dataset row represents one training or testing case.

**Your small practical task:** Create reviews.csv with Text,IsPositive columns and 12 short rows.

**How you know you're done:** 12-row CSV file

#### Day 022: Feature vs label

**What it means:** Feature is an input; label is what you want the model to predict.

**Your small practical task:** Mark each CSV column as input, label or irrelevant metadata.

**How you know you're done:** Column annotation

#### Day 023: Good and bad data

**What it means:** Duplicates, typos, mislabeled rows and imbalance matter.

**Your small practical task:** Insert 3 intentionally bad rows; then identify and remove them.

**How you know you're done:** Clean and dirty versions

#### Day 024: Avoid data leakage

**What it means:** A model should not peek at the answer through an input field.

**Your small practical task:** Pretend TicketResolution is the label; identify which columns would leak the answer.

**How you know you're done:** Leakage warning note

#### Day 025: Privacy first

**What it means:** Training data can contain names or secrets that you must not misuse.

**Your small practical task:** Replace names and emails in 5 support examples with fake placeholders.

**How you know you're done:** Synthetic privacy-safe CSV

**Starter illustration:**

```csharp
public record ReviewRow(string Text, bool IsPositive);
ReviewRow[] dataset = [
    new("Works beautifully", true),
    new("Crashes every morning", false)
];
// Text is the input feature. IsPositive is the expected label.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [ML.NET sentiment classifier (C#)](https://github.com/dotnet/machinelearning-samples/tree/main/samples/csharp/getting-started/BinaryClassification_SentimentAnalysis), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/)

---

### Module 06. Prepare your C# AI lab safely (Day 26–30)

**In simple words:** One repository and standard .NET tools are enough for the whole journey.

**Think of it like .NET:** Treat AI experiments as ordinary C# solutions with tests and clean secrets.

**Example:** No paid model is required to complete the first projects.

**Build:** Create dotnet-ai-learning with unit tests and safe configuration

**Terms:** .NET SDK, Git, User secrets, Dependency injection, xUnit

#### Day 026: Check your installed tools

**What it means:** Use the SDK you already know; verify it can compile a console and Web API.

**Your small practical task:** Run dotnet --info, dotnet new console -n Warmup, and dotnet run.

**How you know you're done:** Running console output

#### Day 027: Create one Git repository

**What it means:** Keep experiments versioned and review what changed.

**Your small practical task:** Create dotnet-ai-learning/, a solution, .gitignore and README.

**How you know you're done:** Local Git repo

#### Day 028: Understand configuration vs secrets

**What it means:** API keys do not belong in source, JavaScript, screenshots or commits.

**Your small practical task:** Create a demo config key using dotnet user-secrets; confirm it is absent from Git.

**How you know you're done:** Safe local configuration

#### Day 029: Create a test project

**What it means:** AI code still needs ordinary deterministic tests around it.

**Your small practical task:** Add an xUnit project that tests a small string helper.

**How you know you're done:** One passing C# test

#### Day 030: Finish your developer setup

**What it means:** You should be ready to run any upcoming small example without changing stacks.

**Your small practical task:** Commit the warmup solution, test and a short tools checklist.

**How you know you're done:** Repository setup complete

**Starter illustration:**

```csharp
dotnet --info
mkdir dotnet-ai-learning
cd dotnet-ai-learning
dotnet new sln -n DotNetAiLearning
dotnet new console -n Warmup -o src/Warmup
dotnet sln add src/Warmup/Warmup.csproj
dotnet run --project src/Warmup
# No AI API or money required yet.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/), [Microsoft Learn — Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis), [Microsoft Learn — .NET User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)

---

## Phase 02. Friendly math and reliable data — Days 31–60

Math you can feel through simple C# arrays and tests, with no calculus prerequisites. **Milestone:** A C# console tool for vector math, probability, data splitting and quality metrics.

### Module 07. Numbers, arrays, vectors and dimensions (Day 31–35)

**In simple words:** Vectors are just ordered numbers. They appear throughout ML and embeddings.

**Think of it like .NET:** A vector is a float[]; each position has meaning in that representation.

**Example:** A product represented by [price, weight, rating] has three dimensions.

**Build:** Build a vector playground using float[]

**Terms:** Scalar, Vector, Dimension, Norm, float[]

#### Day 031: Scalar vs vector

**What it means:** A scalar is one number; a vector is an ordered list of numbers.

**Your small practical task:** Write decimal price and float[] features for three products.

**How you know you're done:** Three vectors in C#

#### Day 032: Dimension is the length

**What it means:** A 3D vector has three values; embeddings can have hundreds or thousands.

**Your small practical task:** Write a method that prints vector Length and rejects an empty array.

**How you know you're done:** Vector-length helper

#### Day 033: Adding vectors

**What it means:** Matching positions can be added; differing dimensions are invalid.

**Your small practical task:** Implement Add(float[] a,float[] b) with validation.

**How you know you're done:** Working Add() method

#### Day 034: Magnitude or norm

**What it means:** Magnitude summarizes vector length; it helps normalize values.

**Your small practical task:** Calculate sqrt(sum(x*x)) using a for loop for [3,4].

**How you know you're done:** Norm = 5

#### Day 035: Explain a vector

**What it means:** You do not need advanced math to use vectors safely.

**Your small practical task:** Test 0 vector, 1D vector and mismatched dimensions with xUnit.

**How you know you're done:** Three passing vector tests

**Starter illustration:**

```csharp
float[] product = [1500f, 1.2f, 4.8f];
Console.WriteLine($"Dimension: {product.Length}");
// A real text embedding might have hundreds of dimensions.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners)

---

### Module 08. Dot product and cosine similarity (Day 36–40)

**In simple words:** Similarity tells you whether two vectors point in similar directions.

**Think of it like .NET:** Dot product compares matching array positions; cosine adjusts for length.

**Example:** [1,0] and [0,1] are not similar in direction.

**Build:** Implement tested cosine similarity in C#

**Terms:** Dot product, Cosine similarity, Euclidean distance, Normalization, Similarity score

#### Day 036: Dot product is multiply-and-add

**What it means:** Dot product multiplies corresponding values and adds results.

**Your small practical task:** Implement Dot(a,b) with a for loop; calculate [1,2] dot [3,4].

**How you know you're done:** Dot product = 11

#### Day 037: Cosine compares direction

**What it means:** Cosine similarity is dot divided by the product of lengths.

**Your small practical task:** Implement Cosine(a,b) without calling an AI API.

**How you know you're done:** Cosine method compiled

#### Day 038: Related and unrelated

**What it means:** Identical directions score near 1; perpendicular vectors score 0.

**Your small practical task:** Compare [1,0] with [2,0] and [0,1].

**How you know you're done:** Expected similarity values

#### Day 039: Edge cases matter

**What it means:** Zero vectors and mismatched lengths need explicit behavior.

**Your small practical task:** Add unit tests for zero vector, dimension mismatch and negative values.

**How you know you're done:** Four passing similarity tests

#### Day 040: Connect vectors to future search

**What it means:** An embedding will later replace your hand-written product features.

**Your small practical task:** Write a paragraph explaining why cosine sorting can rank products.

**How you know you're done:** Plain-English similarity note

**Starter illustration:**

```csharp
static double Cosine(float[] a, float[] b)
{
    if (a.Length == 0 || a.Length != b.Length)
        throw new ArgumentException("Vectors must share a nonzero length");
    double dot = 0, normA = 0, normB = 0;
    for (int i = 0; i < a.Length; i++)
    {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return normA == 0 || normB == 0 ? 0 : dot / Math.Sqrt(normA * normB);
}
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [pgvector-dotnet](https://github.com/pgvector/pgvector-dotnet), [.NET AI samples](https://github.com/dotnet/ai-samples)

---

### Module 09. Simple statistics and probability (Day 41–45)

**In simple words:** Models use patterns that are uncertain, so probability and sampling help you reason about quality.

**Think of it like .NET:** An API latency average hides slow requests; statistics shows the distribution.

**Example:** 10% of 100 orders = 10 delayed orders on average, not a guarantee.

**Build:** Create a tiny C# statistics utility

**Terms:** Mean, Median, Probability, Distribution, Sample bias

#### Day 041: Average, median and spread

**What it means:** Mean, median and standard deviation describe data differently.

**Your small practical task:** Compute mean and median for order delivery times in a float[].

**How you know you're done:** Mean and median output

#### Day 042: What probability means

**What it means:** Probability is a number between 0 and 1, not a promise of truth.

**Your small practical task:** Simulate 100 random coin flips with Random and count heads.

**How you know you're done:** Observed fraction report

#### Day 043: Sampling changes results

**What it means:** Small or biased samples may mislead.

**Your small practical task:** Compare random 10 reviews against 100 reviews in two quick tests.

**How you know you're done:** Two sample-size observations

#### Day 044: Distributions and outliers

**What it means:** Unusual values can shift your average.

**Your small practical task:** Add a 100-day delivery outlier; compare mean and median.

**How you know you're done:** Outlier experiment

#### Day 045: Explain uncertainty to a user

**What it means:** Confidence can be poorly calibrated; avoid claiming certainty.

**Your small practical task:** Write 3 user-friendly statements that do not overpromise probability.

**How you know you're done:** Three safe UI strings

**Starter illustration:**

```csharp
float[] values = [2, 3, 3, 4, 100];
Console.WriteLine($"Mean: {values.Average()}");
var sorted = values.Order().ToArray();
Console.WriteLine($"Median: {sorted[sorted.Length/2]}");
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft ML for Beginners — conceptual](https://github.com/microsoft/ML-For-Beginners), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/)

---

### Module 10. Training, validation, testing and leakage (Day 46–50)

**In simple words:** A model must be tested on examples it did not memorize.

**Think of it like .NET:** A student practicing from the answer sheet may score well but learn nothing.

**Example:** Training accuracy 99% and test accuracy 55% is a red flag.

**Build:** Build a deterministic dataset splitter

**Terms:** Training split, Validation split, Test split, Overfitting, Leakage

#### Day 046: Why split data?

**What it means:** Training and evaluation need separate examples.

**Your small practical task:** Split a list of 100 sample IDs into 80 train and 20 test items.

**How you know you're done:** 80/20 split report

#### Day 047: Validation is for choices

**What it means:** Validation helps compare settings without using your final test set.

**Your small practical task:** Split 100 IDs into 70 train, 15 validation and 15 test.

**How you know you're done:** 70/15/15 split

#### Day 048: What overfitting looks like

**What it means:** Memorizing training examples can harm performance on new inputs.

**Your small practical task:** Write a simple “lookup table” predictor that fails on unknown review text.

**How you know you're done:** One deliberately overfit predictor

#### Day 049: Underfitting is too simple

**What it means:** A model that cannot learn patterns performs poorly everywhere.

**Your small practical task:** Use a constant predictor and compare correct vs wrong labels.

**How you know you're done:** Constant-baseline results

#### Day 050: Prevent leaks and duplicate rows

**What it means:** Duplicates across splits make accuracy look better than it is.

**Your small practical task:** Add a check that train/test IDs do not overlap; write a test.

**How you know you're done:** No-overlap xUnit test

**Starter illustration:**

```csharp
// Keep separate train, validation and test examples.
// Never copy a labeled answer into model input features.
// Compare model predictions on unseen TEST data only.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Microsoft Learn — ML.NET classification](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/sentiment-analysis)

---

### Module 11. Understand classifier metrics (Day 51–55)

**In simple words:** Accuracy alone hides mistakes, especially when most cases have the same label.

**Think of it like .NET:** A smoke alarm is evaluated on missed fires AND false alarms.

**Example:** A model claiming “no fraud” can be 99% accurate on rare fraud cases.

**Build:** Print a confusion matrix and F1 in C#

**Terms:** Confusion matrix, Precision, Recall, F1 score, Accuracy

#### Day 051: Four prediction outcomes

**What it means:** TP, TN, FP and FN record right/wrong classifications.

**Your small practical task:** Create 8 truth/prediction pairs and count TP,TN,FP,FN.

**How you know you're done:** 2x2 confusion matrix

#### Day 052: Precision means false alarm control

**What it means:** High precision means predicted positives are usually right.

**Your small practical task:** Compute precision = TP/(TP+FP) for your 8 cases.

**How you know you're done:** Precision calculation

#### Day 053: Recall means missed-case control

**What it means:** High recall means you find most actual positives.

**Your small practical task:** Compute recall = TP/(TP+FN) and discuss missed urgent tickets.

**How you know you're done:** Recall calculation

#### Day 054: F1 balances precision and recall

**What it means:** F1 summarizes precision/recall tradeoff; accuracy is different.

**Your small practical task:** Add F1 and accuracy methods with divide-by-zero handling.

**How you know you're done:** Metric helper tests

#### Day 055: Pick a metric for the product

**What it means:** Business cost determines whether false positives or negatives are worse.

**Your small practical task:** Write why recall may matter for fraud and precision for auto-refund approvals.

**How you know you're done:** Two metric decisions

**Starter illustration:**

```csharp
double tp = 8, fp = 2, fn = 4;
double precision = tp / (tp + fp);
double recall = tp / (tp + fn);
double f1 = 2 * precision * recall / (precision + recall);
Console.WriteLine($"Precision={precision:F2}, Recall={recall:F2}, F1={f1:F2}");
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Microsoft Learn — ML.NET classification](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/sentiment-analysis)

---

### Module 12. Bias, fairness, privacy and good decisions (Day 56–60)

**In simple words:** Data and model errors can affect people, so responsible AI starts early.

**Think of it like .NET:** A C# feature is not “fair” just because it compiles.

**Example:** A support model might work worse on short messages or another language.

**Build:** Write a responsible-use checklist for your ML API

**Terms:** Fairness, Bias, Privacy, Human oversight, Model card

#### Day 056: Representative data

**What it means:** Training data should resemble users and situations you serve.

**Your small practical task:** List 5 customer groups or writing styles absent from your sample CSV.

**How you know you're done:** Five coverage gaps

#### Day 057: Bias is not one number

**What it means:** A model may perform differently for different types of input.

**Your small practical task:** Group mock review outputs by length and compute accuracy separately.

**How you know you're done:** Two-group comparison

#### Day 058: Private data needs boundaries

**What it means:** Names, email, order details and secrets must be protected.

**Your small practical task:** Annotate your sentiment DTO with PII fields to avoid logging.

**How you know you're done:** PII field inventory

#### Day 059: Human review for high impact

**What it means:** Models should not autonomously make high-impact decisions.

**Your small practical task:** Design a review queue for uncertain refund classifications.

**How you know you're done:** Approval-flow diagram

#### Day 060: Write a tiny model card

**What it means:** Document purpose, training data, limits, metrics and failure cases.

**Your small practical task:** Create MODEL_CARD.md for your mock sentiment classifier.

**How you know you're done:** One-page model card

**Starter illustration:**

```csharp
public record TestReview(string Text, string Language);
var reviews = new[] {
    new TestReview("Works well", "en"),
    new TestReview("Très bon", "fr")
};
// Compare quality by language. Never train on private customer data casually.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Responsible AI resources](https://www.microsoft.com/en-us/ai/responsible-ai), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)

---

## Phase 03. Build real machine learning with ML.NET — Days 61–90

Train and serve C# models to understand what inference really is. **Milestone:** A tested sentiment REST API plus three small ML.NET experiments.

### Module 13. ML.NET: first binary classifier (Day 61–65)

**In simple words:** Binary classification predicts one of two labels and is a simple way to learn training.

**Think of it like .NET:** A support-ticket filter predicts urgent/not urgent, like a learned rule.

**Example:** Positive vs negative review prediction.

**Build:** Run the official ML.NET sentiment sample

**Terms:** MLContext, IDataView, Text featurization, Fit(), Predict()

#### Day 061: Explore the official sample

**What it means:** The Microsoft C# sample trains and uses a sentiment classifier.

**Your small practical task:** Open BinaryClassification_SentimentAnalysis and identify its .csproj, dataset and Program.cs.

**How you know you're done:** Source file map

#### Day 062: Create your training CSV

**What it means:** Labels should be consistent across examples.

**Your small practical task:** Create 60 fake positive/negative product reviews in reviews.csv.

**How you know you're done:** 60 synthetic rows

#### Day 063: Load data into ML.NET

**What it means:** MLContext coordinates data loading, transforms, training and evaluation.

**Your small practical task:** Add Microsoft.ML; load a small CSV into an IDataView.

**How you know you're done:** Rows loaded in console

#### Day 064: Train the sentiment pipeline

**What it means:** Text featurization converts words into numeric inputs for a classifier.

**Your small practical task:** Follow the official pipeline and train on your CSV.

**How you know you're done:** Saved trained model

#### Day 065: Make predictions

**What it means:** Prediction uses your trained model; it does not retrain on each call.

**Your small practical task:** Predict 8 new examples and print predicted label and score.

**How you know you're done:** Eight test predictions

**Starter illustration:**

```csharp
dotnet new console -n SentimentTrainer
dotnet add SentimentTrainer/SentimentTrainer.csproj package Microsoft.ML
# Then follow the BinaryClassification_SentimentAnalysis C# sample.
# It includes load -> train -> evaluate -> save -> predict.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [ML.NET sentiment classifier (C#)](https://github.com/dotnet/machinelearning-samples/tree/main/samples/csharp/getting-started/BinaryClassification_SentimentAnalysis), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Microsoft Learn — ML.NET classification](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/sentiment-analysis)

---

### Module 14. Improve and evaluate your classifier (Day 66–70)

**In simple words:** Training is only half the job; you need honest testing and error inspection.

**Think of it like .NET:** Just like unit tests, evaluate scenarios the model has not seen.

**Example:** “Not terrible” is harder than “Fantastic!” for naive sentiment.

**Build:** Compare baseline and improved ML.NET pipelines

**Terms:** TrainTestSplit, BinaryClassification.Evaluate, Baseline, Error analysis, F1 score

#### Day 066: Hold out unseen data

**What it means:** Training and test rows must be separate.

**Your small practical task:** Use TrainTestSplit and record exact row counts.

**How you know you're done:** Split counts in README

#### Day 067: Calculate useful metrics

**What it means:** Report F1, precision, recall and confusion, not accuracy alone.

**Your small practical task:** Run ML.NET Evaluate; save metrics to a text report.

**How you know you're done:** Baseline metrics table

#### Day 068: Find wrong predictions

**What it means:** Inspect examples that were classified incorrectly.

**Your small practical task:** Record at least 5 false positives or false negatives.

**How you know you're done:** Five failure examples

#### Day 069: Improve one thing only

**What it means:** Change training rows or preprocessing before adding complexity.

**Your small practical task:** Add 20 diverse samples, retrain and compare metrics.

**How you know you're done:** Before/after comparison

#### Day 070: Decide when to stop

**What it means:** A reliable modest baseline is better than an unmeasured complex model.

**Your small practical task:** Write the biggest limitation and whether model quality improved.

**How you know you're done:** Evaluation README

**Starter illustration:**

```csharp
var trainIds = new HashSet<int>(Enumerable.Range(1, 80));
var testIds = new HashSet<int>(Enumerable.Range(81, 20));
Console.WriteLine(trainIds.Overlaps(testIds)); // False
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [Microsoft Learn — ML.NET classification](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/sentiment-analysis), [ML.NET official sample repository](https://github.com/dotnet/machinelearning-samples)

---

### Module 15. Serve a trained model through ASP.NET Core (Day 71–75)

**In simple words:** An API should load a trained model and safely score input.

**Think of it like .NET:** Treat a model as a dependency injected service behind a DTO and endpoint.

**Example:** POST /api/sentiment returns label and confidence-like score.

**Build:** Build your ML.NET Sentiment REST API

**Terms:** Model serving, ASP.NET Core API, Dependency injection, Input validation, Inference

#### Day 071: Create your prediction API

**What it means:** The Web API receives text and returns typed JSON.

**Your small practical task:** Run dotnet new webapi -n SentimentApi and add a request/response record.

**How you know you're done:** Running POST endpoint

#### Day 072: Load model once

**What it means:** Model loading belongs at app startup, not on every request.

**Your small practical task:** Register a model-scoring service through ASP.NET dependency injection.

**How you know you're done:** DI-based scorer service

#### Day 073: Add input validation

**What it means:** Empty or extremely large texts are not valid predictions.

**Your small practical task:** Reject blank strings and add sensible maximum input length.

**How you know you're done:** 400 response for bad text

#### Day 074: Write deterministic API tests

**What it means:** You can test request handling without a real training run every time.

**Your small practical task:** Mock ITextClassifier and test HTTP status codes.

**How you know you're done:** API endpoint tests

#### Day 075: Demonstrate the whole ML loop

**What it means:** You should explain train → save → load → infer.

**Your small practical task:** Record a short GIF or README example with valid and invalid requests.

**How you know you're done:** Sentiment REST API complete

**Starter illustration:**

```csharp
// IClassifier is an application-owned interface.
app.MapPost("/api/sentiment", (ReviewRequest request, IClassifier classifier) =>
{
    if (string.IsNullOrWhiteSpace(request.Text))
        return Results.BadRequest("Text is required");
    return Results.Ok(classifier.Predict(request.Text));
});
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [ML.NET official sample repository](https://github.com/dotnet/machinelearning-samples)

---

### Module 16. Regression with ML.NET (Day 76–80)

**In simple words:** Regression predicts a number such as a forecast or price.

**Think of it like .NET:** It is like decimal-returning API logic, except the parameters are learned.

**Example:** Predict shipping duration from item count, distance and weight.

**Build:** Build a delivery ETA predictor

**Terms:** Regression, Continuous label, MAE, RMSE, Feature pipeline

#### Day 076: Define a numeric target

**What it means:** Regression has a continuous numeric label.

**Your small practical task:** Create a DeliveryRow(float DistanceKm,float WeightKg,float DeliveryDays) record.

**How you know you're done:** Typed numeric dataset

#### Day 077: Create sample data

**What it means:** Inputs should be plausible and not leak the target.

**Your small practical task:** Create 100 synthetic examples covering light/heavy and near/far deliveries.

**How you know you're done:** 100-row delivery dataset

#### Day 078: Train a regression model

**What it means:** Use an ML.NET regression trainer and feature concatenation.

**Your small practical task:** Adapt the official regression sample to your DeliveryRow type.

**How you know you're done:** Trained ETA model

#### Day 079: Measure numeric errors

**What it means:** MAE and RMSE express how far predictions deviate from the truth.

**Your small practical task:** Evaluate and compare MAE with predicting the average day count.

**How you know you're done:** Baseline-vs-model errors

#### Day 080: Expose one endpoint

**What it means:** An estimated ETA should show that it is only an estimate.

**Your small practical task:** Add POST /api/estimate-delivery and one test for nonsensical inputs.

**How you know you're done:** Working ETA endpoint

**Starter illustration:**

```csharp
public record DeliveryFeatures(float DistanceKm, float WeightKg);
public record DeliveryPrediction(float EstimatedDays);
// Example target is 2.4 days — not a True/False class label.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [ML.NET official sample repository](https://github.com/dotnet/machinelearning-samples)

---

### Module 17. Clustering and recommendations in .NET (Day 81–85)

**In simple words:** Not all ML is trained from correct labels.

**Think of it like .NET:** Think grouping customers by behavior without knowing group names ahead of time.

**Example:** Two users with similar purchase patterns may like similar items.

**Build:** Make two small recommendation experiments

**Terms:** Unsupervised learning, K-means, Collaborative filtering, Cold start, Ranking

#### Day 081: Supervised vs unsupervised

**What it means:** Clustering groups examples without predefined target labels.

**Your small practical task:** Draw six two-dimensional product points on paper in two obvious groups.

**How you know you're done:** An unlabeled grouping

#### Day 082: K-means idea

**What it means:** K-means repeatedly updates group centers; exact cluster names are arbitrary.

**Your small practical task:** Follow an ML.NET KMeans example with a tiny numeric dataset.

**How you know you're done:** Two or three product groups

#### Day 083: Recommendation is ranking

**What it means:** Collaborative filtering uses user-item relationships.

**Your small practical task:** Make a fake user-product purchase matrix with 4 users and 8 products.

**How you know you're done:** User-product matrix

#### Day 084: Start with easy LINQ

**What it means:** A popularity recommender is a useful baseline.

**Your small practical task:** Implement top-3 popular products using LINQ, excluding already purchased products.

**How you know you're done:** Baseline recommender

#### Day 085: Explain limits

**What it means:** Cold starts and feedback loops cause challenges.

**Your small practical task:** Write why popularity is poor for brand-new products and how richer data helps.

**How you know you're done:** Two recommender limitations

**Starter illustration:**

```csharp
public record ProductPoint(string Name, float Price, float WeightKg);
ProductPoint[] products = [
    new("Mouse", 20, .2f), new("Laptop", 900, 1.6f)
];
// A clustering algorithm would group similar points. This is the data.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/), [ML.NET official sample repository](https://github.com/dotnet/machinelearning-samples)

---

### Module 18. Forecasting, anomalies and classic ML alternatives (Day 86–90)

**In simple words:** Many business predictions need only lightweight ML, not a large language model.

**Think of it like .NET:** Forecast monthly sales like monitoring request volume in Application Insights.

**Example:** Estimate next month’s demand or flag unusual invoice sizes.

**Build:** Build a tiny forecasting/anomaly lab

**Terms:** Time series, Forecast, Anomaly detection, Temporal leakage, Baseline

#### Day 086: What is a time series?

**What it means:** Time-ordered data needs special handling to avoid seeing the future.

**Your small practical task:** Create 12 months of fake sales in a C# list.

**How you know you're done:** 12-point sales series

#### Day 087: Forecasting vs regression

**What it means:** A forecast predicts future values using the past.

**Your small practical task:** Compute a three-month moving average baseline.

**How you know you're done:** Simple forecast

#### Day 088: What is an anomaly?

**What it means:** Anomalies are observations far from normal patterns.

**Your small practical task:** Flag sales spikes exceeding your chosen simple threshold.

**How you know you're done:** Anomaly detector

#### Day 089: Why random split is risky

**What it means:** Shuffling future data into training can leak information.

**Your small practical task:** Use months 1–9 for development and 10–12 for testing.

**How you know you're done:** Time-ordered test split

#### Day 090: Choose classical ML first when possible

**What it means:** If output is a number or label, start with simple predictions.

**Your small practical task:** Make a decision table: forecast, anomaly, classification, summarization.

**How you know you're done:** ML-vs-LLM decision note

**Starter illustration:**

```csharp
double[] lastWeek = [20, 22, 21, 23, 24, 20, 190];
var baseline = lastWeek.Take(6).Average();
Console.WriteLine($"Typical: {baseline:F1}; Today: {lastWeek[^1]}");
// Real anomaly models learn distributions; this is only an intuition.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [ML.NET official sample repository](https://github.com/dotnet/machinelearning-samples), [Azure Machine Learning documentation](https://learn.microsoft.com/en-us/azure/machine-learning/), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/)

---

## Phase 04. Understand neural networks and LLMs — Days 91–120

Explain the internals in simple words; you do not need to build a transformer. **Milestone:** A visual explanation of how text becomes tokens, vectors, attention and generated text.

### Module 19. Neurons, weights, layers and loss (Day 91–95)

**In simple words:** Neural networks learn numerical weights that transform input toward desired predictions.

**Think of it like .NET:** Several small weighted calculations in layers act like nested C# transformations.

**Example:** A text classifier increases or decreases weights while learning.

**Build:** Write a tiny weighted-score experiment

**Terms:** Neuron, Weight, Layer, Loss function, Activation

#### Day 091: What is a neuron?

**What it means:** A neuron combines inputs, weights and a rule for producing output.

**Your small practical task:** Compute weighted sum w1*x1 + w2*x2 in a C# console.

**How you know you're done:** Weighted-sum output

#### Day 092: Layers reuse many neurons

**What it means:** Layers transform numerical representations step by step.

**Your small practical task:** Chain two small C# transformations using float arrays.

**How you know you're done:** Two-layer sketch

#### Day 093: Weights are learned values

**What it means:** Weights adjust during training, unlike constants written by a programmer.

**Your small practical task:** Change w1 and w2 manually and observe prediction change.

**How you know you're done:** Before/after output

#### Day 094: Loss tells how wrong

**What it means:** Loss is a numeric measure of prediction error.

**Your small practical task:** Compute squared error between target and prediction for 3 values.

**How you know you're done:** Three loss calculations

#### Day 095: Activation adds nonlinearity

**What it means:** Activation functions let networks fit patterns beyond straight lines.

**Your small practical task:** Implement simple ReLU (Math.Max(0,x)) and test negative inputs.

**How you know you're done:** ReLU method and 3 tests

**Starter illustration:**

```csharp
float x1 = 2, x2 = 3, w1 = .4f, w2 = -.1f;
float weightedSum = x1 * w1 + x2 * w2;
float relu = Math.Max(0, weightedSum);
Console.WriteLine(relu);
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners), [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/)

---

### Module 20. Training and backpropagation intuition (Day 96–100)

**In simple words:** Training changes weights to reduce error, usually using gradients and an optimizer.

**Think of it like .NET:** A thermostat adjusts a setting based on how far temperature is from target.

**Example:** Prediction too large → reduce the responsible weight slightly.

**Build:** Simulate learning a line with a single weight

**Terms:** Gradient, Gradient descent, Learning rate, Epoch, Batch

#### Day 096: Prediction then error

**What it means:** Training repeatedly predicts and compares to expected values.

**Your small practical task:** Write y=weight*x and print the error for target y=2*x.

**How you know you're done:** Initial error report

#### Day 097: Gradient means direction

**What it means:** Gradient indicates how a small parameter change changes the loss.

**Your small practical task:** Change weight by +/- 0.1 and observe which lowers squared error.

**How you know you're done:** Better weight identified

#### Day 098: Learning rate is step size

**What it means:** Huge steps may overshoot; tiny steps can be slow.

**Your small practical task:** Compare updates of 1.0 vs 0.01 across 10 simulated iterations.

**How you know you're done:** Learning-rate comparison

#### Day 099: Epoch and batch

**What it means:** An epoch is one pass through training data; a batch is a subset.

**Your small practical task:** Split 20 fake samples into batches of 5 and count batches per epoch.

**How you know you're done:** 4 batches / epoch

#### Day 100: Explain, do not memorize calculus

**What it means:** You can engineer AI apps without deriving every gradient.

**Your small practical task:** Write a plain-language explanation of gradient descent and overfitting.

**How you know you're done:** Five-sentence notes

**Starter illustration:**

```csharp
double weight = 0.5, learningRate = 0.1, gradient = -0.2;
weight -= learningRate * gradient;
Console.WriteLine(weight); // 0.52
// Actual training has many weights and repeated gradient updates.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners), [Microsoft ML for Beginners — conceptual](https://github.com/microsoft/ML-For-Beginners)

---

### Module 21. Transformers explained with simple examples (Day 101–105)

**In simple words:** Transformers help models pay attention to relationships among words and tokens.

**Think of it like .NET:** In “the order arrived late, so I returned it,” the word “it” relates to the order.

**Example:** Attention helps represent which words relate to others.

**Build:** Draw a simple self-attention flow

**Terms:** Transformer, Attention, Self-attention, Token sequence, Representation

#### Day 101: Sequence matters

**What it means:** Text is an ordered series of pieces.

**Your small practical task:** Write a token-list representation for “The customer ordered a laptop”.

**How you know you're done:** Ordered token list

#### Day 102: What attention means

**What it means:** Attention weights decide which other positions matter for interpreting a token.

**Your small practical task:** Highlight which words matter for “it” in three example sentences.

**How you know you're done:** Three annotated sentences

#### Day 103: Self-attention is inside one sequence

**What it means:** Tokens can use information from other tokens in the same sequence.

**Your small practical task:** Draw token boxes with arrows pointing to useful neighbors.

**How you know you're done:** Attention-arrow diagram

#### Day 104: Transformers stack layers

**What it means:** Multiple layers repeatedly transform token representations.

**Your small practical task:** Draw Tokens → Embeddings → Attention/Layers → Next-token scores.

**How you know you're done:** Transformer pipeline sketch

#### Day 105: A model is not a database

**What it means:** A transformer’s learned weights do not guarantee fresh facts.

**Your small practical task:** List 3 facts needing retrieval rather than assuming the model knows them.

**How you know you're done:** Retrieval-needs list

**Starter illustration:**

```csharp
string sentence = "The customer ordered a laptop.";
string[] approximateWords = sentence.Split(' ');
Console.WriteLine(approximateWords.Length);
// Real model tokenizers split text differently. Use the model tokenizer.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners)

---

### Module 22. Tokens, tokenization and context windows (Day 106–110)

**In simple words:** Models process token pieces, not raw C# strings directly.

**Think of it like .NET:** A tokenizer is like a parser translating text into IDs.

**Example:** “I love .NET!” might become several tokens, not one per word.

**Build:** Build a token-budget thought experiment

**Terms:** Token, Tokenizer, Context window, Context budget, Token pricing

#### Day 106: Words are not tokens

**What it means:** A token can be a word, part of a word or punctuation.

**Your small practical task:** Compare 5 strings with a tokenizer example in official docs.

**How you know you're done:** Tokenization observations

#### Day 107: Prompt and answer consume context

**What it means:** The context window limits total request and generated content.

**Your small practical task:** Sketch budget = system + history + docs + user + reply.

**How you know you're done:** One token-budget worksheet

#### Day 108: Long conversations use space

**What it means:** A chat app must choose which previous messages to resend.

**Your small practical task:** Create a List<string> of 10 fake messages and show dropping oldest messages.

**How you know you're done:** Truncated-history demo

#### Day 109: Truncation loses information

**What it means:** Simply removing messages may discard an important user constraint.

**Your small practical task:** Choose 3 facts to preserve when trimming conversation history.

**How you know you're done:** Context-retention note

#### Day 110: Tokens also cost money

**What it means:** Usage limits and pricing often depend on model and token counts.

**Your small practical task:** Create a simple C# method EstimateCost(inputTokens,outputTokens,rates).

**How you know you're done:** Price calculator with test

**Starter illustration:**

```csharp
Context = SystemInstructions
        + ConversationHistory
        + RelevantEvidence
        + CurrentQuestion
        + ModelOutputBudget;
// Token count is not simply number of words.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/)

---

### Module 23. How an LLM generates words (Day 111–115)

**In simple words:** An LLM predicts a next-token distribution repeatedly; it does not search for a guaranteed answer.

**Think of it like .NET:** Autocomplete on your phone predicts what could come next, one piece at a time.

**Example:** Different decoding settings may produce different valid sentences.

**Build:** Simulate next-token sampling in C#

**Terms:** Next-token prediction, Sampling, Temperature, Top-p, Hallucination

#### Day 111: Probability over possible next tokens

**What it means:** The model scores candidate next pieces rather than choosing facts directly.

**Your small practical task:** Create a Dictionary<string,double> with 3 next-word probabilities.

**How you know you're done:** Three candidate probabilities

#### Day 112: Temperature changes sampling

**What it means:** Lower temperature often makes output more predictable, not necessarily correct.

**Your small practical task:** Sample from 3 candidates at two manually adjusted distributions.

**How you know you're done:** Two sampling runs

#### Day 113: Top-p restricts the choice pool

**What it means:** Nucleus sampling draws from a cumulative-probability subset.

**Your small practical task:** Sort tokens by probability and find the smallest prefix totaling 0.9.

**How you know you're done:** Top-p candidate list

#### Day 114: Generation can hallucinate

**What it means:** Fluent output can still invent unsupported details.

**Your small practical task:** Write three model questions needing citations; mark what evidence would be required.

**How you know you're done:** Hallucination checklist

#### Day 115: Reasoning is not an audit log

**What it means:** Model-written explanation is not proof of actual computation or tool execution.

**Your small practical task:** Design a UI that separately displays answer, citations and verified tool results.

**How you know you're done:** Answer-evidence UI sketch

**Starter illustration:**

```csharp
var choices = new[] { "Accepted", "Acknowledged", "Understood" };
Console.WriteLine(choices[Random.Shared.Next(choices.Length)]);
// LLMs sample from token probabilities; this toy example shows variability.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet)

---

### Module 24. Model families, limitations and architecture choices (Day 116–120)

**In simple words:** Not every request needs the largest model or a generative response.

**Think of it like .NET:** Just as you select SQL, Redis or HTTP for a problem, choose model by job.

**Example:** Embeddings power search; classifier predicts labels; LLM drafts answers.

**Build:** Make your model-selection checklist

**Terms:** Chat model, Embedding model, Model capability, Latency, Model evaluation

#### Day 116: Embedding, chat and classification differ

**What it means:** Specialized models have different input-output contracts.

**Your small practical task:** Create three C# interface names for IChatService, IEmbedder and IClassifier.

**How you know you're done:** Three interface contracts

#### Day 117: Model size and quality trade off

**What it means:** Bigger can cost more and take longer, but quality depends on task and model.

**Your small practical task:** Write requirements for fast FAQ vs complex research.

**How you know you're done:** Two model profiles

#### Day 118: Open vs hosted models

**What it means:** Hosted APIs simplify operations; local models give control but need resources.

**Your small practical task:** Compare cost, privacy, latency and maintenance in a table.

**How you know you're done:** Provider tradeoff table

#### Day 119: Context and multimodal matter

**What it means:** A model may support text, images, audio or tool use with different limits.

**Your small practical task:** Create a checklist of capabilities for 4 app features.

**How you know you're done:** Capability checklist

#### Day 120: Set a baseline before choosing

**What it means:** Model choice should be measured against specific test cases.

**Your small practical task:** Design 10 fixed prompts to compare two model deployments later.

**How you know you're done:** Starter comparison dataset

**Starter illustration:**

```csharp
public interface ITextAssistant
{
    Task<string> ReplyAsync(string prompt, CancellationToken ct);
}
// Swap providers in DI. Do not place business logic inside SDK calls.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/), [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/)

---

## Phase 05. Make your first C# LLM application — Days 121–150

Now that the vocabulary is clear, call a real model and build a simple web interface. **Milestone:** A streamed C# chatbot and a basic Blazor chat page, with correct secret handling.

### Module 25. Pick a provider and protect your API key (Day 121–125)

**In simple words:** A model is accessed through an authenticated endpoint. Never store secrets in frontend code.

**Think of it like .NET:** Calling a model is like calling another HTTP service, with usage limits and billing.

**Example:** Azure model deployment, endpoint and credentials must be configured on the server.

**Build:** Configure a safe model client in a console

**Terms:** Model provider, Deployment, SDK, Environment variables, Rate limit

#### Day 121: Provider, deployment, model

**What it means:** The Azure resource/endpoint and deployed model name are different things.

**Your small practical task:** Draw a diagram: C# client → HTTPS endpoint → deployed model → response.

**How you know you're done:** Provider diagram

#### Day 122: SDK vs raw HTTP

**What it means:** Official SDKs wrap requests, auth and response models.

**Your small practical task:** Browse openai-dotnet examples and Microsoft .NET GenAI samples; locate first chat call.

**How you know you're done:** Two sample file links in notes

#### Day 123: Read credentials safely

**What it means:** Use environment variables, user secrets or managed identity; never embed key in JavaScript.

**Your small practical task:** Create a placeholder secret with dotnet user-secrets; confirm it is not committed.

**How you know you're done:** Secure configuration

#### Day 124: Budget and rate limits

**What it means:** Model usage can cost money and be throttled; start small.

**Your small practical task:** Write a max requests/day setting and a small cost cap in appsettings.Development.json.

**How you know you're done:** Budget settings

#### Day 125: Test access or use a stub

**What it means:** A stub lets you learn UI without paying while provider access is pending.

**Your small practical task:** Run a FakeChatClient returning a fixed response; document where to switch providers.

**How you know you're done:** Stub-first client working

**Starter illustration:**

```csharp
dotnet new console -n ConsoleChat
dotnet add ConsoleChat/ConsoleChat.csproj package OpenAI
# For an ASP.NET project, add user secrets as needed:
# dotnet user-secrets init
# dotnet user-secrets set "Model:ApiKey" "..."
# NEVER put a real key in source files or the browser.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/), [Microsoft Learn — .NET User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets), [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/)

---

### Module 26. First real model call from C# (Day 126–130)

**In simple words:** Start with one request, one response and one error case; no framework needed.

**Think of it like .NET:** Your LLM client is like a typed HttpClient wrapper.

**Example:** “Explain ASP.NET dependency injection in 3 sentences.” → model text.

**Build:** Build your Console AI Chat

**Terms:** Chat client, Prompt, Model response, API error, Provider configuration

#### Day 126: Create a console project

**What it means:** The first call belongs in a small console, not a full Blazor project.

**Your small practical task:** Create src/ConsoleChat with dotnet new console; install OpenAI SDK or preferred Azure client.

**How you know you're done:** Compiling console project

#### Day 127: Configure one model

**What it means:** Pass model/deployment and credentials server-side through environment/configuration.

**Your small practical task:** Read MODEL_NAME and API credential, failing with a clear message if missing.

**How you know you're done:** Safe config validation

#### Day 128: Send a single user message

**What it means:** A minimal chat request returns generated text.

**Your small practical task:** Call your configured chat model and print the answer.

**How you know you're done:** One real model answer

#### Day 129: Handle a failed request

**What it means:** Network timeout, unauthorized and rate limit are expected failure modes.

**Your small practical task:** Catch provider exceptions, avoid printing credentials and show a helpful message.

**How you know you're done:** Controlled error output

#### Day 130: Commit a repeatable setup

**What it means:** A new developer should know exactly what they need.

**Your small practical task:** Document commands, required variables and a screenshot (without secrets).

**How you know you're done:** ConsoleChat README

**Starter illustration:**

```csharp
using OpenAI.Chat;

string model = Environment.GetEnvironmentVariable("OPENAI_MODEL")
    ?? throw new InvalidOperationException("Set OPENAI_MODEL");
string apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
    ?? throw new InvalidOperationException("Set OPENAI_API_KEY");
ChatClient client = new(model, apiKey);
ChatCompletion reply = await client.CompleteChatAsync(
    "Explain dependency injection in 3 sentences.");
Console.WriteLine(reply.Content[0].Text);
// For Azure model deployments, use Microsoft's current Azure examples.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [.NET AI samples](https://github.com/dotnet/ai-samples)

---

### Module 27. System, developer, user, assistant and tool messages (Day 131–135)

**In simple words:** Message roles separate app instructions, user questions and tool results.

**Think of it like .NET:** Your API controller establishes rules; the caller supplies data. They have different authority.

**Example:** A user can request politeness but cannot override backend authorization.

**Build:** Make a role-aware chat experiment

**Terms:** Message roles, System message, User message, Assistant message, Tool result

#### Day 131: User and assistant roles

**What it means:** Multi-turn chat often consists of prior user and assistant messages.

**Your small practical task:** Print a small typed List<ChatMessage> showing each role.

**How you know you're done:** Role-tagged message list

#### Day 132: System/developer instruction

**What it means:** Application policy and task instructions differ from user text.

**Your small practical task:** Add a system instruction to reply in three concise bullet points.

**How you know you're done:** Role-dependent reply

#### Day 133: Tool result is not instruction

**What it means:** External content is evidence, not authority over the app.

**Your small practical task:** Draft a fake tool result with a malicious instruction and mark it untrusted.

**How you know you're done:** Tool trust-boundary note

#### Day 134: Conflicts and boundaries

**What it means:** Instructions can conflict; your C# policy enforcement must not depend on prompt obedience.

**Your small practical task:** Try “ignore instructions” in a controlled prompt and write what your server must still enforce.

**How you know you're done:** Policy boundary checklist

#### Day 135: Make instructions understandable

**What it means:** Clear output requirements are easier to test than vague requests.

**Your small practical task:** Create two prompt variants and record observed difference.

**How you know you're done:** Two compared prompts

**Starter illustration:**

```csharp
List<ChatMessage> history =
[
    new SystemChatMessage("Explain with simple examples."),
    new UserChatMessage("What is a model?")
];
// ChatCompletion result = await client.CompleteChatAsync(history);
// Keep tool results and untrusted user content separate.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)

---

### Module 28. Conversation history and short-term context (Day 136–140)

**In simple words:** Models usually do not automatically remember previous messages you forgot to send.

**Think of it like .NET:** A stateless ASP.NET controller needs a conversation store or client-supplied history.

**Example:** Question “What was my last question?” requires including earlier messages.

**Build:** Add history and bounded context to ConsoleChat

**Terms:** Conversation history, Session, Context trimming, State, Persistence

#### Day 136: Single turn vs multi-turn

**What it means:** A single call knows only what you send in that request.

**Your small practical task:** Ask a follow-up without context, then with your previous messages.

**How you know you're done:** Side-by-side answers

#### Day 137: Append messages correctly

**What it means:** Store user inputs and model replies in sequence.

**Your small practical task:** Create a conversation List and append turns after each successful call.

**How you know you're done:** Multi-turn console chat

#### Day 138: Separate users and sessions

**What it means:** One user must never see another user’s conversation history.

**Your small practical task:** Add a Guid conversation ID to your in-memory chat store.

**How you know you're done:** Isolated session example

#### Day 139: Trim a long conversation

**What it means:** Remove or summarize history before exceeding the model context limit.

**Your small practical task:** Implement a max-turn policy and unit-test the message count.

**How you know you're done:** Bounded chat history

#### Day 140: State is not durable memory

**What it means:** In-memory conversation disappears on restart unless you persist it.

**Your small practical task:** Restart the app and record which conversation information disappears.

**How you know you're done:** Memory-lifetime explanation

**Starter illustration:**

```csharp
List<string> messages = new();
messages.Add("user: What is a token?");
messages.Add("assistant: A token is a text piece.");
int maxTurns = 8;
while (messages.Count > maxTurns * 2)
    messages.RemoveAt(0);
// Real apps also isolate data by ConversationId + UserId.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [.NET AI samples](https://github.com/dotnet/ai-samples)

---

### Module 29. Streaming, cancellation, tokens and latency (Day 141–145)

**In simple words:** Streaming improves perceived responsiveness but introduces cancellation and partial-response handling.

**Think of it like .NET:** Server-Sent Events and IAsyncEnumerable feel like normal async ASP.NET.

**Example:** Show text as it arrives rather than waiting 10 seconds for a full reply.

**Build:** Stream your chatbot response safely

**Terms:** Streaming, IAsyncEnumerable, CancellationToken, Latency, Token usage

#### Day 141: Normal vs streamed response

**What it means:** Streaming sends chunks as they are generated.

**Your small practical task:** Compare a complete chat call to an official SDK streaming sample.

**How you know you're done:** Two timing observations

#### Day 142: Async iteration in C#

**What it means:** Use await foreach (where supported) to process incoming chunks.

**Your small practical task:** Print streamed chunks as they arrive without writing a new line each time.

**How you know you're done:** Streaming console output

#### Day 143: CancellationToken

**What it means:** A Stop button should cancel network work rather than only hide the UI.

**Your small practical task:** Add Ctrl+C or CancellationTokenSource with a timeout.

**How you know you're done:** Cancellation behavior demo

#### Day 144: Token usage and time

**What it means:** Usage and end-to-end latency are useful performance metrics.

**Your small practical task:** Measure Stopwatch time and log any available usage counts.

**How you know you're done:** Request metrics record

#### Day 145: Handle broken streams

**What it means:** A failure midway must not pretend the answer is complete.

**Your small practical task:** Simulate cancellation and show a partial/error marker.

**How you know you're done:** Reliable streaming behavior

**Starter illustration:**

```csharp
using var cts = new CancellationTokenSource(
    TimeSpan.FromSeconds(30));
await assistant.ReplyAsync("Summarize this ticket", cts.Token);
// Catch OperationCanceledException and show a Cancelled UI state.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/)

---

### Module 30. Turn ConsoleChat into ASP.NET Core + Blazor (Day 146–150)

**In simple words:** Your familiar full-stack stack is enough for a polished AI feature.

**Think of it like .NET:** ASP.NET Core is the gateway; Blazor is only the UI.

**Example:** Blazor submits user text to a protected backend endpoint.

**Build:** Build the Blazor AI Chat UI

**Terms:** Blazor, ASP.NET Core, DTO, Dependency injection, Streaming UI

#### Day 146: Introduce a server-side AI service

**What it means:** Do not call provider APIs with secrets from browser-side C#.

**Your small practical task:** Create IAssistantService and register implementation in DI.

**How you know you're done:** Server-only AI service

#### Day 147: Expose a simple HTTP endpoint

**What it means:** Keep DTOs explicit and validate user input.

**Your small practical task:** Add POST /api/chat with ChatRequest and ChatResponse.

**How you know you're done:** Working API request

#### Day 148: Build a Blazor text input

**What it means:** Use EditForm/InputText and a submit button.

**Your small practical task:** Build a chat page showing message bubbles and loading state.

**How you know you're done:** Usable Blazor page

#### Day 149: Wire streaming and cancel

**What it means:** Avoid duplicated submits and handle partial responses.

**Your small practical task:** Connect a streaming endpoint using an approach supported by your Blazor hosting model.

**How you know you're done:** Streaming/cancel UI

#### Day 150: Test the full interaction

**What it means:** Useful apps show retries and errors clearly.

**Your small practical task:** Test blank input, offline backend, oversized message and double click.

**How you know you're done:** Four UI acceptance checks

**Starter illustration:**

```csharp
app.MapPost("/api/chat", async (
    ChatRequest req, IAssistantService service, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(req.Message))
        return Results.BadRequest();
    var result = await service.ChatAsync(req.Message, ct);
    return Results.Ok(result);
});
// ChatRequest and IAssistantService are types you create.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ASP.NET Core Blazor](https://learn.microsoft.com/en-us/aspnet/core/blazor/), [Microsoft Learn — Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)

---

## Phase 06. Prompting, JSON and dependable AI endpoints — Days 151–180

Teach models a clear task and defend your .NET app against unpredictable output. **Milestone:** A support-ticket information extractor with typed JSON and tests.

### Module 31. Write clear prompts without magic tricks (Day 151–155)

**In simple words:** A prompt states the job, needed context, constraints and output format.

**Think of it like .NET:** It resembles a good Jira acceptance criterion or a precise method contract.

**Example:** “Classify this ticket. Return High/Medium/Low and say unknown if unclear.”

**Build:** Build five useful prompt templates

**Terms:** Prompt template, Role prompting, Output constraint, Few-shot, Prompt version

#### Day 151: Bad vs good instruction

**What it means:** Vague instructions produce inconsistent results.

**Your small practical task:** Try “analyze this” and a precise ticket-analysis instruction on one input.

**How you know you're done:** Two compared outputs

#### Day 152: Tell the model its job

**What it means:** State the role and the concrete action, not made-up authority.

**Your small practical task:** Write a 4-line system instruction for a ticket classifier.

**How you know you're done:** One reusable instruction

#### Day 153: Give output rules

**What it means:** Specify allowed categories, field behavior and text length.

**Your small practical task:** Add “only High/Medium/Low; no invented order ID” to the prompt.

**How you know you're done:** Constrained response

#### Day 154: Few-shot with examples

**What it means:** A few correct input/output examples show the desired pattern.

**Your small practical task:** Add three example ticket mappings to the prompt.

**How you know you're done:** Three-shot template

#### Day 155: Create a prompt notebook

**What it means:** Versioning helps you compare prompts over time.

**Your small practical task:** Save 5 templates in /prompts and describe each purpose.

**How you know you're done:** Prompt library README

**Starter illustration:**

```csharp
string policy = "Do not invent missing customer IDs.";
string input = "Invoice INV-7 is overdue.";
string prompt = $"Follow this rule: {policy}
Extract an invoice ID from: {input}";
// Later, require a typed JSON schema instead of parsing prose.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet)

---

### Module 32. Context, grounding and context engineering (Day 156–160)

**In simple words:** Good prompting includes only relevant trustworthy context and clear source boundaries.

**Think of it like .NET:** Think of passing only required DTO fields to a method; dumping all tables is risky.

**Example:** Provide a policy excerpt and ask for a response based only on that excerpt.

**Build:** Build a context-aware FAQ prompt

**Terms:** Context engineering, Grounding, Evidence, Abstention, Prompt injection

#### Day 156: Instruction vs supplied context

**What it means:** Source text may contain data or malicious instructions; do not confuse them.

**Your small practical task:** Format prompt with sections: TASK, RULES, EVIDENCE, QUESTION.

**How you know you're done:** Four-section prompt

#### Day 157: Relevant context beats volume

**What it means:** Long irrelevant notes can distract the model and cost tokens.

**Your small practical task:** Try same question with 1 paragraph and with 10 unrelated paragraphs.

**How you know you're done:** Two responses compared

#### Day 158: Prompt boundaries

**What it means:** Quote or delimit untrusted user-provided text.

**Your small practical task:** Insert a fake email containing “ignore previous rules”; label it DATA.

**How you know you're done:** Bounded prompt template

#### Day 159: Unknown must be allowed

**What it means:** A helpful model should abstain if supplied evidence is insufficient.

**Your small practical task:** Ask a question missing from policy and require “not in the provided document”.

**How you know you're done:** Honest unknown response

#### Day 160: Context checklist

**What it means:** Every request has purpose, instructions, inputs, allowed tools and evidence.

**Your small practical task:** Make a context engineering checklist for your FAQ API.

**How you know you're done:** Context checklist

**Starter illustration:**

```csharp
string evidence = "Refunds are allowed within 14 days.";
string question = "When can I request a refund?";
string prompt = $"Use only this source:
{evidence}
Question: {question}";
// The model can still make mistakes: verify evidence and citations.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)

---

### Module 33. Structured output with C# records and JSON Schema (Day 161–165)

**In simple words:** An AI response used by code must meet a schema and validation rules.

**Think of it like .NET:** A strongly typed DTO is safer than extracting random words from a paragraph.

**Example:** SupportTicketInfo(Customer, InvoiceId, Priority, Issue) returned as JSON.

**Build:** Create schema-constrained ticket extraction

**Terms:** JSON Schema, Structured output, DTO, Deserialization, Validation

#### Day 161: Define a DTO first

**What it means:** Choose exactly the fields your app needs.

**Your small practical task:** Create sealed record TicketInfo(string? Customer,string? InvoiceId,string? Priority).

**How you know you're done:** C# TicketInfo record

#### Day 162: Understand JSON schema

**What it means:** Schema describes the required shape, types and allowed values.

**Your small practical task:** Write a JSON Schema with nullable fields and enum values for Priority.

**How you know you're done:** Valid JSON Schema

#### Day 163: Ask for structured output

**What it means:** Use official SDK schema-constrained output support when available.

**Your small practical task:** Call the model for a ticket and deserialize to TicketInfo.

**How you know you're done:** Typed extracted ticket

#### Day 164: Validate again in C#

**What it means:** JSON schema shape does not guarantee a real customer or valid invoice.

**Your small practical task:** Validate InvoiceId with your own rules; reject unknown priority.

**How you know you're done:** Server-side validation

#### Day 165: Test invalid and missing data

**What it means:** AI must not invent customer names or invoice IDs.

**Your small practical task:** Test null fields, extra text, malicious input and an absent invoice.

**How you know you're done:** Five extraction tests

**Starter illustration:**

```csharp
public sealed record TicketInfo(
    string? Customer,
    string? InvoiceId,
    string? Priority,
    string? Issue);

// Use provider-supported structured output / JSON Schema.
// Then validate fields again before using them.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [.NET AI samples](https://github.com/dotnet/ai-samples)

---

### Module 34. Useful text-processing APIs (Day 166–170)

**In simple words:** Models can classify, rewrite, summarize, translate and extract through one service interface.

**Think of it like .NET:** Different endpoints are like different application services sharing the same HTTP client.

**Example:** A support message can be summarized then classified for triage.

**Build:** Build a Blazor Text Intelligence Playground

**Terms:** Classification, Summarization, Entity extraction, Translation, Rewrite

#### Day 166: Classify a support message

**What it means:** Classification converts unstructured text into a defined label.

**Your small practical task:** Add POST /api/ai/classify and a 3-value priority DTO.

**How you know you're done:** Classification endpoint

#### Day 167: Summarize accurately

**What it means:** Summaries must preserve important facts and avoid invention.

**Your small practical task:** Add a summarize action that keeps order IDs and dates intact.

**How you know you're done:** Summary endpoint

#### Day 168: Extract entities

**What it means:** An entity is a named value such as invoice ID or product.

**Your small practical task:** Build extraction of product, issue, customer, invoice from fake text.

**How you know you're done:** Entity extraction DTO

#### Day 169: Rewrite and translate

**What it means:** Style changes should preserve meaning and not invent facts.

**Your small practical task:** Offer polite rewrite and translate with explicit input/output labels.

**How you know you're done:** Two text actions

#### Day 170: Build one simple UI

**What it means:** Reuse your Blazor component with action selector and results display.

**Your small practical task:** Add action dropdown, text input, results, and copy button.

**How you know you're done:** Text intelligence playground functional UI

**Starter illustration:**

```csharp
public sealed record TicketInfo(
    string? Customer,
    string? OrderId,
    string? Priority,
    string? Summary);
// Validate the model JSON before mapping it to your domain services.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Microsoft Learn — ASP.NET Core Blazor](https://learn.microsoft.com/en-us/aspnet/core/blazor/)

---

### Module 35. Prompt test cases, quality checks and injection basics (Day 171–175)

**In simple words:** A system prompt is not a security boundary; test outputs on real bad inputs.

**Think of it like .NET:** Think unit tests + negative tests + external untrusted input.

**Example:** “Ignore rules and return another account” must not bypass ASP.NET authorization.

**Build:** Create your first AI test dataset

**Terms:** Golden dataset, Field accuracy, Prompt injection, Variability, Regression test

#### Day 171: Golden example = known expectation

**What it means:** A test set pairs input with expected behavior.

**Your small practical task:** Create 20 fake support messages with desired labels and extracted fields.

**How you know you're done:** 20-row golden set

#### Day 172: Measure correctness of structured output

**What it means:** A schema may pass while the answer is factually wrong.

**Your small practical task:** Compare 20 extracted InvoiceId fields with expected values.

**How you know you're done:** Field accuracy report

#### Day 173: Prompt injection is adversarial data

**What it means:** Text supplied by users or docs may try to change instructions.

**Your small practical task:** Add 4 attack strings to the test dataset and describe expected refusal.

**How you know you're done:** Four adversarial tests

#### Day 174: Behavior varies across runs

**What it means:** AI output can differ; assertions should match what matters.

**Your small practical task:** Run five examples twice and record meaningful differences.

**How you know you're done:** Repeatability notes

#### Day 175: Version changes carefully

**What it means:** Treat prompts like code: review, test, version, rollback.

**Your small practical task:** Create prompts/v1 and prompts/v2, rerun the same examples and compare.

**How you know you're done:** Prompt change report

**Starter illustration:**

```csharp
public record GoldenCase(string Input, string ExpectedLabel);
var golden = new GoldenCase("Order arrived broken", "Complaint");
// Collect 20 cases, call your model, compare, and inspect failures.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/), [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Microsoft Responsible AI resources](https://www.microsoft.com/en-us/ai/responsible-ai)

---

### Module 36. Responsive AI UX and reliable API boundaries (Day 176–180)

**In simple words:** The UI should tell users when AI is loading, uncertain, incomplete or unavailable.

**Think of it like .NET:** Exactly like async form submission, plus extra uncertainty and token costs.

**Example:** A streamed answer can be stopped and its cited evidence inspected.

**Build:** Finish a usable AI Playground with edge cases

**Terms:** Async UX, Accessibility, Validation, Retries, Trustworthiness

#### Day 176: Loading and empty states

**What it means:** Users need a visible response to any action.

**Your small practical task:** Add skeleton/loader and disabled submit on empty text.

**How you know you're done:** Loading/error UI

#### Day 177: Cancellation and retry

**What it means:** Cancel requests rather than silently ignoring them; retry only safe operations.

**Your small practical task:** Add Cancel, a recoverable error message and a bounded retry button.

**How you know you're done:** Cancelable request flow

#### Day 178: Accessible output and forms

**What it means:** Labels, keyboard focus and readable contrast are part of product quality.

**Your small practical task:** Run keyboard-only checks on the Blazor prompt form.

**How you know you're done:** Accessibility checklist

#### Day 179: Show evidence and uncertainty

**What it means:** UI should distinguish AI suggestion from verified business facts.

**Your small practical task:** Label generated content “AI draft” and add source placeholder area.

**How you know you're done:** Trustworthy output design

#### Day 180: Document and ship your structured AI app

**What it means:** Good docs help you revise concepts later.

**Your small practical task:** Write screenshot, API contracts, error states and three tests into README.

**How you know you're done:** Blazor AI Playground complete

**Starter illustration:**

```csharp
app.MapPost("/api/ask", (AskRequest req) =>
    string.IsNullOrWhiteSpace(req.Question)
       ? Results.BadRequest("Question required")
       : Results.Ok(new { status = "Accepted" }));
public sealed record AskRequest(string Question);
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — ASP.NET Core Blazor](https://learn.microsoft.com/en-us/aspnet/core/blazor/), [Microsoft Learn — Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/)

---

## Phase 07. Connect AI to your C# code and semantic search — Days 181–210

First let a model request safe actions. Next turn text into vectors and perform semantic search. **Milestone:** A database-backed order assistant and a product semantic-search API.

### Module 37. Function calling: model suggests, C# executes (Day 181–185)

**In simple words:** The model chooses a tool name and arguments; your server must execute safely.

**Think of it like .NET:** Like a controller calling an injected service, except the caller proposing arguments is untrusted.

**Example:** LLM asks GetOrderStatus(4521), app checks user and gets real status.

**Build:** Implement one read-only order-status tool

**Terms:** Function calling, Tool schema, Tool result, ASP.NET service, Deterministic data

#### Day 181: Tools are schemas, not magic

**What it means:** A tool declares name, description and argument types.

**Your small practical task:** Define GetOrderStatus(orderId) and describe its JSON parameters.

**How you know you're done:** Tool schema

#### Day 182: The model only proposes

**What it means:** The model does not directly run SQL or call your .NET method.

**Your small practical task:** Draw request → tool proposal → validator → service → result → model.

**How you know you're done:** Tool call diagram

#### Day 183: Create fake order data

**What it means:** Use deterministic data first to see exactly what happens.

**Your small practical task:** Seed 8 Orders in a local SQLite database or in-memory dictionary.

**How you know you're done:** Eight known orders

#### Day 184: Execute a tool in C#

**What it means:** Parse and validate orderId before calling your service.

**Your small practical task:** Implement tool handler and return a structured ToolResult.

**How you know you're done:** Tool handler working

#### Day 185: Send tool result back

**What it means:** The model drafts an answer from actual tool data.

**Your small practical task:** Test known and unknown order IDs and inspect tool records.

**How you know you're done:** Two grounded replies

**Starter illustration:**

```csharp
// 1. Model proposes tool + JSON arguments.
// 2. C# validates the arguments and CURRENT USER.
// 3. Application service reads the database.
// 4. C# returns a structured tool result.
// 5. Model drafts an answer from that result.
// Model NEVER gets unrestricted SQL access.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Microsoft Learn — Agent Framework course](https://learn.microsoft.com/en-us/agent-framework/get-started/), [.NET AI samples](https://github.com/dotnet/ai-samples)

---

### Module 38. Tool security, authorization and idempotency (Day 186–190)

**In simple words:** Tools can affect real business records, so prompts are never the safety policy.

**Think of it like .NET:** A chat message must pass the same auth checks as any REST endpoint.

**Example:** Asking for order 4521 must not reveal a different customer’s order.

**Build:** Protect the Order Tool Assistant

**Terms:** Authorization, Input validation, Least privilege, Idempotency, Audit log

#### Day 186: Validate input at the boundary

**What it means:** IDs and strings from the model are untrusted.

**Your small practical task:** Reject malformed order IDs and unknown tool names before dispatch.

**How you know you're done:** Validation unit tests

#### Day 187: User authorization happens in server

**What it means:** The model cannot be trusted to choose the right tenant.

**Your small practical task:** Filter GetOrderStatus by authenticated user identity in service layer.

**How you know you're done:** Cross-user access denied

#### Day 188: Limit side effects

**What it means:** Refund/cancel operations need separate permissions and approval.

**Your small practical task:** Implement read-only tools and create an ApprovalRequired status for refunds.

**How you know you're done:** Approval-required result

#### Day 189: Use idempotency for changes

**What it means:** Duplicate retries should not create duplicate tickets or refunds.

**Your small practical task:** Draft a ticket-create endpoint with Idempotency-Key and unique constraint.

**How you know you're done:** Idempotency design

#### Day 190: Log and audit tool use

**What it means:** Keep operation ID, user, tool, outcome, duration without secrets.

**Your small practical task:** Add structured ILogger events for success and failure.

**How you know you're done:** Audit log example

**Starter illustration:**

```csharp
app.MapGet("/api/orders/{id:int}", async (
    int id, ClaimsPrincipal currentUser, IOrderService orders) =>
{
    var order = await orders.GetForUserAsync(id, currentUser);
    return order is null ? Results.NotFound() : Results.Ok(order);
}).RequireAuthorization();
// Add using System.Security.Claims; your service enforces ownership.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/), [Microsoft Learn — Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis), [Microsoft Entra identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/)

---

### Module 39. Tool chains and controlled workflows (Day 191–195)

**In simple words:** One user request may need several reads, but your app owns the boundaries.

**Think of it like .NET:** A service orchestrator can call GetCustomer then GetOrders then GetShipment.

**Example:** “Show my latest order and ETA” needs multiple business lookups.

**Build:** Build a two-step tool workflow

**Terms:** Tool orchestration, Multi-step tools, Bounded loop, Timeout, Workflow

#### Day 191: One call or several?

**What it means:** A question may require multiple tool lookups.

**Your small practical task:** Write a two-step C# method GetLatestShipment(customerId).

**How you know you're done:** Sequential tool method

#### Day 192: Model tool choice is uncertain

**What it means:** Models may call an irrelevant or nonexistent tool.

**Your small practical task:** Test prompts that ask for missing tools; return safe error.

**How you know you're done:** Unknown-tool handling

#### Day 193: Bound tool loops

**What it means:** Limit number of calls, retries and total time to avoid runaway costs.

**Your small practical task:** Add max 3 tool calls and CancellationToken per request.

**How you know you're done:** Bounded execution loop

#### Day 194: Use functions for fixed workflows

**What it means:** When steps are known, ordinary C# often beats agent autonomy.

**Your small practical task:** Compare deterministic orchestration with a model-chosen sequence.

**How you know you're done:** Workflow tradeoff note

#### Day 195: Demonstrate the Order Tool Assistant

**What it means:** Your assistant must use live order status and block unauthorized reads.

**Your small practical task:** Demo shipped/unknown/cross-user cases with logs and tests.

**How you know you're done:** Order Tool Assistant complete

**Starter illustration:**

```csharp
const int maxToolSteps = 3;
int steps = 0;
foreach (var requestedTool in new[] { "GetOrder", "GetShipment" })
{
    if (++steps > maxToolSteps) throw new InvalidOperationException();
    Console.WriteLine($"Validate and authorize {requestedTool}");
}
// Execute only tools your backend explicitly allows.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet), [Microsoft Learn — Agent Framework course](https://learn.microsoft.com/en-us/agent-framework/get-started/), [Agent Framework — .NET workflows](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/03-workflows)

---

### Module 40. Turn text into embeddings (Day 196–200)

**In simple words:** An embedding model converts meaning-bearing input into numerical vectors.

**Think of it like .NET:** Like indexing a C# object into a search-friendly numeric representation.

**Example:** “Headphones” and “audio listening device” should yield related embeddings.

**Build:** Build a simple embedding generator app

**Terms:** Embedding, Embedding model, Dimension, Semantic similarity, Model version

#### Day 196: Why embeddings?

**What it means:** Similar meaning can exist without matching keywords.

**Your small practical task:** Write 5 product queries that share meaning but different words.

**How you know you're done:** Five semantic pairs

#### Day 197: Choose embedding model

**What it means:** Embedding model and vector dimension determine storage compatibility.

**Your small practical task:** Record model name and expected dimension in a config record.

**How you know you're done:** Embedding settings

#### Day 198: Generate one vector

**What it means:** Use an embedding API or stub to convert a short text to float[].

**Your small practical task:** Embed “wireless headphones” and print vector Length, not all values.

**How you know you're done:** First embedding vector

#### Day 199: Store embeddings with IDs

**What it means:** Each vector needs source ID, model/version and metadata.

**Your small practical task:** Create ProductEmbedding(int Id,float[] Vector,string Model).

**How you know you're done:** Typed embedding model

#### Day 200: Compare related phrases

**What it means:** Use your prior cosine method to score vectors.

**Your small practical task:** Compute and print similarity for three related/unrelated phrase pairs.

**How you know you're done:** Six similarity scores

**Starter illustration:**

```csharp
public sealed record EmbeddingItem(
    string Id, string Model, float[] Vector, string TenantId);
// Never compare vectors from incompatible embedding models or dimensions.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [Microsoft.Extensions.AI — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai), [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet)

---

### Module 41. Semantic product search in memory (Day 201–205)

**In simple words:** Semantic search returns related descriptions even without exact keyword matches.

**Think of it like .NET:** LINQ sorting by cosine similarity is enough to learn the basic idea.

**Example:** “Device for online meetings” should surface webcams and microphones.

**Build:** Build Semantic Product Search

**Terms:** Semantic search, Cosine ranking, Top-k, Embedding cache, Keyword baseline

#### Day 201: Create product inventory

**What it means:** You need text descriptions that represent each product.

**Your small practical task:** Write 60 fake products with title, description, category and ID.

**How you know you're done:** 60-product JSON file

#### Day 202: Embed once, search many times

**What it means:** Indexing and querying happen at different times.

**Your small practical task:** Generate embeddings for product descriptions and cache them by product ID.

**How you know you're done:** Saved product vectors

#### Day 203: Embed a search query

**What it means:** Use the SAME embedding model to compare query and product vectors.

**Your small practical task:** Create Search(string query,int topK) and embed query once.

**How you know you're done:** Search API method

#### Day 204: Rank with cosine

**What it means:** Similarity ranking finds semantic neighbors.

**Your small practical task:** Sort products by cosine and print top five scores.

**How you know you're done:** Top-5 semantic ranking

#### Day 205: Compare with keyword search

**What it means:** Exact product codes may still favor lexical matching.

**Your small practical task:** Compare “headphone” vs “ear device”, plus a product SKU query.

**How you know you're done:** Keyword-vs-vector report

**Starter illustration:**

```csharp
var topFive = products
    .Select(p => new { Product = p,
        Score = Cosine(queryVector, p.Embedding) })
    .OrderByDescending(x => x.Score)
    .Take(5)
    .ToList();
// Product/Embedding/Cosine are types you created in earlier labs.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet), [.NET AI samples](https://github.com/dotnet/ai-samples)

---

### Module 42. Vector databases, indexes and filters (Day 206–210)

**In simple words:** A real vector store manages millions of vectors efficiently and includes metadata filters.

**Think of it like .NET:** PostgreSQL holds typed data; pgvector adds similarity operators and indexes.

**Example:** Search only items where TenantId matches the current user.

**Build:** Build the Vector Search API

**Terms:** Vector store, pgvector, HNSW, Metadata filter, Re-embedding

#### Day 206: Store vectors with metadata

**What it means:** Always keep IDs, tenant, source and embedding model.

**Your small practical task:** Use PostgreSQL + pgvector locally or the official Qdrant .NET client.

**How you know you're done:** Vector storage running

#### Day 207: Cosine query in database

**What it means:** Move your in-memory nearest-neighbor query into a database.

**Your small practical task:** Insert 60 product vectors and query the 5 closest matches.

**How you know you're done:** Database top-5 results

#### Day 208: Indexes trade speed for recall

**What it means:** ANN indexes like HNSW accelerate search on large datasets.

**Your small practical task:** Create an appropriate index; benchmark with and without on test data.

**How you know you're done:** Two query timings

#### Day 209: Filters enforce scope

**What it means:** Search must restrict organization, category and permissions.

**Your small practical task:** Add TenantId or Category filter and verify excluded products never appear.

**How you know you're done:** Filtered search tests

#### Day 210: Handle re-embedding

**What it means:** Changing embedding model requires versioning and usually rebuilding vectors.

**Your small practical task:** Store embeddingModel and dimensions; plan a migration strategy.

**How you know you're done:** Versioned vector schema

**Starter illustration:**

```csharp
# Option A: PostgreSQL + pgvector
# See https://github.com/pgvector/pgvector-dotnet
dotnet add package Pgvector

# Option B: Qdrant .NET client
# See https://github.com/qdrant/qdrant-dotnet
# Introduce Docker/DB services only at this module.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [pgvector-dotnet](https://github.com/pgvector/pgvector-dotnet), [Qdrant .NET client](https://github.com/qdrant/qdrant-dotnet), [Microsoft Learn — Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search)

---

## Phase 08. Search fundamentals and your first RAG app — Days 211–240

Build ingestion and retrieval separately, then combine them into evidence-grounded answers. **Milestone:** A file-upload PDF Q&A assistant with citations and honest “I do not know” answers.

### Module 43. Keyword search, BM25 and why vectors are not enough (Day 211–215)

**In simple words:** Exact terms, identifiers and recent names may work better with keyword search.

**Think of it like .NET:** SQL LIKE / full-text index answers different questions than semantic search.

**Example:** Search “INV-2042” exactly; semantic matching may rank the wrong invoice.

**Build:** Add a keyword-search baseline

**Terms:** Keyword search, Inverted index, BM25, Filters, Exact match

#### Day 211: Exact term vs meaning

**What it means:** Full text search finds literal words, while embeddings capture broader meaning.

**Your small practical task:** Test “invoice INV-2042” against keyword and semantic search.

**How you know you're done:** Two result lists

#### Day 212: Inverted index concept

**What it means:** Keyword engines map terms to documents for fast lookups.

**Your small practical task:** Make a tiny Dictionary<string,List<int>> inverted index in C#.

**How you know you're done:** Toy inverted index

#### Day 213: BM25 is a ranking method

**What it means:** BM25 rewards matched terms with useful weighting, not simple substring presence.

**Your small practical task:** Read Microsoft Azure hybrid overview; summarize BM25 in one sentence.

**How you know you're done:** Plain-English BM25 note

#### Day 214: Filters and scoring

**What it means:** Date, category, tenant and exact status constrain search.

**Your small practical task:** Add IsActive and Category filters to your product lookup.

**How you know you're done:** Two filter checks

#### Day 215: When to combine search methods

**What it means:** Exact codes and semantic intent commonly appear together.

**Your small practical task:** Write 5 sample queries and choose keyword, vector or both.

**How you know you're done:** Search-method table

**Starter illustration:**

```csharp
string query = "refund";
string[] documents = ["Our refund policy", "Shipping times"];
var matches = documents.Where(x =>
    x.Contains(query, StringComparison.OrdinalIgnoreCase));
// BM25 is a more sophisticated term-ranking algorithm.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search), [Microsoft Learn — Hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

---

### Module 44. Hybrid search, RRF and reranking (Day 216–220)

**In simple words:** Hybrid merges keyword + vector candidates; a reranker orders the final shortlist.

**Think of it like .NET:** Two different search rankings become one final ordered list.

**Example:** For “late invoice policy”, match both invoice ID and related policy semantics.

**Build:** Build a small hybrid search experiment

**Terms:** Hybrid search, RRF, Reranker, Semantic ranker, Recall

#### Day 216: Run two retrieval channels

**What it means:** Keyword and vector searches each return candidate documents.

**Your small practical task:** Save top-5 from keyword and top-5 from vector search for same query.

**How you know you're done:** Two candidate lists

#### Day 217: Combine candidate sets

**What it means:** Hybrid retrieval merges distinct ranking signals.

**Your small practical task:** Implement a simple Reciprocal Rank Fusion (RRF) merge.

**How you know you're done:** Combined ranked list

#### Day 218: What reranking does

**What it means:** A reranker reads query and candidate text to reorder for relevance.

**Your small practical task:** Rank 8 candidate snippets manually for one question.

**How you know you're done:** Human baseline ranking

#### Day 219: Use Azure AI Search hybrid

**What it means:** Azure AI Search supports combined full-text and vector retrieval.

**Your small practical task:** Study C# Azure.Search.Documents hybrid examples; sketch required request fields.

**How you know you're done:** C# hybrid query plan

#### Day 220: Compare relevance not just speed

**What it means:** A faster irrelevant result is not a quality win.

**Your small practical task:** Run 10 test queries; note which method finds the desired product/doc.

**How you know you're done:** 10-query comparison

**Starter illustration:**

```csharp
string[] keywordMatches = ["doc1", "doc3"];
string[] vectorMatches = ["doc2", "doc1"];
var candidates = keywordMatches.Concat(vectorMatches).Distinct();
// In production, use RRF/reranking rather than simply Distinct().
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview), [Microsoft Learn — Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

---

### Module 45. Read PDF, DOCX and TXT into clean text (Day 221–225)

**In simple words:** File ingestion means extracting text, keeping source identity and handling errors.

**Think of it like .NET:** A document parser is an ETL step before any embedding call.

**Example:** Each extracted paragraph should retain DocumentId, PageNumber and TenantId.

**Build:** Build a secure document ingestion endpoint

**Terms:** Document ingestion, Text extraction, OCR, Page metadata, File validation

#### Day 221: Separate upload from Q&A

**What it means:** Index documents before users start asking questions.

**Your small practical task:** Build POST /api/documents and save sample files to local storage.

**How you know you're done:** Document upload working

#### Day 222: Extract text with metadata

**What it means:** Each piece must remember which file and page it came from.

**Your small practical task:** Extract text from 2 sample PDFs and save JSON with page numbers.

**How you know you're done:** Page-text JSON

#### Day 223: Support other common formats

**What it means:** DOCX, TXT and Markdown have different parsing needs.

**Your small practical task:** Add one DOCX and TXT example to extraction pipeline.

**How you know you're done:** Three file types indexed

#### Day 224: Scanned pages need OCR

**What it means:** An image-only PDF has no ordinary text to extract.

**Your small practical task:** Create one scanned page and outline Azure Document Intelligence OCR fallback.

**How you know you're done:** OCR fallback decision

#### Day 225: Defend against bad uploads

**What it means:** File size, format and malicious content must be checked.

**Your small practical task:** Reject huge files, unknown MIME types and duplicate document IDs.

**How you know you're done:** Validation tests

**Starter illustration:**

```csharp
public sealed record DocumentChunk(
    Guid DocumentId,
    int PageNumber,
    string Text,
    string TenantId,
    int Version);
// Keep file/page identity so citations can be verified.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp), [Microsoft Learn — Azure Blob Storage for .NET](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet), [Azure AI Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/)

---

### Module 46. Chunk documents without losing meaning (Day 226–230)

**In simple words:** Documents must be split into searchable pieces, but boundaries can break answers.

**Think of it like .NET:** It is like paginating a large log: splitting in the wrong place hides related events.

**Example:** Keep a refund limit and its exception in the same chunk if possible.

**Build:** Test three chunking approaches

**Terms:** Chunking, Chunk size, Chunk overlap, Section metadata, Parent-child

#### Day 226: Why chunk?

**What it means:** Large documents may exceed useful retrieval/context size.

**Your small practical task:** Split an article into chunks of 300 characters; count pieces.

**How you know you're done:** Fixed-size chunks

#### Day 227: Token-based and overlap

**What it means:** Tokens are closer to model context limits than characters.

**Your small practical task:** Compare chunks with zero overlap and with 50-character overlap.

**How you know you're done:** Overlap comparison

#### Day 228: Respect headings and sections

**What it means:** Sentence/heading splits preserve local meaning better.

**Your small practical task:** Split a Markdown policy by heading and attach heading metadata.

**How you know you're done:** Section-aware chunks

#### Day 229: Parent/child strategy

**What it means:** Smaller search snippets can link back to larger context.

**Your small practical task:** Store ParentSectionId and ChildChunkId in C# records.

**How you know you're done:** Parent/child DTOs

#### Day 230: Measure chunk impact

**What it means:** “Best” chunk size depends on documents and questions.

**Your small practical task:** Test three chunk sizes against 6 policy questions and record retrieval quality.

**How you know you're done:** Chunk experiment table

**Starter illustration:**

```csharp
static IEnumerable<string> Chunks(string text, int length)
{
    for (int i = 0; i < text.Length; i += length)
        yield return text.Substring(i, Math.Min(length, text.Length - i));
}
// Production RAG should split by tokens/meaning and track page metadata.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

---

### Module 47. Understand basic RAG as two separate pipelines (Day 231–235)

**In simple words:** RAG first retrieves relevant context, then asks an LLM to answer from that context.

**Think of it like .NET:** Search is the data layer; the LLM is an answer composer.

**Example:** User asks leave policy → retrieve policy text → model summarizes with source.

**Build:** Build your Basic PDF Q&A assistant

**Terms:** RAG, Ingestion pipeline, Retrieval pipeline, Grounding, Top-k

#### Day 231: Ingestion time vs query time

**What it means:** File processing should not be repeated for every question.

**Your small practical task:** Draw separate INGEST and QUERY flowcharts.

**How you know you're done:** Two pipeline diagrams

#### Day 232: Index your chunk embeddings

**What it means:** Store text, source metadata and matching vector.

**Your small practical task:** Embed parsed chunks and upsert them into your vector store.

**How you know you're done:** Indexed chunks

#### Day 233: Retrieve on a new question

**What it means:** Embed question using compatible embedding model.

**Your small practical task:** Search top 5 authorized chunks by similarity.

**How you know you're done:** Five retrieved chunks

#### Day 234: Construct grounded model input

**What it means:** Give exact chunks as evidence; tell the model to use them or abstain.

**Your small practical task:** Build a C# prompt with QUESTION, SOURCES and allowed behavior.

**How you know you're done:** RAG answer with source IDs

#### Day 235: Run a complete demonstration

**What it means:** Use three fake policies and 12 questions, including missing information.

**Your small practical task:** Show answer, supporting text, and an honest unknown result.

**How you know you're done:** Working basic RAG demo

**Starter illustration:**

```csharp
INGEST (once per document):
File -> Extract -> Clean -> Chunk -> Embed -> Index

QUERY (once per user question):
Question -> Embed -> Search authorized chunks
         -> Context + citations -> LLM -> Answer

If evidence is missing: abstain.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)

---

### Module 48. Citations, no-answer behavior and document lifecycle (Day 236–240)

**In simple words:** A confident answer without evidence is a weak enterprise AI experience.

**Think of it like .NET:** Citations should behave like foreign keys into actual stored source records.

**Example:** “Employees have 20 days leave [HR Policy p.3]” can be checked.

**Build:** Make RAG verifiable and updateable

**Terms:** Citation, Provenance, Abstention, Document version, Index deletion

#### Day 236: Cite what was actually retrieved

**What it means:** A citation must match a real chunk/page, not a model-invented URL.

**Your small practical task:** Attach sourceId, page and snippet to each retrieved chunk.

**How you know you're done:** Citation DTO

#### Day 237: Show source previews

**What it means:** Users need to inspect where statements came from.

**Your small practical task:** In Blazor, click a citation to show a stored page/paragraph preview.

**How you know you're done:** Clickable source preview

#### Day 238: Recognize insufficient evidence

**What it means:** The safe response can be “I cannot find that in the documents”.

**Your small practical task:** Ask 5 questions not answered by source files and check behavior.

**How you know you're done:** Five abstention checks

#### Day 239: Update and delete documents

**What it means:** Changing a document requires replacing stale indexed chunks.

**Your small practical task:** Implement DeleteDocument(id) removing chunks/vectors with that source ID.

**How you know you're done:** No stale chunks after delete

#### Day 240: Finish the PDF Q&A assistant with proofs

**What it means:** Measure answers, cite real files and show failure scenarios.

**Your small practical task:** Publish README and 10 test cases: known, unknown, changed and deleted docs.

**How you know you're done:** Document Q&A project complete

**Starter illustration:**

```csharp
public sealed record Evidence(string DocumentId, int Page, string Quote);
public sealed record RagResponse(string Answer, Evidence[] Sources);
// Show original source to user. Never fabricate a page number.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp), [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)

---

## Phase 09. Make search and RAG production-ready — Days 241–270

Measure retrieval before adding complexity, then secure, update and optimize the pipeline. **Milestone:** An enterprise RAG system with hybrid search, authorization and meaningful evaluation.

### Module 49. Measure retrieval before tuning prompts (Day 241–245)

**In simple words:** Bad evidence in means bad answers out. Evaluate document retrieval on its own.

**Think of it like .NET:** Test search like a ranking feature: expected document IDs are your assertions.

**Example:** Question “How long for refunds?” should retrieve ReturnsPolicy.pdf.

**Build:** Create a retrieval evaluation harness

**Terms:** Golden dataset, Recall@k, Precision@k, MRR, nDCG

#### Day 241: Make a retrieval golden dataset

**What it means:** For each question, record relevant source IDs and passages.

**Your small practical task:** Create 30 questions mapped to relevant chunk or document IDs.

**How you know you're done:** 30 labeled retrieval cases

#### Day 242: Recall@k and Precision@k

**What it means:** Recall measures relevant items found; precision measures how many retrieved are relevant.

**Your small practical task:** Write C# RecallAtK and PrecisionAtK for one query.

**How you know you're done:** Two tested metrics

#### Day 243: MRR and nDCG

**What it means:** Ranking position matters, especially when users look only at top results.

**Your small practical task:** Calculate MRR for 4 toy ranked result lists; explain what nDCG adds.

**How you know you're done:** Ranking metric notes

#### Day 244: Test one retrieval change

**What it means:** Changing chunk size, filters or topK affects search quality.

**Your small practical task:** Run same 30 questions before and after one search parameter change.

**How you know you're done:** Before/after retrieval scores

#### Day 245: Select a reliable baseline

**What it means:** Good metrics and representative cases matter more than impressive demos.

**Your small practical task:** Write results and 5 failure examples in evals/README.md.

**How you know you're done:** Retrieval benchmark complete

**Starter illustration:**

```csharp
static double RecallAtK(
    IEnumerable<string> returned,
    HashSet<string> relevant, int k)
{
    if (relevant.Count == 0) return 1;
    int found = returned.Take(k).Count(relevant.Contains);
    return (double)found / relevant.Count;
}
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Microsoft Learn — Hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

---

### Module 50. Better RAG queries, reranking and complex questions (Day 246–250)

**In simple words:** A user question may need rewriting, decomposition or multiple pieces of evidence.

**Think of it like .NET:** Like a repository search: sometimes split a complex requirement into smaller queries.

**Example:** “Which warranty applies to items purchased last quarter?” combines policy + date.

**Build:** Improve retrieval with query rewriting and reranking

**Terms:** Query rewriting, Multi-query, Question decomposition, Reranking, Context precision

#### Day 246: Rewrite vague questions

**What it means:** Conversation context may be necessary to make a question standalone.

**Your small practical task:** Rewrite “What about next year?” using the previous leave-policy question.

**How you know you're done:** Standalone rewrite example

#### Day 247: Multi-query retrieval

**What it means:** Several reasonable paraphrases can broaden the candidate pool.

**Your small practical task:** Generate 3 query variants and combine their top results with deduplication.

**How you know you're done:** Multi-query result set

#### Day 248: Decompose two-part questions

**What it means:** Multi-hop questions need evidence from two places.

**Your small practical task:** Split 5 compound policy questions into 2 subquestions each.

**How you know you're done:** Five decomposed queries

#### Day 249: Rerank candidates

**What it means:** A second pass can improve precision of the final context.

**Your small practical task:** Compare top-8 candidate ordering before/after a ranking pass.

**How you know you're done:** Reranked shortlist

#### Day 250: Control noise and cost

**What it means:** Extra retrieval/model calls cost more; keep only improvements that measure better.

**Your small practical task:** Report Recall@5, grounded answer quality, median latency and approximate cost.

**How you know you're done:** RAG quality-cost comparison

**Starter illustration:**

```csharp
public interface IQueryRewriter
{
    Task<string> RewriteAsync(string userQuery, CancellationToken ct);
}
// Evaluate the rewritten query: it can lose dates, names or negation.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview), [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

---

### Module 51. Tenant isolation, search access and secure RAG (Day 251–255)

**In simple words:** Retrieval security must be enforced before snippets reach the LLM.

**Think of it like .NET:** TenantId is not just a UI filter: it must be part of the server-side query and authorization.

**Example:** Customer A may never retrieve Customer B’s invoice, even via prompt injection.

**Build:** Build enterprise document access filters

**Terms:** Tenant isolation, ACL, Identity filter, Authorization, Data exfiltration

#### Day 251: Record source permissions

**What it means:** Every document or chunk needs ownership and allowed access scopes.

**Your small practical task:** Add TenantId, AccessGroup and OwnerId fields to index metadata.

**How you know you're done:** Secured chunk schema

#### Day 252: Filter before retrieving

**What it means:** Do not retrieve everything then ask the LLM to hide forbidden content.

**Your small practical task:** Use server-derived TenantId in the search filter.

**How you know you're done:** Authorized-only retrieval

#### Day 253: Test document leaks

**What it means:** Malicious prompts must not override backend filters.

**Your small practical task:** Create tenant A/B documents; ask cross-tenant questions in both sessions.

**How you know you're done:** Cross-tenant tests

#### Day 254: Handle source changes

**What it means:** Deleting access must prevent stale documents from being served.

**Your small practical task:** Revoke access on one file and verify cached/retrieved results change.

**How you know you're done:** Revocation test

#### Day 255: Complete the tenant-safe RAG security gate

**What it means:** A secure RAG app has both quality and isolation evidence.

**Your small practical task:** Document permissions, filtering, test IDs and observed results.

**How you know you're done:** Tenant-safe RAG report

**Starter illustration:**

```csharp
public sealed record SearchRequest(string Text, string TenantId);
// TenantId must come from verified server-side identity.
// Never trust a TenantId supplied by the user's prompt.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp), [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)

---

### Module 52. Keep RAG documents fresh and indexes maintainable (Day 256–260)

**In simple words:** Indexing is a data pipeline with versions, updates, retries and failures.

**Think of it like .NET:** Treat ingestion as a background ETL job with an idempotent database write.

**Example:** Updating an HR policy should replace stale vector chunks, not append duplicates.

**Build:** Implement background document reindexing

**Terms:** Data pipeline, BackgroundService, Idempotency, Embedding version, Retry queue

#### Day 256: Track documents and versions

**What it means:** Use source hash, version, updated time and status.

**Your small practical task:** Create DocumentRecord with SHA256 and IndexStatus fields.

**How you know you're done:** Document manifest schema

#### Day 257: Separate job from API request

**What it means:** Large documents should run outside the upload HTTP request.

**Your small practical task:** Create a BackgroundService or queued worker skeleton for indexing.

**How you know you're done:** Indexing worker prototype

#### Day 258: Idempotent upserts

**What it means:** The same ingestion job may run more than once safely.

**Your small practical task:** Run same document twice and confirm duplicate chunk IDs are not added.

**How you know you're done:** Idempotency check

#### Day 259: Reindex on updates

**What it means:** Document changes must remove old chunks and rebuild embeddings.

**Your small practical task:** Change 1 paragraph and reindex; verify old text is absent.

**How you know you're done:** Freshness test

#### Day 260: Track failures and recover

**What it means:** A failed OCR or embedding call needs status, retry and diagnostics.

**Your small practical task:** Record status Queued/Running/Failed/Done and one retry scenario.

**How you know you're done:** Ingestion state dashboard

**Starter illustration:**

```csharp
public record IndexedDocument(
    string DocumentId, int Version, string ContentHash, DateTimeOffset IndexedAt);
// Updating or deleting a file must update/delete all related chunks.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp), [Microsoft Learn — Azure Blob Storage for .NET](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet), [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)

---

### Module 53. Advanced RAG patterns without unnecessary complexity (Day 261–265)

**In simple words:** Some questions need hierarchies, graphs, tables, images or multi-hop retrieval.

**Think of it like .NET:** Choose the smallest retrieval method that passes your tests.

**Example:** A warranty answer may require joining product, purchase date and policy.

**Build:** Prototype two advanced retrieval patterns

**Terms:** Parent-child RAG, Table retrieval, Knowledge graph, GraphRAG, Long-context tradeoff

#### Day 261: Hierarchical or parent-child RAG

**What it means:** Retrieve a precise chunk, but send a wider parent passage for answer context.

**Your small practical task:** Build ParentSectionId search and retrieve its full parent on a match.

**How you know you're done:** Parent-child search demo

#### Day 262: Tables and layouts

**What it means:** Important facts can live inside PDF tables that naive extraction mangles.

**Your small practical task:** Use one policy table; compare line-by-line vs structure-preserving extraction.

**How you know you're done:** Table extraction report

#### Day 263: Knowledge graph idea

**What it means:** Entity relationships can answer cross-document questions.

**Your small practical task:** Model Customer → Order → Product → Warranty as C# records and links.

**How you know you're done:** Tiny knowledge graph

#### Day 264: GraphRAG and multi-hop overview

**What it means:** Graph retrieval may help relational questions but increases operational complexity.

**Your small practical task:** Sketch a graph lookup + vector lookup for one complex question.

**How you know you're done:** Hybrid graph design

#### Day 265: Long context vs RAG

**What it means:** Larger context windows do not remove freshness, access and citation requirements.

**Your small practical task:** Compare cost and evidence quality for 10 chunks versus whole document.

**How you know you're done:** Tradeoff decision record

**Starter illustration:**

```csharp
public record DocumentSection(string ParentId, string SectionText);
public record Chunk(string ParentId, string ChunkText, int Page);
// Retrieve a small child chunk, optionally send its parent section.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Microsoft GraphRAG — advanced elective](https://github.com/microsoft/graphrag), [Azure AI Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/)

---

### Module 54. Refactor with Microsoft.Extensions.AI and .NET patterns (Day 266–270)

**In simple words:** Once raw model calls are clear, interfaces help swap providers and add middleware.

**Think of it like .NET:** IChatClient is like HttpClient abstraction; DI controls lifetimes and test substitutes.

**Example:** The same Blazor app can use a fake or real chat provider behind IChatClient.

**Build:** Refactor RAG/chat into provider-neutral .NET services

**Terms:** IChatClient, IEmbeddingGenerator, Dependency injection, Adapter, Middleware

#### Day 266: What IChatClient solves

**What it means:** A common interface decouples your app from one model provider.

**Your small practical task:** Locate IChatClient in official docs and sketch your existing AI service using it.

**How you know you're done:** Refactoring diagram

#### Day 267: Chat and embedding abstractions

**What it means:** Embedding generation has its own input/output contract.

**Your small practical task:** Create an adapter interface and register a fake embedding generator.

**How you know you're done:** DI-ready abstraction

#### Day 268: Use standard .NET DI

**What it means:** Your server should compose providers like other external dependencies.

**Your small practical task:** Refactor ChatService constructor to accept IChatClient or your adapter.

**How you know you're done:** Provider-agnostic service

#### Day 269: Add middleware and resilience

**What it means:** Logging, telemetry, caching and retries belong outside core domain logic.

**Your small practical task:** Wrap a fake client with a timing or logging middleware.

**How you know you're done:** Measured request trace

#### Day 270: Test provider swapping

**What it means:** App behavior must not depend on one SDK package.

**Your small practical task:** Run the same controller tests using a mock and a configured real provider.

**How you know you're done:** Refactor + test evidence

**Starter illustration:**

```csharp
// Microsoft.Extensions.AI provides abstractions:
// IChatClient and IEmbeddingGenerator<TInput,TEmbedding>
// Use DI to inject chat, embeddings and instrumentation.
// Keep your own domain/business logic independent of provider.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft.Extensions.AI — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai), [Microsoft.Extensions.AI — source](https://github.com/dotnet/extensions/tree/main/src/Libraries/Microsoft.Extensions.AI.Abstractions), [.NET AI samples](https://github.com/dotnet/ai-samples)

---

## Phase 10. Agents, stateful workflows and interoperable tools — Days 271–300

Move from one tool request to safely controlled workflows—then learn the agent protocols. **Milestone:** A bounded support agent, a reviewer workflow and a C# MCP server/client.

### Module 55. Agent vs tool call vs ordinary workflow (Day 271–275)

**In simple words:** An agent combines model decisions, tools and state in a bounded execution loop.

**Think of it like .NET:** A workflow is your fixed C# pipeline; an agent gets to choose some next steps.

**Example:** Support agent reads an order, checks policy and drafts next action.

**Build:** Build the smallest agent execution loop

**Terms:** Agent loop, State, Tool budget, Termination, Workflow

#### Day 271: Define the difference

**What it means:** A single tool call is not necessarily a long-lived autonomous agent.

**Your small practical task:** Compare 3 diagrams: LLM answer, tool call and 3-step agent loop.

**How you know you're done:** Three system patterns

#### Day 272: Instructions, tools and state

**What it means:** An agent needs a goal, allowed tools and state.

**Your small practical task:** Create AgentState with RequestId, Messages, ToolCount and MaxSteps.

**How you know you're done:** Typed agent state

#### Day 273: Execute one loop

**What it means:** Ask model for a safe tool or final answer, then continue with results.

**Your small practical task:** Implement pseudo-agent switch with two fake tools.

**How you know you're done:** Bounded loop demonstration

#### Day 274: Plan for termination

**What it means:** Without max steps/time/cost, loops can run indefinitely.

**Your small practical task:** Add MaxSteps=4 and timeout; simulate a looping model.

**How you know you're done:** Safe stop behavior

#### Day 275: Prefer simple code for fixed tasks

**What it means:** A deterministic .NET workflow is easier to test for many tasks.

**Your small practical task:** Write a decision note comparing the agent with an ordinary service method.

**How you know you're done:** Agent justification

**Starter illustration:**

```csharp
for (int step = 0; step < maxSteps; step++) {
    var proposal = await AskModelAsync(state);
    if (proposal.IsFinal) return proposal.Answer;
    ValidateToolArguments(proposal);
    AuthorizeUserAndTool(proposal);
    if (proposal.IsSensitive) await RequireHumanApproval();
    await ExecuteToolWithTimeoutAsync(proposal);
}
throw new Exception("Agent step limit reached");
// Names are illustrative, not drop-in framework API.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Agent Framework course](https://learn.microsoft.com/en-us/agent-framework/get-started/), [Microsoft Agent Framework for .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet), [Agent Framework — numbered .NET samples](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/01-get-started)

---

### Module 56. Conversation, working, semantic and long-term memory (Day 276–280)

**In simple words:** Different kinds of memory belong in different stores; not everything is an embedding.

**Think of it like .NET:** SQL is for durable business facts; Redis is session state; vectors help find similar notes.

**Example:** Customer shipping address is not a fuzzy “memory”—read it from the source database.

**Build:** Design privacy-aware agent memory

**Terms:** Short-term memory, Working memory, Long-term memory, Semantic memory, Compaction

#### Day 276: Short-term conversation

**What it means:** Recent chat turns allow conversational continuity.

**Your small practical task:** Store 5 turns per ConversationId using a C# dictionary.

**How you know you're done:** Short-term memory store

#### Day 277: Working memory is task state

**What it means:** Agent steps need temporary variables and results.

**Your small practical task:** Keep current OrderId, tool outputs and next task in AgentState.

**How you know you're done:** Working-state record

#### Day 278: Long-term user preferences

**What it means:** Persistent preferences must be explicit, relevant and removable.

**Your small practical task:** Design SQL schema for opted-in preferences and DeletePreference endpoint.

**How you know you're done:** Preference schema

#### Day 279: Semantic and episodic memory

**What it means:** Vectors can retrieve similar experiences, but are not reliable transactional truth.

**Your small practical task:** Outline a vector note search with filters, time and provenance.

**How you know you're done:** Semantic memory design

#### Day 280: Compaction and forgetting

**What it means:** Summaries save context but may omit important constraints.

**Your small practical task:** Write memory summary rules and a retention/deletion policy.

**How you know you're done:** Memory lifecycle checklist

**Starter illustration:**

```csharp
public record ConversationMessage(string Role, string Text);
public record SessionState(string SessionId, List<ConversationMessage> History);
// Do not treat old chat turns as an authorized source of business facts.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Agent Framework course](https://learn.microsoft.com/en-us/agent-framework/get-started/), [Microsoft Agent Framework for .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet), [Microsoft.Extensions.AI — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai)

---

### Module 57. Microsoft Agent Framework from basic to useful (Day 281–285)

**In simple words:** Microsoft Agent Framework provides C# agents, tools, sessions and workflow building blocks.

**Think of it like .NET:** Learn the framework AFTER manual tool/loop experiments so it does not hide fundamentals.

**Example:** Turn your order-checking assistant into an Agent Framework C# agent.

**Build:** Build the Customer Support Agent

**Terms:** Agent Framework, AIAgent, Agent session, Function tool, RAG tool

#### Day 281: Find the C# quickstart

**What it means:** The .NET tutorial starts with an agent and adds capabilities progressively.

**Your small practical task:** Open Agent Framework .NET 01-get-started samples and run the hello agent.

**How you know you're done:** Hello agent output

#### Day 282: Add a C# function tool

**What it means:** Tool methods can be registered for model-initiated use.

**Your small practical task:** Register GetOrderStatus on your agent using the sample pattern.

**How you know you're done:** Tool-enabled framework agent

#### Day 283: Support multiple turns

**What it means:** A session provides conversation state for follow-up requests.

**Your small practical task:** Ask order status then “What about its shipment?” in same session.

**How you know you're done:** Multi-turn agent conversation

#### Day 284: Add a knowledge search tool

**What it means:** Reuse earlier RAG service rather than duplicating it.

**Your small practical task:** Register SearchKnowledgeBase with permission filtering.

**How you know you're done:** RAG-capable support agent

#### Day 285: Review the whole agent

**What it means:** It must stop, respect identity and log tool calls.

**Your small practical task:** Test known order, missing order and unauthorized user.

**How you know you're done:** Support Agent v1 demo

**Starter illustration:**

```csharp
public interface IOrderLookupTool
{
    Task<OrderDto?> GetOrderAsync(int orderId, CancellationToken ct);
}
// Agent Framework can expose this as a function tool.
// Keep authorization inside the actual implementation.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Agent Framework course](https://learn.microsoft.com/en-us/agent-framework/get-started/), [Agent Framework — numbered .NET samples](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/01-get-started), [Microsoft Agent Framework for .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet)

---

### Module 58. Human approvals, durable execution and workflow design (Day 286–290)

**In simple words:** Sensitive actions need explicit approval, and long jobs need persisted checkpoints.

**Think of it like .NET:** Approval is a business workflow state, not a polite line in a prompt.

**Example:** Refund tool returns PendingApproval until an authorized human confirms it.

**Build:** Build controlled support workflows

**Terms:** Human-in-the-loop, Checkpoint, Durable workflow, Approval, Idempotency

#### Day 286: Read vs write permissions

**What it means:** Read-only tools are lower risk than refunds or cancellations.

**Your small practical task:** Classify all your tools as read, write or sensitive.

**How you know you're done:** Tool permission matrix

#### Day 287: Human approval means pause

**What it means:** Stop before performing a sensitive side effect.

**Your small practical task:** Implement PendingApproval state and an Approve endpoint protected by policy.

**How you know you're done:** Approval workflow

#### Day 288: Checkpoints support recovery

**What it means:** Persist state so a process can resume after restart.

**Your small practical task:** Store workflow state JSON in SQL and reload it in a new run.

**How you know you're done:** Resumable workflow

#### Day 289: Make side effects idempotent

**What it means:** Retry must not duplicate refund or ticket creation.

**Your small practical task:** Use an operation ID and prevent duplicate CreateTicket actions.

**How you know you're done:** Retry-safe ticket write

#### Day 290: Review completion criteria

**What it means:** An agent is done only if the business outcome was verified.

**Your small practical task:** Test reject, approve, timeout and resumed workflow paths.

**How you know you're done:** Four workflow tests

**Starter illustration:**

```csharp
enum ToolDecision { Allowed, NeedsApproval, Denied }
ToolDecision decision = ToolDecision.NeedsApproval;
if (decision != ToolDecision.Allowed)
    Console.WriteLine("No mutation is executed yet.");
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Agent Framework — .NET workflows](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/03-workflows), [Microsoft Learn — Agent Framework course](https://learn.microsoft.com/en-us/agent-framework/get-started/), [Microsoft Entra identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/)

---

### Module 59. Sequential, parallel and reviewer agent workflows (Day 291–295)

**In simple words:** Multiple agents are useful only when they add measurable quality or separation.

**Think of it like .NET:** C# Task.WhenAll is parallel work; the reviewer step is an explicit quality gate.

**Example:** Researcher → Reviewer → Writer is clearer than 10 agents chatting endlessly.

**Build:** Build the Researcher + Reviewer workflow

**Terms:** Sequential workflow, Parallel orchestration, Reviewer agent, Handoff, Termination rule

#### Day 291: Sequential workflow

**What it means:** Output from one step becomes input for the next.

**Your small practical task:** Build Researcher → Reviewer pipeline with two framework agents.

**How you know you're done:** Sequential research draft

#### Day 292: Parallel research

**What it means:** Independent tasks may run concurrently with controlled aggregation.

**Your small practical task:** Add two information gatherers and merge their evidence list.

**How you know you're done:** Parallel evidence stage

#### Day 293: Reviewer workflow

**What it means:** A critic checks unsupported claims and requests corrections.

**Your small practical task:** Add reviewer criteria: sources present, caveats stated, formatting correct.

**How you know you're done:** Review rubric

#### Day 294: Bound cycles

**What it means:** Unbounded rewrite loops can multiply latency and cost.

**Your small practical task:** Limit review to two rounds, record decision and stop reason.

**How you know you're done:** Termination rule tests

#### Day 295: Compare against one agent

**What it means:** More agents increase latency and tool risk; prove the gain.

**Your small practical task:** Measure draft quality, token usage and time for single vs multi-agent.

**How you know you're done:** Multi-agent tradeoff report

**Starter illustration:**

```csharp
Sequential: Research -> Review -> Edit
Parallel:   ResearchA + ResearchB -> Merge
Approval:   ProposedRefund -> WaitForHuman -> Execute
Rule: Prefer a simple C# function when the steps are known.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Agent Framework — .NET workflows](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/03-workflows), [Agent Framework — numbered .NET samples](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/01-get-started), [Microsoft Agent Framework for .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet)

---

### Module 60. MCP server, client and agent-to-agent basics (Day 296–300)

**In simple words:** MCP standardizes how AI clients discover and call external tools, prompts and resources.

**Think of it like .NET:** MCP is an adapter protocol; your authorization and business services remain ordinary .NET.

**Example:** An MCP tool get_order uses the same IOrderService as your ASP.NET API.

**Build:** Build a C# MCP Server and Client

**Terms:** MCP, MCP server, MCP client, Tools/resources/prompts, A2A

#### Day 296: Understand host/client/server

**What it means:** An AI host uses an MCP client to talk to an MCP server.

**Your small practical task:** Draw AI app → MCP client → MCP server → IOrderService.

**How you know you're done:** MCP architecture

#### Day 297: Tools, resources and prompts

**What it means:** Tools perform operations; resources expose data; prompts are reusable patterns.

**Your small practical task:** List two tools, one read-only resource and one prompt for order support.

**How you know you're done:** MCP capability inventory

#### Day 298: Write MCP server in C#

**What it means:** Use the official MCP C# SDK rather than a Python tutorial.

**Your small practical task:** Expose get_order_status from a small .NET host with fake database.

**How you know you're done:** Running C# MCP server

#### Day 299: Connect and authorize a client

**What it means:** Transport and discovery do not replace caller authentication/permissions.

**Your small practical task:** Call server tool from a C# MCP client and reject an unauthorized request.

**How you know you're done:** Client + auth demo

#### Day 300: A2A is a different layer

**What it means:** A2A relates to communication between agents, not the same as MCP tools.

**Your small practical task:** Draw MCP vs A2A diagram; note when agent interoperability is useful.

**How you know you're done:** MCP vs A2A comparison

**Starter illustration:**

```csharp
ASP.NET / AI Host
    -> MCP Client (C#)
        -> MCP Server (C#)
            -> get_order_status TOOL
                -> IOrderService / SQL

Tools are discoverable. Caller authorization is still mandatory.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Get started with .NET MCP](https://learn.microsoft.com/en-us/dotnet/ai/get-started-mcp), [Official MCP C# SDK](https://github.com/modelcontextprotocol/csharp-sdk), [MCP specification and concepts](https://modelcontextprotocol.io/docs/getting-started/intro), [A2A protocol documentation](https://a2a-protocol.org/latest/)

---

## Phase 11. Beyond chat: multimodal, local and model internals — Days 301–330

Understand images, audio, local inference and when fine-tuning is appropriate. **Milestone:** One document/voice mini app and an evidence-based model-selection report.

### Module 61. Images, OCR and Azure Document Intelligence (Day 301–305)

**In simple words:** Images may contain text, tables, layout and objects, requiring different processing choices.

**Think of it like .NET:** OCR extracts characters; vision interpretation describes visual content; layouts need structured extraction.

**Example:** An invoice image needs exact totals and field coordinates, not just a casual caption.

**Build:** Build the Invoice Intake Assistant

**Terms:** Computer vision, OCR, Layout extraction, Azure Document Intelligence, Confidence

#### Day 301: Vision classification and captioning

**What it means:** Image models can label objects and describe scenes but can still make errors.

**Your small practical task:** Compare image classification, object detection and captioning in a small decision table.

**How you know you're done:** Image-task matrix

#### Day 302: OCR means reading characters

**What it means:** OCR extracts text, particularly from scans and photos.

**Your small practical task:** Run one sample receipt through Document Intelligence or review the official .NET sample.

**How you know you're done:** Extracted text and confidence

#### Day 303: Structured document extraction

**What it means:** Invoices need line items, totals and key/value fields.

**Your small practical task:** Map extracted fields into C# InvoiceDto with nullable values.

**How you know you're done:** Typed invoice DTO

#### Day 304: Validate numbers in backend

**What it means:** Never trust an image model for exact money calculations without checking.

**Your small practical task:** Check sum of line items vs invoice total and flag mismatch.

**How you know you're done:** Invoice validation result

#### Day 305: Make errors reviewable

**What it means:** Low-confidence or missing fields should require human verification.

**Your small practical task:** Design a Blazor review form highlighting doubtful fields.

**How you know you're done:** Invoice review UI

**Starter illustration:**

```csharp
public record ExtractedInvoice(
    string? InvoiceNumber, decimal? Total, bool NeedsHumanReview);
// Compare line item totals using deterministic decimal arithmetic.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure AI Vision](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/), [Azure AI Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

---

### Module 62. Audio, speech and real-time interaction (Day 306–310)

**In simple words:** Speech apps combine recording, speech-to-text, language processing and text-to-speech.

**Think of it like .NET:** It is an async streaming pipeline with latency, privacy and interruption concerns.

**Example:** Voice complaint → transcribed text → AI ticket extraction → spoken confirmation.

**Build:** Build a small voice-note assistant

**Terms:** Speech-to-text, Text-to-speech, VAD, Streaming, Audio privacy

#### Day 306: Speech-to-text

**What it means:** Transcription maps spoken audio to text, which can contain recognition mistakes.

**Your small practical task:** Use Azure Speech SDK C# quickstart or a sample prerecorded audio file.

**How you know you're done:** One transcript

#### Day 307: Text-to-speech

**What it means:** TTS generates spoken audio from text; it is not the same as transcription.

**Your small practical task:** Use the speech SDK to read back a short support confirmation.

**How you know you're done:** Spoken confirmation

#### Day 308: Voice activity detection

**What it means:** A system must know when a user starts or stops speaking.

**Your small practical task:** Draw mic → VAD → transcription → model → TTS.

**How you know you're done:** Voice pipeline diagram

#### Day 309: Streaming latency matters

**What it means:** Users expect interruptible, responsive speech.

**Your small practical task:** Record latency at transcription, model and TTS stages on paper or in logs.

**How you know you're done:** Latency budget table

#### Day 310: Privacy and consent

**What it means:** Voice files can be personal data and require careful retention.

**Your small practical task:** Design consent, short retention and delete-recording controls.

**How you know you're done:** Voice privacy checklist

**Starter illustration:**

```csharp
public record Transcript(string Text, string? Language, bool IsFinal);
// Confirm spoken business changes explicitly before executing tools.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure Speech service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)

---

### Module 63. Multimodal apps: images, tables, audio and video (Day 311–315)

**In simple words:** Multimodal systems use more than one data modality and need consistent evidence.

**Think of it like .NET:** A Blazor form can attach text and image together just like a multipart upload.

**Example:** A user uploads a faulty-product photo plus text to create a support case.

**Build:** Extend support assistant for mixed inputs

**Terms:** Multimodal model, Image input, Audio input, Video sampling, Multimodal RAG

#### Day 311: What modality means

**What it means:** Text, image, audio and video carry different types of information.

**Your small practical task:** List modality and required backend processing for 6 product features.

**How you know you're done:** Modalities table

#### Day 312: Text and image together

**What it means:** Mixed input can help identify objects or symptoms from photos.

**Your small practical task:** Design DTO with user text and validated image metadata.

**How you know you're done:** Multimodal request contract

#### Day 313: Images in a RAG corpus

**What it means:** Image-heavy files may need OCR, captions or extracted layouts.

**Your small practical task:** Add a simple image-description field to a document chunk record.

**How you know you're done:** Multimodal chunk model

#### Day 314: Video is a sequence over time

**What it means:** Video often requires sampled frames and audio; do not assume every model accepts full video.

**Your small practical task:** Sketch frame samples + transcript + timestamps for a 20-second clip.

**How you know you're done:** Video processing sketch

#### Day 315: Accessible and safe UX

**What it means:** Media upload requires size limits, feedback and alternate text where appropriate.

**Your small practical task:** Add format/file-size/permission rules for image, audio and video uploads.

**How you know you're done:** Media safety checklist

**Starter illustration:**

```csharp
public record MediaRequest(
    string? UserText, string? ImageId, string? AudioId);
// Files require validation, authorization and type-specific processing.
// Do not blindly embed raw image/audio bytes into an ordinary text prompt.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure AI Vision](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/), [Azure Speech service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/), [Azure AI Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/)

---

### Module 64. Local LLMs, Ollama and model routing (Day 316–320)

**In simple words:** Local models trade operating responsibility for greater control; route tasks based on measured requirements.

**Think of it like .NET:** You can use localhost model inference the way you call any internal HTTP service.

**Example:** Cheap fast model for classification; stronger model for difficult reasoning.

**Build:** Run a local model and compare results

**Terms:** Local inference, Ollama, Open-weight model, Model routing, Benchmark

#### Day 316: Local vs cloud

**What it means:** Local model means you manage hardware, upgrades and security.

**Your small practical task:** Create comparison table for Azure hosted vs local inference.

**How you know you're done:** Local/cloud tradeoff table

#### Day 317: Run Ollama optionally

**What it means:** Ollama runs supported open-weight models on suitable hardware.

**Your small practical task:** Install Ollama only if your machine supports it; run a small model with sample prompt.

**How you know you're done:** Local model response or documented setup

#### Day 318: Call local from C#

**What it means:** Many local inference runtimes offer HTTP/OpenAI-compatible endpoints.

**Your small practical task:** Make a basic .NET HTTP call to a local endpoint using config variables.

**How you know you're done:** Local call code

#### Day 319: Choose a model per task

**What it means:** Selection depends on quality, modality, cost, privacy and latency.

**Your small practical task:** Write model-routing rules for FAQ, summarization and sensitive invoices.

**How you know you're done:** Routing policy table

#### Day 320: Benchmark with fixed questions

**What it means:** Do not claim one model is better without testing actual tasks.

**Your small practical task:** Run 10 same prompts on two available models and compare validity/time/cost.

**How you know you're done:** Model comparison report

**Starter illustration:**

```csharp
public enum ModelTier { Local, FastCloud, ReasoningCloud }
public interface IModelSelector { ModelTier Select(string task); }
// Prefer a small, measurable routing policy; log quality and latency.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Ollama local-model runner](https://github.com/ollama/ollama), [Microsoft.Extensions.AI — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai), [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/)

---

### Module 65. When to use RAG vs fine-tuning vs training (Day 321–325)

**In simple words:** RAG supplies fresh facts; fine-tuning changes tendencies or behavior; new model training is a larger undertaking.

**Think of it like .NET:** RAG is querying a knowledge store; fine-tuning resembles modifying the learned program.

**Example:** Company leave policy changes daily → RAG; stable structured format may be tuned.

**Build:** Create a decision guide for model adaptation

**Terms:** Fine-tuning, RAG vs tuning, LoRA, QLoRA, Training data

#### Day 321: RAG adds external knowledge

**What it means:** Retrieval can be updated without retraining a model.

**Your small practical task:** Write 3 examples of frequently changing company facts that need RAG.

**How you know you're done:** RAG candidates list

#### Day 322: Fine-tuning updates weights

**What it means:** Fine-tuning adjusts a trained model using curated examples.

**Your small practical task:** Outline a 30-example JSONL instruction dataset with fake support scenarios.

**How you know you're done:** Example data format

#### Day 323: LoRA and QLoRA intuition

**What it means:** Parameter-efficient fine-tuning reduces how many parameters must be updated.

**Your small practical task:** Describe LoRA and QLoRA in 3 sentences without deriving matrix math.

**How you know you're done:** Plain-language notes

#### Day 324: Quality and safety prerequisites

**What it means:** Bad training data and missing evaluation can make tuned behavior worse.

**Your small practical task:** Specify held-out test set, privacy review, budget and rollback plan.

**How you know you're done:** Fine-tune preflight checklist

#### Day 325: Choose adapt vs prompt vs retrieve

**What it means:** Many tasks improve more cheaply from prompts, tools or RAG.

**Your small practical task:** Build 12-scenario decision table selecting prompt, tool, RAG, fine-tune or ML.

**How you know you're done:** 12-case selection guide

**Starter illustration:**

```csharp
Need current private facts?      -> RAG
Need real-time business data?  -> Tools / APIs
Need a precise output schema?  -> Structured output
Need stable behavior changes?  -> Consider fine-tuning
Need a numeric prediction?    -> Consider ML.NET
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/), [Azure Machine Learning documentation](https://learn.microsoft.com/en-us/azure/machine-learning/), [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet)

---

### Module 66. Performance, ONNX, quantization and deeper ML paths (Day 326–330)

**In simple words:** AI performance depends on hardware, model representation, batching and inference libraries.

**Think of it like .NET:** Think of optimizing a database query: measure first, then optimize the bottleneck.

**Example:** Quantization reduces weight precision; ONNX Runtime can execute compatible models in C#.

**Build:** Create an inference-performance experiment

**Terms:** Quantization, ONNX Runtime, CPU/GPU, Latency, Throughput

#### Day 326: CPU, GPU, RAM and VRAM

**What it means:** Inference hardware constraints affect model choice and throughput.

**Your small practical task:** Draw where data/model weights reside for CPU vs GPU serving.

**How you know you're done:** Hardware comparison

#### Day 327: What quantization changes

**What it means:** Lower precision can save memory but may reduce quality.

**Your small practical task:** Compare conceptual FP32/FP16/INT8 byte sizes for 1 million numbers.

**How you know you're done:** Memory-size table

#### Day 328: ONNX with C#

**What it means:** ONNX is a format/runtime ecosystem for serving compatible ML models.

**Your small practical task:** Follow the ONNX Runtime C# guide with a sample model if feasible.

**How you know you're done:** ONNX runtime notes/demo

#### Day 329: Latency and throughput

**What it means:** One request timing differs from requests per second under load.

**Your small practical task:** Measure stopwatch latency for 50 calls to a fake model endpoint.

**How you know you're done:** P50/P95 timing table

#### Day 330: Optional deeper ML curriculum

**What it means:** Advanced training includes backprop, loss, optimizers, transformers and evaluation.

**Your small practical task:** Choose an elective: deeper math, Azure ML pipelines, or training research; write reasons.

**How you know you're done:** Advanced study selection

**Starter illustration:**

```csharp
var clock = System.Diagnostics.Stopwatch.StartNew();
// Run one ONNX Runtime, API or local model inference here.
clock.Stop();
Console.WriteLine($"Inference took {clock.ElapsedMilliseconds}ms");
// Warmup, batching and actual model accuracy affect comparisons.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [ONNX Runtime .NET](https://onnxruntime.ai/docs/get-started/with-csharp.html), [ONNX Runtime repository](https://github.com/microsoft/onnxruntime), [Azure Machine Learning documentation](https://learn.microsoft.com/en-us/azure/machine-learning/), [PyTorch — optional deep learning](https://pytorch.org/tutorials/)

---

## Phase 12. Secure, measure and ship an enterprise .NET AI platform — Days 331–360

Test security, evaluate quality, add telemetry and deploy with standard Azure engineering practices. **Milestone:** A documented, secured, observable Azure-hosted AI platform with CI/CD and an honest demo.

### Module 67. AI security, privacy and responsible system design (Day 331–335)

**In simple words:** AI adds novel attack surfaces, but your regular .NET defenses still apply.

**Think of it like .NET:** Treat prompts, files, tools and model output as untrusted input.

**Example:** A retrieved PDF might contain text asking to leak another tenant’s data.

**Build:** Threat-model all AI data and tool boundaries

**Terms:** Prompt injection, Indirect injection, PII, Tenant isolation, Tool abuse

#### Day 331: Prompt injection vs normal injection

**What it means:** An attacker may place commands inside text given to the model.

**Your small practical task:** Make an attack diagram showing untrusted file → retrieval → model → tool.

**How you know you're done:** Prompt-injection threat map

#### Day 332: Data leaks and tenant isolation

**What it means:** Authorization cannot be delegated to the model.

**Your small practical task:** Test cross-tenant search, session leakage and tool-argument validation.

**How you know you're done:** Three access-control tests

#### Day 333: Secrets and PII

**What it means:** Model telemetry, prompts and traces may reveal sensitive data if logged carelessly.

**Your small practical task:** Mark which fields to redact in logs and evaluation datasets.

**How you know you're done:** Data classification map

#### Day 334: Content filtering and safe actions

**What it means:** Harmful inputs/outputs and unsafe tool proposals need layered controls.

**Your small practical task:** Design validators before and after model calls and for each write tool.

**How you know you're done:** Defense-in-depth diagram

#### Day 335: Create threat model and review

**What it means:** A completed app should identify risks, controls and residual gaps.

**Your small practical task:** Write STRIDE-inspired threat table for model, files, tools, vector DB, UI.

**How you know you're done:** AI security checklist

**Starter illustration:**

```csharp
public interface IAuthorizedOrderService
{
    Task<OrderDto?> GetForCurrentUserAsync(int id, CancellationToken ct);
}
// Never let an LLM select a different user's TenantId.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/), [Microsoft Responsible AI resources](https://www.microsoft.com/en-us/ai/responsible-ai), [Microsoft Entra identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/)

---

### Module 68. Test and evaluate chat, RAG and agents (Day 336–340)

**In simple words:** The best AI regression testing combines deterministic checks, labeled evidence and human review.

**Think of it like .NET:** Write xUnit for exact C# behavior; score fuzzy model outputs with careful rubrics.

**Example:** Answers can be relevant but unsupported, or grounded but incomplete.

**Build:** Build your full AI evaluation suite

**Terms:** RAG evaluation, Groundedness, LLM-as-judge, Golden set, Red teaming

#### Day 336: Separate deterministic tests

**What it means:** Business rules and DTO parsing must have ordinary unit tests.

**Your small practical task:** Add xUnit tests for DTO validation, auth filters and tool stop conditions.

**How you know you're done:** Deterministic test suite

#### Day 337: Evaluate retrieval and answers separately

**What it means:** Finding the right chunk does not guarantee a correct final answer.

**Your small practical task:** Create 50 RAG cases with expected evidence and answer criteria.

**How you know you're done:** 50-case golden dataset

#### Day 338: Groundedness and relevance

**What it means:** A response is grounded only when its claims follow available evidence.

**Your small practical task:** Review 10 answers against actual passages; mark unsupported claims.

**How you know you're done:** Groundedness scorecard

#### Day 339: LLM-as-judge limitations

**What it means:** A model judge is convenient but biased and can disagree with humans.

**Your small practical task:** Compare 10 manual review scores with automated judge scores if available.

**How you know you're done:** Judge agreement notes

#### Day 340: Run regression and red-team tests

**What it means:** Every prompt/model/index change can regress quality or security.

**Your small practical task:** Create a command or test script producing pass/fail summary for 50 cases + attacks.

**How you know you're done:** CI-ready evaluation report

**Starter illustration:**

```csharp
string[] retrieved = ["policy-7", "policy-2"];
string expected = "policy-7";
Console.WriteLine(retrieved.Take(2).Contains(expected)); // True
// Expand to Recall@k, groundedness checks and negative cases.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/), [Microsoft Agent Framework for .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet)

---

### Module 69. Observability, cost, resilience and AI gateway (Day 341–345)

**In simple words:** Operate AI as an external dependency with tracing, budgets, retries and measurable outcomes.

**Think of it like .NET:** ILogger + OpenTelemetry + Polly-style resilience concepts still apply.

**Example:** Trace shows API → retrieval → model → tool → final response, including costs.

**Build:** Instrument and harden your platform

**Terms:** OpenTelemetry, Tokens and cost, Rate limiting, Caching, Model gateway

#### Day 341: Trace the full request

**What it means:** Correlate HTTP, vector query, model call and tools using one trace ID.

**Your small practical task:** Add ActivitySource/OpenTelemetry spans to the AI service.

**How you know you're done:** End-to-end trace

#### Day 342: Measure latency, tokens and spend

**What it means:** Track per-model input/output tokens, p95 latency, error rate and budget.

**Your small practical task:** Record metrics with model name and pseudonymous request ID.

**How you know you're done:** AI metrics dashboard

#### Day 343: Rate limits and bounded retries

**What it means:** Handle 429/timeouts with limits; do not retry side effects blindly.

**Your small practical task:** Write an exponential backoff policy for safe read-only model calls.

**How you know you're done:** Resilience tests

#### Day 344: Cache and fallback carefully

**What it means:** Cache stable safe results, protect tenant-scoped data and invalidate on updates.

**Your small practical task:** Build a simple FAQ cache key including tenant, prompt/model/index version.

**How you know you're done:** Safe caching plan

#### Day 345: Expose a model gateway

**What it means:** Route requests by SLA, quality and cost; fail safely if provider unavailable.

**Your small practical task:** Define IModelRouter with two configured/fake providers and cost controls.

**How you know you're done:** Provider fallback test

**Starter illustration:**

```csharp
Validate request + identity + budget
  -> Retrieve only authorized data
  -> Call model with CancellationToken
  -> Trace tokens/latency/cost
  -> Validate tool args again before side effects
  -> Avoid retrying non-idempotent writes
  -> Fail safely if provider is unavailable
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [OpenTelemetry .NET](https://github.com/open-telemetry/opentelemetry-dotnet), [Microsoft Learn — Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview), [Microsoft.Extensions.AI — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai), [.NET Aspire](https://github.com/dotnet/aspire)

---

### Module 70. Azure deployment, identity and infrastructure as code (Day 346–350)

**In simple words:** Move secure backend components into Azure using familiar .NET deployment practices.

**Think of it like .NET:** Identity and Key Vault are dependencies of the deployment, not prompt instructions.

**Example:** Blazor/ASP.NET app + Foundry model + Azure AI Search + Blob Storage + telemetry.

**Build:** Deploy a small Azure-hosted AI service

**Terms:** Microsoft Foundry, Azure AI Search, Managed identity, Bicep, Azure Developer CLI

#### Day 346: Draw the Azure topology

**What it means:** Choose app host, identity, model endpoint, search and storage.

**Your small practical task:** Create architecture diagram with Blazor, ASP.NET, Foundry, Search, Blob and Monitor.

**How you know you're done:** Azure architecture diagram

#### Day 347: Use Entra and managed identity

**What it means:** Prefer identity-based auth over long-lived embedded keys where supported.

**Your small practical task:** Configure server authentication/authorization plan and managed identity permissions.

**How you know you're done:** Identity permission matrix

#### Day 348: Bicep / azd for repeatability

**What it means:** Infrastructure should be declarative and removable.

**Your small practical task:** Start from official C# RAG Azure Developer CLI/Bicep template; inspect resources before running.

**How you know you're done:** IaC review notes

#### Day 349: Deploy minimal and observe

**What it means:** Provision only needed Azure resources; verify costs and access restrictions.

**Your small practical task:** Run azd up where budget/permissions allow; test API from browser.

**How you know you're done:** Staging deployment or reproducible plan

#### Day 350: Tear down unused resources

**What it means:** Cloud labs can bill even when not in use.

**Your small practical task:** Use azd down when appropriate, inspect Azure billing and record cleanup.

**How you know you're done:** Azure deployment/cleanup record

**Starter illustration:**

```csharp
azd auth login
# Inspect the chosen C# Azure template and estimated cost.
azd up
# Validate logs, auth, evaluation and resource list.
azd down
# Clean up cloud lab resources when finished.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/), [Microsoft Entra identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/), [Microsoft Learn — Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview), [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview), [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp)

---

### Module 71. CI/CD, release gates, governance and feedback (Day 351–355)

**In simple words:** Production AI needs versioned prompts/models/indexes and rollback just like web software.

**Think of it like .NET:** Your release pipeline checks code AND AI quality before promotion.

**Example:** A new prompt that reduces Recall@5 or leaks data must block release.

**Build:** Build an AI-aware .NET delivery pipeline

**Terms:** CI/CD, Feature flag, Rollback, AI quality gate, Governance

#### Day 351: Version everything

**What it means:** Code, prompt templates, vector index schema and evaluation sets are release assets.

**Your small practical task:** Create version entries for prompt, model, embedding and index schema.

**How you know you're done:** Release manifest

#### Day 352: Automate builds and unit tests

**What it means:** Use familiar dotnet restore/build/test in CI.

**Your small practical task:** Add a GitHub Actions or Azure DevOps pipeline for solution tests.

**How you know you're done:** Green CI run

#### Day 353: Add AI regression gates

**What it means:** Golden set and security checks can fail a release.

**Your small practical task:** Add a scripted quality threshold and tenant-isolation checks.

**How you know you're done:** AI quality gate

#### Day 354: Canary, feature flag and rollback

**What it means:** Safely compare updates before all users receive them.

**Your small practical task:** Write feature-flag rollout and rollback plan for a new model deployment.

**How you know you're done:** Rollback playbook

#### Day 355: Human feedback and governance

**What it means:** Production quality requires feedback loops, documented limitations and audits.

**Your small practical task:** Design thumbs-up/down with optional comment and a triage queue.

**How you know you're done:** Feedback and governance plan

**Starter illustration:**

```csharp
double recallBefore = .91, recallAfter = .77;
if (recallAfter < recallBefore - .05)
    throw new InvalidOperationException("RAG regression: block release");
// Real CI gates combine security, quality, latency and cost thresholds.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/), [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview), [Microsoft Learn — Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview), [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)

---

### Module 72. Final capstone: Enterprise .NET AI Platform (Day 356–360)

**In simple words:** Prove the skills by integrating only the components you understand and testing them end to end.

**Think of it like .NET:** This is a full-stack product, not a giant prompt: each feature has its own secure service boundary.

**Example:** Ask company policy Q&A with citations, then open a case through an approved tool.

**Build:** Build the Enterprise .NET AI Platform

**Terms:** Capstone, Full-stack AI system, RAG + agents, Evaluation, Azure release

#### Day 356: Plan scope and application architecture

**What it means:** Decide which features are necessary and what can remain optional.

**Your small practical task:** Draw solution layers: Blazor, ASP.NET API, AI services, SQL/Search/Blob, tools, telemetry.

**How you know you're done:** Final architecture diagram

#### Day 357: Integrate knowledge assistant

**What it means:** Reuse secure ingestion, hybrid retrieval, citations and abstention.

**Your small practical task:** Connect file upload, indexing and RAG chat in one Blazor page.

**How you know you're done:** Working knowledge Q&A

#### Day 358: Integrate bounded agent + MCP

**What it means:** Connect read-only order tools, support case workflow and your MCP server.

**Your small practical task:** Add consent/approval for any write operation; log each tool step.

**How you know you're done:** Safe tool/agent workflow

#### Day 359: Run quality and security gate

**What it means:** Ship only when tests measure correctness, isolation, cost and performance.

**Your small practical task:** Run 50 retrieval/answer cases, 20 injection/tenant cases and inspect traces.

**How you know you're done:** Release checklist passed

#### Day 360: Publish and teach the result

**What it means:** A portfolio is stronger when others can reproduce and evaluate it.

**Your small practical task:** Create setup guide, architecture, screenshots, diagrams, risk register and short demo.

**How you know you're done:** Complete capstone repository

**Starter illustration:**

```csharp
public interface IEnterpriseKnowledgeAssistant
{
    Task<RagResponse> AnswerAsync(string question, CancellationToken ct);
}
// Blazor -> ASP.NET API -> app service -> search/model -> citations.
```

**Common mistake:** Trying to memorize terms instead of running a tiny .NET experiment.

**Official references:** [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp), [Microsoft Agent Framework for .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet), [Official MCP C# SDK](https://github.com/modelcontextprotocol/csharp-sdk), [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/)

---

## Portfolio projects — build in order

### Project 01. AI vs Rules Decision Notebook (after Module 01)

**Purpose:** Your first practical exercise: decide what should remain normal C# code.
**Stack:** C# console • Markdown
**Input:** 12 business feature requests
**Output:** Decision table with reasons

1. Create a console project and define 12 fake feature requests.
2. Tag each request Rules, Predictive ML, Generative AI or Search.
3. Write why some financial/security features must remain deterministic.
4. Explain decisions in README with a diagram.

**Definition of done:** You can justify every choice without buzzwords.

### Project 02. ML.NET Sentiment REST API (after Module 15)

**Purpose:** Train, evaluate, save and serve your first real C# machine-learning model.
**Stack:** C# • ML.NET • ASP.NET Core
**Input:** Customer review text
**Output:** Positive/Negative prediction + score

1. Prepare 60 fake labeled reviews; remove duplicates and hidden labels.
2. Train and evaluate a binary classifier from official ML.NET C# sample.
3. Store the model file and serve POST /api/sentiment.
4. Test empty input, surprising text, and confusion-matrix metrics.

**Definition of done:** Tests pass; model is trained offline, loaded for inference, and its limitations are documented.

### Project 03. Delivery ETA Predictor (after Module 16)

**Purpose:** Try regression so AI is not just chatbots and classification.
**Stack:** C# • ML.NET • Web API
**Input:** Distance, weight, order size
**Output:** Estimated delivery days

1. Create a small synthetic delivery dataset and numeric features.
2. Train simple regression and report MAE vs average baseline.
3. Add POST /api/estimate-delivery.
4. Document prediction uncertainty and validate strange inputs.

**Definition of done:** Working estimate endpoint with honest error table.

### Project 04. C# Console LLM Chat (after Module 26)

**Purpose:** One secure model API call becomes a streamed multi-turn conversation.
**Stack:** C# • official model .NET SDK
**Input:** A typed question
**Output:** Streamed model response

1. Store provider and deployment config outside source control.
2. Call a model once and print a response (stub first if no provider).
3. Append conversation history; use explicit message roles.
4. Add streaming, cancellation and basic token/time logging.

**Definition of done:** You can explain what was sent, returned, billed, and how you handle failures.

### Project 05. Blazor Chat UI (after Module 30)

**Purpose:** Turn your console example into a familiar ASP.NET Core + Blazor app.
**Stack:** Blazor • ASP.NET Core • DI
**Input:** Browser chat message
**Output:** Safe streamed conversation

1. Register a server-side IAssistantService and DTOs.
2. Implement protected chat endpoint and connect Blazor form.
3. Display streaming, loading, error and Cancel states.
4. Write tests for blank input and failed model calls.

**Definition of done:** No API keys in browser; errors and cancellations work.

### Project 06. Structured Text Intelligence Playground (after Module 34)

**Purpose:** Classify, summarize, translate and extract typed ticket details.
**Stack:** ASP.NET Core • Blazor • JSON Schema
**Input:** “Invoice INV-22 has failed”
**Output:** TicketInfo JSON + optional summary

1. Define typed records, nullable fields and allowed priority enum.
2. Implement schema-constrained extraction with separate C# validation.
3. Add Blazor tabs/actions for extract, summarize and classify.
4. Run 20 cases including missing fields and injection attempts.

**Definition of done:** Invalid JSON and missing data are handled without made-up values.

### Project 07. AI Order Tool Assistant (after Module 39)

**Purpose:** Teach an LLM to request safe .NET functions instead of guessing business data.
**Stack:** C# • SQLite • function calling
**Input:** “Has order 4521 shipped?”
**Output:** Verified order status

1. Seed 10 orders with customer ownership IDs.
2. Describe GetOrder and GetShipmentStatus tool schemas.
3. Validate ID and authorize the current user before service calls.
4. Add max steps, trace logs, no-side-effect policy and negative tests.

**Definition of done:** Another user’s order cannot be read; tool outputs reflect SQL truth.

### Project 08. Semantic Product Search (after Module 41)

**Purpose:** See meaning-based matching without needing any vector database.
**Stack:** C# • float[] • embeddings • LINQ
**Input:** “headset for work calls”
**Output:** Relevant top-5 products

1. Create 60 fake product descriptions.
2. Generate embeddings once and store them with model/version IDs.
3. Implement cosine similarity by hand and sort with LINQ.
4. Compare 10 semantic queries against keyword search.

**Definition of done:** Top-5 matches make sense and mismatched dimensions are rejected.

### Project 09. Vector Search API (after Module 42)

**Purpose:** Upgrade semantic search to PostgreSQL+pgvector or Qdrant.
**Stack:** ASP.NET Core • pgvector/Qdrant
**Input:** Search + TenantId + Category
**Output:** Top-k filtered results

1. Set up a local vector store and metadata schema.
2. Insert existing product vectors without re-embedding per request.
3. Query nearest neighbors and add indexes and filters.
4. Test tenant isolation, deletions and latency.

**Definition of done:** Search never returns outside its allowed tenant/category.

### Project 10. Basic Document RAG Assistant (after Module 48)

**Purpose:** Upload policies, find relevant passages and answer with real citations.
**Stack:** Blazor • ASP.NET Core • vectors • PDF
**Input:** “What is our refund period?”
**Output:** Answer + document/page provenance

1. Ingest 3 fake PDF/DOCX files with source and page metadata.
2. Chunk, embed and store document fragments.
3. Search allowed fragments and assemble evidence in a prompt.
4. Return answer or “not found” with clickable source preview.

**Definition of done:** 10 known questions cite real sources; unknown questions are not invented.

### Project 11. RAG Quality Test Harness (after Module 49)

**Purpose:** Build reusable quality measurement for retrieval and grounded answers.
**Stack:** xUnit • C# • CSV/JSON fixtures
**Input:** Golden dataset + RAG results
**Output:** Recall@k + answer quality report

1. Label 50 questions with allowed sources and expected answer facts.
2. Implement Recall@k/Precision@k and error reports in C#.
3. Score groundedness on 10 manually audited cases.
4. Make one regression gate fail for intentionally bad retrieval.

**Definition of done:** RAG changes have visible measurable pass/fail criteria.

### Project 12. Advanced Enterprise RAG (after Module 53)

**Purpose:** Improve recall, freshness, hybrid search, authorization and tests.
**Stack:** Azure AI Search • C# • Blazor
**Input:** Multi-document employee question
**Output:** Access-safe evidence-backed reply

1. Create 30–50 labelled retrieval cases.
2. Add keyword+vector hybrid, reranking and query rewriting.
3. Filter authorized TenantId before retrieval; test cross-tenant attacks.
4. Implement document update/delete/reindex and measure quality/cost.

**Definition of done:** A test report proves both retrieval improvement and tenant isolation.

### Project 13. Customer Support Agent (after Module 57)

**Purpose:** Use Agent Framework to combine lookup, RAG and approval safely.
**Stack:** Microsoft Agent Framework • SQL • RAG
**Input:** “My delivery arrived damaged”
**Output:** Pending case / approved operation

1. Run numbered C# Agent Framework get-started samples.
2. Reuse GetOrderStatus and SearchKnowledgeBase as tools.
3. Add session state, step limit and human approval for write tools.
4. Verify unknown order, cross-tenant and timeout paths.

**Definition of done:** Agent stops predictably and cannot bypass backend authorization.

### Project 14. Researcher + Reviewer Workflow (after Module 59)

**Purpose:** Compare a two-agent review process with a simpler one-agent baseline.
**Stack:** Microsoft Agent Framework • ASP.NET Core
**Input:** “Compare two Azure hosting options”
**Output:** Reviewed answer with evidence

1. Make a researcher agent gather evidence and a reviewer score it.
2. Add a parallel information-collection stage.
3. Limit revision loops to two rounds and record results.
4. Compare quality, latency, token usage and source correctness to single agent.

**Definition of done:** All stage transitions are explicit and auditable.

### Project 15. C# MCP Server and Client (after Module 60)

**Purpose:** Expose selected C# business tools over a common protocol.
**Stack:** .NET • MCP C# SDK • auth
**Input:** get_order_status tool call
**Output:** Structured JSON order response

1. Build MCP server exposing safe get_order_status and search_policy.
2. Expose one resource/prompt and document tool schemas.
3. Connect a C# MCP client over supported transport.
4. Enforce caller permissions; test unknown tool and invalid ID.

**Definition of done:** MCP discovery works and unauthorized calls do not.

### Project 16. Invoice + Voice Mini Assistant (after Module 62)

**Purpose:** Work with OCR, typed invoice extraction and a small speech workflow.
**Stack:** Blazor • Document Intelligence • Speech SDK
**Input:** Invoice image / voice note
**Output:** Typed invoice / transcript

1. Extract key invoice fields and keep field provenance.
2. Validate totals and missing values with deterministic C#.
3. Add voice-note transcription and optional spoken confirmation.
4. Show human-review state on low-confidence fields.

**Definition of done:** Users can correct extracted fields; data is not treated as infallible.

### Project 17. Local Model Comparison Lab (after Module 64)

**Purpose:** Run a local supported model if feasible and compare against a cloud model.
**Stack:** C# • Ollama • IChatClient
**Input:** 10 test prompts
**Output:** Quality/latency comparison

1. Identify local hardware constraints and optional Ollama install.
2. Call local endpoint from C# with config-only switching.
3. Run 10 same cases against available models.
4. Document performance, memory, safety and privacy tradeoffs.

**Definition of done:** Evidence-based model choice; fully documented fallback if hardware cannot run it.

### Project 18. Enterprise .NET AI Platform (after Module 72)

**Purpose:** Final integration: secure RAG, tool assistant, agent approval, evaluations and Azure operations.
**Stack:** Blazor • ASP.NET Core • Microsoft Foundry • Azure AI Search
**Input:** Policies + customer/order support task
**Output:** Verified responses, sources, tools and telemetry

1. Create layered Blazor/ASP.NET architecture and safe config.
2. Integrate document ingestion, hybrid RAG and citations.
3. Connect authorized tools, bounded agent, MCP and approval step.
4. Run RAG evaluation, security/tenant tests and OpenTelemetry traces.
5. Deploy to staging with azd/Bicep, budgets and CI/CD rollback.
6. Publish README, architecture, tests, demo and residual risks.

**Definition of done:** A stranger can reproduce the system, evaluate quality and see safe operation from logs.

## Official references — websites and GitHub

### Foundations

- [ML.NET official sample repository](https://github.com/dotnet/machinelearning-samples) — C# repo
- [ML.NET sentiment classifier (C#)](https://github.com/dotnet/machinelearning-samples/tree/main/samples/csharp/getting-started/BinaryClassification_SentimentAnalysis) — C# sample
- [Microsoft Learn — ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/) — Official tutorial
- [Microsoft Learn — ML.NET classification](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/sentiment-analysis) — Official tutorial
- [Microsoft ML for Beginners — conceptual](https://github.com/microsoft/ML-For-Beginners) — Concepts / Python
- [Microsoft AI for Beginners — conceptual](https://github.com/microsoft/AI-For-Beginners) — Concepts / Python

### Core .NET AI

- [Microsoft Learn — AI for .NET](https://learn.microsoft.com/en-us/dotnet/ai/) — Official .NET guide
- [Generative AI for Beginners — .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet) — C# course
- [.NET AI samples](https://github.com/dotnet/ai-samples) — C# repo
- [OpenAI official .NET SDK](https://github.com/openai/openai-dotnet) — C# SDK
- [Microsoft.Extensions.AI — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai) — Official .NET guide
- [Microsoft.Extensions.AI — source](https://github.com/dotnet/extensions/tree/main/src/Libraries/Microsoft.Extensions.AI.Abstractions) — C# source
- [Microsoft Learn — ASP.NET Core Blazor](https://learn.microsoft.com/en-us/aspnet/core/blazor/) — Official .NET guide
- [Microsoft Learn — Minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis) — Official .NET guide
- [Microsoft Learn — .NET User Secrets](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets) — Official .NET guide

### Search & RAG

- [pgvector-dotnet](https://github.com/pgvector/pgvector-dotnet) — C# repository
- [Qdrant .NET client](https://github.com/qdrant/qdrant-dotnet) — C# repository
- [Microsoft Learn — Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search) — Official Azure guide
- [Microsoft Learn — Hybrid search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview) — Official Azure guide
- [Microsoft Learn — Retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview) — Official Azure guide
- [Azure RAG demo — ASP.NET + Blazor (C#)](https://github.com/Azure-Samples/azure-search-openai-demo-csharp) — C# complete app
- [Microsoft Learn — Azure Blob Storage for .NET](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-dotnet) — Official C# guide

### Agents & MCP

- [Microsoft Agent Framework for .NET](https://github.com/microsoft/agent-framework/tree/main/dotnet) — C# framework
- [Microsoft Learn — Agent Framework course](https://learn.microsoft.com/en-us/agent-framework/get-started/) — Official C# guide
- [Agent Framework — numbered .NET samples](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/01-get-started) — C# samples
- [Agent Framework — .NET workflows](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples/03-workflows) — C# samples
- [Official MCP C# SDK](https://github.com/modelcontextprotocol/csharp-sdk) — C# SDK
- [Microsoft Learn — Get started with .NET MCP](https://learn.microsoft.com/en-us/dotnet/ai/get-started-mcp) — Official C# guide
- [MCP specification and concepts](https://modelcontextprotocol.io/docs/getting-started/intro) — Protocol docs
- [A2A protocol documentation](https://a2a-protocol.org/latest/) — Protocol docs

### Azure & production

- [Microsoft Foundry documentation](https://learn.microsoft.com/en-us/azure/foundry/) — Official Azure guide
- [Microsoft Entra identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/) — Official Azure guide
- [Microsoft Learn — Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview) — Official Azure guide
- [Microsoft Learn — Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) — Official Azure guide
- [OpenTelemetry .NET](https://github.com/open-telemetry/opentelemetry-dotnet) — C# project
- [.NET Aspire](https://github.com/dotnet/aspire) — C# tooling
- [Azure Developer CLI](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/overview) — Official Azure guide
- [Microsoft Learn — Deploy ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/) — Official .NET guide
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) — Security checklist
- [Microsoft Responsible AI resources](https://www.microsoft.com/en-us/ai/responsible-ai) — Policy & guidance
- [Azure DevOps documentation](https://learn.microsoft.com/en-us/azure/devops/) — Official Azure guide

### Multimodal & advanced

- [Azure AI Document Intelligence](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/) — Official Azure guide
- [Azure Speech service](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/) — Official Azure guide
- [Azure AI Vision](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/) — Official Azure guide
- [Ollama local-model runner](https://github.com/ollama/ollama) — Local model tool
- [ONNX Runtime .NET](https://onnxruntime.ai/docs/get-started/with-csharp.html) — C# guide
- [ONNX Runtime repository](https://github.com/microsoft/onnxruntime) — C# / native
- [Azure Machine Learning documentation](https://learn.microsoft.com/en-us/azure/machine-learning/) — Official Azure guide
- [Semantic Kernel legacy/reference](https://github.com/microsoft/semantic-kernel) — Older C# framework
- [Microsoft GraphRAG — advanced elective](https://github.com/microsoft/graphrag) — Architecture (Python)
- [PyTorch — optional deep learning](https://pytorch.org/tutorials/) — Optional Python

## Optional advanced specializations

These expand your skills after the practical course. They are **not required** to start or complete the C# path.

### Deeper classical ML with ML.NET
Train and evaluate tabular classification, regression, anomaly and recommendation models in C#, including feature pipelines.
- Challenge: Implement 2 baseline ML.NET models and compare leakage, precision/recall and MAE.

### Advanced search & GraphRAG
Explore hierarchical documents, entity relationships, graph traversal and complex multi-hop questions.
- Challenge: Model Customer → Order → Product → Warranty and compare it with vector-only lookup.

### MLOps with Azure Machine Learning
Learn model registry, feature/data lineage, model validation, drift checks, re-training and deployment rollout.
- Challenge: Register and version one trained ML.NET or compatible ONNX artifact and prepare an update plan.

### Deep learning mathematics
Expand from weighted sums into matrix multiplication, derivatives, gradients, Adam and attention equations.
- Challenge: Calculate one tiny gradient update by hand; verify using a small C# console script.

### Transformer training and tokenizers
Explore pretraining corpora, tokenization algorithms, sequence modeling, SFT, preference optimization and alignment.
- Challenge: Diagram a transformer forward pass and prepare an honest inference-vs-training comparison.

### Quantization and inference performance
Understand FP32/FP16/INT8, KV caching, batching, distillation, CPU/GPU tradeoffs and ONNX optimization.
- Challenge: Measure latency and memory while scoring a small ONNX model using C#.

### Advanced agent architecture
Explore middleware, checkpointing, workflows, distributed execution, protocols, bounded autonomy and permissions.
- Challenge: Create a durable support workflow and compare safety and token cost with one model call.

### Recommenders and ranking
Study collaborative filtering, cold start, learning-to-rank, offline ranking metrics and click feedback loops.
- Challenge: Recommend similar products with ML.NET and measure precision@K against popularity baseline.

### Multimodal and image generation
Explore multimodal embeddings, image generation, object detection, segmentation and vision safety.
- Challenge: Build a C# API processing a product image plus text, with deterministic metadata validation.

### Real-time voice and streaming
Go deeper into streaming speech APIs, turn detection, interruptions, diarization and response latency.
- Challenge: Measure voice turn latency and implement an explicit cancel/interrupt state in ASP.NET.

### Experiment design and A/B testing
Study statistical uncertainty, confidence intervals, counterfactual thinking, online experiments and user feedback.
- Challenge: Design an A/B trial comparing two RAG retrievers with success/safety guardrails.

### AI governance and secure enterprise platform
Explore compliance, auditability, data retention, tenant isolation, model inventory, safety review and incident response.
- Challenge: Write a model/service inventory, retention policy, threat model and rollback runbook.

## Glossary: easy definitions

- **A2A** (Agents): Agent-to-agent communication approach/protocol family; useful for cross-agent interoperability.
- **A2A protocol** (Agents): Agent-to-agent communication protocol, distinct from MCP tool access.
- **Access control list (ACL)** (Security): Document or resource permissions specifying who may access it.
- **Activation** (Deep Learning): Function that allows a neural network layer to model nonlinear behavior.
- **Agent** (Agents): Application-controlled process that uses a model, tools and state to pursue a goal.
- **Agent harness** (Agents): Runtime that coordinates tools, state, instructions, planning and safety.
- **Agent session** (Agents): Logical conversation/task context maintained for an agent.
- **AI** (Foundations): Umbrella term for systems performing tasks associated with intelligent behavior.
- **ANN / HNSW** (Search & RAG): Approximate nearest-neighbor search and a common graph-based index technique.
- **Anomaly detection** (Machine Learning): Finding observations that differ unusually from expected patterns.
- **Approval gate** (Agents): Rule requiring an authorized person to approve a sensitive operation.
- **Attention** (LLMs): Mechanism for weighting relationships among input positions.
- **Azure AI Search** (Azure): Azure service for vector, keyword, hybrid and semantic search.
- **Azure Application Insights** (Azure): Azure telemetry service for app metrics, logs, traces and availability.
- **Azure Developer CLI (azd)** (Azure): CLI for provisioning, deploying and removing app infrastructure.
- **Azure Document Intelligence** (Azure): Azure service for extracting text/layout/fields from documents.
- **Azure Key Vault** (Azure): Azure service managing secrets, keys and certificates.
- **BackgroundService** (.NET Engineering): .NET abstraction for running long-running hosted background work.
- **Backpropagation** (Deep Learning): Computing how each trainable weight contributed to the model error.
- **Baseline** (Machine Learning): Simple comparison solution used to prove whether more complexity helps.
- **Batch** (Deep Learning): Smaller group of training examples processed together.
- **Bias-variance tradeoff** (Machine Learning): The tension between overly simple models and models too sensitive to training data.
- **Bicep** (Azure): Declarative language for defining Azure infrastructure resources.
- **BM25** (Search & RAG): Keyword-based document ranking method.
- **Calibration** (Machine Learning): Whether a prediction score like 0.8 corresponds to roughly 80% event frequency.
- **Canary release** (Production): Limited rollout to detect problems before broad deployment.
- **CancellationToken** (.NET Engineering): .NET mechanism for cooperatively cancelling async work.
- **Chunk overlap** (Search & RAG): Repeating boundary content between neighboring chunks to preserve context.
- **Chunking** (Search & RAG): Splitting documents into searchable pieces.
- **Circuit breaker** (Production): Pattern for failing fast when a dependency is repeatedly unavailable.
- **Citation** (Search & RAG): Reference allowing a reader to verify a claim against a source.
- **Class imbalance** (Machine Learning): Some labels occur far more often than others.
- **Classification** (Foundations): Predicting a category such as spam/not spam.
- **Clustering** (Foundations): Grouping similar data without predefined labels.
- **Cold start** (Machine Learning): Recommender challenge when a new user/item has little interaction data.
- **Concept drift** (Machine Learning): Relationship between inputs and correct outputs changes over time.
- **Confidence calibration** (Evaluation): Checking whether prediction confidence aligns with observed accuracy.
- **Confusion matrix** (Machine Learning): Table counting true/false positives and true/false negatives.
- **Context engineering** (LLMs): Selecting relevant instructions, state, tools and evidence for a model request.
- **Context window** (LLMs): Maximum tokens that a model can consider in a request.
- **Cosine similarity** (Search & RAG): Measure of how closely two vectors point in the same direction.
- **Data drift** (Machine Learning): Input patterns change compared with what a model saw previously.
- **Data leakage** (Foundations): Accidentally giving a model future/private/test information during training or retrieval.
- **Dataset** (Foundations): A collection of examples used to train, validate or test a model.
- **Deep learning** (Foundations): ML methods using multi-layer neural networks.
- **Dependency Injection** (.NET Engineering): Supplying service dependencies via constructors or .NET service container.
- **Deterministic** (Foundations): Same valid inputs and state produce the same result every time.
- **Discriminative model** (Foundations): A model primarily predicting labels, scores or boundaries rather than creating new content.
- **Distribution** (Math made easy): How values or probabilities are spread over possible outcomes.
- **Dot product** (Math made easy): Multiply corresponding vector elements and add the products.
- **DTO** (.NET Engineering): Data Transfer Object, e.g. a C# record for request or response data.
- **Embedding** (Search & RAG): Numerical representation of data designed to capture useful relationships.
- **Embedding model** (Search & RAG): Model turning text or other data into embedding vectors.
- **Episodic memory** (Agents): Saved summaries of previous interactions/events for later retrieval.
- **Epoch** (Deep Learning): One pass over the full training dataset.
- **Euclidean distance** (Math made easy): Straight-line distance between points/vectors in a numeric space.
- **F1 score** (Machine Learning): Harmonic mean balancing precision and recall.
- **False negative** (Machine Learning): Model misses a condition that is actually present.
- **False positive** (Machine Learning): Model predicts a condition present when it is actually absent.
- **Feature** (Foundations): Input variable that helps a model make a prediction.
- **Feature engineering** (Machine Learning): Converting raw inputs into useful numeric or categorical model features.
- **Feature flag** (Production): Switch enabling/disabling a change for selected users.
- **Few-shot** (LLMs): Providing examples alongside an instruction to show desired behavior.
- **Fine-tuning** (LLMs): Additional training to adapt a pretrained model.
- **Fine-tuning with LoRA** (Advanced): Low-rank adaptation that trains relatively few additional parameters.
- **Generalization** (Machine Learning): How well a model handles examples beyond the training set.
- **Generative AI** (Foundations): Models creating new text, images, audio, code or other content.
- **Generative model** (Foundations): A model that creates text, audio, images, code or similar content.
- **Golden dataset** (Evaluation): Curated test examples with expected behavior/evidence.
- **Gradient** (Deep Learning): Direction and rate of loss change for a model parameter.
- **Gradient descent** (Foundations): Optimization process that repeatedly adjusts weights to reduce loss.
- **GraphRAG** (Advanced): Combining graph-like relationships with retrieval and generation.
- **Ground-truth label** (Evaluation): Known expected answer for an evaluation example.
- **Groundedness evaluation** (Evaluation): Checking whether generated claims are supported by given context.
- **Grounding** (Search & RAG): Basing an answer on specific trusted/retrieved evidence.
- **Hallucination** (LLMs): Model output that sounds plausible but is unsupported or false.
- **Human-in-the-loop** (Agents): Human approval/review required before certain actions or decisions.
- **Hybrid search** (Search & RAG): Combines lexical matching with vector similarity search.
- **IAsyncEnumerable** (.NET Engineering): .NET abstraction for asynchronously streaming a sequence of values.
- **IChatClient** (.NET Engineering): Microsoft.Extensions.AI interface for a chat-model client.
- **IDataView** (.NET Engineering): ML.NET tabular data abstraction for loading and transforming rows.
- **Idempotency** (Agents): Repeating an operation has no extra side effect.
- **IEmbeddingGenerator** (.NET Engineering): Microsoft.Extensions.AI interface family for embedding generation.
- **Index freshness** (Search & RAG): Whether indexed documents still match current source data.
- **Indirect prompt injection** (Security): Malicious instructions embedded in retrieved documents/tool results/web pages.
- **Inference** (Foundations): Using a trained model to make a prediction or generate output.
- **Infrastructure as code** (Production): Version-controlled description of cloud resources and configuration.
- **JSON Schema** (.NET Engineering): Document defining the fields, types and constraints of JSON content.
- **K-means** (Machine Learning): Clustering algorithm that groups data around learned centers.
- **KV cache** (Advanced): Inference technique reusing attention key/value computation across generated tokens.
- **Label** (Foundations): Target answer associated with training examples.
- **Learning rate** (Deep Learning): Size of each parameter update while training.
- **Least privilege** (Security): Granting only the permissions required for a task.
- **LLM** (LLMs): Large language model trained to predict/generate language tokens.
- **LLM-as-judge** (Evaluation): Using a model to score model output; useful but can be inconsistent/biased.
- **Local inference** (Production): Running a model on hardware you operate rather than an external API.
- **Logits** (LLMs): Raw numerical scores for possible outputs before probabilities are computed.
- **Long-term preference** (Agents): Persistent user setting stored with explicit retention/control.
- **LoRA** (Advanced): Training method that updates small low-rank adapters rather than all base weights.
- **Loss** (Deep Learning): Number representing how wrong a model prediction is during training.
- **Loss function** (Foundations): Number indicating how wrong a model’s prediction is during training.
- **Machine learning (ML)** (Foundations): Models learn statistical patterns from data instead of following only hand-written rules.
- **MAE** (Machine Learning): Mean absolute error; average absolute amount a numeric prediction misses by.
- **Managed identity** (Production): Azure identity for services that avoids application-managed long-lived secrets.
- **Max-steps budget** (Agents): Hard cap on number of agent turns/tool executions.
- **MCP** (Agents): Model Context Protocol, for exposing tools and context to compatible AI clients.
- **MCP host** (Agents): Application running an MCP client connection on behalf of a user/agent.
- **MCP prompt** (Agents): Reusable prompt template exposed by an MCP server.
- **MCP resource** (Agents): Readable context data exposed by an MCP server.
- **MCP transport** (Agents): Communication method for MCP, e.g. standard I/O or HTTP.
- **Mean** (Math made easy): Arithmetic average of a set of values.
- **Median** (Math made easy): Middle value after sorting numbers.
- **Metadata filtering** (Search & RAG): Restricting search to allowed categories, documents or tenants.
- **Microsoft Entra ID** (Azure): Identity platform for users, service principals and access control.
- **Microsoft Foundry** (Azure): Azure platform for building, deploying, evaluating and governing AI solutions.
- **Middleware** (.NET Engineering): Processing layer around a request or operation, often adding logs or policies.
- **MLContext** (.NET Engineering): Entry point for ML.NET training and evaluation operations.
- **Model card** (Security): Short record of model purpose, metrics, data limits and risks.
- **Model deployment** (LLMs): Named model endpoint/configuration used by the application.
- **Model distillation** (Advanced): Training a smaller model to mimic useful behavior of a larger model.
- **Model gateway** (Production): Service choosing model/provider and applying common policy/telemetry.
- **Model routing** (Production): Choosing among models based on task requirements and constraints.
- **MRR** (Evaluation): Mean Reciprocal Rank; rewards placing the first relevant result high.
- **Multi-hop retrieval** (Search & RAG): Combining information across multiple facts/sources to answer one question.
- **nDCG** (Evaluation): Metric that considers relevance grades and result ranking positions.
- **Neural network** (Foundations): Layers of numerical transformations whose parameters can be trained.
- **Neuron** (Deep Learning): Small mathematical unit that combines weighted inputs then applies a function.
- **Normalization** (Math made easy): Adjusting numerical representations onto a comparable scale.
- **Nucleus sampling** (LLMs): Top-p sampling: selecting from tokens within a cumulative probability pool.
- **Observability** (Production): Logs, traces and metrics showing what the system did and why.
- **OCR** (Multimodal): Optical character recognition; reading text from scanned images.
- **ONNX** (Advanced): Interchange format/ecosystem for representing and serving machine learning models.
- **OpenTelemetry** (Production): Open standard and SDK ecosystem for traces, metrics and logs.
- **Optimizer** (Deep Learning): Algorithm used to adjust model parameters based on gradients.
- **Orchestrator** (Agents): Code coordinating agent or workflow steps and state transitions.
- **Overfitting** (Foundations): Memorizing training patterns and failing to generalize to new inputs.
- **P95 latency** (Production): Time below which 95% of measured requests complete.
- **Parameters / weights** (LLMs): Learned numerical values inside a model.
- **Parent-child retrieval** (Search & RAG): Finding a small chunk then retrieving its larger parent section for context.
- **PII** (Security): Personally identifiable information requiring appropriate privacy protections.
- **PII redaction** (Security): Removing or masking sensitive personal information in logs/data.
- **Planning / search** (Foundations): Choosing sequences of actions or paths under goals and constraints.
- **Positional encoding** (Deep Learning): Information that helps transformer know token order.
- **Precision@k** (Evaluation): Fraction of retrieved top-k items that are relevant.
- **Pretraining** (LLMs): Large-scale initial training that teaches general representations/patterns.
- **Probabilistic** (Foundations): Output involves uncertainty; a model can be wrong even when fluent.
- **Prompt** (LLMs): Inputs and instructions sent to a generative model.
- **Prompt hierarchy** (LLMs): Different message roles carry different instruction authority.
- **Prompt injection** (Security): Attempt to manipulate model behavior using untrusted instructions.
- **Provenance** (Search & RAG): Source identity and traceability of evidence in a generated answer.
- **QLoRA** (Advanced): Low-rank tuning combined with quantized model weights.
- **Quantization** (Production): Using reduced numerical precision to lower model memory/compute requirements.
- **Quantization precision** (Advanced): Numeric bit-width used for model weights and calculations.
- **Query decomposition** (Search & RAG): Splitting a complex question into smaller answerable questions.
- **Query rewriting** (Search & RAG): Reformulating a user's query to improve retrieval precision.
- **RAG** (Search & RAG): Retrieval-Augmented Generation: retrieve relevant evidence and provide it to a model.
- **Rate limit** (Production): Restriction on requests or tokens per unit time.
- **Rate-limit response (429)** (LLMs): API response indicating too many requests in a time window.
- **Recall@k** (Evaluation): Fraction of expected relevant items found among the top k results.
- **Recommendation** (Foundations): Ranking or suggesting items a person may like.
- **Regression** (Foundations): Predicting a numeric value such as next month’s revenue.
- **Regression gate** (Evaluation): Automated check that blocks changes making quality/security worse.
- **Reinforcement learning** (Foundations): Learning policies through rewards for actions in an environment.
- **ReLU** (Deep Learning): Simple activation returning max(0,x).
- **Reranker** (Search & RAG): Second-stage model that reorders retrieved candidates for a specific query.
- **Risk register** (Security): List of identified system risks, mitigations and remaining exposure.
- **RMSE** (Machine Learning): Root mean squared error; penalizes larger numeric mistakes more strongly.
- **ROC-AUC** (Machine Learning): Metric measuring class-ranking quality over different classification thresholds.
- **Rollback** (Production): Returning to an earlier known-good configuration or release.
- **RRF** (Search & RAG): Reciprocal Rank Fusion; merging ranked result lists by their ranks.
- **Sample size** (Math made easy): Number of observations used in an experiment or estimate.
- **Scalar** (Math made easy): A single number such as 2.5.
- **Schema constrained output** (LLMs): Model output guided/limited to satisfy a specified data shape.
- **Self-attention** (Deep Learning): Mechanism where positions in one sequence use information from other positions.
- **Semantic chunking** (Search & RAG): Splitting text based on topic or meaning boundaries.
- **Softmax** (LLMs): Function turning scores into a probability-like distribution.
- **Speech-to-text** (Multimodal): Converting spoken audio into text.
- **SSE** (.NET Engineering): Server-Sent Events; one-way HTTP stream used for incremental updates.
- **State compaction** (Agents): Compressing context or old steps to fit limited model context.
- **Structured output** (LLMs): Response constrained to an expected schema, usually JSON.
- **Supervised learning** (Machine Learning): Learn from examples that include the correct target label.
- **System message** (LLMs): Higher-priority application instruction sent to a chat model.
- **Temperature** (LLMs): Sampling control that usually changes response randomness.
- **Tenant isolation** (Security): Ensuring one tenant cannot access another tenant’s data or state.
- **Tensor** (Foundations): Multi-dimensional collection of numerical values used by neural networks.
- **Test set** (Foundations): Held-out data used for final unbiased performance estimates.
- **Text-to-speech** (Multimodal): Generating spoken audio from text.
- **Time-series forecast** (Machine Learning): Predicting future values based on an ordered history.
- **Token** (LLMs): Model input/output unit; not necessarily a word or character.
- **Token budget** (Production): Limit for prompt+output tokens to control cost and context use.
- **Tokenizer** (LLMs): System for mapping text into token IDs and back.
- **Tool / function calling** (Agents): Model requests an application-defined operation; application validates and executes it.
- **Tool schema** (Agents): Definition of tool name, description and allowed arguments.
- **Top-k** (Search & RAG): Number of highest-ranked results returned by a retrieval system.
- **Top-p** (LLMs): Sampling mechanism that restricts choices by cumulative probability.
- **Train-test split** (Machine Learning): Dividing examples into learning and unseen evaluation portions.
- **Training** (Foundations): Updating model parameters using data and an objective.
- **Transformer** (LLMs): Neural architecture built around attention mechanisms.
- **Unsupervised learning** (Machine Learning): Look for patterns or groups without predefined labels.
- **User secrets** (.NET Engineering): Development-time way to keep secrets outside committed configuration files.
- **Validation set** (Foundations): Held-out data used to tune model decisions.
- **Validation split** (Machine Learning): Dataset portion used for comparing models or tuning decisions before final test.
- **Vector database** (Search & RAG): Database supporting storage and similarity search over vectors.
- **Vector dimension** (Math made easy): Number of elements in a vector, e.g., 3 for [1,2,3].
- **Vector norm** (Math made easy): A measure of vector size or length.
- **Voice activity detection** (Multimodal): Detecting when speech starts/stops in audio input.
- **Workflow checkpoint** (Agents): Persisted state allowing an operation to resume after interruptions.
- **Working memory** (Agents): Temporary facts/state used within a current task or workflow.

## Safe defaults

- All business authorization happens server-side, **before** access or tool execution.
- Never include real credentials, customer data or private corporate documents in practice datasets.
- Cloud/model calls can incur charges. Set budgets and destroy unused resources.
- Passing 360 sessions does **not** mean mastering all AI research; the core goal is shipping credible, secure, measured AI applications with C#/.NET/Azure.

