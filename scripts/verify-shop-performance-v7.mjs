#!/usr/bin/env node
import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {readFile,rm,writeFile} from "node:fs/promises";
import {dirname,resolve} from "node:path";
import {pathToFileURL} from "node:url";

const gameRoot=resolve(process.argv[2]||".build/riftbound-standalone");
const bundlePath=resolve(gameRoot,"assets/page-F6OuavDb.js");
const cssPath=resolve(gameRoot,"assets/riftbound.css");
const packagePath=resolve(dirname(bundlePath),"package.json");
const instrumentedPath=resolve(dirname(bundlePath),"page-shop-performance-v7-test.js");
if(!existsSync(bundlePath)||!existsSync(cssPath))throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);
const bundle=await readFile(bundlePath,"utf8"),css=await readFile(cssPath,"utf8");
const jsMarker="/* Riftbound Shop Performance V7 · render and compositor optimization */";
const cssMarker="/* Riftbound Shop Performance V7 · low-churn catalog compositing */";
assert.ok(bundle.includes(jsMarker),"Shop Performance V7 runtime marker missing");
assert.ok(css.includes(cssMarker),"Shop Performance V7 stylesheet marker missing");
for(const needle of [
  "RIFT_CATALOG_TILE_MEMO=(0,r.memo)(RIFT_CATALOG_TILE",
  "RIFT_ITEM_DETAIL_MEMO=(0,r.memo)(RIFT_ITEM_DETAIL",
  "RIFT_INVENTORY_MANAGER_MEMO=(0,r.memo)(RIFT_INVENTORY_MANAGER",
  "catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,run.player),[run.floor,run.player])",
  "recommendedIds=(0,r.useMemo)(()=>RIFT_RECOMMENDED_ITEMS(run.player,catalog,10),[run.player,catalog])",
  "plan=(0,r.useMemo)(()=>selected?RIFT_RECIPE_PLAN(run.player,selected.id):null,[run.player,selected?.id])",
  "profile=(0,r.useMemo)(()=>RIFT_BUILD_PROFILE(run.player),[run.player])",
  "RIFT_SHOP_PERF_SEARCH_TEXT(item).includes(normalizedQuery)",
  "buildsInto=RIFT_SHOP_PERF_BUILDS_INTO(item.id)",
  "setHover(current=>current?.id===id?current:{id,x,y})",
  "(0,E.jsx)(RIFT_CATALOG_TILE_MEMO,{item,fighter:run.player",
  "(0,E.jsx)(RIFT_ITEM_DETAIL_MEMO,{item:selected,fighter:run.player",
  "(0,E.jsx)(RIFT_INVENTORY_MANAGER_MEMO,{run,onCommit})"
])assert.ok(bundle.includes(needle),`production bundle missing performance wiring: ${needle}`);

const tileStart=bundle.lastIndexOf("RIFT_CATALOG_TILE=function RIFT_CATALOG_TILE(");
const shopStart=bundle.indexOf("RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP(",tileStart);
const perfStart=bundle.indexOf(jsMarker,tileStart);
assert.ok(tileStart>=0&&shopStart>tileStart,"final tile/shop boundaries missing");
assert.ok(perfStart>tileStart&&perfStart<shopStart,"V7 memo runtime is not installed between the final catalog tile and production shop");
const tileBlock=bundle.slice(tileStart,perfStart);
assert.ok(tileBlock.includes("onMouseEnter:event=>onHover?.(item.id,event),onMouseLeave:"),"catalog hover enter/leave behavior missing");
assert.ok(!tileBlock.includes("onMouseMove:event=>onHover?.(item.id,event)"),"catalog tile still writes hover state on every mousemove");
assert.ok(tileBlock.includes("onAuxClick:event=>{if(event.button!==1)return"),"middle-click quick-buy regressed while optimizing tile rendering");
assert.ok(tileBlock.includes("onQuickBuy"),"V7 is not wrapping the V5 quick-buy capable final tile");

for(const needle of [
  ".armory-viewport-v2{backdrop-filter:none!important}",
  ".rift-shop-v2 .catalog-tier-section>header{backdrop-filter:none!important",
  ".rift-shop-v2 .catalog-item-v2{content-visibility:auto!important;contain:layout paint style!important;contain-intrinsic-size:126px!important}",
  ".rift-shop-v2 .catalog-item-v2>.rift-item-icon{contain:layout paint style!important}"
])assert.ok(css.includes(needle),`performance stylesheet missing ${needle}`);

const exportMarker="export{xs as default};";
assert.equal(bundle.split(exportMarker).length-1,1,"bundle export seam changed");
const hook=`globalThis.__RIFTBOUND_SHOP_PERF_V7_TEST__={RIFT_ITEM_CATALOG,RIFT_SHOP_PERF_SEARCH_TEXT,RIFT_SHOP_PERF_BUILDS_INTO,RIFT_CATALOG_TILE_MEMO,RIFT_ITEM_DETAIL_MEMO,RIFT_INVENTORY_MANAGER_MEMO};`;
const packageExisted=existsSync(packagePath);
try{
  if(!packageExisted)await writeFile(packagePath,'{"type":"module"}\n');
  await writeFile(instrumentedPath,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?test=${Date.now()}`);
  const api=globalThis.__RIFTBOUND_SHOP_PERF_V7_TEST__;assert.ok(api,"Shop Performance V7 test API missing");
  assert.equal(api.RIFT_ITEM_CATALOG.length,181,"catalog size changed during performance pass");
  const item=api.RIFT_ITEM_CATALOG.find(entry=>entry.id==="master-sword-awakened")||api.RIFT_ITEM_CATALOG[0];
  const searchA=api.RIFT_SHOP_PERF_SEARCH_TEXT(item),searchB=api.RIFT_SHOP_PERF_SEARCH_TEXT(item);
  assert.equal(searchA,searchB,"cached search text is unstable");assert.ok(searchA.includes(item.name.toLowerCase()),"search cache lost item name");
  const intoA=api.RIFT_SHOP_PERF_BUILDS_INTO(item.id),intoB=api.RIFT_SHOP_PERF_BUILDS_INTO(item.id);assert.equal(intoA,intoB,"builds-into cache does not reuse the same result array");
  const tileMemo=api.RIFT_CATALOG_TILE_MEMO;assert.equal(typeof tileMemo.compare,"function","catalog tile memo comparator missing");
  const fighter={inventory:[]},base={item,fighter,selected:false,recommended:false,pulse:false,onSelect(){},onQuickBuy(){},onHover(){}};
  assert.equal(tileMemo.compare(base,{...base,onSelect(){},onHover(){}}),true,"callback identity still invalidates catalog tile memoization");
  assert.equal(tileMemo.compare(base,{...base,selected:true}),false,"selection changes are incorrectly memoized away");
  assert.equal(tileMemo.compare(base,{...base,fighter:{inventory:[]}}),false,"fighter changes are incorrectly memoized away");
  assert.equal(typeof api.RIFT_ITEM_DETAIL_MEMO.compare,"function","detail memo comparator missing");
  assert.equal(typeof api.RIFT_INVENTORY_MANAGER_MEMO.compare,"function","inventory memo comparator missing");
  console.log(`Shop Performance V7 verified: 181-item catalog keeps V5 art/quick-buy while eliminating per-pixel hover rerenders, memoizing heavy panes/work, and skipping offscreen tile paint.`);
}finally{
  delete globalThis.__RIFTBOUND_SHOP_PERF_V7_TEST__;
  await rm(instrumentedPath,{force:true});
  if(!packageExisted)await rm(packagePath,{force:true});
}
