/* Authored preview curriculum. Classic script also works when opened from disk. */
(function (root, factory) {
  const node = typeof module === 'object' && module.exports;
  const value = factory(node ? require('./mlnet-content.js') : root.AcademyMlnetContent, node ? require('./language-content.js') : root.AcademyLanguageContent, node ? require('./reliable-content.js') : root.AcademyReliableContent, node ? require('./tools-content.js') : root.AcademyToolsContent, node ? require('./advanced-catalog.js') : root.AcademyAdvanced);
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.AcademyContent = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (mlnet, language, reliable, tools, advanced) {
  'use strict';
  const references = {
    ...mlnet.references,
    ...language.references,
    ...reliable.references,
    ...tools.references,
    ...advanced.references,
    overview: { title: 'Microsoft Learn: AI in .NET', url: 'https://learn.microsoft.com/en-us/dotnet/ai/overview', note: 'Optional reading after this lesson. The course explains the terms you need here.' },
    ml: { title: 'Microsoft Learn: How ML.NET works', url: 'https://learn.microsoft.com/en-us/dotnet/machine-learning/how-does-mldotnet-work', note: 'See how data becomes a model and how a .NET application uses it. You do not need to run this guide yet.' },
    console: { title: 'Microsoft Learn: Create a .NET console app', url: 'https://learn.microsoft.com/en-us/dotnet/core/tutorials/with-visual-studio-code', note: 'Extra help with the console project used in our desktop lab.' }
  };
  const foundationLessons = [
    {
      id: 'ai-features', conceptId: 'ai-feature', title: 'What makes a feature an AI feature?', short: 'Recognize an AI feature', minutes: 8, prerequisites: [],
      objective: 'Tell the difference between code that follows a rule and a model that learns patterns.',
      summary: 'Start with a support inbox, not a new framework.',
      definition: ['AI', 'Software that uses models to recognize patterns or generate an output. In this course, we focus on models learned from examples.'],
      paragraphs: [
        'Imagine you are building SupportDesk, an ASP.NET Core application where customers ask for help. A message arrives: “I paid twice. Can you return one payment?” Your first feature is to send that message to the right team.',
        'You could write a C# rule: if the message contains “refund”, send it to Billing. You chose the word and wrote the decision yourself. That is ordinary application logic.',
        'Another approach uses a model: a reusable component that has learned patterns from examples. It could suggest Billing even when the customer never writes “refund”. This is where machine learning, a common approach to AI, can help.',
        'Your .NET application still receives the request, validates it, checks permissions, and saves the result. The model supplies one suggested answer inside that application. It does not replace the application.'
      ],
      takeaway: 'Ask how the decision is made. A page with a chat bubble is not automatically AI.',
      example: {
        title: 'One message. Two ways to route it.',
        input: 'I paid twice. Can you return one payment?',
        paths: [
          { title: 'A rule you wrote', detail: 'Contains “refund”? No.', result: 'General queue', tone: 'neutral' },
          { title: 'A learned model', detail: 'Recognizes a payment problem.', result: 'Billing suggestion', tone: 'accent' }
        ],
        explanation: 'The rule checks an exact condition. A model may recognize a similar meaning. Its answer can still be wrong, so a staff member can correct it. The model result shown here is an authored teaching example.'
      },
      experiment: 'sort-features',
      exercise: 'Choose which implementation uses a learned model. Notice that the technology behind the decision matters more than the appearance of the screen.',
      quiz: { question: 'Which feature uses a learned model?', options: [
        { text: 'An API rejects a request with an empty email address.', why: 'This is a condition a developer can specify exactly. Validation does not require a learned model.' },
        { text: 'A service suggests a support category using patterns learned from past messages.', why: 'Exactly. The decision uses patterns learned from examples, rather than only conditions you wrote.' },
        { text: 'A Blazor page displays a chat bubble.', why: 'A chat bubble is a UI element. It could display a fixed message, a human reply, or a model response.' }
      ], answer: 1 },
      dotnet: { title: 'Keep the application. Add a suggestion.', text: 'Think of the model as a dependency of your application service. The API handles HTTP; a service requests a suggestion; your code decides what happens next.', code: 'Customer message\n    ↓\nASP.NET Core endpoint → Validate request\n    ↓\nApplication service → Ask model for a suggestion\n    ↓\nBlazor inbox → Staff member reviews the category', label: 'Application flow · conceptual example', contribution: 'You can identify where a model might help the SupportDesk inbox.', next: 'Decide which responsibilities should stay ordinary C#.' },
      reference: 'overview'
    },
    {
      id: 'rules', conceptId: 'deterministic-rule', title: 'When ordinary C# rules are enough', short: 'Keep exact rules in C#', minutes: 10, prerequisites: ['ai-features'],
      objective: 'Choose an explicit C# rule when the requirement has an exact, testable answer.',
      summary: 'Reliable AI features begin with reliable ordinary code.',
      definition: ['Deterministic', 'Given the same input and relevant state, the code follows the same steps and produces the same result.'],
      paragraphs: [
        'SupportDesk must reject an empty message. You know precisely what “empty” means: null, no characters, or only spaces. You do not need examples of past messages to decide this.',
        'Write that requirement as ordinary C#. The result should be predictable and easy to test. Checking permissions, calculating totals, and enforcing a refund policy also belong in code with explicit rules.',
        'A keyword rule can be a useful first version of message routing. It is cheap and easy to explain. But “refund” and “return my payment” have different characters even though they may express the same request.',
        'Do not add AI because a rule has a limitation. First ask whether the limitation matters. A few categories with stable wording might need only a maintained rule. Many variations of natural language may justify a model.'
      ],
      takeaway: 'Use a model for ambiguity. Use explicit code for requirements that must be enforced exactly.',
      example: { title: 'An empty message has an exact answer.', input: 'Message: three spaces', paths: [
        { title: 'Your requirement', detail: 'A message must contain visible text.', result: 'Reject the request', tone: 'neutral' },
        { title: 'Your C# implementation', detail: 'string.IsNullOrWhiteSpace(message)', result: 'true', tone: 'accent' }
      ], explanation: 'There is nothing to predict. A unit test can prove this condition for empty strings, spaces, and real messages. A model would add uncertainty to an exact requirement.' },
      experiment: 'keyword',
      exercise: 'Change a message and the keyword. Watch which queue an exact rule chooses. Try “Please return my payment” with the keyword “refund”.',
      quiz: { question: 'Which responsibility should stay an explicit rule?', options: [
        { text: 'Guessing the subject of an unfamiliar customer message.', why: 'Unfamiliar wording can be ambiguous. A learned model might help here, with evaluation and review.' },
        { text: 'Writing a shorter version of a long conversation.', why: 'Many summaries are possible. This is a generation task, rather than a single exact condition.' },
        { text: 'Checking that the signed-in user is allowed to issue a refund.', why: 'Correct. Authorization is an enforceable application rule. A model suggestion must never bypass it.' }
      ], answer: 2 },
      dotnet: { title: 'Start with a baseline you can test.', text: 'A baseline is the simplest working approach you will compare a later model against. Our first desktop lab builds this routing rule as a console app. No AI account is needed.', code: 'static string Route(string message)\n{\n    if (string.IsNullOrWhiteSpace(message))\n        return "Rejected";\n\n    return message.Contains("refund",\n        StringComparison.OrdinalIgnoreCase)\n        ? "Billing"\n        : "General";\n}', label: 'C# · extract from the runnable lab', contribution: 'You establish input validation and a predictable routing baseline.', next: 'Learn what goes inside the model component.', lab: true },
      reference: 'console'
    },
    {
      id: 'models', conceptId: 'model', title: 'What a model does', short: 'Understand a model', minutes: 9, prerequisites: ['rules'],
      objective: 'Identify a model’s input, its output, and the application decisions outside its responsibility.',
      summary: 'A model is a component with an input and an output.',
      definition: ['Model', 'A reusable component containing learned patterns. Your application gives it input and receives a prediction or generated output.'],
      paragraphs: [
        'In C#, you already work with components through contracts. A tax service accepts an amount and returns a calculation. You can use the service without knowing every internal step.',
        'You can think about a model boundary in the same way. A support-category model accepts message text and returns a proposed label such as Billing, Account, or Technical. A label is simply a category name.',
        'The difference is how the model acquired its behavior. In machine learning, a training process learned patterns from data. The saved model contains that learned information. It is not a database of guaranteed answers.',
        'A model that returns Billing has not issued a refund or changed a database row. Your application still validates the response, applies authorization and business rules, and decides whether to show a suggestion or take a permitted action.'
      ],
      takeaway: 'A prediction is data coming back from a component. Your application owns its consequences.',
      example: { title: 'Give the model a small, clear job.', input: 'I cannot sign in after changing my password.', paths: [
        { title: 'Inside the model boundary', detail: 'Message text in; category out.', result: 'Account', tone: 'accent' },
        { title: 'Outside that boundary', detail: 'Application decides what to display.', result: 'Suggest Account to staff', tone: 'neutral' }
      ], explanation: 'The category is a fixed illustrative response here. A real integration would also handle errors, unsupported output, and slow responses. It would not send private account details without an appropriate reason.' },
      experiment: 'model-boundary',
      exercise: 'Choose a message and inspect the input, illustrative model output, and application responsibility. The examples do not run a real model.',
      quiz: { question: 'The model suggests Billing. What does that prove?', options: [
        { text: 'The application is authorized to issue a refund.', why: 'No. A category suggestion does not grant permission. Authorization must be checked by the application.' },
        { text: 'The model returned a category that the application must validate and handle.', why: 'Correct. Treat the response as input to your application, not as permission or a guaranteed fact.' },
        { text: 'The customer has definitely been charged twice.', why: 'No. Classifying a message does not verify transactions. That requires authoritative business data.' }
      ], answer: 1 },
      dotnet: { title: 'An interface makes the boundary visible.', text: 'This is an illustrative contract, not an implemented model. Later, a real ML.NET model or provider adapter can sit behind a service boundary. Cancellation and validation remain application concerns.', code: 'public record CategorySuggestion(string Category);\n\npublic interface IMessageClassifier\n{\n    Task<CategorySuggestion> SuggestAsync(\n        string message,\n        CancellationToken cancellationToken);\n}', label: 'C# · illustrative contract', contribution: 'You separate a category suggestion from saving or acting on a request.', next: 'Understand how the model gets its behavior before your API calls it.' },
      reference: 'ml'
    },
    {
      id: 'training', conceptId: 'training-vs-inference', title: 'Training and using a model are different', short: 'Training vs. using a model', minutes: 10, prerequisites: ['models'],
      objective: 'Distinguish learning from examples during training from producing a result during inference.',
      summary: 'The learning happens in one process. Your app uses the result in another.',
      definition: ['Inference', 'Using a trained model to produce an output for an input. It does not mean that the model is being retrained.'],
      paragraphs: [
        'Suppose you have past support messages with categories chosen by staff. Each pair is a labelled example: message text plus the category you want the model to learn to predict.',
        'Training is a separate process that uses examples to adjust a model’s learned patterns. After training, you save a model artifact: a file or other reusable representation of the learned model.',
        'Inference is using that saved model with a new message. Your ASP.NET Core service can ask it for a category without running the training process again for every HTTP request.',
        'Correcting a suggestion in the inbox does not automatically retrain a model. You could store that correction as reviewed data for a future training run. That feedback pipeline must be built deliberately. When using an existing provider model, your application commonly performs inference without training that model itself.'
      ],
      takeaway: 'Training changes learned patterns. Inference uses the current learned patterns.',
      example: { title: 'Two processes, connected by a saved model.', input: 'Past examples: “refund please” → Billing; “password reset” → Account', paths: [
        { title: 'Training process', detail: 'Learn from labelled past examples.', result: 'Saved category model', tone: 'neutral' },
        { title: 'Application request', detail: 'New message → saved model.', result: 'Category prediction', tone: 'accent' }
      ], explanation: 'Saving corrected categories can improve a later dataset, but the model changes only when an appropriate update process runs. Training and inference can happen on different machines and at different times.' },
      experiment: 'training-sort',
      exercise: 'Sort the actions into training, inference, or collecting feedback. Look for whether learned patterns are changing, being used, or merely being recorded.',
      quiz: { question: 'A user changes a suggested category. What happens to the model automatically?', options: [
        { text: 'Nothing necessarily changes; storing feedback and retraining require an implemented process.', why: 'Correct. A UI correction is not a training run. You need a deliberate process to collect, review, train, and evaluate updates.' },
        { text: 'The model immediately learns the correction forever.', why: 'A correction changes application data. It does not automatically change the model’s learned patterns.' },
        { text: 'Every later HTTP request must now retrain the model.', why: 'Training and inference are separate. Your service usually reuses a trained model for requests.' }
      ], answer: 0 },
      dotnet: { title: 'Separate the training tool from the web service.', text: 'Later in this course, an ML.NET console project trains a small classifier. Your application then loads the resulting model for inference. This outline describes responsibilities; it is not a runnable training sample yet.', code: 'SupportDesk.Training       // Console project\n  Read reviewed examples\n  Train and evaluate a model\n  Save model.zip\n\nSupportDesk.Api            // ASP.NET Core project\n  Load model.zip\n  Receive a new message\n  Return a category suggestion', label: 'Project responsibilities · conceptual outline', contribution: 'You know where training belongs and what a future feedback feature must do.', next: 'Check why a trained model can still make mistakes.' },
      reference: 'ml'
    },
    {
      id: 'predictions', conceptId: 'prediction-error', title: 'Why predictions can be wrong', short: 'Expect and measure mistakes', minutes: 12, prerequisites: ['training'],
      objective: 'Explain why a model prediction needs evaluation and an appropriate response to mistakes.',
      summary: 'A useful suggestion can still be an incorrect suggestion.',
      definition: ['Evaluation', 'Checking a model’s outputs against examples or criteria that tell you whether it is useful for your task.'],
      paragraphs: [
        'A support model learned from examples, not from every possible customer message. New wording, unclear requests, and patterns missing from training data can lead to a wrong category.',
        'Consider “My refund button crashes.” The word refund is about Billing, but the actual problem might be Technical. Even a person may need more context. The right design allows correction instead of treating the first suggestion as a fact.',
        'To evaluate a classifier, compare its predictions with reviewed categories on examples that were not used to train it. This helps reveal how it behaves on new data. Do not judge it only by examples it has already learned from.',
        'The cost of a mistake matters. A wrong inbox category might cause a short delay. An incorrect automatic refund changes money. Start with suggestions and human review; keep exact business rules in control of consequential actions.'
      ],
      takeaway: 'Measure errors on new examples, then design the application around their consequences.',
      example: { title: 'A plausible category can miss the actual problem.', input: 'My refund button crashes whenever I click it.', paths: [
        { title: 'Illustrative model output', detail: 'Focuses on the word “refund”.', result: 'Billing', tone: 'neutral' },
        { title: 'Reviewed category', detail: 'The customer reports a software failure.', result: 'Technical', tone: 'accent' }
      ], explanation: 'One failure does not make every model useless. It gives you a concrete case to include in evaluation and a reason to let staff change a suggestion.' },
      experiment: 'evaluate',
      exercise: 'Reveal five illustrative predictions, compare them with reviewed labels, and inspect the mistakes. These are authored examples, not a benchmark for a real model.',
      quiz: { question: 'How should you first evaluate your category model?', options: [
        { text: 'Run only the same messages used to train it.', why: 'That can hide poor behavior on new inputs. Keep reviewed examples separate for evaluation.' },
        { text: 'Accept every suggestion because the model has finished training.', why: 'Training produces a model, not a guarantee. New inputs and ambiguous messages can still cause errors.' },
        { text: 'Compare predictions with reviewed labels on held-out messages and inspect mistakes.', why: 'Correct. “Held-out” means set aside from training. Inspecting failures also tells you which safeguards the UI needs.' }
      ], answer: 2 },
      dotnet: { title: 'Keep suggestions editable.', text: 'Use separate fields for the model suggestion and the category accepted by staff. This makes the decision visible and preserves evidence for later evaluation. The record below is an illustrative data shape.', code: 'public record ReviewedCategory(\n    string SuggestedCategory,\n    string AcceptedCategory,\n    string ReviewedBy);\n\n// SuggestedCategory: "Billing"\n// AcceptedCategory:  "Technical"\n// ReviewedBy:        "demo-agent"', label: 'C# · illustrative review record', contribution: 'You plan a reviewable suggestion instead of an irreversible automatic decision.', next: 'Choose the smallest suitable approach for each feature.' },
      reference: 'ml'
    },
    {
      id: 'choose-approach', conceptId: 'approach-selection', title: 'Choose rules, machine learning, or an LLM', short: 'Choose the right approach', minutes: 12, prerequisites: ['predictions'],
      objective: 'Select a reasonable starting approach based on a feature’s output and need for exactness.',
      summary: 'Start with the requirement, then choose the tool.',
      definition: ['Large language model (LLM)', 'A model trained on large amounts of data to work with language and other supported inputs. It can generate text, such as a summary or a draft reply.'],
      paragraphs: [
        'You now have three useful starting points. Rules implement exact decisions you can specify. A traditional machine-learning classifier learns to choose a label from examples. A large language model can generate text and also perform tasks such as classification.',
        'For SupportDesk, message validation stays in C#. Category routing might start as a rule and later become a small ML.NET classifier when you have enough suitable labelled examples. Writing a draft reply is a language-generation task that may suit an LLM.',
        'These are starting choices, not rigid laws. An LLM can classify messages too, but cost, privacy, latency, data availability, and measured quality determine whether that is a better choice. A more capable model is not automatically a better application design.',
        'You can combine approaches: validate a request with rules, ask a model for a draft, and let a person approve it. A large language model is itself machine learning; we distinguish it here because building with an existing language model has different practical trade-offs from training a small classifier.'
      ],
      takeaway: 'Choose the simplest approach that meets the requirement and can be tested against it.',
      example: { title: 'Three jobs in the same application.', input: 'SupportDesk needs validation, routing, and draft replies.', paths: [
        { title: 'Exact requirement', detail: 'Reject an empty message.', result: 'C# rule', tone: 'neutral' },
        { title: 'Learn a category', detail: 'Route messages from reviewed examples.', result: 'Small classifier', tone: 'accent' },
        { title: 'Generate language', detail: 'Draft a reply for staff to review.', result: 'LLM', tone: 'accent' }
      ], explanation: 'The classifier choice assumes suitable labelled data and acceptable measured results. The LLM generates a proposal; staff review and application authorization still matter.' },
      experiment: 'choose',
      exercise: 'Choose a sensible first approach for three SupportDesk requirements. Read why each answer fits and where other approaches could make sense.',
      quiz: { question: 'Which design is the strongest starting point?', options: [
        { text: 'Use an LLM for validation, permission checks, and every other decision.', why: 'Exact validation and authorization belong in enforceable application code. A language model should not decide permissions.' },
        { text: 'Use rules for validation, evaluate a classifier for routing, and review LLM-generated drafts.', why: 'Correct. Each component has a clear job, and uncertain outputs get evaluation and review.' },
        { text: 'Never use models if an application already has C# services.', why: 'A model can be one component behind a service interface. Existing .NET architecture gives you a place to integrate it.' }
      ], answer: 1 },
      dotnet: { title: 'Your first project milestone is a decision, not a framework.', text: 'Write a short decision for each proposed feature: input, required output, simplest approach, failure consequence, and proof it works. Then run the rules-baseline lab. The next unit adds a first ML.NET classifier; later units introduce Blazor and provider integrations.', code: 'Feature: Reject an empty message\nInput: Customer message text\nOutput: Accept or reject\nApproach: C# validation rule\nFailure: An empty request enters the queue\nProof: Tests for empty, spaces, and valid text', label: 'Engineering decision · worked example', contribution: 'You can justify the first three capabilities in the SupportDesk roadmap.', next: 'Complete the desktop rules lab, then continue into labelled data and ML.NET.', lab: true },
      reference: 'overview'
    }
  ];
  const lessons = [...foundationLessons.map(x=>({...x,unitId:'foundations',labId:'rules-baseline'})),...mlnet.lessons,...language.lessons,...reliable.lessons,...tools.lessons,...advanced.lessons];
  const stages = [
    { id: 'foundations', title: 'Foundations', outcome: 'Explain where AI belongs in a .NET application.', topics: foundationLessons.map(x=>x.short), milestone: 'SupportDesk rules baseline', available: true },
    { id: 'first-mlnet-model', title: 'Data and your first ML.NET model', outcome: 'Train and evaluate a small category classifier.', topics: mlnet.lessons.map(x=>x.short), milestone: 'A measured message classifier', available: true },
    { id: 'language-models', title: 'Language models in C#', outcome: 'Build a reviewable draft reply through a .NET service.', topics: language.lessons.map(x=>x.short), milestone: 'A Blazor draft reply with free sample mode', available: true },
    { id: 'reliable-outputs', title: 'Reliable prompts and outputs', outcome: 'Validate a structured ticket summary in C# and review its meaning.', topics: reliable.lessons.map(x=>x.short), milestone: 'A validated ticket summary in Blazor', available: true },
    { id: 'tools-actions', title: 'Tools and safe actions', outcome: 'Review and authorize a narrowly scoped C# ticket lookup.', topics: tools.lessons.map(x=>x.short), milestone: 'A reviewed read-only ticket-lookup tool', available: true },
    ...advanced.stages,
  ];
  for(const stage of stages)stage.lessonIds=lessons.filter(x=>x.unitId===stage.id).map(x=>x.id);
  const labs=[
    {id:'rules-baseline',title:'C# rules baseline',url:'#lab',archive:'downloads/supportdesk-rules.zip'},
    {id:'mlnet-classifier',title:'ML.NET ticket classifier',url:'#lab/mlnet-classifier',archive:'downloads/supportdesk-classifier.zip'},
    {id:'draft-replies',title:'Blazor draft replies',url:'#lab/draft-replies',archive:'downloads/supportdesk-draft-replies.zip'},
    {id:'ticket-summary',title:'Validated ticket summary',url:'#lab/ticket-summary',archive:'downloads/supportdesk-ticket-summary.zip'},
    {id:'ticket-lookup',title:'Reviewed ticket lookup',url:'#lab/ticket-lookup',archive:'downloads/supportdesk-ticket-lookup.zip'},
    ...advanced.labs
  ];
  return { lessons, stages, references, labs, version: 1, labId: 'rules-baseline' };
});
