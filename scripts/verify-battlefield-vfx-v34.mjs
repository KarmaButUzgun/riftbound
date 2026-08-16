#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
const cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V34 build output missing');
const bundle=await readFile(bundlePath,'utf8');
const css=await readFile(cssPath,'utf8');

for(const marker of [
 'Riftbound Battlefield VFX Grammar V34',
 'RIFT_V34_ICONIC_FAMILIES',
 'RIFT_V34_DESCRIPTOR_FROM_TACTICAL',
 'RIFT_V34_BATTLEFIELD_FX',
 'Yt=function RIFT_V34_ACTION_VISUAL',
 'rs=function RIFT_V34_RESOLVE',
 'RIFTBOUND_BATTLEFIELD_VFX',
 'RIFT_V34_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}',
])assert.ok(bundle.includes(marker),`V34 bundle marker missing: ${marker}`);
for(const marker of [
 '--rift-v34-marker:34',
 '.v34-battlefield-fx',
 '.v34-drill-cone',
 '.v34-falling-body',
 '.v34-door-panel',
 '.v34-domain-boundary',
 '.v34-clock-ring',
 '.v34-summon-silhouette',
 '.v34-projectile-body',
 '.map-fx-action.v34-replaced',
 '.map-effect-echo.v33-echo{display:none',
 '.rift-reduced-motion .v34-fx',
 '.rift-fx-low .v34-domain-motif',
])assert.ok(css.includes(marker),`V34 CSS marker missing: ${marker}`);

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1,'V34 export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v34-test.js');
const packagePath=resolve(dirname(bundlePath),'package.json');
const hadPackage=existsSync(packagePath);
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V34_TEST__={RIFT_V32_CATALOG,RIFT_V34_COVERAGE,RIFT_V34_FAMILIES,RIFT_V34_ICONIC_FAMILIES,RIFT_V34_FAMILY,RIFT_V34_DESCRIPTOR_FROM_TACTICAL,RIFT_V34_REPORT};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.RIFTBOUND_BATTLEFIELD_VFX,grammar=globalThis.RIFTBOUND_TACTICAL_GRAMMAR,manifest=globalThis.RIFTBOUND_MANIFEST,test=globalThis.__RIFT_V34_TEST__;
 assert.ok(api&&grammar&&manifest&&test,'V34 globals failed to initialize');
 assert.equal(manifest.schemaVersion,34);
 assert.equal(manifest.release,'V34 · Battlefield VFX Grammar');
 assert.equal(api.version,34);
 const report=api.report();
 assert.equal(report.version,34);
 assert.equal(report.moves,255,'V34 expected complete public technique coverage');
 assert.equal(report.visualized,report.moves,'V34 must visualize every displayed technique');
 assert.equal(report.fallbacks,0,'V34 may not visually fall back to the old projectile renderer');
 assert.ok(report.families>=18,`V34 expected at least 18 battlefield visual families, got ${report.families}`);
 assert.ok(report.iconicOverrides>=18,`V34 expected at least 18 active iconic visual overrides, got ${report.iconicOverrides}`);
 assert.equal(report.legacyProjectileRenderer,false);
 assert.equal(report.reducedMotion,true);
 assert.equal(report.effectDensityAware,true);
 assert.equal(manifest.battlefieldVfx.families,report.families);
 assert.equal(manifest.battlefieldVfx.legacyProjectileRenderer,false);

 const catalog=grammar.catalog();
 assert.equal(test.RIFT_V34_COVERAGE.length,catalog.totals.moves);
 for(const profile of catalog.profiles)for(const move of profile.moves){
  const visual=move.battlefieldVfx;
  assert.ok(visual,`${profile.name} · ${move.name} has no battlefield VFX descriptor`);
  assert.ok(visual.family,`${profile.name} · ${move.name} has no visual family`);
  assert.ok(Array.isArray(visual.layers)&&visual.layers.length>=3,`${profile.name} · ${move.name} visual composition is too generic`);
  assert.equal(visual.legacyProjectileRenderer,false,`${profile.name} · ${move.name} still opts into legacy projectile rendering`);
  assert.equal(visual.mechanicsChanged,false,`${profile.name} · ${move.name} VFX illegally changes mechanics`);
  assert.equal(visual.constitutionChanged,false,`${profile.name} · ${move.name} VFX illegally changes constitution`);
 }
 const trueProjectiles=test.RIFT_V34_COVERAGE.filter(entry=>entry.family==='true-projectile').length;
 assert.ok(trueProjectiles<report.moves*.35,`V34 still renders too much of the roster as projectiles: ${trueProjectiles}/${report.moves}`);
 for(const family of ['advancing-barrage','domain-takeover','time-stop-field','rewind-field','drill-lunge','falling-crush','ricochet-chain','construct-trap','pursuit-summon'])assert.ok(report.familiesUsed.includes(family),`V34 missing visual family ${family}`);

 const expectFamily=(profile,move,family)=>assert.equal(api.descriptor(profile,move)?.family,family,`${profile} · ${move} visual family drifted`);
 expectFamily('Limitless','Hollow Purple','annihilation-corridor');
 expectFamily('Ki Warrior','Kamehameha','charged-beam');
 expectFamily('Spiral Being','Giga Drill Break','drill-lunge');
 expectFamily('The World','Road Roller','falling-crush');
 expectFamily('Restless Gambler','Train Door','closing-construct');
 expectFamily('Restless Gambler','Chromatic Balls','ricochet-chain');
 expectFamily('Restless Gambler','Lucky Shot','advancing-barrage');
 expectFamily('Restless Gambler','Relentless Luck','blink-impact');
 expectFamily('King Crimson','Time Erasure','time-skip-route');
 expectFamily('King Crimson Requiem','Master of Time','rewind-field');
 expectFamily('Gold Experience Requiem','Revert to Zero','rewind-field');
 expectFamily('Shrine','Malevolent Shrine','domain-takeover');
 expectFamily('Cursed Child','Authentic Mutual Love','domain-takeover');
 expectFamily('Soft & Wet','Go Beyond','impossible-path');

 const purple=grammar.forMove('Limitless','Hollow Purple');
 const run={turn:7,battlefield:{width:120,height:64,effectEchoes:[{id:'legacy',className:'v33-echo v33-type-annihilation-beam',tacticalType:purple.id}],v34FxQueue:[]}};
 const actor={power:{name:'Limitless',accent:'#8d70ff'}},target={power:{name:'Super Strength'}};
 const event=api.emit(run,actor,target,{name:'Hollow Purple',aim:{target:{x:96,y:32},radius:5}},purple,{actorId:'player',targetId:'enemy',origin:{x:18,y:32},end:{x:18,y:32},target:{x:96,y:32}});
 assert.equal(event.family,'annihilation-corridor');
 assert.equal(run.battlefield.v34FxQueue.length,1,'V34 effect did not enter dedicated battlefield queue');
 assert.equal(run.battlefield.effectEchoes.length,0,'V34 did not suppress matching generic V33 echo');
 assert.equal(event.origin.x,18);assert.equal(event.target.x,96);

 const preservation=globalThis.RIFTBOUND_PRESERVATION?.assert?.();
 assert.ok(preservation?.ok,'V34 broke the preserved ability constitution');
 assert.equal(preservation.baseHash,'7598b438','V34 base V20.0.1 constitution drifted');
 assert.equal(globalThis.RIFTBOUND_TACTICAL_GRAMMAR.report().version,33,'V34 replaced instead of extending V33 tactical mechanics');
 console.log(`V34 verified: ${report.visualized}/${report.moves} techniques render through ${report.families} dedicated battlefield visual families; ${trueProjectiles} remain true projectiles; constitution preserved.`);
}finally{
 delete globalThis.__RIFT_V34_TEST__;
 await rm(instrumented,{force:true});
 if(!hadPackage)await rm(packagePath,{force:true});
}
