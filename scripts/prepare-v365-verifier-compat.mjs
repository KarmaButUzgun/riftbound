import {readFile,writeFile} from 'node:fs/promises';

// V36.5 is additive hotfix metadata; older V36.3/V36.4 tests keep their own API versions but should accept the newest manifest hotfix.
for(const path of ['scripts/verify-v363-loadout-stability.mjs','scripts/verify-v364-authority-hotfix.mjs']){
 let text=await readFile(path,'utf8');
 text=text.replace("assert.equal(manifest.v36.hotfix,'36.4');","assert.equal(manifest.v36.hotfix,'36.5');");
 text=text.replace("assert.equal(manifest.v36.hotfix,'36.3');","assert.equal(manifest.v36.hotfix,'36.5');");
 await writeFile(path,text);
}

// V36 originally certified its own broken architecture: it expected the victim to become fighter.power and
// Heartbreaker to be stapled over the victim's M4. V36.5 intentionally removes that identity mutation. Preserve
// the historical V36 coverage while asserting the corrected storage model instead.
const v36='scripts/verify-shadows-converge-v36.mjs';
let v36Text=await readFile(v36,'utf8');
const oldTakeover="const borrowed={power:{name:'Electro',moves:[{name:'Lightning Bolt'},{name:'Arc Current'},{name:'Overload'},{name:'Thunder God',tags:['ultimate']}]},statuses:{v35Takeover:{remaining:5},v35OriginalPower:'Ruined King'}};test.RIFT_V36_ENFORCE_HEARTBREAKER(borrowed);assert.equal(borrowed.power.moves.length,4);assert.equal(borrowed.power.moves[3].name,'Heartbreaker');assert.ok(borrowed.power.moves[3].tags.includes('v36TakeoverHeartbreaker'));assert.ok(!borrowed.power.moves.some(m=>m.name==='Thunder God'),'victim Ultimate survived structural Takeover rewrite');assert.match(String(test.RIFT_V36_ENFORCE_HEARTBREAKER),/slice\\(0,3\\)/,'Takeover fix must rewrite temporary power shell, not only UI actions');";
const newTakeover="const borrowed={power:{name:'Electro',moves:[{name:'Lightning Bolt'},{name:'Arc Current'},{name:'Overload'},{name:'Thunder God',tags:['ultimate']}]},statuses:{v35Takeover:{remaining:5},v35OriginalPower:'Ruined King'}};test.RIFT_V36_ENFORCE_HEARTBREAKER(borrowed);assert.equal(borrowed.power.name,'Ruined King','Takeover must preserve the Ruined King as fighter.power');assert.equal(borrowed.statuses.v35Takeover.borrowedPower?.name,'Electro','victim power must move into Takeover storage');assert.deepEqual(borrowed.statuses.v35Takeover.borrowedMoves?.map(m=>m.name),['Lightning Bolt','Arc Current','Overload'],'only victim M1-M3 should be stored for the Takeover overlay');assert.ok(!borrowed.statuses.v35Takeover.borrowedMoves?.some(m=>m.name==='Thunder God'),'victim Ultimate survived Takeover storage separation');assert.match(String(test.RIFT_V36_ENFORCE_HEARTBREAKER),/borrowedMoves|RIFT_V365_ENFORCE_TAKEOVER_IDENTITY/,'Takeover guard must store borrowed moves without replacing fighter.power');";
if(!v36Text.includes(oldTakeover))throw new Error('V36.5 historical Takeover compatibility anchor missing');
v36Text=v36Text.replace(oldTakeover,newTakeover);
await writeFile(v36,v36Text);

const gate='scripts/verify-sovereigns-v35.mjs';
let gateText=await readFile(gate,'utf8');
const marker="await import('./verify-v365-takeover-identity.mjs');";
if(!gateText.includes(marker))gateText=gateText.trimEnd()+`\n\n${marker}\n`;
await writeFile(gate,gateText);
console.log('Prepared V36.5 last: newest manifest hotfix accepted, historical V36 Takeover assertion aligned to stable Ruined King identity, and structural identity regression chained after V36.3/V36.4.');
