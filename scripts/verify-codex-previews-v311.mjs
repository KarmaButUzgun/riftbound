import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(new URL('..',import.meta.url).pathname);
const gameRoot=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(gameRoot,'assets/page-F6OuavDb.js');
const cssPath=resolve(gameRoot,'assets/riftbound.css');
for(const path of [bundlePath,cssPath,resolve(root,'_site/riftbound-manifest.json')])assert.ok(existsSync(path),`V31.1 artifact missing: ${path}`);

await import(`${pathToFileURL(bundlePath).href}?verify-v311=${Date.now()}`);
const codex=globalThis.RIFTBOUND_CODEX;
const catalog=codex.catalog();
const renderCatalog=codex.build();
const manifest=globalThis.RIFTBOUND_MANIFEST;

assert.equal(codex.previewVersion,2);
assert.equal(codex.previewPatch,'31.1');
assert.deepEqual(catalog.preview.version,2);
assert.deepEqual(catalog.preview.patch,'31.1');
assert.equal(catalog.preview.explicit,248);
assert.equal(catalog.preview.fallbacks,0);
assert.equal(catalog.preview.profiles,56);
assert.ok(catalog.preview.patterns.length>=120,'preview grammar collapsed into generic shapes');
assert.notEqual(renderCatalog,catalog,'render catalog must exercise the live Codex build path');
assert.equal(renderCatalog.preview.explicit,248);
assert.equal(renderCatalog.preview.fallbacks,0);
assert.equal(renderCatalog.moves.filter(move=>move.preview?.explicit).length,248,'live Codex build lost explicit previews');
assert.equal(manifest.codex.previewPatch,'V31.1');
assert.equal(manifest.codex.previewVersion,2);
assert.equal(manifest.codex.previewCoverage,248);
assert.equal(manifest.codex.previewFallbacks,0);
assert.equal(manifest.codex.mechanicsBackedPreviews,true);

const validTargets=new Set(['none','enemy','ally','many','point']);
const keys=new Set();
for(const profile of catalog.profiles){
  for(const move of profile.moves){
    const preview=move.preview;
    assert.ok(preview,`${profile.name} / ${move.name} has no preview`);
    assert.equal(preview.version,2);
    assert.equal(preview.patch,'31.1');
    assert.equal(preview.explicit,true);
    assert.equal(preview.fallback,false);
    assert.equal(preview.mechanicsChanged,false);
    assert.equal(preview.mechanicsSource,'resolver geometry + explicit authored move contract');
    assert.equal(preview.key,`${profile.name}|${move.slot}|${move.name}`);
    assert.ok(!keys.has(preview.key),`duplicate preview key ${preview.key}`);
    keys.add(preview.key);
    assert.ok(preview.pattern&&preview.tokens.length>=1);
    assert.ok(preview.label&&preview.glyph);
    assert.ok(validTargets.has(preview.targetKind),`${preview.key} has invalid target kind ${preview.targetKind}`);
    assert.equal(preview.phases.length,3);
    assert.deepEqual(preview.phases.map(phase=>phase.id),['acquire','resolve','after']);
    assert.ok(preview.phases.every(phase=>phase.value));
    assert.equal(preview.geometry.shape,move.geometry.shape);
    assert.equal(preview.geometry.range,Number(move.geometry.range||0));
    assert.equal(preview.geometry.radius,Number(move.geometry.radius||0));
    assert.equal(preview.geometry.requiresAim,Boolean(move.geometry.requiresAim));
    assert.equal(preview.geometry.ignoresCover,Boolean(move.geometry.ignoresCover));
    assert.ok(preview.geometry.rangeText&&preview.geometry.radiusText);
    assert.ok(codex.spatialTypes[preview.primaryType],`${preview.key} has invalid primary type ${preview.primaryType}`);
    assert.equal(move.spatial.type,preview.primaryType);
    assert.equal(move.spatial.label,preview.label);
    assert.equal(move.spatial.previewVersion,2);
    assert.equal(move.spatial.presentationOnly,true);
    assert.equal(move.spatial.mechanicsChanged,false);
    assert.equal(codex.preview(move),preview);
  }
}
assert.equal(keys.size,248);

const preview=(profile,name)=>{
  const move=codex.profile(profile)?.moves.find(entry=>entry.name===name);
  assert.ok(move,`missing signature move ${profile} / ${name}`);
  return move.preview;
};

