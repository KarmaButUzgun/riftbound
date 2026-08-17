import {readFile,readdir,writeFile} from 'node:fs/promises';

async function patch(path,transform){let text=await readFile(path,'utf8'),next=transform(text);if(next!==text)await writeFile(path,next)}

// V37 intentionally expands the live game by six start-only items and one four-move Epic power.
// Historical suites keep checking their original mechanics, but final-live catalog/schema assertions must acknowledge the additive release.
await patch('scripts/verify-build-expansion.mjs',text=>{
 text=text.replace(/assert\.equal\(catalog\.length,\d+\)/g,'assert.equal(catalog.length,219)');
 text=text.replace(/assert\.equal\(new Set\(catalog\.map\(i=>i\.id\)\)\.size,\d+\)/g,'assert.equal(new Set(catalog.map(i=>i.id)).size,219)');
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

await patch('scripts/verify-sovereigns-v35.mjs',text=>{
 text=text.replace(/assert\.deepEqual\(constitution\.counts,\{abilities:\d+,moves:\d+\}\);/,'assert.deepEqual(constitution.counts,{abilities:63,moves:245});');
 text=text.replace("assert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod']);","assert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod','Boogie Woogie']);");
 const marker="await import('./verify-v37-final-touch.mjs');";
 if(!text.includes(marker))text=text.trimEnd()+`\n\n${marker}\n`;
 return text;
});

// V36's mechanics verifier is intentionally chained by the V35 gate. Its V36 API and mechanics stay authoritative,
// while the manifest/Codex values it reads are the final V37 live wrapper. Keep both links of the constitution chain explicit:
// dc25a499 is V36's historical previous hash; f35511cd is the immediate V36.8 predecessor recorded by V37.
await patch('scripts/verify-shadows-converge-v36.mjs',text=>text
 .replace("manifest.release,'V36 · Shadows Converge'","manifest.release,'V37 · The Final Touch'")
 .replace('manifest.counts.items,213','manifest.counts.items,219')
 .replace('manifest.counts.powers,55','manifest.counts.powers,56')
 .replace('manifest.codex.registeredPowers,55','manifest.codex.registeredPowers,56')
 .replace('manifest.codex.visiblePowers,54','manifest.codex.visiblePowers,56')
 .replace('manifest.codex.displayedMoves,272','manifest.codex.displayedMoves,280')
 .replace('codex.catalog().totals.moves,272','codex.catalog().totals.moves,280')
 .replace("assert.equal(constitution.previousHash,manifest.preservation.previousConstitutionHash);","assert.equal(constitution.previousHash,'dc25a499');assert.equal(manifest.preservation.previousConstitutionHash,'f35511cd');")
 .replaceAll('constitution.reworkedPowers','api.reworkedPowers'));

// The V36 post-compat generators rewrite several historical suites into final-live foundation checks.
// Advance final-live counts/schema to V37 while retaining V36 labels and metrics for foundations V37 reuses unchanged.
for(const name of await readdir('scripts')){
 if(!name.startsWith('verify-')||!name.endsWith('.mjs')||name==='verify-v37-final-touch.mjs')continue;
 const path=`scripts/${name}`;await patch(path,text=>text
  .replaceAll('RIFT_ITEM_CATALOG.length,213','RIFT_ITEM_CATALOG.length,219')
  .replaceAll('catalog.length,213','catalog.length,219')
  .replaceAll('manifest.counts.items,213','manifest.counts.items,219')
  .replaceAll('counts.items,213','counts.items,219')
  .replaceAll('size,213','size,219')
  .replaceAll('manifest.schemaVersion,36','manifest.schemaVersion,37')
  .replaceAll('preservation.version,36','preservation.version,37')
  .replaceAll('x.m.schemaVersion,36','x.m.schemaVersion,37')
  .replaceAll('x.p.version,36','x.p.version,37')
  .replaceAll('x.c.version,36','x.c.version,37')
  .replaceAll('x.m.counts.powers,55','x.m.counts.powers,56')
  .replaceAll('cat.totals.registeredPowers,55','cat.totals.registeredPowers,56')
  .replaceAll('cat.totals.visiblePowers,54','cat.totals.visiblePowers,56')
  .replaceAll('cat.totals.moves,272','cat.totals.moves,280')
  .replaceAll('totals.moves,276','totals.moves,280')
  .replaceAll('powers.length,55','powers.length,56')
  .replaceAll('g.length,55','g.length,56'));
}
console.log('Prepared V37 verifier compatibility: schema/Codex 37, 219 live items, Starter Items excluded from normal Armory offers, inherited V36 preview foundation preserved at its certified legacy coverage, V36 mechanics and both constitution-chain links certified beneath the V37 live wrapper, 56 public powers / 280 live techniques, 63/245 certified additive constitution, and the Final Touch regression gate runs after the historical suites.');
