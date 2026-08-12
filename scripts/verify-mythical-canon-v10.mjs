#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V10 build output missing');
const bundle=await readFile(bundlePath,'utf8'),css=await readFile(cssPath,'utf8');
const marker='/* Riftbound Mythical Canon Portrait + Balance V10 */';
assert.ok(bundle.includes(marker),'V10 runtime marker missing');
assert.ok(css.includes(marker),'V10 CSS marker missing');
assert.ok(bundle.includes('data-art-quality":`v10`'),'V10 canon renderer missing');
assert.ok(bundle.includes('RIFT_MYTHICAL_CANON_PROFILES'),'V10 Mythical canon profile registry missing');
assert.ok(!bundle.includes('if(ids.includes(`sukunaFinger`)&&RIFT_DAMAGE_SCALING(run,attacker,tags).mode===`AP`)value*=1.3;'),'old Sukuna AP-damage multiplier survived');
assert.ok(bundle.includes('t===`ap`&&RIFT_HAS_PASSIVE(e,`sukunaFinger`)&&(r*=1.3)'),'Sukuna current-AP multiplier missing');
assert.ok(bundle.includes('Math.floor(e.floor*e.floor/24)'),'progressive floor-clear Shard curve missing');
assert.ok(bundle.includes('Math.floor(e.floor*e.floor/30)'),'progressive vault Shard curve missing');
const exportMarker='export{xs as default};';assert.equal(bundle.split(exportMarker).length-1,1,'export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v10-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),hadPkg=existsSync(pkg);
try{
 if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V10_TEST__={RIFT_ITEM_CATALOG,RIFT_SHOP_OFFERS,RIFT_MYTHICAL_CANON_PROFILES,RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_ITEM_INSTANCE,ri,Y};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.__RIFT_V10_TEST__;assert.ok(api,'V10 test API missing');
 const mythics=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'),fresh=mythics.filter(item=>item.id!=='sparda-devil-sword');
 assert.equal(mythics.length,25,'Mythical count changed');assert.equal(fresh.length,24,'new Mythical count changed');
 assert.equal(Object.keys(api.RIFT_MYTHICAL_CANON_PROFILES).length,24,'V10 canon registry must cover all 24 new Mythicals');
 assert.ok(!api.RIFT_MYTHICAL_CANON_PROFILES['sparda-devil-sword'],'Sparda must remain owned by its existing V5 portrait');
 const keys=new Set();
 for(const item of fresh){
   assert.equal(item.price,2100,`${item.id} Mythical price must be 2100`);
   const statTotal=Object.values(item.stats||{}).reduce((sum,value)=>sum+Math.abs(Number(value)||0),0);
   assert.ok(statTotal>=8,`${item.id} is still under-statted for Mythical (${statTotal})`);
   assert.ok(statTotal<=12,`${item.id} stat package overshot the Mythical standard (${statTotal})`);
   const profile=api.RIFT_MYTHICAL_CANON_PROFILES[item.id];assert.ok(profile,`${item.id} missing V10 canon portrait`);
   assert.ok(profile.visualKey&&profile.source&&profile.canon&&profile.kind,`${item.id} canon metadata incomplete`);
   assert.ok(profile.canon.length>=55,`${item.id} canon art brief too thin`);
   assert.ok(!keys.has(profile.visualKey),`${item.id} duplicate visual key`);keys.add(profile.visualKey);
   for(const layer of ['main','secondary','detail','mark','glow']){const data=profile.layers?.[layer];assert.ok(data&&Number.isFinite(data.x)&&Number.isFinite(data.y)&&Number.isFinite(data.w)&&Number.isFinite(data.h),`${item.id} ${layer} layer incomplete`);assert.ok(data.bg&&data.clip!==undefined,`${item.id} ${layer} material/shape missing`)}
 }
 for(const floor of [1,10,25,35,50])assert.equal(api.RIFT_SHOP_OFFERS(floor,null).filter(item=>item.rarity==='Mythical').length,25,`Floor ${floor} lost Mythical shop visibility`);
 const finger=fresh.find(item=>item.id==='sukuna-finger');assert.equal(finger.passive.startsWith('Increases your current AP by 30%.'),true,'Sukuna passive text is not current-AP wording');
 const fighter=api.ri(1,false,null);api.RIFT_NORMALIZE_FIGHTER_BUILD(fighter);fighter.inventory=Array(6).fill(null);fighter.tiers.ap=10;const base=api.Y(fighter,'ap');fighter.inventory[1]=api.RIFT_ITEM_INSTANCE('sukuna-finger',2100);const boosted=api.Y(fighter,'ap');assert.ok(Math.abs(boosted-(base+2)*1.3)<1e-9,`Sukuna current AP multiplier is wrong: base ${base}, boosted ${boosted}`);
 console.log(`V10 verified: ${fresh.length} literal five-layer Mythical canon portraits, 2100-Shard pricing, 8-12 direct stat tiers, Deathcap-style Sukuna AP, and progressive dungeon Shards.`);
}finally{delete globalThis.__RIFT_V10_TEST__;await rm(instrumented,{force:true});if(!hadPkg)await rm(pkg,{force:true})}
