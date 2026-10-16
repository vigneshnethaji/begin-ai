# AI for .NET developers — available lessons

14 complete lessons across 2 units. Open index.html for interactive exercises and the two desktop labs. Later units remain clearly marked Planned.

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

Next: Run the full classifier lab. The next planned unit introduces language models in C#.

Reference: [Microsoft Learn: Save and load trained models](https://learn.microsoft.com/en-us/dotnet/machine-learning/how-to-guides/save-load-machine-learning-models-ml-net)

## Later units — planned

### Language models in C#

Call a language model through a .NET service.

- Generated text and its limits
- Tokens and context limits
- A first provider call
- Server-side credentials
- Timeouts and cancellation
- Streaming a response into Blazor

Milestone: A draft reply with a sample-response mode

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
