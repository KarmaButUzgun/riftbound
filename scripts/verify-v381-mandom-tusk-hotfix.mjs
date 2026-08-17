#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),'V38.1 built output missing');
const bundle=await readFile(bundlePath,'utf8');
assert.ok(bundle.includes('RIFTBOUND_V38_1'),'V38.1 runtime marker missing');
assert.ok(bundle.includes('REVOLVER SHOT · 48m'),'Mandom Shoot firearm geometry missing');
assert.ok(bundle.includes('RICOSHOOT · REVOLVER 54m'),'Mandom Ricoshoot firearm geometry missing');
assert.ok(bundle.includes('QUICK REVOLVER · 44m'),'D4C Quick Revolver firearm geometry missing');
assert.equal(bundle.includes('n?[...n.nonSummoned,...n.summoned,n.ultimate]:[]'),false,'nullable Stand Ultimate still enters VFX move lookup');

const exportMarker='export{xs as default};';
const instrumented=resolve(dirname(bundlePath),'page-v381-test.js');
const packagePath=resolve(dirname(bundlePath),'package.json');
const hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V38.1 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V381_TEST__={Ts,h,Ur,La,Tt};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v381=${Date.now()}`);
 const t=globalThis.__RIFT_V381_TEST__;
 assert.ok(t&&globalThis.RIFTBOUND_V38_1,'V38.1 runtime did not initialize');
 assert.equal(globalThis.RIFTBOUND_V38_1.version,'38.1');

 const stats={as:5,ap:5,durability:5,speed:5,range:5,iq:5,battleIq:5,combatSkill:5,energy:5,regeneration:5};
 const makeStand=(name)=>t.Ur('V38.1 fixture',{name:'Human'},{name:'Stand User'},name,null,null,stats).fighter;

 // Exact live crash class: Mandom has ultimate:null, and the shared effect renderer used
 // to dereference that null while findIndex searched for the manifestation effect move.
 const mandomRow=t.h.find(row=>row.name==='Mandom');
 assert.ok(mandomRow);assert.equal(mandomRow.ultimate,null);assert.equal(mandomRow.range,48);
 assert.doesNotThrow(()=>t.Ts({effect:{id:'v381-mandom-summon',power:'Mandom',move:'Manifest',side:'player',intensity:1}}),'Mandom manifestation still crashes the shared Stand VFX renderer');
 const mandom=makeStand('Mandom');
 const mandomActions=t.La(mandom);
 const shoot=mandomActions.find(a=>a.name==='Shoot'),rico=mandomActions.find(a=>a.name==='Ricoshoot'),rapid=mandomActions.find(a=>a.name==='Rapid Fire');
 assert.ok(shoot&&rico&&rapid,'Mandom gun deck missing');
 assert.equal(t.Tt(shoot,mandom).range,48,'Mandom Shoot regressed to close range');
 assert.equal(t.Tt(shoot,mandom).shape,'projectile');
 assert.equal(t.Tt(rico,mandom).range,54,'Mandom Ricoshoot regressed to close range');
 assert.equal(t.Tt(rico,mandom).shape,'projectile');
 assert.ok(t.Tt(rapid,mandom).range>20,'Mandom Rapid Fire lost its existing ranged footprint');

 // Same hidden firearm-classification issue existed on D4C Quick Revolver.
 const d4c=makeStand('D4C'),quick=t.La(d4c).find(a=>a.name==='Quick Revolver');
 assert.ok(quick);assert.equal(t.Tt(quick,d4c).range,44);assert.equal(t.Tt(quick,d4c).shape,'projectile');

 // Exact live Act 4 crash class: basic Strike has no legacy move object. The V38 adapter
 // must synthesize one before assigning Infinite Rotation cost/tags.
 const act4=makeStand('Tusk Act 4');
 let act4Actions;
 assert.doesNotThrow(()=>{act4Actions=t.La(act4)},'direct Tusk Act 4 grant still crashes action construction');
 const strike=act4Actions.find(a=>a.type==='strike');
 assert.ok(strike?.move,'Act 4 Strike did not receive a safe move shell');
 assert.equal(strike.cost,0);assert.equal(strike.move.cost,0);
 for(const tag of ['guaranteedHit','causality','causal','v38InfiniteSpin'])assert.ok(strike.move.tags.includes(tag),`Act 4 Strike missing ${tag}`);
 for(const action of act4Actions.filter(a=>['strike','special','ultimate'].includes(a.type)))assert.ok(Number.isFinite(action.move?.cost),`Act 4 action ${action.name} has no numeric move cost`);

 console.log('V38.1 verified: Mandom manifestation is null-safe, revolver actions use real firearm ranges, and direct Tusk Act 4 grants build a valid Infinite Rotation action deck.');
}finally{
 delete globalThis.__RIFT_V381_TEST__;
 await rm(instrumented,{force:true});
 if(!hadPackage)await rm(packagePath,{force:true});
}
