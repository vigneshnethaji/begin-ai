const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const modulePath = path.join(root, 'assets/learning-support-a.js');
const support = fs.existsSync(modulePath) ? require(modulePath) : null;
const owned = {
  foundations: ['ai-features', 'rules', 'models', 'training', 'predictions', 'choose-approach'],
  'first-mlnet-model': ['data-examples', 'input-features', 'target-labels', 'clean-examples', 'train-test-split', 'mlnet-pipeline', 'evaluate-model', 'save-load'],
  'language-models': ['generated-text', 'tokens-context', 'first-provider-call', 'server-credentials', 'timeouts-cancellation', 'blazor-streaming'],
  'reliable-outputs': ['prompt-roles', 'prompt-examples', 'useful-context', 'structured-json', 'validate-responses', 'compare-prompts'],
  'tools-actions': ['tool-function', 'tool-arguments', 'tool-execution', 'tool-authorization', 'tool-retries', 'tool-audit']
};
const folders = {
  foundations: 'supportdesk-rules', 'first-mlnet-model': 'supportdesk-classifier',
  'language-models': 'supportdesk-draft-replies', 'reliable-outputs': 'supportdesk-ticket-summary',
  'tools-actions': 'supportdesk-ticket-lookup'
};
const manifests = {
  foundations: ['Program.cs'],
  'first-mlnet-model': require('../assets/lab-files.js').map(([file]) => file),
  'language-models': require('../assets/draft-files.js').map(([file]) => file),
  'reliable-outputs': require('../assets/summary-files.js').map(([file]) => file),
  'tools-actions': require('../assets/lookup-files.js').map(([file]) => file)
};
function data() {
  assert.ok(support, 'Task1a support module must exist; tests are added before the module');
  return support;
}
function nonblank(value, label, min = 1) {
  assert.equal(typeof value, 'string', label);
  assert.ok(value.trim().length >= min, label + ' must be meaningful');
}
function strings(value, label, min = 1) {
  assert.ok(Array.isArray(value), label);
  assert.ok(value.length >= min, label);
  value.forEach(item => nonblank(item, label));
  assert.equal(new Set(value).size, value.length, label + ' must not repeat entries');
}

test('exports exactly the 32 existing lessons and five owned unit IDs', () => {
  const value = data();
  assert.deepEqual(Object.keys(value).sort(), ['glossary', 'lessons', 'units']);
  assert.deepEqual(Object.keys(value.lessons).sort(), Object.values(owned).flat().sort());
  assert.deepEqual(Object.keys(value.units).sort(), Object.keys(owned).sort());
  const curriculum = require('../assets/curriculum.js');
  for (const [unit, ids] of Object.entries(owned)) {
    assert.deepEqual(curriculum.lessons.filter(l => l.unitId === unit).map(l => l.id), ids);
  }
});

test('classic offline script exposes the same AcademySupportA content as CommonJS', () => {
  const value = data();
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(modulePath, 'utf8'), context, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(context.AcademySupportA)), value);
});

