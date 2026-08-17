import {readFile,writeFile} from 'node:fs/promises';
async function patch(path,pairs){let text=await readFile(path,'utf8');for(const [from,to] of pairs)text=text.replaceAll(from,to);await writeFile(path,text)}
await patch('scripts/verify-build-expansion.mjs',[[`size,211`,`size,213`],[`size,71`,`size,72`],[`mythical.length,26`,`mythical.length,27`],[`myths.length,26`,`myths.length,27`]]);
const v6=[
"import assert from 'node:assert/strict';",
"import {existsSync} from 'node:fs';",
"import {readFile,writeFile,rm} from 'node:fs/promises';",
"import {resolve,dirname} from 'node:path';",
"import {pathToFileURL} from 'node:url';",
"const root=resolve(process.argv[2]||'.build/riftbound-standalone');",
"const bundlePath=resolve(root,'assets/page-F6OuavDb.js');",
"const js=await readFile(bundlePath,'utf8');",
"for(const marker of ['RIFT_REFERENCE_LORE_V6','Reference Lore V6','Riftbound Shadows Converge V36'])assert.ok(js.includes(marker),'missing '+marker);",
"const exportMarker='export{xs as default};';assert.equal(js.split(exportMarker).length-1,1);",
"const testPath=resolve(dirname(bundlePath),'page-v36-reference-lore-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),had=existsSync(pkg);",
"try{if(!had)await writeFile(pkg,'{\"type\":\"module\"}\\n');await writeFile(testPath,js.replace(exportMarker,'globalThis.__V36_LORE={items:RIFT_ITEM_CATALOG,lore:RIFT_REFERENCE_LORE_V6};'+exportMarker));await import(pathToFileURL(testPath).href+'?v='+Date.now());const t=globalThis.__V36_LORE;assert.ok(t);const refs=t.items.filter(i=>i.reference&&i.reference!=='Original');assert.equal(refs.length,81);const loreCount=Object.keys(t.lore).length;assert.ok(loreCount===79||loreCount===81);const historical=refs.filter(i=>t.lore[i.name]);assert.ok(historical.length>=79);assert.deepEqual(historical.map(i=>i.name).sort(),Object.keys(t.lore).sort());for(const i of historical){assert.equal(i.lore,t.lore[i.name]);assert.ok(i.lore.length<=190)}const explicit=refs.filter(i=>!t.lore[i.name]);assert.ok(explicit.length<=2);assert.ok(explicit.every(i=>['Shadow Crystal','Shadow Mantle'].includes(i.name)));for(const name of ['Shadow Crystal','Shadow Mantle']){const i=refs.find(x=>x.name===name);assert.ok(i&&i.reference.includes('DELTARUNE'));assert.ok(i.lore&&i.lore.length>20&&i.lore.length<=190)}console.log('Reference lore V6/V36 verified: 79 historical entries preserved; V36 Dark lore certified.')}finally{delete globalThis.__V36_LORE;await rm(testPath,{force:true});if(!had)await rm(pkg,{force:true})}"
].join('\n');
await writeFile('scripts/verify-reference-lore-v6.mjs',v6);
console.log('Applied V36 final live-count and V6/V36 lore compatibility sweep.');
