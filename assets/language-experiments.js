/* Deterministic teaching simulations. No model, credential entry, or network calls. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.AcademyLanguageExperiments=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const mounted=new WeakMap();
  function mount(node,type){
    if(!node || typeof node.replaceChildren!=='function')throw new TypeError('An experiment host is required.');
    if(mounted.has(node))mounted.get(node)();
    const document=node.ownerDocument;
    const listeners=[];
    let disposed=false;
    function el(tag,text,className){
      const value=document.createElement(tag);
      if(text!==undefined)value.textContent=text;
      if(className)value.className=className;
      return value;
    }
    function mark(value,name,key=''){value.setAttribute(`data-lm-${name}`,key);return value;}
    function on(value,event,handler){
      const guarded=e=>{if(!disposed)handler(e);};
      value.addEventListener(event,guarded);
      listeners.push(()=>value.removeEventListener(event,guarded));
    }
    const head=el('div',undefined,'experiment-head');
    head.append(el('span','Language-model workflow'),el('span','Simulation · no API call'));
    const body=el('div',undefined,'experiment-body');
    const feedback=mark(el('div',undefined,'feedback'),'feedback');
    feedback.setAttribute('role','status');
    feedback.setAttribute('aria-live','polite');
    feedback.setAttribute('aria-atomic','true');
    function explain(text,success=false){feedback.textContent=text;feedback.classList.toggle('success',success);}
    function button(label,name,action,key,group){
      const b=mark(el('button',label,'choice-button'),name,key);
      b.type='button';
      on(b,'click',action);
      (group||body).append(b);
      return b;
    }
    function group(){const g=el('div',undefined,'choice-grid');body.append(g);return g;}
    function select(label,name,options){
      const field=el('label',undefined,'field');
      field.append(el('span',label));
      const control=mark(el('select'),name);
      options.forEach(([value,text])=>{const option=el('option',text);option.value=value;control.append(option);});
      field.append(control);body.append(field);return control;
    }
    function draft(){
      const box=el('div',undefined,'result-output');
      box.append(el('span','Authored sample draft · human review required'));
      const value=mark(el('p','No draft yet.'),'draft');
      box.append(value);body.append(box);return value;
    }
    function choices(name,items){
      const controls=group();
      const buttons=items.map(([key,label,message,correct])=>{
        const b=button(label,name,()=>{
          buttons.forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
          explain(message,correct);
        },key,controls);
        b.setAttribute('aria-pressed','false');return b;
      });
    }
    node.replaceChildren(head,body);
    if(type==='lm-review'){
      body.append(el('p','Fictional message: “I was charged twice.” Authored draft: “Your refund was processed today.” No payment records were checked.','scenario-text'));
      choices('review',[
        ['verify','Verify the refund','Correct. Check the payment record in an authorized system. Edit unsupported claims and review before sending. This exercise performs no refund or send.',true],
        ['send','Send without checking','The draft invents a completed refund. Fluent generated text is not truth. Verify the facts and edit the draft before any human-approved send.',false]
      ]);
      explain('Choose the next action. These are fixed teaching responses, not model output.');
    }else if(type==='lm-context'){
      body.append(el('p','Fictional capacity: 128 units. Estimate each English sample using ceiling(characters ÷ 4). This is not a real tokenizer, model limit, or bill.'));
      const history=select('Conversation history','history',[
        ['short','Short relevant history'],['long','Long repeated history']
      ]);
      const budget=select('Output reserve','budget',[
        ['16','16 estimated units'],['48','48 estimated units'],['80','80 estimated units']
      ]);
      const instruction='Draft a short acknowledgement for human review. Do not claim a refund happened.';
      const message='I was charged twice. Please help.';
      const shortHistory='Customer reports a duplicate charge. No payment record has been checked.';
      button('Check estimated budget','calculate',()=>{
        const text=instruction+' '+message+' '+(history.value==='long'?shortHistory.repeat(6):shortHistory);
        const input=Math.ceil(text.length/4),reserve=Number(budget.value),total=input+reserve;
        const fits=total<=128;
        explain(`${text.length} characters → approximately ${input} input units + ${reserve} output reserve = ${total} / 128. ${fits?`${128-total} units of teaching headroom.`:`${total-128} units over the teaching capacity. Remove irrelevant repetition or reduce the reserve.`} This is only a character-based estimate; use model-specific token accounting for real requests.`,fits);
      });
      explain('Choose history and output reserve, then check the estimated budget.');
    }else if(type==='lm-provider'){
      body.append(el('p','Run an authored service-path simulation for “I was charged twice.” Both selections stay entirely in this browser.'));
      const mode=select('Service mode','mode',[
        ['sample','Free sample mode'],['provider','Optional server provider (simulated)']
      ]);
      const outcome=select('Simulated provider outcome','outcome',[
        ['success','Successful response'],['unauthorized','HTTP 401: authorization rejected'],['failure','HTTP 503: provider unavailable'],['incomplete','Stream interrupted after a fragment']
      ]);
      outcome.disabled=true;
      const output=draft();
      on(mode,'change',()=>{
        outcome.disabled=mode.value==='sample';output.textContent='No draft yet.';
        explain(mode.value==='sample'?'Sample selected. Provider outcomes do not affect this free authored response.':'Provider path selected for simulation only. No credentials or network connection are used.');
      });
      on(outcome,'change',()=>{output.textContent='No draft yet.';explain('Outcome changed. Run the simulated request to inspect it.');});
      button('Run simulated request','request',()=>{
        output.textContent='No completed draft.';
        if(mode.value==='sample'){
          output.textContent='Thanks for reporting the duplicate charge. Our team will review it.';
          explain('Sample complete. Fixed authored text; no model, API account, or charge. Review before sending.',true);
        }else if(outcome.value==='success'){
          output.textContent='Thank you for raising this. Please let our team review the charge details.';
          explain('Simulated provider success. A real server would POST to Responses, parse text delta events, and confirm completion. This displayed draft is authored, not generated.',true);
        }else if(outcome.value==='unauthorized'){
          explain('Simulated HTTP 401. Show a safe configuration error and check server authorization privately. No sample fallback is presented as model success.');
        }else if(outcome.value==='failure'){
          explain('Simulated HTTP 503. Provider unavailable; no completed draft. Offer an explicit retry or separately labelled sample mode, without claiming success.');
        }else{
          output.textContent='Thanks for reporting';
          explain('Simulated interruption. This is a partial draft, not a successful completion. Preserve that status and let the user retry deliberately.');
        }
      });
      explain('Free sample mode needs no provider configuration. Run the simulation to inspect the service result.');
    }else if(type==='lm-credentials'){
      body.append(el('p','Choose where OPENAI_API_KEY belongs for the optional .NET 10 InteractiveServer provider. Do not enter any key; this exercise only selects a location.'));
      choices('location',[
        ['server','Server environment','Correct. Trusted server code reads the key and adds authorization to its provider request. Keep values out of browser payloads and logs. The sample mode needs no key.',true],
        ['browser','Browser JavaScript','Browser files and local storage are inspectable. InteractiveServer keeps provider calls on the server; never embed the key in JavaScript or WebAssembly.',false],
        ['repository','Committed settings file','Repository readers and history can expose a committed key. Use private server configuration; replace a key that has been exposed.',false]
      ]);
      explain('Select a location. No credential is collected or stored.');
    }else if(type==='lm-cancellation'){
      body.append(el('p','Fictional clock, five-second deadline. Each Advance click adds one second. At exactly five seconds the deadline wins. No timer or HTTP request runs.'));
      const delay=select('Simulated response delay','delay',[
        ['3','3 seconds: before the deadline'],['5','5 seconds: at the deadline'],['8','8 seconds: after the deadline']
      ]);
      let active=false,elapsed=0;
      const controls=group();
      const sync=()=>{start.disabled=active;step.disabled=!active;stop.disabled=!active;delay.disabled=active;};
      const start=button('Start request','start',()=>{
        active=true;elapsed=0;sync();explain('Receiving at simulated 0 seconds. Advance the clock or stop the request.');
      },'',controls);
      const step=button('Advance one second','step',()=>{
        if(!active)return;
        elapsed++;
        if(elapsed>=5){active=false;explain('Timed out at simulated 5 seconds. The deadline cancelled waiting; no completed draft. Cancellation must reach HTTP and stream reads.');}
        else if(elapsed>=Number(delay.value)){active=false;explain(`Completed at simulated ${elapsed} seconds, before the deadline. A complete draft still needs human review.`,true);}
        else explain(`Receiving at simulated ${elapsed} seconds. No completed draft yet; the five-second deadline is still pending.`);
        sync();
      },'',controls);
      const stop=button('Stop request','stop',()=>{
        if(!active)return;
        active=false;sync();explain(`Stopped by user at simulated ${elapsed} seconds. No completed draft. Cancelling local work does not guarantee zero remote usage charges.`);
      },'',controls);
      sync();explain('Choose a delay, then start a request.');
    }else if(type==='lm-streaming'){
      body.append(el('p','Manually deliver three authored chunks. No model, timers, animation, or automatic motion. Stop preserves a partial draft; disposal prevents further delivery.'));
      const output=draft();
      const chunks=['Thanks for ','reporting this. ','Our team will review it.'];
      let active=false,componentDisposed=false,index=0;
      const controls=group();
      const sync=()=>{
        start.disabled=componentDisposed||active;
        step.disabled=componentDisposed||!active;
        stop.disabled=componentDisposed||!active;
        dispose.disabled=componentDisposed;
      };
      const start=button('Start stream','start',()=>{
        if(componentDisposed||active)return;
        index=0;active=true;output.textContent='';sync();explain('Receiving: 0 of 3 chunks. Press Receive next chunk.');
      },'',controls);
      const step=button('Receive next chunk','step',()=>{
        if(componentDisposed||!active)return;
        output.textContent+=chunks[index++];
        if(index===chunks.length){active=false;explain('Completed: 3 of 3 authored chunks. Human review is still required; this simulation does not send a reply.',true);}
        else explain(`Receiving: ${index} of 3 chunks. The draft is partial; Stop or Dispose prevents additional chunks.`);
        sync();
      },'',controls);
      const stop=button('Stop stream','stop',()=>{
        if(componentDisposed||!active)return;
        active=false;sync();explain(`Stopped: ${index} of 3 chunks received. The partial draft is preserved and further chunks are blocked. Start stream begins a new request.`);
      },'',controls);
      const dispose=button('Dispose component','dispose',()=>{
        componentDisposed=true;active=false;sync();explain(`Disposed: ${index} of 3 chunks received. Active work is cancelled; this component cannot start or receive more text. Mount a fresh component to try again.`);
      },'',controls);
      button('Mount fresh component','reset',()=>{
        componentDisposed=false;active=false;index=0;output.textContent='No draft yet.';sync();explain('Fresh component mounted. No active request; Start stream is available.');
      },'',controls);
      sync();explain('Idle. Start the stream, then receive one chunk at a time.');
    }else{
      explain('This language experiment is not available.');
    }
    body.append(feedback);
    // Integration may call this on navigation. Remounting the same host also cleans up.
    // No global handlers, observers, animation frames, or timers survive detached hosts.
    const cleanup=()=>{
      if(disposed)return;
      disposed=true;
      listeners.forEach(remove=>remove());
      body.querySelectorAll('button, select').forEach(control=>{control.disabled=true;});
      mounted.delete(node);
    };
    mounted.set(node,cleanup);
    return cleanup;
  }
  return {mount};
});
