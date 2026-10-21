/* Authored Unit 3 teaching companion. Data only: no execution, grading or progress changes. */
(function (root, factory) {
  const value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.AcademyTeachingLanguage = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const lessons = {
    'generated-text': {
      explanation: {
        title: 'Learned patterns supply possible continuations',
        text: 'An LLM uses learned numeric parameters and the current request context to score the next token. Sampling selects a continuation, then generation repeats. This can produce useful language without checking a database. A fluent sentence about a refund does not establish that money moved.'
      },
      worked: {
        title: 'Separate wording, evidence and the local sample',
        steps: [
          { title: 'List the known facts', text: 'Fictional ticket: “I see two charges dated 12 June.” There are two reported charges and one date. No payment lookup or refund receipt accompanies this message.' },
          { title: 'Compare two authored drafts', text: '“Please share the charge references” asks for missing information. “We refunded one charge” adds an unsupported event. These are teaching sentences, not measured model outputs. Either could sound polite; only the first avoids inventing a completed action.' },
          { title: 'Trace the fixture instead', text: 'In labs/supportdesk-draft-replies/Services/SampleDraftReplyService.cs, StreamAsync validates the ticket and yields six fixed strings. Both this billing ticket and a parcel ticket receive the same chunks, beginning with “Hello,”. No token prediction happens in Sample mode.' }
        ],
        result: 'You can explain both an unsupported claim and why a fixed local reply supplies no evidence of model understanding.'
      },
      guided: {
        task: 'On paper, underline the extra claim in “I see two charges” → “Your refund arrives Friday.” Rewrite the draft as one question.',
        hint: 'Which date or completed action is actually supported by the input?',
        solution: 'The refund and Friday arrival are invented. A suitable rewrite is “Could you share the dates and references of the two charges?”',
        expected: 'A question about missing evidence, without a refund promise.'
      },
      transfer: {
        task: 'A fictional .NET catalog app receives “Does lamp L42 come in blue?” Its draft says “Three blue lamps are in stock.” What evidence is missing?',
        answer: 'Color availability and stock quantity require current catalog and inventory records. Ask for or retrieve those facts before asserting them; plausible completion cannot supply them.'
      },
      recall: {
        question: 'Revisit training from Unit 1: does generating another reply necessarily update model parameters? Explain aloud and revisit tomorrow.',
        answer: 'Ordinary inference uses existing parameters. Another request changes available context, not necessarily the model. This explanation is a self-check, with no automatic credit.'
      },
      deepDive: [
        { title: 'Pretraining and instruction tuning', text: 'Pretraining learns broad patterns, commonly by predicting tokens across many examples. Instruction tuning is further training on instruction-and-response examples to improve following requests. Neither guarantees obedience or truth.', task: 'Does “never invent a refund” become a guaranteed constraint after instruction tuning?', answer: 'No. Learned behavior can fail; application checks and evidence review still matter.' },
        { title: 'Attention relates positions', text: 'In “The parcel missed its delivery,” attention can weight relationships between token positions while building internal representations. It is a numeric mechanism, not human thought or a fact lookup.', task: 'Does relating “its” to “parcel” establish a delivery date?', answer: 'No. That relationship helps process language; it supplies no missing tracking record.' }
      ]
    },
    'tokens-context': {
      explanation: {
        title: 'Count three different things separately',
        text: 'Words are readable language units; tokens are pieces chosen by a model tokenizer; delivery chunks are strings passed to the UI. One chunk can contain many tokens or part of a word. Neither string.Length nor the number of chunks measures a model context window.'
      },
      worked: {
        title: 'Budget a request, then compare local limits',
        steps: [
          { title: 'Use an explicitly fictional capacity', text: 'Imagine 1200 tokens total: 160 for instructions, 360 for the ticket, 200 for history, 80 for framing, and 300 reserved for output. That is 1100, leaving 100. These are authored counts, not tokenizer results or a real model limit.' },
          { title: 'Change one allocation', text: 'Adding a 180-token old conversation gives 1280, which exceeds this toy budget by 80. Removing irrelevant history can restore room. Preserve the ticket’s current facts; do not delete an important constraint simply to make arithmetic fit.' },
          { title: 'Read the actual application bounds', text: 'In Services/DraftLimits.cs, InputCharacters is 2000, OutputCharacters is 6000, and OutputTokens is 512. Validate checks blank or oversized tickets. The optional OpenAiDraftReplyService uses 512 as max_output_tokens; the lab has no tokenizer. Sample chunks are delivery fragments, not a 512-token model run.' }
        ],
        result: 'The toy request needs trimming; the real character checks alone cannot prove a request fits a selected model.'
      },
      guided: {
        task: 'Keep the toy allocations, but change output reserve from 300 to 450 and omit the extra old conversation. Work out the new total and deficit.',
        hint: 'Start from 1100 and replace only the output allocation.',
        solution: '1100 − 300 + 450 = 1250. Reduce at least 50 tokens of justified input or revise the reserve; then account for any additional overhead.',
        expected: '1250 total, 50 over the fictional capacity.'
      },
      transfer: {
        task: 'A fictional .NET invoice explainer has 250 tokens of invoice facts and 700 of repeated greetings. Which should it trim first, and does a 2000-character invoice prove it fits?',
        answer: 'Trim irrelevant greetings while preserving invoice facts. Characters do not establish token count; use the selected model’s accounting for the complete request and output reserve.'
      },
      recall: {
        question: 'Recall generated-text: why can a fully delivered sentence still be wrong? Explain before opening the answer, and revisit tomorrow.',
        answer: 'Delivery completion establishes receipt of text, not factual support. A generated refund claim still needs evidence. This is a self-check, not automatic lesson credit.'
      },
      deepDive: [
        { title: 'Request context is not parameter training', text: 'Learned parameters are numbers fitted during training. Request context supplies information for this inference. Later, RAG can retrieve passages into that context; retrieval itself does not train the model or permanently install the passages as knowledge.', task: 'If a policy passage is omitted next time, must the model remember it?', answer: 'No. Supply required evidence again; do not assume cross-request memory.' }
      ]
    },
    'first-provider-call': {
      explanation: {
        title: 'Start at the injected C# service',
        text: 'In this InteractiveServer lab, Home.razor runs GenerateAsync on the server and calls its injected Drafts service. There is no HTTP controller or DTO endpoint between this component and IDraftReplyService. The browser connects through Blazor; external provider HTTP begins only inside the optional adapter.'
      },
      worked: {
        title: 'Follow the sample before reading the external request',
        steps: [
          { title: 'Name the real input and output', text: 'For fictional input “My parcel is late.” in labs/supportdesk-draft-replies, Home.razor passes ticket and generation.Token into StreamAsync. IDraftReplyService returns IAsyncEnumerable<string>: strings delivered over time, not one JSON reply object.' },
          { title: 'Resolve Sample and consume chunks', text: 'Program.cs selects SampleDraftReplyService in Sample mode. Its six fixed chunks arrive after cancellable 70-millisecond delays. Home.razor appends each chunk to draft and calls StateHasChanged. Successful enumeration, followed by a cancellation check, sets complete = true.' },
          { title: 'Inspect optional HTTP without sending it', text: 'OpenAiDraftReplyService uses HttpClient to POST https://api.openai.com/v1/responses. Its JSON has configured model, instructions, input = ticket, stream = true, store = false, max_output_tokens = 512. Bearer authorization is a header. This lab installs no Microsoft.Extensions.AI package; it uses raw HTTP.' }
        ],
        result: 'The local call supplies a string and token. Only the optional server adapter turns them into a provider HTTP request.'
      },
      guided: {
        task: 'Read OpenAiDraftReplyService.cs only. Trace HTTP 429, then a valid text delta followed by an early stream end. Do either complete a draft?',
        hint: 'Find the HTTP status guard and the response.completed branch.',
        solution: '429 throws DraftReplyException before text parsing. A delta can reach the UI, but premature end throws. Completion requires response.completed, completed status, nonempty output, and no error or incomplete details. Refusal, failed/incomplete events, malformed JSON and unexpected content types also throw; no error body becomes draft text.',
        expected: 'Both paths fail; any partial text stays unavailable for review. No automatic retry or sample fallback occurs.'
      },
      transfer: {
        task: 'A fictional .NET booking page calls an injected itinerary service. Would drawing a conceptual browser-to-server HTTP request prove this lab has a corresponding controller endpoint?',
        answer: 'No. That is a proposed HTTP boundary for another design. Trace actual registrations and calls before claiming an endpoint exists; this lab uses an injected service directly.'
      },
      recall: {
        question: 'Recall models from Unit 1: what belongs outside a model boundary? Explain and revisit tomorrow.',
        answer: 'Input validation, permissions and application state remain application responsibilities. A model supplies an output; it does not replace those decisions. Self-explanation earns no automatic credit.'
      },
      deepDive: [
        { title: 'A small async bridge', text: 'C# async allows a method to suspend at await while an operation is pending. Await resumes when it finishes or throws. It does not mean “run a new thread.” Here await foreach waits for successive strings rather than blocking for the whole reply.', task: 'Can awaiting another chunk still throw?', answer: 'Yes: cancellation or a provider failure can surface during enumeration.' }
      ]
    },
    'server-credentials': {
      explanation: {
        title: 'Registration decides which implementation runs',
        text: 'Dependency injection supplies an implementation when Home.razor asks for IDraftReplyService. Program.cs makes that choice on the server. The page does not receive a key or choose a provider. Sample is the default when DRAFT_REPLY_PROVIDER is absent; explicitly choosing Sample avoids an inherited OpenAI selection.'
      },
      worked: {
        title: 'Trace configuration names without reading values',
        steps: [
          { title: 'Follow the Sample branch', text: 'Read Program.cs as source only. With mode Sample, AddScoped<IDraftReplyService, SampleDraftReplyService>() registers the local service. This branch never reads OPENAI_API_KEY or OPENAI_MODEL. A configured key alone does not switch modes.' },
          { title: 'Contrast optional startup', text: 'The OpenAI branch reads those two named server settings and checks for blanks. Missing configuration returns startup failure, before app.RunAsync. Valid configuration supplies key and model to OpenAiDraftReplyService. Unknown mode also fails; neither case silently substitutes a sample.' },
          { title: 'Locate the outgoing boundary', text: 'The adapter places authorization in an HTTP Bearer header and the model identifier in request JSON. Home.razor gets draft strings and safe status messages. LabMode.IsSample controls its visible mode label. The model name selects a model; it is not the authorization secret.' }
        ],
        result: 'You can identify the selection, configuration and display paths using names alone, without exposing any configuration values.'
      },
      guided: {
        task: 'Make a paper trace for “Sample selected, model setting absent” and “OpenAI selected, model setting absent.” Predict whether the lab reaches its running page.',
        hint: 'The missing-setting check is inside the OpenAI branch, not before the branch.',
        solution: 'Sample can start without a model or key. OpenAI stops at its configuration guard when the model is absent, even if a key exists. This exercise needs no environment inspection or service startup.',
        expected: 'One local-service registration; one explicit startup failure.'
      },
      transfer: {
        task: 'A fictional .NET catalog editor calls an external translation service. A teammate proposes storing its key in browser local storage so the page can call it. Where should the credential boundary be?',
        answer: 'Use a server adapter with server configuration. Return the translation and safe status to the page. Browser storage exposes the key to users and scripts. This is a design exercise, not a new catalog endpoint in this lab.'
      },
      recall: {
        question: 'Recall first-provider-call: where does actual external HTTP start, and what calls the local service? Explain without opening any secrets; revisit tomorrow.',
        answer: 'Home.razor calls injected IDraftReplyService directly on the server. OpenAiDraftReplyService starts provider HTTP only when selected. Naming those boundaries is a self-check, not automatic credit.'
      },
      deepDive: [
        { title: 'Server execution does not imply production identity', text: 'App.razor places Routes in InteractiveServer mode. That locates component C# on the server, but this local teaching lab has no production authentication. Server execution alone does not establish which staff member may request a translation or draft.', task: 'Does a hidden key prove caller permission?', answer: 'No. Credential placement and caller authorization answer different questions.' }
      ]
    },
    'timeouts-cancellation': {
      explanation: {
        title: 'A token carries a request to stop',
        text: 'CancellationToken is a C# signal that waiting work can observe. Home.razor owns a CancellationTokenSource for each generation; Stop calls Cancel. Each service links that signal with a deadline. Cancellation asks cooperative work to stop; it does not erase text already displayed or guarantee zero remote usage.'
      },
      worked: {
        title: 'Stop after the second sample fragment',
        steps: [
          { title: 'Start one owned generation', text: 'Home.razor clears draft, complete and reviewed, sets running, and passes generation.Token to StreamAsync. SampleDraftReplyService links it to a source with DraftLimits.Timeout of 30 seconds. It awaits Task.Delay for 70 milliseconds before each yield.' },
          { title: 'Cancel during the next wait', text: 'Suppose the first two chunks have arrived: “Hello,” plus the greeting sentence. Stop signals the caller source. The next canceled delay throws OperationCanceledException. Home.razor also checks generation.Token before appending chunks and before marking completion, protecting a late continuation.' },
          { title: 'Classify the unfinished result', text: 'The catch checks generation.IsCancellationRequested: true gives Stopped, otherwise cancellation gives Timed out. Partial draft text remains and complete stays false. Finally clears stop and releases running. A new Generate clears partial text rather than resuming it.' }
        ],
        result: 'Two received chunks remain inspectable, but review stays disabled. A deadline follows the timeout path, not a successful completion.'
      },
      guided: {
        task: 'Read the optional adapter and SseReader.cs. Trace the linked token through waiting for headers, opening the body, and reading events. Then explain a stall after headers.',
        hint: 'ResponseHeadersRead returns before the entire body has arrived. The deadline must cover body reads too.',
        solution: 'The linked token reaches SendAsync, ReadAsStreamAsync, SseReader.ReadAsync and its reader.ReadAsync. A stalled body therefore remains cancellable. A deadline can throw even after some deltas reached the UI.',
        expected: 'An unfinished draft with a timeout status, unless caller cancellation is also observed and selects Stopped.'
      },
      transfer: {
        task: 'A fictional .NET invoice preview is waiting for a PDF service. Its Cancel button hides the spinner but passes no token to HTTP. Has the waiting operation been canceled?',
        answer: 'No. The screen changed, but HTTP may continue. Pass the owned token through the actual waits, handle cancellation, and keep any partial preview incomplete.'
      },
      recall: {
        question: 'Recall tokens-context: can reaching a 512-token output cap be treated as the same thing as a user pressing Stop? Explain and revisit tomorrow.',
        answer: 'No. An output cap limits generation length; Stop signals caller cancellation. An incomplete provider event throws DraftReplyException here, rather than becoming caller cancellation. Self-check only; no automatic credit.'
      },
      deepDive: [
        { title: 'When two causes overlap', text: 'If Stop and the service deadline overlap, the UI labels cancellation using the caller source state when its catch runs. That is its display rule, not proof of which signal occurred first. Disposing the component cancels work and suppresses later UI updates.', task: 'Should Dispose render a final status?', answer: 'No. Home.razor guards disposed state and does not render from Dispose.' }
      ]
    },
    'blazor-streaming': {
      explanation: {
        title: 'An asynchronous sequence grows the visible draft',
        text: 'IAsyncEnumerable<string> means a sequence whose next string may require waiting. In Home.razor, await foreach consumes that sequence, draft += chunk joins it, and StateHasChanged requests a render. These InteractiveServer updates reach the browser through Blazor. Arrival of readable text alone does not set complete.'
      },
      worked: {
        title: 'Track fields through a complete sample run',
        steps: [
          { title: 'Wait for the live component', text: 'In labs/supportdesk-draft-replies, Home.razor leaves Generate disabled until OnAfterRender sets interactiveReady. GenerateAsync guards running and disposed, clears old text and review, then sets running. The server component calls injected Drafts directly, without a controller request.' },
          { title: 'Append fixed strings in order', text: 'SampleDraftReplyService first yields “Hello,\n\n”, then “Thank you for contacting our support team. ”. After two iterations draft is their concatenation and complete is still false. The remaining four strings continue this same fixed reply for every valid ticket.', code: '// Existing Home.razor loop body, excerpt only:\nif (disposed) return;\ngeneration.Token.ThrowIfCancellationRequested();\ndraft += chunk;\nStateHasChanged();' },
          { title: 'Finish delivery before enabling review', text: 'After enumeration and a final cancellation check, complete becomes true. Finally sets running false, enabling the review checkbox. Checking it sets reviewed locally. TicketChanged clears draft, complete and reviewed as input changes, preventing a review mark from carrying over to another ticket.' }
        ],
        result: 'Successful delivery enables review; it neither verifies facts nor sends a reply. Stop or failure retains partial text with review disabled.'
      },
      guided: {
        task: 'Make a paper state table for start, two chunks, successful completion, checking review, then editing the ticket. Record draft, complete, running and reviewed.',
        hint: 'Follow GenerateAsync, its finally block, the checkbox binding and TicketChanged separately.',
        solution: 'Start: empty/false/true/false. Two chunks: partial/false/true/false. After success and finally: full/true/false/false. Check review: full/true/false/true. Edit: empty/false/false/false.',
        expected: 'No stale review mark or previous draft survives a ticket edit.'
      },
      transfer: {
        task: 'A fictional .NET booking itinerary preview receives a full sentence, then its stream fails. A reviewer changes the destination afterward. Which states need invalidating?',
        answer: 'The failed preview must stay incomplete even if its sentence looks finished. Changing destination clears the old preview and review state; new input needs a fresh successful generation. This is conceptual application behavior, not another implemented lab.'
      },
      recall: {
        question: 'Recall timeouts-cancellation: why check cancellation after the last chunk but before complete = true? Explain aloud and revisit tomorrow.',
        answer: 'Stop can arrive near stream completion. The final check prevents an observed canceled request from being marked successful. Self-explanation does not automatically award lesson credit.'
      },
      deepDive: [
        { title: 'Text display and component lifetime', text: 'The actual <pre> uses @draft, so Razor encodes HTML-looking text. Dispose marks disposed and cancels active work; continuations guard that state. These are separate protections: encoding controls displayed text, while cancellation and guards protect the old component.', task: 'Would encoding alone stop an old asynchronous update?', answer: 'No. The component still needs its lifecycle checks.' }
      ]
    }
  };

  const glossary = [
    { term: 'Learned parameter', definition: 'A numeric value fitted during model training and reused during inference. Supplying a new ticket or retrieved passage as request context does not itself update these values.', lessonIds: ['generated-text', 'tokens-context'], aliases: ['model weights', 'pretrained parameters'] },
    { term: 'Pretraining', definition: 'An initial broad training stage that learns patterns from many examples, commonly through token prediction. Later requests use those learned parameters rather than repeating that training.', lessonIds: ['generated-text'], aliases: ['pre-training'] },
    { term: 'Instruction tuning', definition: 'Further training on instruction-and-response examples to improve how a model follows requests. It does not guarantee obedience, factual correctness or application authorization.', lessonIds: ['generated-text'], aliases: ['instruction-tuned'] },
    { term: 'Attention', definition: 'A numeric mechanism that weights relationships between token positions while constructing model representations. It is not human thought, a memory guarantee or a database lookup.', lessonIds: ['generated-text', 'tokens-context'], aliases: ['self-attention'] },
    { term: 'Async and await', definition: 'C# language features for expressing operations that can suspend while awaiting work, then resume with a result or exception. They do not by themselves start a new thread.', lessonIds: ['first-provider-call', 'timeouts-cancellation'], aliases: ['async/await'] },
    { term: 'Asynchronous sequence', definition: 'A sequence whose next element may arrive after waiting. IAsyncEnumerable<string> supplies strings over time, and await foreach consumes them; enumeration can also fail or be canceled.', lessonIds: ['first-provider-call', 'blazor-streaming'], aliases: ['IAsyncEnumerable', 'await foreach', 'async iterator'] },
    { term: 'Dependency injection', definition: 'Supplying a registered service implementation to a component through its declared dependency. Program.cs chooses the draft service; Home.razor asks for IDraftReplyService.', lessonIds: ['first-provider-call', 'server-credentials'], aliases: ['DI', 'service registration'] },
    { term: 'Server-sent events', definition: 'An HTTP event stream format. The optional adapter reads blank-line-delimited SSE events and extracts typed text deltas; a network fragment is not necessarily a complete event.', lessonIds: ['first-provider-call', 'timeouts-cancellation'], aliases: ['SSE', 'text/event-stream'] }
  ];

  return { lessons, glossary };
});
