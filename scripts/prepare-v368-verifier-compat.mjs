import {readFile,writeFile} from 'node:fs/promises';

// V36.8 is presentation-only. Older V36 suites retain their mechanics assertions while accepting current hotfix metadata.
for(const path of ['scripts/verify-v363-loadout-stability.mjs','scripts/verify-v364-authority-hotfix.mjs','scripts/verify-v365-takeover-identity.mjs','scripts/verify-v366-takeover-live-deck.mjs','scripts/verify-v367-takeover-offer-transition.mjs']){
 let text=await readFile(path,'utf8');
 for(const version of ['36.3','36.4','36.5','36.6','36.7'])text=text.replaceAll(`manifest.v36.hotfix,'${version}'`,`manifest.v36.hotfix,'36.8'`);
 await writeFile(path,text);
}

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v368-aesthetic-codex.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.8 last: historical V36 mechanics suites accept 36.8 metadata and the clean player-copy/Codex taxonomy regression runs after every prior V36 gate.');
