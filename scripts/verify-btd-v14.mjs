#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const gameRoot=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(gameRoot,'assets/page-F6OuavDb.js');
const cssPath=resolve(gameRoot,'assets/riftbound.css');
const packagePath=resolve(dirname(bundlePath),'package.json');
const testPath=resolve(dirname(bundlePath),'page-btd-v14-test.js');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath));
const bundle=await readFile(bundlePath,'utf8'), css=await readFile(cssPath,'utf8');
for(const needle of [
 '/* Riftbound Beneath The Drowning Update V14 */','gluttony-ring','cursed-promise-ring','pilot-goggles',
 'Aura Accumulation','Mutated Aura Accumulation','v14AaWhisper','v14-pass','v14AirJump','v14FInertia',
 'Whipsaint Breaker','Bloodspore','Repeat','Translucency','Mach Beyond','Maximum Output Full Throttle 200% Mach Beyond',
 'CAUSALITY FRACTURE','THE RESULT ARRIVES FIRST','RIFT_V14_CAN_CRIT','RIFT_V14_ON_CRIT','v14UtilityButton'
])assert.ok(bundle.includes(needle),`missing V14 runtime marker ${needle}`);
for(const needle of ['.v14-utility-strip','.v14-whisper-screen','.v14-mach-handprints','.v14-mach-fists','.v14-mach-cutscene.is-200','.v14-translucent-self','.v14-translucent-hidden','.v14-pilot-icon','.v14-gluttony-icon','.v14-promise-icon'])assert.ok(css.includes(needle),`missing V14 style ${needle}`);
assert.ok(bundle.includes('Array.from({length:alt?32:10}'), '200% Mach Beyond must render 32-fist barrage');
assert.ok(bundle.includes('run.environmentStage=Math.max(run.environmentStage||0,8);run.environmentProgress=100'), '200% Mach must create postgame-scale environmental destruction');
assert.ok(bundle.includes('`causality`,`causal`,`noCounter`,`absolute`'), '200% Mach must be causality-level');
assert.ok(bundle.includes('it===`powers`&&g.filter(e=>!e.codexHidden).map('), 'hidden Mutated AA leaked into Codex');
assert.ok(bundle.includes('wl.filter(e=>!e.move?.tags?.includes(`spardaWeaponSwitch`)&&!e.move?.tags?.includes(`v14UtilityButton`)).map('), 'V14 utilities leaked into main move grid');
assert.ok(bundle.includes('RIFT_V14_BORROWED(action)'), 'Cursed Promise must use explicit borrowed/copied classifier');

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1);
const hook=`globalThis.__RIFT_V14_TEST__={g,d,p,Me,Le,Hr,RIFT_EMPTY_WEAPON,RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_ITEM_CATALOG,RIFT_ITEM,RIFT_ITEM_INSTANCE,RIFT_ITEM_INSTANCES,RIFT_HAS_PASSIVE,La,Y,RIFT_V14_AIR_COST,RIFT_V14_BORROWED,RIFT_V14_CRIT_CHANCE,RIFT_V14_CAN_CRIT,RIFT_V14_MACH_MISSING,RIFT_V14_AA_WHISPER,RIFT_V14_MACH_CUTSCENE,Da,rs,go,vs};`;
const packageExisted=existsSync(packagePath);
try{
 if(!packageExisted)await writeFile(packagePath,'{"type":"module"}\n');
 await writeFile(testPath,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(testPath).href}?v14=${Date.now()}`);
 const api=globalThis.__RIFT_V14_TEST__; assert.ok(api);
 const catalog=api.RIFT_ITEM_CATALOG, legends=catalog.filter(x=>x.rarity==='Legendary'), myths=catalog.filter(x=>x.rarity==='Mythical');
 assert.equal(catalog.length,210);assert.equal(new Set(catalog.map(x=>x.id)).size,210);assert.equal(legends.length,70);assert.equal(myths.length,26);
 const gluttony=api.RIFT_ITEM('gluttony-ring'),promise=api.RIFT_ITEM('cursed-promise-ring'),goggles=api.RIFT_ITEM('pilot-goggles');
 assert.equal(gluttony.rarity,'Epic');assert.equal(gluttony.stats.ap,4);assert.equal(gluttony.lore,'The ring that once belonged to the unreliable coward.');
 assert.equal(promise.rarity,'Legendary');assert.equal(promise.passiveId,'cursedPromise');
 assert.deepEqual(goggles.stats,{energy:4,as:4,ap:4});assert.equal(goggles.passiveId,'endlessLove');
 const aa=api.g.find(x=>x.name==='Aura Accumulation'),mut=api.g.find(x=>x.name==='Mutated Aura Accumulation');
 assert.ok(aa&&mut);assert.equal(aa.rarity,'Common');assert.equal(mut.rollable,false);assert.equal(mut.enemyRollable,false);assert.equal(mut.codexHidden,true);
 assert.deepEqual(aa.moves.map(x=>x.name),['Bone Breaker','Smart Counter','Bone Breaker Rapid','Super Duper Bone Breaker']);
 assert.equal(aa.moves[2].hits,12);assert.ok(aa.moves[2].tags.includes('noItemProc'));
 const race=api.d.find(x=>x.name==='Human')||api.d[0],trait=api.p.find(x=>x.name!=='Stand User')||api.p[0];
 function fighter(power){return api.Hr('V14 Tester',structuredClone(race),structuredClone(trait),structuredClone(power),null,api.RIFT_EMPTY_WEAPON(),api.Le(api.Me))}
 const f=fighter(aa), baseline=api.Y(f,'speed');f.hp=f.maxHp*.1;assert.equal(api.Y(f,'speed'),baseline+4,'Fighting Prowess max threshold wrong');
 const actions=api.La(f);assert.ok(actions.some(x=>x.id==='v14-pass'&&x.move.tags.includes('v14UtilityButton')));
 const hf=fighter(mut);hf.energy=hf.maxEnergy;hf.ultimate=100;const ha=api.La(hf);for(const name of ['Whipsaint Breaker','Repeat','Translucency','Mach Beyond','Air Jump','F-Inertia'])assert.ok(ha.some(x=>x.name.startsWith(name)),`debug/full Haisha missing ${name}`);
 assert.equal(api.RIFT_V14_AIR_COST(hf),4);hf.statuses.v14AirJumpChain=1;assert.equal(api.RIFT_V14_AIR_COST(hf),8);hf.statuses.v14AirJumpChain=5;assert.equal(api.RIFT_V14_AIR_COST(hf),128);
 assert.equal(api.RIFT_V14_BORROWED({id:'power-1',sourcePower:'Native',move:{tags:['physical']}}),false);assert.equal(api.RIFT_V14_BORROWED({id:'mimic-test',move:{tags:[]}}),true);assert.equal(api.RIFT_V14_BORROWED({id:'power-1',move:{tags:['borrowedPower']}}),true);
 hf.statuses.v14FInertia=1;const physical=ha.find(x=>x.name==='Whipsaint Breaker');assert.equal(api.RIFT_V14_CAN_CRIT(hf,physical,physical.move.tags),true);assert.equal(api.RIFT_V14_CRIT_CHANCE(hf,physical,physical.move.tags),1);
 const whisper=api.RIFT_V14_AA_WHISPER({run:{player:{statuses:{}},logs:[]},onCommit(){}});assert.equal(whisper.type,'div');
 const cut=api.RIFT_V14_MACH_CUTSCENE({run:{v14MachCutscene:{id:'x',kind:'mach200',attacker:'A',target:'B'}}});assert.equal(cut.type,'div');
 // Action smoke: energy spending, counter interception, Translucency pick immunity, F-Inertia, Pass, and the hidden Floor 5 voice.
 const live=fighter(aa),run=api.Da(live);run.player.energy=run.player.maxEnergy;let smart=api.La(run.player).find(x=>x.name==='Smart Counter'),e0=run.player.energy;api.rs(run,'player',smart);assert.equal(run.player.energy,e0-10);assert.equal(run.player.statuses.v14SmartCounter,1);let enemyHp=run.enemy.hp;api.go(run,run.enemy,run.player,40,false,['physical','scalingAS']);assert.ok(run.enemy.hp<enemyHp);assert.equal(run.player.statuses.v14SmartCounter,undefined);
 const full=fighter(mut),fullRun=api.Da(full);fullRun.player.energy=fullRun.player.maxEnergy;let translucent=api.La(fullRun.player).find(x=>x.name==='Translucency'),tEnergy=fullRun.player.energy;api.rs(fullRun,'player',translucent);assert.equal(fullRun.player.energy,tEnergy-24);assert.equal(fullRun.player.statuses.v14Translucent,1);let selfHp=fullRun.player.hp;api.go(fullRun,fullRun.enemy,fullRun.player,30,false,['physical','melee']);assert.equal(fullRun.player.hp,selfHp);let inertia=api.La(fullRun.player).find(x=>x.name.startsWith('F-Inertia')),iEnergy=fullRun.player.energy;api.rs(fullRun,'player',inertia);assert.equal(fullRun.player.statuses.v14FInertia,true);assert.equal(fullRun.player.energy,iEnergy-14);let pass=api.La(fullRun.player).find(x=>x.id==='v14-pass');api.rs(fullRun,'player',pass);assert.equal(fullRun.player.statuses.v14PassedTurn,fullRun.turn);
 const voice=fighter(aa),voiceRun=api.Da(voice);voiceRun.floor=5;voiceRun.enemy.hp=0;voiceRun.boss=true;api.vs(voiceRun);assert.equal(voiceRun.phase,'v14AaWhisper');assert.equal(voiceRun.player.statuses.v14VoiceOffered,1);
 console.log(`BTD V14 verified: ${catalog.length} items, ${legends.length} Legendaries, Aura Accumulation + hidden Haisha route, utility pass, item hooks, and 200% Mach presentation.`);
} finally {
 delete globalThis.__RIFT_V14_TEST__; await rm(testPath,{force:true}); if(!packageExisted)await rm(packagePath,{force:true});
}
