import {readFile,readdir,writeFile} from 'node:fs/promises';

// V36.8 is presentation-only. Older V36 suites retain their mechanics assertions while accepting current hotfix metadata.
for(const path of ['scripts/verify-v363-loadout-stability.mjs','scripts/verify-v364-authority-hotfix.mjs','scripts/verify-v365-takeover-identity.mjs','scripts/verify-v366-takeover-live-deck.mjs','scripts/verify-v367-takeover-offer-transition.mjs']){
 let text=await readFile(path,'utf8');
 for(const version of ['36.3','36.4','36.5','36.6','36.7'])text=text.replaceAll(`manifest.v36.hotfix,'${version}'`,`manifest.v36.hotfix,'36.8'`);
 await writeFile(path,text);
}

// Historical presentation suites sometimes used the old update stamp itself as their proof that a UI existed.
// Keep those suites checking the same surfaces, but against the finished player-facing labels.
const presentationRewrites=[
 ['V20 CONTROL CENTER','DISPLAY & ACCESSIBILITY'],
 ['V21 PRESERVATION','SAVE MANAGEMENT'],
 ['V23 INTERFACE REBORN','INPUT & INTERFACE'],
 ['V25 · ARMORY COMPLETE','ARMORY'],
 ['V26 ASCENSION REFRAMED','ASCENSION ROUTE'],
 ['BUILD EXPANSION · READ ONLY IN COMBAT','CURRENT LOADOUT · READ ONLY IN COMBAT'],
 ['BUILD EXPANSION · FULL CATALOG','FULL ITEM CATALOG'],
 ['WAYFARER ARMORY · MEMORY · FAVORITES · BUILD ORDERS','FAVORITES · RECIPES · BUILD ORDERS'],
 ['WAYFARER QOL · PERSISTENT ARMORY','BUILD WORKSPACE'],
 ['THE LIVING ARCHIVE · ASCENDANT EDITION','THE LIVING ARCHIVE'],
 ['V31 FEATURE ARCHIVE','TECHNIQUE ARCHIVE'],
 ['REFERENCE DAMAGE','ESTIMATED DAMAGE'],
 ['Authored effect resolver','SPECIAL EFFECT'],
 ['AUTHORED EFFECTS','EFFECTS'],
 ['MECHANICS-BACKED · EXPLICIT MOVE CONTRACT','TACTICAL SEQUENCE'],
 ['Presentation preview · mechanics unchanged','TACTICAL PREVIEW']
];
for(const name of await readdir('scripts')){
 if(!name.startsWith('verify-')||!name.endsWith('.mjs')||name==='verify-v368-aesthetic-codex.mjs')continue;
 const path=`scripts/${name}`;let text=await readFile(path,'utf8'),next=text;
 for(const [oldLabel,newLabel] of presentationRewrites)next=next.replaceAll(oldLabel,newLabel);
 if(next!==text)await writeFile(path,next);
}

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v368-aesthetic-codex.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.8 last: historical mechanics suites accept 36.8 metadata, presentation assertions follow clean UI labels, and the aesthetic taxonomy regression runs after every prior V36 gate.');
