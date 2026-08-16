const RIFT_V34_MARKER=`Riftbound Battlefield VFX Grammar V34`;
const RIFT_V34_VERSION=34;
const RIFT_V34_QUEUE_LIMIT=28;
const RIFT_V34_MIN_FAMILIES=18;

const RIFT_V34_ICONIC_FAMILIES=Object.freeze({
 [`Limitless|Hollow Purple`]:`annihilation-corridor`,
 [`Ki Warrior|Kamehameha`]:`charged-beam`,
 [`Spiral Being|Giga Drill Break`]:`drill-lunge`,
 [`The World|Road Roller`]:`falling-crush`,
 [`Restless Gambler|Train Door`]:`closing-construct`,
 [`Restless Gambler|Chromatic Balls`]:`ricochet-chain`,
 [`Restless Gambler|Lucky Shot`]:`advancing-barrage`,
 [`Restless Gambler|Relentless Luck`]:`blink-impact`,
 [`Star Platinum|Ora Ora Ora`]:`advancing-barrage`,
 [`Star Platinum: The World|ORA ORA ORA`]:`advancing-barrage`,
 [`King Crimson|Time Erasure`]:`time-skip-route`,
 [`King Crimson|Epitaph`]:`future-script`,
 [`King Crimson Requiem|Epitaph`]:`future-script`,
 [`King Crimson Requiem|Master of Time`]:`rewind-field`,
 [`Gold Experience Requiem|Revert to Zero`]:`rewind-field`,
 [`Chronostasis|Stopped World`]:`time-stop-field`,
 [`The World|Za Warudo`]:`time-stop-field`,
 [`Star Platinum: The World|Za Warudo`]:`time-stop-field`,
 [`Shrine|Malevolent Shrine`]:`domain-takeover`,
 [`Cursed Child|Authentic Mutual Love`]:`domain-takeover`,
 [`Restless Gambler|Private Pure Love Train`]:`domain-takeover`,
 [`Soft & Wet|Go Beyond`]:`impossible-path`,
 [`Gold Experience|Scorpions`]:`pursuit-summon`,
 [`Gold Experience|Life Generation`]:`emergence-summon`,
});

function RIFT_V34_SLUG(value){return String(value||`fx`).toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`fx`}
function RIFT_V34_ICONIC_KEY(tactical){return`${tactical?.sourcePower||``}|${tactical?.moveName||``}`}
function collisionIsPursuit(tactical){return tactical?.collision===`pursuit`||/pursuit/.test(String(tactical?.id||``))}
function RIFT_V34_FAMILY(tactical){
 const iconic=RIFT_V34_ICONIC_FAMILIES[RIFT_V34_ICONIC_KEY(tactical)];if(iconic)return iconic;
 const id=String(tactical?.id||``),motion=String(tactical?.motion||``),trajectory=String(tactical?.trajectory||``),aftermath=String(tactical?.aftermath||``),input=String(tactical?.input||``),timing=String(tactical?.timing||``);
 if(/time-stop/.test(id)||motion===`time`&&aftermath===`time-state`)return`time-stop-field`;
 if(/rewind|revert/.test(id)||timing===`rewind`)return`rewind-field`;
 if(/future|foresight/.test(id)||timing===`foresight`)return`future-script`;
 if(aftermath===`persistent-domain`||timing===`domain`||motion===`domain`)return`domain-takeover`;
 if(trajectory===`falling`||motion===`fall`)return`falling-crush`;
 if(trajectory===`drill`||motion===`drill`)return`drill-lunge`;
 if(trajectory===`ricochet`||motion===`ricochet`)return`ricochet-chain`;
 if(trajectory===`impossible-projectile`)return`impossible-path`;
 if(motion===`barrage`||trajectory===`advance`)return`advancing-barrage`;
 if(trajectory===`dash`||motion===`dash`)return`dash-route`;
 if(trajectory===`teleport`||motion===`blink`)return aftermath===`shockwave`?`blink-impact`:`blink-route`;
 if(trajectory===`lunge`||motion===`rise`||motion===`strike`)return`body-strike`;
 if(trajectory===`beam`)return timing===`charge`?`charged-beam`:`beam-corridor`;
 if(trajectory===`construct`||aftermath===`wall`||aftermath===`solid-wall`||aftermath===`trap`||motion===`trap`)return`construct-trap`;
 if(trajectory===`summon-path`||aftermath===`summon`||motion===`summon`)return collisionIsPursuit(tactical)?`pursuit-summon`:`emergence-summon`;
 if(trajectory===`tether`||aftermath===`tether`||motion===`tether`)return`tether-link`;
 if(trajectory===`arc`||motion===`sweep`)return`sweep-arc`;
 if(trajectory===`wave`)return`wavefront`;
 if(trajectory===`cone`)return`cone-surge`;
 if(aftermath===`field`||motion===`field`)return`persistent-field`;
 if(aftermath===`shockwave`||tactical?.collision===`area`)return`area-shock`;
 if(trajectory===`projectile`)return`true-projectile`;
 if(input===`selector`||motion===`command`)return`command-glyph`;
 if(timing===`reaction`)return`reaction-shell`;
 return`impact-strike`;
}

