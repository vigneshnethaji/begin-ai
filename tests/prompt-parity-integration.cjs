// Integration suite: invokes .NET compilation and an isolated PowerShell command consumer.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');

// Minimal DOM transport: exercise the real mount/click/render path without a
// server, browser download, storage, or generated website artifacts.
class Element {
  constructor(tag, document) {
    this.tag = tag; this.ownerDocument = document; this.children = [];
    this.attributes = {}; this.listeners = {}; this.text = '';
    this.classList = {toggle() {}};
  }
  set textContent(value) { this.text = String(value); this.children = []; }
  get textContent() { return this.text + this.children.map(child => child.textContent).join(' '); }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  append(...children) { this.children.push(...children); }
  prepend(...children) { this.children.unshift(...children); }
  replaceChildren(...children) { this.text = ''; this.children = children; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  removeEventListener(name) { delete this.listeners[name]; }
  querySelectorAll() { return []; }
}
function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function browserComparison() {
  const document = {createElement: tag => new Element(tag, document)};
  const host = new Element('div', document);
  const cleanup = require('../assets/reliable-experiments.js').mount(host, 'reliable-compare');
  descendants(host).find(node => 'data-rp-compare' in node.attributes).listeners.click();
  const results = descendants(host).find(node => 'data-rp-results' in node.attributes);
  const cases = results.children.slice(1).map(section => {
    const nodes = section.children;
    return {
      id: nodes[0].textContent.replace('Held-out case: ', ''),
      input: nodes[1].textContent.replace('Input for BOTH versions: ', ''),
      expected: JSON.parse(nodes[2].textContent.replace('Reviewed expectations:\n', '')),
      v1: JSON.parse(nodes[4].textContent), v2: JSON.parse(nodes[7].textContent),
      checks: [nodes[5], nodes[8]].map(node => node.textContent.split(' · ').map(rule => rule.endsWith(': PASS')))
    };
  });
  const text = host.textContent;
  cleanup();
  return {cases, text, prompts:descendants(host).find(node=>node.tag==='pre').textContent};
}
let verification;
function csharpComparison() {
  if (!verification) {
    // Keep compiler outputs outside the shared checkout; --verify exits before
    // host/environment configuration and never invokes a provider.
    const artifacts = fs.mkdtempSync(path.join(os.tmpdir(), 'prompt-parity-'));
    verification = spawnSync('dotnet', ['run', '--project', 'labs/supportdesk-ticket-summary',
      '--artifacts-path', artifacts, '--', '--verify'], {cwd: root, encoding: 'utf8', timeout: 120000});
  }
  assert.ifError(verification.error);
  assert.equal(verification.status, 0, verification.stdout + verification.stderr);
  const line = verification.stdout.split(/\r?\n/).find(line => line.startsWith('PROMPT_COMPARISON_JSON '));
  assert.ok(line, 'C# --verify must expose the actual authored comparison for cross-runtime verification');
  return JSON.parse(line.slice('PROMPT_COMPARISON_JSON '.length));
}
test('browser reports two then three passing cases and the General regression', () => {
  const {cases, text} = browserComparison();
  assert.deepEqual(cases.map(item => item.id), ['billing', 'account', 'technical', 'general']);
  assert.deepEqual(cases.map(item => item.checks), [
    [[true, true, false, false], [true, true, true, true]],
    [[true, false, true, true], [true, true, true, true]],
    [[true, true, true, true], [true, true, true, true]],
    [[true, true, true, true], [true, false, true, true]]
  ]);
  assert.match(text, /v1: 2 \/ 4 cases pass/);
  assert.match(text, /v2: 3 \/ 4 cases pass/);
  assert.match(text, /General passes v1 but fails v2/);
  assert.match(text, /authored.*not model runs/i);
  assert.match(text, /not real benchmark or accuracy measurements/);
});
test('C# executes the browser literal inputs, candidates, expectations and per-case rules', () => {
  assert.deepEqual(csharpComparison().cases, browserComparison().cases);
});
test('C# reports all four denominators, missing-information scores and whole-case scores', () => {
  assert.deepEqual(csharpComparison().scores, [
    {prompt: 'v1', total: 4, validShape: 4, correctLabels: 3, requiredFactsPresent: 3, correctMissingInformation: 3, casesPassed: 2},
    {prompt: 'v2', total: 4, validShape: 4, correctLabels: 3, requiredFactsPresent: 4, correctMissingInformation: 4, casesPassed: 3}
  ]);
});
test('browser and C# display identical prompt instructions and the same few-shot example',()=>{
 const [v1,v2]=csharpComparison().prompts||[];
 assert.equal(browserComparison().prompts,'Version 1: '+v1+'\n\nVersion 2: '+v2);
});
function displayedDraftCommands() {
  const commands = [];
  const context = {window: {}, AcademyDraftFiles: []};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/draft-lab.js'), 'utf8'), context);
  context.window.AcademyDraftLab.render({
    main: {innerHTML: '', querySelector: () => ({addEventListener() {}})},
    codeBlock: code => { commands.push(code); return ''; },
    icon: () => '', warning: () => '', breadcrumb: () => '', bottom: () => '',
    state: {labs: {}}, onComplete() {}
  });
  return commands;
}
function assertSampleBeforeRun(commands) {
  // Run the displayed PowerShell with only dotnet replaced by a local function.
  // Simulate an inherited live-mode setting; no actual environment is inspected
  // and no application/provider is launched by this command-consumer check.
  const script = "$env:DRAFT_REPLY_PROVIDER = 'OpenAI'\n" +
    "function dotnet { if ($args[0] -eq 'run') { if ($env:DRAFT_REPLY_PROVIDER -ne 'Sample') { throw 'First run did not select Sample' }; Write-Output 'SAMPLE_RUN' } }\n" +
    commands;
  const result = spawnSync('pwsh', ['-NoProfile', '-NonInteractive', '-Command', script], {encoding: 'utf8', timeout: 15000});
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SAMPLE_RUN/);
}
test('first displayed draft-lab run overrides inherited OpenAI with Sample', () => {
  assertSampleBeforeRun(displayedDraftCommands().find(code => /dotnet run/.test(code)));
});
test('first README draft-lab run overrides inherited OpenAI with Sample', () => {
  const readme = fs.readFileSync(path.join(root, 'labs/supportdesk-draft-replies/README.md'), 'utf8');
  const first = [...readme.matchAll(/```powershell\r?\n([\s\S]*?)```/g)].map(match => match[1]).find(code => /dotnet run/.test(code));
  assertSampleBeforeRun(first);
});
