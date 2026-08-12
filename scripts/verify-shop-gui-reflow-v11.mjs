#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath),'V11 build output missing');
const bundle=await readFile(bundlePath,'utf8'),css=await readFile(cssPath,'utf8');
const marker='/* Riftbound Shop GUI Reflow + Mythical Alignment V11 */';
assert.ok(bundle.includes(marker),'V11 runtime marker missing');assert.ok(css.includes(marker),'V11 CSS marker missing');
const shopStart=bundle.lastIndexOf('RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){');
const shopEnd=bundle.indexOf('\n};',shopStart)+3;const shop=bundle.slice(shopStart,shopEnd);
assert.ok(shopStart>0&&shopEnd>shopStart,'final shop override missing');
assert.ok(!shop.includes('(0,E.jsx)(RIFT_SHOP_BUILD_STRIP,{fighter:run.player})'),'duplicate current-build strip is still rendered');
assert.ok(shop.includes('[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false);'),'shop must open with compact loadout dock');
assert.ok(shop.includes('MANAGE BUILD · '),'compact build manager label missing');
assert.ok(css.includes('.armory-loadout-wrap.is-collapsed{display:block!important}'),'collapsed loadout dock must remain visible');
assert.ok(css.includes('grid-template-columns:clamp(145px,11vw,176px) minmax(390px,1fr) clamp(430px,31vw,540px)'),'desktop detail pane reflow missing');
assert.ok(css.includes('.armory-is-open .recipe-graph-scroll{min-height:104px;max-height:270px;overflow:auto!important'),'recipe graph visibility/scroll fix missing');
assert.ok(bundle.includes('data-art-quality":`v11`'),'V11 aligned Mythical renderer missing');
assert.ok(bundle.includes('rift-v11-art-stage'),'shared whole-object alignment stage missing');
assert.ok(css.includes('.rift-item-icon.art-v11>.rift-v11-art-stage'),'V11 alignment stage CSS missing');
const exportMarker='export{xs as default};';assert.equal(bundle.split(exportMarker).length-1,1,'export seam changed');
const instrumented=resolve(dirname(bundlePath),'page-v11-test.js'),pkg=resolve(dirname(bundlePath),'package.json'),hadPkg=existsSync(pkg);
try{
 if(!hadPkg)await writeFile(pkg,'{"type":"module"}\n');
 const hook='globalThis.__RIFT_V11_TEST__={RIFT_ITEM_CATALOG,RIFT_V11_MYTHICAL_ALIGNMENT,RIFT_MYTHICAL_CANON_PROFILES};';
 await writeFile(instrumented,bundle.replace(exportMarker,hook+exportMarker));
 await import(`${pathToFileURL(instrumented).href}?v=${Date.now()}`);
 const api=globalThis.__RIFT_V11_TEST__;assert.ok(api,'V11 test API missing');
 const fresh=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'&&item.id!=='sparda-devil-sword');
 assert.equal(fresh.length,24,'new Mythical count changed');
 assert.equal(Object.keys(api.RIFT_V11_MYTHICAL_ALIGNMENT).length,24,'alignment registry must cover all 24 new Mythicals');
 assert.ok(!api.RIFT_V11_MYTHICAL_ALIGNMENT['sparda-devil-sword'],'Sparda alignment must remain untouched');
 for(const item of fresh){const a=api.RIFT_V11_MYTHICAL_ALIGNMENT[item.id];assert.ok(a,`${item.id} missing alignment`);assert.ok(a.scale>=.8&&a.scale<=1.1,`${item.id} alignment scale unsafe`);assert.equal(typeof a.x,'string');assert.equal(typeof a.y,'string');assert.ok(api.RIFT_MYTHICAL_CANON_PROFILES[item.id],`${item.id} lost V10 canon profile`)}
 assert.ok(api.RIFT_V11_MYTHICAL_ALIGNMENT['anduril-flame-west'].scale<=.86,'Anduril must be reduced enough to fit its portrait frame');
 console.log(`V11 verified: one compact build dock, readable recipe graph, and normalized alignment for ${fresh.length} Mythical portraits.`);
}finally{delete globalThis.__RIFT_V11_TEST__;await rm(instrumented,{force:true});if(!hadPkg)await rm(pkg,{force:true})}
