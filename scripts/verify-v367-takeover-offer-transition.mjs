#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),'V36.7 built output missing');
const bundle=await readFile(bundlePath,'utf8');

for(const marker of ['RIFTBOUND_V36_7','RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER','takeoverOfferCarriesIntoNextFloor','nextFloorCleanupPreservesTakeover'])assert.ok(bundle.includes(marker),`V36.7 marker missing: ${marker}`);
const obsoleteCleanup='e.player.statuses=Object.fromEntries(Object.entries(e.player.statuses).filter(([e])=>[`apBuff`,`speedBuff`,`skillBuff`,`spiralEvolutions`,`faJin`,`ofaInherited`,`weaponDestroyed`,`symbolEvolved`,`immenseRegen`].includes(e)))';
assert.ok(!bundle.includes(obsoleteCleanup),'the real next-floor callback still contains the Takeover-killing status cleanup');
assert.ok(bundle.includes('RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER(e.player)'),'the real next-floor callback does not call the V36.7 carry helper');

const exportMarker='export{xs as default};',instrumented=resolve(dirname(bundlePath),'page-v367-test.js'),packagePath=resolve(dirname(bundlePath),'package.json'),hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V36.7 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V367_TEST__={Ur,Da,Me,Le,d,g,P,RIFT_V35_RUINED,RIFT_V35_BEGIN_TAKEOVER,RIFT_V366_CAPTURE_BORROWED_ACTIONS,RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER,RIFT_NORMALIZE_RUN_BUILD,La,gt,Gi,ei,ls};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v367=${Date.now()}`);
 const test=globalThis.__RIFT_V367_TEST__,api=globalThis.RIFTBOUND_V36_7,manifest=globalThis.RIFTBOUND_MANIFEST;
 assert.ok(test&&api&&manifest,'V36.7 runtime did not initialize');
 assert.equal(api.version,'36.7');assert.equal(api.takeoverOfferCarriesIntoNextFloor,true);assert.equal(api.nextFloorCleanupPreservesTakeover,true);
 assert.equal(manifest.v36.hotfix,'36.7');assert.equal(manifest.v36.takeoverOfferCarriesIntoNextFloor,true);assert.equal(manifest.v36.nextFloorCleanupPreservesTakeover,true);

 const trait={name:'None',rarity:'Common',description:''};
 const combatSlots=fighter=>Object.fromEntries(test.La(fighter).filter(action=>[5,6,7,8].includes(Number(action.slot))).map(action=>[Number(action.slot),action]));
 const powers=test.g.filter(power=>power?.name!==test.RIFT_V35_RUINED&&Array.isArray(power?.moves)&&power.moves.length>=3);
 assert.equal(powers.length,54,'V36.7 roster matrix no longer covers every non-Viego Special Power');

 // Matrix the exact offer acceptance -> next-floor cleanup boundary for every power.
 for(const borrowedPower of powers){
  const player=test.Ur(`Viego offer matrix // ${borrowedPower.name}`,test.d[0],trait,'Ruined King',null,null,test.Le(test.Me)).fighter;
  const run=test.Da(player,test.Me);
  const snapshot=structuredClone(run.enemy);snapshot.name=`${borrowedPower.name} Body`;snapshot.power=structuredClone(borrowedPower);snapshot.statuses={};snapshot.ultimate=100;
  const captured=test.RIFT_V366_CAPTURE_BORROWED_ACTIONS(snapshot);
  assert.equal(captured.length,3,`${borrowedPower.name}: could not capture three Takeover techniques`);
  const expected=captured.map(action=>action.name);

  // Mirror the DOM TAKEOVER button callback: consume v35PendingTakeover, then begin a floor-clear possession.
  run.player.statuses.v35PendingTakeover={target:structuredClone(snapshot),position:{x:50,y:32},createdFloor:run.floor};
  const pending=run.player.statuses.v35PendingTakeover;delete run.player.statuses.v35PendingTakeover;
  assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,pending.target,pending.position,'floor-clear wraith'),true,`${borrowedPower.name}: TAKEOVER offer did not activate possession`);
  assert.ok(run.player.statuses.v35Takeover,`${borrowedPower.name}: offer acceptance created no Takeover state`);
  assert.equal(run.player.power.name,'Ruined King',`${borrowedPower.name}: offer acceptance changed canonical power identity`);
  run.player.statuses.v367TemporaryProbe=1;

  // This is the exact production seam executed by the Next Floor callback.
  test.RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER(run.player);
  assert.ok(!('v367TemporaryProbe' in run.player.statuses),`${borrowedPower.name}: ordinary fight-scoped status cleanup stopped working`);
  assert.ok(run.player.statuses.v35Takeover,`${borrowedPower.name}: next-floor cleanup deleted accepted Takeover`);
  assert.equal(run.player.statuses.v35Takeover.remaining,5,`${borrowedPower.name}: entering the floor consumed a Takeover turn`);
  assert.equal(run.player.power.name,'Ruined King',`${borrowedPower.name}: next-floor cleanup changed canonical identity`);
  const slots=combatSlots(run.player);
  assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name],expected,`${borrowedPower.name}: stolen M1-M3 vanished at the next-floor cleanup boundary`);
  assert.equal(slots[8]?.name,'Heartbreaker',`${borrowedPower.name}: Heartbreaker vanished at the next-floor cleanup boundary`);
 }

 // Drive one representative possession through the downstream floor-start normalization/map pipeline too.
 const player=test.Ur('Viego full transition fixture',test.d[0],trait,'Ruined King',null,null,test.Le(test.Me)).fighter;
 const run=test.Da(player,test.Me);
 const cursed=test.g.find(power=>power?.name==='Cursed Child');assert.ok(cursed,'Cursed Child transition fixture missing');
 const snapshot=structuredClone(run.enemy);snapshot.name='Cursed Child Body';snapshot.power=structuredClone(cursed);snapshot.statuses={};snapshot.ultimate=100;
 const expected=test.RIFT_V366_CAPTURE_BORROWED_ACTIONS(snapshot).map(action=>action.name);
 run.player.statuses.v35PendingTakeover={target:structuredClone(snapshot),position:{x:50,y:32},createdFloor:run.floor};
 const pending=run.player.statuses.v35PendingTakeover;delete run.player.statuses.v35PendingTakeover;
 assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,pending.target,pending.position,'floor-clear wraith'),true);
 test.RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER(run.player);
 run.floor+=1;run.turn=1;run.phase='combat';run.battlefield=test.gt(run.floor,false,run.encounter,run.player,run.enemy,'unknown');
 test.Gi(run,false);test.ei(run);test.ls(run);test.RIFT_NORMALIZE_RUN_BUILD(run);
 assert.ok(run.player.statuses.v35Takeover,'full next-floor pipeline erased accepted Takeover');
 assert.equal(run.player.statuses.v35Takeover.remaining,5,'full next-floor pipeline consumed a Takeover turn before combat');
 assert.equal(run.player.power.name,'Ruined King');
 const slots=combatSlots(run.player);
 assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name],expected,'full next-floor pipeline lost the stolen Cursed Child deck');
 assert.equal(slots[8]?.name,'Heartbreaker');

 console.log(`V36.7 verified: the literal TAKEOVER offer survives the real next-floor status cleanup and floor-start pipeline; stolen M1-M3 + Heartbreaker persist for all ${powers.length} non-Viego powers.`);
}finally{
 delete globalThis.__RIFT_V367_TEST__;delete globalThis.__RIFTBOUND_REACT_RUN_SETTER__;delete globalThis.__RIFTBOUND_ACTIVE_RUN__;
 await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true});
}
