const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const load=name=>{const file=path.join(root,'assets',name);assert.ok(fs.existsSync(file),`${name} must provide the Unit 9 contract`);return require(file);};
test('six lessons preserve the sequential journey and offer the runnable lab',()=>{
  const {lessons,references}=load('workflow-content.js');
  const ids=['workflow-or-agent','workflow-state','workflow-budgets','agent-framework','mcp-capabilities','workflow-recovery'];
  assert.deepEqual(lessons.map(x=>x.id),ids);
  lessons.forEach((x,i)=>{
    assert.deepEqual(x.prerequisites,[i?ids[i-1]:'retrieval-tracing']);
    assert.equal(x.unitId,'agents-workflows');assert.equal(x.labId,'bounded-workflow');
    assert.equal(x.conceptId,x.id);assert.equal(x.dotnet.lab,true);
    assert.equal(x.paragraphs.length,4);assert.equal(x.quiz.options.length,3);
    assert.ok(x.quiz.options[x.quiz.answer].why);assert.ok(references[x.reference].url.startsWith('https://'));
    assert.ok(x.example.paths.length>=2);assert.ok(x.experiment.startsWith('workflow-'));
  });
  assert.match(lessons.at(-1).dotnet.next,/Unit 10.*planned/i);
});
test('route choice and explicit checkpoint distinguish orchestration from model decisions and persistence',()=>{
  const {evaluate}=load('workflow-experiments.js');
  assert.equal(evaluate('workflow-route','fixed').outcome,'Workflow');
  assert.equal(evaluate('workflow-route','open').outcome,'Model-directed agent candidate');
  assert.equal(evaluate('workflow-state','reload').outcome,'Checkpoint lost');
  assert.equal(evaluate('workflow-state','resume').outcome,'AwaitingApproval');
});
test('budget checks stop before a fourth step and cancellation is not completion',()=>{
  const {evaluate}=load('workflow-experiments.js');
  assert.deepEqual(evaluate('workflow-budget','loop',3),{outcome:'BudgetExceeded',steps:3,calls:0,detail:'Loop stopped before step 4. No preview was created.'});
  assert.equal(evaluate('workflow-budget','cancel',5).outcome,'Cancelled');
  assert.equal(evaluate('workflow-budget','normal',3).outcome,'AwaitingApproval');
  assert.equal(evaluate('workflow-budget','normal',2).outcome,'BudgetExceeded');
});
test('framework bridge maps application responsibilities without implying an installed SDK',()=>{
  const {evaluate}=load('workflow-experiments.js');
  assert.equal(evaluate('workflow-framework','graph').outcome,'Executors and edges');
  assert.equal(evaluate('workflow-framework','approval').outcome,'Application policy');
});
test('capability definitions cannot execute and unknown capability is denied',()=>{
  const {evaluate}=load('workflow-experiments.js');
  assert.equal(evaluate('workflow-mcp','lookup_help').outcome,'Definition only');
  assert.equal(evaluate('workflow-mcp','help://billing').outcome,'Resource');
  assert.equal(evaluate('workflow-mcp','triage_prompt').outcome,'Prompt');
  assert.equal(evaluate('workflow-mcp','send_email').outcome,'Denied');
});
test('recovery preserves uncertainty and replay never repeats a preview effect',()=>{
  const {evaluate}=load('workflow-experiments.js');
  assert.equal(evaluate('workflow-recovery','failed').outcome,'Retry eligible');
  assert.deepEqual(evaluate('workflow-recovery','unknown'),{outcome:'Unknown',effects:1,detail:'The local preview may exist. Reconcile evidence; automatic retry is blocked.'});
  assert.equal(evaluate('workflow-recovery','replay').effects,1);
  assert.equal(evaluate('workflow-recovery','changed').outcome,'Approval invalidated');
});
test('download manifest contains every source file and no build products',()=>{
  const files=load('workflow-files.js');
  const dir=path.join(root,'labs/supportdesk-bounded-workflow');
  const walk=(at,prefix='')=>fs.readdirSync(at,{withFileTypes:true}).flatMap(e=>['bin','obj'].includes(e.name)?[]:e.isDirectory()?walk(path.join(at,e.name),prefix+e.name+'/'):[prefix+e.name]);
  assert.deepEqual(files.map(x=>x[0]).sort(),walk(dir).sort());
  assert.ok(files.every(x=>x.length===2&&x[1]));
});
