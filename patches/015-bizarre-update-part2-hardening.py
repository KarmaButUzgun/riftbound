from pathlib import Path
import sys

root = Path(sys.argv[1])
js_path = root / "assets/page-F6OuavDb.js"
css_path = root / "assets/riftbound.css"
s = js_path.read_text()
css = css_path.read_text()
changes = []


def repl(old, new, label, count=1):
    global s
    actual = s.count(old)
    if actual != count:
        raise SystemExit(f"{label}: expected {count}, found {actual}")
    s = s.replace(old, new, count)
    changes.append(label)


def replace_between(start_anchor, end_anchor, new, label):
    global s
    start = s.find(start_anchor)
    end = s.find(end_anchor, start + len(start_anchor))
    if start < 0 or end < 0:
        raise SystemExit(f"{label}: function boundary not found")
    if s.find(start_anchor, start + 1) >= 0:
        raise SystemExit(f"{label}: start boundary is not unique")
    s = s[:start] + new + s[end:]
    changes.append(label)


# Keep a bounded but genuinely deep current-match history and let Master of
# Time expose every retained turn instead of silently hiding all but 24.
repl(
    "e.combatSnapshots.length>64&&(e.combatSnapshots=e.combatSnapshots.slice(-64))",
    "e.combatSnapshots.length>256&&(e.combatSnapshots=e.combatSnapshots.slice(-256))",
    "retain deep current-match snapshot history",
)
repl(
    ".filter(e=>e&&Number.isFinite(e.seq)&&e.state).slice(-64):[],e.combatSnapshotSerial",
    ".filter(e=>e&&Number.isFinite(e.seq)&&e.state).slice(-256):[],e.combatSnapshotSerial",
    "retain deep migrated snapshot history",
)
repl(
    ".filter(e=>e.state?.turn>=1&&e.seq<(w.combatSnapshotSerial||1)).slice(-24).reverse().map",
    ".filter(e=>e.state?.turn>=1&&e.seq<(w.combatSnapshotSerial||1)).reverse().map",
    "show every retained Master of Time turn",
)

# Partial/interrupted saves must not poison the persistent Death Loop ledger.
repl(
    "e.deathLoops=Array.isArray(e.deathLoops)?e.deathLoops.filter(e=>e&&typeof e===`object`):[],",
    "e.deathLoops=Array.isArray(e.deathLoops)?e.deathLoops.filter(e=>e&&typeof e===`object`).map(t=>({...t,id:t.id||`death-loop-${F()}`,name:t.name||`Unknown victim`,createdFloor:Number.isFinite(t.createdFloor)?t.createdFloor:e.floor,deaths:Number.isFinite(t.deaths)?t.deaths:0,lastRewardFloor:Number.isFinite(t.lastRewardFloor)?t.lastRewardFloor:e.floor,recent:Array.isArray(t.recent)?t.recent:[]})):[],",
    "normalize persistent Death Loop records during migration",
)

