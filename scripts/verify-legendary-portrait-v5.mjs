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
const instrumentedPath=resolve(dirname(bundlePath),"page-legendary-v5-test.js");
if(!existsSync(bundlePath)||!existsSync(cssPath))throw new Error(`Build output is missing at ${gameRoot}. Run scripts/build-site.sh first.`);
const bundle=await readFile(bundlePath,"utf8"),css=await readFile(cssPath,"utf8");
const jsMarker="/* Riftbound Legendary Portrait Rework V5 · bespoke canon-faithful high-rarity art */";
const cssMarker="/* Riftbound Legendary Portrait Rework V5 · bespoke canon-faithful hero portraits */";
assert.ok(bundle.includes(jsMarker),"V5 runtime marker missing");
assert.ok(css.includes(cssMarker),"V5 stylesheet marker missing");
assert.ok(bundle.indexOf(jsMarker)>bundle.indexOf("/* Riftbound Portrait Rework V4 · premium object-first item art */"),"V5 does not execute after V4");
assert.ok(css.indexOf(cssMarker)>css.indexOf("/* Riftbound Portrait Rework V4 · Six Stones-quality object portraits */"),"V5 CSS does not execute after V4");
for(const needle of [
  "RIFT_LEGENDARY_CANON_PROFILES","RIFT_LEGENDARY_CANON_PROFILE","data-canon-profile","data-canon-source","sparda-organic-demon-sword","six-stones-gauntlet",
  "RIFT_CATALOG_TILE=function RIFT_CATALOG_TILE({item,fighter,selected,recommended,onSelect,onQuickBuy,onHover,pulse=false})",
  "onMouseDown:event=>{if(event.button===1)event.preventDefault()}",
  "onAuxClick:event=>{if(event.button!==1)return;event.preventDefault();event.stopPropagation();onQuickBuy?.(item.id,event)}",
  "const catalogQuickBuy=id=>executeQuickBuy(id,{selectAfter:false,dedupe:false});","RIFT_BUY_ITEM(next,id)"
])assert.ok(bundle.includes(needle),`production bundle missing ${needle}`);
for(const needle of [".rift-item-icon.art-v5",":before,.rift-item-icon.art-v5:after","canon-sparda-organic-demon-sword","MIDDLE-CLICK ITEM · QUICK BUY"])assert.ok(css.includes(needle),`V5 stylesheet missing ${needle}`);

