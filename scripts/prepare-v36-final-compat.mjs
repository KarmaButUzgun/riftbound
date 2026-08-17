import {readFile,writeFile} from 'node:fs/promises';
async function patch(path,pairs){let text=await readFile(path,'utf8');for(const [from,to] of pairs)text=text.replaceAll(from,to);await writeFile(path,text)}
await patch('scripts/verify-build-expansion.mjs',[[`size,211`,`size,213`],[`size,71`,`size,72`],[`mythical.length,26`,`mythical.length,27`],[`myths.length,26`,`myths.length,27`]]);
const v9=[
"import assert from 'node:assert/strict';",
"import {existsSync} from 'node:fs';",
"import {readFile,writeFile,rm} from 'node:fs/promises';",
"import {resolve,dirname} from 'node:path';",
"import {pathToFileURL} from 'node:url';",
"const root=resolve(process.argv[2]||'.build/riftbound-standalone'),bundlePath=resolve(root,'assets/page-F6OuavDb.js');",
"const js=await readFile(bundlePath,'utf8');assert.ok(js.includes('MYTHICAL SLOT OCCUPIED'));assert.ok(js.includes('Riftbound Shadows Converge V36'));",
"const exportMarker='export{xs as default};',testPath=resolve(dirname(bundlePath),'page-v36-v9-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),had=existsSync(pkg);",
"try{if(!had)await writeFile(pkg,'{\"type\":\"module\"}\\n');await writeFile(testPath,js.replace(exportMarker,'globalThis.__V36_V9={items:RIFT_ITEM_CATALOG,profile:RIFT_V9_MYTHIC_PROFILE,manifest:globalThis.RIFTBOUND_MANIFEST};'+exportMarker));await import(pathToFileURL(testPath).href+'?v='+Date.now());const t=globalThis.__V36_V9,mythics=t.items.filter(i=>i.rarity==='Mythical');assert.equal(mythics.length,27);assert.equal(new Set(mythics.map(i=>i.id)).size,27);assert.ok(Object.keys(t.profile).length>=24);const mantle=mythics.find(i=>i.id==='shadow-mantle');assert.ok(mantle);assert.deepEqual(mantle.stats,{durability:6});assert.equal(Object.keys(mantle.stats).length,1);assert.match(mantle.passive,/50%/);assert.equal(t.manifest.counts.mythical,27);console.log('Mythical V9/V36 compatibility verified: 27 live Mythicals, historical profile registry intact, one-slot contract retained.')}finally{delete globalThis.__V36_V9;await rm(testPath,{force:true});if(!had)await rm(pkg,{force:true})}"
].join('\n');
await writeFile('scripts/verify-major-balance-mythical-v9.mjs',v9);
const v6=[
"import assert from 'node:assert/strict';",
"import {existsSync} from 'node:fs';",
"import {readFile,writeFile,rm} from 'node:fs/promises';",
"import {resolve,dirname} from 'node:path';",
"import {pathToFileURL} from 'node:url';",
"const root=resolve(process.argv[2]||'.build/riftbound-standalone');",
"const bundlePath=resolve(root,'assets/page-F6OuavDb.js');",
"const js=await readFile(bundlePath,'utf8');",
"assert.ok(js.includes('RIFT_REFERENCE_LORE_V6'));assert.ok(js.includes('Riftbound Shadows Converge V36'));",
"const exportMarker='export{xs as default};';assert.equal(js.split(exportMarker).length-1,1);",
"const testPath=resolve(dirname(bundlePath),'page-v36-reference-lore-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),had=existsSync(pkg);",
"try{if(!had)await writeFile(pkg,'{\"type\":\"module\"}\\n');await writeFile(testPath,js.replace(exportMarker,'globalThis.__V36_LORE_ITEMS=RIFT_ITEM_CATALOG;'+exportMarker));await import(pathToFileURL(testPath).href+'?v='+Date.now());const items=globalThis.__V36_LORE_ITEMS;assert.ok(Array.isArray(items));for(const name of ['Shadow Crystal','Shadow Mantle']){const item=items.find(i=>i.name===name);assert.ok(item,name+' missing');assert.ok(item.reference&&item.reference.includes('DELTARUNE'),name+' reference missing');assert.ok(item.lore&&item.lore.length>20&&item.lore.length<=190,name+' authored lore missing')}console.log('Reference lore compatibility verified for V36 Dark items.')}finally{delete globalThis.__V36_LORE_ITEMS;await rm(testPath,{force:true});if(!had)await rm(pkg,{force:true})}"
].join('\n');
await writeFile('scripts/verify-reference-lore-v6.mjs',v6);
console.log('Applied V36 final live-count, Mythical V9, and reference-lore compatibility sweep.');
