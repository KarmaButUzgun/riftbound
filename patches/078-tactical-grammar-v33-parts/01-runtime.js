const RIFT_V33_MARKER=`Riftbound Tactical Grammar V33`;
const RIFT_V33_VERSION=33;
const RIFT_V33_MIN_TYPES=64;
const RIFT_V33_HISTORY_LIMIT=96;

const RIFT_V33_CANON_OVERRIDES=Object.freeze({
 [`Limitless|Hollow Purple`]:{id:`annihilation-beam`,label:`ANNIHILATION BEAM`,input:`line`,timing:`committed`,trajectory:`beam`,collision:`pierce`,aftermath:`none`,counterplay:`leave line / causal defense`,motion:`beam`},
 [`Ki Warrior|Kamehameha`]:{id:`charge-beam`,label:`CHARGE BEAM`,input:`line`,timing:`charge`,trajectory:`beam`,collision:`pierce`,aftermath:`none`,counterplay:`break line / interrupt`,motion:`beam`},
 [`Soft & Wet|Go Beyond`]:{id:`causal-pursuit-projectile`,label:`CAUSAL PURSUIT PROJECTILE`,input:`target`,timing:`immediate`,trajectory:`impossible-projectile`,collision:`pierce`,aftermath:`none`,counterplay:`spatial tag / causality`,motion:`projectile`},
 [`Soft & Wet|Plunder`]:{id:`aspect-theft-projectile`,label:`ASPECT-THEFT BUBBLE`,input:`target`,timing:`immediate`,trajectory:`projectile`,collision:`first`,aftermath:`mark`,counterplay:`cover / dodge`,motion:`projectile`},
 [`The World|Road Roller`]:{id:`offmap-falling-crush`,label:`OFF-MAP FALLING CRUSH`,input:`point`,timing:`delayed`,trajectory:`falling`,collision:`area`,aftermath:`impact`,counterplay:`leave telegraph`,motion:`fall`},
 [`The World|Za Warudo`]:{id:`time-stop`,label:`TIME STOP`,input:`self`,timing:`timeline`,trajectory:`none`,collision:`none`,aftermath:`time-state`,counterplay:`causality / authored time response`,motion:`time`},
 [`Star Platinum: The World|Za Warudo`]:{id:`time-stop`,label:`TIME STOP`,input:`self`,timing:`timeline`,trajectory:`none`,collision:`none`,aftermath:`time-state`,counterplay:`causality / authored time response`,motion:`time`},
 [`King Crimson|Time Erasure`]:{id:`time-skip-route`,label:`ERASED ROUTE`,input:`point`,timing:`timeline`,trajectory:`skip`,collision:`none`,aftermath:`missing-time`,counterplay:`foresight / causality`,motion:`blink`,autoMove:true},
 [`King Crimson|Epitaph`]:{id:`future-script`,label:`FUTURE SCRIPT`,input:`timeline`,timing:`foresight`,trajectory:`none`,collision:`none`,aftermath:`future-lock`,counterplay:`causal override`,motion:`time`},
 [`King Crimson Requiem|Epitaph`]:{id:`future-script-five`,label:`FIVE-TURN FUTURE SCRIPT`,input:`timeline`,timing:`foresight`,trajectory:`none`,collision:`none`,aftermath:`future-lock`,counterplay:`causal override`,motion:`time`},
 [`King Crimson Requiem|Master of Time`]:{id:`timeline-rewind-selector`,label:`TIMELINE REWIND SELECTOR`,input:`history`,timing:`rewind`,trajectory:`none`,collision:`none`,aftermath:`state-restore`,counterplay:`Court / causal law`,motion:`rewind`},
 [`Gold Experience Requiem|Revert to Zero`]:{id:`causal-revert`,label:`CAUSAL REVERT`,input:`history`,timing:`rewind`,trajectory:`none`,collision:`none`,aftermath:`state-restore`,counterplay:`Court of the Crimson King`,motion:`rewind`},
 [`Gold Experience|Life Generation`]:{id:`environment-conversion-summon`,label:`ENVIRONMENT → LIFEFORM`,input:`point`,timing:`immediate`,trajectory:`none`,collision:`none`,aftermath:`summon`,counterplay:`destroy / reposition`,motion:`summon`},
 [`Gold Experience|Scorpions`]:{id:`marked-pursuit-summon`,label:`MARKED PURSUIT SUMMON`,input:`target`,timing:`immediate`,trajectory:`summon-path`,collision:`pursuit`,aftermath:`summon`,counterplay:`kill summons / break range`,motion:`summon`},
 [`Cursed Child|Mimicry`]:{id:`copy-arsenal-selector`,label:`COPY ARSENAL SELECTOR`,input:`selector`,timing:`menu`,trajectory:`none`,collision:`none`,aftermath:`copied-action`,counterplay:`Rika state / copied cooldown`,motion:`command`},
 [`Cursed Child|Authentic Mutual Love`]:{id:`domain-arsenal`,label:`DOMAIN + ROTATING ARSENAL`,input:`selector`,timing:`domain`,trajectory:`field`,collision:`rule-field`,aftermath:`persistent-domain`,counterplay:`barrier / escape / clash`,motion:`domain`},
 [`Shrine|Malevolent Shrine`]:{id:`domain-rulefield`,label:`DOMAIN RULEFIELD`,input:`self`,timing:`domain`,trajectory:`field`,collision:`rule-field`,aftermath:`persistent-domain`,counterplay:`escape / clash / barrier`,motion:`domain`},
 [`Star Platinum|Ora Ora Ora`]:{id:`advancing-barrage`,label:`ADVANCING BARRAGE`,input:`target`,timing:`sequence`,trajectory:`advance`,collision:`multi`,aftermath:`none`,counterplay:`distance / counter`,motion:`barrage`,autoMove:true},
 [`Star Platinum: The World|ORA ORA ORA`]:{id:`advancing-barrage`,label:`ADVANCING BARRAGE`,input:`target`,timing:`sequence`,trajectory:`advance`,collision:`multi`,aftermath:`none`,counterplay:`distance / counter`,motion:`barrage`,autoMove:true},
 [`Spiral Being|Giga Drill Break`]:{id:`committed-drill-lunge`,label:`COMMITTED DRILL LUNGE`,input:`line`,timing:`committed`,trajectory:`drill`,collision:`pierce`,aftermath:`none`,counterplay:`leave line / causal defense`,motion:`drill`,autoMove:true},
 [`One For All|Faux 100%`]:{id:`high-speed-dash-combo`,label:`HIGH-SPEED DASH COMBO`,input:`line`,timing:`sequence`,trajectory:`dash`,collision:`multi`,aftermath:`none`,counterplay:`read route / counter`,motion:`dash`,autoMove:true},
 [`Decay|Forceful Decay`]:{id:`equipment-disarm-projectile`,label:`EQUIPMENT DISARM PROJECTILE`,input:`equipment`,timing:`immediate`,trajectory:`projectile`,collision:`first`,aftermath:`equipment-lock`,counterplay:`dodge / cover`,motion:`projectile`},
 [`Chronostasis|Stopped World`]:{id:`extra-action-time-stop`,label:`EXTRA-ACTION TIME STOP`,input:`self`,timing:`timeline`,trajectory:`none`,collision:`none`,aftermath:`extra-action`,counterplay:`authored time response`,motion:`time`},
 [`Restless Gambler|Chromatic Balls`]:{id:`ricochet-projectile`,label:`RICOCHET PROJECTILE`,input:`line`,timing:`sequence`,trajectory:`ricochet`,collision:`multi`,aftermath:`none`,counterplay:`cover / lane choice`,motion:`ricochet`},
 [`Restless Gambler|Train Door`]:{id:`closing-construct-trap`,label:`CLOSING CONSTRUCT TRAP`,input:`point`,timing:`delayed`,trajectory:`construct`,collision:`threshold`,aftermath:`solid-wall`,counterplay:`leave threshold / break door`,motion:`trap`},
 [`Restless Gambler|Rough Blast`]:{id:`rising-launch-strike`,label:`RISING LAUNCH STRIKE`,input:`target`,timing:`immediate`,trajectory:`lunge`,collision:`single`,aftermath:`launch`,counterplay:`range / guard`,motion:`rise`,autoMove:true},
 [`Restless Gambler|Private Pure Love Train`]:{id:`gambling-domain`,label:`GAMBLING DOMAIN`,input:`self`,timing:`domain`,trajectory:`field`,collision:`rule-field`,aftermath:`persistent-domain`,counterplay:`burst / anti-heal / domain exit`,motion:`domain`},
 [`Restless Gambler|Lucky Shot`]:{id:`advancing-rough-barrage`,label:`ADVANCING ROUGH BARRAGE`,input:`target`,timing:`sequence`,trajectory:`advance`,collision:`multi`,aftermath:`bleed`,counterplay:`distance / counter`,motion:`barrage`,autoMove:true},
 [`Restless Gambler|Relentless Luck`]:{id:`blink-slam-shockwave`,label:`BLINK SLAM + SHOCKWAVE`,input:`target`,timing:`immediate`,trajectory:`teleport`,collision:`area`,aftermath:`shockwave`,counterplay:`spread / displacement`,motion:`blink`,autoMove:true},
 [`Restless Gambler|Fever Punch`]:{id:`committed-guardbreak-punch`,label:`COMMITTED GUARDBREAK PUNCH`,input:`target`,timing:`committed`,trajectory:`lunge`,collision:`single`,aftermath:`launch`,counterplay:`spacing / dodge`,motion:`strike`,autoMove:true},
});

