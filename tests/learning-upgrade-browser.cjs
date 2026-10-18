const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const root=path.resolve(__dirname,'..'),KEY='dotnet-ai-workspace-progress-v1';
(async()=>{const b=await pw.chromium.launch();try{
 const p=await b.newPage({viewport:{width:390,height:844}});p.setDefaultTimeout(7000);const errors=[];p.on('pageerror',e=>errors.push(e.message));let serial=0;
 const go=async hash=>{await p.goto('http://127.0.0.1:4173/?upgrade='+(serial++)+hash);await p.locator('main h1').waitFor();};
 await go('#glossary');assert.equal(await p.locator('#glossary-search').count(),1,'searchable glossary must be available');
 await p.locator('#glossary-search').fill('RAG');assert.match(await p.locator('#glossary-results').innerText(),/retrieval/i);
 for(const term of ['LLM','embedding','ONNX','fine-tuning']){await go('#map');await p.getByRole('searchbox').fill(term);assert.ok(await p.locator('.stage').count()>0,term);}
 await go('#lesson/local-inference/understand');
 for(const route of ['#glossary','#toolkit',...require('../assets/curriculum.js').stages.map(s=>'#review/'+s.id),'#resume']){
  await p.getByRole('button',{name:'Open course navigation',exact:true}).click();
  // Native Enter activation must navigate, close the modal and focus the new heading.
  const anchor=p.locator('#mobile-navigation').locator('a[href="'+route+'"]');
  if(!await anchor.count()){
   await p.getByRole('button',{name:'Close course navigation',exact:true}).click();await go('#glossary');
   await p.getByRole('button',{name:'Open course navigation',exact:true}).click();
  }
  await anchor.first().focus();await p.keyboard.press('Enter');
  await p.waitForFunction(()=>!document.querySelector('#course-drawer').open);
  await p.waitForFunction(()=>document.activeElement===document.querySelector('main h1'));
  assert.equal(await p.locator('main h1').evaluate(el=>el.getBoundingClientRect().top>=0),true);
 }
 await go('#lesson/blazor-streaming/dotnet');assert.equal(await p.locator('.implementation-reference').count(),1);
 assert.match(await p.locator('.implementation-reference').innerText(),/\.razor|\.cs/);
 await p.getByRole('button',{name:'Save lesson',exact:true}).click();
 await go('#home');await p.getByRole('link',{name:'Resume where I stopped',exact:true}).click();
 await p.waitForURL(u=>u.hash==='#lesson/blazor-streaming/dotnet');
 await go('#progress');assert.match(await p.locator('[data-bookmarks]').innerText(),/Blazor|draft/i);assert.equal(await p.locator('.unit-progress').count(),11);
 await go('#lesson/choose-approach/dotnet');assert.equal(await p.getByRole('link',{name:'Review this unit',exact:true}).getAttribute('href'),'#review/foundations');
 await p.getByRole('link',{name:'Review this unit',exact:true}).click();await p.locator('[data-practice]').first().waitFor();
 const before=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);
 await p.locator('[data-practice]').first().click();assert.ok(await p.locator('[data-practice-feedback]').first().innerText());
 const after=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY);assert.deepEqual(after.lessons,before.lessons);assert.deepEqual(after.labs,before.labs);
 const C=require('../assets/curriculum.js');for(const s of C.stages){await go('#review/'+s.id);assert.equal(await p.locator('.review-question').count(),3);assert.equal(await p.locator('[data-independent-challenge]').count(),1);}
 for(const l of C.lessons){await go('#lesson/'+l.id+'/dotnet');assert.equal(await p.locator('.implementation-reference').count(),1,l.id);}
 for(const l of C.labs){await go(l.url);const jump=p.getByRole('link',{name:'Jump to source and ZIP downloads',exact:true});assert.equal(await jump.count(),1);await jump.click();const heading=p.locator('#project-downloads h2');assert.equal(await heading.evaluate(n=>n===document.activeElement),true);const r=await heading.boundingBox();assert.ok(r.y>=60&&r.y<740,l.id+' download heading must be visible');}
 for(const width of [320,390,768,1440])for(const hash of ['#home','#glossary','#toolkit','#review/model-choices','#progress','#lesson/onnx-quantization/understand']){await p.setViewportSize({width,height:900});await go(hash);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,width+' '+hash);}
 await p.setViewportSize({width:390,height:844});await go('#lesson/local-inference/understand');await p.screenshot({path:path.join(root,'.artifacts/upgrade-mobile-lesson.png')});
 await go('#review/model-choices');await p.screenshot({path:path.join(root,'.artifacts/upgrade-mobile-review.png')});
 const isolated=fs.mkdtempSync(path.join(root,'.artifacts/upgrade-portable-'));fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
 const portable=await b.newPage();portable.on('pageerror',e=>errors.push(e.message));for(const hash of ['#glossary','#toolkit','#review/foundations','#lesson/onnx-quantization/dotnet']){await portable.goto(pathToFileURL(path.join(isolated,'standalone.html')).href+'?i='+(serial++)+hash);await portable.locator('main h1').waitFor();assert.equal(await portable.locator('main h1').innerText()==='That lesson link is unavailable.',false);}
 assert.match(await portable.locator('.implementation-reference a[download]').getAttribute('href'),/^data:/);
 assert.deepEqual(errors,[]);console.log('PASS: aliases/glossary, resume/bookmarks, 68 code references, 11 recaps/challenges/download jumps, mobile and isolated standalone');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