# Court strips causal ownership from state edits and post-death effects just as
# it strips defense bypass from causal damage. Raw damage remains untouched.
repl(
    "function RIFT_REVERT_TO_ZERO(e,t,n,r=!1){let i=RIFT_FIND_OPPONENT_SNAPSHOT(e,n);",
    "function RIFT_REVERT_TO_ZERO(e,t,n,r=!1){if(RIFT_STAND_IS(U(e,n)?.fighter,`King Crimson Requiem`))return G(e,`COURT OF THE CRIMSON KING // Revert to Zero reaches KCR as a causality-level state edit and loses the authority to rewrite its completed turn.`,`mythic`),!1;let i=RIFT_FIND_OPPONENT_SNAPSHOT(e,n);",
    "let Court neutralize Revert to Zero state edits",
)
repl(
    "function RIFT_DEATH_LOOP_REGISTER(e,t,n){if(!t||t.statuses.deathLoopVictim)return!1;",
    "function RIFT_DEATH_LOOP_REGISTER(e,t,n){if(!t||t.statuses.deathLoopVictim)return!1;if(RIFT_STAND_IS(t,`King Crimson Requiem`))return G(e,`COURT OF THE CRIMSON KING // The barrage's ordinary damage can still kill KCR, but causal ownership cannot establish an Infinite Death Loop.`,`mythic`),!1;",
    "let Court neutralize Infinite Death Loop ownership",
)
repl(
    "if(!RIFT_REVERT_TO_ZERO(e,t,r,!1))G(e,`REVERT TO ZERO // No valid opponent turn remains in causality to deny.`,`system`);return}",
    "if(!RIFT_REVERT_TO_ZERO(e,t,r,!1)&&!RIFT_STAND_IS(U(e,r)?.fighter,`King Crimson Requiem`))G(e,`REVERT TO ZERO // No valid opponent turn remains in causality to deny.`,`system`);return}",
    "avoid false missing-history copy after Court rejects RTZ",
)

# RTZ must preserve both sides' spent resources. Automatic RTZ is also a true
# control-flow discontinuity, so the abandoned resolver must stop immediately.
repl(
    "let a=RIFT_RTZ_SPENT_STATE(e,n),o=U(e,t)?.fighter,",
    "let a=RIFT_RTZ_SPENT_STATE(e,n),userSpent=RIFT_RTZ_SPENT_STATE(e,t),o=U(e,t)?.fighter,",
    "capture the RTZ user's spent resources",
)
repl(
    "RIFT_RTZ_REAPPLY_SPENT(e,n,a);let x=U(e,t)?.fighter;",
    "RIFT_RTZ_REAPPLY_SPENT(e,n,a),RIFT_RTZ_REAPPLY_SPENT(e,t,userSpent);let x=U(e,t)?.fighter;",
    "preserve both sides' spent resources through RTZ",
)
repl(
    "x.statuses.gerRtzCooldown=5,x.statuses.gerRtzUsedTurn=e.turn,x.hp=Math.max(1,x.hp),",
    "x.statuses.gerRtzCooldown=5,x.statuses.gerRtzUsedTurn=e.turn,x.hp=Math.max(1,x.hp),r&&(x.stand&&(x.stand.lastTurnUsed=e.turn),e.timelineRestoredByKcr=1,e.battlefield.effectEchoes.push({id:`ger-auto-rtz-${F()}`,className:`ger-auto-rtz`,shape:`area`,motion:`burst`,origin:{...W(e,t)},target:{...W(e,t)},radius:11,accent:`#fff1a3`,secondary:`#d6b84f`,tertiary:`#251c05`,turns:2})),",
    "abort stale resolvers and visualize automatic RTZ",
)
repl(
    "if(rt&&ra&&RIFT_GER_RTZ_READY(e,rt)&&RIFT_REVERT_TO_ZERO(e,rt,ra,!0))return!0;let o=Qe(i);",
    "if(rt&&ra&&RIFT_GER_RTZ_READY(e,rt)&&RIFT_REVERT_TO_ZERO(e,rt,ra,!0)){let restoredTarget=U(e,rt)?.fighter,restoredAttacker=U(e,ra)?.fighter;return restoredTarget&&Object.assign(t,P(restoredTarget)),restoredAttacker&&Object.assign(n,P(restoredAttacker)),!0}let o=Qe(i);",
    "synchronize stale fighter references after automatic RTZ",
)
repl(
    "go(e,n,t,r,!0,[`magic`,`causality`,`causal`,`kcrTimeLoopPassive`,`noCounter`]),G(e,`TIME LOOP REPEATS // ${t.name}'s isolated interval folds over itself for ${r} temporal pressure while the barrier remains intact.`,`mythic`)}let glitchActor=",
    "go(e,n,t,r,!0,[`magic`,`causality`,`causal`,`kcrTimeLoopPassive`,`noCounter`]),G(e,`TIME LOOP REPEATS // ${t.name}'s isolated interval folds over itself for ${r} temporal pressure while the barrier remains intact.`,`mythic`);if(e.timelineRestoredByKcr)return}let glitchActor=",
    "stop lifecycle work after Time Loop triggers automatic RTZ",
)
repl(
    "go(e,n,t,r,!0,[`magic`,`causality`,`causal`,`kcrTemporalGlitch`,`environment`,`noCounter`]),G(e,`TEMPORAL GLITCH // ${t.name} remains inside missing continuity and suffers ${r} Causality-Level damage.`,`mythic`)}}let n=.0025",
    "go(e,n,t,r,!0,[`magic`,`causality`,`causal`,`kcrTemporalGlitch`,`environment`,`noCounter`]),G(e,`TEMPORAL GLITCH // ${t.name} remains inside missing continuity and suffers ${r} Causality-Level damage.`,`mythic`);if(e.timelineRestoredByKcr)return}}let n=.0025",
    "stop lifecycle work after a glitch triggers automatic RTZ",
)
repl(
    "if(i(),e.enemy.hp>0&&Qo(e,e.enemy),e.turn+=1,",
    "if(i(),e.enemy.hp>0&&Qo(e,e.enemy),e.timelineRestoredByKcr){delete e.timelineRestoredByKcr,T(e),Xe(`limit`),window.setTimeout(()=>Xe(``),540),j(!1);return}if(e.turn+=1,",
    "abort end-of-round bookkeeping after lifecycle RTZ",
)

