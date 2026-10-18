// Developer-owned browser only; never touches the learner's browser/progress.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4173/';
// Hand-checked unit/project/archive pairs, independent of production metadata.
const projects=[
 ['foundations','#lab','supportdesk-rules','SupportDesk rules baseline'],
 ['first-mlnet-model','#lab/mlnet-classifier','supportdesk-classifier','A measured message classifier'],
 ['language-models','#lab/draft-replies','supportdesk-draft-replies','A Blazor draft reply with free sample mode'],
 ['reliable-outputs','#lab/ticket-summary','supportdesk-ticket-summary','A validated ticket summary in Blazor'],
 ['tools-actions','#lab/ticket-lookup','supportdesk-ticket-lookup','A reviewed read-only ticket-lookup tool'],
 ['semantic-search','#lab/semantic-search','supportdesk-semantic-search','A local help-article search'],
 ['document-answers','#lab/grounded-answers','supportdesk-grounded-answers','An extractive answer with citations'],
 ['production-retrieval','#lab/retrieval-quality','supportdesk-retrieval-quality','A measured, permission-aware retrieval service'],
 ['agents-workflows','#lab/bounded-workflow','supportdesk-bounded-workflow','A bounded support-triage workflow'],
 ['model-choices','#lab/attachment-review','supportdesk-attachment-review','A reviewed attachment-processing feature'],
 ['azure-operations','#lab/operations-capstone','supportdesk-operations-capstone','An observable SupportDesk capstone']
];
async function downloadBytes(page,link){
 const [download]=await Promise.all([page.waitForEvent('download'),link.click()]);
 const stream=await download.createReadStream(),chunks=[];
 for await(const chunk of stream)chunks.push(chunk);
 return {name:download.suggestedFilename(),bytes:Buffer.concat(chunks)};
}
(async()=>{
 fs.mkdirSync(path.join(root,'.artifacts'),{recursive:true});
 const browser=await pw.chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.setDefaultTimeout(7000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let serial=0;
  const go=async hash=>{await page.goto(base+'?milestones='+(serial++)+hash);await page.locator('main h1').waitFor();};
  if(!process.argv.includes('--rules-only')){
   await go('#map');
   for(const [unit,route,folder,title]of projects){
    const stage=page.locator('#unit-'+unit),open=stage.locator('.milestone').getByRole('link',{name:title,exact:true});
    assert.equal(await open.count(),1,unit+': milestone name must be the project link');
    assert.equal(await stage.locator('.milestone a').count(),1,unit+': one milestone reference, not separate actions');
    assert.equal(await stage.locator('.milestone .button, .milestone [download]').count(),0,unit+': read the project before downloading');
    assert.equal(await open.getAttribute('href'),route,unit+': wrong project');
    await open.click();await page.waitForURL(url=>url.hash===route);
    await page.locator('main .lab-layout').waitFor();
    const labZip=page.locator('main a[download]').filter({hasText:/Download complete/}).first();
    assert.equal(await labZip.getAttribute('download'),folder+'.zip',unit+': project page ZIP differs');
    const actual=await downloadBytes(page,labZip);
    assert.equal(actual.name,folder+'.zip');
    assert.deepEqual(actual.bytes,fs.readFileSync(path.join(root,'downloads',folder+'.zip')));
    await go('#map');
   }
   assert.equal(await page.locator('main a[download]').count(),0,'course map must not offer direct downloads');
   console.log('PASS: all 11 milestone names link to their project; matching ZIP downloads remain on project pages only');
   await page.getByRole('searchbox').fill('vectors');
   assert.deepEqual(await page.locator('.stage').evaluateAll(nodes=>nodes.map(n=>n.id)),['unit-tools-actions','unit-semantic-search']);
   assert.equal(await page.locator('#unit-tools-actions .milestone a').getAttribute('href'),'#lab/ticket-lookup');
   assert.equal(await page.locator('#unit-semantic-search .milestone a').getAttribute('href'),'#lab/semantic-search');
   await page.getByRole('searchbox').fill('no-such-topic-xyz');
   assert.equal(await page.locator('.milestone a').count(),0);
   await page.getByRole('searchbox').fill('');
   assert.equal(await page.locator('.stage').count(),11);
   await page.setViewportSize({width:320,height:900});
   await page.getByRole('searchbox').focus();
   const firstOpen=page.locator('#unit-foundations .milestone a');
   for(let tabs=0;tabs<12&&!await firstOpen.evaluate(el=>el===document.activeElement);tabs++)await page.keyboard.press('Tab');
   assert.equal(await firstOpen.evaluate(el=>el===document.activeElement),true,'Tab must reach the milestone reference from the lesson links');
   await page.keyboard.press('Shift+Tab');
   assert.equal(await page.locator('#unit-foundations .stage-topics a').last().evaluate(el=>el===document.activeElement),true,'reverse Tab reaches the final lesson');
   await page.keyboard.press('Tab');
   assert.equal(await firstOpen.evaluate(el=>el===document.activeElement),true,'forward Tab returns to the milestone');
   await page.keyboard.press('Enter');await page.locator('main .lab-layout').waitFor();
   assert.equal(new URL(page.url()).hash,'#lab','Enter must open the project');
   await page.getByRole('link',{name:/Download complete rules lab/}).focus();
   const [keyboardDownload]=await Promise.all([page.waitForEvent('download'),page.keyboard.press('Enter')]);
   assert.equal(keyboardDownload.suggestedFilename(),'supportdesk-rules.zip','Enter must download the ZIP');
   assert.equal(new URL(page.url()).hash,'#lab','ZIP must not navigate away from the project');
   console.log('PASS: keyboard traversal opens the milestone project; Enter downloads from its project page');
   await go('#map');
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'map overflow at '+width);
    for(const stage of await page.locator('.stage').all()){
     for(const link of await stage.locator('.milestone a').all()){
      await link.scrollIntoViewIfNeeded();await link.focus();
      assert.equal(await link.evaluate(el=>el===document.activeElement),true);
      const rects=await link.evaluate(el=>[...el.getClientRects()].map(r=>({x:r.x,right:r.right,width:r.width,height:r.height})));
      assert.ok(rects.length&&rects.every(r=>r.width>0&&r.height>0&&r.x>=0&&r.right<=width),'offscreen milestone reference');
     }
    }
   }
   await page.setViewportSize({width:320,height:900});
   await page.addStyleTag({content:'.milestone{font-size:24px}'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'resized text causes overflow');
   console.log('PASS: map search, keyboard focus, wrapping inline references and responsive widths 320–1440');
  }
  await go('#lab');
  const rulesZip=page.getByRole('link',{name:/Download complete rules lab/});
  assert.equal(await rulesZip.count(),1,'rules project page needs a complete ZIP download');
  const rules=await downloadBytes(page,rulesZip);
  assert.equal(rules.name,'supportdesk-rules.zip');
  assert.deepEqual(rules.bytes,fs.readFileSync(path.join(root,'downloads/supportdesk-rules.zip')));
  assert.equal(await page.locator('.file-links a[download]').count(),3,'keep individual files available');
  console.log('PASS: Unit 1 offers a complete ZIP alongside all 3 individual files');
  if(!process.argv.includes('--rules-only')){
   const isolated=fs.mkdtempSync(path.join(root,'.artifacts/milestone-portable-'));
   fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
   const portable=await browser.newPage({viewport:{width:390,height:844}});
   portable.on('pageerror',e=>errors.push(e.message));
   const portableUrl=pathToFileURL(path.join(isolated,'standalone.html')).href;
   for(const [unit,route,folder,title]of projects){
    await portable.goto(portableUrl+'?milestones='+(serial++)+'#map');
    await portable.locator('.stage').first().waitFor();
    const stage=portable.locator('#unit-'+unit);
    assert.equal(await stage.locator('.milestone .button, .milestone [download]').count(),0);
    await stage.locator('.milestone').getByRole('link',{name:title,exact:true}).click();
    await portable.waitForURL(url=>url.hash===route);await portable.locator('main .lab-layout').waitFor();
    const zip=portable.locator('main a[download]').filter({hasText:/Download complete/}).first();
    assert.match(await zip.getAttribute('href'),/^data:application\/zip/,'archive must be embedded');
    const actual=await downloadBytes(portable,zip);
    assert.equal(actual.name,folder+'.zip');
    assert.deepEqual(actual.bytes,fs.readFileSync(path.join(root,'downloads',folder+'.zip')));
   }
   console.log('PASS: isolated file:// standalone opens all 11 milestone projects and downloads their embedded ZIPs');
   await page.setViewportSize({width:390,height:844});await go('#map');
   await page.locator('#unit-foundations .milestone').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(root,'.artifacts/milestone-mobile.png')});
   await page.setViewportSize({width:1440,height:1000});await go('#map');
   await page.screenshot({path:path.join(root,'.artifacts/milestone-desktop.png')});
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
