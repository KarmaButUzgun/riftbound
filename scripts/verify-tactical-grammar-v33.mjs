#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
const cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V33 build output missing');
const bundle=await readFile(bundlePath,'utf8');
const css=await readFile(cssPath,'utf8');

for(const marker of [
 'Riftbound Tactical Grammar V33',
 'RIFT_V33_CANON_OVERRIDES',
 'RIFT_V33_INSTALL_CATALOG',
 'Tt=function RIFT_V33_TARGET_PROFILE',
 'At=function RIFT_V33_AIM',
 'Yt=function RIFT_V33_ACTION_VISUAL',
 'rs=function RIFT_V33_RESOLVE',
 'RIFTBOUND_TACTICAL_GRAMMAR',
 't.tacticalLabel||t.shape.toUpperCase()',
])assert.ok(bundle.includes(marker),`V33 bundle marker missing: ${marker}`);
for(const marker of ['--rift-v33-marker:33','motion-ricochet','motion-drill','motion-domain','v33-echo'])assert.ok(css.includes(marker),`V33 CSS marker missing: ${marker}`);

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1,'V33 export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v33-test.js');
const packagePath=resolve(dirname(bundlePath),'package.json');
const hadPackage=existsSync(packagePath);
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V33_TEST__={RIFT_V32_CATALOG,RIFT_V33_ACTION_INDEX,RIFT_V33_TYPE_REGISTRY,RIFT_V33_AUTOMOVE,RIFT_V33_SET_POSITION,RIFT_V33_REPORT};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.__RIFT_V33_TEST__,grammar=globalThis.RIFTBOUND_TACTICAL_GRAMMAR,codex=globalThis.RIFTBOUND_CODEX;
 assert.ok(api&&grammar&&codex,'V33 globals failed to initialize');
 const report=grammar.report();
 assert.equal(report.version,33);
 assert.equal(report.moves,255,'V33 expected the complete V32 public technique catalog');
 assert.equal(report.typed,report.moves,'V33 must explicitly type every displayed Power/Stand technique');
 assert.equal(report.fallbacks,0,'V33 public catalog may not use runtime fallback typing');
 assert.ok(report.types>=64,`V33 expected at least 64 used tactical types, got ${report.types}`);
 assert.ok(report.canonOverrides>=12,`V33 expected at least 12 active canon-specific overrides, got ${report.canonOverrides}`);
 const catalog=grammar.catalog();
 assert.equal(catalog.tacticalGrammar.explicit,catalog.totals.moves);
 assert.equal(catalog.tacticalGrammar.fallbacks,0);
 for(const profile of catalog.profiles){
  assert.ok(profile.tacticalTypes?.length>0,`${profile.name} tactical type list missing`);
  for(const move of profile.moves){
   assert.ok(move.preview?.explicit,`${profile.name} · ${move.name} lost explicit preview source`);
   assert.equal(move.preview.mechanicsChanged,false,`${profile.name} · ${move.name} mutated the preserved preview contract`);
   assert.ok(move.tactical?.explicit,`${profile.name} · ${move.name} lacks explicit tactical typing`);
   assert.equal(move.tactical.mechanicsChanged,true,`${profile.name} · ${move.name} did not opt into live tactical mechanics`);
   assert.equal(move.tactical.constitutionChanged,false,`${profile.name} · ${move.name} illegally mutated the ability constitution`);
   assert.ok(move.tactical.input&&move.tactical.timing&&move.tactical.trajectory&&move.tactical.collision,`${profile.name} · ${move.name} tactical contract incomplete`);
  }
 }
 const distinct=(field)=>new Set(catalog.moves.map(move=>move.tactical[field]));
 assert.ok(distinct('input').size>=6,'V33 input grammar is not diverse enough');
 assert.ok(distinct('timing').size>=6,'V33 timing grammar is not diverse enough');
 assert.ok(distinct('trajectory').size>=10,'V33 trajectory grammar is not diverse enough');
 assert.ok(distinct('collision').size>=8,'V33 collision grammar is not diverse enough');
 assert.ok(distinct('aftermath').size>=8,'V33 aftermath grammar is not diverse enough');
 const expectType=(profile,move,id)=>assert.equal(grammar.forMove(profile,move)?.id,id,`${profile} · ${move} tactical type drifted`);
 expectType('Restless Gambler','Chromatic Balls','ricochet-projectile');
 expectType('Restless Gambler','Train Door','closing-construct-trap');
 expectType('Restless Gambler','Relentless Luck','blink-slam-shockwave');
 expectType('King Crimson Requiem','Master of Time','timeline-rewind-selector');
 const preservation=globalThis.RIFTBOUND_PRESERVATION?.assert?.();
 assert.ok(preservation?.ok,'V33 broke the preserved V32 ability constitution');
 assert.equal(preservation.baseHash,'7598b438','V33 base V20.0.1 constitution drifted');
 const run={battlefield:{width:100,height:64,player:{x:10,y:32},enemy:{x:30,y:32},features:[],units:[],effectEchoes:[]}};
 const moved=api.RIFT_V33_AUTOMOVE(run,'player',{autoMove:true,trajectory:'lunge',collision:'single'},{x:10,y:32},{target:{x:30,y:32},range:24});
 assert.equal(moved,true,'V33 ability-driven lunge failed to reposition');
 assert.ok(run.battlefield.player.x>10&&run.battlefield.player.x<30,'V33 lunge destination is not between origin and target');
 const rebuilt=codex.build();
 assert.equal(rebuilt.tacticalGrammar.explicit,rebuilt.totals.moves,'V33 dynamic Codex rebuild lost tactical coverage');
 console.log(`V33 verified: ${report.typed}/${report.moves} techniques use ${report.types} live tactical types with ${report.canonOverrides} canon overrides; constitution preserved.`);
}finally{
 delete globalThis.__RIFT_V33_TEST__;
 await rm(instrumented,{force:true});
 if(!hadPackage)await rm(packagePath,{force:true});
}
