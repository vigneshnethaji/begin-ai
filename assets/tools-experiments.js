/* Authored offline simulations only. No model, network, storage, or business writes. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.AcademyToolsExperiments=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const mounted=new WeakMap();
  const json=value=>JSON.stringify(value,null,2);
  const proposal=()=>({tool:'lookup_ticket',arguments:{ticketId:'DEMO-104'}});
  const unavailable='Ticket unavailable.';
  function validate(text){
    if(typeof text!=='string'||text.length>4000)return {error:'Use at most 4000 UTF-16 code units.'};
    let value;
    try{value=JSON.parse(text);}catch{return {error:'Invalid JSON syntax. Use a complete object with quoted keys and no comments or trailing commas.'};}
    const exact=(obj,keys)=>obj!==null&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).length===keys.length&&keys.every(key=>Object.prototype.hasOwnProperty.call(obj,key));
    if(!exact(value,['tool','arguments']))return {error:'Require exactly tool and arguments, with matching case. Nulls, arrays, missing fields, and extra fields are rejected.'};
    if(value.tool!=='lookup_ticket')return {error:'Only lookup_ticket is in the allowlist.'};
    if(!exact(value.arguments,['ticketId']))return {error:'arguments must contain only ticketId. Caller identity comes from the app, never model arguments.'};
    if(typeof value.arguments.ticketId!=='string'||!/^DEMO-[0-9]{3}$/.test(value.arguments.ticketId)||value.arguments.ticketId.length!==8)
      return {error:'ticketId must be exactly DEMO- followed by three ASCII digits, such as DEMO-104; no whitespace.'};
    return {value};
  }
  function mount(node,type){
    if(!node||typeof node.replaceChildren!=='function')throw new TypeError('An experiment host is required.');
    if(mounted.has(node))mounted.get(node)();
    const document=node.ownerDocument,listeners=[];
    let disposed=false;
    function el(tag,text,className){const item=document.createElement(tag);if(text!==undefined)item.textContent=text;if(className)item.className=className;return item;}
    function mark(item,name,value=''){item.setAttribute('data-tl-'+name,value);return item;}
    function on(item,event,handler){const guarded=e=>{if(!disposed)handler(e);};item.addEventListener(event,guarded);listeners.push(()=>item.removeEventListener(event,guarded));}
    const head=el('div',undefined,'experiment-head');head.append(el('span','Tools and actions'),el('span','Authored simulation · offline · fake identities · no API calls'));
    const body=el('div',undefined,'experiment-body');body.style.minWidth='0';
    const feedback=mark(el('div',undefined,'feedback'),'feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.setAttribute('aria-atomic','true');
    function explain(text,success=false){feedback.textContent=text;feedback.classList.toggle('success',success);}
    function group(){const item=el('div',undefined,'choice-grid');item.style.gridTemplateColumns='repeat(auto-fit, minmax(min(100%, 180px), 1fr))';body.append(item);return item;}
    function button(label,action,handler,parent=body){const item=mark(el('button',label,'choice-button'),'action',action);item.type='button';item.style.minHeight='44px';item.style.whiteSpace='normal';on(item,'click',handler);parent.append(item);return item;}
    function select(label,name,options){const field=el('label',undefined,'field');field.append(el('span',label));const item=mark(el('select'),name);item.style.minHeight='44px';item.style.width='100%';item.style.minWidth='0';options.forEach(([value,text])=>{const opt=el('option',text);opt.value=value;item.append(opt);});item.value=options[0][0];field.append(item);body.append(field);return item;}
    function output(label){const box=el('div',undefined,'code-block');box.style.minWidth='0';box.append(el('span',label,'code-header'));const item=mark(el('pre','Choose an action to inspect the authored result.'),'output');item.style.whiteSpace='pre-wrap';item.style.overflowWrap='anywhere';item.style.maxWidth='100%';box.append(item);body.append(box);return item;}
    const canRead=(caller,ticket,revoked=false)=>!revoked&&caller==='demo-reader'&&ticket==='DEMO-104';
    const fictionalSummary='Fictional DEMO-104: demo customer reports an export error. Status: open.';
    node.replaceChildren(head,body);
    if(type==='tools-function'){
      body.append(el('p','Choose the one capability exposed by this lab. The application owns a fixed allowlist; choosing a name does not invoke a function.'));
      const result=output('Local normalized proposal · not provider wire format'),controls=group();
      [['lookup','lookup_ticket','Choose lookup_ticket'],['refund','refund_customer','Choose refund_customer'],['sql','run_sql','Choose run_sql']].forEach(([id,name,label])=>button(label,'allow-'+id,()=>{
        result.textContent=json({tool:name,arguments:{ticketId:'DEMO-104'}})+'\nInvocations: 0';
        explain(name==='lookup_ticket'?'Name accepted by the application allowlist. Validate arguments, authorize the demo caller, and explicitly approve before invoking.':'Tool not allowed. Reject before routing; helpful wording cannot add a capability.',name==='lookup_ticket');
      },controls));
      explain('Only lookup_ticket maps to the known read-only function. No generated code, SQL, reflection, or text evaluation is used.');
    }else if(type==='tools-arguments'){
      body.append(el('p','Local normalized JSON, not literal OpenAI wire format. Exactly tool and arguments; only ticketId inside arguments. Identity is supplied separately by the app.'));
      body.append(el('p','Browser teaching limits: maximum 4000 UTF-16 code units. JSON.parse keeps the last duplicate key; this exercise does not independently enforce parser depth. The C# lab additionally rejects duplicate properties and enforces maximum depth 6. Browser acceptance never replaces server validation.'));
      const fixtures=select('Load an authored proposal','fixture',[['valid','Valid local proposal'],['extra','Extra identity argument'],['wrong','Wrong ticket ID type'],['malformed','Malformed JSON'],['duplicate','Duplicate key: browser limitation']]);
      const field=el('label',undefined,'field');field.append(el('span','Proposal JSON (maximum 4000 characters)'));const input=mark(el('textarea'),'json');input.maxLength=4000;input.rows=8;input.spellcheck=false;input.style.width='100%';input.style.minWidth='0';field.append(input);body.append(field);
      const result=output('Syntax and local contract checks');
      function load(){const values={valid:json(proposal()),extra:json({tool:'lookup_ticket',arguments:{ticketId:'DEMO-104',caller:'admin'}}),wrong:json({tool:'lookup_ticket',arguments:{ticketId:104}}),malformed:'{"tool":"lookup_ticket",',duplicate:'{"tool":"lookup_ticket","arguments":{"ticketId":"DEMO-999","ticketId":"DEMO-104"}}'};input.value=values[fixtures.value]||values.valid;input.removeAttribute('aria-invalid');result.textContent='Not checked yet.';explain('Edit or validate the loaded proposal. No lookup will run.');}
      on(fixtures,'change',load);on(input,'input',()=>{input.removeAttribute('aria-invalid');result.textContent='Edited proposal has not been checked.';explain('Previous validation is stale. Check this exact text again.');});
      button('Validate arguments','validate',()=>{const checked=validate(input.value);input.setAttribute('aria-invalid',String(!!checked.error));result.textContent=checked.error?'Shape rejected.':'Local shape accepted · no invocation\n'+json(checked.value);explain(checked.error||'Local shape accepted only. JSON.parse collapses duplicate keys; C# must reject duplicates and enforce depth 6. Permission and explicit approval remain separate checks.',!checked.error);});load();
    }else if(type==='tools-execution'){
      body.append(el('p','Fixed simulated caller: demo-reader. Request demo-execution-1 targets DEMO-104. Proposing and checking do not enter the fictional lookup. Repeat invocation returns a recorded result after current gates.'));
      const result=output('Proposal versus invocation counter'),controls=group();let current=null,checked=false,approved=false,invocations=0,cached=null;
      function show(state){result.textContent=state+'\nInvocations: '+invocations+(current?'\n'+json(current):'')+(cached?'\n'+cached:'');}
      button('1. Propose lookup','propose',()=>{current=proposal();checked=false;approved=false;show('Proposed');explain('Proposal received. No function has run.');},controls);
      button('2. Validate and authorize','validate',()=>{if(!current){explain('Propose a lookup first.');return;}checked=!validate(json(current)).error&&canRead('demo-reader',current.arguments.ticketId);approved=false;show('Validated and authorized; approval pending');explain('Contract and simulated scope checked. Invocations stay unchanged. Explicit approval is next.',true);},controls);
      button('3. Explicitly approve','approve',()=>{if(!checked){explain('Validate and authorize the proposal first.');return;}approved=true;show('Exact request approved');explain('Approval binds demo-execution-1, lookup_ticket, DEMO-104, and demo-reader. No read yet.',true);},controls);
      button('4. Invoke lookup','invoke',()=>{if(!current||!checked||!approved){show('Blocked');explain('Invocation blocked: proposal, validation, permission, and explicit approval are all required.');return;}if(!canRead('demo-reader',current.arguments.ticketId)){show('Blocked');explain(unavailable);return;}const replay=cached!==null;if(!replay){invocations++;cached=fictionalSummary;}show(replay?'Success · Replay: true':'Success · Replay: false');explain(replay?'Current gates passed; recorded result replayed without another invocation.':'The app invoked the fictional read-only lookup once. This is an authored simulation.',true);},controls);
      show('No proposal');explain('Start at Propose, then try Invoke early to observe the gate.');
    }else if(type==='tools-authorization'){
      body.append(el('p','All identities and permissions are simulated. Demo reader can read DEMO-104. Demo guest cannot. Inaccessible and unknown targets return the same generic message. No authentication happens here.'));
      const identity=select('Simulated app-supplied identity','identity',[['demo-reader','Demo reader (simulated)'],['demo-guest','Demo guest (simulated)']]);
      const ticket=select('Proposed ticket ID','ticket',[['DEMO-104','DEMO-104'],['DEMO-105','DEMO-105'],['DEMO-999','DEMO-999']]);
      const result=output('Exact approval and current permission'),controls=group();let approval=null,revoked=false,reads=0;const cache=new Map();
      const binding=()=>json(['demo-auth-1','lookup_ticket',ticket.value,identity.value]);
      function invalidate(){approval=null;result.textContent='Request edited. Approval invalidated.\nReads: '+reads;explain('Changing caller or ticket clears approval, including when you later change back.');}
      on(identity,'change',invalidate);on(ticket,'change',invalidate);
      button('Explicitly approve this request','approve',()=>{if(!canRead(identity.value,ticket.value,revoked)){approval=null;result.textContent='Blocked\nReads: '+reads;explain(unavailable);return;}approval=binding();result.textContent='Approved exact request demo-auth-1\nReads: '+reads;explain('Exact request approved for the simulated caller. Permission will be checked again at invoke and replay.',true);},controls);
      button('Invoke or replay','invoke',()=>{
        // Check current permission before approval or cache disclosure.
        if(!canRead(identity.value,ticket.value,revoked)){result.textContent='Blocked\nReads: '+reads;explain(unavailable);return;}
        if(approval!==binding()){result.textContent='Blocked\nReads: '+reads;explain('Fresh explicit approval required for this exact request.');return;}
        const key=binding(),replay=cache.has(key);if(!replay){reads++;cache.set(key,fictionalSummary);}result.textContent='Success\nReads: '+reads+'\nReplay: '+replay+'\n'+cache.get(key);explain('Current permission and exact approval passed. '+(replay?'Returned the recorded fictional result without another read.':'Performed one fictional read.'),true);
      },controls);
      button('Revoke demo reader permission','revoke',()=>{revoked=true;approval=null;result.textContent='Simulated permission revoked. Cached summary hidden.\nReads: '+reads;explain('Try Invoke or replay. Current authorization will block disclosure, including a cached result.');},controls);
      explain('Approve DEMO-104 as demo-reader, then invoke. Edit a field or revoke permission to observe the boundary.');
    }else if(type==='tools-retries'){
      body.append(el('p','One idea: retry only a known transient before the read. Maximum two attempts total. The app supplies request demo-retry-1 and a simulated demo-reader approval for the exact proposal; it rechecks both before read or replay.'));
      body.append(el('p','This exercise keeps one result in memory. Changing scenario explicitly resets that teaching run and clears its cache. Reload/remount also loses state. No durable exactly-once guarantee. Unknown is held for reconciliation or a separate human-controlled read; writes are not implemented.'));
      const scenario=select('Authored failure scenario','scenario',[['success','Normal read succeeds'],['transient','Known transient before read, then success'],['exhausted','Known transient before read, twice'],['lost','Response lost after read']]);
      const result=output('Recorded outcome, attempts, reads, and replay'),controls=group();let record=null,reads=0,revoked=false;
      const key=json(['demo-retry-1','lookup_ticket','DEMO-104','demo-reader']);
      function show(outcome,attempts,replay=false){result.textContent='Outcome: '+outcome+'\nRequest: demo-retry-1\nTool: lookup_ticket\nTicket: DEMO-104\nCaller: demo-reader\nAttempts: '+attempts+'\nReads: '+reads+'\nReplay: '+replay;}
      function run(replayOnly=false,changed=false){
        if(!canRead('demo-reader','DEMO-104',revoked)){show('Blocked',record?record.attempts:0);explain(unavailable);return;}
        if(changed){if(!record){explain('Run the original approved request before trying changed parameters.');return;}show('Conflict',record.attempts);explain('Same request ID with changed arguments conflicts. No read or cached payload is returned. The edit also invalidates its earlier approval.');return;}
        if(record){if(record.key!==key){show('Conflict',record.attempts);return;}show(record.outcome,record.attempts,true);explain(record.outcome==='Unknown'?'Unknown remains Unknown. No automatic retry or new read. Reconcile or deliberately arrange a separate human-controlled read.':'Current permission and exact original approval checked. Replayed the memory-only record with no additional read.',record.outcome==='Success');return;}
        if(replayOnly){explain('No recorded outcome yet. Run the scenario first.');return;}
        // Literal synthetic boundary outcomes, not real transient/network errors.
        const attempts=['transient','exhausted'].includes(scenario.value)?2:1;
        reads=scenario.value==='exhausted'?0:1;
        const outcome=scenario.value==='lost'?'Unknown':scenario.value==='exhausted'?'Failed':'Success';
        record={key,outcome,attempts};show(outcome,attempts);
        explain(outcome==='Unknown'?'Response lost AFTER read: Unknown. Stop automatic retry; no successful result can be claimed.':outcome==='Failed'?'Two known transient-before-read failures. Stop at two attempts; zero reads.':'Recorded success after '+attempts+' attempt(s) and one fictional read.',outcome==='Success');
      }
      button('Run approved scenario','run',()=>run(),controls);button('Replay same request','replay',()=>run(true),controls);button('Try changed arguments, same ID','conflict',()=>run(false,true),controls);
      button('Revoke demo permission','revoke',()=>{revoked=true;result.textContent='Permission revoked; recorded payload hidden.\nReads: '+reads;explain('Replay must recheck current permission.');},controls);
      on(scenario,'change',()=>{record=null;reads=0;revoked=false;result.textContent='New teaching run; in-memory record cleared.\nAttempts: 0\nReads: 0';explain('Scenario reset supplies a new simulated exact approval for the original DEMO-104 proposal. Run the selected fixed case.');});
      explain('Run a scenario, then replay it or try a conflicting argument. No network request is made.');
    }else if(type==='tools-audit'){
      body.append(el('p','Inspect a fixed application trace. Fields contain only fictional identifiers and bounded outcomes. No secrets, complete ticket payload, or raw untrusted argument text is logged. These are local labels, not provider statuses; this trace is not durable.'));
      const scenario=select('Authored trace','scenario',[['success','Known success and cached replay'],['blocked','Permission blocked'],['invalid','Argument contract rejected'],['conflict','Changed arguments under one request ID'],['failed','Known failures before read'],['unknown','Lost response and unresolved replay']]);
      const result=output('Minimal fictional audit events');
      button('Inspect audit trace','trace',()=>{
        const base={requestId:'demo-audit-1',tool:'lookup_ticket',ticketId:'DEMO-104',callerId:'demo-reader',attempts:1,replay:false};
        const events={success:[{...base,outcome:'Success'},{...base,replay:true,outcome:'Success'}],blocked:[{...base,callerId:'demo-guest',attempts:0,outcome:'Blocked'}],invalid:[{...base,ticketId:null,attempts:0,outcome:'Invalid'}],conflict:[{...base,outcome:'Success'},{...base,ticketId:'DEMO-105',attempts:0,outcome:'Conflict'}],failed:[{...base,attempts:2,outcome:'Failed'}],unknown:[{...base,outcome:'Unknown'},{...base,replay:true,outcome:'Unknown'}]};
        const chosen=events[scenario.value]||events.success;result.textContent=chosen.map(json).join('\n\n');
        explain(scenario.value==='unknown'?'Unknown is preserved on replay; no new execution attempt is claimed. Reconcile using reliable evidence or arrange a separate human-controlled read.':scenario.value==='invalid'?'Invalid input has no validated ticket ID, so the trace records null rather than copying raw text.':'Trace records known application outcomes and exact correlation. Replay does not increase the original attempt count.');
      });
      on(scenario,'change',()=>{result.textContent='Selection changed. Inspect the selected trace.';explain('No new result is claimed until you inspect the selected authored trace.');});explain('Inspect Success, Blocked, Invalid, Conflict, Failed, or Unknown. Never infer success from a proposal or generated prose.');
    }else explain('This tools experiment is not available.');
    body.append(feedback);
    const cleanup=()=>{if(disposed)return;disposed=true;listeners.forEach(remove=>remove());body.querySelectorAll('button, select, textarea, input').forEach(control=>{control.disabled=true;});mounted.delete(node);};
    mounted.set(node,cleanup);return cleanup;
  }
  return {mount};
});
