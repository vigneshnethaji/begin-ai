const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=name=>require(path.join(root,'assets',name));
test('Unit 8 exports a navigable six-lesson unit with runnable lab links',()=>{
  assert.ok(fs.existsSync(path.join(root,'assets/retrieval-content.js')),'Unit 8 content is missing');
  const {lessons,references}=load('retrieval-content.js');
  assert.deepEqual(lessons.map(x=>x.id),['retrieval-evaluation','ranking-reranking','index-freshness','retrieval-permissions','document-injection','retrieval-tracing']);
  lessons.forEach((x,i)=>{
    assert.deepEqual(x.prerequisites,[i?lessons[i-1].id:'retrieval-tests']);
    assert.equal(x.unitId,'production-retrieval');assert.equal(x.labId,'retrieval-quality');
    assert.equal(x.dotnet.lab,true);assert.equal(x.paragraphs.length,4);
    assert.ok(x.paragraphs.every(p=>p.length>180));
    assert.equal(x.quiz.options.length,3);assert.ok(x.quiz.options[x.quiz.answer].why);
    assert.ok(new URL(references[x.reference].url).protocol==='https:');
  });
});
test('Recall and reciprocal rank use labels, cutoff, unique IDs and literal zero cases',()=>{
  assert.ok(fs.existsSync(path.join(root,'assets/retrieval-experiments.js')),'Unit 8 experiment implementation is missing');
  const {metrics}=load('retrieval-experiments.js');
  assert.deepEqual(metrics(['x','a','b'],['a','b'],2),{recall:0.5,rr:0.5,labelled:true});
  assert.deepEqual(metrics(['a','a'],['a','b'],2),{recall:0.5,rr:1,labelled:true});
  assert.deepEqual(metrics([],['a'],2),{recall:0,rr:0,labelled:true});
  assert.deepEqual(metrics(['a'],[],2),{recall:0,rr:0,labelled:false});
  assert.deepEqual(metrics(['a'],['a'],0),{recall:0,rr:0,labelled:true});
});
test('toy ranking filters tenant and document ACL before top-k; cached replay rechecks revocation',()=>{
  const {createDemo}=load('retrieval-experiments.js'),demo=createDemo();
  assert.equal(demo.search('teamA','password reset','baseline',1).items[0].id,'A-102');
  assert.equal(demo.search('teamA','password reset','tuned',1).items[0].id,'A-101');
  assert.equal(demo.search('teamA','password reset','tuned',1,'B-201').message,'Document unavailable.');
  assert.equal(demo.search('teamA','password reset','tuned',1,'A-104').message,'Document unavailable.');
  assert.equal(demo.search('teamA','password reset','tuned',1,'A-999').message,'Document unavailable.');
  assert.equal(demo.search('teamA','password reset','tuned',1,'A-101').items.length,1);
  demo.revoke();
  assert.deepEqual(demo.search('teamA','password reset','tuned',1,'A-101').items,[]);
});
test('snapshot publication updates text, tombstones remove documents and traces exclude payloads',()=>{
  const demo=load('retrieval-experiments.js').createDemo();
  demo.update();assert.match(demo.search('teamA','password reset','tuned',1,'A-101').items[0].text,/ten minutes/);
  demo.publish();let r=demo.search('teamA','password reset','tuned',1,'A-101');
  assert.equal(r.revision,2);assert.match(r.items[0].text,/five minutes/);
  demo.remove();demo.publish();assert.deepEqual(demo.search('teamA','password reset','tuned',1,'A-101').items,[]);
  r=demo.search('teamA','injection','tuned',1,'A-103');assert.match(r.items[0].text,/Ignore previous/);
  assert.equal(demo.search('teamA','password reset','tuned',1,'B-201').message,'Document unavailable.');
  assert.doesNotMatch(JSON.stringify(r.trace),/Ignore previous|five minutes|B-201/);
});
test('whitespace normalization preserves cold and cached IDs/scores in both request orders',()=>{
  const {createDemo}=load('retrieval-experiments.js');
  const want=[['A-101',4],['A-102',3]];
  const pairs=r=>r.items.map(x=>[x.id,x.score]);
  for(const padded of ['\tpassword','password\n',' \tpassword\r\n ','password\treset','password\nreset']){
    const plain=padded.includes('reset')?'password reset':'password';
    const expected=plain==='password'?want:[['A-101',9],['A-102',6]];
    assert.deepEqual(pairs(createDemo().search('teamA',plain,'tuned',2)),expected,'cold plain');
    assert.deepEqual(pairs(createDemo().search('teamA',padded,'tuned',2)),expected,'cold padded');
    for(const order of [[padded,plain],[plain,padded]]){
      const demo=createDemo();
      assert.deepEqual(pairs(demo.search('teamA',order[0],'tuned',2)),expected,'first request');
      const replay=demo.search('teamA',order[1],'tuned',2);
      assert.deepEqual(pairs(replay),expected,'second request cannot inherit a wrong empty result');
      assert.equal(replay.cached,true,'equivalent whitespace uses the same normalized key');
    }
  }
});
test('source manifest exactly matches all distributable lab files',()=>{
  const manifest=load('retrieval-files.js');
  const walk=folder=>fs.readdirSync(folder,{withFileTypes:true}).flatMap(e=>['bin','obj'].includes(e.name)?[]:e.isDirectory()?walk(path.join(folder,e.name)):[path.relative(path.join(root,'labs/supportdesk-retrieval-quality'),path.join(folder,e.name)).replaceAll('\\','/')]);
  assert.deepEqual(manifest.map(x=>x[0]).sort(),walk(path.join(root,'labs/supportdesk-retrieval-quality')).sort());
});
