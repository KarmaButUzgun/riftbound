#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const gameRoot=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(gameRoot,'assets/page-F6OuavDb.js');
const packagePath=resolve(dirname(bundlePath),'package.json');
const testPath=resolve(dirname(bundlePath),'page-v142-save-load-test.js');
if(!existsSync(bundlePath))throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);

const bundle=await readFile(bundlePath,'utf8');
for(const needle of [
  '/* Riftbound V14.2 save-load null-run hotfix */',
  'function RIFT_V13_ACTOR(run,fighter){if(!run||!fighter)return null;',
  'function RIFT_V13_SIMPLE_ACTIVE(run,f){if(!run||!f)return false;',
  'const RIFT_V14_ACTOR=(run,f)=>!run||!f?null:'
])assert.ok(bundle.includes(needle),`missing V14.2 save-load guard: ${needle}`);

const exportMarker='export{xs as default};';
assert.equal(bundle.split(exportMarker).length-1,1,'could not identify production export marker');
const hook=`globalThis.__RIFT_V142_TEST__={g,d,p,Me,Le,Hr,RIFT_EMPTY_WEAPON,Ja,RIFT_V13_ACTOR,RIFT_V13_SIMPLE_ACTIVE,RIFT_V14_ACTOR};`;
const packageExisted=existsSync(packagePath);
try{
  if(!packageExisted)await writeFile(packagePath,'{"type":"module"}\n');
  await writeFile(testPath,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(testPath).href}?v142=${Date.now()}`);
  const api=globalThis.__RIFT_V142_TEST__;
  assert.ok(api,'V14.2 instrumentation failed');
  const power=api.g.find(x=>x.name==='Aura Accumulation')||api.g[0];
  const race=api.d.find(x=>x.name==='Human')||api.d[0];
  const trait=api.p.find(x=>x.name!=='Stand User')||api.p[0];
  const fighter=api.Hr('Loaded Save Tester',structuredClone(race),structuredClone(trait),structuredClone(power),null,api.RIFT_EMPTY_WEAPON(),api.Le(api.Me));
  fighter.statuses.v13SimpleDomainId='loaded-save-domain';

  // This is the production crash path: a loaded fighter status rail can render
  // before any new-run/action wrapper has initialized the module-level current run.
  assert.equal(api.RIFT_V13_ACTOR(null,fighter),null);
  assert.equal(api.RIFT_V14_ACTOR(null,fighter),null);
  assert.equal(api.RIFT_V13_SIMPLE_ACTIVE(null,fighter),false);
  assert.doesNotThrow(()=>api.Ja(fighter),'loaded-save status rendering dereferenced a null run');
  console.log('V14.2 verified: loaded-save status rendering is null-run safe before combat/current-run initialization.');
} finally {
  delete globalThis.__RIFT_V142_TEST__;
  await rm(testPath,{force:true});
  if(!packageExisted)await rm(packagePath,{force:true});
}
