const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const modulePath = path.join(root, 'assets/learning-support-b.js');
const content = require('../assets/curriculum.js');
const advanced = require('../assets/advanced-catalog.js');

// Literal curriculum-to-implementation expectations catch correct-looking references
// accidentally copied from another unit, as well as missing distributed sources.
const mappings = [
  ['vector-arrays', 'semantic-search', 'search', 'supportdesk-semantic-search', 'SearchEngine.cs', 'Vectorize'],
  ['cosine-similarity', 'semantic-search', 'search', 'supportdesk-semantic-search', 'SearchEngine.cs', 'Cosine'],
  ['embedding-meaning', 'semantic-search', 'search', 'supportdesk-semantic-search', 'SearchEngine.cs', 'Vectorize'],
  ['embedding-storage', 'semantic-search', 'search', 'supportdesk-semantic-search', 'SearchEngine.cs', 'ModelSpace'],
  ['vector-indexes', 'semantic-search', 'search', 'supportdesk-semantic-search', 'SearchEngine.cs', 'Search'],
  ['hybrid-search', 'semantic-search', 'search', 'supportdesk-semantic-search', 'SearchEngine.cs', 'Search'],
  ['retrieval-first', 'document-answers', 'rag', 'supportdesk-grounded-answers', 'RetrievalService.cs', 'Answer'],
  ['document-chunks', 'document-answers', 'rag', 'supportdesk-grounded-answers', 'RetrievalService.cs', 'Chunk'],
  ['evidence-selection', 'document-answers', 'rag', 'supportdesk-grounded-answers', 'RetrievalService.cs', 'Pack'],
  ['context-assembly', 'document-answers', 'rag', 'supportdesk-grounded-answers', 'RetrievalService.cs', 'Answer'],
  ['citations-support', 'document-answers', 'rag', 'supportdesk-grounded-answers', 'RetrievalService.cs', 'CheckQuote'],
  ['retrieval-tests', 'document-answers', 'rag', 'supportdesk-grounded-answers', 'RetrievalService.cs', 'Evaluate'],
  ['retrieval-evaluation', 'production-retrieval', 'retrieval', 'supportdesk-retrieval-quality', 'RetrievalMetrics.cs', 'Measure'],
  ['ranking-reranking', 'production-retrieval', 'retrieval', 'supportdesk-retrieval-quality', 'RetrievalEngine.cs', 'Score'],
  ['index-freshness', 'production-retrieval', 'retrieval', 'supportdesk-retrieval-quality', 'RetrievalEngine.cs', 'Publish'],
  ['retrieval-permissions', 'production-retrieval', 'retrieval', 'supportdesk-retrieval-quality', 'RetrievalEngine.cs', 'CanRead'],
  ['document-injection', 'production-retrieval', 'retrieval', 'supportdesk-retrieval-quality', 'RetrievalEngine.cs', 'Search'],
  ['retrieval-tracing', 'production-retrieval', 'retrieval', 'supportdesk-retrieval-quality', 'RetrievalEngine.cs', 'Recheck'],
  ['workflow-or-agent', 'agents-workflows', 'workflow', 'supportdesk-bounded-workflow', 'Workflow.cs', 'RunAsync'],
  ['workflow-state', 'agents-workflows', 'workflow', 'supportdesk-bounded-workflow', 'Workflow.cs', 'SetRequest'],
  ['workflow-budgets', 'agents-workflows', 'workflow', 'supportdesk-bounded-workflow', 'Workflow.cs', 'Step'],
  ['agent-framework', 'agents-workflows', 'workflow', 'supportdesk-bounded-workflow', 'Workflow.cs', 'Phase'],
  ['mcp-capabilities', 'agents-workflows', 'workflow', 'supportdesk-bounded-workflow', 'Workflow.cs', 'RunAsync'],
  ['workflow-recovery', 'agents-workflows', 'workflow', 'supportdesk-bounded-workflow', 'Workflow.cs', 'Reconcile'],
  ['images-ocr', 'model-choices', 'inputs', 'supportdesk-attachment-review', 'Intake.cs', 'Normalize'],
  ['speech-transcripts', 'model-choices', 'inputs', 'supportdesk-attachment-review', 'Intake.cs', 'Observation'],
  ['multimodal-inputs', 'model-choices', 'inputs', 'supportdesk-attachment-review', 'Intake.cs', 'HasConflict'],
  ['local-inference', 'model-choices', 'inputs', 'supportdesk-attachment-review', 'ModelPolicy.cs', 'Choose'],
  ['onnx-quantization', 'model-choices', 'inputs', 'supportdesk-attachment-review', 'ModelPolicy.cs', 'Choose'],
  ['finetuning-decision', 'model-choices', 'inputs', 'supportdesk-attachment-review', 'ModelPolicy.cs', 'Choose'],
  ['identity-secrets', 'azure-operations', 'operations', 'supportdesk-operations-capstone', 'ReleaseSession.cs', 'Check'],
  ['evaluation-gates', 'azure-operations', 'operations', 'supportdesk-operations-capstone', 'ReleaseSession.cs', 'Check'],
  ['observability', 'azure-operations', 'operations', 'supportdesk-operations-capstone', 'ReleaseTelemetry.cs', 'Record'],
  ['latency-cost', 'azure-operations', 'operations', 'supportdesk-operations-capstone', 'ReleaseSession.cs', 'Estimate'],
  ['azure-release', 'azure-operations', 'operations', 'supportdesk-operations-capstone', 'ReleaseSession.cs', 'Smoke'],
  ['capstone-drills', 'azure-operations', 'operations', 'supportdesk-operations-capstone', 'ReleaseSession.cs', 'Replay']
];
const load = () => require(modulePath);
const nonblank = (value, label) => assert.ok(typeof value === 'string' && value.trim().length > 0, label);
const strings = (value, label) => { assert.ok(Array.isArray(value), label); value.forEach(s => nonblank(s, label)); };

