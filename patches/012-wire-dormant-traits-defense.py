from pathlib import Path
import sys

root = Path(sys.argv[1])
js_path = root / 'assets/page-F6OuavDb.js'
s = js_path.read_text()
changes=[]

def repl(old,new,label,count=1):
    global s
    actual=s.count(old)
    if actual!=count:
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    s=s.replace(old,new,count)
    changes.append(label)

# ---------------------------------------------------------------------------
# Nullifying Guard: mutate the shared tag array so downstream secondary handlers
# also see the suppressed properties, while leaving the move's damage intact.
# ---------------------------------------------------------------------------
old = '''function To(e,t,n,r,i,a){if(i>0&&n.trait.name===`Copycat`'''
new = '''function To(e,t,n,r,i,a){if(i>0&&n.guard&&n.trait.name===`Nullifying Guard`&&!r.includes(`guardbreak`)&&!r.includes(`ignoreDefenseHax`)&&Math.random()<.68){let t=new Set([`limitlessBlue`,`calamityJolt`,`calamityElectricGround`,`calamityWindcharge`,`devilPull`,`drain`,`devilFear`,`devilPlague`,`poison`,`markedPrey`,`burn`,`chill`,`shock`,`stun`,`blind`,`restrain`,`speedDown`,`skillDown`,`antiRegen`,`defenseDown`,`misfortune`,`noReaction`,`lockMove`,`delayed`,`doom`,`drown`,`blackHole`,`kiDrain`,`disrupt`,`dispel`,`tornado`,`overload`,`bleed`,`standLeftHook`,`standOra`,`standMoonchild`,`standSevenPage`,`standAspectStrike`,`standPlunder`,`warBang`,`warRatatata`,`silence`,`volatile`,`magneticDisarm`,`packMark`,`dreamMark`,`sleepParalysis`,`voidDrain`,`devourUltimate`,`forcefulDecay`,`blackwhip`]),a=r.filter(e=>t.has(e));if(a.length){a.forEach(e=>{for(let t=r.indexOf(e);t>=0;t=r.indexOf(e))r.splice(t,1)}),G(e,`NULLIFYING GUARD // ${n.name}'s brace suppresses ${a.length} secondary effect${a.length===1?``:`s`} while the impact damage still resolves.`,n===e.player?`player`:`enemy`)}}if(i>0&&n.trait.name===`Copycat`'''
repl(old,new,'wire Nullifying Guard secondary-effect suppression')

# ---------------------------------------------------------------------------
# Patient Guard + Counterstance: both proc from the real Guard damage path and
# are once-per-global-turn so multi-hit attacks cannot farm them repeatedly.
# ---------------------------------------------------------------------------
old = '''c&&(t.posture=Math.min(t.maxPosture,t.posture+Math.round(t.maxPosture*.18)),Ir(n,Math.round(n.maxEnergy*.08)),delete n.statuses.harmonicGuard,G(e,`PERFECT GUARD // ${n.name} catches ${t.name} at impact, negates ${Bn(n)?`94`:`88`}% damage, and turns the force into Stagger.`,n===e.player?`player`:`enemy`))}if(n.shield>0'''
new = '''c&&(t.posture=Math.min(t.maxPosture,t.posture+Math.round(t.maxPosture*.18)),Ir(n,Math.round(n.maxEnergy*.08)),delete n.statuses.harmonicGuard,G(e,`PERFECT GUARD // ${n.name} catches ${t.name} at impact, negates ${Bn(n)?`94`:`88`}% damage, and turns the force into Stagger.`,n===e.player?`player`:`enemy`));if(n.trait.name===`Patient Guard`&&!a.includes(`guardbreak`)&&n.statuses.patientGuardProcTurn!==e.turn){n.statuses.patientGuardProcTurn=e.turn;let t=n.energy,r=Math.max(1,Math.round(n.maxEnergy*.08));Ir(n,r),G(e,`PATIENT GUARD // ${n.name} converts the blocked pressure into ${Math.round(n.energy-t)} ${Lr(n)}${n.statuses.overflowShield>0&&n.energy===n.maxEnergy?` and Overflow Shield`:``}.`,n===e.player?`player`:`enemy`)}if(n.trait.name===`Counterstance`&&!a.includes(`guardbreak`)&&!a.includes(`counterstance`)&&n.statuses.counterstanceProcTurn!==e.turn){let r=M(.28+(Y(n,`combatSkill`)-Y(t,`combatSkill`))*.012,.18,.52);if(Math.random()<r){n.statuses.counterstanceProcTurn=e.turn;let r=Math.max(1,Math.round((16+Y(n,`ap`)*3.4)*1.105**(Y(n,`ap`)-Y(t,`durability`))*.48)),i=go(e,n,t,r,!1,[`physical`,`counterstance`,`noCounter`]);G(e,`COUNTERSTANCE // ${n.name} answers the blocked attack with a weakened Strike for ${i} damage.`,n===e.player?`player`:`enemy`)}}}if(n.shield>0'''
repl(old,new,'wire Patient Guard and Counterstance into guarded damage')

