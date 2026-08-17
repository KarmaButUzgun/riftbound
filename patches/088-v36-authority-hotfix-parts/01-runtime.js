/* V36.4 · authoritative HP-pool normalization and Takeover lifecycle fixes */
const RIFT_V364_BASE_REFRESH_ITEM_POOLS=RIFT_REFRESH_ITEM_POOLS;
RIFT_REFRESH_ITEM_POOLS=function RIFT_V364_REFRESH_ITEM_POOLS(fighter){
 if(!fighter)return fighter;
 const oldMax=Number(fighter.maxHp),oldHp=Number(fighter.hp),wasAlive=oldHp>0;
 const missingHp=Number.isFinite(oldMax)&&Number.isFinite(oldHp)?Math.max(0,oldMax-oldHp):0;
 const out=RIFT_V364_BASE_REFRESH_ITEM_POOLS(fighter),target=out||fighter;
 /* V35 temporarily removes its prior Durability contribution before recalculating it. Preserve damage across that
    bookkeeping pass instead of letting the temporary lower maxHp permanently clamp current HP. */
 if(Number.isFinite(target.maxHp)&&Number.isFinite(oldMax)&&Number.isFinite(oldHp))target.hp=wasAlive?Math.max(0,Math.min(target.maxHp,target.maxHp-missingHp)):0;
 return target;
};

/* Owner-turn authority always has the real cloned run. Keep the legacy V35 tick pointed at that exact run, then
   provide a fallback if any later status wrapper failed to decrement or cash out the final Takeover turn. */
const RIFT_V364_BASE_TURN_END=Qo;
Qo=function RIFT_V364_TURN_END(run,fighter){
 if(run)globalThis.__RIFTBOUND_ACTIVE_RUN__=run;
 const before=Number(fighter?.statuses?.v35Takeover?.remaining||0),result=RIFT_V364_BASE_TURN_END(run,fighter),state=fighter?.statuses?.v35Takeover;
 if(state){
  const after=Number(state.remaining||0);
  if(before>0&&after>=before)state.remaining=before-1;
  if(Number(state.remaining||0)<=0)RIFT_V35_RESTORE_TAKEOVER(run,fighter,`Five stolen turns expire`);
 }
 return result;
};

function RIFT_V364_HEARTBREAKER_ACTION(action){
 const tags=action?.move?.tags||[];
 return action?.name===`Heartbreaker`||action?.id===`v363-heartbreaker-takeover`||tags.includes(`v35Heartbreaker`)||tags.includes(`v35TakeoverExit`)||tags.includes(`v351FreeHeartbreaker`)||tags.includes(`v36TakeoverHeartbreaker`)||tags.includes(`v363TakeoverExit`);
}

/* Resolve first, then inspect the authoritative body currently stored on the live run. This is deliberately not
   dependent on ctx.attacker surviving resolver cloning/replacement. */
const RIFT_V364_BASE_RS=rs;
rs=function RIFT_V364_RESOLVE(run,side,action,ctx={}){
 if(run)globalThis.__RIFTBOUND_ACTIVE_RUN__=run;
 const initial=ctx.attacker||(side===`player`?run?.player:side===`enemy`?run?.enemy:null);
 const mustExit=!!initial?.statuses?.v35Takeover&&RIFT_V364_HEARTBREAKER_ACTION(action);
 const result=RIFT_V364_BASE_RS(run,side,action,ctx);
 if(mustExit){
  const live=side===`player`?run?.player:side===`enemy`?run?.enemy:ctx.attacker||initial;
  if(live?.statuses?.v35Takeover)RIFT_V35_RESTORE_TAKEOVER(run,live,`Heartbreaker cashes out the stolen body`);
  if(initial!==live&&initial?.statuses?.v35Takeover)RIFT_V35_RESTORE_TAKEOVER(run,initial,`Heartbreaker cashes out the stolen body`);
 }
 return result;
};

if(globalThis.RIFTBOUND_V35)globalThis.RIFTBOUND_V35={...globalThis.RIFTBOUND_V35,hotfix:{...globalThis.RIFTBOUND_V35.hotfix,version:`36.4`,heartbreakerExitLiveBody:true,takeoverTurnAuthority:true,durabilityPoolIdempotent:true}};
globalThis.RIFTBOUND_V36_4={version:`36.4`,durabilityPoolIdempotent:true,freshRunStartsFull:true,debugFullHpStable:true,takeoverTurnAuthority:true,heartbreakerExitLiveBody:true,swoonVisible:true};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,v36:{...globalThis.RIFTBOUND_MANIFEST.v36,hotfix:`36.4`,durabilityPoolIdempotent:true,freshRunStartsFull:true,takeoverTurnAuthority:true,heartbreakerExitLiveBody:true,swoonVisible:true}};
