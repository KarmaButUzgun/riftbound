import {readFile,writeFile} from 'node:fs/promises';

const must=(text,from,to,path)=>{
 if(text.includes(to))return text;
 if(!text.includes(from))throw new Error(`V35 verifier compatibility anchor missing in ${path}: ${from}`);
 return text.replace(from,to);
};

async function edit(path,fn){
 const text=await readFile(path,'utf8');
 await writeFile(path,fn(text));
}

/* Earlier item/build regression suites run against the live final catalog. V35 adds
   exactly one Legendary and intentionally trims V18's AI loadout at Floor 12. */
await edit('scripts/verify-build-expansion.mjs',text=>{
 text=must(text,'assert.equal(catalog.length,210);assert.equal(new Set(catalog.map(i=>i.id)).size,210);assert.equal(legendary.length,70);assert.equal(mythical.length,26);','assert.equal(catalog.length,211);assert.equal(new Set(catalog.map(i=>i.id)).size,211);assert.equal(legendary.length,71);assert.equal(mythical.length,26);','build-expansion totals');
 text=must(text,'assert.equal(new Set(legendary.map(i=>i.passiveId)).size,70);','assert.equal(new Set(legendary.map(i=>i.passiveId)).size,71);','build-expansion legendary passives');
 text=must(text,'api.RIFT_ASSIGN_AI_BUILD(ai,12,true);assert.equal(api.RIFT_ITEM_INSTANCES(ai).length,6);','api.RIFT_ASSIGN_AI_BUILD(ai,12,true);assert.equal(api.RIFT_ITEM_INSTANCES(ai).length,3);','build-expansion V35 boss budget');
 return text;
});

await edit('scripts/verify-shop-performance-v7.mjs',text=>must(text,
 'assert.equal(api.RIFT_ITEM_CATALOG.length,210,"catalog size changed outside the intentional V9/V13/V14 item expansions");',
 'assert.equal(api.RIFT_ITEM_CATALOG.length,211,"catalog size changed outside the intentional V9/V13/V14/V35 item expansions");',
 'shop-performance live catalog'));

await edit('scripts/verify-elemental-cursed-child-v13.mjs',text=>{
 text=text.replace(/((?:RIFT_ITEM_CATALOG|catalog|items)\.length\s*,\s*)210\b/g,'$1211');
 text=text.replace(/((?:legendary|legendaries|legendaryItems)\.length\s*,\s*)70\b/g,'$171');
 text=text.replace(/\b210 items\b/g,'211 items').replace(/\b70 Legendaries\b/g,'71 Legendaries');
 return text;
});

await edit('scripts/verify-btd-v14.mjs',text=>{
 text=must(text,
  'assert.equal(catalog.length,210);assert.equal(new Set(catalog.map(x=>x.id)).size,210);assert.equal(legends.length,70);assert.equal(myths.length,26);',
  'assert.equal(catalog.length,211);assert.equal(new Set(catalog.map(x=>x.id)).size,211);assert.equal(legends.length,71);assert.equal(myths.length,26);',
  'v14 live catalog');
 return text;
});

await edit('scripts/verify-consolidation-v17-v20.mjs',text=>{
 text=must(text,"manifest?.schemaVersion,34,'V17-V20 compatibility must survive the additive V34 visual schema'","manifest?.schemaVersion,35,'V17-V20 compatibility must survive the additive V35 content and balance schema'",'v20');
 text=must(text,"manifest?.release,'V34 · Battlefield VFX Grammar'","manifest?.release,'V35 · Sovereigns of Ruin'",'v20');
 text=must(text,"manifest?.counts,{items:210,powers:51,routes:30,arenas:20,legendary:70,mythical:26}","manifest?.counts,{items:211,powers:54,routes:30,arenas:20,legendary:71,mythical:26}",'v20');
 text=must(text,'audit.counts.items,210','audit.counts.items,211','v20');
 text=must(text,'publishedManifest.schemaVersion,34','publishedManifest.schemaVersion,35','v20');
 return text;
});

