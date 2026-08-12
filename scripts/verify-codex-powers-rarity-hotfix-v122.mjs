#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),'V12.2 build output missing');
const bundle=await readFile(bundlePath,'utf8');

const unsafe='style:{color:a[e.rarity].color},children:e.rarityLabel||e.rarity';
const safe='style:{color:a[e.rarity]?.color||e.accent||`#d8c9ff`},children:e.rarityLabel||e.rarity';
assert.ok(bundle.includes(safe),'Codex Powers safe rarity color fallback missing');
assert.ok(!bundle.includes(unsafe),'Codex Powers still dereferences missing rarity colors unsafely');

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1,'V12.2 export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-codex-v122-test.js');
const pkg=resolve(dirname(bundlePath),'package.json');
const hadPkg=existsSync(pkg);
try{
  if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
  const hook='globalThis.__RIFT_CODEX_V122_TEST__={powers:g,rarities:a};';
  await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
  const api=globalThis.__RIFT_CODEX_V122_TEST__;
  assert.ok(api,'V12.2 test API missing');
  const afo=api.powers.find(power=>power.name==='All For One');
  assert.ok(afo,'All For One power missing');
  assert.equal(afo.rarity,'Calamity','All For One should retain Calamity rarity');
  assert.equal(api.rarities[afo.rarity],undefined,'Calamity unexpectedly entered the normal rarity table');
  for(const power of api.powers){
    const color=api.rarities[power.rarity]?.color||power.accent||'#d8c9ff';
    assert.ok(color,`${power.name} has no safe Codex color`);
  }
  console.log(`V12.2 verified: Codex Powers safely renders all ${api.powers.length} powers, including All For One's Calamity rarity, without altering the normal rarity table.`);
}finally{
  delete globalThis.__RIFT_CODEX_V122_TEST__;
  await rm(instrumented,{force:true});
  if(!hadPkg)await rm(pkg,{force:true});
}
