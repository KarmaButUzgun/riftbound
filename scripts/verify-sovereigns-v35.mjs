#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
const cssPath=resolve(root,'assets/riftbound.css');
const borkPortraitPath=resolve(root,'assets/v35-bork-portrait.webp');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V35 build output missing');
assert.ok(existsSync(borkPortraitPath),'V35.1 BORK authored portrait missing');
const [bundle,css]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8')]);
for(const marker of ['Riftbound Sovereigns of Ruin V35','RIFT_V35_RUINED_POWER','RIFT_V35_UNSHACKLED_POWER','RIFT_V35_RAGEGOD_POWER','RIFT_V35_HIJACK_ADAPTER','RIFT_V35_BATTLEFIELD_FX','RIFT_V35_RESOURCE_DOCK','RIFTBOUND_V35','o=RIFT_V35_BALANCE_DAMAGE(e,t,n,o,a);','RIFT_V35_AFTER_RAW_DAMAGE(e,t,n,l,a)','RIFT_V35_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}','Riftbound Sovereigns Hotfix V35.1','RIFT_V351_REWRITE_ACTIONS','RIFT_V351_PICK_ULTIMATE','v351FreeHeartbreaker','v35-bork-portrait.webp'])assert.ok(bundle.includes(marker),`V35 bundle marker missing: ${marker}`);
for(const marker of ['--rift-v35-marker:35','.v35-battlefield-fx','.v35-world.harrow','.v35-world.wraith','.kind-heartbreaker','.kind-viego-q','.kind-spectral-maw','.kind-chain-lash','.v35-actor-aura.ragegod','#rift-v35-takeover-prompt','.map-fighter.v35-harrow-hidden','.kind-hijacked-judgement','--rift-v351-marker:351','.v351-bork-portrait','.v351-hijack-cinematic','.v351-hijack-chain','.v351-stolen-core'])assert.ok(css.includes(marker),`V35 CSS marker missing: ${marker}`);

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1,'V35 export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v35-test.js');
const packagePath=resolve(dirname(bundlePath),'package.json');
const hadPackage=existsSync(packagePath);
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V35_TEST__={RIFT_ITEM,RIFT_V35_AI_SLOTS,RIFT_V35_BALANCE_DAMAGE,RIFT_V35_EXPECTED_HASH,RIFT_V35_CONSTITUTION,RIFT_V351_PICK_ULTIMATE,RIFT_V351_REWRITE_ACTIONS,RIFT_V351_HIJACK_RANGE,RIFT_V351_ABDUCT_RANGE,Tt,g};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.RIFTBOUND_V35,manifest=globalThis.RIFTBOUND_MANIFEST,codex=globalThis.RIFTBOUND_CODEX,test=globalThis.__RIFT_V35_TEST__,preservation=globalThis.RIFTBOUND_PRESERVATION;
 assert.ok(api&&manifest&&codex&&test&&preservation,'V35 globals failed to initialize');
 assert.equal(api.version,35);assert.equal(manifest.schemaVersion,35);assert.equal(manifest.release,'V35 · Sovereigns of Ruin');
 assert.deepEqual(api.report().powers,['Ruined King','The Unshackled','Ragegod']);
 assert.equal(api.report().newDisplayedTechniques,13);assert.equal(api.report().catalogMoves,268);
 assert.equal(manifest.codex.displayedMoves,268);assert.equal(manifest.v35.takeoverTurns,5);assert.equal(manifest.v35.wrathTurns,5);assert.equal(manifest.v35.buildGuides,true);
 assert.equal(api.hotfix?.version,'35.1');assert.equal(manifest.v35.hotfix,'35.1');assert.equal(api.hotfix.hijackRange,36);assert.equal(api.hotfix.abductRange,30);assert.equal(api.hotfix.takeoverPoolSafe,true);assert.equal(api.hotfix.heartbreakerOwnsUltimateSlot,true);assert.equal(api.hotfix.hijackIgnoresVictimCharge,true);assert.equal(api.hotfix.abductReplacesAbscond,true);assert.equal(manifest.v35.borkPortrait,true);

 const ruined=api.powers.ruinedKing,unshackled=api.powers.unshackled,ragegod=api.powers.ragegod;
 assert.equal(ruined.rarity,'Legendary');assert.deepEqual(ruined.moves.map(move=>move.name),['Blade of the Ruined King','Spectral Maw','Harrowed Path','Heartbreaker']);
 assert.equal(unshackled.rarity,'Legendary');assert.deepEqual(unshackled.moves.map(move=>move.name),['Chain Lash','Kingslayer','Abscond','Hijack']);
 assert.ok(!unshackled.moves[3].tags.includes('selfCast'),'Hijack must not remain self/global cast');assert.ok(unshackled.moves[3].tags.includes('target'),'Hijack must target an enemy');
 const hijackTargeting=test.Tt({move:unshackled.moves[3]},unshackled);assert.equal(hijackTargeting.shape,'target');assert.equal(hijackTargeting.range,36);assert.equal(hijackTargeting.requiresAim,true);
 const abductTargeting=test.Tt({move:api.abduct},unshackled);assert.equal(abductTargeting.range,30);assert.equal(abductTargeting.requiresAim,true);
 assert.equal(ragegod.rarity,'Calamity');assert.equal(ragegod.enemyRollable,false);assert.deepEqual(ragegod.moves.map(move=>move.name),['Wind Up','Crush','Barrage','Wrath of the Undying']);
 const superStrength=test.g.find(power=>power.name==='Super Strength');assert.ok(superStrength,'Super Strength missing');assert.deepEqual(ragegod.moves.slice(0,3).map(move=>move.name),superStrength.moves.slice(0,3).map(move=>move.name),'Ragegod must inherit Super Strength 1/2/3 exactly');
 assert.deepEqual(ragegod.moves.slice(0,3).map(move=>move.rageCost),[0,18,24]);

 const bork=test.RIFT_ITEM('blade-ruined-king');assert.ok(bork,'Blade of The Ruined King item missing');assert.equal(bork.rarity,'Legendary');assert.equal(bork.category,'Weapon');assert.equal(bork.price,980);assert.deepEqual(bork.recipe,['riftsteel-sabre','duelist-grip']);assert.equal(bork.combineCost,810,'BORK combine cost must follow Riftbound price-minus-direct-components recipe economics');assert.equal(bork.cooldown,3);assert.match(bork.passive,/9%/);assert.match(bork.passive,/10%/);assert.match(bork.passive,/Clawing Shadows/i);assert.match(bork.passive,/30%/);

 const catalog=codex.catalog();assert.equal(catalog.totals.moves,268);for(const name of ['Ruined King','The Unshackled','Ragegod']){const profile=codex.profile(name);assert.ok(profile,`${name} Codex profile missing`);for(const move of profile.moves){assert.ok(move.preview?.explicit&&!move.preview?.fallback,`${name} · ${move.name} preview fallback`);assert.ok(move.tactical?.explicit,`${name} · ${move.name} tactical contract missing`);assert.ok(move.battlefieldVfx,`${name} · ${move.name} V34-compatible VFX descriptor missing`)}}
 const sylasProfile=codex.profile('The Unshackled');assert.ok(sylasProfile.moves.some(move=>move.name==='Abduct'),'Abduct recast missing from Codex');

 const sylas={name:'Sylas',power:unshackled,statuses:{},ultimate:50};const enemyA={name:'Enemy A',power:{name:'Test Power'}};assert.equal(api.hijack.cost(sylas,enemyA),50);sylas.statuses.v35HijackedTargets={'Enemy A|Test Power':1};assert.equal(api.hijack.cost(sylas,enemyA),100,'repeat Hijack on same enemy must require 100%');assert.equal(api.hijack.cost(sylas,{name:'Enemy B',power:{name:'Other'}}),50,'fresh enemy must remain stealable at 50%');
 const zeroChargeUlt={id:'dummy-ult',slot:8,moveIndex:3,type:'ultimate',name:'Thunder God',move:{name:'Thunder God',tags:['ultimate']}};assert.equal(api.hotfix.pickUltimate([zeroChargeUlt])?.name,'Thunder God','Hijack selection must be independent from victim Ultimate charge');assert.ok(!String(api.hijack.available).includes('kr(target'),'Hijack availability must not consult victim Ultimate readiness');

 const takeoverFighter={power:{name:'Electro'},statuses:{v35OriginalPower:'Ruined King',v35Takeover:{remaining:5}}};const takeoverActions=api.hotfix.rewriteActions(takeoverFighter,[{id:'strike',slot:1,name:'Strike',type:'special',move:{tags:[]}},{id:'borrowed-ult',slot:8,moveIndex:3,name:'Thunder God',type:'special',move:{tags:['allEnergy']}}]);assert.equal(takeoverActions.filter(action=>Number(action.slot)===8).length,1,'Takeover must expose exactly one slot-8 action');assert.equal(takeoverActions.find(action=>Number(action.slot)===8)?.name,'Heartbreaker');assert.ok(!takeoverActions.some(action=>action.name==='Thunder God'),'borrowed Ultimate leaked through Takeover');assert.ok(takeoverActions.find(action=>action.name==='Heartbreaker')?.move?.tags?.includes('v351FreeHeartbreaker'));
 const abscondActions=api.hotfix.rewriteActions({power:unshackled,statuses:{v35AbductWindow:2}},[{id:'abscond',slot:7,moveIndex:2,name:'Abscond',type:'special',move:{tags:['v35Abscond']}},{id:'v35-abduct',slot:7.5,name:'Abduct',type:'special',move:{tags:['v35Abduct']}}]);assert.equal(abscondActions.length,1,'Abduct must replace Abscond instead of creating a second button');assert.equal(abscondActions[0].slot,7);assert.equal(abscondActions[0].name,'Abduct');assert.ok(abscondActions[0].move.tags.includes('v35Abduct'));
 const beginSource=String(api.takeover.begin);assert.match(beginSource,/RIFT_V351_APPLY_POOL_STATE/);assert.ok(beginSource.indexOf('RIFT_NORMALIZE_FIGHTER_BUILD(fighter)')<beginSource.lastIndexOf('fighter.hp=Math.max'),'Takeover HP percentage must be applied after pool normalization');

 const target={maxHp:5000,hp:5000},basic={statuses:{riftItemActionType:'strike'}};const compressed=test.RIFT_V35_BALANCE_DAMAGE({},basic,target,32000,[]);assert.ok(compressed<=3100&&compressed>1900,`32k Strike compression drifted: ${compressed}`);assert.equal(test.RIFT_V35_BALANCE_DAMAGE({},basic,target,32000,['causality']),32000,'causality must bypass ordinary burst compression');
 assert.equal(test.RIFT_V35_AI_SLOTS({name:'Wamuu',power:{name:'Wind'}},10,true),3);assert.equal(test.RIFT_V35_AI_SLOTS({name:'All For One',power:{name:'All For One'}},50,true),6);assert.equal(test.RIFT_V35_AI_SLOTS({name:'Floor Ten Grunt'},10,false),2);assert.equal(test.RIFT_V35_AI_SLOTS({name:'Floor Ten Boss'},10,true),3);

 const constitution=preservation.assert();assert.ok(constitution.ok,'V35 constitution assertion failed');assert.equal(constitution.baseHash,'7598b438');assert.deepEqual(constitution.counts,{abilities:61,moves:237});assert.equal(constitution.expected,test.RIFT_V35_EXPECTED_HASH);assert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod']);
 assert.equal(globalThis.RIFTBOUND_TACTICAL_GRAMMAR.report().version,33,'V33 tactical foundation must remain available');assert.equal(globalThis.RIFTBOUND_BATTLEFIELD_VFX.version,34,'V34 general VFX grammar must remain available beneath V35');
 console.log(`V35.1 verified: Viego Takeover HP/Heartbreaker, targeted charge-independent Hijack, in-slot 30m Abduct, authored BORK portrait, and the original V35 release contracts are certified; constitution ${constitution.actual}.`);
} finally {delete globalThis.__RIFT_V35_TEST__;await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true})}
