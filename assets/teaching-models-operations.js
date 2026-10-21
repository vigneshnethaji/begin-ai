/* Authored Units 10–11 teaching companion. Data only; no execution or progress effects.
   Concept references (official documentation, checked 2026-10-19):
   https://onnxruntime.ai/docs/execution-providers/
   https://onnxruntime.ai/docs/reference/compatibility.html
   https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html
   https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity
*/
(function (root, factory) {
  const value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.AcademyTeachingModelsOperations = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const lessons = {
    'images-ocr': {
      explanation: {
        title: 'Keep the proposed number beside its source',
        text: 'OCR turns image text into candidate characters. Reading an invoice amount is different from deciding whether the invoice is genuine or a parcel is damaged. In a .NET feature, keep the extracted value with its source and uncertainty so a reviewer can inspect what supports the proposed answer.'
      },
      worked: {
        title: 'Trace one authored image through Intake',
        steps: [
          { title: 'Validate the declared input', text: 'In labs/supportdesk-attachment-review/Services/Intake.cs, SetInput stores an IntakeInput. Trace fixture image, media type image/png and notes Fictional invoice review. Normalize accepts this exact pair and nonblank notes. Changing only the type to text/plain denies normalization before any observations appear.' },
          { title: 'Inspect the actual observation', text: 'Normalize constructs Observation with SourceId image-1, Modality image, Field amount, Value 120 and Confidence 0.92m. Selecting image retains just this record and sets Phase to AwaitingReview. These constants were written by the author; no pixels, image decoder or OCR engine produced them.' },
          { title: 'Separate acknowledgement from a result', text: 'Review(true) records review of the current input but leaves Result empty. Preview then produces AcceptedLocalPreview and includes image-1: amount=120 with confidence 0.92. Its closing statement still says review does not prove truth. The amount has become a traceable local preview, not an approved refund.' }
        ],
        result: 'One valid image fixture gives one reviewable observation; a mismatched type gives no evidence. Neither path assesses damage.'
      },
      guided: {
        task: 'Trace image with image/png and 2,000 letters of notes, then the same pair with 2,001 letters. What changes, and can a 0.92 confidence bypass review?',
        hint: 'Read Valid for the notes bound, then Preview for its independent review condition.',
        solution: 'The 2,000-character input reaches AwaitingReview with image-1. The 2,001-character input reaches Denied with empty evidence. Confidence is not part of a review bypass; the valid case still needs Review(true) before Preview.',
        expected: 'One accepted input boundary, one rejection, and review required for the surviving candidate.'
      },
      transfer: {
        task: 'Conceptual .NET invoice feature: a scanned due date reads 18 May. What should accompany that date before a clerk updates the payable record?',
        answer: 'Retain the document identifier, relevant page or region, extraction uncertainty and review decision. Compare with the original and invoice policy. A readable date alone neither verifies the invoice nor authorizes changing a payable.'
      },
      recall: {
        question: 'Recall response validation: does a value with the expected type establish that its business claim is correct? Explain again later from memory.',
        answer: 'No. Shape and bounds validate representation. Evidence review addresses support, and application authorization governs effects. This reflection has no automatic credit or scheduled reminder.'
      }
    },
    'speech-transcripts': {
      explanation: {
        title: 'A transcript needs a place to check',
        text: 'Speech recognition proposes words from audio. Speaker grouping and timestamps help locate a segment, but a label such as Speaker 1 does not authenticate a customer. A .NET review screen should keep the proposed words, source, time and uncertainty together rather than turning a transcript into an unexplained business fact.'
      },
      worked: {
        title: 'Read the authored audio segment without inventing a call',
        steps: [
          { title: 'Choose the matching audio fixture', text: 'In attachment-review Services/Intake.cs, trace SetInput with fixture audio, media audio/wav and nonblank fictional notes. Normalize validates the pair and selects one authored Observation. It does not open a microphone, decode a recording or call a speech service. The outcome is AwaitingReview.' },
          { title: 'Keep all segment metadata', text: 'The observation is audio-1, amount 170, confidence 0.61m, Speaker 1, StartSeconds 12 and EndSeconds 16. The interval spans four seconds. Home.razor displays the speaker and interval alongside the value. No original audio is available to verify the words.' },
          { title: 'Compare the segment with other evidence', text: 'Trace a separate bundle normalization using application/x-supportdesk-fixture. Evidence now includes audio amount 170 and image/text amounts 120. HasConflict detects distinct values for amount. Review(true) followed by Preview preserves both numbers and the unresolved conflict; the lower audio confidence does not silently discard the segment.' }
        ],
        result: 'You can locate the fictional segment and explain its disagreement without claiming that a speaker, amount or recording was verified.'
      },
      guided: {
        task: 'On paper, write the complete audio observation. Then explain whether changing notes to “confirmed customer” changes the speaker or amount after normalization.',
        hint: 'Find where Normalize constructs audio, and compare those constants with the role of Notes in Valid.',
        solution: 'Record audio-1, audio, amount 170, confidence 0.61, Speaker 1 and 12–16 seconds. Valid notes permit intake, but Normalize still constructs the same authored observation. The phrase confirmed customer is not an authentication operation.',
        expected: 'An unchanged authored segment with its provenance, plus a clear distinction between a note and verified identity.'
      },
      transfer: {
        task: 'Conceptual .NET booking feature: a transcript says “cancel Friday,” but the reservation lists two Friday appointments. What should the confirmation screen request?',
        answer: 'Keep the segment reference and ask which dated appointment the caller means. Confirm caller permission separately before cancellation. The transcript provides a proposed instruction; neither speaker grouping nor fluent wording selects an authorized reservation.'
      },
      recall: {
        question: 'Recall the image lesson: why should a high-confidence extracted number stay attached to its source? Revisit this explanation later.',
        answer: 'Confidence does not establish truth. Source context lets a reviewer investigate ambiguity or disagreement. Audio also needs its time interval. This is a memory exercise without automatic credit or a reminder.'
      }
    },
    'multimodal-inputs': {
      explanation: {
        title: 'Combine records without erasing disagreement',
        text: 'Multimodal input combines forms such as images, audio and text. Normalization gives their observations a common shape, not a common truth. A .NET record can preserve each source and candidate value so disagreement remains visible. Two matching observations do not automatically outweigh a conflicting one, especially when sources may repeat each other.'
      },
      worked: {
        title: 'Follow the conflicting bundle and its reset rule',
        steps: [
          { title: 'Normalize three source records', text: 'In attachment-review Services/Intake.cs, the bundle/application/x-supportdesk-fixture pair with valid notes produces image-1 amount 120 at 0.92, audio-1 amount 170 at 0.61, and text-1 amount 120 at 1.00. HasConflict groups by Field and finds distinct Value strings. It performs no voting or confidence averaging.' },
          { title: 'Acknowledge the exact bundle', text: 'Review(true) binds reviewed to current only when normalization still matches it. Preview checks Reviewed again, then lists all three sources and an unresolved-conflict statement. AcceptedLocalPreview means this local preview passed its review gate; it does not mean the service established 120 as the correct amount.' },
          { title: 'Edit and trace invalidation', text: 'SetInput calls Clear and returns Phase to Idle, emptying Evidence and Result and clearing review. Home.razor routes notes, fixture, media and model-requirement edits through Update, which calls SetInput. Even returning to the old displayed values requires new normalization and review; the earlier acknowledgement is not restored.' }
        ],
        result: 'The result preserves incompatible evidence, and any input edit removes the previous workspace approval and preview.'
      },
      guided: {
        task: 'Trace Normalize, Review(true), then Normalize again for the bundle. Can Preview reuse the first review, and which amount should it select?',
        hint: 'Normalize starts with Clear. HasConflict only reports disagreement; look for any actual winner-selection code.',
        solution: 'The second normalization clears reviewed and rebuilds three observations. Preview without another review becomes Denied and leaves Result empty. No amount is selected: both 120 and 170 remain candidates for separate investigation.',
        expected: 'A rejected stale review and no majority-selected or confidence-selected amount.'
      },
      transfer: {
        task: 'Conceptual .NET catalog import: a supplier sheet says a chair weighs 8 kg while its packaging label says 10 kg. How should one normalized product record represent this?',
        answer: 'Preserve both source references and distinguish possible net versus packed weight before choosing a field value. Ask for the missing definition. Flattening the observations into one unexplained weight would hide a business ambiguity rather than resolve it.'
      },
      recall: {
        question: 'Recall exact approval from earlier tool lessons: why does editing reviewed input require another review? Explain later without opening the answer.',
        answer: 'Approval concerns the evidence actually inspected. A changed request may have different meaning or consequences. This local exercise resets that evidence explicitly; reflection itself grants no credit or scheduled reminder.'
      }
    },
    'local-inference': {
      explanation: {
        title: 'An eligible profile is only a candidate',
        text: 'Local inference means executing a model on a chosen device. First check whether the task, privacy policy and available memory permit a candidate. Then investigate its actual compatibility and quality. A fictional .NET selection policy can teach that ordering without loading a model or proving that any particular hardware can run it.'
      },
      worked: {
        title: 'Apply ModelPolicy requirements before its authored score',
        steps: [
          { title: 'Read the two fictional profiles', text: 'In attachment-review Services/ModelPolicy.cs, local-text has text capability, needs 4 GiB and has IllustrativeScore 80. cloud-general advertises text, vision and speech with score 70. These are private Profile records, not installed models, benchmark measurements, hardware probes or executable adapters. Choose compares only these authored descriptions.' },
          { title: 'Trace an eligible text choice', text: 'For Choose with capability text, noCloud true and memoryGiB 8, local-text survives the capability, privacy and memory filters. cloud-general fails privacy. Ordering the remaining candidates returns local-text with Outcome Illustrative candidate. Eight GiB exceeds the fictional four-GiB requirement by four; it is not measured spare inference memory.' },
          { title: 'Change requirements before comparing scores', text: 'With vision, noCloud true and 8 GiB, neither profile qualifies: local-text lacks vision and cloud-general is forbidden. With text, noCloud true and 2 GiB, local-text fails memory. Both return No eligible profile. Allowing cloud for vision at 8 GiB selects cloud-general; it still initiates no transfer or inference.' }
        ],
        result: 'Hard requirements remove candidates before scores rank survivors. A high score never creates a missing capability or overrides privacy.'
      },
      guided: {
        task: 'Predict Choose for text/no-cloud/4 GiB, text/no-cloud/3 GiB, and speech/cloud-allowed/8 GiB. What further evidence would an actual local .NET implementation need?',
        hint: 'Use the inclusive memory requirement, then separate policy eligibility from executable model support.',
        solution: 'The outcomes are local-text, No eligible profile, and cloud-general. A real implementation still needs a compatible model/runtime/hardware path, correct input preparation and relevant quality and resource measurements.',
        expected: 'Three source-grounded choices and no claim that the policy loaded or tested a model.'
      },
      transfer: {
        task: 'Conceptual .NET onboarding feature: passport images must stay on an approved workstation. A text-only local profile scores highest. Is it an eligible image-reading choice?',
        answer: 'No. The required image capability is missing. Find an approved compatible option or stop that feature. Do not reinterpret a policy score as evidence that a text profile can process passport images.'
      },
      recall: {
        question: 'Recall baseline evaluation: does a larger score establish useful performance on the intended task? Revisit this distinction later.',
        answer: 'Only a defined measurement on relevant independent cases supports that conclusion. These profile scores are authored constants. Reflection changes neither model parameters nor course credit and schedules no reminder.'
      }
    },
    'onnx-quantization': {
      explanation: {
        title: 'Separate the saved model from its execution path',
        text: 'ONNX represents a model using operations and tensors. ONNX Runtime executes compatible models, and an execution provider supplies a hardware backend. Quantization uses lower numeric precision for some values or operations. A .NET application must evaluate the resulting compatibility, resource use and quality rather than infer a speedup from a filename.'
      },
      worked: {
        title: 'Move from a fictional profile to a compatibility question',
        steps: [
          { title: 'Locate what the C# policy actually checks', text: 'In attachment-review Services/ModelPolicy.cs, Choose(text, no-cloud, 4 GiB) can select local-text. Its Profile contains only an ID, cloud flag, capabilities, memory requirement and authored score. There is no model path, tensor contract, ONNX operator-set version or runtime session in this selection. Policy eligibility is the starting point.' },
          { title: 'Describe a conceptual execution contract', text: 'For a hypothetical .NET catalog classifier, record input tensor shape and element type, output labels, model operator requirements and execution provider. This is a proposed implementation. A runtime package alone does not establish that this graph and hardware work together.' },
          { title: 'Compare candidates before claiming improvement', text: 'Conceptually compare original and quantized candidates on the same held-out descriptions and device. Record correctness, memory and latency separately. In the actual lab, Choose reports only an Illustrative candidate; Home.razor describes ONNX conceptually. No quantized model executes here, so there is no measured saving.' }
        ],
        result: 'Format, runtime, provider and precision differ. Profile selection proves no execution result.'
      },
      guided: {
        task: 'A fictional comparison proposes shrinking a model from 80 MB to 24 MB. Calculate the proposed reduction, and list what must still be measured before accepting it.',
        hint: 'Use the original size as the percentage denominator. File size alone says nothing about task errors or execution time.',
        solution: 'The proposed reduction is 56 MB, or 70% of 80 MB. Test compatible execution, task quality, runtime memory and latency on the intended device. Those invented sizes are arithmetic inputs, not outcomes from this project.',
        expected: 'A correct conceptual size calculation with no automatic claim of faster inference or unchanged quality.'
      },
      transfer: {
        task: 'Conceptual .NET invoice classifier: a smaller candidate fits disk limits but misclassifies more credit notes. Is size reduction enough to release it?',
        answer: 'No. Compare the relevant error cases and acceptance thresholds as well as resource limits. Keep or improve the existing candidate if the smaller version fails the required business quality.'
      },
      recall: {
        question: 'Recall local-inference: what is missing when ModelPolicy selects local-text? Explain later from memory.',
        answer: 'Actual executable compatibility and measured task performance are missing. Selection filters authored descriptions; it does not load weights. This self-check grants no automatic credit and sets no reminder.'
      }
    },
    'finetuning-decision': {
      explanation: {
        title: 'Identify the failure before choosing more training',
        text: 'Prompts guide a request, retrieval supplies relevant evidence, and fine-tuning changes learned parameters through further training. These address different needs. For a .NET assistant, separate missing current facts from inconsistent formatting or behavior. Establish a measured prompt baseline and independent evaluation before deciding that training is a justified next experiment.'
      },
      worked: {
        title: 'Investigate the attachment amount without pretending to train',
        steps: [
          { title: 'Name the unresolved fact', text: 'In attachment-review Services/Intake.cs, bundle normalization retains amounts 120 and 170 with separate source IDs. HasConflict identifies different values for amount. Fine-tuning cannot itself establish which fictional invoice is authoritative. The next information need is trustworthy evidence about this case, not a more confident restatement of one number.' },
          { title: 'Separate a behavior experiment', text: 'Conceptually, suppose a .NET reply helper has adequate evidence but repeatedly omits a required heading. Define the heading rule, improve instructions or examples, and compare results on a fixed reviewed set. This is proposed: the attachment lab contains no reply generator, prompt measurement harness or training job.' },
          { title: 'Require evidence before training', text: 'If a measured baseline still fails a stable behavior requirement, investigate reviewed training examples and independent held-out evaluation. In this project, ModelPolicy.Choose only filters fictional profiles and ranks authored scores. It cannot compare prompts, fit parameters or recommend training from measured results. Preserve that distinction in your decision note.' }
        ],
        result: 'Investigate missing facts; evaluate training only for persistent measured behavior failures.'
      },
      guided: {
        task: 'Write next steps for three conceptual failures: an obsolete return policy, an omitted response heading without a baseline, and repeated heading failures after a measured prompt baseline.',
        hint: 'Ask whether the missing ingredient is current knowledge, an explicit instruction, or evidence supporting further training.',
        solution: 'Investigate approved current retrieval for the policy. Establish and measure the heading instruction first. For persistent failures, evaluate whether reviewed training data and independent tests justify a fine-tuning experiment; do not skip comparison against the baseline.',
        expected: 'Distinct next steps; no training, publication or factual repair is assumed.'
      },
      transfer: {
        task: 'Conceptual .NET catalog assistant: prices change daily, while the desired description style stays stable. Which need suggests retrieval, and which might justify a later training experiment?',
        answer: 'Retrieve authorized current prices. Measure prompts for the stable style first; only persistent evaluated failures and suitable data support investigating training. Neither decision authorizes automatic publication of catalog descriptions.'
      },
      recall: {
        question: 'Recall training and request context: does inserting a current policy passage update model parameters? Explain later without looking.',
        answer: 'No. Request context supplies information for inference. Parameter updates require training. This recall exercise awards no automatic credit and creates no reminder.'
      }
    },
    'identity-secrets': {
      explanation: {
        title: 'A policy label does not prove who is calling',
        text: 'Authentication establishes identity; authorization decides allowed actions. A browser choice labelled release cannot establish either in production. In a .NET design, keep credentials in the server boundary and check trusted caller permissions. The operations lab instead demonstrates a local policy comparison using fictional labels, without contacting an identity provider or reading secrets.'
      },
      worked: {
        title: 'Trace the DEMO identity gate in ReleaseSession',
        steps: [
          { title: 'Read the candidate identity field', text: 'In labs/supportdesk-operations-capstone/Services/ReleaseSession.cs, Candidate defaults Identity to demo-release. Home.razor also offers demo-reader and unknown in a selector. These strings are exercise inputs. No sign-in, access token or authenticated staff principal accompanies the selection, even though the gate runs in server-side C#.' },
          { title: 'Check a non-release label', text: 'Trace Edit with an otherwise default Candidate whose Identity is demo-reader, then Check. The Identity gate compares c.Identity with demo-release and fails. Status becomes Blocked. Approve and Promote cannot progress this candidate, so Active stays V1 and Effects stays zero. The result demonstrates policy enforcement over supplied fictional data.' },
          { title: 'Change the input and repeat review', text: 'Edit with Identity demo-release invalidates gates and approval and returns Idle. Check can now reach Ready if every other gate passes. Approve binds that candidate and check number, but still creates no effect. Program.cs registers ReleaseSession and uses CreateEmptyBuilder; it contains no Azure login or resource deployment step.' }
        ],
        result: 'A matching DEMO label passes one local gate; it supplies no evidence of production authentication or cloud permission.'
      },
      guided: {
        task: 'Compare demo-reader with demo-release for otherwise default candidates. Then name two production questions that this selector leaves unanswered.',
        hint: 'Separate a string equality test from trusted identity and resource-specific permission.',
        solution: 'demo-reader blocks the release gate; demo-release permits Ready only when all gates pass. A real design must establish the caller through trusted authentication and authorize that caller for this release action. Resource access by the application needs its own verified permissions.',
        expected: 'Two correct local outcomes and clear missing production identity evidence; no credential inspection is needed.'
      },
      transfer: {
        task: 'Conceptual .NET onboarding portal: a posted form includes Role=Approver. Can that field authorize approval of a new supplier?',
        answer: 'No. Resolve trusted caller identity and permissions on the server, then validate the exact supplier action. A form field expresses requested data, not proof that the caller holds the approver role.'
      },
      recall: {
        question: 'Recall server credentials: does keeping a provider key off the browser establish which user may perform an action? Revisit later.',
        answer: 'No. Credential placement protects an application credential; caller authorization is a separate check. This explanation changes no permissions, grants no course credit and schedules no reminder.'
      }
    },
    'evaluation-gates': {
      explanation: {
        title: 'A release decision needs several separate answers',
        text: 'Quality, safety, sample coverage and resource limits answer different release questions. A high aggregate quality score cannot cancel a safety failure. A .NET release gate should expose each requirement and bind approval to the evidence actually checked. In this lab, candidate measurements are authored inputs, not results from running a model evaluation.'
      },
      worked: {
        title: 'Trace a passing check, a safety failure and stale approval',
        steps: [
          { title: 'Check the default snapshot', text: 'In operations-capstone Services/ReleaseSession.cs, a default Candidate has quality 95, 100 samples and zero safety failures. Check evaluates eight gates: Input, Identity, Quality, Samples, Safety, Provider, Budget and Latency. All defaults pass, Status becomes Ready and CheckNumber advances. The service has accepted synthetic measurements, not generated them.' },
          { title: 'Change just the safety count', text: 'For a separate candidate with SafetyFailures 1, Check blocks despite quality 95. The policy requires finite quality at least 90, at least 20 samples and zero valid safety failures. One failure among 100 is a conceptual 1% rate, but this zero-failure rule does not accept it. Approve cannot override a failed gate.' },
          { title: 'Invalidate an approved snapshot', text: 'Return to a passing candidate, Check and Approve, then Edit quality to 96 before promotion. Edit clears checkedCandidate, approvedCandidate and Gates, and returns Idle. Promote has no effect until fresh gates and approval exist. Calling Check again also clears approval, because approval includes the exact numbered check as well as candidate equality.' }
        ],
        result: 'Passing evidence permits review; changed evidence requires fresh checks and approval before promotion.'
      },
      guided: {
        task: 'Predict Check for quality 90/samples 20/safety 0, then quality 89/samples 100/safety 0. Keep every other default. Does waiting at approval expire it?',
        hint: 'Read the inclusive thresholds and Approved property; synthetic latency is a candidate measurement.',
        solution: 'The first candidate reaches Ready. The second is Blocked by Quality despite more samples. There is no approval timer in ReleaseSession: approval depends on candidate, check number and status, and edits or rechecks invalidate it.',
        expected: 'Two threshold outcomes; no automatic review deadline.'
      },
      transfer: {
        task: 'Conceptual .NET invoice extraction release: average field accuracy improves, but one case assigns the wrong supplier account. Should the average waive a blocking account-safety rule?',
        answer: 'No. Keep the failure visible, investigate the cause and rerun the relevant reviewed cases after a fix. Aggregate improvement and a mandatory safety condition are separate acceptance questions.'
      },
      recall: {
        question: 'Recall held-out evaluation: why must synthetic candidate fields not be reported as measured model accuracy? Explain later.',
        answer: 'A number entered into a record is an assertion. Measurement requires defined cases, reference answers and observed outputs. This memory exercise grants no automatic credit or reminder.'
      }
    },
    'observability': {
      explanation: {
        title: 'Observe the decision without copying the payload',
        text: 'Operational evidence should explain what happened with bounded, useful details. In .NET, ActivitySource describes operations and Meter provides measurement instruments; collection needs separate configuration. The operations lab pairs these with a visible audit of safe outcomes. None of those records requires customer text, credentials or a complete candidate payload to explain a blocked gate.'
      },
      worked: {
        title: 'Trace one check through audit and instrumentation',
        steps: [
          { title: 'Create a local gate outcome', text: 'In operations-capstone Services/ReleaseSession.cs, Check on a default candidate reaches Ready and calls Record with operation gate and outcome ready. In a fresh session this appends A000001 | gate | ready. The line describes the transition; the gate list separately explains which requirements passed. It contains no full input document.' },
          { title: 'Inspect the telemetry boundary', text: 'Services/ReleaseTelemetry.cs accepts allowlisted operations and outcomes. For gate/ready, Record starts activity release.gate, adds release.operation and release.outcome tags when an activity exists, and increments release.transitions with operation/outcome labels. ActivitySource and Meter are named SupportDesk.Operations. No external exporter is installed; instrumentation does not prove remote collection.' },
          { title: 'Distinguish observation from effect', text: 'Replay before promotion records replay/blocked without releasing anything. Each Record appends a generated audit ID and removes the oldest entry when more than 80 remain. Repeating Replay changes audit and counter while Effects stays zero. Telemetry event counts therefore differ from promotion counts and do not establish success.' }
        ],
        result: 'Bounded audit and telemetry describe observations; recording an event performs no deployment.'
      },
      guided: {
        task: 'Inspect ReleaseTelemetry.Record for operation send-customer-email. Does it record anything? Why avoid unique customer IDs as metric labels?',
        hint: 'Read the early allowlist return. Think about how many distinct label values accumulate across requests.',
        solution: 'The unrecognized operation returns before activity creation or counter increment. Conceptually, unique customer labels create many metric series and expose unnecessary identifiers. Use bounded operation and outcome labels for aggregate diagnosis; investigate individual cases through an approved separate process.',
        expected: 'No event for the unknown operation, and a reasoned choice of bounded labels.'
      },
      transfer: {
        task: 'Conceptual .NET booking service: a reservation fails payment validation. What initial operational record is useful without logging card details?',
        answer: 'Record a permitted operation and failure category, plus approved correlation information in an appropriate trace or audit. Keep card numbers and request bodies out. The goal is to locate the failed boundary, not replicate sensitive business input.'
      },
      recall: {
        question: 'Recall evaluation-gates: does an observed ready transition mean promotion already happened? Explain again later.',
        answer: 'No. Ready permits approval; promotion is a separate guarded transition. Inspect status, active revision and Effects together. This self-check grants no automatic credit and schedules no reminder.'
      }
    },
    'latency-cost': {
      explanation: {
        title: 'Budget input, output and waiting separately',
        text: 'Input and output can have different illustrative prices, while latency measures waiting rather than spending. A .NET release policy can check both before accepting a candidate. The operations lab uses authored token counts, a synthetic latency and decimal cost arithmetic. Its units are teaching numbers, not Azure prices, tokenizer measurements or provider billing.'
      },
      worked: {
        title: 'Hand-check the exact ReleaseSession estimate',
        steps: [
          { title: 'Calculate the default cost', text: 'In operations-capstone Services/ReleaseSession.cs, Estimate returns (InputTokens + 3m * OutputTokens) / 1000000m. For the default 1,000 input and 500 output tokens, that is (1,000 + 1,500) / 1,000,000 = 0.0025 units. The 0.003 default budget leaves 0.0005 units of illustrative headroom.' },
          { title: 'Increase output rather than changing the price', text: 'For a candidate with 1,000 output tokens and the same 1,000 input tokens, the estimate becomes 0.004 units. It exceeds 0.003 by 0.001, so Check blocks the Budget gate. Raising the budget to 0.005 would permit that gate, but does not establish quality, identity, provider health or latency.' },
          { title: 'Check latency and invalid bounds separately', text: 'The default synthetic LatencyMs is 500; the passing maximum is 2,000. A value of 2,001 blocks Latency even with a sufficient budget. Estimate itself rejects token counts outside 1–100,000; Check validates counts before calling it. Waiting on the approval screen changes neither the authored latency nor this calculation.' }
        ],
        result: 'Default cost fits; extra output can exceed the allowance. Cost never overrides a latency failure.'
      },
      guided: {
        task: 'For 2,000 input and 1,000 output tokens, compute cost against budget 0.005. Then lower only budget to 0.0049. Keep all other passing defaults.',
        hint: 'Multiply output by three, divide by one million, and use the inclusive estimate-less-than-or-equal budget condition.',
        solution: 'The estimate is (2,000 + 3,000) / 1,000,000 = 0.005. Equality passes Budget. At 0.0049 the same candidate is over by 0.0001, so Budget blocks. These are synthetic policy outcomes, not actual charges.',
        expected: 'A passing exact allowance and a blocked smaller allowance, with the arithmetic shown.'
      },
      transfer: {
        task: 'Conceptual .NET catalog explainer: repeated requests suggest caching. Is a key containing only product question text enough when supplier prices are permission-restricted?',
        answer: 'No. A proposed cache must respect trusted access scope and relevant content/model revisions, with permission checks before serving data. This release lab implements no shared answer cache; its budget calculation does not prove a cache is safe.'
      },
      recall: {
        question: 'Recall tokens and context: do character count and these authored token counts establish actual provider usage? Revisit later.',
        answer: 'No. Real usage needs the selected provider or tokenizer accounting. The lesson counts are arithmetic fixtures. Reflection grants no automatic credit or scheduled reminder.'
      }
    },
    'azure-release': {
      explanation: {
        title: 'Approval, promotion and health are different evidence',
        text: 'A checked candidate can be approved before any release effect occurs. After promotion, a small smoke check supplies separate health evidence. A .NET release simulation makes those distinctions visible through status and active revision. Azure slot architecture is an external design topic here; local V1/V2 strings are not cloud resources or deployment receipts.'
      },
      worked: {
        title: 'Trace promotion and three possible smoke outcomes',
        steps: [
          { title: 'Approve a checked candidate', text: 'In operations-capstone Services/ReleaseSession.cs, a fresh session starts Active V1, Status Idle and Effects zero. Check gives Ready for defaults; Approve gives Approved while leaving V1 and zero effects. Promote requires that exact candidate and check, all passing gates and no previous effect. It sets V2, Effects one and AwaitingSmoke.' },
          { title: 'Inspect health after the effect', text: 'From separately prepared promoted sessions, Smoke("healthy") produces Complete with V2. Smoke("bad") restores V1 and reports RolledBack. Smoke("unknown") reports Unknown while V2 remains active. Rollback does not decrement Effects: one local promotion occurred. Unknown supplies neither a successful health result nor evidence that V1 was restored.' },
          { title: 'Keep the external architecture distinct', text: 'For a conceptual Azure App Service design, identify staging and production slots, their configuration, identities and resource permissions. Managed identity configuration belongs to each slot; validate the intended target context. A startup response alone cannot demonstrate your entire business journey. Those design questions add no Azure call to ReleaseSession.Promote or Smoke, which only mutate session state.' }
        ],
        result: 'The simulation separates readiness, permission, effect and health. Azure needs evidence from actual resources.'
      },
      guided: {
        task: 'Trace Check, Approve, Promote, Smoke("unknown"), Replay, then Promote again. State the final status, active revision and effect count.',
        hint: 'CanPromote requires Approved and Effects zero. Replay only records an existing outcome.',
        solution: 'The final state remains Unknown, V2, Effects one. Replay adds an audit observation; another Promote cannot pass its guard. Health stays unconfirmed. A separate fresh session is another exercise, not reconciliation of a remote release.',
        expected: 'Preserved uncertainty and exactly one local promotion, with no invented rollback or recovery operation.'
      },
      transfer: {
        task: 'Conceptual .NET booking deployment: startup returns success, but the first permitted reservation lookup fails. What did startup establish, and what should a smoke path cover?',
        answer: 'Startup established only the path it exercised. Define a small critical booking journey that checks required authorization and dependencies, with a known rollback target and an evidence-based response to failure or uncertainty.'
      },
      recall: {
        question: 'Recall identity-secrets: does a successful DEMO policy match establish production-slot permissions? Revisit later.',
        answer: 'No. Trusted authentication and target-resource authorization need separate evidence. The selector proves only a local comparison. Reflection has no automatic credit or reminder.'
      }
    },
    'capstone-drills': {
      explanation: {
        title: 'Practice the failures as deliberately as success',
        text: 'An acceptance drill starts with a specific input and expected observable outcome. Use separate drills for permission, changed evidence, failed health and uncertain results. The SupportDesk projects are independent learning labs. The .NET operations capstone checks synthetic release evidence; it does not combine, run or deploy every feature from the preceding ten units.'
      },
      worked: {
        title: 'Read three independent ReleaseSession drills',
        steps: [
          { title: 'Establish the successful path', text: 'In operations-capstone Verification/Verify.cs, the production service is checked, approved and promoted, then receives healthy smoke. Expected result: Complete with one effect. Approval alone leaves zero effects. This distinguishes permission, promotion and later health evidence. These are source expectations, not a model benchmark.' },
          { title: 'Test a stop before any effect', text: 'Trace a fresh ReleaseSession through Check, Approve and Cancel, then attempt Promote. CanPromote fails; Active remains V1 and Effects remains zero. A separate denial drill uses Deny for the same no-promotion outcome. Cancellation and denial preserve their distinct statuses, even though both prevent the local release effect.' },
          { title: 'Test uncertainty after one effect', text: 'In another fresh session, Check, Approve and Promote precede Smoke("unknown"). Replay records unknown without changing Status, Active or Effects. Edit, Check, Approve and another Promote cannot make that session successful. The verifier exercises this lock. No authoritative remote receipt or reconciliation service resolves uncertainty here.' }
        ],
        result: 'Separate drills yield Complete/V2/one effect, Cancelled/V1/zero effects, and Unknown/V2/one effect.'
      },
      guided: {
        task: 'Write expected observations for fresh sessions with SafetyFailures 1, Budget 0.0024, and bad smoke after an approved promotion. Include status, active revision and effects.',
        hint: 'The default estimate is 0.0025. A failed pre-release gate differs from failed health after promotion.',
        solution: 'Safety and budget cases are Blocked, V1, zero effects. The bad-smoke case is RolledBack, V1, one effect. A common active revision does not erase the different histories. Read the failed gate or smoke audit to explain each outcome.',
        expected: 'Three expected triples explaining why rollback retains the promotion count.'
      },
      transfer: {
        task: 'Conceptual .NET supplier onboarding: design one acceptance drill for edited approval and one for an unknown provisioning response, without actually provisioning anything.',
        answer: 'Specify that editing approved supplier details requires fresh review before an effect. Specify that an uncertain response remains unresolved until authoritative evidence arrives; replaying a display must not create another supplier. These are proposed requirements for a different system.'
      },
      recall: {
        question: 'Recall multimodal-inputs: does acknowledging evidence resolve its conflicts? Connect that answer to Unknown release health later from memory.',
        answer: 'No. Review and replay preserve observations; neither supplies missing truth. Completion remains self-reported learning, without automatic credit, reminders, certification or proof of a combined deployed application.'
      }
    }
  };

  const glossary = [
    { term: 'Operator set', definition: 'A versioned collection of ONNX operation definitions. Model/runtime compatibility includes supported operations and versions, not only a matching file extension.', lessonIds: ['onnx-quantization'], aliases: ['opset', 'operator-set version'] },
    { term: 'Metric cardinality', definition: 'The number of distinct metric label combinations that create separate time series. Bounded operation and outcome labels avoid a new series for every customer or request.', lessonIds: ['observability'], aliases: ['metric series cardinality', 'label cardinality'] }
  ];

  return { lessons, glossary };
});
