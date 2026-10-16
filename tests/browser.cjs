// Run against `node scripts/serve.cjs`; uses the host's bundled Playwright.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
let playwright;
try{playwright=require('playwright');}catch{playwright=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const {lessons}=require('../assets/curriculum.js');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'.artifacts');
fs.mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:4173';
const KEY='dotnet-ai-workspace-progress-v1';
(async()=>{
  const browser=await playwright.chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  const go=async hash=>{await page.goto(base+'/'+hash);await page.locator('main h1').waitFor();};
  const readState=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}'),KEY);
  await go('');
  assert.match(await page.locator('h1').innerText(),/Build AI features/);
  await page.screenshot({path:path.join(out,'desktop-home.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(out,'mobile-home.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('link',{name:'Start the foundation lessons',exact:true}).click();
  await page.waitForURL('**/#lesson/ai-features/understand');
  await page.locator('.brand').click();await page.waitForURL('**/#home');
  await page.getByRole('heading',{level:1,name:/Build AI features/}).waitFor();
  assert.match(await page.locator('h1').innerText(),/Build AI features/);
  console.log('PASS: default landing page explains the purpose and Start/Home navigation works');
  await go('#lesson/ai-features/understand');
  await page.screenshot({path:path.join(out,'desktop-understand.png'),fullPage:true});
  await page.getByLabel('I’ve read this explanation').check();
  assert.equal((await readState()).lessons['ai-features'].read,true);
  assert.equal((await readState()).lessons['ai-features'].checked,false);
  await page.locator('.section-tabs a').filter({hasText:'Check'}).click();
  await page.locator('[data-answer="0"]').click();
  assert.equal((await readState()).lessons['ai-features'].checked,false);
  assert.match(await page.locator('#quiz-feedback').innerText(),/Validation does not require/);
  await page.locator('[data-answer="1"]').click();
  assert.equal((await readState()).lessons['ai-features'].checked,true);
  await page.reload();assert.match(await page.locator('.lesson-panel').innerText(),/already passed/);
  await page.goto(base+'/#learn');await page.waitForURL('**/#lesson/rules/understand');
  await page.getByRole('heading',{level:1,name:'When ordinary C# rules are enough'}).waitFor();
  assert.match(await page.locator('h1').innerText(),/ordinary C#/);
  console.log('PASS: independent read/check evidence, wrong-answer feedback, persistence');
  // Every authored lesson and section renders; each lesson has its own exercise.
  for(const lesson of lessons){
    for(const section of ['understand','example','try','check','dotnet']){
      await go(`#lesson/${lesson.id}/${section}`);
      assert.match(await page.title(),/AI for .NET developers/);
      assert.equal(await page.locator('.section-tabs [aria-current=step]').count(),1);
      assert.ok((await page.locator('.lesson-panel').innerText()).length>200);
    }
  }
  console.log('PASS: all 30 lesson sections render');
  await go('#lesson/rules/try');
  await page.getByRole('button',{name:'Same intent, different words',exact:true}).click();
  assert.equal(await page.locator('#rule-result').innerText(),'General');
  await page.getByLabel('Send to Billing when this word appears').fill('payment');
  assert.equal(await page.locator('#rule-result').innerText(),'Billing');
  await go('#lesson/models/try');
  await page.getByLabel('Choose an input message').selectOption('1');
  assert.match(await page.locator('#model-result').innerText(),/Account/);
  await go('#lesson/training/try');await page.locator('[data-pick="0"]').click();
  assert.match(await page.locator('.feedback').innerText(),/This is training/);
  await page.getByRole('button',{name:'Next scenario'}).click();await page.locator('[data-pick="1"]').click();
  assert.match(await page.locator('.feedback').innerText(),/This is inference/);
  await go('#lesson/predictions/try');await page.getByRole('button',{name:'Reveal predictions and compare'}).click();
  assert.match(await page.locator('#evaluation-results').innerText(),/3 of 5 match/);
  await go('#lesson/choose-approach/try');await page.locator('[data-pick="2"]').click();
  assert.match(await page.locator('.feedback').innerText(),/best fit/);
  console.log('PASS: keyword, model boundary, training, evaluation, approach experiments');
  await go('#map');await page.getByRole('searchbox').fill('vectors');
  assert.equal(await page.locator('.stage').count(),1);
  assert.match(await page.locator('.stage').innerText(),/Planned/);
  await page.getByRole('searchbox').fill('xyznomatch');
  assert.match(await page.locator('.empty-search').innerText(),/No matching topic/);
  await page.getByRole('searchbox').fill('');
  await page.screenshot({path:path.join(out,'desktop-map.png'),fullPage:true});
  console.log('PASS: course map distinguishes available lessons from planned units; search works');
  await go('#progress');
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export progress'}).click();
  const download=await downloadPromise;const downloadPath=path.join(out,'backup.json');await download.saveAs(downloadPath);
  const backup=JSON.parse(fs.readFileSync(downloadPath,'utf8'));assert.equal(backup.app,'dotnet-ai-workspace');assert.equal(backup.progress.lessons['ai-features'].checked,true);
  await page.locator('#import-progress').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{nope')});
  await page.waitForFunction(()=>document.querySelector('#backup-message').textContent.includes('not valid JSON'));
  assert.match(await page.locator('#backup-message').innerText(),/not valid JSON/);
  const acceptDialog=dialog=>dialog.accept();page.on('dialog',acceptDialog);
  await page.getByRole('button',{name:'Reset preview progress'}).click();assert.deepEqual((await readState()).lessons,{});
  await page.locator('#import-progress').setInputFiles(downloadPath);
  await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).lessons['ai-features']?.checked===true,KEY);
  page.off('dialog',acceptDialog);
  console.log('PASS: export, reset, invalid import feedback, and confirmed restore');
  await go('#lab');await page.getByLabel('I ran the supplied checks').check();
  assert.equal((await readState()).labs['rules-baseline'],true);
  for(const file of ['SupportDesk.Rules.csproj','Program.cs','README.md'])assert.equal((await page.request.get(base+'/labs/supportdesk-rules/'+file)).status(),200);
  console.log('PASS: runnable lab downloads and independent lab milestone');
  // Detect page overflow on every view at narrow/mobile/tablet/desktop sizes.
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    for(const hash of ['#home','#lesson/ai-features/understand','#lesson/ai-features/example','#lesson/rules/try','#lesson/models/dotnet','#lesson/training/check','#map','#lab','#progress']){
      await go(hash);
      const size=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
      assert.ok(size.scroll<=size.viewport+1,`overflow ${width}px ${hash}: ${JSON.stringify(size)}`);
    }
  }
  await page.setViewportSize({width:390,height:844});await go('#lesson/ai-features/example');
  await page.screenshot({path:path.join(out,'mobile-example.png'),fullPage:true});
  await page.getByRole('button',{name:'Open course navigation'}).click();assert.equal(await page.locator('#course-drawer').evaluate(x=>x.open),true);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#course-drawer').evaluate(x=>x.open),false);
  assert.equal(await page.locator('#open-course').evaluate(x=>x===document.activeElement),true);
  await page.getByRole('button',{name:'Open course navigation'}).click();
  await page.locator('#course-drawer').getByRole('link',{name:/Training vs/}).click();
  await page.waitForURL('**/#lesson/training/understand');
  await page.getByRole('heading',{level:1,name:'Training and using a model are different'}).waitFor();
  assert.equal(await page.locator('#course-drawer').evaluate(x=>x.open),false);
  assert.match(await page.locator('h1').innerText(),/Training/);
  await page.locator('.mobile-bottom-nav').getByRole('link',{name:'Home',exact:true}).click();
  await page.getByRole('heading',{level:1,name:/Build AI features/}).waitFor();
  await page.locator('.mobile-bottom-nav').getByRole('link',{name:'Course map',exact:true}).click();
  await page.getByRole('heading',{level:1,name:'See how the pieces connect.'}).waitFor();
  console.log('PASS: 36 responsive route checks, mobile drawer, and labelled mobile main navigation');
  // A local-file site must work without fetch, a server, or module loading.
  const filePage=await browser.newPage({viewport:{width:1440,height:1000}});filePage.on('pageerror',e=>errors.push(e.message));
  for(const entry of ['index.html','standalone.html']){
    await filePage.goto(pathToFileURL(path.join(root,entry)).href+'#lesson/rules/try');
    await filePage.locator('#rule-message').waitFor();assert.equal(await filePage.locator('#rule-result').innerText(),'Billing');
  }
  // A copied standalone must carry its lab sources with it.
  const isolated=path.join(out,'standalone-isolated');fs.mkdirSync(isolated,{recursive:true});
  fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
  await filePage.goto(pathToFileURL(path.join(isolated,'standalone.html')).href+'#lab');
  const fileDownloadPromise=filePage.waitForEvent('download');
  await filePage.getByRole('link',{name:'Program.cs with checks'}).click();
  const labDownload=await fileDownloadPromise;
  await labDownload.saveAs(path.join(out,'downloaded-Program.cs'));
  assert.equal(fs.readFileSync(path.join(out,'downloaded-Program.cs'),'utf8'),fs.readFileSync(path.join(root,'labs/supportdesk-rules/Program.cs'),'utf8'));
  await filePage.close();
  console.log('PASS: multi-file and self-contained editions open directly from disk');
  console.log('PASS: isolated standalone downloads its embedded lab source without adjacent files');
  assert.deepEqual(errors,[],'No browser errors or missing assets');
  fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({passed:true,lessonSections:30,responsiveRoutes:36,errors},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
