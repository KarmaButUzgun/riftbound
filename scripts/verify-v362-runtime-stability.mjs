#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V36.2 built output missing');
const [bundle,css]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8')]);
for(const marker of ['RIFTBOUND_V36_2','RIFT_V362_SEGMENT_DISTANCE','RIFT_V362_PROCESS_WORLD','RIFT_V362_BUILD_CATALOG','RIFT_V362_ENTRY_POINT','RIFT_V362_SWOON_CINEMA_MS'])assert.ok(bundle.includes(marker),`V36.2 marker missing: ${marker}`);
assert.ok(bundle.includes('o.includes(`symbolFactorWheel`)&&xr(a).length===0&&!yr(a)?`No stolen factor available`:'),'Symbol built-in AFO storage is still disabled when no looted factors exist');
assert.ok(bundle.includes('RIFT_V36_SYMBOL_BUILTINS(w.player).length} BUILT-IN'),'Symbol storage strip does not expose its built-in factors');
assert.ok(bundle.includes('e.type===`ultimate`&&(e.move?.tags||[]).includes(`v36Swoon`)'),'SWOON does not own the click-time Ultimate cinematic');
assert.ok(!bundle.includes('if(typeof document!==`undefined`)RIFT_V36_SW0ON_CUTSCENE();'),'Resolver still launches a second SWOON cinematic');
assert.ok(css.includes('v362SwoonSweep')&&css.includes('border-radius:52% 48%'),'SWOON is still using the straight-line cinematic');
const exportMarker='export{xs as default};',instrumented=resolve(dirname(bundlePath),'page-v362-test.js'),packagePath=resolve(dirname(bundlePath),'package.json'),hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V36.2 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V362_TEST__={RIFT_V31_BUILD_CATALOG,RIFT_V36_SEGMENT_DISTANCE,RIFT_V36_POINT,RIFT_V36_PROCESS_WORLD,RIFT_V36_SYMBOL_BUILTINS};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v362=${Date.now()}`);
 const test=globalThis.__RIFT_V362_TEST__,api=globalThis.RIFTBOUND_V36_2;
 assert.ok(test&&api&&api.geometrySafe&&api.codexReconciled&&api.swoonSingleCinematic,'V36.2 runtime did not initialize');
 const catalog=test.RIFT_V31_BUILD_CATALOG();
 const symbol=catalog.powers.find(profile=>profile.name==='Symbol of Fear');
 assert.ok(symbol,'Symbol of Fear missing from reconciled Codex');
 assert.deepEqual(symbol.moves.slice(0,3).map(move=>move.name),['All For One','Focused Regeneration','Accelerator Rings'],'Codex rebuilt Symbol through the stale V31.1 move order');
 assert.equal(test.RIFT_V36_SEGMENT_DISTANCE(undefined,{x:0,y:0},{x:4,y:4}),Infinity,'Malformed Accelerator Rings roster geometry can still throw through segment distance');
 assert.equal(test.RIFT_V36_SEGMENT_DISTANCE({x:2,y:2},{x:0,y:0},{x:4,y:4}),0);
 const fallback=test.RIFT_V36_POINT({battlefield:{width:100,height:60}},{});assert.deepEqual(fallback,{x:50,y:30},'Malformed actor lookup did not normalize to a valid battlefield point');
 const malformedWorld={turn:3,battlefield:{width:100,height:60,features:[{id:'bad-crystal',v36CrystalDue:true,dueTurn:2,position:undefined,radius:10}]}};
 assert.doesNotThrow(()=>test.RIFT_V36_PROCESS_WORLD(malformedWorld),'World tick still dereferences an undefined coordinate');
 assert.deepEqual(test.RIFT_V36_SYMBOL_BUILTINS({power:{name:'Symbol of Fear'}}).map(power=>power.name),['Decay','Stolen Quirks']);
 console.log('V36.2 verified: Codex order, safe world/dash geometry, built-in AFO storage, and single curved SWOON cinematic.');
}finally{delete globalThis.__RIFT_V362_TEST__;await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true})}
