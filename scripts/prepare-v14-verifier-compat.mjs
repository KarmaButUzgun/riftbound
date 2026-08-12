#!/usr/bin/env node
import fs from 'node:fs';

function edit(path,fn,label){
  let text=fs.readFileSync(path,'utf8'),before=text;
  text=fn(text);
  if(text===before)throw new Error(`${label}: no compatibility anchors changed in ${path}`);
  fs.writeFileSync(path,text);
}
function replaceExact(text,oldText,newText,label){
  const count=text.split(oldText).length-1;
  if(count!==1)throw new Error(`${label}: expected one anchor, found ${count}`);
  return text.replace(oldText,newText);
}

edit('scripts/verify-build-expansion.mjs',text=>{
  text=replaceExact(text,
    'assert.equal(catalog.length,207);assert.equal(new Set(catalog.map(i=>i.id)).size,207);assert.equal(legendary.length,68);assert.equal(mythical.length,26);',
    'assert.equal(catalog.length,210);assert.equal(new Set(catalog.map(i=>i.id)).size,210);assert.equal(legendary.length,70);assert.equal(mythical.length,26);',
    'V14 Build Expansion catalog totals');
  text=replaceExact(text,
    'assert.equal(new Set(legendary.map(i=>i.passiveId)).size,68);',
    'assert.equal(new Set(legendary.map(i=>i.passiveId)).size,70);',
    'V14 Build Expansion Legendary passive count');
  return text;
},'V14 Build Expansion compatibility');

edit('scripts/verify-shop-performance-v7.mjs',text=>replaceExact(text,
  'assert.equal(api.RIFT_ITEM_CATALOG.length,207,"catalog size changed outside the intentional V9/V13 item expansions");',
  'assert.equal(api.RIFT_ITEM_CATALOG.length,210,"catalog size changed outside the intentional V9/V13/V14 item expansions");',
  'V14 Shop Performance catalog total'),
  'V14 Shop Performance compatibility');

// V13's own verifier is materialized by prepare-v13-verifier-compat.mjs earlier in CI.
// Preserve all V13 mechanics assertions while widening only its exact catalog totals.
edit('scripts/verify-elemental-cursed-child-v13.mjs',text=>{
  let changed=0;
  const reps=[
    [/((?:RIFT_ITEM_CATALOG|catalog|items)\.length\s*,\s*)207\b/g,'$1210'],
    [/((?:legendary|legendaries|legendaryItems)\.length\s*,\s*)68\b/g,'$170'],
    [/(\b207\s+items\b)/g,'210 items'],
    [/(\b68\s+Legendaries\b)/g,'70 Legendaries']
  ];
  for(const [re,repl] of reps){const next=text.replace(re,repl);if(next!==text)changed++;text=next}
  if(!changed)throw new Error('V14 V13 verifier compatibility: no V13 catalog-count anchors found');
  return text;
},'V14 V13 verifier compatibility');

// V14 extends the existing action-card filter so utility-strip actions stay outside
// the canonical 4x2 deck. Spartan weapon-switch actions are still filtered exactly
// as before; the old verifier only asserted the pre-V14 literal string.
edit('scripts/verify-spartan-blood.mjs',text=>replaceExact(text,
  'assert.ok(bundle.includes("wl.filter(e=>!e.move?.tags?.includes(`spardaWeaponSwitch`)).map"), "Spartan switch actions still render in the action-card grid");',
  'assert.ok(bundle.includes("wl.filter(e=>!e.move?.tags?.includes(`spardaWeaponSwitch`)&&!e.move?.tags?.includes(`v14UtilityButton`)).map"), "Spartan switch actions or V14 utility actions still render in the action-card grid");',
  'V14 Spartan extended action-grid filter'),
  'V14 Spartan verifier compatibility');

console.log('Prepared legacy verifiers for V14: 210 items, 70 Legendaries, 26 Mythicals, extended utility-strip action filtering, while preserving V13 and Spartan mechanics coverage.');
