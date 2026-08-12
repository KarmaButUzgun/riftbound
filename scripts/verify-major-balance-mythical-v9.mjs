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
for(const needle of ['rewindUltimate3','timeRewind','pyroBurningGround','pyroInfernoGround','bloodAntiHeal','shrineAdaptiveCleave','faux100Blitz','gravityMpCrush','v9OpenDomainToggle','RIFT_V9_GIVE_ENEMY_ITEMS','MYTHICAL SLOT OCCUPIED','RIFTBOUND_V9_DEBUG','Calamity · Floor 50 Unlock','pochitaChoicePending','barrierless=true','v9ExplosiveFlight','afo50','RIFT_V9_MYTHICAL_MECHANIC_COVERAGE','v9RaijinTeleport','v9SlingPortal','v9MimicTearSummon','v9PrisonProgress','v9GunbaiStore','v9SandevistanHeat','v9PuzzleRematchUsed','v9Kingship','v9IronHaloOverload'])assert.ok(bundle.includes(needle),`V9 mechanic missing ${needle}`);
for(const id of ['air-force-gloves','zeta-suit','bandits-secret','open-domain','sukuna-finger','anduril-flame-west'])assert.ok(bundle.includes(`"id":"${id}"`),`required Mythical missing ${id}`);
for(const needle of ['mythic-gauntlets','mythic-armor','mythic-book','mythic-finger','mythic-sword','ofa-faux100-v9','mythic-raijin','mythic-sling-portal','mythic-prison-realm','mythic-mimic-tear','mythic-anduril-rally','mythic-moonlight-wave'])assert.ok(css.includes(needle),`V9 visual missing ${needle}`);
const exportMarker='export{xs as default};'; assert.equal(bundle.split(exportMarker).length-1,1,'export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v9-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),hadPkg=existsSync(pkg);
try{
 if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V9_TEST__={RIFT_ITEM_CATALOG,g,RIFT_ITEM,RIFT_ITEM_RARITIES,RIFT_V9_MYTHIC_PROFILE,RIFT_V9_MYTHICAL_MECHANIC_COVERAGE};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.__RIFT_V9_TEST__;assert.ok(api,'V9 test API missing');
 const mythics=api.RIFT_ITEM_CATALOG.filter(x=>x.rarity==='Mythical');
 assert.equal(mythics.length,25,`expected exactly 25 Mythicals, got ${mythics.length}`);
 assert.equal(new Set(mythics.map(x=>x.id)).size,mythics.length,'duplicate Mythical IDs');
 for(const item of mythics){assert.ok(item.passive?.length>=35,`${item.id} passive too thin`);assert.ok(item.lore?.length>=55,`${item.id} lore too thin`);assert.ok(item.reference&&item.reference!=='Riftbound Original',`${item.id} missing reference`)}
 const required=new Set(['air-force-gloves','zeta-suit','bandits-secret','open-domain','sukuna-finger','anduril-flame-west']);for(const id of required)assert.ok(mythics.some(x=>x.id===id),`${id} missing from final catalog`);
 const newMythics=mythics.filter(item=>item.id!=='sparda-devil-sword');assert.equal(newMythics.length,24,'V9 must add exactly 24 Mythicals on top of Sparda');
 assert.equal(Object.keys(api.RIFT_V9_MYTHICAL_MECHANIC_COVERAGE).length,24,'Mythical mechanic coverage registry must contain 24 entries');
 for(const item of newMythics){assert.ok(item.passiveId,`${item.id} needs a passiveId`);assert.ok(api.RIFT_V9_MYTHICAL_MECHANIC_COVERAGE[item.passiveId],`${item.id} has no production mechanic coverage`);assert.ok(css.includes(`data-mythic-id=\"${item.id}\"`),`${item.id} lacks a dedicated portrait selector`);const profile=api.RIFT_V9_MYTHIC_PROFILE[item.id];assert.ok(profile?.kind&&profile?.mark,`${item.id} lacks authored Mythical portrait profile`)}
 assert.equal(new Set(newMythics.map(item=>api.RIFT_V9_MYTHIC_PROFILE[item.id].kind+':'+api.RIFT_V9_MYTHIC_PROFILE[item.id].mark)).size,24,'new Mythical portrait profiles must have unique composition signatures');
 const afo=api.g.find(x=>x.name==='All For One');assert.equal(afo.rarity,'Calamity');
 const speed=api.g.find(x=>x.name==='Speedster');assert.ok(speed.moves[3].tags.includes('rewindUltimate3')&&speed.moves[3].tags.includes('timeRewind'));assert.ok(!speed.moves[3].tags.includes('causality'),'Speedster rewind must not inflate Causality frequency');
 const anti=api.g.find(x=>x.name==='Anti-Spiral');assert.ok(anti.moves[3].tags.includes('causality'));
 const faux=api.g.find(x=>x.name==='One For All').moves.find(x=>x.name==='Faux 100%');assert.ok(faux.tags.includes('faux100Blitz')&&faux.tags.includes('noProjectile'));
 const pyro=api.g.find(x=>x.name==='Pyrokinesis');assert.ok(pyro.moves.every(x=>x.tags.includes('scalingAP')));assert.ok(pyro.moves[0].tags.includes('pyroBurningGround'));assert.ok(pyro.moves.some(x=>x.tags.includes('pyroInfernoGround')));
 const blood=api.g.find(x=>x.name==='Blood Sorcery');assert.ok(blood.moves.filter(x=>(x.power||0)>0).every(x=>x.tags.includes('bloodAntiHeal')));
 console.log(`V9 verified: exactly ${mythics.length} Mythicals, all 24 new Mythicals have mechanic coverage and dedicated portraits, Calamity progression and combat reworks are wired.`);
}finally{delete globalThis.__RIFT_V9_TEST__;await rm(instrumented,{force:true});if(!hadPkg)await rm(pkg,{force:true})}
