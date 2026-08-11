from pathlib import Path
import sys

root=Path(sys.argv[1])
js_path=root/'assets/page-F6OuavDb.js'
s=js_path.read_text()
changes=[]

def repl(old,new,label,count=1):
    global s
    actual=s.count(old)
    if actual!=count:
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    s=s.replace(old,new,count)
    changes.append(label)

def add_after(anchor,text,label,count=1):
    repl(anchor,anchor+text,label,count)

# ---------------------------------------------------------------------------
# Stand selection: Requiem evolutions can exist in the registry and debug UI,
# but must never enter ordinary Stand rolls or random enemy generation.
# ---------------------------------------------------------------------------
repl('ke.trait?.value?.name===`Stand User`?h.map(bn):g.filter(e=>e.rollable!==!1)',
     'ke.trait?.value?.name===`Stand User`?h.filter(e=>e.rollable!==!1).map(bn):g.filter(e=>e.rollable!==!1)',
     'exclude unrollable Requiem stands from wheel options')
repl('r=t.id===`power`&&n.trait.value.name===`Stand User`?h.map(bn):co(t.id)',
     'r=t.id===`power`&&n.trait.value.name===`Stand User`?h.filter(e=>e.rollable!==!1).map(bn):co(t.id)',
     'exclude unrollable Requiem stands from quick forge generation')
repl('Tn(re,N(h.filter(e=>e.name!==`King Crimson`)).name)',
     'Tn(re,N(h.filter(e=>e.name!==`King Crimson`&&e.rollable!==!1)).name)',
     'exclude Requiem stands from random enemy Stand generation')

# ---------------------------------------------------------------------------
# A synthetic Stand toggle is a NORMAL PLAYER ACTION now. Auto-summon moves use
# a separate helper and intentionally bypass this action-cost rule.
# ---------------------------------------------------------------------------
anchor='''function Ra(e,t=`player`){let n=xn(e),r=wn(e);if(!n||!r||!e.stand?.summoned)return[];let i=Cn(t),a=r.summoned.map((t,r)=>({id:`stand-command-${r}`,slot:r+1,name:t.name,description:t.description,glyph:n.glyph,type:`special`,cost:Rr(e,t.cost),move:t,moveIndex:r,sourcePower:n.name,actorId:i}));return n.name===`Soft & Wet`&&a.push({id:`stand-tag-location`,slot:4,name:`Tag Location`,description:`Bonus action. Mark the aimed coordinate so Go Beyond can later inherit the tag's perfect spatial solution.`,glyph:`⌖`,type:`special`,cost:0,move:{name:`Tag Location`,description:`Fix an exact point in Soft & Wet's impossible geometry.`,cost:0,power:0,destruction:0,tags:[`standMove`,`standTagLocation`,`bonusAction`]},sourcePower:n.name,actorId:i}),a}'''
if anchor not in s:
    # Patch stacks before this update may have harmless formatting differences.
    start=s.find('function Ra(e,t=`player`)')
    end=s.find('function ',start+20)
    if start<0 or end<0: raise SystemExit('Stand command source Ra() not found')
    anchor=s[start:end]
helpers=r'''function RIFT_STAND_TOGGLE_ACTION(e){let t=xn(e),n=!!e.stand?.summoned;return{id:`stand-toggle`,slot:`S`,name:n?`Dismiss Stand`:`Summon Stand`,description:n?`Use the user's entire action to withdraw the manifested Stand and return to partial-manifestation techniques.`:`Use the user's entire action to fully manifest the Stand. Summoned techniques become available on future Stand command turns.`,glyph:n?`◌`:`幽`,type:`special`,cost:0,move:{name:n?`Dismiss Stand`:`Summon Stand`,description:`Stand manifestation now consumes the user's action.`,cost:0,power:0,destruction:0,tags:[`standToggle`,`selfCast`]},sourcePower:t?.name||`Stand Manifestation`,targetId:`player`}}function RIFT_AUTO_SUMMON_STAND(e,t,n=`ability`){let r=U(e,t),i=r?.fighter;if(!i?.stand||i.stand.summoned)return!1;i.stand.summoned=!0,i.stand.lastTurnUsed=e.turn,Ni(e,t),G(e,`AUTO-MANIFEST // ${i.stand.name} remains fully summoned after ${n}. No second summon action is required, but no bonus Stand turn is created.`,r?.team===e.playerTeam?`player`:`enemy`);return!0}'''
add_after(anchor,helpers,'add Stand toggle and ability auto-summon helpers')

