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
# Trait text: make the newly-live behavior legible in the build sheet/tooltips.
# ---------------------------------------------------------------------------
texts = {
    'Blocking an attack restores Energy.':'Blocking a non-Guard-Break hit restores 8% max Energy once per turn.',
    'Guard may retaliate with a weakened Strike.':'Guard can retaliate once per turn with a skill-scaled counter at reduced Strike power.',
    'Your first powered move each fight costs less.':'Your first Energy-paid Special or Ultimate each fight costs 35% less.',
    'Alternating attacks gradually improves accuracy.':'Changing to a different offensive action builds +4% accuracy, up to +16%; repeating the same attack resets it.',
    'Excess Energy becomes a temporary shield.':'Energy gained beyond maximum becomes temporary Shield at 1.6× the overflow, capped at 30% max HP for two turns.',
    'Environmental events temporarily empower you.':'The first World Break each turn grants +1 AP, Durability, and Speed plus 6% max Energy for two turns.',
    'Being struck by a special move empowers your matching slot.':'Being damaged by Special slot 1–3 empowers your next damaging Special in the matching slot by 22% for three turns.',
    'Guard can suppress secondary move effects.':'While Guarding, non-Guard-Break hits have a 68% chance to suppress harmful secondary move effects.',
    'Revealed weaknesses increase your damage.':'Each new enemy intel reveal grants +4% damage for the fight, stacking up to +20%.',
}
for old,new in texts.items():
    repl(f'`{old}`',f'`{new}`',f'update trait description: {old[:24]}')

# ---------------------------------------------------------------------------
# Energy Miser + Overflow helpers.
# ---------------------------------------------------------------------------
old = '''function Ir(e,t){e.energy=In(e)?e.energy+Math.max(0,t):Math.min(e.maxEnergy,e.energy+Math.max(0,t))}var Lr='''
new = '''function Ir(e,t){let n=Math.max(0,t);if(In(e)){e.energy+=n;return}let r=Math.max(0,e.maxEnergy-e.energy),i=Math.max(0,n-r);e.energy=Math.min(e.maxEnergy,e.energy+n),e.trait.name===`Overflow`&&i>0&&(()=>{let t=Math.max(0,Math.round(e.maxHp*.3)-(e.statuses.overflowShield||0)),n=Math.min(t,Math.max(1,Math.round(i*1.6)));n>0&&(e.shield+=n,e.statuses.overflowShield=(e.statuses.overflowShield||0)+n,e.statuses.overflowShieldTurns=2)})()}function RIFT_TRAIT_ACTION_COST(e,t,n=t.cost){let r=t.move?.tags||[];return e.trait.name===`Energy Miser`&&!e.statuses.energyMiserUsed&&(t.type===`special`||t.type===`ultimate`)&&n>0&&!r.some(e=>[`hakiMove`,`devilContract`,`bloodCost`,`allEnergy`,`spiralEvolve`,`spiralRefuse`].includes(e))?Math.max(0,Math.ceil(n*.65)):n}var Lr='''
repl(old,new,'wire Overflow and add Energy Miser effective-cost helper')

# Overflow shield is spent with normal Shield before it can later expire.
old = '''if(n.shield>0&&!a.includes(`ignoreDefenseHax`)){let e=Math.min(n.shield,o);n.shield-=e,o-=e}let l=Math.max(0,Math.round(o));'''
new = '''if(n.shield>0&&!a.includes(`ignoreDefenseHax`)){let e=Math.min(n.shield,o);n.shield-=e,o-=e,n.statuses.overflowShield>0&&(n.statuses.overflowShield=Math.max(0,n.statuses.overflowShield-e))}let l=Math.max(0,Math.round(o));'''
repl(old,new,'keep temporary Overflow shield accounting in sync with absorbed damage')

# Energy Miser must be reflected by the action lock and the visible action cost.
old = '''function Wa(e,t,n=!1){let r=e.move?.tags||[];if(r.includes(`spiralEvolve`))'''
new = '''function Wa(e,t,n=!1){let r=e.move?.tags||[],i=RIFT_TRAIT_ACTION_COST(t,e);if(r.includes(`spiralEvolve`))'''
repl(old,new,'calculate trait-adjusted visible action cost')
for old,new,label in [
    ('r.includes(`shrineFurnace`)?t.statuses.malevolentShrinePulses>0?`${e.cost} ENG · DOMAIN OPEN`:`${e.cost} ENG · ${Math.round(t.statuses.furnaceCharge||0)}% FURNACE`', 'r.includes(`shrineFurnace`)?t.statuses.malevolentShrinePulses>0?`${i} ENG · DOMAIN OPEN`:`${i} ENG · ${Math.round(t.statuses.furnaceCharge||0)}% FURNACE`', 'show Energy Miser on Furnace'),
    ('r.includes(`kiTransform`)?`${e.cost} KI · ${ar(t).short}`', 'r.includes(`kiTransform`)?`${i} KI · ${ar(t).short}`', 'show Energy Miser on Ki transform'),
    ('r.includes(`limitlessMaximumOutput`)?`${e.cost} CE · BONUS`', 'r.includes(`limitlessMaximumOutput`)?`${i} CE · BONUS`', 'show Energy Miser on Maximum Output'),
    ('r.includes(`limitlessPurple`)?`${e.cost} CE · ${Math.round(t.statuses.limitlessPurpleCharge||0)}% HOLLOW`', 'r.includes(`limitlessPurple`)?`${i} CE · ${Math.round(t.statuses.limitlessPurpleCharge||0)}% HOLLOW`', 'show Energy Miser on Purple'),
    ('e.cost?In(t)?`${e.cost} ${n?`SPIRAL ENERGY`:`SPR`}`:Rn(t)?`${e.cost} ${n?`CURSED ENERGY`:`CE`}${zn(t)?` · SIX EYES`:``}`:B(t)?`${e.cost} KI · ${ar(t).short}`:`${e.cost} ${n?`ENERGY`:`ENG`}`', 'i?In(t)?`${i} ${n?`SPIRAL ENERGY`:`SPR`}`:Rn(t)?`${i} ${n?`CURSED ENERGY`:`CE`}${zn(t)?` · SIX EYES`:``}`:B(t)?`${i} KI · ${ar(t).short}`:`${i} ${n?`ENERGY`:`ENG`}`', 'show Energy Miser on generic powered actions'),
]:
    repl(old,new,label)

