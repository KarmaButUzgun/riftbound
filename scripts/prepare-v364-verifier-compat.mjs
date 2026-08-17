import {readFile,writeFile} from 'node:fs/promises';

const prior='scripts/verify-v363-loadout-stability.mjs';
let priorText=await readFile(prior,'utf8');
priorText=priorText.replace("assert.equal(manifest.v36.hotfix,'36.3');","assert.equal(manifest.v36.hotfix,'36.4');");
await writeFile(prior,priorText);

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v364-authority-hotfix.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V35 release gate to execute the V36.4 authoritative HP/Takeover/SWOON regression verifier.');
