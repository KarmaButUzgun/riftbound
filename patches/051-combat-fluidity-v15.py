from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle=root/'assets/page-F6OuavDb.js'
styles=root/'assets/riftbound.css'
text=bundle.read_text()
css=styles.read_text()

def replace_once(src, old, new, label):
    count=src.count(old)
    if count != 1:
        raise SystemExit(f'V15 patch anchor {label} expected once, found {count}')
    return src.replace(old,new,1)

runtime='''/* Riftbound Combat Fluidity Update V15 */
const RIFT_V15_BASE_GO=go,RIFT_V15_BASE_RS=rs,RIFT_V15_BASE_GT=Gt;
function RIFT_V15_ACTOR(run,fighter){if(!run||!fighter)return null;let found=H(run).find(x=>x.fighter===fighter);return found?.id||(fighter===run.player?`player`:fighter===run.enemy?`enemy`:null)}
function RIFT_V15_POSITION(run,id){if(!run?.battlefield||!id)return null;try{return{...W(run,id)}}catch{return null}}
function RIFT_V15_SHIELD_SUM(f){return Object.entries(f?.statuses||{}).reduce((sum,[k,v])=>/shield/i.test(k)&&typeof v===`number`?sum+Math.max(0,v):sum,0)}
function RIFT_V15_KIND(tags=[],amount=0,before={}){let t=tags||[];if(amount<=0){if(before.smart)return`countered`;if(before.translucent)return`refracted`;if(before.infinity)return`infinity`;if(before.shield>before.shieldAfter)return`shielded`;if(before.guard)return`guarded`;return`blocked`}if(t.includes(`causality`)||t.includes(`causal`)||t.includes(`absolute`))return`causal`;if(t.includes(`explosion`)||t.some(x=>/bomb|nuke|furnace/i.test(x)))return`explosion`;if(t.some(x=>/ice|frost|cryo/i.test(x)))return`frost`;if(t.some(x=>/fire|flame|burn/i.test(x)))return`flame`;if(t.some(x=>/shock|lightning|electro|thunder/i.test(x)))return`shock`;if(t.some(x=>/soul|spirit/i.test(x)))return`soul`;if(t.some(x=>/spatial|rift|gravity/i.test(x)))return`spatial`;if(t.some(x=>/slash|cut|blade|chainsaw/i.test(x)))return`cut`;if(t.includes(`magic`))return`magic`;return`physical`}
function RIFT_V15_RECORD_HIT(run,attacker,target,amount,tags,before){let bf=run?.battlefield;if(!bf||!target)return;let aid=RIFT_V15_ACTOR(run,attacker),tid=RIFT_V15_ACTOR(run,target),origin=RIFT_V15_POSITION(run,aid),at=RIFT_V15_POSITION(run,tid);if(!at)return;before.shieldAfter=RIFT_V15_SHIELD_SUM(target);let action=bf.v15FlowAction||{},actionId=action.id||`ambient-${run.turn||0}`,kind=RIFT_V15_KIND(tags,amount,before),heavy=!!(action.type===`ultimate`||(tags||[]).includes(`guardbreak`)||(tags||[]).includes(`heavy`)||(tags||[]).includes(`trueDamage`)||amount>=Math.max(18,(target.maxHp||100)*.16)),queue=Array.isArray(bf.v15FlowQueue)?bf.v15FlowQueue:[],existing=queue.find(x=>x.actionId===actionId&&x.targetId===tid&&x.kind===kind);if(existing){existing.hits+=1;existing.damage+=Math.max(0,amount);existing.heavy=existing.heavy||heavy;existing.id=F()}else queue.push({id:F(),actionId,attackerId:aid,targetId:tid,origin:origin||at,target:at,hits:1,damage:Math.max(0,amount),kind,heavy,tags:[...(tags||[])].slice(0,12),move:action.name||`Impact`});bf.v15FlowQueue=queue.slice(-6);bf.v15Flow=bf.v15FlowQueue[bf.v15FlowQueue.length-1]}
go=function RIFT_V15_GO(run,attacker,target,raw,magic,tags){let before={hp:target?.hp||0,guard:!!target?.guard,infinity:!!target?.statuses?.infinity,translucent:!!target?.statuses?.v14Translucent,smart:!!target?.statuses?.v14SmartCounter,shield:RIFT_V15_SHIELD_SUM(target)};let out=RIFT_V15_BASE_GO(run,attacker,target,raw,magic,tags);RIFT_V15_RECORD_HIT(run,attacker,target,Number(out)||0,tags||[],before);return out};
rs=function RIFT_V15_RS(run,side,action,ctx={}){if(!run?.battlefield)return RIFT_V15_BASE_RS(run,side,action,ctx);let attacker=ctx.attacker||(side===`player`?run.player:run.enemy),target=ctx.target||(side===`player`?run.enemy:run.player),aid=ctx.actorId||RIFT_V15_ACTOR(run,attacker),tid=ctx.targetId||RIFT_V15_ACTOR(run,target),origin=RIFT_V15_POSITION(run,aid),at=RIFT_V15_POSITION(run,tid),flow={id:F(),side,actorId:aid,targetId:tid,name:action?.name||`Action`,type:action?.type||`special`,tags:[...(action?.move?.tags||[])],origin,target:at,turn:run.turn};run.battlefield.v15FlowAction=flow;run.battlefield.v15FlowQueue=[];let out=RIFT_V15_BASE_RS(run,side,action,ctx),queue=run.battlefield.v15FlowQueue||[];if(!queue.length&&origin){let tags=flow.tags,kind=tags.some(x=>/teleport|dash|blackwhip|airJump|move/i.test(x))?`mobility`:action?.type===`guard`?`guarded`:action?.type===`rest`?`rest`:`technique`;queue.push({id:F(),actionId:flow.id,attackerId:aid,targetId:tid,origin,target:at||origin,hits:0,damage:0,kind,heavy:action?.type===`ultimate`,tags,move:flow.name})}run.battlefield.v15FlowQueue=queue.slice(-6);run.battlefield.v15Flow=queue.length?queue.reduce((best,x)=>!best||x.damage>best.damage||x.hits>best.hits?x:best,null):null;return out};
Gt=function RIFT_V15_GT(run,actorId,destination,silent=false){let from=run?.battlefield?RIFT_V15_POSITION(run,actorId):null,actor=run?U(run,actorId)?.fighter:null,out=RIFT_V15_BASE_GT(run,actorId,destination,silent);if(out?.moved&&run?.battlefield&&from){let to=RIFT_V15_POSITION(run,actorId)||out.destination,speed=M(Y(actor,`speed`),0,32);run.battlefield.v15Motion={id:F(),actorId,from,to,distance:Number(out.traveledDistance||I(from,to)||0),speed,duration:M(560-speed*15,120,520),turn:run.turn}}return out};
function RIFT_V15_STATUS_CLASSES(f){let s=f?.statuses||{},out=[];(s.v13Burn>0||s.burn>0)&&out.push(`burning`);(s.v13Chill>0||s.chill>0||s.frozen>0)&&out.push(`chilled`);(s.antiHeal>0||s.v14Spores>0||s.bloodspore>0)&&out.push(`spored`);(s.static>0||s.jammed>0||s.shock>0||s.electricHalfMp>0)&&out.push(`shocked`);(s.stun>0||s.v14Cripple>0||s.crippled>0)&&out.push(`staggered`);s.restrained>0&&out.push(`restrained`);s.blind>0&&out.push(`blinded`);s.infinity&&out.push(`infinity-live`);s.v13SimpleDomainId&&out.push(`simple-domain-live`);s.v14FInertia&&out.push(`inertia-live`);s.v14Translucent&&out.push(`crystal-live`);s.decayWound>0&&out.push(`decaying`);return out}
function RIFT_V15_STATUS_AURA({fighter}){let classes=RIFT_V15_STATUS_CLASSES(fighter);if(!classes.length)return null;return(0,E.jsxs)(`div`,{className:`v15-status-aura ${classes.join(` `)}`,'aria-hidden':`true`,children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{})]})}
function RIFT_V15_AUDIO_CUE(flow){if(!flow)return null;if([`blocked`,`guarded`,`shielded`,`countered`,`refracted`,`infinity`].includes(flow.kind))return`blocked`;if(flow.kind===`mobility`)return`move`;return flow.damage>0?`impact`:null}
function RIFT_V15_CANVAS_CLASS(bf){let f=bf?.v15Flow;if(!f)return``;return`v15-flow-active v15-kind-${f.kind} ${f.heavy?`v15-camera-heavy`:`v15-camera-hit`}`}
function RIFT_V15_FLOW_STYLE(bf,pos){return pos?{left:`${pos.x/Math.max(1,bf.width)*100}%`,top:`${pos.y/Math.max(1,bf.height)*100}%`}:{}}
function RIFT_V15_LINE_STYLE(bf,a,b){if(!a||!b)return{};let dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),ang=Math.atan2(dy,dx);return{left:`${a.x/bf.width*100}%`,top:`${a.y/bf.height*100}%`,width:`${dist/bf.width*100}%`,transform:`rotate(${ang}rad)`}}
function RIFT_V15_FLOW_LAYER({battlefield:bf}){if(!bf)return null;let q=Array.isArray(bf.v15FlowQueue)?bf.v15FlowQueue:[],motion=bf.v15Motion;return(0,E.jsxs)(E.Fragment,{children:[motion&&(0,E.jsxs)(`div`,{key:motion.id,className:`v15-motion-trail speed-${Math.min(5,Math.floor((motion.speed||0)/5))}`,style:{...RIFT_V15_LINE_STYLE(bf,motion.from,motion.to),'--v15-motion-ms':`${motion.duration||320}ms`},children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{})]}),q.map(ev=>(0,E.jsxs)(`div`,{key:ev.id,className:`v15-impact-cue kind-${ev.kind} ${ev.heavy?`heavy`:``}`,style:{...RIFT_V15_FLOW_STYLE(bf,ev.target),'--v15-angle':`${Math.atan2((ev.target?.y||0)-(ev.origin?.y||0),(ev.target?.x||0)-(ev.origin?.x||0))}rad`},children:[(0,E.jsx)(`i`,{className:`v15-impact-core`}),(0,E.jsx)(`i`,{className:`v15-impact-ring one`}),(0,E.jsx)(`i`,{className:`v15-impact-ring two`}),(0,E.jsx)(`i`,{className:`v15-impact-direction`}),(0,E.jsxs)(`strong`,{children:[ev.hits>1?`${ev.hits} HITS · `:``,ev.damage>0?`${Math.round(ev.damage)} DAMAGE`:ev.kind===`countered`?`COUNTERED`:ev.kind===`refracted`?`REFRACTED`:ev.kind===`infinity`?`INFINITY`:ev.kind===`shielded`?`SHIELDED`:ev.kind===`guarded`?`GUARDED`:ev.kind===`mobility`?`MOTION`:ev.kind===`rest`?`RESET`:`BLOCKED`]}),ev.move&&(0,E.jsx)(`small`,{children:ev.move})]}))]})}
'''
anchor='/* Riftbound V14.2 save-load null-run hotfix */\nexport{xs as default}'
text=replace_once(text,anchor,runtime+'\n\n'+anchor,'runtime insertion')
text=replace_once(text,'ee=(e,t,n)=>{let r=M(Y(t,`speed`),0,32),i=p?.actorId===e&&p.motion===`dash`,a=i?p.className.includes(`chainsaw-blitz`)?55:110:M(720-r*21,190,720);return{style:{...b(n),"--move-duration":`${a}ms`,"--move-distance":1,"--move-tempo":M(r/20,.2,1.6)},moving:i}}','ee=(actor,t,n)=>{let r=M(Y(t,`speed`),0,32),fxDash=p?.actorId===actor&&p.motion===`dash`,flowMove=e.v15Motion?.actorId===actor,i=fxDash||flowMove,a=fxDash?p.className.includes(`chainsaw-blitz`)?55:110:flowMove?M(560-r*15,120,520):M(720-r*21,190,720);return{style:{...b(n),"--move-duration":`${a}ms`,"--move-distance":flowMove?Math.max(1,e.v15Motion?.distance||1):1,"--move-tempo":M(r/16,.25,2.2)},moving:i}}','movement helper')
text=replace_once(text,'className:`tactical-map-canvas map-theme-${e.theme} ${c?`mini`:`full`} mode-${l} ${o?`map-time-${o.mode}`:``} ${t.statuses.kcrTimeLoopBarrierId?`player-time-looped`:``}`','className:`tactical-map-canvas map-theme-${e.theme} ${c?`mini`:`full`} mode-${l} ${o?`map-time-${o.mode}`:``} ${t.statuses.kcrTimeLoopBarrierId?`player-time-looped`:``} ${RIFT_V15_CANVAS_CLASS(e)}`','canvas class')
text=replace_once(text,'children:[(0,E.jsx)(`div`,{className:`map-floor-texture`,"aria-hidden":`true`})','children:[(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e}),(0,E.jsx)(`div`,{className:`map-floor-texture`,"aria-hidden":`true`})','flow layer')
text=replace_once(text,'children:[(0,E.jsx)(RIFT_SPARTAN_MODEL,{fighter:t}),(0,E.jsx)(RIFT_V141_MAP_VESTIGE,{fighter:t}),(0,E.jsx)(`i`,{})','children:[(0,E.jsx)(RIFT_SPARTAN_MODEL,{fighter:t}),(0,E.jsx)(RIFT_V141_MAP_VESTIGE,{fighter:t}),(0,E.jsx)(RIFT_V15_STATUS_AURA,{fighter:t}),(0,E.jsx)(`i`,{})','player aura')
text=replace_once(text,'children:[(0,E.jsx)(RIFT_SPARTAN_MODEL,{fighter:n}),(0,E.jsx)(RIFT_V141_MAP_VESTIGE,{fighter:n}),(0,E.jsx)(`i`,{})','children:[(0,E.jsx)(RIFT_SPARTAN_MODEL,{fighter:n}),(0,E.jsx)(RIFT_V141_MAP_VESTIGE,{fighter:n}),(0,E.jsx)(RIFT_V15_STATUS_AURA,{fighter:n}),(0,E.jsx)(`i`,{})','enemy aura')
text=replace_once(text,'title:`${t.fighter.name} · ${r?`ally`:t.role===`rogue`?`free-for-all hostile`:`enemy`}`,children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:t.fighter.statuses.rikaCompanion?','title:`${t.fighter.name} · ${r?`ally`:t.role===`rogue`?`free-for-all hostile`:`enemy`}`,children:[(0,E.jsx)(RIFT_V15_STATUS_AURA,{fighter:t.fighter}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:t.fighter.statuses.rikaCompanion?','aux aura')
text=replace_once(text,'e.type===`ultimate`?1280:650','e.type===`ultimate`?980:420','handoff timing')
text=replace_once(text,'[yt,bt]=(0,r.useState)(null),[xt,St]=(0,r.useState)(!1)','[yt,bt]=(0,r.useState)(null),[V15b,V15B]=(0,r.useState)(null),[xt,St]=(0,r.useState)(!1)','buffer state')
text=replace_once(text,'$o=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||A||Jt)return;','$o=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||Jt)return;if(A){V15B(e.id),Ft(`ACTION BUFFERED // ${e.name} will be preselected the moment control returns.`),q(`click`);return}','buffer click')
text=replace_once(text,'o=qa(w,e,A,!!Jt,xl||w.enemy),s=!!o;return(0,E.jsxs)(`button`,{className:`action-card ${e.type} ${yt===e.id?`selected`:``} ${e.type===`ultimate`&&i?`charged`:``} ${r?`cooling-down`:``}`','o=qa(w,e,!1,!!Jt,xl||w.enemy),s=!!o;return(0,E.jsxs)(`button`,{className:`action-card ${e.type} ${yt===e.id?`selected`:``} ${A&&V15b===e.id?`v15-buffered`:``} ${e.type===`ultimate`&&i?`charged`:``} ${r?`cooling-down`:``}`','main action buffer')
text=replace_once(text,'RIFT_COMBAT_BUSY_WATCHDOG=(0,r.useEffect)(()=>{if(!A||!w||w.phase!==`combat`||Jt||Vt||tn)return;','RIFT_V15_BUFFER_EFFECT=(0,r.useEffect)(()=>{if(A||!V15b||!w||w.phase!==`combat`)return;let e=La(w.player).find(e=>e.id===V15b);e&&(bt(V15b),Ft(`BUFFER READY // ${e.name} is preselected.`));V15B(null)},[A,V15b,w?.phase,w?.turn]),RIFT_V15_AUDIO_WATCH=(0,r.useEffect)(()=>{let cue=RIFT_V15_AUDIO_CUE(w?.battlefield?.v15Flow);cue&&Za(cue)},[w?.battlefield?.v15Flow?.id,Za]),RIFT_COMBAT_BUSY_WATCHDOG=(0,r.useEffect)(()=>{if(!A||!w||w.phase!==`combat`||Jt||Vt||tn)return;','buffer/audio effects')

