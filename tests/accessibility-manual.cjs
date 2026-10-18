// Targeted engineering checks for axe's incomplete pseudo-element/dialog results.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const root=path.resolve(__dirname,'..'),base='http://127.0.0.1:4173/';
function luminance(rgb){const c=rgb.map(n=>n/255).map(n=>n<=0.04045?n/12.92:((n+0.055)/1.055)**2.4);return c[0]*0.2126+c[1]*0.7152+c[2]*0.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
assert.equal(contrast([255,255,255],[0,0,0]),21);
(async()=>{const browser=await pw.chromium.launch();const evidence=[];try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 for(const section of ['understand','example','try','check','dotnet']){
  await page.goto(base+'?contrast='+section+'#lesson/ai-features/'+section);
  const colors=await page.locator('.section-tab-number,.section-tabs > a').evaluateAll(nodes=>nodes.map(n=>{
   const s=getComputedStyle(n);let el=n,bg=s.backgroundColor;
   while(bg==='rgba(0, 0, 0, 0)'&&el.parentElement){el=el.parentElement;bg=getComputedStyle(el).backgroundColor;}
   const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
   return {kind:n.classList.contains('section-tab-number')?'numeral':'tab label',text:n.textContent,foreground:rgb(s.color),background:rgb(bg)};
  }));
  for(const c of colors){const ratio=contrast(c.foreground,c.background);assert.ok(ratio>=4.5,section+' '+c.text+' contrast '+ratio);evidence.push({section,...c,ratio});}
 }
 await page.getByRole('group',{name:'Application flow · conceptual example',exact:true}).waitFor();
 assert.equal(await page.locator('#open-course').getAttribute('aria-controls'),'course-drawer');assert.equal(await page.locator('#course-drawer').count(),1);assert.equal(await page.locator('#course-drawer').evaluate(n=>n.open),false);
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open course navigation',exact:true}).click();
 for(let i=0;i<20;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('#course-drawer').contains(document.activeElement)),'focus escaped modal');}
 const footnote=page.locator('#mobile-navigation .side-footnote');await footnote.scrollIntoViewIfNeeded();
 const footColors=await footnote.evaluate(n=>{const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);let el=n,bg=getComputedStyle(n).backgroundColor;while(bg==='rgba(0, 0, 0, 0)'&&el.parentElement){el=el.parentElement;bg=getComputedStyle(el).backgroundColor;}return {foreground:rgb(getComputedStyle(n).color),background:rgb(bg)};});
 const footRatio=contrast(footColors.foreground,footColors.background);assert.ok(footRatio>=4.5);evidence.push({kind:'drawer footnote',...footColors,ratio:footRatio});
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#course-drawer').open);
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.getItem=function(){throw new Error('Blocked storage fixture');};Storage.prototype.setItem=function(){throw new Error('Blocked storage fixture');};});
 const unavailable=await blocked.newPage();await unavailable.goto(base+'#home');assert.ok(await unavailable.locator('#storage-warning').isVisible());await unavailable.getByRole('link',{name:'Start the foundation lessons',exact:true}).click();await unavailable.waitForURL('**/#lesson/ai-features/understand');await blocked.close();
 const isolated=path.join(root,'.artifacts/polished-standalone');fs.mkdirSync(isolated,{recursive:true});fs.copyFileSync(path.join(root,'standalone.html'),path.join(isolated,'standalone.html'));
 const file=await browser.newPage();await file.goto(require('node:url').pathToFileURL(path.join(isolated,'standalone.html')).href+'#lab/bounded-workflow');
 await file.getByRole('link',{name:'Continue to Unit 10: inputs and model choices',exact:true}).click();await file.getByRole('heading',{level:1,name:/^Images:/}).waitFor();
 fs.writeFileSync(path.join(root,'.artifacts/accessibility-engineering.json'),JSON.stringify({passed:true,contrastChecks:evidence,minimum:Math.min(...evidence.map(x=>x.ratio)),checks:['named code groups','closed dialog relationship','reduced motion','modal keyboard containment','blocked storage warning and learning','isolated standalone Unit9-to10']},null,2));
 console.log('PASS engineering accessibility: '+evidence.length+' computed numeral/label/footnote contrasts (minimum '+Math.min(...evidence.map(x=>x.ratio)).toFixed(2)+':1), named code groups, closed dialog, modal containment, reduced motion, blocked storage and isolated standalone handoff.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