function RIFT_V33_SLUG(value){return String(value||`type`).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`type`}
function RIFT_V33_HAS(tokens,token){return tokens.includes(token)}
function RIFT_V33_BASE_TYPE(pattern){
 const tokens=String(pattern||`self`).split(`-`).filter(Boolean),has=token=>RIFT_V33_HAS(tokens,token);
 let input=has(`rewind`)||has(`revert`)?`history`:has(`foresight`)||has(`outcome`)?`timeline`:has(`command`)||has(`copy`)?`selector`:has(`self`)||has(`guard`)||has(`transform`)||has(`domain`)?`self`:has(`wall`)||has(`area`)||has(`field`)||has(`falling`)||has(`trap`)||has(`line`)||has(`beam`)||has(`cone`)||has(`dash`)||has(`teleport`)||has(`path`)?`point`:`target`;
 let timing=has(`counter`)||has(`guard`)||has(`dodge`)?`reaction`:has(`delayed`)?`delayed`:has(`persistent`)||has(`field`)||has(`domain`)||has(`orbit`)?`persistent`:has(`charge`)?`charge`:has(`rewind`)||has(`revert`)?`rewind`:has(`foresight`)?`foresight`:has(`multi`)||has(`barrage`)||has(`combination`)?`sequence`:`immediate`;
 let trajectory=has(`teleport`)||has(`skip`)?`teleport`:has(`dash`)||has(`slide`)?`dash`:has(`falling`)?`falling`:has(`beam`)?`beam`:has(`drill`)?`drill`:has(`line`)?`line`:has(`projectile`)?`projectile`:has(`cone`)?`cone`:has(`arc`)||has(`sweep`)||has(`spin`)?`arc`:has(`tether`)?`tether`:has(`wall`)?`construct`:has(`summon`)?`summon-path`:has(`wave`)?`wave`:`none`;
 let collision=has(`global`)?`global`:has(`pierce`)||has(`drill`)?`pierce`:has(`multi`)||has(`barrage`)||has(`explosions`)||has(`crossfire`)?`multi`:has(`tether`)?`linked`:has(`wall`)?`solid`:has(`area`)||has(`slam`)||has(`burst`)||has(`field`)||has(`cone`)?`area`:has(`projectile`)?`first`:`single`;
 let aftermath=has(`domain`)?`persistent-domain`:has(`field`)?`field`:has(`wall`)?`wall`:has(`trap`)?`trap`:has(`summon`)?`summon`:has(`mark`)?`mark`:has(`tether`)?`tether`:has(`transform`)||has(`adapt`)?`state-change`:has(`stealth`)?`stealth`:has(`debuff`)||has(`curse`)||has(`lock`)?`status`:`none`;
 let counterplay=has(`global`)||has(`revert`)?`authored special counter`:has(`teleport`)?`destination denial`:has(`falling`)||has(`delayed`)?`leave telegraph`:has(`wall`)?`break / route around`:has(`tether`)?`break link / cleanse`:has(`projectile`)?`cover / dodge`:has(`beam`)||has(`line`)||has(`cone`)?`leave lane / cover`:has(`melee`)?`spacing / guard`:`normal defense`;
 let motion=has(`teleport`)||has(`skip`)?`blink`:has(`dash`)||has(`slide`)?`dash`:has(`falling`)?`fall`:has(`beam`)?`beam`:has(`drill`)?`drill`:has(`projectile`)?`projectile`:has(`barrage`)?`barrage`:has(`summon`)?`summon`:has(`domain`)?`domain`:has(`field`)?`field`:has(`tether`)?`tether`:has(`arc`)||has(`sweep`)||has(`spin`)?`sweep`:has(`wall`)||has(`trap`)?`trap`:`burst`;
 return{id:`pattern-${RIFT_V33_SLUG(pattern)}`,pattern,tokens,label:String(pattern||`self`).split(`-`).join(` `).toUpperCase(),input,timing,trajectory,collision,aftermath,counterplay,motion,autoMove:has(`dash`)||has(`slide`)||has(`teleport`)&&has(`strike`)};
}
function RIFT_V33_OVERRIDE(profileName,moveName){return RIFT_V33_CANON_OVERRIDES[`${profileName}|${moveName}`]||null}
function RIFT_V33_CONTRACT(profile,move){
 const preview=move?.preview||{},base=RIFT_V33_BASE_TYPE(preview.pattern||move?.spatial?.type||`self`),override=RIFT_V33_OVERRIDE(profile.name,move.name),merged={...base,...override};
 return Object.freeze({...merged,key:`${profile.name}|${move.slot}|${move.name}`,sourcePower:profile.name,moveName:move.name,slot:move.slot,previewPattern:preview.pattern||null,acquisition:preview.acquisition||``,resolution:preview.resolution||``,authoredAftermath:preview.aftermath||``,coreGeometry:{...(preview.geometry||move.geometry||{})},explicit:true,mechanicsChanged:true,constitutionChanged:false});
}

