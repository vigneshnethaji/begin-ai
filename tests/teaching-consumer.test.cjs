const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../assets/curriculum');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../assets/learning-resources.js'),'utf8'),context);
const resources=context.window.AcademyResources;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const helpers={esc,codeBlock:(text,label)=>`<pre aria-label="${esc(label)}"><code>${esc(text)}</code></pre>`};
test('every lesson renders its explanation, worked sequence and optional practice through the real resource consumer',()=>{
 for(const lesson of C.lessons){
  const understand=resources.teaching(lesson,'understand',helpers),example=resources.teaching(lesson,'example',helpers),practice=resources.teaching(lesson,'try',helpers),recall=resources.teaching(lesson,'check',helpers);
  assert.match(understand,/class="teaching-explanation"/,lesson.id);
  assert.match(example,/data-worked-trace/,lesson.id);assert.ok((example.match(/<li>/g)||[]).length>=3,lesson.id);
  assert.match(practice,/data-guided-practice/,lesson.id);assert.match(practice,/data-transfer-practice/,lesson.id);assert.match(recall,/data-recall-practice/,lesson.id);
 }
});
test('authored resource fields stay encoded rather than becoming executable markup',()=>{
 const lesson=structuredClone(C.lessons[0]),payload='<img src=x onerror="alert(1)">';
 lesson.support.teaching.explanation.text=payload;lesson.support.teaching.worked.steps[0].text=payload;lesson.support.teaching.guided.solution=payload;lesson.support.teaching.recall.answer=payload;
 for(const section of ['understand','example','try','check']){const rendered=resources.teaching(lesson,section,helpers);assert.ok(!rendered.includes('<img'),section);assert.ok(rendered.includes('&lt;img'),section);}
});
test('combined glossary never exposes dangling lesson links or duplicate term headings',()=>{
 const known=new Set(C.lessons.map(l=>l.id)),terms=new Set();
 for(const term of C.glossary){const name=term.term.toLocaleLowerCase('en').trim();assert.ok(!terms.has(name),term.term);terms.add(name);for(const id of term.lessonIds)assert.ok(known.has(id),term.term+': '+id);}
});
