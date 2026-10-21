/* One teaching registry for all units; shared by browser, guide generator and tests. */
(function(root,factory){
 const node=typeof module==='object'&&module.exports;
 const value=factory(
  node?require('./teaching-foundations.js'):root.AcademyTeachingFoundations,
  node?require('./teaching-mlnet.js'):root.AcademyTeachingMlnet,
  node?require('./teaching-language.js'):root.AcademyTeachingLanguage,
  node?require('./teaching-prompts-tools.js'):root.AcademyTeachingPromptsTools,
  node?require('./teaching-search-rag.js'):root.AcademyTeachingSearchRag,
  node?require('./teaching-retrieval-workflows.js'):root.AcademyTeachingRetrievalWorkflows,
  node?require('./teaching-models-operations.js'):root.AcademyTeachingModelsOperations
 );
 if(node)module.exports=value;else root.AcademyTeaching=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(...parts){
 return {lessons:Object.assign({},...parts.map(p=>p.lessons)),glossary:parts.flatMap(p=>p.glossary)};
});
