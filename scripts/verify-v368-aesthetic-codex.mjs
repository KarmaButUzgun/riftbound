#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V36.8 built output missing');
const bundle=await readFile(bundlePath,'utf8'),css=await readFile(cssPath,'utf8');

for(const marker of ['RIFTBOUND_V36_8','RIFT_V368_POWER_COPY','RIFT_V368_POWER_INFO','RIFT_V368_POWER_RARITY','RIFT_V368_POWER_PASSIVE','RIFT_V368_PASSIVE_TITLE','v368-power-summary','v368-obtainment-card','wheel-flavor','wheel-mechanics'])assert.ok(bundle.includes(marker)||css.includes(marker),`V36.8 marker missing: ${marker}`);
for(const marker of ['#rift-v30-release-root{display:none!important}', '.v31-technical-tags{display:none!important}', '.v31-constitution{display:none!important}'])assert.ok(css.includes(marker),`V36.8 cleanup CSS missing: ${marker}`);

for(const leaked of [
 'V20 CONTROL CENTER','V21 PRESERVATION','V23 INTERFACE REBORN','V25 · ARMORY COMPLETE','V26 ASCENSION REFRAMED',
 'BUILD EXPANSION · READ ONLY IN COMBAT','BUILD EXPANSION · FULL CATALOG','WAYFARER ARMORY · MEMORY · FAVORITES · BUILD ORDERS','WAYFARER QOL · PERSISTENT ARMORY',
 'THE LIVING ARCHIVE · ASCENDANT EDITION','V31 FEATURE ARCHIVE','Presentation preview · mechanics unchanged','MECHANICS-BACKED · EXPLICIT MOVE CONTRACT','AUTHORED EFFECTS',
 'No authored description is available for this technique.','authored time response','Riftbound cooldown'
])assert.ok(!bundle.includes(leaked),`player-facing update/developer copy survived: ${leaked}`);
assert.ok(bundle.includes('RIFT_V368_POWER_RARITY(w.lootOffer.power)'),'loot screen still uses explanatory rarityLabel');
assert.ok(bundle.includes('RIFT_V368_POWER_RARITY(e.power)'),'build sheet still uses explanatory rarityLabel');
assert.ok(bundle.includes('RIFT_V368_POWER_PASSIVE(w.lootOffer.power)'),'loot screen still exposes Anti-Spiral update-note passive');
assert.ok(bundle.includes('children:RIFT_V368_POWER_PASSIVE(e.power)'),'build sheet still exposes Anti-Spiral update-note passive');

