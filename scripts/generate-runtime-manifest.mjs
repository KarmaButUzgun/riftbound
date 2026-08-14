import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const gameRoot = resolve(process.argv[2] || '.build/riftbound-standalone');
const output = resolve(process.argv[3] || '_site/riftbound-manifest.json');
const bundle = resolve(gameRoot, 'assets/page-F6OuavDb.js');

await import(`${pathToFileURL(bundle).href}?manifest=${Date.now()}`);
const manifest = globalThis.RIFTBOUND_MANIFEST;
if (!manifest || manifest.schemaVersion !== 32) throw new Error('V32 runtime manifest was not exposed');
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated Riftbound V32 runtime manifest with ${manifest.counts.items} items, ${manifest.counts.powers} registered powers, ${manifest.codex.visiblePowers} visible power profiles, ${manifest.codex.stands} Stands, and ${manifest.codex.displayedMoves} displayed techniques.`);