const RIFT_V33_ACTION_INDEX=new Map();
const RIFT_V33_UNIQUE_NAME_INDEX=new Map();
const RIFT_V33_TYPE_REGISTRY=new Map();
function RIFT_V33_INSTALL_CATALOG(catalog){
 if(!catalog?.profiles||!catalog?.moves)return catalog;
 RIFT_V33_ACTION_INDEX.clear();RIFT_V33_UNIQUE_NAME_INDEX.clear();RIFT_V33_TYPE_REGISTRY.clear();
 const duplicateNames=new Set();let typed=0;
 for(const profile of catalog.profiles){
  const used=[];
  for(const move of profile.moves){
   if(!move.preview?.explicit)throw new Error(`V33 requires explicit V31.1/V32 preview contract for ${profile.name} · ${move.name}`);
   const tactical=RIFT_V33_CONTRACT(profile,move);move.tactical=tactical;used.push(tactical.id);typed+=1;
   RIFT_V33_ACTION_INDEX.set(`${profile.name}|${move.name}`,tactical);
   if(RIFT_V33_UNIQUE_NAME_INDEX.has(move.name)){duplicateNames.add(move.name);RIFT_V33_UNIQUE_NAME_INDEX.delete(move.name)}else if(!duplicateNames.has(move.name))RIFT_V33_UNIQUE_NAME_INDEX.set(move.name,tactical);
   if(!RIFT_V33_TYPE_REGISTRY.has(tactical.id))RIFT_V33_TYPE_REGISTRY.set(tactical.id,{id:tactical.id,label:tactical.label,input:tactical.input,timing:tactical.timing,trajectory:tactical.trajectory,collision:tactical.collision,aftermath:tactical.aftermath,counterplay:tactical.counterplay,motion:tactical.motion,moves:0});
   RIFT_V33_TYPE_REGISTRY.get(tactical.id).moves+=1;
  }
  profile.tacticalTypes=[...new Set(used)];
 }
 if(typed!==catalog.totals.moves)throw new Error(`V33 tactical coverage mismatch ${typed}/${catalog.totals.moves}`);
 if(RIFT_V33_TYPE_REGISTRY.size<RIFT_V33_MIN_TYPES)throw new Error(`V33 tactical grammar too small: ${RIFT_V33_TYPE_REGISTRY.size}/${RIFT_V33_MIN_TYPES}`);
 catalog.tacticalGrammar={version:RIFT_V33_VERSION,explicit:typed,fallbacks:0,types:RIFT_V33_TYPE_REGISTRY.size,mechanicsChanged:true,constitutionChanged:false,source:`V31.1/V32 explicit authored move contracts + V33 canon mechanics layer`};
 return catalog;
}