assert.deepEqual(
  ['pattern','visualRange','visualRadius'].map(key=>preview('Pyrokinesis','Fireball')[key]),
  ['projectile-field',38,3.1],
);
assert.match(preview('Pyrokinesis','Fireball').aftermath,/3 turns/);
assert.equal(preview('Pyrokinesis','Flame Pillar').pattern,'area-delayed-field');
assert.match(preview('Pyrokinesis','Flame Pillar').aftermath,/detonates after 1 owner turn/);
assert.equal(preview('Pyrokinesis','Combustion').targetKind,'many');
assert.equal(preview('Pyrokinesis','Flame Tornado').pattern,'global-moving-field');
assert.equal(preview('Cryokinesis','Ice Shard').pattern,'projectile-wall');
assert.equal(preview('Cryokinesis','Ice Barrier').pattern,'wall-point');
assert.equal(preview('Cryokinesis','Blizzard').visualRadius,12);
assert.equal(preview('Electrokinesis','Thunder God').pattern,'falling-strike');
assert.equal(preview('Hydrokinesis','Pressure Jet').pattern,'beam');
assert.equal(preview('Telekinesis','Force Throw').pattern,'target-movement');
assert.equal(preview('Aura Accumulation','Bone Breaker').pattern,'dash-strike-wave');
assert.equal(preview('Aura Accumulation','Super Duper Bone Breaker').pattern,'melee-cone');
assert.equal(preview('Speedster','Time Portal').targetKind,'none');
assert.equal(preview('Speedster','Time Portal').geometry.rangeText,'TIMELINE');
assert.deepEqual(
  ['pattern','targetKind','visualRange','visualRadius'].map(key=>preview('Gold Experience Requiem','Causality Punch')[key]),
  ['global-melee-strike','enemy',6.2,2.5],
);
assert.equal(preview('Soft & Wet','Go Beyond').pattern,'global-projectile');
assert.equal(preview('Soft & Wet','Go Beyond').targetKind,'point');
assert.equal(preview('War Devil Hybrid','City Sword').pattern,'line-sweep');
assert.equal(preview('War Devil Hybrid','City Sword').visualRadius,10.5);
assert.equal(preview('Bomb Hybrid','Oppenheimer').anchor,'self');
assert.equal(preview('Bomb Hybrid','Oppenheimer').visualRadius,24);
assert.equal(preview('Star Platinum','Quick Jab').visualRange,5.8);
assert.equal(preview('Star Platinum','Quick Jab').targetKind,'enemy');
assert.equal(preview('Star Platinum','Za Warudo!').pattern,'time-freeze');
assert.equal(preview('Star Platinum','Za Warudo!').geometry.rangeText,'BATTLEFIELD');
assert.equal(preview('Star Platinum','Za Warudo!').targetKind,'many');
assert.equal(preview('King Crimson Requiem','Time Dodge').anchor,'self');

assert.deepEqual(globalThis.RIFTBOUND_PRESERVATION.assert(),{ok:true,expected:'7598b438',actual:'7598b438',counts:{abilities:57,moves:221}});
assert.equal(manifest.codex.abilityChanges,0);

const [bundle,css,publishedText]=await Promise.all([
  readFile(bundlePath,'utf8'),
  readFile(cssPath,'utf8'),
  readFile(resolve(root,'_site/riftbound-manifest.json'),'utf8'),
]);
for(const marker of ['Riftbound Codex Preview Accuracy V31.1','RIFT_V311_PROFILE_SPECS','RIFT_V311_BUILD_PREVIEW','RIFT_V31_MOVE_VISUAL=RIFT_V311_MOVE_VISUAL'])assert.ok(bundle.includes(marker),`bundle missing ${marker}`);
for(const marker of ['--rift-v311-preview-marker','.v311-stage','.v311-board','.v311-sequence','.v311-ruler'])assert.ok(css.includes(marker),`styles missing ${marker}`);
assert.match(css,/prefers-reduced-motion:reduce/);
assert.match(css,/rift-high-contrast/);
const published=JSON.parse(publishedText);
assert.equal(published.codex.previewCoverage,248);
assert.equal(published.codex.previewFallbacks,0);
assert.equal(published.codex.mechanicsBackedPreviews,true);

console.log('Riftbound V31.1 Codex preview verification passed: 248 explicit mechanics-backed previews, zero fallbacks, zero ability changes.');
