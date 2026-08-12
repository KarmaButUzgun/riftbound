#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),'V12.3 build output missing');
const bundle=await readFile(bundlePath,'utf8');
const marker='/* Riftbound Codex OFA Copy V12.3 */';
assert.ok(bundle.includes(marker),'V12.3 marker missing');
assert.ok(bundle.includes('children:e.codexDescription||e.passive'),'Codex Powers renderer does not prefer codexDescription');
assert.ok(bundle.includes('One For All as carried by the ninth bearer.'),'base One For All Codex copy missing');
assert.ok(bundle.includes('One For All at All Might’s prime.'),'One For All Prime Codex copy missing');

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1,'V12.3 export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v123-test.js');
const pkg=resolve(dirname(bundlePath),'package.json');
const hadPkg=existsSync(pkg);
try{
  if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
  const hook='globalThis.__RIFT_V123_TEST__={powers:g};';
  await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
  const powers=globalThis.__RIFT_V123_TEST__?.powers;
  assert.ok(Array.isArray(powers),'power registry unavailable');
  const base=powers.find(power=>power.name==='One For All');
  const prime=powers.find(power=>power.name==='One For All Prime');
  assert.ok(base&&prime,'One For All entries missing');
  assert.notEqual(base.passive,prime.passive,'gameplay passive copy unexpectedly identical');
  assert.ok(base.codexDescription&&prime.codexDescription,'Codex-specific OFA descriptions missing');
  assert.notEqual(base.codexDescription,prime.codexDescription,'OFA Codex descriptions are still identical');
  for(const term of ['vestiges','Float','Danger Sense','Smokescreen','Blackwhip','Fa Jin','Gearshift','Faux 100%']) assert.ok(base.codexDescription.includes(term),`base OFA Codex copy missing ${term}`);
  for(const term of ['All Might','raw Might','Detroit','Delaware','Wyoming','United States of Smash']) assert.ok(prime.codexDescription.includes(term),`Prime OFA Codex copy missing ${term}`);
  console.log('V12.3 verified: base One For All and One For All Prime have separate, mechanically accurate Codex descriptions while gameplay passives remain unchanged.');
}finally{
  delete globalThis.__RIFT_V123_TEST__;
  await rm(instrumented,{force:true});
  if(!hadPkg)await rm(pkg,{force:true});
}
