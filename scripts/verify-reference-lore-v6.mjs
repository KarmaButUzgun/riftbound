#!/usr/bin/env node
import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {readFile,rm,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {pathToFileURL} from "node:url";

const gameRoot=resolve(process.argv[2]||".build/riftbound-standalone");
const bundlePath=resolve(gameRoot,"assets/page-F6OuavDb.js");
const packagePath=resolve(dirname(bundlePath),"package.json");
const instrumentedPath=resolve(dirname(bundlePath),"page-reference-lore-v6-test.js");
if(!existsSync(bundlePath))throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);
const bundle=await readFile(bundlePath,"utf8");
const marker="/* Riftbound Reference Lore Rewrite V6 · in-world copy for every external artifact */";
const catalogAnchor="const RIFT_ITEM_CATALOG = (() => {";
const freezeAnchor="const byId = new Map(items.map(item => [item.id, item]));";
const applyNeedle="for(const RIFT_REFERENCE_LORE_ITEM of items)";
assert.ok(bundle.includes(marker),"Reference Lore V6 runtime marker missing");
assert.ok(bundle.indexOf(marker)<bundle.indexOf(catalogAnchor),"V6 lore map must exist before catalog construction begins");
assert.ok(bundle.includes(applyNeedle),"V6 pre-freeze application loop missing");
assert.ok(bundle.indexOf(applyNeedle)<bundle.indexOf(freezeAnchor),"V6 lore must be applied before catalog objects freeze");
for(const bannedSource of ["A reference artifact translated into Riftbound rules without losing the behavior that made it famous.","A reference-forged component whose mechanic follows its fiction.","A high-specialization component made to be built around, not merely equipped."])assert.ok(!bundle.slice(bundle.indexOf(marker),bundle.indexOf(catalogAnchor)).includes(bannedSource),`V6 authored map contains stale generic lore: ${bannedSource}`);

const exportMarker="export{xs as default};";
assert.equal(bundle.split(exportMarker).length-1,1,"bundle export seam changed");
const hook=`globalThis.__RIFTBOUND_REFERENCE_LORE_V6_TEST__={RIFT_ITEM_CATALOG,RIFT_REFERENCE_LORE_V6};`;
const packageExisted=existsSync(packagePath);
try{
  if(!packageExisted)await writeFile(packagePath,'{"type":"module"}\n');
  await writeFile(instrumentedPath,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?test=${Date.now()}`);
  const api=globalThis.__RIFTBOUND_REFERENCE_LORE_V6_TEST__;assert.ok(api,"Reference Lore V6 test API missing");
  const referenced=api.RIFT_ITEM_CATALOG.filter(item=>item.reference&&item.reference!==`Riftbound Original`&&item.reference!==`Riftbound`);
  const entries=Object.entries(api.RIFT_REFERENCE_LORE_V6);
  assert.equal(referenced.length,79,"referenced-item count changed; add bespoke lore for every new external item");
  assert.equal(entries.length,79,"V6 lore map must contain exactly one entry per referenced item");
  assert.deepEqual(new Set(entries.map(([id])=>id)),new Set(referenced.map(item=>item.id)),"V6 lore IDs do not exactly cover the referenced catalog");
  const banned=/\breference\b|reference-forged|translated into|mechanic follows|inspired by|riftbound|fiction|fourth[- ]wall/i;
  const loreValues=[];
  for(const item of referenced){
    const lore=api.RIFT_REFERENCE_LORE_V6[item.id];
    assert.equal(typeof lore,"string",`${item.id} missing authored lore`);
    assert.equal(item.lore,lore,`${item.id} final catalog lore does not use V6 copy`);
    assert.ok(Object.isFrozen(item),`${item.id} catalog immutability regressed`);
    assert.ok(lore.length>=70,`${item.id} lore is too thin to feel item-specific`);
    assert.ok(lore.length<=240,`${item.id} lore is too long for the item detail surface`);
    assert.ok(!banned.test(lore),`${item.id} breaks the no-fourth-wall lore rule: ${lore}`);
    assert.ok(!/component made to be built around|translated|mechanic follows/i.test(lore),`${item.id} still reads like implementation commentary`);
    loreValues.push(lore);
  }
  assert.equal(new Set(loreValues).size,79,"two referenced items share the same lore description");
  for(const id of ["sparda-devil-sword","gauntlet-of-six-stones","master-sword-awakened","frostmourne-soulsteel","necronomicon-ex-mortis","black-pearl-compass","duelist-sensor","odm-harness"]){
    const item=referenced.find(entry=>entry.id===id);assert.ok(item,`${id} missing from reference catalog`);assert.equal(item.lore,api.RIFT_REFERENCE_LORE_V6[id]);
  }
  console.log(`Reference Lore V6 verified: ${referenced.length} externally-referenced items have unique, item-specific in-world lore authored before the immutable catalog freeze.`);
}finally{
  delete globalThis.__RIFTBOUND_REFERENCE_LORE_V6_TEST__;
  await rm(instrumentedPath,{force:true});
  if(!packageExisted)await rm(packagePath,{force:true});
}
