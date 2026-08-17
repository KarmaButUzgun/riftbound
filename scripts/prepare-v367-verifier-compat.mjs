import {readFile,writeFile} from 'node:fs/promises';

// V36.7 is the newest Takeover hotfix. Keep older suites focused on their mechanics while accepting current manifest metadata.
for(const path of ['scripts/verify-v363-loadout-stability.mjs','scripts/verify-v364-authority-hotfix.mjs','scripts/verify-v365-takeover-identity.mjs','scripts/verify-v366-takeover-live-deck.mjs']){
 let text=await readFile(path,'utf8');
 text=text.replaceAll("manifest.v36.hotfix,'36.3'","manifest.v36.hotfix,'36.7'");
 text=text.replaceAll("manifest.v36.hotfix,'36.4'","manifest.v36.hotfix,'36.7'");
 text=text.replaceAll("manifest.v36.hotfix,'36.5'","manifest.v36.hotfix,'36.7'");
 text=text.replaceAll("manifest.v36.hotfix,'36.6'","manifest.v36.hotfix,'36.7'");
 await writeFile(path,text);
}

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v367-takeover-offer-transition.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.7 last: historical hotfix metadata accepts 36.7 and the literal offer-to-next-floor Takeover regression runs after all prior V36 gates.');
