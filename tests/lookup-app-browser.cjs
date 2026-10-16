// Real local C# tool execution over fictional data; never a provider call.
const assert=require('node:assert/strict');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=new URL(process.argv[2]||'http://localhost:5107');
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Only test a local demo server');
(async()=>{
  const browser=await pw.chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base.href);
  assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200);
  await page.waitForFunction(()=>!document.querySelector('#validate-tool').disabled);
  assert.match(await page.locator('body').innerText(),/simulation|simulated|demo identity/i);
  const count=async()=>Number((await page.locator('#invocation-count').innerText()).match(/\d+/)?.[0]);
  const prepare=async()=>{
    await page.locator('#validate-tool').click();await page.waitForFunction(()=>!document.querySelector('#approve-tool').disabled);
    await page.locator('#approve-tool').click();await page.waitForFunction(()=>!document.querySelector('#execute-tool').disabled);
  };
  assert.equal(await count(),0);
  await prepare();assert.equal(await count(),0,'Proposal validation and approval must not execute');
  await page.locator('#execute-tool').click();
  await page.waitForFunction(()=>/DEMO-104/.test(document.querySelector('#lookup-result').textContent));
  assert.equal(await count(),1);
  await page.locator('#replay-tool').click();
  await page.waitForFunction(()=>/replay|cached/i.test(document.querySelector('#lookup-status').textContent));
  assert.equal(await count(),1,'Exact replay must not invoke again');
  await page.screenshot({path:path.resolve('.artifacts/desktop-lookup-app.png'),fullPage:true});
  await page.locator('#lookup-identity').selectOption('technical');
  await page.waitForFunction(()=>document.querySelector('#execute-tool').disabled);
  await page.locator('#validate-tool').click();
  await page.waitForFunction(()=>/denied|unavailable|not available|not authorized/i.test(document.querySelector('#lookup-status').textContent));
  assert.equal(await count(),1,'A denied identity must not invoke the tool');
  assert.equal(await page.locator('#approve-tool').isEnabled(),false);
  assert.doesNotMatch(await page.locator('#lookup-result').innerText(),/duplicate charge/i);
  await page.locator('#lookup-identity').selectOption('billing');
  await page.locator('#lookup-proposal').fill('{"tool":"issue_refund","arguments":{"ticketId":"DEMO-104"}}');
  await page.locator('#validate-tool').click();
  await page.waitForFunction(()=>/unknown|allow|unsupported|invalid|reject/i.test(document.querySelector('#lookup-status').textContent));
  assert.equal(await page.locator('#execute-tool').isEnabled(),false);assert.equal(await count(),1);
  await page.locator('#lookup-proposal').fill('{"tool":"lookup_ticket","arguments":{"ticketId":"DEMO-104"}}');
  await page.locator('#lookup-scenario').selectOption('transient');await prepare();await page.locator('#execute-tool').click();
  await page.waitForFunction(()=>/DEMO-104/.test(document.querySelector('#lookup-result').textContent));
  assert.match(await page.locator('#lookup-audit').innerText(),/Attempts: 2/,'Transient fixture must expose its bounded attempt count');
  await page.locator('#lookup-scenario').selectOption('unknown');await prepare();
  const before=await count();await page.locator('#execute-tool').click();
  await page.waitForFunction(()=>/unknown/i.test(document.querySelector('#lookup-status').textContent));
  assert.ok(await count()>before);
  const unknownCount=await count(),auditBefore=await page.locator('#lookup-audit').textContent();await page.locator('#replay-tool').click();
  await page.waitForFunction(before=>document.querySelector('#lookup-audit').textContent!==before,auditBefore);
  await page.waitForFunction(()=>/unknown/i.test(document.querySelector('#lookup-status').textContent));
  assert.equal(await count(),unknownCount,'Unknown delivery must not trigger another invocation');
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${width}`);
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.resolve('.artifacts/mobile-lookup-app.png'),fullPage:true});
  assert.deepEqual(errors,[]);await browser.close();
  console.log('PASS: actual lookup proposal/approval separation, scoped denial, allowlist, replay, bounded retry, unknown no-repeat, audit and responsive layout');
})().catch(e=>{console.error(e);process.exit(1);});