const exportMarker='export{xs as default};',instrumented=resolve(dirname(bundlePath),'page-v368-test.js'),packagePath=resolve(dirname(bundlePath),'package.json'),hadPackage=existsSync(packagePath);
assert.equal(bundle.split(exportMarker).length-1,1,'V36.8 export seam changed');
try{
 if(!hadPackage)await writeFile(packagePath,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V368_TEST__={g,h,RIFT_ITEM_CATALOG,RIFT_V21_ABILITY_CONSTITUTION,RIFT_V21_ASSERT_CONSTITUTION,RIFT_V368_POWER_COPY,RIFT_V368_POWER_INFO,RIFT_V368_POWER_RARITY,RIFT_V368_POWER_PASSIVE,RIFT_V368_PASSIVE_TITLE,RIFT_V368_CATALOG};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v368=${Date.now()}`);
 const test=globalThis.__RIFT_V368_TEST__,api=globalThis.RIFTBOUND_V36_8,manifest=globalThis.RIFTBOUND_MANIFEST,codex=globalThis.RIFTBOUND_CODEX;
 assert.ok(test&&api&&manifest&&codex,'V36.8 runtime did not initialize');
 assert.equal(api.version,'36.8');assert.equal(api.powerDescriptions,55);assert.equal(manifest.v36.hotfix,'36.8');
 assert.equal(test.g.length,55,'Special Power roster changed');assert.equal(Object.keys(test.RIFT_V368_POWER_COPY).length,55,'every Special Power must have authored V36.8 copy');
 assert.equal(test.RIFT_V368_CATALOG.totals.registeredPowers,55);assert.equal(test.RIFT_V368_CATALOG.totals.visiblePowers,55,'every Special Power must be present in the Codex');assert.equal(test.RIFT_V368_CATALOG.totals.hiddenPowers,0);
 assert.equal(test.RIFT_V368_CATALOG.powers.length,55);assert.equal(codex.catalog().powers.length,55);

 const expected={
  Calamity:new Set(['All For One','Ragegod']),
  Chromatic:new Set(['Limitless','Spiral Being','Anti-Spiral','Projection Sorcery']),
  Unique:new Set(['Stand Manifestation','Mutated Aura Accumulation','Rika Manifestation','One For All','One For All Prime','Bomb Hybrid','Chainsaw Hybrid','True Chainsaw Man','War Devil Hybrid','Symbol of Fear'])
 };
 for(const [rarity,names] of Object.entries(expected)){
  const actual=new Set(test.g.filter(power=>test.RIFT_V368_POWER_RARITY(power)===rarity).map(power=>power.name));
  assert.deepEqual(actual,names,`${rarity} taxonomy drifted`);
 }
 const ordinary=new Set(['Common','Uncommon','Rare','Epic','Legendary','Mythic']);
 for(const power of test.g){
  const info=test.RIFT_V368_POWER_INFO(power),profile=test.RIFT_V368_CATALOG.powers.find(entry=>entry.name===power.name);
  assert.ok(info.flavor?.trim(),`${power.name}: missing flavor description`);
  assert.ok(info.mechanical?.trim(),`${power.name}: missing mechanical description`);
  assert.ok(info.obtainment?.trim(),`${power.name}: missing obtainment description`);
  assert.ok(profile,`${power.name}: missing final Codex profile`);
  assert.equal(profile.rarity,info.rarity,`${power.name}: Codex rarity differs from clean taxonomy`);
  assert.equal(profile.flavor,info.flavor,`${power.name}: Codex flavor differs from wheel copy`);
  assert.equal(profile.mechanical,info.mechanical,`${power.name}: Codex mechanical copy differs from wheel copy`);
  assert.equal(profile.obtainment,info.obtainment,`${power.name}: Codex obtainment differs from canonical copy`);
  assert.ok(profile.passive?.trim(),`${power.name}: existing passive disappeared from Codex`);
  assert.ok(profile.moves.length>=power.moves.length,`${power.name}: Codex lost source techniques`);
  for(const move of power.moves)assert.ok(profile.moves.some(entry=>entry.name===move.name),`${power.name}: Codex lost ${move.name}`);
  assert.ok(!/[·]|Floor \d+ Required|Default Mythic|Default Legendary|Unrollable/i.test(info.rarity),`${power.name}: rarity badge still contains obtainment/explanation copy`);
  assert.ok(ordinary.has(info.rarity)||expected.Calamity.has(power.name)||expected.Chromatic.has(power.name)||expected.Unique.has(power.name),`${power.name}: invalid display rarity ${info.rarity}`);
 }

 // Display taxonomy must not alter the mechanics-facing rarity/rollability registry.
 assert.equal(test.g.find(power=>power.name==='One For All').rarity,'Mythic');
 assert.equal(test.g.find(power=>power.name==='One For All').rollable,false);
 assert.equal(test.g.find(power=>power.name==='Bomb Hybrid').rollable,false);
 assert.equal(test.g.find(power=>power.name==='Limitless').rarity,'Chromatic');
 assert.equal(test.g.find(power=>power.name==='All For One').rarity,'Calamity');
 assert.equal(test.RIFT_V21_ABILITY_CONSTITUTION().hash,'dc25a499','aesthetic copy changed the ability constitution');
 assert.equal(test.RIFT_V21_ASSERT_CONSTITUTION().ok,true,'ability constitution no longer certifies');

 const anti=test.g.find(power=>power.name==='Anti-Spiral');
 assert.ok(anti.passive.includes('new trainable Stat system'),'V36.8 should not mutate the mechanics registry just to clean UI copy');
 assert.ok(!test.RIFT_V368_POWER_PASSIVE(anti).includes('new trainable Stat system'),'Anti-Spiral player-facing passive still describes an update request');

 const item=id=>test.RIFT_ITEM_CATALOG.find(entry=>entry.id===id);
 assert.equal(test.RIFT_V368_PASSIVE_TITLE(item('blade-ruined-king')),`RUINED KING'S EDGE`);
 assert.equal(test.RIFT_V368_PASSIVE_TITLE(item('shadow-crystal')),'HOLD BREATH');
 assert.equal(test.RIFT_V368_PASSIVE_TITLE(item('shadow-mantle')),'TRUE DARKNESS');
 assert.ok(!item('blade-ruined-king').passive.includes('Riftbound cooldown'),'BORK visible passive still contains branded implementation wording');

 for(const standName of ['Gold Experience Requiem','King Crimson Requiem']){
  const profile=test.RIFT_V368_CATALOG.stands.find(entry=>entry.name===standName);assert.ok(profile,`${standName} Codex profile missing`);
  assert.equal(profile.rarity,'Requiem',`${standName}: rarity badge still contains obtainment copy`);
  assert.ok(profile.obtainment?.includes('Requiem Arrow'),`${standName}: obtainment method was lost when rarity was cleaned`);
 }

 console.log('V36.8 verified: all 55 Special Powers have clean rarity, obtainment, flavor and mechanical copy; the wheel/Codex share that copy; version/certification clutter and versioned item passive titles are removed without changing the ability constitution.');
}finally{
 delete globalThis.__RIFT_V368_TEST__;
 await rm(instrumented,{force:true});if(!hadPackage)await rm(packagePath,{force:true});
}
