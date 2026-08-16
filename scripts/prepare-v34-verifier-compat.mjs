import {readFile,writeFile} from 'node:fs/promises';

const edits={
 'scripts/verify-consolidation-v17-v20.mjs':[
  ["manifest?.schemaVersion,33,'V17-V20 compatibility must survive the additive V33 tactical schema'","manifest?.schemaVersion,34,'V17-V20 compatibility must survive the additive V34 visual schema'"],
  ["manifest?.release,'V33 · Tactical Grammar'","manifest?.release,'V34 · Battlefield VFX Grammar'"],
  ['publishedManifest.schemaVersion,33','publishedManifest.schemaVersion,34'],
  ["console.log('Riftbound V17-V20 compatibility verification passed under V33.');","assert.equal(manifest.battlefieldVfx?.version,34);\nassert.equal(manifest.battlefieldVfx?.moves,255);\nassert.equal(manifest.battlefieldVfx?.fallbacks,0);\nconsole.log('Riftbound V17-V20 compatibility verification passed under V34.');"],
 ],
 'scripts/verify-remastered-v21-v30.mjs':[
  ["manifest?.schemaVersion,33,'V30 foundation must remain certified beneath the additive V33 tactical schema'","manifest?.schemaVersion,34,'V30 foundation must remain certified beneath the additive V34 visual schema'"],
  ["manifest?.release,'V33 · Tactical Grammar'","manifest?.release,'V34 · Battlefield VFX Grammar'"],
  ['published.schemaVersion,33','published.schemaVersion,34'],
  ["console.log('Riftbound V21-V30 Remastered foundation verification passed beneath V33: the protected 225-move constitution remains intact while the 255-technique tactical layer stays additive.');","assert.equal(manifest.battlefieldVfx?.version,34);\nassert.equal(manifest.battlefieldVfx?.moves,255);\nassert.equal(manifest.battlefieldVfx?.fallbacks,0);\nconsole.log('Riftbound V21-V30 Remastered foundation verification passed beneath V34: protected mechanics stay intact while the tactical and battlefield-VFX layers remain additive.');"],
 ],
 'scripts/verify-codex-ascendant-v31.mjs':[
  ['manifest?.schemaVersion,33','manifest?.schemaVersion,34'],
  ["manifest?.release,'V33 · Tactical Grammar'","manifest?.release,'V34 · Battlefield VFX Grammar'"],
  ['published.schemaVersion,33','published.schemaVersion,34'],
  ["console.log('Riftbound V31 Codex foundation verification passed beneath V33: 57 profiles and all 255 displayed techniques retain their authored dossier data while receiving explicit live tactical contracts.');","assert.equal(manifest.battlefieldVfx?.version,34);\nassert.equal(manifest.battlefieldVfx?.moves,255);\nassert.equal(manifest.battlefieldVfx?.fallbacks,0);\nconsole.log('Riftbound V31 Codex foundation verification passed beneath V34: all 255 techniques retain authored data, live tactical contracts, and dedicated battlefield VFX descriptors.');"],
 ],
 'scripts/verify-restless-gambler-v32.mjs':[
  ['manifest.schemaVersion,33','manifest.schemaVersion,34'],
  ["manifest.release,'V33 · Tactical Grammar'","manifest.release,'V34 · Battlefield VFX Grammar'"],
  ['published.schemaVersion,33','published.schemaVersion,34'],
  ["console.log('Riftbound V32 Restless Gambler verification passed beneath V33: Fever, domain, Jackpot, Train Door, previews, and all seven live tactical types are certified.');","assert.equal(manifest.battlefieldVfx?.version,34);\nassert.equal(manifest.battlefieldVfx?.fallbacks,0);\nconsole.log('Riftbound V32 Restless Gambler verification passed beneath V34: mechanics, tactical types, and dedicated battlefield VFX remain certified.');"],
 ],
};

for(const [path,replacements] of Object.entries(edits)){
 let text=await readFile(path,'utf8');
 for(const [from,to] of replacements){
  if(text.includes(from))text=text.replace(from,to);
  else if(!text.includes(to))throw new Error(`V34 verifier compatibility anchor missing in ${path}: ${from}`);
 }
 await writeFile(path,text);
}
console.log('Prepared V20/V30/V31/V32 compatibility verifiers for additive V34 battlefield VFX schema.');
