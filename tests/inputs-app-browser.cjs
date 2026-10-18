// Isolated developer headless context; caller supplies the local lab URL.
const assert=require('node:assert/strict');let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=new URL(process.argv[2]||'http://127.0.0.1:5117');assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname));
(async()=>{const browser=await pw.chromium.launch();try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(12000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base.href);
  assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200);await page.waitForFunction(()=>document.querySelector('#inputs-ready')?.textContent==='Interactive ready');
  const phase=async want=>page.waitForFunction(w=>document.querySelector('#inputs-phase')?.textContent===w,want);
  const normalize=async()=>{await page.locator('#normalize-inputs').click();await phase('AwaitingReview');};
  const approve=async()=>{await page.locator('#review-inputs').click();await page.waitForFunction(()=>!document.querySelector('#preview-inputs').disabled);};
  await normalize();assert.equal(await page.locator('#inputs-evidence li').count(),3);assert.match(await page.locator('#inputs-conflict').innerText(),/Unresolved conflict/);assert.equal(await page.locator('#preview-inputs').isDisabled(),true);
  await approve();assert.equal(await page.locator('#inputs-result').innerText(),'No preview.');await page.locator('#preview-inputs').click();await phase('AcceptedLocalPreview');assert.match(await page.locator('#inputs-result').innerText(),/audio-1: amount=170/);
  await page.locator('#inputs-notes').fill('Changed fictional review');await phase('Idle');assert.equal(await page.locator('#inputs-evidence li').count(),0);assert.equal(await page.locator('#inputs-result').innerText(),'No preview.');assert.equal(await page.locator('#preview-inputs').isDisabled(),true);
  await normalize();await page.locator('#deny-inputs').click();await phase('Denied');assert.equal(await page.locator('#inputs-result').innerText(),'No preview.');
  for(const [fixture,type,source] of [['image','image/png','image-1'],['audio','audio/wav','audio-1'],['text','text/plain','text-1']]){await page.locator('#inputs-fixture').selectOption(fixture);await page.locator('#inputs-type').fill(type);await normalize();assert.equal(await page.locator('#inputs-evidence li').count(),1);assert.match(await page.locator('#inputs-evidence').innerText(),new RegExp(source));await approve();}
  await page.locator('#inputs-type').fill('application/exe');await phase('Idle');await page.locator('#normalize-inputs').click();await phase('Denied');assert.equal(await page.locator('#inputs-evidence li').count(),0);
  await page.locator('#inputs-type').fill('text/plain');await page.locator('#inputs-notes').fill('');await page.locator('#normalize-inputs').click();await phase('Denied');
  await page.locator('#inputs-notes').evaluate(n=>n.removeAttribute('maxlength'));await page.locator('#inputs-notes').fill('x'.repeat(2001));await page.locator('#normalize-inputs').click();await phase('Denied');
  await page.locator('#inputs-notes').fill('<img src=x onerror=alert(1)>');await normalize();assert.equal(await page.locator('main img').count(),0);
  await page.locator('#choose-inputs').click();await page.waitForFunction(()=>document.querySelector('#inputs-choice').textContent.includes('local-text'));
  const memorySyntaxOutcomes=[];
  for(const value of ['8.0','1e1']){
    await page.locator('#inputs-memory').fill(value);assert.equal(await page.locator('#inputs-memory').inputValue(),value);
    await page.waitForFunction(()=>document.querySelector('#inputs-choice').textContent.includes('changed'));
    await page.locator('#choose-inputs').click();await page.waitForFunction(()=>!document.querySelector('#inputs-choice').textContent.includes('changed'));
    memorySyntaxOutcomes.push((await page.locator('#inputs-choice').innerText()).split('\n')[0]);
  }
  assert.deepEqual(memorySyntaxOutcomes,['Denied','Denied'],'Blazor must deny decimal and exponent memory syntax');
  await page.locator('#inputs-memory').fill('8');await page.locator('#choose-inputs').click();await page.waitForFunction(()=>document.querySelector('#inputs-choice').textContent.includes('local-text'));
  await page.locator('#inputs-capability').selectOption('vision');await page.waitForFunction(()=>/changed/i.test(document.querySelector('#inputs-choice').textContent));assert.match(await page.locator('#inputs-choice').innerText(),/changed/i);await page.locator('#choose-inputs').click();await page.waitForFunction(()=>document.querySelector('#inputs-choice').textContent.includes('No eligible profile'));
  await page.locator('#inputs-no-cloud').uncheck();await page.locator('#choose-inputs').click();await page.waitForFunction(()=>document.querySelector('#inputs-choice').textContent.includes('cloud-general'));
  await page.locator('#inputs-memory').fill('-1');await page.locator('#choose-inputs').click();await page.waitForFunction(()=>document.querySelector('#inputs-choice').textContent.includes('Denied'));
  // A model-requirement edit also invalidates review of the visible workspace.
  await normalize();await approve();await page.locator('#inputs-memory').fill('8');await phase('Idle');assert.equal(await page.locator('#preview-inputs').isDisabled(),true);
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`layout ${width}`);}
  for(const control of await page.locator('input,select,textarea,button').all()){assert.ok(await control.evaluate(n=>n.getBoundingClientRect().height>=44));if(await control.isEnabled()){await control.focus();assert.ok(await control.evaluate(n=>parseFloat(getComputedStyle(n).outlineWidth)>=2));}}
  assert.equal(await page.locator('#inputs-status').getAttribute('aria-live'),'polite');assert.equal(await page.locator('#inputs-status').getAttribute('aria-atomic'),'true');assert.deepEqual(errors,[]);
  console.log('PASS inputs Blazor: interactive readiness; real C# normalization/review/preview; deny/edit/type/empty/oversize; source/conflict; model policy; stale state; focus/44px; 320/390/768/1440.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
