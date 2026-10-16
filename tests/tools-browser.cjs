const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const root=path.resolve(__dirname,'..'),out=path.join(root,'.artifacts'),KEY='dotnet-ai-workspace-progress-v1';
(async()=>{
  const browser=await pw.chromium.launch();
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.setDefaultTimeout(8000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const go=async hash=>{await page.goto('http://127.0.0.1:4173/'+hash);await page.locator('main h1').waitFor();};
  await go('#map/tools-actions');
  const stage=page.locator('#unit-tools-actions');
  assert.match(await stage.innerText(),/Available now/);
  assert.equal(await stage.locator('.stage-topics a').count(),6);
  assert.deepEqual(await stage.locator('.stage-topics a').evaluateAll(links=>links.map(link=>link.getAttribute('href'))),[
    '#lesson/tool-function/understand','#lesson/tool-arguments/understand','#lesson/tool-execution/understand',
    '#lesson/tool-authorization/understand','#lesson/tool-retries/understand','#lesson/tool-audit/understand'
  ]);
  await stage.locator('a[href="#lesson/tool-function/understand"]').click();
  await page.waitForURL('**/#lesson/tool-function/understand');
  const side=page.locator('#desktop-navigation').getByRole('navigation',{name:'Tool and safety lessons'});
  await side.waitFor();assert.equal(await side.getByRole('link').count(),6);
  assert.match(await page.locator('.lesson-meta').innerText(),/Lesson 1 of 6/);
  assert.match(await page.locator('.project-preview').innerText(),/Ticket lookup/);
  await page.screenshot({path:path.join(out,'desktop-tools-start.png'),fullPage:false});
  await go('#lesson/tool-function/try');
  await page.locator('[data-tl-action="allow-refund"]').click();assert.match(await page.locator('[data-tl-feedback]').innerText(),/not allowed/);
  await page.locator('[data-tl-action="allow-lookup"]').click();assert.match(await page.locator('[data-tl-output]').innerText(),/Invocations: 0/);
  await go('#lesson/tool-arguments/try');
  for(const fixture of ['extra','wrong','malformed']){
    await page.locator('[data-tl-fixture]').selectOption(fixture);await page.locator('[data-tl-action="validate"]').click();
    assert.equal(await page.locator('[data-tl-json]').getAttribute('aria-invalid'),'true');
  }
  await page.locator('[data-tl-fixture]').selectOption('valid');await page.locator('[data-tl-action="validate"]').click();
  assert.match(await page.locator('[data-tl-output]').innerText(),/no invocation/);
  await go('#lesson/tool-execution/try');
  await page.locator('[data-tl-action="invoke"]').click();assert.match(await page.locator('[data-tl-output]').innerText(),/Blocked[\s\S]*Invocations: 0/);
  for(const step of ['propose','validate','approve']){await page.locator(`[data-tl-action="${step}"]`).click();assert.match(await page.locator('[data-tl-output]').innerText(),/Invocations: 0/);}
  await page.locator('[data-tl-action="invoke"]').click();assert.match(await page.locator('[data-tl-output]').innerText(),/Invocations: 1/);
  await page.locator('[data-tl-action="invoke"]').click();assert.match(await page.locator('[data-tl-output]').innerText(),/Replay: true[\s\S]*Invocations: 1/);
  await go('#lesson/tool-authorization/try');
  await page.locator('[data-tl-action="approve"]').click();await page.locator('[data-tl-action="invoke"]').click();
  assert.match(await page.locator('[data-tl-output]').innerText(),/Reads: 1/);
  await page.locator('[data-tl-identity]').selectOption('demo-guest');await page.locator('[data-tl-action="invoke"]').click();
  assert.equal(await page.locator('[data-tl-feedback]').innerText(),'Ticket unavailable.');
  assert.doesNotMatch(await page.locator('[data-tl-output]').innerText(),/Fictional DEMO-104/);
  await page.locator('[data-tl-identity]').selectOption('demo-reader');await page.locator('[data-tl-action="invoke"]').click();
  assert.match(await page.locator('[data-tl-feedback]').innerText(),/Fresh explicit approval/);
  await page.locator('[data-tl-action="approve"]').click();await page.locator('[data-tl-action="invoke"]').click();
  await page.locator('[data-tl-action="revoke"]').click();await page.locator('[data-tl-action="invoke"]').click();
  assert.equal(await page.locator('[data-tl-feedback]').innerText(),'Ticket unavailable.');
  await go('#lesson/tool-retries/try');
  await page.locator('[data-tl-scenario]').selectOption('transient');await page.locator('[data-tl-action="run"]').click();
  assert.match(await page.locator('[data-tl-output]').innerText(),/Attempts: 2[\s\S]*Reads: 1/);
  await page.locator('[data-tl-action="replay"]').click();assert.match(await page.locator('[data-tl-output]').innerText(),/Reads: 1[\s\S]*Replay: true/);
  await page.locator('[data-tl-action="conflict"]').click();assert.match(await page.locator('[data-tl-output]').innerText(),/Outcome: Conflict/);
  await page.locator('[data-tl-scenario]').selectOption('lost');await page.locator('[data-tl-action="run"]').click();
  await page.locator('[data-tl-action="replay"]').click();assert.match(await page.locator('[data-tl-output]').innerText(),/Outcome: Unknown[\s\S]*Reads: 1[\s\S]*Replay: true/);
  await go('#lesson/tool-audit/try');await page.locator('[data-tl-scenario]').selectOption('unknown');await page.locator('[data-tl-action="trace"]').click();
  assert.match(await page.locator('[data-tl-feedback]').innerText(),/Unknown is preserved/);
  assert.match(await page.locator('[data-tl-output]').innerText(),/"outcome": "Unknown"/);
  console.log('PASS: six tool activities, allowlist, strict argument examples, zero-call proposal/approval, scoped replay, revocation, retry/conflict and Unknown audit');
  await go('#lesson/tool-audit/dotnet');
  await page.getByRole('link',{name:'Open the tool desktop lab',exact:true}).click();
  await page.waitForURL('**/#lab/ticket-lookup');
  await page.locator('#complete-lookup-lab').check();
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).labs['ticket-lookup'],KEY),true);
  assert.equal(await page.locator('#desktop-navigation').getByRole('navigation',{name:'Lab prerequisites'}).getByRole('link').count(),3);
  const download=page.waitForEvent('download');
  await page.getByRole('link',{name:'Download complete lookup lab (.zip)',exact:true}).click();
  await (await download).saveAs(path.join(out,'lookup-source.zip'));
  for(const [file]of require('../assets/lookup-files.js'))assert.equal((await page.request.get('http://127.0.0.1:4173/labs/supportdesk-ticket-lookup/'+file)).status(),200);
  await page.screenshot({path:path.join(out,'desktop-lookup-lab.png'),fullPage:true});
  let responsive=0;
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    for(const hash of ['#lesson/tool-function/understand','#lesson/tool-arguments/try','#lesson/tool-execution/try','#lesson/tool-authorization/try','#lesson/tool-retries/try','#lesson/tool-audit/dotnet','#lab/ticket-lookup']){
      await go(hash);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${width} ${hash}`);responsive++;
    }
  }
  await page.setViewportSize({width:390,height:844});await go('#lesson/tool-authorization/try');
  await page.getByRole('button',{name:'Open course navigation'}).click();
  assert.equal(await page.locator('#course-drawer').getByRole('navigation',{name:'Tool and safety lessons'}).getByRole('link').count(),6);
  await page.keyboard.press('Escape');
  await page.screenshot({path:path.join(out,'mobile-tools-json.png'),fullPage:true});
  const isolated=path.join(out,'lookup-standalone-isolated');fs.mkdirSync(isolated,{recursive:true});
  fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
  await page.goto(pathToFileURL(path.join(isolated,'standalone.html')).href+'#lab/ticket-lookup');
  const embedded=page.waitForEvent('download');await page.getByRole('link',{name:'Download complete lookup lab (.zip)',exact:true}).click();
  await (await embedded).saveAs(path.join(out,'standalone-lookup-source.zip'));
  assert.deepEqual(fs.readFileSync(path.join(out,'standalone-lookup-source.zip')),fs.readFileSync(path.join(root,'downloads/supportdesk-ticket-lookup.zip')));
  assert.deepEqual(errors,[]);
  console.log(`PASS: Unit 5 map, six-lesson sidebar and lookup preview, lab milestone/downloads, ${responsive} responsive checks, mobile drawer and portable ZIP`);
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
