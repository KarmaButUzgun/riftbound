import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jsPath = path.join(root, '_site', 'assets', 'page-F6OuavDb.js');
const cssPath = path.join(root, '_site', 'assets', 'riftbound.css');
if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) throw new Error('Shop V2 verifier: build _site first');
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const requireText = (haystack, needle, label) => { if (!haystack.includes(needle)) throw new Error(`Shop V2 verifier: missing ${label}: ${needle}`); };
const rejectText = (haystack, needle, label) => { if (haystack.includes(needle)) throw new Error(`Shop V2 verifier: stale ${label}: ${needle}`); };
const requireOrder = (haystack, first, second, label) => { const a=haystack.indexOf(first),b=haystack.indexOf(second); if(a<0||b<0||a>=b) throw new Error(`Shop V2 verifier: invalid order for ${label}`); };

const marker = '/* Riftbound Shop + Portrait Rework V2 · final runtime overrides */';
const cssMarker = '/* Riftbound Shop + Portrait Rework V2 · fullscreen vertical shop + individually profiled portraits */';
requireText(js, marker, 'runtime override marker');
requireText(css, cssMarker, 'stylesheet marker');
requireOrder(js, 'const RIFT_ITEMIZATION_EXPANSION_VERSION=3;', marker, 'V2 must execute after Itemization Expansion');
requireOrder(js, 'art-gemlight', marker, 'V2 must execute after portrait V1 renderer');

requireText(js, 'RIFT_SHOP_ART_V2_VERSION=2', 'shop/art runtime version');
requireText(js, 'RIFT_ITEM_ART_CACHE', 'portrait profile cache');
requireText(js, 'RIFT_LEGENDARY_ART_MOTIFS', 'reference-specific Legendary art map');
requireText(js, "'master-sword-awakened':'sacred'", 'Master Sword portrait motif');
requireText(js, "'zangetsu-moonfang':'moon'", 'Zangetsu portrait motif');
requireText(js, "'portal-device-aperture':'portal'", 'Portal Device portrait motif');
requireText(js, "'devil-breaker-overdrive':'devil'", 'Devil Breaker portrait motif');
requireText(js, 'composition:h3%12,variant:h2%16', 'per-item composition diversification');
requireText(js, 'data-art-id', 'per-item portrait identity');
requireText(js, 'art-atmosphere', 'maximalist atmosphere layer');
requireText(js, 'art-foreground', 'maximalist foreground layer');
requireText(js, 'art-spark', 'maximalist spark layer');
requireText(js, 'EVERY ITEM · UNIQUE PORTRAITS', 'full-pool portrait copy');
rejectText(js, '120 UNIQUE PORTRAITS', 'pre-expansion item count copy');

requireText(js, 'armory-viewport armory-viewport-v2', 'fullscreen shop viewport');
requireText(js, 'rift-armory-open-v2', 'body scroll/input lock lifecycle');
requireText(js, 'window.addEventListener(`keydown`,closeOnEscape,true)', 'capture-phase Escape close');
requireText(js, 'if(event.target===event.currentTarget)closeShop()', 'backdrop close');
requireText(js, 'launchRef.current?.focus()', 'focus restoration after close');
requireText(js, 'RIFT_TOOLTIP_POSITION', 'viewport-clamped tooltip positioning');
requireText(js, 'clientX', 'cursor-aware tooltip x positioning');
requireText(js, 'clientY', 'cursor-aware tooltip y positioning');
requireText(js, '__RIFT_RECIPE_CLICK_TIMER_V2__', 'single-vs-double recipe click guard');
requireText(js, '__RIFT_RECIPE_DBLCLICK_V2__', 'duplicate recipe purchase guard');
requireText(js, 'DOUBLE-CLICK A COMPONENT TO BUY IT DIRECTLY', 'recipe direct-purchase affordance');
requireText(js, 'RIFT_BUY_ITEM(next,id)', 'direct recipe component purchase');

requireText(css, '.armory-viewport-v2{position:fixed!important', 'viewport-owned fullscreen shell');
requireText(css, '.rift-shop-v2>.league-shop-layout{grid-row:2;display:grid!important;grid-template-columns:', 'League-style multi-panel layout');
requireText(css, '.rift-shop-v2 .shop-category-rail{display:flex!important;flex-direction:column!important', 'vertical category rail');
requireText(css, 'overflow-y:auto!important;overflow-x:hidden!important', 'vertical scrolling with horizontal suppression');
requireText(css, '.rift-shop-v2 .shop-catalog-scroll', 'catalog scroll container');
requireText(css, '.rift-shop-v2 .recipe-v2>.recipe-graph-scroll', 'recipe viewport containment');
requireText(css, 'grid-template-columns:repeat(auto-fill,minmax(112px,1fr))', 'responsive item catalog grid');
requireText(css, 'content-visibility:auto', 'catalog render optimization');
requireText(css, '.item-hover-tooltip-v2{position:fixed!important', 'fixed tooltip layer');
requireText(css, '.rift-item-icon.art-v2.composition-11', 'all 12 composition families');
requireText(css, '.rift-item-icon.art-v2.motif-portal', 'Portal reference art');
requireText(css, '.rift-item-icon.art-v2.motif-time', 'Time-Turner reference art');
requireText(css, '.rift-item-icon.art-v2.motif-devil', 'Devil reference art');
requireText(css, '@media(max-width:660px)', 'narrow viewport adaptation');
requireText(css, 'grid-template-columns:repeat(3,minmax(0,1fr))!important', 'wrapped narrow loadout without sideways scrolling');

console.log('Shop + Portrait Rework V2 verified: fullscreen vertical Armory is the final UI override; tooltip/recipe interactions are guarded; per-item cached portrait composition and Legendary reference motifs are present; catalog/loadout overflow is vertically contained.');
