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
const instrumentedPath = resolve(dirname(bundlePath), "page-bizarre-runtime-test.js");

if (!existsSync(bundlePath) || !existsSync(cssPath)) {
  throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);
}

const bundle = await readFile(bundlePath, "utf8");
const css = await readFile(cssPath, "utf8");

const requiredBundleMarkers = [
  "Gold Experience Requiem",
  "King Crimson Requiem",
  "RIFT_REVERT_TO_ZERO",
  "RIFT_MASTER_OF_TIME",
  "RIFT_DEATH_LOOP_REGISTER",
  "RIFT_CREATE_TIME_LOOP",
  "RIFT_MOVE_SOUL",
  "RIFT_REQUIEM_TICK",
  "e.combatSnapshots.length>256",
  "timelineRestoredByKcr=1",
  "directly toward the Body",
  "NEXT TURN ERASED",
  "SUMMON / DISMISS USES YOUR TURN",
];
for (const marker of requiredBundleMarkers) {
  assert.ok(bundle.includes(marker), `production bundle is missing ${marker}`);
}

const requiredCssMarkers = [
  ".stand-gold-experience",
  ".stand-gold-experience-requiem",
  ".stand-king-crimson-requiem",
  ".feature-temporalBarrier",
  ".hazard-temporalGlitch",
  ".map-soul-tether",
  ".requiem-cinematic",
  ".master-time-list",
  ".kcr-turn-erasure",
  ".ger-auto-rtz",
];
for (const marker of requiredCssMarkers) {
  assert.ok(css.includes(marker), `production stylesheet is missing ${marker}`);
}

assert.ok(!bundle.includes(".slice(-24).reverse().map"), "Master still hides older retained turns");
assert.ok(
  !bundle.includes("let s=It(e,i,n);if(!s||s.traveledDistance<=.05"),
  "Soul movement can still wander away from the Body",
);

const exportMarker = "export{xs as default};";
assert.equal(bundle.split(exportMarker).length - 1, 1, "could not identify the production export marker");

const hook = `globalThis.__RIFTBOUND_BIZARRE_TEST__={
  h,
  go,
  RIFT_STAND_TOGGLE_ACTION,
  RIFT_RECORD_SNAPSHOT,
  RIFT_APPLY_COMBAT_STATE,
  RIFT_REVERT_TO_ZERO,
  RIFT_MASTER_OF_TIME,
  RIFT_DEATH_LOOP_REGISTER,
  RIFT_ADVANCE_DEATH_LOOPS,
  RIFT_CREATE_TIME_LOOP,
  RIFT_BREAK_TIME_LOOP,
  RIFT_CREATE_TEMPORAL_GLITCH,
  RIFT_SEPARATE_SOUL,
  RIFT_MOVE_SOUL,
  RIFT_CREATE_LIFEFORM,
  RIFT_SPAWN_SCORPIONS,
  RIFT_REQUIEM_TICK,
  RIFT_CLAIM_REQUIEM_ARROW,
  RIFT_ACCEPT_REQUIEM_ARROW
};`;

