/* Guided lesson views. Content and progress rules live in separate files. */
(() => {
  'use strict';
  const C=AcademyContent, core=AcademyCore, KEY='dotnet-ai-workspace-progress-v1';
  const sections=[['understand','Understand'],['example','Example'],['try','Try it'],['check','Check'],['dotnet','.NET']];
  const $=(selector,root=document)=>root.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon=(name,cls='')=>`<svg class="${cls}" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
  const lessonUrl=(id,section='understand')=>`#lesson/${id}/${section}`;
  let storageFailed=false, state;
  try {state=core.sanitizeProgress(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{state=core.sanitizeProgress({});storageFailed=true;}
  let active=null, toastTimer;
  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageFailed=true;syncWarning();}
  }
  function syncWarning(){
    const warning=$('#storage-warning');if(warning)warning.hidden=!storageFailed;
  }
  function toast(message){
    const node=$('#toast');node.textContent=message;node.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{node.hidden=true;},4200);
  }
  function navMarkup(id){
    const unit=core.unitForLesson(id)||C.stages[0];
    const items=core.lessonsForUnit(unit.id),checked=items.filter(x=>state.lessons[x.id]?.checked).length;
    const unitNumber=C.stages.indexOf(unit)+1;
    return `<div class="side-heading"><span class="preview-label">Unit ${unitNumber}</span><h2>${esc(unit.title)}</h2><p>${esc(unit.outcome)}</p><div class="side-progress"><div class="progress-track" role="progressbar" aria-label="Unit understanding checks" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${checked}"><span style="width:${checked/items.length*100}%"></span></div><span>${checked} of ${items.length} understanding checks passed</span></div></div><div class="side-section-label"><span>Lessons in this unit</span>${icon('book')}</div><nav aria-label="${esc(unit.navLabel||(unit.id==='foundations'?'Foundation lessons':unit.id==='first-mlnet-model'?'ML.NET lessons':unit.id==='language-models'?'Language model lessons':unit.id==='reliable-outputs'?'Prompt and output lessons':'Tool and safety lessons'))}"><ol class="lesson-nav">${items.map((lesson,index)=>`<li><a class="lesson-link ${id===lesson.id?'active':''}" ${id===lesson.id?'aria-current="page"':''} href="${lessonUrl(lesson.id)}"><span class="lesson-number ${state.lessons[lesson.id]?.checked?'done':''}">${state.lessons[lesson.id]?.checked?icon('check'):index+1}</span><span>${esc(lesson.short)}<small>${lesson.minutes} min${state.lessons[lesson.id]?.checked?' · Check passed':state.lessons[lesson.id]?.read?' · Read':''}</small></span></a></li>`).join('')}</ol></nav><nav class="side-secondary" aria-label="Learning resources"><a href="#map/${unit.id}">${icon('map')}View this unit on the map</a>${C.labs.map(lab=>`<a href="${lab.url}">${icon('code')}${esc(lab.title)}</a>`).join('')}<a href="#progress">${icon('check')}Progress and backup</a></nav><p class="side-footnote">Learn at your own pace.<br>Browser exercises work offline. Run coding labs on a desktop.<a href="original-v2/index.html">Open the original academy</a></p>`;
  }
  function updateNav(){
    let context=navMarkup(active?.id);
    if(active?.type==='map'){
      const selected=active.id||C.stages[0].id;
      context=`<div class="side-heading"><span class="preview-label">Complete learning path</span><h2>Course map</h2><p>${C.stages.length} units, from foundations to production.</p></div><div class="side-section-label"><span>Jump to a unit</span>${icon('map')}</div><nav aria-label="Course units"><ol class="lesson-nav unit-nav">${C.stages.map((stage,index)=>`<li><a class="lesson-link unit-link ${stage.id===selected?'active':''}" href="#map/${stage.id}" ${stage.id===selected?'aria-current="location"':''}><span class="lesson-number">${index+1}</span><span>${esc(stage.title)}<small class="${stage.available?'unit-available':''}">${stage.available?'Available now':'Planned'}</small></span></a></li>`).join('')}</ol></nav><p class="side-footnote">These links jump to units on the map. Planned units describe what comes later; their lessons are not published yet.</p><nav class="side-secondary" aria-label="Learning resources"><a href="#learn">${icon('book')}Continue learning</a><a href="#lab">${icon('code')}C# rules-baseline lab</a></nav>`;
    }else if(active?.type==='progress'){
      context=`<div class="side-heading"><h2>My progress</h2><p>Reading, understanding checks, and coding milestones.</p></div><nav class="side-secondary" aria-label="Progress navigation"><a href="#learn">${icon('book')}Continue learning</a><a href="#lab">${icon('code')}Your coding milestone</a><a href="#map">${icon('map')}Explore the course map</a></nav><p class="side-footnote">Use the backup controls on this page to export or restore progress.</p>`;
    }else if(active?.type==='lab'){
      const lab=C.labs.find(x=>x.id===active.id)||C.labs[0];
      const related=lab.related||(lab.id==='ticket-lookup'?['tool-arguments','tool-authorization','tool-audit']:lab.id==='ticket-summary'?['structured-json','validate-responses','compare-prompts']:lab.id==='draft-replies'?['first-provider-call','server-credentials','blazor-streaming']:lab.id==='mlnet-classifier'?['train-test-split','mlnet-pipeline','save-load']:['rules','choose-approach']);
      context=`<div class="side-heading"><span class="preview-label">Desktop lab</span><h2>${esc(lab.title)}</h2><p>${esc(lab.description||(lab.id==='ticket-lookup'?'Validate, authorize, approve, and audit a fictional ticket read.':lab.id==='ticket-summary'?'Parse and validate a summary, then review its facts.':lab.id==='draft-replies'?'Stream a draft into Blazor and review it before use.':lab.id==='mlnet-classifier'?'Train, evaluate, save, and reuse a real model.':'Your first SupportDesk code milestone.'))}</p></div><div class="side-section-label"><span>Related lessons</span>${icon('book')}</div><nav aria-label="Lab prerequisites"><ol class="lesson-nav">${related.map(id=>`<li><a class="lesson-link" href="${lessonUrl(id)}">${icon('book')}<span>${esc(core.getLesson(id).short)}</span></a></li>`).join('')}</ol></nav><nav class="side-secondary" aria-label="Lab navigation"><a href="#progress">${icon('check')}Progress and backup</a>${C.labs.filter(x=>x.id!==lab.id).map(x=>`<a href="${x.url}">${icon('code')}${esc(x.title)}</a>`).join('')}<a href="#map">${icon('map')}See the project path</a></nav><p class="side-footnote">Run the lab on a desktop with .NET 10. The page includes source downloads, commands, and expected results.</p>`;
    }
    const markup=`<a class="side-home ${active?.type==='home'?'active':''}" href="#home">${icon('home')}Home and getting started</a>`+context;
    $('#desktop-navigation').innerHTML=markup;$('#mobile-navigation').innerHTML=markup;
    document.querySelectorAll('[data-route]').forEach(link=>{
      const selected=link.dataset.route===(active?.type==='lab'?'lesson':active?.type);
      if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
  }
  function rail(lesson){
    const entry=state.lessons[lesson.id]||{};
    const preview=core.unitForLesson(lesson.id)?.preview;
    const advancedPreview=preview?`<small>Your fictional ${esc(preview.heading.toLowerCase())} workspace</small><div class="inbox-item"><strong>${esc(preview.heading)}</strong>${esc(preview.input)}</div><div class="inbox-item"><strong>${esc(preview.result)}</strong><span class="inbox-tag">${esc(preview.note)}</span></div>`:null;
    return `<aside class="context-rail" aria-label="Lesson context"><div class="project-area"><h2 class="context-heading">One application, step by step</h2><div class="project-preview"><div class="project-preview-header"><span class="project-monogram">S</span>SupportDesk</div><div class="project-inbox">${advancedPreview||(lesson.unitId==='tools-actions'?'<small>Your fictional tool workspace</small><div class="inbox-item"><strong>Ticket lookup</strong>Tool: lookup_ticket<br>Argument: DEMO-104</div><div class="inbox-item"><strong>Proposed, not executed</strong><span class="inbox-tag">Server checks and approval required</span></div>':lesson.unitId==='reliable-outputs'?'<small>Your fictional summary workspace</small><div class="inbox-item"><strong>I was charged twice</strong>Customer message</div><div class="inbox-item"><strong>Ticket summary</strong>Category: Billing<br>Fact: Duplicate charge reported<br><span class="inbox-tag">Shape checked · facts need review</span></div>':lesson.unitId==='language-models'?'<small>Your fictional draft workspace</small><div class="inbox-item"><strong>I was charged twice</strong>Customer message</div><div class="inbox-item"><strong>Draft reply</strong>Thanks for reporting this. Our team will review it.<br><span class="inbox-tag">Staff review required</span></div>':'<small>Your fictional support inbox</small><div class="inbox-item"><strong>I was charged twice</strong>New customer request<br><span class="inbox-tag">Billing suggestion</span></div><div class="inbox-item"><strong>I cannot sign in</strong>New customer request<br><span class="inbox-tag">Account suggestion</span></div>')}</div></div><p class="project-caption">From C# rules to a measured AI application. Each lesson adds one piece.</p></div><div class="context-section"><h3>What this lesson adds</h3><p>${esc(lesson.dotnet.contribution)}</p><a href="${lessonUrl(lesson.id,'dotnet')}">See the .NET connection</a></div><div class="context-section"><h3>Before this topic</h3>${lesson.prerequisites.length?lesson.prerequisites.map(id=>`<a href="${lessonUrl(id)}">${esc(core.getLesson(id).short)}</a>`).join(''):'<p>No AI knowledge needed. Bring your everyday C# experience.</p>'}</div><div class="context-section progress-context"><h3>Your evidence</h3><ul><li><span class="status-dot ${entry.read?'complete':''}"></span><span data-read-status>${entry.read?'Marked as read':'Not marked as read'}</span></li><li><span class="status-dot ${entry.checked?'complete':''}"></span><span data-check-status>${entry.checked?'Understanding check passed':'Understanding check remaining'}</span></li></ul><a href="#progress">View all progress</a></div></aside>`;
  }
  function codeBlock(code,label){return `<div class="code-block"><div class="code-header"><span>${esc(label)}</span><button data-copy aria-label="Copy ${esc(label)}">${icon('copy')}Copy</button></div><pre tabindex="0" aria-label="${esc(label)}"><code>${esc(code)}</code></pre></div>`;}
  function renderSection(lesson,section){
    if(section==='understand')return `<p class="section-intro">The idea, in plain English</p><h2>Start with what you already know.</h2><div class="reading">${lesson.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div><dl class="definition"><dt>${esc(lesson.definition[0])}</dt><dd>${esc(lesson.definition[1])}</dd></dl><div class="takeaway">${icon('light')}<div><strong>Keep this in mind</strong><p>${esc(lesson.takeaway)}</p></div></div><label class="read-control"><input type="checkbox" id="mark-read" ${state.lessons[lesson.id]?.read?'checked':''}><span>I’ve read this explanation <small>· saved separately from the check</small></span></label>`;
    if(section==='example')return `<p class="section-intro">A worked example</p><h2>${esc(lesson.example.title)}</h2><div class="example-message"><span class="message-label">In the SupportDesk inbox</span><blockquote>${esc(lesson.example.input)}</blockquote></div><div class="path-comparison">${lesson.example.paths.map(path=>`<div class="path-box ${path.tone}"><h3>${esc(path.title)}</h3><p>${esc(path.detail)}</p><div class="path-result">${icon('arrow')}${esc(path.result)}</div></div>`).join('')}</div><p class="caption">${esc(lesson.example.explanation)}</p><div class="takeaway">${icon('light')}<div><strong>Explain it to yourself</strong><p>${esc(lesson.objective)} Use the example above in your answer.</p></div></div>`;
    if(section==='try')return `<div class="exercise-header"><h2>Make the idea concrete.</h2><span class="local-label">Works offline</span></div><p class="caption">${esc(lesson.exercise)}</p><div class="experiment" id="lesson-experiment"></div><details><summary>What should I notice?</summary><p>${esc(lesson.takeaway)}</p></details>`;
    if(section==='check')return `<p class="section-intro">Check your understanding</p><h2>${esc(lesson.quiz.question)}</h2><p class="caption">Choose an answer. You’ll see the reason immediately, and you can try again.</p><div class="choice-grid quiz-options">${lesson.quiz.options.map((option,index)=>`<button class="choice-button" data-answer="${index}" aria-pressed="false"><span class="choice-letter" aria-hidden="true">${String.fromCharCode(65+index)}</span>${esc(option.text)}</button>`).join('')}</div><div class="feedback" id="quiz-feedback" role="status" aria-live="polite"></div>${state.lessons[lesson.id]?.checked?'<p class="caption" style="margin-top:18px">You have already passed this check. You can practise it again.</p>':''}<details><summary>Give me a hint</summary><p>${esc(lesson.takeaway)}</p></details>`;
    return `<p class="section-intro">Connect it to your application</p><h2>${esc(lesson.dotnet.title)}</h2><p class="caption">${esc(lesson.dotnet.text)}</p>${codeBlock(lesson.dotnet.code,lesson.dotnet.label)}<div class="connection-note"><strong>Your SupportDesk contribution</strong><p>${esc(lesson.dotnet.contribution)}</p></div><p class="caption" style="margin-top:20px"><strong>What comes next:</strong> ${esc(lesson.dotnet.next)}</p>${lesson.dotnet.lab?`<a class="button secondary" href="${C.labs.find(x=>x.id===lesson.labId).url}">${icon('code')}Open the ${esc(C.labs.find(x=>x.id===lesson.labId).buttonLabel||(lesson.labId==='ticket-lookup'?'tool':lesson.labId==='ticket-summary'?'summary':lesson.labId==='draft-replies'?'Blazor':lesson.labId==='mlnet-classifier'?'ML.NET':'C#'))} desktop lab</a>`:''}<details><summary>Optional official reference</summary><p>${esc(C.references[lesson.reference].note)}</p><a href="${C.references[lesson.reference].url}" target="_blank" rel="noopener noreferrer">${esc(C.references[lesson.reference].title)} (opens a new tab)</a></details>`;
  }
  function bottom(){return `<footer class="page-bottom"><span>AI for .NET developers · Your progress stays in this browser</span><a href="#progress">Export a backup</a></footer>`;}
  function warning(){return `<div class="storage-warning" id="storage-warning" role="status" ${storageFailed?'':'hidden'}>Your browser could not read or save progress. You can keep learning and <a href="#progress">export a backup</a> before closing this page.</div>`;}
  function breadcrumb(label){return `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#home">Home</a>${icon('chevron')}<a href="#map">Learning path</a>${icon('chevron')}<span>${esc(label)}</span></nav>`;}
  function renderLesson(lesson,section){
    const index=C.lessons.indexOf(lesson), step=sections.findIndex(x=>x[0]===section), missing=core.missingPrerequisites(state,lesson.id);
    const unit=core.unitForLesson(lesson.id),unitLessons=core.lessonsForUnit(unit.id),localIndex=unitLessons.indexOf(lesson);
    $('#main-content').innerHTML=`${breadcrumb(unit.title)}${warning()}<div class="workspace-grid"><div class="lesson-workspace"><div class="lesson-meta"><span class="current-unit">Lesson ${localIndex+1} of ${unitLessons.length}</span><span>${icon('clock')}${lesson.minutes} min</span><span>${esc(unit.level||'Beginner')}</span></div><h1 tabindex="-1">${esc(lesson.title)}</h1><p class="lesson-summary">${esc(lesson.summary)}</p><div class="objective">${icon('target')}<p><strong>By the end of this lesson</strong>${esc(lesson.objective)}</p></div>${missing.length?`<div class="prereq-advice">Recommended first: ${missing.map(x=>`<a href="${lessonUrl(x.id)}">${esc(x.short)}</a>`).join(', ')}. You can still explore this lesson.</div>`:''}<nav class="section-tabs" aria-label="Lesson sections">${sections.map(([key,label],i)=>`<a href="${lessonUrl(lesson.id,key)}" ${section===key?'aria-current="step"':''}><span class="section-tab-number" aria-hidden="true">${i+1}</span>${label}</a>`).join('')}</nav><section class="lesson-panel" aria-label="${esc(sections[step][1])}">${renderSection(lesson,section)}</section><nav class="section-footer" aria-label="Lesson navigation">${step>0?`<a class="button secondary" href="${lessonUrl(lesson.id,sections[step-1][0])}">${icon('arrow','back-arrow')}Back</a>`:index>0?`<a class="button secondary" href="${lessonUrl(C.lessons[index-1].id,'dotnet')}">${icon('arrow','back-arrow')}Previous lesson</a>`:'<span class="section-position">One idea at a time.</span>'}${step<4?`<a class="button" href="${lessonUrl(lesson.id,sections[step+1][0])}">${step===0?'See an example':step===1?'Try it yourself':step===2?'Check understanding':'The .NET connection'}${icon('arrow')}</a>`:index<C.lessons.length-1?`<a class="button" href="${lessonUrl(C.lessons[index+1].id)}">Next lesson${icon('arrow')}</a>`:`<a class="button" href="${C.labs.find(x=>x.id===lesson.labId).url}">Open this unit’s lab</a>`}</nav>${bottom()}</div>${rail(lesson)}</div>`;
    if(section==='try')AcademyExperiments.mount($('#lesson-experiment'),lesson.experiment);
    $('#mark-read')?.addEventListener('change',event=>{
      const entry=state.lessons[lesson.id]||{read:false,checked:false};state.lessons[lesson.id]={...entry,read:event.target.checked};save();updateNav();refreshEvidence();
    });
    document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
      const choice=Number(button.dataset.answer),result=core.grade(lesson.id,choice);state=core.recordAnswer(state,lesson.id,choice);save();
      document.querySelectorAll('[data-answer]').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.classList.toggle('correct',b===button&&result.correct);});
      const feedback=$('#quiz-feedback');feedback.classList.toggle('success',result.correct);feedback.innerHTML=`<strong>${result.correct?'You’ve got it.':'Let’s work through it.'}</strong><p>${esc(result.explanation)}</p>${result.correct?'<p>Your understanding check is saved. Continue when you’re ready.</p>':'<p>You can choose another answer.</p>'}`;updateNav();refreshEvidence();
    }));
  }
  function refreshEvidence(){
    for(const [field,label]of [['read','Marked as read'],['checked','Understanding check passed']]){
      const node=$(field==='read'?'[data-read-status]':'[data-check-status]');if(!node)continue;
      const done=state.lessons[active.id]?.[field];node.textContent=done?label:field==='read'?'Not marked as read':'Understanding check remaining';node.previousElementSibling.classList.toggle('complete',!!done);
    }
  }
  function renderMap(){
    $('#main-content').innerHTML=`<div class="wide-view">${breadcrumb('Complete course map')}${warning()}<div class="map-intro"><div><div class="lesson-meta"><span class="current-unit">From foundations to production</span></div><h1 tabindex="-1">See how the pieces connect.</h1><p class="lede">One application grows with you. Start with a C# rule, then add a model, language features, retrieval, and controlled workflows.</p></div><a class="button" href="${lessonUrl(core.nextLesson(state).id)}">Continue learning${icon('arrow')}</a></div><div class="connection-note"><strong>${C.lessons.length} lessons across ${C.stages.filter(x=>x.available).length} units are ready to explore.</strong><p>${C.stages.filter(x=>x.available).map(x=>esc(x.title)).join(', ')} are available now. Later units are clearly marked Planned; start with the available lessons in order.</p></div><label class="search-field">${icon('search')}<input type="search" id="course-search" placeholder="Find a topic, such as vectors or Blazor" aria-label="Find a topic in the course map" autocomplete="off"></label><p class="search-count" id="search-count" role="status" aria-live="polite"></p><div id="course-stages"></div>${bottom()}</div>`;
    function drawStages(query=''){
      const term=query.trim().toLowerCase();let found=0;
      $('#course-stages').innerHTML=C.stages.map((stage,index)=>{
        const overall=`${stage.title} ${stage.outcome} ${stage.milestone}`.toLowerCase().includes(term);
        const topics=stage.topics.map((topic,i)=>({topic,i})).filter(x=>overall||x.topic.toLowerCase().includes(term));if(!topics.length)return '';found++;
        return `<section class="stage" id="unit-${stage.id}"><div class="stage-header"><span class="stage-index">${index+1}</span><div><h2 tabindex="-1">${esc(stage.title)}</h2><p>${esc(stage.outcome)}</p></div><span class="stage-status ${stage.available?'available':''}">${stage.available?'Available now':'Planned'}</span></div><ul class="stage-topics">${topics.map(({topic,i})=>`<li>${stage.available?`<a href="${lessonUrl(stage.lessonIds[i])}">${esc(topic)}${icon('chevron')}</a>`:esc(topic)}</li>`).join('')}</ul><p class="milestone">Project milestone: <strong>${esc(stage.milestone)}</strong></p></section>`;
      }).join('')||'<p class="empty-search">No matching topic. Try a shorter term, such as “model”, “search”, or “Azure”.</p>';
      $('#search-count').textContent=term?`${found} matching ${found===1?'unit':'units'}. Planned topics are shown for context.`:`${C.stages.length} connected units · ${C.stages.filter(x=>x.available).length} available now`;
      syncMapSidebar();
    }
    $('#course-search').addEventListener('input',event=>drawStages(event.target.value));drawStages();
  }
  function renderProgress(){
    const checked=C.lessons.filter(x=>state.lessons[x.id]?.checked).length;
    $('#main-content').innerHTML=`<div class="wide-view">${breadcrumb('My progress')}${warning()}<div class="lesson-meta"><span class="current-unit">Your learning evidence</span></div><h1 tabindex="-1">Reading is a start. Understanding is the goal.</h1><p class="lede">Keep track of what you’ve read, which checks you’ve passed, and the code you’ve run. You can revisit any topic.</p><div class="progress-layout"><div><section class="surface"><h2>${checked} of ${C.lessons.length} understanding checks passed</h2><p>“Read” is your own marker. “Check” means you answered the lesson question correctly. A later practice mistake does not erase a passed check.</p>${C.lessons.map(lesson=>`<div class="progress-row"><a href="${lessonUrl(lesson.id)}">${esc(lesson.short)}</a><div class="progress-state"><span><i class="status-dot ${state.lessons[lesson.id]?.read?'complete':''}"></i>Read: ${state.lessons[lesson.id]?.read?'yes':'not yet'}</span><span><i class="status-dot ${state.lessons[lesson.id]?.checked?'complete':''}"></i>Check: ${state.lessons[lesson.id]?.checked?'passed':'not yet'}</span></div></div>`).join('')}</section><section class="surface"><h2>Your coding milestones</h2>${C.labs.map(lab=>`<p>${esc(lab.title)}: <strong>${state.labs[lab.id]?'Marked complete by you':'Not marked complete'}</strong></p><a class="button secondary" href="${lab.url}">${icon('code')}Open ${esc(lab.title)}</a>`).join('')}</section></div><div><section class="surface"><h2>Keep a copy of your progress</h2><p>Progress is saved in this browser on this device. Clearing site data or moving the website can make it unavailable. Export a JSON backup to keep it.</p><div class="progress-actions"><button class="button" id="export-progress">${icon('download')}Export progress</button><label class="button secondary import-label">Import backup<input type="file" id="import-progress" accept="application/json,.json" aria-label="Import progress backup"></label></div><div class="feedback backup-message" id="backup-message" role="status" aria-live="polite"></div></section><section class="surface"><h2>A fresh start</h2><p>Reset only this preview’s progress in this browser. The original academy keeps its own progress.</p><button class="button secondary" id="reset-progress">Reset preview progress</button></section><a class="button" href="${lessonUrl(core.nextLesson(state).id)}">Continue learning${icon('arrow')}</a></div></div>${bottom()}</div>`;
    $('#export-progress').addEventListener('click',()=>{
      const backup={app:'dotnet-ai-workspace',version:1,exportedAt:new Date().toISOString(),progress:state};
      download('dotnet-ai-workspace-progress.json',JSON.stringify(backup,null,2),'application/json');toast('Progress backup exported.');
    });
    $('#import-progress').addEventListener('change',async event=>{
      const input=event.target,file=input.files[0];if(!file)return;
      try{
        if(file.size>2000000)throw new Error('Choose a backup smaller than 2 MB.');
        const imported=core.readBackup(await file.text());
        if(!confirm('Replace this preview’s progress with the selected backup?'))return;
        state=imported;save();renderProgress();updateNav();toast('Progress restored from your backup.');
      }catch(error){$('#backup-message').textContent=error.message;}finally{input.value='';}
    });
    $('#reset-progress').addEventListener('click',()=>{
      if(!confirm('Reset all read markers, passed checks, and lab completion in this preview? Export a backup first if you want to keep them.'))return;
      state=core.sanitizeProgress({});save();renderProgress();updateNav();toast('Preview progress reset.');
    });
  }
  const labCode=`string[] messages =
[
    "I need a refund",
    "Please return my payment",
    "I cannot sign in",
    "   "
];

foreach (string message in messages)
{
    string display = string.IsNullOrWhiteSpace(message)
        ? "<empty>" : message;
    Console.WriteLine($"{display} -> {Route(message)}");
}

static string Route(string message)
{
    if (string.IsNullOrWhiteSpace(message))
        return "Rejected";

    return message.Contains("refund",
        StringComparison.OrdinalIgnoreCase)
        ? "Billing" : "General";
}`;
  function renderLab(){
    $('#main-content').innerHTML=`<div class="wide-view">${breadcrumb('Desktop lab')}${warning()}<div class="lab-heading"><div class="lab-tags"><span>C# console app</span><span>20–30 min</span><span>No paid services</span></div><h1 tabindex="-1">Build your SupportDesk rules baseline.</h1><p class="lede">Run a small, predictable routing rule. Then see exactly where it stops helping. This is the first code milestone for your future support application.</p></div><div class="lab-layout"><div><section class="lab-step"><h2>1. Get ready</h2><p>Use a desktop with the .NET 10 SDK and a terminal. You can read this lab on your phone and run it later. Knowing basic C# is enough.</p><p>Recommended first: <a href="${lessonUrl('rules')}">When ordinary C# rules are enough</a>. The lab creates a console application, not the full web portal.</p>${codeBlock('dotnet --version','Terminal · check your SDK')}<p class="caption">The version should start with 10. If the command is missing, install the .NET 10 SDK from <a href="https://dotnet.microsoft.com/en-us/download/dotnet/10.0" target="_blank" rel="noopener noreferrer">Microsoft’s .NET download page</a>, then open a new terminal.</p></section><section class="lab-step"><h2>2. Create the starting project</h2><p>Choose a folder for your learning code, then run:</p>${codeBlock('dotnet new console --name SupportDesk.Rules --framework net10.0\ncd SupportDesk.Rules','Terminal · create your project')}<p>The first command creates a project file and a starter <code class="inline-code">Program.cs</code>. The second moves your terminal into that folder. No additional NuGet package is needed.</p></section><section class="lab-step"><h2>3. Replace Program.cs</h2><p>The four example messages include one that means “refund” without using that word. Replace the starter file with this code:</p>${codeBlock(labCode,'Program.cs · complete runnable starting exercise')}<ul><li><code class="inline-code">IsNullOrWhiteSpace</code> rejects input that has no visible text.</li><li><code class="inline-code">Contains</code> checks characters, ignoring letter case.</li><li>The other messages go to General. This is a baseline, not a learned classifier.</li></ul></section><section class="lab-step"><h2>4. Run it and compare</h2>${codeBlock('dotnet run','Terminal · run the exercise')}${codeBlock('I need a refund -> Billing\nPlease return my payment -> General\nI cannot sign in -> General\n<empty> -> Rejected','Expected output')}<p>Why does the second message go to General? The meaning is similar, but the keyword is absent. That is the limitation to record before trying a learned model.</p></section><section class="lab-step"><h2>5. Prove it and record the limitation</h2><p>The supplied downloadable project adds six executable checks to the same rule. Download its project file and Program.cs into the same folder, then run:</p>${codeBlock('dotnet run -- --verify','Terminal · run the supplied verification cases')}${codeBlock('PASS: explicit refund\nPASS: case-insensitive keyword\nPASS: related wording has no keyword\nPASS: unrelated message\nPASS: whitespace is rejected\nPASS: empty input is rejected\n6/6 checks passed.','Expected verification output')}<p>Change <code class="inline-code">Route</code> to return Billing for every message and run the checks again. They should fail and return a nonzero exit code. Restore the rule when you have seen why the checks matter.</p><p>In your own README, explain which requirement the rule handles well and one wording it misses. Later, we will compare a model with this baseline using held-out examples.</p></section><section class="lab-step"><h2>If something goes wrong</h2><ul><li><strong>“dotnet” is not recognized:</strong> install the SDK, then reopen the terminal.</li><li><strong>No project found:</strong> run the command inside the folder containing the .csproj file.</li><li><strong>The target framework is unsupported:</strong> check that the installed SDK is version 10.</li><li><strong>No verification summary appears:</strong> use the supplied downloadable Program.cs. The shorter exercise above demonstrates routing only.</li></ul><label class="lab-complete"><input id="complete-lab" type="checkbox" ${state.labs[C.labId]?'checked':''}><span>I ran the supplied checks and can explain the keyword limitation.<small style="display:block;color:var(--muted)">This milestone is self-reported; the website cannot inspect your terminal.</small></span></label></section></div><aside class="lab-aside"><section class="surface"><h2>The complete lab files</h2><p>Save both source files together in a folder. The README includes the same commands and expected results.</p><div class="file-links"><a href="labs/supportdesk-rules/SupportDesk.Rules.csproj" download>${icon('download')}Project file (.csproj)</a><a href="labs/supportdesk-rules/Program.cs" download>${icon('download')}Program.cs with checks</a><a href="labs/supportdesk-rules/README.md" download>${icon('download')}Lab instructions (.md)</a></div><div class="context-section"><h3>What you are building</h3><p>Message → validation → keyword rule → queue.</p><p>Keep this as your baseline before introducing ML.NET.</p></div><a class="button quiet" href="${lessonUrl('rules','dotnet')}">Back to the .NET connection</a></section></aside></div>${bottom()}</div>`;
    $('#complete-lab').addEventListener('change',event=>{if(event.target.checked)state.labs[C.labId]=true;else delete state.labs[C.labId];save();toast(event.target.checked?'Lab milestone marked complete.':'Lab milestone marked incomplete.');});
  }
  function download(name,text,type){
    const url=URL.createObjectURL(new Blob([text],{type})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
  }
  function closeDrawer(){if($('#course-drawer').open)$('#course-drawer').close();document.body.classList.remove('drawer-open');}
  $('#open-course').addEventListener('click',()=>{updateNav();$('#course-drawer').showModal();document.body.classList.add('drawer-open');});
  $('#close-course').addEventListener('click',closeDrawer);
  $('#course-drawer').addEventListener('close',()=>document.body.classList.remove('drawer-open'));
  $('#course-drawer').addEventListener('click',event=>{if(event.target===event.currentTarget&&event.offsetX>event.currentTarget.clientWidth)closeDrawer();});
  document.addEventListener('click',async event=>{
    const anchor=event.target.closest('a');if(anchor&&$('#course-drawer').contains(anchor))closeDrawer();
    const button=event.target.closest('[data-copy]');if(!button)return;
    const code=button.closest('.code-block').querySelector('code').textContent;
    try{await navigator.clipboard.writeText(code);button.innerHTML=`${icon('check')}Copied`;toast('Code copied.');setTimeout(()=>{if(button.isConnected)button.innerHTML=`${icon('copy')}Copy`;},2000);}
    catch{const range=document.createRange();range.selectNodeContents(button.closest('.code-block').querySelector('code'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);toast('Code selected. Use your device’s copy command.');}
  });
  function render(initial=false){
    if(location.hash==='#main-content'){$('#main-content').focus();return;}
    const previous=active,parts=location.hash.slice(1).split('/');
    $('#toast').hidden=true;
    let type=parts[0],id=parts[1],section=parts[2]||'understand';
    if(!type)type='home';
    if(type==='learn'){
      type='lesson';id=core.nextLesson(state).id;section='understand';
      history.replaceState(null,'',lessonUrl(id,section));
    }
    active={type,id,section};
    document.body.dataset.view=type;
    if(type==='home'){
      $('#main-content').innerHTML=warning()+AcademyHome.markup({lessons:C.lessons,labs:C.labs,stages:C.stages,state,next:core.nextLesson(state),esc,icon});
      document.title='AI for .NET developers · Learn, practise, build';
    }else if(type==='lesson'&&core.getLesson(id)&&sections.some(x=>x[0]===section)){
      renderLesson(core.getLesson(id),section);document.title=`${core.getLesson(id).short} · AI for .NET developers`;
    }else if(type==='map'){renderMap();document.title='Learning path · AI for .NET developers';}
    else if(type==='progress'){renderProgress();document.title='My progress · AI for .NET developers';}
    else if(type==='lab'&&C.labs.find(lab=>lab.id===id)?.renderer){
      const lab=C.labs.find(lab=>lab.id===id);
      window[lab.renderer].render({main:$('#main-content'),codeBlock,icon,warning,breadcrumb,bottom,state,onComplete:done=>{if(done)state.labs[id]=true;else delete state.labs[id];save();toast(done?'Lab milestone marked complete.':'Lab milestone marked incomplete.');}});
      document.title=lab.title+' lab · AI for .NET developers';
    }
    else if(type==='lab'&&id==='ticket-lookup'){AcademyLookupLab.render({main:$('#main-content'),codeBlock,icon,warning,breadcrumb,bottom,state,onComplete:done=>{if(done)state.labs['ticket-lookup']=true;else delete state.labs['ticket-lookup'];save();toast(done?'Lookup lab marked complete.':'Lookup lab marked incomplete.');}});document.title='Reviewed lookup lab · AI for .NET developers';}
    else if(type==='lab'&&id==='ticket-summary'){AcademySummaryLab.render({main:$('#main-content'),codeBlock,icon,warning,breadcrumb,bottom,state,onComplete:done=>{if(done)state.labs['ticket-summary']=true;else delete state.labs['ticket-summary'];save();toast(done?'Summary lab marked complete.':'Summary lab marked incomplete.');}});document.title='Validated summary lab · AI for .NET developers';}
    else if(type==='lab'&&id==='draft-replies'){AcademyDraftLab.render({main:$('#main-content'),codeBlock,icon,warning,breadcrumb,bottom,state,onComplete:done=>{if(done)state.labs['draft-replies']=true;else delete state.labs['draft-replies'];save();toast(done?'Draft-reply lab marked complete.':'Draft-reply lab marked incomplete.');}});document.title='Blazor draft-reply lab · AI for .NET developers';}
    else if(type==='lab'&&id==='mlnet-classifier'){AcademyMlnetLab.render({main:$('#main-content'),codeBlock,icon,warning,breadcrumb,bottom,state,onComplete:done=>{if(done)state.labs['mlnet-classifier']=true;else delete state.labs['mlnet-classifier'];save();toast(done?'Classifier lab marked complete.':'Classifier lab marked incomplete.');}});document.title='ML.NET classifier lab · AI for .NET developers';}
    else if(type==='lab'){renderLab();document.title='C# rules-baseline lab · AI for .NET developers';}
    else{$('#main-content').innerHTML=`<div class="wide-view"><h1 tabindex="-1">That lesson link is unavailable.</h1><p>Choose a foundation lesson or explore the course map.</p><a class="button" href="#map">Open the course map</a></div>`;}
    updateNav();
    const mapTarget=type==='map'&&id?document.getElementById('unit-'+id):null;
    if(mapTarget){
      closeDrawer();mapTarget.querySelector('h2').focus({preventScroll:true});
      const headerHeight=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header'));
      window.scrollTo({top:Math.max(0,mapTarget.getBoundingClientRect().top+scrollY-headerHeight-20),behavior:'instant'});
      syncMapSidebar();
      return;
    }
    if(!initial){
      closeDrawer();const same=previous?.type==='lesson'&&type==='lesson'&&previous.id===id;
      const focusTarget=same?$('.lesson-panel h2'):$('h1');
      if(focusTarget){focusTarget.setAttribute('tabindex','-1');focusTarget.focus({preventScroll:true});}
      if(same&&$('.section-tabs')){const y=$('.section-tabs').getBoundingClientRect().top+scrollY-parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header'))-16;window.scrollTo({top:Math.max(0,y),behavior:'instant'});}
      else window.scrollTo({top:0,behavior:'instant'});
    }
  }
  window.addEventListener('hashchange',()=>render(false));
  function syncMapSidebar(){
    if(active?.type!=='map')return;
    const boundary=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header'))+140;
    const stages=Array.from(document.querySelectorAll('.stage'));
    const current=stages.filter(stage=>stage.getBoundingClientRect().top<=boundary).at(-1)||stages[0];
    if(!current)return;
    const id=current.id.replace('unit-','');active.id=id;
    document.querySelectorAll('.unit-link').forEach(link=>{
      const selected=link.getAttribute('href')==='#map/'+id;
      link.classList.toggle('active',selected);
      if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
  }
  let scrollPending=false;
  window.addEventListener('scroll',()=>{
    if(active?.type!=='map'||scrollPending)return;
    scrollPending=true;
    requestAnimationFrame(()=>{
      scrollPending=false;syncMapSidebar();
    });
  },{passive:true});
  window.addEventListener('storage',event=>{if(event.key===KEY){try{state=core.sanitizeProgress(JSON.parse(event.newValue||'null'));render(true);}catch{storageFailed=true;syncWarning();}}});
  render(true);
})();