test('all 32 source pointers resolve to exact symbols in their own distributable lab', async t => {
  const value = data();
  for (const [unit, ids] of Object.entries(owned)) {
    for (const id of ids) await t.test(id, () => {
      const lesson = value.lessons[id];
      assert.deepEqual(Object.keys(lesson).sort(),
        (lesson.microtopics ? ['keywords', 'microtopics', 'prerequisites', 'source'] : ['keywords', 'prerequisites', 'source']).sort());
      strings(lesson.keywords, id + ' keywords', 2);
      const source = lesson.source;
      assert.deepEqual(Object.keys(source).sort(), ['command', 'expected', 'kind', 'path', 'symbol', 'task']);
      assert.ok(!path.isAbsolute(source.path) && !source.path.includes('\\') && !source.path.split('/').includes('..'));
      const prefix = 'labs/' + folders[unit] + '/';
      assert.ok(source.path.startsWith(prefix), id + ' must reference its relevant unit lab');
      assert.ok(manifests[unit].includes(source.path.slice(prefix.length)), id + ' file must be distributed');
      const text = fs.readFileSync(path.join(root, source.path), 'utf8');
      nonblank(source.symbol, id + ' symbol');
      assert.match(source.symbol, /^[A-Za-z_][A-Za-z0-9_]*$/);
      assert.match(text, new RegExp('\\b' + source.symbol + '\\b'), id + ' exact symbol exists');
      nonblank(source.kind, id + ' source kind', 8);
      nonblank(source.task, id + ' learner task', 40);
      assert.match(source.task, /predict|change|trace|compare|classify|repair|inspect|explain|mark|write/i);
      nonblank(source.expected, id + ' expected verification', 40);
      nonblank(source.command, id + ' command', 10);
      assert.ok(source.command.includes(prefix), id + ' command locates the relevant lab from repository root');
      assert.doesNotMatch(source.command, /DRAFT_REPLY_PROVIDER\s*=\s*['"]?OpenAI|OPENAI_API_KEY|curl|Invoke-RestMethod/);
    });
  }
});

test('the rules lesson resolves the real Route method and its shipped prediction cases', () => {
  const source = data().lessons.rules.source;
  assert.equal(source.path, 'labs/supportdesk-rules/Program.cs');
  assert.equal(source.symbol, 'Route');
  const actualSource = fs.readFileSync(path.join(root, source.path), 'utf8');
  assert.match(actualSource, /static string Route\(string message\)/);
  // Literal cases in the delivered C# verifier ground the learner prediction task.
  // Do not execute dotnet here: it creates build outputs in this shared workspace.
  assert.match(actualSource, /\("case-insensitive keyword", "REFUND PLEASE", "Billing"\)/);
  assert.match(actualSource, /\("related wording has no keyword", "Please return my payment", "General"\)/);
  assert.match(source.task, /REFUND PLEASE/);
  assert.match(source.task, /Please return my payment/);
  assert.match(source.expected, /Billing/);
  assert.match(source.expected, /General/);
});

test('semantic prerequisites are valid and acyclic across the existing curriculum', () => {
  const value = data();
  const all = require('../assets/curriculum.js').lessons;
  const byId = new Map(all.map(lesson => [lesson.id, lesson]));
  for (const [id, lesson] of Object.entries(value.lessons)) {
    strings(lesson.prerequisites, id + ' prerequisites', 0);
    for (const prerequisite of lesson.prerequisites) {
      assert.ok(byId.has(prerequisite), id + ': unknown prerequisite ' + prerequisite);
      assert.notEqual(prerequisite, id, id + ': self prerequisite');
    }
  }
  const active = new Set(), visited = new Set();
  function visit(id) {
    assert.ok(!active.has(id), 'prerequisite cycle through ' + id);
    if (visited.has(id)) return;
    active.add(id);
    const prerequisites = value.lessons[id]?.prerequisites || byId.get(id).prerequisites;
    for (const previous of prerequisites) {
      assert.ok(byId.has(previous), 'unknown prerequisite ' + previous);
      visit(previous);
    }
    active.delete(id); visited.add(id);
  }
  all.forEach(lesson => visit(lesson.id));
  assert.deepEqual(value.lessons['ai-features'].prerequisites, []);
  assert.ok(value.lessons['evaluate-model'].prerequisites.includes('train-test-split'));
  assert.ok(value.lessons['structured-json'].prerequisites.includes('models'));
  assert.ok(value.lessons['tool-authorization'].prerequisites.includes('rules'));
  assert.notDeepEqual(value.lessons.predictions.prerequisites, ['training']);
});

test('kinds distinguish conceptual foundation decisions, actual ML.NET and authored services', () => {
  const lessons = data().lessons;
  assert.match(lessons.training.source.kind, /illustrative|conceptual/i);
  assert.match(lessons.training.source.expected, /no training|does not train/i);
  assert.match(lessons['mlnet-pipeline'].source.kind, /ML.NET/);
  assert.match(lessons['generated-text'].source.kind, /authored sample/i);
  assert.match(lessons['generated-text'].source.expected, /fixed|same/i);
  assert.match(lessons['first-provider-call'].source.command, /^Get-Content /);
  assert.match(lessons['compare-prompts'].source.kind, /authored/i);
  assert.match(lessons['compare-prompts'].source.expected, /not a.*benchmark|not.*model run/i);
  assert.match(lessons['tool-function'].source.expected, /read.only/i);
});

test('token microtopics teach prediction, variation, factual review and delivery with authored examples', () => {
  const lessons = data().lessons;
  for (const id of ['generated-text', 'tokens-context']) {
    const topics = lessons[id].microtopics;
    assert.ok(Array.isArray(topics) && topics.length >= 2);
    topics.forEach(topic => {
      assert.deepEqual(Object.keys(topic).sort(), ['answer', 'task', 'text', 'title']);
      for (const key of ['answer', 'task', 'text', 'title']) nonblank(topic[key], key, 8);
    });
  }
  const generation = JSON.stringify(lessons['generated-text'].microtopics);
  const tokens = JSON.stringify(lessons['tokens-context'].microtopics);
  assert.match(generation, /next token/i);
  assert.match(generation, /authored/i);
  assert.match(generation, /repeat|variation/i);
  assert.match(generation, /fact|refund/i);
  assert.match(generation, /stream|delivery/i);
  assert.match(tokens, /subword|pieces/i);
  assert.match(tokens, /reserve|budget/i);
  assert.match(tokens, /not.*exact|not.*tokenizer/i);
});

test('five unit reviews provide three explained scenarios and an independent challenge each', () => {
  for (const [unit, review] of Object.entries(data().units)) {
    assert.deepEqual(Object.keys(review).sort(), ['challenge', 'recap', 'scope']);
    nonblank(review.scope, unit + ' scope', 60);
    assert.equal(review.recap.length, 3);
    const questions = new Set();
    for (const question of review.recap) {
      assert.deepEqual(Object.keys(question).sort(), ['answer', 'options', 'question']);
      nonblank(question.question, unit + ' question', 40);
      questions.add(question.question);
      assert.equal(question.options.length, 3);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 3);
      const optionText = new Set();
      for (const option of question.options) {
        assert.deepEqual(Object.keys(option).sort(), ['text', 'why']);
        nonblank(option.text, 'option', 12); nonblank(option.why, 'feedback', 30);
        optionText.add(option.text);
      }
      assert.equal(optionText.size, 3);
    }
    assert.equal(questions.size, 3);
    const challenge = review.challenge;
    assert.deepEqual(Object.keys(challenge).sort(), ['checks', 'command', 'solution', 'task']);
    nonblank(challenge.task, unit + ' challenge task', 80);
    strings(challenge.checks, unit + ' challenge checks', 3);
    nonblank(challenge.solution, unit + ' worked solution', 120);
    nonblank(challenge.command, unit + ' command', 10);
    assert.ok(challenge.command.includes('labs/' + folders[unit] + '/'));
    assert.doesNotMatch(JSON.stringify(review), /awards? mastery|certified|automatically completed/i);
  }
});

test('glossary supports basic ML, LLM expansion, prompting, tokens and DTO discovery', () => {
  const value = data();
  assert.ok(value.glossary.length >= 15);
  const terms = new Set();
  for (const entry of value.glossary) {
    assert.deepEqual(Object.keys(entry).sort(), ['aliases', 'definition', 'lessonIds', 'term']);
    nonblank(entry.term, 'term'); nonblank(entry.definition, entry.term + ' definition', 35);
    strings(entry.lessonIds, entry.term + ' lesson links');
    strings(entry.aliases, entry.term + ' aliases', 0);
    entry.lessonIds.forEach(id => assert.ok(value.lessons[id], entry.term + ' must link to an owned lesson'));
    assert.ok(!terms.has(entry.term.toLowerCase())); terms.add(entry.term.toLowerCase());
  }
  function lookup(term) {
    return value.glossary.find(entry => [entry.term, ...entry.aliases].some(alias => alias.toLowerCase() === term.toLowerCase()));
  }
  for (const term of ['ML', 'machine learning', 'LLM', 'large language model', 'large language models', 'prompt', 'DTO', 'data transfer object', 'token', 'tokens', 'inference', 'feature', 'label']) {
    assert.ok(lookup(term), 'missing glossary lookup: ' + term);
  }
  assert.ok(lookup('LLM').lessonIds.includes('generated-text'));
  assert.ok(lookup('DTO').lessonIds.includes('structured-json'));
});
