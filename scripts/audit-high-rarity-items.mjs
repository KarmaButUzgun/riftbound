#!/usr/bin/env node
import {existsSync} from "node:fs";
import {readFile,rm,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {pathToFileURL} from "node:url";

const gameRoot=resolve(process.argv[2]||".build/riftbound-standalone");
const bundlePath=resolve(gameRoot,"assets/page-F6OuavDb.js");
const packagePath=resolve(dirname(bundlePath),"package.json");
const instrumentedPath=resolve(dirname(bundlePath),"page-high-rarity-audit.js");
if(!existsSync(bundlePath))throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);
const bundle=await readFile(bundlePath,"utf8");
const exportMarker="export{xs as default};";
const hook=`globalThis.__RIFTBOUND_HIGH_RARITY_AUDIT__={RIFT_ITEM_CATALOG};`;
if(bundle.split(exportMarker).length-1!==1)throw new Error(`High-rarity audit export seam is not unique.`);
const packageExisted=existsSync(packagePath);
try{
  if(!packageExisted)await writeFile(packagePath,'{"type":"module"}\n');
  await writeFile(instrumentedPath,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?audit=${Date.now()}`);
  const catalog=globalThis.__RIFTBOUND_HIGH_RARITY_AUDIT__?.RIFT_ITEM_CATALOG||[];
  const rows=catalog.filter(item=>[`Legendary`,`Mythical`].includes(item.rarity)).map(item=>({id:item.id,name:item.name,rarity:item.rarity,category:item.category,reference:item.reference,iconKind:item.iconKind||null}));
  console.log(`HIGH_RARITY_AUDIT ${JSON.stringify(rows)}`);
  if(rows.filter(item=>item.rarity===`Legendary`).length!==67)throw new Error(`Expected 67 Legendary items.`);
  if(rows.filter(item=>item.rarity===`Mythical`).length!==1)throw new Error(`Expected 1 Mythical item.`);
}finally{
  delete globalThis.__RIFTBOUND_HIGH_RARITY_AUDIT__;
  await rm(instrumentedPath,{force:true});
  if(!packageExisted)await rm(packagePath,{force:true});
}
