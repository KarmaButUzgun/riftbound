import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const site = resolve(root, '_site');
for (const path of ['multiplayer/server.mjs','patches/021-lan-coop-alpha.py','patches/coop-network-parts/01-client.js','patches/coop-network-parts/02-styles.css','package.json']) assert.ok(existsSync(resolve(root,path)), `missing ${path}`);
for (const path of ['index.html','assets/page-F6OuavDb.js','assets/riftbound-coop.js','assets/riftbound.css']) assert.ok(existsSync(resolve(site,path)), `built site missing ${path}`);
const index = await readFile(resolve(site,'index.html'),'utf8');
const bundle = await readFile(resolve(site,'assets/page-F6OuavDb.js'),'utf8');
const client = await readFile(resolve(site,'assets/riftbound-coop.js'),'utf8');
const server = await readFile(resolve(root,'multiplayer/server.mjs'),'utf8');
assert.match(index,/riftbound-coop\.js/);
assert.match(bundle,/RIFT_COOP_EXPOSE_RUNTIME/);
assert.match(bundle,/RIFT_COOP_EXPOSE_RUN/);
for (const marker of ['HOST RUN','JOIN RUN','EventSource','snapshotRun','sendIntent','window.RIFT_COOP','data-coop-action','intent-result']) assert.ok(client.includes(marker), `client missing ${marker}`);
for (const marker of ['/api/health','/api/rooms','text/event-stream','Only the host can publish authoritative run state','maxPlayers','PROTOCOL_VERSION','normalizeIntent']) assert.ok(server.includes(marker), `server missing ${marker}`);
console.log('LAN Co-op V20 network verification passed.');
