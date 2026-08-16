import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(new URL('..',import.meta.url).pathname);
const gameRoot=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(gameRoot,'assets/page-F6OuavDb.js');
const cssPath=resolve(gameRoot,'assets/riftbound.css');
const manifestPath=resolve(root,'_site/riftbound-manifest.json');
for(const path of [bundlePath,cssPath,manifestPath])assert.ok(existsSync(path),`V32 artifact missing: ${path}`);

await import(`${pathToFileURL(bundlePath).href}?verify-v32=${Date.now()}`);
const api=globalThis.RIFTBOUND_RESTLESS_GAMBLER;
const manifest=globalThis.RIFTBOUND_MANIFEST;
const codex=globalThis.RIFTBOUND_CODEX;
const tactical=globalThis.RIFTBOUND_TACTICAL_GRAMMAR;

assert.equal(api?.version,32);
assert.deepEqual(api.constants,{feverMax:6,domainTurns:12,domainCap:18,jackpotTurns:20,jackpotRegen:.08});
assert.equal(api.power.name,'Restless Gambler');
assert.equal(api.power.rarity,'Legendary');
assert.equal(api.power.damageType,'Physical');
assert.deepEqual(api.power.moves.map(move=>move.name),['Chromatic Balls','Train Door','Rough Blast','Private Pure Love Train']);
assert.deepEqual(api.jackpotMoves.map(move=>move.name),['Lucky Shot','Relentless Luck','Fever Punch']);
assert.ok(api.jackpotMoves.every(move=>move.cost===0));

const fighter={name:'V32 Verifier',power:api.power,statuses:{},hp:180,maxHp:180,energy:96,maxEnergy:96,ultimate:100};
const enemy={name:'Training Target',power:manifest.powers.find(power=>power.name!=='Restless Gambler'),statuses:{},hp:180,maxHp:180,energy:96,maxEnergy:96};
const run={turn:1,floor:1,logs:[],player:fighter,enemy,battlefield:{width:120,height:64,units:[],features:[],hazards:[],effectEchoes:[]}};

assert.equal(api.fever(fighter,1),1);
assert.equal(api.fever(fighter,20),6,'Fever must cap at six segments');
api.startDomain(run,fighter);
assert.equal(fighter.statuses.v32Fever,0,'guaranteed Jackpot must consume full Fever');
assert.equal(fighter.statuses.v32DomainTurns,undefined);
assert.equal(fighter.statuses.v32JackpotTurns,20);
assert.equal(fighter.ultimate,0);
assert.equal(fighter.energy,fighter.maxEnergy);
assert.ok(run.logs.some(row=>/MAXIMUM FEVER/i.test(row.text)));
assert.ok(run.logs.some(row=>/JACKPOT/i.test(row.text)));
assert.ok(run.battlefield.effectEchoes.some(effect=>effect.className==='v32-jackpot-awakening'));

const normal={...fighter,statuses:{v32Fever:0},ultimate:100};
const normalRun={...run,turn:2,logs:[],player:normal,battlefield:{...run.battlefield,effectEchoes:[],features:[]}};
api.startDomain(normalRun,normal);
assert.equal(normal.statuses.v32DomainTurns,12);
assert.equal(normal.statuses.v32DomainMoves,0);
assert.equal(normal.statuses.v32JackpotTurns,undefined);
assert.ok(normalRun.battlefield.effectEchoes.some(effect=>effect.className==='v32-love-train-domain'));

normalRun.turn=3;
normalRun.battlefield.features.push({id:'test-door',kind:'wall',label:'Train Door · Opening',position:{x:50,y:30},radius:3.2,solid:true,integrity:82,maxIntegrity:82,mechanic:'v32TrainDoor',ownerId:null,closesAtTurn:3,expiresAtTurn:9,closed:false});
api.processDoors(normalRun);
assert.equal(normalRun.battlefield.features[0].closed,true);
assert.equal(normalRun.battlefield.features[0].solid,true);
assert.match(normalRun.battlefield.features[0].label,/Closed/);

const profile=codex.profile('Restless Gambler');
assert.equal(profile.moves.length,7);
assert.deepEqual(profile.groups.map(group=>group.label),['Technique Array','Jackpot Override']);
assert.ok(profile.moves.every(move=>move.preview?.explicit&&!move.preview?.fallback));
assert.deepEqual(profile.moves.map(move=>move.preview.pattern),['projectile-multi','wall-point-delayed','melee-rising-wave','self-domain','melee-barrage-multi','teleport-strike-area','melee-charge-strike-wave']);
assert.ok(profile.moves.every(move=>move.tactical?.explicit),'V33 must live-type every Restless Gambler technique');
assert.deepEqual(profile.moves.map(move=>move.tactical.id),['ricochet-projectile','closing-construct-trap','rising-launch-strike','gambling-domain','advancing-rough-barrage','blink-slam-shockwave','committed-guardbreak-punch']);
assert.equal(tactical?.version,33);

assert.equal(manifest.schemaVersion,33);
assert.equal(manifest.release,'V33 · Tactical Grammar');
assert.deepEqual(manifest.restlessGambler,{rarity:'Legendary',feverMax:6,domainTurns:12,domainCap:18,jackpotTurns:20,jackpotRegen:.08,tripleMovement:true,infiniteEnergy:true,antiHealCounterplay:true,oneShotCounterplay:true,jackpotMusicSetting:true,baseMoves:['Chromatic Balls','Train Door','Rough Blast','Private Pure Love Train'],jackpotMoves:['Lucky Shot','Relentless Luck','Fever Punch']});
assert.deepEqual(api.constitution(),{ok:true,expected:'3684c969',actual:'3684c969',counts:{abilities:58,moves:225},baseHash:'7598b438',basePreserved:true});
assert.equal(manifest.tacticalGrammar?.version,33);
assert.equal(manifest.tacticalGrammar?.moves,255);
assert.equal(manifest.tacticalGrammar?.fallbacks,0);

const [bundle,css,publishedText]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8'),readFile(manifestPath,'utf8')]);
for(const marker of ['Riftbound Restless Gambler V32','RIFT_V32_START_DOMAIN','RIFT_V32_START_JACKPOT','RIFT_V32_PROCESS_DOORS','RIFT_V32_GAMBLER_HUD','RIFTBOUND_RESTLESS_GAMBLER','RIFT_V16_BUILD_GUIDES[RIFT_V32_POWER_NAME]'])assert.ok(bundle.includes(marker),`bundle missing ${marker}`);
for(const marker of ['--rift-v32-marker','.v32-gambler-hud','.v32-jackpot-awakening','.v32-train-door-slam','.rift-v32-jackpot'])assert.ok(css.includes(marker),`styles missing ${marker}`);
assert.match(bundle,/jackpotMusic/);
assert.match(bundle,/RIFT_V32_JACKPOT_REGEN=\.08/);
assert.ok(!bundle.includes('RIFT_V31_MOVE_VISUAL=RIFT_V311_MOVE_VISUAL'),'broken SVG preview renderer reclaimed the Codex seam');
const published=JSON.parse(publishedText);
assert.equal(published.schemaVersion,33);
assert.deepEqual(published.restlessGambler,manifest.restlessGambler);
assert.equal(published.tacticalGrammar?.version,33);

console.log('Riftbound V32 Restless Gambler verification passed beneath V33: Fever, domain, Jackpot, Train Door, previews, and all seven live tactical types are certified.');