RIFT_V33_INSTALL_CATALOG(RIFT_V32_CATALOG);
const RIFT_V33_BASE_BUILD_CATALOG=RIFT_V31_BUILD_CATALOG;
RIFT_V31_BUILD_CATALOG=function RIFT_V33_BUILD_CATALOG(...sources){return RIFT_V33_INSTALL_CATALOG(RIFT_V33_BASE_BUILD_CATALOG(...sources))};

function RIFT_V33_FALLBACK_PATTERN(action){
 const tags=action?.move?.tags||[],name=String(action?.name||action?.move?.name||``).toLowerCase(),tokens=[];
 const add=t=>{if(!tokens.includes(t))tokens.push(t)};
 if(tags.includes(`selfCast`)||action?.type===`guard`||action?.type===`rest`)add(`self`);
 if(tags.includes(`teleport`)||/teleport|blink|step/.test(name))add(`teleport`);
 if(tags.includes(`dashAttack`)||tags.includes(`dash`)||/dash|rush|blitz|lunge/.test(name))add(`dash`);
 if(tags.includes(`beam`)||/beam|ray|kamehameha|purple/.test(name))add(`beam`);
 else if(tags.includes(`projectile`)||/shot|bolt|ball|arrow/.test(name))add(`projectile`);
 if(tags.includes(`area`)||tags.includes(`aoe`)||/storm|domain|eruption/.test(name))add(`area`);
 if(tags.includes(`wall`))add(`wall`);if(tags.includes(`field`))add(`field`);if(tags.includes(`delayed`))add(`delayed`);if(tags.includes(`multi`)||(action?.move?.hits||1)>1)add(`multi`);if(tags.includes(`summon`))add(`summon`);if(tags.includes(`counter`))add(`counter`);if(tags.includes(`guardbreak`))add(`impact`);if(tags.includes(`melee`)||tags.includes(`physical`)&&!tokens.length)add(`melee`);if(!tokens.length)add(`target`);
 return tokens.join(`-`);
}
function RIFT_V33_FOR_ACTION(action,fighter=null,sourceHint=null){
 const source=sourceHint||action?.sourcePower||fighter?.activeSupplementalPower?.name||fighter?.power?.name||null,name=action?.name||action?.move?.name||null;
 if(source&&name&&RIFT_V33_ACTION_INDEX.has(`${source}|${name}`))return RIFT_V33_ACTION_INDEX.get(`${source}|${name}`);
 if(name&&RIFT_V33_UNIQUE_NAME_INDEX.has(name))return RIFT_V33_UNIQUE_NAME_INDEX.get(name);
 const base=RIFT_V33_BASE_TYPE(RIFT_V33_FALLBACK_PATTERN(action));return{...base,key:`runtime|${source||`unknown`}|${name||`action`}`,sourcePower:source,moveName:name,explicit:false,mechanicsChanged:true,constitutionChanged:false};
}

