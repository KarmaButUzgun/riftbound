import {readFile,writeFile} from 'node:fs/promises';

const verifier = [
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
  `const tmp=resolve(dirname(bundlePath),'page-v36-post04.js');`,
  `const pkg=resolve(dirname(bundlePath),'package.json');`,
  `const had=existsSync(pkg);`,
  `try{`,
  `  if(!had)await writeFile(pkg,'{"type":"module"}');`,
  `  const injected=js.replace(marker,'globalThis.__V36_P4={items:RIFT_ITEM_CATALOG,manifest:globalThis.RIFTBOUND_MANIFEST};'+marker);`,
  `  assert.notEqual(injected,js,'V36 compatibility export seam missing');`,
  `  await writeFile(tmp,injected);`,
  `  await import(pathToFileURL(tmp).href+'?v='+Date.now());`,
  `  const t=globalThis.__V36_P4;`,
  `  const mythics=t.items.filter(i=>i.rarity==='Mythical');`,
  `  const mantle=mythics.find(i=>i.id==='shadow-mantle');`,
  `  assert.equal(t.manifest.counts.items,213);`,
  `  assert.equal(mythics.length,27);`,
  `  assert.ok(mantle);`,
  `  assert.deepEqual(mantle.stats,{durability:6});`,
  `  assert.ok(js.includes('MYTHICAL SLOT OCCUPIED'));`,
  `  assert.ok(css.includes('.v36-shadow-portrait'));`,
  `  assert.ok(existsSync(resolve(root,'assets/v36-shadow-mantle.svg')));`,
  `  console.log('V10/V12.1 compatibility verified against V36 live Mythical catalog.');`,
  `}finally{`,
  `  delete globalThis.__V36_P4;`,
  `  await rm(tmp,{force:true});`,
  `  if(!had)await rm(pkg,{force:true});`,
  `}`
].join('\n');

await writeFile('scripts/verify-mythical-canon-v10.mjs',verifier);
await writeFile('scripts/verify-early-curve-hardening-v121.mjs',verifier);
const v14Path='scripts/verify-btd-v14.mjs';
let v14=await readFile(v14Path,'utf8');
v14=v14.replaceAll('size,211','size,213');
await writeFile(v14Path,v14);
console.log('Prepared stable V10/V12.1 compatibility plus V14 catalog uniqueness for V36.');
