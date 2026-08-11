import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jsPath = path.join(root, '_site', 'assets', 'page-F6OuavDb.js');
const cssPath = path.join(root, '_site', 'assets', 'riftbound.css');
if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) throw new Error('Portrait V4 verifier: build _site first');
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const requireText = (haystack, needle, label) => { if (!haystack.includes(needle)) throw new Error(`Portrait V4 verifier: missing ${label}: ${needle}`); };
const requireOrder = (haystack, first, second, label) => { const a=haystack.indexOf(first),b=haystack.indexOf(second); if(a<0||b<0||a>=b) throw new Error(`Portrait V4 verifier: invalid order for ${label}`); };

const v3Marker = '/* Riftbound Portrait Rework V3 · literal object-first item art */';
const marker = '/* Riftbound Portrait Rework V4 · Six Stones quality bar for every item */';
const cssMarker = '/* Riftbound Portrait Rework V4 · Six Stones-quality premium literal portraits */';
requireText(js, marker, 'runtime marker');
requireText(css, cssMarker, 'stylesheet marker');
requireOrder(js, v3Marker, marker, 'V4 must execute after V3');
requireText(js, 'RIFT_PORTRAIT_V4_VERSION=4', 'portrait runtime version');
requireText(js, 'RIFT_ITEM_V4_PROFILE_CACHE', 'per-item V4 profile cache');
requireText(js, 'RIFT_ITEM_V4_MATERIAL', 'material classifier');
requireText(js, 'RIFT_ITEM_LITERAL_KIND(item)', 'reuse of literal V3 classifier');
requireText(js, 'RIFT_ITEM_LITERAL_SPECIAL(item)', 'reuse of reference identity map');
requireText(js, 'art-v3 art-v4', 'final V4 renderer class');
requireText(js, 'data-art-quality', 'V4 quality identity');
requireText(js, 'className:`art-material`', 'material construction layer');
requireText(js, 'className:`art-accent`', 'object accent construction layer');
requireText(js, 'className:`art-highlight`', 'object highlight construction layer');

/* The repeated diagonal/slash decoration must be impossible to inherit into V4. */
requireText(css, '.rift-item-icon.art-v4:before,.rift-item-icon.art-v4:after{content:none!important;display:none!important', 'hard streak/slash suppression');
requireText(css, '.rift-item-icon.art-v4>.art-frame', 'V4-owned clean frame');

/* Every literal object kind currently emitted by the catalog classifier needs a V4-specific construction selector. */
const kinds = [
  'sword','longsword','katana','greatsword','saber','axe','hammer','spear','arrow','bow','chainblade','drill',
  'gun','portalgun','gravitygun','bfg','gauntlet','hiddenblade','stone','shield','chestplate','cloak','robe','suit','harness','belt','boots',
  'wand','book','ring','crown','monocle','lens','medallion','reliquary','seal','coin','die','bone','gem','crystal','shard','orb','sphere',
  'pill','vial','moss','thread','cloth','compass','radar','wrist','clock','hourglass','gear','battery','device','chip','abacus'
];
for (const kind of kinds) {
  if (!css.includes(`.rift-item-icon.art-v4.literal-${kind}`)) throw new Error(`Portrait V4 verifier: ${kind} has no V4 quality treatment`);
}

/* Six Stones is the preserved quality benchmark. */
requireText(css, '.rift-item-icon.art-v4.ref-six-stones>.art-main', 'premium Six Stones gold glove');
requireText(css, '.rift-item-icon.art-v4.ref-six-stones>.art-material', 'Six Stones material modeling');
requireText(css, '.rift-item-icon.art-v4.ref-six-stones>.art-gemlight', 'Six Stones distinct gem layer');
requireText(css, '11px -6px 0 #7c5cff,22px -2px 0 #46b9ff,6px 12px 0 #f7e557,18px 12px 0 #43e26d,30px 8px 0 #ff9d39', 'all six stone positions');

/* Major reference silhouettes get real construction details rather than generic effects. */
for (const ref of ['master-sword','zangetsu','frostmourne','portal-device','gravity-gun','bfg','hidden-blade','devil-breaker','master-ball','necronomicon','lantern-ring','chaos-emerald','witcher-medallion','pipboy','dragon-radar','time-turner','black-pearl-compass']) {
  requireText(css, `.rift-item-icon.art-v4.ref-${ref}`, `${ref} V4 reference treatment`);
}

requireText(css, 'shop-detail-header .rift-item-icon.art-v4.hero', 'higher fidelity selected-item presentation');
console.log(`Portrait Rework V4 verified: ${kinds.length} literal object families receive V4 construction/detail treatment; inherited portrait streak/slash pseudo-elements are disabled; Six Stones remains the quality benchmark with six distinct gems; major references retain dedicated object detail.`);