# AI for .NET developers — foundations

The six foundation lessons. Continue into the available ML.NET unit in LEARNING_GUIDE.md or the website.

## 1. What makes a feature an AI feature?

Objective: Tell the difference between code that follows a rule and a model that learns patterns.

Prerequisite: No AI knowledge required.

Imagine you are building SupportDesk, an ASP.NET Core application where customers ask for help. A message arrives: “I paid twice. Can you return one payment?” Your first feature is to send that message to the right team.

You could write a C# rule: if the message contains “refund”, send it to Billing. You chose the word and wrote the decision yourself. That is ordinary application logic.

Another approach uses a model: a reusable component that has learned patterns from examples. It could suggest Billing even when the customer never writes “refund”. This is where machine learning, a common approach to AI, can help.

Your .NET application still receives the request, validates it, checks permissions, and saves the result. The model supplies one suggested answer inside that application. It does not replace the application.

**AI:** Software that uses models to recognize patterns or generate an output. In this course, we focus on models learned from examples.

### Worked example

One message. Two ways to route it.

> I paid twice. Can you return one payment?

- A rule you wrote: Contains “refund”? No. Result: General queue.
- A learned model: Recognizes a payment problem. Result: Billing suggestion.

The rule checks an exact condition. A model may recognize a similar meaning. Its answer can still be wrong, so a staff member can correct it. The model result shown here is an authored teaching example.

### Try it

Choose which implementation uses a learned model. Notice that the technology behind the decision matters more than the appearance of the screen. Open the interactive lesson to try the exercise.

### Check understanding

Which feature uses a learned model?

1. An API rejects a request with an empty email address.
2. A service suggests a support category using patterns learned from past messages.
3. A Blazor page displays a chat bubble.

Answer: 2. Exactly. The decision uses patterns learned from examples, rather than only conditions you wrote.

### .NET connection

Think of the model as a dependency of your application service. The API handles HTTP; a service requests a suggestion; your code decides what happens next.

Application flow · conceptual example

```text
Customer message
    ↓
ASP.NET Core endpoint → Validate request
    ↓
Application service → Ask model for a suggestion
    ↓
Blazor inbox → Staff member reviews the category
```

Contribution: You can identify where a model might help the SupportDesk inbox.

Next: Decide which responsibilities should stay ordinary C#.

