#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js');
assert.ok(existsSync(bundlePath),`V13.1 build output missing at ${bundlePath}`);
const bundle=await readFile(bundlePath,'utf8');
const marker='/* Riftbound V13.1 shopFighter TDZ hotfix */';
assert.ok(bundle.includes(marker),'V13.1 TDZ hotfix marker missing');

const start=bundle.lastIndexOf('RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){');
const end=bundle.indexOf('\n};',start);
assert.ok(start>=0&&end>start,'final Armory component missing');
const shop=bundle.slice(start,end+3);

const ownerHook=shop.indexOf('[shopOwner,setShopOwner]=(0,r.useState)(`yuta`)');
const fighterInit=shop.indexOf('shopFighter=rikaShop?RIFT_V13_RIKA_SHOP_FIGHTER(run):run.player');
const firstRead=shop.indexOf('RIFT_SHOP_OFFERS(run.floor,shopFighter)');
assert.ok(ownerHook>=0,'shopOwner hook missing');
assert.ok(fighterInit>ownerHook,'shopFighter is not derived after shopOwner');
assert.ok(firstRead>fighterInit,'shopFighter is still read before initialization');
assert.equal(shop.split('[shopOwner,setShopOwner]=(0,r.useState)(`yuta`)').length-1,1,'shopOwner hook duplicated');
assert.equal(shop.split('shopFighter=rikaShop?RIFT_V13_RIKA_SHOP_FIGHTER(run):run.player').length-1,1,'shopFighter initialization duplicated');
assert.ok(!shop.includes('RIFT_NORMALIZE_RUN_BUILD(run);const catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,shopFighter)'), 'known TDZ ordering pattern returned');

for(const needle of [
  'RIFT_SHOP_OFFERS(run.floor,shopFighter)',
  'RIFT_RECOMMENDED_ITEMS(shopFighter,catalog,10)',
  'RIFT_RECIPE_PLAN(shopFighter,selected.id)',
  'RIFT_BUILD_PROFILE(shopFighter)',
  'VIEW RIKA BUILD',
  'VIEW YUTA BUILD'
])assert.ok(shop.includes(needle),`V13 Rika Armory behavior regressed: ${needle}`);

console.log('V13.1 verified: final Armory initializes shopOwner/rikaShop/shopFighter before every shopFighter-dependent memo while preserving the Yuta/Rika build toggle.');
