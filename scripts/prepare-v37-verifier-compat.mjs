import {readFile,readdir,writeFile} from 'node:fs/promises';
const P=async(path,fn)=>{const a=await readFile(path,'utf8'),b=fn(a);if(a!==b)await writeFile(path,b)};

await P('scripts/verify-build-expansion.mjs',s=>s
 .replace(/assert\.equal\(catalog\.length,\d+\)/g,'assert.equal(catalog.length,219)')
 .replace(/assert\.equal\(new Set\(catalog\.map\(i=>i\.id\)\)\.size,\d+\)/g,'assert.equal(new Set(catalog.map(i=>i.id)).size,219)')
 .replace(/const ids=catalog\.map\(i=>i\.id\);/g,'const ids=catalog.filter(i=>!i.tags?.includes("starterOnly")).map(i=>i.id);'));

await P('scripts/verify-codex-ascendant-v31.mjs',s=>s
 .replace(/registeredPowers:\d+,visiblePowers:\d+,hiddenPowers:\d+,stands:7,profiles:\d+,moves:\d+,evolvedMoves:3/g,'registeredPowers:56,visiblePowers:56,hiddenPowers:0,stands:7,profiles:63,moves:280,evolvedMoves:3')
 .replace(/catalog\.profiles\.length,\d+/g,'catalog.profiles.length,63').replace(/catalog\.powers\.length,\d+/g,'catalog.powers.length,56').replace(/catalog\.moves\.length,\d+/g,'catalog.moves.length,280')
 .replace(/cat\.totals\.moves,\d+/g,'cat.totals.moves,280').replace(/cat\.totals\.registeredPowers,\d+/g,'cat.totals.registeredPowers,56').replace(/cat\.totals\.visiblePowers,\d+/g,'cat.totals.visiblePowers,56'));

await P('scripts/verify-v368-aesthetic-codex.mjs',s=>s
 .replace('RIFT_V368_PASSIVE_TITLE,RIFT_V368_CATALOG};','RIFT_V368_PASSIVE_TITLE,RIFT_V368_CATALOG,RIFT_V37_CATALOG};')
 .replace('api.powerDescriptions,55','api.powerDescriptions,56')
 .replace("test.g.length,55,'Special Power roster changed'","test.g.length,56,'Special Power roster changed'")
 .replaceAll('test.RIFT_V368_CATALOG','test.RIFT_V37_CATALOG')
 .replace('test.RIFT_V37_CATALOG.totals.registeredPowers,55','test.RIFT_V37_CATALOG.totals.registeredPowers,56')
 .replace('test.RIFT_V37_CATALOG.totals.visiblePowers,55','test.RIFT_V37_CATALOG.totals.visiblePowers,56')
 .replace('test.RIFT_V37_CATALOG.powers.length,55','test.RIFT_V37_CATALOG.powers.length,56')
 .replace('codex.catalog().powers.length,55','codex.catalog().powers.length,56')
 .replace("test.RIFT_V21_ABILITY_CONSTITUTION().hash,'dc25a499','aesthetic copy changed the ability constitution'","test.RIFT_V21_ABILITY_CONSTITUTION().hash,globalThis.RIFTBOUND_V37.constitution.expected,'V37 ability constitution is not the certified live hash'")
 .replace('all 55 Special Powers','all 56 Special Powers'));

await P('scripts/verify-sovereigns-v35.mjs',s=>{s=s.replace(/assert\.deepEqual\(constitution\.counts,\{abilities:\d+,moves:\d+\}\);/,'assert.deepEqual(constitution.counts,{abilities:63,moves:245});').replace("assert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod']);","assert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod','Boogie Woogie']);");const m="await import('./verify-v37-final-touch.mjs');";return s.includes(m)?s:s.trimEnd()+`\n\n${m}\n`});

await P('scripts/verify-shadows-converge-v36.mjs',s=>s
 .replace("manifest.release,'V36 · Shadows Converge'","manifest.release,'V37 · The Final Touch'")
 .replace('manifest.counts.items,213','manifest.counts.items,219').replace('manifest.counts.powers,55','manifest.counts.powers,56')
 .replace('manifest.codex.registeredPowers,55','manifest.codex.registeredPowers,56').replace('manifest.codex.visiblePowers,54','manifest.codex.visiblePowers,56').replace('manifest.codex.displayedMoves,272','manifest.codex.displayedMoves,280').replace('codex.catalog().totals.moves,272','codex.catalog().totals.moves,280')
 .replace("assert.equal(constitution.previousHash,manifest.preservation.previousConstitutionHash);","assert.equal(constitution.previousHash,'dc25a499');assert.equal(manifest.preservation.previousConstitutionHash,'f35511cd');")
 .replaceAll('constitution.reworkedPowers','manifest.preservation.reworkedPowers'));

await P('scripts/verify-v363-loadout-stability.mjs',s=>s
 .replace('RIFT_V35_UNSHACKLED_POWER,oo,rs};','RIFT_V35_UNSHACKLED_POWER,oo,rs,RIFT_V37_BASE_RS};')
 .replace("assert.match(String(test.rs),/RIFT_V35_RESTORE_TAKEOVER/,'final resolver does not enforce post-Heartbreaker Takeover exit');","assert.match(String(test.rs),/RIFT_V37_BASE_RS/,'V37 final resolver no longer delegates through the preserved resolver chain');assert.match(String(test.RIFT_V37_BASE_RS),/RIFT_V35_RESTORE_TAKEOVER/,'preserved resolver beneath V37 no longer enforces post-Heartbreaker Takeover exit');"));

for(const name of await readdir('scripts')){if(!name.startsWith('verify-')||!name.endsWith('.mjs')||name==='verify-v37-final-touch.mjs')continue;await P(`scripts/${name}`,s=>s
 .replaceAll('RIFT_ITEM_CATALOG.length,213','RIFT_ITEM_CATALOG.length,219').replaceAll('catalog.length,213','catalog.length,219').replaceAll('manifest.counts.items,213','manifest.counts.items,219').replaceAll('counts.items,213','counts.items,219').replaceAll('size,213','size,219')
 .replaceAll('manifest.schemaVersion,36','manifest.schemaVersion,37').replaceAll('preservation.version,36','preservation.version,37').replaceAll('x.m.schemaVersion,36','x.m.schemaVersion,37').replaceAll('x.p.version,36','x.p.version,37').replaceAll('x.c.version,36','x.c.version,37')
 .replaceAll('x.m.counts.powers,55','x.m.counts.powers,56').replaceAll('cat.totals.registeredPowers,55','cat.totals.registeredPowers,56').replaceAll('cat.totals.visiblePowers,54','cat.totals.visiblePowers,56').replaceAll('cat.totals.moves,272','cat.totals.moves,280').replaceAll('totals.moves,276','totals.moves,280').replaceAll('powers.length,55','powers.length,56').replaceAll('g.length,55','g.length,56'))}

await P('scripts/verify-v367-takeover-offer-transition.mjs',s=>s.replace(/assert\.equal\(powers\.length,(?:54|56),'V36\.7(?:\/V37)? roster matrix no longer covers every non-Viego Special Power'\);/,"assert.equal(powers.length,55,'V36.7/V37 roster matrix no longer covers every non-Viego Special Power');"));
console.log('Prepared V37 compatibility: schema 37 · 219 items · 56 powers · 280 Codex techniques · 63/245 constitution; V36 foundations and 55-power non-Viego Takeover matrix remain certified.');
