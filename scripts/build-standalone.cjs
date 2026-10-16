// Generated outputs are derived from the same sources as the multi-file site.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">',()=>`<style>\n${read('styles.css')}\n</style>`);
for(const file of ['curriculum','learning-core','experiments','home','workspace']){
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
const {lessons,references,stages}=require('../assets/curriculum.js');
let md='# AI for .NET developers — foundation preview\n\nSix complete lessons. Later units are a proposed course map, not completed lessons. Open index.html for the interactive exercises.\n';
for(const [index,l]of lessons.entries()){
  md+=`\n## ${index+1}. ${l.title}\n\nObjective: ${l.objective}\n\nPrerequisite: ${l.prerequisites.map(id=>lessons.find(x=>x.id===id).title).join(', ')||'No AI knowledge required.'}\n\n${l.paragraphs.join('\n\n')}\n\n**${l.definition[0]}:** ${l.definition[1]}\n\n### Worked example\n\n${l.example.title}\n\n> ${l.example.input}\n\n${l.example.paths.map(x=>`- ${x.title}: ${x.detail} Result: ${x.result}.`).join('\n')}\n\n${l.example.explanation}\n\n### Try it\n\n${l.exercise} Open the interactive lesson to try the exercise.\n\n### Check understanding\n\n${l.quiz.question}\n\n${l.quiz.options.map((x,i)=>`${i+1}. ${x.text}`).join('\n')}\n\nAnswer: ${l.quiz.answer+1}. ${l.quiz.options[l.quiz.answer].why}\n\n### .NET connection\n\n${l.dotnet.text}\n\n${l.dotnet.label}\n\n\`\`\`text\n${l.dotnet.code}\n\`\`\`\n\nContribution: ${l.dotnet.contribution}\n\nNext: ${l.dotnet.next}\n\nReference: [${references[l.reference].title}](${references[l.reference].url})\n`;
}
md+='\n## Later units — planned\n\n'+stages.slice(1).map((s,i)=>`### ${i+2}. ${s.title}\n\n${s.outcome}\n\n${s.topics.map(x=>`- ${x}`).join('\n')}\n\nMilestone: ${s.milestone}\n`).join('\n');
fs.writeFileSync(path.join(root,'FOUNDATION_LESSONS.md'),md);
console.log('Generated standalone.html and FOUNDATION_LESSONS.md from current sources.');