v15_css='''.tactical-map-canvas{--v15-impact:#f8fbff}
.tactical-map-canvas.v15-flow-active{will-change:transform,filter}
.tactical-map-canvas.v15-camera-hit{animation:v15CameraHit .34s cubic-bezier(.2,.9,.24,1) both}
.tactical-map-canvas.v15-camera-heavy{animation:v15CameraHeavy .46s cubic-bezier(.12,.86,.18,1) both}
.tactical-map-canvas.v15-kind-causal{animation:v15CameraCausal .62s steps(2,end) both}
@keyframes v15CameraHit{0%,14%{transform:translateZ(0) scale(1)}18%{transform:translate(-1px,1px) scale(1.003)}28%{transform:translate(1px,-1px) scale(1.006)}55%{transform:translate(0) scale(1.002)}100%{transform:none}}
@keyframes v15CameraHeavy{0%,8%{transform:scale(1)}12%{transform:translate(-3px,1px) scale(1.012)}18%{transform:translate(3px,-2px) scale(1.018)}27%{transform:translate(-2px,2px) scale(1.013)}48%{transform:translate(1px) scale(1.006)}100%{transform:none}}
@keyframes v15CameraCausal{0%,11%{filter:none;transform:none}12%{filter:contrast(1.7) saturate(1.45);transform:translate(2px,-1px)}15%{filter:invert(.18) hue-rotate(55deg);transform:translate(-2px,1px)}20%,100%{filter:none;transform:none}}
.map-fighter{transition-timing-function:cubic-bezier(.18,.78,.2,1)}
.map-fighter.actively-moving{filter:brightness(1.15);animation:v15ActiveStride .18s linear infinite}
.map-fighter.actively-moving:after{content:"";position:absolute;inset:-35%;border-radius:50%;background:linear-gradient(90deg,transparent,var(--fighter),transparent);opacity:.28;filter:blur(5px);transform:translateX(calc(-10px * var(--move-tempo,1)));animation:v15ActorWake .28s linear infinite;pointer-events:none}
@keyframes v15ActiveStride{0%,100%{scale:1}50%{scale:1.08}}
@keyframes v15ActorWake{from{translate:-18% 0;opacity:.1}50%{opacity:.42}to{translate:18% 0;opacity:.08}}
.v15-motion-trail{z-index:35;transform-origin:0 50%;height:3px;pointer-events:none;position:absolute;background:linear-gradient(90deg,transparent,#eaffffb0,#72dfff70,transparent);box-shadow:0 0 9px #9beaff99;animation:v15MotionTrail var(--v15-motion-ms,.32s) ease-out both}
.v15-motion-trail>i{position:absolute;height:1px;left:0;right:0;background:linear-gradient(90deg,transparent,#fff,transparent);filter:blur(.2px);animation:v15TrailThread .28s ease-out both}
.v15-motion-trail>i:nth-child(1){top:-5px}.v15-motion-trail>i:nth-child(2){top:5px;animation-delay:35ms}.v15-motion-trail>i:nth-child(3){top:0;filter:blur(4px);opacity:.55}
.v15-motion-trail.speed-4,.v15-motion-trail.speed-5{height:5px;box-shadow:0 0 15px #fff,0 0 26px #65dfff}
@keyframes v15MotionTrail{0%{clip-path:inset(0 100% 0 0);opacity:0}15%{opacity:1}58%{clip-path:inset(0 0 0 0)}100%{opacity:0;filter:blur(2px)}}
@keyframes v15TrailThread{0%{scale:.1 1;opacity:0}30%{scale:1 1;opacity:.9}100%{translate:18px 0;opacity:0}}
.v15-impact-cue{--v15-cue:#f8fbff;z-index:68;aspect-ratio:1;width:clamp(34px,5.2vw,70px);pointer-events:none;position:absolute;translate:-50% -50%;color:var(--v15-cue);filter:drop-shadow(0 0 7px var(--v15-cue));animation:v15CueLife .82s ease-out both}
.v15-impact-cue.heavy{width:clamp(52px,7vw,96px)}
.v15-impact-cue.kind-physical{--v15-cue:#ffffff}.v15-impact-cue.kind-magic{--v15-cue:#ca9dff}.v15-impact-cue.kind-cut{--v15-cue:#ff6f87}.v15-impact-cue.kind-flame{--v15-cue:#ff7b36}.v15-impact-cue.kind-frost{--v15-cue:#8cecff}.v15-impact-cue.kind-shock{--v15-cue:#fff07c}.v15-impact-cue.kind-soul{--v15-cue:#a8ffd0}.v15-impact-cue.kind-spatial{--v15-cue:#b992ff}.v15-impact-cue.kind-explosion{--v15-cue:#ffc55e}.v15-impact-cue.kind-causal{--v15-cue:#ffefff}.v15-impact-cue.kind-countered{--v15-cue:#71ffc9}.v15-impact-cue.kind-refracted{--v15-cue:#c8fbff}.v15-impact-cue.kind-infinity{--v15-cue:#94d7ff}.v15-impact-cue.kind-shielded,.v15-impact-cue.kind-guarded,.v15-impact-cue.kind-blocked{--v15-cue:#9eb7ca}.v15-impact-cue.kind-mobility{--v15-cue:#7ce9ff}.v15-impact-cue.kind-rest,.v15-impact-cue.kind-technique{--v15-cue:#c7d1df}
.v15-impact-core{position:absolute;inset:31%;border-radius:50%;background:radial-gradient(circle,#fff 0 12%,var(--v15-cue) 18%,transparent 70%);box-shadow:0 0 18px var(--v15-cue);animation:v15CoreBurst .42s ease-out both}
.v15-impact-ring{position:absolute;border:2px solid currentColor;border-radius:50%;inset:18%;animation:v15ImpactRing .62s ease-out both}.v15-impact-ring.two{inset:3%;animation-delay:45ms;opacity:.55}
.v15-impact-direction{position:absolute;left:50%;top:50%;height:3px;width:120%;transform-origin:0 50%;transform:rotate(var(--v15-angle)) translateX(-8%);background:linear-gradient(90deg,#fff,var(--v15-cue),transparent);box-shadow:0 0 8px var(--v15-cue);animation:v15DirectionalKick .44s ease-out both}
.v15-impact-cue strong{position:absolute;left:50%;top:-19px;translate:-50% -100%;white-space:nowrap;letter-spacing:.1em;font:950 clamp(8px,1.1vw,13px) var(--font-display);color:#fff;text-shadow:0 1px 2px #000,0 0 9px var(--v15-cue);animation:v15DamageReadout .8s ease-out both}
.v15-impact-cue small{position:absolute;left:50%;top:-8px;translate:-50% -100%;white-space:nowrap;letter-spacing:.12em;font-size:6px;font-weight:900;color:var(--v15-cue);opacity:.9;text-shadow:0 1px 2px #000}
.v15-impact-cue.kind-causal:before,.v15-impact-cue.kind-causal:after{content:"";position:absolute;inset:-22%;border:1px solid currentColor;clip-path:polygon(0 48%,39% 44%,42% 0,49% 40%,100% 35%,55% 48%,90% 100%,50% 57%,28% 95%,42% 55%);animation:v15CausalFracture .48s steps(3,end) both}
.v15-impact-cue.kind-causal:after{rotate:67deg;opacity:.45;animation-delay:55ms}
.v15-impact-cue.kind-cut .v15-impact-core{border-radius:0;clip-path:polygon(0 46%,100% 0,58% 54%,100% 100%);background:linear-gradient(120deg,transparent,#fff 46%,var(--v15-cue) 53%,transparent 58%)}
.v15-impact-cue.kind-explosion .v15-impact-core{inset:12%;clip-path:polygon(50% 0,61% 36%,91% 18%,70% 44%,100% 54%,68% 60%,88% 91%,58% 69%,49% 100%,42% 68%,10% 88%,31% 59%,0 47%,34% 42%,16% 10%,43% 34%);background:radial-gradient(circle,#fff,#ffd76d 20%,#ff5e2f 50%,transparent 72%)}
@keyframes v15CueLife{0%{opacity:0;scale:.45}8%{opacity:1;scale:1.15}20%{scale:.96}70%{opacity:1}100%{opacity:0;scale:1.45}}
@keyframes v15CoreBurst{0%{scale:.15;opacity:0}20%{scale:1.3;opacity:1}100%{scale:2;opacity:0}}
@keyframes v15ImpactRing{0%{scale:.3;opacity:0}18%{opacity:.95}100%{scale:1.8;opacity:0}}
@keyframes v15DirectionalKick{0%{scale:0 1;opacity:0}20%{scale:1 1;opacity:1}100%{translate:30% 0;opacity:0}}
@keyframes v15DamageReadout{0%{opacity:0;translate:-50% -60%;scale:.8}16%{opacity:1;scale:1.08}70%{opacity:1}100%{opacity:0;translate:-50% -150%;scale:.95}}
@keyframes v15CausalFracture{0%{opacity:0;scale:.7}18%{opacity:1}100%{opacity:0;scale:1.7;rotate:13deg}}
.v15-status-aura{z-index:5;pointer-events:none;position:absolute;inset:-12px;border-radius:50%}
.v15-status-aura>i{position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:currentColor;box-shadow:0 0 8px currentColor;animation:v15StatusOrbit 1.6s linear infinite;--v15-orbit:13px}
.v15-status-aura>i:nth-child(2){animation-delay:-.26s}.v15-status-aura>i:nth-child(3){animation-delay:-.52s}.v15-status-aura>i:nth-child(4){animation-delay:-.78s}.v15-status-aura>i:nth-child(5){animation-delay:-1.04s}.v15-status-aura>i:nth-child(6){animation-delay:-1.3s}
.v15-status-aura>b{position:absolute;inset:3px;border-radius:50%;border:1px solid currentColor;opacity:.34;animation:v15StatusPulse 1.2s ease-in-out infinite alternate}
.v15-status-aura.burning{color:#ff6a32}.v15-status-aura.burning>i{clip-path:polygon(50% 0,100% 100%,52% 72%,0 100%);height:8px;border-radius:0}
.v15-status-aura.chilled{color:#90ebff}.v15-status-aura.chilled>b{border-style:dashed;box-shadow:inset 0 0 9px #90ebff55}
.v15-status-aura.spored{color:#ff496c}.v15-status-aura.spored>i{width:3px;height:3px;box-shadow:0 0 4px #ff496c}
.v15-status-aura.shocked{color:#fff27a}.v15-status-aura.shocked>b{clip-path:polygon(42% 0,74% 0,56% 40%,89% 40%,32% 100%,44% 55%,15% 55%);background:#fff27a33;border:0}
.v15-status-aura.staggered{color:#ff8b61}.v15-status-aura.staggered{animation:v15Stagger .34s steps(2,end) infinite}
.v15-status-aura.restrained{color:#caa6ff}.v15-status-aura.restrained>b{border-style:dashed;inset:-2px}
.v15-status-aura.blinded{color:#6f5c83;filter:blur(.5px)}
.v15-status-aura.infinity-live{color:#9fe4ff}.v15-status-aura.infinity-live>b{inset:-6px;border-style:double;box-shadow:0 0 12px #77d7ff55}
.v15-status-aura.simple-domain-live{color:#eafcff}.v15-status-aura.simple-domain-live>b{inset:-10px;border:1px dashed #fff;animation-duration:2.6s}
.v15-status-aura.inertia-live{color:#ffdf73}.v15-status-aura.inertia-live>i{filter:blur(1px);--v15-orbit:18px;animation-duration:.34s}
.v15-status-aura.crystal-live{color:#d9fbff}.v15-status-aura.crystal-live>b{border-radius:18%;rotate:45deg;box-shadow:0 0 10px #fff8}
.v15-status-aura.decaying{color:#b46cff}.v15-status-aura.decaying>b{border-style:dotted}
@keyframes v15StatusOrbit{from{transform:translate(-50%,-50%) rotate(0) translateX(var(--v15-orbit)) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg) translateX(var(--v15-orbit)) rotate(-360deg)}}
@keyframes v15StatusPulse{from{scale:.92;opacity:.18}to{scale:1.12;opacity:.55}}
@keyframes v15Stagger{0%,100%{translate:0}50%{translate:1px -1px}}
.map-feature.destructible.damaged>i,.map-feature.destructible.critical>i{overflow:visible}
.map-feature.destructible.damaged>i:before{filter:drop-shadow(0 0 2px #fff4)}
.map-feature.destructible.critical>i:before{opacity:.95;filter:drop-shadow(0 0 4px #ff586a);animation:v15CrackPulse .38s steps(2,end) infinite}
.map-feature.destroyed>i{transform:rotate(-4deg) scale(.88);box-shadow:inset 0 0 18px #000,0 0 0 transparent}
.map-feature.destroyed:before,.map-feature.destroyed:after{content:"";z-index:3;position:absolute;left:50%;top:50%;width:24%;height:18%;background:var(--feature);opacity:.42;filter:grayscale(.4);clip-path:polygon(0 17%,100% 0,73% 100%,12% 76%);animation:v15DebrisSettle .72s ease-out both;pointer-events:none}
.map-feature.destroyed:after{animation-delay:55ms;rotate:77deg;scale:.72}
@keyframes v15CrackPulse{50%{filter:drop-shadow(0 0 7px #ff405a);opacity:.65}}
@keyframes v15DebrisSettle{0%{translate:-50% -50%;scale:.2;opacity:0}30%{opacity:.7;translate:35% -120%}100%{translate:70% 55%;rotate:38deg;opacity:.32}}
.map-move-line{height:4px;background:linear-gradient(90deg,#65f2c405,#65f2c4aa 35%,#dffff5);box-shadow:0 0 5px #65f2c4,0 0 15px #65f2c466}
.map-move-line>i{inset:-7px 0;animation-duration:.54s}
.map-move-destination{box-shadow:0 0 10px #65f2c4,0 0 28px #65f2c447;animation:v15MoveDestination 1s ease-in-out infinite alternate}
.map-movement-tooltip{border-width:1px 1px 2px;box-shadow:0 12px 34px #000c,0 0 24px #65f2c42e}
.map-movement-tooltip strong{font-size:17px;text-shadow:0 0 9px currentColor}
@keyframes v15MoveDestination{from{filter:brightness(.9);scale:.96}to{filter:brightness(1.2);scale:1.04}}
.action-card.v15-buffered{outline:2px solid #72eaff;outline-offset:2px;box-shadow:0 0 20px #72eaff55,inset 0 0 18px #72eaff18;animation:v15Buffered .6s ease-in-out infinite alternate}
@keyframes v15Buffered{from{filter:brightness(1)}to{filter:brightness(1.18)}}
@media (prefers-reduced-motion:reduce){.tactical-map-canvas.v15-camera-hit,.tactical-map-canvas.v15-camera-heavy,.tactical-map-canvas.v15-kind-causal,.v15-motion-trail,.v15-impact-cue,.v15-status-aura,.map-feature.destroyed:before,.map-feature.destroyed:after,.action-card.v15-buffered{animation:none!important}}
'''
css += '\n'+v15_css+'\n'
bundle.write_text(text)
styles.write_text(css)
print('Applied Riftbound Combat Fluidity Update V15.')
