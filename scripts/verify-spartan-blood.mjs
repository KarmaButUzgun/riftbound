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
const instrumentedPath = resolve(dirname(bundlePath), "page-spartan-blood-test.js");
if (!existsSync(bundlePath) || !existsSync(cssPath)) throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);

const bundle = await readFile(bundlePath, "utf8");
const css = await readFile(cssPath, "utf8");
for (const marker of [
  "Spartan Blood", "Human of Sparta", "Devil of Sparta", "Rebellion", "Ebony & Ivory", "Yamato", "Beowulf", "Mirage Edge", "Sparda",
  "RIFT_SPARTAN_ON_HIT", "RIFT_SPARTAN_RESOLVE_ACTION", "RIFT_SPARTAN_REFORGE", "RIFT_SPARTAN_JUDGEMENT_CUT",
  "SMOKIN' SEXY STYLE", "Where Is Your Motivation?", "Judgement Cut", "THREE WEAPON SLOTS",
  "RIFT_COMBAT_LOADOUT_HUD", "YOUR LOADOUT", "ITEM INTEL HIDDEN",
]) assert.ok(bundle.includes(marker), `production bundle is missing ${marker}`);
for (const marker of [
  ".spartan-resource-dock", ".devil-combo-resource", ".spartan-weapon-rack", ".sparda-anatomy", ".devil-wing",
  ".sparda-cinematic", ".sparda-judgement-field", ".spartan-inventory", ".rarity-mythical", ".sparda-flight",
  ".taunt-pose-", ".sparda-ebony-shot", ".sparda-sparda-wave", ".sparda-over-here",
  ".combat-loadout-hud", ".combat-loadout-rail", ".floor-anomaly-core",
]) assert.ok(css.includes(marker), `production stylesheet is missing ${marker}`);
assert.ok(bundle.includes("RIFT_SPARTAN_EXECUTE_EARLY(e,i,a,n"), "combat resolver does not route Spartan state actions");
assert.ok(bundle.includes("RIFT_SPARTAN_PREPARE_ATTACK(e,i,a,n,h,g,_"), "combat resolver does not prepare weapon-dependent attacks");
assert.ok(bundle.includes("RIFT_SPARTAN_RESOLVE_ACTION(e,i,a,n,{hit:le&&!ue"), "Combo progression is not separated from hit procs");
assert.ok(bundle.includes("let n=.0025+Y(t,`regeneration`)*.00135"), "regeneration does not use the single effective-stat path");
assert.ok(bundle.includes("wl.filter(e=>!e.move?.tags?.includes(`spardaWeaponSwitch`)).map"), "Spartan switch actions still render in the action-card grid");
assert.ok(bundle.includes("RIFT_CURSED_ULTIMATE=C.find(e=>e?.id===`ultimate`)"), "Cursed Child still relies on a positional Ultimate action");
assert.ok(css.includes(".devil-wing.right{left:auto;right:53%;transform-origin:100% 50%}"), "battlefield Devil Trigger right wing is not mirrored from the body centerline");
assert.ok(css.includes(".cinematic-wing.right{left:auto;right:51%;transform-origin:100% 50%}"), "cinematic Devil Trigger right wing is not mirrored from the body centerline");

const exportMarker = "export{xs as default};";
assert.equal(bundle.split(exportMarker).length - 1, 1, "could not identify the production export marker");
const hook = `globalThis.__RIFTBOUND_SPARTAN_TEST__={
  d,p,g,Me,Le,Hr,La,Y,Va,Ha,Ua,Nt,go,rs,Tt,Pn,
  RIFT_ITEM,RIFT_ITEM_INSTANCE,RIFT_ITEM_STAT_BONUS,RIFT_NORMALIZE_FIGHTER_BUILD,RIFT_NORMALIZE_RUN_BUILD,RIFT_SPEND_SKILL_POINT,RIFT_BUY_ITEM,
  RIFT_SPARTAN_IS,RIFT_SPARTAN_STATE,RIFT_SPARTAN_EQUIPPED_WEAPONS,RIFT_SPARTAN_ACTIVE_ID,RIFT_SPARTAN_REFORGE,RIFT_SPARTAN_REFORGE_COST,
  RIFT_SPARTAN_ACTIONS,RIFT_SPARTAN_GAIN_FLAIR,RIFT_SPARTAN_PREPARE_ATTACK,RIFT_SPARTAN_ON_HIT,RIFT_SPARTAN_RESOLVE_ACTION,
  RIFT_SPARTAN_EXECUTE_EARLY,RIFT_SPARTAN_TURN_START,RIFT_SPARTAN_TURN_END,RIFT_SPARTAN_BARRAGE_TICK,RIFT_SPARTAN_BLOCK_REASON,RIFT_SPARTAN_SWITCH_WEAPON,
  RIFT_SPARTAN_AI_CHOICE,
  RIFT_SPARTAN_RESOURCE_DOCK,RIFT_SPARTAN_CINEMATIC,RIFT_SPARTAN_MODEL,RIFT_SPARTAN_WEAPON_IDS,
  RIFT_COMBAT_LOADOUT_RAIL,RIFT_COMBAT_LOADOUT_HUD,qr
};`;

