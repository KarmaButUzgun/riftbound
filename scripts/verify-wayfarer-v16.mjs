#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const raw=(await readFile(resolve(here,'verify-wayfarer-v16-payload.gz.b64'),'utf8')).trim();
const source=gunzipSync(Buffer.from(raw,'base64')).toString('utf8');
const data='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
process.argv[2]=process.argv[2]||'.build/riftbound-standalone';
await import(data);
