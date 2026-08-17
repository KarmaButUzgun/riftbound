import {readFile,writeFile} from 'node:fs/promises';

// V36.5 is additive hotfix metadata; older V36.3/V36.4 tests keep their own API versions but should accept the newest manifest hotfix.
for(const path of ['scripts/verify-v363-loadout-stability.mjs','scripts/verify-v364-authority-hotfix.mjs']){
 let text=await readFile(path,'utf8');
 text=text.replace("assert.equal(manifest.v36.hotfix,'36.4');","assert.equal(manifest.v36.hotfix,'36.5');");
 text=text.replace("assert.equal(manifest.v36.hotfix,'36.3');","assert.equal(manifest.v36.hotfix,'36.5');");
 await writeFile(path,text);
}

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v365-takeover-identity.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.5 last: newest manifest hotfix accepted and structural Takeover identity regression chained after V36.3/V36.4.');
