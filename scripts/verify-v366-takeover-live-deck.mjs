#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),'V36.6 built output missing');
const bundle=await readFile(bundlePath,'utf8');
for(const marker of ['RIFTBOUND_V36_6','RIFT_V366_CAPTURE_BORROWED_ACTIONS','RIFT_V366_BEGIN_TAKEOVER','v366-takeover-live-deck','__RIFTBOUND_REACT_RUN_SETTER__','takeoverLiveDeck'])assert.ok(bundle.includes(marker),`V36.6 marker missing: ${marker}`);

const exportMarker='export{xs as default};',instrumented=resolve(dirname(bundlePath),'page-v366-test.js'),packagePath=resolve(dirname(bundlePath),'package.json'),hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V36.6 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V366_TEST__={Ur,Da,Me,Le,d,g,RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_V35_RUINED_POWER,RIFT_V35_BEGIN_TAKEOVER,RIFT_V35_RESTORE_TAKEOVER,RIFT_V365_ENFORCE_TAKEOVER_IDENTITY,RIFT_V366_CAPTURE_BORROWED_ACTIONS,La,rs,Qo};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v366=${Date.now()}`);
 const test=globalThis.__RIFT_V366_TEST__,api=globalThis.RIFTBOUND_V36_6,manifest=globalThis.RIFTBOUND_MANIFEST;
 assert.ok(test&&api&&manifest,'V36.6 runtime did not initialize');
 assert.equal(api.version,'36.6');assert.equal(api.takeoverLiveDeck,true);assert.equal(api.identityPower,'Ruined King');assert.deepEqual(api.borrowedSlots,[5,6,7]);assert.equal(api.heartbreakerSlot,8);assert.equal(api.capturesVictimActionSurface,true);assert.equal(api.floorClearReactPublish,true);
 assert.equal(manifest.v36.hotfix,'36.6');assert.equal(manifest.v36.takeoverLiveDeck,true);assert.equal(manifest.v36.capturesVictimActionSurface,true);assert.equal(manifest.v36.floorClearReactPublish,true);

 const trait={name:'None',rarity:'Common',description:''};
 const player=test.Ur('Viego live-deck fixture',test.d[0],trait,'Ruined King',null,null,test.Le(test.Me)).fighter;
 const run=test.Da(player,test.Me);
 const electro=test.g.find(power=>power?.name==='Electrokinesis'&&power?.moves?.length>=4);
 assert.ok(electro,'Electrokinesis fixture is missing from the live power registry');
 assert.deepEqual(electro.moves.slice(0,4).map(move=>move.name),['Lightning Bolt','Arc Current','Overload','Thunder God'],'Electrokinesis move order changed');
 const snapshot=structuredClone(run.enemy);snapshot.name='Electrokinesis Body';snapshot.power=structuredClone(electro);snapshot.statuses={};snapshot.ultimate=100;
 const victimSlots=Object.fromEntries(test.La(snapshot).filter(action=>[5,6,7,8].includes(Number(action.slot))).map(action=>[Number(action.slot),action]));
 const expectedNames=['Lightning Bolt','Arc Current','Overload'];
 assert.deepEqual([victimSlots[5]?.name,victimSlots[6]?.name,victimSlots[7]?.name],expectedNames,'victim live action surface does not expose Electrokinesis M1-M3');
 assert.equal(victimSlots[8]?.name,'Thunder God','Electrokinesis live Ultimate fixture changed');
 const captured=test.RIFT_V366_CAPTURE_BORROWED_ACTIONS(snapshot);
 assert.deepEqual(captured.map(action=>action.name),expectedNames,'V36.6 failed to capture the victim live slots 5-7');
 assert.deepEqual(captured.map(action=>Number(action.slot)),[5,6,7]);

 let promoted=null;
 globalThis.__RIFTBOUND_ACTIVE_RUN__=run;
 globalThis.__RIFTBOUND_REACT_RUN_SETTER__=value=>{promoted=typeof value==='function'?value(run):value};
 assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,snapshot,null,'floor-clear wraith'),true,'could not begin floor-clear Electrokinesis Takeover');
 await Promise.resolve();await Promise.resolve();
 const state=run.player.statuses.v35Takeover;
 assert.ok(state,'Takeover state disappeared immediately');
 assert.equal(run.player.power.name,'Ruined King','Takeover changed canonical fighter.power away from Ruined King');
 assert.equal(state.identityPower,'Ruined King');
 assert.equal(state.borrowedPower?.name,'Electrokinesis');
 assert.deepEqual(state.borrowedActions?.map(action=>action.name),expectedNames,'Takeover did not persist captured live M1-M3 actions');
 assert.deepEqual(state.borrowedMoves?.map(move=>move.name),expectedNames,'Takeover did not derive borrowed moves from the live action surface');

 const combatSlots=fighter=>Object.fromEntries(test.La(fighter).filter(action=>[5,6,7,8].includes(Number(action.slot))).map(action=>[Number(action.slot),action]));
 let slots=combatSlots(run.player);
 assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name],expectedNames,'Takeover did not project Electrokinesis M1-M3 into player slots 5-7');
 assert.deepEqual([slots[5]?.id,slots[6]?.id,slots[7]?.id],['v366-takeover-m1','v366-takeover-m2','v366-takeover-m3'],'V36.6 live-deck provider does not own the borrowed slots');
 for(const slot of [5,6,7]){assert.equal(slots[slot]?.sourcePower,'Electrokinesis');assert.ok(slots[slot]?.move?.tags?.includes('v366TakeoverLiveDeck'),`slot ${slot} missing V36.6 borrowed tag`)}
 assert.equal(slots[8]?.name,'Heartbreaker','Takeover slot 8 is not Heartbreaker');
 assert.ok(!Object.values(slots).some(action=>action?.name==='Thunder God'),'victim Ultimate Thunder God leaked into Viego Takeover');

 // Full captured action objects are authoritative. Raw borrowedPower/borrowedMoves may disappear during migration and the deck must still work.
 state.borrowedMoves=[];state.borrowedPower.moves=[];
 slots=combatSlots(run.player);
 assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name],expectedNames,'borrowed live actions stopped projecting when raw move storage was absent');
 assert.equal(slots[8]?.name,'Heartbreaker');

 // The floor-clear prompt mutates outside React. V36.6 must publish a cloned run through the real root state setter bridge.
 assert.ok(promoted,'floor-clear Takeover never published a React run update');
 assert.notEqual(promoted,run,'floor-clear Takeover reused the same run object instead of publishing a fresh clone');
 assert.equal(promoted.player.power.name,'Ruined King');
 assert.deepEqual(promoted.player.statuses?.v35Takeover?.borrowedActions?.map(action=>action.name),expectedNames,'React-published run lost the stolen Electrokinesis deck');
 const promotedSlots=combatSlots(promoted.player);
 assert.deepEqual([promotedSlots[5]?.name,promotedSlots[6]?.name,promotedSlots[7]?.name],expectedNames,'React-published player does not render stolen M1-M3');
 assert.equal(promotedSlots[8]?.name,'Heartbreaker');

 test.RIFT_NORMALIZE_FIGHTER_BUILD(run.player);test.RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(run.player);
 slots=combatSlots(run.player);assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name],expectedNames,'normalization destroyed the captured Takeover live deck');assert.equal(run.player.power.name,'Ruined King');assert.equal(slots[8]?.name,'Heartbreaker');
 assert.equal(globalThis.RIFTBOUND_V35?.takeover?.begin,test.RIFT_V35_BEGIN_TAKEOVER,'public Takeover API still points at a stale pre-V36.6 begin function');

 console.log('V36.6 verified: Electrokinesis live M1-M3 are captured/projected while fighter.power stays Ruined King, Thunder God is excluded, and floor-clear Takeover publishes a fresh React run.');
}finally{
 delete globalThis.__RIFT_V366_TEST__;delete globalThis.__RIFTBOUND_REACT_RUN_SETTER__;delete globalThis.__RIFTBOUND_ACTIVE_RUN__;
 await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true});
}
