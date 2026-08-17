/* V36.6 · Takeover live deck: capture the victim's actual action surface, not just raw power.moves. */
function RIFT_V366_ULTIMATE_LIKE(action){
 const tags=action?.move?.tags||[];
 return action?.type===`ultimate`||Number(action?.slot)===8||Number(action?.moveIndex)===3||tags.includes(`ultimate`)||tags.includes(`allEnergy`);
}
function RIFT_V366_CAPTURE_BORROWED_ACTIONS(snapshot){
 let live=[];
 try{live=La(snapshot)||[]}catch{}
 const captured=[5,6,7].map((slot,index)=>{
  const action=live.find(row=>Number(row?.slot)===slot&&!RIFT_V366_ULTIMATE_LIKE(row));
  if(action?.move)return RIFT_V35_COPY(action);
  const move=RIFT_V35_COPY(snapshot?.power?.moves?.[index]);
  if(!move)return null;
  return{id:`v366-fallback-${index+1}`,slot,name:move.name,description:move.description||``,glyph:move.glyph||snapshot?.power?.glyph||`✦`,type:`special`,cost:Number(move.cost||0),move,moveIndex:index,sourcePower:snapshot?.power?.name||`Stolen Body`};
 }).filter(Boolean);
 return captured.length===3?captured:[];
}
function RIFT_V366_PROJECT_ACTION(state,index){
 const sourceAction=RIFT_V35_COPY(state?.borrowedActions?.[index]);if(!sourceAction?.move)return null;
 const source=sourceAction.sourcePower||state?.borrowedPower?.name||RIFT_V365_BORROWED_NAME(state)||`Stolen Body`;
 const move={...RIFT_V35_COPY(sourceAction.move),tags:[...new Set([...(sourceAction.move?.tags||[]),`v365TakeoverBorrowed`,`v366TakeoverLiveDeck`])]};
 return{...sourceAction,id:`v366-takeover-m${index+1}`,slot:5+index,name:sourceAction.name||move.name,description:`TAKEOVER · ${source} M${index+1} — ${sourceAction.description||move.description||``}`,glyph:sourceAction.glyph||move.glyph||`✦`,type:sourceAction.type===`ultimate`?`special`:(sourceAction.type||`special`),cost:Number(sourceAction.cost??move.cost??0),move,moveIndex:index,sourcePower:source,v365Borrowed:true,v366Borrowed:true};
}
function RIFT_V366_PROMOTE_FLOOR_CLEAR_RUN(run){
 const publish=()=>{
  const setter=globalThis.__RIFTBOUND_REACT_RUN_SETTER__;
  if(typeof setter!==`function`||!run?.player?.statuses?.v35Takeover)return false;
  const promoted=P(run);globalThis.__RIFTBOUND_ACTIVE_RUN__=promoted;setter(promoted);return true;
 };
 if(typeof queueMicrotask===`function`)queueMicrotask(publish);else Promise.resolve().then(publish);
}

const RIFT_V366_BASE_BEGIN_TAKEOVER=RIFT_V35_BEGIN_TAKEOVER;
RIFT_V35_BEGIN_TAKEOVER=function RIFT_V366_BEGIN_TAKEOVER(run,fighter,snapshot,position,source=`wraith`){
 const captured=RIFT_V366_CAPTURE_BORROWED_ACTIONS(snapshot),ok=RIFT_V366_BASE_BEGIN_TAKEOVER(run,fighter,snapshot,position,source);if(!ok)return false;
 const state=fighter?.statuses?.v35Takeover;if(state&&captured.length===3){
  state.borrowedActions=captured.map(action=>RIFT_V35_COPY(action));
  state.borrowedMoves=captured.map(action=>RIFT_V35_COPY(action.move));
  if(!state.borrowedPower?.name&&snapshot?.power)state.borrowedPower=RIFT_V365_SHELL_POWER(snapshot.power);
 }
 RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);
 if(String(source).includes(`floor-clear`))RIFT_V366_PROMOTE_FLOOR_CLEAR_RUN(run);
 return true;
};

/* Make captured live actions authoritative. This provider runs after the V36.5 raw-move fallback. */
RIFT_ACTIVE_LOADOUT_REGISTER(`v366-takeover-live-deck`,105,ctx=>{
 const fighter=ctx.fighter,state=fighter?.statuses?.v35Takeover;if(!state)return;RIFT_V365_ENFORCE_TAKEOVER_IDENTITY(fighter);
 if(!Array.isArray(state.borrowedActions)||state.borrowedActions.length<3){
  const rebuilt=(state.borrowedMoves||state.borrowedPower?.moves||[]).slice(0,3).map((move,index)=>move?{id:`v366-rebuilt-${index+1}`,slot:5+index,name:move.name,description:move.description||``,glyph:move.glyph||`✦`,type:`special`,cost:Number(move.cost||0),move:RIFT_V35_COPY(move),moveIndex:index,sourcePower:state.borrowedPower?.name||RIFT_V365_BORROWED_NAME(state)||`Stolen Body`}:null).filter(Boolean);
  if(rebuilt.length===3)state.borrowedActions=rebuilt;
 }
 for(let index=0;index<3;index++){const action=RIFT_V366_PROJECT_ACTION(state,index);if(action)ctx.replace(5+index,action)}
});

/* The public API was created in V35 before later hotfixes reassigned the local function binding. Keep it live. */
if(globalThis.RIFTBOUND_V35)globalThis.RIFTBOUND_V35={...globalThis.RIFTBOUND_V35,takeover:{...(globalThis.RIFTBOUND_V35.takeover||{}),begin:RIFT_V35_BEGIN_TAKEOVER},hotfix:{...globalThis.RIFTBOUND_V35.hotfix,liveDeckHotfix:`36.6`,takeoverLiveDeck:true,floorClearReactPublish:true}};
globalThis.RIFTBOUND_V36_6={version:`36.6`,takeoverLiveDeck:true,identityPower:RIFT_V35_RUINED,borrowedSlots:[5,6,7],heartbreakerSlot:8,capturesVictimActionSurface:true,floorClearReactPublish:true};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,v36:{...globalThis.RIFTBOUND_MANIFEST.v36,hotfix:`36.6`,takeoverIdentityStable:true,takeoverLiveDeck:true,takeoverBorrowedSlots:[5,6,7],heartbreakerSlot:8,capturesVictimActionSurface:true,floorClearReactPublish:true}};