const packageExisted = existsSync(packagePath);
try {
  if (!packageExisted) await writeFile(packagePath, '{"type":"module"}\n');
  await writeFile(instrumentedPath, bundle.replace(exportMarker, hook + exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?test=${Date.now()}`);

  const api = globalThis.__RIFTBOUND_BIZARRE_TEST__;
  assert.ok(api, "runtime hook did not initialize");

  const tierKeys = ["ap", "durability", "speed", "range", "iq", "combatSkill", "battleIq", "energy", "regeneration"];

  function fighter(name, standName = null) {
    return {
      name,
      hp: 100,
      maxHp: 100,
      energy: 80,
      maxEnergy: 100,
      ultimate: 60,
      shield: 0,
      posture: 0,
      maxPosture: 100,
      guard: false,
      flight: false,
      spirit: false,
      race: { name: "Human" },
      trait: { name: "Combat Analysis" },
      power: { name: "Test Power", glyph: "T", accent: "#ffffff", moves: [] },
      weapon: { name: "Test Weapon", glyph: "/", tags: [], type: "Weapon" },
      tiers: Object.fromEntries(tierKeys.map((key) => [key, 6])),
      statXp: Object.fromEntries(tierKeys.map((key) => [key, 0])),
      statuses: {},
      resistances: {},
      boons: [],
      devilContracts: [],
      devilHybrid: null,
      supplementalPowers: [],
      activeSupplementalPower: null,
      lastMove: null,
      lastOffense: null,
      lastActions: [],
      combo: 0,
      stand: standName
        ? {
            name: standName,
            summoned: false,
            evolved: false,
            lastTurnUsed: -1,
            timeStopUses: 0,
            posture: 0,
            maxPosture: 100,
            taggedPoint: null,
            rangePenalty: 0,
          }
        : null,
    };
  }

  function run(playerStand = "Gold Experience Requiem", enemyStand = null) {
    return {
      player: fighter("Player", playerStand),
      enemy: fighter("Enemy", enemyStand),
      battlefield: {
        width: 100,
        height: 64,
        seed: 1,
        theme: "ruin",
        name: "Test Arena",
        subtitle: "Runtime verification",
        player: { x: 15, y: 32 },
        enemy: { x: 85, y: 32 },
        elevation: { player: 0, enemy: 0 },
        movement: { player: 20, enemy: 20 },
        movementMax: { player: 20, enemy: 20 },
        units: [],
        features: [],
        hazards: [],
        domains: [],
        frameFields: [],
        effectEchoes: [],
        lastImpact: null,
      },
      auxiliaryCombatants: [],
      turn: 1,
      phase: "combat",
      floor: 35,
      boss: false,
      elite: false,
      encounter: { effect: "none" },
      battleMode: "duel",
      battleLabel: "TEST",
      playerTeam: "team-wayfarer",
      enemyTeam: "team-rift",
      activeTargetId: "enemy",
      environmentStage: 0,
      environmentProgress: 0,
      environmentOwner: "system",
      environmentBreaks: { player: 0, enemy: 0 },
      maxEnvironment: 0,
      enemyIntent: null,
      enemyFuture: [],
      timeState: null,
      epitaph: null,
      calamity: null,
      requiemEncounter: null,
      revealed: [],
      lastDamage: 0,
      lastActor: "system",
      lastEvent: "test",
      combatSnapshots: [],
      combatSnapshotSerial: 0,
      deathLoops: [],
      erasure: { concepts: [], powers: [] },
      shards: 0,
      playerXp: 0,
      playerLevel: 1,
      skillPoints: 0,
      pendingMoney: 0,
      pendingGems: 0,
      logs: [],
      chronicle: [],
      history: [],
      routeHistory: [],
      nemeses: [],
    };
  }

  const roster = Object.fromEntries(api.h.map((stand) => [stand.name, stand]));
  assert.equal(roster["Gold Experience"].range, 25);
  assert.equal(roster["Gold Experience Requiem"].range, 9999);
  assert.equal(roster["Gold Experience Requiem"].rollable, false);
  assert.equal(roster["King Crimson Requiem"].range, 9999);
  assert.equal(roster["King Crimson Requiem"].rollable, false);
  assert.deepEqual(
    roster["King Crimson Requiem"].summoned.map((move) => move.name),
    ["Time Erasing Scythe", "Time Loop", "Time Dodge"],
  );

  const toggleRun = run("Gold Experience");
  const toggle = api.RIFT_STAND_TOGGLE_ACTION(toggleRun.player);
  assert.equal(toggle.name, "Summon Stand");
  assert.ok(toggle.move.tags.includes("standToggle"));
  assert.ok(toggle.move.tags.includes("selfCast"));

  const snapshotRun = run();
  const initial = api.RIFT_RECORD_SNAPSHOT(snapshotRun, "system", "INITIAL TURN");
  snapshotRun.player.hp = 11;
  snapshotRun.battlefield.player = { x: 44, y: 12 };
  snapshotRun.battlefield.hazards.push({ id: "later-hazard" });
  assert.equal(api.RIFT_APPLY_COMBAT_STATE(snapshotRun, initial.state), true);
  assert.equal(snapshotRun.player.hp, 100);
  assert.deepEqual(snapshotRun.battlefield.player, { x: 15, y: 32 });
  assert.equal(snapshotRun.battlefield.hazards.length, 0);
  for (let turn = 2; turn <= 270; turn += 1) {
    snapshotRun.turn = turn;
    api.RIFT_RECORD_SNAPSHOT(snapshotRun, turn % 2 ? "player" : "enemy", `TURN ${turn}`);
  }
  assert.equal(snapshotRun.combatSnapshots.length, 256);

  const rtzRun = run();
  api.RIFT_RECORD_SNAPSHOT(rtzRun, "enemy", "ENEMY TURN");
  rtzRun.player.hp = 23;
  rtzRun.player.energy = 31;
  rtzRun.player.ultimate = 17;
  rtzRun.enemy.energy = 29;
  rtzRun.enemy.ultimate = 0;
  rtzRun.enemy.statuses.standardCooldown_2 = 4;
  rtzRun.battlefield.enemy = { x: 62, y: 21 };
  rtzRun.battlefield.hazards.push({ id: "enemy-created" });
  assert.equal(api.RIFT_REVERT_TO_ZERO(rtzRun, "player", "enemy", false), true);
  assert.equal(rtzRun.player.hp, 100, "RTZ should undo damage received from the opponent turn");
  assert.equal(rtzRun.player.energy, 31, "RTZ should preserve the user's paid/current Energy");
  assert.equal(rtzRun.player.ultimate, 17, "RTZ should preserve the user's paid/current Ultimate");
  assert.equal(rtzRun.enemy.energy, 29, "RTZ should preserve the opponent's spent Energy");
  assert.equal(rtzRun.enemy.ultimate, 0, "RTZ should preserve the opponent's spent Ultimate");
  assert.equal(rtzRun.enemy.statuses.standardCooldown_2, 4, "RTZ should preserve spent cooldowns");
  assert.deepEqual(rtzRun.battlefield.enemy, { x: 85, y: 32 });
  assert.equal(rtzRun.battlefield.hazards.length, 0);
  assert.equal(rtzRun.player.statuses.gerRtzCooldown, 5);
  assert.equal(rtzRun.timelineRestoredByKcr, undefined, "manual RTZ should finish through its Stand resolver");

  const courtRtz = run("Gold Experience Requiem", "King Crimson Requiem");
  api.RIFT_RECORD_SNAPSHOT(courtRtz, "enemy", "KCR TURN");
  courtRtz.player.hp = 19;
  courtRtz.player.statuses.gerRtzCooldown = 5;
  assert.equal(api.RIFT_REVERT_TO_ZERO(courtRtz, "player", "enemy", false), false);
  assert.equal(courtRtz.player.hp, 19, "Court should neutralize RTZ's causal state edit");
  assert.equal(courtRtz.player.statuses.gerRtzCooldown, 5, "a rejected RTZ still keeps its paid cooldown");

  const autoRtz = run();
  autoRtz.player.stand.summoned = true;
  api.RIFT_RECORD_SNAPSHOT(autoRtz, "enemy", "ENEMY TURN");
  autoRtz.player.hp = 1;
  autoRtz.enemy.energy = 22;
  const stalePlayer = autoRtz.player;
  api.go(autoRtz, autoRtz.enemy, stalePlayer, 500, false, ["physical"]);
  assert.equal(autoRtz.player.hp, 100);
  assert.equal(stalePlayer.hp, 100, "automatic RTZ must synchronize the abandoned fighter reference");
  assert.equal(autoRtz.player.statuses.gerRtzCooldown, 5);
  assert.equal(autoRtz.timelineRestoredByKcr, 1, "automatic RTZ must abort the stale resolver");
  assert.ok(autoRtz.battlefield.effectEchoes.some((effect) => effect.className === "ger-auto-rtz"));

  const courtAutoRtz = run("Gold Experience Requiem", "King Crimson Requiem");
  courtAutoRtz.player.stand.summoned = true;
  api.RIFT_RECORD_SNAPSHOT(courtAutoRtz, "enemy", "KCR TURN");
  courtAutoRtz.player.hp = 1;
  api.go(courtAutoRtz, courtAutoRtz.enemy, courtAutoRtz.player, 500, false, ["physical"]);
  assert.ok(courtAutoRtz.player.hp <= 0, "Court should prevent automatic RTZ from denying KCR's lethal turn");

  const courtDamage = run(null, "King Crimson Requiem");
  const courtHp = courtDamage.enemy.hp;
  const dealt = api.go(courtDamage, courtDamage.player, courtDamage.enemy, 24, false, [
    "physical",
    "causality",
    "trueDamage",
  ]);
  assert.ok(dealt > 0 && courtDamage.enemy.hp < courtHp, "Court must retain ordinary raw damage");

  const masterRun = run("King Crimson Requiem");
  const masterPoint = api.RIFT_RECORD_SNAPSHOT(masterRun, "system", "MASTER TARGET");
  masterRun.player.hp = 18;
  masterRun.player.energy = 31;
  masterRun.player.ultimate = 0;
  masterRun.enemy.hp = 42;
  masterRun.shards = 77;
  masterRun.pendingMoney = 400;
  masterRun.battlefield.player = { x: 48, y: 50 };
  assert.equal(api.RIFT_MASTER_OF_TIME(masterRun, "player-stand", masterPoint.seq), true);
  assert.equal(masterRun.player.hp, 100);
  assert.equal(masterRun.player.energy, 80);
  assert.equal(masterRun.player.ultimate, 60);
  assert.equal(masterRun.enemy.hp, 100);
  assert.equal(masterRun.shards, 77, "Master must not rewind run rewards");
  assert.equal(masterRun.pendingMoney, 400, "Master must not rewind pending run currency");
  assert.deepEqual(masterRun.battlefield.player, { x: 15, y: 32 });

  const loopRun = run();
  loopRun.enemy.hp = 0;
  assert.equal(api.RIFT_DEATH_LOOP_REGISTER(loopRun, loopRun.enemy, loopRun.player), true);
  assert.equal(loopRun.deathLoops.length, 1);
  assert.equal(loopRun.deathLoops[0].deaths, 1);
  loopRun.floor = 36;
  api.RIFT_ADVANCE_DEATH_LOOPS(loopRun);
  const deathsAfterReward = loopRun.deathLoops[0].deaths;
  const shardsAfterReward = loopRun.shards;
  assert.ok(deathsAfterReward > 1);
  api.RIFT_ADVANCE_DEATH_LOOPS(loopRun);
  assert.equal(loopRun.deathLoops[0].deaths, deathsAfterReward);
  assert.equal(loopRun.shards, shardsAfterReward, "Death Loop rewards must be idempotent per floor");

  const protectedLoop = run("Gold Experience Requiem", "King Crimson Requiem");
  protectedLoop.enemy.hp = 0;
  assert.equal(api.RIFT_DEATH_LOOP_REGISTER(protectedLoop, protectedLoop.enemy, protectedLoop.player), false);
  assert.equal(protectedLoop.deathLoops.length, 0, "Court should reject Infinite Death Loop registration");

  const timeLoopRun = run("King Crimson Requiem");
  assert.ok(api.RIFT_CREATE_TIME_LOOP(timeLoopRun, "player", "enemy"));
  const barrier = timeLoopRun.battlefield.features.find((feature) => feature.kind === "temporalBarrier");
  assert.ok(barrier);
  assert.equal(api.go(timeLoopRun, timeLoopRun.player, timeLoopRun.enemy, 40, false, ["physical"]), 0);
  barrier.integrity = 1;
  assert.equal(api.RIFT_BREAK_TIME_LOOP(timeLoopRun, "enemy", "enemy"), true);
  assert.equal(timeLoopRun.enemy.statuses.kcrTimeLoopBarrierId, undefined);

  const glitchRun = run("King Crimson Requiem");
  const glitchOrigin = { x: 24, y: 19 };
  const glitch = api.RIFT_CREATE_TEMPORAL_GLITCH(glitchRun, "player", glitchOrigin);
  assert.deepEqual(glitch.position, glitchOrigin);
  assert.equal(glitch.expiresAtTurn, glitchRun.turn + 3);

  const soulRun = run("Gold Experience");
  assert.equal(api.RIFT_SEPARATE_SOUL(soulRun, soulRun.enemy, "player"), true);
  const soulUnit = soulRun.battlefield.units.find((unit) => unit.id === "enemy-soul");
  assert.ok(soulUnit);
  const bodyPosition = soulRun.battlefield.enemy;
  const initialSoulDistance = Math.hypot(
    soulUnit.position.x - bodyPosition.x,
    soulUnit.position.y - bodyPosition.y,
  );
  assert.equal(api.RIFT_MOVE_SOUL(soulRun, "enemy", { x: 1, y: 1 }, true).moved, true);
  const movedSoul = soulRun.battlefield.units.find((unit) => unit.id === "enemy-soul");
  if (movedSoul) {
    const movedDistance = Math.hypot(
      movedSoul.position.x - bodyPosition.x,
      movedSoul.position.y - bodyPosition.y,
    );
    assert.ok(movedDistance < initialSoulDistance, "Soul movement must always reduce distance to the Body");
  } else {
    assert.equal(soulRun.enemy.statuses.soulSeparated, undefined, "a Soul reaching the Body must recombine");
  }

  const entityRun = run("Gold Experience");
  const substrate = {
    id: "eligible-rubble",
    kind: "rubble",
    label: "Eligible rubble",
    position: { x: 20, y: 30 },
    radius: 2,
    lifeEligible: true,
    lifeSource: "object",
  };
  entityRun.battlefield.features.push(substrate);
  const lifeform = api.RIFT_CREATE_LIFEFORM(entityRun, "player", substrate);
  assert.ok(lifeform);
  assert.equal(lifeform.fighter.statuses.temporaryTurns, 3);
  assert.equal(api.RIFT_SPAWN_SCORPIONS(entityRun, "player", "enemy", true), 3);
  assert.equal(entityRun.auxiliaryCombatants.filter((entry) => entry.fighter.statuses.geScorpion).length, 3);

  const arrowRun = run("Gold Experience");
  arrowRun.requiemEncounter = {
    active: true,
    basePlayerStand: "Gold Experience",
    rivalBaseStand: "King Crimson",
    caseState: "closed",
    opensAtTurn: 11,
    holder: null,
    playerDecisionPending: false,
    arrowDestroyed: false,
    evolution: null,
    casePosition: { x: 50, y: 32 },
    arrowPosition: { x: 50, y: 32 },
    cinematic: null,
  };
  arrowRun.battlefield.features.push({
    id: "requiem-arrow-case",
    kind: "requiemCase",
    label: "sealed",
    position: { x: 50, y: 32 },
    radius: 2.7,
    solid: true,
    cover: 0.55,
    destructible: false,
    integrity: 1,
    maxIntegrity: 1,
  });
  arrowRun.turn = 10;
  api.RIFT_REQUIEM_TICK(arrowRun);
  assert.equal(arrowRun.requiemEncounter.caseState, "closed");
  arrowRun.turn = 11;
  api.RIFT_REQUIEM_TICK(arrowRun);
  assert.equal(arrowRun.requiemEncounter.caseState, "open");
  assert.ok(arrowRun.battlefield.features.some((feature) => feature.kind === "requiemArrow"));
  arrowRun.battlefield.player = { x: 50, y: 32 };
  assert.equal(api.RIFT_CLAIM_REQUIEM_ARROW(arrowRun, "player"), true);
  assert.equal(arrowRun.requiemEncounter.playerDecisionPending, true);
  assert.equal(api.RIFT_ACCEPT_REQUIEM_ARROW(arrowRun), true);
  assert.equal(arrowRun.player.stand.name, "Gold Experience Requiem");
  assert.equal(arrowRun.phase, "combat");

  console.log(
    "Bizarre Update runtime verification passed (roster, turns, snapshots, RTZ, Court, Master, Death Loops, Time Loop, Souls, entities, and Arrow evolution).",
  );
} catch (error) {
  console.error(error?.stack || error);
  process.exitCode = 1;
} finally {
  delete globalThis.__RIFTBOUND_BIZARRE_TEST__;
  await rm(instrumentedPath, { force: true });
  if (!packageExisted) await rm(packagePath, { force: true });
}
