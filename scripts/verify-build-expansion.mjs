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
const requiredMarkers = [
  "RIFTBOUND ARMORY",
  "ALL ITEMS · ALWAYS AVAILABLE",
  "COMPONENT TREE",
  "OPEN ARMORY",
  "RETURN TO FLOOR",
  "armory-viewport",
  "RIFT_ITEM_CATALOG",
  "RIFT_RECIPE_PLAN",
  "RIFT_BUY_ITEM",
  "RIFT_ITEM_OUTGOING",
  "RIFT_ITEM_INCOMING",
  "RIFT_ITEM_PREVENT_DEATH",
  "RIFT_ASSIGN_AI_BUILD",
  "RIFT_SCALING_BADGE",
  "BUILD EXPANSION LAB",
  "Attack Strength",
  "Attack Power",
  "RECIPES REMEMBER OWNED COMPONENTS",
];
for (const marker of requiredMarkers) assert.ok(bundle.includes(marker), `production bundle is missing ${marker}`);
assert.ok(!bundle.includes("Attack Potency"), "removed Attack Potency terminology survived");
assert.ok(!bundle.includes("label:`Weapon Type`"), "Weapon Type is still a roll wheel");
assert.ok(!bundle.includes("label:`Weapon`,glyph:`⟊`"), "Weapon is still a roll wheel");
for (const marker of [".build-expansion-shop", ".full-catalog-armory", ".armory-launcher", ".armory-viewport", "html.rift-armory-open", ".league-shop-layout", ".shop-category-rail", ".shop-mobile-tabs", ".catalog-icon-grid", ".rift-recipe-graph", ".rift-inventory-grid", ".rift-item-icon", ".scaling-hybrid", ".build-item-vfx"]) {
  assert.ok(css.includes(marker), `production stylesheet is missing ${marker}`);
}
assert.match(css, /\.armory-viewport\s*\{[^}]*position:\s*fixed[^}]*inset:\s*0[^}]*overflow:\s*hidden/s, "Armory does not own and contain the viewport");
assert.match(css, /\.armory-is-open \.league-shop-layout\s*\{[^}]*min-height:\s*0[^}]*overflow:\s*hidden/s, "Armory workbench can escape its viewport row");
assert.ok(bundle.includes('role:`dialog`,"aria-modal":true'), "Armory fullscreen shell is not an accessible modal dialog");
assert.ok(bundle.includes('event.key===`Escape`'), "Armory is missing its Escape close path");
assert.ok(bundle.includes('classList.add(`rift-armory-open`)'), "Armory does not lock the background document");
assert.ok(bundle.includes('BUILD EXPANSION · FULL CATALOG'), "obsolete rotating-offer count survived in the intermission header");

const exportMarker = "export{xs as default};";
assert.equal(bundle.split(exportMarker).length - 1, 1, "could not identify the production export marker");
const hook = `globalThis.__RIFTBOUND_BUILD_TEST__={
  C,D,c,De,d,p,g,h,Me,Le,Hr,La,
  RIFT_ITEM_CATALOG,RIFT_ITEM,RIFT_ITEM_INSTANCE,RIFT_ITEM_INSTANCES,
  RIFT_EMPTY_WEAPON,RIFT_ACTIVE_ITEM,RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_NORMALIZE_RUN_BUILD,
  RIFT_ITEM_STAT_BONUS,RIFT_ITEM_STAT_TOTALS,RIFT_REFRESH_ITEM_POOLS,RIFT_MOVE_ITEM,
  RIFT_RECIPE_PLAN,RIFT_RECIPE_TREE,RIFT_BUY_ITEM,RIFT_SELL_ITEM,RIFT_SHOP_OFFERS,
  RIFT_ACTION_SCALING,RIFT_SCALING_LABEL,RIFT_OFFENSE_TIER,RIFT_DAMAGE_SCALING,RIFT_BEGIN_ITEM_ACTION,
  RIFT_ITEM_PROC_ONCE,RIFT_ITEM_TRIGGER,RIFT_HAS_PASSIVE,RIFT_ASSIGN_AI_BUILD,RIFT_MOVE_AUDIT,
  RIFT_FILTER_WEAPON_ACTIONS,RIFT_APPLY_COMBAT_STATE,RIFT_PREPARE_COMBAT_ITEMS,
  RIFT_ITEM_ICON,RIFT_RECIPE_NODE,RIFT_RECIPE_VIEW,RIFT_CATALOG_TILE,RIFT_ITEM_DETAIL,RIFT_BUILD_SUMMARY,RIFT_SCALING_BADGE,RIFT_ITEM_INTEL
};`;

