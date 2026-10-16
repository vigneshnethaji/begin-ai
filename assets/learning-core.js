(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./curriculum.js'));
  else root.AcademyCore = factory(root.AcademyContent);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(content) {
  'use strict';
  const getLesson = id => content.lessons.find(x => x.id === id);
  const lessonsForUnit = id => content.lessons.filter(x=>x.unitId===id);
  const unitForLesson = id => content.stages.find(x=>x.id===getLesson(id)?.unitId);
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
    return state;
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
  return { getLesson, lessonsForUnit, unitForLesson, sanitizeProgress, grade, recordAnswer, nextLesson, missingPrerequisites, classifyRule, readBackup };
});