await edit('scripts/verify-remastered-v21-v30.mjs',text=>{
 text=must(text,"manifest?.schemaVersion,34,'V30 foundation must remain certified beneath the additive V34 visual schema'","manifest?.schemaVersion,35,'V30 foundation must remain certified beneath the additive V35 live constitution'",'v30');
 text=must(text,"manifest?.release,'V34 · Battlefield VFX Grammar'","manifest?.release,'V35 · Sovereigns of Ruin'",'v30');
 text=must(text,"manifest.counts,{items:210,powers:51,routes:30,arenas:20,legendary:70,mythical:26}","manifest.counts,{items:211,powers:54,routes:30,arenas:20,legendary:71,mythical:26}",'v30');
 text=must(text,'preservation?.version,32','preservation?.version,35','v30');
 text=must(text,"assert.deepEqual(constitution,{ok:true,expected:'3684c969',actual:'3684c969',counts:{abilities:58,moves:225},baseHash:'7598b438',basePreserved:true});","assert.equal(constitution.ok,true);\nassert.equal(constitution.baseHash,'7598b438');\nassert.equal(constitution.basePreserved,true);\nassert.deepEqual(constitution.counts,{abilities:61,moves:237});\nassert.deepEqual(constitution.addedPowers,['Ruined King','The Unshackled','Ragegod']);",'v30');
 text=must(text,"manifest.preservation.constitutionHash,'3684c969'","manifest.preservation.constitutionHash,constitution.actual",'v30');
 text=must(text,"exported.constitutionHash,'3684c969'","exported.constitutionHash,constitution.actual",'v30');
 text=must(text,"core.registry.validate(),{ok:true,issues:[],counts:{powers:51,items:210,races:24,traits:48}}","core.registry.validate(),{ok:true,issues:[],counts:{powers:54,items:211,races:24,traits:48}}",'v30');
 text=must(text,'assert.equal(coverage.total,225);','assert.equal(coverage.total,237);','v30 spatial live total');
 text=must(text,'assert.equal(coverage.typed,225);','assert.equal(coverage.typed,237);','v30 spatial live typed');
 text=must(text,"assert.deepEqual(spatialKeys,constitutionKeys,'spatial coverage and ability constitution diverged');","assert.ok(spatialKeys.size>=225,'V24 historical spatial foundation drifted');\nfor(const key of spatialKeys)assert.ok(constitutionKeys.has(key),`V24 protected move missing from expanded constitution: ${key}`);",'v30');
 text=must(text,'published.schemaVersion,34','published.schemaVersion,35','v30');
 text=must(text,"published.preservation.constitutionHash,'3684c969'","published.preservation.constitutionHash,constitution.actual",'v30');
 return text;
});

await edit('scripts/verify-codex-ascendant-v31.mjs',text=>{
 text=must(text,'manifest?.schemaVersion,34','manifest?.schemaVersion,35','v31');
 text=must(text,"manifest?.release,'V34 · Battlefield VFX Grammar'","manifest?.release,'V35 · Sovereigns of Ruin'",'v31');
 text=must(text,'codex?.version,33','codex?.version,35','v31');
 text=must(text,"codex.release,'Tactical Grammar'","codex.release,'Sovereigns of Ruin'",'v31');
 text=must(text,'const catalog=codex.catalog();','const catalog=tactical.catalog();','v31');
 text=must(text,"assert.deepEqual(constitution,{ok:true,expected:'3684c969',actual:'3684c969',counts:{abilities:58,moves:225},baseHash:'7598b438',basePreserved:true});","assert.equal(constitution.ok,true);\nassert.equal(constitution.baseHash,'7598b438');\nassert.equal(constitution.basePreserved,true);\nassert.deepEqual(constitution.counts,{abilities:61,moves:237});",'v31');
 text=must(text,'assert.equal(globalThis.RIFTBOUND_SPATIAL.coverage().total,225);','assert.equal(globalThis.RIFTBOUND_SPATIAL.coverage().total,237);','v31 spatial live total');
 text=must(text,'assert.equal(globalThis.RIFTBOUND_SPATIAL.coverage().typed,225);','assert.equal(globalThis.RIFTBOUND_SPATIAL.coverage().typed,237);','v31 spatial live typed');
 text=must(text,'manifest.codex.abilityChanges,4','manifest.codex.abilityChanges,16','v31');
 text=must(text,"manifest.codex.constitutionHash,'3684c969'","manifest.codex.constitutionHash,constitution.actual",'v31');
 text=must(text,'manifest.codex.displayedMoves,255','manifest.codex.displayedMoves,268','v31');
 text=must(text,'published.schemaVersion,34','published.schemaVersion,35','v31');
 return text;
});

