import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jsPath = path.join(root, '_site', 'assets', 'page-F6OuavDb.js');
const cssPath = path.join(root, '_site', 'assets', 'riftbound.css');

if (!fs.existsSync(jsPath) || !fs.existsSync(cssPath)) {
  throw new Error('Itemization verifier: build output is missing. Run scripts/build-site.sh first.');
}

const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const requireText = (haystack, needle, label) => {
  if (!haystack.includes(needle)) throw new Error(`Itemization verifier: missing ${label}: ${needle}`);
};

requireText(js, 'const RIFT_ITEMIZATION_EXPANSION_VERSION=3;', 'itemization runtime version');
requireText(js, 'Itemization Expansion requires exactly 32 new Legendaries', '32-Legendary runtime assertion');
requireText(js, 'master-sword-awakened', 'first new Legendary');
requireText(js, 'devil-breaker-overdrive', 'last new Legendary');
requireText(js, 'RIFT_STAT_BREAKDOWN', 'base/cap/item/effective stat breakdown');
requireText(js, 'LEVEL-UP CAP ', 'Stat Menu level-up cap language');
requireText(js, 'DOUBLE-CLICK BUY', 'recipe quick-buy affordance');
requireText(js, '__RIFT_RECIPE_DBLCLICK__', 'double-click purchase guard');
requireText(js, 'itemHoverTooltip', 'placeholder');
requireText(js, 'item.id===`rebellion-devil-greatsword`', 'Rebellion rework exception');
requireText(js, '[`Legendary`,`Mythical`].includes(target.rarity)', 'unique high-rarity recipe ownership guard');
requireText(css, '.item-hover-tooltip', 'hover tooltip styling');
requireText(css, '.rift-item-icon.art-icon', 'designed icon styling');
requireText(css, '.legendary-complete', 'Legendary completion feedback');

const newLegendaryTag = 'tags:[`unique`,`buildDefining`,`itemizationExpansion`]';
const newLegendaryCount = js.split(newLegendaryTag).length - 1;
if (newLegendaryCount !== 32) {
  throw new Error(`Itemization verifier: expected 32 new Legendary catalog entries, found ${newLegendaryCount}`);
}

if (js.includes('(0,E.jsx)(`b`,{children:item.glyph})')) {
  throw new Error('Itemization verifier: legacy text/glyph portrait renderer is still active.');
}

const minimumCatalogNames = [
  'Brute Knuckle', 'Duelist Sensor', 'ODM Harness',
  'Green Lantern Ring', 'Aperture Portal Device', 'Time-Turner Hourglass',
];
for (const name of minimumCatalogNames) requireText(js, name, `catalog item ${name}`);

console.log(`Itemization Expansion verified: 32 new Legendaries, designed icons, live recipe quick-buy, hover tooltips, and uncapped item stat display are present.`);
