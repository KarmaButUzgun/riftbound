#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V36.3 built output missing');
const [bundle,css]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8')]);
for(const marker of ['RIFTBOUND_V36_3','RIFTBOUND_ACTIVE_LOADOUT','RIFT_ACTIVE_LOADOUT_RESOLVE','RIFT_ACTIVE_LOADOUT_REGISTER','RIFT_V363_IS_TAKEOVER_HEARTBREAKER','RIFT_V363_CLEAR_COMBAT_WOUNDS','RIFT_V363_HEARTBREAKER_CUTSCENE'])assert.ok(bundle.includes(marker),`V36.3 marker missing: ${marker}`);
assert.ok(bundle.includes('Math.max(6,Math.round(damage/Math.max(1,target.maxHp)*75))'),'Rika manifestation gain did not increase to min 6 / scale 75');
assert.ok(!bundle.includes('`weaponDestroyed`,`decayWound`,`symbolEvolved`'),'Decay wound is still persisted between floors');
assert.ok(bundle.includes('e.type===`ultimate`&&(e.move?.tags||[]).includes(`v35Heartbreaker`)){j(!0),RIFT_V363_HEARTBREAKER_CUTSCENE()'),'Heartbreaker still enters the generic Ultimate cinematic path');
for(const marker of ['v363SwoonPixelSweep','image-rendering:pixelated','steps(14,end)','#rift-v363-heartbreaker','v363CinemaDive','v363CinemaImpact','.kind-viego-q','.kind-spectral-maw','.kind-spectral-dash','.v35-world.harrow','.kind-heartbreaker'])assert.ok(css.includes(marker),`V36.3 presentation marker missing: ${marker}`);
assert.ok(!/V36\.3[\s\S]{0,900}border-radius:52% 48%/.test(css),'V36.3 SWOON regressed to the smooth V36.2 arc');