Reference: [Microsoft Learn: AI in .NET](https://learn.microsoft.com/en-us/dotnet/ai/overview)

### Find this concept in the project

File: labs/supportdesk-rules/Program.cs

Method or type: Route

Scope: Illustrative pattern backed by lab

Task: Inspect Route and classify its decision as an authored condition or a learned pattern. Explain whether adding a chat bubble would change that classification.

Expected result: Route checks whitespace and a refund substring. There is no fitted model or training data; changing the presentation would not make this rule AI.

From the extracted project folder:

```powershell
Get-Content Program.cs
```

### Place the names before choosing a library

AI is the broad field. Machine learning is an approach within it that learns from examples. Deep learning uses neural networks with multiple layers; many modern language models use this approach. These are related ideas, not four interchangeable products. This course starts with observable inputs and outputs before the internal mathematics.

### Follow the example step by step

Follow one routing decision

1. **Receive a message:** SupportDesk receives “Please return my payment.” The application checks that text is present. This first check is ordinary C#.

2. **Choose the decision maker:** A refund-keyword rule returns General because its keyword is absent. A learned classifier could propose Billing from patterns learned earlier. The Billing answer here is illustrative, not a model run.

3. **Handle the suggestion:** The application displays the proposed category. It has not returned money or verified a transaction; those are different jobs.

The key question is who supplied the routing behavior: your explicit condition or a training process? Neither path replaces the surrounding application.

### Practise with a little help

A Blazor catalog highlights products using “price &lt; 20”. Rewrite its feature description so it does not imply learned recommendations.

Hint: Identify where the selection rule came from. A useful feature does not have to be machine learning.

Expected approach: Describe it as products filtered by a price rule. If a future recommender learns from approved examples, describe that separate dependency and evaluate it.

Expected result: The price filter remains ordinary C#, even if the screen looks like a recommendation carousel.

### Apply it to another .NET feature

An invoice page uses a trained model to propose a document type, then C# rejects missing invoice numbers. Which part learned from examples?

Compare your reasoning: The document-type model. Required-field validation is an explicit application rule. Keep the two descriptions separate.

### Explain it again tomorrow

Tomorrow, explain why a chat-shaped screen does not tell you how its response was produced.

Compare your explanation: The same screen could show a fixed sample, a human reply or generated text. Inspect the implementation boundary, not the shape of the UI.

Optional practice does not change saved understanding checks or certify project work.

### A neural network without the mystery

A neural network combines numbers using learned parameters arranged in connected layers. During training, an algorithm adjusts parameters against an objective. Calling an existing model uses those learned values; it does not require your application to retrain the network.

Try to explain: You download a pretrained network and call it from C#. Did you train it by loading its file?

Compare your explanation: No. Loading and running are inference preparation and inference. Training is the separate process that changes learned parameters.

## 2. When ordinary C# rules are enough

Objective: Choose an explicit C# rule when the requirement has an exact, testable answer.

Prerequisite: What makes a feature an AI feature?

SupportDesk must reject an empty message. You know precisely what “empty” means: null, no characters, or only spaces. You do not need examples of past messages to decide this.

Write that requirement as ordinary C#. The result should be predictable and easy to test. Checking permissions, calculating totals, and enforcing a refund policy also belong in code with explicit rules.

A keyword rule can be a useful first version of message routing. It is cheap and easy to explain. But “refund” and “return my payment” have different characters even though they may express the same request.

Do not add AI because a rule has a limitation. First ask whether the limitation matters. A few categories with stable wording might need only a maintained rule. Many variations of natural language may justify a model.

**Deterministic:** Given the same input and relevant state, the code follows the same steps and produces the same result.

### Worked example

An empty message has an exact answer.

> Message: three spaces

- Your requirement: A message must contain visible text. Result: Reject the request.
- Your C# implementation: string.IsNullOrWhiteSpace(message) Result: true.

There is nothing to predict. A unit test can prove this condition for empty strings, spaces, and real messages. A model would add uncertainty to an exact requirement.

### Try it

Change a message and the keyword. Watch which queue an exact rule chooses. Try “Please return my payment” with the keyword “refund”. Open the interactive lesson to try the exercise.

### Check understanding

Which responsibility should stay an explicit rule?

1. Guessing the subject of an unfamiliar customer message.
2. Writing a shorter version of a long conversation.
3. Checking that the signed-in user is allowed to issue a refund.

Answer: 3. Correct. Authorization is an enforceable application rule. A model suggestion must never bypass it.

### .NET connection

A baseline is the simplest working approach you will compare a later model against. Our first desktop lab builds this routing rule as a console app. No AI account is needed.

C# · extract from the runnable lab

```text
static string Route(string message)
{
    if (string.IsNullOrWhiteSpace(message))
        return "Rejected";

    return message.Contains("refund",
        StringComparison.OrdinalIgnoreCase)
        ? "Billing"
        : "General";
}
```

Contribution: You establish input validation and a predictable routing baseline.

Next: Learn what goes inside the model component.

Reference: [Microsoft Learn: Create a .NET console app](https://learn.microsoft.com/en-us/dotnet/core/tutorials/with-visual-studio-code)

### Find this concept in the project

File: labs/supportdesk-rules/Program.cs

Method or type: Route

Scope: Runnable C# rule

Task: Predict Route for "REFUND PLEASE", "Please return my payment", and three spaces before running the checks. Explain why related meanings do not guarantee the same route.

Expected result: The results are Billing, General, and Rejected respectively. The verifier checks those cases; case-insensitive substring matching handles letters, not meaning.

From the extracted project folder:

```powershell
dotnet run -- --verify
```

### Separate an exact answer from an uncertain one

“Is the message empty?” has a definition your code can enforce. “What does the customer mean?” may have several plausible interpretations. A reliable feature can combine both: validate exactly, request a suggestion, then apply exact rules to what may happen next.

### Follow the example step by step

Trace three inputs through Route

1. **Check the guard:** For three spaces, IsNullOrWhiteSpace is true. Route returns Rejected before checking a keyword.

2. **Check literal wording:** For “I need a REFUND”, the case-insensitive refund check succeeds. Route returns Billing.

3. **Find the limitation:** For “Please return my payment”, the same check fails and Route returns General. This failure is about wording coverage, not permissions or payment processing.

An exact implementation can satisfy its written rule and still miss a business intent. Record both the rule and the limitation.

### Practise with a little help

Extend the existing rules lab to recognize “return my payment” while keeping the whitespace guard.

```csharp
// Keep the empty-input guard first.
// Match refund OR return my payment, ignoring case.
```


Hint: Add a second Contains condition with OR. Predict the changed test result before editing.

Expected approach: Combine the two case-insensitive Contains checks. Update the supplied phrase case from General to Billing and keep an unrelated message returning General.

Expected result: Both specified phrases route to Billing. “Reverse the charge” can still be missed; do not claim full language understanding.

### Apply it to another .NET feature

A checkout service must prevent a discount above 20%. Should an LLM decide whether to enforce that maximum?

Compare your reasoning: No. Enforce the policy with explicit validated C# logic. A generated explanation of the discount is a different, optional feature.

### Explain it again tomorrow

Without reopening the first lesson, distinguish a learned suggestion from a business rule.

Compare your explanation: The suggestion comes from learned patterns and can be wrong. The rule specifies a requirement the application must enforce.

Optional practice does not change saved understanding checks or certify project work.

## 3. What a model does

Objective: Identify a model’s input, its output, and the application decisions outside its responsibility.

Prerequisite: What makes a feature an AI feature?

In C#, you already work with components through contracts. A tax service accepts an amount and returns a calculation. You can use the service without knowing every internal step.

You can think about a model boundary in the same way. A support-category model accepts message text and returns a proposed label such as Billing, Account, or Technical. A label is simply a category name.

The difference is how the model acquired its behavior. In machine learning, a training process learned patterns from data. The saved model contains that learned information. It is not a database of guaranteed answers.

A model that returns Billing has not issued a refund or changed a database row. Your application still validates the response, applies authorization and business rules, and decides whether to show a suggestion or take a permitted action.

**Model:** A reusable component containing learned patterns. Your application gives it input and receives a prediction or generated output.

### Worked example

Give the model a small, clear job.

> I cannot sign in after changing my password.

- Inside the model boundary: Message text in; category out. Result: Account.
- Outside that boundary: Application decides what to display. Result: Suggest Account to staff.

The category is a fixed illustrative response here. A real integration would also handle errors, unsupported output, and slow responses. It would not send private account details without an appropriate reason.

### Try it

Choose a message and inspect the input, illustrative model output, and application responsibility. The examples do not run a real model. Open the interactive lesson to try the exercise.

### Check understanding

The model suggests Billing. What does that prove?

1. The application is authorized to issue a refund.
2. The model returned a category that the application must validate and handle.
3. The customer has definitely been charged twice.

Answer: 2. Correct. Treat the response as input to your application, not as permission or a guaranteed fact.

### .NET connection

This is an illustrative contract, not an implemented model. Later, a real ML.NET model or provider adapter can sit behind a service boundary. Cancellation and validation remain application concerns.

C# · illustrative contract

```text
public record CategorySuggestion(string Category);

public interface IMessageClassifier
{
    Task<CategorySuggestion> SuggestAsync(
        string message,
        CancellationToken cancellationToken);
}
```

Contribution: You separate a category suggestion from saving or acting on a request.

Next: Understand how the model gets its behavior before your API calls it.

Reference: [Microsoft Learn: How ML.NET works](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-does-mldotnet-work)

### Find this concept in the project

File: labs/supportdesk-rules/Program.cs

Method or type: Route

Scope: Illustrative pattern backed by lab

Task: Trace the string input and category output of Route. Write a hypothetical replacement contract for a category model, then mark authorization and refunds as application responsibilities.

Expected result: The real file returns a category string and performs no refund. A model boundary is a conceptual replacement here: this lab contains an explicit rule, not a learned model.

From the extracted project folder:

```powershell
Get-Content Program.cs
```

### A model has parameters; an application has responsibilities

A parameter is a number stored inside a model that affects its output. Training chooses parameter values from examples. You usually call a model through a service contract without editing those numbers yourself. The contract also lets you replace the dependency with a clearly labelled fixed sample for a test.

### Follow the example step by step

Inspect the boundary, not just the answer

1. **Supply the input:** The model receives “I cannot sign in.” For this category task, the desired output shape is one permitted category, not arbitrary instructions.

2. **Receive a prediction:** An illustrative response is CategorySuggestion("Account"). It is data returned by a dependency, not a command to reset a password.

3. **Decide what to show:** The service validates the category and the UI shows it for review. This conceptual contract is not a running foundation web endpoint.

Changing the model should not silently change who owns validation, authorization or saving a user decision.

### Practise with a little help

Design a small C# record for a product-category suggestion without giving the model permission to edit inventory.

```csharp
public record ProductCategorySuggestion(string Category);
// Which service is allowed to change stock?
```


Hint: Return data about a suggestion. Keep inventory writes behind a separately authorized application action.

Expected approach: Return only the proposed category through the inference contract. Let a validated application command handle a separately requested inventory edit.

Expected result: A valid category can be displayed without any stock change. This is a design exercise, not a new implemented service.

### Apply it to another .NET feature

An invoice model returns Total=120. Does that prove the document was read correctly or authorize a payment?

Compare your reasoning: Neither. Validate the extracted amount against the document and policy. Payment requires its own authorized workflow.

### Explain it again tomorrow

Why does adding an interface not turn a fixed sample into a trained model?

Compare your explanation: An interface describes a boundary. How an implementation obtains its answer—fixed text, rules or learned parameters—is a separate question.

Optional practice does not change saved understanding checks or certify project work.

## 4. Training and using a model are different

Objective: Distinguish learning from examples during training from producing a result during inference.

Prerequisite: What a model does

Suppose you have past support messages with categories chosen by staff. Each pair is a labelled example: message text plus the category you want the model to learn to predict.

Training is a separate process that uses examples to adjust a model’s learned patterns. After training, you save a model artifact: a file or other reusable representation of the learned model.

Inference is using that saved model with a new message. Your ASP.NET Core service can ask it for a category without running the training process again for every HTTP request.

Correcting a suggestion in the inbox does not automatically retrain a model. You could store that correction as reviewed data for a future training run. That feedback pipeline must be built deliberately. When using an existing provider model, your application commonly performs inference without training that model itself.

**Inference:** Using a trained model to produce an output for an input. It does not mean that the model is being retrained.

### Worked example

Two processes, connected by a saved model.

> Past examples: “refund please” → Billing; “password reset” → Account

- Training process: Learn from labelled past examples. Result: Saved category model.
- Application request: New message → saved model. Result: Category prediction.

Saving corrected categories can improve a later dataset, but the model changes only when an appropriate update process runs. Training and inference can happen on different machines and at different times.

### Try it

Sort the actions into training, inference, or collecting feedback. Look for whether learned patterns are changing, being used, or merely being recorded. Open the interactive lesson to try the exercise.

### Check understanding

A user changes a suggested category. What happens to the model automatically?

1. Nothing necessarily changes; storing feedback and retraining require an implemented process.
2. The model immediately learns the correction forever.
3. Every later HTTP request must now retrain the model.

Answer: 1. Correct. A UI correction is not a training run. You need a deliberate process to collect, review, train, and evaluate updates.

### .NET connection

Later in this course, an ML.NET console project trains a small classifier. Your application then loads the resulting model for inference. This outline describes responsibilities; it is not a runnable training sample yet.

Project responsibilities · conceptual outline

```text
SupportDesk.Training       // Console project
  Read reviewed examples
  Train and evaluate a model
  Save model.zip

SupportDesk.Api            // ASP.NET Core project
  Load model.zip
  Receive a new message
  Return a category suggestion
```

Contribution: You know where training belongs and what a future feedback feature must do.

Next: Check why a trained model can still make mistakes.

Reference: [Microsoft Learn: How ML.NET works](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-does-mldotnet-work)

### Find this concept in the project

File: labs/supportdesk-rules/Program.cs

Method or type: Route

Scope: Illustrative pattern backed by lab

Task: Inspect Route and predict whether calling it again can teach it a new synonym. Identify what is missing for training and describe what a later fitted classifier would reuse during inference.

Expected result: Repeated calls do not alter Route: this lab does not train anything. Training would fit learned parameters from examples; inference would reuse them for a new input.

From the extracted project folder:

```powershell
Get-Content Program.cs
```

### Learning means changing the model, not memorizing this screen

Start with an input, a target answer and an imperfect prediction. A training algorithm measures an error and adjusts model parameters to reduce its objective across training examples. Repeating that process is training. Later inference uses the fitted parameters to make a new prediction; it normally does not update them.

### Follow the example step by step

One weight, one prediction, one correction

1. **Choose a tiny numeric task:** Teaching-only regression example: prediction = weight × input. For input 2, the target is 4. Start with weight 0, so the prediction is 0. This is not the text-classification algorithm used by our ML.NET lab.

2. **Measure the error:** The prediction misses by 4. Squared error is (0 − 4)² = 16. This loss is a training objective for this example, not classification accuracy.

3. **Update and compare:** One gradient step with learning rate 0.1 changes the weight to 1.6. Prediction becomes 3.2 and squared error becomes 0.64. Try a larger step in the exercise: an update can make this example worse.

The changed parameter explains the changed output. Improving one training row does not establish quality on new inputs.

### Practise with a little help

Before using the demo, predict the output for weight 2 and input 3. Then explain which of those numbers training would normally change.

```csharp
double prediction = weight * input;
// weight = 2; input = 3;
```


Hint: Multiply weight by input. The input describes the example; the weight is the learned parameter.

Expected approach: Prediction is 6. A training algorithm adjusts the weight using training data and a learning objective. At inference, the input can change while the fitted weight stays fixed.

Expected result: You distinguish an input value, a target value and a model parameter. Our one-row demonstration is not a useful trained business model.

### Apply it to another .NET feature

A .NET delivery-time model is loaded once and predicts for a new order. Is each request another training run?

Compare your reasoning: Not in an ordinary inference path. It uses saved parameters. Further training would be an explicit separate process with suitable data and evaluation.

### Explain it again tomorrow

Tomorrow, explain what changes during training and what normally stays fixed during inference.

Compare your explanation: Training updates parameters. Inference uses the fitted parameters with a supplied input. Loading a file, changing a prompt or displaying a result does not itself prove training occurred.

Optional practice does not change saved understanding checks or certify project work.

### Learning rate and loss play different roles

Loss measures the error being optimized. Learning rate controls the size of an update. A larger step is not automatically better. Real training uses many examples, appropriate objectives and safeguards; the small demo only makes the update visible.

Try to explain: If one update raises squared error from 16 to 144, did making a bigger parameter change help this example?

Compare your explanation: No. The example became worse. Compare the objective before and after instead of treating any update as improvement.

## 5. Why predictions can be wrong

Objective: Explain why a model prediction needs evaluation and an appropriate response to mistakes.

Prerequisite: What a model does, When ordinary C# rules are enough

A support model learned from examples, not from every possible customer message. New wording, unclear requests, and patterns missing from training data can lead to a wrong category.

Consider “My refund button crashes.” The word refund is about Billing, but the actual problem might be Technical. Even a person may need more context. The right design allows correction instead of treating the first suggestion as a fact.

To evaluate a classifier, compare its predictions with reviewed categories on examples that were not used to train it. This helps reveal how it behaves on new data. Do not judge it only by examples it has already learned from.

The cost of a mistake matters. A wrong inbox category might cause a short delay. An incorrect automatic refund changes money. Start with suggestions and human review; keep exact business rules in control of consequential actions.

**Evaluation:** Checking a model’s outputs against examples or criteria that tell you whether it is useful for your task.

### Worked example

A plausible category can miss the actual problem.

> My refund button crashes whenever I click it.

- Illustrative model output: Focuses on the word “refund”. Result: Billing.
- Reviewed category: The customer reports a software failure. Result: Technical.

One failure does not make every model useless. It gives you a concrete case to include in evaluation and a reason to let staff change a suggestion.

### Try it

Reveal five illustrative predictions, compare them with reviewed labels, and inspect the mistakes. These are authored examples, not a benchmark for a real model. Open the interactive lesson to try the exercise.

### Check understanding

How should you first evaluate your category model?

1. Run only the same messages used to train it.
2. Accept every suggestion because the model has finished training.
3. Compare predictions with reviewed labels on held-out messages and inspect mistakes.

Answer: 3. Correct. “Held-out” means set aside from training. Inspecting failures also tells you which safeguards the UI needs.

### .NET connection

Use separate fields for the model suggestion and the category accepted by staff. This makes the decision visible and preserves evidence for later evaluation. The record below is an illustrative data shape.

C# · illustrative review record

```text
public record ReviewedCategory(
    string SuggestedCategory,
    string AcceptedCategory,
    string ReviewedBy);

// SuggestedCategory: "Billing"
// AcceptedCategory:  "Technical"
// ReviewedBy:        "demo-agent"
```

Contribution: You plan a reviewable suggestion instead of an irreversible automatic decision.

Next: Choose the smallest suitable approach for each feature.

Reference: [Microsoft Learn: How ML.NET works](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-does-mldotnet-work)

### Find this concept in the project

File: labs/supportdesk-rules/Program.cs

Method or type: Route

Scope: Illustrative pattern backed by lab

Task: Compare the General result for "Please return my payment" with a fictional reviewer who wants Billing. Explain the difference between implementing the specified rule correctly and meeting a routing need.

Expected result: General is correct for the implemented substring rule but can miss the reviewed intent. This is a rule limitation, not a measured model error rate; a future model also needs held-out evaluation.

From the extracted project folder:

```powershell
Get-Content Program.cs
```

### Correctness and confidence need different evidence

A prediction can be confidently wrong when the input differs from training examples or a label is ambiguous. A score is not automatically a calibrated probability. Decide which mistakes matter, inspect representative held-out cases and provide a useful fallback when the application cannot rely on a suggestion.

### Follow the example step by step

Find the failed assumption in one ticket

1. **Read the whole message:** “The refund screen crashes” contains a payment word, but the reported problem is a broken screen.

2. **Compare with the reviewed label:** For this authored example, a reviewer labels it Technical and a model suggests Billing. Count it as a mismatch even if the model output looks confident.

3. **Choose a correction path:** Let staff correct the category and investigate whether category definitions or representative examples need improvement. Do not train directly on a final test set to repair its score.

An explanation of the error helps you choose an intervention. A percentage alone cannot identify that intervention.

### Practise with a little help

For a fictional photo-upload feature, list one behavior when a document-type suggestion is unsupported.

Hint: A useful fallback helps the user continue without inventing an answer.

Expected approach: Show “Please choose the document type” and let the user select a permitted option. Preserve the original input for the authorized review flow; do not silently label every unknown document as Invoice.

Expected result: The feature handles uncertainty explicitly. A guessed category is not presented as verified evidence.

### Apply it to another .NET feature

A catalog query is outside the supported product range. Should the app show the highest-scoring match as guaranteed correct?

Compare your reasoning: No. Similarity or model scores need task-specific evaluation and an appropriate fallback. Explain no suitable match rather than promising unsupported relevance.

### Explain it again tomorrow

Recall the model boundary: why can your application reject or withhold a model response?

Compare your explanation: The application owns validation and consequences. A model response is input to that decision, not authority over it.

Optional practice does not change saved understanding checks or certify project work.

## 6. Choose rules, machine learning, or an LLM

Objective: Select a reasonable starting approach based on a feature’s output and need for exactness.

Prerequisite: When ordinary C# rules are enough, What a model does, Why predictions can be wrong

You now have three useful starting points. Rules implement exact decisions you can specify. A traditional machine-learning classifier learns to choose a label from examples. A large language model can generate text and also perform tasks such as classification.

For SupportDesk, message validation stays in C#. Category routing might start as a rule and later become a small ML.NET classifier when you have enough suitable labelled examples. Writing a draft reply is a language-generation task that may suit an LLM.

These are starting choices, not rigid laws. An LLM can classify messages too, but cost, privacy, latency, data availability, and measured quality determine whether that is a better choice. A more capable model is not automatically a better application design.

You can combine approaches: validate a request with rules, ask a model for a draft, and let a person approve it. A large language model is itself machine learning; we distinguish it here because building with an existing language model has different practical trade-offs from training a small classifier.

**Large language model (LLM):** A model trained on large amounts of data to work with language and other supported inputs. It can generate text, such as a summary or a draft reply.

### Worked example

Three jobs in the same application.

> SupportDesk needs validation, routing, and draft replies.

- Exact requirement: Reject an empty message. Result: C# rule.
- Learn a category: Route messages from reviewed examples. Result: Small classifier.
- Generate language: Draft a reply for staff to review. Result: LLM.

The classifier choice assumes suitable labelled data and acceptable measured results. The LLM generates a proposal; staff review and application authorization still matter.

### Try it

Choose a sensible first approach for three SupportDesk requirements. Read why each answer fits and where other approaches could make sense. Open the interactive lesson to try the exercise.

### Check understanding

Which design is the strongest starting point?

1. Use an LLM for validation, permission checks, and every other decision.
2. Use rules for validation, evaluate a classifier for routing, and review LLM-generated drafts.
3. Never use models if an application already has C# services.

Answer: 2. Correct. Each component has a clear job, and uncertain outputs get evaluation and review.

### .NET connection

Write a short decision for each proposed feature: input, required output, simplest approach, failure consequence, and proof it works. Then run the rules-baseline lab. The next unit adds a first ML.NET classifier; later units introduce Blazor and provider integrations.

Engineering decision · worked example

```text
Feature: Reject an empty message
Input: Customer message text
Output: Accept or reject
Approach: C# validation rule
Failure: An empty request enters the queue
Proof: Tests for empty, spaces, and valid text
```

Contribution: You can justify the first three capabilities in the SupportDesk roadmap.

Next: Complete the desktop rules lab, then continue into labelled data and ML.NET.

Reference: [Microsoft Learn: AI in .NET](https://learn.microsoft.com/en-us/dotnet/ai/overview)

### Find this concept in the project

File: labs/supportdesk-rules/Program.cs

Method or type: Route

Scope: Conceptual decision backed by lab

Task: Write three decisions beside Route: empty-message validation, ambiguous category suggestion, and a reply draft. For each, choose an approach and specify the evidence and review it would need.

Expected result: Keep empty checks in C#; consider an evaluated classifier for categories and a reviewed language model for drafts. The runnable milestone implements only the rules baseline.

From the extracted project folder:

```powershell
Get-Content Program.cs
```

### Name the output before choosing an approach

Classification chooses a category; regression predicts a number; generation composes an output such as text. Those are different tasks. If a known formula supplies an exact answer, use the formula. Decide whether learning is justified by the requirement and available evidence, not by whether a library has an AI label.

### Follow the example step by step

Three requirements, three decisions

1. **Reject an empty ticket:** The answer follows an explicit definition. Use string.IsNullOrWhiteSpace and test it.

2. **Suggest one support category:** The input has varied wording and the permitted output labels are known. A supervised classifier is a candidate if suitable labelled examples and evaluation justify it.

3. **Draft a readable reply:** Many wordings may be useful. A language model is a candidate, with bounded context, response handling and staff review. A fixed sample can teach the UI before any provider is enabled.

The simplest suitable approach can differ for each part of the same application. AI is not a replacement for the entire stack.

### Practise with a little help

Classify three fictional features by the required output: invoice type, estimated delivery hours, and a draft product description.

Hint: Ask whether the output is one known category, a number or composed language.

Expected approach: Invoice type is classification; predicted delivery hours is regression; a draft description is generation. This identifies task types, not proof that a model is necessary or good enough.

Expected result: You can name the task before choosing a package or provider. Exact scheduled hours from a known timetable may need only a lookup.

### Apply it to another .NET feature

A booking system already has an exact cancellation-fee formula. A new request asks for a plain-language explanation. Where could generation help?

Compare your reasoning: C# should compute the fee. An optional generator could explain the already-computed result, with validation and review appropriate to the use. It must not invent a new fee.

### Explain it again tomorrow

Revisit tomorrow: what evidence would justify replacing your original keyword baseline?

Compare your explanation: A relevant measured improvement on held-out examples, acceptable error consequences and operational constraints. A more advanced model name is not evidence.

Optional practice does not change saved understanding checks or certify project work.