const RIFT_V34_FAMILY_LAYERS=Object.freeze({
 [`annihilation-corridor`]:[`vacuum`,`outer-rail`,`erasure-core`,`debris-shear`],
 [`charged-beam`]:[`charge-orb`,`beam-shell`,`beam-core`,`muzzle-rings`],
 [`beam-corridor`]:[`beam-shell`,`beam-core`,`contact-flare`],
 [`drill-lunge`]:[`body-route`,`drill-cone`,`helical-rings`,`contact-burst`],
 [`advancing-barrage`]:[`body-route`,`afterimages`,`strike-cells`,`impact-wall`],
 [`dash-route`]:[`body-route`,`afterimages`,`cut-trail`],
 [`body-strike`]:[`body-route`,`contact-wedge`,`launch-column`],
 [`falling-crush`]:[`ground-shadow`,`falling-body`,`impact-ring`,`debris`],
 [`ricochet-chain`]:[`broken-route`,`bounce-nodes`,`travel-orb`],
 [`closing-construct`]:[`warning-threshold`,`left-panel`,`right-panel`,`slam-line`],
 [`construct-trap`]:[`warning-threshold`,`construct-body`,`collision-edge`],
 [`domain-takeover`]:[`arena-wash`,`boundary`,`rule-sigil`,`ambient-motifs`],
 [`time-stop-field`]:[`desaturation`,`clock-ring`,`clock-hand`,`frozen-echoes`],
 [`time-skip-route`]:[`missing-route`,`actor-ghosts`,`cut-frames`],
 [`future-script`]:[`timeline-grid`,`future-frames`,`prediction-thread`],
 [`rewind-field`]:[`reverse-rings`,`snapshot-ghosts`,`rewind-thread`],
 [`impossible-path`]:[`nonexistent-thread`,`phase-orb`,`causal-ripples`],
 [`pursuit-summon`]:[`emergence-ring`,`summon-silhouette`,`pursuit-thread`],
 [`emergence-summon`]:[`emergence-ring`,`summon-silhouette`,`spawn-flare`],
 [`tether-link`]:[`anchor-a`,`live-link`,`anchor-b`],
 [`sweep-arc`]:[`weapon-origin`,`arc-body`,`edge-flare`],
 [`wavefront`]:[`origin-flare`,`moving-front`,`wake`],
 [`cone-surge`]:[`origin-flare`,`cone-body`,`edge-lines`],
 [`persistent-field`]:[`field-body`,`boundary`,`ambient-cells`],
 [`area-shock`]:[`impact-core`,`shock-rings`,`debris`],
 [`blink-impact`]:[`origin-ghost`,`destination-ghost`,`slam-core`,`shock-rings`],
 [`blink-route`]:[`origin-ghost`,`missing-route`,`destination-ghost`],
 [`true-projectile`]:[`launch-flare`,`projectile-body`,`wake`,`impact-flare`],
 [`command-glyph`]:[`command-ring`,`glyph`,`pulse`],
 [`reaction-shell`]:[`shell`,`contact-spark`,`counter-line`],
 [`impact-strike`]:[`contact-core`,`directional-slash`,`impact-ring`],
});

