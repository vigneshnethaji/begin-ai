(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./curriculum.js'));
  else root.AcademyCore = factory(root.AcademyContent);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(content) {
  'use strict';
  const getLesson = id => content.lessons.find(x => x.id === id);
  const lessonsForUnit = id => content.lessons.filter(x=>x.unitId===id);
  const unitForLesson = id => content.stages.find(x=>x.id===getLesson(id)?.unitId);
  const sectionIds=['understand','example','try','check','dotnet'];
  function sanitizeProgress(input) {
    const state = { lessons: {}, labs: {} };
    if (!input || typeof input !== 'object' || Array.isArray(input)) return state;
    for (const lesson of content.lessons) {
      const entry = input.lessons?.[lesson.id];
      if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
        state.lessons[lesson.id] = { read: entry.read === true, checked: entry.checked === true };
      }
    }
    for(const lab of content.labs)if(input.labs?.[lab.id]===true)state.labs[lab.id]=true;
    const visit=input.lastVisited;
    if(visit&&getLesson(visit.lessonId)&&sectionIds.includes(visit.section))state.lastVisited={lessonId:visit.lessonId,section:visit.section};
    if(Array.isArray(input.bookmarks))state.bookmarks=[...new Set(input.bookmarks.filter(id=>typeof id==='string'&&getLesson(id)))];
    return state;
  }
  function recordVisit(input,id,section){
    const state=sanitizeProgress(input);
    if(getLesson(id)&&sectionIds.includes(section))state.lastVisited={lessonId:id,section};
    return state;
  }
  function resumeTarget(input){return sanitizeProgress(input).lastVisited||null;}
  function toggleBookmark(input,id){
    const state=sanitizeProgress(input);
    if(!getLesson(id))return state;
    const saved=state.bookmarks||[];
    state.bookmarks=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];return state;
  }
  function nextDestination(input){
    const state=sanitizeProgress(input);
    for(const unit of content.stages){
      const lessons=lessonsForUnit(unit.id),next=lessons.find(l=>!state.lessons[l.id]?.checked);
      if(next)return '#lesson/'+next.id+'/understand';
      const lab=content.labs.find(l=>l.id===lessons[0]?.labId);
      if(lab&&!state.labs[lab.id])return lab.url;
    }
    return '#progress';
  }
  const aliases={
    'generated-text':['LLM','large language model','generative AI'],
    'embedding-meaning':['embedding','embeddings'],
    'retrieval-first':['RAG','retrieval augmented generation'],
    'onnx-quantization':['ONNX','quantization'],
    'finetuning-decision':['fine-tuning','finetuning','fine tuning']
  };
  const words=value=>String(value||'').normalize('NFKD').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  const textValues=value=>typeof value==='string'?value:Array.isArray(value)?value.map(textValues).join(' '):value&&typeof value==='object'?Object.values(value).map(textValues).join(' '):'';
  function searchLessons(query){
    const terms=words(query);if(!terms.length)return content.lessons;
    return content.lessons.filter(l=>{
      const glossaryAliases=(content.glossary||[]).filter(g=>g.lessonIds.includes(l.id)).flatMap(g=>[g.term,...g.aliases]);
      const tokens=words(textValues([l.title,l.short,l.summary,l.objective,l.definition,l.paragraphs,l.example,l.quiz,l.dotnet,l.support,l.keywords,aliases[l.id],glossaryAliases]));
      return terms.every(term=>tokens.some(token=>token===term||(term.length>=3&&token.startsWith(term))));
    });
  }
  function quizOptions(id){
    const lesson=getLesson(id);if(!lesson)return [];
    const options=lesson.quiz.options.map((option,index)=>({option,index}));
    let seed=2166136261;for(const ch of id)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
    for(let i=options.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[options[i],options[j]]=[options[j],options[i]];}
    return options;
  }
  function searchGlossary(query){
    const terms=words(query);
    return (content.glossary||[]).filter(g=>{const tokens=words([g.term,g.definition,...g.aliases].join(' '));return terms.every(term=>tokens.some(token=>token===term||(term.length>=3&&token.startsWith(term))));});
  }
  function grade(id, choice) {
    const quiz = getLesson(id)?.quiz;
    if (!quiz || !Number.isInteger(choice) || !quiz.options[choice]) return { correct: false, explanation: 'Choose one of the available answers.' };
    return { correct: choice === quiz.answer, explanation: quiz.options[choice].why };
  }
  function recordAnswer(input, id, choice) {
    const state = sanitizeProgress(input);
    if (!getLesson(id)) return state;
    const entry = state.lessons[id] || { read: false, checked: false };
    state.lessons[id] = { ...entry, checked: entry.checked || grade(id, choice).correct };
    return state;
  }
  function nextLesson(input) {
    const state = sanitizeProgress(input);
    return content.lessons.find(x => !state.lessons[x.id]?.checked) || content.lessons[content.lessons.length - 1];
  }
  function missingPrerequisites(input, id) {
    const state = sanitizeProgress(input);
    return (getLesson(id)?.prerequisites || []).filter(x => !state.lessons[x]?.checked).map(getLesson);
  }
  function courseEvidence(input) {
    const state=sanitizeProgress(input);
    const checked=content.lessons.filter(lesson=>state.lessons[lesson.id]?.checked).length;
    const completedLabs=content.labs.filter(lab=>state.labs[lab.id]===true).length;
    const totalChecks=content.lessons.length,totalLabs=content.labs.length;
    const checksComplete=totalChecks>0&&checked===totalChecks;
    const labsComplete=totalLabs>0&&completedLabs===totalLabs;
    return {checked,totalChecks,completedLabs,totalLabs,checksComplete,labsComplete,courseComplete:checksComplete&&labsComplete};
  }
  function classifyRule(message, keyword) {
    if (!String(message).trim() || !String(keyword).trim()) return 'General';
    return String(message).toLowerCase().includes(String(keyword).trim().toLowerCase()) ? 'Billing' : 'General';
  }
  function readBackup(text) {
    if (new TextEncoder().encode(text).length > 2000000) throw new Error('Choose a backup smaller than 2 MB.');
    let backup;
    try { backup = JSON.parse(text); } catch { throw new Error('The file is not valid JSON. Choose an exported progress backup.'); }
    if (backup?.app !== 'dotnet-ai-workspace' || backup?.version !== 1) throw new Error('Choose a progress backup exported by this learning workspace.');
    if (!backup.progress || typeof backup.progress !== 'object' || Array.isArray(backup.progress)) throw new Error('The backup has no valid progress object.');
    return sanitizeProgress(backup.progress);
  }
  return { getLesson, lessonsForUnit, unitForLesson, sanitizeProgress, grade, recordAnswer, nextLesson, missingPrerequisites, courseEvidence, classifyRule, readBackup,searchLessons,searchGlossary,recordVisit,resumeTarget,toggleBookmark,nextDestination,quizOptions };
});
