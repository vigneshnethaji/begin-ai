// Developer-only headless contexts. No connection to a user's browser.
const assert=require('node:assert/strict');const path=require('node:path');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
(async()=>{const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage();await page.setContent('<main><div id="host"></div></main>');
 await page.addScriptTag({path:path.join(__dirname,'../assets/operations-experiments.js')});
 const types=['identity','evaluation','trace','cost','release','drills'];
 for(const type of types){await page.evaluate(t=>window.AcademyOperationsExperiments.mount(document.querySelector('#host'),'operations-'+t),type);await page.locator('[data-operations-run]').click();assert.ok((await page.locator('[role=status]').innerText()).length>10);}
 await page.evaluate(()=>window.AcademyOperationsExperiments.mount(document.querySelector('#host'),'operations-cost'));
 await page.locator('[data-operations-input]').fill('1000');await page.locator('[data-operations-output]').fill('500');await page.locator('[data-operations-run]').click();assert.match(await page.locator('[role=status]').innerText(),/0\.002500/);
 await page.locator('[data-operations-input]').fill('0');await page.locator('[data-operations-run]').click();assert.match(await page.locator('[role=status]').innerText(),/Invalid/);
 await page.evaluate(()=>window.AcademyOperationsExperiments.mount(document.querySelector('#host'),'operations-identity'));
 await page.locator('[data-operations-action]').selectOption('release.promote');await page.locator('[data-operations-run]').click();assert.match(await page.locator('[role=status]').innerText(),/Denied/);
 await page.evaluate(()=>window.AcademyOperationsExperiments.mount(document.querySelector('#host'),'operations-evaluation'));
 await page.locator('[data-operations-safety]').fill('1');await page.locator('[data-operations-run]').click();assert.match(await page.locator('[role=status]').innerText(),/Blocked/);
 await page.evaluate(()=>window.AcademyOperationsExperiments.mount(document.querySelector('#host'),'operations-release'));
 await page.locator('[data-operations-health]').selectOption('unknown');await page.locator('[data-operations-run]').click();assert.match(await page.locator('[role=status]').innerText(),/Unknown/);
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));for(const box of await page.locator('input,select,button').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().height)))assert.ok(box>=44);}
 // Repeated mounting must leave one usable action and detach the old listener.
 const disposal=await page.evaluate(()=>{const host=document.querySelector('#host');const api=window.AcademyOperationsExperiments;api.mount(host,'operations-cost');const old=host.querySelector('button');const oldStatus=host.querySelector('[role=status]');api.mount(host,'operations-cost');old.click();return oldStatus.textContent;});assert.match(disposal,/Change inputs/);assert.equal(await page.locator('button').count(),1);
 await page.locator('button').focus();assert.notEqual(await page.locator('button').evaluate(n=>getComputedStyle(n).outlineStyle),'none');
 console.log('PASS six operations exercises, input changes, remount disposal and 4 responsive widths');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