# A separated Soul is an ethereal return path, not a second freely controlled
# character. It always travels directly toward its inert Body and ignores map
# geometry that could otherwise make recombination permanently impossible.
new_soul = r'''function RIFT_MOVE_SOUL(e,t,n,r=!1){let i=RIFT_SOUL_ID(t),a=U(e,i),o=U(e,t);if(!a||!o?.fighter.statuses.soulSeparated)return{moved:!1,reason:`No separated Soul exists.`,spentCost:0,traveledDistance:0};let s={...W(e,i)},c={...W(e,t)},l=I(s,c),u=Math.max(.001,ht(o.fighter)),d=Math.min(l,Oi(e,i)*u);if(d<=.05)return{moved:!1,reason:Oi(e,i)<=0?`The Soul has no movement remaining.`:`The Soul is already touching its Body.`,spentCost:0,traveledDistance:0};let f={x:s.x+(c.x-s.x)/Math.max(.01,l)*d,y:s.y+(c.y-s.y)/Math.max(.01,l)*d},p=d/u;ki(e,i,f),Ai(e,i,Math.max(0,Oi(e,i)-p));let m=I(W(e,i),c);return m<=O*1.6&&RIFT_RECOMBINE_SOUL(e,t),r||G(e,`SOUL DRIFT // ${o.fighter.name}'s Soul crosses ${d.toFixed(1)}m directly toward the Body${m<=O*1.6?` and recombines`:``}.`,`mythic`),{moved:!0,destination:f,cost:p,spentCost:p,traveledDistance:d,partial:d<l}}'''
replace_between(
    "function RIFT_MOVE_SOUL(",
    "function RIFT_SOUL_AI_STEP(",
    new_soul,
    "force separated Souls onto a guaranteed return path",
)

