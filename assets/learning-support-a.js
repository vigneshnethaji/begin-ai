/* Authored companion practice for Units 1–5. No progress or grading side effects. */
(function (root, factory) {
  const value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.AcademySupportA = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Commands assume a PowerShell terminal at the repository root. Read-only
  // references need no runtime; runnable checks are optional learner activities.
  function source(lab, file, symbol, kind, task, expected, readOnly) {
    const path = 'labs/' + lab + '/' + file;
    return { path, symbol, kind, task, expected, command: readOnly
      ? 'Get-Content ' + path
      : 'dotnet run --project labs/' + lab + '/ -- --verify' };
  }
  const rules = (symbol, kind, task, expected, readOnly) =>
    source('supportdesk-rules', 'Program.cs', symbol, kind, task, expected, readOnly);
  const classifier = (file, symbol, kind, task, expected) =>
    source('supportdesk-classifier', file, symbol, kind, task, expected, false);
  const draft = (file, symbol, kind, task, expected, readOnly) =>
    source('supportdesk-draft-replies', file, symbol, kind, task, expected, readOnly);
  const summary = (file, symbol, kind, task, expected, readOnly) =>
    source('supportdesk-ticket-summary', file, symbol, kind, task, expected, readOnly);
  const lookup = (file, symbol, task, expected) =>
    source('supportdesk-ticket-lookup', file, symbol, 'Runnable C# read-only simulation', task, expected, false);

  const lessons = {
    'ai-features': {
      keywords: ['AI', 'artificial intelligence', 'learned patterns', 'rule', 'baseline'],
      prerequisites: [],
      source: rules('Route', 'Illustrative pattern backed by lab',
        'Inspect Route and classify its decision as an authored condition or a learned pattern. Explain whether adding a chat bubble would change that classification.',
        'Route checks whitespace and a refund substring. There is no fitted model or training data; changing the presentation would not make this rule AI.', true)
    },
    rules: {
      keywords: ['deterministic', 'validation', 'substring', 'C#', 'baseline'],
      prerequisites: ['ai-features'],
      source: rules('Route', 'Runnable C# rule',
        'Predict Route for "REFUND PLEASE", "Please return my payment", and three spaces before running the checks. Explain why related meanings do not guarantee the same route.',
        'The results are Billing, General, and Rejected respectively. The verifier checks those cases; case-insensitive substring matching handles letters, not meaning.')
    },
    models: {
      keywords: ['model', 'input', 'output', 'prediction', 'application boundary'],
      prerequisites: ['ai-features'],
      source: rules('Route', 'Illustrative pattern backed by lab',
        'Trace the string input and category output of Route. Write a hypothetical replacement contract for a category model, then mark authorization and refunds as application responsibilities.',
        'The real file returns a category string and performs no refund. A model boundary is a conceptual replacement here: this lab contains an explicit rule, not a learned model.', true)
    },
    training: {
      keywords: ['training', 'inference', 'fitting', 'learned parameters', 'saved model'],
      prerequisites: ['models'],
      source: rules('Route', 'Illustrative pattern backed by lab',
        'Inspect Route and predict whether calling it again can teach it a new synonym. Identify what is missing for training and describe what a later fitted classifier would reuse during inference.',
        'Repeated calls do not alter Route: this lab does not train anything. Training would fit learned parameters from examples; inference would reuse them for a new input.', true)
    },
    predictions: {
      keywords: ['prediction error', 'review', 'baseline limitation', 'evaluation', 'ground truth'],
      prerequisites: ['models', 'rules'],
      source: rules('Route', 'Illustrative pattern backed by lab',
        'Compare the General result for "Please return my payment" with a fictional reviewer who wants Billing. Explain the difference between implementing the specified rule correctly and meeting a routing need.',
        'General is correct for the implemented substring rule but can miss the reviewed intent. This is a rule limitation, not a measured model error rate; a future model also needs held-out evaluation.', true)
    },
    'choose-approach': {
      keywords: ['approach selection', 'rules', 'machine learning', 'LLM', 'tradeoffs'],
      prerequisites: ['rules', 'models', 'predictions'],
      source: rules('Route', 'Conceptual decision backed by lab',
        'Write three decisions beside Route: empty-message validation, ambiguous category suggestion, and a reply draft. For each, choose an approach and specify the evidence and review it would need.',
        'Keep empty checks in C#; consider an evaluated classifier for categories and a reviewed language model for drafts. The runnable milestone implements only the rules baseline.', true)
    },
    'data-examples': {
      keywords: ['dataset', 'training example', 'row', 'TSV', 'synthetic data'],
      prerequisites: ['training'],
      source: classifier('LabData.cs', 'SupportMessage', 'Runnable ML.NET data boundary',
        'Inspect SupportMessage and predict how the TSV row Billing<TAB>I was charged twice maps to its properties. Explain which value is available when a new unlabeled ticket arrives.',
        'Label is Billing and Text is the message. New requests supply Text; Label is a reviewed answer for learning or evaluation. The local verifier checks the bundled synthetic data.')
    },
    'input-features': {
      keywords: ['feature', 'input feature', 'text vector', 'data leakage', 'FeaturizeText'],
      prerequisites: ['models', 'data-examples'],
      source: classifier('SupportClassifier.cs', 'FeaturizeText', 'Runnable ML.NET pipeline',
        'Trace which property FeaturizeText reads. Predict why replacing SupportMessage.Text with a staff-only accepted category would make a misleading training input for new tickets.',
        'The real pipeline featurizes Text into Features. A future accepted category is unavailable at prediction time and leaks the answer; keep it outside the input features.')
    },
    'target-labels': {
      keywords: ['label', 'target', 'category', 'PredictedLabel', 'supervised learning'],
      prerequisites: ['data-examples', 'models'],
      source: classifier('LabData.cs', 'SupportPrediction', 'Runnable ML.NET data boundary',
        'Compare SupportMessage.Label with SupportPrediction.Category and inspect their mapping attributes. Predict whether General is one of the classifier training labels or only a rules fallback.',
        'Label is the reviewed answer; Category maps the PredictedLabel output. The model labels are Billing, Account, and Technical. General belongs to the original keyword baseline, not this classifier.')
    },
    'clean-examples': {
      keywords: ['data quality', 'duplicate', 'conflicting labels', 'normalization', 'validation'],
      prerequisites: ['data-examples', 'target-labels', 'rules'],
      source: classifier('LabData.cs', 'Parse', 'Runnable C# data validation',
        'Predict how Parse handles a missing header, a blank Text column, and label Payments. Then inspect ValidateSplit for normalized duplicates and explain why neither check proves every label is semantically right.',
        'Parse rejects the malformed rows and unknown label; ValidateSplit rejects repeated normalized text. Human review is still needed for plausible but incorrect labels and unrepresentative examples.')
    },
    'train-test-split': {
      keywords: ['held-out', 'test split', 'leakage', 'training vocabulary', 'evaluation'],
      prerequisites: ['training', 'data-examples', 'clean-examples'],
      source: classifier('LabData.cs', 'ValidateSplit', 'Runnable C# split guard',
        'Inspect ValidateSplit and predict what happens if a training message is copied to test.tsv with changed case and punctuation. Explain why improving a score by moving test rows into training invalidates the comparison.',
        'Normalization exposes that duplicate and the split guard rejects it. Held-out rows must stay unseen by fitting, including vocabulary fitting; passing this guard alone does not prove representative coverage.')
    },
    'mlnet-pipeline': {
      keywords: ['ML.NET', 'pipeline', 'MapValueToKey', 'FeaturizeText', 'Fit', 'multiclass'],
      prerequisites: ['input-features', 'target-labels', 'train-test-split'],
      source: classifier('SupportClassifier.cs', 'Train', 'Runnable ML.NET training',
        'Trace Train from train.tsv through label encoding, text features, SdcaMaximumEntropy, Fit, and saving. Predict whether test.tsv is allowed to enter Fit and locate the actual call that learns parameters.',
        'Fit uses only trainingData loaded from train.tsv. Label conversion and text preparation form the fitted pipeline; the verifier performs real local synthetic-data training and save/load checks, not a browser model simulation.')
    },
    'evaluate-model': {
      keywords: ['accuracy', 'denominator', 'held-out evaluation', 'wrong cases', 'baseline'],
      prerequisites: ['mlnet-pipeline', 'train-test-split', 'predictions'],
      source: classifier('SupportClassifier.cs', 'Evaluate', 'Runnable ML.NET evaluation',
        'Trace Evaluate and EvaluationReport.Print. Compare model and baseline errors on identical held-out messages; predict the accuracy of an authored tally of 7 correct from 10 and explain what that tally cannot establish.',
        'The authored arithmetic is 70%, not a claim about this lab run. The real report retains correct/total and wrong rows for both approaches; a tiny synthetic split cannot establish production quality or general superiority.')
    },
    'save-load': {
      keywords: ['serialization', 'saved model', 'inference', 'Load', 'PredictionEngine'],
      prerequisites: ['training', 'mlnet-pipeline', 'evaluate-model'],
      source: classifier('SupportClassifier.cs', 'Load', 'Runnable ML.NET inference',
        'Compare Train, Load, and Predict. Predict what Load does before the saved artifact exists, then inspect the verifier that compares predictions before and after reloading the same model.',
        'Load reports a missing-model error until training saves the artifact. Reusing a saved model does not refit it; the verifier checks categories and scores agree before and after reload without requiring a target accuracy.')
    },
    'generated-text': {
      keywords: ['LLM', 'large language model', 'generation', 'next token', 'variation', 'factual review'],
      prerequisites: ['models', 'choose-approach'],
      source: draft('Services/SampleDraftReplyService.cs', 'SampleDraftReplyService', 'Authored sample service',
        'Inspect the fixed chunks and predict whether two different fictional tickets will receive different sample replies. Compare this fixture with a language model producing a draft and mark claims that would require evidence.',
        'The sample emits the same fixed reply for every valid ticket; no model runs. The local checks verify deterministic chunks and cancellation. Actual generated wording may vary and still needs factual review.', false),
      microtopics: [
        {
          title: 'A draft grows by next-token prediction',
          text: 'Authored miniature example, not model output: after "Please check your", imagine next token candidates "invoice" and "settings". A language model scores possible next tokens from the current context, selects one, and repeats. A token can be a word piece; this example uses whole words only for readability.',
          task: 'Predict how adding "The ticket concerns a duplicate charge" could affect the continuation. Does choosing invoice prove a refund happened?',
          answer: 'Billing context can make invoice a more suitable continuation. A plausible next token supplies language, not evidence that an action occurred.'
        },
        {
          title: 'Repeated-run variation and facts are separate',
          text: 'Two clearly authored alternatives for one fictional ticket are "Could you share the charge dates?" and "Please tell us when the charges appeared." Sampling and runtime choices can produce repeated-run variation; repetition can also yield identical text. Neither wording is a measured result here. The sample service intentionally stays fixed.',
          task: 'Compare those drafts with "We refunded you today" when the ticket says only "I see two charges". Which difference needs correction?',
          answer: 'The first two ask for the same missing fact in different words. The refund sentence invents an action. Review factual support separately from style; repeatability alone cannot establish truth.'
        },
        {
          title: 'Text generation versus stream delivery',
          text: 'Authored delivery example: a service yields "Please ", then "share the dates." Joining them gives "Please share the dates." These string chunks are delivery fragments and need not match tokenizer boundaries. Streaming changes when a draft is displayed; it does not verify its claims or send it to a customer.',
          task: 'Predict the final text if the same reply arrives as one chunk. What can staff conclude if delivery stops after "Please "?',
          answer: 'One chunk gives the same final sentence. A stopped stream leaves a partial draft, not a completed or fact-checked reply; the UI must preserve that state.'
        }
      ]
    },
    'tokens-context': {
      keywords: ['token', 'tokens', 'context window', 'output budget', 'tokenization', 'history'],
      prerequisites: ['generated-text'],
      source: draft('Services/DraftLimits.cs', 'OutputTokens', 'Illustrative pattern backed by lab',
        'Compare OutputTokens with InputCharacters and OutputCharacters. Predict whether a 2000-character ticket is necessarily 2000 tokens, and explain why the output-token cap alone cannot prove a full request fits a model context window.',
        'Character limits and token budgets measure different things. OutputTokens caps requested output in the optional adapter; this sample has no tokenizer or live context measurement. Reserve room for instructions, ticket, history, and output.', true),
      microtopics: [
        {
          title: 'Tokens are pieces, not a character count',
          text: 'Authored pieces for teaching only: "refundable" might be shown as ["refund", "able"]. This is not an actual tokenizer result. Real splits depend on the model tokenizer, language, punctuation, and whitespace; neither word count nor character count is an exact token count.',
          task: 'Explain whether two strings with the same number of characters must use the same number of tokens.',
          answer: 'They need not. Use the selected model tokenizer or documented counting support for an exact input count; a rough estimate is only planning guidance.'
        },
        {
          title: 'Reserve the reply budget before adding history',
          text: 'Authored arithmetic, not a real model limit: a toy context budget is 1000 tokens. Instructions use 200, the ticket uses 300, and the reply reserves 250. History has at most 250 left before any extra framing overhead. Actual model accounting must include all required overhead and any other reserved tokens.',
          task: 'Predict whether adding 400 tokens of history fits this toy budget while keeping the 250-token reply reserve. What can you remove?',
          answer: '200 + 300 + 400 + 250 = 1150, so it does not fit even before overhead. Trim irrelevant history or reduce another justified allocation; do not silently discard essential instructions or evidence.'
        }
      ]
    },
    'first-provider-call': {
      keywords: ['service contract', 'HTTP', 'Responses API', 'StreamAsync', 'server adapter'],
      prerequisites: ['models', 'generated-text', 'tokens-context'],
      source: draft('Services/OpenAiDraftReplyService.cs', 'StreamAsync', 'Read-only optional HTTP adapter',
        'Trace StreamAsync from validation to HttpRequestMessage, response headers, text delta events, and explicit completion. Compare it with IDraftReplyService and identify which implementation runs in Sample mode. Read code only; make no provider request.',
        'This is an existing raw HTTP adapter, not an invented SDK method. Sample mode chooses SampleDraftReplyService. Inspecting the request shape and completion checks needs no credentials, network call, or model run.', true)
    },
    'server-credentials': {
      keywords: ['server configuration', 'credentials', 'dependency injection', 'Sample mode', 'browser boundary'],
      prerequisites: ['first-provider-call', 'rules'],
      source: draft('Program.cs', 'SampleDraftReplyService', 'Illustrative pattern backed by lab',
        'Inspect the Sample/OpenAI registration branches without inspecting environment values. Trace where the server selects IDraftReplyService and explain why a credential must never be placed in browser JavaScript or a prompt.',
        'The Sample branch registers SampleDraftReplyService; only the optional provider branch reads its named server settings. A server boundary keeps secrets out of delivered assets; configuration and permission remain application concerns.', true)
    },
    'timeouts-cancellation': {
      keywords: ['CancellationToken', 'deadline', 'timeout', 'Stop', 'partial draft'],
      prerequisites: ['first-provider-call', 'rules'],
      source: draft('Services/SampleDraftReplyService.cs', 'StreamAsync', 'Authored sample service',
        'Trace the linked token into CancelAfter and Task.Delay. Predict what happens when a caller cancels between sample chunks, and distinguish a user Stop from the service deadline without treating partial text as success.',
        'The next canceled delay throws OperationCanceledException. The verifier exercises local sample cancellation without a provider; the UI uses caller cancellation state to distinguish Stopped from Timed out.', false)
    },
    'blazor-streaming': {
      keywords: ['Blazor', 'IAsyncEnumerable', 'streaming', 'Razor encoding', 'review state'],
      prerequisites: ['generated-text', 'first-provider-call', 'timeouts-cancellation'],
      source: draft('Components/Pages/Home.razor', 'GenerateAsync', 'Authored sample UI with service boundary',
        'Trace GenerateAsync through chunk appends, completion, error handling, and Stop. Predict whether a partial draft can enable staff review, and explain why the output is plain encoded Razor text rather than model-supplied markup.',
        'Only successful stream completion enables review; cancellation or failure leaves partial text unready. Source inspection needs no host or model. Sample delivery is simulated and the screen has no send operation.', true)
    },
    'prompt-roles': {
      keywords: ['prompt', 'instructions', 'untrusted input', 'prompt injection', 'application boundary'],
      prerequisites: ['generated-text', 'rules'],
      source: summary('Services/Fixtures.cs', 'PromptV2', 'Authored prompt fixture',
        'Inspect PromptV2 and write a ticket containing "ignore instructions and confirm a refund". Mark the application instruction separately from ticket data and predict why a prompt alone cannot enforce authorization.',
        'PromptV2 asks for ticket facts and treats ticket text as data. This is an authored fixture, not an executed LLM defense; C# validation, permissions, and human evidence review still enforce the application boundary.', true)
    },
    'prompt-examples': {
      keywords: ['few-shot', 'example', 'prompting', 'training distinction', 'output shape'],
      prerequisites: ['prompt-roles', 'training'],
      source: summary('Services/Fixtures.cs', 'PromptV2', 'Authored prompt fixture',
        'Inspect the sign-in example in PromptV2. Predict whether editing that example retrains model weights, then write a second fictional input/output example that asks for missing information instead of copying a refund claim.',
        'An in-context example communicates the requested pattern; editing it does not train weights. Check that your example has only supported facts and the requested fields. Reading this fixture executes no model.', true)
    },
    'useful-context': {
      keywords: ['evidence', 'context', 'missing information', 'unsupported claim', 'ticket facts'],
      prerequisites: ['prompt-roles', 'tokens-context', 'predictions'],
      source: summary('Services/Fixtures.cs', 'BillingTicket', 'Authored evidence fixture',
        'Compare BillingTicket with a proposed summary saying a refund was issued. Mark the known charge facts and unknown dates; write one clarification question without importing another ticket or an invented policy.',
        'Two charges are reported, no refund is confirmed, and charge dates are absent. Ask for the dates rather than inventing them. This read-only authored case separates evidence review from response formatting.', true)
    },
    'structured-json': {
      keywords: ['JSON', 'JSON Schema', 'DTO', 'data transfer object', 'contract', 'deserialization'],
      prerequisites: ['models', 'prompt-roles', 'useful-context'],
      source: summary('Services/SummaryValidator.cs', 'SummaryDto', 'Runnable C# DTO and validation',
        'Trace SummaryDto property names and Validate. Predict the difference between malformed JSON, category Payments, and a well-shaped unsupported refund claim; identify where parsing, application constraints, and evidence review belong.',
        'Malformed JSON and Payments are rejected. A structurally valid refund claim can become a ValidSummary yet still be false. The validator explicitly checks fields before constructing the DTO; the type alone does not verify evidence.', false)
    },
    'validate-responses': {
      keywords: ['response state', 'refusal', 'incomplete', 'validation', 'factual review'],
      prerequisites: ['structured-json', 'useful-context', 'rules'],
      source: summary('Services/SummaryValidator.cs', 'Validate', 'Runnable C# response validation',
        'Predict Validate for a Refused response containing otherwise valid JSON, then for Completed JSON with an extra property. Explain why a completed, structurally valid result still needs review against the ticket.',
        'Refused is rejected before parsing; an extra property also fails validation. Completed plus valid shape permits a DTO, not automatic factual acceptance. The local verifier includes a well-shaped unsupported claim.', false)
    },
    'compare-prompts': {
      keywords: ['prompt version', 'shared rubric', 'regression', 'denominator', 'authored comparison'],
      prerequisites: ['prompt-examples', 'validate-responses', 'evaluate-model'],
      source: summary('Services/Fixtures.cs', 'PromptComparison', 'Authored comparison with C# rubric',
        'Trace PromptComparison.Evaluate over ReviewedCases. Compare both authored candidates for each same input under the same current rubric; identify a regression separately from an aggregate gain and keep each denominator visible.',
        'The comparison scores authored candidate fixtures, not a live model run or a production benchmark. Read the current cases and rubric for gains and regressions; no fixed score or claim that v2 wins every case is assumed.', false)
    },
    'tool-function': {
      keywords: ['tool', 'function', 'allowlist', 'lookup_ticket', 'read-only'],
      prerequisites: ['models', 'rules', 'structured-json'],
      source: lookup('Services/LookupExecutor.cs', 'LookupTicket',
        'Trace lookup_ticket from a parsed proposal to LookupTicket. Predict whether a proposal named delete_ticket can select another C# method, and identify which fictional fields this read-only function returns.',
        'Only the allowed lookup_ticket proposal reaches the private read-only lookup after app checks. It returns a redacted fictional view; arbitrary method names are rejected and no model or database is involved.')
    },
    'tool-arguments': {
      keywords: ['typed arguments', 'JSON', 'exact keys', 'canonical', 'argument validation'],
      prerequisites: ['structured-json', 'rules'],
      source: lookup('Services/ProposalParser.cs', 'Parse',
        'Predict Parse for lookup_ticket with ticketId DEMO-104, then with TicketId, DEMO-10, or an added approved:true. Inspect ExactKeys and explain why parsed arguments cannot carry caller authority.',
        'Only exact tool/arguments/ticketId keys and the DEMO- plus three ASCII digits format pass. Wrong casing, malformed IDs, and extra authority fields fail. Valid arguments alone grant no permission or approval.')
    },
    'tool-execution': {
      keywords: ['proposal', 'validation', 'approval', 'invocation', 'execution boundary'],
      prerequisites: ['tool-function', 'tool-arguments', 'validate-responses'],
      source: lookup('Services/LookupExecutor.cs', 'Invoke',
        'Trace Validate, Approve, and Invoke for a fresh DEMO-104 request as billing in Normal mode. Predict InvocationCount after review only and after invoking without approval; identify when the actual read can start.',
        'Validation and approval do not read the ticket. Invoking without exact approval returns ApprovalRequired with no read. After matching checks and approval, one read returns Success; a tool proposal is only input data.')
    },
    'tool-authorization': {
      keywords: ['authorization', 'approval snapshot', 'caller scope', 'team', 'existence leak'],
      prerequisites: ['rules', 'tool-arguments', 'tool-execution'],
      source: lookup('Services/LookupExecutor.cs', 'CheckRequest',
        'Compare DEMO-205 and nonexistent DEMO-999 for billing, then DEMO-104 for no-access. Trace where caller scope comes from and predict what changing the reviewed proposal must do to its prior approval.',
        'Wrong-team and missing tickets both return Unavailable for billing; no-access returns Denied. Server-owned demo identities supply scope, not JSON. A changed request invalidates review and approval; this is a local simulation, not production identity.')
    },
    'tool-retries': {
      keywords: ['retry', 'idempotency', 'request ID', 'replay', 'conflict', 'unknown outcome'],
      prerequisites: ['tool-execution', 'tool-authorization', 'timeouts-cancellation'],
      source: lookup('Services/LookupExecutor.cs', 'RunLocalFunction',
        'Predict attempts and reads for the Transient scenario versus Unknown. Trace replay with an unchanged, reapproved request ID. Then change an otherwise authorized snapshot using the same ID and explain why it conflicts. Also trace authorization before replay checks.',
        'Transient skips a simulated failure before any read and succeeds on attempt two with one read. Unknown is not retried. A matching approved replay returns the saved result. Authorization runs first: no-access returns Denied and out-of-scope returns Unavailable; an otherwise authorized changed snapshot returns Conflict. The cache is session-local, not durable exactly-once delivery.')
    },
    'tool-audit': {
      keywords: ['audit', 'minimal logging', 'unknown result', 'replay', 'reconciliation'],
      prerequisites: ['tool-retries', 'tool-authorization'],
      source: lookup('Services/LookupExecutor.cs', 'AuditEntry',
        'Inspect AuditEntry and Invoke. Predict which fields record a replay of Unknown, and compare that trace with logging the complete ticket body. Explain what the audit can establish and what remains unresolved.',
        'The trace records validated IDs, caller, outcome, attempts, Replay, and Unknown without raw ticket text. Replaying Unknown preserves the unresolved result without another lookup; an audit entry is evidence of a local attempt, not proof of a known response.')
    }
  };

  const units = {
    foundations: {
      scope: 'Use the runnable C# baseline to distinguish exact rules, learned suggestions, training, inference, and the application decisions around them. Model replacements in this unit are conceptual decisions. Review and challenge practice is self-assessed and awards no automatic mastery credit.',
      recap: [
        {
          question: 'Route returns General for "Please return my payment". The reviewer wanted Billing. What does this observation establish?',
          options: [
            { text: 'The rule can satisfy its code contract and still miss the routing requirement.', why: 'The substring check is implemented correctly, but the reviewed meaning is broader than that condition. This motivates measuring a possible replacement.' },
            { text: 'Calling Route repeatedly will teach it the missing synonym.', why: 'The authored condition has no fitting step or learned state. Repetition does not add a synonym to this function.' },
            { text: 'The observation proves a classifier will outperform the rule on new tickets.', why: 'One rule limitation provides no held-out classifier evidence. A candidate model can introduce its own errors.' }
          ], answer: 0
        },
        {
          question: 'A proposed category model returns Billing for a ticket requesting money back. Which next step fits the model boundary?',
          options: [
            { text: 'Issue the refund immediately because Billing is a valid category.', why: 'A category is a suggested label. It neither authorizes a payment action nor establishes eligibility under a refund policy.' },
            { text: 'Show the suggestion for review and retain authorization in application code.', why: 'The model supplies data; the application owns validation, permissions, and consequences. Review can correct an uncertain category.' },
            { text: 'Replace empty-message validation with the category model.', why: 'Whitespace rejection has an exact requirement. A learned category suggestion adds uncertainty to an enforceable validation rule.' }
          ], answer: 1
        },
        {
          question: 'A teammate adds a Blazor chat bubble around the unchanged Route function and says the feature now learns. How should you assess it?',
          options: [
            { text: 'A conversational interface demonstrates that training has occurred.', why: 'The interface reveals how output is displayed, not how the underlying decision was acquired.' },
            { text: 'A fixed category output cannot ever come from a learned model.', why: 'A classifier can return a category label. The relevant distinction is learned behavior versus an authored condition, not output length.' },
            { text: 'Inspect the decision mechanism; Route still follows an authored condition.', why: 'There is no training or saved learned state in this file. Changing the UI does not change the decision mechanism.' }
          ], answer: 2
        }
      ],
      challenge: {
        task: 'In a separate learner copy of the rules lab, predict Route for three spaces, REFUND PLEASE, and Please return my payment. Extend the exact rule to recognize the literal phrase "return my payment" case-insensitively, update the existing verifier expectation for that phrase, and add a different phrase that must still fall back to General. Explain the remaining limitation.',
        checks: [
          'Whitespace remains Rejected and REFUND PLEASE remains Billing.',
          'The exact added phrase and its uppercase variant return Billing; unrelated wording still returns General.',
          'Update the old related-wording expectation deliberately and add verification cases rather than weakening whitespace checks.',
          'Explain that manually adding a phrase is rule maintenance, not training or proof of semantic understanding.'
        ],
        solution: 'Keep the whitespace guard first. Return Billing when message.Contains("refund", StringComparison.OrdinalIgnoreCase) OR message.Contains("return my payment", StringComparison.OrdinalIgnoreCase); otherwise return General. The original verifier expects General for the phrase, so change that expectation to Billing and add uppercase and unrelated cases. A phrase such as "reverse the charge" can still fall through: the extension is deterministic and narrow. Run the edited verifier in your learner copy and inspect each named case; successful checks do not certify a model or understanding.',
        command: 'dotnet run --project labs/supportdesk-rules/ -- --verify'
      }
    },
    'first-mlnet-model': {
      scope: 'Train, save, reload, and evaluate an actual ML.NET classifier on fictional TSV data. Keep labels, features, and held-out rows distinct; compare with the original deterministic rule. Tiny synthetic results and self-assessed practice are learning evidence, not a production benchmark or automatic mastery award.',
      recap: [
        {
          question: 'The held-out score rose after a developer appended test.tsv to the training rows before Fit. What should the reviewer request?',
          options: [
            { text: 'Ship the model because the same test now has a higher score.', why: 'The test answers have entered fitting. The result no longer estimates behavior on examples held out from that fitting process.' },
            { text: 'Restore separation, fit only training rows, and evaluate unchanged held-out data.', why: 'Vocabulary preparation and classifier fitting must use training data only. Inspect per-case errors after rebuilding the comparison.' },
            { text: 'Keep the rows combined but hide the correct-count denominator.', why: 'Hiding the denominator neither repairs leakage nor makes a small synthetic result representative.' }
          ], answer: 1
        },
        {
          question: 'SupportMessage has Label and Text. A new unreviewed ticket arrives with only its message. Which input/output interpretation is correct?',
          options: [
            { text: 'Supply the accepted category as an input feature to make prediction easier.', why: 'An accepted category is a future reviewed answer, unavailable when routing a new ticket. Using it leaks the answer.' },
            { text: 'Treat the largest score as permission to perform a refund.', why: 'Classifier scores describe model outputs, not permissions or policy eligibility. Application rules still own actions.' },
            { text: 'Supply Text and treat the predicted Category as a suggestion to evaluate.', why: 'Text is available on arrival; reviewed Label values teach or evaluate the classifier. A predicted category remains fallible data.' }
          ], answer: 2
        },
        {
          question: 'A fresh checkout has no saved model artifact. A learner calls Load before Train and receives a missing-model error. What repairs the workflow?',
          options: [
            { text: 'Train on the supplied training split, then load and evaluate on test.tsv.', why: 'Train fits and saves the model. Load reuses that artifact; evaluation applies it without fitting the held-out messages.' },
            { text: 'Train inside every Predict call using the incoming ticket as its label.', why: 'A new ticket does not carry a reviewed answer. Retraining per request also confuses inference with fitting.' },
            { text: 'Create an empty ZIP with the expected filename so Load can proceed.', why: 'The loader requires a real serialized fitted pipeline, not merely a path or an empty archive.' }
          ], answer: 0
        }
      ],
      challenge: {
        task: 'Review this proposed change in a learner copy: Train loads test.tsv, Evaluate uses train.tsv, and the report prints only the model correct count. Repair the split usage and reporting. Then predict what ValidateSplit will do when a training sentence is duplicated into test data with punctuation and case changes. Preserve the rule baseline and inspect an actual wrong case if one occurs.',
        checks: [
          'Only train.tsv enters Fit, including fitted text vocabulary; evaluate the saved model against test.tsv.',
          'Keep correct/total counts and wrong-case inspection for model and unchanged keyword baseline.',
          'ValidateSplit rejects the normalized duplicate; restore the original separated rows afterward in the learner copy.',
          'Compare predictions and scores before and after reload without adding a target accuracy threshold.'
        ],
        solution: 'Use LabData.Load("train.tsv") in Train and LabData.Load("test.tsv") for evaluation. Keep the pipeline preparation inside fitting on trainingData; Evaluate calls Transform using the fitted model. Preserve EvaluationReport.Print so both approaches share rows and denominators. ValidateSplit normalizes letters and numbers, so punctuation and case changes cannot disguise copied text. The local --verify runner trains, checks leakage guards and save/load consistency, and prints mistakes. Report the measured synthetic split result, including a perfect result if observed, without extrapolating to production.',
        command: 'dotnet run --project labs/supportdesk-classifier/ -- --verify'
      }
    },
    'language-models': {
      scope: 'Read the service contract and optional server HTTP adapter; practice delivery and cancellation with fixed authored sample replies. Token prediction and budget arithmetic examples are authored explanations, not model measurements. Use explicit Sample mode for manual UI work; no provider call or automatic mastery credit is required.',
      recap: [
        {
          question: 'Two different tickets receive the same reply in SampleDraftReplyService. A teammate concludes the language model is deterministic. What is the supported conclusion?',
          options: [
            { text: 'All language models always return identical text for different tickets.', why: 'The fixture does not run a language model. Its behavior cannot establish properties of any provider or model configuration.' },
            { text: 'The stream failed because every ticket should produce a different result.', why: 'The sample deliberately yields fixed chunks. Identical output is expected here; a real model may also repeat output in some circumstances.' },
            { text: 'The authored sample is fixed; it measures delivery behavior rather than generation quality.', why: 'Inspecting the chunks explains the repetition. Model variation and factual correctness require separate evidence.' }
          ], answer: 2
        },
        {
          question: 'In an authored 1000-token toy budget, instructions use 200, ticket text 300, history 400, and the reply reserve 250. What is the best repair?',
          options: [
            { text: 'Trim at least 150 history tokens, then account for any additional framing overhead.', why: 'The allocations total 1150 before overhead. Preserve required instructions and reply space while reducing irrelevant context; real token accounting depends on the chosen model.' },
            { text: 'Treat character counts as exact token counts and leave the request unchanged.', why: 'Characters and tokens are different units. The arithmetic already exceeds the toy budget, and a character limit does not repair that.' },
            { text: 'Stream the answer so the input can exceed the context window.', why: 'Streaming changes delivery timing. It does not increase the model context capacity or eliminate the output reserve.' }
          ], answer: 0
        },
        {
          question: 'The sample UI has displayed two chunks when Stop is pressed. Which state should GenerateAsync expose for staff review?',
          options: [
            { text: 'Enable review because readable partial text proves the request completed.', why: 'Readable text is insufficient. Cancellation leaves an incomplete draft and cannot satisfy the successful completion path.' },
            { text: 'Keep partial text unready for review and distinguish Stop from a service timeout.', why: 'The caller token signals user cancellation; the linked service deadline can time out separately. Neither path proves factual accuracy or completion.' },
            { text: 'Retry automatically with a live provider so the reply will finish.', why: 'The sample does not authorize another request or a provider switch. Restart is an explicit learner choice, and provider use has separate configuration.' }
          ], answer: 1
        }
      ],
      challenge: {
        task: 'Inspect a hypothetical repair where GenerateAsync enables complete=true after every chunk and removes generation.Token from StreamAsync. Explain both defects, then in a learner copy keep review disabled until normal completion and restore cancellation propagation. Use only the explicit Sample setting for manual UI practice; compare a completed draft with one stopped midstream and one invalid empty ticket.',
        checks: [
          'Pass the caller cancellation token to StreamAsync and retain the cancellation check after the stream.',
          'Set complete only after successful completion; a stopped, failed, or timed-out draft remains unready.',
          'Display plain encoded text and leave the review acknowledgement separate from generation completion.',
          'Run the local verifier without credentials; manual startup must explicitly set DRAFT_REPLY_PROVIDER to Sample.'
        ],
        solution: 'The service returns IAsyncEnumerable<string>, so each yield is a fragment, not completion. Keep complete=false while iterating; append chunks and refresh the UI. Pass generation.Token to Drafts.StreamAsync, check cancellation after iteration, then set complete=true. On OperationCanceledException leave complete false and choose the status from the caller cancellation state. The existing sample verifier checks fixed chunks, input bounds and cancellation locally; inspect the Razor path as well because those service checks do not establish UI correctness. For optional manual UI practice in a learner copy, set $env:DRAFT_REPLY_PROVIDER = \'Sample\' before dotnet run. Nothing in this lab sends a reply.',
        command: 'dotnet run --project labs/supportdesk-draft-replies/ -- --verify'
      }
    },
    'reliable-outputs': {
      scope: 'Inspect authored prompt and response fixtures, validate response states and typed summary constraints, then review factual support. Comparisons score supplied candidates on shared cases, not live generation. Retain denominators and inspect regressions; scenario answers and local checks do not award automatic mastery.',
      recap: [
        {
          question: 'Completed JSON has every required field and category Billing, but says a refund was issued when the ticket confirms none. What should happen?',
          options: [
            { text: 'Accept the claim because SummaryDto successfully represents it.', why: 'A DTO represents values. Neither the type nor successful shape validation proves that a claimed action occurred.' },
            { text: 'Replace the schema with a longer prompt and skip all C# validation.', why: 'A prompt communicates a request; it does not enforce response state, exact keys, allowed categories, or evidence requirements.' },
            { text: 'Record valid shape separately and reject the unsupported claim during evidence review.', why: 'The local validator can accept that shape. Comparing the claim with the original ticket exposes the factual error before acceptance.' }
          ], answer: 2
        },
        {
          question: 'A Refused sample contains text that happens to parse as a valid summary object. Which operation should the validator perform first?',
          options: [
            { text: 'Reject the response state before parsing a usable DTO.', why: 'Only Completed is eligible for summary validation. A refusal or partial response cannot be promoted by parseable content.' },
            { text: 'Ignore the state because syntactically valid JSON is sufficient.', why: 'JSON syntax only describes formatting. It does not change refusal, incomplete, or failed response states into completed work.' },
            { text: 'Treat any parsed category as permission to perform a tool action.', why: 'A summary category carries no action authority. Tool invocation needs its own deterministic validation and approval boundary.' }
          ], answer: 0
        },
        {
          question: 'An authored prompt v2 improves total shape passes but changes one previously correct category to a wrong one. How should the comparison be reported?',
          options: [
            { text: 'Hide the changed case because the total score improved.', why: 'Aggregate gains can hide regressions. Removing an inconvenient case also changes the comparison and conceals a failure mode.' },
            { text: 'Keep both candidates on the same cases, show denominators, and identify the category regression.', why: 'A shared rubric permits a fair authored comparison. Per-case regressions remain relevant even when aggregate results improve; this is not a live benchmark.' },
            { text: 'Describe the authored totals as proof that v2 will outperform every real model run.', why: 'These are supplied candidates, not generated measurements across model configurations and representative data.' }
          ], answer: 1
        }
      ],
      challenge: {
        task: 'Independently review an authored candidate for BillingTicket: {"title":"Two charges","category":"Payments","facts":["A full refund has been issued."],"missingInformation":[]}. Predict the validator result, then repair both the contract and factual content. Compare your repair with the original ticket, preserve unknown charge dates as a question, and explain why editing PromptV2 would not train a model.',
        checks: [
          'Use the exact allowed Billing category and the four required lowercase property names.',
          'Include only ticket-supported facts; do not turn an unconfirmed refund into an action.',
          'Ask for the absent charge dates in missingInformation instead of guessing them.',
          'Keep response state and schema checks separate from evidence review and from authored comparison scores.'
        ],
        solution: 'The initial candidate fails the allowed-category check even though it parses. Changing Payments to Billing repairs that constraint but leaves an unsupported refund claim. A suitable authored repair is {"title":"Two charges reported","category":"Billing","facts":["Two charges reported for DEMO-104.","No refund is confirmed."],"missingInformation":["What are the charge dates?"]}. Check it as a Completed sample and review every fact against BillingTicket. PromptV2 is an instruction/example fixture; editing it changes no model weights. Inspect current PromptComparison behavior without relying on fixed totals or assuming v2 has no regressions.',
        command: 'dotnet run --project labs/supportdesk-ticket-summary/ -- --verify'
      }
    },
    'tools-actions': {
      scope: 'Practice an allowlisted read-only fictional lookup with exact typed arguments, server-owned demo scope, explicit approval, bounded retry, replay, and minimal audit. This local in-memory simulation runs no LLM, database, or live MCP transport; it provides no durable exactly-once guarantee or automatic mastery credit.',
      recap: [
        {
          question: 'A proposal includes lookup_ticket, ticketId DEMO-104, and an extra approved:true property. What is the correct treatment?',
          options: [
            { text: 'Accept the approval because the proposal is valid JSON.', why: 'JSON syntax does not confer authority. The parser uses exact allowed keys and rejects extra approval fields.' },
            { text: 'Reject the extra field and obtain scope and approval through application checks.', why: 'Typed arguments select data, not permissions. The demo resolves scope server-side and binds explicit approval to the exact reviewed request.' },
            { text: 'Execute first, then validate so the UI can display a faster answer.', why: 'Executing before deterministic checks reverses the boundary and can expose information before authorization.' }
          ], answer: 1
        },
        {
          question: 'Billing staff review DEMO-104, then change the editor to DEMO-205 before invoking. What should the old approval allow?',
          options: [
            { text: 'Nothing for the changed proposal; invalidate review and enforce scope again.', why: 'Approval binds request, canonical arguments, identity, and scenario. The new ticket is outside billing scope and cannot reuse the prior approval.' },
            { text: 'Any lookup_ticket request because the function name was already approved.', why: 'Approving a function in general does not approve new arguments. Scope and exact request identity remain essential.' },
            { text: 'A one-time bypass if the model says the new ticket is related.', why: 'A model assertion is untrusted input, not caller authority or a replacement for deterministic scope checks.' }
          ], answer: 0
        },
        {
          question: 'Unknown simulates a lost response after one local read. The same approved request is replayed. Which outcome is supported?',
          options: [
            { text: 'Automatically retry until a Success response is observed.', why: 'Unknown is not the known pre-read transient failure. Blind retry could duplicate work in other systems and erases uncertainty.' },
            { text: 'Convert Unknown to Success because an audit entry exists.', why: 'An audit records an attempt and outcome state; its existence does not recover an unavailable response or establish success.' },
            { text: 'Return the saved Unknown with Replay=true and perform no additional lookup.', why: 'The session cache preserves the unresolved outcome for the matching approved request. Reconciliation is separate; the cache is not a durable production guarantee.' }
          ], answer: 2
        }
      ],
      challenge: {
        task: 'Trace these independent requests on paper before checking the local lab: a fresh billing DEMO-104 request invoked without approval; a reviewed and approved normal request; an Unknown request followed by matching approved replay; and a reused request ID with changed arguments. Repair a proposed policy that retries every non-Success result and logs the raw ticket body.',
        checks: [
          'Without exact approval there is no read; a matching approved Normal request can read once.',
          'Only the explicit known pre-read Transient simulation is retried, with a maximum of two attempts.',
          'Unknown remains Unknown on approved replay without an extra read; an otherwise authorized changed snapshot under the same ID conflicts. Authorization errors are checked first.',
          'Retain minimal validated audit identifiers, state, attempts and replay markers; exclude raw customer text and secrets.',
          'Do not claim this in-memory session cache supplies durable idempotency or production authentication.'
        ],
        solution: 'Keep CheckRequest and exact snapshot approval before RunLocalFunction. A new unapproved request returns ApprovalRequired. A valid approved Normal request returns Success after one read. Unknown reads once and stores an unresolved result; a matching approved replay uses that saved result with Replay=true. CheckRequest runs before duplicate detection: changing to no-access identity returns Denied, and requesting a ticket outside the allowed scope returns Unavailable. If the changed proposal, identity or scenario is otherwise authorized, reusing an existing ID for that different snapshot returns Conflict; changing only the scenario for a permitted DEMO-104 request is one example. Preserve the retry branch only for Transient attempt one, where no read occurred; do not retry Denied, Unavailable, or Unknown. Audit validated IDs and outcome metadata through AuditEntry rather than ticket bodies. The local verifier exercises these simulated boundaries; it does not establish a production identity or durability guarantee.',
        command: 'dotnet run --project labs/supportdesk-ticket-lookup/ -- --verify'
      }
    }
  };

  const glossary = [
    { term: 'Artificial intelligence', definition: 'Software using models to recognize patterns or generate output. In this course, an AI feature contains a learned model rather than only authored conditions.', lessonIds: ['ai-features', 'choose-approach'], aliases: ['AI'] },
    { term: 'Machine learning', definition: 'An approach in which a training process learns useful patterns from examples and stores them in a model for later predictions. An LLM is also a machine-learning model.', lessonIds: ['models', 'training', 'choose-approach'], aliases: ['ML', 'basic ML'] },
    { term: 'Model', definition: 'A component containing learned patterns that maps an input to a prediction or generated output. Its result is data, not authority to perform application actions.', lessonIds: ['models', 'predictions'], aliases: ['learned model'] },
    { term: 'Deterministic rule', definition: 'An explicit condition written by a developer that gives the same result for the same input and relevant state. Repeated calls do not teach it new patterns.', lessonIds: ['rules', 'ai-features'], aliases: ['rule', 'C# rule', 'deterministic'] },
    { term: 'Baseline', definition: 'A simple reference approach evaluated alongside a candidate on the same cases. Here the original refund substring rule supplies the comparison; it is not a learned classifier.', lessonIds: ['rules', 'evaluate-model'], aliases: ['keyword baseline'] },
    { term: 'Training', definition: 'Fitting a model to examples to acquire learned parameters, including fitted input preparation. This differs from applying the fitted model to a new message.', lessonIds: ['training', 'mlnet-pipeline'], aliases: ['fitting', 'Fit'] },
    { term: 'Inference', definition: 'Using an already fitted model to produce an output for an input. Loading a saved classifier and predicting a category does not retrain it.', lessonIds: ['training', 'save-load'], aliases: ['prediction time', 'model inference'] },
    { term: 'Dataset', definition: 'A collection of examples used for a stated purpose such as training or evaluation. Each classifier row pairs reviewed Label with message Text; the supplied rows are fictional.', lessonIds: ['data-examples', 'clean-examples'], aliases: ['data set', 'training example'] },
    { term: 'Feature', definition: 'An input signal the model can use when predicting. The text pipeline turns message Text into numeric Features; a future accepted answer must not leak into those inputs.', lessonIds: ['input-features', 'mlnet-pipeline'], aliases: ['features', 'input feature'] },
    { term: 'Label', definition: 'The reviewed target answer paired with a training or evaluation example. A predicted category is the model output and may differ from that answer.', lessonIds: ['target-labels', 'data-examples'], aliases: ['labels', 'target label', 'ground truth'] },
    { term: 'Classifier', definition: 'A model that chooses a category from a defined set. The supplied ML.NET classifier predicts Billing, Account, or Technical and does not authorize any business action.', lessonIds: ['target-labels', 'mlnet-pipeline'], aliases: ['classification', 'multiclass classifier'] },
    { term: 'Held-out test split', definition: 'Examples reserved from all fitting, including text vocabulary fitting, to inspect later predictions. A small separated split still may not represent real deployment inputs.', lessonIds: ['train-test-split', 'evaluate-model'], aliases: ['held-out', 'test split', 'test dataset'] },
    { term: 'Data leakage', definition: 'Information enters learning or input features that would not legitimately be available for a new prediction. Reusing held-out answers during fitting invalidates that evaluation.', lessonIds: ['input-features', 'train-test-split'], aliases: ['leakage', 'train-test leakage'] },
    { term: 'Accuracy', definition: 'The count of correct predictions divided by the number evaluated under a defined answer rubric. Always retain the denominator and inspect failures; it does not alone establish application safety.', lessonIds: ['evaluate-model', 'predictions'], aliases: ['correct rate', 'evaluation accuracy'] },
    { term: 'ML.NET pipeline', definition: 'A sequence of .NET data transformations and a trainer that fits a reusable model. This lab encodes labels, featurizes text, trains a classifier, and converts predicted labels back to names.', lessonIds: ['mlnet-pipeline', 'save-load'], aliases: ['ML.NET', 'pipeline'] },
    { term: 'Large language model (LLM)', definition: 'A model trained on large amounts of data to process and generate language and other supported inputs. Text generation predicts successive tokens from context; plausible language is not verified evidence.', lessonIds: ['generated-text', 'choose-approach', 'tokens-context'], aliases: ['LLM', 'LLMs', 'large language model', 'large language models', 'language model'] },
    { term: 'Prompt', definition: 'The instructions, examples, and supplied context used to request a model output. Ticket data remains untrusted; a prompt is not a permission check or a guarantee that facts are true.', lessonIds: ['prompt-roles', 'prompt-examples'], aliases: ['prompting', 'instructions'] },
    { term: 'Token', definition: 'A unit of text handled by a model tokenizer, often a word piece, punctuation, or whitespace fragment. Token counts depend on the tokenizer and are distinct from characters and delivery chunks.', lessonIds: ['tokens-context', 'generated-text'], aliases: ['tokens', 'tokenization', 'subword'] },
    { term: 'Context window', definition: 'The model-specific capacity used by the request and reserved output under its accounting rules. Plan instructions, ticket, history, framing overhead and reply space together rather than counting only the message.', lessonIds: ['tokens-context', 'useful-context'], aliases: ['context', 'token budget', 'output budget'] },
    { term: 'Sampling', definition: 'Selecting among model-scored next-token alternatives under a decoding configuration. Repeated wording can vary or repeat; neither diversity nor repeatability establishes factual correctness.', lessonIds: ['generated-text'], aliases: ['next-token prediction', 'variation', 'decoding'] },
    { term: 'Authored fixture', definition: 'A deliberately supplied input, output, or scenario for teaching and verification. The fixed draft sample and summary comparison candidates do not measure a live language model.', lessonIds: ['generated-text', 'compare-prompts'], aliases: ['sample mode', 'simulation', 'authored sample'] },
    { term: 'Streaming', definition: 'Delivering an output in fragments as they become available. Fragments need not align with tokenizer boundaries, and visible partial text is neither completed work nor verified fact.', lessonIds: ['blazor-streaming', 'generated-text'], aliases: ['stream', 'chunks', 'delivery fragments'] },
    { term: 'Cancellation', definition: 'An application signal asking ongoing work to stop. The caller Stop token and a service deadline can both end a stream; the UI should preserve the incomplete state and distinguish their causes.', lessonIds: ['timeouts-cancellation', 'blazor-streaming'], aliases: ['CancellationToken', 'timeout', 'deadline'] },
    { term: 'Service contract', definition: 'The explicit input/output boundary implemented by interchangeable application services. IDraftReplyService exposes a cancellable text stream; one implementation supplies authored samples and another is an optional HTTP adapter.', lessonIds: ['models', 'first-provider-call'], aliases: ['interface', 'IDraftReplyService', 'adapter'] },
    { term: 'DTO', definition: 'A data transfer object: a typed representation of values crossing a boundary. SummaryDto holds validated summary fields, but representing a string does not verify the truth of its claims.', lessonIds: ['structured-json', 'validate-responses'], aliases: ['data transfer object', 'data transfer objects', 'SummaryDto'] },
    { term: 'JSON Schema', definition: 'A vocabulary for describing JSON structure and constraints. The summary task requests an exact shape, and the lab separately checks that shape in C#; schema validity does not establish factual support.', lessonIds: ['structured-json', 'validate-responses'], aliases: ['schema', 'structured JSON', 'JSON'] },
    { term: 'Few-shot example', definition: 'A reviewed example placed in a prompt to illustrate a desired input/output pattern. It guides the current request without updating model weights or proving the next output is correct.', lessonIds: ['prompt-examples', 'training'], aliases: ['few-shot', 'in-context example', 'in-context learning'] },
    { term: 'Factual grounding', definition: 'Checking output claims against the supplied evidence and retaining unknown details as unknown. A well-shaped summary can still invent a refund that the original ticket does not confirm.', lessonIds: ['useful-context', 'validate-responses'], aliases: ['evidence review', 'unsupported claim', 'hallucination'] },
    { term: 'Regression', definition: 'A previously acceptable case becomes worse after a change. Inspect the same inputs and rubric for each version rather than allowing aggregate gains to hide an individual failure.', lessonIds: ['compare-prompts', 'evaluate-model'], aliases: ['prompt regression', 'shared rubric'] },
    { term: 'Tool proposal', definition: 'Data requesting a named application function with arguments. A proposal is not execution; deterministic parsing, caller permission, review, and explicit approval precede the local lookup.', lessonIds: ['tool-function', 'tool-execution'], aliases: ['tool', 'function calling', 'lookup_ticket'] },
    { term: 'Authorization', definition: 'Application enforcement of whether the caller may access a resource or action. The lab uses server-owned fictional scopes; proposal JSON and model text cannot grant permissions.', lessonIds: ['tool-authorization', 'rules'], aliases: ['permission', 'caller scope'] },
    { term: 'Approval snapshot', definition: 'The exact request, canonical arguments, identity and scenario reviewed and explicitly approved before invocation. Changing any reviewed input invalidates prior approval in the simulation.', lessonIds: ['tool-authorization', 'tool-execution'], aliases: ['approval', 'canonical arguments'] },
    { term: 'Idempotency', definition: 'Designing repeated requests to avoid repeating an effect under a defined scope. This lab demonstrates a session cache and request conflicts, not durable exactly-once execution across failures.', lessonIds: ['tool-retries', 'tool-audit'], aliases: ['replay', 'duplicate request', 'request ID'] },
    { term: 'Unknown outcome', definition: 'The operation response cannot be confirmed. The local Unknown scenario simulates a lost response after a read; replay preserves uncertainty and does not justify an automatic new lookup.', lessonIds: ['tool-retries', 'tool-audit'], aliases: ['unknown result', 'reconciliation'] },
    { term: 'Audit trail', definition: 'A minimal record of validated identifiers, outcome, attempts and replay state used to inspect an operation. An entry does not prove a successful response and should not contain raw sensitive input.', lessonIds: ['tool-audit', 'tool-authorization'], aliases: ['audit', 'audit log', 'AuditEntry'] }
  ];
  return { lessons, units, glossary };
});
