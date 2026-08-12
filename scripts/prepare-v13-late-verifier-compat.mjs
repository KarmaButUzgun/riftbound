#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';

const v11Path='scripts/verify-shop-gui-reflow-v11.mjs';
const v11=fs.readFileSync(v11Path,'utf8');
assert.ok(
  v11.includes("assert.ok(shop.includes('[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false);'),'shop must open with compact loadout dock');"),
  'V11 compact-dock verifier baseline changed unexpectedly'
);

// V13.1 deliberately moves shopOwner/shopFighter ahead of the first catalog memo.
// Run the dedicated ordering regression here so both PR and Pages workflows pick it
// up through the existing late-compat step without maintaining divergent pipelines.
await import(`./verify-v131-shopfighter-tdz.mjs?run=${Date.now()}`);

console.log('Prepared late V13/V13.1 verifier compatibility: V11 compact dock remains valid and Armory owner ordering is TDZ-safe.');
