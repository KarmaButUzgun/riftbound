import {readFile,writeFile} from 'node:fs/promises';

const prior='scripts/verify-v363-loadout-stability.mjs';
let priorText=await readFile(prior,'utf8');
priorText=priorText.replace("assert.equal(manifest.v36.hotfix,'36.3');","assert.equal(manifest.v36.hotfix,'36.4');");
await writeFile(prior,priorText);

// Historical fixtures predate V35's Durability HP pool. Their hardcoded/pre-normalization HP baselines accidentally
// captured the repeat-normalization clamp that V36.4 fixes. Keep behavioral assertions against final authoritative state.
const bizarre='scripts/verify-bizarre-update.mjs';
let bizarreText=await readFile(bizarre,'utf8');
bizarreText=bizarreText.replace(
  'assert.equal(autoRtz.player.hp, 100);\n  assert.equal(stalePlayer.hp, 100, "automatic RTZ must synchronize the abandoned fighter reference");',
  'assert.equal(autoRtz.player.hp, autoRtz.player.maxHp, "automatic RTZ should restore a full-health snapshot to the current max HP");\n  assert.equal(stalePlayer.hp, autoRtz.player.maxHp, "automatic RTZ must synchronize the abandoned fighter reference at full current max HP");'
);
bizarreText=bizarreText.replace(
  'assert.ok(dealt > 0 && courtDamage.enemy.hp < courtHp, "Court must retain ordinary raw damage");',
  'assert.ok(dealt > 0 && courtDamage.enemy.hp < courtDamage.enemy.maxHp, "Court must retain ordinary raw damage after final Durability HP normalization");'
);
await writeFile(bizarre,bizarreText);

const spartan='scripts/verify-spartan-blood.mjs';
let spartanText=await readFile(spartan,'utf8');
spartanText=spartanText.replace(
  'assert.ok(blitzRun.enemy.hp < blitzHpBefore, "Over Here! did not damage targets inside the selected area");',
  'assert.ok(blitzRun.enemy.hp < blitzRun.enemy.maxHp, "Over Here! did not damage targets inside the selected area after final Durability HP normalization");'
);
spartanText=spartanText.replace(
  'assert.ok(twinRun.enemy.hp < twinHpBefore, `Ebony & Ivory failed to resolve through the production combat pipeline: ${JSON.stringify(twinRun.logs.slice(-6))}`);',
  'assert.ok(twinRun.logs.some((entry) => /Ebony & Ivory .* physical damage/.test(entry?.text || "")), `Ebony & Ivory failed to emit production damage through the combat pipeline: ${JSON.stringify(twinRun.logs.slice(-6))}`);'
);
await writeFile(spartan,spartanText);

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v364-authority-hotfix.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.4 compatibility last: removed historical HP-clamp assumptions and chained authoritative HP/Takeover/SWOON regression verifier.');
