// Generated outputs are derived from the same sources as the multi-file site.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">',()=>`<style>\n${read('styles.css')}\n</style>`);
const labDownloads={};
fs.mkdirSync(path.join(root,'downloads'),{recursive:true});
for(const [folder,manifest]of [['supportdesk-classifier','lab-files'],['supportdesk-draft-replies','draft-files'],['supportdesk-ticket-summary','summary-files'],['supportdesk-ticket-lookup','lookup-files'],['supportdesk-semantic-search','search-files'],['supportdesk-grounded-answers','rag-files'],['supportdesk-retrieval-quality','retrieval-files'],['supportdesk-bounded-workflow','workflow-files']]){
  const labFiles=require('../assets/'+manifest+'.js').map(([file])=>file);
  const sourceZip=require('./source-zip.cjs')(path.join(root,'labs',folder),labFiles);
  fs.writeFileSync(path.join(root,'downloads',folder+'.zip'),sourceZip);
  labDownloads['downloads/'+folder+'.zip']='data:application/zip;base64,'+sourceZip.toString('base64');
  for(const file of labFiles){
    const target='labs/'+folder+'/'+file;
    labDownloads[target]='data:application/octet-stream;charset=utf-8,'+encodeURIComponent(read(target)).replace(/'/g,'%27');
  }
}
html=html.replace('<script src="assets/mlnet-content.js"></script>',()=>`<script>window.AcademyLabDownloads=${JSON.stringify(labDownloads)};</script>\n<script src="assets/mlnet-content.js"></script>`);
for(const file of ['mlnet-content','language-content','reliable-content','tools-content','search-content','rag-content','retrieval-content','workflow-content','advanced-catalog','curriculum','learning-core','mlnet-experiments','language-experiments','reliable-experiments','tools-experiments','search-experiments','rag-experiments','retrieval-experiments','workflow-experiments','experiments','home','lab-files','mlnet-lab','draft-files','draft-lab','summary-files','summary-lab','lookup-files','lookup-lab','search-files','search-lab','rag-files','rag-lab','retrieval-files','retrieval-lab','workflow-files','workflow-lab','workspace']){
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
const {lessons,references,stages,labs}=require('../assets/curriculum.js');
let md=`# AI for .NET developers — available lessons\n\n${lessons.length} complete lessons across ${stages.filter(s=>s.available).length} units. Open index.html for interactive exercises and ${labs.length} desktop labs. Later units remain clearly marked Planned.\n`;
let foundations='# AI for .NET developers — foundations\n\nThe six foundation lessons. Continue into the available ML.NET unit in LEARNING_GUIDE.md or the website.\n';
for(const [index,l]of lessons.entries()){
  const prior=md.length;
  md+=`\n## ${index+1}. ${l.title}\n\nObjective: ${l.objective}\n\nPrerequisite: ${l.prerequisites.map(id=>lessons.find(x=>x.id===id).title).join(', ')||'No AI knowledge required.'}\n\n${l.paragraphs.join('\n\n')}\n\n**${l.definition[0]}:** ${l.definition[1]}\n\n### Worked example\n\n${l.example.title}\n\n> ${l.example.input}\n\n${l.example.paths.map(x=>`- ${x.title}: ${x.detail} Result: ${x.result}.`).join('\n')}\n\n${l.example.explanation}\n\n### Try it\n\n${l.exercise} Open the interactive lesson to try the exercise.\n\n### Check understanding\n\n${l.quiz.question}\n\n${l.quiz.options.map((x,i)=>`${i+1}. ${x.text}`).join('\n')}\n\nAnswer: ${l.quiz.answer+1}. ${l.quiz.options[l.quiz.answer].why}\n\n### .NET connection\n\n${l.dotnet.text}\n\n${l.dotnet.label}\n\n\`\`\`text\n${l.dotnet.code}\n\`\`\`\n\nContribution: ${l.dotnet.contribution}\n\nNext: ${l.dotnet.next}\n\nReference: [${references[l.reference].title}](${references[l.reference].url})\n`;
  if(l.unitId==='foundations')foundations+=md.slice(prior);
}
md+='\n## Later units — planned\n\n'+stages.filter(s=>!s.available).map(s=>`### ${s.title}\n\n${s.outcome}\n\n${s.topics.map(x=>`- ${x}`).join('\n')}\n\nMilestone: ${s.milestone}\n`).join('\n');
fs.writeFileSync(path.join(root,'FOUNDATION_LESSONS.md'),foundations);
fs.writeFileSync(path.join(root,'LEARNING_GUIDE.md'),md);
console.log('Generated standalone.html, FOUNDATION_LESSONS.md and LEARNING_GUIDE.md from current sources.');
