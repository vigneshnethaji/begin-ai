# AI for .NET developers — available lessons

20 complete lessons across 3 units. Open index.html for interactive exercises and the three desktop labs. Later units remain clearly marked Planned.

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

## 7. Start with one example, then a dataset

Objective: Recognize one training example and explain what a collection of examples represents.

Prerequisite: Choose rules, machine learning, or an LLM

Your C# routing rule looked for the word “refund”. To teach a model another approach, begin with one example: “I was charged twice” belongs to Billing. A staff member has reviewed that answer.

Add another example: “My password reset link expired” belongs to Account. Each message and its category form one row. A collection of these rows is a dataset. You can store the rows in a text file and read them into C# objects.

The examples must match the task. A category model needs messages paired with categories. A list of customer IDs and order totals would not explain how to route support messages.

In our lab, all examples are fictional and come with the project. You do not need to find or share company data. The small dataset teaches the workflow; it cannot demonstrate that the classifier is ready for real customers.

**Dataset:** A collection of examples organized for a task. In our classifier, each row contains a support message and a reviewed category.

### Worked example

Two familiar rows become learning examples.

> SupportDesk message: “I was charged twice.”

- First example: Message: I was charged twice. Result: Reviewed category: Billing.
- Second example: Message: My password link expired. Result: Reviewed category: Account.

Both rows have the same structure. The wording and reviewed answer vary. A dataset should cover the categories and language variations relevant to the task.

### Try it

Select a row in a tiny fictional dataset. Inspect its message and the answer a reviewer attached to that message. Open the interactive lesson to try the exercise.

### Check understanding

What is one example for this category classifier?

1. A message paired with a reviewed category.
2. A NuGet package version.
3. The total number of users in the application.

Answer: 1. Correct. That row shows the input and the answer the model should learn to predict.

### .NET connection

You can represent one labelled example with a small C# class. The lab will load a file into rows like this. This first shape is illustrative; the supplied lab includes its full model classes.

C# · one example as a typed object

```text
public sealed class SupportMessage
{
    public string Text { get; set; } = "";
    public string Label { get; set; } = "";
}

// One row: Text = "I was charged twice"
//          Label = "Billing"
```

Contribution: You define the input rows for a future SupportDesk category classifier.

Next: Separate what the model receives from what it is trying to predict.

Reference: [Microsoft Learn: Categorize support issues with ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/github-issue-classification)

## 8. Features are the inputs a model uses

Objective: Identify a useful input feature and avoid supplying information that will be unavailable on a new request.

Prerequisite: Start with one example, then a dataset

When a new ticket arrives, you have its message text. That is a useful input for deciding whether it concerns Billing, Account, or Technical support. In machine learning, inputs used for prediction are called features.

A traditional ML.NET text trainer works with numbers. FeaturizeText is a library operation that transforms text into a numeric representation. You will use it in the pipeline lesson; you do not need to write the conversion mathematics now.

Not every database column is a helpful feature. An arbitrary ticket ID identifies a record but does not explain its meaning. A final category chosen by a reviewer is even more problematic: it is the answer we are trying to predict.

If you accidentally give the model the final answer as an input, a test can look excellent for the wrong reason. This is one form of data leakage: information slips into learning or evaluation that would not be available for a genuine new prediction.

**Feature:** An input used to make a prediction. Our initial input is message text; a text transform turns it into numeric features the learner can process.

### Worked example

A database row contains more than the model should see.

> Ticket 1042: “I cannot reset my password.” Reviewed category: Account.

- Useful first input: The message exists before routing. Result: Message text.
- An answer disguised as input: The reviewed category is not known yet. Result: Do not use as a feature.

The category remains in labelled training rows as the target, not as an input feature. The trainer uses the target to learn, while a new prediction receives only the message.

### Try it

Inspect three candidate fields. Choose whether each belongs in the first version of the prediction inputs. Open the interactive lesson to try the exercise.

### Check understanding

Which field should the first model use as its prediction input?

1. The category assigned after staff reviewed the ticket.
2. The customer’s message text.
3. The exact row number in the training file.

Answer: 2. Correct. It is available when the ticket arrives and contains clues relevant to categorization.

### .NET connection

Text is the lab’s message column. Features is the numeric output column produced by FeaturizeText. This library operation prepares input; it does not decide the category by itself.

C# · illustrative ML.NET transform

```text
var textStep = ml.Transforms.Text.FeaturizeText(
    outputColumnName: "Features",
    inputColumnName: nameof(SupportMessage.Text));

// Raw input: Text
// Numeric representation: Features
```

Contribution: You choose message text as the classifier input without leaking the category.

Next: Identify the category as the label to learn.

Reference: [Microsoft Learn: Prepare data for ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-to-guides/prepare-data-ml-net)

## 9. Labels are the answers in your examples

Objective: Distinguish an input message, its training label, and the prediction returned for a new message.

Prerequisite: Features are the inputs a model uses

The message is the input; the category attached by a reviewer is the label. “My password link expired” with the label Account tells the training process which result we want for that example.

This approach is called supervised learning: examples include target answers. The model does not invent the category definitions. People must first decide what the categories mean and label the examples consistently.

