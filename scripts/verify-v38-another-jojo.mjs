#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
const payload=new URL('./verify-v38-another-jojo.mjs.gz.b64',import.meta.url);
let source=gunzipSync(Buffer.from((await readFile(payload,'utf8')).trim(),'base64')).toString('utf8');
source=source.replace("const [bundle,css]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8')]);","const [bundle,css]=await Promise.all([readFile(bundlePath,'utf8'),readFile(cssPath,'utf8')]); const __lines=bundle.split('\\n'); console.log('V381_LINE6484\\n'+__lines.slice(6478,6491).map((x,i)=>String(6479+i).padStart(4,'0')+': '+x).join('\\n')+'\\nV381_LINE6484_END'); const __tsA=bundle.indexOf('function Ts('),__tsB=bundle.indexOf('Ts='); const __ts=Math.max(__tsA,__tsB); console.log('V381_TS_SNIP\\n'+bundle.slice(Math.max(0,__ts-1200),Math.min(bundle.length,__ts+3600))+'\\nV381_TS_SNIP_END');");
source=source.replace("const stand=name=>t.h.find(row=>row.name===name);","const stand=name=>t.h.find(row=>row.name===name); console.log('V381_STANDS',JSON.stringify({mandom:stand('Mandom'),act4:stand('Tusk Act 4')}));");
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