test('support B exists before it can provide learning resources', () => {
  assert.ok(fs.existsSync(modulePath), 'Task1b support module is missing');
});

test('classic script and CommonJS expose the same dependency-free AcademySupportB contract', () => {
  const support = load();
  assert.deepEqual(Object.keys(support).sort(), ['glossary', 'lessons', 'units']);
  const sandbox = {};
  vm.runInNewContext(fs.readFileSync(modulePath, 'utf8'), sandbox, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(sandbox.AcademySupportB)), support);
  assert.deepEqual(Object.keys(sandbox), ['AcademySupportB']);
});

test('all 36 lessons reference meaningful exact symbols in the correct distributable lab', () => {
  const support = load();
  assert.deepEqual(Object.keys(support.lessons).sort(), mappings.map(row => row[0]).sort());
  assert.deepEqual(advanced.lessons.map(l => l.id).sort(), mappings.map(row => row[0]).sort());
  for (const [id, unit, manifest, folder, file, symbol] of mappings) {
    assert.equal(content.lessons.find(l => l.id === id).unitId, unit, id);
    const lesson = support.lessons[id];
    strings(lesson.keywords, id); assert.ok(lesson.keywords.length >= 2, id);
    const ref = lesson.source;
    assert.equal(ref.path, `labs/${folder}/Services/${file}`, id);
    assert.equal(ref.symbol, symbol, id);
    assert.ok(require(`../assets/${manifest}-files.js`).some(([name]) => name === `Services/${file}`), id);
    const source = fs.readFileSync(path.join(root, ref.path), 'utf8');
    assert.match(source, new RegExp(`\\b${symbol}\\b`), `${id}: exact source token`);
    for (const field of ['kind', 'task', 'expected', 'command']) nonblank(ref[field], `${id}.${field}`);
    assert.ok(ref.task.length > 50 && ref.expected.length > 35, `${id}: actionable practice`);
    assert.equal(ref.command, `dotnet run --project labs/${folder} -- --verify`, id);
    const program = fs.readFileSync(path.join(root, 'labs', folder, 'Program.cs'), 'utf8');
    assert.ok(program.includes('--verify'), `${id}: real verification entry point`);
  }
});

test('prerequisites are known, unique, acyclic concepts rather than default reading order', () => {
  const support = load();
  const known = new Set(content.lessons.map(l => l.id));
  const graph = Object.fromEntries(content.lessons.map(l => [l.id, support.lessons[l.id]?.prerequisites || l.prerequisites]));
  for (const [id, lesson] of Object.entries(support.lessons)) {
    strings(lesson.prerequisites, id);
    assert.equal(new Set(lesson.prerequisites).size, lesson.prerequisites.length, id);
    for (const pre of lesson.prerequisites) assert.ok(known.has(pre) && pre !== id, `${id} -> ${pre}`);
    // Read order stays in the original content; curriculum may later attach support.
    assert.notDeepEqual(lesson.prerequisites, advanced.lessons.find(l => l.id === id).prerequisites, `${id}: copied reading order`);
  }
  function visit(id, stack = []) {
    assert.ok(!stack.includes(id), `prerequisite cycle: ${[...stack, id].join(' -> ')}`);
    for (const pre of graph[id] || []) visit(pre, [...stack, id]);
  }
  for (const id of known) visit(id);
  for (const [id, required] of [
    ['vector-arrays', ['input-features']], ['retrieval-first', ['useful-context', 'hybrid-search']],
    ['retrieval-permissions', ['tool-authorization', 'embedding-storage']],
    ['mcp-capabilities', ['tool-function', 'tool-authorization']],
    ['onnx-quantization', ['models', 'local-inference']],
    ['capstone-drills', ['azure-release', 'workflow-recovery', 'retrieval-permissions', 'multimodal-inputs']]
  ]) for (const pre of required) assert.ok(support.lessons[id].prerequisites.includes(pre), `${id} needs ${pre}`);
});

