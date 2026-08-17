/* V36.5 · Takeover identity separation: Viego's power is always Ruined King. */
function RIFT_V365_SHELL_POWER(power){
 const copy=RIFT_V35_COPY(power||{}),moves=(copy?.moves||[]).slice(0,3).map(move=>RIFT_V35_COPY(move));
 return{...copy,moves};
}
function RIFT_V365_BORROWED_NAME(state){
 if(state?.borrowedPower?.name)return String(state.borrowedPower.name);
 const text=String(state?.borrowed||``),parts=text.split(`|`);return parts.length>1?parts[parts.length-1]:``;
}
function RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter){
 const state=fighter?.statuses?.v35Takeover;if(!state)return fighter;
 let borrowed=state.borrowedPower;
 if(!borrowed){
  const current=fighter?.power?.name&&fighter.power.name!==RIFT_V35_RUINED?fighter.power:null;
  const named=RIFT_V365_BORROWED_NAME(state),registry=named?g.find(power=>power?.name===named):null;
  borrowed=RIFT_V365_SHELL_POWER(current||registry||{});
  if(borrowed?.name)state.borrowedPower=borrowed;
 }
 if(!Array.isArray(state.borrowedMoves)||state.borrowedMoves.length<3){
  const source=(state.borrowedPower?.moves||borrowed?.moves||[]).slice(0,3);
  state.borrowedMoves=source.map(move=>RIFT_V35_COPY(move));
 }
 state.identityPower=RIFT_V35_RUINED;
 fighter.power=RIFT_V35_COPY(RIFT_V35_RUINED_POWER);
 fighter.statuses.v35OriginalPower=RIFT_V35_RUINED;
 return fighter;
}

/* V36 used to rewrite fighter.power into the stolen power and staple Heartbreaker onto M4.
   Keep the public helper name because normalization/save paths already call it, but make it an identity guard instead. */
RIFT_V36_ENFORCE_HEARTBREAKER=RIFT_V365_ENFORCE_TAKEOVER_IDENTITY;

/* Begin Takeover as a shell swap, never as a power-identity swap. */
RIFT_V35_BEGIN_TAKEOVER=function RIFT_V365_BEGIN_TAKEOVER(run,fighter,snapshot,position,source=`wraith`){
 if(!fighter||!snapshot||!RIFT_V35_IS(fighter,RIFT_V35_RUINED))return false;
 if(fighter.statuses?.v35Takeover)RIFT_V35_RESTORE_TAKEOVER(run,fighter,`The next soul overrides the previous body`);
 const originalStatuses=RIFT_V35_COPY(fighter.statuses||{});delete originalStatuses.v35Takeover;
 const original={power:RIFT_V35_COPY(RIFT_V35_RUINED_POWER),race:RIFT_V35_COPY(fighter.race),trait:RIFT_V35_COPY(fighter.trait),tiers:RIFT_V35_COPY(fighter.tiers),inventory:RIFT_V35_COPY(fighter.inventory),weapon:RIFT_V35_COPY(fighter.weapon),boons:RIFT_V35_COPY(fighter.boons),stand:RIFT_V35_COPY(fighter.stand),maxEnergy:fighter.maxEnergy,energy:fighter.energy,maxHp:fighter.maxHp,ultimate:fighter.ultimate,statuses:originalStatuses,pool:RIFT_V351_POOL_STATE(fighter)};
 oo(fighter,Math.max(1,Math.round(fighter.maxHp*.2)));
 const ratio=M(fighter.hp/Math.max(1,fighter.maxHp),.01,1),borrowedPower=RIFT_V365_SHELL_POWER(snapshot.power),borrowedMoves=(borrowedPower.moves||[]).slice(0,3).map(move=>RIFT_V35_COPY(move));
 fighter.power=RIFT_V35_COPY(RIFT_V35_RUINED_POWER);
 fighter.race=RIFT_V35_COPY(snapshot.race);fighter.trait=RIFT_V35_COPY(snapshot.trait);fighter.tiers=RIFT_V35_COPY(snapshot.tiers);fighter.inventory=RIFT_V35_COPY(snapshot.inventory||[]);fighter.weapon=RIFT_V35_COPY(snapshot.weapon);fighter.boons=RIFT_V35_COPY(snapshot.boons||[]);fighter.stand=RIFT_V35_COPY(snapshot.stand);
 fighter.maxEnergy=Number(snapshot.maxEnergy||fighter.maxEnergy);fighter.energy=Math.min(fighter.maxEnergy,Number(snapshot.energy||fighter.maxEnergy));fighter.maxHp=Math.max(1,Number(snapshot.maxHp||fighter.maxHp));
 fighter.statuses={...RIFT_V35_COPY(snapshot.statuses||{}),v35OriginalPower:RIFT_V35_RUINED,v35Takeover:{remaining:RIFT_V35_TAKEOVER_TURNS,borrowed:RIFT_V35_TARGET_KEY(snapshot),borrowedPower,borrowedMoves,identityPower:RIFT_V35_RUINED,original,source}};
 RIFT_V351_APPLY_POOL_STATE(fighter,RIFT_V351_POOL_STATE(snapshot));RIFT_NORMALIZE_FIGHTER_BUILD(fighter);RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);
 fighter.hp=Math.max(1,Math.round(fighter.maxHp*ratio));fighter.ultimate=original.ultimate;
 const id=RIFT_V35_ACTOR(run,fighter);if(id&&position)ki(run,id,Wi(run.battlefield,position,Ft(run,id).map(entry=>entry.position)));
 RIFT_V35_EFFECT(run,`takeover`,fighter,position||RIFT_V35_POINT(run,fighter),{radius:10,borrowed:snapshot.name,borrowedPower:borrowedPower.name});
 RIFT_V35_LOG(run,`SOVEREIGN'S DOMINATION // ${fighter.name} remains the Ruined King while wearing ${snapshot.name}'s shell for 5 turns. Stats, items, body state, and M1–M3 are borrowed; Heartbreaker is Viego's own free Ultimate and ends possession.`,fighter,`mythic`);
 return true;
};