old = '''!o.includes(`hakiMove`)&&t.cost>a.energy&&a.trait.name!==`Blood Price`&&!o.includes(`bloodCost`)?`${t.cost-Math.round(a.energy)} more ${Lr(a)} required`'''
new = '''!o.includes(`hakiMove`)&&RIFT_TRAIT_ACTION_COST(a,t)>a.energy&&a.trait.name!==`Blood Price`&&!o.includes(`bloodCost`)?`${RIFT_TRAIT_ACTION_COST(a,t)-Math.round(a.energy)} more ${Lr(a)} required`'''
repl(old,new,'allow Energy Miser-discounted moves through action validation')

# Spend the discounted amount only after all power-specific cost adjustments have
# been calculated. The first successfully paid eligible move consumes the trait.
old = '''if(x=ee,h.includes(`devilContract`)){let t=ja(i);'''
new = '''let traitMiserCost=RIFT_TRAIT_ACTION_COST(i,n,ee),traitMiserActive=traitMiserCost<ee;traitMiserActive&&(ee=traitMiserCost);if(x=ee,h.includes(`devilContract`)){let t=ja(i);'''
repl(old,new,'apply Energy Miser inside action execution')
old = '''}h.includes(`warCitySword`)&&(i.statuses.citySwordCooldown=4),h.includes(`standRoadRoller`)'''
new = '''}traitMiserActive&&(i.statuses.energyMiserUsed=1,G(e,`ENERGY MISER // ${i.name}'s first powered technique resolves at 35% reduced Energy cost.`,o)),h.includes(`warCitySword`)&&(i.statuses.citySwordCooldown=4),h.includes(`standRoadRoller`)'''
repl(old,new,'consume Energy Miser after a successful powered move payment')

# ---------------------------------------------------------------------------
# Calculated Assault: different offensive actions create an accuracy chain.
# ---------------------------------------------------------------------------
old = '''e.trait.name===`Steady Grip`&&r.type===`weapon`&&(i+=.08),t.trait.name===`Light-Footed`'''
new = '''e.trait.name===`Steady Grip`&&r.type===`weapon`&&(i+=.08),e.trait.name===`Calculated Assault`&&(i+=(e.statuses.calculatedAssault||0)*.04),t.trait.name===`Light-Footed`'''
repl(old,new,'apply Calculated Assault accuracy bonus')

old = '''Wo(e,i,n,_);let E=!!i.statuses.spiralCertainty,te=$o(i,a,h,n)'''
new = '''Wo(e,i,n,_);if(g>0&&i.trait.name===`Calculated Assault`){let t=n.type===`special`?`special:${n.moveIndex??b}`:n.type===`ultimate`?`ultimate`:n.type,r=i.statuses.calculatedAssaultLast;i.statuses.calculatedAssault=r&&r!==t?Math.min(4,(i.statuses.calculatedAssault||0)+1):r===t?0:i.statuses.calculatedAssault||0,i.statuses.calculatedAssaultLast=t,i.statuses.calculatedAssault>0&&G(e,`CALCULATED ASSAULT ×${i.statuses.calculatedAssault} // Changing attack lines grants +${i.statuses.calculatedAssault*4}% accuracy.`,o)}let E=!!i.statuses.spiralCertainty,te=$o(i,a,h,n)'''
repl(old,new,'build/reset Calculated Assault chain before accuracy roll')

# ---------------------------------------------------------------------------
# Copycat: being damaged by a Special stores its slot; matching own Special gets
# a one-use power multiplier for three owner turns.
# ---------------------------------------------------------------------------
old = '''function To(e,t,n,r,i,a){let o=Ve.some'''
new = '''function To(e,t,n,r,i,a){if(i>0&&n.trait.name===`Copycat`&&a?.type===`special`&&Number.isFinite(a.moveIndex)&&a.moveIndex>=0&&a.moveIndex<=2){n.statuses.copycatSlot=a.moveIndex,n.statuses.copycatTurns=3,G(e,`COPYCAT // ${n.name} memorizes Special ${a.moveIndex+1}. Their own matching slot is empowered for three turns.`,n===e.player?`player`:`enemy`)}let o=Ve.some'''
repl(old,new,'record incoming Special slot for Copycat')

old = '''Wo(e,i,n,_);if(g>0&&i.trait.name===`Calculated Assault`)'''
new = '''(()=>{if(g>0&&i.trait.name===`Copycat`&&n.type===`special`&&(i.statuses.copycatTurns||0)>0&&i.statuses.copycatSlot===n.moveIndex){g*=1.22,delete i.statuses.copycatSlot,delete i.statuses.copycatTurns,G(e,`COPYCAT RELEASE // ${i.name} answers Special ${n.moveIndex+1} with a learned 22% power surge.`,`limit`)}})(),Wo(e,i,n,_);if(g>0&&i.trait.name===`Calculated Assault`)'''
repl(old,new,'consume Copycat on the matching damaging Special')

js_path.write_text(s)
print('Applied dormant trait wiring core:')
for c in changes:
    print(' -',c)
