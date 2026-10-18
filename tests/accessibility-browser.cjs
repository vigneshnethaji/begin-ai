// Developer-only Chromium profiles. axe never ships in the offline website.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
let axe;try{axe=require.resolve('axe-core/axe.min.js');}catch{axe=path.resolve(__dirname,'../.artifacts/a11y-tools/node_modules/axe-core/axe.min.js');}
assert.ok(fs.existsSync(axe),'Install developer tooling: npm install --prefix .artifacts/a11y-tools --no-save --no-package-lock --ignore-scripts axe-core@4.14.0');
const C=require('../assets/curriculum.js'),sample=process.argv.includes('--sample');
const out=path.resolve(__dirname,'../.artifacts'),base='http://127.0.0.1:4173/';
const sections=['understand','example','try','check','dotnet'];
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await pw.chromium.launch();
 const scans=[],errors=[];let serial=0;
 const root=path.resolve(__dirname,'..');
 const fingerprint=()=>Object.fromEntries(['index.html','styles.css',...fs.readdirSync(path.join(root,'assets')).filter(f=>f.endsWith('.js')).map(f=>'assets/'+f)].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')]));
 const sourceHashes=fingerprint();
 try{
  const pages=await Promise.all(Array.from({length:3},()=>browser.newPage()));for(const page of pages)page.on('pageerror',e=>errors.push(e.message));
  async function scan(page,hash,width,state='default'){
   await page.setViewportSize({width,height:1000});await page.goto(base+'?a11y='+(serial++)+hash);await page.locator('main h1').waitFor();
   if(state==='drawer')await page.getByRole('button',{name:'Open course navigation',exact:true}).click();
   if(state==='wrong')await page.locator('[data-answer="0"]').click();
   if(state==='correct')await page.locator('[data-answer="1"]').click();
   if(state==='empty-search')await page.getByRole('searchbox').fill('no-such-topic-xyz');
   await page.addScriptTag({path:axe});
   const result=await page.evaluate(async()=>{
    const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});
    const compact=x=>({id:x.id,impact:x.impact,description:x.description,nodes:x.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))});
    // axe treats off-screen SPA hash routes in the modal as native skip links.
    // Preserve raw findings and disposition only known routes, tested for real
    // heading-focus navigation in beginner-journey.cjs. Never suppress main skip links.
    const spaRouteExceptions=[],violations=[];
    for(const v of r.violations){
     if(v.id!=='skip-link'||!document.querySelector('#course-drawer').open){violations.push(compact(v));continue;}
     const keep=[];
     for(const n of v.nodes){
      const link=document.querySelector(n.target[0]);const href=link?.getAttribute('href');
      const known=['#learn','#lab',...window.AcademyContent.stages.map(s=>'#map/'+s.id)];
      if(link?.closest('#mobile-navigation')&&known.includes(href))spaRouteExceptions.push({rule:v.id,href,target:n.target,reason:'JavaScript route, not a native skip link; target focus checked by keyboard journey.'});
      else keep.push(n);
     }
     if(keep.length)violations.push(compact({...v,nodes:keep}));
    }
    return {version:r.testEngine.version,rawViolationCount:r.violations.length,rawViolations:r.violations,violations,spaRouteExceptions,incomplete:r.incomplete};
   });
   scans.push({hash,width,state,...result});
   if(result.violations.length)console.log('FAIL',width,hash,state,result.violations.map(x=>x.id+':'+x.nodes.length).join(', '));
   if(scans.length%25===0)console.log('Scanned '+scans.length+' rendered states');
  }
  const lessons=sample?C.stages.map(s=>C.lessons.find(l=>l.unitId===s.id)):C.lessons;
  const routes=['#home','#map','#progress',...lessons.flatMap(l=>sections.map(s=>'#lesson/'+l.id+'/'+s)),...C.labs.map(l=>l.url)];
  const jobs=routes.map(hash=>[hash,1440]);
  for(const hash of ['#home','#map','#progress',...(sample?lessons:C.lessons).map(l=>'#lesson/'+l.id+'/try'),...C.labs.map(l=>l.url)])jobs.push([hash,320]);
  for(const hash of ['#home','#map','#lesson/ai-features/understand','#lab/operations-capstone','#progress'])jobs.push([hash,320,'drawer']);
  for(const state of ['wrong','correct'])jobs.push(['#lesson/ai-features/check',390,state]);
  jobs.push(['#map',390,'empty-search']);
  let cursor=0;await Promise.all(pages.map(async page=>{while(cursor<jobs.length){const job=jobs[cursor++];await scan(page,...job);}}));
  const violations=scans.reduce((n,r)=>n+r.violations.length,0);
  fs.writeFileSync(path.join(out,'accessibility-'+(sample?'sample':'full')+'.json'),JSON.stringify({scans:scans.length,violations,errors,sourceHashes,results:scans},null,2));
  assert.deepEqual(fingerprint(),sourceHashes,'Sources changed during audit; rerun against a stable version');
  assert.deepEqual(errors,[]);assert.equal(violations,0,'Accessibility violations; inspect .artifacts/accessibility-'+(sample?'sample':'full')+'.json');
  console.log('PASS axe '+scans[0].version+': '+scans.length+' rendered states; zero actionable configured A/AA and best-practice violations. Known SPA skip-link heuristic findings and incomplete checks are retained for manual review; not a conformance certification.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
