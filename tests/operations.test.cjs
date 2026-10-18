const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
function load(name){const file=path.join(root,'assets',name);assert.ok(fs.existsSync(file),`${name} supplies the Unit11 contract`);return require(file);}
test('six sequential lessons lead to the final runnable operations capstone',()=>{
 const {lessons,references}=load('operations-content.js');
 const ids=['identity-secrets','evaluation-gates','observability','latency-cost','azure-release','capstone-drills'];
 assert.deepEqual(lessons.map(x=>x.id),ids);
 lessons.forEach((x,i)=>{assert.deepEqual(x.prerequisites,[i?ids[i-1]:'finetuning-decision']);assert.equal(x.unitId,'azure-operations');assert.equal(x.conceptId,x.id);assert.equal(x.labId,'operations-capstone');assert.equal(x.dotnet.lab,true);assert.equal(x.paragraphs.length,4);assert.ok(x.paragraphs.every(p=>p.length>160));assert.equal(x.quiz.options.length,3);assert.ok(x.quiz.options[x.quiz.answer].why);assert.ok(x.example.paths.length>=2);assert.ok(references[x.reference].url.startsWith('https://learn.microsoft.com/'));});
 assert.match(lessons.at(-1).dotnet.next,/11.*learning units.*available/i);
});
test('identity policy rejects a forged or overprivileged selection',()=>{
 const {identity}=load('operations-experiments.js');
 assert.equal(identity('reader','help.read'),'Allowed DEMO');assert.equal(identity('reader','release.promote'),'Denied');assert.equal(identity('admin','help.read'),'Denied');
 assert.equal(identity('constructor','help.read'),'Denied');assert.equal(identity('__proto__','help.read'),'Denied');
});
test('evaluation fails closed for safety, incomplete samples and nonfinite values',()=>{
 const {gates}=load('operations-experiments.js');
 assert.equal(gates(95,0,100),'Pass');assert.equal(gates(95,1,100),'Blocked');
 for(const args of [[NaN,0,100],[95,0,0],[101,0,100],[95,-1,100],[95,0,1.5]])assert.equal(gates(...args),'Invalid');
});
test('cost uses per-million input/output units and validates token bounds',()=>{
 const {cost}=load('operations-experiments.js');assert.equal(cost(1000,500),0.0025);
 for(const x of [NaN,Infinity,0,-1,1.5,100001])assert.equal(cost(x,500),null);
});
test('cache keys isolate tenant, permission and revision and traces omit supplied payloads',()=>{
 const {cacheKey,trace}=load('operations-experiments.js');
 assert.equal(cacheKey('demo-a','reader','v2'),'demo-a|reader|v2');assert.notEqual(cacheKey('demo-b','reader','v2'),cacheKey('demo-a','reader','v2'));
 assert.notEqual(cacheKey('demo-a','reviewer','v2'),cacheKey('demo-a','reader','v2'));assert.notEqual(cacheKey('demo-a','reader','v3'),cacheKey('demo-a','reader','v2'));
 assert.deepEqual(trace('gate','pass','secret payload'),{operation:'gate',outcome:'pass'});assert.equal(trace('prompt body','pass'),null);
});
test('release decisions keep Unknown distinct from healthy and failure rollback',()=>{
 const {release,drill}=load('operations-experiments.js');
 assert.equal(release(true,true,'healthy'),'Complete: V2');assert.equal(release(true,true,'bad'),'RolledBack: V1');assert.equal(release(true,true,'unknown'),'Unknown: inspect evidence');assert.equal(release(true,false,'healthy'),'Blocked: review required');
 assert.equal(drill('attachments',false),'Blocked: attachment boundary');assert.equal(drill('rag',true),'Accepted: scoped retrieval evidence');assert.equal(drill('unknown',true),'Invalid');assert.equal(drill('constructor',true),'Invalid');
});
test('manifest offers every source file and excludes build products',()=>{
 const files=load('operations-files.js');const dir=path.join(root,'labs/supportdesk-operations-capstone');
 const walk=(at,p='')=>fs.readdirSync(at,{withFileTypes:true}).flatMap(e=>['bin','obj'].includes(e.name)?[]:e.isDirectory()?walk(path.join(at,e.name),p+e.name+'/'):[p+e.name]);
 assert.deepEqual(files.map(x=>x[0]).sort(),walk(dir).sort());assert.ok(files.every(x=>x.length===2&&x[1]));
});