test('six unit reviews offer three explainable scenario checks and independent transfer practice', () => {
  const { units } = load();
  assert.deepEqual(Object.keys(units).sort(), [...new Set(mappings.map(row => row[1]))].sort());
  for (const [id, unit] of Object.entries(units)) {
    nonblank(unit.scope, id); assert.equal(unit.recap.length, 3, id);
    for (const recap of unit.recap) {
      nonblank(recap.question, id); assert.equal(recap.options.length, 3, id);
      assert.ok(Number.isInteger(recap.answer) && recap.answer >= 0 && recap.answer < 3, id);
      assert.equal(new Set(recap.options.map(o => o.text)).size, 3, id);
      for (const option of recap.options) { nonblank(option.text, id); nonblank(option.why, id); }
    }
    nonblank(unit.challenge.task, id); strings(unit.challenge.checks, id);
    assert.ok(unit.challenge.checks.length >= 3, id);
    nonblank(unit.challenge.solution, id);
    const folder = mappings.find(row => row[1] === id)[3];
    assert.equal(unit.challenge.command, `dotnet run --project labs/${folder} -- --verify`);
  }
  assert.equal(units['semantic-search'].recap[0].answer, 1, 'orthogonal vector prediction');
  assert.equal(units['azure-operations'].recap[0].answer, 2, 'per-million cost prediction');
});

test('ONNX and MCP explain separate decisions with small worked tasks and answers', () => {
  const { lessons } = load();
  for (const [id, titles] of [
    ['onnx-quantization', ['ONNX', 'Runtime', 'Execution provider', 'Quantization', 'Calibration', 'Performance']],
    ['mcp-capabilities', ['Tools', 'Resources', 'Prompts', 'Transport', 'Protocol and permissions']]
  ]) {
    const topics = lessons[id].microtopics;
    assert.deepEqual(topics.map(t => t.title), titles, id);
    for (const topic of topics) for (const key of ['title', 'text', 'task', 'answer']) nonblank(topic[key], `${id}.${key}`);
  }
  for (const unit of Object.values(load().units)) assert.match(unit.scope, /practice|simulation|fixture|toy|extractive/i);
  assert.match(lessons['embedding-meaning'].source.kind, /toy/i);
  assert.match(lessons['retrieval-first'].source.kind, /extractive/i);
  assert.match(lessons['mcp-capabilities'].source.expected, /no MCP|not.*MCP/i);
  assert.match(lessons['onnx-quantization'].source.expected, /no ONNX|not.*ONNX/i);
});

test('glossary supports advanced search aliases and only links to real lessons', () => {
  const { glossary } = load();
  assert.ok(Array.isArray(glossary));
  const known = new Set(content.lessons.map(l => l.id));
  const lookup = term => glossary.find(e => e.term.toLowerCase() === term.toLowerCase());
  for (const term of ['RAG', 'Embedding', 'Vector', 'ONNX', 'Quantization', 'MCP', 'Agent', 'OCR']) {
    const entry = lookup(term); assert.ok(entry, term);
    assert.ok(entry.aliases.length > 0 && entry.lessonIds.length > 0, term);
  }
  assert.ok(lookup('RAG').aliases.includes('retrieval augmented generation'));
  assert.ok(lookup('MCP').aliases.includes('model context protocol'));
  assert.ok(lookup('OCR').aliases.includes('optical character recognition'));
  assert.ok(lookup('ONNX').lessonIds.includes('onnx-quantization'));
  assert.equal(new Set(glossary.map(e => e.term.toLowerCase())).size, glossary.length);
  for (const entry of glossary) {
    nonblank(entry.term, 'term'); nonblank(entry.definition, entry.term);
    strings(entry.aliases, entry.term); strings(entry.lessonIds, entry.term);
    for (const id of entry.lessonIds) assert.ok(known.has(id), `${entry.term} -> ${id}`);
    assert.ok(!['llm', 'token', 'prompt', 'temperature'].includes(entry.term.toLowerCase()), 'basic LLM glossary belongs to support A');
  }
});