# Toggle inside the real player action resolver. The caller reaches this only
# after stun/action-loss checks, so a stunned user cannot summon for free.
old='''if(ns(e,i,o))return;let m=u.some(e=>[`hakiKen`,`hakiFutureSight`,`hakiAdvancedToggle`,`plusUltra`,`limitlessMaximumOutput`,`afoSwitch`].includes(e));'''
new=r'''if(ns(e,i,o))return;if(u.includes(`standToggle`)){if(!i.stand)return;let t=s.endsWith(`-stand`)?s.slice(0,-6):s,n=i.stand;if(n.summoned){let r=Ei(e.battlefield,Cn(t));i.statuses.standMovementBank=r?.movement||0,i.statuses.standMovementBankTurn=e.turn,n.summoned=!1,e.battlefield.units=e.battlefield.units.filter(e=>e.id!==Cn(t)),G(e,`STAND DISMISSED // ${n.name} withdraws. The user's action is spent and partial-manifestation techniques return.`,o)}else n.summoned=!0,n.lastTurnUsed=e.turn,Ni(e,t),i.statuses.standMovementBankTurn===e.turn&&Ai(e,Cn(t),Math.min(i.statuses.standMovementBank||0,On(i))),G(e,`STAND MANIFESTED // ${n.name} enters with ${Oi(e,Cn(t)).toFixed(1)} MP. The user's action is spent; the Stand cannot gain an unintended command turn from this summon.`,`mythic`);return}let m=u.some(e=>[`hakiKen`,`hakiFutureSight`,`hakiAdvancedToggle`,`plusUltra`,`limitlessMaximumOutput`,`afoSwitch`].includes(e));'''
repl(old,new,'resolve Stand summon/desummon as a full player action')

# UI callback now enters the exact same action/animation pipeline as any other
# player technique instead of mutating state for free.
start=s.find('ms=(0,r.useCallback)(()=>{')
if start<0: raise SystemExit('stand summon callback ms not found')
end=s.find(']),gs=(0,r.useCallback)',start)
if end<0: raise SystemExit('stand summon callback end not found')
old=s[start:end+2]
new='''ms=(0,r.useCallback)(()=>{if(!w||w.phase!==`combat`||A||!w.player.stand)return;let e=RIFT_STAND_TOGGLE_ACTION(w.player);bt(null),jt(null),Xo(e)},[A,w,Xo])'''
s=s[:start]+new+s[end+2:]
changes.append('route Stand toggle button through normal player action resolver')

# Stand UI language must match the new global rule.
s=s.replace('`SUMMON / DISMISS IS A FREE ACTION`','`SUMMON / DISMISS USES YOUR TURN`')
s=s.replace('(0,E.jsx)(`small`,{children:`FREE ACTION`})','(0,E.jsx)(`small`,{children:`USES USER ACTION`})',1)
changes.append('update Stand summon UI action-cost language')

# Trait/build-sheet wording also needs to stop advertising the old free rule.
s=s.replace('The linked Stand can manifest freely, phase through physical terrain, and take its own movement and combat turn while sharing the user’s HP.',
            'The linked Stand can manifest as a full user action, phase through physical terrain, and take its own later movement and combat turn while sharing the user’s HP.')
s=s.replace('Summon and dismissal are free actions.', 'Summoning and dismissal each consume the user’s action.')
changes.append('update Stand rule descriptions')

