const test=require('node:test'),assert=require('node:assert/strict');
const core=require('../assets/learning-core.js'),C=require('../assets/curriculum.js');
test('search discovers technical aliases without substring false matches',()=>{
 assert.equal(typeof core.searchLessons,'function');
 for(const [term,id]of [['LLM','generated-text'],['embedding','embedding-meaning'],['RAG','retrieval-first'],['ONNX','onnx-quantization'],['fine-tuning','finetuning-decision']])assert.ok(core.searchLessons(term).some(l=>l.id===id),term);
 assert.equal(core.searchLessons('no-such-term-qwerty').length,0);
 assert.ok(!core.searchLessons('RAG').some(l=>l.id==='embedding-storage'),'RAG must not match stoRAGe by substring');
});
test('glossary acronym discovery uses word boundaries rather than a substring of storage',()=>{
 assert.equal(typeof core.searchGlossary,'function');
 assert.ok(core.searchGlossary('RAG').some(g=>g.lessonIds.includes('retrieval-first')));
 assert.ok(!core.searchGlossary('rag').some(g=>g.term==='Data contract'));
});
test('search indexes runnable symbols, code and mapped glossary aliases',()=>{
 for(const [query,id]of [['JsonContent','first-provider-call'],['MeasureCandidate','onnx-quantization'],['ModelSpace','embedding-storage'],['ORT','onnx-quantization'],['quantisation','onnx-quantization']])assert.ok(core.searchLessons(query).some(l=>l.id===id),query);
});
test('search retains code symbols immediately after actual line breaks',()=>{
 for(const [query,id]of [['ITransformer','train-test-split'],['ValidateTopic','mcp-capabilities'],['CheckTrustedCaller','mcp-capabilities']])assert.ok(core.searchLessons(query).some(l=>l.id===id),query);
});

test('resume validates last position without awarding understanding or discarding legacy evidence',()=>{
 assert.equal(typeof core.recordVisit,'function');
 const before={lessons:{rules:{read:true,checked:true}},labs:{'rules-baseline':true}};
 const visited=core.recordVisit(before,'blazor-streaming','dotnet');
 assert.deepEqual(core.resumeTarget(visited),{lessonId:'blazor-streaming',section:'dotnet'});
 assert.deepEqual(visited.lessons,before.lessons);assert.deepEqual(visited.labs,before.labs);
 assert.equal(core.resumeTarget({lastVisited:{lessonId:'<bad>',section:'script'}}),null);
 assert.equal(core.resumeTarget({lastVisited:{lessonId:'rules',section:'invalid'}}),null);
 const roundtrip=core.readBackup(JSON.stringify({app:'dotnet-ai-workspace',version:1,progress:visited}));
 assert.deepEqual(core.resumeTarget(roundtrip),{lessonId:'blazor-streaming',section:'dotnet'});
 assert.deepEqual(core.sanitizeProgress(before),before);
});
test('unit completion recommends its unfinished project before advancing, without hard locking navigation',()=>{
 assert.equal(typeof core.nextDestination,'function');
 const state={lessons:Object.fromEntries(C.lessons.filter(l=>l.unitId==='foundations').map(l=>[l.id,{checked:true}]))};
 assert.equal(core.nextDestination(state),'#lab');
 state.labs={'rules-baseline':true};
 assert.equal(core.nextDestination(state),'#lesson/data-examples/understand');
 assert.equal(core.nextLesson(state).id,'data-examples');
});
test('display ordering is stable and preserves original option indices for existing grading',()=>{
 assert.equal(typeof core.quizOptions,'function');
 const positions=[];
 for(const id of ['tool-function','tool-arguments','tool-execution','tool-authorization','tool-retries','tool-audit']){
  const options=core.quizOptions(id);assert.deepEqual(options,core.quizOptions(id));
  assert.deepEqual(options.map(x=>x.index).sort(),[0,1,2]);
  const correct=options.findIndex(x=>core.grade(id,x.index).correct);assert.ok(correct>=0);positions.push(correct);
 }
 assert.notDeepEqual(positions,[0,1,2,0,1,2]);
});
test('bookmarks accept only known lessons and cannot forge check or lab evidence',()=>{
 assert.equal(typeof core.toggleBookmark,'function');
 let state=core.toggleBookmark({},'local-inference');assert.deepEqual(state.bookmarks,['local-inference']);
 assert.deepEqual(state.lessons,{});assert.deepEqual(state.labs,{});
 state=core.toggleBookmark(state,'local-inference');assert.deepEqual(state.bookmarks,[]);
 assert.ok(!core.sanitizeProgress({bookmarks:['bad','rules','rules',42]}).bookmarks.includes('bad'));
});
