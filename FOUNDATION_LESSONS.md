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

## 3. What a model does

Objective: Identify a model’s input, its output, and the application decisions outside its responsibility.

Prerequisite: When ordinary C# rules are enough

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

## 5. Why predictions can be wrong

Objective: Explain why a model prediction needs evaluation and an appropriate response to mistakes.

Prerequisite: Training and using a model are different

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

## 6. Choose rules, machine learning, or an LLM

Objective: Select a reasonable starting approach based on a feature’s output and need for exactness.

Prerequisite: Why predictions can be wrong

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
