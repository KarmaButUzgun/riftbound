import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(new URL('..',import.meta.url).pathname);
const gameRoot=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(gameRoot,'assets/page-F6OuavDb.js');
const cssPath=resolve(gameRoot,'assets/riftbound.css');
assert.ok(existsSync(bundlePath),'built runtime is missing');
await import(`${pathToFileURL(bundlePath).href}?verify-v20=${Date.now()}`);

const manifest=globalThis.RIFTBOUND_MANIFEST;
assert.equal(manifest?.schemaVersion,20);
assert.equal(manifest?.release,'V20 · Consolidation Arc');
assert.deepEqual(manifest?.counts,{items:210,powers:50,routes:30,arenas:20,legendary:70,mythical:26});
assert.equal(new Set(manifest.items.map(item=>item.id)).size,manifest.items.length,'catalog ids are not unique');
const itemIds=new Set(manifest.items.map(item=>item.id));
for(const item of manifest.items)for(const component of item.recipe)assert.ok(itemIds.has(component),`${item.name} references missing component ${component}`);
assert.ok(manifest.effectPriority.causality>manifest.effectPriority.damage);
assert.ok(manifest.effectPriority.damage>manifest.effectPriority.presentation);
assert.equal(manifest.coop.protocolVersion,2);
assert.equal(manifest.coop.authority,'host');
assert.deepEqual(manifest.accessibility,['reducedMotion','highContrast','largeText','effectDensity']);

const balance=globalThis.RIFTBOUND_BALANCE_LAB;
assert.equal(balance?.version,18);
const audit=balance.audit();
assert.equal(audit.counts.items,210);
assert.ok(audit.counts.moves>=190,'move audit is unexpectedly small');
const firstPower=manifest.powers.find(power=>power.moves.length>=4);
const fighter={
 name:'Verifier',power:{...firstPower,accent:'#6fe2ff',glyph:'V'},race:{name:'Human',rarity:'Common'},trait:{name:'Keen Eye',rarity:'Common'},
 weapon:{name:'Weaponless',empty:true},tiers:{as:8,ap:9,durability:8,speed:9,range:8,iq:8,battleIq:9,combatSkill:9,energy:9,regeneration:7},
 statXp:{},statCaps:{},statuses:{},inventory:Array(6).fill(null),itemCooldowns:{},itemDerived:{hp:0,energy:0,posture:0},
 hp:240,maxHp:240,energy:120,maxEnergy:120,posture:0,maxPosture:100,ultimate:0,lastActions:[],
};
const archetypes=balance.archetypes(fighter);
assert.equal(archetypes.length,3);
for(const path of archetypes){
 assert.equal(path.items.length,6,`${path.name} is not a six-item path`);
 assert.equal(new Set(path.items.map(item=>item.id)).size,6,`${path.name} contains duplicate items`);
 assert.ok(path.items.filter(item=>item.category==='Weapon').length<=1,`${path.name} contains more than one equippable weapon`);
 assert.ok(path.items.filter(item=>item.rarity==='Mythical').length<=1,`${path.name} violates the Mythical cap`);
}

const combat=globalThis.RIFTBOUND_COMBAT_INTELLIGENCE;
assert.equal(combat?.version,19);
assert.ok(['Sentinel','Architect','Conserver','Duelist','Predator','Storm'].includes(combat.personality(fighter).name));
assert.ok(Number.isFinite(combat.actionScore(fighter,{...fighter,hp:80}, {id:'strike',type:'strike',cost:0,move:{power:1,tags:['physical']}})));

const v20=globalThis.RIFTBOUND_V20;
assert.equal(v20?.version,20);
assert.equal(v20.coop.version,20);
assert.equal(v20.accessibility.get().effects,'auto');

const bundle=await readFile(bundlePath,'utf8'),css=await readFile(cssPath,'utf8');
for(const marker of ['Riftbound Foundation Update V17','Riftbound Armory Reforged V17','Riftbound Balance Lab and Adaptive Builds V18','Riftbound Combat Intelligence V19','Riftbound Authority Accessibility and Effects V20'])assert.ok(bundle.includes(marker),`runtime missing ${marker}`);
for(const marker of ['RIFT_V17_ARMORY_MODES','RIFT_V17_VIRTUAL_CATALOG','RIFT_V19_COMBAT_STRIP','RIFT_V20_APPLY_COOP_INTENT','RIFT_V20_ACCESS_PANEL'])assert.ok(bundle.includes(marker),`runtime missing ${marker}`);
for(const marker of ['--rift-v17-marker','--rift-v19-marker','--rift-v20-marker','.rift-reduced-motion','.rift-high-contrast','.rift-fx-low'])assert.ok(css.includes(marker),`styles missing ${marker}`);
const publishedManifest=JSON.parse(await readFile(resolve(root,'_site/riftbound-manifest.json'),'utf8'));
assert.equal(publishedManifest.schemaVersion,20);
assert.deepEqual(publishedManifest.counts,manifest.counts);
console.log('Riftbound V17–V20 consolidation verification passed.');