const RIFT_V33_BASE_TT=Tt;
Tt=function RIFT_V33_TARGET_PROFILE(action,fighter){
 const base=RIFT_V33_BASE_TT(action,fighter),tactical=RIFT_V33_FOR_ACTION(action,fighter),falling=tactical.trajectory===`falling`,teleport=tactical.trajectory===`teleport`,global=tactical.collision===`global`;
 return{...base,ignoresCover:falling||teleport||global?true:base.ignoresCover,tacticalType:tactical.id,tacticalLabel:tactical.label,inputMode:tactical.input,timing:tactical.timing,trajectory:tactical.trajectory,collisionModel:tactical.collision,aftermathModel:tactical.aftermath,counterplay:tactical.counterplay,label:`${tactical.label} · ${base.label}`};
};

function RIFT_V33_PATH(aim,tactical){
 if(!aim)return null;const origin={...aim.origin},target={...aim.target},mid={x:(origin.x+target.x)/2,y:(origin.y+target.y)/2};
 if(tactical.trajectory===`ricochet`)return{kind:`ricochet`,points:[origin,{x:mid.x,y:Math.max(3,mid.y-12)},target,{x:Math.min(117,target.x+10),y:Math.min(61,target.y+8)}],traversed:true};
 if(tactical.trajectory===`falling`)return{kind:`falling`,points:[{x:target.x,y:2},target],traversed:true};
 if(tactical.trajectory===`teleport`)return{kind:`teleport`,points:[origin,target],traversed:false};
 if(tactical.trajectory===`arc`)return{kind:`arc`,points:[origin,mid,target],traversed:true};
 if(tactical.trajectory===`tether`)return{kind:`tether`,points:[origin,target],traversed:true,persistent:true};
 if(tactical.trajectory===`none`)return{kind:`none`,points:[origin],traversed:false};
 return{kind:tactical.trajectory||`direct`,points:[origin,target],traversed:true};
}
const RIFT_V33_BASE_AT=At;
At=function RIFT_V33_AIM(battlefield,action,fighter,side,point,options){const aim=RIFT_V33_BASE_AT(battlefield,action,fighter,side,point,options),tactical=RIFT_V33_FOR_ACTION(action,fighter);return{...aim,tacticalType:tactical.id,tacticalLabel:tactical.label,inputMode:tactical.input,timing:tactical.timing,trajectory:tactical.trajectory,collisionModel:tactical.collision,aftermathModel:tactical.aftermath,mechanicPath:RIFT_V33_PATH(aim,tactical)}};

