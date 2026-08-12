#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
const cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V12 build output missing');
const bundle=await readFile(bundlePath,'utf8');
const css=await readFile(cssPath,'utf8');
const marker='/* Riftbound Mythical Recipes + Early Curve V12 */';
assert.ok(bundle.includes(marker),'V12 runtime marker missing');
assert.ok(css.includes(marker),'V12 CSS marker missing');
for(const needle of ['v12-recipe-flow','1 · REQUIRE','2 · COMBINE','3 · RESULT','CLICK A COMPONENT TO SEE ITS RECIPE'])assert.ok(bundle.includes(needle),`simplified recipe UI missing ${needle}`);
assert.ok(bundle.includes('e.floor>=10&&t.id===`hunt`'),'early Hunt Elite gate missing');
assert.ok(bundle.includes('OATHBOUND LAW // Early ascent trial'),'early Trial softening missing');
assert.ok(bundle.includes('Dormant cataclysm fault'),'early Ruin softening missing');
assert.ok(bundle.includes('if(e===10)return`wamuu`'),'Wamuu Floor 10 boss hook changed or missing');

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1,'export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v12-test.js');
const pkg=resolve(dirname(bundlePath),'package.json');
const hadPkg=existsSync(pkg);
try{
  if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
  const hook='globalThis.__RIFT_V12_TEST__={RIFT_ITEM_CATALOG,RIFT_ITEM,RIFT_RECIPE_PLAN,RIFT_RECIPE_VIEW,RIFT_ITEM_INSTANCE,RIFT_NORMALIZE_FIGHTER_BUILD,ri,wi,ua,Xi,RIFT_V12_BASE_ENEMY_FACTORY};';
  await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
  const api=globalThis.__RIFT_V12_TEST__;
  assert.ok(api,'V12 test API missing');

  const mythics=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical');
  const fresh=mythics.filter(item=>item.id!=='sparda-devil-sword');
  assert.equal(mythics.length,25,'Mythical count changed');
  assert.equal(fresh.length,24,'new Mythical count changed');
  for(const item of mythics){
    assert.ok(Array.isArray(item.recipe)&&item.recipe.length>=2,`${item.id} needs a real recipe tree`);
    for(const id of item.recipe)assert.ok(api.RIFT_ITEM(id),`${item.id} recipe references missing component ${id}`);
  }

  const visit=(id,path=[])=>{
    assert.ok(!path.includes(id),`recipe cycle: ${[...path,id].join(' -> ')}`);
    const item=api.RIFT_ITEM(id);assert.ok(item,`missing recipe item ${id}`);
    for(const child of item.recipe||[])visit(child,[...path,id]);
  };
  mythics.forEach(item=>visit(item.id));
  const blank=api.ri(1,false,null);api.RIFT_NORMALIZE_FIGHTER_BUILD(blank);blank.inventory=Array(6).fill(null);
  for(const item of fresh){
    const plan=api.RIFT_RECIPE_PLAN(blank,item.id);
    assert.ok(plan.ok,`${item.id} recipe cannot resolve from scratch: ${plan.reason||'unknown'}`);
    assert.ok(plan.cost>=2000&&plan.cost<=2500,`${item.id} full recipe cost ${plan.cost} is outside the V12 Mythical economy`);
  }
  assert.ok(api.RIFT_RECIPE_PLAN(blank,'sparda-devil-sword').ok,'Sparda existing recipe no longer resolves');

  assert.ok(String(api.RIFT_RECIPE_VIEW).includes('v12-recipe-flow'),'V12 simplified recipe renderer is not active');
  assert.ok(!String(api.RIFT_RECIPE_VIEW).includes('RIFT_RECIPE_NODE'),'active recipe renderer still recursively expands the full dependency tree');

  for(let floor=1;floor<=9;floor++){
    const formation=api.wi(floor,floor===5,false);
    assert.equal(formation.mode,'duel',`Floor ${floor} must stay a simple onboarding duel`);
    assert.equal(formation.extraOpponents,0,`Floor ${floor} unexpectedly adds opponents`);
  }
  assert.notEqual(api.wi(11,false,false).label,'1 VS 1 · ASCENT DUEL','post-Wamuu formation curve did not return to normal');
  assert.equal(api.ua({floor:5,boss:true},false),false,'early boss can still be replaced by a random Devil');
  assert.equal(api.Xi({boss:false,nemeses:[]},5),null,'Nemesis can still return before Wamuu');

  const seeded=(seed)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const oldRandom=Math.random;
  try{
    for(const floor of [1,3,5,7,9]){
      Math.random=seeded(0xC0FFEE+floor);const base=api.RIFT_V12_BASE_ENEMY_FACTORY(floor,floor===5,null,[]);
      Math.random=seeded(0xC0FFEE+floor);const soft=api.ri(floor,floor===5,null,[]);
      assert.equal(soft.statuses.v12EarlyCurve,1,`Floor ${floor} enemy missing onboarding marker`);
      assert.ok(soft.maxHp<base.maxHp,`Floor ${floor} HP was not softened`);
      assert.ok(soft.maxEnergy<=base.maxEnergy,`Floor ${floor} Energy was not softened`);
      if(floor<=7)assert.ok(soft.tiers.as<=base.tiers.as&&soft.tiers.ap<=base.tiers.ap&&soft.tiers.combatSkill<=base.tiers.combatSkill,`Floor ${floor} combat tiers were not softened`);
    }
    Math.random=seeded(0xBEEF);const floor10=api.ri(10,false,null,[]);
    assert.ok(!floor10.statuses.v12EarlyCurve,'Floor 10 normal factory was accidentally put in the onboarding nerf band');
  }finally{Math.random=oldRandom}

  console.log(`V12 verified: all ${mythics.length} Mythicals have acyclic recipes, the recipe UI is one-layer drill-down, Floors 1-9 are softened duels, and Wamuu's Floor 10 hook is unchanged.`);
}finally{
  delete globalThis.__RIFT_V12_TEST__;
  await rm(instrumented,{force:true});
  if(!hadPkg)await rm(pkg,{force:true});
}
