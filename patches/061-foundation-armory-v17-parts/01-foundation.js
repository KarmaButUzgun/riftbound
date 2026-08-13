const RIFT_V17_FOUNDATION_MARKER=`Riftbound Foundation Update V17`;
const RIFT_V17_VERSION=17;
const RIFT_V17_EFFECT_PRIORITY=Object.freeze({
 causality:1000,rewind:950,deathPrevention:900,invulnerability:850,counter:800,guard:700,shield:650,
 damage:500,status:400,forcedMovement:350,movement:300,healing:250,resource:200,presentation:100
});
function RIFT_V17_PRIORITY(kind){return RIFT_V17_EFFECT_PRIORITY[kind]??0}
function RIFT_V17_ORDER_EFFECTS(effects=[]){return effects.map((effect,index)=>({...effect,__order:index})).sort((a,b)=>RIFT_V17_PRIORITY(b.kind)-RIFT_V17_PRIORITY(a.kind)||a.__order-b.__order).map(({__order,...effect})=>effect)}
function RIFT_V17_ACTION_LEGALITY(run,actorId,action,target=null,{busy=false,locked=false}={}){
 const entry=run&&actorId?U(run,actorId):null,fighter=entry?.fighter,geometry=fighter&&action?Tt(action,fighter):null;
 if(!run||!entry||!fighter||!action)return{ok:false,reason:`Action context is unavailable.`,actorId,actionId:action?.id||null,geometry};
 if(fighter.hp<=0)return{ok:false,reason:`${fighter.name} cannot act while defeated.`,actorId,actionId:action.id,geometry};
 let reason=``;
 if(actorId===`player`)try{reason=qa(run,action,busy,locked,target||U(run,run.activeTargetId)?.fighter||run.enemy)||``}catch{}
 if(!reason&&busy)reason=`Combat is resolving`;
 if(!reason&&action.weaponSlotLocked)reason=`No weapon equipped`;
 if(!reason&&Va(fighter,action)>0)reason=`Cooldown · ${Va(fighter,action)} turn${Va(fighter,action)===1?``:`s`}`;
 if(!reason&&[`special`,`weapon`].includes(action.type)&&(action.cost||0)>fighter.energy&&fighter.trait?.name!==`Blood Price`)reason=`Need ${Math.max(0,(action.cost||0)-fighter.energy)} more Energy`;
 if(!reason&&action.type===`ultimate`&&(fighter.ultimate||0)<100)reason=`Ultimate · ${Math.round(fighter.ultimate||0)}% ready`;
 return{ok:!reason,reason:reason||``,actorId,actionId:action.id,geometry,cost:Number(action.cost||0),cooldown:Va(fighter,action),tags:[...(action.move?.tags||[])]};
}
const RIFT_V17_BASE_NORMALIZE_RUN_BUILD=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function RIFT_V17_NORMALIZE_RUN_BUILD(run){
 run=RIFT_V17_BASE_NORMALIZE_RUN_BUILD(run);if(!run||typeof run!==`object`)return run;
 run.riftboundSchemaVersion=Math.max(17,Number(run.riftboundSchemaVersion||0));
 run.v17Armory=run.v17Armory&&typeof run.v17Armory===`object`?run.v17Armory:{};
 run.v17Diagnostics=run.v17Diagnostics&&typeof run.v17Diagnostics===`object`?run.v17Diagnostics:{errors:[],lastMigration:17};
 run.v17Diagnostics.errors=Array.isArray(run.v17Diagnostics.errors)?run.v17Diagnostics.errors.slice(-20):[];
 run.v17Diagnostics.lastMigration=17;
 return run;
};
function RIFT_V17_POWER_ROW(power){
 const moves=(power?.moves||[]).map(move=>({name:move.name,cost:Number(move.cost||0),power:Number(move.power||0),destruction:Number(move.destruction||0),tags:[...(move.tags||[])]}));
 return{name:power?.name||`Unknown`,rarity:power?.rarity||`Unknown`,damageType:power?.damageType||`Special`,rollable:power?.rollable!==false,enemyRollable:power?.enemyRollable!==false,moves};
}
function RIFT_V17_MANIFEST(){
 const items=RIFT_ITEM_CATALOG.map(item=>({id:item.id,name:item.name,rarity:item.rarity,category:item.category,price:item.price,recipe:[...(item.recipe||[])],passiveId:item.passiveId||null,reference:item.reference||null}));
 const powers=g.map(RIFT_V17_POWER_ROW),routes=(typeof He!==`undefined`?He:[]).map(route=>({id:route.id,name:route.name,minFloor:route.minFloor||1,archetype:route.archetype||null})),arenas=(typeof Ge!==`undefined`?Ge:[]).map(arena=>({id:arena.id||arena.name,name:arena.name,theme:arena.theme||null}));
 return{schemaVersion:17,release:`V17–V20 Consolidation Arc`,counts:{items:items.length,powers:powers.length,routes:routes.length,arenas:arenas.length,legendary:items.filter(item=>item.rarity===`Legendary`).length,mythical:items.filter(item=>item.rarity===`Mythical`).length},effectPriority:{...RIFT_V17_EFFECT_PRIORITY},items,powers,routes,arenas};
}
function RIFT_V17_DIAGNOSTIC(kind,error,context={}){
 const row={kind:String(kind||`runtime`),message:String(error?.message||error||`Unknown error`).slice(0,500),context,at:Date.now()};
 const store=globalThis.__RIFTBOUND_DIAGNOSTIC_ERRORS__||(globalThis.__RIFTBOUND_DIAGNOSTIC_ERRORS__=[]);store.push(row);store.splice(0,Math.max(0,store.length-40));return row;
}
globalThis.RIFTBOUND_MANIFEST=RIFT_V17_MANIFEST();
globalThis.RIFTBOUND_DIAGNOSTICS={version:17,effectPriority:RIFT_V17_EFFECT_PRIORITY,legality:RIFT_V17_ACTION_LEGALITY,manifest:()=>RIFT_V17_MANIFEST(),errors:()=>[...(globalThis.__RIFTBOUND_DIAGNOSTIC_ERRORS__||[])]};
if(typeof window!==`undefined`&&!globalThis.__RIFT_V17_ERROR_WATCH__){
 globalThis.__RIFT_V17_ERROR_WATCH__=true;
 window.addEventListener(`error`,event=>RIFT_V17_DIAGNOSTIC(`error`,event.error||event.message,{source:event.filename||null,line:event.lineno||null}));
 window.addEventListener(`unhandledrejection`,event=>RIFT_V17_DIAGNOSTIC(`promise`,event.reason));
}
