// Isolated developer browser. No learner storage, providers or remote integrations.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require('playwright'),root=path.resolve(__dirname,'..'),KEY='dotnet-ai-workspace-progress-v1';
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(6000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const go=async hash=>{await page.goto('http://127.0.0.1:4173/'+hash);await page.locator('main h1').waitFor();};
 await go('#lesson/prompt-roles/example');assert.equal(await page.locator('[data-worked-trace]').count(),1,'remaining units need the same worked teaching flow');
 await go('#lesson/training/example');assert.equal(await page.locator('[data-worked-trace]').count(),1);
 await go('#lesson/training/try');await page.getByRole('button',{name:'Take one learning step',exact:true}).click();
 assert.match(await page.locator('#learning-step-output').innerText(),/3\.2/);
 await page.getByRole('button',{name:'Reset learning example',exact:true}).click();await page.locator('#learning-rate').selectOption('0.5');await page.getByRole('button',{name:'Take one learning step',exact:true}).click();assert.match(await page.locator('#learning-step-output').innerText(),/144/);
 await go('#lesson/evaluate-model/try');assert.match(await page.locator('#metrics-output').innerText(),/90%/);assert.match(await page.locator('#metrics-output').innerText(),/not defined/i);
 await page.getByRole('button',{name:'Try a classifier that finds Billing',exact:true}).click();assert.match(await page.locator('#metrics-output').innerText(),/96%/);assert.match(await page.locator('#metrics-output').innerText(),/80%/);
 const expected={lessons:{rules:{read:true,checked:true}},labs:{'rules-baseline':true}};
 await page.evaluate(({KEY,expected})=>localStorage.setItem(KEY,JSON.stringify(expected)),{KEY,expected});
 // A same-document hash navigation retains the running application's state.
 // Reload once to consume the externally seeded backup before testing practice.
 await page.reload();await page.locator('main h1').waitFor();
 const C=require('../assets/curriculum'),lessons=C.lessons;
 assert.equal(lessons.length,68);
 await page.setViewportSize({width:320,height:900});
 for(const lesson of lessons){
  await go('#lesson/'+lesson.id+'/understand');assert.equal(await page.locator('.teaching-explanation').count(),1,lesson.id);
  await go('#lesson/'+lesson.id+'/example');assert.equal(await page.locator('[data-worked-trace] li').count()>=3,true,lesson.id);
  await go('#lesson/'+lesson.id+'/try');
  for(const selector of ['[data-guided-practice]','[data-transfer-practice]']){const box=page.locator(selector);await box.locator(':scope > summary').click();assert.equal(await box.getAttribute('open')!==null,true);for(const summary of await box.locator('details > summary').all())await summary.click();}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,lesson.id+' mobile overflow');
  await go('#lesson/'+lesson.id+'/check');const recall=page.locator('[data-recall-practice]');assert.equal(await recall.count(),1);await recall.locator(':scope > summary').focus();await page.keyboard.press('Enter');assert.equal(await recall.getAttribute('open')!==null,true);
 }
 const after=await page.evaluate(KEY=>JSON.parse(localStorage.getItem(KEY)),KEY);assert.deepEqual(after.lessons,expected.lessons);assert.deepEqual(after.labs,expected.labs);
 for(const query of ['overfitting','confusion matrix','instruction tuning','loss']){await go('#map');await page.getByRole('searchbox').fill(query);assert.ok(await page.locator('.stage').count()>0,query);}
 for(const width of [320,768,1440]){await page.setViewportSize({width,height:900});await go('#lesson/training/try');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await page.setViewportSize({width:390,height:844});await go('#lesson/evaluate-model/try');fs.mkdirSync(path.join(root,'.artifacts'),{recursive:true});await page.locator('[data-metrics-demo]').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'.artifacts/teaching-metrics-mobile.png')});
 const isolated=fs.mkdtempSync(path.join(root,'.artifacts/teaching-offline-'));fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
 await page.goto(pathToFileURL(path.join(isolated,'standalone.html')).href+'#lesson/evaluate-model/try');await page.getByRole('button',{name:'Try a classifier that finds Billing',exact:true}).click();assert.match(await page.locator('#metrics-output').innerText(),/96%/);assert.equal(await page.locator('[data-guided-practice]').count(),1);
 for(const unit of C.stages){const id=unit.lessonIds[0];await page.goto(pathToFileURL(path.join(isolated,'standalone.html')).href+'#lesson/'+id+'/try');const task=page.locator('[data-guided-practice]');await task.locator(':scope > summary').click();assert.equal(await task.getAttribute('open')!==null,true,unit.id);assert.equal(await page.locator('[data-transfer-practice]').count(),1);}
 assert.deepEqual(await page.evaluate(()=>window.AcademyContent.lessons.map(l=>({id:l.id,teaching:l.support.teaching}))),C.lessons.map(l=>({id:l.id,teaching:l.support.teaching})),'Portable classic-script data must match all 68 canonical companions, not just the first lesson in a unit');
 assert.deepEqual(errors,[]);console.log('PASS: all 68 explanation/worked/guided/transfer/recall journeys; expanded 320px content and keyboard; arithmetic demos; no false credit; all 11 units offline');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