For SupportDesk, use Billing for payment questions, Account for access and password questions, and Technical for application failures. A message can still be ambiguous. If reviewers disagree, clarify the task instead of pretending that either label is always obvious.

On a new message, the reviewed label is absent. The model returns a predicted category. Prediction and label can have the same value, but they have different roles: one is the model’s proposal; the other is the reference answer in an example.

**Label:** The target answer attached to a training example. For our task, the labels are Billing, Account, and Technical.

### Worked example

The answer is present during training, absent on a new request.

> “The upload screen freezes.”

- A labelled training row: A reviewer identified an application failure. Result: Label: Technical.
- A new prediction request: Only message text arrives at the model. Result: Prediction: a proposed category.

When we evaluate, we compare the proposal with a separate reviewed label. At inference time in the real application, staff may supply the accepted category later.

### Try it

Choose a reviewed category for three clearly described messages, then inspect what happens when the message is ambiguous. Open the interactive lesson to try the exercise.

### Check understanding

What is the label for a training row?

1. The HTTP route used to call the API.
2. Whatever the model happens to predict.
3. The reviewed target category, such as Billing.

Answer: 3. Correct. The training example includes a reference answer the learner can compare its behavior against.

### .NET connection

The lab uses ML.NET column attributes for predicted output. A prediction request needs Message, while training rows also contain a category. These names describe responsibilities; use the supplied lab for the full compiled definitions.

Data contract · input, label, and prediction

```text
// Training row: Message + reviewed Category
// Prediction input: Message
// Prediction output: PredictedCategory

// Never copy the model proposal into the reviewed
// label merely to make evaluation look correct.
```

Contribution: You establish the three category meanings for SupportDesk.

Next: Check whether your examples are consistent and appropriate to learn from.

Reference: [Microsoft Learn: Categorize support issues with ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/github-issue-classification)

## 10. Good examples matter more than extra rows

Objective: Recognize missing text, conflicting labels, duplicates, and overly narrow examples before training.

Prerequisite: Labels are the answers in your examples

A blank message labelled Billing does not teach the meaning of a payment question. Two identical messages with different labels may reveal a labelling mistake or a rule that reviewers have not agreed on.

Duplicates can also mislead you. Copying the same message many times increases the file size without adding new wording. If a duplicate appears in both training and testing, the test no longer cleanly represents unseen examples.

Coverage matters too. Include examples for each category and variations in how people express the same need. A dataset containing only “refund” messages cannot teach the model the range of Account or Technical issues.

Our downloadable files use fictional messages and intentionally small datasets. For real work, define appropriate data access and review before using messages that may contain personal or confidential information. Data preparation is an engineering step, not a reason to copy customer records into a learning project.

**Data quality:** How suitable, consistent, and relevant your examples are for the task you want the model to learn.

### Worked example

Two rows can disagree before a model is involved.

> Row A: “Reset my password” → Account. Row B: “Reset my password” → Billing.

- What the rows say: The same input has conflicting target answers. Result: Review the labels.
- What not to assume: The trainer cannot resolve your undefined policy. Result: More training is not the first fix.

Some messages genuinely have several meanings, but the single-category task needs a clear labelling policy. The tiny lab includes a dataset-separation check, not a comprehensive data-governance system.

### Try it

Decide whether an example can be used, needs review, or should be removed from this small teaching dataset. Open the interactive lesson to try the exercise.

### Check understanding

What should you do first with identical messages carrying conflicting labels?

1. Review the examples and clarify the category policy.
2. Copy both rows ten more times.
3. Hide the conflict and report only the best model result.

Answer: 1. Correct. Resolve the inconsistency or identify genuine ambiguity before using the rows as trusted examples.

### .NET connection

Reject empty text and unknown categories before fitting the pipeline. The lab’s verification checks basic dataset structure and separation; a real application needs a broader review process.

C# · illustrative input validation

```text
if (string.IsNullOrWhiteSpace(row.Text))
    throw new InvalidDataException("Message is empty.");

var allowed = new[] { "Billing", "Account", "Technical" };
if (!allowed.Contains(row.Label))
    throw new InvalidDataException("Unknown category.");
```

Contribution: You define simple checks before SupportDesk learns from reviewed messages.

Next: Keep a separate set of examples for a meaningful first evaluation.

Reference: [Microsoft Learn: Prepare data for ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-to-guides/prepare-data-ml-net)

## 11. Keep test messages out of training

Objective: Explain why evaluation needs messages the training process has not used.

Prerequisite: Good examples matter more than extra rows

Imagine studying six practice questions and then taking an exam with exactly the same six questions. A high score would not tell you much about handling new situations.

A classifier needs a similar separation. Training examples teach the model patterns. Test examples check the result after training. Both sets have reviewed categories, but only the training set should be passed to Fit.

Our lab supplies separate train.tsv and test.tsv files. A TSV is a text file whose columns are separated by tab characters. Each file contains Label and Text columns: the category answer and the message input. The lab checks that their message texts do not overlap.

A random split is not always enough for real systems. Similar tickets, the same customer conversation, or future information can still leak across a split. As you improve a model repeatedly, use a validation process for tuning and reserve a final test set for an independent check. This first lab keeps the workflow small so the separation is easy to inspect.