# ---------------------------------------------------------------------------
# Hunter's Mark: intel reveals become a persistent fight damage scalar.
# ---------------------------------------------------------------------------
old = '''t.trait.name===`Executioner`&&n.hp/n.maxHp<.25&&(o*=1.28),t.trait.name===`Apex Pressure`'''
new = '''t.trait.name===`Executioner`&&n.hp/n.maxHp<.25&&(o*=1.28),t.trait.name===`Hunter’s Mark`&&!a.includes(`environment`)&&(o*=1+Math.min(5,t.statuses.huntersMark||0)*.04),t.trait.name===`Apex Pressure`'''
repl(old,new,'apply Hunter’s Mark damage multiplier')

old = '''if(G(e,`${Bn(t)?`FOUR-EYED ANALYSIS`:`BATTLE IQ`} // ${a.join(` · `)} revealed.`,`player`),qr(t,{iq:4+i.length*2,battleIq:3+i.length*2}),e.currentNemesisId)'''
new = '''if(G(e,`${Bn(t)?`FOUR-EYED ANALYSIS`:`BATTLE IQ`} // ${a.join(` · `)} revealed.`,`player`),t.trait.name===`Hunter’s Mark`&&(t.statuses.huntersMark=Math.min(5,(t.statuses.huntersMark||0)+i.length),G(e,`HUNTER'S MARK ×${t.statuses.huntersMark} // Revealed weaknesses now grant +${t.statuses.huntersMark*4}% damage.`,`limit`)),qr(t,{iq:4+i.length*2,battleIq:3+i.length*2}),e.currentNemesisId)'''
repl(old,new,'gain Hunter’s Mark stacks when intel is revealed')

# ---------------------------------------------------------------------------
# Environmental Predator: World Breaks grant a short all-physical-stat surge.
# Keep the proc in a helper because a few cinematic ultimates jump the world
# directly instead of flowing through Eo().
# ---------------------------------------------------------------------------
old = '''function Eo(e,t,n,r){let i=b[r];'''
new = '''function RIFT_ENVIRONMENTAL_PREDATOR(e){Ui(e).filter(x=>x.hp>0&&x.trait.name===`Environmental Predator`).forEach(t=>{if(t.statuses.environmentPredatorProcTurn!==e.turn){t.statuses.environmentPredatorProcTurn=e.turn,t.statuses.environmentPredatorTurns=2;let n=t.energy;Ir(t,Math.round(t.maxEnergy*.06)),G(e,`ENVIRONMENTAL PREDATOR // ${t.name} feeds on the World Break: +1 AP/DUR/SPD for two turns and ${Math.round(t.energy-n)} ${Lr(t)} restored.`,t===e.player?`player`:`enemy`)}else t.statuses.environmentPredatorTurns=Math.max(2,t.statuses.environmentPredatorTurns||0)})}function Eo(e,t,n,r){let i=b[r];'''
repl(old,new,'add reusable Environmental Predator World Break hook')

old = '''if(r+=q(e,t),r+=e.statuses[`limitbreakSurge_${t}`]||0,r-=e.statuses[`contractStatPenalty_${t}`]||0,r-=e.statuses.despairPenalty||0,qn(e)){'''
new = '''if(r+=q(e,t),r+=e.statuses[`limitbreakSurge_${t}`]||0,r-=e.statuses[`contractStatPenalty_${t}`]||0,r-=e.statuses.despairPenalty||0,e.statuses.environmentPredatorTurns>0&&[`ap`,`durability`,`speed`].includes(t)&&(r+=1),qn(e)){'''
repl(old,new,'apply Environmental Predator temporary stat surge')

old = '''G(e,`“${an[r]}”`,`mythic`);let a=e.battlefield.lastImpact'''
new = '''G(e,`“${an[r]}”`,`mythic`),RIFT_ENVIRONMENTAL_PREDATOR(e);let a=e.battlefield.lastImpact'''
repl(old,new,'trigger Environmental Predator on normal World Break events')

