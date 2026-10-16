/* Authored learning interactions; actual model training lives in the C# lab. */
(() => {
  'use strict';
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const banks={
    'ml-features':{labels:['Use as an input feature','Keep out of the inputs'],items:[
      ['Customer message text',0,'The text is available when a new request arrives and contains clues about its meaning.'],
      ['The category entered by staff after review',1,'This is the target label. It teaches the learner during training but must not be supplied as a prediction input.'],
      ['The row number in the training file',1,'This arbitrary storage position is not a useful first feature for a new message.']
    ]},
    'ml-labels':{labels:['Billing','Account','Technical','Needs clarification'],items:[
      ['The customer says: “I was charged twice for my subscription.”',0,'The request concerns payment. Under our category policy, its reviewed label is Billing.'],
      ['The customer says: “My password reset link has expired.”',1,'This concerns access to an account. The reviewed label is Account.'],
      ['The customer says: “The file upload screen freezes.”',2,'The customer reports application behavior. The reviewed label is Technical.'],
      ['The customer says only: “It does not work.”',3,'There is not enough context to assign a reliable single category. Ask for clarification or review rather than inventing a confident label.']
    ]},
    'ml-quality':{labels:['Use the example','Review or clarify it','Remove the unusable row'],items:[
      ['Message: “Please reset my password.” Reviewed category: Account.',0,'This is a clear fictional example under our category policy. Include varied wording too.'],
      ['The same text is labelled Account in one row and Billing in another.',1,'The examples conflict. Review the labels and category policy before training.'],
      ['Message: only spaces. Category: Technical.',2,'There is no useful message text. Reject the empty input instead of teaching a relationship from it.'],
      ['One refund message has been copied 100 times to make the dataset bigger.',1,'Review and deduplicate it. Copy count is not language coverage, and duplicates can contaminate evaluation.']
    ]},
    'ml-split':{labels:['Use for training only','Keep for testing only','Use in both files'],items:[
      ['A reviewed example is reserved for learning patterns during Fit.',0,'It belongs in training only. The held-out evaluation must use separate messages.'],
      ['A reviewed example is set aside to check predictions after Fit has finished.',1,'Keep it out of Fit. Its reviewed label lets you compare the final prediction with an answer.'],
      ['You find the exact same message in train.tsv and test.tsv. Where should you leave it?',0,'In this exercise, keep the existing training example and remove its duplicate from testing. Replace the test duplicate with a genuinely separate reviewed example. Using both would leak the example.']
    ]},
    'ml-lifecycle':{labels:['Load the model and predict','Train and evaluate deliberately','Explain that a model must be trained first'],items:[
      ['The evaluated model file exists and a new customer message arrives.',0,'Use the saved artifact for inference. Validate the message and keep the suggestion reviewable.'],
      ['The app starts but its model file is missing.',2,'Show a clear error and the training/setup step. Do not silently pretend that a fixed demo response came from a model.'],
      ['Reviewers have collected a new, approved training dataset and you are preparing a model update.',1,'Run a deliberate training and evaluation process before replacing the deployed model. A new version is not automatically better.']
    ]}
  };
  function scenarios(node,bank){
    let index=0;
    function draw(){
      const row=bank.items[index];
      node.innerHTML=`<div class="experiment-head"><span>A small data decision</span><span>${index+1} of ${bank.items.length}</span></div><div class="experiment-body"><p class="scenario-text">${esc(row[0])}</p><div class="choice-grid">${bank.labels.map((label,i)=>`<button class="choice-button" aria-pressed="false" data-ml-choice="${i}">${esc(label)}</button>`).join('')}</div><div class="feedback" role="status" aria-live="polite"></div><div class="experiment-actions"><span>Choose, then read the explanation.</span><button class="button secondary" data-ml-next>${index===bank.items.length-1?'Start again':'Next example'}</button></div></div>`;
      node.querySelectorAll('[data-ml-choice]').forEach(button=>button.addEventListener('click',()=>{
        const correct=Number(button.dataset.mlChoice)===row[1];
        node.querySelectorAll('[data-ml-choice]').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.classList.toggle('correct',b===button&&correct);});
        const feedback=node.querySelector('.feedback');feedback.classList.toggle('success',correct);feedback.innerHTML=`<strong>${correct?'That fits.':'Think about the role of this information.'}</strong><p>${esc(correct?row[2]:`The best fit is “${bank.labels[row[1]]}”. ${row[2]}`)}</p>`;
      }));
      node.querySelector('[data-ml-next]').addEventListener('click',()=>{index=(index+1)%bank.items.length;draw();node.querySelector('[data-ml-choice]').focus();});
    }
    draw();
  }
  function rows(node){
    const examples=[['I was charged twice.','Billing'],['My password link expired.','Account'],['The upload screen freezes.','Technical']];
    node.innerHTML=`<div class="experiment-head"><span>Three fictional labelled rows</span><span>Inspect, not train</span></div><div class="experiment-body"><div class="choice-grid">${examples.map((x,i)=>`<button class="choice-button" data-row="${i}" aria-pressed="false">Row ${i+1}: ${esc(x[0])}</button>`).join('')}</div><div id="ml-row-detail" aria-live="polite"></div></div>`;
    node.querySelectorAll('[data-row]').forEach(button=>button.addEventListener('click',()=>{
      const row=examples[Number(button.dataset.row)];node.querySelectorAll('[data-row]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      node.querySelector('#ml-row-detail').innerHTML=`<div class="connection-note"><strong>Input: Message</strong><p>${esc(row[0])}</p><strong style="margin-top:14px">Reviewed target: Category</strong><p>${esc(row[1])}</p></div><p class="caption" style="margin:16px 0 0">This pair is one example. All three rows together form a tiny dataset. Clicking a row does not train a model.</p>`;
    }));node.querySelector('[data-row]').click();
  }
  function pipeline(node){
    const steps=['Prepare label and message columns','Add the category trainer','Decode the predicted category','Call Fit with training data'];
    let position=0;
    node.innerHTML=`<div class="experiment-head"><span>Follow the lab pipeline</span><span>Illustrative sequence</span></div><div class="experiment-body"><p class="caption">Choose the next step. These blocks describe responsibilities; no model is trained in this browser.</p><ol id="ml-pipeline-order"></ol><div class="choice-grid">${[2,0,3,1].map(i=>`<button class="choice-button" data-pipeline-step="${i}">${steps[i]}</button>`).join('')}</div><div class="feedback" role="status" aria-live="polite"></div><button class="button secondary" data-reset style="margin-top:18px">Reset sequence</button></div>`;
    node.querySelectorAll('[data-pipeline-step]').forEach(button=>button.addEventListener('click',()=>{
      const feedback=node.querySelector('.feedback'),correct=Number(button.dataset.pipelineStep)===position;
      if(correct){const item=document.createElement('li');item.textContent=steps[position];node.querySelector('ol').append(item);button.disabled=true;position++;}
      feedback.classList.toggle('success',correct);
      feedback.innerHTML=`<strong>${correct?position===4?'The pipeline is ready to train in C#.':'Step added.':'Consider what the next operation needs.'}</strong><p>${esc(correct?position===4?'Fit returns the fitted transforms and model. Continue to the desktop lab to execute this for real.':`Next, identify the operation after “${steps[position-1]}”.`:`The next responsibility is “${steps[position]}”. Preparation supplies columns the trainer uses; decoding makes the output readable; Fit runs learning on the training rows.`)}</p>`;
    }));node.querySelector('[data-reset]').addEventListener('click',()=>pipeline(node));
  }
  function evaluate(node){
    const examples=[['I was billed twice.','Billing','Billing'],['My reset link expired.','Account','Account'],['The refund screen crashes.','Billing','Technical'],['Uploading freezes the page.','Technical','Technical'],['How can I change my password?','Account','Account']];
    node.innerHTML=`<div class="experiment-head"><span>Five held-out examples</span><span>Authored outputs</span></div><div class="experiment-body"><p>These fixed predictions illustrate evaluation. Their numbers do not describe the downloadable model.</p><button class="button" data-reveal>Compare predictions with labels</button><div id="ml-evaluation" aria-live="polite"></div></div>`;
    node.querySelector('[data-reveal]').addEventListener('click',event=>{
      node.querySelector('#ml-evaluation').innerHTML=`<ul class="evaluation-list">${examples.map(row=>`<li>${esc(row[0])}<div class="evaluation-labels"><span>Prediction: ${row[1]}</span><span class="${row[1]===row[2]?'':'miss'}">Reviewed label: ${row[2]} · ${row[1]===row[2]?'Match':'Mismatch'}</span></div></li>`).join('')}</ul><div class="feedback"><strong>4 of 5 match: 80% on these five rows.</strong><p>The failed message reports a crash, even though it includes a payment word. Inspect that mistake and collect representative evaluation data before drawing a broader conclusion.</p></div>`;
      event.target.disabled=true;
    });
  }
  window.AcademyMlnetExperiments={mount(node,type){
    if(banks[type])scenarios(node,banks[type]);else if(type==='ml-rows')rows(node);else if(type==='ml-pipeline')pipeline(node);else if(type==='ml-evaluate')evaluate(node);
  }};
})();