const exportMarker="export{xs as default};";
assert.equal(bundle.split(exportMarker).length-1,1,"bundle export seam changed");
const hook=`globalThis.__RIFTBOUND_V5_TEST__={d,p,g,Me,Le,Hr,RIFT_ITEM_CATALOG,RIFT_ITEM_ICON,RIFT_CATALOG_TILE,RIFT_LEGENDARY_CANON_PROFILES,RIFT_LEGENDARY_CANON_PROFILE};`;
const packageExisted=existsSync(packagePath);
try{
  if(!packageExisted)await writeFile(packagePath,'{"type":"module"}\n');
  await writeFile(instrumentedPath,bundle.replace(exportMarker,hook+exportMarker));
  await import(`${pathToFileURL(instrumentedPath).href}?test=${Date.now()}`);
  const api=globalThis.__RIFTBOUND_V5_TEST__;assert.ok(api,"V5 test API missing");
  const high=api.RIFT_ITEM_CATALOG.filter(item=>[`Legendary`,`Mythical`].includes(item.rarity));
  const legendary=high.filter(item=>item.rarity===`Legendary`),mythical=high.filter(item=>item.rarity===`Mythical`);
  assert.equal(legendary.length,67,"Legendary count changed");assert.equal(mythical.length,1,"Mythical count changed");assert.equal(mythical[0].id,"sparda-devil-sword");assert.equal(high.length,68);
  const profiles=api.RIFT_LEGENDARY_CANON_PROFILES,profileEntries=Object.entries(profiles);
  assert.equal(profileEntries.length,68,"V5 does not contain one profile for every high-rarity item");
  assert.deepEqual(new Set(Object.keys(profiles)),new Set(high.map(item=>item.id)),"V5 profile IDs do not exactly match the high-rarity catalog");
  const visualKeys=profileEntries.map(([,profile])=>profile.visualKey);assert.equal(new Set(visualKeys).size,68,"V5 visual keys are not unique");
  const signatures=profileEntries.map(([,profile])=>JSON.stringify([profile.kind,profile.palette,profile.layers]));assert.equal(new Set(signatures).size,68,"Two V5 high-rarity portraits share the same authored composition signature");
  for(const item of high){
    const profile=api.RIFT_LEGENDARY_CANON_PROFILE(item);assert.ok(profile,`${item.id} missing canon profile`);assert.equal(profile.source,item.reference,`${item.id} canon source does not match catalog reference`);assert.ok(profile.canon.length>=35,`${item.id} canon cue is too vague`);assert.equal(profile.palette.length,4,`${item.id} palette incomplete`);
    for(const layer of ["main","secondary","detail","mark","glow"]){assert.ok(profile.layers[layer],`${item.id} missing ${layer} layer`);assert.equal(typeof profile.layers[layer].bg,"string",`${item.id} ${layer} background missing`)}
    const icon=api.RIFT_ITEM_ICON({item,size:"small"});assert.equal(icon.type,"span");assert.match(icon.props.className,/\bart-v5\b/);assert.equal(icon.props["data-canon-profile"],profile.visualKey);assert.equal(icon.props["data-canon-source"],item.reference);
  }
  const sparda=profiles["sparda-devil-sword"];assert.equal(sparda.visualKey,"sparda-organic-demon-sword");assert.equal(sparda.kind,"demonic-greatsword");for(const word of ["spine-like","curved blade","red gem"])assert.ok(sparda.canon.toLowerCase().includes(word),`Sparda canon cue missing ${word}`);
  const six=profiles["gauntlet-of-six-stones"];assert.equal(six.visualKey,"six-stones-gauntlet");assert.ok(six.canon.includes("six individually visible colored stones"));
  const swordIds=["excalibur-protocol","yamato-riftcutter","dragonslayer-black-iron","ea-world-rend","gungnir-certain-line","keyblade-between-hearts","blade-of-olympus","mirage-edge","sparda-devil-sword","master-sword-awakened","zangetsu-moonfang","nichirin-sunsteel","buster-sword-limit","masamune-long-reach","lightsaber-kyber-core","darksaber-mandalore","frostmourne-soulsteel","ashbringer-dawn"];
  assert.equal(new Set(swordIds.map(id=>profiles[id].visualKey)).size,swordIds.length,"sword-like high-rarity items are not individually keyed");
  assert.equal(new Set(swordIds.map(id=>JSON.stringify([profiles[id].kind,profiles[id].layers]))).size,swordIds.length,"sword-like high-rarity items share authored geometry");
  for(const [id,key] of Object.entries({"ea-world-rend":"ea-triple-rotor","keyblade-between-hearts":"keyblade-crown-key","ebony-ivory":"ebony-ivory-crossed-pistols","beowulf-devil-arms":"beowulf-light-gauntlets","mirage-edge":"mirage-edge-spectral-force-edge","darksaber-mandalore":"darksaber-black-edged-blade","necronomicon-ex-mortis":"necronomicon-flesh-face-book","time-turner-hourglass":"time-turner-nested-rings"}))assert.equal(profiles[id].visualKey,key,`${id} lost its bespoke canon treatment`);
  const common=api.RIFT_ITEM_CATALOG.find(item=>item.rarity===`Common`);const commonIcon=api.RIFT_ITEM_ICON({item:common,size:"small"});assert.ok(!commonIcon.props.className.includes("art-v5"),"V5 unexpectedly replaced non-high-rarity portrait rendering");
  const race=api.d.find(entry=>entry.name===`Human`)||api.d[0],trait=api.p.find(entry=>entry.name!==`Stand User`)||api.p[0],power=structuredClone(api.g[0]);const fighter=api.Hr(`V5 Tester`,structuredClone(race),structuredClone(trait),power,null,null,api.Le(api.Me));
  let selected=0,quick=0,prevented=0,stopped=0;const tile=api.RIFT_CATALOG_TILE({item:legendary[0],fighter,selected:false,recommended:false,onSelect(){selected++},onQuickBuy(){quick++},onHover(){}});assert.equal(tile.type,"button");assert.equal(typeof tile.props.onAuxClick,"function");assert.equal(typeof tile.props.onMouseDown,"function");
  tile.props.onMouseDown({button:1,preventDefault(){prevented++}});assert.equal(prevented,1,"middle mousedown does not suppress browser default");
  tile.props.onAuxClick({button:1,preventDefault(){prevented++},stopPropagation(){stopped++}});assert.equal(quick,1,"middle click did not invoke quick buy");assert.equal(selected,0,"middle click incorrectly opened/selected the item detail page");assert.equal(prevented,2);assert.equal(stopped,1);
  tile.props.onClick();assert.equal(selected,1,"left click inspection behavior regressed");
  tile.props.onAuxClick({button:2,preventDefault(){throw new Error("right click should be ignored")},stopPropagation(){throw new Error("right click should be ignored")}});assert.equal(quick,1,"non-middle aux click invoked quick buy");
  console.log(`Legendary Portrait V5 verified: ${legendary.length} Legendary portraits plus Sparda have unique bespoke canon profiles; middle-click catalog quick-buy is isolated from detail selection and routed to the shared purchase pipeline.`);
}finally{
  delete globalThis.__RIFTBOUND_V5_TEST__;
  await rm(instrumentedPath,{force:true});
  if(!packageExisted)await rm(packagePath,{force:true});
}
