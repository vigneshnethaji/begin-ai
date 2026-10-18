const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../assets/curriculum.js'),core=require('../assets/learning-core.js');
const units=[
 ['model-choices','attachment-review',['images-ocr','speech-transcripts','multimodal-inputs','local-inference','onnx-quantization','finetuning-decision'],'workflow-recovery'],
 ['azure-operations','operations-capstone',['identity-secrets','evaluation-gates','observability','latency-cost','azure-release','capstone-drills'],'finetuning-decision']
];
for(const [unit,lab,ids,before]of units){
 test(`${unit} publishes its six actual lessons with exact prerequisites and lab ownership`,()=>{
  assert.equal(C.stages.find(x=>x.id===unit).available,true);
  assert.deepEqual(core.lessonsForUnit(unit).map(x=>x.id),ids);
  ids.forEach((id,index)=>{
   const l=core.getLesson(id);assert.equal(l.labId,lab);assert.deepEqual(l.prerequisites,[index?ids[index-1]:before]);
   assert.ok(C.references[l.reference]);assert.equal(core.grade(id,l.quiz.answer).correct,true);
  });
  assert.equal(C.labs.find(x=>x.id===lab).url,'#lab/'+lab);
 });
}
test('previous last unit now leads into attachments then operations without losing previous evidence',()=>{
 for(const [last,next]of [['workflow-recovery','images-ocr'],['finetuning-decision','identity-secrets']]){
  const index=C.lessons.findIndex(x=>x.id===last);
  const progress={lessons:Object.fromEntries(C.lessons.slice(0,index+1).map(x=>[x.id,{checked:true}]))};
  assert.equal(core.nextLesson(progress).id,next);
 }
 const backup={app:'dotnet-ai-workspace',version:1,progress:{lessons:{rules:{checked:true},'capstone-drills':{checked:true}},labs:{'rules-baseline':true,'bounded-workflow':true,'attachment-review':true,'operations-capstone':true,'fake-deployment':true}}};
 const state=core.readBackup(JSON.stringify(backup));
 assert.deepEqual(state.labs,{'rules-baseline':true,'bounded-workflow':true,'attachment-review':true,'operations-capstone':true});
 assert.equal(state.lessons.rules.checked,true);assert.equal(state.lessons['capstone-drills'].checked,true);
});
test('all eleven curriculum units are usable and none are still advertised as planned',()=>{
 assert.equal(C.lessons.length,68);assert.equal(C.labs.length,11);
 assert.equal(C.stages.filter(x=>x.available).length,11);
 assert.deepEqual(C.stages.filter(x=>!x.available),[]);
});
test('reading or forged evidence cannot complete the course',()=>{
 assert.equal(typeof core.courseEvidence,'function');
 const state={lessons:Object.fromEntries(C.lessons.map(x=>[x.id,{read:true,checked:'yes'}])),labs:{'fake-release':true}};
 assert.deepEqual(core.courseEvidence(state),{checked:0,totalChecks:68,completedLabs:0,totalLabs:11,checksComplete:false,labsComplete:false,courseComplete:false});
});
test('passing all checks still requires independent lab milestones',()=>{
 assert.equal(typeof core.courseEvidence,'function');
 const state={lessons:Object.fromEntries(C.lessons.map(x=>[x.id,{checked:true}]))};
 const result=core.courseEvidence(state);assert.equal(result.checksComplete,true);assert.equal(result.labsComplete,false);assert.equal(result.courseComplete,false);
 state.labs=Object.fromEntries(C.labs.map(x=>[x.id,true]));
 const complete=core.courseEvidence(state);assert.equal(complete.courseComplete,true);
 delete state.labs['rules-baseline'];assert.equal(core.courseEvidence(state).courseComplete,false);
});