# ---------------------------------------------------------------------------
# Bounded combat-state snapshots. They intentionally omit run-level rewards,
# inventory/meta progression, logs and the snapshot list itself.
# ---------------------------------------------------------------------------
q_anchor='''function Qe(e){return e.some(e=>Ze.has(e))}'''
snapshot_helpers=r'''function RIFT_CAPTURE_COMBAT_STATE(e){return P({turn:e.turn,player:e.player,enemy:e.enemy,battlefield:e.battlefield,auxiliaryCombatants:e.auxiliaryCombatants||[],activeTargetId:e.activeTargetId,battleMode:e.battleMode,battleLabel:e.battleLabel,playerTeam:e.playerTeam,enemyTeam:e.enemyTeam,environmentStage:e.environmentStage,environmentProgress:e.environmentProgress,environmentOwner:e.environmentOwner,environmentBreaks:e.environmentBreaks,maxEnvironment:e.maxEnvironment,timeState:e.timeState,epitaph:e.epitaph,enemyFuture:e.enemyFuture||[],enemyIntent:e.enemyIntent||null,calamity:e.calamity||null,requiemEncounter:e.requiemEncounter||null,lastDamage:e.lastDamage,lastActor:e.lastActor,lastEvent:e.lastEvent})}function RIFT_RECORD_SNAPSHOT(e,t=`system`,n=`TURN START`){if(!e||e.phase!==`combat`)return null;e.combatSnapshots=Array.isArray(e.combatSnapshots)?e.combatSnapshots:[];let r=(e.combatSnapshotSerial||0)+1;e.combatSnapshotSerial=r;let i=RIFT_CAPTURE_COMBAT_STATE(e),a={seq:r,round:e.turn,actorId:t,label:n,playerHp:i.player.hp,enemyHp:i.enemy.hp,playerEnergy:i.player.energy,enemyEnergy:i.enemy.energy,playerUltimate:i.player.ultimate,enemyUltimate:i.enemy.ultimate,playerPos:P(i.battlefield.player),enemyPos:P(i.battlefield.enemy),state:i};return e.combatSnapshots.push(a),e.combatSnapshots.length>64&&(e.combatSnapshots=e.combatSnapshots.slice(-64)),a}function RIFT_FIND_SNAPSHOT(e,t){let n=e.combatSnapshots||[];return typeof t===`number`?n.find(e=>e.seq===t)||null:[...n].reverse().find(e=>e.actorId===t)||null}function RIFT_APPLY_COMBAT_STATE(e,t){if(!t)return!1;for(let n of [`turn`,`player`,`enemy`,`battlefield`,`auxiliaryCombatants`,`activeTargetId`,`battleMode`,`battleLabel`,`playerTeam`,`enemyTeam`,`environmentStage`,`environmentProgress`,`environmentOwner`,`environmentBreaks`,`maxEnvironment`,`timeState`,`epitaph`,`enemyFuture`,`enemyIntent`,`calamity`,`requiemEncounter`,`lastDamage`,`lastActor`,`lastEvent`])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=P(t[n]));return e.auxiliaryCombatants=Array.isArray(e.auxiliaryCombatants)?e.auxiliaryCombatants:[],e.battlefield.units=Array.isArray(e.battlefield.units)?e.battlefield.units:[],Pi(e),Vi(e),!0}function RIFT_BRANCH_TIMELINE(e,t){e.combatSnapshots=(e.combatSnapshots||[]).filter(e=>e.seq<=t)}'''
add_after(q_anchor,snapshot_helpers,'add bounded serializable combat snapshot architecture')

# New run / migration fields.
old='''timeState:null,epitaph:null,standEvolutionPending:!1,calamity:null};return Gi(o),ei(o),ls(o),o.battleMode!==`duel`'''
new='''timeState:null,epitaph:null,standEvolutionPending:!1,calamity:null,requiemEncounter:null,combatSnapshots:[],combatSnapshotSerial:0,deathLoops:[]};return Gi(o),ei(o),ls(o),RIFT_RECORD_SNAPSHOT(o,`system`,`ENCOUNTER START`),o.battleMode!==`duel`'''
repl(old,new,'initialize combat snapshots and Requiem/death-loop run state')

old='''e.standEvolutionPending=!!e.standEvolutionPending,e.calamity=e.calamity||null,e.calamity&&'''
new='''e.standEvolutionPending=!!e.standEvolutionPending,e.requiemEncounter=e.requiemEncounter||null,e.combatSnapshots=Array.isArray(e.combatSnapshots)?e.combatSnapshots.slice(-64):[],e.combatSnapshotSerial=Number.isFinite(e.combatSnapshotSerial)?e.combatSnapshotSerial:0,e.deathLoops=Array.isArray(e.deathLoops)?e.deathLoops:[],e.calamity=e.calamity||null,e.calamity&&'''
repl(old,new,'migrate snapshot/Requiem/death-loop state safely')

# Each real fighter turn gets a pre-turn state. This is the RTZ/Master source of
# truth and includes auxiliaries because Zo() receives their actor IDs too.
old='''function Zo(e,t,n,r=t===e.player?`player`:`enemy`){Wr(t),Xo(e,t,r),'''
new='''function Zo(e,t,n,r=t===e.player?`player`:`enemy`){RIFT_RECORD_SNAPSHOT(e,r,`${t.name} TURN`),Wr(t),Xo(e,t,r),'''
repl(old,new,'record pre-turn combat snapshot for every actor')

# Floor transitions discard the old match timeline, then seed the new encounter
# only after all route/calamity/formation setup is complete.
old='''e.floor+=1,e.turn=1,e.boss=_r(e.floor),e.currentNemesisId=null'''
new='''e.floor+=1,e.turn=1,e.combatSnapshots=[],e.combatSnapshotSerial=0,e.requiemEncounter=null,e.boss=_r(e.floor),e.currentNemesisId=null'''
repl(old,new,'reset combat timeline at each new floor')
old='''e.enemyFuture=[],ls(e),T(e),bt(null),Bt(null),L(null),Ht(null),Wt(null),q(e.boss?`limit`:`click`)'''
new='''e.enemyFuture=[],ls(e),RIFT_RECORD_SNAPSHOT(e,`system`,`ENCOUNTER START`),T(e),bt(null),Bt(null),L(null),Ht(null),Wt(null),q(e.boss?`limit`:`click`)'''
repl(old,new,'seed snapshot after new-floor battlefield setup')

js_path.write_text(s)
print('Applied Bizarre Update foundation / Stand action / history architecture:')
for c in changes: print(' -',c)
