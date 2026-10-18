const assert=require('node:assert/strict');
const path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{
  const browser=await pw.chromium.launch();
  try{
    const page=await browser.newPage({viewport:{width:320,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setContent('<main style="max-width:100%;font-family:Segoe UI,sans-serif"><div id="exercise"></div></main>');
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/workflow-experiments.js')});
    const scenarios=[
      ['workflow-route','fixed','Workflow'],['workflow-route','open','Model-directed agent candidate'],
      ['workflow-state','resume','AwaitingApproval'],['workflow-state','reload','Checkpoint lost'],
      ['workflow-budget','loop','BudgetExceeded'],['workflow-budget','cancel','Cancelled'],['workflow-budget','normal','AwaitingApproval'],
      ['workflow-framework','graph','Executors and edges'],['workflow-framework','approval','Application policy'],['workflow-framework','memory','Session context'],
      ['workflow-mcp','lookup_help','Definition only'],['workflow-mcp','help://billing','Resource'],['workflow-mcp','triage_prompt','Prompt'],['workflow-mcp','send_email','Denied'],
      ['workflow-recovery','failed','Retry eligible'],['workflow-recovery','unknown','Unknown'],['workflow-recovery','replay','Complete (replay)'],['workflow-recovery','changed','Approval invalidated']
    ];
    for(const [type,choice,want] of scenarios){
      await page.evaluate(t=>window.AcademyWorkflowExperiments.mount(document.querySelector('#exercise'),t),type);
      await page.locator('[data-workflow-choice]').selectOption(choice);await page.locator('[data-workflow-action="run"]').click();
      const result=JSON.parse(await page.locator('[data-workflow-output]').innerText());assert.equal(result.outcome,want,`${type}/${choice}`);
      assert.equal(await page.locator('[data-workflow-output]').getAttribute('aria-live'),'polite');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${type} at 320px`);
      assert.equal(await page.locator('[data-workflow-action="run"]').evaluate(n=>n.getBoundingClientRect().height>=44),true);
    }
    await page.evaluate(()=>window.AcademyWorkflowExperiments.mount(document.querySelector('#exercise'),'workflow-budget'));
    await page.locator('[data-workflow-budget]').fill('2');await page.locator('[data-workflow-action="run"]').click();assert.equal(JSON.parse(await page.locator('[data-workflow-output]').innerText()).outcome,'BudgetExceeded');
    await page.locator('[data-workflow-budget]').fill('1.5');await page.locator('[data-workflow-action="run"]').click();assert.equal(JSON.parse(await page.locator('[data-workflow-output]').innerText()).outcome,'Denied');
    await page.evaluate(()=>{window.disposeWorkflow=window.AcademyWorkflowExperiments.mount(document.querySelector('#exercise'),'workflow-route');window.disposeWorkflow();});assert.equal(await page.locator('[data-workflow-action="run"]').isDisabled(),true);
    // Render the actual download page with the same host callback contract.
    await page.addScriptTag({path:path.resolve(__dirname,'../assets/workflow-files.js')});await page.addScriptTag({path:path.resolve(__dirname,'../assets/workflow-lab.js')});
    await page.evaluate(()=>{
      window.completionEvents=[];window.AcademyLabDownloads={'downloads/supportdesk-bounded-workflow.zip':'blob:test-workflow-zip'};
      window.AcademyWorkflowLab.render({main:document.querySelector('main'),codeBlock:(code)=>{const pre=document.createElement('pre');pre.textContent=code;return pre.outerHTML;},icon:()=>'',warning:()=>'',breadcrumb:()=>'',bottom:()=>'',state:{labs:{'bounded-workflow':false}},onComplete:v=>window.completionEvents.push(v)});
    });
    assert.equal(await page.getByRole('link',{name:'Download complete workflow lab (.zip)',exact:true}).getAttribute('href'),'blob:test-workflow-zip');
    assert.equal(await page.locator('#complete-workflow-lab').isChecked(),false);await page.locator('#complete-workflow-lab').check();await page.locator('#complete-workflow-lab').uncheck();assert.deepEqual(await page.evaluate(()=>window.completionEvents),[true,false]);
    assert.deepEqual(errors,[]);console.log('PASS workflow exercises: 18 fixture outcomes, low/invalid budgets, remount cleanup, 320px, aria-live, 44px controls, exact ZIP override, explicit completion callbacks.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
