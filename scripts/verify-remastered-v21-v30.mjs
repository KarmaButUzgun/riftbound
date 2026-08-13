import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(new URL('..',import.meta.url).pathname);
const gameRoot=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(gameRoot,'assets/page-F6OuavDb.js');
const cssPath=resolve(gameRoot,'assets/riftbound.css');
for(const path of [bundlePath,cssPath,resolve(root,'_site/index.html'),resolve(root,'_site/manifest.webmanifest'),resolve(root,'_site/riftbound-sw.js'),resolve(root,'_site/riftbound-icon.svg'),resolve(root,'_site/riftbound-manifest.json')])assert.ok(existsSync(path),`V30 artifact missing: ${path}`);

await import(`${pathToFileURL(bundlePath).href}?verify-v30=${Date.now()}`);
const manifest=globalThis.RIFTBOUND_MANIFEST;
assert.equal(manifest?.schemaVersion,30);
assert.equal(manifest?.release,'V30 · Riftbound Remastered');
assert.deepEqual(manifest.counts,{items:210,powers:50,routes:30,arenas:20,legendary:70,mythical:26});

const preservation=globalThis.RIFTBOUND_PRESERVATION;
assert.equal(preservation?.version,21);
const constitution=preservation.assert();
assert.deepEqual(constitution,{ok:true,expected:'7598b438',actual:'7598b438',counts:{abilities:57,moves:221}});
assert.equal(manifest.preservation.constitutionHash,'7598b438');
assert.equal(manifest.remastered.abilityChanges,0);
const goldenA=preservation.golden('opening',{hp:100},[{type:'strike'}],{hp:82});
const goldenB=preservation.golden('opening',{hp:100},[{type:'strike'}],{hp:82});
assert.deepEqual(goldenA,goldenB,'golden scenario hashing is not deterministic');
preservation.replay.begin('V30-VERIFY');
preservation.replay.record('action',{id:'strike'},{turn:1});
assert.equal(preservation.replay.export().inputs.length,1);
const slot=preservation.saves.create('V30 verification');
assert.equal(preservation.saves.vault().slots[0].id,slot.id);
const exported=preservation.saves.export();
assert.equal(exported.constitutionHash,'7598b438');
assert.throws(()=>preservation.saves.import({...exported,constitutionHash:'wrong'}),/constitution mismatch/);
assert.equal(preservation.saves.remove(slot.id).ok,true);

const core=globalThis.RIFTBOUND_CORE;
assert.equal(core?.version,22);
assert.equal(core.mode,'open-core');
assert.deepEqual(core.registry.validate(),{ok:true,issues:[],counts:{powers:50,items:210,races:24,traits:48}});
assert.equal(core.events.types.length,12);
let observed=null;const unsubscribe=core.events.on('STATE_COMMITTED',event=>observed=event);
core.events.emit('STATE_COMMITTED',{source:'verifier',hash:'fixed'});unsubscribe();
assert.equal(observed.payload.hash,'fixed');
const randomA=core.seeded('same-seed'),randomB=core.seeded('same-seed');
assert.deepEqual(Array.from({length:8},()=>randomA()),Array.from({length:8},()=>randomB()));
assert.equal(core.shadowCompare({a:1,b:2},{b:2,a:1}).ok,true);
assert.equal(typeof core.legacyAdapter.resolve,'function');

const ui=globalThis.RIFTBOUND_INTERFACE;
assert.equal(ui?.version,23);
assert.deepEqual(ui.spaces,['ascension','combat','workshop','system']);
assert.deepEqual(manifest.interface.spaces,['Ascension','Combat','Workshop','System']);
assert.equal(manifest.interface.remappable,true);
assert.equal(manifest.interface.hoverRequired,false);
let prevented=0,stopped=0,routed=null;
const keyEvent=key=>({key,target:{tagName:'BODY'},preventDefault(){prevented+=1},stopImmediatePropagation(){stopped+=1}});
const unroute=ui.input.on('map',detail=>routed=detail);
assert.deepEqual(ui.routeKey(keyEvent('m')),{action:'map',native:true});
assert.equal(routed.native,true);assert.equal(prevented,0);assert.equal(stopped,0);
assert.equal(ui.input.bind('map','q').ok,true);
assert.deepEqual(ui.routeKey(keyEvent('q')),{action:'map',native:false});
assert.equal(routed.native,false);assert.equal(prevented,1);assert.equal(stopped,1);
assert.equal(ui.input.bind('map','m').ok,true);unroute();

