/* Riftbound V9 Combat Audit Hardening */
const RIFT_V9_COMBAT_AUDIT_VERSION=1;
if(!RIFT_ITEM_RARITIES.includes(`Mythical`))RIFT_ITEM_RARITIES.push(`Mythical`);
RIFT_ITEM_RARITY_COLOR.Mythical=RIFT_ITEM_RARITY_COLOR.Mythical||`#ff365f`;

const RIFT_V9_AUDIT_NORMALIZE_FIGHTER=RIFT_NORMALIZE_FIGHTER_BUILD;
RIFT_NORMALIZE_FIGHTER_BUILD=function RIFT_V9_AUDIT_NORMALIZE_FIGHTER_BUILD(fighter){const out=RIFT_V9_AUDIT_NORMALIZE_FIGHTER(fighter);if(!out?.inventory)return out;let seen=false,removed=0;out.inventory=out.inventory.map(instance=>{const item=instance?RIFT_ITEM(instance.itemId):null;if(item?.rarity!==`Mythical`)return instance;if(!seen){seen=true;return instance}removed+=1;return null});if(removed){out.statuses=out.statuses||{};out.statuses.v9DuplicateMythicalSanitized=(out.statuses.v9DuplicateMythicalSanitized||0)+removed;RIFT_SYNC_WEAPON(out);RIFT_REFRESH_ITEM_POOLS(out)}return out};

const RIFT_V9_AUDIT_RS_FAUX=rs;
rs=function RIFT_V9_AUDIT_RESOLVE_FAUX(run,side,action,ctx={}){const attacker=ctx.attacker||(side===`player`?run.player:run.enemy),actorId=ctx.actorId||RIFT_ACTOR_ID_FOR_FIGHTER(run,attacker)||side,tags=action?.move?.tags||[],actorEntry=U(run,actorId),target=ctx.target||(side===`player`?(U(run,run.activeTargetId)?.fighter||run.enemy):run.player);let fauxExtras=[],fauxOrigin=null,fauxDest=null;
if(tags.includes(`faux100Blitz`)&&action?.aim?.target){fauxOrigin={...W(run,actorId)};fauxDest={...action.aim.target};fauxExtras=H(run).filter(entry=>entry.id!==actorId&&entry.fighter!==target&&entry.fighter.hp>0&&(!actorEntry||entry.team!==actorEntry.team)&&dt(W(run,entry.id),fauxOrigin,fauxDest)<=O*2.25)}
const result=RIFT_V9_AUDIT_RS_FAUX(run,side,action,ctx);
if(tags.includes(`faux100Blitz`)&&fauxOrigin&&fauxDest){let total=0,hits=0;for(const entry of fauxExtras){if(entry.fighter.hp<=0)continue;const gap=Y(attacker,`as`)-Y(entry.fighter,`durability`),raw=Math.max(1,Math.round((18+Y(attacker,`as`)*4.6)*Math.pow(1.08,gap)*.72));total+=go(run,attacker,entry.fighter,raw,false,[`physical`,`faux100Blitz`,`speedblitz`,`noCounter`]);hits+=1}Vt(run,attacker,W(run,actorId),attacker===run.player?`player`:`enemy`);if(hits)G(run,`FAUX 100% · CROSSING HITS // The green-lightning route tears through ${hits} additional hostile${hits===1?``:`s`} for ${total} total damage before ${attacker.name} reaches the endpoint.`,`mythic`)}
return result};