const packageExisted = existsSync(packagePath);
try {
  if (!packageExisted) await writeFile(packagePath, '{"type":"module"}\n');
  await writeFile(instrumentedPath, bundle.replace(exportMarker, hook + exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?test=${Date.now()}`);
  const api = globalThis.__RIFTBOUND_BUILD_TEST__;
  assert.ok(api, "runtime hook did not initialize");

  assert.deepEqual(api.C.map((step) => step.id), ["race", "trait", "power"]);
  assert.ok(api.D.includes("as") && api.D.includes("ap"), "AS/AP are not both data-driven stats");
  assert.equal(api.c.as, "Attack Strength");
  assert.equal(api.c.ap, "Attack Power");
  assert.match(api.De.as, /physical/i);
  assert.match(api.De.ap, /supernatural/i);

  const catalog = api.RIFT_ITEM_CATALOG;
  assert.ok(catalog.length >= 115, `catalog is too small: ${catalog.length}`);
  assert.equal(new Set(catalog.map((item) => item.id)).size, catalog.length, "item IDs are not unique");
  assert.equal(new Set(catalog.map((item) => item.icon)).size, catalog.length, "item icon identities are not unique");
  assert.deepEqual(new Set(catalog.map((item) => item.category)), new Set(["Weapon", "Defense", "Armor", "Relic", "Magic", "Physical", "Utility"]));
  assert.deepEqual(new Set(catalog.map((item) => item.rarity)), new Set(["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythical"]));
  const legendary = catalog.filter((item) => item.rarity === "Legendary");
  const mythical = catalog.filter((item) => item.rarity === "Mythical");
  assert.equal(legendary.length, 35, "expected 35 build-defining Legendary items after the Spartan Blood expansion");
  assert.equal(mythical.length, 1, "expected Sparda to define the capped Mythical item tier");
  assert.equal(mythical[0].id, "sparda-devil-sword");
  assert.equal(new Set(legendary.map((item) => item.passiveId)).size, legendary.length, "Legendary passives must be individually keyed");
  assert.ok(legendary.every((item) => item.recipe.length >= 2 && item.passive && item.lore && item.reference && item.cooldown > 0));
  assert.ok(legendary.every((item) => bundle.split(item.passiveId).length - 1 >= 2), "a Legendary passive has catalog text but no runtime hook");
  assert.ok(catalog.filter((item) => item.reference !== "Riftbound Original").length >= 20, "reference item pool is too shallow");
  assert.ok(catalog.filter((item) => item.reference === "Riftbound Original").length >= 50, "original item pool is too shallow");
  assert.ok(catalog.filter((item) => item.category === "Weapon").every((item) => item.weapon && ["Physical", "Magic", "Hybrid"].includes(item.weapon.damageType)));

  const visiting = new Set(), visited = new Set();
  function auditRecipe(id) {
    if (visited.has(id)) return;
    assert.ok(!visiting.has(id), `cyclic recipe at ${id}`);
    visiting.add(id);
    const item = api.RIFT_ITEM(id);
    assert.ok(item, `missing recipe node ${id}`);
    for (const component of item.recipe) { assert.ok(api.RIFT_ITEM(component), `${id} references missing ${component}`); auditRecipe(component); }
    visiting.delete(id); visited.add(id);
  }
  catalog.forEach((item) => { auditRecipe(item.id); assert.ok(item.price > 0); assert.ok(item.recipe.length === 0 || item.combineCost > 0); });

  function makeFighter(name = "Tester", damageType = "Physical") {
    const race = api.d.find((entry) => entry.name === "Human") || api.d[0];
    const trait = api.p.find((entry) => entry.name !== "Stand User") || api.p[0];
    const power = structuredClone(api.g.find((entry) => entry.damageType === damageType) || api.g[0]);
    return api.Hr(name, structuredClone(race), structuredClone(trait), power, null, api.RIFT_EMPTY_WEAPON(), api.Le(api.Me));
  }
  function makeRun(player = makeFighter(), enemy = makeFighter("Enemy", "Magic")) {
    return {
      player, enemy, floor: 1, phase: "intermission", shards: 5000, shopOffers: [], itemFeed: [], ownedLegendaries: [],
      auxiliaryCombatants: [], nemeses: [], turn: 1, boss: false, elite: false, encounter: { effect: "none" },
      battleMode: "duel", battleLabel: "TEST", playerTeam: "team-wayfarer", enemyTeam: "team-rift", activeTargetId: "enemy",
      environmentStage: 0, environmentProgress: 0, environmentOwner: "system", environmentBreaks: {player:0,enemy:0}, maxEnvironment:0,
      timeState:null,epitaph:null,enemyFuture:[],enemyIntent:null,calamity:null,requiemEncounter:null,lastDamage:0,lastActor:"system",lastEvent:"test",
      battlefield:{width:100,height:64,seed:1,theme:"test",name:"Test",subtitle:"Build audit",player:{x:15,y:32},enemy:{x:85,y:32},elevation:{player:0,enemy:0},movement:{player:20,enemy:20},movementMax:{player:20,enemy:20},units:[],features:[],hazards:[],domains:[],frameFields:[],effectEchoes:[],lastImpact:null},
      logs:[],chronicle:[],history:[],routeHistory:[],revealed:[],combatSnapshots:[],combatSnapshotSerial:0,deathLoops:[],erasure:{concepts:[],powers:[]},
    };
  }

  const fresh = makeFighter();
  assert.equal(fresh.inventory.length, 6);
  assert.ok(fresh.inventory.every((slot) => slot === null));
  assert.equal(fresh.weapon.name, "Weaponless");
  assert.equal(api.RIFT_ACTIVE_ITEM(fresh), null);
  assert.ok(!api.La(fresh).some((action) => action.id === "weapon"), "weapon action exists before acquisition");
  assert.equal(api.RIFT_ITEM_ICON({item:catalog[0]}).type,"span","item icon surface failed to construct");
  assert.equal(api.RIFT_BUILD_SUMMARY({fighter:fresh}).type,"section","build summary failed to construct");
  assert.equal(api.RIFT_ITEM_INTEL({fighter:fresh}).type,"div","Battle Intel item surface failed to construct");
  assert.equal(api.RIFT_SCALING_BADGE({action:{type:"strike"},fighter:fresh}).type,"span","scaling badge failed to construct");
  assert.equal(api.RIFT_ITEM_DETAIL({item:catalog[0],fighter:fresh,plan:api.RIFT_RECIPE_PLAN(fresh,catalog[0].id),onBuy(){}}).type,"aside","item detail surface failed to construct");
  assert.equal(api.RIFT_RECIPE_NODE({itemId:"riftsteel-sabre",fighter:fresh,onSelect(){},root:true}).type,"div","interactive recipe node failed to construct");
  assert.equal(api.RIFT_RECIPE_VIEW({item:api.RIFT_ITEM("riftsteel-sabre"),fighter:fresh,onSelect(){}}).type,"section","recipe graph failed to construct");
  assert.equal(api.RIFT_CATALOG_TILE({item:catalog[0],fighter:fresh,selected:false,recommended:false,onSelect(){}}).type,"button","catalog tile failed to construct");

  const weaponRun = makeRun(fresh);
  const weaponBuy = api.RIFT_BUY_ITEM(weaponRun, "iron-edge");
  assert.equal(weaponBuy.ok, true);
  assert.equal(weaponBuy.slot, 0);
  assert.equal(weaponRun.player.weapon.itemId, "iron-edge");
  assert.ok(api.La(weaponRun.player).some((action) => action.id === "weapon"), "equipped weapon did not unlock its action");
  weaponRun.player.inventory[1] = api.RIFT_ITEM_INSTANCE("shadowweave", api.RIFT_ITEM("shadowweave").price);
  assert.equal(api.RIFT_MOVE_ITEM(weaponRun.player, 1, 0).ok, false, "armor entered active weapon slot");
  assert.equal(api.RIFT_MOVE_ITEM(weaponRun.player, 0, 2).ok, true);
  assert.equal(weaponRun.player.weapon.name, "Weaponless");
  assert.ok(!api.La(weaponRun.player).some((action) => action.id === "weapon"));

  const recipeRun = makeRun();
  recipeRun.player.inventory[0] = api.RIFT_ITEM_INSTANCE("iron-edge", 34);
  recipeRun.player.inventory[1] = api.RIFT_ITEM_INSTANCE("duelist-grip", 38);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(recipeRun.player);
  const fullPrice = api.RIFT_ITEM("riftsteel-sabre").price;
  const plan = api.RIFT_RECIPE_PLAN(recipeRun.player, "riftsteel-sabre");
  assert.equal(plan.consumeUids.length, 2);
  assert.ok(plan.cost < fullPrice, "owned components did not reduce smart-build price");
  const shardsBefore = recipeRun.shards;
  const built = api.RIFT_BUY_ITEM(recipeRun, "riftsteel-sabre");
  assert.equal(built.ok, true);
  assert.equal(recipeRun.shards, shardsBefore - plan.cost);
  assert.equal(api.RIFT_ITEM_INSTANCES(recipeRun.player).filter((entry) => entry.itemId === "riftsteel-sabre").length, 1);
  assert.equal(api.RIFT_ITEM_INSTANCES(recipeRun.player).some((entry) => ["iron-edge", "duelist-grip"].includes(entry.itemId)), false, "recipe components were not consumed");

  const exactRun = makeRun();
  const exactCost = api.RIFT_RECIPE_PLAN(exactRun.player, "riftsteel-sabre").cost;
  exactRun.shards = exactCost;
  assert.equal(api.RIFT_BUY_ITEM(exactRun, "riftsteel-sabre").ok, true);
  const inventoryAfterClick = JSON.stringify(exactRun.player.inventory);
  assert.equal(api.RIFT_BUY_ITEM(exactRun, "riftsteel-sabre").ok, false, "repeated purchase succeeded without Shards");
  assert.equal(JSON.stringify(exactRun.player.inventory), inventoryAfterClick, "failed repeat purchase mutated inventory");

  const uniqueRun = makeRun();
  const firstLegend = legendary[0];
  uniqueRun.player.inventory[1] = api.RIFT_ITEM_INSTANCE(firstLegend.id, firstLegend.price);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(uniqueRun.player);
  assert.equal(api.RIFT_RECIPE_PLAN(uniqueRun.player, firstLegend.id).ok, false, "duplicate Legendary recipe was allowed");

  const poolRun = makeRun();
  const baseHp = poolRun.player.maxHp;
  poolRun.player.inventory[1] = api.RIFT_ITEM_INSTANCE("ward-plate", 32);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(poolRun.player);
  assert.ok(poolRun.player.maxHp > baseHp, "Durability item did not update maximum HP immediately");
  const durabilityWithItem = api.RIFT_ITEM_STAT_BONUS(poolRun.player, "durability");
  const sell = api.RIFT_SELL_ITEM(poolRun, 1);
  assert.equal(sell.ok, true);
  assert.equal(sell.refund, Math.floor(32 * 0.6));
  assert.equal(api.RIFT_ITEM_STAT_BONUS(poolRun.player, "durability"), durabilityWithItem - 1);
  assert.equal(poolRun.player.maxHp, baseHp, "selling did not remove derived HP immediately");
  const passiveRun = makeRun(); passiveRun.player.inventory[1] = api.RIFT_ITEM_INSTANCE(firstLegend.id, firstLegend.price); api.RIFT_NORMALIZE_FIGHTER_BUILD(passiveRun.player);
  assert.ok(api.RIFT_HAS_PASSIVE(passiveRun.player, firstLegend.passiveId));
  api.RIFT_SELL_ITEM(passiveRun, 1);
  assert.equal(api.RIFT_HAS_PASSIVE(passiveRun.player, firstLegend.passiveId), null, "sold Legendary passive remained active");

  const modes = [
    [{type:"strike"}, "AS"],
    [{move:{name:"Spell",tags:["magic"]},type:"special"}, "AP"],
    [{move:{name:"Spellblade",tags:["physical","magic"]},type:"special"}, "Hybrid"],
    [{move:{name:"Hazard",tags:["environment"]},type:"special"}, "Special"],
    [{move:{name:"Causal State Edit",tags:["causality","causal"]},type:"special"}, "Special"],
    [{move:{name:"Black Flash",tags:["physical","magic"]},type:"special"}, "Hybrid"],
  ];
  for (const [action, expected] of modes) assert.equal(api.RIFT_ACTION_SCALING(action, makeFighter()).mode, expected);
  assert.match(api.RIFT_SCALING_LABEL(modes[2][0], makeFighter()), /AS \/ .*AP/);
  const physicalHigh = makeFighter(); physicalHigh.tiers.as = 18; physicalHigh.tiers.ap = 2; api.RIFT_BEGIN_ITEM_ACTION(makeRun(physicalHigh), physicalHigh, {type:"strike",name:"Strike"});
  assert.equal(api.RIFT_OFFENSE_TIER(physicalHigh,["physical"]),18);
  assert.equal(api.RIFT_OFFENSE_TIER(physicalHigh,["magic"]),2);
  assert.equal(api.RIFT_OFFENSE_TIER(physicalHigh,["physical","magic"]),10);
  const physicalFactor=api.RIFT_DAMAGE_SCALING(null, physicalHigh, ["physical"]).factor;
  assert.ok(physicalFactor > 1, "AS did not replace legacy AP in physical damage");
  const defense=7,legacyRaw=(26+physicalHigh.tiers.ap*4.5)*1.105**(physicalHigh.tiers.ap-defense),swappedRaw=legacyRaw*physicalFactor,expectedAs=(26+physicalHigh.tiers.as*4.5)*1.105**(physicalHigh.tiers.as-defense);
  assert.ok(Math.abs(swappedRaw-expectedAs)<1e-8,"central source swap did not cancel the legacy AP-shaped raw formula");
  assert.equal(api.RIFT_ACTION_SCALING({tags:["magic","causality"]},physicalHigh).mode,"AP","magical causal damage lost its real power source");
  assert.equal(api.RIFT_ACTION_SCALING({name:"Road Roller",tags:["physical"]},physicalHigh).mode,"AS");
  assert.equal(api.RIFT_ACTION_SCALING({name:"World Cutting Slash",tags:["magic","causality"]},physicalHigh).mode,"AP");

  const actionRun = makeRun();
  const procItem = firstLegend;
  actionRun.player.inventory[1] = api.RIFT_ITEM_INSTANCE(procItem.id, procItem.price);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(actionRun.player);
  api.RIFT_BEGIN_ITEM_ACTION(actionRun, actionRun.player, {type:"special",name:"Forty Hit Test",move:{tags:["magic"],cost:20}});
  assert.equal(api.RIFT_ITEM_PROC_ONCE(actionRun, actionRun.player, procItem), true);
  for (let hit = 0; hit < 40; hit += 1) assert.equal(api.RIFT_ITEM_PROC_ONCE(actionRun, actionRun.player, procItem), false, "multi-hit action retriggered an item proc");

  const physicalAI = makeFighter("Physical AI", "Physical");
  api.RIFT_ASSIGN_AI_BUILD(physicalAI, 12, true);
  assert.equal(api.RIFT_ITEM_INSTANCES(physicalAI).length, 6);
  assert.ok(api.RIFT_ACTIVE_ITEM(physicalAI), "AI did not equip a weapon");
  assert.ok(api.RIFT_ITEM_STAT_BONUS(physicalAI, "as") >= api.RIFT_ITEM_STAT_BONUS(physicalAI, "ap"), "physical AI selected an AP-dominant loadout");
  const magicAI = makeFighter("Magic AI", "Magic"); api.RIFT_ASSIGN_AI_BUILD(magicAI, 12, true);
  assert.ok(api.RIFT_ITEM_STAT_BONUS(magicAI, "ap") >= api.RIFT_ITEM_STAT_BONUS(magicAI, "as"), "magic AI selected an AS-dominant loadout");

  const audit = api.RIFT_MOVE_AUDIT();
  assert.ok(audit.length >= 100, `damaging move audit is too shallow: ${audit.length}`);
  assert.ok(audit.every((row) => ["AS", "AP", "Hybrid", "Special"].includes(row.scaling)), "a damaging move has no explicit scaling class");
  assert.ok(new Set(audit.map((row) => row.scaling)).size >= 3, "move audit collapsed source types together");

  const offerF1 = api.RIFT_SHOP_OFFERS(1, makeFighter());
  const offerF12 = api.RIFT_SHOP_OFFERS(12, makeFighter());
  const offerF50 = api.RIFT_SHOP_OFFERS(50, makeFighter());
  const catalogIds = catalog.map((item) => item.id);
  assert.deepEqual(offerF1.map((item) => item.id), catalogIds, "floor-one shop does not expose the complete catalog");
  assert.deepEqual(offerF12.map((item) => item.id), catalogIds, "mid-run shop differs from the complete catalog");
  assert.deepEqual(offerF50.map((item) => item.id), catalogIds, "late-run shop differs from the complete catalog");
  assert.deepEqual(api.RIFT_SHOP_OFFERS(1, makeFighter()).map((item) => item.id), catalogIds, "shop catalog order is random");
  assert.deepEqual(new Set(offerF1.map((item) => item.rarity)), new Set(api.RIFT_ITEM_CATALOG.map((item) => item.rarity)), "floor-one shop hides item tiers");
  const ownedOfferFighter = makeFighter();
  ownedOfferFighter.inventory[1] = api.RIFT_ITEM_INSTANCE(firstLegend.id, firstLegend.price);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(ownedOfferFighter);
  assert.ok(api.RIFT_SHOP_OFFERS(1, ownedOfferFighter).some((item) => item.id === firstLegend.id), "owned Legendary disappeared from the browsable catalog");
  const legacyOfferRun = makeRun();
  legacyOfferRun.shopOffers = [catalog[0], catalog[1]];
  api.RIFT_NORMALIZE_RUN_BUILD(legacyOfferRun);
  assert.deepEqual(legacyOfferRun.shopOffers, [], "legacy random offers survived save normalization");

  const rewindRun = makeRun();
  rewindRun.phase = "combat";
  rewindRun.player.inventory[1] = api.RIFT_ITEM_INSTANCE("ward-plate", 32);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(rewindRun.player);
  const snapshot = structuredClone({turn:rewindRun.turn,player:rewindRun.player,enemy:rewindRun.enemy,battlefield:rewindRun.battlefield,auxiliaryCombatants:[],activeTargetId:"enemy",battleMode:"duel",battleLabel:"TEST",playerTeam:rewindRun.playerTeam,enemyTeam:rewindRun.enemyTeam,environmentStage:0,environmentProgress:0,environmentOwner:"system",environmentBreaks:{player:0,enemy:0},maxEnvironment:0,timeState:null,epitaph:null,enemyFuture:[],enemyIntent:null,calamity:null,requiemEncounter:null,lastDamage:0,lastActor:"system",lastEvent:"snapshot"});
  rewindRun.player.inventory[2] = api.RIFT_ITEM_INSTANCE("memory-shard", 31);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(rewindRun.player);
  const ownership = rewindRun.player.inventory.map((entry) => entry?.uid || null);
  assert.equal(api.RIFT_APPLY_COMBAT_STATE(rewindRun, snapshot), true);
  assert.deepEqual(rewindRun.player.inventory.map((entry) => entry?.uid || null), ownership, "combat rewind changed permanent item ownership");

  const saved = JSON.parse(JSON.stringify(rewindRun));
  api.RIFT_NORMALIZE_RUN_BUILD(saved);
  assert.equal(saved.player.inventory.length, 6);
  assert.deepEqual(saved.player.inventory.map((entry) => entry?.itemId || null), rewindRun.player.inventory.map((entry) => entry?.itemId || null));
  assert.ok(saved.player.tiers.as >= 0 && saved.player.tiers.ap >= 0);

  console.log(`Build Expansion runtime verification passed (${catalog.length} items, ${legendary.length} Legendary passives, ${audit.length} damaging moves audited).`);
} finally {
  delete globalThis.__RIFTBOUND_BUILD_TEST__;
  await rm(instrumentedPath, { force: true });
  if (!packageExisted) await rm(packagePath, { force: true });
}
