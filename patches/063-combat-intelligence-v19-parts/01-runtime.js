const RIFT_V19_MARKER=`Riftbound Combat Intelligence V19`;
const RIFT_V19_VERSION=19;
function RIFT_V19_AI_PERSONALITY(fighter){
 const profile=RIFT_V18_POWER_PROFILE(fighter),name=String(fighter?.power?.name||fighter?.name||``),hash=[...name].reduce((sum,char)=>Math.imul(sum^char.charCodeAt(0),16777619),2166136261)>>>0;
 if(fighter?.aiBuildRole===`survival`||fighter?.tiers?.durability>=16)return{id:`sentinel`,name:`Sentinel`,description:`Protects low health, values Guard, and waits out hostile burst.`};
 if(profile.control>=2||fighter?.aiBuildRole===`control`)return{id:`architect`,name:`Architect`,description:`Prioritizes control, range, and setup before raw output.`};
 if(profile.expensive>42)return{id:`conserver`,name:`Conserver`,description:`Protects Energy until a high-impact conversion is available.`};
 return hash%3===0?{id:`duelist`,name:`Duelist`,description:`Alternates pressure and defense while punishing repeated actions.`}:hash%3===1?{id:`predator`,name:`Predator`,description:`Hunts wounded targets and converts openings into finishers.`}:{id:`storm`,name:`Storm`,description:`Builds tempo through varied, aggressive techniques.`};
}
function RIFT_V19_ACTION_SCORE(fighter,target,action,personality=RIFT_V19_AI_PERSONALITY(fighter)){
 const tags=action?.move?.tags||[],power=Number(action?.move?.power||0),destruction=Number(action?.move?.destruction||0),cost=Number(action?.cost||0),selfHp=fighter.hp/Math.max(1,fighter.maxHp),targetHp=target.hp/Math.max(1,target.maxHp);
 let score=power*26+destruction*4-cost*.18+(action.type===`strike`?5:0)+(action.type===`weapon`?7:0);
 if(action.type===`ultimate`)score+=fighter.ultimate>=100?34:-1000;
 if(tags.includes(`heal`)||tags.includes(`fullHeal`))score+=selfHp<.45?48:-18;
 if(action.type===`guard`||tags.includes(`shield`))score+=selfHp<.42?30:5;
 if(action.type===`rest`)score+=fighter.energy/Math.max(1,fighter.maxEnergy)<.28?28:-8;
 if(tags.some(tag=>[`stun`,`restrain`,`silence`,`force`,`guardbreak`,`antiRegen`].includes(tag)))score+=personality.id===`architect`?24:9;
 if(tags.some(tag=>[`accurate`,`crit`,`noReaction`,`trueDamage`].includes(tag)))score+=personality.id===`predator`?18:7;
 if(targetHp<.3)score+=power*18+(personality.id===`predator`?22:0);
 if(personality.id===`sentinel`)score+=(action.type===`guard`||tags.includes(`shield`)||tags.includes(`heal`))?22:-power*3;
 if(personality.id===`conserver`)score-=cost*.44;
 if(personality.id===`storm`&&fighter.lastActions?.[0]===action.type)score-=18;
 if(personality.id===`duelist`&&target.lastActions?.[0]===`special`&&(action.type===`guard`||tags.includes(`counter`)))score+=24;
 return Math.round(score*100)/100;
}
function RIFT_V19_SAFE_AI_ACTIONS(fighter,target){
 return La(fighter).filter(action=>{
  const tags=action.move?.tags||[];
  if(Va(fighter,action)>0||action.cost>fighter.energy&&fighter.trait?.name!==`Blood Price`)return false;
  if(action.type===`ultimate`&&fighter.ultimate<100)return false;
  if(tags.includes(`limitlessPurple`)&&(fighter.statuses.limitlessPurpleCharge||0)<100)return false;
  if(tags.includes(`shrineFurnace`)&&(fighter.statuses.furnaceCharge||0)<100&&!fighter.statuses.malevolentShrinePulses)return false;
  if(tags.includes(`spiralEvolve`)&&fighter.energy<=0)return false;
  if(tags.includes(`shrineTechnique`)&&fighter.statuses.mahoragaManifested>0)return false;
  return true;
 });
}
const RIFT_V19_BASE_IS=is;
is=function RIFT_V19_CHOOSE_ACTION(fighter,target){
 const base=RIFT_V19_BASE_IS(fighter,target);if(!fighter||!target||fighter.statuses?.calamityBoss||fighter.statuses?.rikaCompanion||fighter.statuses?.geScorpion||fighter.statuses?.kcrTimeLoopBarrierId)return base;
 const personality=RIFT_V19_AI_PERSONALITY(fighter),actions=RIFT_V19_SAFE_AI_ACTIONS(fighter,target);if(!actions.length)return base;
 const ranked=actions.map(action=>({action,score:RIFT_V19_ACTION_SCORE(fighter,target,action,personality)})).sort((a,b)=>b.score-a.score||String(a.action.id).localeCompare(String(b.action.id)));
 const baseRow=ranked.find(row=>row.action.id===base?.id),choice=ranked[0]?.score>(baseRow?.score??-1e9)+7||Math.random()<.68?ranked[0]?.action:base;
 fighter.v19AiPersonality=personality.id;fighter.v19LastDecision={turn:Number(fighter.statuses?.turnSerial||0),personality:personality.name,actionId:choice?.id||null,action:choice?.name||null,score:ranked.find(row=>row.action.id===choice?.id)?.score??null,alternatives:ranked.slice(0,3).map(row=>({actionId:row.action.id,name:row.action.name,score:row.score}))};
 return choice||base;
};
function RIFT_V19_ESTIMATE_ACTION(fighter,target,action){
 const scaling=RIFT_ACTION_SCALING(action,fighter),move=action?.move||{},asTier=Number(fighter?.tiers?.as||0),apTier=Number(fighter?.tiers?.ap||0),offense=scaling.mode===`AS`?asTier:scaling.mode===`AP`?apTier:scaling.mode===`Hybrid`?(asTier+apTier)/2:Math.max(asTier,apTier)*.7;
 const raw=Math.max(0,Math.round((13+offense*4.4)*Number(move.power||0)*Math.max(1,Math.min(4,Number(move.hits||1)*.58))));
 const mitigation=Math.max(0,Number(target?.tiers?.durability||0)*2.1),damage=Math.max(0,Math.round(raw-mitigation)),skill=Number(fighter?.tiers?.combatSkill||0)+Number(fighter?.tiers?.battleIq||0)*.45,evasion=Number(target?.tiers?.speed||0)*.65;
 const accuracy=Math.max(.35,Math.min(.98,.67+(skill-evasion)*.018+(move.tags?.includes(`accurate`)?0.12:0)+(move.tags?.includes(`guaranteedHit`)?1:0)));
 return{damage,raw,accuracy:Math.round(accuracy*100),scaling:scaling.mode,hits:Number(move.hits||1)};
}
function RIFT_V19_ACTION_PREVIEW(run,actionId){
 if(!run?.player)return null;const action=La(run.player).find(entry=>entry.id===actionId)||null,targetEntry=U(run,run.activeTargetId)||U(run,`enemy`),target=targetEntry?.fighter||run.enemy;
 if(!action||!target)return null;const geometry=Tt(action,run.player),from=W(run,`player`),to=W(run,targetEntry?.id||`enemy`),distance=I(from,to),estimate=RIFT_V19_ESTIMATE_ACTION(run.player,target,action),legality=RIFT_V17_ACTION_LEGALITY(run,`player`,action,target);
 return{actionId:action.id,name:action.name,targetId:targetEntry?.id||`enemy`,target:target.name,shape:geometry.shape,range:Math.round(geometry.range*10)/10,distance:Math.round(distance*10)/10,contact:!geometry.requiresAim||distance<=geometry.range,requiresAim:geometry.requiresAim,damage:estimate.damage,accuracy:estimate.accuracy,scaling:estimate.scaling,legal:legality.ok,reason:legality.reason};
}
function RIFT_V19_TIMELINE(run){
 if(!run)return[];const living=H(run).filter(entry=>entry.fighter?.hp>0),order=[U(run,`player`),...living.filter(entry=>entry.id!==`player`).sort((a,b)=>Number(b.fighter?.tiers?.speed||0)-Number(a.fighter?.tiers?.speed||0))].filter(Boolean);
 return order.map((entry,index)=>{const intent=entry.id===`player`?null:os(run,entry.id),personality=entry.id===`player`?null:RIFT_V19_AI_PERSONALITY(entry.fighter);return{id:entry.id,index,name:entry.fighter.name,team:entry.team===run.playerTeam?`ally`:`hostile`,hp:Math.max(0,entry.fighter.hp),intent:intent?.name||null,personality:personality?.name||null,active:index===0}});
}
function RIFT_V19_COMBAT_STRIP({run,selectedActionId,busy=false}){
 const timeline=RIFT_V19_TIMELINE(run),preview=selectedActionId?RIFT_V19_ACTION_PREVIEW(run,selectedActionId):null,budget=run?.v19EncounterBudget||RIFT_V18_ENCOUNTER_BUDGET(run);
 return(0,E.jsxs)(`section`,{className:`v19-combat-intel ${busy?`busy`:``}`,children:[
  (0,E.jsxs)(`div`,{className:`v19-turn-order`,children:[(0,E.jsx)(`small`,{children:`TURN ORDER`}),timeline.slice(0,6).map(entry=>(0,E.jsxs)(`span`,{className:`${entry.team} ${entry.active?`active`:``}`,title:entry.personality?`${entry.personality} AI · ${entry.intent||`Planning`}`:`Player command`,children:[(0,E.jsx)(`b`,{children:entry.id===`player`?`YOU`:String(entry.index).padStart(2,`0`)}),(0,E.jsx)(`em`,{children:entry.name.split(` · `)[0]}),entry.intent&&(0,E.jsx)(`small`,{children:entry.intent})]},entry.id))]}),
  preview?(0,E.jsxs)(`div`,{className:`v19-preview ${preview.contact?`contact`:`range-miss`} ${preview.legal?``:`illegal`}`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`LIVE PREVIEW`}),(0,E.jsx)(`strong`,{children:preview.name})]}),(0,E.jsxs)(`b`,{children:[preview.damage,` DMG`]}),(0,E.jsxs)(`b`,{children:[preview.accuracy,`% HIT`]}),(0,E.jsxs)(`b`,{children:[preview.distance,` / `,preview.range,`m`]}),(0,E.jsx)(`em`,{children:preview.legal?(preview.contact?`${preview.shape.toUpperCase()} CONTACT`:`MOVE OR AIM CLOSER`):preview.reason})]}):(0,E.jsxs)(`div`,{className:`v19-preview idle`,children:[(0,E.jsx)(`small`,{children:`LIVE PREVIEW`}),(0,E.jsx)(`strong`,{children:`SELECT AN ACTION`}),(0,E.jsx)(`em`,{children:`Damage, accuracy, range, and contact resolve here.`})]}),
  (0,E.jsxs)(`div`,{className:`v19-budget ${budget.band}`,title:`Encounter budget ${budget.spent}/${budget.capacity}`,children:[(0,E.jsx)(`small`,{children:`ENCOUNTER`}),(0,E.jsx)(`strong`,{children:budget.band===`over`?`DANGER`:budget.band===`under`?`MOMENTUM`:`BALANCED`}),(0,E.jsxs)(`span`,{children:[budget.spent,` / `,budget.capacity]})]})
 ]});
}
const RIFT_V19_BASE_APPLY_ROUTE=RIFT_V16_APPLY_ROUTE;
RIFT_V16_APPLY_ROUTE=function RIFT_V19_APPLY_ROUTE(run,...args){
 const out=RIFT_V19_BASE_APPLY_ROUTE(run,...args),budget=RIFT_V18_ENCOUNTER_BUDGET(run),director={...budget,compensation:`none`};
 if(budget.band===`over`&&run.player){const shield=Math.max(8,Math.round(run.player.maxHp*.06));run.player.shield=(run.player.shield||0)+shield;director.compensation=`player-shield-${shield}`;if(run.v16RouteState)run.v16RouteState.shardMult=Math.max(1,Number(run.v16RouteState.shardMult||1)+.12)}
 if(budget.band===`under`&&run.enemy){const shield=Math.max(6,Math.round(run.enemy.maxHp*.045));run.enemy.shield=(run.enemy.shield||0)+shield;director.compensation=`enemy-shield-${shield}`;if(run.v16RouteState)run.v16RouteState.shardMult=Math.max(1,Number(run.v16RouteState.shardMult||1)+.06)}
 run.v19EncounterBudget=director;for(const entry of H(run).filter(entry=>entry.id!==`player`)){entry.fighter.v19AiPersonality=RIFT_V19_AI_PERSONALITY(entry.fighter).id}
 return out;
};
const RIFT_V19_BASE_NORMALIZE_RUN_BUILD=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function RIFT_V19_NORMALIZE_RUN_BUILD(run){
 run=RIFT_V19_BASE_NORMALIZE_RUN_BUILD(run);if(!run||typeof run!==`object`)return run;
 run.riftboundSchemaVersion=Math.max(19,Number(run.riftboundSchemaVersion||0));run.v19EncounterBudget=run.v19EncounterBudget&&typeof run.v19EncounterBudget===`object`?run.v19EncounterBudget:RIFT_V18_ENCOUNTER_BUDGET(run);return run;
};
globalThis.RIFTBOUND_COMBAT_INTELLIGENCE={version:19,personality:RIFT_V19_AI_PERSONALITY,actionScore:RIFT_V19_ACTION_SCORE,preview:RIFT_V19_ACTION_PREVIEW,timeline:RIFT_V19_TIMELINE};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,schemaVersion:19,combatIntelligence:{personalities:[`Sentinel`,`Architect`,`Conserver`,`Duelist`,`Predator`,`Storm`],previewFields:[`damage`,`accuracy`,`range`,`contact`]}};
if(globalThis.RIFTBOUND_DIAGNOSTICS)globalThis.RIFTBOUND_DIAGNOSTICS={...globalThis.RIFTBOUND_DIAGNOSTICS,version:19,combat:()=>({personalities:6})};
