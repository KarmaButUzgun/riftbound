#!/usr/bin/env node
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {readFile,writeFile,rm} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=resolve(process.argv[2]||'.build/riftbound-standalone');
const bundlePath=resolve(root,'assets/page-F6OuavDb.js'),cssPath=resolve(root,'assets/riftbound.css');
const packagePath=resolve(dirname(bundlePath),'package.json'),testPath=resolve(dirname(bundlePath),'page-v15-test.js');
assert.ok(existsSync(bundlePath)&&existsSync(cssPath));
const bundle=await readFile(bundlePath,'utf8'),css=await readFile(cssPath,'utf8');
for(const needle of ['/* Riftbound Combat Fluidity Update V15 */','RIFT_V15_RECORD_HIT','RIFT_V15_FLOW_LAYER','RIFT_V15_STATUS_AURA','RIFT_V15_CANVAS_CLASS','v15FlowQueue','v15Motion','e.type===`ultimate`?980:420','ACTION BUFFERED','BUFFER READY','RIFT_V15_AUDIO_CUE'])assert.ok(bundle.includes(needle),`missing V15 runtime ${needle}`);
for(const needle of ['.v15-impact-cue','.v15-motion-trail','.v15-status-aura','.v15-camera-heavy','.map-feature.destroyed:before','@keyframes v15CameraHeavy','.action-card.v15-buffered'])assert.ok(css.includes(needle),`missing V15 style ${needle}`);
assert.ok(bundle.includes('(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'),'tactical map does not render V15 flow layer');
assert.ok(bundle.includes('(0,E.jsx)(RIFT_V15_STATUS_AURA,{fighter:t})'),'player status aura not mounted');
assert.ok(bundle.includes('(0,E.jsx)(RIFT_V15_STATUS_AURA,{fighter:n})'),'enemy status aura not mounted');
assert.ok(bundle.includes('flowMove=e.v15Motion?.actorId===actor'),'normal movement does not drive active movement presentation');
const marker='export{xs as default};'; assert.equal(bundle.split(marker).length-1,1);
const hook=`globalThis.__V15={g,d,p,Me,Le,Hr,RIFT_EMPTY_WEAPON,Da,La,go,rs,Gt,Y,W,U,RIFT_V15_ACTOR,RIFT_V15_RECORD_HIT,RIFT_V15_STATUS_CLASSES,RIFT_V15_STATUS_AURA,RIFT_V15_FLOW_LAYER,RIFT_V15_CANVAS_CLASS,RIFT_V15_AUDIO_CUE};`;
const existed=existsSync(packagePath);
try{
 if(!existed)await writeFile(packagePath,'{"type":"module"}\n');
 await writeFile(testPath,bundle.replace(marker,hook+marker));
 await import(`${pathToFileURL(testPath).href}?v15=${Date.now()}`);
 const api=globalThis.__V15; assert.ok(api);
 const race=api.d.find(x=>x.name==='Human')||api.d[0],trait=api.p.find(x=>x.name!=='Stand User')||api.p[0],power=api.g.find(x=>x.name==='Super Strength')||api.g[0];
 const fighter=()=>api.Hr('V15 Tester',structuredClone(race),structuredClone(trait),structuredClone(power),null,api.RIFT_EMPTY_WEAPON(),api.Le(api.Me));
 const player=fighter(),run=api.Da(player);
 run.battlefield.v15FlowAction={id:'combo',name:'Test Barrage',type:'special'};
 const hp0=run.enemy.hp;
 api.go(run,run.player,run.enemy,12,false,['physical']);
 api.go(run,run.player,run.enemy,12,false,['physical']);
 assert.ok(run.enemy.hp<hp0,'damage wrapper stopped damage');
 const ev=run.battlefield.v15FlowQueue.at(-1); assert.equal(ev.hits,2,'multihit did not aggregate'); assert.ok(ev.damage>0);
 assert.ok(api.RIFT_V15_CANVAS_CLASS(run.battlefield).includes('v15-flow-active')); assert.equal(api.RIFT_V15_AUDIO_CUE(ev),'impact');
 const start={...api.W(run,'player')},move=api.Gt(run,'player',{x:Math.min(run.battlefield.width-3,start.x+5),y:start.y},true);
 assert.equal(move.moved,true,'movement smoke did not move'); assert.equal(run.battlefield.v15Motion.actorId,'player'); assert.ok(run.battlefield.v15Motion.distance>0);
 run.player.statuses.v13Burn=2;run.player.statuses.v13Chill=1;run.player.statuses.v14FInertia=1;
 let classes=api.RIFT_V15_STATUS_CLASSES(run.player); for(const c of ['burning','chilled','inertia-live'])assert.ok(classes.includes(c),`missing status body language ${c}`);
 assert.equal(typeof api.RIFT_V15_STATUS_AURA({fighter:run.player}).type,'string');
 assert.ok(api.RIFT_V15_FLOW_LAYER({battlefield:run.battlefield}));
 const strike=api.La(run.player).find(x=>x.type==='strike'); assert.ok(strike);
 api.rs(run,'player',strike,{attacker:run.player,target:run.enemy,actorId:'player',targetId:'enemy',tone:'player'});
 assert.ok(run.battlefield.v15FlowAction?.name,'action flow wrapper did not stamp action');
 console.log(`Combat Fluidity V15 verified: aggregated impacts, movement flow, status body language, camera classes, action buffering, layered audio cues, and action flow.`);
}finally{
 delete globalThis.__V15; await rm(testPath,{force:true}); if(!existed)await rm(packagePath,{force:true});
}
