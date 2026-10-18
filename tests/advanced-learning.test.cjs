const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../assets/curriculum.js');
const core=require('../assets/learning-core.js');
const units=[
  ['semantic-search','semantic-search',['vector-arrays','cosine-similarity','embedding-meaning','embedding-storage','vector-indexes','hybrid-search']],
  ['document-answers','grounded-answers',['retrieval-first','document-chunks','evidence-selection','context-assembly','citations-support','retrieval-tests']],
  ['production-retrieval','retrieval-quality',['retrieval-evaluation','ranking-reranking','index-freshness','retrieval-permissions','document-injection','retrieval-tracing']],
  ['agents-workflows','bounded-workflow',['workflow-or-agent','workflow-state','workflow-budgets','agent-framework','mcp-capabilities','workflow-recovery']]
];
for(const [unit,lab,ids]of units){
  test(`${unit} owns its six usable lessons and a distinct lab`,()=>{
    assert.equal(C.stages.find(x=>x.id===unit).available,true);
    assert.deepEqual(core.lessonsForUnit(unit).map(x=>x.id),ids);
    for(const id of ids){
      const lesson=core.getLesson(id);
      assert.equal(lesson.labId,lab);
      assert.equal(core.unitForLesson(id).id,unit);
      assert.ok(C.references[lesson.reference]);
      assert.equal(core.grade(id,lesson.quiz.answer).correct,true);
      assert.equal(core.grade(id,(lesson.quiz.answer+1)%3).correct,false);
    }
    assert.equal(C.labs.find(x=>x.id===lab).url,'#lab/'+lab);
  });
}
test('recommendation advances across all new boundaries instead of looping to foundations',()=>{
  for(const [previous,next]of [['tool-audit','vector-arrays'],['hybrid-search','retrieval-first'],['retrieval-tests','retrieval-evaluation'],['retrieval-tracing','workflow-or-agent']]){
    const stop=C.lessons.findIndex(x=>x.id===previous);
    const state={lessons:Object.fromEntries(C.lessons.slice(0,stop+1).map(x=>[x.id,{checked:true}]))};
    assert.equal(core.nextLesson(state).id,next);
    assert.deepEqual(core.missingPrerequisites({},next).map(x=>x.id),[previous]);
  }
});
test('all nine milestones and mixed old/new understanding survive backup without forged evidence',()=>{
  const labs=Object.fromEntries(['rules-baseline','mlnet-classifier','draft-replies','ticket-summary','ticket-lookup','semantic-search','grounded-answers','retrieval-quality','bounded-workflow','arbitrary-write'].map(x=>[x,true]));
  const state=core.readBackup(JSON.stringify({app:'dotnet-ai-workspace',version:1,progress:{lessons:{rules:{checked:true},'workflow-recovery':{read:true,checked:true},'fake-agent':{checked:true}},labs}}));
  assert.equal(Object.keys(state.labs).length,9);
  assert.equal(state.labs['arbitrary-write'],undefined);
  assert.equal(state.lessons['workflow-recovery'].checked,true);
  assert.equal(state.lessons.rules.checked,true);
  assert.equal(state.lessons['fake-agent'],undefined);
});
test('the completed curriculum has no dangling lesson prerequisite',()=>{
  assert.equal(C.lessons.length,68);
  assert.deepEqual(C.stages.filter(x=>!x.available).map(x=>x.id),[]);
  for(const lesson of C.lessons)for(const id of lesson.prerequisites)assert.ok(core.getLesson(id),`${lesson.id} requires missing ${id}`);
});