const RIFT_V33_BASE_YT=Yt;
Yt=function RIFT_V33_ACTION_VISUAL(action,sourcePower,accent,targetProfile){const visual=RIFT_V33_BASE_YT(action,sourcePower,accent,targetProfile),tactical=RIFT_V33_FOR_ACTION(action,null,sourcePower);return{...visual,className:`${visual.className} v33-tactical v33-type-${RIFT_V33_SLUG(tactical.id)}`,motion:tactical.motion||visual.motion,tacticalType:tactical.id,tacticalLabel:tactical.label}};

function RIFT_V33_EFFECT(run,tactical,origin,target,action){
 if(!run?.battlefield?.effectEchoes||!origin||!target)return;const persistent=[`field`,`wall`,`trap`,`tether`,`persistent-domain`,`mark`,`solid-wall`,`shockwave`,`launch`,`state-change`,`summon`].includes(tactical.aftermath),interesting=persistent||[`ricochet`,`falling`,`teleport`,`drill`,`arc`,`tether`,`summon-path`,`wave`,`advance`,`lunge`].includes(tactical.trajectory);if(!interesting)return;
 run.battlefield.effectEchoes.push({id:`v33-${F()}`,className:`v33-echo v33-type-${RIFT_V33_SLUG(tactical.id)}`,shape:tactical.trajectory===`beam`?`beam`:tactical.trajectory===`projectile`||tactical.trajectory===`ricochet`?`projectile`:tactical.trajectory===`drill`?`line`:tactical.trajectory===`teleport`?`teleport`:tactical.aftermath===`field`||tactical.aftermath===`persistent-domain`?`area`:`line`,motion:tactical.motion||`burst`,origin:{...origin},target:{...target},radius:Number(action?.aim?.radius||4.5),accent:`#8de6ff`,secondary:`#ffffff`,tertiary:`#0b1321`,glyph:`⌁`,name:tactical.label,turns:persistent?3:1,force:1.2,tacticalType:tactical.id});
 while(run.battlefield.effectEchoes.length>64)run.battlefield.effectEchoes.shift();
}
function RIFT_V33_SET_POSITION(run,actorId,destination){
 if(!run?.battlefield||!destination)return false;let point={x:M(Number(destination.x||0),2,run.battlefield.width-2),y:M(Number(destination.y||0),2,run.battlefield.height-2)};if(typeof Rt===`function`&&Rt(run.battlefield,point))return false;
 if(actorId===`player`)run.battlefield.player=point;else if(actorId===`enemy`)run.battlefield.enemy=point;else{const unit=run.battlefield.units?.find(unit=>unit.id===actorId);if(!unit)return false;unit.position=point}return true;
}
function RIFT_V33_AUTOMOVE(run,actorId,tactical,origin,aim){
 if(!tactical.autoMove||!aim?.target||!origin||!run?.battlefield)return false;let current=W(run,actorId);if(I(origin,current)>.75)return false;const target=aim.target,dx=target.x-origin.x,dy=target.y-origin.y,d=Math.max(.001,Math.hypot(dx,dy));let travel=d;
 if(tactical.trajectory===`teleport`)travel=Math.max(0,d-2.4);else if(tactical.collision===`pierce`)travel=Math.min(d+2.4,Number(aim.range||d+2.4));else if([`advance`,`lunge`,`dash`,`drill`].includes(tactical.trajectory))travel=Math.max(0,d-2.2);
 const dest={x:origin.x+dx/d*travel,y:origin.y+dy/d*travel};return RIFT_V33_SET_POSITION(run,actorId,dest);
}
function RIFT_V33_RECORD(run,actorId,targetId,action,tactical,before,after){
 if(!run)return;run.v33Tactical=run.v33Tactical&&typeof run.v33Tactical===`object`?run.v33Tactical:{version:RIFT_V33_VERSION,history:[]};run.v33Tactical.history=Array.isArray(run.v33Tactical.history)?run.v33Tactical.history:[];run.v33Tactical.history.push({turn:run.turn,actorId,targetId,sourcePower:tactical.sourcePower||action?.sourcePower||null,move:action?.name||action?.move?.name||null,type:tactical.id,input:tactical.input,timing:tactical.timing,trajectory:tactical.trajectory,collision:tactical.collision,aftermath:tactical.aftermath,origin:before?{...before}:null,end:after?{...after}:null});if(run.v33Tactical.history.length>RIFT_V33_HISTORY_LIMIT)run.v33Tactical.history=run.v33Tactical.history.slice(-RIFT_V33_HISTORY_LIMIT);
}
function RIFT_V33_RESOLVED(action,fighter,target,before){const last=fighter?.lastMove?.name||fighter?.lastMove?.move?.name||null,name=action?.name||action?.move?.name||null;if(last&&name&&last===name)return true;if(before&&target&&target.hp!==before.targetHp)return true;if(before&&fighter&&(fighter.energy!==before.energy||fighter.ultimate!==before.ultimate||fighter.hp!==before.actorHp))return true;return[`guard`,`rest`].includes(action?.type)}