# A KCR critical must communicate the erased future as battlefield state, not
# only as a log line.
repl(
    "a.statuses.kcrTurnSkipped=1,i.statuses.kcrCritSkipCooldown=3,G(e,`TIME SKIP //",
    "a.statuses.kcrTurnSkipped=1,i.statuses.kcrCritSkipCooldown=3,e.battlefield.effectEchoes.push({id:`kcr-turn-mark-${F()}`,className:`kcr-turn-erasure`,shape:`line`,motion:`burst`,origin:{...Oo(e,i)},target:{...Oo(e,a)},radius:5,accent:`#ff244d`,secondary:`#ffffff`,tertiary:`#090006`,turns:2}),G(e,`TIME SKIP //",
    "mark KCR's upcoming erased turn on the battlefield",
)
repl(
    "function ns(e,t,n){if(t.statuses.kcrTurnSkipped>0)return delete t.statuses.kcrTurnSkipped,",
    "function ns(e,t,n){if(t.statuses.kcrTurnSkipped>0){let r=RIFT_ACTOR_ID_FOR_FIGHTER(e,t);r&&e.battlefield.effectEchoes.push({id:`kcr-turn-skip-${F()}`,className:`kcr-turn-erasure kcr-turn-consumed`,shape:`area`,motion:`burst`,origin:{...W(e,r)},target:{...W(e,r)},radius:10,accent:`#ff244d`,secondary:`#ffffff`,tertiary:`#090006`,turns:2});return delete t.statuses.kcrTurnSkipped,",
    "begin the KCR skipped-turn presentation",
)
repl(
    "G(e,`TIME SKIP // ${t.name}'s scheduled turn appears for a frame, fractures crimson, and is erased before an action can exist.`,`mythic`),!0;if(t.statuses.soulTurnConsumed",
    "G(e,`TIME SKIP // ${t.name}'s scheduled turn appears for a frame, fractures crimson, and is erased before an action can exist.`,`mythic`),!0}if(t.statuses.soulTurnConsumed",
    "close the KCR skipped-turn presentation branch",
)
repl(
    "e.statuses.timeErasureMovement>0&&t.push(`ERASED MOVEMENT ×3`),",
    "e.statuses.timeErasureMovement>0&&t.push(`ERASED MOVEMENT ×3`),e.statuses.kcrTurnSkipped>0&&t.push(`NEXT TURN ERASED`),e.statuses.kcrTimeLoopBarrierId&&t.push(`TIME LOOP · BREAK BARRIER`),",
    "surface KCR turn deletion and Time Loop state",
)

js_path.write_text(s)

css += r'''

/* Bizarre Update Part 2 · follow-up hardening */
.map-effect-echo.kcr-turn-erasure .echo-line{height:4px;background:repeating-linear-gradient(90deg,#ff244f 0 8%,transparent 9% 16%,#fff 17% 19%);box-shadow:0 0 14px #ff244f;animation:kcrTurnErase .3s steps(4,end) infinite}.map-effect-echo.kcr-turn-erasure .echo-impact{border:2px dashed #ff244f;background:repeating-conic-gradient(#ff244f33 0 8deg,transparent 9deg 20deg);box-shadow:0 0 24px #ff244f}.map-effect-echo.kcr-turn-consumed .echo-impact{animation:kcrTurnCollapse .55s steps(7,end) both}.map-effect-echo.ger-auto-rtz .echo-impact{border:2px double #fff1a3;background:repeating-radial-gradient(circle,#fff1a321 0 8%,transparent 9% 16%);box-shadow:0 0 32px #fff1a3;animation:gerAutoZero .8s cubic-bezier(.65,0,.2,1) reverse both}
@keyframes kcrTurnErase{50%{translate:9px 0;opacity:.3}}@keyframes kcrTurnCollapse{to{scale:.05 1;opacity:0;filter:contrast(3)}}@keyframes gerAutoZero{0%{scale:.12;opacity:0}60%{scale:1.18;opacity:1}100%{scale:1}}
@media(prefers-reduced-motion:reduce){.map-effect-echo.kcr-turn-erasure .echo-line,.map-effect-echo.kcr-turn-consumed .echo-impact,.map-effect-echo.ger-auto-rtz .echo-impact{animation:none!important}}
'''

css_path.write_text(css)
print("Applied Bizarre Update Part 2 follow-up hardening:")
for change in changes:
    print(" -", change)
