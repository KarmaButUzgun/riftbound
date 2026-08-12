#!/usr/bin/env node
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
function patch(path,oldText,newText,label){
  let text=fs.readFileSync(path,'utf8');
  const count=text.split(oldText).length-1;
  if(count!==1)throw new Error(`${label}: expected one anchor in ${path}, found ${count}`);
  text=text.replace(oldText,newText);fs.writeFileSync(path,text);
}

patch('scripts/verify-build-expansion.mjs',
'assert.equal(catalog.length,205);assert.equal(new Set(catalog.map(i=>i.id)).size,205);assert.equal(legendary.length,67);assert.equal(mythical.length,25);assert.ok(mythical.some(item=>item.id==="sparda-devil-sword"));',
'assert.equal(catalog.length,207);assert.equal(new Set(catalog.map(i=>i.id)).size,207);assert.equal(legendary.length,68);assert.equal(mythical.length,26);assert.ok(mythical.some(item=>item.id==="sparda-devil-sword"));assert.ok(mythical.some(item=>item.id==="the-namegiver"));assert.ok(legendary.some(item=>item.id==="simple-domain-manual"));',
'Build Expansion intentional V13 catalog growth');

patch('scripts/verify-reference-lore-v6.mjs',
'const v9Referenced=allReferenced.filter(item=>!api.RIFT_REFERENCE_LORE_V6[item.id]&&item.rarity===`Mythical`);',
'const v9Referenced=allReferenced.filter(item=>!api.RIFT_REFERENCE_LORE_V6[item.id]&&item.rarity===`Mythical`&&item.id!==`the-namegiver`);',
'Reference Lore legacy V9 Mythical scope after Namegiver');

patch('scripts/verify-shop-performance-v7.mjs',
'assert.equal(api.RIFT_ITEM_CATALOG.length,205,"catalog size changed outside the intentional V9 Mythical expansion");',
'assert.equal(api.RIFT_ITEM_CATALOG.length,207,"catalog size changed outside the intentional V9/V13 item expansions");',
'Shop Performance V13 catalog growth');

patch('scripts/verify-major-balance-mythical-v9.mjs',
'assert.equal(mythics.length,25,`expected exactly 25 Mythicals, got ${mythics.length}`);',
'assert.equal(mythics.length,26,`expected exactly 26 Mythicals after V13, got ${mythics.length}`);',
'V9 verifier total Mythical count');
patch('scripts/verify-major-balance-mythical-v9.mjs',
'assert.equal(visibleMythics.length,25,`Floor ${floor} Armory must expose all 25 Mythicals, got ${visibleMythics.length}`);assert.equal(new Set(visibleMythics.map(x=>x.id)).size,25,`Floor ${floor} Armory Mythical offers contain duplicates`)',
'assert.equal(visibleMythics.length,26,`Floor ${floor} Armory must expose all 26 Mythicals, got ${visibleMythics.length}`);assert.equal(new Set(visibleMythics.map(x=>x.id)).size,26,`Floor ${floor} Armory Mythical offers contain duplicates`)',
'V9 verifier Armory Mythical count');
patch('scripts/verify-major-balance-mythical-v9.mjs',
"const newMythics=mythics.filter(item=>item.id!=='sparda-devil-sword');assert.equal(newMythics.length,24,'V9 must add exactly 24 Mythicals on top of Sparda');",
"const newMythics=mythics.filter(item=>!['sparda-devil-sword','the-namegiver'].includes(item.id));assert.equal(newMythics.length,24,'legacy V9 must still own exactly 24 Mythicals; Namegiver is verified by V13');",
'V9 verifier legacy Mythical mechanic/profile scope');
patch('scripts/verify-major-balance-mythical-v9.mjs',
"const pyro=api.g.find(x=>x.name==='Pyrokinesis');assert.ok(pyro.moves.every(x=>x.tags.includes('scalingAP')));assert.ok(pyro.moves[0].tags.includes('pyroBurningGround'));assert.ok(pyro.moves.some(x=>x.tags.includes('pyroInfernoGround')));",
"const pyro=api.g.find(x=>x.name==='Pyrokinesis');assert.ok(pyro.moves.every(x=>x.tags.includes('scalingAP')));assert.ok(pyro.moves[0].tags.includes('v13Fireball'));assert.ok(pyro.moves.some(x=>x.tags.includes('v13FlamePillar')));assert.ok(pyro.moves.some(x=>x.tags.includes('v13Combustion')));assert.ok(pyro.moves.some(x=>x.tags.includes('v13FlameTornado')));",
'V9 verifier accepts V13 Pyrokinesis replacement');

patch('scripts/verify-mythical-canon-v10.mjs',
"const mythics=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'),fresh=mythics.filter(item=>item.id!=='sparda-devil-sword');",
"const mythics=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'),fresh=mythics.filter(item=>!['sparda-devil-sword','the-namegiver'].includes(item.id));",
'V10 legacy canon portrait scope');
patch('scripts/verify-mythical-canon-v10.mjs',
"assert.equal(mythics.length,25,'Mythical count changed');assert.equal(fresh.length,24,'new Mythical count changed');",
"assert.equal(mythics.length,26,'Mythical count changed after V13');assert.equal(fresh.length,24,'V10-authored Mythical count changed');",
'V10 total Mythical count');
patch('scripts/verify-mythical-canon-v10.mjs',
"assert.equal(api.RIFT_SHOP_OFFERS(floor,null).filter(item=>item.rarity==='Mythical').length,25,`Floor ${floor} lost Mythical shop visibility`);",
"assert.equal(api.RIFT_SHOP_OFFERS(floor,null).filter(item=>item.rarity==='Mythical').length,26,`Floor ${floor} lost Mythical shop visibility`);",
'V10 shop Mythical count');

patch('scripts/verify-shop-gui-reflow-v11.mjs',
"const fresh=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'&&item.id!=='sparda-devil-sword');",
"const fresh=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'&&!['sparda-devil-sword','the-namegiver'].includes(item.id));",
'V11 alignment scope');

patch('scripts/verify-mythical-buildpaths-earlygame-v12.mjs',
"const mythics=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'),fresh=mythics.filter(item=>item.id!=='sparda-devil-sword');",
"const mythics=api.RIFT_ITEM_CATALOG.filter(item=>item.rarity==='Mythical'),fresh=mythics.filter(item=>!['sparda-devil-sword','the-namegiver'].includes(item.id));",
'V12 legacy Mythical recipe scope');
patch('scripts/verify-mythical-buildpaths-earlygame-v12.mjs',
"assert.equal(mythics.length,25,'Mythical count changed');assert.equal(fresh.length,24,'V12 fresh Mythical count changed');assert.equal(Object.keys(api.RIFT_V12_MYTHICAL_RECIPES).length,24,'V12 needs a build path for every new Mythical');",
"assert.equal(mythics.length,26,'Mythical count changed after V13');assert.equal(fresh.length,24,'V12-authored Mythical count changed');assert.equal(Object.keys(api.RIFT_V12_MYTHICAL_RECIPES).length,24,'V12 needs a build path for every V9-era Mythical');",
'V12 total Mythical count');

const verifierPayload=fs.readFileSync('scripts/verify-elemental-cursed-child-v13.mjs.gz.b64','utf8').trim();
fs.writeFileSync('scripts/verify-elemental-cursed-child-v13.mjs',gunzipSync(Buffer.from(verifierPayload,'base64')).toString('utf8'));

console.log('Prepared legacy verifiers for V13: 207 items, 68 Legendaries, 26 Mythicals, V13 elemental replacement, and Namegiver-owned portrait/recipe coverage.');
