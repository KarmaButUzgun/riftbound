import {readFile,writeFile} from 'node:fs/promises';

const prior='scripts/verify-v363-loadout-stability.mjs';
let priorText=await readFile(prior,'utf8');
priorText=priorText.replace("assert.equal(manifest.v36.hotfix,'36.3');","assert.equal(manifest.v36.hotfix,'36.4');");
await writeFile(prior,priorText);

// Historical Bizarre fixtures predate V35's Durability HP pool. Their hardcoded 100-HP expectations accidentally
// captured the repeat-normalization clamp that V36.4 fixes. Keep the behavioral assertions, but compare against the
// authoritative final max HP instead of the temporary pre-normalization 100-HP shell.
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

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v364-authority-hotfix.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.4 compatibility last: corrected Bizarre final-max-HP expectations and chained authoritative HP/Takeover/SWOON regression verifier.');
