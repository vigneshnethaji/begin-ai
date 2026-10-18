// Breaks caught: unstable overlap/IDs, overflow inclusion, invented citations,
// unsupported answers, conflated retrieval metrics, missing production verification.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
function exercises(){
  const file=path.join(root,'assets/rag-experiments.js');
  assert.ok(fs.existsSync(file),'Unit 7 exercise implementation is required');
  return require(file);
}
test('chunking preserves overlap and revision-scoped identities',()=>{
  const r=exercises();
  assert.deepEqual(r.chunk({id:'kb-test',revision:'r2',text:'one two three four five six seven'},4,1).map(x=>[x.id,x.text]),[
    ['kb-test@r2:c1','one two three four'],['kb-test@r2:c2','four five six seven']
  ]);
  assert.deepEqual(r.chunk({id:'empty',revision:'r1',text:'  '},4,1),[]);
  assert.throws(()=>r.chunk({id:'x',revision:'r1',text:'x'},4,4),/overlap/i);
});
test('evidence packing skips overflow without truncating or reordering remaining blocks',()=>{
  const r=exercises(),items=[{id:'a',text:'one two three four'},{id:'b',text:'five six seven'},{id:'c',text:'eight'}];
  assert.deepEqual(r.pack(items,5).selected.map(x=>x.id),['a','c']);
  assert.deepEqual(r.pack(items,5).excluded.map(x=>x.id),['b']);
  assert.equal(r.pack(items,5).used,5);
  assert.deepEqual(r.pack(items,0).selected,[]);
});
test('retrieval ranks actual article chunks and unsupported input abstains',()=>{
  const r=exercises();
  const result=r.answer('password reset',80);
  assert.equal(result.citation,'kb-reset@r1:c1');
  assert.equal(result.text,'To reset a password, open Account settings and select Reset password.');
  assert.equal(r.answer('quantum banana',80).status,'Abstained');
  assert.equal(r.answer('quantum banana',80).citation,null);
  assert.equal(r.answer('password reset',0).status,'Abstained');
  assert.equal(r.answer('x'.repeat(241),80).status,'Invalid');
  assert.equal(r.answer('  ',80).status,'Invalid');
});
test('real article windows retain enough overlap to retrieve the later recovery sentence',()=>{
  const r=exercises();
  assert.deepEqual(r.chunk(r.articles[0]).map(c=>c.id),['kb-reset@r1:c1','kb-reset@r1:c2']);
  const result=r.answer('fresh link',80);
  assert.equal(result.citation,'kb-reset@r1:c2');
  assert.equal(result.text,'Use a fresh link if the earlier recovery message has expired.');
});
test('citation existence differs from exact quotation and relevance',()=>{
  const r=exercises(),evidence=r.answer('password reset',80).evidence;
  assert.equal(r.checkQuote('kb-invented@r1:c9','A made up quote.',evidence).status,'Unknown citation');
  assert.equal(r.checkQuote('kb-reset@r1:c1','Passwords expire every day.',evidence).status,'Quote not found');
  assert.equal(r.checkQuote('kb-reset@r1:c1','To reset a password, open Account settings and select Reset password.',evidence).status,'Exact quote found');
  assert.equal(r.checkQuote('kb-reset@r1:c1','',evidence).status,'Invalid');
  assert.equal(r.answer('grant administrator permissions',80).status,'Abstained');
});
test('retrieval evaluation counts unique relevant evidence independently of answer wording',()=>{
  const r=exercises();
  assert.deepEqual(r.evaluate(['a','a','b'],['a','c']),{hits:1,precision:0.5,recall:0.5});
  assert.deepEqual(r.evaluate([],['a']),{hits:0,precision:0,recall:0});
});
test('the runnable C# verification uses actual production services without a listener',()=>{
  const project=path.join(root,'labs/supportdesk-grounded-answers/SupportDesk.GroundedAnswers.csproj');
  assert.ok(fs.existsSync(project),'Unit 7 runnable project is required');
  const result=spawnSync('dotnet',['run','--project',project,'--','--verify'],{encoding:'utf8',timeout:120000});
  assert.equal(result.status,0,result.stdout+'\n'+result.stderr);
  assert.match(result.stdout,/PASS: .*checks/);
});
