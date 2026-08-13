import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(new URL('..',import.meta.url).pathname);
const gameRoot=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(gameRoot,'assets/page-F6OuavDb.js');
const cssPath=resolve(gameRoot,'assets/riftbound.css');
const publishedPath=resolve(root,'_site/riftbound-manifest.json');
for(const path of [bundlePath,cssPath,publishedPath,resolve(root,'_site/index.html')])assert.ok(existsSync(path),`V31 artifact missing: ${path}`);

await import(`${pathToFileURL(bundlePath).href}?verify-v31=${Date.now()}`);
const manifest=globalThis.RIFTBOUND_MANIFEST;
const codex=globalThis.RIFTBOUND_CODEX;
const preservation=globalThis.RIFTBOUND_PRESERVATION;

assert.equal(manifest?.schemaVersion,31);
assert.equal(manifest?.release,'V31 · Codex Ascendant');
assert.equal(codex?.version,31);
assert.equal(codex.release,'Codex Ascendant');
assert.deepEqual(codex.reference,{attackStrengthTier:10,attackPowerTier:10,durabilityTier:10,speedTier:10,combatSkillTier:10,battleIqTier:10,label:'Tier 10 attacker · Tier 10 training target'});

const catalog=codex.catalog();
assert.deepEqual(catalog.totals,{registeredPowers:50,visiblePowers:49,hiddenPowers:1,stands:7,profiles:56,moves:248,evolvedMoves:3});
assert.equal(catalog.profiles.length,56);
assert.equal(catalog.powers.length,49);
assert.equal(catalog.stands.length,7);
assert.equal(catalog.moves.length,248);
assert.equal(new Set(catalog.profiles.map(profile=>profile.id)).size,catalog.profiles.length,'profile IDs are not unique');
assert.equal(new Set(catalog.moves.map(move=>move.id)).size,catalog.moves.length,'move IDs are not unique');
assert.equal(catalog.constitutionHash,'7598b438');
assert.equal(catalog.abilityChanges,0);
assert.ok(!catalog.profiles.some(profile=>profile.name==='Mutated Aura Accumulation'),'hidden authored boss power leaked into the public Codex');
assert.ok(catalog.profiles.some(profile=>profile.name==='Stand Manifestation'),'authored Stand Manifestation system profile disappeared');

const allowedDamage=new Set(codex.damageTypes);
for(const profile of catalog.profiles){
  assert.ok(['power','stand'].includes(profile.kind));
  assert.ok(profile.name&&profile.glyph&&profile.accent&&profile.rarity);
  assert.ok(profile.passive&&profile.lore);
  assert.ok(profile.moves.length>=4,`${profile.name} has an incomplete archive`);
  assert.ok(profile.roles.length>=1,`${profile.name} has no tactical role`);
  assert.ok(profile.groups.length>=1,`${profile.name} has no move grouping`);
  assert.equal(profile.moves.flatMap(move=>[move]).length,profile.groups.flatMap(group=>group.moves).length);
  for(const move of profile.moves){
    assert.ok(move.id&&move.name&&move.description&&move.slot&&move.group);
    assert.equal(typeof move.cost,'number');
    assert.equal(typeof move.power,'number');
    assert.equal(typeof move.destruction,'number');
    assert.ok(move.hits>=1);
    assert.equal(move.sequenceCoefficient,Number((move.power*move.hits).toFixed(3)));
    assert.ok(allowedDamage.has(move.damageClass),`${move.name} has unknown damage class ${move.damageClass}`);
    assert.ok(['AS','AP','Hybrid','Special'].includes(move.scaling.mode));
    assert.ok(move.scalingLabel);
    assert.ok(move.geometry.shape&&move.geometry.rangeLabel&&move.geometry.targetLabel);
    assert.ok(codex.spatialTypes[move.spatial.type],`${move.name} has unknown spatial type ${move.spatial.type}`);
    assert.equal(move.spatial.presentationOnly,true);
    assert.equal(move.spatial.mechanicsChanged,false);
    assert.equal(move.mechanicsChanged,false);
    assert.equal(typeof move.reference.damage,'number');
    assert.equal(typeof move.reference.raw,'number');
    assert.equal(move.reference.label,'Tier 10 attacker · Tier 10 training target');
    assert.ok(move.requirements.length>=1);
    assert.equal(move.technicalTags.length,move.tags.length);
    assert.ok(move.summary.includes(move.reference.damage>0?'archive standard':'authored effects'));
  }
}