const RIFT_V33_BASE_RS=rs;
rs=function RIFT_V33_RESOLVE(run,side,action,ctx={}){
 const actor=ctx.attacker||(side===`player`?run?.player:run?.enemy),target=ctx.target||(side===`player`?run?.enemy:run?.player),actorId=ctx.actorId||(actor===run?.player?`player`:actor===run?.enemy?`enemy`:RIFT_ACTOR_ID_FOR_FIGHTER?.(run,actor)),targetId=ctx.targetId||(target===run?.player?`player`:target===run?.enemy?`enemy`:RIFT_ACTOR_ID_FOR_FIGHTER?.(run,target)),tactical=RIFT_V33_FOR_ACTION(action,actor),origin=actorId&&run?{...W(run,actorId)}:null,before=actor?{energy:actor.energy,ultimate:actor.ultimate,actorHp:actor.hp,targetHp:target?.hp}:null;
 const result=RIFT_V33_BASE_RS(run,side,action,ctx);if(!run||run.timelineRestoredByKcr)return result;const liveActor=actorId?U(run,actorId)?.fighter||actor:actor,liveTarget=targetId?U(run,targetId)?.fighter||target:target;if(!RIFT_V33_RESOLVED(action,liveActor,liveTarget,before))return result;
 RIFT_V33_AUTOMOVE(run,actorId,tactical,origin,action?.aim);const end=actorId?{...W(run,actorId)}:origin,targetPoint=action?.aim?.target||(targetId&&run?W(run,targetId):end);RIFT_V33_EFFECT(run,tactical,origin||end,targetPoint||end,action);RIFT_V33_RECORD(run,actorId,targetId,action,tactical,origin,end);return result;
};

