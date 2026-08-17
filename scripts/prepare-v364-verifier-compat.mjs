import {readFile,writeFile} from 'node:fs/promises';

const prior='scripts/verify-v363-loadout-stability.mjs';
let priorText=await readFile(prior,'utf8');
priorText=priorText.replace("assert.equal(manifest.v36.hotfix,'36.3');","assert.equal(manifest.v36.hotfix,'36.4');");
await writeFile(prior,priorText);

// The historical Bizarre verifier accidentally froze the V35 repeat-normalization HP bug into Automatic RTZ:
// a full snapshot became 100/136 after the second Durability-pool refresh. V36.4 correctly keeps it full.
const bizarre='scripts/verify-bizarre-update.mjs';
let bizarreText=await readFile(bizarre,'utf8');
bizarreText=bizarreText.replace(
  'assert.equal(autoRtz.player.hp, 100);\n  assert.equal(stalePlayer.hp, 100, "automatic RTZ must synchronize the abandoned fighter reference");',
  'assert.equal(autoRtz.player.hp, autoRtz.player.maxHp, "automatic RTZ should restore a full-health snapshot to the current max HP");\n  assert.equal(stalePlayer.hp, autoRtz.player.maxHp, "automatic RTZ must synchronize the abandoned fighter reference at full current max HP");'
);
await writeFile(bizarre,bizarreText);

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v364-authority-hotfix.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.4 compatibility: corrected Automatic RTZ full-HP expectation and chained authoritative HP/Takeover/SWOON regression verifier.');