const spatial=globalThis.RIFTBOUND_SPATIAL;
const coverage=spatial.coverage();
assert.equal(spatial.version,24);
assert.equal(Object.keys(spatial.types).length,29);
assert.equal(coverage.total,221);
assert.equal(coverage.typed,221);
assert.deepEqual(coverage.untyped,[]);
assert.ok(Object.keys(coverage.counts).length>=20,'spatial vocabulary collapsed into too few visual families');
assert.ok(coverage.rows.some(row=>row.channel==='stand'),'Stand moves are missing from the spatial grammar');
const heavySwing=coverage.rows.find(row=>row.source==='Devil of Sparta'&&row.move==='Heavy Swing');
assert.equal(heavySwing?.type,'arc');
assert.equal(heavySwing?.label,'WEAPON ARC');
assert.equal(heavySwing?.arc,126);
assert.equal(heavySwing?.mechanicsChanged,false);
const constitutionKeys=new Set(preservation.constitution().abilities.flatMap(ability=>ability.moves.map(move=>`${ability.name}:${ability.channel}:${move.index}:${move.name}`)));
const spatialKeys=new Set(coverage.rows.map(row=>`${row.source}:${row.channel}:${row.index}:${row.move}`));
assert.deepEqual(spatialKeys,constitutionKeys,'spatial coverage and ability constitution diverged');

assert.equal(globalThis.RIFTBOUND_ARMORY?.version,25);
assert.deepEqual(globalThis.RIFTBOUND_ARMORY.modes,['build','browse','craft','inventory','favorites']);
assert.equal(typeof globalThis.RIFTBOUND_ARMORY.decision,'function');
assert.equal(typeof globalThis.RIFTBOUND_ARMORY.undoSale,'function');
const armoryFighter={name:'Verifier',power:{...manifest.powers[0],accent:'#63dfcf',glyph:'V'},race:{name:'Human',rarity:'Common'},trait:{name:'Keen Eye',rarity:'Common'},weapon:{name:'Weaponless',empty:true},tiers:{as:8,ap:9,durability:8,speed:9,range:8,iq:8,battleIq:9,combatSkill:9,energy:9,regeneration:7},statXp:{},statCaps:{},statuses:{},inventory:Array(6).fill(null),itemCooldowns:{},itemDerived:{hp:0,energy:0,posture:0},hp:240,maxHp:240,energy:120,maxEnergy:120,posture:0,maxPosture:100,ultimate:0,lastActions:[]};
const wardPlate=core.registry.items.get('ward-plate'),decision=globalThis.RIFTBOUND_ARMORY.decision(armoryFighter,wardPlate,100);
assert.equal(decision.slot,1);assert.equal(decision.affordable,true);
const armoryRun={riftboundSchemaVersion:30,floor:1,turn:1,round:1,phase:'intermission',shards:100,player:armoryFighter,enemy:structuredClone(armoryFighter),auxiliaryCombatants:[],playerTeam:'player',routeChoices:[],shopOffers:[],itemFeed:[],chronicle:[],nemeses:[],history:[],revealed:{},v25Transactions:{lastSale:{id:'sale',at:Date.now(),slot:1,instance:{uid:'exact-instance',itemId:'ward-plate',invested:32},itemId:'ward-plate',refund:19,undone:false}}};
const undo=globalThis.RIFTBOUND_ARMORY.undoSale(armoryRun);
assert.equal(undo.ok,true);assert.equal(undo.slot,1);assert.equal(armoryRun.player.inventory[0],null);assert.equal(armoryRun.player.inventory[1].uid,'exact-instance');assert.equal(armoryRun.shards,81);

