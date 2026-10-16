/* .NET AI Engineering Academy 2.0. Works locally with no network calls. */
(() => {
  'use strict';
  const C=COURSE;
  const STORAGE='dotnet-ai-academy-progress-v2';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ico=(name,cls='')=>`<svg class="${esc(cls)}" aria-hidden="true"><use href="#i-${esc(name)}"></use></svg>`;
  const moduleById=id=>C.modules.find(m=>m.id===String(id).padStart(2,'0'));
  const dayById=n=>C.days[Number(n)-1];
  const phaseById=id=>C.phases.find(p=>p.id===id);
  const resourceById=id=>C.resources.find(r=>r.id===id);
  const projectById=id=>C.projects.find(p=>p.id===id);
  const pct=(n,d)=>d?Math.round(100*n/d):0;
  const blankState=()=>({days:{},projects:{},setup:{}});
  function cleanState(saved){
    const out=blankState();
    if(!saved||typeof saved!=='object'||Array.isArray(saved))return out;
    for(const kind of Object.keys(out)){
      if(saved[kind]&&typeof saved[kind]==='object'&&!Array.isArray(saved[kind])){
        for(const [k,v] of Object.entries(saved[kind]))if(v===true)out[kind][k]=true;
      }
    }
    return out;
  }
  function loadState(){
    try{return cleanState(JSON.parse(localStorage.getItem(STORAGE)||'null'))}catch(_){return blankState()}
  }
  let state=loadState();
  let selectedModule='01';
  let selectedDay=C.days.find(x=>!state.days[x.d])?.d||360;
  let activeLevel='All';
  let searchText='';
  let glossaryText='';
  let glossaryCat='All';
  let daySearchText='';
  let currentView='overview';
  let toastTimer=null;
  const expandedPhases=new Set(['phase01']);
  const views={overview:'Overview',path:'Learning path',projects:'Build projects',kickstart:'Day 1 → Day 360',glossary:'AI glossary',toolkit:'Setup & resources'};
  const setupItems=[
    '.NET SDK installed; dotnet --info works',
    'Visual Studio / VS Code with C# support',
    'Git installed and one local learning repository',
    'Can run C# console and xUnit tests',
    'Know where Microsoft Learn and official GitHub samples are',
    'When using APIs: store secrets server-side and set budgets'
  ];
  const dayDone=day=>Boolean(state.days[day]);
  const doneCount=()=>C.days.filter(d=>dayDone(d.d)).length;
  const moduleDoneCount=m=>m.days.filter(dayDone).length;
  const moduleDone=m=>moduleDoneCount(m)===m.days.length;
  const nextDay=()=>C.days.find(d=>!dayDone(d.d))||C.days[C.days.length-1];
  const projectDoneCount=()=>C.projects.filter(p=>Boolean(state.projects[p.id])).length;
  function save(){
    try{localStorage.setItem(STORAGE,JSON.stringify(state))}
    catch(_){toast('Your browser cannot save progress. Export a backup from Setup.')}
  }
  function toast(message){
    const node=$('#toast');node.textContent=message;node.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove('show'),3200);
  }
  function navigate(view,sub){
    const hash='#'+view+(sub?'/'+sub:'');
    if(location.hash===hash){onRoute();return}
    location.hash=hash;
  }
  function goDay(n){
    if(!dayById(n))return;
    selectedDay=Number(n);
    navigate('kickstart',selectedDay);
  }
  function goModule(id){
    const m=moduleById(id);if(!m)return;
    selectedModule=m.id;expandedPhases.add(m.phase);
    searchText='';activeLevel='All';$('#global-search').value='';
    navigate('path',m.id);
  }
  function referenceLinks(ids,limit=10){
    return (ids||[]).slice(0,limit).map(resourceById).filter(Boolean).map(r=>{
      const icon=r.url.includes('github.com')?'github':'external';
      return `<a class="ref-link" target="_blank" rel="noopener noreferrer" href="${esc(r.url)}" title="${esc(r.kind)}">${ico(icon)} ${esc(r.title)} ${ico('external')}</a>`;
    }).join('');
  }
  const progressBar=v=>`<div class="progress-track"><span style="width:${Math.max(0,Math.min(100,v))}%"></span></div>`;
  function renderProgress(){
    const complete=doneCount(),overall=pct(complete,C.days.length);
    $('#side-progress-number').innerHTML=`${overall}% <small>completed</small>`;
    $('#side-progress-bar').style.width=overall+'%';
    $('#side-progress-caption').textContent=`${complete} of ${C.days.length} days done • ${C.modules.filter(moduleDone).length} modules`;
    $('#top-progress').textContent=`${overall}% complete`;
    $('#path-progress-label').textContent=`${overall}% complete`;
    $('#path-progress-bar').style.width=overall+'%';
    $('#daily-progress-label').textContent=`${complete} / ${C.days.length} days`;
    $('#daily-progress-bar').style.width=overall+'%';
  }
  function renderOverview(){
    const figures=[
      ['route',C.modules.length,'Small modules','blue'],
      ['box',C.projects.length,'C# projects','green'],
      ['calendar',C.days.length,'Individual daily lessons','amber'],
      ['book',C.glossary.length,'Easy concepts explained','purple']
    ];
    $('#stats-grid').innerHTML=figures.map(([icon,num,label,color])=>`<div class="stat-card"><div class="stat-icon ${color}">${ico(icon)}</div><div><div class="stat-value">${num}</div><div class="stat-label">${label}</div></div></div>`).join('');
    const day=nextDay(),m=moduleById(day.module),phase=phaseById(m.phase);
    $('#next-module-card').innerHTML=`<div class="next-inner"><div>
        <div class="module-meta-inline"><span class="level-pill ${m.level.toLowerCase()}">${esc(m.level)}</span><span class="tagline-meta">${ico('calendar')} Day ${day.d} / ${C.days.length}</span></div>
        <h3>${esc(day.title)}</h3><p>${esc(day.explain)}</p>
        <div class="next-day-what"><b>Today in C#:</b> ${esc(day.task)}</div>
        <button type="button" class="button button-primary button-compact" data-open-day="${day.d}">${doneCount()===C.days.length?'Review final lesson':'Continue Day '+day.d} ${ico('arrow-right')}</button>
        <button type="button" class="text-button" data-open-module="${m.id}">See Module ${m.id}: ${esc(phase.title)} ${ico('arrow-right')}</button>
      </div><div class="next-mark">${String(day.d).padStart(3,'0')}</div></div><div style="margin-top:15px">${progressBar(pct(moduleDoneCount(m),5))}</div>`;
  }
  function filteredModules(){
    const q=searchText.trim().toLowerCase();
    return C.modules.filter(m=>(activeLevel==='All'||m.level===activeLevel)&&(!q||[
      m.id,m.title,m.goal,m.why,m.analogy,m.build,m.concepts.join(' '),m.recipe.join(' '),m.week,
      ...m.days.map(n=>{const d=dayById(n);return d.title+' '+d.task+' '+d.explain})
    ].join(' ').toLowerCase().includes(q)));
  }
  function renderPath(refreshDetail=true){
    const matches=filteredModules();
    $('#module-results-count').textContent=`${matches.length} of ${C.modules.length} modules`;
    $$('#level-filters .chip').forEach(btn=>{
      const active=btn.dataset.level===activeLevel;
      btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));
    });
    if(matches.length&&!matches.some(m=>m.id===selectedModule))selectedModule=matches[0].id;
    $('#phase-list').innerHTML=C.phases.map(ph=>{
      const matching=matches.filter(m=>m.phase===ph.id);if(!matching.length)return '';
      const whole=C.modules.filter(m=>m.phase===ph.id);
      const complete=whole.filter(moduleDone).length;
      const expanded=expandedPhases.has(ph.id)||Boolean(searchText.trim())||activeLevel!=='All';
      return `<div class="phase-card ${expanded?'expanded':''}">
        <button type="button" class="phase-head" data-phase="${esc(ph.id)}" aria-expanded="${String(expanded)}">
         <span class="phase-identity ${esc(ph.accent)}">${esc(ph.n)}</span><span class="phase-summary"><strong>${esc(ph.title)}</strong><small>${esc(ph.weeks)} · ${complete}/${whole.length} done</small></span>${ico('chevron-down','phase-chevron')}
        </button><div class="phase-progress-line"><span style="width:${pct(complete,whole.length)}%"></span></div>
        <div class="phase-modules">${matching.map(m=>`<button type="button" class="module-row ${m.id===selectedModule?'active':''}" data-module="${m.id}" aria-current="${String(m.id===selectedModule)}"><span class="module-stepno">${m.id}</span><span class="module-steptext">${esc(m.title)}<small>Day ${m.start}–${m.end} · ${moduleDoneCount(m)}/5 daily lessons</small></span><span class="module-check ${moduleDone(m)?'checked':''}">${ico('check')}</span></button>`).join('')}
          <div class="phase-checkpoint"><div><strong>${ico('target')} Phase checkpoint</strong><p>${esc(ph.milestone)}</p></div><details><summary>3 questions to explain in your own words</summary><ol>${ph.check.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></details></div>
        </div></div>`;
    }).join('')||`<div class="empty-state">${ico('search')}No modules matched. Clear search or filters.</div>`;
    if(refreshDetail)renderModuleDetail(matches.length?moduleById(selectedModule):null);
  }
  function renderModuleDetail(m){
    if(!m){$('#module-details').innerHTML=`<div class="empty-state">No lesson selected.</div>`;return}
    const ph=phaseById(m.phase), p=projectById(m.project),n=moduleDoneCount(m),complete=pct(n,5);
    const idx=C.modules.findIndex(x=>x.id===m.id),prev=C.modules[idx-1],next=C.modules[idx+1];
    $('#module-details').innerHTML=`<article class="module-panel" aria-label="Module ${m.id}: ${esc(m.title)}">
      <div class="module-panel-top"><div class="panel-kicker"><span>MODULE ${m.id} / ${C.modules.length}</span><span>•</span><span>${esc(ph.title)}</span></div>
        <h2>${esc(m.title)}</h2><p>${esc(m.why)}</p>
        <div class="module-tags"><span class="level-pill ${m.level.toLowerCase()}">${esc(m.level)}</span><span class="tagline-meta">${ico('calendar')} Day ${m.start}–${m.end}</span><span class="tagline-meta">${ico('clock')} 5 short sessions</span><div class="module-progress-small">${complete}% ${progressBar(complete)}</div></div></div>
      <div class="module-content">
        <div class="info-section"><h3>${ico('lightbulb')} The idea, in normal .NET language</h3><div class="analogy-card">${ico('lightbulb')}<div>${esc(m.analogy)}</div></div><div class="example-quote"><strong>Real example:</strong> ${esc(m.example)}</div></div>
        <div class="info-section"><h3>${ico('book')} Words you'll learn (one at a time)</h3><div class="concepts-wrap">${m.concepts.map(t=>`<span class="concept-pill">${esc(t)}</span>`).join('')}</div></div>
        <div class="info-section"><h3>${ico('code')} Your five-day mini plan</h3><p class="recipe-sub">Open any day for the small explanation, exact task and expected result. Checkboxes here and in the daily course are synchronized.</p>
           <div class="steps-list">${m.days.map((dayId,i)=>{const day=dayById(dayId),done=dayDone(dayId);return `<div class="step-item ${done?'done':''}"><label class="step-line"><input type="checkbox" class="step-check" data-day="${dayId}" ${done?'checked':''} aria-label="Mark Day ${dayId} done"><span><span class="step-index">DAY ${String(dayId).padStart(3,'0')} · ${esc(day.stage)}</span><b>${esc(day.title)}</b><small>${esc(day.task)}</small></span></label><button type="button" class="day-open" data-open-day="${dayId}" aria-label="Open Day ${dayId}">${ico('arrow-right')}</button></div>`}).join('')}</div></div>
        ${m.code?`<div class="info-section"><h3>${ico('terminal')} Starter example</h3><div class="code-wrap"><div class="code-heading"><span>${esc(m.code.label)}</span><button type="button" class="code-copy" data-copy-code="${m.id}">${ico('copy')} Copy</button></div><pre><code>${esc(m.code.code)}</code></pre></div><p class="helper-text">Use the linked official reference for complete current SDK setup. Some snippets are architectural illustrations, not standalone programs.</p></div>`:''}
        <div class="test-panel"><h4>${ico('checkcircle')} You'll know you're ready when...</h4><ul>${m.days.map(id=>`<li>${esc(dayById(id).output)}</li>`).join('')}</ul></div>
        <div class="warning-note">${ico('info')}<div><strong>Don't get stuck here:</strong> ${esc(m.avoid)}</div></div>
        <div class="info-section" style="margin-top:22px;margin-bottom:0"><h3>${ico('external')} Microsoft Learn and GitHub references</h3><div class="refs-list">${referenceLinks(m.refs)}</div></div>
      </div>
      <div class="module-panel-actions"><div>${moduleDone(m)?`<span class="module-done-badge">${ico('checkcircle')} Module complete</span>`:`<span class="module-finish">${n}/5 days completed</span>`}<div style="margin-top:7px"><button type="button" class="text-button" data-open-project="${p.id}">${ico('box')} Related: ${esc(p.title)}</button></div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="button button-primary" data-open-day="${m.days.find(x=>!dayDone(x))||m.start}">Study today's lesson ${ico('arrow-right')}</button>${prev?`<button type="button" class="button button-outline" data-open-module="${prev.id}">${ico('arrow-left')}</button>`:''}${next?`<button type="button" class="button button-outline" data-open-module="${next.id}">Next module ${ico('arrow-right')}</button>`:''}</div>
      </div></article>`;
  }
  function renderProjects(){
    $('#project-grid').innerHTML=C.projects.map(p=>{
      const done=Boolean(state.projects[p.id]);
      return `<article class="project-card" id="project-${p.id}"><div class="project-head"><span class="project-number ${done?'done':''}">${done?ico('check'):p.n}</span><span class="level-pill ${p.level.toLowerCase()}">${esc(p.level)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>
       <div class="project-stack">${ico('code')} ${esc(p.stack)}</div><div class="project-io"><div class="io-row"><span class="io-label">INPUT</span><span>${esc(p.input)}</span></div><div class="io-row"><span class="io-label">OUTPUT</span><span>${esc(p.output)}</span></div></div>
       <h4>Exact steps to build it</h4><ol class="project-checklist">${p.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ol><div class="project-accept"><strong>Definition of done:</strong> ${esc(p.accept)}</div>
       <div class="project-card-bottom"><button type="button" class="button button-primary button-compact" data-open-module="${p.module}">Related module ${ico('arrow-right')}</button><button type="button" data-project-done="${p.id}" class="project-done-toggle ${done?'is-done':''}">${ico(done?'checkcircle':'check')} ${done?'Completed':'Mark complete'}</button></div>
       <div class="project-ref">References: ${p.refs.map(resourceById).filter(Boolean).map(r=>`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ↗</a>`).join(' · ')}</div></article>`;
    }).join('');
  }
  function renderDays(){
    const current=dayById(selectedDay)||nextDay(),m=moduleById(current.module),ph=phaseById(m.phase);
    const complete=doneCount();
    const todo=nextDay();
    $('#daily-next-message').textContent=complete===C.days.length?'All 360 sessions completed. Review or build your portfolio!':`Next unfinished: Day ${todo.d} — ${todo.title}`;
    const select=$('#day-module-select');
    const options=C.phases.map(phase=>`<optgroup label="Phase ${phase.n} · ${esc(phase.title)}">${phase.modules.map(id=>{const x=moduleById(id);return `<option value="${x.start}" ${x.id===m.id?'selected':''}>${x.id} · ${esc(x.title)} (Days ${x.start}–${x.end})</option>`}).join('')}</optgroup>`).join('');
    select.innerHTML=options;
    $('#previous-block').disabled=m.start===1;
    $('#next-block').disabled=m.end===C.days.length;
    $('#daily-phase-strip').innerHTML=C.phases.map(phase=>{
      const done=phase.modules.reduce((sum,id)=>sum+moduleDoneCount(moduleById(id)),0);
      const currentPhase=phase.id===ph.id;
      const first=moduleById(phase.modules[0]);
      return `<button type="button" class="daily-phase-chip ${currentPhase?'current':''}" data-open-day="${first.start}" title="${esc(phase.sub)}"><span>PHASE ${phase.n}</span><strong>${esc(phase.title)}</strong><small>${done} / 30 done</small></button>`;
    }).join('');
    $('#daily-module-nav').innerHTML=`<div class="day-nav-heading"><span>IN THIS PHASE</span><strong>${esc(ph.title)}</strong><small>${esc(ph.sub)}</small></div>${ph.modules.map(id=>{
      const x=moduleById(id),isCurrent=x.id===m.id;
      return `<button type="button" data-open-day="${x.start}" class="day-module-link ${isCurrent?'active':''}"><span class="day-module-index">${x.id}</span><span><b>${esc(x.title)}</b><small>Day ${x.start}–${x.end} · ${moduleDoneCount(x)}/5 complete</small></span>${ico('chevron-right')}</button>`;
    }).join('')}<div class="day-side-help">${ico('info')} <span>Modules are groups of 5 small lessons. Pick any Day 001–360 from the selector above. No calendar deadlines.</span></div>`;
    $('#weeks-grid').innerHTML=`<div class="daily-focus-header"><div><span class="overline">MODULE ${m.id} / ${C.modules.length} · ${esc(m.level.toUpperCase())}</span><h2>${esc(m.title)}</h2><p>${esc(m.why)}</p></div><button type="button" class="button button-outline button-compact" data-open-module="${m.id}">Full module + code ${ico('arrow-right')}</button></div>
       <div class="day-step-track">${m.days.map(id=>{const d=dayById(id);return `<button type="button" data-open-day="${id}" class="day-step-chip ${selectedDay===id?'selected':''} ${dayDone(id)?'completed':''}" title="${esc(d.title)}">${dayDone(id)?ico('check'):String(id).padStart(3,'0')}</button>`}).join('')}</div>
       <article class="day-focus-card" id="day-${current.d}">
         <div class="day-focus-top"><div><span class="day-focus-kicker">${ico('calendar')} DAY ${String(current.d).padStart(3,'0')} / ${C.days.length} <span>·</span> ${esc(current.stage)}</span><h3>${esc(current.title)}</h3></div><span class="daily-time">${ico('clock')} One flexible session</span></div>
         <div class="day-focus-body">
           <div class="day-easy-concept"><span class="day-block-number blue">01</span><div><h4>Understand it first</h4><p>${esc(current.explain)}</p></div></div>
           <div class="day-easy-concept"><span class="day-block-number teal">02</span><div><h4>Try a tiny task (with C# when useful)</h4><p>${esc(current.task)}</p></div></div>
           <div class="day-easy-concept"><span class="day-block-number green">03</span><div><h4>Check your result</h4><p>You're finished when you can show: <strong>${esc(current.output)}</strong>.</p></div></div>
           <div class="daily-analogy">${ico('lightbulb')}<div><strong>Simple .NET comparison</strong><p>${esc(m.analogy)}</p><strong>Example</strong><p>${esc(m.example)}</p></div></div>
           ${m.code?`<details class="daily-starter-code"><summary>${ico('terminal')} Show C# starter code for this module ${ico('chevron-down')}</summary><div class="code-wrap"><div class="code-heading"><span>${esc(m.code.label)}</span><button type="button" class="code-copy" data-copy-code="${m.id}">${ico('copy')} Copy</button></div><pre><code>${esc(m.code.code)}</code></pre></div><p class="helper-text">Illustration: read the linked full sample before adapting to your solution.</p></details>`:''}
           <div class="daily-reference-block"><h4>${ico('book')} Learn more (official .NET / Microsoft + GitHub)</h4><p>Use the references only if the short explanation needs more context. Start with the C# example.</p><div class="refs-list">${referenceLinks(current.refs)}</div></div>
           <div class="day-check-zone"><label class="daily-done-label ${dayDone(current.d)?'is-checked':''}"><input type="checkbox" class="day-toggle" data-day="${current.d}" ${dayDone(current.d)?'checked':''}><span>${dayDone(current.d)?'Day complete! You can move on.':'I built/tested this. Mark Day '+current.d+' complete.'}</span>${ico('checkcircle')}</label></div>
           <div class="day-nav-actions"><button type="button" class="button button-outline" data-open-day="${current.d-1}" ${current.d===1?'disabled':''}>${ico('arrow-left')} ${current.d===1?'Previous day':'Day '+(current.d-1)}</button><button type="button" class="button button-primary" data-open-day="${current.d+1}" ${current.d===360?'disabled':''}>${current.d===360?'Course complete':'Day '+(current.d+1)} ${ico('arrow-right')}</button></div>
         </div>
       </article>
       <div class="daily-week-summary"><h4>This module's five days</h4>${m.days.map(id=>{const d=dayById(id);return `<button type="button" data-open-day="${id}" class="daily-summary-row ${id===selectedDay?'active':''}"><span>${dayDone(id)?ico('checkcircle'):String(id).padStart(3,'0')}</span><strong>${esc(d.title)}</strong><small>${esc(d.output)}</small>${ico('arrow-right')}</button>`}).join('')}</div>`;
    renderDaySearch();
  }
  function renderDaySearch(){
    const container=$('#day-search-results');
    const q=daySearchText.trim().toLowerCase();
    container.hidden=!q;
    if(!q){container.innerHTML='';return}
    const found=C.days.filter(day=>[
      day.d,day.title,day.explain,day.task,day.output,moduleById(day.module).title
    ].join(' ').toLowerCase().includes(q));
    container.innerHTML=`<div class="search-matches-title"><strong>${found.length} days found</strong><span>Showing up to 30. Open any result to study it.</span></div><div class="daily-matches">${found.slice(0,30).map(d=>`<button type="button" data-open-day="${d.d}"><span>DAY ${String(d.d).padStart(3,'0')}</span><strong>${esc(d.title)}</strong><small>${esc(d.task)}</small>${ico('arrow-right')}</button>`).join('')||'<p>No matching days. Try another phrase.</p>'}</div>`;
  }
  function renderGlossary(){
    const q=glossaryText.trim().toLowerCase();
    const rows=C.glossary.filter(term=>(glossaryCat==='All'||term[2]===glossaryCat)&&(!q||term.join(' ').toLowerCase().includes(q)));
    $('#glossary-count').textContent=`${rows.length} of ${C.glossary.length} concepts`;
    $('#glossary-grid').innerHTML=rows.map(([title,desc,category])=>`<article class="term-card"><div class="term-category">${esc(category)}</div><h3>${esc(title)}</h3><p>${esc(desc)}</p></article>`).join('')||`<div class="empty-state">${ico('search')}No term matches your search.</div>`;
  }
  function renderResources(){
    const groups=[...new Set(C.resources.map(r=>r.group))];
    $('#resource-groups').innerHTML=groups.map(group=>`<div class="resource-group"><h3>${esc(group)}</h3><div class="resource-list">${C.resources.filter(r=>r.group===group).map(r=>`<a class="resource-item" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${ico(r.url.includes('github.com')?'github':'external')}<div><strong>${esc(r.title)}</strong><small>${esc(r.note)}</small></div><span class="resource-kind">${esc(r.kind)}</span></a>`).join('')}</div></div>`).join('');
    $('#setup-checks').innerHTML=setupItems.map((x,i)=>`<label class="setup-line"><input type="checkbox" class="setup-check" data-setup="${i}" ${state.setup[i]?'checked':''}><span>${esc(x)}</span></label>`).join('');
    $('#electives-grid').innerHTML=C.electives.map(e=>`<div class="elective-item"><div class="elective-icon">${ico(e.icon)}</div><div><span class="elective-tag">${esc(e.tag)}</span><h3>${esc(e.title)}</h3><p>${esc(e.why)}</p><div class="elective-try"><strong>Try:</strong> ${esc(e.try)}</div><div class="refs-list">${referenceLinks(e.refs)}</div></div></div>`).join('');
  }
  function fullRender(){renderProgress();renderOverview();renderPath();renderProjects();renderDays();renderGlossary();renderResources()}
  function onRoute(){
    const previous=currentView;
    const [name,param]=decodeURIComponent((location.hash||'#overview').slice(1)).split('/');
    const target=views[name]?name:'overview';
    currentView=target;
    if(target==='path'&&param&&moduleById(param)){
      selectedModule=moduleById(param).id;
      expandedPhases.add(moduleById(param).phase);
      renderPath();
    }
    if(target==='kickstart'&&param&&dayById(param))selectedDay=Number(param);
    $$('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+target));
    $$('.nav-link').forEach(link=>{
      const active=link.dataset.nav===target;
      link.classList.toggle('active',active);
      if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    });
    $('#page-heading').textContent=views[target];
    document.title=(target==='overview'?C.title:views[target]+' — '+C.title);
    document.body.classList.remove('sidebar-open');
    if(target==='kickstart')renderDays();
    if(target==='path')renderPath();
    if(target==='projects')renderProjects();
    if(target==='glossary')renderGlossary();
    if(target==='toolkit')renderResources();
    if(previous!==target){window.scrollTo({top:0,behavior:'instant'})}
    else if(target==='kickstart'){
      const el=$('#day-'+selectedDay);
      if(el&&window.scrollY>el.getBoundingClientRect().top+window.scrollY){
        window.scrollTo({top:Math.max(0,el.getBoundingClientRect().top+window.scrollY-90),behavior:'instant'});
      }
    }
    if(target==='projects'&&param){const el=$('#project-'+param);if(el)setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),80)}
    if(target==='path'&&param&&window.innerWidth<=760)setTimeout(()=>$('#module-details').scrollIntoView({block:'start',behavior:'smooth'}),70);
  }
  function backupExport(){
    const backup={app:'DotNetAiAcademy',version:2,exportedAt:new Date().toISOString(),progress:state};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='dotnet-ai-academy-v2-progress.json';document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2500);toast('Your progress file has been downloaded.');
  }
  function backupImport(file){
    if(!file||file.size>2_000_000){toast('Please choose an academy progress JSON file smaller than 2 MB.');return}
    const reader=new FileReader();reader.onload=()=>{
      try{
        const raw=JSON.parse(reader.result);
        if(raw.app!=='DotNetAiAcademy'||raw.version!==2||!raw.progress)throw Error('Wrong version');
        if(!confirm('Replace all current Day 1–360 learning progress with this backup?'))return;
        state=cleanState(raw.progress);save();selectedDay=nextDay().d;fullRender();onRoute();toast('Progress imported.');
      }catch(_){toast('This file is not a v2 Day 1–360 progress backup. Old versions cannot be safely mapped to new days.')}
    };reader.readAsText(file);
  }
  async function copyToClipboard(text){
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);toast('Copied!');return}
      const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.focus();input.select();
      const ok=document.execCommand('copy');input.remove();toast(ok?'Copied!':'Select text to copy it manually.');
    }catch(_){toast('Clipboard access blocked. Select text to copy manually.')}
  }
  function bindEvents(){
    window.addEventListener('hashchange',onRoute);
    document.addEventListener('click',event=>{
      const target=event.target;
      const ph=target.closest('[data-phase]');if(ph){const id=ph.dataset.phase;expandedPhases.has(id)?expandedPhases.delete(id):expandedPhases.add(id);renderPath();return}
      const modButton=target.closest('[data-module]');if(modButton){goModule(modButton.dataset.module);return}
      const openMod=target.closest('[data-open-module]');if(openMod){goModule(openMod.dataset.openModule);return}
      const openDay=target.closest('[data-open-day]');if(openDay){goDay(Number(openDay.dataset.openDay));return}
      const openProj=target.closest('[data-open-project]');if(openProj){navigate('projects',openProj.dataset.openProject);return}
      const checkProj=target.closest('[data-project-done]');if(checkProj){const id=checkProj.dataset.projectDone;state.projects[id]=!state.projects[id];save();renderProjects();toast(state.projects[id]?'Project marked completed.':'Project reopened.');return}
      const switchView=target.closest('[data-view]');if(switchView){navigate(switchView.dataset.view);return}
      const copyId=target.closest('[data-copy-target]');if(copyId){const el=document.getElementById(copyId.dataset.copyTarget);if(el)copyToClipboard(el.textContent);return}
      const copyModule=target.closest('[data-copy-code]');if(copyModule){const m=moduleById(copyModule.dataset.copyCode);if(m?.code)copyToClipboard(m.code.code);return}
    });
    document.addEventListener('change',event=>{
      const node=event.target;
      if(node.classList.contains('day-toggle')||node.classList.contains('step-check')){
        const n=Number(node.dataset.day);if(!dayById(n))return;
        const was=dayDone(n);state.days[n]=Boolean(node.checked);save();
        renderProgress();renderOverview();renderDays();renderPath();
        if(!was&&node.checked)toast(`Day ${n} complete. Excellent — your next step is ready.`);
        return;
      }
      if(node.classList.contains('setup-check')){state.setup[node.dataset.setup]=node.checked;save();return}
    });
    $('#global-search').addEventListener('input',event=>{
      searchText=event.target.value;
      if(currentView!=='path')navigate('path');else renderPath();
    });
    $('#level-filters').addEventListener('click',event=>{
      const b=event.target.closest('[data-level]');if(b){activeLevel=b.dataset.level;renderPath()}
    });
    $('#day-module-select').addEventListener('change',event=>goDay(Number(event.target.value)));
    $('#previous-block').addEventListener('click',()=>{
      const m=moduleById(dayById(selectedDay).module);if(m.start>1)goDay(m.start-5);
    });
    $('#next-block').addEventListener('click',()=>{
      const m=moduleById(dayById(selectedDay).module);if(m.end<360)goDay(m.end+1);
    });
    $('#day-search').addEventListener('input',event=>{
      daySearchText=event.target.value;renderDaySearch();
    });
    $('#glossary-search').addEventListener('input',event=>{glossaryText=event.target.value;renderGlossary()});
    $('#glossary-category').addEventListener('change',event=>{glossaryCat=event.target.value;renderGlossary()});
    $('#continue-top').addEventListener('click',()=>goDay(nextDay().d));
    $('#hero-start').addEventListener('click',()=>goDay(nextDay().d));
    $('#hero-projects').addEventListener('click',()=>navigate('projects'));
    $('#view-full-path').addEventListener('click',()=>navigate('path'));
    $('#feature-projects').addEventListener('click',()=>navigate('projects'));
    $('#daily-continue').addEventListener('click',()=>goDay(nextDay().d));
    $('#open-sidebar').addEventListener('click',()=>document.body.classList.add('sidebar-open'));
    $('#sidebar-scrim').addEventListener('click',()=>document.body.classList.remove('sidebar-open'));
    $('.brand').addEventListener('click',()=>document.body.classList.remove('sidebar-open'));
    $$('.nav-link').forEach(link=>link.addEventListener('click',()=>document.body.classList.remove('sidebar-open')));
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'){document.body.classList.remove('sidebar-open');return}
      const tag=document.activeElement?.tagName;
      if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(tag)&&!event.altKey&&!event.ctrlKey&&!event.metaKey){event.preventDefault();$('#global-search').focus()}
    });
    $('#export-progress').addEventListener('click',backupExport);
    $('#import-progress').addEventListener('click',()=>$('#import-file').click());
    $('#import-file').addEventListener('change',e=>{backupImport(e.target.files[0]);e.target.value=''});
    $('#reset-progress').addEventListener('click',()=>{
      if(confirm('Reset all Day 1–360 lessons, projects and setup checklists? Export a backup first if needed.')){
        state=blankState();save();selectedDay=1;fullRender();onRoute();toast('Progress reset. Day 1 is ready.');
      }
    });
  }
  function init(){
    const categories=[...new Set(C.glossary.map(term=>term[2]))].sort();
    $('#glossary-category').innerHTML='<option value="All">All categories</option>'+categories.map(cat=>`<option value="${esc(cat)}">${esc(cat)}</option>`).join('');
    bindEvents();fullRender();onRoute();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
