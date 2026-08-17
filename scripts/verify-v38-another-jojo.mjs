#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
const payload=new URL('./verify-v38-another-jojo.mjs.gz.b64',import.meta.url);
let source=gunzipSync(Buffer.from((await readFile(payload,'utf8')).trim(),'base64')).toString('utf8');
source=source.replace('RIFT_V38_REVERT_ACT4};','RIFT_V38_REVERT_ACT4,RIFT_V38_ACTIONS};');
source=source.replace("const stand=name=>t.h.find(row=>row.name===name);","const stand=name=>t.h.find(row=>row.name===name); console.log('V38_RUNTIME_STANDS',JSON.stringify({mandom:stand('Mandom'),act4:stand('Tusk Act 4')}));");
source=source.replace("const stats={as:5,ap:5,durability:5,speed:5,range:5,iq:5,battleIq:5,combatSkill:5,energy:5,regeneration:5};","console.log('V38_RUNTIME_ACTIONS_FN',String(t.RIFT_V38_ACTIONS)); const stats={as:5,ap:5,durability:5,speed:5,range:5,iq:5,battleIq:5,combatSkill:5,energy:5,regeneration:5};");
await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
