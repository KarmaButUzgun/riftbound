import {readFile,writeFile} from 'node:fs/promises';

// V36.6 is the newest Takeover hotfix. Keep historical suites focused on their own mechanics while accepting the newest manifest metadata.
for(const path of ['scripts/verify-v363-loadout-stability.mjs','scripts/verify-v364-authority-hotfix.mjs','scripts/verify-v365-takeover-identity.mjs']){
 let text=await readFile(path,'utf8');
 text=text.replaceAll("manifest.v36.hotfix,'36.3'","manifest.v36.hotfix,'36.6'");
 text=text.replaceAll("manifest.v36.hotfix,'36.4'","manifest.v36.hotfix,'36.6'");
 text=text.replaceAll("manifest.v36.hotfix,'36.5'","manifest.v36.hotfix,'36.6'");
 // V36.5 accidentally searched for a nonexistent power named Electro and silently fell back to an unrelated fixture.
 text=text.replaceAll("power?.name==='Electro'","power?.name==='Electrokinesis'");
 await writeFile(path,text);
}

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v366-takeover-live-deck.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.6 last: historical hotfix metadata accepts 36.6, V36.5 uses the real Electrokinesis fixture, and the live-deck/browser publication regression is chained after prior V36 gates.');
