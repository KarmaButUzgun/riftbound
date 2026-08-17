import {readFile,writeFile} from 'node:fs/promises';
const path='scripts/verify-sovereigns-v35.mjs';
let text=await readFile(path,'utf8');
const marker="await import('./verify-v363-loadout-stability.mjs');";
if(!text.includes(marker))text=text.trimEnd()+`\n\n${marker}\n`;
await writeFile(path,text);
console.log('Prepared V35 release gate to execute the V36.3 active-loadout/browser regression verifier.');
