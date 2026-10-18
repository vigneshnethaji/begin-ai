/* Authored optional learning support for Units 6–11. No progress or grading effects. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AcademySupportB = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const lessons = {};
  const command = folder => 'dotnet run --project labs/' + folder + ' -- --verify';
  function lesson(id, keywords, prerequisites, folder, file, symbol, kind, task, expected, microtopics) {
    lessons[id] = { keywords, prerequisites, source: {
      path: 'labs/' + folder + '/Services/' + file, symbol, kind, task, expected, command: command(folder)
    } };
    if (microtopics) lessons[id].microtopics = microtopics;
  }
  const search = 'supportdesk-semantic-search';
  const rag = 'supportdesk-grounded-answers';
  const retrieval = 'supportdesk-retrieval-quality';
  const workflow = 'supportdesk-bounded-workflow';
  const inputs = 'supportdesk-attachment-review';
  const operations = 'supportdesk-operations-capstone';

  lesson('vector-arrays', ['vector', 'array', 'dimensions', 'float'], ['input-features'],
    search, 'SearchEngine.cs', 'Vectorize', 'Runnable C# toy vector mapping',
    'Trace Vectorize("money back invoice"). Write the four array positions and explain which input words increment each position. Compare this to the features entering your earlier classifier.',
    'The toy array is [2,1,0,0]: two refund-axis words and one invoice-axis word. The lab checks money back -> [2,0,0,0]; no embedding model is trained or called.');
  lesson('cosine-similarity', ['cosine', 'dot product', 'normalization', 'zero vector'], ['vector-arrays', 'input-features'],
    search, 'SearchEngine.cs', 'Cosine', 'Runnable C# vector arithmetic',
    'Calculate Cosine([3,4],[1,0]) by hand, then inspect the double arithmetic in Cosine. Predict identical, opposite, orthogonal and zero-vector cases before running verification.',
    'The dot product is 3 and lengths are 5 and 1, so cosine is 0.6. Verification checks 1, -1, 0 and the explicit safe-zero policy of 0; mismatched dimensions are rejected.');
  lesson('embedding-meaning', ['embedding', 'semantic meaning', 'toy axes', 'representation'], ['vector-arrays', 'models'],
    search, 'SearchEngine.cs', 'Vectorize', 'Runnable C# toy substitute for learned embeddings',
    'Compare keyword and vector search for money back. Find the switch entries that make it resemble refund, then predict what an unmapped phrase such as purple umbrella produces.',
    'Keyword search misses money back; toy vector search returns ART-101. Purple umbrella produces a zero array and no vector hits. This hand-written vocabulary does not demonstrate learned semantic understanding.');
  lesson('embedding-storage', ['embedding space', 'model version', 'dimension', 'provenance'], ['vector-arrays', 'embedding-meaning'],
    search, 'SearchEngine.cs', 'ModelSpace', 'Runnable C# model-space validation',
    'Inspect the Article record and ModelSpace, then predict Search("refund", space: "toy-topics/v2/4"). Explain why keeping four dimensions does not make two model versions interchangeable.',
    'Search rejects the different model-space string even though the dimension count matches. Verification checks query-space and stored-space mismatches; compatible vectors must be rebuilt together.');
  lesson('vector-indexes', ['exact scan', 'ANN', 'approximate nearest neighbor', 'top-k'], ['cosine-similarity', 'embedding-storage'],
    search, 'SearchEngine.cs', 'Search', 'Runnable C# exact scan; ANN is conceptual',
    'Trace Where, Select, OrderByDescending and Take in Search. For refund password with category Account and k=1, predict which article survives. Explain what would change if top-k ran before the filter.',
    'ART-201 is the stable Account result because filtering precedes scoring and top-k. Verification checks this order. Every eligible row is scored; this lab implements no approximate index or vector database.');
  lesson('hybrid-search', ['hybrid search', 'keyword', 'lexical', 'vector score'], ['cosine-similarity', 'embedding-meaning'],
    search, 'SearchEngine.cs', 'Search', 'Runnable C# toy weighted hybrid ranking',
    'For money back, inspect the hybrid formula and calculate the score when vector similarity is 1 and keyword coverage is 0. Predict whether a higher number proves an answer is true.',
    'ART-101 scores 0.65 = 0.65*1 + 0.35*0. The literal-score verification checks both components. The weights are teaching policy, and ranking similarity neither verifies a claim nor grants access.');

  lesson('retrieval-first', ['RAG', 'retrieve', 'grounding', 'abstention'], ['useful-context', 'hybrid-search'],
    rag, 'RetrievalService.cs', 'Answer', 'Runnable C# extractive answer, not LLM generation',
    'Trace Answer("support hours") from Retrieve through Pack to the complete-sentence test. Repeat with a zero-word budget and explain how missing evidence changes the result.',
    'A reviewed local sentence can be returned with its chunk citation; budget 0 selects no evidence and returns Abstained with no citation. The lab copies supported sentences and makes no generation call.');
  lesson('document-chunks', ['chunking', 'overlap', 'document revision', 'chunk ID'], ['useful-context', 'embedding-storage'],
    rag, 'RetrievalService.cs', 'Chunk', 'Runnable C# word-based chunking',
    'Use an Article kb-test at r2 containing one two three four five six seven. Hand-trace Chunk with size=4 and overlap=1. Explain why changing revision must change the citation identity.',
    'Chunks kb-test@r2:c1 and kb-test@r2:c2 contain one two three four and four five six seven. Verification checks these literals and rejects overlap equal to size; splitting uses words, not model tokens.');
  lesson('evidence-selection', ['context budget', 'packing', 'selected evidence', 'excluded evidence'], ['document-chunks', 'tokens-context'],
    rag, 'RetrievalService.cs', 'Pack', 'Runnable C# greedy word-budget packing',
    'Trace Pack on ranked chunks costing 4, 7 and 2 words with a budget of 6. Predict the selected and excluded lists, and explain why a rejected large chunk need not end the scan.',
    'The 4-word and 2-word chunks fit, using 6 words; the 7-word chunk is excluded. Packing continues after an exclusion. The verification covers bounded packing and zero budget; words are only a teaching budget proxy.');
  lesson('context-assembly', ['evidence data', 'instruction boundary', 'JSON context', 'prompt injection'], ['prompt-roles', 'document-chunks', 'evidence-selection'],
    rag, 'RetrievalService.cs', 'Answer', 'Runnable C# extractive flow and illustrative provider template',
    'Inspect the serialized instruction, question and evidenceData fields in Answer. Find the unreviewed article that asks for administrator permissions, and trace whether its text can become application authority.',
    'The template keeps evidence as a separate data field; only Reviewed chunks can supply an answer sentence. Razor encodes displayed text. No model receives this JSON, and JSON separation alone would not stop a real model obeying hostile text.');
  lesson('citations-support', ['citation', 'quote check', 'provenance', 'support'], ['document-chunks', 'validate-responses'],
    rag, 'RetrievalService.cs', 'CheckQuote', 'Runnable C# exact quote check',
    'Inspect a returned chunk ID and copy an exact substring from its text into CheckQuote. Then alter the words and try a made-up chunk ID. Decide what each outcome actually proves.',
    'Outcomes are Exact quote found, Quote not found and Unknown citation. An exact match proves only that those characters occur in that selected chunk, not that a broader claim or the document itself is true.');
  lesson('retrieval-tests', ['precision', 'recall', 'relevant IDs', 'evaluation'], ['evidence-selection', 'evaluate-model'],
    rag, 'RetrievalService.cs', 'Evaluate', 'Runnable C# set-based retrieval metrics',
    'Hand-evaluate retrieved IDs [A,B] against relevant IDs [A,C,D]. Inspect Evaluate to see how duplicates and empty sets are handled before judging any answer wording.',
    'Hits=1, precision=1/2 and recall=1/3. Sets remove duplicate IDs; an empty retrieved set has precision 0. These retrieval measures do not evaluate a generated answer, and fixtures are not a benchmark.');

  lesson('retrieval-evaluation', ['recall@k', 'MRR', 'reciprocal rank', 'labelled set'], ['retrieval-tests', 'train-test-split'],
    retrieval, 'RetrievalMetrics.cs', 'Measure', 'Runnable C# labelled toy retrieval evaluation',
    'Predict Measure(["wrong","A-101"],["A-101"],2), then reduce k to 1. Explain why an unlabelled query should not be presented as successful evaluation.',
    'At k=2 recall is 1 and reciprocal rank is 0.5; at k=1 both are 0. Empty relevant labels set Labelled=false. The small authored cases measure this fixture, not general retrieval quality.');
  lesson('ranking-reranking', ['reranking', 'title weight', 'candidate retrieval', 'ranking'], ['hybrid-search', 'retrieval-evaluation'],
    retrieval, 'RetrievalEngine.cs', 'Score', 'Runnable C# toy title-weighted reranking',
    'Inspect Score with tuned=false and true. Compare baseline and tuned password reset at k=1, then run Evaluate. Explain why more keyword repetitions can outrank the useful article.',
    'Baseline favors repetitive A-102; tuned adds four times title matches and promotes A-101. The two labelled fixture queries expose the difference. There is no learned reranker or production benchmark.');
  lesson('index-freshness', ['index revision', 'publication', 'delete', 'stale response'], ['embedding-storage', 'document-chunks'],
    retrieval, 'RetrievalEngine.cs', 'Publish', 'Runnable C# in-memory index publication simulation',
    'On a fresh engine, target A-101 and read its expiry. Call UpdateReset, search again, then Publish and repeat. Separately predict whether DeleteReset must wait for Publish to block access.',
    'The snapshot says ten minutes until Publish exposes five minutes at a new revision. DeleteReset blocks current access immediately and clears cache; deletion safety does not wait for index publication.');
  lesson('retrieval-permissions', ['authorization filter', 'cache scope', 'revocation', 'tenant'], ['tool-authorization', 'embedding-storage'],
    retrieval, 'RetrievalEngine.cs', 'CanRead', 'Runnable C# fictional caller-scope policy',
    'Search as teamA for password reset, then inspect CanRead before scoring and cache return. RevokeReset and repeat an identical request. Predict whether a cached A-101 may still be served.',
    'Team B and restricted rows never enter teamA scoring. Revoking A-101 changes access version and clears cache; rechecking old responses blocks them. Team selectors are server-owned demo fixtures, not authentication.');
  lesson('document-injection', ['document injection', 'untrusted text', 'authority', 'allowlist'], ['prompt-roles', 'tool-authorization', 'retrieval-permissions'],
    retrieval, 'RetrievalEngine.cs', 'Search', 'Runnable C# retrieval-only injection fixture',
    'Retrieve A-103 as teamA and inspect its instruction to read B-201. Trace Search to decide whether document text can change the caller, issue another lookup or execute its script.',
    'Search returns local excerpts under the original caller; the hostile passage does not grant B-201 access. This lab makes no model call and renders text through encoding, so it does not prove a live model resists injection.');
  lesson('retrieval-tracing', ['retrieval trace', 'stage', 'cache hit', 'stale response'], ['index-freshness', 'retrieval-permissions', 'retrieval-evaluation'],
    retrieval, 'RetrievalEngine.cs', 'Recheck', 'Runnable C# safe retrieval trace and response recheck',
    'Save a Search response, then revoke A-101 and call Recheck on the old response. Compare its trace stages with a fresh cache miss and a valid cache hit to locate the boundary that stopped stale evidence.',
    'Recheck returns no items with scope-rechecked and stale-response-blocked stages. A valid hit records scope-rechecked/cache-hit/return. IDs and stages locate the issue without turning a green trace into answer-quality proof.');

  lesson('workflow-or-agent', ['agent', 'workflow', 'deterministic', 'orchestration'], ['tool-function', 'tool-execution'],
    workflow, 'Workflow.cs', 'RunAsync', 'Runnable C# deterministic workflow; no model-directed agent',
    'Trace RunAsync for Fictional billing invoice is missing, then for Please help. Identify who chooses the next step and whether the lookup is a model-selected capability.',
    'The billing fixture reaches AwaitingApproval after 3 steps and 1 authored lookup; Please help reaches NeedsInformation without a lookup. C# selects all transitions; no agent model or framework runs.');
  lesson('workflow-state', ['state machine', 'snapshot', 'short-term memory', 'approval'], ['workflow-or-agent', 'tool-authorization'],
    workflow, 'Workflow.cs', 'SetRequest', 'Runnable C# session-only state and approval invalidation',
    'Run a billing request and approve it, then SetRequest to a login request before Complete. Inspect Draft, Approved and State. Explain why an approval cannot apply to changed text.',
    'The edit clears the draft and approval and returns State to Idle; Complete creates no preview. Receipts remain only in this session for exact requests. There is no durable memory or database orchestration.');
  lesson('workflow-budgets', ['step budget', 'call budget', 'deadline', 'cancellation'], ['workflow-or-agent', 'timeouts-cancellation'],
    workflow, 'Workflow.cs', 'Step', 'Runnable C# bounded deterministic execution',
    'Predict a normal request with MaxSteps=3: run, approve and Complete. Compare a loop fixture with MaxSteps=3 and a request with MaxCalls=0. Count effects as well as visible states.',
    'Three steps can prepare a draft but cannot perform the fourth preview step. The loop stops at 3 steps with no calls; zero calls stops before lookup. All three leave Effects=0 and expose BudgetExceeded.');
  lesson('agent-framework', ['agent framework', 'orchestration boundary', 'typed state', 'adapter'], ['workflow-or-agent', 'workflow-state', 'workflow-budgets'],
    workflow, 'Workflow.cs', 'Phase', 'Runnable C# state machine; framework bridge is conceptual',
    'Use the Phase enum to sketch where a future framework adapter would report AwaitingApproval, Cancelled and Unknown. Decide which checks must remain in application code when an orchestrator changes.',
    'Map framework events to explicit states while preserving budgets, exact-request approval and effect receipts. Verification exercises those C# boundaries. No Microsoft Agent Framework package or model-directed loop is implemented.');
  lesson('mcp-capabilities', ['MCP', 'model context protocol', 'tools', 'resources', 'prompts', 'transport'], ['tool-function', 'tool-authorization', 'workflow-or-agent'],
    workflow, 'Workflow.cs', 'RunAsync', 'Runnable C# capability allowlist analogy; MCP is conceptual',
    'Run the unknown-capability fixture and find the lookup_help allowlist boundary. Classify a callable lookup, a readable help document and a reusable triage template as MCP tool, resource and prompt concepts.',
    'send_email is denied before any lookup or preview. The mapping is conceptual: no MCP discovery, transport or server runs here. A protocol contract cannot grant caller permissions.', [
      { title: 'Tools', text: 'A tool describes a callable operation and its inputs. Treat a proposed call like an untrusted API request.', task: 'A client proposes lookup_help and then send_email. Which operation is allowed in this workflow?', answer: 'Only lookup_help is allowlisted. Run unknown-capability to observe send_email denied, Calls=0 and Effects=0.' },
      { title: 'Resources', text: 'A resource identifies context a client can read, such as a help document. Describing it does not establish the caller can read it.', task: 'A help resource points to a team B document while the trusted caller is team A. Should its URI bypass the retrieval filter?', answer: 'No. Check the trusted caller scope before returning content, just as CanRead does in the earlier retrieval lab.' },
      { title: 'Prompts', text: 'An MCP prompt is a reusable message template offered by a server. Template text is neither a permission grant nor proof that an action happened.', task: 'A triage template says summarize, then email the customer. Does selecting it authorize sending?', answer: 'No. The host still applies its operation allowlist, caller authorization and any required approval to the exact action.' },
      { title: 'Transport', text: 'Transport carries protocol messages between processes, for example standard input/output or Streamable HTTP. The lab has no MCP connection.', task: 'Two clients use different transports for the same lookup contract. Does HTTP automatically make the lookup more authorized?', answer: 'No. Transport choice changes communication and deployment concerns; the server still validates identity, inputs and access.' },
      { title: 'Protocol and permissions', text: 'MCP standardizes how capabilities are described and exchanged. Your application decides who may use them and what effects are permitted.', task: 'A discovered tool accepts ticketId as a string. The model supplies another team\'s ticket ID. What check is missing?', answer: 'Typed argument validation alone is insufficient: resolve trusted caller scope and authorize access to that specific ticket before execution.' }
    ]);
  lesson('workflow-recovery', ['Unknown', 'receipt', 'reconcile', 'retry', 'idempotency'], ['workflow-state', 'workflow-budgets', 'tool-retries', 'tool-audit'],
    workflow, 'Workflow.cs', 'Reconcile', 'Runnable C# local receipt-based recovery simulation',
    'Run the unknown fixture, approve and Complete, then call RecoverAsync, Replay and Reconcile. Predict Effects after each operation. Contrast this with failed-before-preview recovery.',
    'Unknown has one local effect; recovery and replay do not repeat it. Reconcile uses the existing in-process receipt to reach Complete with Effects=1. A real remote Unknown requires authoritative evidence, not an approval click.');

  lesson('images-ocr', ['OCR', 'image', 'optical character recognition', 'confidence'], ['models', 'validate-responses'],
    inputs, 'Intake.cs', 'Normalize', 'Runnable C# authored image observation; no OCR inference',
    'Normalize the image/image/png fixture with fictional notes. Inspect source ID, amount and confidence, then call Preview without review and explain why reading a number cannot authorize an action.',
    'The fixture yields image-1 amount=120 at confidence 0.92. Unreviewed Preview is Denied with no result. These are authored observations; the app neither reads an image nor understands its scene.');
  lesson('speech-transcripts', ['ASR', 'transcription', 'speaker', 'timestamp', 'uncertainty'], ['models', 'validate-responses'],
    inputs, 'Intake.cs', 'Observation', 'Runnable C# authored transcript metadata; no speech recognition',
    'Normalize audio/audio.wav and inspect the Observation fields. Preserve speaker and start/end time when explaining the amount. Decide whether a confidence of 0.61 establishes that the customer said 170.',
    'audio-1 records amount=170, Speaker 1, seconds 12–16 and confidence 0.61. Metadata locates uncertainty for review; it does not prove the words. No audio file is transcribed in this fixture.');
  lesson('multimodal-inputs', ['multimodal', 'provenance', 'conflict', 'human review'], ['images-ocr', 'speech-transcripts', 'validate-responses'],
    inputs, 'Intake.cs', 'HasConflict', 'Runnable C# conflicting authored evidence review',
    'Normalize the bundle fixture and compare image, audio and text amounts. Review and Preview, then change the notes. Predict whether review resolves the conflicting values or survives the edit.',
    'Image/text say 120 and audio says 170; HasConflict stays true even after accepted review. The local preview retains both values. Editing clears evidence, review and result; it does not choose a true amount.');
  lesson('local-inference', ['local inference', 'model memory', 'privacy', 'hardware'], ['models', 'server-credentials'],
    inputs, 'ModelPolicy.cs', 'Choose', 'Runnable C# fictional model eligibility policy; no inference',
    'Predict Choose("text",true,2), Choose("text",true,8) and Choose("vision",true,8). Explain the order of privacy, capability, memory and illustrative score checks.',
    'The outcomes are No eligible profile, local-text and No eligible profile. A high score cannot bypass a hard requirement. The profiles and memory values are authored examples; no model is loaded or executed.');
  lesson('onnx-quantization', ['ONNX', 'ONNX Runtime', 'execution provider', 'quantization', 'calibration', 'performance'], ['models', 'local-inference'],
    inputs, 'ModelPolicy.cs', 'Choose', 'Runnable C# eligibility analogy; ONNX and quantization are conceptual',
    'Use Choose("text",true,2) to observe a memory constraint, then draft a comparison plan for a compatible smaller model. Separate file format, engine, hardware backend, numeric precision and measured quality.',
    'The fictional 4-GiB local profile is ineligible at 2 GiB. No ONNX file, runtime, execution provider or quantization pipeline executes here; a smaller representation would still need compatibility and quality evidence.', [
      { title: 'ONNX', text: 'ONNX is a model representation: a graph of operations, tensors and learned values. Like a file contract, it needs a compatible reader.', task: 'A model exports to ONNX. Does the file extension prove every operation is supported on your target machine?', answer: 'No. Check the actual operations, versions, input shapes and the target runtime/provider support before attempting inference.' },
      { title: 'Runtime', text: 'A runtime is the engine that loads a model and executes its operations. ONNX Runtime is an engine; ONNX is the representation it can consume.', task: 'Your C# app has an ONNX file but no execution engine. Which piece is missing?', answer: 'A compatible runtime plus correct input preprocessing and output interpretation. This lab only simulates eligibility and installs none of these.' },
      { title: 'Execution provider', text: 'An execution provider connects ONNX Runtime to an execution backend such as a CPU or supported accelerator. Operator coverage and fallback behavior matter.', task: 'A GPU exists but one operation runs on CPU. Can you infer end-to-end speed from GPU presence alone?', answer: 'No. Confirm provider assignment, unsupported operations, transfer overhead and actual timings for the deployed combination.' },
      { title: 'Quantization', text: 'Quantization represents some model values or operations with lower precision. It may reduce memory or improve speed, but can change quality and needs runtime support.', task: 'A teaching estimate stores 1,000 weights at 4 bytes each, then at 1 byte each. What storage change can you predict?', answer: 'Raw weight bytes fall from 4,000 to 1,000. That is not total model memory or a guaranteed 4x speedup; scales, other tensors and runtime buffers still matter.' },
      { title: 'Calibration', text: 'For static quantization, calibration observes representative inputs to choose numeric ranges. Dynamic approaches choose some ranges during execution instead.', task: 'You calibrate only on short English tickets but deploy long multilingual tickets. What evidence is weak?', answer: 'The calibration inputs do not represent deployment. Use representative calibration examples and a separate held-out quality set; do not tune ranges against the final test set.' },
      { title: 'Performance', text: 'Compare quality, memory and latency on the actual target hardware, with the same preprocessing and inputs. Separate startup cost from repeated inference.', task: 'A synthetic baseline has 95/100 correct at 40 ms; a smaller version has 91/100 at 25 ms. The required minimum is 94/100. Which passes?', answer: 'Only the baseline passes that authored quality gate. Lower latency cannot repair failed quality; these invented numbers are arithmetic practice, not model measurements.' }
    ]);
  lesson('finetuning-decision', ['fine-tuning', 'finetuning', 'held-out evaluation', 'model selection'], ['evaluate-model', 'compare-prompts', 'retrieval-first', 'local-inference'],
    inputs, 'ModelPolicy.cs', 'Choose', 'Runnable C# hard-requirement policy; fine-tuning decision is conceptual',
    'A model gives outdated support hours but follows the requested JSON style. Decide whether to fix source retrieval or train weights. Use Choose to explain why training cannot waive a no-cloud or memory requirement.',
    'Refresh and retrieve the current reviewed hours first; missing current facts alone do not establish a fine-tuning need. Choose only filters fictional profiles. No training, benchmark or quality improvement is performed here.');

  lesson('identity-secrets', ['managed identity', 'least privilege', 'server secrets', 'trusted caller'], ['server-credentials', 'tool-authorization'],
    operations, 'ReleaseSession.cs', 'Check', 'Runnable C# demo identity gate; no Azure authentication',
    'Inspect the Identity gate and predict candidates with Identity="admin" and Identity="demo-release". Explain why an identity string from a browser is not an authenticated production principal.',
    'admin fails the demo gate; demo-release passes only that gate, with all others still required. Verification rejects the arbitrary admin string. The fixed selector is a simulation, not Azure identity or secret storage.');
  lesson('evaluation-gates', ['quality gate', 'safety gate', 'sample count', 'release evaluation'], ['evaluate-model', 'compare-prompts', 'validate-responses'],
    operations, 'ReleaseSession.cs', 'Check', 'Runnable C# gates over authored measurements',
    'Predict Check for Quality=99, Samples=100 and SafetyFailures=1. Contrast Quality=95 with only 10 samples. Decide whether a strong average can compensate for either failed requirement.',
    'Both candidates are Blocked: safety requires zero failures and the sample gate requires at least 20. Passing default synthetic values do not prove real model quality. Verification also rejects invalid and nonfinite values.');
  lesson('observability', ['ActivitySource', 'Meter', 'telemetry', 'safe tags', 'trace'], ['tool-audit', 'retrieval-tracing'],
    operations, 'ReleaseTelemetry.cs', 'Record', 'Runnable C# BCL tracing and counters; no exporter configured',
    'Trace Record("gate","blocked") and compare Record("ticket-body","secret text"). Inspect the allowlists, nullable Activity and counter tags. Decide which information reaches telemetry.',
    'Only allowlisted operation/outcome pairs are emitted, with no body parameter. Unsupported values return immediately. StartActivity may return null without a listener; emitting instrumentation does not configure a collector.');
  lesson('latency-cost', ['token budget', 'per-million', 'decimal', 'latency', 'cache scope'], ['tokens-context', 'timeouts-cancellation', 'retrieval-permissions'],
    operations, 'ReleaseSession.cs', 'Estimate', 'Runnable C# illustrative cost arithmetic and latency gate',
    'Hand-calculate Estimate for 1,000 input and 500 output tokens at the authored rates 1 and 3 units per million. Compare budget 0.0024 and latency 2,001 ms with the gate requirements.',
    'Estimate is 0.0025 units; budget 0.0024 fails, and latency above 2,000 ms fails independently. These are synthetic prices and timings. The operations lab implements no shared cache or provider billing.');
  lesson('azure-release', ['deployment slot', 'smoke check', 'rollback', 'Unknown'], ['evaluation-gates', 'identity-secrets', 'workflow-recovery'],
    operations, 'ReleaseSession.cs', 'Smoke', 'Runnable C# local release simulation; no Azure deployment',
    'On separate fresh sessions run Check, Approve and Promote, then Smoke with healthy, bad and unknown. Predict Status, Active and Effects, and explain why a successful approval is not a smoke check.',
    'Healthy retains V2/Complete; bad restores V1/RolledBack; unknown stays V2/Unknown. Each has exactly one promotion effect. This rehearses evidence handling locally and performs no App Service slot operation.');
  lesson('capstone-drills', ['acceptance drill', 'replay', 'failure recovery', 'scope'], ['azure-release', 'workflow-recovery', 'retrieval-permissions', 'multimodal-inputs'],
    operations, 'ReleaseSession.cs', 'Replay', 'Runnable C# acceptance simulation across independent learning concepts',
    'Run the unknown smoke drill, call Replay twice and attempt Promote again. Compare a separate edited-approval drill. Relate the evidence to workflow receipts, retrieval revocation and attachment review invalidation.',
    'Unknown stays Unknown with Effects=1; replay adds audit observations only. Editing before promotion invalidates approval and leaves Effects=0. These independent labs award no automatic course credit or certification.');

  function question(question, answer, choices) {
    return { question, options: choices.map(([text, why]) => ({ text, why })), answer };
  }
  const units = {
    'semantic-search': {
      scope: 'Optional transfer practice with four-dimensional toy vectors, explicit vocabulary and exact scans. No learned embedding service or ANN index; no core credit or certification.',
      recap: [
        question('A query vector [1,0] meets article [0,1]. What cosine score should you predict?', 1, [
          ['1 because the dimensions match.', 'Matching dimensions allow comparison but do not imply matching direction.'],
          ['0 because the directions are orthogonal.', 'The dot product is zero and both lengths are nonzero.'],
          ['-1 because the articles differ.', 'Opposite direction, not mere difference, produces -1.']
        ]),
        question('Two stored vectors each have four values but different model-space versions. How should you repair search?', 2, [
          ['Ignore the version because the shapes match.', 'Equal array length does not establish comparable meaning.'],
          ['Increase top-k until a result appears.', 'Top-k changes result count, not incompatible coordinates.'],
          ['Rebuild compatible query and article vectors in one space.', 'The space/version must match; preserve document identity while rebuilding.']
        ]),
        question('money back scores 0 lexically and 1 by toy vector. What does a hybrid score of 0.65 establish?', 0, [
          ['Its rank under the chosen weights.', 'The lab uses 0.65 vector plus 0.35 lexical; it is not a truth probability.'],
          ['A 65% probability that the refund policy is true.', 'A weighted similarity score is not calibrated factual confidence.'],
          ['Permission to return any matching document.', 'As in earlier tool authorization, ranking cannot grant access.']
        ])
      ],
      challenge: {
        task: 'Repair a proposed search that mixes vector versions and filters category after top-k. Predict refund password under Account at k=1, then compare money back in keyword and hybrid modes. Keep input validation from the rules lessons.',
        checks: ['Reject incompatible spaces before ranking.', 'Apply category filtering before scoring and Take(k).', 'Predict ART-201 for the Account query and ART-101 at hybrid score 0.65 for money back.'],
        solution: 'Follow Search: validate shape and model space, restrict eligible rows, calculate scores, sort with ordinal ID ties, then take k. Keyword money back has no hits; its hybrid match is a hand-authored semantic analogy, not learned inference.',
        command: command(search)
      }
    },
    'document-answers': {
      scope: 'Optional extractive RAG practice over reviewed local text, word budgets and exact quotes. No generated answer provider, automatic core credit or certification.',
      recap: [
        question('A relevant chunk is 12 words but the evidence budget is 0. What should Answer do?', 2, [
          ['Return a remembered policy without citation.', 'The source-first boundary must not invent missing evidence.'],
          ['Ignore the budget for the highest-ranked chunk.', 'Ranking cannot override the resource constraint.'],
          ['Abstain because no selected evidence supports an answer.', 'Pack selects nothing, so the extractive service returns Abstained.']
        ]),
        question('CheckQuote finds exact words under a known chunk ID. What is established?', 0, [
          ['That substring exists in the selected chunk.', 'Exact string membership is useful provenance, not a truth judgment.'],
          ['Every claim in the answer is factually correct.', 'A quote may not support the whole claim, and the source can be wrong.'],
          ['The document may override application instructions.', 'Quoted source data has no authority, just as ticket text cannot grant tool permission.']
        ]),
        question('Retrieved IDs are [A,B]; relevant IDs are [A,C,D]. Which evaluation is correct?', 1, [
          ['Precision 1/3, recall 1/2.', 'This reverses the denominators.'],
          ['Precision 1/2, recall 1/3.', 'One hit among two retrieved and three relevant documents.'],
          ['Both are 1 because A was found.', 'Finding one relevant document does not erase misses or irrelevant returns.']
        ])
      ],
      challenge: {
        task: 'A proposed answer cites an invented chunk and ignores the budget when its best passage is too large. Repair the evidence path using traceable chunks, packing and quote checking; predict what happens when all useful chunks are excluded.',
        checks: ['Keep document ID, revision and chunk ID together.', 'Never exceed the word budget or invent a citation.', 'Return Abstained without a citation when selected reviewed evidence cannot support a complete sentence.'],
        solution: 'Retrieve and Pack first; inspect selected/excluded lists. Answer only from an eligible complete sentence in reviewed evidence. CheckQuote must use an ID from that selected set. Evaluate retrieved IDs separately from the quality of any resulting answer.',
        command: command(rag)
      }
    },
    'production-retrieval': {
      scope: 'Optional fixture-based retrieval evaluation, snapshot publication, access revocation and safe traces. No production identity, vector database, core credit or certification.',
      recap: [
        question('teamA cached A-101, then its access was revoked. What is the correct return policy?', 1, [
          ['Serve the cache until its expiry time.', 'An old TTL cannot override current authorization.'],
          ['Recheck current access and block stale responses.', 'CanRead and Recheck enforce current scope even when a result was previously allowed.'],
          ['Ask document text whether access is still allowed.', 'As in tool authorization, untrusted content cannot decide permissions.']
        ]),
        question('UpdateReset changes source expiry to five minutes, but the snapshot still says ten. What exposes the update?', 0, [
          ['Publish a new snapshot and invalidate cached results.', 'Publish advances the index revision and clears cache.'],
          ['Increase the title weight.', 'Ranking changes cannot update document contents.'],
          ['Treat the old snapshot as the new source version.', 'That hides stale evidence instead of publishing the update.']
        ]),
        question('The relevant document is second at k=2. What are recall and reciprocal rank for one relevant label?', 2, [
          ['Recall 0.5 and reciprocal rank 1.', 'The single relevant document was found, but not at rank one.'],
          ['Both 0 because it is not first.', 'Top-k recall and reciprocal rank give partial ranking information.'],
          ['Recall 1 and reciprocal rank 0.5.', 'All labelled relevance is found; the first relevant result is at rank two.']
        ])
      ],
      challenge: {
        task: 'Diagnose a teamA answer based on an old cached reset passage after revocation. Repair the proposed cache-only path, then compare baseline and tuned rankings on the same labelled queries before claiming improvement.',
        checks: ['Filter scope before candidate scoring and before cached return.', 'Recheck saved responses after revocation or publication.', 'Report recall and reciprocal rank on labelled fixtures, without general benchmark claims.'],
        solution: 'Use trusted demo caller scope, access version and index revision in cache handling, plus live CanRead checks. RevokeReset invalidates access immediately. Publish exposes source updates. Inspect trace stages to separate stale evidence, authorization and ranking failures; no generated answer runs here.',
        command: command(retrieval)
      }
    },
    'agents-workflows': {
      scope: 'Optional deterministic workflow practice with local receipts and bounded preview effects. Framework and MCP concepts are comparisons only; no live agent, transport, core credit or certification.',
      recap: [
        question('A normal request uses three steps to prepare a draft and has MaxSteps=3. Can approval create a preview?', 0, [
          ['No; the preview is another bounded step.', 'Complete checks Step before creating an effect; approval does not expand the budget.'],
          ['Yes; a reviewer overrides the step allowance.', 'Approval authorizes an exact request but does not remove resource limits.'],
          ['Yes; preparing the draft already sent it.', 'The draft is local data; no preview or send has happened.']
        ]),
        question('A preview receipt exists but its acknowledgement was lost. What should recovery do?', 2, [
          ['Automatically perform the preview again.', 'A duplicate effect is possible when the earlier result is uncertain.'],
          ['Declare failure and erase the receipt.', 'Missing acknowledgement does not establish that no effect occurred.'],
          ['Keep Unknown, replay observationally, then reconcile reliable evidence.', 'The local receipt can resolve this fixture without another effect; remote systems need authoritative evidence.']
        ]),
        question('An MCP capability is discovered with a valid input schema. Is the caller authorized to use it?', 1, [
          ['Yes, discovery grants access.', 'Discovery describes a capability; it is not a permission decision.'],
          ['Only after application authorization and required approval checks.', 'Typed inputs, trusted caller scope and effect approval remain separate responsibilities.'],
          ['Yes, if it uses HTTP transport.', 'Transport carries messages and cannot replace caller authorization.']
        ])
      ],
      challenge: {
        task: 'Predict a billing workflow that is approved, then edited, and a separate unknown-acknowledgement workflow. Repair a proposed automatic retry on Unknown while retaining step, call and time budgets.',
        checks: ['Editing clears current draft and approval before effects.', 'Unknown replay never increases Effects beyond 1.', 'Only a known pre-preview failure is retry-eligible, within the remaining budget and with fresh approval.'],
        solution: 'Use SetRequest to invalidate the current snapshot. RunAsync prepares but does not complete. Complete requires exact approval and another step. RecoverAsync reopens only known pre-effect failure; Unknown uses the existing receipt through Reconcile. These local effects are previews, never sent messages.',
        command: command(workflow)
      }
    },
    'model-choices': {
      scope: 'Optional authored OCR/transcript fixture review and fictional model-choice policy. No live OCR, speech, ONNX or fine-tuning; no core credit or certification.',
      recap: [
        question('Image/text evidence says 120; audio says 170 at confidence 0.61. What should review preserve?', 2, [
          ['Only 120, because two sources agree.', 'A majority among authored observations does not establish the true amount.'],
          ['Only 170, because speech is more recent.', 'No trusted recency policy or source verification establishes that conclusion.'],
          ['Both values, provenance and unresolved conflict.', 'Review acknowledges evidence; it does not manufacture certainty or authorize a payment.']
        ]),
        question('A vision task forbids cloud transfer. The only eligible local profile handles text. What is the result?', 0, [
          ['No eligible profile.', 'Capability and privacy are hard filters before illustrative scoring.'],
          ['Use cloud-general because its score is high.', 'Score cannot override a no-cloud policy.'],
          ['Rename the text profile to vision.', 'A label does not add model capability or evidence of compatibility.']
        ]),
        question('A quantized candidate is faster but fails the same held-out quality gate. What should the comparison conclude?', 1, [
          ['Accept it because smaller models are always better.', 'Size and speed do not compensate for a required quality failure.'],
          ['Keep the passing baseline and investigate the quality loss.', 'Use the same inputs and preprocessing; separate calibration from final evaluation.'],
          ['Tune against final test labels until it passes.', 'That leaks evaluation evidence into optimization, like training on test examples.']
        ])
      ],
      challenge: {
        task: 'Repair a proposed attachment preview that drops the audio disagreement and retains approval after note edits. Then select a no-cloud text profile at 2 and 8 GiB, and explain what would need measuring before replacing it with a quantized model.',
        checks: ['Retain source, modality, confidence and transcript times for conflicting observations.', 'Require Normalize and Review again after every input edit.', 'Predict no eligible profile at 2 GiB and local-text at 8 GiB; require separate compatibility, memory, latency and quality evidence for a real model.'],
        solution: 'Keep the complete Observation set and HasConflict; acknowledgement cannot select truth. SetInput clears the accepted snapshot, and Preview requires current reviewed evidence. ModelPolicy filters before scoring. It executes no inference: ONNX format, runtime, provider and precision still need independent verification.',
        command: command(inputs)
      }
    },
    'azure-operations': {
      scope: 'Optional local release simulation over authored measurements. Azure identities, slots and provider costs are not exercised; these independent labs grant no core credit or certification.',
      recap: [
        question('At 1 input and 3 output units per million tokens, what is 1,000 input plus 500 output tokens?', 2, [
          ['2.5 units.', 'This incorrectly uses a per-thousand denominator.'],
          ['0.0015 units.', 'That counts only output and omits the 0.001 input cost.'],
          ['0.0025 illustrative units.', '(1000 + 3*500)/1000000 = 0.0025; these are not current provider prices.']
        ]),
        question('All gates passed, but the candidate changed after approval. What should promotion do?', 0, [
          ['Require fresh gates and approval of the new snapshot.', 'Like earlier workflow and attachment review, approval belongs to exact evidence.'],
          ['Promote because an older candidate passed.', 'Old checks do not establish the new revision or measurements.'],
          ['Accept a browser string saying admin.', 'The demo selector is not trusted production identity, and does not replace evidence.']
        ]),
        question('After one promotion, smoke returns unknown and Replay is called twice. What is established?', 1, [
          ['Rollback completed successfully.', 'Unknown provides no reliable evidence that rollback occurred.'],
          ['Status stays Unknown and Effects stays 1.', 'Replay observes the existing outcome and cannot create success or another promotion.'],
          ['A second promotion is safe because health is missing.', 'As with workflow Unknown, missing evidence cannot justify repeating an effect.']
        ])
      ],
      challenge: {
        task: 'Design three separate release drills: one safety failure despite quality 99, changed evidence after approval, and unknown health after promotion. Compare bad-health rollback with Unknown, and explain how retrieval scope and attachment conflicts would supply separate acceptance evidence.',
        checks: ['SafetyFailures=1 blocks promotion with Effects=0.', 'Edited approval cannot promote until new gates and review pass.', 'Bad smoke restores V1; unknown smoke preserves uncertainty and replay leaves Effects=1.', 'Use only allowlisted telemetry and do not infer prior labs were deployed together.'],
        solution: 'Check all gates rather than averaging away safety. Bind approval to the checked candidate and check number. Promote once, then inspect Status, Active, Effects and Audit. Smoke bad yields RolledBack/V1; unknown yields Unknown/V2. Earlier independent lab verification supplies conceptual acceptance evidence, not an integrated deployment or automatic course completion.',
        command: command(operations)
      }
    }
  };

  const glossary = [
    { term: 'Vector', definition: 'An ordered array of numbers. Similarity calculations require compatible dimensions and meaning; this lab uses four hand-designed topic axes.', lessonIds: ['vector-arrays', 'cosine-similarity'], aliases: ['vectors', 'numeric array', 'dimensions', 'float array'] },
    { term: 'Embedding', definition: 'A numeric representation produced by a model so useful relationships can be compared. The course toy mapping illustrates the shape, not learned representation quality.', lessonIds: ['embedding-meaning', 'embedding-storage'], aliases: ['embeddings', 'text embedding', 'semantic representation', 'embedding model'] },
    { term: 'Cosine similarity', definition: 'The dot product divided by both vector lengths, measuring direction rather than magnitude. Zero vectors need an explicit application policy.', lessonIds: ['cosine-similarity'], aliases: ['cosine', 'dot product', 'normalization', 'vector similarity'] },
    { term: 'Model space', definition: 'The model, revision and representation contract that give vector coordinates their meaning. Matching array length alone does not ensure comparability.', lessonIds: ['embedding-storage'], aliases: ['embedding space', 'vector version', 'model-space mismatch'] },
    { term: 'Approximate nearest neighbor', definition: 'An indexing approach that trades some exact-neighbor recall for search efficiency. The local lab uses an exact scan instead.', lessonIds: ['vector-indexes'], aliases: ['ANN', 'vector index', 'nearest neighbors', 'approximate search'] },
    { term: 'Hybrid search', definition: 'Ranking that combines lexical and vector evidence. Weights must be evaluated; a combined score is not factual confidence.', lessonIds: ['hybrid-search'], aliases: ['keyword plus vector', 'lexical search', 'hybrid retrieval'] },
    { term: 'RAG', definition: 'Retrieval augmented generation: retrieve relevant evidence to inform an answer. This course implements the retrieval and an extractive answer analogue, without calling a generation model.', lessonIds: ['retrieval-first', 'context-assembly'], aliases: ['retrieval augmented generation', 'retrieval-augmented generation', 'grounded answers', 'document questions'] },
    { term: 'Chunk', definition: 'A traceable passage split from a document. Keep document ID, revision and chunk identity so an answer can point to the exact evidence.', lessonIds: ['document-chunks', 'citations-support'], aliases: ['chunking', 'text splitting', 'overlap', 'passage'] },
    { term: 'Abstention', definition: 'Returning no supported answer when selected evidence is inadequate, rather than inventing missing facts.', lessonIds: ['retrieval-first', 'evidence-selection'], aliases: ['abstain', 'unsupported answer', 'no evidence'] },
    { term: 'Citation', definition: 'A pointer to specific evidence. An exact quote check establishes text presence, not that every associated claim is true.', lessonIds: ['citations-support'], aliases: ['citations', 'quote verification', 'source reference', 'provenance'] },
    { term: 'Recall at k', definition: 'The share of labelled relevant documents found in the first k results. Keep relevance labels separate from retrieved results.', lessonIds: ['retrieval-tests', 'retrieval-evaluation'], aliases: ['recall@k', 'retrieval recall', 'top-k recall'] },
    { term: 'Mean reciprocal rank', definition: 'The average of reciprocal positions of the first relevant result for each query, using zero when none is found.', lessonIds: ['retrieval-evaluation', 'ranking-reranking'], aliases: ['MRR', 'reciprocal rank', 'ranking evaluation'] },
    { term: 'Reranking', definition: 'Reordering candidate evidence with another scoring rule or model. This lab illustrates title weighting, not a learned reranker.', lessonIds: ['ranking-reranking'], aliases: ['reranker', 'title weighting', 'candidate ranking'] },
    { term: 'Index freshness', definition: 'Whether a searchable snapshot reflects current source revisions and deletes. Current access must still be checked even before publication catches up.', lessonIds: ['index-freshness', 'retrieval-tracing'], aliases: ['stale index', 'index revision', 'publish snapshot', 'document deletion'] },
    { term: 'Document injection', definition: 'Instructions embedded in retrieved content that try to claim authority. Treat document text as untrusted data and keep access checks in application code.', lessonIds: ['document-injection', 'context-assembly'], aliases: ['indirect prompt injection', 'retrieval injection', 'malicious document'] },
    { term: 'Agent', definition: 'A system in which a model can select subsequent steps or capabilities toward a goal within application limits. The downloaded workflow uses deterministic C# choices instead.', lessonIds: ['workflow-or-agent', 'agent-framework'], aliases: ['agents', 'agentic', 'model-directed loop', 'agent framework'] },
    { term: 'Workflow', definition: 'An explicit sequence or state machine with known transitions. Approval, cancellation and limits remain application responsibilities regardless of orchestration framework.', lessonIds: ['workflow-state', 'workflow-budgets'], aliases: ['state machine', 'bounded workflow', 'orchestration', 'step budget'] },
    { term: 'MCP', definition: 'Model Context Protocol: a contract for exchanging capabilities and context between clients and servers. Describing a capability does not grant permission to execute it.', lessonIds: ['mcp-capabilities'], aliases: ['model context protocol', 'MCP tools', 'MCP resources', 'MCP prompts', 'Streamable HTTP', 'stdio transport'] },
    { term: 'Reconciliation', definition: 'Resolving an uncertain outcome using authoritative evidence before deciding whether another effect is safe. The fixture uses an existing in-process receipt.', lessonIds: ['workflow-recovery', 'capstone-drills'], aliases: ['Unknown outcome', 'lost acknowledgement', 'receipt replay', 'reconcile'] },
    { term: 'OCR', definition: 'Optical character recognition extracts text from images. It does not establish scene understanding, truth or action permission; the course observations are authored fixtures.', lessonIds: ['images-ocr'], aliases: ['optical character recognition', 'image text', 'read screenshot', 'text recognition'] },
    { term: 'Speech recognition', definition: 'Converting audio into text, often with speaker and timing metadata and uncertainty. This course uses authored transcript observations.', lessonIds: ['speech-transcripts'], aliases: ['ASR', 'automatic speech recognition', 'speech to text', 'transcription', 'speaker diarization'] },
    { term: 'Multimodal evidence', definition: 'Evidence from different input forms such as image, audio and text, kept with source and uncertainty rather than flattened into an assumed truth.', lessonIds: ['multimodal-inputs'], aliases: ['multimodal', 'modality', 'attachment conflict', 'evidence fusion'] },
    { term: 'Local inference', definition: 'Executing a model on a selected local device. Compatibility, memory, privacy and quality remain requirements; local execution alone does not prove safety.', lessonIds: ['local-inference'], aliases: ['on-device AI', 'offline inference', 'local model', 'model memory'] },
    { term: 'ONNX', definition: 'Open Neural Network Exchange, a model representation of operations and tensors. A compatible runtime executes it; the attachment lab executes no ONNX model.', lessonIds: ['onnx-quantization'], aliases: ['open neural network exchange', 'ONNX format', 'model graph'] },
    { term: 'ONNX Runtime', definition: 'An execution engine for compatible models, distinct from the ONNX representation. Its execution provider determines the supported hardware backend.', lessonIds: ['onnx-quantization'], aliases: ['ORT', 'inference engine', 'execution provider', 'CPU provider', 'GPU backend'] },
    { term: 'Quantization', definition: 'Using lower precision for some model values or operations, potentially changing memory, speed and quality. Verify the actual runtime and target hardware.', lessonIds: ['onnx-quantization'], aliases: ['quantized', 'INT8', 'lower precision', 'model compression', 'quantisation'] },
    { term: 'Calibration', definition: 'Using representative inputs to estimate numeric ranges for static quantization. Calibration data and held-out final quality evaluation serve different purposes.', lessonIds: ['onnx-quantization'], aliases: ['static quantization', 'representative dataset', 'activation ranges', 'dynamic quantization'] },
    { term: 'Fine-tuning', definition: 'Further training model parameters on task examples. Establish a measured need before choosing it over clearer instructions, validation or refreshed retrieval.', lessonIds: ['finetuning-decision'], aliases: ['fine tuning', 'finetuning', 'fine-tuned', 'task adaptation'] },
    { term: 'Managed identity', definition: 'An identity managed by the hosting platform for an application to access resources. The lab demo string is not such an identity or authentication proof.', lessonIds: ['identity-secrets', 'azure-release'], aliases: ['Azure identity', 'least privilege', 'slot identity', 'workload identity'] },
    { term: 'Observability', definition: 'Using bounded traces, metrics and operational evidence to understand behavior without collecting sensitive request content.', lessonIds: ['observability', 'retrieval-tracing'], aliases: ['telemetry', 'ActivitySource', 'Meter', 'tracing', 'safe tags'] },
    { term: 'Release gate', definition: 'An explicit requirement that must pass for an exact candidate before approval and promotion. Average quality does not cancel a safety failure.', lessonIds: ['evaluation-gates', 'latency-cost'], aliases: ['quality gate', 'safety gate', 'budget gate', 'latency limit'] },
    { term: 'Smoke check', definition: 'A small critical-path health check after a change. Healthy, failed and unknown evidence require different decisions; warm-up alone is not acceptance.', lessonIds: ['azure-release', 'capstone-drills'], aliases: ['smoke test', 'rollback', 'deployment slot', 'release readiness', 'acceptance drill'] }
  ];
  return { lessons, units, glossary };
});