const star=catalog.stands.find(profile=>profile.name==='Star Platinum');
assert.ok(star);
assert.equal(star.moves.length,10);
assert.deepEqual(star.groups.map(group=>group.label),['Partial Manifestation','Summoned Commands','Stand Ultimate','Star Platinum: The World']);
assert.deepEqual(star.moves.filter(move=>move.slot.startsWith('E-')).map(move=>move.name),['Quick Stop','ORA ORA ORA!','Za Warudo!']);
assert.equal(star.moves.find(move=>move.name==='Left Hook').damageClass,'Physical');
assert.equal(star.moves.find(move=>move.name==='Launch').spatial.type,'projectile');
assert.equal(star.moves.find(move=>move.name==='Star Finger').spatial.type,'thrust');
assert.equal(star.moves.find(move=>move.name==='Heavy Guard').damageClass,'Utility');
assert.equal(star.moves.find(move=>move.name==='7-Page Ora').hits,28);
assert.equal(star.moves.find(move=>move.name==='Za Warudo!').damageClass,'Utility');

const superStrength=codex.profile('Super Strength');
const crush=superStrength.moves.find(move=>move.name==='Crush');
const greatPower=superStrength.moves.find(move=>move.name==='Great Power');
assert.deepEqual({cost:crush.cost,power:crush.power,destruction:crush.destruction,damageClass:crush.damageClass},{cost:18,power:1.25,destruction:2.35,damageClass:'Physical'});
assert.equal(greatPower.slot,'ULT');
assert.ok(greatPower.reference.damage>crush.reference.damage);
const fireball=codex.move('Fireball');
assert.equal(fireball.damageClass,'Supernatural');
assert.equal(fireball.scaling.mode,'AP');
assert.ok(fireball.reference.damage>0);

const purpleMatches=codex.filter({query:'Purple'});
assert.ok(purpleMatches.some(profile=>profile.name==='Limitless'),'move-name search did not resolve its source profile');
assert.ok(codex.filter({kind:'stand'}).every(profile=>profile.kind==='stand'));
assert.ok(codex.filter({damage:'Physical'}).some(profile=>profile.name==='Super Strength'));
assert.ok(codex.filter({role:'Control'}).every(profile=>profile.roles.includes('Control')));
const comparison=codex.compare(crush,greatPower);
assert.equal(comparison.left.name,'Crush');
assert.equal(comparison.right.name,'Great Power');
assert.equal(comparison.mechanicsChanged,false);
assert.equal(comparison.metrics.length,6);
assert.ok(comparison.metrics.find(metric=>metric.id==='power').delta>0);
assert.ok(comparison.metrics.find(metric=>metric.id==='cost').direction==='worse');

const constitution=preservation.assert();
assert.deepEqual(constitution,{ok:true,expected:'7598b438',actual:'7598b438',counts:{abilities:57,moves:221}});
assert.equal(globalThis.RIFTBOUND_SPATIAL.coverage().total,221);
assert.equal(globalThis.RIFTBOUND_SPATIAL.coverage().typed,221);
assert.equal(globalThis.RIFTBOUND_REMASTERED.certify().ok,true);
assert.equal(manifest.codex.abilityChanges,0);
assert.equal(manifest.codex.constitutionHash,'7598b438');
assert.equal(manifest.codex.displayedMoves,248);
assert.equal(manifest.codex.referenceDamage,true);
assert.equal(manifest.codex.comparison,true);

const [bundle,css,publishedText]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8'),readFile(publishedPath,'utf8')]);
for(const marker of ['Riftbound Codex Ascendant V31','RIFT_V31_CODEX','RIFT_V31_MOVE_INSPECTOR','RIFTBOUND_CODEX'])assert.ok(bundle.includes(marker),`bundle missing ${marker}`);
assert.ok(!bundle.includes('className:`codex-grid ${it===`systems`?`systems-guide-grid`:``}`'),'legacy Codex grid still owns the modal');
for(const marker of ['--rift-v31-marker','.v31-archive-layout','.v31-tactical-stage','.v31-compare-drawer','.v31-sr-only'])assert.ok(css.includes(marker),`styles missing ${marker}`);
assert.match(css,/prefers-reduced-motion:reduce/);
assert.match(css,/max-width:760px/);
assert.match(css,/rift-high-contrast/);
const published=JSON.parse(publishedText);
assert.equal(published.schemaVersion,31);
assert.deepEqual(published.codex,manifest.codex);
assert.equal(published.remastered.certified,true);

console.log('Riftbound V31 Codex Ascendant verification passed: 56 profiles, 248 displayed techniques, interactive intelligence, and zero ability changes.');
