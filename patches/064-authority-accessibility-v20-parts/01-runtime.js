const RIFT_V20_MARKER=`Riftbound Authority Accessibility and Effects V20`;
const RIFT_V20_VERSION=20;
const RIFT_V20_ALLY_ID=`coop-ally`;
const RIFT_V20_ACCESS_KEY=`riftbound-accessibility-v20`;
const RIFT_V20_ACCESS_DEFAULTS=Object.freeze({reducedMotion:false,highContrast:false,largeText:false,effects:`auto`});
function RIFT_V20_COOP_ACTIVE(){
 const state=globalThis.RIFT_COOP?.state;return!!(state?.role===`host`&&state?.room?.started&&state?.connected);
}
function RIFT_V20_COOP_PARTNER_NAME(){
 const state=globalThis.RIFT_COOP?.state,partner=state?.room?.players?.find(player=>player.slot===2);return String(partner?.name||`Partner`).slice(0,28);
}
function RIFT_V20_CREATE_ALLY(run,name=RIFT_V20_COOP_PARTNER_NAME()){
 if(!run?.player||run.phase!==`combat`)return null;let existing=U(run,RIFT_V20_ALLY_ID);if(existing)return existing;
 const fighter=P(run.player);fighter.name=`${name} · Rift Echo`;fighter.maxHp=Math.max(80,Math.round(run.player.maxHp*.78));fighter.hp=fighter.maxHp;fighter.maxEnergy=Math.max(60,Math.round(run.player.maxEnergy*.82));fighter.energy=fighter.maxEnergy;fighter.ultimate=0;fighter.guard=false;fighter.shield=0;fighter.lastActions=[];fighter.lastMove=null;
 fighter.statuses={v20CoopAlly:1,tacticalRank:Math.max(2,Number(run.player.statuses?.tacticalRank||0)-1)};fighter.stand=fighter.stand?{...fighter.stand,summoned:false,lastTurnUsed:-1}:fighter.stand;
 RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
 const occupied=H(run).map(entry=>W(run,entry.id)),origin=W(run,`player`),candidate={x:Math.max(5,origin.x+5),y:Math.min(run.battlefield.height-5,origin.y+7)},position=Wi(run.battlefield,candidate,occupied);
 const movement=mt(fighter),entry={id:RIFT_V20_ALLY_ID,fighter,team:run.playerTeam,role:`ally`,intent:null,transient:true};
 run.auxiliaryCombatants=(run.auxiliaryCombatants||[]).filter(aux=>aux.id!==RIFT_V20_ALLY_ID);run.auxiliaryCombatants.push(entry);
 run.battlefield.units=(run.battlefield.units||[]).filter(unit=>unit.id!==RIFT_V20_ALLY_ID);run.battlefield.units.push({id:RIFT_V20_ALLY_ID,position,movement,movementMax:movement,elevation:Lt(run.battlefield,position)});
 run.v20Coop={...(run.v20Coop||{}),active:true,protocolVersion:2,allyId:RIFT_V20_ALLY_ID,actedTurn:null,createdFloor:run.floor};
 run.battleMode=`coop`;run.battleLabel=`2 PLAYER CO-OP · HOST AUTHORITY`;
 G(run,`CO-OP ALLY // ${fighter.name} crosses the host's rift. Player 2 now owns this fighter's movement and one action each turn.`,`player`);
 return entry;
}
function RIFT_V20_REMOVE_ALLY(run){
 if(!run)return false;const found=(run.auxiliaryCombatants||[]).some(entry=>entry.id===RIFT_V20_ALLY_ID);if(!found)return false;
 run.auxiliaryCombatants=run.auxiliaryCombatants.filter(entry=>entry.id!==RIFT_V20_ALLY_ID);if(run.battlefield?.units)run.battlefield.units=run.battlefield.units.filter(unit=>unit.id!==RIFT_V20_ALLY_ID);
 run.v20Coop={...(run.v20Coop||{}),active:false,allyId:null};return true;
}
function RIFT_V20_ACTION_REASON(run,entry,action,busy=false){
 if(!entry||entry.fighter.hp<=0)return`ALLY DEFEATED`;if(busy)return`HOST RESOLVING`;if(run.v20Coop?.actedTurn===run.turn)return`ACTION SPENT`;
 const fighter=entry.fighter,tags=action?.move?.tags||[];
 if(!action)return`ACTION MISSING`;if(Va(fighter,action)>0)return`${Va(fighter,action)}T COOLDOWN`;if(action.cost>fighter.energy&&fighter.trait?.name!==`Blood Price`)return`NEED ${action.cost-fighter.energy} ENERGY`;
 if(action.type===`ultimate`&&fighter.ultimate<100)return`${Math.round(fighter.ultimate)}% ULTIMATE`;
 if(tags.some(tag=>[`mimicryMenu`,`authenticMutualLove`,`kcrMasterTime`,`symbolFactorWheel`,`standToggle`,`rikaCommand`,`rikaPartialSummon`,`rikaFullManifest`].includes(tag)))return`HOST-ONLY INTERFACE`;
 if(tags.includes(`limitlessPurple`)&&(fighter.statuses.limitlessPurpleCharge||0)<100)return`PURPLE NOT CHARGED`;
 if(tags.includes(`shrineFurnace`)&&(fighter.statuses.furnaceCharge||0)<100&&!fighter.statuses.malevolentShrinePulses)return`FURNACE NOT CHARGED`;
 return``;
}
function RIFT_V20_ALLY_ACTIONS(run,busy=false){
 const entry=U(run,RIFT_V20_ALLY_ID);if(!entry)return[];const target=zi(run,RIFT_V20_ALLY_ID)[0]||U(run,run.activeTargetId)||U(run,`enemy`);
 return La(entry.fighter).slice(0,12).map(action=>{const reason=RIFT_V20_ACTION_REASON(run,entry,action,busy);return{id:action.id,slot:String(action.slot??`·`),name:action.name,type:action.type,cost:Number(action.cost||0),targetId:target?.id||null,disabled:!!reason,reason};});
}
function RIFT_V20_SNAPSHOT_EXTRAS(run,context={}){
 const entry=U(run,RIFT_V20_ALLY_ID),unit=run?.battlefield?Ei(run.battlefield,RIFT_V20_ALLY_ID):null,busy=!!context.busy;
 if(!entry)return{protocolVersion:2,ally:null,canAct:false,canMove:false,actions:[],position:null,movement:0};
 return{protocolVersion:2,authority:`host`,ally:{id:entry.id,name:entry.fighter.name,hp:entry.fighter.hp,maxHp:entry.fighter.maxHp,energy:entry.fighter.energy,maxEnergy:entry.fighter.maxEnergy,ultimate:entry.fighter.ultimate,power:entry.fighter.power?.name||null},position:unit?{...unit.position}:null,movement:Number(unit?.movement||0),canMove:!busy&&entry.fighter.hp>0&&Number(unit?.movement||0)>.05,canAct:!busy&&entry.fighter.hp>0&&run.phase===`combat`&&run.v20Coop?.actedTurn!==run.turn,actedTurn:run.v20Coop?.actedTurn??null,turn:run.turn,actions:RIFT_V20_ALLY_ACTIONS(run,busy)};
}
function RIFT_V20_RESOLVE_AIM(run,actor,target,action,point){
 if(!Tt(action,actor.fighter).requiresAim)return action;if(!point)return us(run,actor.id,target.id,action);
 const next=P(action);next.aim=At(run.battlefield,next,actor.fighter,`player`,point,{origin:W(run,actor.id),originElevation:Di(run,actor.id),opponent:W(run,target.id),opponentElevation:Di(run,target.id),targetId:target.id,targetName:target.fighter.name});next.targetId=target.id;return next;
}
function RIFT_V20_APPLY_COOP_INTENT(intent,run,context={}){
 try{
  if(!intent||intent.slot!==2)return{ok:false,message:`Only Player 2 can control the ally.`};if(!run||run.phase!==`combat`)return{ok:false,message:`The host is not in combat.`};if(context.busy)return{ok:false,message:`The host is resolving an exchange.`};if(typeof context.commit!==`function`)return{ok:false,message:`The authoritative state bridge is unavailable.`};
  const next=P(run);let actor=U(next,RIFT_V20_ALLY_ID)||RIFT_V20_CREATE_ALLY(next);if(!actor)return{ok:false,message:`The co-op ally has not materialized.`};if(actor.fighter.hp<=0)return{ok:false,message:`The co-op ally is defeated.`};
  next.v20Coop={...(next.v20Coop||{}),active:true,protocolVersion:2,allyId:RIFT_V20_ALLY_ID};
  if(intent.type===`move`){
   if(intent.payload?.actorId!==RIFT_V20_ALLY_ID)return{ok:false,message:`Player 2 can move only the co-op ally.`};
   const moved=Gt(next,RIFT_V20_ALLY_ID,intent.payload.position);if(!moved.moved)return{ok:false,message:moved.reason||`The route is blocked.`};
   G(next,`PLAYER 2 MOVEMENT // ${actor.fighter.name} travels ${moved.traveledDistance.toFixed(1)}m with ${Oi(next,RIFT_V20_ALLY_ID).toFixed(1)} MP remaining.`,`player`);next.v20Coop.lastIntentId=intent.id;context.commit(next);return{ok:true,message:`Moved ${moved.traveledDistance.toFixed(1)}m · ${Oi(next,RIFT_V20_ALLY_ID).toFixed(1)} MP remains.`};
  }
  if(intent.type!==`action`)return{ok:false,message:`Unsupported partner command.`};if(next.v20Coop.actedTurn===next.turn)return{ok:false,message:`The ally already acted on turn ${next.turn}.`};
  const action=La(actor.fighter).find(candidate=>candidate.id===intent.payload?.actionId),reason=RIFT_V20_ACTION_REASON(next,actor,action,false);if(reason)return{ok:false,message:reason};
  const target=U(next,intent.payload?.targetId)||zi(next,RIFT_V20_ALLY_ID)[0];if(!target||target.team===actor.team||target.fighter.hp<=0)return{ok:false,message:`No legal hostile target remains.`};
  const resolved=RIFT_V20_RESOLVE_AIM(next,actor,target,P(action),intent.payload?.aim||null);if(resolved.aim&&resolved.aim.distance>resolved.aim.range+.01)return{ok:false,message:`Target is outside ${resolved.aim.range.toFixed(1)}m range.`};
  rs(next,`player`,resolved,{attacker:actor.fighter,target:target.fighter,actorId:RIFT_V20_ALLY_ID,targetId:target.id,tone:`player`});
  next.v20Coop.actedTurn=next.turn;next.v20Coop.lastIntentId=intent.id;next.v20Coop.lastActionId=action.id;actor.intent=null;Vi(next);ls(next);
  G(next,`PLAYER 2 ACTION // ${actor.fighter.name} commits ${action.name}. Host authority records the result.`,`player`);context.commit(next);RIFT_V20_ANNOUNCE(`${actor.fighter.name} used ${action.name}`);
  return{ok:true,message:`${action.name} resolved against ${target.fighter.name}.`};
 }catch(error){RIFT_V17_DIAGNOSTIC(`coop-intent`,error,{intentId:intent?.id||null});return{ok:false,message:String(error?.message||error||`Command failed`).slice(0,220)}}
}
const RIFT_V20_COOP_BRIDGE=Object.freeze({version:20,snapshotExtras:RIFT_V20_SNAPSHOT_EXTRAS,applyIntent:RIFT_V20_APPLY_COOP_INTENT});
function RIFT_V20_SCHEDULE_ALLY_SYNC(run,commit){
 if(typeof commit!==`function`||globalThis.__RIFT_V20_ALLY_SYNC_PENDING__)return;const active=RIFT_V20_COOP_ACTIVE(),present=!!U(run,RIFT_V20_ALLY_ID);if(active===present||run.phase!==`combat`&&!present)return;
 globalThis.__RIFT_V20_ALLY_SYNC_PENDING__=true;(globalThis.setTimeout||setTimeout)(()=>{globalThis.__RIFT_V20_ALLY_SYNC_PENDING__=false;const coop=globalThis.RIFT_COOP,live=coop?.state?.run,ctx=coop?.state?.bridgeContext;if(!live||typeof ctx?.commit!==`function`)return;const next=P(live),should=RIFT_V20_COOP_ACTIVE(),has=!!U(next,RIFT_V20_ALLY_ID);if(should&&!has&&next.phase===`combat`)RIFT_V20_CREATE_ALLY(next);else if(!should&&has)RIFT_V20_REMOVE_ALLY(next);else return;ctx.commit(next)},0);
}
function RIFT_V20_COOP_EXPOSE(run,onAction,selectedActionId,busy,commit){
 const coop=globalThis.RIFT_COOP;if(!coop)return null;coop.registerGameBridge?.(RIFT_V20_COOP_BRIDGE);RIFT_V20_SCHEDULE_ALLY_SYNC(run,commit);return null;
}
const RIFT_V20_BASE_LS=ls;
ls=function RIFT_V20_PLAN_INTENTS(run){const out=RIFT_V20_BASE_LS(run),ally=U(run,RIFT_V20_ALLY_ID);if(ally)ally.intent=null;return out};
function RIFT_V20_LOAD_ACCESS(){
 if(typeof window===`undefined`)return{...RIFT_V20_ACCESS_DEFAULTS};let saved={};try{saved=JSON.parse(localStorage.getItem(RIFT_V20_ACCESS_KEY)||`{}`)||{}}catch{}
 return{...RIFT_V20_ACCESS_DEFAULTS,reducedMotion:saved.reducedMotion??globalThis.matchMedia?.(`(prefers-reduced-motion: reduce)`)?.matches??false,highContrast:saved.highContrast??globalThis.matchMedia?.(`(prefers-contrast: more)`)?.matches??false,...saved};
}
let RIFT_V20_ACCESS=RIFT_V20_LOAD_ACCESS();
function RIFT_V20_APPLY_ACCESSIBILITY(settings=RIFT_V20_ACCESS){
 RIFT_V20_ACCESS={...RIFT_V20_ACCESS_DEFAULTS,...settings};if(typeof document===`undefined`)return RIFT_V20_ACCESS;const root=document.documentElement;
 root.classList.toggle(`rift-reduced-motion`,!!RIFT_V20_ACCESS.reducedMotion);root.classList.toggle(`rift-high-contrast`,!!RIFT_V20_ACCESS.highContrast);root.classList.toggle(`rift-large-text`,!!RIFT_V20_ACCESS.largeText);
 root.classList.toggle(`rift-fx-low`,RIFT_V20_ACCESS.effects===`low`);root.classList.toggle(`rift-fx-medium`,RIFT_V20_ACCESS.effects===`medium`);root.dataset.riftEffects=RIFT_V20_ACCESS.effects;
 try{localStorage.setItem(RIFT_V20_ACCESS_KEY,JSON.stringify(RIFT_V20_ACCESS))}catch{}return RIFT_V20_ACCESS;
}
function RIFT_V20_SET_ACCESS(key,value){return RIFT_V20_APPLY_ACCESSIBILITY({...RIFT_V20_ACCESS,[key]:value})}
function RIFT_V20_ANNOUNCE(message){
 if(typeof document===`undefined`)return;let live=document.getElementById(`rift-v20-live`);if(!live){live=document.createElement(`div`);live.id=`rift-v20-live`;live.className=`sr-only`;live.setAttribute(`role`,`status`);live.setAttribute(`aria-live`,`polite`);document.body.appendChild(live)}live.textContent=``;setTimeout(()=>{live.textContent=String(message||``)},10);
}
function RIFT_V20_ACCESS_PANEL(){
 if(typeof document===`undefined`||document.getElementById(`rift-v20-access-root`))return;const root=document.createElement(`div`);root.id=`rift-v20-access-root`;root.innerHTML=`<button id="rift-v20-access-toggle" type="button" aria-expanded="false">ACCESS</button><section id="rift-v20-access-panel" hidden><header><span><small>V20 CONTROL CENTER</small><strong>ACCESSIBILITY & EFFECTS</strong></span><button type="button" data-close aria-label="Close">×</button></header><label><span>REDUCED MOTION<small>Stops nonessential animation and camera movement.</small></span><input type="checkbox" data-setting="reducedMotion"></label><label><span>HIGH CONTRAST<small>Adds borders, patterns, and non-color state cues.</small></span><input type="checkbox" data-setting="highContrast"></label><label><span>LARGE INTERFACE TEXT<small>Raises core UI type without changing layout scale.</small></span><input type="checkbox" data-setting="largeText"></label><label><span>EFFECT DENSITY<small>Auto responds to frame rate; Low is the safest setting.</small></span><select data-setting="effects"><option value="auto">AUTO</option><option value="high">HIGH</option><option value="medium">MEDIUM</option><option value="low">LOW</option></select></label><footer>Keyboard focus, text labels, and combat state cues remain active at every density.</footer></section>`;document.body.appendChild(root);
 const panel=root.querySelector(`section`),toggle=root.querySelector(`#rift-v20-access-toggle`),sync=()=>{root.querySelectorAll(`[data-setting]`).forEach(input=>{input.type===`checkbox`?input.checked=!!RIFT_V20_ACCESS[input.dataset.setting]:input.value=RIFT_V20_ACCESS[input.dataset.setting]})};
 toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute(`aria-expanded`,String(!panel.hidden));sync()};root.querySelector(`[data-close]`).onclick=()=>{panel.hidden=true;toggle.setAttribute(`aria-expanded`,`false`)};
 root.addEventListener(`change`,event=>{let input=event.target,key=input.dataset.setting;if(!key)return;RIFT_V20_SET_ACCESS(key,input.type===`checkbox`?input.checked:input.value);RIFT_V20_ANNOUNCE(`${key} ${input.type===`checkbox`?(input.checked?`enabled`:`disabled`):input.value}`)});sync();
}
function RIFT_V20_START_PERFORMANCE_GOVERNOR(){
 if(typeof window===`undefined`||!globalThis.requestAnimationFrame||globalThis.__RIFT_V20_PERF_RUNNING__)return;globalThis.__RIFT_V20_PERF_RUNNING__=true;let frames=0,start=performance.now(),lastDecision=0;
 const sample=now=>{frames+=1;if(now-start>=2400){let fps=frames*1000/(now-start);frames=0;start=now;if(RIFT_V20_ACCESS.effects===`auto`&&now-lastDecision>4000){lastDecision=now;document.documentElement.classList.toggle(`rift-fx-low`,fps<38);document.documentElement.classList.toggle(`rift-fx-medium`,fps>=38&&fps<52);document.documentElement.dataset.riftAutoFps=String(Math.round(fps))}}globalThis.requestAnimationFrame(sample)};globalThis.requestAnimationFrame(sample);
}
const RIFT_V20_BASE_NORMALIZE_RUN_BUILD=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function RIFT_V20_NORMALIZE_RUN_BUILD(run){
 run=RIFT_V20_BASE_NORMALIZE_RUN_BUILD(run);if(!run||typeof run!==`object`)return run;run.riftboundSchemaVersion=Math.max(20,Number(run.riftboundSchemaVersion||0));
 run.v20Coop=run.v20Coop&&typeof run.v20Coop===`object`?run.v20Coop:{active:false,protocolVersion:2,allyId:null,actedTurn:null};
 if(run.battlefield?.effectEchoes){const density=RIFT_V20_ACCESS.effects,limit=density===`low`?12:density===`medium`?24:48;run.battlefield.effectEchoes=RIFT_V17_ORDER_EFFECTS(run.battlefield.effectEchoes).slice(-limit)}
 return run;
};
globalThis.RIFTBOUND_V20={version:20,release:`V17–V20 Consolidation Arc`,coop:RIFT_V20_COOP_BRIDGE,accessibility:{get:()=>({...RIFT_V20_ACCESS}),set:RIFT_V20_SET_ACCESS,apply:RIFT_V20_APPLY_ACCESSIBILITY},effects:{priorities:RIFT_V17_EFFECT_PRIORITY,density:()=>RIFT_V20_ACCESS.effects}};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,schemaVersion:20,release:`V20 · Consolidation Arc`,coop:{protocolVersion:2,authority:`host`,partnerActor:RIFT_V20_ALLY_ID},accessibility:[`reducedMotion`,`highContrast`,`largeText`,`effectDensity`],effects:{prioritized:true,densities:[`auto`,`high`,`medium`,`low`]}};
if(globalThis.RIFTBOUND_DIAGNOSTICS)globalThis.RIFTBOUND_DIAGNOSTICS={...globalThis.RIFTBOUND_DIAGNOSTICS,version:20,release:()=>globalThis.RIFTBOUND_MANIFEST};
if(typeof window!==`undefined`){const boot=()=>{RIFT_V20_APPLY_ACCESSIBILITY();RIFT_V20_ACCESS_PANEL();RIFT_V20_START_PERFORMANCE_GOVERNOR()};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,boot,{once:true}):boot()}
