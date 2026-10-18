const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const load=name=>{const file=path.join(__dirname,'../assets',name);assert.ok(fs.existsSync(file),`${name} must supply the Unit 10 implementation`);return require(file);};
test('lesson journey exposes six sequential topics and complete runnable-lab contracts',()=>{
  const {lessons,references}=load('inputs-content.js');
  const ids=['images-ocr','speech-transcripts','multimodal-inputs','local-inference','onnx-quantization','finetuning-decision'];
  assert.deepEqual(lessons.map(x=>x.id),ids);
  lessons.forEach((x,i)=>{
    assert.deepEqual(x.prerequisites,[i?ids[i-1]:'workflow-recovery']);
    assert.equal(x.unitId,'model-choices');assert.equal(x.conceptId,x.id);assert.equal(x.labId,'attachment-review');
    assert.equal(x.dotnet.lab,true);assert.equal(x.paragraphs.length,4);assert.ok(x.paragraphs.every(p=>p.length>190));
    assert.equal(x.quiz.options.length,3);assert.ok(x.quiz.options[x.quiz.answer].why);assert.ok(x.example.paths.length>=2);
    assert.ok(references[x.reference].url.startsWith('https://'));assert.ok(x.experiment.startsWith('inputs-'));
  });
});
test('OCR task selection refuses to invent visual meaning from extracted text',()=>{
  const {evaluate}=load('inputs-experiments.js');
  assert.equal(evaluate('inputs-image',{task:'read',text:'Invoice 120'}).outcome,'OCR text candidate');
  assert.equal(evaluate('inputs-image',{task:'damage',text:'Invoice 120'}).outcome,'Vision assessment required');
  assert.equal(evaluate('inputs-image',{task:'read',text:''}).outcome,'Denied');
});
test('transcript validation preserves speaker and time and rejects impossible segments',()=>{
  const {evaluate}=load('inputs-experiments.js');
  const r=evaluate('inputs-speech',{speaker:'Speaker 2',start:12,end:16,confidence:0.61});
  assert.equal(r.outcome,'Needs review');assert.equal(r.source,'audio-1 / Speaker 2 / 12–16s');
  assert.equal(evaluate('inputs-speech',{speaker:'Speaker 2',start:16,end:12,confidence:0.99}).outcome,'Denied');
});
test('conflicting modalities retain both values instead of choosing high confidence as truth',()=>{
  const {evaluate}=load('inputs-experiments.js');
  assert.deepEqual(evaluate('inputs-evidence',{image:'120',audio:'170'}).values,['image-1: 120','audio-1: 170']);
  assert.equal(evaluate('inputs-evidence',{image:'120',audio:'170'}).outcome,'Conflict: staff review');
  assert.equal(evaluate('inputs-evidence',{image:'',audio:'170'}).outcome,'Denied');
});
test('model policy cannot override capability privacy or hardware requirements',()=>{
  const {evaluate}=load('inputs-experiments.js');
  assert.equal(evaluate('inputs-local',{capability:'vision',noCloud:true,memory:8}).outcome,'No eligible profile');
  assert.equal(evaluate('inputs-local',{capability:'text',noCloud:true,memory:8}).profile,'local-text');
  assert.equal(evaluate('inputs-local',{capability:'text',noCloud:true,memory:2}).outcome,'No eligible profile');
  assert.equal(evaluate('inputs-local',{capability:'vision',noCloud:false,memory:8}).profile,'cloud-general');
  assert.equal(evaluate('inputs-local',{capability:'invented',noCloud:false,memory:8}).outcome,'Denied');
});
test('quantization uses supplied measurements and blocks accuracy regressions',()=>{
  const {evaluate}=load('inputs-experiments.js');
  assert.equal(evaluate('inputs-quant',{before:100,after:40,baseMs:20,quantMs:25,accuracy:0.88,minimum:0.9}).outcome,'Reject candidate');
  const r=evaluate('inputs-quant',{before:100,after:40,baseMs:20,quantMs:25,accuracy:0.94,minimum:0.9});
  assert.equal(r.sizeRatio,2.5);assert.equal(r.speedRatio,0.8);
  assert.equal(evaluate('inputs-quant',{before:100,after:0,baseMs:20,quantMs:25,accuracy:0.94,minimum:0.9}).outcome,'Denied');
});
test('fine tuning requires a measured baseline and independent held-out evaluation',()=>{
  const {evaluate}=load('inputs-experiments.js');
  assert.equal(evaluate('inputs-tune',{need:'facts',baseline:true,heldout:100}).outcome,'Try RAG');
  assert.equal(evaluate('inputs-tune',{need:'format',baseline:false,heldout:100}).outcome,'Measure prompt baseline');
  assert.equal(evaluate('inputs-tune',{need:'format',baseline:true,heldout:0}).outcome,'Collect held-out data');
  assert.equal(evaluate('inputs-tune',{need:'format',baseline:true,heldout:100}).outcome,'Evaluate fine-tuning candidate');
  assert.equal(evaluate('inputs-tune',{need:'format',baseline:true,heldout:-1}).outcome,'Denied');
});
test('source manifest delivers all lab files without build outputs',()=>{
  const files=load('inputs-files.js');const dir=path.join(__dirname,'../labs/supportdesk-attachment-review');
  const walk=(at,prefix='')=>fs.readdirSync(at,{withFileTypes:true}).flatMap(e=>['bin','obj'].includes(e.name)?[]:e.isDirectory()?walk(path.join(at,e.name),prefix+e.name+'/'):[prefix+e.name]);
  assert.deepEqual(files.map(x=>x[0]).sort(),walk(dir).sort());assert.ok(files.every(x=>x.length===2&&x[1]));
});
