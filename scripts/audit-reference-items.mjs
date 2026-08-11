#!/usr/bin/env node
import {existsSync} from "node:fs";
import {readFile,rm,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {pathToFileURL} from "node:url";

const gameRoot=resolve(process.argv[2]||".build/riftbound-standalone");
const bundlePath=resolve(gameRoot,"assets/page-F6OuavDb.js");
const packagePath=resolve(dirname(bundlePath),"package.json");
const instrumentedPath=resolve(dirname(bundlePath),"page-reference-lore-audit.js");
if(!existsSync(bundlePath))throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);
const bundle=await readFile(bundlePath,"utf8");
const exportMarker="export{xs as default};";
const hook=`globalThis.__RIFTBOUND_REFERENCE_LORE_AUDIT__={RIFT_ITEM_CATALOG};`;
if(bundle.split(exportMarker).length-1!==1)throw new Error(`Reference-lore audit export seam is not unique.`);
const packageExisted=existsSync(packagePath);
try{
  if(!packageExisted)await writeFile(packagePath,'{"type":"module"}\n');
  await writeFile(instrumentedPath,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?audit=${Date.now()}`);
  const catalog=globalThis.__RIFTBOUND_REFERENCE_LORE_AUDIT__?.RIFT_ITEM_CATALOG||[];
  const rows=catalog.filter(item=>item.reference&&item.reference!==`Riftbound Original`&&item.reference!==`Riftbound`).map(item=>({id:item.id,name:item.name,rarity:item.rarity,category:item.category,reference:item.reference,lore:item.lore||``}));
  console.log(`REFERENCE_LORE_AUDIT ${JSON.stringify(rows)}`);
  console.log(`REFERENCE_LORE_COUNT ${rows.length}`);
}finally{
  delete globalThis.__RIFTBOUND_REFERENCE_LORE_AUDIT__;
  await rm(instrumentedPath,{force:true});
  if(!packageExisted)await rm(packagePath,{force:true});
}
