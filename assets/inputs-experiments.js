/* Authored teaching calculations. No OCR, ASR, model inference or training. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AcademyInputsExperiments=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const denied=()=>({outcome:'Denied',detail:'Use supported choices and complete values within the stated bounds.'});
  const text=x=>typeof x==='string'&&x.trim().length>0&&x.length<=200;
  const number=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
  function evaluate(type,x={}){
    if(!x||typeof x!=='object')return denied();
    if(type==='inputs-image'){
      if(!text(x.text)||!['read','damage'].includes(x.task))return denied();
      return {outcome:x.task==='read'?'OCR text candidate':'Vision assessment required',candidate:x.text,source:'image-1',detail:x.task==='read'?'Authored candidate text, not performed OCR. Compare with the source; confidence is not truth.':'Text alone cannot establish parcel damage. No vision model ran.'};
    }
    if(type==='inputs-speech'){
      if(!text(x.speaker)||!number(x.start,0,3600)||!number(x.end,0,3600)||x.end<=x.start||!number(x.confidence,0,1))return denied();
      return {outcome:'Needs review',source:`audio-1 / ${x.speaker} / ${x.start}–${x.end}s`,confidence:x.confidence,detail:x.confidence<0.8?'Authored uncertain segment: inspect the source. Speaker labels are not verified identity.':'Higher confidence still requires review and cannot prove identity or truth. No ASR ran.'};
    }
    if(type==='inputs-evidence'){
      if(!text(x.image)||!text(x.audio))return denied();
      return {outcome:x.image.trim()===x.audio.trim()?'Agreement: still review':'Conflict: staff review',values:[`image-1: ${x.image.trim()}`,`audio-1: ${x.audio.trim()}`],detail:'Both sources retained. Agreement is not proof; conflicting values remain unresolved.'};
    }
    if(type==='inputs-local'){
      if(!['text','vision','speech'].includes(x.capability)||typeof x.noCloud!=='boolean'||!Number.isInteger(x.memory)||!number(x.memory,1,128))return denied();
      const candidates=[{id:'local-text',cloud:false,capabilities:['text'],memory:4,score:80},{id:'cloud-general',cloud:true,capabilities:['text','vision','speech'],memory:0,score:70}];
      const profiles=candidates.filter(p=>p.capabilities.includes(x.capability)&&(!x.noCloud||!p.cloud)&&(p.cloud||p.memory<=x.memory));
      return {outcome:profiles.length?'Illustrative candidate':'No eligible profile',profile:profiles[0]?.id||'',eligible:profiles.map(p=>({id:p.id,illustrativeScore:p.score})),detail:'Fictional profiles and authored scores, not benchmarks. Capability, privacy and memory are hard requirements. No inference ran.'};
    }
    if(type==='inputs-quant'){
      if(!['before','after','baseMs','quantMs'].every(k=>number(x[k],0.001,1000000))||!number(x.accuracy,0,1)||!number(x.minimum,0,1))return denied();
      return {outcome:x.accuracy<x.minimum?'Reject candidate':'Accuracy gate met: measure remaining requirements',sizeRatio:Number((x.before/x.after).toFixed(3)),speedRatio:Number((x.baseMs/x.quantMs).toFixed(3)),detail:'Entered fictional measurements only; a speed ratio below 1 means slower. File size does not establish peak memory. No ONNX Runtime or model runs.'};
    }
    if(type==='inputs-tune'){
      if(!['facts','format'].includes(x.need)||typeof x.baseline!=='boolean'||!Number.isInteger(x.heldout)||!number(x.heldout,0,10000))return denied();
      return {outcome:x.need==='facts'?'Try RAG':!x.baseline?'Measure prompt baseline':x.heldout===0?'Collect held-out data':'Evaluate fine-tuning candidate',detail:'An authored decision aid, not training or deployment. Keep training examples separate from independent evaluation; compare candidate against the baseline.'};
    }
    return denied();
  }
  // [key, label, kind, initial value, choices/min/max/step]
  const configs={
    'inputs-image':{title:'Match the image task',text:'Edit authored candidate text, then choose the question. No pixels are processed.',fields:[['text','Authored candidate text (1–200 characters)','text','Invoice 120'],['task','Question','select','read',[['read','Read text'],['damage','Assess parcel damage']]]]},
    'inputs-speech':{title:'Keep the transcript segment traceable',text:'Change an authored speaker/time/confidence record. No audio is processed.',fields:[['speaker','Speaker label (not authenticated identity)','text','Speaker 1'],['start','Start (seconds, 0–3600)','number',12,0,3600,1],['end','End (seconds, after start)','number',16,0,3600,1],['confidence','Confidence (0–1; not truth)','number',0.61,0,1,0.01]]},
    'inputs-evidence':{title:'Keep both sources',text:'Enter candidate amount strings. Compare agreement with conflict; neither grants approval.',fields:[['image','image-1 amount (1–200 characters)','text','120'],['audio','audio-1 amount (1–200 characters)','text','170']]},
    'inputs-local':{title:'Filter before scoring',text:'Fictional profiles: local-text needs 4 GiB and supports text; cloud-general advertises text, vision and speech. Scores 80/70 are illustrative, not benchmarks.',fields:[['capability','Required capability','select','text',[['text','Text'],['vision','Vision'],['speech','Speech']]],['noCloud','Forbid cloud transfer','checkbox',true],['memory','Available local memory (GiB, 1–128; digits only, no signs, decimals or exponents)','number',8,1,128,1]]},
    'inputs-quant':{title:'Calculate an optimization comparison',text:'Entered fictional measurements only. The calculator does not load ONNX Runtime or benchmark a model.',fields:[['before','Original file size (MiB)','number',100,0.001,1000000,0.001],['after','Candidate file size (MiB)','number',40,0.001,1000000,0.001],['baseMs','Original latency (ms)','number',20,0.001,1000000,0.001],['quantMs','Candidate latency (ms)','number',25,0.001,1000000,0.001],['accuracy','Candidate held-out accuracy (0–1)','number',0.94,0,1,0.01],['minimum','Minimum accuracy (0–1)','number',0.9,0,1,0.01]]},
    'inputs-tune':{title:'Choose the next experiment',text:'Change the problem and evidence available. Training, evaluation and deployment are separate decisions.',fields:[['need','Measured need','select','facts',[['facts','Current approved facts'],['format','Repeated formatting gap']]],['baseline','Measured prompt baseline exists','checkbox',true],['heldout','Independent held-out cases (0–10000)','number',100,0,10000,1]]}
  };
  const mounted=new WeakMap();
  function mount(node,type){
    if(!node||typeof node.replaceChildren!=='function')throw new TypeError('An experiment host is required.');
    mounted.get(node)?.();const doc=node.ownerDocument,cleaners=[],controls={};let disposed=false;
    const el=(tag,value,cls)=>{const n=doc.createElement(tag);if(value!==undefined)n.textContent=value;if(cls)n.className=cls;return n;};
    const on=(n,event,fn)=>{n.addEventListener(event,fn);cleaners.push(()=>n.removeEventListener(event,fn));};
    const config=configs[type],head=el('div',config?.title||'Unknown exercise','experiment-head'),body=el('div',undefined,'experiment-body');body.style.cssText='min-width:0;overflow-wrap:anywhere';node.replaceChildren(head,body);
    const output=el('pre','Edit the inputs, then calculate the current outcome.','feedback');output.setAttribute('data-inputs-output','');output.setAttribute('role','status');output.setAttribute('aria-live','polite');output.setAttribute('aria-atomic','true');output.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;min-width:0;max-width:100%;box-sizing:border-box';
    if(!config){body.append(output);output.textContent=JSON.stringify(denied());return ()=>{};}
    body.append(el('p',config.text));
    const clear=()=>{output.textContent='Inputs changed. Calculate again for the current values.';};
    for(const [key,label,kind,value,choices,max,step] of config.fields){
      const field=el('label',undefined,'field');field.style.cssText='display:block;min-width:0;margin:12px 0';field.append(el('span',label));
      const input=el(kind==='select'?'select':'input');input.setAttribute('data-inputs-field',key);input.style.cssText='display:block;box-sizing:border-box;min-height:44px;width:100%;min-width:0;font:inherit;margin-top:6px';
      if(kind==='select'){for(const [id,title] of choices){const option=el('option',title);option.value=id;input.append(option);}input.value=value;}
      else{input.type=kind;if(kind==='checkbox'){input.checked=value;input.style.width='44px';input.style.height='44px';}else{input.value=value;if(kind==='number'){input.min=choices;input.max=max;input.step=step;}else input.maxLength=200;}}
      on(input,kind==='checkbox'||kind==='select'?'change':'input',clear);on(input,'focus',()=>{input.style.outline='3px solid #90caf9';input.style.outlineOffset='2px';});on(input,'blur',()=>{input.style.outline='';});
      controls[key]=input;field.append(input);body.append(field);
    }
    const run=el('button','Calculate current outcome','choice-button');run.type='button';run.setAttribute('data-inputs-action','run');run.style.cssText='min-height:44px;max-width:100%;white-space:normal';on(run,'focus',()=>{run.style.outline='3px solid #90caf9';});on(run,'blur',()=>{run.style.outline='';});
    on(run,'click',()=>{
      if(disposed)return;
      const values={};
      for(const [key,input] of Object.entries(controls)){
        if(input.type==='checkbox')values[key]=input.checked;
        else if(input.type==='number'){
          // Preserve the lab's unsigned-digit syntax before Number loses it.
          const invalid=input.value===''||(key==='memory'&&/[^0-9]/.test(input.value));
          values[key]=invalid?NaN:Number(input.value);
        }else values[key]=input.value;
      }
      output.textContent=JSON.stringify(evaluate(type,values),null,2);
    });
    body.append(run,output);
    const cleanup=()=>{if(disposed)return;disposed=true;cleaners.forEach(fn=>fn());for(const input of Object.values(controls))input.disabled=true;run.disabled=true;if(mounted.get(node)===cleanup)mounted.delete(node);};mounted.set(node,cleanup);return cleanup;
  }
  return {mount,evaluate};
});