function RIFT_V34_DESCRIPTOR_FROM_TACTICAL(tactical){
 if(!tactical?.explicit)return null;const family=RIFT_V34_FAMILY(tactical),layers=RIFT_V34_FAMILY_LAYERS[family]||RIFT_V34_FAMILY_LAYERS[`impact-strike`];
 return Object.freeze({version:34,key:tactical.key||RIFT_V34_ICONIC_KEY(tactical),sourcePower:tactical.sourcePower,moveName:tactical.moveName,tacticalType:tactical.id,family,layers:[...layers],trajectory:tactical.trajectory,timing:tactical.timing,collision:tactical.collision,aftermath:tactical.aftermath,motion:tactical.motion,legacyProjectileRenderer:false,mechanicsChanged:false,constitutionChanged:false});
}
function RIFT_V34_DESCRIPTOR(profileName,moveName){return RIFT_V34_DESCRIPTOR_FROM_TACTICAL(RIFT_V33_ACTION_INDEX.get(`${profileName}|${moveName}`)||null)}

const RIFT_V34_COVERAGE=[];
for(const profile of RIFT_V32_CATALOG.profiles)for(const move of profile.moves){const descriptor=RIFT_V34_DESCRIPTOR_FROM_TACTICAL(move.tactical);if(!descriptor)throw new Error(`V34 visual descriptor missing for ${profile.name} · ${move.name}`);move.battlefieldVfx=descriptor;RIFT_V34_COVERAGE.push(descriptor)}
const RIFT_V34_FAMILIES=[...new Set(RIFT_V34_COVERAGE.map(entry=>entry.family))].sort();
if(RIFT_V34_COVERAGE.length!==RIFT_V32_CATALOG.totals.moves)throw new Error(`V34 VFX coverage mismatch ${RIFT_V34_COVERAGE.length}/${RIFT_V32_CATALOG.totals.moves}`);
if(RIFT_V34_FAMILIES.length<RIFT_V34_MIN_FAMILIES)throw new Error(`V34 battlefield vocabulary collapsed: ${RIFT_V34_FAMILIES.length}/${RIFT_V34_MIN_FAMILIES}`);

function RIFT_V34_POINT(value,fallback={x:0,y:0}){return{x:Number(value?.x??fallback.x??0),y:Number(value?.y??fallback.y??0)}}
function RIFT_V34_ACTOR_ID(run,fighter){if(!run||!fighter)return null;if(fighter===run.player)return`player`;if(fighter===run.enemy)return`enemy`;try{return RIFT_ACTOR_ID_FOR_FIGHTER?.(run,fighter)||H(run).find(entry=>entry.fighter===fighter)?.id||null}catch{return null}}
function RIFT_V34_ACCENT(actor){return actor?.power?.accent||actor?.stand?.accent||actor?.accent||`#8de6ff`}
function RIFT_V34_DURATION(descriptor){if(descriptor.family===`domain-takeover`)return 2200;if([`time-stop-field`,`rewind-field`,`future-script`].includes(descriptor.family))return 1600;if([`falling-crush`,`drill-lunge`,`annihilation-corridor`].includes(descriptor.family))return 1250;return 900}
function RIFT_V34_PERSISTENCE(descriptor){return[`domain-takeover`,`persistent-field`,`construct-trap`,`closing-construct`,`tether-link`].includes(descriptor.family)?3:1}
function RIFT_V34_TARGET_POINT(run,targetId,action,end){try{return action?.aim?.target?RIFT_V34_POINT(action.aim.target):targetId?RIFT_V34_POINT(W(run,targetId),end):RIFT_V34_POINT(end)}catch{return RIFT_V34_POINT(end)}}
function RIFT_V34_PRUNE_LEGACY(run,tactical){if(!run?.battlefield?.effectEchoes)return;run.battlefield.effectEchoes=run.battlefield.effectEchoes.filter(effect=>!(String(effect?.className||``).includes(`v33-echo`)&&(!tactical?.id||effect.tacticalType===tactical.id)))}
function RIFT_V34_EMIT(run,actor,target,action,tactical,context={}){
 if(!run?.battlefield||!tactical?.explicit)return null;const descriptor=RIFT_V34_DESCRIPTOR_FROM_TACTICAL(tactical);if(!descriptor)return null;
 const actorId=context.actorId||RIFT_V34_ACTOR_ID(run,actor),targetId=context.targetId||RIFT_V34_ACTOR_ID(run,target),origin=RIFT_V34_POINT(context.origin||context.record?.origin||(()=>{try{return W(run,actorId)}catch{return{x:run.battlefield.width*.35,y:run.battlefield.height*.5}}})()),end=RIFT_V34_POINT(context.end||context.record?.end||origin),targetPoint=RIFT_V34_POINT(context.target||RIFT_V34_TARGET_POINT(run,targetId,action,end),end),dx=targetPoint.x-origin.x,dy=targetPoint.y-origin.y,distance=Math.max(.01,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx),accent=RIFT_V34_ACCENT(actor),radius=Math.max(2,Number(action?.aim?.radius||tactical?.coreGeometry?.radius||4.5)),createdTurn=Number(run.turn||0);
 const event={id:`v34-${F()}`,version:34,family:descriptor.family,tacticalType:tactical.id,sourcePower:tactical.sourcePower||actor?.power?.name||null,moveName:tactical.moveName||action?.name||action?.move?.name||`Technique`,actorId,targetId,origin,target:targetPoint,end,angle,distance,radius,accent,secondary:`#ffffff`,createdTurn,persistTurns:RIFT_V34_PERSISTENCE(descriptor),duration:RIFT_V34_DURATION(descriptor),layers:descriptor.layers,iconic:!!RIFT_V34_ICONIC_FAMILIES[RIFT_V34_ICONIC_KEY(tactical)]};
 run.battlefield.v34FxQueue=Array.isArray(run.battlefield.v34FxQueue)?run.battlefield.v34FxQueue:[];run.battlefield.v34FxQueue.push(event);if(run.battlefield.v34FxQueue.length>RIFT_V34_QUEUE_LIMIT)run.battlefield.v34FxQueue=run.battlefield.v34FxQueue.slice(-RIFT_V34_QUEUE_LIMIT);RIFT_V34_PRUNE_LEGACY(run,tactical);return event;
}

