#!/usr/bin/env node
import fs from 'node:fs';
function patch(path,oldText,newText,label){
  let text=fs.readFileSync(path,'utf8');
  const count=text.split(oldText).length-1;
  if(count!==1)throw new Error(`${label}: expected one anchor in ${path}, found ${count}`);
  text=text.replace(oldText,newText);fs.writeFileSync(path,text);
}
patch('scripts/verify-shop-gui-reflow-v11.mjs',
"assert.ok(shop.includes('[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false);'),'shop must open with compact loadout dock');",
"assert.ok(shop.includes('[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false),[shopOwner,setShopOwner]=(0,r.useState)(`yuta`);'),'shop must open with compact Yuta loadout dock and explicit Rika inventory owner state');",
'V11 compact dock expectation with V13 Rika owner state');
console.log('Prepared late V13 verifier compatibility for the Rika-aware compact Armory dock.');
