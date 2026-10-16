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
  await go('#map/reliable-outputs');
  const stage=page.locator('#unit-reliable-outputs');
  assert.match(await stage.innerText(),/Available now/);
  assert.equal(await stage.locator('.stage-topics a').count(),6);
  assert.deepEqual(await stage.locator('.stage-topics a').evaluateAll(links=>links.map(link=>link.getAttribute('href'))),[
    '#lesson/prompt-roles/understand','#lesson/prompt-examples/understand','#lesson/useful-context/understand',
    '#lesson/structured-json/understand','#lesson/validate-responses/understand','#lesson/compare-prompts/understand'
  ]);
  await stage.locator('a[href="#lesson/prompt-roles/understand"]').click();
  await page.waitForURL('**/#lesson/prompt-roles/understand');
  const side=page.locator('#desktop-navigation').getByRole('navigation',{name:'Prompt and output lessons'});
  await side.waitFor();assert.equal(await side.getByRole('link').count(),6);
  assert.match(await page.locator('.lesson-meta').innerText(),/Lesson 1 of 6/);
  assert.match(await page.locator('.project-preview').innerText(),/Ticket summary/);
  await page.screenshot({path:path.join(out,'desktop-reliable-start.png'),fullPage:false});
  await go('#lesson/prompt-roles/try');
  await page.locator('[data-rp-roles="mixed"]').click();
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/unsupported/);
  await page.locator('[data-rp-roles="separate"]').click();
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/not a security guarantee/);
  await go('#lesson/prompt-examples/try');
  await page.locator('[data-rp-examples]').selectOption('misleading');await page.locator('[data-rp-apply]').click();
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/wrong category/);
  await page.locator('[data-rp-examples]').selectOption('reviewed');await page.locator('[data-rp-apply]').click();
  assert.match(await page.locator('[data-rp-output]').innerText(),/Account/);
  await go('#lesson/useful-context/try');
  await page.locator('[data-rp-context="policy"]').check();await page.locator('[data-rp-build]').click();
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/unsourced policy/);
  await page.locator('[data-rp-context="policy"]').uncheck();await page.locator('[data-rp-build]').click();
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/context is relevant/);
  await go('#lesson/structured-json/try');
  for(const fixture of ['malformed','extra','nulls','empty']){
    await page.locator('[data-rp-fixture]').selectOption(fixture);await page.locator('[data-rp-validate]').click();
    assert.equal(await page.locator('[data-rp-json]').getAttribute('aria-invalid'),'true');
    assert.match(await page.locator('[data-rp-output]').innerText(),/Shape rejected/);
  }
  await page.locator('[data-rp-fixture]').selectOption('unsupported');await page.locator('[data-rp-validate]').click();
  assert.equal(await page.locator('[data-rp-json]').getAttribute('aria-invalid'),'false');
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/facts are NOT verified/);
  const html=JSON.stringify({title:'Fictional issue',category:'Billing',facts:['<img src=x onerror="alert(1)">'],missingInformation:[]});
  await page.locator('[data-rp-json]').fill(html);
  assert.match(await page.locator('[data-rp-output]').innerText(),/has not been checked/);
  await page.locator('[data-rp-validate]').click();
  assert.equal(await page.locator('[data-rp-output] img').count(),0);
  assert.match(await page.locator('[data-rp-output]').innerText(),/<img/);
  await go('#lesson/validate-responses/try');
  for(const response of ['refused','incomplete','failed']){
    await page.locator('[data-rp-response]').selectOption(response);await page.locator('[data-rp-check]').click();
    assert.equal(await page.locator('[data-rp-review]').isEnabled(),false);
    assert.match(await page.locator('[data-rp-output]').innerText(),/DTO parsing not attempted/);
  }
  await page.locator('[data-rp-response]').selectOption('unsupported');await page.locator('[data-rp-check]').click();
  assert.equal(await page.locator('[data-rp-review]').isEnabled(),true);
  await page.locator('[data-rp-review]').click();
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/Review rejected/);
  await go('#lesson/compare-prompts/try');await page.locator('[data-rp-compare]').click();
  assert.match(await page.locator('[data-rp-feedback]').innerText(),/v1 2 \/ 4; v2 3 \/ 4/);
  assert.match(await page.locator('[data-rp-results]').innerText(),/General passes v1 but fails v2/);
  console.log('PASS: all six prompt/output exercises, invalid JSON, safe text, stale results, response states, evidence rejection and fixed-rubric regression');
  await go('#lesson/compare-prompts/dotnet');
  await page.getByRole('link',{name:'Open the summary desktop lab',exact:true}).click();
  await page.waitForURL('**/#lab/ticket-summary');
  await page.locator('#complete-summary-lab').check();
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).labs['ticket-summary'],KEY),true);
  assert.equal(await page.locator('#desktop-navigation').getByRole('navigation',{name:'Lab prerequisites'}).getByRole('link').count(),3);
  const download=page.waitForEvent('download');
  await page.getByRole('link',{name:'Download complete summary lab (.zip)',exact:true}).click();
  await (await download).saveAs(path.join(out,'summary-source.zip'));
  for(const [file]of require('../assets/summary-files.js'))assert.equal((await page.request.get('http://127.0.0.1:4173/labs/supportdesk-ticket-summary/'+file)).status(),200);
  await page.screenshot({path:path.join(out,'desktop-summary-lab.png'),fullPage:true});
  let responsive=0;
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    for(const hash of ['#lesson/prompt-roles/understand','#lesson/prompt-examples/try','#lesson/useful-context/try','#lesson/structured-json/try','#lesson/validate-responses/try','#lesson/compare-prompts/dotnet','#lab/ticket-summary']){
      await go(hash);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${width} ${hash}`);responsive++;
    }
  }
  await page.setViewportSize({width:390,height:844});await go('#lesson/structured-json/try');
  await page.getByRole('button',{name:'Open course navigation'}).click();
  assert.equal(await page.locator('#course-drawer').getByRole('navigation',{name:'Prompt and output lessons'}).getByRole('link').count(),6);
  await page.keyboard.press('Escape');
  await page.screenshot({path:path.join(out,'mobile-reliable-json.png'),fullPage:true});
  const isolated=path.join(out,'summary-standalone-isolated');fs.mkdirSync(isolated,{recursive:true});
  fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
  await page.goto(pathToFileURL(path.join(isolated,'standalone.html')).href+'#lab/ticket-summary');
  const embedded=page.waitForEvent('download');await page.getByRole('link',{name:'Download complete summary lab (.zip)',exact:true}).click();
  await (await embedded).saveAs(path.join(out,'standalone-summary-source.zip'));
  assert.deepEqual(fs.readFileSync(path.join(out,'standalone-summary-source.zip')),fs.readFileSync(path.join(root,'downloads/supportdesk-ticket-summary.zip')));
  assert.deepEqual(errors,[]);
  console.log(`PASS: Unit 4 map, six-lesson sidebar and summary preview, lab milestone/downloads, ${responsive} responsive checks, mobile drawer and portable ZIP`);
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
