/* V9 integration hardening: progression gates, Pochita choice, open domains, Vessel, explosive flight, and borrowed-power metadata. */
const RIFT_V9_BASE_GN=Gn;
Gn=function RIFT_V9_VESSEL(fighter){return RIFT_V9_BASE_GN(fighter)||!!fighter?.statuses?.vesselExtra};

const RIFT_V9_BASE_LA_HARDENED=La;
La=function RIFT_V9_LA_HARDENED(fighter){let actions=RIFT_V9_BASE_LA_HARDENED(fighter);
if(fighter?.statuses?.pochitaChoicePending){actions.push({id:`v9-pochita-keep`,slot:92,name:`KEEP POCHITA`,description:`Accept the wounded Chainsaw Devil and begin his companion route.`,glyph:`心`,type:`special`,cost:0,move:{name:`Keep Pochita`,cost:0,power:0,destruction:0,tags:[`v9PochitaKeep`,`bonusAction`,`selfCast`]}});actions.push({id:`v9-pochita-go`,slot:93,name:`LET POCHITA GO`,description:`Decline the Chainsaw route with no penalty.`,glyph:`↗`,type:`special`,cost:0,move:{name:`Let Pochita Go`,cost:0,power:0,destruction:0,tags:[`v9PochitaGo`,`bonusAction`,`selfCast`]}})}
actions=actions.map(action=>{const source=action.sourcePower||action.powerName||action.boundPower;if(source&&fighter?.power?.name&&source!==fighter.power.name&&action.move){action={...action,move:{...action.move,tags:[...new Set([...(action.move.tags||[]),`borrowedPower`,`source:${source}`])]}}}if(fighter?.statuses?.vesselMythicDiscount&&action.move){const tags=action.move.tags||[],isTransform=tags.some(tag=>/transform|hybrid|horseman|ascension|inheritance/i.test(String(tag)));if(isTransform){const factor=1-fighter.statuses.vesselMythicDiscount;action={...action,cost:Math.max(0,Math.round((action.cost??action.move.cost??0)*factor)),move:{...action.move,cost:Math.max(0,Math.round((action.move.cost??action.cost??0)*factor))}}}}return action});
return actions};

const RIFT_V9_BASE_RS_HARDENED=rs;
rs=function RIFT_V9_RS_HARDENED(run,side,action,ctx={}){const attacker=ctx.attacker||(side===`player`?run.player:run.enemy),tags=action?.move?.tags||[];
if(tags.includes(`v9PochitaKeep`)){delete attacker.statuses.pochitaChoicePending;run.pochita.pendingChoice=0;run.pochita.accepted=1;run.pochita.rejected=0;ra(run,true);G(run,`POCHITA CHOICE // You keep him. The Chainsaw route is now voluntary and active.`,`mythic`);return}
if(tags.includes(`v9PochitaGo`)){delete attacker.statuses.pochitaChoicePending;run.pochita.pendingChoice=0;run.pochita.accepted=0;run.pochita.rejected=1;run.pochita.alive=false;G(run,`POCHITA CHOICE // You let him go. Nothing is lost, and the Chainsaw route will not intrude on this run.`,`system`);return}
return RIFT_V9_BASE_RS_HARDENED(run,side,action,ctx)};

const RIFT_V9_BASE_GA=ga;
ga=function RIFT_V9_POCHITA_HEART(run){const ok=RIFT_V9_BASE_GA(run);if(ok&&run.player?.devilHybrid?.blueprintId===`chainsaw`){run.player.devilHybrid.charge=run.player.devilHybrid.maxCharge;ya(run,run.player);G(run,`POCHITA CONTRACT REVIVAL // The restored heart starts its engine immediately. Revival begins in Chainsaw Hybrid Form.`,`mythic`)}return ok};

const RIFT_V9_BASE_ZO=zo;
zo=function RIFT_V9_OPEN_DOMAIN(run,fighter,actorId,kind){const domain=RIFT_V9_BASE_ZO(run,fighter,actorId,kind);if(domain&&fighter?.statuses?.openDomain&&RIFT_HAS_PASSIVE(fighter,`openDomain`)){domain.radius=Math.round(domain.radius*1.65);domain.openBarrier=true;domain.barrierless=true;domain.sealed=false;domain.name=`${domain.name} · OPEN BARRIER`;G(run,`OPEN DOMAIN // ${domain.name} spreads across ${domain.radius}m of battlefield. The sure-hit territory is larger, but there is no sealed wall preventing escape.`,`mythic`)}return domain};

const RIFT_V9_BASE_AI=Ai;
Ai=function RIFT_V9_MOVEMENT_SET(run,actorId,value){RIFT_V9_BASE_AI(run,actorId,value);const actor=U(run,actorId),fighter=actor?.fighter;if(!fighter||fighter.power?.name!==`Bomb Hybrid`)return;const doubled=RIFT_V9_BASE_MT(fighter),normal=Math.max(1,doubled/2);if(value>normal){if(!fighter.statuses.v9ExplosiveFlight)G(run,`EXPLOSIVE FLIGHT // ${fighter.name} crosses the normal MP threshold and begins flying on continuous blast propulsion.`,fighter===run.player?`player`:`enemy`);fighter.statuses.v9ExplosiveFlight=1;fighter.flight=true}else if(fighter.statuses.v9ExplosiveFlight){delete fighter.statuses.v9ExplosiveFlight;if(!fighter.devilHybrid?.transformed&&!fighter.statuses.permanentFlight)fighter.flight=false;G(run,`EXPLOSIVE FLIGHT ENDS // Movement has fallen back inside the normal MP reserve.`,fighter===run.player?`player`:`enemy`)}};

const RIFT_V9_BASE_TO_HARDENED=To;
To=function RIFT_V9_TO_HARDENED(run,attacker,target,tags,damage,action){RIFT_V9_BASE_TO_HARDENED(run,attacker,target,tags,damage,action);if(damage>0&&attacker?.power?.name===`Ki Warrior`){attacker.ultimate=Math.min(100,(attacker.ultimate||0)+3)}};

const RIFT_V9_BASE_SPARTAN_JUDGEMENT=typeof RIFT_SPARTAN_JUDGEMENT_CUT===`function`?RIFT_SPARTAN_JUDGEMENT_CUT:null;
if(RIFT_V9_BASE_SPARTAN_JUDGEMENT)RIFT_SPARTAN_JUDGEMENT_CUT=function RIFT_V9_SPARTAN_JUDGEMENT(...args){const run=args[0],fighter=args[1],state=RIFT_SPARTAN_STATE(fighter);if(state?.devTrigger?.kind===`vergil`)fighter.statuses.spardaCausalJudgement=1;const out=RIFT_V9_BASE_SPARTAN_JUDGEMENT(...args);delete fighter.statuses.spardaCausalJudgement;return out};