**Held-out test set:** Reviewed examples kept separate from training, then used to check the trained model on unseen inputs.

### Worked example

The two files serve different jobs.

> You have reviewed support messages with known categories.

- train.tsv: Read these examples inside the learning process. Result: Used by Fit.
- test.tsv: Use these after the model is trained. Result: Used by evaluation.

A test label lets us check the prediction. It must not be included among the input features or passed into the training run that is being evaluated.

### Try it

Place a teaching example in training or testing. Watch why reusing the same message in both creates misleading evidence. Open the interactive lesson to try the exercise.

### Check understanding

Which input should you pass to pipeline.Fit?

1. The combined training and test rows, then report the test result as unseen performance.
2. Only the training rows, keeping the test rows for evaluation.
3. Only the test labels, with no message text.

Answer: 2. Correct. The model learns from training rows; the separate test rows check its behavior afterward.

### .NET connection

IDataView is ML.NET’s table-like data interface. Loading a file is not the same as training. The important boundary is which table you pass to Fit.

C# · illustrative train/test boundary

```text
IDataView trainingData = LoadTrainingRows();
IDataView testData = LoadTestRows();

ITransformer model = pipeline.Fit(trainingData);
IDataView predictions = model.Transform(testData);

// LoadTrainingRows/LoadTestRows are explanatory
// names here; the lab supplies the actual file loader.
```

Contribution: You separate SupportDesk training examples from evaluation evidence.

Next: Build the small ML.NET pipeline that prepares inputs and learns categories.

Reference: [Microsoft Learn: Categorize support issues with ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/github-issue-classification)

## 12. Train your first ML.NET text pipeline

Objective: Identify input preparation, category learning, and output conversion in a small ML.NET pipeline.

Prerequisite: Keep test messages out of training

Install Microsoft.ML in a C# console project. MLContext is the main starting object for ML.NET operations, similar to a context that groups related library services. Our lab supplies the complete project and package version.

The first pipeline step maps category strings such as Billing to numeric keys in a Label column. MapValueToKey performs that conversion. The next step, FeaturizeText, turns the message Text column into a numeric Features column.

A multiclass trainer learns to choose one of several categories from those features. Our example uses SdcaMaximumEntropy. You do not need to memorize the algorithm name: first understand that it learns a relationship between input features and target labels.

MapKeyToValue turns the predicted numeric category back into readable text. Calling Fit on the training rows builds the fitted transforms and classifier. Defining the steps alone does not train anything. The fitted preparation steps must stay with the classifier when you save it.

**Pipeline:** A sequence of data-preparation and learning operations. Calling Fit runs the learning process and returns a reusable trained model.

### Worked example

The message moves through one reusable pipeline.

> Message: “The upload button freezes.” Category on the training row: Technical.

- Prepare inputs and labels: Category → Label key; Message → Features. Result: Numeric columns the trainer can use.
- Learn and decode: Train category selection; turn the result back into text. Result: A reusable text classifier.

The browser exercise illustrates the operation order. The desktop lab runs these operations with the actual Microsoft.ML package and synthetic files.

### Try it

Assemble the preparation, training, and readable-output steps. See which operation actually starts learning. Open the interactive lesson to try the exercise.

### Check understanding

What actually starts the training process?

1. Adding a using Microsoft.ML statement.
2. Displaying a predicted label in Blazor.
3. Calling Fit with the training data on the defined pipeline.

Answer: 3. Correct. Fit learns from those rows and returns the fitted transforms and model.

### .NET connection

This is the core pattern used in the supplied lab. The surrounding lab defines its input types, reads data, saves a model, and handles failures.

C# · core ML.NET pipeline pattern

```text
var pipeline = ml.Transforms.Conversion
    .MapValueToKey("Label", "Label")
    .Append(ml.Transforms.Text
        .FeaturizeText("Features", "Text"))
    .Append(ml.MulticlassClassification.Trainers
        .SdcaMaximumEntropy("Label", "Features"))
    .Append(ml.Transforms.Conversion
        .MapKeyToValue("PredictedLabel"));

var model = pipeline.Fit(trainingData);
```

Contribution: You can train a real first category classifier for SupportDesk.

Next: Measure its output on the separate test messages.