assert.equal(globalThis.RIFTBOUND_ASCENSION?.version,26);
assert.equal(globalThis.RIFTBOUND_ASCENSION.milestones.length,6);
assert.equal(Object.keys(globalThis.RIFTBOUND_ASCENSION.tutorial.definitions).length,7);

const presentation=globalThis.RIFTBOUND_PRESENTATION;
assert.equal(presentation?.version,27);
assert.equal(Object.keys(presentation.primitives).length,9);
assert.deepEqual([...manifest.presentation.arenaThemes].sort(),manifest.arenas.map(arena=>arena.theme).sort());
for(const arena of manifest.arenas)assert.equal(presentation.arena({theme:arena.theme}).theme,arena.theme);
assert.equal(presentation.stance({hp:1,maxHp:100,statuses:{},guard:false}),'critical');

const intelligence=globalThis.RIFTBOUND_COMBAT_INTELLIGENCE;
assert.equal(intelligence?.version,28);
assert.deepEqual(intelligence.fairInformation,['visible positions','visible statuses','revealed equipment','performed actions','public resources']);
assert.equal(manifest.combatIntelligence.hiddenDecisionAccess,false);
assert.equal(manifest.combatIntelligence.abilityModifiers,false);

const coop=globalThis.RIFTBOUND_COOP_V29;
assert.equal(coop?.version,29);
assert.equal(coop.protocolVersion,3);
for(const method of ['snapshotExtras','applyIntent','recovery','desync'])assert.equal(typeof coop.bridge[method],'function');
assert.equal(typeof coop.recovery,'function');
assert.equal(typeof coop.desync,'function');
assert.equal(manifest.coop.authority,'host');
assert.equal(manifest.coop.recovery,true);
assert.equal(manifest.coop.desyncDetection,true);

const remastered=globalThis.RIFTBOUND_REMASTERED;
const certification=remastered.certify();
assert.equal(remastered?.version,30);
assert.equal(certification.ok,true);
assert.equal(certification.checks.length,11);
assert.ok(certification.checks.every(check=>check.ok));
assert.equal(certification.compatibility.abilityChanges,0);
assert.equal(certification.compatibility.immutableBase,'v0.3.0');

const [bundle,css,index,sw,publishedText]=await Promise.all([
 readFile(bundlePath,'utf8'),readFile(cssPath,'utf8'),readFile(resolve(root,'_site/index.html'),'utf8'),readFile(resolve(root,'_site/riftbound-sw.js'),'utf8'),readFile(resolve(root,'_site/riftbound-manifest.json'),'utf8'),
]);
for(let version=21;version<=30;version+=1)assert.ok(bundle.includes(`V${version}`),`runtime missing V${version} marker`);
for(const marker of ['--rift-v21-marker','--rift-v23-marker','--rift-v24-marker','--rift-v25-marker','--rift-v26-marker','--rift-v27-marker','--rift-v29-marker','--rift-v30-marker'])assert.ok(css.includes(marker),`styles missing ${marker}`);
assert.match(index,/manifest\.webmanifest/);
assert.match(sw,/riftbound-remastered-v30/);
assert.match(sw,/pathname\.startsWith\('\/api\/'\)/);
const published=JSON.parse(publishedText);
const webManifest=JSON.parse(await readFile(resolve(root,'_site/manifest.webmanifest'),'utf8'));
assert.equal(webManifest.display,'standalone');
assert.equal(webManifest.icons[0].purpose,'any maskable');
assert.equal(published.schemaVersion,30);
assert.equal(published.preservation.constitutionHash,'7598b438');
assert.equal(published.spatialGrammar.moves,221);
assert.equal(published.spatialGrammar.typed,221);
assert.equal(published.remastered.certified,true);

console.log('Riftbound V21-V30 Remastered verification passed: 221/221 abilities preserved and spatially typed.');
