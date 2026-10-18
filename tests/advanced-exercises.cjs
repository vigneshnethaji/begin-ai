// Verify the published academy bindings, not just exported teaching algorithms.
const assert=require('node:assert/strict');
let pw;try{pw=require('playwright');}catch{pw=require('C:/Users/vignesh.murugan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
(async()=>{
 const browser=await pw.chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const go=async id=>{await page.goto(`http://127.0.0.1:4173/#lesson/${id}/try`);await page.locator('.experiment-body').waitFor();};
  const act=async(p,a)=>page.locator(`[data-${p}-action="${a}"]`).click();
  const out=p=>page.locator(`[data-${p}-output]`).innerText();
  await go('vector-arrays');await act('search','inspect');assert.match(await out('search'),/\[2,0,0,0\]/);
  await go('cosine-similarity');await page.locator('[data-search-direction]').selectOption('orthogonal');await act('search','calculate');assert.match(await out('search'),/Cosine = 0\.0000/);
  await go('embedding-meaning');await act('search','compare');assert.match(await out('search'),/Keyword: No match[\s\S]*Toy vector: Request a refund/);
  await go('embedding-storage');await page.locator('[data-search-space]').selectOption('toy-topics/v2/4');await act('search','check-space');assert.match(await out('search'),/space|compatible/i);assert.doesNotMatch(await out('search'),/Compatible: metadata/);
  await go('vector-indexes');await page.locator('[data-search-category]').selectOption('Account');await act('search','scan');assert.match(await out('search'),/Compared 2 eligible vectors[\s\S]*ART-201/);assert.doesNotMatch(await out('search'),/ART-101/);
  await go('hybrid-search');await act('search','search');assert.match(await out('search'),/No matches/);await page.locator('[data-search-mode]').selectOption('hybrid');await act('search','search');assert.match(await out('search'),/ART-101[\s\S]*cosine 1\.0000/);
  console.log('PASS: six integrated search exercises, exact arithmetic, toy semantics, compatibility, prefilter and hybrid bindings');
  await go('retrieval-first');await act('rag','retrieve');assert.match(await out('rag'),/kb-reset/);await act('rag','unsupported');assert.match(await out('rag'),/abstain|unsupported|no evidence/i);
  await go('document-chunks');await act('rag','chunk');assert.match(await out('rag'),/kb-demo@r1:c1/);assert.match(await out('rag'),/four five six seven/);
  await go('evidence-selection');await act('rag','pack');const packed=JSON.parse(await out('rag'));assert.deepEqual(packed.selected.map(x=>x.id),['a','c']);assert.equal(packed.used,5);
  await go('context-assembly');await act('rag','context');assert.match(await out('rag'),/evidenceData/);assert.equal(await page.locator('.experiment-body script').count(),0);
  await go('citations-support');await act('rag','check');assert.equal(JSON.parse(await out('rag')).status,'Quote not found');await act('rag','quote');assert.match(JSON.parse(await out('rag')).status,/Exact quote found/);
  await go('retrieval-tests');await act('rag','evaluate');assert.equal(JSON.parse(await out('rag')).recall,0.5);
  console.log('PASS: six integrated RAG exercises, evidence chunks/budgets, abstention, data separation and citation boundary');
  await go('retrieval-evaluation');await act('retrieval','evaluate');assert.match(await out('retrieval'),/Recall@2: 0\.50/);assert.match(await out('retrieval'),/RR@2: 0\.50/);
  await go('ranking-reranking');await act('retrieval','rank');assert.match(await out('retrieval'),/A-102/);await page.locator('[data-retrieval-ranking]').selectOption('tuned');await act('retrieval','rank');assert.match(await out('retrieval'),/A-101/);
  await go('index-freshness');await act('retrieval','read');assert.match(await out('retrieval'),/ten minutes/);await act('retrieval','update');await act('retrieval','read');assert.match(await out('retrieval'),/ten minutes/);await act('retrieval','publish');assert.match(await out('retrieval'),/five minutes/);await act('retrieval','delete');assert.doesNotMatch(await out('retrieval'),/five minutes/);
  await go('retrieval-permissions');await act('retrieval','retrieve');assert.match(await out('retrieval'),/A-101/);await act('retrieval','revoke');await act('retrieval','retrieve');assert.match(await out('retrieval'),/Document unavailable/);assert.doesNotMatch(await out('retrieval'),/ten minutes/);
  await go('document-injection');await act('retrieval','injection');assert.match(await out('retrieval'),/<script>/);assert.equal(await page.locator('.experiment-body script').count(),0);await act('retrieval','attack');assert.match(await out('retrieval'),/Document unavailable/);assert.doesNotMatch(await out('retrieval'),/private procedure/);
  await go('retrieval-tracing');await page.locator('[data-retrieval-scenario]').selectOption('cache');await act('retrieval','trace');const trace=JSON.parse(await out('retrieval'));assert.deepEqual(trace.stages,['scope-rechecked','cache-hit','return']);assert.equal(trace.query,undefined);
  console.log('PASS: six integrated retrieval exercises, metrics, ranking, publication/delete, revoked replay, literal injection and safe trace');
  for(const [id,choice,expected]of [
   ['workflow-or-agent','fixed','Workflow'],['workflow-state','reload','Checkpoint lost'],['workflow-budgets','loop','BudgetExceeded'],
   ['agent-framework','approval','Application policy'],['mcp-capabilities','send_email','Denied'],['workflow-recovery','unknown','Unknown']
  ]){await go(id);await page.locator('[data-workflow-choice]').selectOption(choice);await act('workflow','run');const result=JSON.parse(await out('workflow'));assert.equal(result.outcome,expected);if(id==='workflow-budgets')assert.equal(result.steps,3);if(id==='workflow-recovery')assert.equal(result.effects,1);}
  assert.deepEqual(errors,[]);console.log('PASS: six integrated workflow exercises, decision ownership, volatile state, hard budget, framework policy, MCP denial and Unknown');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
