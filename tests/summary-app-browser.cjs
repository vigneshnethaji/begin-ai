// Real Interactive Server circuit, using local authored samples only.
const assert=require('node:assert/strict');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=new URL(process.argv[2]||'http://localhost:5105');
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Only test a local sample server');
(async()=>{
  const browser=await pw.chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(8000);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base.href);
  assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200,'Framework script must be served');
  await page.waitForFunction(()=>!document.querySelector('#load-summary').disabled);
  assert.match(await page.locator('body').innerText(),/authored|simulated|sample/i);
  const load=async scenario=>{
    await page.locator('#summary-scenario').selectOption(scenario);
    await page.waitForFunction(()=>document.querySelector('#validate-summary').disabled);
    await page.locator('#load-summary').click();
    await page.waitForFunction(()=>!document.querySelector('#validate-summary').disabled&&document.querySelector('#summary-status').textContent.startsWith('Loaded authored sample'));
  };
  await load('valid');await page.locator('#validate-summary').click();
  await page.waitForFunction(()=>!document.querySelector('#review-summary').disabled);
  assert.match(await page.locator('#summary-result').innerText(),/Billing/);
  await page.locator('#review-summary').check();
  await page.screenshot({path:path.resolve('.artifacts/desktop-summary-app.png'),fullPage:true});
  const multibyte=JSON.stringify({title:'界'.repeat(12000),category:'Billing',facts:['A fictional issue.'],missingInformation:[]});
  await page.locator('#summary-json').fill(multibyte);
  await page.waitForFunction(()=>document.querySelector('#summary-status').textContent.includes('Response edited'));
  assert.equal(await page.locator('#review-summary').isEnabled(),false,'A large Unicode paste must clear the prior review without disconnecting');
  await page.locator('#validate-summary').click();
  await page.waitForFunction(()=>document.querySelector('#summary-errors').textContent.includes('title'));
  const invalids=['{"title":','{"title":"Hello"}',JSON.stringify({title:'Hello',category:'Other',facts:['Reported issue'],missingInformation:[]}),JSON.stringify({title:'Hello',category:'Billing',facts:null,missingInformation:[]})];
  for(const candidate of invalids){
    await page.locator('#summary-json').fill(candidate);await page.locator('#summary-json').press('Tab');
    await page.waitForFunction(()=>document.querySelector('#summary-status').textContent.includes('Response edited'));
    await page.waitForFunction(()=>document.querySelector('#review-summary').disabled&&!document.querySelector('#review-summary').checked);
    await page.locator('#validate-summary').click();
    await page.waitForFunction(()=>document.querySelector('#summary-errors').textContent.trim().length>0);
    assert.equal((await page.locator('#summary-result').innerText()).includes('Billing'),false,'Invalid candidate must not keep a stale DTO');
  }
  const html=JSON.stringify({title:'Fictional issue',category:'Billing',facts:['<img src=x onerror="alert(1)">'],missingInformation:[]});
  await page.locator('#summary-json').fill(html);await page.locator('#validate-summary').click();
  await page.waitForFunction(()=>!document.querySelector('#review-summary').disabled);
  assert.equal(await page.locator('#summary-result img').count(),0);
  assert.match(await page.locator('#summary-result').innerText(),/<img/,'Candidate strings must be rendered as text');
  for(const scenario of ['refused','incomplete','failed']){
    await load(scenario);
    await page.waitForFunction(()=>document.querySelector('#review-summary').disabled);
    if(await page.locator('#validate-summary').isEnabled())await page.locator('#validate-summary').click();
    await page.waitForFunction(state=>document.querySelector('#summary-errors').textContent.toLowerCase().includes(state),scenario);
    assert.equal(await page.locator('#review-summary').isEnabled(),false);
    assert.match(await page.locator('#summary-errors').innerText(),/Only completed responses/);
  }
  await load('unsupported-claim');await page.locator('#validate-summary').click();
  await page.waitForFunction(()=>!document.querySelector('#review-summary').disabled);
  assert.match(await page.locator('body').innerText(),/not.*truth|facts.*review|structur|factually/i);
  await page.locator('#compare-prompts').click();
  await page.waitForFunction(()=>document.querySelector('#comparison-result').textContent.trim().length>0);
  assert.match(await page.locator('#comparison-result').innerText(),/4/);
  for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`overflow ${width}`);
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.resolve('.artifacts/mobile-summary-app.png'),fullPage:true});
  assert.deepEqual(errors,[]);await browser.close();
  console.log('PASS: actual Blazor summary validation, stale-state reset, safe text, refusal/incomplete states, unsupported-claim boundary, comparison and four responsive widths');
})().catch(e=>{console.error(e);process.exit(1);});
