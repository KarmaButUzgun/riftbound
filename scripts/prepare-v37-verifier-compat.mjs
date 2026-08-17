import {readFile,writeFile} from 'node:fs/promises';

async function edit(path,fn){let text=await readFile(path,'utf8');const next=fn(text);if(next!==text)await writeFile(path,next)}
const rep=(text,a,b)=>text.includes(a)?text.replaceAll(a,b):text;

// V36.8 owns the preserved 55-power archive. V37 adds Boogie Woogie on top without rewriting that historical catalog.
await edit('scripts/verify-v368-aesthetic-codex.mjs',text=>{
 text=rep(text,"assert.equal(test.g.length,55,'Special Power roster changed');","assert.equal(test.g.length,56,'V37 should extend the V36.8 roster by exactly one Special Power');");
 text=rep(text,'assert.equal(test.RIFT_V368_CATALOG.powers.length,55);assert.equal(codex.catalog().powers.length,55);','assert.equal(test.RIFT_V368_CATALOG.powers.length,55);assert.equal(codex.catalog().powers.length,56);');
 text=rep(text,'for(const power of test.g){','for(const power of test.g.filter(power=>power.name!==\'Boogie Woogie\')){');
 return text;
});

// The live Codex grows by one profile and four authored techniques; the V31/V33/V36 historical registries stay untouched.
await edit('scripts/verify-codex-ascendant-v31.mjs',text=>{
 text=rep(text,'{registeredPowers:55,visiblePowers:55,hiddenPowers:0,stands:7,profiles:62,moves:276,evolvedMoves:3}','{registeredPowers:56,visiblePowers:56,hiddenPowers:0,stands:7,profiles:63,moves:280,evolvedMoves:3}');
 text=rep(text,'catalog.profiles.length,62','catalog.profiles.length,63');
 text=rep(text,'catalog.powers.length,55','catalog.powers.length,56');
 text=rep(text,'catalog.moves.length,276','catalog.moves.length,280');
 text=rep(text,'cat.totals.moves,276','cat.totals.moves,280');
 text=rep(text,'cat.totals.registeredPowers,55','cat.totals.registeredPowers,56');
 text=rep(text,'cat.totals.visiblePowers,55','cat.totals.visiblePowers,56');
 return text;
});
await edit('scripts/verify-tactical-grammar-v33.mjs',text=>{
 text=rep(text,'codex.catalog().totals.moves,276','codex.catalog().totals.moves,280');
 text=rep(text,'t.codex.catalog().totals.moves,276','t.codex.catalog().totals.moves,280');
 return text;
});
await edit('scripts/verify-shadows-converge-v36.mjs',text=>rep(text,'codex.catalog().totals.moves,276','codex.catalog().totals.moves,280'));

// Some V36 post-hotfix verifiers inspect the live Codex directly.
for(const path of ['scripts/verify-v363-loadout-stability.mjs','scripts/verify-v364-authority-hotfix.mjs','scripts/verify-v365-takeover-identity.mjs','scripts/verify-v366-takeover-live-deck.mjs','scripts/verify-v367-takeover-offer-transition.mjs']){
 await edit(path,text=>rep(rep(text,'codex.catalog().totals.moves,276','codex.catalog().totals.moves,280'),'catalog().totals.moves,276','catalog().totals.moves,280'));
}

// V37 wraps the final resolver. Keep V36.3 checking the same Heartbreaker behavior through V37's preserved delegate.
await edit('scripts/verify-v363-loadout-stability.mjs',text=>{
 text=rep(text,'RIFT_V35_UNSHACKLED_POWER,oo,rs};','RIFT_V35_UNSHACKLED_POWER,oo,rs,RIFT_V37_BASE_RS};');
 text=rep(text,"assert.match(String(test.rs),/RIFT_V35_RESTORE_TAKEOVER/,'final resolver does not enforce post-Heartbreaker Takeover exit');","assert.match(String(test.rs),/RIFT_V37_BASE_RS/,'V37 final resolver no longer delegates through the preserved resolver chain');assert.match(String(test.RIFT_V37_BASE_RS),/RIFT_V35_RESTORE_TAKEOVER/,'preserved resolver beneath V37 no longer enforces post-Heartbreaker Takeover exit');");
 return text;
});

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v37-final-touch.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V37 last: V36.8 preservation remains 55 powers, the live Codex grows to 56 powers / 280 techniques, and the Final Touch regression runs after every prior release gate.');
