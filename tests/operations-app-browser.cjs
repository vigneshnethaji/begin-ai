const assert=require('node:assert/strict');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const url=process.argv[2]||'http://127.0.0.1:5119';
(async()=>{const browser=await chromium.launch({headless:true});try{
 const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const fresh=async()=>{await page.goto(url);await page.getByText('Interactive ready',{exact:true}).waitFor();};
 const click=id=>page.locator('#'+id).click();const status=async want=>{await page.waitForFunction(w=>document.querySelector('#release-status')?.textContent===w,want);assert.equal(await page.locator('#release-status').innerText(),want);};
 await fresh();await status('Idle');await click('check-gates');await status('Ready');await click('approve');await status('Approved');await page.locator('#quality').fill('96');await status('Idle');assert.equal(await page.locator('#promote').isDisabled(),true);
 await click('check-gates');await click('approve');await click('promote');await status('AwaitingSmoke');await page.locator('#smoke-health').selectOption('bad');await click('smoke');await status('RolledBack');assert.equal(await page.locator('#active').innerText(),'V1');await click('replay');assert.equal(await page.locator('#effects').innerText(),'1');
 // Removing maxlength simulates a forged oversized component event, not ordinary typing.
 await fresh();await page.locator('#revision').evaluate(n=>n.removeAttribute('maxlength'));await page.locator('#revision').fill('v2000');await page.locator('#quality').focus();await status('Blocked');
 await page.locator('#quality').fill('96');await page.locator('#samples').focus();await click('check-gates');await page.waitForFunction(()=>document.querySelector('#check-number').textContent==='1');assert.equal(await page.locator('#release-status').innerText(),'Blocked','unrelated edit must not launder an oversized revision');assert.equal(await page.locator('#approve').isDisabled(),true);
 await page.locator('#revision').fill('v3');await status('Idle');await click('check-gates');await status('Ready');await click('approve');await status('Approved');
 await fresh();await page.locator('#samples').fill('0');await page.locator('#revision').focus();await click('check-gates');await status('Blocked');assert.equal(await page.locator('#approve').isDisabled(),true);
 await fresh();await page.locator('#identity').selectOption('demo-reader');await click('check-gates');await status('Blocked');
 await fresh();await click('check-gates');await click('approve');await click('deny');await status('Denied');assert.equal(await page.locator('#effects').innerText(),'0');
 await fresh();await click('check-gates');await click('cancel');await status('Cancelled');
 await fresh();await click('check-gates');await click('approve');await click('promote');await page.locator('#smoke-health').selectOption('unknown');await click('smoke');await status('Unknown');await click('replay');await status('Unknown');assert.equal(await page.locator('#effects').innerText(),'1');assert.equal(await page.locator('#revision').isDisabled(),true);
 await fresh();await click('check-gates');await click('approve');await click('promote');await click('smoke');await status('Complete');await click('replay');assert.equal(await page.locator('#effects').innerText(),'1');
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);const sizes=await page.locator('input,select,button').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().height));assert.ok(sizes.every(x=>x>=44),`targets ${width}`);}
 await fresh();await page.locator('#check-gates').focus();await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').getAttribute('id'),'deny');assert.notEqual(await page.locator(':focus').evaluate(n=>getComputedStyle(n).outlineStyle),'none');assert.deepEqual(errors,[]);
 console.log('PASS operations Blazor readiness, exact approval, immediate input invalidation, persistent oversized-input rejection, bounds, denial/cancel, rollback, Unknown/replay, 320/390/768/1440 and keyboard focus');await context.close();
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
