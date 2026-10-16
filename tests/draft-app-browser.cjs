// Real Blazor circuit test. Run the sample-mode lab on localhost:5103 first.
const assert=require('node:assert/strict');
const path=require('node:path');
const base=new URL(process.argv[2]||'http://localhost:5103');
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Only test a local lab server');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{
  const browser=await pw.chromium.launch();
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base.href);
  assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200,'The host must serve the Blazor framework script, not only prerendered HTML');
  await page.locator('#generate-draft').waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('#generate-draft').disabled);
  assert.match(await page.locator('#provider-mode').innerText(),/Free sample.*Simulated/,'Never run generation checks against a paid provider');
  await page.locator('#ticket').fill('My fictional password-reset link expired.');
  await page.locator('#generate-draft').click();
  await page.waitForFunction(()=>document.querySelector('#draft-output').textContent.trim().length>0);
  assert.equal(await page.locator('#staff-review').isEnabled(),false,'Partial text must not be reviewable');
  await page.locator('#stop-draft').click();
  await page.waitForFunction(()=>/stopped|cancel|incomplete/i.test(document.querySelector('#draft-status').textContent));
  const partial=await page.locator('#draft-output').innerText();
  assert.equal(await page.locator('#staff-review').isEnabled(),false);
  await page.locator('#generate-draft').click();
  await page.waitForFunction(()=>!document.querySelector('#staff-review').disabled);
  assert.ok((await page.locator('#draft-output').innerText()).length>partial.length,'A restarted stream should finish');
  await page.locator('#staff-review').check();
  assert.equal(await page.locator('#staff-review').isChecked(),true);
  await page.screenshot({path:path.resolve('.artifacts/desktop-blazor-app.png'),fullPage:true});
  await page.locator('#ticket').fill('<img src=x onerror="window.injected=true"> A fictional issue.');
  await page.locator('#ticket').press('Tab');
  await page.waitForFunction(()=>!document.querySelector('#staff-review').checked);
  assert.equal(await page.locator('#staff-review').isChecked(),false,'Changing message invalidates previous review');
  assert.equal(await page.locator('#draft-output img').count(),0);
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${width}`);
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.resolve('.artifacts/mobile-blazor-app.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('PASS: actual Blazor sample chunks, Stop/incomplete review gate, restart/completion, review invalidation, four responsive widths');
})().catch(e=>{console.error(e);process.exit(1);});