const RIFT_V33_BASE_NORMALIZE_RUN_BUILD=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function RIFT_V33_NORMALIZE_RUN(run){run=RIFT_V33_BASE_NORMALIZE_RUN_BUILD(run);if(!run||typeof run!==`object`)return run;run.riftboundSchemaVersion=Math.max(RIFT_V33_VERSION,Number(run.riftboundSchemaVersion||0));run.v33Tactical=run.v33Tactical&&typeof run.v33Tactical===`object`?run.v33Tactical:{version:RIFT_V33_VERSION,history:[]};run.v33Tactical.version=RIFT_V33_VERSION;run.v33Tactical.history=Array.isArray(run.v33Tactical.history)?run.v33Tactical.history.slice(-RIFT_V33_HISTORY_LIMIT):[];return run};

const RIFT_V33_REPORT=()=>({version:RIFT_V33_VERSION,profiles:RIFT_V32_CATALOG.totals.profiles,moves:RIFT_V32_CATALOG.totals.moves,typed:RIFT_V32_CATALOG.moves.filter(move=>move.tactical?.explicit).length,fallbacks:RIFT_V32_CATALOG.moves.filter(move=>!move.tactical?.explicit).length,types:RIFT_V33_TYPE_REGISTRY.size,typesUsed:[...RIFT_V33_TYPE_REGISTRY.values()].sort((a,b)=>b.moves-a.moves||a.label.localeCompare(b.label)),canonOverrides:Object.keys(RIFT_V33_CANON_OVERRIDES).filter(key=>{const [profile,name]=key.split(`|`);return RIFT_V33_ACTION_INDEX.has(`${profile}|${name}`)}).length,constitutionHash:RIFT_V32_EXPECTED_HASH,baseConstitutionHash:RIFT_V32_BASE_CONSTITUTION_HASH});

globalThis.RIFTBOUND_TACTICAL_GRAMMAR={version:RIFT_V33_VERSION,types:()=>[...RIFT_V33_TYPE_REGISTRY.values()].map(entry=>({...entry})),report:RIFT_V33_REPORT,forAction:RIFT_V33_FOR_ACTION,forMove:(profileName,moveName)=>RIFT_V33_ACTION_INDEX.get(`${profileName}|${moveName}`)||null,catalog:()=>RIFT_V32_CATALOG};
globalThis.RIFTBOUND_CODEX={...globalThis.RIFTBOUND_CODEX,version:33,release:`Tactical Grammar`,build:RIFT_V31_BUILD_CATALOG,catalog:()=>RIFT_V32_CATALOG,tacticalReport:RIFT_V33_REPORT};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,schemaVersion:33,release:`V33 · Tactical Grammar`,tacticalGrammar:{version:33,profiles:RIFT_V32_CATALOG.totals.profiles,moves:RIFT_V32_CATALOG.totals.moves,typed:RIFT_V32_CATALOG.moves.length,fallbacks:0,types:RIFT_V33_TYPE_REGISTRY.size,minimumTypes:RIFT_V33_MIN_TYPES,mechanicsChanged:true,constitutionChanged:false,combatMapIntegration:true,resolverIntegration:true,canonOverrides:RIFT_V33_REPORT().canonOverrides}};
