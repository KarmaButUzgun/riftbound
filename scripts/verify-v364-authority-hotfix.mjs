#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V36.4 built output missing');
const [bundle,css]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8')]);
for(const marker of ['RIFTBOUND_V36_4','RIFT_V364_REFRESH_ITEM_POOLS','RIFT_V364_TURN_END','RIFT_V364_HEARTBREAKER_ACTION','RIFT_V364_RESOLVE'])assert.ok(bundle.includes(marker),`V36.4 marker missing: ${marker}`);
assert.ok(css.includes('v363SwoonPixelSweep')&&css.includes('#rift-v36-swoon.slash i{animation:v363SwoonPixelSweep'),'SWOON sweep animation disappeared');
assert.ok(!css.includes('transform:translate(-20%,-50%) rotate(1deg) scaleX(.15)!important;transform-origin:100% 50%!important;opacity:0!important}'),'SWOON animated transform/opacity are still locked by !important');
assert.ok(css.includes('transform:translate(-20%,-50%) rotate(1deg) scaleX(.15);transform-origin:100% 50%!important;opacity:0}'),'SWOON base pose is not animation-overridable');

const exportMarker='export{xs as default};',instrumented=resolve(dirname(bundlePath),'page-v364-test.js'),packagePath=resolve(dirname(bundlePath),'package.json'),hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V36.4 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V364_TEST__={Ur,Da,Me,Le,d,RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_REFRESH_ITEM_POOLS,oo,Qo,rs,La,RIFT_V35_BEGIN_TAKEOVER,RIFT_V35_RESTORE_TAKEOVER,RIFT_V364_HEARTBREAKER_ACTION};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v364=${Date.now()}`);
 const test=globalThis.__RIFT_V364_TEST__,api=globalThis.RIFTBOUND_V36_4,manifest=globalThis.RIFTBOUND_MANIFEST;
 assert.ok(test&&api&&manifest,'V36.4 runtime did not initialize');
 assert.equal(api.version,'36.4');assert.equal(api.durabilityPoolIdempotent,true);assert.equal(api.takeoverTurnAuthority,true);assert.equal(api.heartbreakerExitLiveBody,true);assert.equal(api.swoonVisible,true);assert.equal(manifest.v36.hotfix,'36.4');

 // Reproduce the production fresh-run bug through the real fighter constructor and real new-run path.
 const trait={name:'None',rarity:'Common',description:''};
 const fighter=test.Ur('V36.4 HP fixture',test.d[0],trait,'Ruined King',null,null,test.Le(test.Me)).fighter;
 const constructorMax=fighter.maxHp;
 assert.equal(fighter.hp,constructorMax,'fighter constructor did not begin full');
 const run=test.Da(fighter,test.Me);
 assert.equal(run.player.hp,run.player.maxHp,'fresh run normalization spawned below displayed max HP');
 assert.equal(run.player.maxHp,constructorMax,'fresh run unexpectedly changed final max HP');
 assert.ok(Number(run.player.v35DurabilityHp||0)>0,'fixture did not exercise the V35 Durability HP contribution');

 // Pure normalization must preserve actual missing HP, and debug-style full HP must survive the normalization that follows debug mutations.
 const maxHp=run.player.maxHp;
 run.player.hp=maxHp-100;test.RIFT_NORMALIZE_FIGHTER_BUILD(run.player);assert.equal(run.player.hp,maxHp-100,'repeated build normalization silently removed current HP');
 test.RIFT_NORMALIZE_FIGHTER_BUILD(run.player);assert.equal(run.player.hp,maxHp-100,'second normalization drifted current HP');
 run.player.hp=run.player.maxHp;test.RIFT_NORMALIZE_FIGHTER_BUILD(run.player);assert.equal(run.player.hp,run.player.maxHp,'debug-style Full HP is undone by build normalization');
 run.player.hp=run.player.maxHp-150;test.oo(run.player,75);const healed=run.player.hp;test.RIFT_NORMALIZE_FIGHTER_BUILD(run.player);assert.equal(run.player.hp,healed,'ordinary healing is lost on the next normalization pass');

 // Takeover expiry must use the live owner-turn run rather than a stale global snapshot.
 const snapshot=structuredClone(run.enemy);
 assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,snapshot,null,'V36.4 expiry test'),true,'could not begin Takeover expiry fixture');
 assert.equal(run.player.statuses.v35Takeover?.remaining,5);
 for(let turn=1;turn<=4;turn++){test.Qo(run,run.player);assert.equal(run.player.statuses.v35Takeover?.remaining,5-turn,`Takeover turn ${turn} did not decrement exactly once`)}
 test.Qo(run,run.player);assert.ok(!run.player.statuses.v35Takeover,'Takeover survived its fifth owner turn');assert.equal(run.player.power.name,'Ruined King','Viego did not regain his own body after five owner turns');

 // Heartbreaker must cash out the live body after its attack resolves, regardless of resolver cloning/reference changes.
 assert.equal(test.RIFT_V35_BEGIN_TAKEOVER(run,run.player,snapshot,null,'V36.4 Heartbreaker test'),true,'could not begin Heartbreaker fixture');
 const heart=test.La(run.player).find(action=>action.name==='Heartbreaker'&&Number(action.slot)===8);
 assert.ok(heart,'Takeover Heartbreaker missing from authoritative slot 8');assert.ok(test.RIFT_V364_HEARTBREAKER_ACTION(heart),'Heartbreaker action identity is not recognized by V36.4');
 test.rs(run,'player',heart,{attacker:run.player,target:run.enemy,actorId:'player',targetId:'enemy',tone:'player'});
 assert.ok(!run.player.statuses.v35Takeover,'Heartbreaker resolved but Viego remained in the stolen body');assert.equal(run.player.power.name,'Ruined King','Heartbreaker did not restore Viego after resolution');

 console.log('V36.4 verified: fresh-run HP starts full and stays healable, Durability pool normalization is idempotent, Takeover expires on owner turn five, Heartbreaker ejects the live body, and SWOON slash animation is visible.');
}finally{delete globalThis.__RIFT_V364_TEST__;await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true})}
