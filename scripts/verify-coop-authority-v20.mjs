import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(new URL('..',import.meta.url).pathname);
const port=39000+Math.floor(Math.random()*1200);
const base=`http://127.0.0.1:${port}/api`;
const child=spawn(process.execPath,['multiplayer/server.mjs'],{cwd:root,env:{...process.env,PORT:String(port),RIFTBOUND_COOP_HOST:'127.0.0.1',RIFTBOUND_COOP_CONNECTION_TTL:'350'},stdio:['ignore','pipe','pipe']});
let output='';child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>output+=chunk);
const delay=ms=>new Promise(resolveDelay=>setTimeout(resolveDelay,ms));
async function json(path,options={}){
 const response=await fetch(`${base}${path}`,options),body=await response.json().catch(()=>({}));
 return{response,body};
}
async function waitForServer(){
 for(let attempt=0;attempt<60;attempt+=1){try{const result=await json('/health');if(result.response.ok)return result.body}catch{}await delay(50)}
 throw new Error(`co-op server did not start\n${output}`);
}
const headers=session=>({'content-type':'application/json','x-rift-player':session.playerId,'x-rift-token':session.token});
try{
 const health=await waitForServer();assert.equal(health.protocolVersion,3);assert.equal(health.authority,'host');
 const hosted=await json('/rooms',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Host'})});assert.equal(hosted.response.status,201);
 const host=hosted.body,code=host.room.id;assert.equal(host.room.protocolVersion,3);
 const joined=await json(`/rooms/${code}/join`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Partner'})});assert.equal(joined.response.status,200);
 const partner=joined.body;
 let result=await json(`/rooms/${code}/intent`,{method:'POST',headers:headers(partner),body:JSON.stringify({type:'action',sequence:1,payload:{actionId:'strike'}})});assert.equal(result.response.status,409,'unready room accepted an intent');
 for(const session of [host,partner]){result=await json(`/rooms/${code}/ready`,{method:'POST',headers:headers(session),body:JSON.stringify({ready:true})});assert.equal(result.response.status,200)}
 result=await json(`/rooms/${code}/snapshot`,{method:'POST',headers:headers(host),body:JSON.stringify({phase:'combat',turn:1,state:{phase:'combat',turn:1,coop:{protocolVersion:3,stateHash:'state-hash-1'}}})});assert.equal(result.response.status,200);assert.equal(result.body.stateHash,'state-hash-1');
 result=await json(`/rooms/${code}/intent`,{method:'POST',headers:headers(partner),body:JSON.stringify({type:'action',sequence:1,payload:{actionId:'strike',targetId:'enemy',expectedStateHash:'stale-hash'}})});assert.equal(result.response.status,409,'desynchronized command was accepted');
 result=await json(`/rooms/${code}/resync`,{method:'POST',headers:headers(partner),body:'{}'});assert.equal(result.response.status,200);assert.equal(result.body.snapshot.stateHash,'state-hash-1');
 result=await json(`/rooms/${code}/intent`,{method:'POST',headers:headers(partner),body:JSON.stringify({type:'action',sequence:1,payload:{actionId:'strike',targetId:'enemy',expectedStateHash:'state-hash-1'}})});assert.equal(result.response.status,202);const intentId=result.body.intentId;
 await delay(110);
 result=await json(`/rooms/${code}/intent`,{method:'POST',headers:headers(partner),body:JSON.stringify({type:'action',sequence:1,payload:{actionId:'strike'}})});assert.equal(result.response.status,409,'stale sequence was accepted');
 result=await json(`/rooms/${code}/intent`,{method:'POST',headers:headers(host),body:JSON.stringify({type:'action',sequence:2,payload:{actionId:'strike'}})});assert.equal(result.response.status,409,'host was allowed to impersonate Player 2');
 result=await json(`/rooms/${code}/intent`,{method:'POST',headers:headers(partner),body:JSON.stringify({type:'move',sequence:2,payload:{actorId:'player',position:{x:20,y:20}}})});assert.equal(result.response.status,409,'partner moved the host actor');
 result=await json(`/rooms/${code}/intent`,{method:'POST',headers:headers(partner),body:JSON.stringify({type:'move',sequence:2,payload:{actorId:'coop-ally',position:{x:20,y:20}}})});assert.equal(result.response.status,202);
 result=await json(`/rooms/${code}/intent-result`,{method:'POST',headers:headers(host),body:JSON.stringify({intentId,ok:true,message:'Strike resolved'})});assert.equal(result.response.status,200);
 result=await json(`/rooms/${code}/intent-result`,{method:'POST',headers:headers(host),body:JSON.stringify({intentId,ok:false,message:'Duplicate should not replace result'})});assert.equal(result.response.status,200);assert.equal(result.body.duplicate,true);assert.equal(result.body.result.ok,true);
 const state=await json(`/rooms/${code}/state`,{headers:headers(partner)});assert.equal(state.body.room.protocolVersion,3);assert.equal(state.body.snapshot.phase,'combat');assert.equal(state.body.intentResults.at(-1).intentId,intentId);
 const recovery=await json(`/rooms/${code}/recovery`,{headers:headers(partner)});assert.equal(recovery.body.protocolVersion,3);assert.equal(recovery.body.snapshot.stateHash,'state-hash-1');assert.ok(recovery.body.events.some(event=>event.type==='resync-requested'));
 await delay(600);
 const paused=await json(`/rooms/${code}/state`,{headers:headers(host)});assert.equal(paused.body.room.started,false,'room stayed live after the partner heartbeat expired');assert.equal(paused.body.room.players.find(player=>player.slot===2).connected,false);
 const resumed=await json(`/rooms/${code}/recovery`,{headers:headers(partner)});assert.equal(resumed.body.room.started,true,'room did not resume after authenticated recovery');assert.equal(resumed.body.snapshot.stateHash,'state-hash-1');
 console.log('Riftbound V29 host-authoritative co-op verification passed.');
}finally{
 child.kill('SIGTERM');await Promise.race([new Promise(resolveExit=>child.once('exit',resolveExit)),delay(1000)]);
}
