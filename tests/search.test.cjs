// Breaks caught: wrong cosine arithmetic, unsafe vectors, post-top-k filters,
// unstable ties, model-space mixing, and lexical/hybrid ranking regressions.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const api=fs.existsSync(path.join(root,'assets/search-experiments.js'))?require('../assets/search-experiments.js'):{};
test('cosine gives hand-computed directions, not raw dot products',()=>{
  assert.equal(typeof api.cosine,'function','Search cosine implementation is required');
  for(const [a,b,want] of [[[1,0],[1,0],1],[[1,0],[0,1],0],[[1,0],[-1,0],-1],[[3,4],[3,4],1],[[0,0],[1,0],0]])
    assert.ok(Math.abs(api.cosine(a,b)-want)<1e-12);
  assert.ok(Math.abs(api.cosine([1,1],[1,0])-0.7071067811865475)<1e-12);
});
test('invalid vector values and mismatched dimensions are rejected',()=>{
  assert.equal(typeof api.cosine,'function');
  for(const [a,b] of [[[],[]],[[1],[1,0]],[[NaN,0],[1,0]],[[Infinity,0],[1,0]],[[1,'0'],[1,0]]])
    assert.throws(()=>api.cosine(a,b));
});
test('sparse coordinates are rejected in either cosine argument and stored article vectors',()=>{
  for(const sparse of [[,1],new Array(2)]){
    assert.throws(()=>api.cosine(sparse,[0,1]),/finite/,'Holes must not silently become zero or NaN');
    assert.throws(()=>api.cosine([0,1],sparse),/finite/);
  }
  for(const sparse of [[,1,0,0],new Array(4)])
    assert.throws(()=>api.search('refund',{},[{id:'X',title:'refund',text:'',category:'Billing',vector:sparse,space:'toy-topics/v1/4'}]),/finite/);
});
test('toy synonym search finds refund where lexical money back does not',()=>{
  assert.equal(typeof api.search,'function');
  assert.deepEqual(api.vectorize('money back'),[2,0,0,0]);
  assert.deepEqual(api.search('money back',{mode:'keyword'}).map(x=>x.id),[]);
  assert.deepEqual(api.search('money back',{mode:'vector',k:1}).map(x=>x.id),['ART-101']);
  assert.deepEqual(api.search('money back',{mode:'hybrid',k:1}).map(x=>x.id),['ART-101']);
  assert.deepEqual(api.search('unmapped vocabulary',{mode:'vector'}),[]);
});
test('category filters precede top-k and every tie uses ordinal article ID',()=>{
  assert.equal(typeof api.search,'function');
  assert.deepEqual(api.search('refund password',{mode:'vector',category:'Account',k:1}).map(x=>x.id),['ART-201']);
  const rows=[{id:'Z',category:'Billing',title:'refund',text:'',vector:[1,0,0,0],space:'toy-topics/v1/4'},
    {id:'A',category:'Billing',title:'refund',text:'',vector:[1,0,0,0],space:'toy-topics/v1/4'}];
  assert.deepEqual(api.search('refund',{k:2},rows).map(x=>x.id),['A','Z']);
  assert.deepEqual(api.search('refund',{category:'Technical'}),[]);
});
test('search enforces query, mode, top-k and model-space bounds',()=>{
  assert.equal(typeof api.search,'function');
  for(const options of [{k:0},{k:7},{k:1.5},{mode:'magic'},{space:'toy-topics/v2/4'},{category:'secret'}])
    assert.throws(()=>api.search('refund',options));
  assert.throws(()=>api.search(''));
  assert.throws(()=>api.search('a'.repeat(241)));
  assert.throws(()=>api.search('refund',{},[{id:'X',title:'refund',text:'',category:'Billing',vector:[1,0,0,0],space:'other/4'}]));
});
test('hybrid exposes independently checkable components',()=>{
  assert.equal(typeof api.search,'function');
  const row=api.search('refund',{mode:'hybrid',k:1})[0];
  assert.equal(row.id,'ART-101');assert.equal(row.vectorScore,1);assert.equal(row.keywordScore,1);assert.equal(row.score,1);
  const synonym=api.search('money back',{mode:'hybrid',k:1})[0];
  assert.equal(synonym.keywordScore,0);assert.equal(synonym.score,0.65);
});
test('lesson exports drive all six sequential runnable-lab destinations',()=>{
  const content=require('../assets/search-content.js');
  assert.deepEqual(content.lessons.map(x=>x.id),['vector-arrays','cosine-similarity','embedding-meaning','embedding-storage','vector-indexes','hybrid-search']);
  content.lessons.forEach((lesson,index)=>{
    assert.deepEqual(lesson.prerequisites,[index?content.lessons[index-1].id:'tool-audit']);
    assert.equal(lesson.dotnet.lab,true);assert.equal(lesson.labId,'semantic-search');
    assert.ok(content.references[lesson.reference]);
  });
});
test('download manifest resolves every deliverable without compiled output',()=>{
  const files=require('../assets/search-files.js');
  assert.ok(files.length>=12);
  for(const [file,label] of files){assert.ok(label);assert.ok(!/(^|\/)(bin|obj)\//.test(file));assert.ok(fs.statSync(path.join(root,'labs/supportdesk-semantic-search',file)).isFile(),file);}
});