# Decay Cataclysm and Big Bang Storm hard-set their World Break stages instead
# of calling Eo(), so feed those events through the same trait hook too.
old = '''h.includes(`decayCataclysm`)&&(e.environmentStage=Math.max(e.environmentStage,4),e.environmentProgress=0,e.maxEnvironment=Math.max(e.maxEnvironment,4),G(e,`WORLD BREAK 04/10 // CITY'''
new = '''h.includes(`decayCataclysm`)&&(e.environmentStage=Math.max(e.environmentStage,4),e.environmentProgress=0,e.maxEnvironment=Math.max(e.maxEnvironment,4),RIFT_ENVIRONMENTAL_PREDATOR(e),G(e,`WORLD BREAK 04/10 // CITY'''
repl(old,new,'trigger Environmental Predator on Decay Cataclysm world break')

old = '''h.includes(`bigBangStorm`)&&(e.environmentStage=Math.max(e.environmentStage,8),e.environmentProgress=0,e.maxEnvironment=Math.max(e.maxEnvironment,9),e.player.statuses.realityWeak=99'''
new = '''h.includes(`bigBangStorm`)&&(e.environmentStage=Math.max(e.environmentStage,8),e.environmentProgress=0,e.maxEnvironment=Math.max(e.maxEnvironment,9),RIFT_ENVIRONMENTAL_PREDATOR(e),e.player.statuses.realityWeak=99'''
repl(old,new,'trigger Environmental Predator on Big Bang Storm world break')

# ---------------------------------------------------------------------------
# Temporary trait lifecycle: Copycat/Overflow/Environmental Predator ticks and
# all fight-scoped trait state resets on encounter initialization.
# ---------------------------------------------------------------------------
old = '''function Zo(e,t,n,r=t===e.player?`player`:`enemy`){Wr(t),Xo(e,t,r),t.statuses.wasHitPreviousTurn'''
new = '''function Zo(e,t,n,r=t===e.player?`player`:`enemy`){Wr(t),Xo(e,t,r),t.statuses.copycatTurns>0&&(t.statuses.copycatTurns-=1,t.statuses.copycatTurns<=0&&(delete t.statuses.copycatTurns,delete t.statuses.copycatSlot)),t.statuses.environmentPredatorTurns>0&&(t.statuses.environmentPredatorTurns-=1,t.statuses.environmentPredatorTurns<=0&&delete t.statuses.environmentPredatorTurns),t.statuses.overflowShieldTurns>0&&(t.statuses.overflowShieldTurns-=1,t.statuses.overflowShieldTurns<=0&&(()=>{let e=Math.min(t.shield,t.statuses.overflowShield||0);t.shield=Math.max(0,t.shield-e),delete t.statuses.overflowShield,delete t.statuses.overflowShieldTurns})()),t.statuses.wasHitPreviousTurn'''
repl(old,new,'tick Copycat, Environmental Predator, and Overflow durations')

old = '''RIFT_RESET_CURSED_CHILD(e),e.posture=0,e.combo=0,delete e.statuses.warriorMentalityUsed'''
new = '''RIFT_RESET_CURSED_CHILD(e),e.statuses.overflowShield&&(e.shield=Math.max(0,e.shield-Math.min(e.shield,e.statuses.overflowShield))),e.posture=0,e.combo=0,delete e.statuses.energyMiserUsed,delete e.statuses.calculatedAssault,delete e.statuses.calculatedAssaultLast,delete e.statuses.copycatSlot,delete e.statuses.copycatTurns,delete e.statuses.overflowShield,delete e.statuses.overflowShieldTurns,delete e.statuses.environmentPredatorTurns,delete e.statuses.environmentPredatorProcTurn,delete e.statuses.patientGuardProcTurn,delete e.statuses.counterstanceProcTurn,delete e.statuses.huntersMark,delete e.statuses.warriorMentalityUsed'''
repl(old,new,'reset all newly-wired fight-scoped trait state')

# Small status-rail cues for the traits with stored/stacking state.
old = '''e.statuses.malevolentShrinePulses>0&&t.push(`SHRINE ACTIVE`),e.statuses.smokescreenOn>0'''
new = '''e.statuses.malevolentShrinePulses>0&&t.push(`SHRINE ACTIVE`),e.statuses.calculatedAssault>0&&t.push(`CALCULATED +${e.statuses.calculatedAssault*4}% AIM`),e.statuses.copycatTurns>0&&Number.isFinite(e.statuses.copycatSlot)&&t.push(`COPYCAT S${e.statuses.copycatSlot+1} · ${Math.ceil(e.statuses.copycatTurns)}T`),e.statuses.huntersMark>0&&t.push(`HUNTER ×${e.statuses.huntersMark}`),e.statuses.environmentPredatorTurns>0&&t.push(`PREDATOR ${Math.ceil(e.statuses.environmentPredatorTurns)}T`),e.statuses.smokescreenOn>0'''
repl(old,new,'show newly-wired trait states in combat status rail')

js_path.write_text(s)
print('Applied dormant trait wiring defense/environment:')
for c in changes:
    print(' -',c)
