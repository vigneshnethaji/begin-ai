// Observable learner journeys, not checks for particular prose in source files.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base='http://127.0.0.1:4173/';
(async()=>{const browser=await pw.chromium.launch();try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(8000);
 await page.goto(base+'#lab/bounded-workflow');
 await page.getByRole('link',{name:'Continue to Unit 10: inputs and model choices',exact:true}).click();
 await page.waitForURL('**/#lesson/images-ocr/understand');await page.getByRole('heading',{level:1,name:/^Images:/}).waitFor();assert.match(await page.locator('main h1').innerText(),/Images/);
 await page.goto(base+'#home');await page.reload();await page.keyboard.press('Tab');
 assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link');
 await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement.id==='main-content');
 await page.goto(base+'#map');const opener=page.getByRole('button',{name:'Open course navigation',exact:true});
 await opener.click();assert.equal(await opener.getAttribute('aria-expanded'),'true');assert.equal(await opener.getAttribute('aria-controls'),'course-drawer');
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#course-drawer').open&&document.querySelector('#open-course').getAttribute('aria-expanded')==='false');assert.equal(await opener.getAttribute('aria-expanded'),'false');assert.ok(await opener.evaluate(n=>n===document.activeElement));
 for(const [id,title]of [['foundations','Foundations'],['first-mlnet-model','Data and your first ML.NET model'],['language-models','Language models in C#'],['reliable-outputs','Reliable prompts and outputs'],['tools-actions','Tools and safe actions'],['semantic-search','Vectors and semantic search'],['document-answers','Answers grounded in documents'],['production-retrieval','Production retrieval'],['agents-workflows','Agents and workflows'],['model-choices','More inputs and model choices'],['azure-operations','Operate and deploy on Azure']]){
  await opener.click();await page.locator('#mobile-navigation').getByRole('link',{name:new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).first().click();
  await page.waitForFunction(unit=>document.activeElement===document.querySelector('#unit-'+unit+' h2'),id);assert.equal(await page.locator('#course-drawer').evaluate(n=>n.open),false);
  assert.ok(await page.locator('#unit-'+id+' h2').evaluate(n=>{const b=n.getBoundingClientRect();return b.top>=document.querySelector('.app-header').getBoundingClientRect().bottom&&b.bottom<=document.querySelector('.mobile-bottom-nav').getBoundingClientRect().top;}),'selected unit heading must actually be visible: '+id);
 }
 for(const [label,hash]of [['Continue learning','#lesson/ai-features/understand'],['C# rules-baseline lab','#lab']]){
  await page.goto(base+'#map');await page.getByRole('heading',{level:1,name:'See how the pieces connect.',exact:true}).waitFor();await opener.click();
  await page.locator('#mobile-navigation').getByRole('link',{name:label,exact:true}).click();
  await page.waitForFunction(want=>location.hash===want&&document.activeElement.tagName==='H1'&&!document.querySelector('#course-drawer').open,hash);
 }
 for(const [id,selector]of [['prompt-roles','[data-rp-output]'],['prompt-examples','[data-rp-demonstrations]']]){
  await page.goto(base+'#lesson/'+id+'/try');const output=page.locator(selector);await output.waitFor();await output.focus();
  assert.equal(await output.getAttribute('tabindex'),'0');assert.equal(await output.getAttribute('role'),'group');await page.keyboard.press('ArrowRight');await page.waitForFunction(s=>document.querySelector(s).scrollLeft>0,selector);
 }
 await page.goto(base+'#lesson/rules/try');await page.getByRole('group',{name:'Example messages',exact:true}).waitFor();
 await page.goto(base+'#lesson/ai-features/check');await page.locator('[data-answer="0"]').focus();await page.keyboard.press('Enter');
 assert.match(await page.locator('#quiz-feedback').innerText(),/Validation does not require/);
 await page.locator('[data-answer="1"]').focus();await page.keyboard.press('Enter');
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('dotnet-ai-workspace-progress-v1')).lessons['ai-features'].checked===true);
 await page.goto(base+'#progress');
 const reset=page.getByRole('button',{name:'Reset learning progress',exact:true});
 page.once('dialog',dialog=>dialog.dismiss());await reset.click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('dotnet-ai-workspace-progress-v1')).lessons['ai-features'].checked),true);
 // Doubled text at 320px must remain usable, not clipped.
 await page.goto(base+'#home');await page.locator('.home-intro').waitFor();await page.setViewportSize({width:320,height:1000});
 await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body,body *')].map(n=>[n,parseFloat(getComputedStyle(n).fontSize)]);for(const [n,size]of sizes)if(n instanceof HTMLElement)n.style.fontSize=(size*2)+'px';});
 const enlargedFits=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
 if(!enlargedFits){console.log(await page.evaluate(()=>{const texts=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(!n.textContent.trim())continue;const r=document.createRange();r.selectNodeContents(n);const b=r.getBoundingClientRect();if(b.width>0&&b.height>0&&b.right>innerWidth+1)texts.push({tag:n.parentElement.tagName,cls:n.parentElement.className,text:n.textContent.slice(0,65),right:b.right});}return {width:innerWidth,scroll:document.documentElement.scrollWidth,texts};}));await page.screenshot({path:path.resolve(__dirname,'../.artifacts/enlarged-home-before.png'),fullPage:false});}
 assert.ok(enlargedFits,'enlarged Home reflow');
 const brandFits=await page.evaluate(()=>{const mark=document.querySelector('.brand-mark'),name=document.querySelector('.brand-name'),range=document.createRange();range.selectNodeContents(mark);return range.getBoundingClientRect().right<=name.getBoundingClientRect().left&&name.getBoundingClientRect().bottom<=document.querySelector('.app-header').getBoundingClientRect().bottom;});
 assert.ok(brandFits,'doubled-text branding must not overlap or leave the header');
 const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();await fallback.goto(base);
 const guide=fallback.getByRole('link',{name:'Read the complete learning guide',exact:true});assert.equal(await guide.getAttribute('href'),'LEARNING_GUIDE.md');await nojs.close();
 fs.mkdirSync(path.resolve(__dirname,'../.artifacts'),{recursive:true});
 await page.screenshot({path:path.resolve(__dirname,'../.artifacts/mobile-doubled-text.png'),fullPage:false});
 await page.setViewportSize({width:390,height:844});await page.goto(base+'?journey-final#home');
 await page.screenshot({path:path.resolve(__dirname,'../.artifacts/mobile-polished-home.png'),fullPage:false});
 console.log('PASS beginner journey: published Unit9→10 handoff; keyboard skip/checks; drawer state and focus return; cancelled reset preserves evidence; text enlargement; current no-JS guide.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
