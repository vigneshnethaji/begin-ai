/* Authored Unit 2 teaching extensions. Data only; no grading or runtime effects. */
(function (root, factory) {
  const value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.AcademyTeachingMlnet = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const lessons = {
    'data-examples': {
      explanation: {
        title: 'A row records one decision to learn',
        text: 'Think of a dataset as a worksheet with a purpose. One SupportDesk row pairs a message with the category a reviewer selected. Ten copies of one payment sentence are ten rows, but still only one way of asking. Count both rows and useful variations. A balanced number of categories does not guarantee varied wording or realistic coverage.'
      },
      worked: {
        title: 'Follow one real training row into C#',
        steps: [
          { title: 'Read the two columns', text: 'Open labs/supportdesk-classifier/data/train.tsv. Its header is Label followed by Text, separated by a tab. The row with "My card was charged twice for the same monthly plan." has Billing in its first column. The sentence is the input; Billing records the reviewed answer.' },
          { title: 'Match the input type', text: 'In labs/supportdesk-classifier/LabData.cs, SupportMessage has Label and Text properties. LabData.Parse checks the header and creates those objects. The first column goes into Label even though we often say "message and answer" when describing the task.' },
          { title: 'Count coverage separately', text: 'The source train.tsv contains 54 examples: 18 Billing, 18 Account, and 18 Technical. The separate test.tsv contains 18 examples: six per category. These are supplied fictional rows, not measurements from real customers or predictions made by this page.' }
        ],
        result: 'You can identify a row, its two roles, and the dataset it belongs to before discussing training.'
      },
      guided: {
        task: 'On paper, design three new fictional training rows: one request for a receipt, one expired login link, and one frozen upload screen. Name the columns in file order.',
        hint: 'Use the header you just inspected. Choose the category before arranging the two values.',
        solution: 'Use Label then Text. Pair Billing with the receipt request, Account with the expired login link, and Technical with the frozen upload screen. Write distinct sentences rather than copying one example.',
        expected: 'Three reviewed message/category pairs covering three categories; no source-file edit is needed.'
      },
      transfer: {
        task: 'A fictional .NET catalog app predicts Furniture or Clothing from product descriptions. Is a list of product IDs alone a suitable training dataset? Describe two useful rows.',
        answer: 'IDs alone do not show the desired relationship. "Oak dining chair" paired with Furniture and "Cotton winter coat" paired with Clothing provide descriptions and reviewed answers.'
      },
      recall: {
        question: 'Recall the earlier training lesson: does collecting these three rows change a saved model? Explain aloud, then revisit tomorrow.',
        answer: 'Collecting rows records potential learning material. A deliberate training process must fit a new model; the existing artifact stays the same. This reflection awards no automatic credit.'
      }
    },
    'input-features': {
      explanation: {
        title: 'Choose inputs by the time they become available',
        text: 'Imagine pausing a ticket at the instant it arrives. Its message exists; the eventual accepted category does not. That pause is a useful way to choose features. Information added after staff finish the work can reveal the answer accidentally. Even a field named ResolutionNote can leak the result without containing a category column explicitly.'
      },
      worked: {
        title: 'Separate real text features from a small numeric picture',
        steps: [
          { title: 'Locate the real transformation', text: 'In labs/supportdesk-classifier/SupportClassifier.cs, Train appends FeaturizeText with output "Features" and input nameof(SupportMessage.Text). The reviewed Label takes a different path into the trainer. It is not part of the Text feature input.' },
          { title: 'Draw two conceptual coordinates', text: 'For hand arithmetic only, imagine coordinates [payment clue, access clue]. Assign "duplicate card charge" [1, 0] and "expired login link" [0, 1]. These are invented teaching numbers. They are not vectors extracted by ML.NET, and they do not describe its actual vocabulary or vector length.' },
          { title: 'Return to learned preparation', text: 'The real fitted text transform produces numeric text features with a vocabulary learned from training rows. A later message must use that saved preparation. Giving it a freshly invented two-number vector would change the representation and would not match the trained pipeline.' }
        ],
        result: 'A feature vector represents the input. Its coordinate meanings must agree between training and prediction.'
      },
      guided: {
        task: 'Choose inputs for a ticket arriving now: MessageText, TicketId, ReviewedCategory, and ResolutionNote entered after closure. Explain each choice.',
        hint: 'Ask both "Is it available now?" and "Does it help with message meaning?"',
        solution: 'Start with MessageText. TicketId exists but is an arbitrary identifier, so leave it out of this first classifier. ReviewedCategory is the target. A later ResolutionNote can reveal the answer and is unavailable when routing begins.',
        expected: 'One useful initial input and a timing-based explanation for excluding future information.'
      },
      transfer: {
        task: 'A fictional .NET invoice app predicts overdue risk when an invoice is issued. Can it use Amount, DueDate, and ActualPaymentDate?',
        answer: 'Amount and DueDate exist at issue time and are candidates to evaluate. ActualPaymentDate is a future outcome and would leak information. Availability does not by itself prove an input improves predictions.'
      },
      recall: {
        question: 'Recall data-examples: why can Label remain in a training row while being excluded from Features? Revisit tomorrow without looking first.',
        answer: 'A row contains both the input and the reviewed answer. Training compares them, but inference has to work from available inputs alone. Explaining this boundary is reflection, not automatic quiz credit.'
      }
    },
    'target-labels': {
      explanation: {
        title: 'Define the answer before teaching it',
        text: 'A single-label classifier must choose one category for each message. People therefore need a shared category policy before reviewing rows. "My invoice screen crashes" mentions money, but reports a software failure. A useful fictional policy routes by the reported problem, making that example Technical. Repeating inconsistent answers cannot teach a clear boundary that people have not defined.'
      },
      worked: {
        title: 'Follow the reviewed answer and the proposed answer',
        steps: [
          { title: 'Inspect the allowed labels', text: 'In labs/supportdesk-classifier/LabData.cs, LabData.Labels contains Billing, Account, and Technical. General is absent. It is the fallback returned by the original keyword baseline, so do not add it to the classifier story merely because the comparison report mentions it.' },
          { title: 'Trace a disagreement', text: 'Authored example: reviewed Label is Technical for "My invoice screen crashes"; imagined prediction is Billing. The pair records one incorrect prediction under the stated policy. Changing Label to Billing simply to agree with the model would erase the evidence rather than repair the model.' },
          { title: 'Read the actual output mapping', text: 'SupportPrediction.Category is bound to the PredictedLabel column in LabData.cs. Its property name differs from SupportMessage.Label because it represents the proposed answer. SupportClassifier.Evaluate compares each proposal with its original reviewed label, preserving both roles in EvaluationCase.' }
        ],
        result: 'A label is a reference answer under a policy; a prediction is a candidate that can disagree with it.'
      },
      guided: {
        task: 'Label "Please explain this subscription fee" and "The subscription page crashes". Then describe what to do with "I cannot access my paid plan" when reviewers disagree.',
        hint: 'Payment wording alone does not settle whether the problem is billing, access, or a software failure.',
        solution: 'Choose Billing for the fee question and Technical for the crash. Hold the ambiguous paid-plan row for review, seek the missing context, and document the category policy before treating either answer as trusted.',
        expected: 'Two justified labels and one explicit unresolved case, rather than a guessed answer.'
      },
      transfer: {
        task: 'A fictional .NET booking app classifies requests as Cancellation or Reschedule. Two reviewers label "Move my reservation to Friday" differently. What should happen before training?',
        answer: 'Clarify that changing a date is Reschedule under the fictional policy, review the disagreement, and use the agreed answer. A model cannot define the business meaning of those categories for the team.'
      },
      recall: {
        question: 'Recall input-features: why must the accepted category not become a prediction input? Explain it again tomorrow.',
        answer: 'It supplies the answer after the routing decision. Using it as an input would hide the task instead of learning from the message. This self-explanation does not automatically complete a check.'
      }
    },
    'clean-examples': {
      explanation: {
        title: 'A clean file can still teach a poor lesson',
        text: 'There are two different reviews. Structural review asks whether a row has the required columns and allowed values. Meaning review asks whether the message actually supports the label and broadens useful coverage. A valid Billing label beside a password-reset sentence passes a simple shape check while teaching an incorrect association. More copies would strengthen that bad signal.'
      },
      worked: {
        title: 'Review four fictional rows before fitting',
        steps: [
          { title: 'Catch invalid structure', text: 'Consider A: Billing with spaces as Text, and B: Payments with "Please explain this fee". In labs/supportdesk-classifier/LabData.cs, Parse rejects A because Text is blank and B because Payments is not an allowed label. Neither should reach training unchanged.' },
          { title: 'Catch a duplicate after normalization', text: 'Now compare C: Account with "Reset my password!" and D: Account with "RESET MY PASSWORD". ValidateSplit lowercases and joins letter/number groups, making both "reset my password". It rejects this repetition within one split as well as across training and testing.' },
          { title: 'Review what the guard cannot know', text: '"I forgot my sign-in phrase" may be a paraphrase of another access request. Normalized string comparison does not identify every paraphrase, related conversation, or wrong label. Review those relationships manually, keep related conversations together, and seek genuinely varied fictional examples.' }
        ],
        result: 'Parsing, duplicate checks, and human meaning review solve different problems; passing one does not imply passing all three.'
      },
      guided: {
        task: 'On paper, review Billing/"Reset my password", Technical/"Upload freezes", and two copies of Account/"Invite a teammate". Propose a useful replacement collection.',
        hint: 'Check the answer, then repetition, then missing ways of expressing the task.',
        solution: 'Review and correct the password row to Account under the category policy. Keep the upload example and one invitation example. Replace the copy with a distinct reviewed message, such as a payment receipt request labelled Billing.',
        expected: 'Four distinct fictional examples with justified labels, including a payment example instead of a copied invitation.'
      },
      transfer: {
        task: 'A fictional .NET catalog classifier receives "Red cotton shirt" labelled Furniture twice, with different capitalization. What needs automated checking and what needs review?',
        answer: 'A normalized duplicate check can detect repeated text. A reviewer should question Furniture because the description indicates clothing. Removing repetition alone would leave an incorrect label.'
      },
      recall: {
        question: 'Recall target-labels: who resolves conflicting answers before the trainer sees them? Try explaining the two review types again tomorrow.',
        answer: 'Reviewers clarify the category policy and correct the examples. The trainer follows the supplied targets; it does not independently certify their meaning. Reflection gives no automatic progress credit.'
      }
    },
    'train-test-split': {
      explanation: {
        title: 'Practice, choose, then take the final exam',
        text: 'Training rows fit the model and any learned preprocessing. Validation rows help choose among candidate approaches. An untouched test set checks the selected approach afterward. Once repeated test results guide changes, that set has become part of development; its score no longer supplies a fresh final check. The supplied lab has training and test files only, not a separate validation workflow.'
      },
      worked: {
        title: 'Plan a larger fictional experiment on paper',
        steps: [
          { title: 'Separate before learning', text: 'Imagine 100 reviewed messages assigned as 60 training, 20 validation, and 20 final test rows. These authored counts are not the bundled file sizes. Keep each conversation in one group. For predicting future arrivals, consider time order as well; related wording can cross a random row split.' },
          { title: 'Fit preparation on training only', text: 'SupportClassifier.Train in labs/supportdesk-classifier/SupportClassifier.cs loads train.tsv and passes trainingData to Fit. This learns the text vocabulary as well as the classifier. In the proposed three-way exercise, each candidate must fit preprocessing on training rows only, then apply it to validation rows.' },
          { title: 'Use validation to diagnose the gap', text: 'Authored results: candidate A gets 59/60 training and 9/20 validation correct, suggesting overfitting to practice examples. Candidate B gets 30/60 and 10/20, suggesting underfitting if both miss relevant patterns. These are clues, not proofs: first check labels, representation, and whether the groups differ.' }
        ],
        result: 'Choose changes using validation evidence, then evaluate the selected candidate on the reserved test rows.'
      },
      guided: {
        task: 'A word appears only in a validation message. Should you scan all 100 messages to build the training vocabulary before fitting?',
        hint: 'Vocabulary learning is preparation that can acquire information from examples.',
        solution: 'Fit the vocabulary on the 60 training rows. Apply the fitted transform to validation and test rows. Inspecting their words to rebuild it would cross the boundary. Keep the final 20 test rows out of model selection.',
        expected: 'A clear separation between fitting, choosing a candidate, and checking the final choice.'
      },
      transfer: {
        task: 'A fictional .NET booking predictor has three rows from each reservation. Can one reservation appear in both training and final testing?',
        answer: 'Keep related reservation rows together to reduce leakage. If predicting future bookings, also consider a time-based split. Matching row counts alone does not establish independence.'
      },
      recall: {
        question: 'Recall clean-examples: does passing normalized duplicate checks prove these groups are independent? Revisit tomorrow.',
        answer: 'No. Paraphrases and related conversations can remain. Structural checks support, but do not replace, reviewing the split. This reflection supplies no automatic credit.'
      }
    },
    'mlnet-pipeline': {
      explanation: {
        title: 'Learning adjusts numbers; inference reuses them',
        text: 'A weight is a learned number that changes how strongly a feature contributes to a model score. Loss measures how far a prediction misses its training target under a chosen formula. Training seeks parameters that reduce its objective. The arithmetic below is a conceptual teaching model, not the update rule, loss, feature vector, or probabilities used by ML.NET SdcaMaximumEntropy.'
      },
      worked: {
        title: 'Calculate once, then trace the real pipeline',
        steps: [
          { title: 'Choose a deliberately tiny model', text: 'For this hand exercise, payment clue x = 1, desired numeric target y = 1, and score = weight × x. At weight 0.2, score is 0.2. Define squared loss as (y - score)²: (1 - 0.2)² = 0.64. This artificial numeric target is not a real ML.NET category key.' },
          { title: 'Compare another candidate weight', text: 'Try weight 0.6 on the same row: score = 0.6 and loss = (1 - 0.6)² = 0.16. The second weight fits this example better. This comparison illustrates learning a parameter; it does not prescribe an update algorithm or show that the second weight generalizes to unseen rows.' },
          { title: 'Find the actual learning boundary', text: 'In labs/supportdesk-classifier/SupportClassifier.cs, Train defines MapValueToKey, FeaturizeText, SdcaMaximumEntropy, then MapKeyToValue. Fit(trainingData) learns from train.tsv; the fitted output includes preparation and classification. Label keys encode category names rather than ranking Billing below Technical. Text features come from fitted text preparation, not our single hand-designed clue.' }
        ],
        result: 'The toy loss makes parameter fitting concrete. The real pipeline performs a multiclass text task with its own training mathematics.'
      },
      guided: {
        task: 'With the same conceptual formula, x = 1 and y = 1, compare weights 0.5 and 0.8. Then locate the real call that learns parameters.',
        hint: 'Subtract each score from 1, square the difference, and compare.',
        solution: 'The scores are 0.5 and 0.8; losses are 0.25 and 0.04. Weight 0.8 fits this row better. In the real source, pipeline.Fit(trainingData) starts learning; creating the pipeline variable does not.',
        expected: 'Two hand-calculated losses and a correct distinction between defining operations and fitting them.'
      },
      transfer: {
        task: 'A fictional .NET invoice estimator declares a numeric preparation step and trainer but never fits them. Has it learned invoice amounts?',
        answer: 'No. Declaring the sequence specifies the intended work. It needs reviewed training examples and a fitting operation; evaluation must then check separate examples.'
      },
      recall: {
        question: 'Recall train-test-split: may the vocabulary learn from test rows before Fit trains the classifier? Explain again tomorrow.',
        answer: 'No. Learned preparation belongs inside the training boundary too. Applying a fitted transform afterward is different from fitting it. This explanation earns no automatic check credit.'
      }
    },
    'evaluate-model': {
      explanation: {
        title: 'Ask who was missed behind the percentage',
        text: 'Authored binary exercise: 90 General messages and 10 Billing messages. Always predicting General gets 90/100 = 90% accuracy while missing all Billing messages. General is used only for this exercise; the real model labels are Billing, Account, and Technical. EvaluationReport.Print reports counts, percentages, and wrong cases, not precision, recall, F1, or a confusion matrix.'
      },
      worked: {
        title: 'Count a confusion matrix by hand',
        steps: [
          { title: 'Declare rows and columns', text: 'Another authored tally has rows = actual and columns = predicted, ordered Billing then General: [[6, 4], [3, 87]]. The diagonal is correct: (6 + 87)/100 = 93%. The cells retain the error direction hidden by accuracy.' },
          { title: 'Treat Billing as positive', text: 'True positives TP = 6, false negatives FN = 4, false positives FP = 3, true negatives TN = 87. Billing precision = TP/(TP + FP) = 6/9; recall = TP/(TP + FN) = 6/10; F1 = 2TP/(2TP + FP + FN) = 12/19. Precision asks how many Billing predictions were right; recall asks how many actual Billing messages were found.' },
          { title: 'Swap the positive category', text: 'For General, TP = 87, FP = 4, FN = 3, TN = 6: precision = 87/91, recall = 87/90, F1 = 174/181. These are per-class binary views, not multiclass averages. Inspect SupportClassifier.Evaluate and EvaluationReport in labs/supportdesk-classifier/SupportClassifier.cs for the actual counting workflow.' }
        ],
        result: 'Report the class, numerator, denominator, and mistakes alongside overall accuracy.'
      },
      guided: {
        task: 'Return to always-General. Calculate Billing precision, recall, and F1 without inventing a denominator.',
        hint: 'TP = 0, FP = 0, FN = 10. Use the formulas above.',
        solution: 'Precision is undefined: 0/0 because nothing was predicted Billing. Recall is 0/10 = 0. Count-form F1 is 0/10 = 0. Report undefined precision explicitly; a software convention assigning zero would need stating.',
        expected: 'Undefined precision distinguished from measured zero recall and zero F1. If TP, FP, and FN are all zero, F1 is also undefined.'
      },
      transfer: {
        task: 'A fictional .NET invoice classifier flags Duplicate: TP = 2, FP = 2, FN = 6. Calculate its per-class metrics.',
        answer: 'Precision = 2/4, recall = 2/8, F1 = 4/12. Many actual duplicates are missed despite half the alerts being correct.'
      },
      recall: {
        question: 'Recall train-test-split: can you tune on these final-test mistakes and still call that set untouched? Revisit tomorrow.',
        answer: 'No. Use validation for tuning and reserve fresh final-test evidence. Reflection gives no automatic credit.'
      },
      deepDive: [
        {
          title: 'One class versus the rest is not an average',
          text: 'For three classes, make each class positive against the other two. Macro F1 averages the three defined class F1 values equally. Weighted F1 weights them by actual class counts. Micro F1 pools TP, FP, and FN before calculating. State any undefined-value convention.',
          task: 'Does Billing F1 alone describe all three model categories?',
          answer: 'No. Report each class and name any averaging method.'
        }
      ]
    },
    'save-load': {
      explanation: {
        title: 'Save the preparation together with the learner',
        text: 'Imagine a conceptual vocabulary where coordinate 0 means payment and coordinate 1 means password. A weight learned for coordinate 0 assumes that meaning. Rebuilding the vocabulary in another order would change what the same number means. This picture is not the lab vocabulary; it explains why saving only classifier weights would lose part of the input contract.'
      },
      worked: {
        title: 'Trace one artifact through three existing methods',
        steps: [
          { title: 'Find what training saves', text: 'In labs/supportdesk-classifier/SupportClassifier.cs, Train calls ml.Model.Save(model, trainingData.Schema, ModelPath). The model is the complete fitted pipeline, including label mapping, text preparation, the classifier, and output conversion. ModelPath points under AppContext.BaseDirectory to artifacts/supportdesk-model.zip, not to a file chosen from the terminal directory.' },
          { title: 'Find what loading restores', text: 'Load first checks that ModelPath exists, then calls ml.Model.Load. A missing artifact raises a FileNotFoundException with guidance to train first. Loading restores the fitted operations. It does not read new examples, build a new vocabulary, or improve the model merely because the process restarted.' },
          { title: 'Follow a new message', text: 'Predict validates text and creates a short-lived PredictionEngine using the loaded model. It supplies new SupportMessage { Text = text } and returns SupportPrediction. Verification.cs compares categories and scores before and after saving/reloading; inspecting that check does not require running training or creating an artifact.' }
        ],
        result: 'The saved preparation preserves feature meaning. Prediction reuses it without learning from the request.'
      },
      guided: {
        task: 'On paper, trace Load followed by Predict for "My report freezes". Then decide whether correcting the proposed category changes the saved file.',
        hint: 'Look for a Fit or Save operation on that prediction path.',
        solution: 'Load restores the existing artifact; Predict validates and transforms the message through it. Neither method fits or saves. A staff correction would need deliberate collection and a later reviewed training/evaluation process to produce a replacement model.',
        expected: 'A reuse trace with no assumed new learning. The category itself is not promised for this unexecuted example.'
      },
      transfer: {
        task: 'A fictional .NET catalog classifier saves a learner but rebuilds its description vocabulary for every request. What should its artifact contain?',
        answer: 'Save and load the fitted text preparation and classifier together, including required mappings. Evaluate the complete replacement artifact before adopting it; matching filenames does not establish matching behavior.'
      },
      recall: {
        question: 'Recall the earlier training lesson: why is restarting the console app still inference? Explain again tomorrow.',
        answer: 'The process reloads learned state and applies it. Learning changes only through a deliberate training operation. This explanation is self-review, not automatic completion credit.'
      }
    }
  };

  const glossary = [
    { term: 'Class coverage', definition: 'Which target categories and relevant variations appear in a dataset. Equal row counts alone do not establish varied or representative examples.', lessonIds: ['data-examples', 'clean-examples'], aliases: ['category coverage'] },
    { term: 'Label policy', definition: 'A shared rule for how reviewers assign target categories, including what to do when a message is ambiguous.', lessonIds: ['target-labels', 'clean-examples'], aliases: ['labelling policy', 'labeling policy'] },
    { term: 'Validation set', definition: 'Examples kept out of fitting and used to compare or tune candidate approaches before an independent final test. The supplied classifier lab has no separate validation file.', lessonIds: ['train-test-split'], aliases: ['validation split', 'validation rows'] },
    { term: 'Overfitting', definition: 'Learning patterns too specific to training examples, so performance does not carry over well to separate relevant examples. A large training/validation gap is a clue to investigate.', lessonIds: ['train-test-split'], aliases: ['overfit'] },
    { term: 'Underfitting', definition: 'Failing to learn enough useful structure for the task, often leaving both training and validation performance poor. Check data and representation as well as model capacity.', lessonIds: ['train-test-split'], aliases: ['underfit'] },
    { term: 'Weight', definition: 'A learned numeric parameter controlling a feature contribution to a model score. The lesson uses invented weights for arithmetic, not extracted ML.NET parameters.', lessonIds: ['input-features', 'mlnet-pipeline', 'save-load'], aliases: ['learned weight', 'model weight'] },
    { term: 'Loss', definition: 'A numeric measure of prediction error under a chosen formula that contributes to a training objective. The squared-loss exercise is conceptual, not the lab trainer loss.', lessonIds: ['mlnet-pipeline'], aliases: ['loss function', 'training loss'] },
    { term: 'Class imbalance', definition: 'Unequal numbers of examples in different target categories. Predicting only the largest class can give high accuracy while missing a smaller class entirely.', lessonIds: ['evaluate-model'], aliases: ['imbalanced classes', 'majority class'] },
    { term: 'Confusion matrix', definition: 'Counts of actual versus predicted categories. Declare the row and column order so both correct outcomes and directions of errors can be read.', lessonIds: ['evaluate-model'], aliases: ['confusion table'] },
    { term: 'True positive', definition: 'An example belonging to the declared positive class that is also predicted as that class.', lessonIds: ['evaluate-model'], aliases: ['TP'] },
    { term: 'False positive', definition: 'An example outside the declared positive class that is incorrectly predicted as that class.', lessonIds: ['evaluate-model'], aliases: ['FP'] },
    { term: 'False negative', definition: 'An example belonging to the declared positive class that is incorrectly predicted outside that class.', lessonIds: ['evaluate-model'], aliases: ['FN'] },
    { term: 'True negative', definition: 'An example outside the declared positive class that is also predicted outside it. In a one-class-versus-rest view, this does not prove the other category was correctly identified.', lessonIds: ['evaluate-model'], aliases: ['TN'] },
    { term: 'Classification precision', definition: 'For a declared class, TP divided by TP + FP: the share of predictions for that class that are correct. Undefined when there are no predictions for that class.', lessonIds: ['evaluate-model'], aliases: ['precision', 'per-class precision'] },
    { term: 'Classification recall', definition: 'For a declared class, TP divided by TP + FN: the share of actual examples of that class that are found. Undefined when there are no actual examples of that class.', lessonIds: ['evaluate-model'], aliases: ['recall', 'per-class recall'] },
    { term: 'F1 score', definition: 'For a declared class, 2TP divided by 2TP + FP + FN, balancing precision and recall. It is undefined when that denominator is zero; state any reporting convention.', lessonIds: ['evaluate-model'], aliases: ['F1', 'per-class F1'] },
    { term: 'One versus rest', definition: 'Evaluating one declared positive category against all other categories grouped together. Its per-class metrics are different from an average over categories.', lessonIds: ['evaluate-model'], aliases: ['one-vs-rest', 'binary class view'] },
    { term: 'Macro average', definition: 'An equal-weight average of per-class metric values. For macro F1, average the class F1 values rather than computing F1 from averaged precision and recall; state undefined-value handling.', lessonIds: ['evaluate-model'], aliases: ['macro F1'] },
    { term: 'Micro average', definition: 'Pooling per-class TP, FP, and FN counts before computing a metric. It is a different aggregation from giving each class equal weight.', lessonIds: ['evaluate-model'], aliases: ['micro F1'] },
    { term: 'Support-weighted average', definition: 'An average of per-class metric values weighted by each class count of actual examples. Large classes can dominate this average.', lessonIds: ['evaluate-model'], aliases: ['weighted F1'] }
  ];

  return { lessons, glossary };
});
