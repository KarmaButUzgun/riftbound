#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V12 build output missing');
const bundle=await readFile(bundlePath,'utf8'),css=await readFile(cssPath,'utf8');
const marker='/* Riftbound Mythical Build Paths + Early Game V12 */';
assert.ok(bundle.includes(marker),'V12 runtime marker missing');assert.ok(css.includes(marker),'V12 CSS marker missing');
for(const needle of ['RIFT_V12_MYTHICAL_RECIPES','recipe-v12-flow','CLICK A COMPONENT TO SEE ITS OWN PATH','RIFT_V12_EARLY_PROFILE','v12EarlyTraining','RIFT_V12_ENEMY_ITEMS'])assert.ok(bundle.includes(needle),`V12 feature missing ${needle}`);
for(const needle of ['recipe-v12-components','recipe-v12-summary','recipe-v12-buy'])assert.ok(css.includes(needle),`V12 style missing ${needle}`);
const exportMarker='export{xs as default};';assert.equal(bundle.split(exportMarker).length-1,1,'export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v12-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),hadPkg=existsSync(pkg);
try{
 if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V12_TEST__={RIFT_ITEM_CATALOG,RIFT_ITEM,RIFT_RECIPE_PLAN,RIFT_RECIPE_VIEW,RIFT_V12_MYTHICAL_RECIPES,RIFT_V12_EARLY_APPLIES,RIFT_V12_BASE_RI,ri,wi,vi,fi,RIFT_V9_GIVE_ENEMY_ITEMS};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.__RIFT_V12_TEST__;assert.ok(api,'V12 test API missing');
 const mythics=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'),fresh=mythics.filter(item=>item.id!=='sparda-devil-sword');
 assert.equal(mythics.length,25,'Mythical count changed');assert.equal(fresh.length,24,'V12 fresh Mythical count changed');assert.equal(Object.keys(api.RIFT_V12_MYTHICAL_RECIPES).length,24,'V12 needs a build path for every new Mythical');
 assert.ok((api.RIFT_ITEM('sparda-devil-sword').recipe||[]).length>=2,'Sparda lost its existing build path');
 const blank=api.RIFT_V12_BASE_RI(1,false,null,[]);blank.inventory=Array(6).fill(null);
 for(const item of fresh){const tree=api.RIFT_V12_MYTHICAL_RECIPES[item.id];assert.ok(tree,`${item.id} missing V12 build path`);assert.ok(item.recipe.length>=2&&item.recipe.length<=3,`${item.id} build path should stay simple`);assert.deepEqual(item.recipe,tree.parts,`${item.id} recipe mismatch`);for(const part of tree.parts)assert.ok(api.RIFT_ITEM(part),`${item.id} references missing component ${part}`);const plan=api.RIFT_RECIPE_PLAN(blank,item.id);assert.ok(plan.ok,`${item.id} cannot be built: ${plan.reason}`);assert.ok(plan.cost>=2050&&plan.cost<=2700,`${item.id} build cost escaped Mythical band: ${plan.cost}`)}
 const view=api.RIFT_RECIPE_VIEW.toString();assert.ok(view.includes('recipe-v12-flow'),'final recipe view is not V12 flat flow');assert.ok(!view.includes('RIFT_RECIPE_NODE'),'final recipe view still mounts recursive tree');
 for(const floor of [1,2,3,4,5,6,7,8,9])assert.equal(api.wi(floor,false).mode,'duel',`Floor ${floor} should be a simple onboarding duel`);
 assert.equal(api.vi(10,blank),'wamuu','Floor 10 boss must remain Wamuu');assert.equal(api.fi(10,blank).statuses.wamuuBoss,1,'Wamuu boss constructor changed');assert.equal(api.RIFT_V12_EARLY_APPLIES(10,true),false,'Wamuu must be excluded from early-game nerfs');
 const early=api.ri(3,false,blank,[]);assert.equal(early.statuses.v12EarlyTraining,1,'early enemy profile missing');assert.ok(early.statuses.tacticalRank<=1,'early enemy tactical AI still too high');assert.equal(early.statuses.patternShift,0,'early enemy pattern shifting should be disabled');assert.equal(early.statuses.defensiveInstinct,0,'early defensive instinct should be disabled');
 const itemDummy=api.RIFT_V12_BASE_RI(20,false,blank,[]);itemDummy.inventory=[{itemId:'iron-edge'},null,null,null,null,null];api.RIFT_V9_GIVE_ENEMY_ITEMS({floor:9},itemDummy);assert.equal(itemDummy.inventory.filter(Boolean).length,0,'enemy itemization should stay off through Floor 9');
 console.log(`V12 verified: all ${mythics.length} Mythicals have readable build paths, recursive shop trees are flattened, Floors 1-9 are onboarding duels, enemy items wait until Floor 10, and Wamuu is unchanged.`);
}finally{delete globalThis.__RIFT_V12_TEST__;await rm(instrumented,{force:true});if(!hadPkg)await rm(pkg,{force:true})}
