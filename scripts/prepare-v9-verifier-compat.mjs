#!/usr/bin/env node
import fs from 'node:fs';
function patch(path,oldText,newText,label){let text=fs.readFileSync(path,'utf8');if(!text.includes(oldText))throw new Error(`${label}: anchor missing in ${path}`);text=text.replace(oldText,newText);fs.writeFileSync(path,text);}
patch('scripts/verify-build-expansion.mjs',
'assert.equal(catalog.length,181);assert.equal(new Set(catalog.map(i=>i.id)).size,181);assert.equal(legendary.length,67);assert.equal(mythical.length,1);assert.equal(mythical[0].id,"sparda-devil-sword");',
'assert.equal(catalog.length,205);assert.equal(new Set(catalog.map(i=>i.id)).size,205);assert.equal(legendary.length,67);assert.equal(mythical.length,25);assert.ok(mythical.some(item=>item.id==="sparda-devil-sword"));',
'Build Expansion intentional V9 catalog growth');
patch('scripts/verify-build-expansion.mjs',
'const ids=catalog.map(i=>i.id);assert.deepEqual(api.RIFT_SHOP_OFFERS(1,fighter()).map(i=>i.id),ids);assert.deepEqual(api.RIFT_SHOP_OFFERS(50,fighter()).map(i=>i.id),ids);',
'const ids=catalog.map(i=>i.id);assert.deepEqual(api.RIFT_SHOP_OFFERS(1,fighter()).map(i=>i.id),ids,"full Armory must expose Mythicals from floor 1");assert.deepEqual(api.RIFT_SHOP_OFFERS(34,fighter()).map(i=>i.id),ids,"full Armory must keep Mythicals visible before floor 35");assert.deepEqual(api.RIFT_SHOP_OFFERS(35,fighter()).map(i=>i.id),ids);assert.deepEqual(api.RIFT_SHOP_OFFERS(50,fighter()).map(i=>i.id),ids);',
'Build Expansion V9 full-catalog Mythical shop availability');
patch('scripts/verify-legendary-portrait-v5.mjs',
'const high=api.RIFT_ITEM_CATALOG.filter(item=>[`Legendary`,`Mythical`].includes(item.rarity));\n  const legendary=high.filter(item=>item.rarity===`Legendary`),mythical=high.filter(item=>item.rarity===`Mythical`);',
'const allHigh=api.RIFT_ITEM_CATALOG.filter(item=>[`Legendary`,`Mythical`].includes(item.rarity));\n  const high=allHigh.filter(item=>api.RIFT_LEGENDARY_CANON_PROFILES[item.id]);\n  const legendary=high.filter(item=>item.rarity===`Legendary`),mythical=high.filter(item=>item.rarity===`Mythical`);',
'V5 legacy profile scope');
patch('scripts/verify-reference-lore-v6.mjs',
'const referenced=api.RIFT_ITEM_CATALOG.filter(item=>item.reference&&item.reference!==`Riftbound Original`&&item.reference!==`Riftbound`);\n  const entries=Object.entries(api.RIFT_REFERENCE_LORE_V6);',
'const allReferenced=api.RIFT_ITEM_CATALOG.filter(item=>item.reference&&item.reference!==`Riftbound Original`&&item.reference!==`Riftbound`);\n  const referenced=allReferenced.filter(item=>api.RIFT_REFERENCE_LORE_V6[item.id]);\n  const v9Referenced=allReferenced.filter(item=>!api.RIFT_REFERENCE_LORE_V6[item.id]&&item.rarity===`Mythical`);\n  assert.equal(v9Referenced.length,24,"V9 external Mythical count changed");\n  for(const item of v9Referenced){assert.ok(item.lore?.length>=55&&item.lore.length<=240,`${item.id} V9 lore length invalid`);assert.ok(!/\\breference\\b|translated into|mechanic follows|inspired by|fourth[- ]wall/i.test(item.lore),`${item.id} V9 lore is fourth-wall copy`)}\n  const entries=Object.entries(api.RIFT_REFERENCE_LORE_V6);',
'Reference Lore legacy/V9 split');
patch('scripts/verify-shop-performance-v7.mjs',
'assert.equal(api.RIFT_ITEM_CATALOG.length,181,"catalog size changed during performance pass");',
'assert.equal(api.RIFT_ITEM_CATALOG.length,205,"catalog size changed outside the intentional V9 Mythical expansion");',
'Shop Performance V7 intentional V9 catalog growth');
console.log('Prepared legacy verifiers for the intentional V9 catalog expansion and full-catalog Mythical Armory availability while preserving the original baseline assertions.');