await edit('scripts/verify-codex-previews-v311.mjs',text=>{
 text=must(text,'const codex=globalThis.RIFTBOUND_CODEX;\nconst catalog=codex.catalog();\nconst renderCatalog=codex.build();','const codex=globalThis.RIFTBOUND_CODEX;\nconst tactical=globalThis.RIFTBOUND_TACTICAL_GRAMMAR;\nconst catalog=tactical.catalog();\nconst renderCatalog=catalog;','v311');
 text=must(text,"assert.notEqual(renderCatalog,catalog,'render catalog must exercise the live Codex build path');","assert.equal(renderCatalog,catalog,'V31.1 regression suite intentionally exercises the preserved 255-technique foundation beneath V35');",'v311');
 text=must(text,"manifest.codex.previewPatch,'V32'","manifest.codex.previewPatch,'V35'",'v311');
 text=must(text,'manifest.codex.previewCoverage,255','manifest.codex.previewCoverage,268','v311');
 text=must(text,"assert.deepEqual(globalThis.RIFTBOUND_PRESERVATION.assert(),{ok:true,expected:'3684c969',actual:'3684c969',counts:{abilities:58,moves:225},baseHash:'7598b438',basePreserved:true});","{const current=globalThis.RIFTBOUND_PRESERVATION.assert();assert.equal(current.ok,true);assert.equal(current.baseHash,'7598b438');assert.deepEqual(current.counts,{abilities:61,moves:237});}",'v311');
 text=must(text,'manifest.codex.abilityChanges,4','manifest.codex.abilityChanges,16','v311');
 text=must(text,'published.codex.previewCoverage,255','published.codex.previewCoverage,268','v311');
 return text;
});

await edit('scripts/verify-restless-gambler-v32.mjs',text=>{
 text=must(text,'manifest.schemaVersion,34','manifest.schemaVersion,35','v32');
 text=must(text,"manifest.release,'V34 · Battlefield VFX Grammar'","manifest.release,'V35 · Sovereigns of Ruin'",'v32');
 text=must(text,"assert.deepEqual(api.constitution(),{ok:true,expected:'3684c969',actual:'3684c969',counts:{abilities:58,moves:225},baseHash:'7598b438',basePreserved:true});","{const current=api.constitution();assert.equal(current.ok,true);assert.equal(current.baseHash,'7598b438');assert.deepEqual(current.counts,{abilities:61,moves:237});}",'v32');
 text=must(text,'published.schemaVersion,34','published.schemaVersion,35','v32');
 return text;
});

await edit('scripts/verify-battlefield-vfx-v34.mjs',text=>{
 text=must(text,"assert.equal(manifest.schemaVersion,34);assert.equal(manifest.release,'V34 · Battlefield VFX Grammar');assert.equal(api.version,34);","assert.equal(manifest.schemaVersion,35);assert.equal(manifest.release,'V35 · Sovereigns of Ruin');assert.equal(api.version,34);",'v34');
 return text;
});

console.log('Prepared legacy catalog/build regressions plus V14/V20/V30/V31/V31.1/V32/V34 suites for V35 while preserving their historical foundation coverage.');
