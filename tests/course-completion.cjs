// Local developer test in an isolated browser profile; never uses learner progress.
const assert=require('node:assert/strict');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const C=require('../assets/curriculum.js'),KEY='dotnet-ai-workspace-progress-v1';
(async()=>{
 const browser=await pw.chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(8000);
  await page.goto('http://127.0.0.1:4173/#home');
  await page.goto('http://127.0.0.1:4173/#lesson/'+C.lessons.at(-1).id+'/dotnet');
  const finalLab=C.labs.find(lab=>lab.id===C.lessons.at(-1).labId);
  assert.equal(await page.locator('.section-footer').getByRole('link',{name:'Open this unit’s lab',exact:true}).getAttribute('href'),finalLab.url);
  assert.equal(await page.locator('.section-footer').getByRole('link',{name:'Next lesson',exact:true}).count(),0);
  await page.goto('http://127.0.0.1:4173/#home');
  const seed=async progress=>{await page.evaluate(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[KEY,progress]);await page.reload();};
  const allChecks=Object.fromEntries(C.lessons.map(x=>[x.id,{checked:true}]));
  await seed({lessons:allChecks,labs:{}});
  await page.goto('http://127.0.0.1:4173/#learn');
  await page.waitForURL('**/#lab');
  assert.match(await page.locator('main h1').innerText(),/rules baseline/i);
  await page.goto('http://127.0.0.1:4173/#home');
  assert.match(await page.locator('.home-next').innerText(),/All lesson checks passed/);
  assert.doesNotMatch(await page.locator('.home-next').innerText(),/Your learning path is recorded/);
  const labs=Object.fromEntries(C.labs.map(x=>[x.id,true]));
  if(C.labs.some(x=>x.id==='operations-capstone')){
   const incomplete={...labs};delete incomplete['operations-capstone'];await seed({lessons:allChecks,labs:incomplete});
   await page.goto('http://127.0.0.1:4173/#learn');await page.waitForURL('**/#lab/operations-capstone');
  }
  await page.goto('http://127.0.0.1:4173/#home');await seed({lessons:allChecks,labs});
  assert.match(await page.locator('.home-next').innerText(),/Your learning path is recorded/);
  await page.locator('.home-actions').getByRole('link',{name:'Review learning progress',exact:true}).click();
  await page.waitForURL('**/#progress');
  assert.match(await page.locator('[data-course-status]').innerText(),/Self-reported lab milestones/);
  assert.match(await page.locator('[data-course-status]').innerText(),/not a certification|not certification/i);
  await page.goto('http://127.0.0.1:4173/#learn');await page.waitForURL('**/#progress');
  await page.goto('http://127.0.0.1:4173/#home');
  await seed({lessons:Object.fromEntries(C.lessons.map(x=>[x.id,{read:true}])),labs});
  await page.goto('http://127.0.0.1:4173/#learn');await page.waitForURL('**/#lesson/ai-features/understand');
  console.log('PASS: all-checks → unfinished labs → evidence summary; read-only markers never complete the course; no certification claim');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