const packageExisted = existsSync(packagePath);
try {
  if (!packageExisted) await writeFile(packagePath, '{"type":"module"}\n');
  await writeFile(instrumentedPath, bundle.replace(exportMarker, hook + exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?test=${Date.now()}`);
  const api = globalThis.__RIFTBOUND_SPARTAN_TEST__;
  assert.ok(api, "runtime hook did not initialize");

  const race = api.d.find((entry) => entry.name === "Spartan Blood");
  const humanPower = api.g.find((entry) => entry.name === "Human of Sparta");
  const devilPower = api.g.find((entry) => entry.name === "Devil of Sparta");
  assert.equal(race.rarity, "Mythic");
  assert.equal(humanPower.rarity, "Mythic");
  assert.equal(devilPower.rarity, "Mythic");
  assert.equal(humanPower.rarityLabel, "Mythical");
  assert.equal(devilPower.rarityLabel, "Mythical");

  const ids = api.RIFT_SPARTAN_WEAPON_IDS;
  const weaponIds = Object.values(ids);
  assert.equal(new Set(weaponIds).size, 6);
  for (const id of weaponIds) assert.ok(api.RIFT_ITEM(id), `missing Spartan weapon ${id}`);
  assert.equal(api.RIFT_ITEM(ids.rebellion).rarity, "Epic");
  assert.equal(api.RIFT_ITEM(ids.ebony).rarity, "Legendary");
  assert.equal(api.RIFT_ITEM(ids.sparda).rarity, "Mythical");
  assert.equal(api.RIFT_ITEM(ids.yamato).passiveId, "yamatoMovementTheft");

  const trait = api.p.find((entry) => entry.name !== "Stand User") || api.p[0];
  function fighter(name, power) {
    return api.Hr(name, structuredClone(race), structuredClone(trait), structuredClone(power), null, null, api.Le(api.Me));
  }
  function equip(fighter, list) {
    fighter.inventory = Array(6).fill(null);
    list.forEach((id, index) => { fighter.inventory[index] = api.RIFT_ITEM_INSTANCE(id, api.RIFT_ITEM(id).price); });
    api.RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
    return fighter;
  }
  function run(player = fighter("Dante Test", humanPower), enemy = fighter("Vergil Test", devilPower)) {
    enemy.maxHp = 100000; enemy.hp = enemy.maxHp;
    return {
      player, enemy, floor: 12, phase: "combat", shards: 50000, shopOffers: [], itemFeed: [], ownedLegendaries: [],
      auxiliaryCombatants: [], nemeses: [], turn: 1, boss: false, elite: false, encounter: { effect: "none" },
      battleMode: "duel", battleLabel: "SPARTAN TEST", playerTeam: "team-wayfarer", enemyTeam: "team-rift", activeTargetId: "enemy",
      environmentStage: 0, environmentProgress: 0, environmentOwner: "system", environmentBreaks: {player:0,enemy:0}, maxEnvironment:0,
      timeState:null,epitaph:null,enemyFuture:[],enemyIntent:null,calamity:null,requiemEncounter:null,lastDamage:0,lastActor:"system",lastEvent:"test",
      battlefield:{width:100,height:64,seed:1,theme:"test",name:"Test",subtitle:"Spartan audit",player:{x:20,y:32},enemy:{x:35,y:32},elevation:{player:0,enemy:0},movement:{player:20,enemy:20},movementMax:{player:20,enemy:20},units:[],features:[],hazards:[],domains:[],frameFields:[],effectEchoes:[],lastImpact:null},
      logs:[],chronicle:[],history:[],routeHistory:[],revealed:[],combatSnapshots:[],combatSnapshotSerial:0,deathLoops:[],erasure:{concepts:[],powers:[]},
      affinities:{force:0,warcraft:0,arcana:0,vitality:0,velocity:0,insight:0},playerLevel:1,playerXp:0,skillPoints:3,
    };
  }
  function collectElements(node, predicate, matches = []) {
    if (Array.isArray(node)) { node.forEach((child) => collectElements(child, predicate, matches)); return matches; }
    if (!node || typeof node !== "object") return matches;
    if (predicate(node)) matches.push(node);
    collectElements(node.props?.children, predicate, matches);
    return matches;
  }

  const ordinaryRace = api.d.find((entry) => entry.name !== "Spartan Blood");
  const cursedPower = api.g.find((entry) => entry.name === "Cursed Child");
  assert.ok(cursedPower, "Cursed Child power is missing from the production registry");
  const cursedChild = api.Hr("Cursed Child Regression", structuredClone(ordinaryRace), structuredClone(trait), structuredClone(cursedPower), null, null, api.Le(api.Me));
  cursedChild.inventory = Array(6).fill(null);
  api.RIFT_NORMALIZE_FIGHTER_BUILD(cursedChild);
  const cursedActions = api.La(cursedChild);
  assert.equal(cursedActions.some((action) => action.id === "weapon"), false, "weaponless Cursed Child unexpectedly retained a weapon action");
  const cursedUltimate = cursedActions.find((action) => action.id === "ultimate");
  assert.ok(cursedUltimate && Number.isFinite(cursedUltimate.cost), "weaponless Cursed Child failed to produce a valid Ultimate action");
  const correctedPowerBuild = api.Hr("Requirement Test", structuredClone(ordinaryRace), structuredClone(trait), structuredClone(humanPower), null, null, api.Le(api.Me));
  assert.equal(correctedPowerBuild.race.name, "Spartan Blood", "Human of Sparta bypassed its Spartan Blood requirement");
  assert.equal(api.RIFT_ITEM_INSTANCE(ids.rebellion, api.RIFT_ITEM(ids.rebellion).price, {reforge:99}).reforge, 5, "new item construction bypassed the Reforge +5 cap");

  const human = equip(fighter("Human", humanPower), [ids.rebellion, ids.ebony, ids.sparda]);
  const humanRun = run(human);
  assert.equal(api.RIFT_SPARTAN_IS(human), true);
  assert.equal(human.inventory.length, 6);
  assert.equal(api.RIFT_SPARTAN_EQUIPPED_WEAPONS(human).length, 3);
  assert.equal(api.RIFT_SPARTAN_ACTIVE_ID(human), ids.rebellion);
  assert.equal(api.RIFT_SPEND_SKILL_POINT(humanRun, "as"), false, "Spartan Blood spent a manual skill point");
  assert.equal(humanRun.skillPoints, 3);

  let hudAction = null;
  const playerRail = api.RIFT_COMBAT_LOADOUT_RAIL({fighter:human,side:"player",hidden:false,onAction:(action) => { hudAction = action; },selectedActionId:null,busy:false});
  const playerSlots = collectElements(playerRail, (node) => node.type === "button" && String(node.props?.className||"").includes("combat-loadout-slot"));
  assert.equal(playerSlots.length, 6, "player combat HUD did not render exactly six item slots");
  assert.equal(playerSlots.filter((slot) => !slot.props.disabled).length, 2, "Spartan HUD did not expose exactly the two inactive equipped weapons");
  playerSlots.find((slot) => !slot.props.disabled).props.onClick();
  assert.ok(hudAction?.move?.tags?.includes("spardaWeaponSwitch"), "Spartan HUD weapon click did not route through the real switch action");
  const armedRail = api.RIFT_COMBAT_LOADOUT_RAIL({fighter:human,side:"player",hidden:false,onAction:()=>{},selectedActionId:hudAction.id,busy:false});
  assert.equal(collectElements(armedRail, (node) => node.type === "button" && String(node.props?.className||"").includes(" armed ")).length, 1, "armed Spartan weapon did not expose a confirm state");
  const hiddenTargetRail = api.RIFT_COMBAT_LOADOUT_RAIL({fighter:humanRun.enemy,side:"enemy",hidden:true,busy:true});
  assert.equal(collectElements(hiddenTargetRail, (node) => node.type === "button").length, 6, "selected-opponent combat HUD did not render six item slots");
  assert.equal(collectElements(hiddenTargetRail, (node) => node.type === "b" && node.props?.className === "hidden-item-glyph").length, 6, "enemy Weapon-intel concealment leaked item slots");
  const combatHud = api.RIFT_COMBAT_LOADOUT_HUD({run:humanRun,opponent:humanRun.enemy,onAction:()=>{},selectedActionId:null,busy:false});
  assert.match(combatHud.props.className, /combat-loadout-hud/, "universal combat loadout HUD did not replace the anomaly-only chip");

  const purchaseRun = run(fighter("Loadout Buyer", humanPower)); purchaseRun.phase = "intermission";
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "iron-edge").slot, 0);
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "duelist-grip").slot, 1);
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "astral-bowstring").slot, 2);
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "hex-barrel").ok, false, "a fourth weapon bypassed the three-slot cap");
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "ward-plate").slot, 3);
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "shadowweave").slot, 4);
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "memory-shard").slot, 5);
  assert.equal(api.RIFT_BUY_ITEM(purchaseRun, "mana-prism").ok, false, "a fourth non-weapon bypassed the three gear slots");
  assert.equal(purchaseRun.player.inventory.length, 6, "Spartan Blood expanded total inventory beyond six slots");
  const xpBefore = human.statXp.as;
  api.qr(human, {as:10});
  assert.equal(human.statXp.as - xpBefore, 15, "Spartan natural Stat XP is not +45%");

  let actions = api.La(human);
  assert.ok(actions.some((action) => action.name === "Taunt"));
  assert.equal(actions.filter((action) => action.id.startsWith("sparda-style-")).length, 3);
  assert.equal(actions.filter((action) => action.id.startsWith("sparda-switch-")).length, 2);
  assert.deepEqual(actions.filter((action) => action.id.startsWith("power-")).map((action) => action.name), ["Backflip", "Let's Rock!", "Over Here!"]);
  const styleMoves = new Map([
    ["Trickster", ["Backflip", "Let's Rock!", "Over Here!"]],
    ["Royal Guard", ["Redirect", "Slam", "Perfect Guard"]],
    ["Swordmaster", ["Slice and Dice", "Thrust", "Cyclone"]],
    ["Gunslinger", ["Bang Bang Bang", "Headshot", "Barrage"]],
  ]);
  for (const [style, names] of styleMoves) {
    api.RIFT_SPARTAN_STATE(human).style = style;
    assert.deepEqual(api.La(human).filter((action) => action.id.startsWith("power-")).map((action) => action.name), names, `${style} did not replace all three visible moves`);
  }
  api.RIFT_SPARTAN_STATE(human).style = "Trickster"; actions = api.La(human);
  assert.equal(api.RIFT_SPARTAN_AI_CHOICE(human, humanRun.enemy).name, "Taunt", "Human of Sparta AI did not build low Flair deliberately");
  const overHereProfile = api.Tt(actions.find((action) => action.name === "Over Here!"), human);
  assert.equal(overHereProfile.requiresAim, true, "Over Here! did not expose its selected AOE targeting mode");
  assert.ok(overHereProfile.range > 0 && overHereProfile.radius >= 10);
  const taunt = actions.find((action) => action.name === "Taunt");
  assert.equal(api.RIFT_SPARTAN_EXECUTE_EARLY(humanRun, human, humanRun.enemy, taunt, {actorId:"player",targetId:"enemy",tone:"player"}), true);
  assert.ok(api.RIFT_SPARTAN_STATE(human).flair > 0);

  human.ultimate = 10;
  api.RIFT_SPARTAN_GAIN_FLAIR(humanRun, human, 100, "verification");
  assert.equal(api.RIFT_SPARTAN_STATE(human).flair, 100);
  assert.equal(api.RIFT_SPARTAN_STATE(human).empowered, true);
  assert.equal(human.ultimate, 45, "full Flair did not grant the large partial Ultimate charge");
  const prepared = api.RIFT_SPARTAN_PREPARE_ATTACK(humanRun, human, humanRun.enemy, {name:"Test Slash",type:"special",move:{tags:["physical"]}}, ["physical"], 1, 1, {actorId:"player",targetId:"enemy"});
  assert.ok(prepared.power > 1);
  assert.ok(prepared.tags.includes("spardaFlairEmpowered"));
  assert.equal(api.RIFT_SPARTAN_STATE(human).flair, 0);

  const triggerHuman = equip(fighter("Trigger Human", humanPower), [ids.rebellion, ids.ebony, ids.sparda]), triggerHumanRun = run(triggerHuman), triggerHumanState = api.RIFT_SPARTAN_STATE(triggerHuman);
  const baseHumanMove3 = api.La(triggerHuman).find((action) => action.id === "power-3");
  api.Ha(triggerHuman, baseHumanMove3); api.Ua(triggerHuman);
  assert.equal(api.Va(triggerHuman, baseHumanMove3), 3, "Human move 3 did not receive its base three-turn cooldown");
  delete triggerHuman.statuses["standardCooldown_spartan-human_2"];
  triggerHumanState.flair = 100; triggerHumanState.empowered = true; triggerHumanState.flairLatched = true; triggerHuman.ultimate = 80;
  const humanTrigger = api.La(triggerHuman).find((action) => action.name === "Devil Trigger"), humanBaseRegen = api.Y(triggerHuman, "regeneration");
  assert.equal(api.RIFT_SPARTAN_EXECUTE_EARLY(triggerHumanRun, triggerHuman, triggerHumanRun.enemy, humanTrigger, {actorId:"player",targetId:"enemy",tone:"player"}), true);
  assert.equal(triggerHumanState.devTrigger.turns, 6, "full Flair did not extend Human Devil Trigger from four to six turns");
  assert.equal(triggerHumanState.flair, 0);
  assert.equal(triggerHuman.flight, true);
  assert.equal(api.Y(triggerHuman, "regeneration"), humanBaseRegen + 6, "Human Devil Trigger did not add six Regeneration tiers");
  const triggeredHumanMove3 = api.La(triggerHuman).find((action) => action.id === "power-3");
  api.Ha(triggerHuman, triggeredHumanMove3); api.Ua(triggerHuman);
  assert.equal(api.Va(triggerHuman, triggeredHumanMove3), 2, "Human Devil Trigger did not shorten move 3 cooldown to two turns");

  const blitzHuman = equip(fighter("Blitz Human", humanPower), [ids.rebellion, ids.ebony, ids.sparda]), blitzRun = run(blitzHuman), overHere = api.La(blitzHuman).find((action) => action.name === "Over Here!");
  overHere.aim = {origin:{x:20,y:32},target:{x:35,y:32},distance:15,range:18,radius:10,shape:"area",contact:true};
  const blitzHpBefore = blitzRun.enemy.hp, blitzHitsBefore = api.RIFT_SPARTAN_STATE(blitzHuman).hitCounters[ids.rebellion] || 0;
  assert.equal(api.RIFT_SPARTAN_EXECUTE_EARLY(blitzRun, blitzHuman, blitzRun.enemy, overHere, {actorId:"player",targetId:"enemy",tone:"player"}), true);
  assert.ok(blitzRun.enemy.hp < blitzHpBefore, "Over Here! did not damage targets inside the selected area");
  assert.equal(api.RIFT_SPARTAN_STATE(blitzHuman).hitCounters[ids.rebellion] - blitzHitsBefore, 5, "Over Here! did not resolve repeated weapon hits");

  const throwHuman = equip(fighter("Throw Human", humanPower), [ids.rebellion, ids.ebony, ids.sparda]), throwRun = run(throwHuman), throwState = api.RIFT_SPARTAN_STATE(throwHuman), thrownUid = throwHuman.inventory[0].uid, letsRock = api.La(throwHuman).find((action) => action.name === "Let's Rock!");
  letsRock.aim = {origin:{x:20,y:32},target:{x:35,y:32},distance:15,range:22,radius:2,shape:"projectile",contact:true};
  api.RIFT_SPARTAN_RESOLVE_ACTION(throwRun, throwHuman, throwRun.enemy, letsRock, {hit:true,critical:false,damage:100,tags:letsRock.move.tags,actorId:"player",targetId:"enemy"});
  assert.equal(throwState.unavailable[thrownUid].mode, "thrown");
  assert.ok(throwHuman.inventory.some((instance) => instance?.uid === thrownUid), "Let's Rock! removed the weapon from the six-slot save inventory");
  throwRun.battlefield.player = {x:35,y:32}; throwRun.turn += 1; api.RIFT_SPARTAN_TURN_START(throwRun, throwHuman);
  assert.equal(throwState.unavailable[thrownUid], undefined, "physically reaching the thrown weapon did not recover it");
  assert.ok(throwHuman.inventory.some((instance) => instance?.uid === thrownUid));

  const baseBonus = api.RIFT_ITEM_STAT_BONUS(human, "as");
  const basePower = human.weapon.power;
  const uid = human.inventory[0].uid;
  const firstCost = api.RIFT_SPARTAN_REFORGE_COST(human, uid);
  const firstForge = api.RIFT_SPARTAN_REFORGE(humanRun, uid);
  assert.equal(firstForge.ok, true);
  assert.equal(human.inventory[0].reforge, 1);
  assert.ok(api.RIFT_SPARTAN_REFORGE_COST(human, uid) > firstCost);
  assert.ok(api.RIFT_ITEM_STAT_BONUS(human, "as") > baseBonus);
  assert.ok(human.weapon.power > basePower);
  for (let level = 1; level < 5; level += 1) assert.equal(api.RIFT_SPARTAN_REFORGE(humanRun, uid).ok, true);
  assert.equal(human.inventory[0].reforge, 5);
  assert.equal(api.RIFT_SPARTAN_REFORGE(humanRun, uid).ok, false, "reforging exceeded the +5 cap");

  humanRun.itemActionSerial += 1;
  const flairBeforeRebellion = api.RIFT_SPARTAN_STATE(human).flair;
  api.RIFT_SPARTAN_ON_HIT(humanRun, human, humanRun.enemy, 30, ["physical", `spardaWeapon:${ids.rebellion}`]);
  assert.ok(api.RIFT_SPARTAN_STATE(human).flair > flairBeforeRebellion, "Rebellion did not restore Flair");

  equip(human, [ids.ebony, ids.rebellion, ids.sparda]);
  assert.ok(api.Pn(human).tags.includes("multi"), "Ebony & Ivory does not resolve as two real hits");
  assert.equal(api.Pn(human).range, 22);
  const twinRun = run(human); twinRun.enemy.maxHp = 100000; twinRun.enemy.hp = 100000;
  const twinAction = api.La(human).find((action) => action.id === "weapon");
  human.statuses.itemCertainLine = 1;
  twinRun.enemy.statuses.noReaction = 1;
  twinAction.aim = {origin:{x:20,y:32},target:{x:35,y:32},distance:15,range:22,radius:2,shape:"projectile",contact:true,blockedBy:null};
  const twinCounterBefore = api.RIFT_SPARTAN_STATE(human).hitCounters[ids.ebony] || 0, twinHpBefore = twinRun.enemy.hp, random = Math.random;
  try { Math.random = () => .5; api.rs(twinRun, "player", twinAction, {attacker:human,target:twinRun.enemy,actorId:"player",targetId:"enemy",tone:"player"}); }
  finally { Math.random = random; }
  assert.ok(twinRun.enemy.hp < twinHpBefore, `Ebony & Ivory failed to resolve through the production combat pipeline: ${JSON.stringify(twinRun.logs.slice(-6))}`);
  assert.equal(api.RIFT_SPARTAN_STATE(human).hitCounters[ids.ebony] - twinCounterBefore, 2, "Ebony & Ivory did not create two independent on-hit components");

  const humanState = api.RIFT_SPARTAN_STATE(human);
  twinRun.battlefield.player = {x:10,y:20}; twinRun.battlefield.enemy = {x:28,y:20};
  humanState.barrage = {direction:{x:1,y:0},range:24,origin:{x:5,y:5},target:{x:29,y:5},turns:3};
  api.RIFT_SPARTAN_BARRAGE_TICK(twinRun, human);
  assert.deepEqual(humanState.barrage.origin, {x:10,y:20}, "Barrage kept firing from its activation point after the user moved");
  assert.deepEqual(humanState.barrage.direction, {x:1,y:0}, "Barrage changed its locked firing direction");

  const devil = equip(fighter("Devil", devilPower), [ids.yamato, ids.beowulf, ids.mirage]);
  const devilRun = run(devil, fighter("Target", humanPower));
  devilRun.enemy.maxHp = 100000; devilRun.enemy.hp = 100000;
  const devilState = api.RIFT_SPARTAN_STATE(devil);
  actions = api.La(devil);
  assert.deepEqual(actions.filter((action) => action.id.startsWith("power-")).map((action) => action.name), ["Bury the Light", "Power of Sparta", "Where Is Your Motivation?"]);
  for (const [weapons, names] of [
    [[ids.yamato, ids.beowulf, ids.mirage], ["Bury the Light", "Power of Sparta", "Where Is Your Motivation?"]],
    [[ids.beowulf, ids.yamato, ids.mirage], ["Uppercut", "Crush", "Destroy"]],
    [[ids.mirage, ids.yamato, ids.beowulf], ["Spectral Sword", "Command", "Soar"]],
    [[ids.rebellion, ids.yamato, ids.beowulf], ["Air Combo", "Heavy Swing", "Blitz"]],
  ]) {
    equip(devil, weapons);
    assert.deepEqual(api.La(devil).filter((action) => action.id.startsWith("power-")).map((action) => action.name), names, `${weapons[0]} did not install its weapon-dependent moveset`);
  }
  equip(devil, [ids.yamato, ids.beowulf, ids.mirage]); actions = api.La(devil);
  const aiDevil = equip(fighter("AI Devil", devilPower), [ids.beowulf, ids.yamato, ids.mirage]), aiDevilState = api.RIFT_SPARTAN_STATE(aiDevil);
  aiDevilState.comboBars = 3;
  assert.match(api.RIFT_SPARTAN_AI_CHOICE(aiDevil, devilRun.enemy).name, /Yamato/, "Devil of Sparta AI did not convert Combo 3 into a contextual Yamato switch");

  const spectralDevil = equip(fighter("Spectral Devil", devilPower), [ids.mirage, ids.yamato, ids.beowulf]), spectralRun = run(spectralDevil), spectralState = api.RIFT_SPARTAN_STATE(spectralDevil), spectralUid = spectralDevil.inventory[0].uid;
  let spectralAction = api.La(spectralDevil).find((action) => action.name === "Spectral Sword");
  spectralAction.aim = {origin:{x:20,y:32},target:{x:35,y:32},distance:15,range:24,radius:2,shape:"projectile",contact:true};
  api.RIFT_SPARTAN_RESOLVE_ACTION(spectralRun, spectralDevil, spectralRun.enemy, spectralAction, {hit:true,critical:false,damage:100,tags:spectralAction.move.tags,actorId:"player",targetId:"enemy"});
  assert.equal(spectralState.unavailable[spectralUid].remaining, 1);
  assert.ok(spectralDevil.inventory.some((instance) => instance?.uid === spectralUid), "Spectral Sword deleted Mirage Edge from inventory");
  spectralRun.turn += 1; api.RIFT_SPARTAN_TURN_START(spectralRun, spectralDevil);
  assert.equal(spectralState.unavailable[spectralUid], undefined, "Spectral Sword did not return after one owner turn");
  assert.ok(spectralDevil.inventory.some((instance) => instance?.uid === spectralUid));
  const mirageSlot = spectralDevil.inventory.findIndex((instance) => instance?.uid === spectralUid);
  if (mirageSlot > 0) [spectralDevil.inventory[0], spectralDevil.inventory[mirageSlot]] = [spectralDevil.inventory[mirageSlot], spectralDevil.inventory[0]];
  api.RIFT_NORMALIZE_FIGHTER_BUILD(spectralDevil);
  spectralAction = api.La(spectralDevil).find((action) => action.name === "Command");
  spectralAction.aim = {origin:{x:20,y:32},target:{x:35,y:32},distance:15,range:24,radius:2,shape:"projectile",contact:true};
  api.RIFT_SPARTAN_RESOLVE_ACTION(spectralRun, spectralDevil, spectralRun.enemy, spectralAction, {hit:true,critical:false,damage:100,tags:spectralAction.move.tags,actorId:"player",targetId:"enemy"});
  spectralRun.turn += 1; api.RIFT_SPARTAN_TURN_START(spectralRun, spectralDevil);
  assert.ok(spectralState.unavailable[spectralUid], "Command returned Mirage Edge before two owner turns");
  spectralRun.turn += 1; api.RIFT_SPARTAN_TURN_START(spectralRun, spectralDevil);
  assert.equal(spectralState.unavailable[spectralUid], undefined, "Command did not return Mirage Edge after two owner turns");
  assert.equal(spectralDevil.inventory[0].uid, spectralUid, "Command did not automatically equip returning Mirage Edge");
  const recover = actions.find((action) => action.name === "Recover"), recoverHpBefore = devil.hp = Math.round(devil.maxHp*.5);
  assert.equal(api.RIFT_SPARTAN_EXECUTE_EARLY(devilRun, devil, devilRun.enemy, recover, {actorId:"player",targetId:"enemy",tone:"player"}), true);
  assert.ok(devil.hp > recoverHpBefore, "Recover did not provide its small HP restoration");
  assert.equal(devil.statuses.spardaRecoverCooldown, 2);
  assert.match(api.RIFT_SPARTAN_BLOCK_REASON(devilRun, recover, devil), /1 owner turn/, "Recover did not present its one-turn cooldown truthfully");
  delete devil.statuses.spardaRecoverCooldown;
  const devilMove1 = actions.find((action) => action.name === "Bury the Light");
  api.Ha(devil, devilMove1); api.Ua(devil);
  assert.equal(api.Va(devil, devilMove1), 1, "Devil move 1 did not receive a real cooldown before Combo unlocks it");
  const multiResult = {hit:true,critical:false,damage:300,tags:["physical","multi",`spardaWeapon:${ids.yamato}`],actorId:"player",targetId:"enemy"};
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, devilMove1, multiResult);
  assert.equal(devilState.comboBars, 1, "one multi-hit ability advanced Combo more than once");
  assert.equal(api.Va(devil, actions.find((action) => action.moveIndex === 0)), 0, "Combo bar 1 did not remove move 1 cooldown");
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, actions.find((action) => action.name === "Power of Sparta"), {...multiResult,damage:400});
  assert.equal(devilState.comboBars, 2);
  const hpBeforeLifesteal = devil.hp = Math.round(devil.maxHp*.5);
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, actions.find((action) => action.name === "Where Is Your Motivation?"), {...multiResult,damage:200});
  assert.ok(devil.hp > hpBeforeLifesteal, "Combo bar 2 lifesteal did not restore HP");
  assert.equal(devilState.comboBars, 3);
  assert.ok(api.La(devil).filter((action) => action.id.startsWith("sparda-switch-")).every((action) => action.move.tags.includes("bonusAction")));
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, actions[0], {hit:false,critical:false,damage:0,tags:["physical"],actorId:"player",targetId:"enemy"});
  assert.equal(devilState.comboBars, 0, "miss did not reset Combo");

  equip(devil, [ids.beowulf, ids.yamato, ids.mirage]); devilState.comboBars = 3;
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, {name:"Non-Yamato chain",type:"weapon",move:{tags:[`spardaWeapon:${ids.beowulf}`]}}, {hit:true,critical:false,damage:100,tags:[`spardaWeapon:${ids.beowulf}`],actorId:"player",targetId:"enemy"});
  assert.equal(devilState.comboBars, 3, "Combo bar 4 appeared without Yamato");
  const yamatoUid = devil.inventory.find((instance) => instance?.itemId === ids.yamato).uid;
  assert.equal(api.RIFT_SPARTAN_SWITCH_WEAPON(devilRun, devil, yamatoUid, true), true);
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, {name:"Yamato chain",type:"weapon",move:{tags:[`spardaWeapon:${ids.yamato}`]}}, {hit:true,critical:false,damage:100,tags:[`spardaWeapon:${ids.yamato}`],actorId:"player",targetId:"enemy"});
  assert.equal(devilState.comboBars, 4, "Yamato did not unlock Combo bar 4");
  const beowulfUid = devil.inventory.find((instance) => instance?.itemId === ids.beowulf).uid;
  assert.equal(api.RIFT_SPARTAN_SWITCH_WEAPON(devilRun, devil, beowulfUid, true), true);
  assert.equal(devilState.comboBars, 3, "switching away from Yamato retained illegal Combo bar 4");

  equip(devil, [ids.yamato, ids.beowulf, ids.mirage]); devilState.comboBars = 0;
  const airComboTargetBaseFlight = devilRun.enemy.flight;
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, {name:"Bury the Light",type:"special",move:{tags:["spardaBuryLight",`spardaWeapon:${ids.yamato}`]}}, {hit:true,critical:false,damage:100,tags:["spardaBuryLight",`spardaWeapon:${ids.yamato}`],actorId:"player",targetId:"enemy"});
  assert.equal(devil.flight, true, "Yamato aerial continuation did not grant the user temporary Flight");
  assert.equal(devilRun.enemy.flight, true, "Yamato launch did not grant the target temporary Flight");
  api.RIFT_SPARTAN_TURN_END(devilRun, devilRun.enemy);
  assert.equal(devilRun.enemy.flight, airComboTargetBaseFlight, "target temporary Flight did not restore its base state");
  api.RIFT_SPARTAN_TURN_END(devilRun, devil);
  assert.equal(devil.flight, true, "user aerial continuation ended during the spent attack turn");
  api.RIFT_SPARTAN_TURN_END(devilRun, devil);
  assert.equal(devil.flight, false, "user aerial continuation persisted beyond the next owner turn");

  devilRun.battlefield.movement.player = 20;
  devilRun.battlefield.movementMax.player = 20;
  devilRun.battlefield.movement.enemy = 20;
  devilRun.battlefield.movementMax.enemy = 20;
  for (let hit = 0; hit < 3; hit += 1) api.RIFT_SPARTAN_ON_HIT(devilRun, devil, devilRun.enemy, 20, ["physical", `spardaWeapon:${ids.yamato}`]);
  assert.equal(devilRun.enemy.statuses.spardaYamatoDebt, 10);
  assert.equal(devilRun.battlefield.movement.player, 20, "Yamato transferred MP before the target's real refresh established the removable amount");
  api.Nt(devilRun, "enemy");
  assert.equal(devilRun.battlefield.movement.enemy, Math.max(0, devilRun.battlefield.movementMax.enemy - 10), "Yamato did not remove the exact stored amount after the target's next refresh");
  assert.equal(devilRun.battlefield.movement.player, 30, "Yamato did not transfer the exact amount actually removed");
  assert.equal(devilRun.enemy.statuses.spardaYamatoDebt, undefined);
  const movementBeforeCappedTheft = devilRun.battlefield.movement.player, cappedReserve = devilRun.battlefield.movementMax.enemy;
  for (let hit = 0; hit < 9; hit += 1) api.RIFT_SPARTAN_ON_HIT(devilRun, devil, devilRun.enemy, 20, ["physical", `spardaWeapon:${ids.yamato}`]);
  assert.equal(devilRun.enemy.statuses.spardaYamatoDebt, cappedReserve, "stacked Yamato triggers reserved more MP than the next turn could lose");
  api.Nt(devilRun, "enemy");
  assert.equal(devilRun.battlefield.movement.enemy, 0);
  assert.ok(Math.abs((devilRun.battlefield.movement.player - movementBeforeCappedTheft) - cappedReserve) < 1e-9, "stacked Yamato triggers transferred more MP than was actually removed");

  equip(devil, [ids.beowulf, ids.yamato, ids.mirage]);
  devilState.hitCounters[ids.beowulf] = 0;
  for (let hit = 0; hit < 3; hit += 1) api.RIFT_SPARTAN_ON_HIT(devilRun, devil, devilRun.enemy, 20, ["physical", `spardaWeapon:${ids.beowulf}`]);
  assert.equal(devilState.beowulfPrimed, true);
  const primedUppercut = api.La(devil).find((action) => action.name === "Uppercut");
  assert.ok(api.Tt(primedUppercut, devil).range >= 24, "Beowulf's primed move remained trapped at melee range");
  const beam = api.RIFT_SPARTAN_PREPARE_ATTACK(devilRun, devil, devilRun.enemy, {name:"Beam Test",type:"special",move:{tags:["physical"]},aim:{target:{x:35,y:32}}}, ["physical"], 1, 1, {targetId:"enemy"});
  assert.ok(beam.tags.includes("spardaBeowulfBeam"));
  assert.equal(devilState.beowulfPrimed, false);

  equip(devil, [ids.mirage, ids.yamato, ids.beowulf]);
  devil.ultimate = 92; devilRun.enemy.ultimate = 20;
  api.RIFT_SPARTAN_RESOLVE_ACTION(devilRun, devil, devilRun.enemy, {name:"Mirage Critical",type:"weapon",move:{tags:[`spardaWeapon:${ids.mirage}`]}}, {hit:true,critical:true,damage:100,tags:[`spardaWeapon:${ids.mirage}`],actorId:"player",targetId:"enemy"});
  assert.equal(devil.ultimate, 100);
  assert.equal(devilRun.enemy.ultimate, 12, "Mirage Edge did not transfer exactly the receiver's remaining capacity");

  equip(devil, [ids.sparda, ids.yamato, ids.beowulf]);
  delete devilRun.enemy.statuses.bleed; devil.statuses.riftLastAimDistance = 12;
  api.RIFT_SPARTAN_ON_HIT(devilRun, devil, devilRun.enemy, 30, ["physical","magic","spardaWave", `spardaWeapon:${ids.sparda}`]);
  assert.equal(devilRun.enemy.statuses.bleed, undefined, "Sparda's long-range wave incorrectly applied close-range Bleed");
  devil.statuses.riftLastAimDistance = 3;
  api.RIFT_SPARTAN_ON_HIT(devilRun, devil, devilRun.enemy, 30, ["physical","spardaClose", `spardaWeapon:${ids.sparda}`]);
  assert.ok(devilRun.enemy.statuses.bleed > 0, "Sparda did not apply Bleed");

  devil.ultimate = 100; devilState.comboBars = 0;
  let trigger = api.La(devil).find((action) => action.name === "Devil Trigger");
  assert.equal(api.RIFT_SPARTAN_EXECUTE_EARLY(devilRun, devil, devilRun.enemy, trigger, {actorId:"player",targetId:"enemy",tone:"player"}), true);
  assert.equal(devilState.devTrigger.turns, 6);
  assert.equal(devil.flight, true);
  const activeDevilTrigger = devilState.devTrigger;
  const baseAs = api.RIFT_NORMALIZE_FIGHTER_BUILD(structuredClone(devil)).tiers.as + api.RIFT_ITEM_STAT_BONUS(devil, "as");
  assert.ok(api.Y(devil, "as") >= baseAs + 3, "Devil Trigger did not add three effective stat tiers");
  devilState.comboBars = 4;
  equip(devil, [ids.yamato, ids.beowulf, ids.mirage]);
  devilState.comboBars = 4; devil.ultimate = 100;
  const judgement = api.La(devil).find((action) => action.name === "Judgement Cut");
  assert.ok(judgement);
  judgement.aim = {origin:{x:20,y:32},target:{x:35,y:32},distance:15,range:48,radius:13,shape:"area",contact:true};
  const hpBeforeJudgement = devilRun.enemy.hp;
  assert.equal(api.RIFT_SPARTAN_EXECUTE_EARLY(devilRun, devil, devilRun.enemy, judgement, {actorId:"player",targetId:"enemy",tone:"player"}), true);
  assert.equal(devilRun.timeState, null, "Judgement Cut did not resume existing Time Stop cleanly");
  assert.ok(devilRun.enemy.hp < hpBeforeJudgement, "Judgement Cut queued no resolved damage");
  assert.equal(devilState.comboBars, 4, "Judgement Cut incorrectly reset Combo progression");
  assert.equal(devilState.devTrigger, activeDevilTrigger, "Judgement Cut ended or replaced the active Devil Trigger");
  assert.equal(devil.ultimate, 0);

  const calmDevil = equip(fighter("Calm Devil", devilPower), [ids.yamato, ids.beowulf, ids.mirage]), calmRun = run(calmDevil, fighter("Calm Target", humanPower)), calmState = api.RIFT_SPARTAN_STATE(calmDevil);
  calmState.comboBars = 4; calmDevil.ultimate = 100;
  const calmJudgement = api.La(calmDevil).find((action) => action.name === "Judgement Cut");
  assert.ok(calmJudgement, "Judgement Cut did not replace the Ultimate slot outside Devil Trigger");
  calmJudgement.aim = {origin:{x:20,y:32},target:{x:35,y:32},distance:15,range:48,radius:13,shape:"area",contact:true};
  const calmHpBefore = calmRun.enemy.hp;
  assert.equal(api.RIFT_SPARTAN_EXECUTE_EARLY(calmRun, calmDevil, calmRun.enemy, calmJudgement, {actorId:"player",targetId:"enemy",tone:"player"}), true);
  assert.ok(calmRun.enemy.hp < calmHpBefore, "Judgement Cut could not execute outside Devil Trigger");
  assert.equal(calmState.devTrigger, null, "Judgement Cut created an implicit Devil Trigger");

  const saved = JSON.parse(JSON.stringify(devilRun));
  saved.player.inventory[0].reforge = 99;
  api.RIFT_NORMALIZE_RUN_BUILD(saved);
  assert.equal(saved.player.inventory.length, 6);
  assert.equal(saved.player.inventory[0].reforge, 5, "save migration did not clamp malformed Reforge data");
  assert.equal(api.RIFT_SPARTAN_RESOURCE_DOCK({fighter:devil}).type, "section");
  devil.statuses.spardaCinematic = {kind:"judgement",title:"JUDGEMENT CUT",subtitle:"Test",ttl:1};
  assert.equal(api.RIFT_SPARTAN_CINEMATIC({fighter:devil}).type, "div");
  assert.equal(api.RIFT_SPARTAN_MODEL({fighter:devil}).type, "div");

  console.log("Spartan Blood runtime verification passed (race, slots, reforging, Flair, styles, Combo, weapon procs, Devil Trigger, and Judgement Cut).");
} finally {
  delete globalThis.__RIFTBOUND_SPARTAN_TEST__;
  await rm(instrumentedPath, { force: true });
  if (!packageExisted) await rm(packagePath, { force: true });
}
