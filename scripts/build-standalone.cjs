// Generated outputs are derived from the same sources as the multi-file site.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">',()=>`<style>\n${read('styles.css')}\n</style>`);
const labDownloads={};
fs.mkdirSync(path.join(root,'downloads'),{recursive:true});
for(const [folder,labFiles]of require('./lab-packages.cjs')){
  const sourceZip=require('./source-zip.cjs')(path.join(root,'labs',folder),labFiles);
  fs.writeFileSync(path.join(root,'downloads',folder+'.zip'),sourceZip);
  labDownloads['downloads/'+folder+'.zip']='data:application/zip;base64,'+sourceZip.toString('base64');
  for(const file of labFiles){
    const target='labs/'+folder+'/'+file;
    labDownloads[target]='data:application/octet-stream;charset=utf-8,'+encodeURIComponent(read(target)).replace(/'/g,'%27');
  }
}
html=html.replace('<script src="assets/mlnet-content.js"></script>',()=>`<script>window.AcademyLabDownloads=${JSON.stringify(labDownloads)};</script>\n<script src="assets/mlnet-content.js"></script>`);
for(const file of ['mlnet-content','language-content','reliable-content','tools-content','search-content','rag-content','retrieval-content','workflow-content','inputs-content','operations-content','advanced-catalog','learning-support-a','learning-support-b','teaching-foundations','teaching-mlnet','teaching-language','teaching-math','teaching-prompts-tools','teaching-search-rag','teaching-retrieval-workflows','teaching-models-operations','teaching-complete','learning-support','curriculum','learning-core','mlnet-experiments','language-experiments','reliable-experiments','tools-experiments','search-experiments','rag-experiments','retrieval-experiments','workflow-experiments','inputs-experiments','operations-experiments','experiments','home','learning-resources','lab-files','mlnet-lab','draft-files','draft-lab','summary-files','summary-lab','lookup-files','lookup-lab','search-files','search-lab','rag-files','rag-lab','retrieval-files','retrieval-lab','workflow-files','workflow-lab','inputs-files','inputs-lab','operations-files','operations-lab','workspace']){
  let source=read(`assets/${file}.js`);
  if(file==='workspace'){
    for(const labFile of ['SupportDesk.Rules.csproj','Program.cs','README.md']){
      const target=`labs/supportdesk-rules/${labFile}`;
      const data='data:text/plain;charset=utf-8,'+encodeURIComponent(read(target)).replace(/'/g,'%27');
      source=source.replaceAll(target,data);
    }
  }
  html=html.replace(`<script src="assets/${file}.js"></script>`,()=>`<script>\n${source.replace(/<\/script/gi,'<\\/script')}\n</script>`);
}
fs.writeFileSync(path.join(root,'standalone.html'),html);
const {lessons,references,stages,labs,glossary,unitSupport}=require('../assets/curriculum.js');
// Human prose can mention HTML/generic syntax. Preserve it as text in Markdown;
// actual code fields remain fenced verbatim.
const markdownProse=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function teachingMarkdown(l){
 const raw=l.support.teaching;if(!raw)return '';
 const t=JSON.parse(JSON.stringify(raw),(key,value)=>typeof value==='string'&&!['code','starter'].includes(key)?markdownProse(value):value);
 const code=value=>value?'\n\n```csharp\n'+value+'\n```\n':'';
 return `\n### ${t.explanation.title}\n\n${t.explanation.text}\n\n### Follow the example step by step\n\n${t.worked.title}\n\n${t.worked.steps.map((s,i)=>`${i+1}. **${s.title}:** ${s.text}${code(s.code)}`).join('\n\n')}\n\n${t.worked.result}\n\n### Practise with a little help\n\n${t.guided.task}${code(t.guided.starter)}\n\nHint: ${t.guided.hint}\n\nExpected approach: ${t.guided.solution}\n\nExpected result: ${t.guided.expected}\n\n### Apply it to another .NET feature\n\n${t.transfer.task}\n\nCompare your reasoning: ${t.transfer.answer}\n\n### Explain it again tomorrow\n\n${t.recall.question}\n\nCompare your explanation: ${t.recall.answer}\n\nOptional practice does not change saved understanding checks or certify project work.\n`;
}
let md=`# AI for .NET developers — available lessons\n\n${lessons.length} complete lessons across ${stages.filter(s=>s.available).length} units. Open index.html for interactive exercises and ${labs.length} desktop labs. ${stages.some(s=>!s.available)?'Later units remain clearly marked Planned.':'All curriculum units are available. Labs are educational demonstrations, not production deployments.'}\n`;
let foundations='# AI for .NET developers — foundations\n\nThe six foundation lessons. Continue into the available ML.NET unit in LEARNING_GUIDE.md or the website.\n';
for(const [index,l]of lessons.entries()){
  const prior=md.length;
  md+=`\n## ${index+1}. ${l.title}\n\nObjective: ${l.objective}\n\nPrerequisite: ${l.prerequisites.map(id=>lessons.find(x=>x.id===id).title).join(', ')||'No AI knowledge required.'}\n\n${l.paragraphs.join('\n\n')}\n\n**${l.definition[0]}:** ${l.definition[1]}\n\n### Worked example\n\n${l.example.title}\n\n> ${l.example.input}\n\n${l.example.paths.map(x=>`- ${x.title}: ${x.detail} Result: ${x.result}.`).join('\n')}\n\n${l.example.explanation}\n\n### Try it\n\n${l.exercise} Open the interactive lesson to try the exercise.\n\n### Check understanding\n\n${l.quiz.question}\n\n${l.quiz.options.map((x,i)=>`${i+1}. ${x.text}`).join('\n')}\n\nAnswer: ${l.quiz.answer+1}. ${l.quiz.options[l.quiz.answer].why}\n\n### .NET connection\n\n${l.dotnet.text}\n\n${l.dotnet.label}\n\n\`\`\`text\n${l.dotnet.code}\n\`\`\`\n\nContribution: ${l.dotnet.contribution}\n\nNext: ${l.dotnet.next}\n\nReference: [${references[l.reference].title}](${references[l.reference].url})\n`;
  if(l.unitId==='foundations')foundations+=md.slice(prior);
  const source=l.support.source;
  const practice=`\n### Find this concept in the project\n\nFile: ${source.path}\n\nMethod or type: ${source.symbol}\n\nScope: ${source.kind}\n\nTask: ${source.task}\n\nExpected result: ${source.expected}\n\nFrom the extracted project folder:\n\n\`\`\`powershell\n${source.command}\n\`\`\`\n`;
  md+=practice;if(l.unitId==='foundations')foundations+=practice;
  const teaching=teachingMarkdown(l);md+=teaching;if(l.unitId==='foundations')foundations+=teaching;
  for(const topic of l.support.microtopics||[]){const text=`\n### ${markdownProse(topic.title)}\n\n${markdownProse(topic.text)}\n\nTry to explain: ${markdownProse(topic.task)}\n\nCompare your explanation: ${markdownProse(topic.answer)}\n`;md+=text;if(l.unitId==='foundations')foundations+=text;}
}
md+=(stages.some(s=>!s.available)?'\n## Later units — planned\n\n':'\n## Learning path complete\n\nReview your understanding checks and independently self-report the coding milestones in the website. These records are not a certification or proof of deployment.\n')+stages.filter(s=>!s.available).map(s=>`### ${s.title}\n\n${s.outcome}\n\n${s.topics.map(x=>`- ${x}`).join('\n')}\n\nMilestone: ${s.milestone}\n`).join('\n');
md+='\n## Unit recaps and independent challenges\n\nPractice is separate from the saved lesson checks. Use fictional data only.\n';
for(const unit of stages){const data=unitSupport[unit.id];md+=`\n### ${unit.title}\n\n${data.scope}\n\n`+data.recap.map((q,i)=>`${i+1}. ${q.question}\n\n${q.options.map((o,j)=>`   ${j+1}. ${o.text}`).join('\n')}\n\nExpected answer: ${q.answer+1}. ${q.options[q.answer].why}\n`).join('\n')+`\nIndependent challenge: ${data.challenge.task}\n\n${data.challenge.checks.map(x=>'- '+x).join('\n')}\n\nVerification in the extracted project folder: ${data.challenge.command}\n\nExpected approach: ${data.challenge.solution}\n`;}
md+='\n## AI glossary\n\n'+glossary.map(g=>`### ${g.term}\n\n${g.definition}\n\nRelated lessons: ${g.lessonIds.map(id=>lessons.find(l=>l.id===id).title).join('; ')}\n`).join('\n');
md+='\n## .NET AI toolkit\n\nUse ordinary C# for exact rules, ML.NET for training a classifier, Microsoft.Extensions.AI abstractions for provider-independent model access, compatible vector storage for retrieval, ONNX Runtime for model execution, MCP for protocol interoperability, and an agent framework only when orchestration is justified. These libraries are not automatically installed by the lessons. Advanced labs remain authored educational simulations where labelled. See the official guide: https://learn.microsoft.com/en-us/dotnet/ai/dotnet-ai-ecosystem\n';
fs.writeFileSync(path.join(root,'FOUNDATION_LESSONS.md'),foundations);
fs.writeFileSync(path.join(root,'LEARNING_GUIDE.md'),md);
console.log('Generated standalone.html, FOUNDATION_LESSONS.md and LEARNING_GUIDE.md from current sources.');
