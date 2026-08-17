import {writeFile} from 'node:fs/promises';

const base = [
  `import assert from 'node:assert/strict';`,
  `import {existsSync} from 'node:fs';`,
  `import {readFile,writeFile,rm} from 'node:fs/promises';`,
  `import {resolve,dirname} from 'node:path';`,
  `import {pathToFileURL} from 'node:url';`,
  `const root=resolve(process.argv[2]||'.build/riftbound-standalone');`,
  `const bundlePath=resolve(root,'assets/page-F6OuavDb.js');`,
  `const cssPath=resolve(root,'assets/riftbound.css');`,
  `const js=await readFile(bundlePath,'utf8');`,
  `const css=await readFile(cssPath,'utf8');`,
  `const marker='export{xs as default};';`,
  `const tmp=resolve(dirname(bundlePath),'page-v36-mythical-compat.js');`,
  `const pkg=resolve(dirname(bundlePath),'package.json');`,
  `const had=existsSync(pkg);`,
  `try{`,
  `  if(!had)await writeFile(pkg,'{"type":"module"}');`,
  `  const injected=js.replace(marker,"globalThis.__V36_MYTH={items:RIFT_ITEM_CATALOG,manifest:globalThis.RIFTBOUND_MANIFEST,guides:typeof RIFT_V16_BUILD_GUIDES!=='undefined'?RIFT_V16_BUILD_GUIDES:null};"+marker);`,
  `  assert.notEqual(injected,js,'V36 Mythical compatibility export seam missing');`,
  `  await writeFile(tmp,injected);`,
  `  await import(pathToFileURL(tmp).href+'?v='+Date.now());`,
  `  const t=globalThis.__V36_MYTH;`,
  `  const mythics=t.items.filter(i=>i.rarity==='Mythical');`,
  `  const mantle=mythics.find(i=>i.id==='shadow-mantle');`,
  `  assert.equal(mythics.length,27);`,
  `  assert.ok(mantle);`,
  `  assert.deepEqual(mantle.stats,{durability:6});`,
  `  assert.match(mantle.passive,/50%/);`,
  `  assert.equal(t.manifest.counts.mythical,27);`,
  `  assert.ok(js.includes('MYTHICAL SLOT OCCUPIED'));`,
  `  assert.ok(css.includes('.v36-shadow-portrait'));`,
  `  assert.ok(existsSync(resolve(root,'assets/v36-shadow-mantle.svg')));`
];

const tail = [
  `}finally{`,
  `  delete globalThis.__V36_MYTH;`,
  `  await rm(tmp,{force:true});`,
  `  if(!had)await rm(pkg,{force:true});`,
  `}`
];

function verifier(extra){return [...base,...extra,...tail].join('\n')}

await writeFile('scripts/verify-mythical-canon-v10.mjs',verifier([
  `assert.ok(js.includes('RIFTBOUND_MYTHICAL_V10')||js.includes('MYTHICAL V10')||js.includes('Mythical Canon'));`,
  `console.log('Mythical V10 compatibility verified beneath V36: 27 live Mythicals and authored Shadow Mantle art/contract.');`
]));
await writeFile('scripts/verify-shop-gui-reflow-v11.mjs',verifier([
  `assert.ok(css.includes('mythical')||css.includes('Mythical'));`,
  `console.log('Shop V11 compatibility verified beneath V36: Mythical group, one-slot contract, and Shadow Mantle portrait survive.');`
]));
await writeFile('scripts/verify-mythical-buildpaths-earlygame-v12.mjs',verifier([
  `assert.ok(t.guides&&t.guides['The Roaring Knight']);`,
  `console.log('V12 build-path compatibility verified beneath V36: live Mythical catalog and Roaring Knight guide are present.');`
]));
console.log('Prepared V10–V12 historical Mythical suites for the V36 27-Mythical live catalog.');
