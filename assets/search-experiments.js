/* Offline teaching approximations: no learned embeddings, model, SDK, or network. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AcademySearchExperiments=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const space='toy-topics/v1/4';
  const articles=[
    {id:'ART-101',title:'Request a refund',text:'Refund eligibility and returning a payment after cancellation.',category:'Billing',vector:[1,0,0,0],space},
    {id:'ART-102',title:'Download an invoice',text:'Invoice copies and billing receipt downloads.',category:'Billing',vector:[0,1,0,0],space},
    {id:'ART-201',title:'Reset a password',text:'Password reset steps for a locked login.',category:'Account',vector:[0,0,1,0],space},
    {id:'ART-202',title:'Unlock an account',text:'Account access recovery and login checks.',category:'Account',vector:[0,0,1,0],space},
    {id:'ART-301',title:'Repair an export',text:'Export troubleshooting when a CSV file is empty.',category:'Technical',vector:[0,0,0,1],space},
    {id:'ART-302',title:'Restart a sync',text:'Sync troubleshooting when a transfer stops.',category:'Technical',vector:[0,0,0,1],space}
  ];
  const tokens=text=>text.toLowerCase().match(/[a-z0-9]+/g)||[];
  function validateVector(v){
    if(!Array.isArray(v)||!v.length||v.length>4096)throw new TypeError('Use 1–4096 finite numbers.');
    // Array.some skips holes. Visit every coordinate so sparse arrays fail closed.
    for(let i=0;i<v.length;i++)if(!Object.prototype.hasOwnProperty.call(v,i)||typeof v[i]!=='number'||!Number.isFinite(v[i]))throw new TypeError('Use 1–4096 finite numbers.');
  }
  function cosine(a,b){
    validateVector(a);validateVector(b);if(a.length!==b.length)throw new RangeError('Vector dimensions must match.');
    // Scale before multiplication to protect the browser exercise from overflow.
    const scaleA=Math.max(...a.map(Math.abs)),scaleB=Math.max(...b.map(Math.abs));if(!scaleA||!scaleB)return 0;
    let dot=0,aa=0,bb=0;for(let i=0;i<a.length;i++){const x=a[i]/scaleA,y=b[i]/scaleB;dot+=x*y;aa+=x*x;bb+=y*y;}
    return Math.max(-1,Math.min(1,dot/(Math.sqrt(aa)*Math.sqrt(bb))));
  }
  function vectorize(query){
    if(typeof query!=='string'||query.length>240)throw new TypeError('Use at most 240 characters.');
    const groups=[['refund','refunds','money','back','return','returning','payment','cancellation'],['invoice','invoices','receipt','billing'],['password','reset','login','locked','unlock','account','access'],['export','csv','sync','transfer','file']];
    const vector=[0,0,0,0];for(const word of tokens(query)){const axis=groups.findIndex(group=>group.includes(word));if(axis>=0)vector[axis]++;}return vector;
  }
  function search(query,options={},rows=articles){
    const {mode='hybrid',category='All',k=3,space:querySpace=space}=options;
    if(typeof query!=='string'||!query.trim()||query.length>240)throw new TypeError('Enter a query of 1–240 characters, such as money back.');
    if(!['keyword','vector','hybrid'].includes(mode))throw new TypeError('Choose keyword, vector, or hybrid.');
    if(!['All','Billing','Account','Technical'].includes(category))throw new TypeError('Choose a listed category.');
    if(!Number.isInteger(k)||k<1||k>6)throw new RangeError('Top-k must be between 1 and 6.');
    if(querySpace!==space)throw new TypeError('Model-space mismatch: equal dimensions alone are insufficient. Use toy-topics/v1/4.');
    if(!Array.isArray(rows)||rows.length>100)throw new RangeError('Use at most 100 articles.');
    rows.forEach(row=>{validateVector(row.vector);if(row.space!==space||row.vector.length!==4)throw new TypeError('Stored article model space or dimension mismatch.');});
    const vector=vectorize(query),terms=[...new Set(tokens(query))];
    return rows.filter(row=>category==='All'||row.category===category).map(row=>{
      const words=new Set(tokens(row.title+' '+row.text));const keywordScore=terms.length?terms.filter(x=>words.has(x)).length/terms.length:0;
      const vectorScore=cosine(vector,row.vector),score=mode==='keyword'?keywordScore:mode==='vector'?vectorScore:0.65*Math.max(0,vectorScore)+0.35*keywordScore;
      return {...row,vector:[...row.vector],score,keywordScore,vectorScore};
    }).filter(row=>row.score>0).sort((a,b)=>b.score-a.score||(a.id<b.id?-1:a.id>b.id?1:0)).slice(0,k);
  }
  const mounted=new WeakMap();
  function mount(node,type){
    if(!node||typeof node.replaceChildren!=='function')throw new TypeError('An experiment host is required.');
    mounted.get(node)?.();const doc=node.ownerDocument,listeners=[];
    const el=(tag,text,cls)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
    const mark=(e,name,value='')=>{e.setAttribute('data-search-'+name,value);return e;};
    const on=(e,event,fn)=>{e.addEventListener(event,fn);listeners.push(()=>e.removeEventListener(event,fn));};
    const head=el('div',undefined,'experiment-head');head.append(el('span','Search workshop'),el('span','Toy vectors · offline · synthetic articles'));
    const body=el('div',undefined,'experiment-body');body.style.minWidth='0';
    const result=mark(el('pre','Choose an action to inspect the result.','code-block'),'output');result.style.whiteSpace='pre-wrap';result.style.overflowWrap='anywhere';result.style.minWidth='0';result.setAttribute('aria-live','polite');result.setAttribute('role','status');
    function field(label,name,values){const wrap=el('label',undefined,'field');wrap.append(el('span',label));const input=mark(el(values?'select':'input'),name);input.style.minHeight='44px';input.style.width='100%';input.style.minWidth='0';if(values)values.forEach(([value,text])=>{const option=el('option',text);option.value=value;input.append(option);});else{input.type='text';input.maxLength=240;}wrap.append(input);body.append(wrap);return input;}
    function button(label,action,fn){const e=mark(el('button',label,'choice-button'),'action',action);e.type='button';e.style.minHeight='44px';e.style.whiteSpace='normal';on(e,'click',()=>{try{fn();}catch(error){result.textContent=error.message;}});body.append(e);return e;}
    const say=text=>body.append(el('p',text));
    if(type==='search-arrays'){
      say('Each coordinate has an agreed position. In this toy only: refund, invoice, account, technical. Edit the query; inspect which rules fired. Real learned axes rarely have these readable names.');
      const query=field('Text to map into four toy coordinates','query');query.value='money back';
      button('Inspect toy float array','inspect',()=>{result.textContent=JSON.stringify(vectorize(query.value))+'\n4 dimensions · '+space+'\nEach matching token adds 1 to an authored topic axis. Unknown words add 0.';});
    }else if(type==='search-cosine'){
      say('Query [1,0]. Choose another direction and calculate dot product divided by both lengths. Zero has no mathematical direction; this lab returns 0 safely.');
      const other=field('Article direction','direction',[['same','[2,0] · same direction'],['orthogonal','[0,1] · right angle'],['diagonal','[1,1] · diagonal'],['opposite','[-1,0] · opposite'],['zero','[0,0] · no direction']]);
      button('Calculate cosine','calculate',()=>{const b={same:[2,0],orthogonal:[0,1],diagonal:[1,1],opposite:[-1,0],zero:[0,0]}[other.value];result.textContent='dot = '+b[0]+'; lengths = 1 and '+Math.hypot(...b).toFixed(4)+'\nCosine = '+cosine([1,0],b).toFixed(4)+'\nSimilarity is not a probability or factual confidence.';});
    }else if(type==='search-meaning'){
      say('Compare money back with an unmapped phrase such as reimburse me. Only the first is in our authored rules; no model learned language meaning. Try both.');
      const query=field('Query to compare','query');query.value='money back';
      button('Compare lexical and toy vector','compare',()=>{result.textContent='Query vector '+JSON.stringify(vectorize(query.value))+'\nKeyword: '+(search(query.value,{mode:'keyword',k:1}).map(x=>x.title).join(', ')||'No match')+'\nToy vector: '+(search(query.value,{mode:'vector',k:1}).map(x=>x.title).join(', ')||'No match')+'\nUnknown synonyms need authored rules here; a trained model is not running.';});
    }else if(type==='search-storage'){
      say('An article carries source text, category, vector and model-space version. Equal length does not mean compatible coordinates. Try a different version with the same 4 dimensions.');
      const model=field('Query model space','space',[[space,space],['toy-topics/v2/4','toy-topics/v2/4 · incompatible'],['toy-topics/v1/3','toy-topics/v1/3 · wrong dimensions']]);
      button('Check stored vector compatibility','check-space',()=>{const hit=search('refund',{space:model.value,k:1})[0];result.textContent=JSON.stringify({id:hit.id,category:hit.category,vector:hit.vector,space:hit.space},null,2)+'\nCompatible: metadata and dimensions checked before scoring.';});
    }else if(type==='search-index'){
      say('The six-row lab scans every eligible vector exactly. Change the category and top-k. The comparison count is eligible rows, even if only one result is requested. No ANN graph is built.');
      const category=field('Category before top-k','category',[['All','All'],['Billing','Billing'],['Account','Account'],['Technical','Technical']]);
      const k=field('Maximum results','k',[['1','1'],['3','3'],['6','6']]);
      button('Run exact scan','scan',()=>{const hits=search('refund password',{category:category.value,k:Number(k.value),mode:'vector'}),count=articles.filter(x=>category.value==='All'||x.category===category.value).length;result.textContent='Compared '+count+' eligible vectors; top-k '+k.value+'\n'+hits.map(x=>x.id+' '+x.title+' · '+x.score.toFixed(4)).join('\n')+'\nExact baseline; ANN trades recall for latency at scale and needs measured evaluation.';});
    }else if(type==='search-hybrid'){
      say('Hybrid uses a teaching formula: 0.65 × nonnegative cosine + 0.35 × matched unique query-token fraction. This is neither BM25 nor a provider ranking API. Filter first, score, sort, take k.');
      const query=field('Search fictional help articles','query');query.value='money back';
      const mode=field('Ranking mode','mode',[['keyword','Keyword'],['vector','Toy vector'],['hybrid','Hybrid']]);
      const category=field('Category filter','category',[['All','All'],['Billing','Billing'],['Account','Account'],['Technical','Technical']]);
      button('Search articles','search',()=>{const hits=search(query.value,{mode:mode.value,category:category.value,k:3});result.textContent='4 dimensions · '+space+'\n'+(hits.length?hits.map(x=>x.id+' '+x.title+'\nscore '+x.score.toFixed(4)+' · cosine '+x.vectorScore.toFixed(4)+' · keyword '+x.keywordScore.toFixed(4)).join('\n'):'No matches. Try money back with vector or hybrid, or change the category.');});
    }else throw new RangeError('Unknown search experiment: '+type);
    body.append(result);node.replaceChildren(head,body);
    const dispose=()=>{listeners.splice(0).forEach(fn=>fn());mounted.delete(node);};mounted.set(node,dispose);return dispose;
  }
  return {cosine,vectorize,search,mount};
});
