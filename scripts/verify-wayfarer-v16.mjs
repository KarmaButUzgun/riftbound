#!/usr/bin/env node
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const raw=(await readFile(resolve(here,'verify-wayfarer-v16-payload.gz.b64'),'utf8')).trim();
const legacySource=gunzipSync(Buffer.from(raw,'base64')).toString('utf8');
const catalogAnchor="assert.equal(api.g.length,50,'Special Power catalog unexpectedly changed');";
assert.equal(legacySource.split(catalogAnchor).length-1,1,'V32 Wayfarer compatibility anchor changed');
const source=legacySource.replace(catalogAnchor,"assert.equal(api.g.length,51,'Special Power catalog unexpectedly changed outside the additive V32 release');");
const data='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
process.argv[2]=process.argv[2]||'.build/riftbound-standalone';
await import(data);
