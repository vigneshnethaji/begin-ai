// Tests actual Blazor events against a caller-supplied local lab URL. No server is spawned here.
const assert=require('node:assert/strict');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const base=new URL(process.argv[2]||'http://localhost:5115');
assert.ok(['localhost','127.0.0.1','[::1]'].includes(base.hostname),'Local lab URL required');
(async()=>{
  const browser=await pw.chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(12000);
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base.href);assert.equal((await page.request.get(new URL('/_framework/blazor.web.js',base).href)).status(),200);
    await page.waitForFunction(()=>document.querySelector('#workflow-ready')?.textContent==='Interactive ready');
    const state=async want=>{await page.waitForFunction(x=>document.querySelector('#workflow-phase')?.textContent===x,want);};
    const effects=async()=>Number(await page.locator('#workflow-effects').innerText());
    const run=async()=>{await page.locator('#run-workflow').click();await state('AwaitingApproval');};
    const approve=async()=>{await page.locator('#approve-workflow').click();await page.waitForFunction(()=>!document.querySelector('#preview-workflow').disabled);};
    const fresh=async(scenario,text='Fictional billing invoice '+scenario)=>{
      await page.locator('#workflow-request').fill(text);
      await page.locator('#workflow-scenario').selectOption(scenario);
      await state('Idle');
    };
    await run();assert.equal(await effects(),0);assert.equal(await page.locator('#workflow-steps').innerText(),'3');
    await approve();assert.equal(await effects(),0);await page.locator('#preview-workflow').click();await state('Complete');assert.equal(await effects(),1);
    await page.locator('#replay-workflow').click();assert.equal(await effects(),1);
    await fresh('normal','Fictional billing deny');await run();await page.locator('#deny-workflow').click();await state('Denied');assert.equal(await effects(),1);
    await fresh('normal','Fictional billing approval edit');await run();await approve();await page.locator('#workflow-request').fill('Fictional login edit');await state('Idle');
    assert.equal(await page.locator('#preview-workflow').isDisabled(),true);assert.equal(await page.locator('#workflow-draft').innerText(),'No draft.');
    await fresh('normal','Please help');await page.locator('#run-workflow').click();await state('NeedsInformation');assert.equal(await page.locator('#workflow-calls').innerText(),'0');
    await fresh('loop');await page.locator('#workflow-max-steps').fill('3');await page.locator('#run-workflow').click();await state('BudgetExceeded');assert.equal(await page.locator('#workflow-steps').innerText(),'3');assert.equal(await page.locator('#workflow-calls').innerText(),'0');
    await fresh('normal','Fictional billing three step');await run();await approve();await page.locator('#preview-workflow').click();await state('BudgetExceeded');assert.equal(await effects(),1);
    await fresh('slow');await page.locator('#workflow-max-steps').fill('5');await page.locator('#run-workflow').click();await page.locator('#cancel-workflow').click();await state('Cancelled');assert.equal(await effects(),1);
    await fresh('slow','Fictional billing timeout');await page.locator('#workflow-timeout').fill('60');await page.locator('#run-workflow').click();await state('BudgetExceeded');
    await fresh('unknown-capability');await page.locator('#workflow-timeout').fill('10000');await page.locator('#run-workflow').click();await state('Denied');assert.equal(await effects(),1);
    await fresh('failed');await run();await approve();await page.locator('#preview-workflow').click();await state('Failed');assert.equal(await effects(),1);
    await page.locator('#recover-workflow').click();await state('AwaitingApproval');assert.equal(await page.locator('#preview-workflow').isDisabled(),true);await approve();await page.locator('#preview-workflow').click();await state('Complete');assert.equal(await effects(),2);
    await fresh('unknown');await run();await approve();await page.locator('#preview-workflow').click();await state('Unknown');assert.equal(await effects(),3);
    await page.locator('#recover-workflow').click();await state('Unknown');await page.locator('#replay-workflow').click();await state('Unknown');assert.equal(await effects(),3);
    await page.locator('#reconcile-workflow').click();await state('Complete');assert.equal(await effects(),3);
    await page.locator('#workflow-capability').selectOption('send_email');await page.locator('#inspect-workflow').click();await page.waitForFunction(()=>document.querySelector('#workflow-inspector').textContent.includes('Denied'));
    for(const width of [320,768,1440]){
      await page.setViewportSize({width,height:1000});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`No horizontal overflow at ${width}`);
    }
    assert.deepEqual(errors,[]);console.log('PASS workflow app: readiness, approval/denial/edit, missing info, budgets, cancel, capability denial, Failed recovery, Unknown reconciliation, replay and 320/768/1440 layout.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
