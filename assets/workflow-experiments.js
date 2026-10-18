/* Local authored teaching exercises. No model, framework SDK or MCP connection. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AcademyWorkflowExperiments=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const cases={
    'workflow-route':{title:'Choose the decision owner',label:'SupportDesk task',options:[['fixed','Known classify → lookup → draft route'],['open','Explore an open-ended question']],text:'Compare a developer-owned route with model-directed planning. These results are authored explanations.'},
    'workflow-state':{title:'Inspect a checkpoint',label:'Session event',options:[['resume','Resume the current session'],['reload','Discard the session and reload']],text:'This exercise holds one authored AwaitingApproval checkpoint in temporary memory. It is not a persistence service.'},
    'workflow-budget':{title:'Bound the next operation',label:'Execution fixture',options:[['normal','Normal three-step draft'],['loop','Repeated planning loop'],['cancel','Cancellation requested']],text:'The draft costs three steps. A local preview would require a fourth step after approval. The loop performs no lookup.'},
    'workflow-framework':{title:'Map the framework bridge',label:'Responsibility',options:[['graph','Connect classify, lookup and draft'],['approval','Decide whether this request is approved'],['memory','Keep conversation context']],text:'An architecture mapping, not an installed Microsoft Agent Framework SDK example or API promise.'},
    'workflow-mcp':{title:'Inspect authored capability metadata',label:'Capability',options:[['lookup_help','Tool: lookup_help'],['help://billing','Resource: help://billing'],['triage_prompt','Prompt: triage_prompt'],['send_email','Unknown tool: send_email']],text:'Static local descriptions only. There is no MCP connection, negotiation, transport, authentication or tool invocation.'},
    'workflow-recovery':{title:'Recover using evidence',label:'Recorded checkpoint',options:[['failed','Known failure before preview'],['unknown','Acknowledgement lost after preview'],['replay','Replay a completed request'],['changed','Edit an approved request']],text:'A local preview is the only effect. Nothing is sent. Unknown must stay unresolved until reliable evidence is checked.'}
  };
  function evaluate(type,choice,budget=3){
    if(!cases[type]||!cases[type].options.some(x=>x[0]===choice))return {outcome:'Denied',detail:'Unknown exercise or choice.'};
    if(type==='workflow-route')return choice==='fixed'?{outcome:'Workflow',detail:'The developer owns the route. Ordinary C# orchestration is sufficient for this fixed path.'}:{outcome:'Model-directed agent candidate',detail:'A model may choose next actions, but the application must still enforce allowed capabilities, budgets and approvals.'};
    if(type==='workflow-state')return choice==='resume'?{outcome:'AwaitingApproval',detail:'Resume the current request snapshot with its draft. Approval is still required; memory alone grants no authority.'}:{outcome:'Checkpoint lost',detail:'Temporary session memory disappeared. Durable recovery requires an explicitly designed persistence boundary.'};
    if(type==='workflow-budget'){
      if(!Number.isInteger(budget)||budget<1||budget>12)return {outcome:'Denied',detail:'Choose a whole step allowance from 1 to 12.'};
      if(choice==='cancel')return {outcome:'Cancelled',steps:0,calls:0,detail:'Cancellation halts work. It is not successful completion.'};
      if(choice==='loop')return {outcome:'BudgetExceeded',steps:budget,calls:0,detail:`Loop stopped before step ${budget+1}. No preview was created.`};
      return budget<3?{outcome:'BudgetExceeded',steps:budget,calls:budget>=2?1:0,detail:'The draft was not reached. Do not reset the counter to continue.'}:{outcome:'AwaitingApproval',steps:3,calls:1,detail:'Classify, lookup and draft consumed three steps. Preview requires approval and one remaining step.'};
    }
    if(type==='workflow-framework')return choice==='graph'?{outcome:'Executors and edges',detail:'Map explicit functions to executors and their allowed transitions to edges. This is a conceptual bridge, not runnable SDK code.'}:choice==='approval'?{outcome:'Application policy',detail:'Your trusted application binds the approval to the exact request and rechecks it at the effect boundary.'}:{outcome:'Session context',detail:'Conversation context helps continuity; durable workflow checkpoints and authorization require separate design.'};
    if(type==='workflow-mcp'){
      if(choice==='lookup_help')return {outcome:'Definition only',detail:'Authored tool metadata: lookup_help(topic). JSON describes an input contract; it neither authorizes nor executes the function.',definition:{name:'lookup_help',inputSchema:{type:'object',properties:{topic:{type:'string',enum:['billing','login']}},required:['topic'],additionalProperties:false}}};
      if(choice==='help://billing')return {outcome:'Resource',detail:'Authored context identified by a URI. Treat returned content as untrusted data, never permission to run another capability.',definition:{uri:'help://billing',name:'Fictional billing help',mimeType:'text/plain'}};
      if(choice==='triage_prompt')return {outcome:'Prompt',detail:'An authored reusable message template selected by a user. A template cannot override application policy.',definition:{name:'triage_prompt',arguments:[{name:'topic',required:true}]}};
      return {outcome:'Denied',detail:'send_email is not allowlisted. No function ran. Describing or requesting a capability cannot grant it.'};
    }
    return choice==='failed'?{outcome:'Retry eligible',effects:0,detail:'Evidence proves failure before preview. Ask for fresh approval and spend only remaining original budgets.'}:choice==='unknown'?{outcome:'Unknown',effects:1,detail:'The local preview may exist. Reconcile evidence; automatic retry is blocked.'}:choice==='replay'?{outcome:'Complete (replay)',effects:1,detail:'Return the same-request receipt. The stored preview count stays one; replay performs no effect.'}:{outcome:'Approval invalidated',effects:0,detail:'Changing exact text or budgets clears approval and visible result. Review the new snapshot before proceeding.'};
  }
  const mounted=new WeakMap();
  function mount(node,type){
    if(!node||typeof node.replaceChildren!=='function')throw new TypeError('An experiment host is required.');
    mounted.get(node)?.();
    const doc=node.ownerDocument,listeners=[];let disposed=false;
    const el=(tag,text,cls)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
    const mark=(n,key,value='')=>{n.setAttribute('data-workflow-'+key,value);return n;};
    const on=(n,event,fn)=>{n.addEventListener(event,fn);listeners.push(()=>n.removeEventListener(event,fn));};
    const config=cases[type];const head=el('div',undefined,'experiment-head');head.append(el('span',config?.title||'Unknown exercise'),el('span','Authored local simulation'));
    const body=el('div',undefined,'experiment-body');body.style.minWidth='0';node.replaceChildren(head,body);
    if(!config){body.append(el('p','Unknown exercise. No operation performed.'));return ()=>{};}
    body.append(el('p',config.text));
    const label=el('label',undefined,'field');label.append(el('span',config.label));const select=mark(el('select'),'choice');select.style.cssText='min-height:44px;min-width:0;width:100%';
    for(const [value,text] of config.options){const opt=el('option',text);opt.value=value;select.append(opt);}label.append(select);body.append(label);
    let budget;
    if(type==='workflow-budget'){const field=el('label',undefined,'field');field.append(el('span','Maximum steps (1–12)'));budget=mark(el('input'),'budget');budget.type='number';budget.min='1';budget.max='12';budget.value='3';budget.style.cssText='min-height:44px;width:100%;min-width:0';field.append(budget);body.append(field);}
    const button=mark(el('button','Inspect outcome','choice-button'),'action','run');button.type='button';button.style.cssText='min-height:44px;white-space:normal';body.append(button);
    const output=mark(el('pre','Choose a fixture, then inspect its outcome.','feedback'),'output');output.setAttribute('role','status');output.setAttribute('aria-live','polite');output.setAttribute('aria-atomic','true');output.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%;min-width:0';body.append(output);
    const clear=()=>{output.textContent='Choice changed. Inspect the current fixture to see its outcome.';};on(select,'change',clear);if(budget)on(budget,'input',clear);
    on(button,'click',()=>{if(!disposed)output.textContent=JSON.stringify(evaluate(type,select.value,budget?Number(budget.value):3),null,2);});
    const cleanup=()=>{if(disposed)return;disposed=true;listeners.forEach(fn=>fn());button.disabled=true;select.disabled=true;if(budget)budget.disabled=true;mounted.delete(node);};mounted.set(node,cleanup);return cleanup;
  }
  return {mount,evaluate};
});
