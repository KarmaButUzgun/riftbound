import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jsPath = path.join(root, '_site', 'assets', 'page-F6OuavDb.js');
const cssPath = path.join(root, '_site', 'assets', 'riftbound.css');
if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) throw new Error('Portrait V3 verifier: build _site first');
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const requireText = (haystack, needle, label) => { if (!haystack.includes(needle)) throw new Error(`Portrait V3 verifier: missing ${label}: ${needle}`); };
const requireOrder = (haystack, first, second, label) => { const a=haystack.indexOf(first),b=haystack.indexOf(second); if(a<0||b<0||a>=b) throw new Error(`Portrait V3 verifier: invalid order for ${label}`); };

const marker = '/* Riftbound Portrait Rework V3 · literal object-first item art */';
const cssMarker = '/* Riftbound Portrait Rework V3 · literal silhouette-first equipment portraits */';
const v2Marker = '/* Riftbound Shop + Portrait Rework V2 · final runtime overrides */';
requireText(js, marker, 'runtime marker');
requireText(css, cssMarker, 'stylesheet marker');
requireOrder(js, v2Marker, marker, 'V3 final portrait override must execute after V2');
requireText(js, 'RIFT_PORTRAIT_V3_VERSION=3', 'portrait runtime version');
requireText(js, 'RIFT_ITEM_LITERAL_KIND', 'literal object-kind classifier');
requireText(js, 'RIFT_LITERAL_REFERENCE_KINDS', 'reference object-kind map');
requireText(js, 'data-literal-kind', 'literal kind identity on every rendered portrait');
requireText(js, "'gauntlet-of-six-stones':'gauntlet'", 'Six Stones gauntlet object mapping');
requireText(js, "'portal-device-aperture':'portalgun'", 'Portal Device object mapping');
requireText(js, "'time-turner-hourglass':'hourglass'", 'Time-Turner object mapping');
requireText(js, "'pipboy-vats-3000':'wrist'", 'Pip-Boy object mapping');
requireText(js, "'devil-breaker-overdrive':'gauntlet'", 'Devil Breaker object mapping');
requireText(js, '[`gauntlet`,`gauntlet`]', 'generic gauntlet classifier rule');
requireText(js, '[`sword`,`sword`]', 'generic sword classifier rule');
requireText(js, '[`compass`,`compass`]', 'generic compass classifier rule');
requireText(js, 'Weapon:`sword`,Defense:`shield`,Armor:`chestplate`,Relic:`medallion`,Magic:`wand`,Physical:`gauntlet`,Utility:`device`', 'literal category fallback for full catalog');

/* The final renderer intentionally omits V2's most abstract layers. */
const v3Start = js.indexOf(marker);
const v3Slice = js.slice(v3Start, js.indexOf('function Ea(', v3Start));
for (const forbidden of ['art-atmosphere','art-aura','art-foreground','art-flare','art-spark']) {
  if (v3Slice.includes(`className:\`${forbidden}\``)) throw new Error(`Portrait V3 verifier: final icon renderer still emits ${forbidden}`);
}
requireText(v3Slice, 'className:`art-main`', 'literal main object layer');
requireText(v3Slice, 'className:`art-detail`', 'literal object detail layer');

/* Every possible classifier output must have a concrete CSS silhouette family. */
const classifierSlice = v3Slice.slice(v3Slice.indexOf('const RIFT_LITERAL_REFERENCE_KINDS='), v3Slice.indexOf('function RIFT_ITEM_LITERAL_SPECIAL'));
const kinds = new Set();
for (const match of classifierSlice.matchAll(/'[^']+':'([a-z]+)'/g)) kinds.add(match[1]);
for (const match of classifierSlice.matchAll(/\[`[^`]+`,`([a-z]+)`\]/g)) kinds.add(match[1]);
for (const match of classifierSlice.matchAll(/(?:Weapon|Defense|Armor|Relic|Magic|Physical|Utility):`([a-z]+)`/g)) kinds.add(match[1]);
if (kinds.size < 40) throw new Error(`Portrait V3 verifier: suspiciously small literal kind set (${kinds.size})`);
for (const kind of kinds) {
  if (!css.includes(`.rift-item-icon.art-v3.literal-${kind}`)) throw new Error(`Portrait V3 verifier: classifier can emit ${kind} but CSS has no literal silhouette`);
}

requireText(css, '.rift-item-icon.art-v3.literal-gauntlet>.art-main', 'literal gauntlet silhouette');
requireText(css, '.rift-item-icon.art-v3.ref-six-stones>.art-main', 'gold Six Stones gauntlet body');
requireText(css, '.rift-item-icon.art-v3.ref-six-stones>.art-gemlight', 'six visible gauntlet stones');
requireText(css, 'box-shadow:11px -6px 0 #7c5cff,22px -2px 0 #46b9ff,6px 12px 0 #f7e557,18px 12px 0 #43e26d,30px 8px 0 #ff9d39', 'five companion stones plus base stone');
requireText(css, '.rift-item-icon.art-v3.literal-sword>.art-main', 'literal sword silhouette');
requireText(css, '.rift-item-icon.art-v3.literal-portalgun>.art-main', 'literal portal gun silhouette');
requireText(css, '.rift-item-icon.art-v3.literal-hourglass>.art-main', 'literal hourglass silhouette');
requireText(css, '.rift-item-icon.art-v3.literal-compass>.art-main', 'literal compass silhouette');
requireText(css, '.rift-item-icon.art-v3.literal-wrist>.art-main', 'literal wrist-device silhouette');
requireText(css, '.rift-item-icon.art-v3.literal-book>.art-main', 'literal book silhouette');
requireText(css, '.rift-item-icon.art-v3.literal-ring>.art-main', 'literal ring silhouette');
requireText(css, '.rift-item-icon.art-v3.literal-boots>.art-main', 'literal boots silhouette');
requireText(css, '.rift-item-icon.art-v3 .art-atmosphere,.rift-item-icon.art-v3 .art-aura,.rift-item-icon.art-v3 .art-foreground,.rift-item-icon.art-v3 .art-flare,.rift-item-icon.art-v3 .art-spark{display:none!important}', 'abstract V2 layer suppression');
requireText(css, '--object-tilt', 'small bounded literal-object tilt');

console.log('Portrait Rework V3 verified: final renderer is object-first, every classifier output has a concrete CSS silhouette, iconic references have explicit object mappings, and Gauntlet of Six Stones is a gold armored glove with six visible stones.');
