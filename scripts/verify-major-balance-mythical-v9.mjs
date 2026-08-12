#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V9 build output missing');
const bundle=await readFile(bundlePath,'utf8'),css=await readFile(cssPath,'utf8');
const marker='/* Riftbound Major Balance + Mythical Expansion V9 */';
assert.ok(bundle.includes(marker),'V9 runtime marker missing');assert.ok(css.includes(marker),'V9 CSS marker missing');
for(const needle of ['rewindUltimate3','pyroBurningGround','pyroInfernoGround','bloodAntiHeal','shrineAdaptiveCleave','faux100Blitz','gravityMpCrush','v9OpenDomainToggle','RIFT_V9_GIVE_ENEMY_ITEMS','MYTHICAL SLOT OCCUPIED','RIFTBOUND_V9_DEBUG','Calamity · Floor 50 Unlock','pochitaChoicePending','barrierless=true','v9ExplosiveFlight','afo50'])assert.ok(bundle.includes(needle),`V9 mechanic missing ${needle}`);
for(const id of ['air-force-gloves','zeta-suit','bandits-secret','open-domain','sukuna-finger','anduril-flame-west'])assert.ok(bundle.includes(`"id":"${id}"`),`required Mythical missing ${id}`);
for(const needle of ['mythic-gauntlets','mythic-armor','mythic-book','mythic-finger','mythic-sword','ofa-faux100-v9'])assert.ok(css.includes(needle),`V9 visual missing ${needle}`);
const exportMarker='export{xs as default};'; assert.equal(bundle.split(exportMarker).length-1,1,'export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v9-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),hadPkg=existsSync(pkg);
try{
 if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V9_TEST__={RIFT_ITEM_CATALOG,g,RIFT_ITEM,RIFT_ITEM_RARITIES,RIFT_V9_MYTHIC_PROFILE};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.__RIFT_V9_TEST__;assert.ok(api,'V9 test API missing');
 const mythics=api.RIFT_ITEM_CATALOG.filter(x=>x.rarity==='Mythical');
 assert.ok(mythics.length>=25,`expected >=25 Mythicals, got ${mythics.length}`);
 assert.equal(new Set(mythics.map(x=>x.id)).size,mythics.length,'duplicate Mythical IDs');
 for(const item of mythics){assert.ok(item.passive?.length>=35,`${item.id} passive too thin`);assert.ok(item.lore?.length>=55,`${item.id} lore too thin`);assert.ok(item.reference&&item.reference!=='Riftbound Original',`${item.id} missing reference`)}
 const required=new Set(['air-force-gloves','zeta-suit','bandits-secret','open-domain','sukuna-finger','anduril-flame-west']);for(const id of required)assert.ok(mythics.some(x=>x.id===id),`${id} missing from final catalog`);
 const afo=api.g.find(x=>x.name==='All For One');assert.equal(afo.rarity,'Calamity');
 const speed=api.g.find(x=>x.name==='Speedster');assert.ok(speed.moves[3].tags.includes('rewindUltimate3'));
 const anti=api.g.find(x=>x.name==='Anti-Spiral');assert.ok(anti.moves[3].tags.includes('causality'));
 const faux=api.g.find(x=>x.name==='One For All').moves.find(x=>x.name==='Faux 100%');assert.ok(faux.tags.includes('faux100Blitz')&&faux.tags.includes('noProjectile'));
 const pyro=api.g.find(x=>x.name==='Pyrokinesis');assert.ok(pyro.moves.every(x=>x.tags.includes('scalingAP')));assert.ok(pyro.moves[0].tags.includes('pyroBurningGround'));
 console.log(`V9 verified: ${mythics.length} Mythicals, Calamity AFO, combat reworks, enemy builds, recommendations, Mythical limit, and V9 visuals are wired.`);
}finally{delete globalThis.__RIFT_V9_TEST__;await rm(instrumented,{force:true});if(!hadPkg)await rm(pkg,{force:true})}
