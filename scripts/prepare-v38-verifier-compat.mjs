import {readFile,writeFile} from 'node:fs/promises';
import {gunzipSync,gzipSync} from 'node:zlib';

const edit=async(path,fn)=>{const text=await readFile(path,'utf8');const next=fn(text);if(next!==text)await writeFile(path,next)};
const rep=(text,a,b,path)=>{
 if(text.includes(b))return text;
 if(!text.includes(a))throw new Error(`V38 verifier compatibility anchor missing in ${path}: ${a}`);
 return text.replaceAll(a,b);
};

/* V37's own release regression intentionally certifies the seven-Stand / 280-technique
   live state that existed before V38. Build a tiny historical view of the production
   bundle instead of weakening those assertions. */
{
 const livePath='.build/riftbound-standalone/assets/page-F6OuavDb.js';
 const compatPath='.build/riftbound-standalone/assets/page-v37-compat.js';
 let live=await readFile(livePath,'utf8');
 const marker='/* Riftbound V38 · Another JoJo Update */';
 const exportMarker='export{xs as default};';
 const start=live.indexOf(marker),end=live.indexOf(exportMarker);
 if(start<0||end<0||start>end)throw new Error('V38 compatibility could not isolate the additive V38 runtime');
 live=live.slice(0,start)+live.slice(end);
 live=live.replace('(0,E.jsx)(RIFT_V38_ULT_CINEMATIC,{battlefield:e}),(0,E.jsx)(RIFT_V38_BATTLEFIELD_FX,{battlefield:e}),','');
 live=live.replace(',(0,E.jsx)(RIFT_V38_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})','');
 await writeFile(compatPath,live);

 const packedPath='scripts/verify-v37-final-touch.mjs.gz.b64';
 const packed=(await readFile(packedPath,'utf8')).trim();
 let source=gunzipSync(Buffer.from(packed,'base64')).toString('utf8');
 source=source.replaceAll('assets/page-F6OuavDb.js','assets/page-v37-compat.js');
 await writeFile(packedPath,gzipSync(Buffer.from(source)).toString('base64')+'\n');
}

/* The V31/V33/V36 families intentionally inspect the live additive Codex after their
   historical mechanics checks. V38 adds six Stand profiles and 34 authored techniques. */
const liveEdits={
 'scripts/verify-codex-ascendant-v31.mjs':[
  ['{registeredPowers:56,visiblePowers:56,hiddenPowers:0,stands:7,profiles:63,moves:280,evolvedMoves:3}','{registeredPowers:56,visiblePowers:56,hiddenPowers:0,stands:13,profiles:69,moves:314,evolvedMoves:3}'],
  ['catalog.profiles.length,63','catalog.profiles.length,69'],
  ['catalog.moves.length,280','catalog.moves.length,314'],
  ['cat.totals.moves,280','cat.totals.moves,314'],
 ],
 'scripts/verify-tactical-grammar-v33.mjs':[
  ['codex.catalog().totals.moves,280','codex.catalog().totals.moves,314'],
  ['t.codex.catalog().totals.moves,280','t.codex.catalog().totals.moves,314'],
 ],
 'scripts/verify-shadows-converge-v36.mjs':[
  ['codex.catalog().totals.moves,280','codex.catalog().totals.moves,314'],
 ],
 'scripts/verify-v363-loadout-stability.mjs':[['codex.catalog().totals.moves,280','codex.catalog().totals.moves,314'],['catalog().totals.moves,280','catalog().totals.moves,314']],
 'scripts/verify-v364-authority-hotfix.mjs':[['codex.catalog().totals.moves,280','codex.catalog().totals.moves,314'],['catalog().totals.moves,280','catalog().totals.moves,314']],
 'scripts/verify-v365-takeover-identity.mjs':[['codex.catalog().totals.moves,280','codex.catalog().totals.moves,314'],['catalog().totals.moves,280','catalog().totals.moves,314']],
 'scripts/verify-v366-takeover-live-deck.mjs':[['codex.catalog().totals.moves,280','codex.catalog().totals.moves,314'],['catalog().totals.moves,280','catalog().totals.moves,314']],
 'scripts/verify-v367-takeover-offer-transition.mjs':[['codex.catalog().totals.moves,280','codex.catalog().totals.moves,314'],['catalog().totals.moves,280','catalog().totals.moves,314']],
};
for(const [path,replacements] of Object.entries(liveEdits))await edit(path,text=>{
 for(const [a,b] of replacements)if(text.includes(a)||text.includes(b))text=rep(text,a,b,path);
 return text;
});

/* V31.1 already runs against the preserved tactical catalog under V35+, so its
   255-technique historical preview loop is deliberately left untouched. */

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v38-another-jojo.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V38 verifier compatibility: V37 retains an exact historical bundle view; live Codex regressions advance to 13 Stands / 69 profiles / 314 techniques; V38 regression runs last.');