const exportMarker='export{xs as default};',instrumented=resolve(dirname(bundlePath),'page-v363-test.js'),packagePath=resolve(dirname(bundlePath),'package.json'),hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V36.3 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V363_TEST__={RIFT_ACTIVE_LOADOUT_RESOLVE,RIFT_ACTIVE_LOADOUT_SET,RIFT_ACTIVE_LOADOUT_CLEAR,RIFT_V363_CLEAR_COMBAT_WOUNDS,RIFT_V363_IS_TAKEOVER_HEARTBREAKER,RIFT_V35_RESTORE_TAKEOVER,RIFT_V35_RUINED_POWER,RIFT_V35_UNSHACKLED_POWER,oo,rs};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v363=${Date.now()}`);
 const test=globalThis.__RIFT_V363_TEST__,api=globalThis.RIFTBOUND_V36_3,loadout=globalThis.RIFTBOUND_ACTIVE_LOADOUT,manifest=globalThis.RIFTBOUND_MANIFEST;
 assert.ok(test&&api&&loadout,'V36.3 runtime did not initialize');
 assert.equal(api.version,'36.3');assert.equal(api.activeLoadout,1);assert.equal(manifest.v36.hotfix,'36.3');assert.equal(loadout.version,1);assert.equal(typeof loadout.current,'function');

 const takeover={power:{name:'Electro'},statuses:{v35OriginalPower:'Ruined King',v35Takeover:{remaining:4}},activeMoveLoadout:{overrides:{}}};
 const borrowed=[{id:'m1',slot:5,name:'Lightning Bolt',type:'special',move:{tags:['magic']}},{id:'m2',slot:6,name:'Arc Current',type:'special',move:{tags:['magic']}},{id:'m3',slot:7,name:'Overload',type:'special',move:{tags:['magic']}},{id:'victim-ult',slot:8,name:'Thunder God',type:'ultimate',moveIndex:3,move:{tags:['ultimate']}}];
 test.RIFT_ACTIVE_LOADOUT_SET(takeover,8,{id:'bad-runtime-override',name:'Thunder God Again',type:'ultimate',move:{tags:['ultimate']}},'test');
 const possessed=test.RIFT_ACTIVE_LOADOUT_RESOLVE(takeover,borrowed,null).actions;
 assert.deepEqual(possessed.filter(action=>Number(action.slot)===8).map(action=>action.name),['Heartbreaker'],'Takeover does not authoritatively own slot 8');
 assert.ok(!possessed.some(action=>/Thunder God/.test(action.name)),'borrowed Ultimate leaked through the active-loadout registry');
 const heart=possessed.find(action=>action.name==='Heartbreaker');assert.ok(heart.move.tags.includes('v363TakeoverExit'));assert.ok(test.RIFT_V363_IS_TAKEOVER_HEARTBREAKER(takeover,heart));
 assert.match(String(test.rs),/RIFT_V35_RESTORE_TAKEOVER/,'final resolver does not enforce post-Heartbreaker Takeover exit');

 const sylas={power:{name:'The Unshackled'},statuses:{v35AbductWindow:2},activeMoveLoadout:{overrides:{}}};
 const sylasBase=[{id:'abscond',slot:7,name:'Abscond',type:'special',move:{tags:['v35Abscond']}},{id:'old-abduct',slot:7.5,name:'Abduct',type:'special',move:{tags:['v35Abduct']}}];
 const sylasActions=test.RIFT_ACTIVE_LOADOUT_RESOLVE(sylas,sylasBase,null).actions;
 assert.equal(sylasActions.filter(action=>action.name==='Abduct').length,1,'active-loadout layer reintroduced an extra Abduct button');assert.equal(sylasActions.find(action=>action.name==='Abduct').slot,7,'Abduct did not replace M3 in its existing slot');

 const healCase={name:'HP ceiling regression',power:{name:'Test'},maxHp:1100,hp:700,statuses:{decayWound:400,decayPoison:2,decayPoisonPower:2}};
 test.RIFT_V363_CLEAR_COMBAT_WOUNDS(healCase);test.oo(healCase,9999);assert.equal(healCase.hp,1100,'stale combat wound still caps healing below displayed maxHp');assert.equal(healCase.maxHp,1100);

 const tiers={as:5,ap:5,durability:5,speed:5,range:5,iq:5,battleIq:5,combatSkill:5,energy:5,regeneration:5},race={name:'Human'},trait={name:'None'};
 const original={power:structuredClone(test.RIFT_V35_RUINED_POWER),race,trait,tiers:{...tiers},inventory:Array(6).fill(null),weapon:{name:'Weaponless',empty:true},boons:[],stand:null,maxEnergy:100,energy:50,maxHp:1000,ultimate:33,statuses:{},pool:{itemDerived:{hp:0,energy:0,posture:0},v35DurabilityHp:0,maxPosture:120,posture:0,flight:false}};
 const fighter={name:'Viego restore fixture',power:{name:'Electro',moves:[]},race,trait,tiers:{...tiers},inventory:Array(6).fill(null),weapon:{name:'Weaponless',empty:true},boons:[],stand:null,maxEnergy:90,energy:30,maxHp:700,hp:350,ultimate:33,statuses:{v35OriginalPower:'Ruined King',v35Takeover:{remaining:5,original}},itemDerived:{hp:0,energy:0,posture:0},v35DurabilityHp:0,maxPosture:120,posture:0,statXp:{},statCaps:{},itemCooldowns:{}};
 const enemy={name:'Dummy',power:{name:'Dummy'},race,trait,tiers:{...tiers},inventory:Array(6).fill(null),weapon:{name:'Weaponless',empty:true},boons:[],stand:null,maxEnergy:90,energy:30,maxHp:500,hp:500,statuses:{},statXp:{},statCaps:{},itemCooldowns:{}};
 const run={player:fighter,enemy,playerTeam:'p',enemyTeam:'e',turn:1,battlefield:{width:100,height:64,player:{x:10,y:10},enemy:{x:20,y:10},features:[],units:[],movement:{player:20,enemy:20},movementMax:{player:20,enemy:20},elevation:{player:0,enemy:0},effectEchoes:[],v35Fx:[],terrain:[]},auxiliaryCombatants:[],logs:[]};
 assert.equal(test.RIFT_V35_RESTORE_TAKEOVER(run,fighter,'V36.3 verifier'),true);assert.equal(fighter.power.name,'Ruined King');assert.ok(!fighter.statuses.v35Takeover,'restore fixture retained Takeover state');assert.equal(fighter.hp/fighter.maxHp,.5,'Takeover restore did not preserve possessed-body HP percentage');assert.deepEqual(run.battlefield.player,{x:10,y:10},'Takeover restore moved Viego away from the possessed body position');

 console.log('V36.3 verified: authoritative heal ceiling reset, active move loadout, one-shot Takeover Heartbreaker, easier Rika manifestation, pixel SWOON, and upgraded Viego presentation.');
}finally{delete globalThis.__RIFT_V363_TEST__;await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true})}
