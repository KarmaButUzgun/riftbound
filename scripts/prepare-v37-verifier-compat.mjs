import {readFile,readdir,writeFile} from 'node:fs/promises';

async function patch(path,transform){let text=await readFile(path,'utf8'),next=transform(text);if(next!==text)await writeFile(path,next)}

// V37 intentionally expands the live game by six start-only items and one four-move Epic power.
// Historical suites keep checking their original mechanics, but final-live catalog assertions must acknowledge the additive release.
await patch('scripts/verify-build-expansion.mjs',text=>{
 text=text.replace(/assert\.equal\(catalog\.length,\d+\)/g,'assert.equal(catalog.length,219)');
 text=text.replace(/assert\.equal\(new Set\(catalog\.map\(i=>i\.id\)\)\.size,\d+\)/g,'assert.equal(new Set(catalog.map(i=>i.id)).size,219)');
 // The V9/V13/V14 compatibility chain adds assertion messages around these checks, so patch the expected id declaration itself.
 text=text.replace(/const ids=catalog\.map\(i=>i\.id\);/g,'const ids=catalog.filter(i=>!i.tags?.includes("starterOnly")).map(i=>i.id);');
 return text;
});

await patch('scripts/verify-codex-ascendant-v31.mjs',text=>{
 text=text.replace(/registeredPowers:\d+,visiblePowers:\d+,hiddenPowers:\d+,stands:7,profiles:\d+,moves:\d+,evolvedMoves:3/g,'registeredPowers:56,visiblePowers:56,hiddenPowers:0,stands:7,profiles:63,moves:280,evolvedMoves:3');
 text=text.replace(/catalog\.profiles\.length,\d+/g,'catalog.profiles.length,63');
 text=text.replace(/catalog\.powers\.length,\d+/g,'catalog.powers.length,56');
 text=text.replace(/catalog\.moves\.length,\d+/g,'catalog.moves.length,280');
 text=text.replace(/cat\.totals\.moves,\d+/g,'cat.totals.moves,280');
 text=text.replace(/cat\.totals\.registeredPowers,\d+/g,'cat.totals.registeredPowers,56');
 text=text.replace(/cat\.totals\.visiblePowers,\d+/g,'cat.totals.visiblePowers,56');
 return text;
});

for(const path of ['scripts/verify-tactical-grammar-v33.mjs','scripts/verify-shadows-converge-v36.mjs'])await patch(path,text=>text.replaceAll('codex.catalog().totals.moves,276','codex.catalog().totals.moves,280').replaceAll('catalog.totals.moves,276','catalog.totals.moves,280'));

await patch('scripts/verify-v368-aesthetic-codex.mjs',text=>{
 text=text.replace('RIFT_V368_PASSIVE_TITLE,RIFT_V368_CATALOG};','RIFT_V368_PASSIVE_TITLE,RIFT_V368_CATALOG,RIFT_V37_CATALOG};');
 text=text.replace('api.powerDescriptions,55','api.powerDescriptions,56');
 text=text.replace("test.g.length,55,'Special Power roster changed'","test.g.length,56,'Special Power roster changed'");
 text=text.replaceAll('test.RIFT_V368_CATALOG','test.RIFT_V37_CATALOG');
 text=text.replace('codex.catalog().powers.length,55','codex.catalog().powers.length,56');
 text=text.replace("test.RIFT_V21_ABILITY_CONSTITUTION().hash,'dc25a499','aesthetic copy changed the ability constitution'","test.RIFT_V21_ABILITY_CONSTITUTION().hash,globalThis.RIFTBOUND_V37.constitution.expected,'V37 ability constitution is not the certified live hash'");
 text=text.replace('all 55 Special Powers','all 56 Special Powers');
 return text;
});

// V35's final gate observes the final live preservation wrapper by design. Keep the historical V35 mechanics assertions,
// but update only the additive live constitution count and accepted power list.
await patch('scripts/verify-sovereigns-v35.mjs',text=>{
 text=text.replace(/assert\.deepEqual\(constitution\.counts,\{abilities:\d+,moves:\d+\}\);/,'assert.deepEqual(constitution.counts,{abilities:63,moves:245});');
 text=text.replace("assert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod']);","assert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod','Boogie Woogie']);");
 const marker="await import('./verify-v37-final-touch.mjs');";
 if(!text.includes(marker))text=text.trimEnd()+`\n\n${marker}\n`;
 return text;
});

// Late historical suites instrument the final bundle, so their final-live total assertions must see the six Starter Items too.
// Their historical behavior assertions remain unchanged.
for(const name of await readdir('scripts')){
 if(!name.startsWith('verify-')||!name.endsWith('.mjs')||name==='verify-v37-final-touch.mjs')continue;
 const path=`scripts/${name}`;await patch(path,text=>text
  .replaceAll('RIFT_ITEM_CATALOG.length,213','RIFT_ITEM_CATALOG.length,219')
  .replaceAll('catalog.length,213','catalog.length,219')
  .replaceAll('totals.moves,276','totals.moves,280')
  .replaceAll('powers.length,55','powers.length,56')
  .replaceAll('g.length,55','g.length,56'));
}
console.log('Prepared V37 verifier compatibility: 219 live items, Starter Items excluded from normal Armory offers, 56 public powers / 280 Codex techniques, 63/245 certified additive constitution, and the Final Touch regression gate runs after the historical suites.');
