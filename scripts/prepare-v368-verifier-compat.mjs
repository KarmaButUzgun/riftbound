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

// V36.8 intentionally brings Mutated Aura Accumulation into the public archive. The mechanics registry is unchanged;
// public Codex coverage grows by one profile and its four existing techniques.
{
 const path='scripts/verify-codex-ascendant-v31.mjs';let text=await readFile(path,'utf8');
 text=text.replace(/assert\.deepEqual\(catalog\.totals,\{registeredPowers:\d+,visiblePowers:\d+,hiddenPowers:\d+,stands:7,profiles:\d+,moves:\d+,evolvedMoves:3\}\);/,`assert.deepEqual(catalog.totals,{registeredPowers:55,visiblePowers:55,hiddenPowers:0,stands:7,profiles:62,moves:276,evolvedMoves:3});`);
 text=text.replace(/assert\.equal\(catalog\.profiles\.length,\d+\);/,`assert.equal(catalog.profiles.length,62);`);
 text=text.replace(/assert\.equal\(catalog\.powers\.length,\d+\);/,`assert.equal(catalog.powers.length,55);`);
 text=text.replace(/assert\.equal\(catalog\.moves\.length,\d+\);/,`assert.equal(catalog.moves.length,276);`);
 text=text.replace(/assert\.ok\(!catalog\.profiles\.some\(profile=>profile\.name==='Mutated Aura Accumulation'\),'[^']*'\);/,`assert.ok(catalog.profiles.some(profile=>profile.name==='Mutated Aura Accumulation'),'Mutated Aura Accumulation is missing from the public Codex');`);
 text=text.replace(`move.summary.includes(move.reference.damage>0?'archive standard':'authored effects')`,`move.summary.includes(move.reference.damage>0?'Estimated damage':'special effects')`);
 // V36 post03 replaces the historical V31 file with a compact final foundation gate. Update that exact final shape too.
 text=text.replace(`assert.equal(cat.totals.moves,272);assert.equal(cat.totals.registeredPowers,55);assert.equal(cat.totals.visiblePowers,54);`,`assert.equal(cat.totals.moves,276);assert.equal(cat.totals.registeredPowers,55);assert.equal(cat.totals.visiblePowers,55);`);
 await writeFile(path,text);
}
{
 const path='scripts/verify-tactical-grammar-v33.mjs';let text=await readFile(path,'utf8');
 // V36 post02 checks tactical integrity and separately hardcodes the public Codex move total.
 // V36.8 exposes four existing Mutated Aura techniques without changing tactical mechanics or manifest preview coverage.
 text=text.replace(`assert.equal(t.codex.catalog().totals.moves,272);`,`assert.equal(t.codex.catalog().totals.moves,276);`);
 await writeFile(path,text);
}

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v368-aesthetic-codex.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.8 last: historical mechanics suites accept 36.8 metadata, presentation assertions follow clean UI labels, public Codex covers all 55 powers / 276 techniques, and the aesthetic taxonomy regression runs after every prior V36 gate.');
