#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
const payload=new URL('./verify-v38-another-jojo.mjs.gz.b64',import.meta.url);
const source=gunzipSync(Buffer.from((await readFile(payload,'utf8')).trim(),'base64')).toString('utf8');
for(const needle of ['RIFT_V38_ACTIONS','RIFT_V38_MANDOM','Tusk Act 4','Mandom']){
 const i=source.indexOf(needle);
 if(i>=0) console.log(`V38_PROBE ${needle}\n${source.slice(Math.max(0,i-1400),Math.min(source.length,i+3600))}\nV38_PROBE_END`);
}
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
