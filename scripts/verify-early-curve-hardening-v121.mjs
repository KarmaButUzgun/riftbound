#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),'V12.1 build output missing');
const bundle=await readFile(bundlePath,'utf8');
const marker='/* Riftbound Early Curve Hardening V12.1 */';
assert.ok(bundle.includes(marker),'V12.1 runtime marker missing');
assert.ok(bundle.includes('e.floor>=10&&t.id===`hunt`'),'Hunt Elite still available before Wamuu');
assert.ok(bundle.includes('Early ascent trial: the foe gains a light ward and partial Ultimate charge'),'early Trial softening missing');
assert.ok(bundle.includes('Dormant cataclysm fault'),'early Ruin softening missing');
assert.ok(bundle.includes('if(e===10)return`wamuu`'),'Wamuu Floor 10 hook missing');
const exportMarker='export{xs as default};';assert.equal(bundle.split(exportMarker).length-1,1,'export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v121-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),hadPkg=existsSync(pkg);
try{
 if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V121_TEST__={RIFT_V12_EARLY_APPLIES,RIFT_V12_BASE_RI,ri,wi,ua,Xi,vi,fi};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.__RIFT_V121_TEST__;assert.ok(api,'V12.1 test API missing');
 assert.equal(api.RIFT_V12_EARLY_APPLIES(5,true),true,'ordinary early boss is still excluded from onboarding');
 assert.equal(api.RIFT_V12_EARLY_APPLIES(9,true),true,'Floor 9 boss path is still excluded from onboarding');
 assert.equal(api.RIFT_V12_EARLY_APPLIES(10,true),false,'Wamuu accidentally entered onboarding nerf band');
 for(const floor of [1,3,5,7,9])assert.equal(api.wi(floor,floor===5).mode,'duel',`Floor ${floor} should be a simple duel even on ordinary boss path`);
 const seeded=(seed)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const realRandom=Math.random;
 try{
   Math.random=seeded(12350);const baseBoss=api.RIFT_V12_BASE_RI(5,true,null,[]);
   Math.random=seeded(12350);const softBoss=api.ri(5,true,null,[]);
   assert.equal(softBoss.statuses.v12EarlyTraining,1,'Floor 5 boss missing V12 onboarding profile');
   assert.ok(softBoss.maxHp<baseBoss.maxHp,'Floor 5 boss HP was not softened');
   assert.ok(softBoss.tiers.as<=baseBoss.tiers.as&&softBoss.tiers.ap<=baseBoss.tiers.ap,'Floor 5 boss combat tiers were not softened');
 }finally{Math.random=realRandom}
 assert.equal(api.ua({floor:5,boss:true},false),false,'Floor 5 boss can still be replaced by a random Devil');
 assert.equal(api.Xi({boss:false,nemeses:[]},5),null,'Nemesis can still return before Wamuu');
 const dummy=api.RIFT_V12_BASE_RI(1,false,null,[]);
 assert.equal(api.vi(10,dummy),'wamuu','Floor 10 boss is no longer Wamuu');
 assert.equal(api.fi(10,dummy).statuses.wamuuBoss,1,'Wamuu constructor changed');
 console.log('V12.1 verified: ordinary Floors 1-9 bosses and spike events are softened while Floor 10 Wamuu remains untouched.');
}finally{delete globalThis.__RIFT_V121_TEST__;await rm(instrumented,{force:true});if(!hadPkg)await rm(pkg,{force:true})}
