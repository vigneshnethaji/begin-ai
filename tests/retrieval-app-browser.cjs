// Exercises the actual Blazor circuit. Start the lab yourself; URL argument supports extracted ZIP runs.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=new URL(process.argv[2]||'http://127.0.0.1:5113');
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Use a loopback lab URL.');
(async()=>{
 const browser=await pw.chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(12000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base.href);
  assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200);
  await page.locator('#retrieve:not([disabled])').waitFor();
  assert.match(await page.locator('#retrieval-ready').innerText(),/Ready/);
  const ready=async()=>{await page.locator('#retrieve:not([disabled])').waitFor();};
  const read=async()=>{await ready();await page.locator('#retrieve').click();await page.waitForFunction(()=>document.querySelector('#retrieval-result').textContent!=='No current result.');};
  const clear=async()=>page.waitForFunction(()=>document.querySelector('#retrieval-result').textContent==='No current result.');
  const edit=async(id,value)=>{await page.locator(id).fill(value);await clear();};
  await page.locator('#compare-rankings').click();
  await page.waitForFunction(()=>document.querySelector('#retrieval-evaluation').textContent.includes('baseline'));
  assert.match(await page.locator('#retrieval-evaluation').innerText(),/baseline[\s\S]*0\.50[\s\S]*tuned[\s\S]*1\.00/);
  await edit('#retrieval-target','A-101');await read();
  assert.match(await page.locator('#retrieval-result').innerText(),/A-101[\s\S]*ten minutes/);
  await page.locator('#retrieve').click();await page.waitForFunction(()=>document.querySelector('#retrieval-status').textContent.includes('Cache hit'));
  assert.match(await page.locator('#retrieval-trace').innerText(),/scope-rechecked[\s\S]*cache-hit/);
  await edit('#retrieval-target','B-201');await read();const denied=await page.locator('#retrieval-result').innerText();
  assert.equal(denied,'Document unavailable.');assert.doesNotMatch(await page.locator('#retrieval-trace').innerText(),/B-201|private procedure|password reset/);
  await edit('#retrieval-target','A-104');await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  await edit('#retrieval-target','A-999');await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  await edit('#retrieval-target','A-101');await page.locator('#retrieval-identity').selectOption('teamB');await clear();await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  await page.locator('#retrieval-identity').selectOption('teamA');await clear();
  await edit('#retrieval-query','injection');await edit('#retrieval-target','A-103');await read();
  assert.match(await page.locator('#retrieval-result').innerText(),/Ignore previous[\s\S]*<script>/);
  assert.equal(await page.locator('#retrieval-result script').count(),0);
  assert.doesNotMatch(await page.locator('#retrieval-trace').innerText(),/Ignore previous|<script>|B-201/);
  await edit('#retrieval-query','password reset');await edit('#retrieval-target','B-201');await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  await edit('#retrieval-target','');await page.locator('#retrieval-ranking').selectOption('baseline');await clear();await read();assert.match(await page.locator('#retrieval-result').innerText(),/^A-102/);
  await page.locator('#retrieval-ranking').selectOption('tuned');await clear();await read();assert.match(await page.locator('#retrieval-result').innerText(),/^A-101/);
  await edit('#retrieval-target','A-101');await read();
  await page.locator('#edit-source').click();await clear();await page.waitForFunction(()=>document.querySelector('#source-version').textContent.includes('2'));
  await read();assert.match(await page.locator('#retrieval-result').innerText(),/ten minutes/);
  await page.locator('#publish-index').click();await clear();await page.waitForFunction(()=>document.querySelector('#index-revision').textContent.includes('2'));
  await read();assert.match(await page.locator('#retrieval-result').innerText(),/version 2[\s\S]*five minutes/);
  await page.locator('#delete-source').click();await clear();await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  await page.locator('#publish-index').click();await clear();await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  await page.reload();await ready();await edit('#retrieval-target','A-101');await read();
  await page.locator('#revoke-access').click();await clear();await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  // Editing a request cannot redisplay the old authorized response after revocation.
  await edit('#retrieval-query','password reset updated');assert.equal(await page.locator('#retrieval-result').innerText(),'No current result.');
  await edit('#retrieval-query','password reset');await read();assert.equal(await page.locator('#retrieval-result').innerText(),denied);
  await page.reload();await ready();await read();
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow at ${width}px`);
  }
  const screenshots=path.resolve(__dirname,'../labs/supportdesk-retrieval-quality/bin/verification');fs.mkdirSync(screenshots,{recursive:true});
  await page.screenshot({path:path.join(screenshots,'desktop.png'),fullPage:true});
  await page.setViewportSize({width:320,height:900});await page.screenshot({path:path.join(screenshots,'mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS: interactive readiness, evaluation, baseline/tuned, scope before top-k, cache replay/revocation, cleared edited responses, update/delete publication, plain-text injection, safe traces, 320/390/768/1440px.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
