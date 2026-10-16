/* Small, deterministic teaching interactions. No model or API runs here. */
(function() {
  'use strict';
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const scenarios = {
    'sort-features': {
      labels: ['An explicit rule', 'A learned model'],
      items: [
        ['The API rejects messages with more than 2,000 characters.',0,'The developer specifies the limit exactly. No learned patterns are needed.'],
        ['A service categorizes unfamiliar messages using patterns learned from past tickets.',1,'The behavior comes from learned examples. A category is a suggestion to evaluate, not a guaranteed fact.'],
        ['The screen displays “Thanks for contacting us” whenever a ticket is saved.',0,'A friendly sentence can be a fixed template. The appearance of intelligence does not tell you how a feature works.']
      ]
    },
    'training-sort': {
      labels: ['Training', 'Inference', 'Collecting feedback'],
      items: [
        ['A console tool uses labelled messages to adjust the model’s learned patterns.',0,'This is training: examples change the model’s learned behavior.'],
        ['An ASP.NET Core service asks a saved model to categorize a new message.',1,'This is inference: the application uses a model that already exists.'],
        ['A staff member corrects Billing to Technical, and your app stores the correction.',2,'This records feedback. It can support a future training dataset, but it is not automatically a training run.']
      ]
    },
    choose: {
      labels: ['An explicit C# rule', 'A small classifier', 'An LLM with review'],
      items: [
        ['Reject requests with no visible message text.',0,'The condition is exact. Use ordinary validation and test it directly.'],
        ['Suggest one of three ticket categories. You have suitable labelled examples and want a small local baseline to evaluate.',1,'A small classifier is a sensible starting point under these assumptions. Compare measured quality before considering a larger model.'],
        ['Draft a new reply that summarizes a conversation and suggests a next step for an agent to approve.',2,'This requires generating language. A language model may help, while a person reviews the proposed response.']
      ]
    }
  };
  function renderScenarios(node, config) {
    let index = 0;
    function draw(focus) {
      const item=config.items[index];
      node.innerHTML=`<div class="experiment-head"><span>SupportDesk decision</span><span>${index+1} of ${config.items.length}</span></div><div class="experiment-body"><p class="scenario-text" tabindex="-1">${esc(item[0])}</p><div class="choice-grid">${config.labels.map((text,i)=>`<button class="choice-button" data-pick="${i}" aria-pressed="false">${esc(text)}</button>`).join('')}</div><div class="feedback" role="status" aria-live="polite"></div><div class="experiment-actions"><span>Try a choice to see why it fits.</span><button class="button secondary" data-next>${index===config.items.length-1?'Start again':'Next scenario'}</button></div></div>`;
      if(focus) node.querySelector('.scenario-text').focus({preventScroll:true});
      node.querySelectorAll('[data-pick]').forEach(button=>button.addEventListener('click',()=>{
        const chosen=Number(button.dataset.pick), correct=chosen===item[1];
        node.querySelectorAll('[data-pick]').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.classList.toggle('correct',b===button&&correct);});
        const feedback=node.querySelector('.feedback');
        feedback.classList.toggle('success',correct);
        feedback.innerHTML=`<strong>${correct?'That fits.':'Consider how the decision is made.'}</strong><p>${esc(correct?item[2]:`The best fit here is “${config.labels[item[1]]}”. ${item[2]}`)}</p>`;
      }));
      node.querySelector('[data-next]').addEventListener('click',()=>{index=(index+1)%config.items.length;draw(true);});
    }
    draw(false);
  }
  function keyword(node) {
    node.innerHTML=`<div class="experiment-head"><span>Exact keyword rule</span><span>Editable C# behavior</span></div><div class="experiment-body"><label class="field">Customer message<textarea id="rule-message" rows="3" maxlength="2000">I need a refund</textarea></label><label class="field">Send to Billing when this word appears<input id="rule-keyword" value="refund" maxlength="40" autocomplete="off"></label><div class="chip-group" aria-label="Example messages"><button class="chip-button" data-message="I need a refund">Exact keyword</button><button class="chip-button" data-message="Please return my payment">Same intent, different words</button><button class="chip-button" data-message="I cannot sign in">Different request</button></div><div class="result-output" aria-live="polite"><span>Rule chooses</span><strong id="rule-result"></strong></div><p class="caption" id="rule-explanation" style="margin:14px 0 0"></p></div>`;
    const message=node.querySelector('#rule-message'), keyword=node.querySelector('#rule-keyword');
    const update=()=>{
      const result=AcademyCore.classifyRule(message.value,keyword.value);
      node.querySelector('#rule-result').textContent=result;
      node.querySelector('#rule-explanation').textContent=!message.value.trim()?'This demo has no message to route. The desktop lab adds explicit rejection for empty input.':!keyword.value.trim()?'Enter a keyword to define a condition. Without one, this demo uses the General queue.':result==='Billing'?'The characters match, ignoring letter case. This rule does not understand the meaning of the message.':'The keyword was not found. A related meaning alone cannot satisfy this exact rule.';
    };
    message.addEventListener('input',update);keyword.addEventListener('input',update);
    node.querySelectorAll('[data-message]').forEach(b=>b.addEventListener('click',()=>{message.value=b.dataset.message;update();}));update();
  }
  function boundary(node) {
    const examples=[['I was charged twice.','Billing','Show a Billing suggestion. Staff can verify the payment in an authorized system.'],['I cannot reset my password.','Account','Show an Account suggestion. Do not reset credentials without the application’s normal checks.'],['The upload button stops responding.','Technical','Show a Technical suggestion. Saving a ticket is still an application responsibility.']];
    node.innerHTML=`<div class="experiment-head"><span>Inspect the model boundary</span><span>Fixed example responses</span></div><div class="experiment-body"><label class="field">Choose an input message<select id="model-input">${examples.map((x,i)=>`<option value="${i}">${esc(x[0])}</option>`).join('')}</select></label><div id="model-result" aria-live="polite"></div></div>`;
    const update=()=>{
      const example=examples[Number(node.querySelector('select').value)];
      node.querySelector('#model-result').innerHTML=`<div class="result-output"><span>Illustrative category output</span><strong>${esc(example[1])}</strong></div><div class="connection-note"><strong>Your application’s responsibility</strong><p>${esc(example[2])}</p></div><p class="caption" style="margin:16px 0 0">Changing this selection looks up an authored example. It does not call or train a model.</p>`;
    };
    node.querySelector('select').addEventListener('change',update);update();
  }
  function evaluate(node) {
    const rows=[['Please refund this duplicate charge.','Billing','Billing'],['My password reset link expired.','Account','Account'],['My refund button crashes.','Billing','Technical'],['The screen freezes on upload.','Technical','Technical'],['Please help me access my account.','General','Account']];
    node.innerHTML=`<div class="experiment-head"><span>Five held-out messages</span><span>Illustrative evaluation</span></div><div class="experiment-body"><p>Each message has a category reviewed by a person. Compare the sample predictions with those labels.</p><button class="button" id="reveal-evaluation">Reveal predictions and compare</button><div id="evaluation-results" aria-live="polite"></div></div>`;
    node.querySelector('button').addEventListener('click',()=>{
      node.querySelector('#evaluation-results').innerHTML=`<ul class="evaluation-list">${rows.map(row=>`<li>${esc(row[0])}<div class="evaluation-labels"><span>Predicted: ${esc(row[1])}</span><span class="${row[1]===row[2]?'':'miss'}">Reviewed: ${esc(row[2])} · ${row[1]===row[2]?'Match':'Mismatch'}</span></div></li>`).join('')}</ul><div class="feedback"><strong>3 of 5 match. Inspect the 2 mistakes.</strong><p>The crash is a technical issue, and the access request concerns an account. Five examples are too few to establish production quality. These fixed examples teach the evaluation process.</p></div>`;
      node.querySelector('button').textContent='Predictions revealed';node.querySelector('button').disabled=true;
    });
  }
  window.AcademyExperiments={mount(node,type){
    if(scenarios[type])renderScenarios(node,scenarios[type]);
    else if(type==='keyword')keyword(node);
    else if(type==='model-boundary')boundary(node);
    else if(type==='evaluate')evaluate(node);
    else if(type.startsWith('ml-'))AcademyMlnetExperiments.mount(node,type);
    else if(type.startsWith('lm-'))AcademyLanguageExperiments.mount(node,type);
  }};
})();