const RIFT_V365_BASE_RESTORE_TAKEOVER=RIFT_V35_RESTORE_TAKEOVER;
RIFT_V35_RESTORE_TAKEOVER=function RIFT_V365_RESTORE_TAKEOVER(run,fighter,reason=`Takeover ends`){
 const restored=RIFT_V365_BASE_RESTORE_TAKEOVER(run,fighter,reason);if(!restored)return false;
 fighter.power=RIFT_V35_COPY(RIFT_V35_RUINED_POWER);fighter.statuses=fighter.statuses||{};fighter.statuses.v35OriginalPower=RIFT_V35_RUINED;
 try{RIFT_ACTIVE_LOADOUT_CLEAR(fighter,null,`viego-takeover`);RIFT_ACTIVE_LOADOUT_CLEAR(fighter,null,`v365-takeover`)}catch{}
 return true;
};

function RIFT_V365_TAKEOVER_ACTION(fighter,index){
 const state=fighter?.statuses?.v35Takeover,move=RIFT_V35_COPY(state?.borrowedMoves?.[index]||state?.borrowedPower?.moves?.[index]);if(!state||!move)return null;
 const source=state.borrowedPower?.name||RIFT_V365_BORROWED_NAME(state)||`Stolen Body`;
 return{id:`v365-takeover-m${index+1}`,slot:5+index,name:move.name,description:`TAKEOVER · ${source} M${index+1} — ${move.description||``}`,glyph:move.glyph||`✦`,type:`special`,cost:Number(move.cost||0),move:{...move,tags:[...new Set([...(move.tags||[]),`v365TakeoverBorrowed`])]},moveIndex:index,sourcePower:source,v365Borrowed:true};
}
RIFT_ACTIVE_LOADOUT_REGISTER(`v365-takeover`,95,ctx=>{
 const fighter=ctx.fighter;if(!fighter?.statuses?.v35Takeover)return;RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);
 for(let index=0;index<3;index++){const action=RIFT_V365_TAKEOVER_ACTION(fighter,index);if(action)ctx.replace(5+index,action)}
});

/* Legacy saves can enter with the stolen power still persisted. Repair identity before any base action/turn/resolver reads it. */
const RIFT_V365_BASE_LA=La;
La=function RIFT_V365_ACTIONS(fighter){RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);return RIFT_V365_BASE_LA(fighter)};
const RIFT_V365_BASE_QO=Qo;
Qo=function RIFT_V365_TURN_END(run,fighter){RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);return RIFT_V365_BASE_QO(run,fighter)};
const RIFT_V365_BASE_RS=rs;
rs=function RIFT_V365_RESOLVE(run,side,action,ctx={}){
 const fighter=ctx.attacker||(side===`player`?run?.player:side===`enemy`?run?.enemy:null);RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);
 const possessed=!!fighter?.statuses?.v35Takeover,tags=action?.move?.tags||[],heartbreaker=possessed&&(action?.name===`Heartbreaker`||tags.includes(`v35TakeoverExit`)||tags.includes(`v351FreeHeartbreaker`)||tags.includes(`v36TakeoverHeartbreaker`));
 const out=RIFT_V365_BASE_RS(run,side,action,ctx),live=side===`player`?run?.player:side===`enemy`?run?.enemy:fighter;
 if(heartbreaker&&live?.statuses?.v35Takeover)RIFT_V35_RESTORE_TAKEOVER(run,live,`Heartbreaker tears Viego out of the stolen body`);
 return out;
};

if(globalThis.RIFTBOUND_V35)globalThis.RIFTBOUND_V35={...globalThis.RIFTBOUND_V35,hotfix:{...globalThis.RIFTBOUND_V35.hotfix,identityHotfix:`36.5`,takeoverIdentityStable:true,borrowedMovesOverlay:true,borrowedPowerNeverOwnsFighter:true}};
globalThis.RIFTBOUND_V36_5={version:`36.5`,takeoverIdentityStable:true,identityPower:RIFT_V35_RUINED,borrowedSlots:[5,6,7],heartbreakerSlot:8,legacyTakeoverMigration:true};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,v36:{...globalThis.RIFTBOUND_MANIFEST.v36,hotfix:`36.5`,takeoverIdentityStable:true,takeoverIdentityPower:RIFT_V35_RUINED,takeoverBorrowedSlots:[5,6,7],heartbreakerSlot:8,legacyTakeoverMigration:true}};
