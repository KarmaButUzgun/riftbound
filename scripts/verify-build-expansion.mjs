#!/usr/bin/env node

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const gameRoot = resolve(process.argv[2] || ".build/riftbound-standalone");
const bundlePath = resolve(gameRoot, "assets/page-F6OuavDb.js");
const cssPath = resolve(gameRoot, "assets/riftbound.css");
const packagePath = resolve(dirname(bundlePath), "package.json");
const instrumentedPath = resolve(dirname(bundlePath), "page-build-expansion-test.js");
if (!existsSync(bundlePath) || !existsSync(cssPath)) throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);

const bundle = await readFile(bundlePath, "utf8");
const css = await readFile(cssPath, "utf8");
for (const marker of [
  "RIFTBOUND ARMORY","OPEN ARMORY","RETURN TO FLOOR","armory-viewport","RIFT_ITEM_CATALOG","RIFT_RECIPE_PLAN",
  "RIFT_BUY_ITEM","RIFT_ITEM_OUTGOING","RIFT_ITEM_INCOMING","RIFT_ITEM_PREVENT_DEATH","RIFT_ASSIGN_AI_BUILD",
  "RIFT_SCALING_BADGE","BUILD EXPANSION LAB","Attack Strength","Attack Power","BUILD EXPANSION · FULL CATALOG"
]) assert.ok(bundle.includes(marker), `production bundle is missing ${marker}`);
for (const marker of [".build-expansion-shop",".full-catalog-armory",".armory-viewport",".league-shop-layout",".shop-category-rail",".catalog-icon-grid",".rift-recipe-graph",".rift-inventory-grid",".rift-item-icon",".build-item-vfx"]) assert.ok(css.includes(marker), `production stylesheet is missing ${marker}`);
assert.ok(!bundle.includes("Attack Potency"), "removed Attack Potency terminology survived");
assert.ok(!bundle.includes("label:`Weapon Type`"), "Weapon Type is still a roll wheel");
assert.ok(bundle.includes('role:`dialog`,"aria-modal":true'), "Armory fullscreen shell is not an accessible modal dialog");
assert.ok(bundle.includes('event.key===`Escape`'), "Armory is missing its Escape close path");

const exportMarker = "export{xs as default};";
assert.equal(bundle.split(exportMarker).length - 1, 1, "could not identify production export marker");
const hook = `globalThis.__RIFTBOUND_BUILD_TEST__={
 C,D,c,De,d,p,g,Me,Le,Hr,La,
 RIFT_ITEM_CATALOG,RIFT_ITEM,RIFT_ITEM_INSTANCE,RIFT_ITEM_INSTANCES,RIFT_EMPTY_WEAPON,RIFT_ACTIVE_ITEM,
 RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_NORMALIZE_RUN_BUILD,RIFT_ITEM_STAT_BONUS,RIFT_ITEM_STAT_TOTALS,RIFT_REFRESH_ITEM_POOLS,RIFT_MOVE_ITEM,
 RIFT_RECIPE_PLAN,RIFT_RECIPE_TREE,RIFT_BUY_ITEM,RIFT_SELL_ITEM,RIFT_SHOP_OFFERS,RIFT_ACTION_SCALING,RIFT_SCALING_LABEL,
 RIFT_OFFENSE_TIER,RIFT_DAMAGE_SCALING,RIFT_BEGIN_ITEM_ACTION,RIFT_ITEM_PROC_ONCE,RIFT_ITEM_TRIGGER,RIFT_HAS_PASSIVE,
 RIFT_ASSIGN_AI_BUILD,RIFT_MOVE_AUDIT,RIFT_FILTER_WEAPON_ACTIONS,RIFT_APPLY_COMBAT_STATE,RIFT_PREPARE_COMBAT_ITEMS,
 RIFT_ITEM_ICON,RIFT_RECIPE_NODE,RIFT_RECIPE_VIEW,RIFT_CATALOG_TILE,RIFT_ITEM_DETAIL,RIFT_BUILD_SUMMARY,RIFT_SCALING_BADGE,RIFT_ITEM_INTEL
};`;

