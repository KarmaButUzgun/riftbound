#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),'V36.5 built output missing');
const bundle=await readFile(bundlePath,'utf8');
for(const marker of ['RIFTBOUND_V36_5','RIFT_V365_ENFORCE_TAKEOVER_IDENTITY','RIFT_V365_BEGIN_TAKEOVER','RIFT_V365_TAKEOVER_ACTION','v365-takeover-m1','takeoverIdentityStable'])assert.ok(bundle.includes(marker),`V36.5 marker missing: ${marker}`);

const exportMarker='export{xs as default};',instrumented=resolve(dirname(bundlePath),'page-v365-test.js'),packagePath=resolve(dirname(bundlePath),'package.json'),hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V36.5 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V365_TEST__={Ur,Da,Me,Le,d,g,RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_V35_RUINED_POWER,RIFT_V35_BEGIN_TAKEOVER,RIFT_V35_RESTORE_TAKEOVER,RIFT_V36_ENFORCE_HEARTBREAKER,RIFT_V365_ENFORCE_TAKEOVER_IDENTITY,Qo,La,rs};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v365=${Date.now()}`);
 const test=globalThis.__RIFT_V365_TEST__,api=globalThis.RIFTBOUND_V36_5,manifest=globalThis.RIFTBOUND_MANIFEST;
 assert.ok(test&&api&&manifest,'V36.5 runtime did not initialize');
 assert.equal(api.version,'36.5');assert.equal(api.takeoverIdentityStable,true);assert.equal(api.identityPower,'Ruined King');assert.deepEqual(api.borrowedSlots,[5,6,7]);assert.equal(api.heartbreakerSlot,8);assert.equal(manifest.v36.hotfix,'36.5');assert.equal(manifest.v36.takeoverIdentityStable,true);

 const trait={name:'None',rarity:'Common',description:''};
 const player=test.Ur('Viego identity fixture',test.d[0],trait,'Ruined King',null,null,test.Le(test.Me)).fighter;
 const run=test.Da(player,test.Me);
 const borrowedPower=test.g.find(power=>power?.name==='Electro'&&power?.moves?.length>=4)||test.g.find(power=>power?.name!=='Ruined King'&&power?.moves?.length>=4);
 assert.ok(borrowedPower,'no four-move power available for Takeover fixture');
 const snapshot=structuredClone(run.enemy);snapshot.name='Borrowed Body';snapshot.power=structuredClone(borrowedPower);snapshot.statuses={};
 const borrowedNames=borrowedPower.moves.slice(0,3).map(move=>move.name),borrowedUltimate=borrowedPower.moves[3]?.name;
 const kingNames=test.RIFT_V35_RUINED_POWER.moves.map(move=>move.name);
 const combatSlots=fighter=>Object.fromEntries(test.La(fighter).filter(action=>Number(action.slot)>=5&&Number(action.slot)<=8).map(action=>[Number(action.slot),action]));

 // The core invariant: Takeover never changes fighter.power. Borrowed techniques are only an active-loadout overlay.
 assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,snapshot,null,'V36.5 identity test'),true,'could not begin V36.5 Takeover fixture');
 assert.equal(run.player.power.name,'Ruined King','Takeover replaced the player power identity with the stolen body');
 assert.equal(run.player.statuses.v35Takeover?.identityPower,'Ruined King');
 assert.equal(run.player.statuses.v35Takeover?.borrowedPower?.name,borrowedPower.name,'borrowed power was not stored inside Takeover state');
 assert.deepEqual(run.player.statuses.v35Takeover?.borrowedMoves?.map(move=>move.name),borrowedNames,'borrowed M1-M3 were not stored separately from fighter.power');
 let slots=combatSlots(run.player);
 assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name],borrowedNames,'Takeover did not project stolen M1-M3 into slots 5-7');
 assert.equal(slots[8]?.name,'Heartbreaker','Takeover slot 8 is not Viego Heartbreaker');
 assert.ok(!borrowedUltimate||!Object.values(slots).some(action=>action?.name===borrowedUltimate),'stolen-body Ultimate leaked into Takeover');
 assert.equal(slots[5]?.sourcePower,borrowedPower.name);assert.equal(slots[6]?.sourcePower,borrowedPower.name);assert.equal(slots[7]?.sourcePower,borrowedPower.name);

 // Normalization/save paths are where V36 used to reconstruct the victim as fighter.power. They must now preserve Viego identity.
 test.RIFT_NORMALIZE_FIGHTER_BUILD(run.player);
 assert.equal(run.player.power.name,'Ruined King','normalization reconstructed the stolen power as player identity');
 slots=combatSlots(run.player);assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name],borrowedNames,'borrowed M1-M3 disappeared after normalization');assert.equal(slots[8]?.name,'Heartbreaker');

 // Every possessed owner turn keeps identity Ruined King. Turn five removes only the shell/overlay and restores Viego's own M1-M4.
 for(let turn=1;turn<=4;turn++){
  test.Qo(run,run.player);
  assert.equal(run.player.power.name,'Ruined King',`Takeover turn ${turn} changed fighter.power away from Ruined King`);
  assert.equal(run.player.statuses.v35Takeover?.remaining,5-turn,`Takeover turn ${turn} remaining count drifted`);
  const live=combatSlots(run.player);assert.deepEqual([live[5]?.name,live[6]?.name,live[7]?.name],borrowedNames,`borrowed M1-M3 drifted on Takeover turn ${turn}`);assert.equal(live[8]?.name,'Heartbreaker');
 }
 test.Qo(run,run.player);
 assert.ok(!run.player.statuses.v35Takeover,'Takeover survived owner turn five');assert.equal(run.player.power.name,'Ruined King');
 slots=combatSlots(run.player);assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name,slots[8]?.name],kingNames,'expiry did not restore Viego M1-M4');

 // Heartbreaker must remove the shell immediately while fighter.power remains Ruined King before and after the cast.
 assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,snapshot,null,'V36.5 Heartbreaker test'),true);
 assert.equal(run.player.power.name,'Ruined King');const heart=combatSlots(run.player)[8];assert.equal(heart?.name,'Heartbreaker');
 test.rs(run,'player',heart,{attacker:run.player,target:run.enemy,actorId:'player',targetId:'enemy',tone:'player'});
 assert.ok(!run.player.statuses.v35Takeover,'Heartbreaker did not remove the borrowed shell');assert.equal(run.player.power.name,'Ruined King','Heartbreaker exit changed canonical Viego identity');
 slots=combatSlots(run.player);assert.deepEqual([slots[5]?.name,slots[6]?.name,slots[7]?.name,slots[8]?.name],kingNames,'Heartbreaker did not restore Viego M1-M4');

 // Migrate the exact legacy failure shape: persisted victim power + Takeover state with no borrowedPower field.
 assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,snapshot,null,'V36.5 legacy migration seed'),true);
 const legacy=structuredClone(run.player);const legacyState=legacy.statuses.v35Takeover;delete legacyState.borrowedPower;delete legacyState.borrowedMoves;legacy.power=structuredClone(borrowedPower);
 test.RIFT_V36_ENFORCE_HEARTBREAKER(legacy);
 assert.equal(legacy.power.name,'Ruined King','legacy Takeover migration still persists the victim as fighter.power');assert.equal(legacy.statuses.v35Takeover.borrowedPower?.name,borrowedPower.name);assert.deepEqual(legacy.statuses.v35Takeover.borrowedMoves?.map(move=>move.name),borrowedNames);

 console.log(`V36.5 verified: fighter.power stays Ruined King through Takeover, ${borrowedPower.name} M1-M3 are loadout-only slots 5-7, Heartbreaker/turn-five remove the shell, and legacy victim-power saves self-migrate.`);
}finally{delete globalThis.__RIFT_V365_TEST__;await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true})}