function RIFT_V34_LINE_STYLE(bf,event){const dx=event.target.x-event.origin.x,dy=event.target.y-event.origin.y,dist=Math.max(.01,Math.hypot(dx,dy)),angle=Math.atan2(dy,dx);return{left:`${event.origin.x/Math.max(1,bf.width)*100}%`,top:`${event.origin.y/Math.max(1,bf.height)*100}%`,width:`${dist/Math.max(1,bf.width)*100}%`,transform:`rotate(${angle}rad)`,"--v34-angle":`${angle}rad`,"--v34-distance":dist}}
function RIFT_V34_POINT_STYLE(bf,point,event){return{left:`${point.x/Math.max(1,bf.width)*100}%`,top:`${point.y/Math.max(1,bf.height)*100}%`,"--v34-radius":Math.max(2,event.radius||4),"--v34-angle":`${event.angle||0}rad`}}
function RIFT_V34_VARS(event){return{"--v34-fx":event.accent||`#8de6ff`,"--v34-fx2":event.secondary||`#fff`,"--v34-ms":`${event.duration||900}ms`}}
function RIFT_V34_REPEAT(className,count){return Array.from({length:count},(_,index)=>(0,E.jsx)(`i`,{className,style:{"--i":index}},`${className}-${index}`))}
function RIFT_V34_LINE_EVENT(event,bf,children,extra=``){return(0,E.jsx)(`div`,{className:`v34-fx v34-line-event family-${event.family} ${event.iconic?`iconic`:``} ${extra}`,style:{...RIFT_V34_LINE_STYLE(bf,event),...RIFT_V34_VARS(event)},children})}
function RIFT_V34_POINT_EVENT(event,bf,children,point=event.target,extra=``){return(0,E.jsx)(`div`,{className:`v34-fx v34-point-event family-${event.family} ${event.iconic?`iconic`:``} ${extra}`,style:{...RIFT_V34_POINT_STYLE(bf,point,event),...RIFT_V34_VARS(event)},children})}
function RIFT_V34_RENDER_EVENT(event,bf){
 const key=event.id,meta=(0,E.jsx)(`span`,{className:`v34-fx-label`,children:event.moveName});let node=null;
 switch(event.family){
  case`annihilation-corridor`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-vacuum`},`vacuum`),(0,E.jsx)(`i`,{className:`v34-beam-shell`},`shell`),(0,E.jsx)(`i`,{className:`v34-erasure-core`},`core`),...RIFT_V34_REPEAT(`v34-shear`,6),meta]);break;
  case`charged-beam`:node=(0,E.jsxs)(E.Fragment,{children:[RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-charge-orb`},`charge`),...RIFT_V34_REPEAT(`v34-charge-ring`,3)],event.origin),RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-beam-shell`},`shell`),(0,E.jsx)(`i`,{className:`v34-beam-core`},`core`),...RIFT_V34_REPEAT(`v34-beam-ripple`,4),meta])]});break;
  case`beam-corridor`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-beam-shell`},`shell`),(0,E.jsx)(`i`,{className:`v34-beam-core`},`core`),meta]);break;
  case`drill-lunge`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-body-route`},`route`),(0,E.jsx)(`i`,{className:`v34-drill-cone`},`drill`),...RIFT_V34_REPEAT(`v34-drill-ring`,7),meta]);break;
  case`advancing-barrage`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-body-route`},`route`),...RIFT_V34_REPEAT(`v34-afterimage`,5),...RIFT_V34_REPEAT(`v34-fist`,10),meta]);break;
  case`dash-route`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-body-route`},`route`),...RIFT_V34_REPEAT(`v34-afterimage`,5),...RIFT_V34_REPEAT(`v34-cut-mark`,5),meta]);break;
  case`body-strike`:node=(0,E.jsxs)(E.Fragment,{children:[RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-body-route`},`route`)]),RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-contact-wedge`},`contact`),(0,E.jsx)(`i`,{className:`v34-launch-column`},`launch`),meta])]});break;
  case`falling-crush`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-ground-shadow`},`shadow`),(0,E.jsx)(`i`,{className:`v34-falling-body`},`body`),(0,E.jsx)(`i`,{className:`v34-impact-ring`},`ring`),...RIFT_V34_REPEAT(`v34-debris`,8),meta]);break;
  case`ricochet-chain`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-ricochet-path`},`path`),...RIFT_V34_REPEAT(`v34-bounce-node`,4),(0,E.jsx)(`i`,{className:`v34-travel-orb`},`orb`),meta]);break;
  case`closing-construct`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-threshold`},`threshold`),(0,E.jsx)(`i`,{className:`v34-door-panel left`},`left`),(0,E.jsx)(`i`,{className:`v34-door-panel right`},`right`),(0,E.jsx)(`i`,{className:`v34-slam-line`},`slam`),meta]);break;
  case`construct-trap`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-threshold`},`threshold`),(0,E.jsx)(`i`,{className:`v34-construct-body`},`body`),(0,E.jsx)(`i`,{className:`v34-collision-edge`},`edge`),meta]);break;
  case`domain-takeover`:node=(0,E.jsxs)(`div`,{className:`v34-fx v34-field-event family-domain-takeover domain-${RIFT_V34_SLUG(event.sourcePower)} ${event.iconic?`iconic`:``}`,style:RIFT_V34_VARS(event),children:[(0,E.jsx)(`i`,{className:`v34-domain-wash`}),(0,E.jsx)(`i`,{className:`v34-domain-boundary`}),(0,E.jsx)(`i`,{className:`v34-domain-sigil`}),...RIFT_V34_REPEAT(`v34-domain-motif`,12),meta]});break;
  case`time-stop-field`:node=(0,E.jsxs)(`div`,{className:`v34-fx v34-field-event family-time-stop-field`,style:RIFT_V34_VARS(event),children:[(0,E.jsx)(`i`,{className:`v34-time-wash`}),(0,E.jsx)(`i`,{className:`v34-clock-ring`}),(0,E.jsx)(`i`,{className:`v34-clock-hand`}),...RIFT_V34_REPEAT(`v34-frozen-frame`,6),meta]});break;
  case`time-skip-route`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-missing-route`},`route`),...RIFT_V34_REPEAT(`v34-time-ghost`,6),...RIFT_V34_REPEAT(`v34-cut-frame`,5),meta]);break;
  case`future-script`:node=(0,E.jsxs)(`div`,{className:`v34-fx v34-field-event family-future-script`,style:RIFT_V34_VARS(event),children:[(0,E.jsx)(`i`,{className:`v34-future-grid`}),...RIFT_V34_REPEAT(`v34-future-frame`,5),(0,E.jsx)(`i`,{className:`v34-prediction-thread`}),meta]});break;
  case`rewind-field`:node=(0,E.jsxs)(`div`,{className:`v34-fx v34-field-event family-rewind-field`,style:RIFT_V34_VARS(event),children:[...RIFT_V34_REPEAT(`v34-rewind-ring`,4),...RIFT_V34_REPEAT(`v34-snapshot-ghost`,5),(0,E.jsx)(`i`,{className:`v34-rewind-thread`}),meta]});break;
  case`impossible-path`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-impossible-thread`},`thread`),...RIFT_V34_REPEAT(`v34-phase-knot`,5),(0,E.jsx)(`i`,{className:`v34-phase-orb`},`orb`),meta]);break;
  case`pursuit-summon`:node=(0,E.jsxs)(E.Fragment,{children:[RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-emergence-ring`}),(0,E.jsx)(`i`,{className:`v34-summon-silhouette`})],event.origin),RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-pursuit-thread`}),meta])]});break;
  case`emergence-summon`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-emergence-ring`}),(0,E.jsx)(`i`,{className:`v34-summon-silhouette`}),...RIFT_V34_REPEAT(`v34-spawn-flare`,4),meta]);break;
  case`tether-link`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-live-link`}),...RIFT_V34_REPEAT(`v34-link-pulse`,5),meta]);break;
  case`sweep-arc`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-sweep-arc`}),(0,E.jsx)(`i`,{className:`v34-edge-flare`}),meta],event.origin);break;
  case`wavefront`:node=RIFT_V34_POINT_EVENT(event,bf,[...RIFT_V34_REPEAT(`v34-wave-ring`,3),meta],event.origin);break;
  case`cone-surge`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-cone-body`}),...RIFT_V34_REPEAT(`v34-cone-edge`,2),meta],event.origin);break;
  case`persistent-field`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-field-body`}),(0,E.jsx)(`i`,{className:`v34-field-boundary`}),...RIFT_V34_REPEAT(`v34-field-cell`,8),meta]);break;
  case`area-shock`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-impact-core`}),...RIFT_V34_REPEAT(`v34-shock-ring`,3),...RIFT_V34_REPEAT(`v34-debris`,6),meta]);break;
  case`blink-impact`:node=(0,E.jsxs)(E.Fragment,{children:[RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-origin-ghost`})],event.origin),RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-destination-ghost`}),(0,E.jsx)(`i`,{className:`v34-impact-core`}),...RIFT_V34_REPEAT(`v34-shock-ring`,3),meta])]});break;
  case`blink-route`:node=(0,E.jsxs)(E.Fragment,{children:[RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-origin-ghost`})],event.origin),RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-missing-route`})]),RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-destination-ghost`}),meta])]});break;
  case`true-projectile`:node=RIFT_V34_LINE_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-projectile-wake`}),(0,E.jsx)(`i`,{className:`v34-projectile-body`}),(0,E.jsx)(`i`,{className:`v34-impact-flare`}),meta]);break;
  case`command-glyph`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-command-ring`}),(0,E.jsx)(`b`,{className:`v34-command-glyph`,children:`◇`}),meta],event.origin);break;
  case`reaction-shell`:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-reaction-shell`}),(0,E.jsx)(`i`,{className:`v34-contact-spark`}),meta],event.origin);break;
  default:node=RIFT_V34_POINT_EVENT(event,bf,[(0,E.jsx)(`i`,{className:`v34-impact-core`}),(0,E.jsx)(`i`,{className:`v34-directional-slash`}),...RIFT_V34_REPEAT(`v34-impact-ring`,2),meta]);
 }
 return(0,E.jsx)(E.Fragment,{children:node},key);
}
function RIFT_V34_BATTLEFIELD_FX({battlefield}){if(!battlefield)return null;const queue=(Array.isArray(battlefield.v34FxQueue)?battlefield.v34FxQueue:[]).slice(-10);if(!queue.length)return null;return(0,E.jsx)(`div`,{className:`v34-battlefield-fx`,"aria-hidden":`true`,children:queue.map(event=>RIFT_V34_RENDER_EVENT(event,battlefield))})}

const RIFT_V34_BASE_YT=Yt;
Yt=function RIFT_V34_ACTION_VISUAL(action,sourcePower,accent,targetProfile){const visual=RIFT_V34_BASE_YT(action,sourcePower,accent,targetProfile),tactical=RIFT_V33_FOR_ACTION(action,null,sourcePower),descriptor=RIFT_V34_DESCRIPTOR_FROM_TACTICAL(tactical);if(!descriptor)return visual;return{...visual,className:`${visual.className} v34-replaced family-${descriptor.family}`,battlefieldVfxFamily:descriptor.family,legacyProjectileRenderer:false}};

const RIFT_V34_BASE_RS=rs;
rs=function RIFT_V34_RESOLVE(run,side,action,ctx={}){
 const actor=ctx.attacker||(side===`player`?run?.player:run?.enemy),target=ctx.target||(side===`player`?run?.enemy:run?.player),actorId=ctx.actorId||RIFT_V34_ACTOR_ID(run,actor),targetId=ctx.targetId||RIFT_V34_ACTOR_ID(run,target),tactical=RIFT_V33_FOR_ACTION(action,actor),historyBefore=run?.v33Tactical?.history?.length||0,origin=actorId&&run?(()=>{try{return{...W(run,actorId)}}catch{return null}})():null;
 const result=RIFT_V34_BASE_RS(run,side,action,ctx);if(!run||run.timelineRestoredByKcr||!tactical?.explicit)return result;
 const history=run.v33Tactical?.history||[],record=history.length>historyBefore?history[history.length-1]:null;if(!record||record.move!==(action?.name||action?.move?.name||null))return result;
 const end=actorId?(()=>{try{return{...W(run,actorId)}}catch{return origin}})():origin,targetPoint=RIFT_V34_TARGET_POINT(run,targetId,action,end||origin);RIFT_V34_EMIT(run,actor,target,action,tactical,{actorId,targetId,origin:record.origin||origin,end:record.end||end,target:targetPoint,record});return result;
};

const RIFT_V34_BASE_NORMALIZE_RUN_BUILD=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function RIFT_V34_NORMALIZE_RUN(run){run=RIFT_V34_BASE_NORMALIZE_RUN_BUILD(run);if(!run||typeof run!==`object`)return run;run.riftboundSchemaVersion=Math.max(34,Number(run.riftboundSchemaVersion||0));if(run.battlefield){run.battlefield.v34FxQueue=Array.isArray(run.battlefield.v34FxQueue)?run.battlefield.v34FxQueue.slice(-RIFT_V34_QUEUE_LIMIT):[]}return run};
function RIFT_V34_REPORT(){return{version:34,moves:RIFT_V34_COVERAGE.length,visualized:RIFT_V34_COVERAGE.length,fallbacks:0,families:RIFT_V34_FAMILIES.length,familiesUsed:[...RIFT_V34_FAMILIES],iconicOverrides:Object.keys(RIFT_V34_ICONIC_FAMILIES).filter(key=>{const [profile,move]=key.split(`|`);return!!RIFT_V34_DESCRIPTOR(profile,move)}).length,legacyProjectileRenderer:false,reducedMotion:true,effectDensityAware:true}}

globalThis.RIFTBOUND_BATTLEFIELD_VFX={version:34,report:RIFT_V34_REPORT,descriptor:RIFT_V34_DESCRIPTOR,fromTactical:RIFT_V34_DESCRIPTOR_FROM_TACTICAL,family:RIFT_V34_FAMILY,emit:RIFT_V34_EMIT,families:Object.freeze([...RIFT_V34_FAMILIES])};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,schemaVersion:34,release:`V34 · Battlefield VFX Grammar`,battlefieldVfx:{version:34,moves:RIFT_V34_COVERAGE.length,visualized:RIFT_V34_COVERAGE.length,fallbacks:0,families:RIFT_V34_FAMILIES.length,minimumFamilies:RIFT_V34_MIN_FAMILIES,legacyProjectileRenderer:false,dedicatedOverlay:true,iconicOverrides:RIFT_V34_REPORT().iconicOverrides,reducedMotion:true,effectDensityAware:true}};
if(globalThis.RIFTBOUND_DIAGNOSTICS)globalThis.RIFTBOUND_DIAGNOSTICS={...globalThis.RIFTBOUND_DIAGNOSTICS,version:34,battlefieldVfx:RIFT_V34_REPORT};