const packageExisted = existsSync(packagePath);
try {
  if (!packageExisted) await writeFile(packagePath, '{"type":"module"}\n');
  await writeFile(instrumentedPath, bundle.replace(exportMarker, hook + exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?test=${Date.now()}`);
  const api = globalThis.__RIFTBOUND_BUILD_TEST__;
  assert.ok(api, "runtime hook did not initialize");
  assert.deepEqual(api.C.map(step=>step.id), ["race","trait","power"]);
  assert.ok(api.D.includes("as") && api.D.includes("ap"));
  assert.equal(api.c.as,"Attack Strength"); assert.equal(api.c.ap,"Attack Power");

  const catalog=api.RIFT_ITEM_CATALOG;
  assert.equal(catalog.length,181,`expected 181 items after Itemization Expansion, found ${catalog.length}`);
  assert.equal(new Set(catalog.map(item=>item.id)).size,catalog.length,"item IDs are not unique");
  assert.equal(new Set(catalog.map(item=>item.icon)).size,catalog.length,"item icon identities are not unique");
  assert.deepEqual(new Set(catalog.map(item=>item.category)),new Set(["Weapon","Defense","Armor","Relic","Magic","Physical","Utility"]));
  assert.deepEqual(new Set(catalog.map(item=>item.rarity)),new Set(["Common","Uncommon","Rare","Epic","Legendary","Mythical"]));
  const legendary=catalog.filter(item=>item.rarity==="Legendary"),mythical=catalog.filter(item=>item.rarity==="Mythical");
  assert.equal(legendary.length,67,"expected 67 Legendary items after Itemization Expansion");
  assert.equal(mythical.length,1); assert.equal(mythical[0].id,"sparda-devil-sword");
  assert.equal(new Set(legendary.map(item=>item.passiveId)).size,legendary.length,"Legendary passives must be individually keyed");
  assert.ok(legendary.every(item=>item.recipe.length>=2&&item.passive&&item.lore&&item.reference&&item.cooldown>0),"Legendary definition is incomplete");
  assert.equal(legendary.filter(item=>item.tags?.includes("itemizationExpansion")).length,32,"new Legendary set is not exactly 32");
  assert.ok(catalog.filter(item=>item.reference!=="Riftbound Original").length>=50,"fiction-reference pool is too shallow");
  assert.ok(catalog.filter(item=>item.category==="Weapon").every(item=>item.weapon&&["Physical","Magic","Hybrid"].includes(item.weapon.damageType)),"weapon metadata is incomplete");

  const visiting=new Set(),visited=new Set();
  function auditRecipe(id){if(visited.has(id))return;assert.ok(!visiting.has(id),`cyclic recipe at ${id}`);visiting.add(id);const item=api.RIFT_ITEM(id);assert.ok(item,`missing ${id}`);for(const component of item.recipe){assert.ok(api.RIFT_ITEM(component),`${id} references missing ${component}`);auditRecipe(component)}visiting.delete(id);visited.add(id)}
  catalog.forEach(item=>{auditRecipe(item.id);assert.ok(item.price>0);assert.ok(item.recipe.length===0||item.combineCost>0)});

  function makeFighter(name="Tester",damageType="Physical"){
    const race=api.d.find(entry=>entry.name==="Human")||api.d[0];
    const trait=api.p.find(entry=>entry.name!=="Stand User")||api.p[0];
    const power=structuredClone(api.g.find(entry=>entry.damageType===damageType)||api.g[0]);
    return api.Hr(name,structuredClone(race),structuredClone(trait),power,null,api.RIFT_EMPTY_WEAPON(),api.Le(api.Me));
  }
  function makeRun(player=makeFighter(),enemy=makeFighter("Enemy","Magic")){return{player,enemy,floor:1,phase:"intermission",shards:50000,shopOffers:[],itemFeed:[],ownedLegendaries:[],auxiliaryCombatants:[],nemeses:[],turn:1,boss:false,elite:false,encounter:{effect:"none"},battleMode:"duel",battleLabel:"TEST",playerTeam:"team-wayfarer",enemyTeam:"team-rift",activeTargetId:"enemy",environmentStage:0,environmentProgress:0,environmentOwner:"system",environmentBreaks:{player:0,enemy:0},maxEnvironment:0,timeState:null,epitaph:null,enemyFuture:[],enemyIntent:null,calamity:null,requiemEncounter:null,lastDamage:0,lastActor:"system",lastEvent:"test",battlefield:{width:100,height:64,seed:1,theme:"test",name:"Test",subtitle:"Build audit",player:{x:15,y:32},enemy:{x:85,y:32},elevation:{player:0,enemy:0},movement:{player:20,enemy:20},movementMax:{player:20,enemy:20},units:[],features:[],hazards:[],domains:[],frameFields:[],effectEchoes:[],lastImpact:null},logs:[],chronicle:[],history:[],routeHistory:[],revealed:[],combatSnapshots:[],combatSnapshotSerial:0,deathLoops:[],erasure:{concepts:[],powers:[]}}}

  const fresh=makeFighter();
  assert.equal(fresh.inventory.length,6); assert.ok(fresh.inventory.every(slot=>slot===null)); assert.equal(fresh.weapon.name,"Weaponless");
  assert.equal(api.RIFT_ACTIVE_ITEM(fresh),null); assert.ok(!api.La(fresh).some(action=>action.id==="weapon"));
  assert.equal(api.RIFT_ITEM_ICON({item:catalog[0]}).type,"span");
  assert.equal(api.RIFT_BUILD_SUMMARY({fighter:fresh}).type,"section");
  assert.equal(api.RIFT_ITEM_DETAIL({item:catalog[0],fighter:fresh,plan:api.RIFT_RECIPE_PLAN(fresh,catalog[0].id),onBuy(){}}).type,"aside");
  assert.equal(api.RIFT_RECIPE_NODE({itemId:"riftsteel-sabre",fighter:fresh,onSelect(){},root:true}).type,"div");
  assert.equal(api.RIFT_CATALOG_TILE({item:catalog[0],fighter:fresh,selected:false,recommended:false,onSelect(){}}).type,"button");

  const weaponRun=makeRun(fresh); const weaponBuy=api.RIFT_BUY_ITEM(weaponRun,"iron-edge");
  assert.equal(weaponBuy.ok,true); assert.equal(weaponBuy.slot,0); assert.equal(weaponRun.player.weapon.itemId,"iron-edge");
  assert.ok(api.La(weaponRun.player).some(action=>action.id==="weapon"));

  const recipeRun=makeRun(); recipeRun.player.inventory[0]=api.RIFT_ITEM_INSTANCE("iron-edge",34); recipeRun.player.inventory[1]=api.RIFT_ITEM_INSTANCE("duelist-grip",38); api.RIFT_NORMALIZE_FIGHTER_BUILD(recipeRun.player);
  const plan=api.RIFT_RECIPE_PLAN(recipeRun.player,"riftsteel-sabre"); assert.equal(plan.consumeUids.length,2); assert.ok(plan.cost<api.RIFT_ITEM("riftsteel-sabre").price); assert.equal(api.RIFT_BUY_ITEM(recipeRun,"riftsteel-sabre").ok,true);

  const uniqueRun=makeRun(); const firstLegend=legendary[0]; uniqueRun.player.inventory[1]=api.RIFT_ITEM_INSTANCE(firstLegend.id,firstLegend.price); api.RIFT_NORMALIZE_FIGHTER_BUILD(uniqueRun.player); assert.equal(api.RIFT_RECIPE_PLAN(uniqueRun.player,firstLegend.id).ok,false,"duplicate Legendary recipe allowed");

  const statRun=makeRun(); const baseDur=api.RIFT_ITEM_STAT_BONUS(statRun.player,"durability"); statRun.player.inventory[1]=api.RIFT_ITEM_INSTANCE("siege-plating",62); api.RIFT_NORMALIZE_FIGHTER_BUILD(statRun.player); assert.ok(api.RIFT_ITEM_STAT_BONUS(statRun.player,"durability")>baseDur); api.RIFT_SELL_ITEM(statRun,1); assert.equal(api.RIFT_ITEM_STAT_BONUS(statRun.player,"durability"),baseDur,"sold item stats persisted");

  const actionRun=makeRun(); actionRun.player.inventory[1]=api.RIFT_ITEM_INSTANCE(firstLegend.id,firstLegend.price); api.RIFT_NORMALIZE_FIGHTER_BUILD(actionRun.player); api.RIFT_BEGIN_ITEM_ACTION(actionRun,actionRun.player,{type:"special",name:"Forty Hit Test",move:{tags:["magic"],cost:20}}); assert.equal(api.RIFT_ITEM_PROC_ONCE(actionRun,actionRun.player,firstLegend),true); for(let hit=0;hit<40;hit++)assert.equal(api.RIFT_ITEM_PROC_ONCE(actionRun,actionRun.player,firstLegend),false,"multi-hit action retriggered a passive");

  const physicalAI=makeFighter("Physical AI","Physical"); api.RIFT_ASSIGN_AI_BUILD(physicalAI,12,true); assert.equal(api.RIFT_ITEM_INSTANCES(physicalAI).length,6); assert.ok(api.RIFT_ACTIVE_ITEM(physicalAI));
  const magicAI=makeFighter("Magic AI","Magic"); api.RIFT_ASSIGN_AI_BUILD(magicAI,12,true); assert.ok(api.RIFT_ITEM_STAT_BONUS(magicAI,"ap")>=api.RIFT_ITEM_STAT_BONUS(magicAI,"as"));

  const catalogIds=catalog.map(item=>item.id); assert.deepEqual(api.RIFT_SHOP_OFFERS(1,makeFighter()).map(item=>item.id),catalogIds); assert.deepEqual(api.RIFT_SHOP_OFFERS(50,makeFighter()).map(item=>item.id),catalogIds);
  const audit=api.RIFT_MOVE_AUDIT(); assert.ok(audit.length>=100); assert.ok(audit.every(row=>["AS","AP","Hybrid","Special"].includes(row.scaling)));
  console.log(`Build Expansion runtime verification passed (${catalog.length} items, ${legendary.length} Legendaries, ${audit.length} damaging moves audited).`);
} finally {
  delete globalThis.__RIFTBOUND_BUILD_TEST__;
  await rm(instrumentedPath,{force:true});
  if(!packageExisted) await rm(packagePath,{force:true});
}
