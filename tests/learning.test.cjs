const test = require('node:test');
const assert = require('node:assert/strict');
let core;
try { core = require('../assets/learning-core.js'); } catch { core = {}; }

test('a plausible but wrong response does not count as understanding', () => {
  assert.equal(typeof core.recordAnswer, 'function', 'learning logic must exist');
  const state = core.recordAnswer({}, 'ai-features', 0);
  assert.equal(state.lessons['ai-features'].checked, false);
  assert.equal(state.lessons['ai-features'].read, false);
});
test('correct understanding is independent of reading and survives later wrong attempts', () => {
  const state = core.recordAnswer({}, 'ai-features', 1);
  assert.equal(state.lessons['ai-features'].checked, true);
  assert.equal(state.lessons['ai-features'].read, false);
  assert.equal(core.recordAnswer(state, 'ai-features', 0).lessons['ai-features'].checked, true);
});
test('the recommended next lesson does not skip a topic merely marked read', () => {
  assert.equal(core.nextLesson({lessons:{'ai-features':{read:true}}}).id, 'ai-features');
  assert.equal(core.nextLesson({lessons:{'ai-features':{checked:true}}}).id, 'rules');
});
test('prerequisite advice follows explicit IDs, independent of array positions', () => {
  assert.deepEqual(core.missingPrerequisites({}, 'training').map(x=>x.id), ['models']);
  assert.deepEqual(core.missingPrerequisites({lessons:{models:{checked:true}}}, 'training'), []);
});
test('saved progress accepts only known IDs and literal boolean evidence', () => {
  const clean=core.sanitizeProgress({lessons:{'ai-features':{read:'yes',checked:true},fake:{read:true}},labs:{'rules-baseline':true,evil:true}});
  assert.deepEqual(clean.lessons, {'ai-features':{read:false,checked:true}});
  assert.deepEqual(clean.labs, {'rules-baseline':true});
});
test('backup restores valid progress and rejects wrong schema or malformed content', () => {
  const valid=JSON.stringify({app:'dotnet-ai-workspace',version:1,progress:{lessons:{rules:{read:true}},labs:{}}});
  assert.equal(core.readBackup(valid).lessons.rules.read, true);
  assert.throws(()=>core.readBackup('{broken'), /valid JSON/);
  assert.throws(()=>core.readBackup('{"app":"other","version":1,"progress":{}}'), /workspace/);
  assert.throws(()=>core.readBackup(JSON.stringify({app:'dotnet-ai-workspace',version:1,progress:[]})), /progress/);
  assert.throws(()=>core.readBackup(' '.repeat(2000001)), /2 MB/);
});
test('the keyword experiment makes the limitations of an exact rule observable', () => {
  assert.equal(core.classifyRule('I need a refund', 'refund'), 'Billing');
  assert.equal(core.classifyRule('Please return my payment', 'refund'), 'General');
  assert.equal(core.classifyRule('REFUND PLEASE', 'refund'), 'Billing');
  assert.equal(core.classifyRule('I cannot sign in', ''), 'General');
});
test('invalid choices cannot award understanding or crash feedback', () => {
  assert.equal(core.grade('ai-features', 99).correct, false);
  assert.equal(core.grade('ai-features', '1').correct, false);
  assert.equal(core.getLesson('missing'), undefined);
});
test('finishing foundations continues into the real ML.NET lessons', () => {
  const ids=['ai-features','rules','models','training','predictions','choose-approach'];
  const state={lessons:Object.fromEntries(ids.map(id=>[id,{checked:true}]))};
  assert.equal(core.nextLesson(state).id,'data-examples');
});
test('each available unit resolves its own lessons rather than foundation array positions', () => {
  assert.equal(typeof core.lessonsForUnit,'function');
  assert.equal(core.lessonsForUnit('first-mlnet-model')[0].id,'data-examples');
  assert.equal(core.lessonsForUnit('foundations').length,6);
  assert.equal(core.unitForLesson('save-load').id,'first-mlnet-model');
});
test('new lab progress imports alongside old lab evidence without accepting unknown IDs', () => {
  const state=core.sanitizeProgress({lessons:{'data-examples':{read:true,checked:true}},labs:{'rules-baseline':true,'mlnet-classifier':true,unknown:true}});
  assert.deepEqual(state.labs,{'rules-baseline':true,'mlnet-classifier':true});
  assert.equal(state.lessons['data-examples'].checked,true);
});