Reference: [Microsoft Learn: Categorize support issues with ML.NET](https://learn.microsoft.com/en-us/dotnet/machine-learning/tutorials/github-issue-classification)

## 13. Evaluate predictions and inspect the mistakes

Objective: Compare held-out predictions with reviewed labels and interpret an accuracy count without overstating it.

Prerequisite: Train your first ML.NET text pipeline

Once the model is trained, run each held-out message through it and compare the proposed category with its reviewed label. Count how many match. If four of five match, the accuracy on those five examples is 80 percent.

That number describes those examples, not every future support request. A tiny synthetic test set is useful for learning the workflow. It is not evidence of performance with your customers or a promise that the model beats a simple rule.

Inspect the mismatches. “The refund screen crashes” might be a Technical issue even though it contains a payment word. Ask whether the label is consistent, the training examples cover the wording, and the category boundaries fit the application.

Compare your model with the earlier keyword baseline on the same held-out examples. Include the error consequences in the decision. Our lab reports both results, and it is acceptable for the small model to lose. Do not repeatedly train on test messages to make the comparison look better.

**Accuracy:** The fraction of evaluated examples whose predicted category matches the reviewed category. A small or unrepresentative test set can give a misleading impression.

### Worked example

One result can hide the most important failure.

> An illustrative evaluation matches 4 of 5 reviewed examples.

- The headline count: Four predictions match their reviewed labels. Result: 80% on this five-row example.
- The engineering question: Which message failed, and what happens if staff accept it? Result: Inspect the mismatch.

The figures in this worked example are authored for teaching. The runnable lab prints its own measured counts and per-message results; its numbers can differ.

### Try it

Reveal a five-message evaluation. Count matches and inspect the wrong prediction instead of stopping at a percentage. Open the interactive lesson to try the exercise.

### Check understanding

A toy test reports 100% accuracy. What can you safely conclude?

1. All evaluated toy examples matched their reviewed labels; broader quality is still unproven.
2. The application will never route a real customer message incorrectly.
3. The model no longer needs application validation or human review.

Answer: 1. Correct. The result describes that test set. More representative held-out evaluation and failure analysis are still needed.

### .NET connection

The lab runs the saved model against held-out rows and also applies the rules baseline. Its output includes the denominator, predicted and reviewed categories, and mismatches.

C# · evaluation flow used by the lab

```text
var classifier = new SupportClassifier();
var saved = classifier.Load();
var rows = LabData.Load("test.tsv");
var report = classifier.Evaluate(saved, rows);

Console.WriteLine($"{report.Correct}/{report.Total}");
report.Print(); // Counts, baseline, and wrong cases
```

Contribution: You can report honest evidence for the SupportDesk classifier.

Next: Save the fitted pipeline and reuse it for new requests.

Reference: [Microsoft Learn: Evaluate an ML.NET model](https://learn.microsoft.com/en-us/dotnet/machine-learning/resources/metrics)

## 14. Save the model, then use it from C#

Objective: Save and reload the fitted model without retraining for each new prediction.

Prerequisite: Evaluate predictions and inspect the mistakes

After training, save the fitted pipeline to a model file. Keep the text preparation steps with the classifier: a new message must be represented in the same way as the training messages.

A later C# process loads that file and predicts a category for new text. It does not need to train again for each request. In our console lab, train writes the artifact and predict loads it.

Keep the training and prediction commands separate so you can observe the difference. Run a prediction, close the process, then run another prediction. The model is reused; it has not learned from those new messages merely because you called it.

The first lab is a console application. When you later integrate with ASP.NET Core, keep the model behind a service boundary and use a suitable concurrent prediction pattern. PredictionEngine is intended for one-at-a-time use and must not be shared unsafely across concurrent HTTP requests. Also validate input, handle model-version and loading failures, and keep staff review of the category suggestion.

**Model artifact:** A saved representation of a fitted model and its required preparation steps. The application loads it to perform inference.

### Worked example

Two separate commands use one saved artifact.

> First: train on reviewed examples. Later: receive “My password reset link expired.”

- Training command: Fit on train.tsv and save the model. Result: A model file.
- Prediction command: Load that file and process new message text. Result: A category suggestion.

The saved file is not the training dataset. Loading it restores learned behavior and transforms. A new model version should be evaluated before replacing one in an application.

### Try it

Choose the correct operation when the model file exists, when it is missing, and when reviewed data changes. Open the interactive lesson to try the exercise.

### Check understanding

A new support message arrives after the model was saved. What should the console app do?

1. Add the unknown message to the test set and claim its predicted category is the correct label.
2. Load the saved model and request a prediction, while validating the input.
3. Train the model again for every message even if no reviewed examples changed.

Answer: 2. Correct. This is inference. Training is a separate operation, and the returned category is still a suggestion.

### .NET connection

Use the downloadable lab to run train, evaluate, and predict in separate processes. The following calls illustrate the save/load boundary. The lab includes the concrete classes and paths.

C# · illustrative saved-model reuse

```text
ml.Model.Save(model, trainingData.Schema, path);

var loaded = ml.Model.Load(path, out var schema);
using var engine = ml.Model.CreatePredictionEngine<
    SupportMessage, SupportPrediction>(loaded);

var suggestion = engine.Predict(new SupportMessage
{
    Text = "My password reset link expired"
});
```

Contribution: You have a trained, evaluated, reusable classifier to compare with the original C# rule.

Next: Run the full classifier lab. Continue into the available Language models in C# unit, starting with generated text and its limits.

Reference: [Microsoft Learn: Save and load trained models](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-to-guides/save-load-machine-learning-models-ml-net)

## 15. Generated text is a draft, not a verified answer

Objective: Distinguish generating a useful draft from checking whether its claims are true.

Prerequisite: Save the model, then use it from C#

Your ML.NET classifier proposed one category. A language model can instead compose a reply, such as a polite acknowledgement of a duplicate charge. You supply a message and instructions; the model generates text rather than selecting only Billing, Account, or Technical.

That flexibility creates a new failure to inspect. A draft might say “Your refund was processed today” even though the application never checked a payment record. The sentence sounds helpful but adds an unsupported fact. Generated text is not truth, and confidence in its wording does not verify it.

For SupportDesk, ask for a draft that acknowledges the issue and avoids promising actions. Display it for human review. Staff should verify payment facts through the authorized application, edit the reply, and explicitly decide whether to send it. Generating a draft must not issue a refund or send a message.

Begin the draft-replies lab in its free sample-response mode. It returns authored text so you can learn the service and screen without an account, network call, or charge. That sample is not model inference. The optional provider mode can generate different text and needs the same review boundary.

**Generated text:** New text produced from instructions and supplied context using a model’s learned patterns. Fluent wording is not evidence that its claims are correct.

### Worked example

A convincing refund claim can still be unsupported.

> Fictional ticket: “I was charged twice.” No payment records were supplied.

- Unsafe draft: “Your refund was processed today.” Result: Unsupported claim: review required.
- A bounded draft: “Thanks for reporting the duplicate charge. Our team will review it.” Result: Acknowledge without claiming a completed refund.

The second draft still needs review, including whether it matches team policy. Neither sentence proves anything happened in the payment system.

### Try it

Inspect an authored draft with an unsupported refund claim. Choose the next action and read why it matters. Open the interactive lesson to try the exercise.

### Check understanding

A generated reply says a refund is complete, but no payment record was checked. What should happen?

1. Send it because the wording is confident.
2. Verify the payment facts and edit the draft before deciding to send.
3. Ask for a longer reply so the claim becomes reliable.

Answer: 2. Correct. A person checks claims against an authorized source and controls sending.

### .NET connection

Illustrative C# contract shared by the free sample and optional provider. Each yielded string is a text fragment, not a verified fact or necessarily one token. The lab supplies the implementations.

C# · illustrative draft service contract

```text
public interface IDraftReplyService
{
    IAsyncEnumerable<string> StreamAsync(
        string message, CancellationToken cancellationToken);
}

// Review the assembled draft before sending anything.
```

Contribution: SupportDesk gains a reviewable reply draft without coupling its screen to a provider.

Next: Understand how the supplied context and output share a limited budget.

Reference: [OpenAI: Text generation](https://developers.openai.com/api/docs/guides/text)

## 16. Plan room for instructions, history, and the reply

Objective: Explain tokens and context, and reserve output space without treating a rough estimate as an exact count.

Prerequisite: Generated text is a draft, not a verified answer

A provider represents text as tokens. A short word might be one token, while a longer word or identifier can be split into several pieces. Punctuation, code, and different languages affect counts. A character count divided by four is only a rough teaching estimate for some English text, not a tokenizer.

A drafting request may include instructions, the current message, and selected conversation history. These all consume input space. Reserve room for the reply too. Exact accounting and limits depend on the chosen model, and some models also use a reasoning budget; consult that model’s documentation before relying on a numeric limit.

More history is not automatically more useful. Keep the facts needed for this reply, remove irrelevant repetition, and use approved summaries where appropriate. Do not silently drop a customer’s important constraint just to make the request fit. If context is insufficient, ask for clarification instead of inventing details.

The browser exercise uses a fictional 128-token capacity and estimates fixed English samples by character count. Changing history or the output reserve makes the tradeoff visible. These numbers describe only this simulation. The optional server provider uses OPENAI_MODEL so the lab does not promise one model’s context size forever.

**Token and context:** A token is a model-specific piece of encoded text. Context is the information available for a request, subject to that model’s limits. A token is not always a word or character.

### Worked example

A fictional budget exposes the tradeoff.

> Teaching capacity: 128 units. Estimated input: 92. Reserved output: 48.

- Keep everything: 92 + 48 = 140 estimated units. Result: 12 over the teaching capacity.
- Remove irrelevant history: An edited input of 60 plus the same 48 reserve is 108. Result: 20 units of teaching headroom.

This arithmetic is illustrative, not a provider quota or actual tokenizer result. Review what was removed and use model-specific accounting for a real request.

### Try it

Choose short or repeated history, reserve output space, and check the resulting fictional budget. Open the interactive lesson to try the exercise.

### Check understanding

What does this exercise’s characters-divided-by-four estimate tell you?

1. An approximate teaching budget, not the exact token count for a model.
2. The exact bill for every provider call.
3. That one word always equals one token.

Answer: 1. Correct. Real counts depend on the tokenizer and the complete request.

### .NET connection

Illustrative application validation before StreamAsync. A character limit protects your input boundary; it is not a substitute for model-specific token counting or an output limit in the optional provider.

C# · illustrative input boundary

```text
if (string.IsNullOrWhiteSpace(message))
    throw new ArgumentException("Enter a message.");
if (message.Length > 2000)
    throw new ArgumentException("Keep the message within 2000 characters.");

await foreach (var part in drafts.StreamAsync(message, cancellationToken))
{
    // Accumulate as plain text for human review.
}
```

Contribution: You decide what context SupportDesk sends and keep requests bounded.

Next: Follow one request through the sample service and optional provider.

Reference: [OpenAI: Counting tokens](https://developers.openai.com/api/docs/guides/token-counting)

## 17. Follow a first request through the .NET service

Objective: Trace a draft request from the service contract to an optional server-side Responses API call.

Prerequisite: Plan room for instructions, history, and the reply

First run the sample implementation of IDraftReplyService. The screen submits a fictional support message and consumes text fragments from StreamAsync(string, CancellationToken). A fixed sample is enough to check loading, cancellation, and review behavior without making a paid call.

The optional server implementation uses HttpClient to POST JSON to the OpenAI Responses endpoint. It supplies the configured model, instructions, input, and stream: true. OPENAI_MODEL selects the model and OPENAI_API_KEY authorizes the request. This mode sends the supplied data externally and may incur provider charges.

A successful streaming response contains server-sent events, or SSE: typed event messages carried over HTTP. The adapter extracts response.output_text.delta text, handles completion and failure events, and yields strings through the same contract. A network read is not necessarily a complete SSE event; use proper event framing rather than treating every line or byte block as a finished reply.

Check the HTTP status before reading events. A rejected request, interrupted stream, refusal, or incomplete result needs an honest user-facing state. Never quietly replace a provider error with the sample and claim a model succeeded. This browser exercise only looks up authored outcomes; it never contacts OpenAI.

**Provider:** The external service hosting the language model. Your server adapts its HTTP protocol into the draft service contract used by the application.

### Worked example

The same screen can use two honest modes.

> SupportDesk asks: draft a reply to “I was charged twice.”

- Sample mode: The local service yields authored sample fragments. Result: Free sample, visibly labelled.
- Optional provider mode: The server sends an authorized HTTPS request and parses SSE. Result: Generated draft or an explicit error.

The browser simulation does neither operation for real. The lab implements the shared contract, with the sample as the default learning path.

### Try it

Select a service mode and a simulated provider outcome. Observe when an error must be shown instead of a draft. Open the interactive lesson to try the exercise.

### Check understanding

The optional provider returns HTTP 401. What should the adapter do?

1. Render the HTTP error body as a customer reply.
2. Claim the sample was a successful model response.
3. Report a safe configuration failure and keep sample mode explicitly separate.

Answer: 3. Correct. Check server configuration without exposing credentials or inventing success.

### .NET connection

Illustrative server-only excerpt inside the optional provider, with an injected HttpClient named http and a configured model. It is not a complete StreamAsync implementation: the lab must parse SSE, yield text deltas, handle terminal events, and dispose the stream.

C# · illustrative Responses HTTP boundary

```text
using var request = new HttpRequestMessage(
    HttpMethod.Post, "https://api.openai.com/v1/responses");
request.Content = JsonContent.Create(new
{
    model, input = message,
    instructions = "Draft for human review. Do not invent completed actions.",
    stream = true
});
// Server adds the Authorization header from its configuration.
using var response = await http.SendAsync(request,
    HttpCompletionOption.ResponseHeadersRead, cancellationToken);
response.EnsureSuccessStatusCode();
```

Contribution: You connect the draft contract to a provider without changing the review screen.

Next: Keep authorization on the server and out of browser-delivered files.

Reference: [OpenAI: Streaming API responses](https://developers.openai.com/api/docs/guides/streaming-responses)

## 18. Keep provider credentials on the server

Objective: Locate provider credentials in server configuration and explain why browser-delivered assets cannot hold secrets.

Prerequisite: Follow a first request through the .NET service

The .NET 10 lab uses Blazor InteractiveServer. Component event handlers and the draft service execute on the server, while UI updates reach the browser through the Blazor connection. The optional provider’s HttpClient call belongs on that server. This is not a WebAssembly example that embeds a key in downloaded code.

Read OPENAI_API_KEY and OPENAI_MODEL from the server process environment when configuring the optional provider. These variable names are configuration inputs, not values to paste into a page. The free sample path needs neither variable. Do not force learners to obtain credentials just to practise the workflow.

A browser JavaScript file, local storage entry, or WebAssembly assembly can be inspected by its user. Committing the key to a settings file also exposes it to repository readers and history. Keep secrets out of these locations and out of exception details, screenshots, request logs, and responses sent to the browser.

Server storage does not replace application controls. Authorize who may request drafts, bound input and output, and apply usage limits appropriate to the application. This exercise asks where configuration belongs and never asks for a real or pretend key. Review the optional provider configuration privately on the server.

**Server-side credential:** Authorization material read only by trusted server code and excluded from browser payloads, repository history, and logs.

### Worked example

Follow configuration without copying its value.

> An operator configures the optional provider for the server process.

- Correct boundary: Server environment → provider configuration → Authorization header. Result: The browser receives no key.
- Exposed boundary: Key in a JavaScript bundle or committed appsettings file. Result: Treat it as exposed and replace it.

Do not log or render secret values to demonstrate configuration. The model identifier is not a credential, but both settings belong to the optional server provider’s configuration.

### Try it

Choose a location for the provider key. Inspect the explanation without entering any credential. Open the interactive lesson to try the exercise.

### Check understanding

Where should the optional provider read OPENAI_API_KEY?

1. From browser local storage.
2. From server configuration, without returning or logging the value.
3. From a settings file committed beside public assets.

Answer: 2. Correct. The server uses the key for authorization and returns only safe application results.

### .NET connection

Illustrative server startup excerpt used only when provider mode is explicitly selected. The environment must belong to the server process; sample mode should work with no configuration.

C# · illustrative server configuration

```text
var key = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
var model = Environment.GetEnvironmentVariable("OPENAI_MODEL");
if (string.IsNullOrWhiteSpace(key) || string.IsNullOrWhiteSpace(model))
    throw new InvalidOperationException(
        "Provider mode needs server configuration.");

// Inside the server adapter; never log this header.
request.Headers.Authorization =
    new AuthenticationHeaderValue("Bearer", key);
```

Contribution: SupportDesk can use a provider without distributing its credentials.

Next: Make waiting bounded and pass cancellation through every async layer.

Reference: [Microsoft Learn: Blazor security overview](https://learn.microsoft.com/en-us/aspnet/core/blazor/security/?view=aspnetcore-10.0)

## 19. Make a slow request stoppable

Objective: Distinguish a deadline from a user stop, and propagate their cancellation through a streaming request.

Prerequisite: Keep provider credentials on the server

A provider can respond slowly or stop midway through a stream. Leaving a spinner forever is not a useful outcome. Set a deliberate deadline and give the user a Stop button. A cancelled or timed-out draft remains incomplete, even if some text is already visible.

The component owns cancellation for its active request. Pass its token into IDraftReplyService.StreamAsync(string, CancellationToken), then through HttpClient.SendAsync and stream reads. For an async iterator, connect the token to enumeration as well. Merely cancelling a local flag while the HTTP operation ignores the token does not stop the waiting work.

The provider can link the caller token with a deadline token. Catch OperationCanceledException at the application boundary and distinguish a user stop from an expired deadline where possible. Disposing a token source alone does not request cancellation. Cancel active work before cleaning up its resources, and dispose request resources after the operation unwinds.

The exercise advances a fictional clock one second per click and has a five-second deadline. Choose a response delay, start, then either advance or stop. It makes no request and measures no real latency. Stopping local work is also not a promise that a remote provider has instantly stopped processing or that no usage will be charged.

**Cancellation and timeout:** Cancellation asks cooperative work to stop. A timeout is a deadline that triggers cancellation when the allowed waiting period expires.

### Worked example

The first terminal outcome wins.

> Teaching response delay: 8 seconds. Teaching deadline: 5 seconds.

- Wait five steps: The deadline arrives before the response. Result: Timed out; no completed draft.
- Stop after two steps: Caller cancellation arrives before the deadline. Result: Stopped by user; no completed draft.

A three-second response would complete before this deadline. At exactly five seconds, this simulation gives the deadline priority; real concurrent operations still need one consistent terminal state.

### Try it

Compare completion, manual cancellation, and a five-second deadline using a clock you advance yourself. Open the interactive lesson to try the exercise.

### Check understanding

What makes the Stop button effective across the service boundary?

1. Pass the cancellation token through the service, HTTP send, and stream reads.
2. Hide the spinner but leave the request running.
3. Dispose a token source without calling Cancel.

Answer: 1. Correct. Each awaited operation must observe the request’s cancellation.

### .NET connection

Illustrative excerpt inside the optional provider. Keep the linked source alive for the full stream, not just until headers arrive. The component still calls StreamAsync(message, itsRequestToken); error handling and SSE parsing are omitted here.

C# · illustrative streaming deadline

```text
using var deadline = CancellationTokenSource.CreateLinkedTokenSource(
    cancellationToken);
deadline.CancelAfter(TimeSpan.FromSeconds(30));

using var response = await http.SendAsync(request,
    HttpCompletionOption.ResponseHeadersRead, deadline.Token);
response.EnsureSuccessStatusCode();
await using var body = await response.Content.ReadAsStreamAsync(deadline.Token);
// Pass deadline.Token to every subsequent body read too.
```

Contribution: SupportDesk can stop waiting and accurately label an unfinished draft.

Next: Consume fragments in an InteractiveServer component and stop work when it is disposed.

Reference: [Microsoft Learn: Razor component lifecycle and cancelable work](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/lifecycle?view=aspnetcore-10.0)

## 20. Show a draft in Blazor as fragments arrive

Objective: Consume service fragments in an InteractiveServer component while managing completion, stop, and disposal.

Prerequisite: Make a slow request stoppable

A .NET 10 InteractiveServer component can await foreach over IDraftReplyService.StreamAsync(string, CancellationToken). Append each fragment to a draft string and request a render so the user sees progress before the event handler finishes. Display the string using ordinary Razor text interpolation; never treat a model reply as trusted HTML.

Keep explicit states for idle, receiving, completed, stopped, and failed. Disable duplicate starts while a request is active. A complete-looking sentence is not proof that the stream completed: a completion event and successful service enumeration establish delivery state. Even a fully delivered reply still needs human review before sending.

Navigation can dispose the component while an awaited operation is suspended. On disposal, cancel active work and prevent continuations from changing disposed UI state. Release request resources when the operation unwinds, and do not call StateHasChanged from Dispose. Avoid starting a paid request automatically during initialization, which can also run during prerendering.

The free sample lab lets you practise this lifecycle with authored fragments. The browser simulation delivers three fixed chunks only when you press Receive next chunk. Stop preserves the partial draft; Dispose blocks further delivery; Mount fresh component starts a new lifecycle. There are no timers or animated typing, so the interaction also works without motion.

**Streaming draft:** A reply displayed incrementally as text fragments arrive. Fragments are delivery pieces, not necessarily whole words, sentences, or tokens.

### Worked example

A partial draft must remain visibly partial.

> Three authored fragments: “Thanks for ”, “reporting this. ”, “Our team will review it.”

- Receive all three: The simulated stream completes successfully. Result: Complete draft; human review still required.
- Stop or dispose after one: Only “Thanks for ” has arrived. Result: Partial draft; further chunks are blocked.

The simulated component releases its controls on real unmount through the returned cleanup function. A real Blazor component uses its disposal lifecycle to cancel the server operation.

### Try it

Start, receive chunks, stop, and dispose the simulated component. Mount a fresh component to compare a complete draft with a partial one. Open the interactive lesson to try the exercise.

### Check understanding

The user navigates away during streaming. What should the component do?

1. Continue updating the old screen until the reply is complete.
2. Call StateHasChanged inside Dispose to show one final chunk.
3. Cancel its active request and guard continuations against updating disposed state.

Answer: 3. Correct. Cancellation and a disposed-state guard protect the request and component lifecycle.

### .NET connection

Illustrative .NET 10 Razor excerpt: use @rendermode InteractiveServer, inject IDraftReplyService as Drafts, and display @draft as text. Complete event wiring and error UI belong in the lab. A local source is disposed in finally, after its operation unwinds; Dispose only signals cancellation.

Razor / C# · illustrative InteractiveServer lifecycle

```text
// Fields: string draft = "", message = ""; bool disposed;
// CancellationTokenSource? active;
async Task GenerateAsync()
{
    if (disposed || active is not null) return;
    using var requestCts = new CancellationTokenSource();
    active = requestCts;
    draft = "";
    try
    {
        await foreach (var part in Drafts.StreamAsync(message, requestCts.Token))
        {
            if (disposed || requestCts.IsCancellationRequested) break;
            draft += part;
            await InvokeAsync(StateHasChanged);
        }
    }
    catch (OperationCanceledException) when (requestCts.IsCancellationRequested)
    { /* Mark stopped only if the component is still alive. */ }
    finally { active = null; }
}
void Stop() => active?.Cancel();
public void Dispose() { disposed = true; active?.Cancel(); }
```

Contribution: You can assemble a reviewable SupportDesk draft with honest loading and stop behavior.

Next: Run the draft-replies lab in free sample mode, then inspect the optional server provider only if you choose to configure it.

Reference: [Microsoft Learn: Razor component disposal](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/component-disposal?view=aspnetcore-10.0)

## Later units — planned

### Reliable prompts and outputs

Turn generated text into a validated feature.

- Instructions and message roles
- Examples inside a prompt
- Supplying useful context
- Structured JSON and DTOs
- Validation and refusal handling
- Comparing prompt changes

Milestone: A validated ticket-summary feature

### Tools and safe actions

Give a model narrowly scoped application capabilities.

- A tool is a callable function
- Typed arguments
- Tool selection versus execution
- Authorization and approvals
- Retries and duplicate actions
- Audit trails and unknown results

Milestone: A reviewed ticket-lookup tool

### Vectors and semantic search

Find related help articles by meaning.

- Vectors as float arrays
- Similarity with a worked example
- What embeddings represent
- Creating and storing embeddings
- Vector indexes
- Filters and hybrid search

Milestone: Search across fictional help articles

### Answers grounded in documents

Build a RAG flow with inspectable evidence.

- Retrieval before generation
- Parsing and chunking
- Choosing useful evidence
- Prompting with retrieved passages
- Citations and unsupported answers
- Testing retrieval separately

Milestone: An answer with source passages

### Production retrieval

Improve retrieval without crossing data boundaries.

- Retrieval evaluation sets
- Ranking and reranking
- Freshness and indexing
- Document access and tenant filters
- Prompt injection in documents
- Tracing a bad answer

Milestone: A measured and permission-aware RAG service

### Agents and workflows

Choose controlled orchestration for multi-step work.

- A workflow versus an agent
- State and memory
- Bounded loops and budgets
- Microsoft Agent Framework
- MCP tools and resources
- Approvals and recovery

Milestone: A bounded support-triage workflow

### More inputs and model choices

Choose the right input and hosting approach.

- Images and OCR
- Speech and transcripts
- Combining input types
- Local model inference
- ONNX and quantization basics
- When fine-tuning is justified

Milestone: A reviewed attachment-processing feature

### Operate and deploy on Azure

Deploy, observe, and maintain the application.

- Identity and secrets
- Evaluation gates in CI
- Logging and tracing
- Latency, caching, and cost
- Azure deployment and rollback
- Capstone acceptance and failure drills

Milestone: An observable SupportDesk capstone
