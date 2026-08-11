from pathlib import Path
import sys

root = Path(sys.argv[1])
js_path = root / "assets/page-F6OuavDb.js"
css_path = root / "assets/riftbound.css"
parts_dir = Path(__file__).parent / "build-expansion-parts"
js_parts = sorted(parts_dir.glob("*.js"))
css_parts = sorted(parts_dir.glob("*.css"))
expected_js = ["01-catalog.js", "02-core.js", "03-ui.js"]
expected_css = ["04-styles.css"]
if [part.name for part in js_parts] != expected_js or [part.name for part in css_parts] != expected_css:
    raise SystemExit("Build Expansion payload manifest is incomplete or out of order")

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


# The roll is identity-only now. Weapons are an earned item category.
repl(
    "C=[{id:`race`,label:`Race`,glyph:`◈`},{id:`trait`,label:`Trait`,glyph:`✧`},{id:`weaponType`,label:`Weapon Type`,glyph:`⚔`},{id:`weapon`,label:`Weapon`,glyph:`⟊`},{id:`power`,label:`Special Power`,glyph:`✺`}],",
    "C=[{id:`race`,label:`Race`,glyph:`◈`},{id:`trait`,label:`Trait`,glyph:`✧`},{id:`power`,label:`Special Power`,glyph:`✺`}],",
    "remove both weapon identity wheels",
)
repl(
    "c={ap:`Attack Potency`,",
    "c={as:`Attack Strength`,ap:`Attack Power`,",
    "split the offensive stat names",
)
repl(
    "l={ap:`AP`,",
    "l={as:`AS`,ap:`AP`,",
    "add the Attack Strength abbreviation",
)
repl(
    "D=[`ap`,`durability`,`speed`,`range`,`iq`,`combatSkill`,`battleIq`,`energy`,`regeneration`],",
    "D=[`as`,`ap`,`durability`,`speed`,`range`,`iq`,`combatSkill`,`battleIq`,`energy`,`regeneration`],",
    "add Attack Strength to every data-driven stat surface",
)
repl(
    "De={ap:`Raises direct damage, destructive force, posture pressure, and the ceiling of power-based techniques.`,",
    "De={as:`Raises physical impact, weapon damage, posture pressure, and force delivered by the body.`,ap:`Raises supernatural, magical, Stand-ability, Devil, energy, and technique damage.`,",
    "teach the stat menu the AS and AP distinction",
)
repl(
    "primary:[`ap`,`durability`],secondary:[`combatSkill`],description:`Raises the ceiling of raw force and the body that has to survive it.`",
    "primary:[`as`,`durability`],secondary:[`combatSkill`],description:`Raises physical Attack Strength and the body that has to survive delivering it.`",
    "move Force affinity to Attack Strength",
)
repl(
    "primary:[`combatSkill`,`battleIq`],secondary:[`ap`],description:`Favors technique, decision quality, and the force needed to capitalize on openings.`",
    "primary:[`combatSkill`,`battleIq`],secondary:[`as`],description:`Favors technique, decision quality, and physical Attack Strength at the opening.`",
    "move Warcraft affinity to Attack Strength",
)

# Item data, rules, passive hooks, and React surfaces share one injected source.
payload = "\n".join(part.read_text() for part in js_parts)
repl("function Ea(", payload + "\nfunction Ea(", "inject Build Expansion runtime")

new_vr = r'''function Vr(e,t,n){let r={...n,as:Number.isFinite(n.as)?n.as:n.ap,ap:Number.isFinite(n.ap)?n.ap:n.as};return e.name===`Human`&&(r.iq+=2),e.name===`Orc`&&(r.as+=1,r.durability+=1),e.name===`Beast`&&(r.as+=1,r.durability+=1,r.speed+=1),e.name===`Demigod`&&(r.as+=1,r.ap+=1,r.durability+=1,r.speed+=1,r.energy+=1,r.regeneration+=1),e.name===`Dwarf`&&(r.durability+=1,r.combatSkill+=1),e.name===`Automaton`&&(r.durability+=1,r.iq+=1),e.name===`Dragonkin`&&(r.as+=1,r.ap+=1,r.durability+=1),e.name===`Voidborn`&&(r.energy+=1,r.battleIq+=1),e.name===`Celestial`&&(r.ap+=1,r.energy+=1,r.regeneration+=1,r.battleIq+=1),e.name===`Abyssal`&&(r.ap+=1,r.energy+=1),e.name===`Titanblood`&&(r.as+=1,r.durability+=2),e.name===`Echo Wraith`&&(r.speed+=1,r.battleIq+=1),t.name===`Speedster`&&(r.speed+=2),r}'''
replace_between("function Vr(", "function Hr(", new_vr, "split racial offense bonuses by source")

new_hr = r'''function Hr(e,t,n,r,i,a,o){let s=Vr(t,r,o),c=Math.round(320+s.durability*44),l=Math.round(72+s.energy*9);t.name===`Fairy`&&(c=Math.round(c*.84)),t.name===`Elf`&&(l=Math.round(l*1.22)),t.name===`Magiborn`&&(l=Math.round(l*1.28)),t.name===`Saiyan`&&(l=Math.round(l*1.22)),n.name===`Legendary Saiyan`&&(l=Math.round(l*1.65)),n.name===`Zenin`&&(l*=2),r.name===`Cursed Child`&&(l*=4),t.name===`Transcendent Being`&&(l*=2),t.name===`Titanblood`&&(c=Math.round(c*1.22));let u=t.name===`Fairy`||t.name===`Celestial`||t.name===`Echo Wraith`||r.name===`Aerokinesis`||r.name===`Cosmic Dominion`||r.name===`One For All`,d={name:e,race:t,trait:n,power:r,weaponType:null,weapon:RIFT_EMPTY_WEAPON(),inventory:Array(6).fill(null),tiers:s,hp:c,maxHp:c,energy:l,maxEnergy:l,ultimate:0,guard:!1,flight:u,spirit:!1,shield:0,posture:0,maxPosture:Math.round((100+s.durability*4+s.combatSkill*2)*(t.name===`Titanblood`?1.35:t.name===`Dwarf`?1.2:1)*(n.name===`Perfect Body`?1.38:1)),combo:0,lastOffense:null,statuses:{},resistances:{},boons:[],revivals:+(t.name===`Kitsune`),raceReviveUsed:!1,traitReviveUsed:!1,lawbreakerUsed:!1,limitbreaks:0,lastActions:[],lastMove:null,powerStorage:[],activePowerIndex:0,supplementalPowers:[],activeSupplementalPower:null,statXp:Re(),statCaps:ze(),devilContracts:[],horsemanContract:null,activeContractId:null,activeHorsemanAbility:0,warDevilHybrid:!1,devilHybrid:null,stolenWeapons:[],activeStolenWeaponId:null,slaveInventory:[],borrowedSlaveId:null,stand:null};return RIFT_NORMALIZE_FIGHTER_BUILD(d)}'''
replace_between("function Hr(", "function Ur(", new_hr, "start every new fighter weaponless with six slots")

repl("function Wr(e){RIFT_PREP_CURSED_CHILD(e),", "function Wr(e){RIFT_NORMALIZE_FIGHTER_BUILD(e),RIFT_PREP_CURSED_CHILD(e),", "migrate every fighter build")
repl("function Oa(e){RIFT_NORMALIZE_LEVEL(e);", "function Oa(e){RIFT_NORMALIZE_LEVEL(e),RIFT_NORMALIZE_RUN_BUILD(e);", "migrate complete run item state")
repl("return Gi(o),ei(o),", "return RIFT_NORMALIZE_RUN_BUILD(o),Gi(o),ei(o),", "initialize Build Expansion state on new runs")
repl("function ei(e){let t=Ui(e);", "function ei(e){RIFT_PREPARE_COMBAT_ITEMS(e);let t=Ui(e);", "prepare player and AI items at combat start")

# The old random consumable/relic vendor is fully replaced by item offers.
replace_between("function Ea(", "function Da(", "function Ea(e,t=0){return RIFT_SHOP_OFFERS(e)}", "replace the old Shard Shop offer generator")

new_y = r'''function Y(e,t){RIFT_NORMALIZE_FIGHTER_BUILD(e);let n=e.statuses.antiMirrorLocked?e.statuses[`antiMirror_${t}`]:void 0,r=typeof n==`number`&&Number.isFinite(n)?n:e.tiers[t]??0;if(r+=q(e,t),r+=RIFT_ITEM_STAT_BONUS(e,t),r+=e.statuses[`limitbreakSurge_${t}`]||0,r-=e.statuses[`contractStatPenalty_${t}`]||0,r-=e.statuses.despairPenalty||0,e.statuses.environmentPredatorTurns>0&&[`as`,`ap`,`durability`,`speed`].includes(t)&&(r+=1),qn(e)){let n=e.devilHybrid?.horseman;r+=n||[`durability`,`regeneration`].includes(t)?2:1,Xn(e)&&(r+=[`as`,`ap`,`durability`,`speed`,`combatSkill`,`regeneration`].includes(t)?5:3)}if([`iq`,`battleIq`,`combatSkill`].includes(t)&&(r-=e.statuses.fearPenalty||0),cr(e)&&[`as`,`durability`,`speed`].includes(t)&&(r+=t===`speed`?4:3),t===`ap`&&Wn(e)&&dr(e)&&(r+=2),B(e)&&[`as`,`ap`,`durability`,`speed`].includes(t)){let n=e.energy/Math.max(1,e.maxEnergy),i=n>=.75?2:+(n>=.35),a=V(e);r+=i+a,Vn(e)&&a>0&&(r+=1),a===3&&[`as`,`ap`,`speed`].includes(t)&&(r+=1)}return t===`speed`&&(r+=e.statuses.speedBuff||0,r+=e.statuses.gearshiftStacks||0,r+=e.statuses.faJinBurst||0,r+=e.statuses.fauxSpeed||0,r+=e.statuses.omniSpeed||0,r+=e.statuses.domainSpeed||0,r-=e.statuses.speedDown||0,e.trait?.name===`Adrenaline`&&e.hp/e.maxHp<.4&&(r+=2),r+=e.statuses.momentum||0),t===`combatSkill`&&(r+=e.statuses.skillBuff||0,r-=e.statuses.skillDown||0),t===`durability`&&(r-=e.statuses.defenseDown||0),t===`as`&&(r+=e.statuses.asBuff||0,r+=e.statuses.physicalBuff||0),t===`ap`&&(r+=e.statuses.apBuff||0),e.statuses.standAspect_brainElectricity>0&&[`iq`,`battleIq`,`combatSkill`].includes(t)&&(r-=4),e.statuses.standAspect_movement>0&&t===`speed`&&(r-=6),e.statuses.standAspect_ability>0&&[`ap`,`energy`].includes(t)&&(r-=2),Math.max(0,r)}'''
replace_between("function Y(", "function X(", new_y, "route effective AS and AP through items and statuses")

new_yr = r'''function Yr(e,t){let n=t.move?.tags||[],r=t.type===`ultimate`?7:t.type===`special`?4:2,i={},a=(e,t)=>{i[e]=(i[e]||0)+t},o=RIFT_ACTION_SCALING(t,e.player);if(t.type===`strike`||t.type===`weapon`)a(`as`,r),a(`combatSkill`,r);else if((t.type===`special`||t.type===`ultimate`)&&o.mode!==`Special`){o.as>0&&a(`as`,Math.max(1,Math.ceil(r*o.as))),o.ap>0&&a(`ap`,Math.max(1,Math.ceil(r*o.ap))),a(`energy`,Math.ceil(r*.65)),a(`battleIq`,Math.ceil(r*.45)),Tt(t,e.player).requiresAim&&(a(`range`,Math.ceil(r*.55)),a(`combatSkill`,Math.ceil(r*.4))),n.some(e=>[`spatial`,`causal`,`reality`,`hakiKen`].includes(e))&&a(`iq`,Math.ceil(r*.5))}return t.type===`guard`&&(a(`durability`,r+1),a(`battleIq`,r)),t.type===`rest`&&(a(`energy`,r+1),a(`regeneration`,r+1)),qr(e.player,i)}'''
replace_between("function Yr(", "function Xr(", new_yr, "award offense XP by physical or supernatural source")

repl("function Pn(e){return Mn(e)?.weapon||e.weapon}", "function Pn(e){return Mn(e)?.weapon||e.weapon||RIFT_EMPTY_WEAPON()}", "make weapon reads safe while weaponless")
repl(
    "]),w=ja(e),T=w?Ma(e,w):null;if(RIFT_CURSED_CHILD(e)){",
    "]),w=ja(e),T=w?Ma(e,w):null;C=RIFT_FILTER_WEAPON_ACTIONS(e,C);if(RIFT_CURSED_CHILD(e)){",
    "remove the weapon action until a weapon is equipped",
)
repl(
    "u=n.move?.tags||[],f=Va(i,n);",
    "u=n.move?.tags||[],f=(RIFT_BEGIN_ITEM_ACTION(e,i,n),Va(i,n));",
    "open a stable once-per-action passive context",
)
repl(
    "function $o(e,t,n,r){if(r.aim&&!r.aim.contact)return 0;",
    "function $o(e,t,n,r){r.aim&&(e.statuses.riftLastAimDistance=r.aim.distance||0);if(r.type===`weapon`&&e.statuses.itemCertainLine)return delete e.statuses.itemCertainLine,1;if(r.aim&&!r.aim.contact)return 0;",
    "make Certain Line guaranteed and retain aimed range for item logic",
)

# Swap the legacy AP-shaped raw formulas at the centralized damage boundary.
repl(
    "function go(e,t,n,r,i,a){let o=r;",
    "function go(e,t,n,r,i,a){a=Array.isArray(a)?a:[];let o=RIFT_ITEM_OUTGOING(e,t,n,r,a);o=RIFT_ITEM_INCOMING(e,t,n,o,a);",
    "apply source-aware offense and item modifiers once per damage component",
)
repl(
    "let l=Math.max(0,Math.round(o));if(n.hp-=l,",
    "let l=Math.max(0,Math.round(o));if(n.hp-=l,RIFT_ITEM_AFTER_DAMAGE(e,t,n,l,a),",
    "resolve non-recursive post-damage item passives",
)
repl(
    "if(!o&&Zn(t)){",
    "if(RIFT_ITEM_PREVENT_DEATH(e,t,n,i))return!0;if(!o&&Zn(t)){",
    "give item death prevention a death-pierce-safe hook",
)
repl("function Ua(e){", "function Ua(e){RIFT_TICK_ITEM_COOLDOWNS(e),", "tick displayed internal item cooldowns")
repl("function Qo(e,t){", "function Qo(e,t){RIFT_ITEM_TURN_END(e,t),", "resolve item turn lifecycle")

new_apply_snapshot = r'''function RIFT_APPLY_COMBAT_STATE(e,t){if(!t)return!1;let n=Array.isArray(e.player?.inventory)?P(e.player.inventory):null;for(let r of [`turn`,`player`,`enemy`,`battlefield`,`auxiliaryCombatants`,`activeTargetId`,`battleMode`,`battleLabel`,`playerTeam`,`enemyTeam`,`environmentStage`,`environmentProgress`,`environmentOwner`,`environmentBreaks`,`maxEnvironment`,`timeState`,`epitaph`,`enemyFuture`,`enemyIntent`,`calamity`,`requiemEncounter`,`lastDamage`,`lastActor`,`lastEvent`])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=P(t[r]));return n&&e.player&&(e.player.inventory=n,RIFT_NORMALIZE_FIGHTER_BUILD(e.player)),e.auxiliaryCombatants=Array.isArray(e.auxiliaryCombatants)?e.auxiliaryCombatants:[],e.battlefield.units=Array.isArray(e.battlefield.units)?e.battlefield.units:[],Pi(e),Vi(e),!0}'''
replace_between("function RIFT_APPLY_COMBAT_STATE(", "function RIFT_BRANCH_TIMELINE(", new_apply_snapshot, "keep permanent item ownership outside combat rewinds")

# All ordinary and quick-forged runs now pass an empty weapon placeholder.
repl(
    "String(ke.weaponType.value),ke.weapon.value,r",
    "null,RIFT_EMPTY_WEAPON(),r",
    "finish the standard identity wheel weaponless",
)
repl(
    "String(n.weaponType.value),n.weapon.value,i",
    "null,RIFT_EMPTY_WEAPON(),i",
    "finish quick forge weaponless",
)

# Replace the old merchant cards with the production Armory while preserving
# run boons, erasure memory, route selection, and all intermission systems.
shop_start = "(0,E.jsxs)(`div`,{className:`shop-grid`,children:[w.shopOffers.map"
shop_end = "(0,E.jsxs)(`div`,{className:`erasure-shop-sheet`"
replace_between(shop_start, shop_end, "(0,E.jsx)(RIFT_ITEM_SHOP,{run:w,onCommit:T}),", "mount the full Item Shop")
repl(
    "(0,E.jsxs)(`button`,{type:`button`,disabled:w.shopRefreshes<=0||w.shards<18+w.floor*2,onClick:hc,children:[`↻ RESTOCK · `,18+w.floor*2,` ◆`]})",
    "(0,E.jsx)(`em`,{children:`RECIPES REMEMBER OWNED COMPONENTS`})",
    "remove paid random restocking",
)
repl("BETWEEN-FLOOR SHOP · ", "BUILD EXPANSION · ", "rename the intermission shop")
repl("THE WAYFARER", "ITEM SHOP", "rename the merchant surface")
repl("ACTIVE RELICS", "LEGACY RUN BOONS", "distinguish legacy boons from inventory relics")

# Build summary, damage-source badges, Battle Intel, and AS/AP mini stats.
repl(
    "(0,E.jsx)(`div`,{className:`stat-sheet`,children:D.map",
    "(0,E.jsx)(RIFT_BUILD_SUMMARY,{fighter:e}),(0,E.jsx)(`div`,{className:`stat-sheet`,children:D.map",
    "add six-slot build summary to the build sheet",
)
repl(
    "className:`stat-sheet`,children:D.map(t=>(0,E.jsxs)(`div`,{children:[",
    "className:`stat-sheet`,children:D.map(t=>(0,E.jsxs)(`div`,{className:`stat-${t}`,children:[",
    "give AS and AP distinct build-sheet styling",
)
repl("children:Br(t,e.tiers[t])", "children:Br(t,Y(e,t))", "show item-adjusted build-sheet stat names")
repl("r<=Math.min(19,e.tiers[t])", "r<=Math.min(19,Y(e,t))", "show item-adjusted build-sheet tier tracks")
repl(
    "className:`action-card-meta`,children:[n>0&&",
    "className:`action-card-meta`,children:[(0,E.jsx)(RIFT_SCALING_BADGE,{action:e,fighter:w.player}),n>0&&",
    "show AS, AP, Hybrid, or Special scaling on every action card",
)
repl(
    "(0,E.jsx)(`strong`,{children:e.name}),(0,E.jsx)(`p`,{children:e.description})]}),(0,E.jsx)(`em`,{children:i||Wa(e,w.player)}),",
    "(0,E.jsx)(`strong`,{children:e.name}),(0,E.jsx)(`p`,{children:e.description}),(0,E.jsx)(RIFT_SCALING_BADGE,{action:e,fighter:w.player})]}),(0,E.jsx)(`em`,{children:i||Wa(e,w.player)}),",
    "show source scaling on independent Stand commands",
)
repl(
    "(0,E.jsxs)(`div`,{className:`fighter-mini-stats`,children:[",
    "(0,E.jsx)(RIFT_ITEM_INTEL,{fighter:e,hidden:t===`enemy`&&!i(`weapon`)}),(0,E.jsxs)(`div`,{className:`fighter-mini-stats`,children:[",
    "surface weapons and item loadouts in Battle Intel",
)
repl(
    "(0,E.jsxs)(`span`,{title:`Attack Potency`,children:[(0,E.jsx)(`b`,{children:`✦`}),t===`player`||i(`ap`)?Br(`ap`,e.tiers.ap):`???`]}),",
    "(0,E.jsxs)(`span`,{title:`Attack Strength`,children:[(0,E.jsx)(`b`,{children:`†`}),t===`player`||i(`ap`)?Br(`as`,Y(e,`as`)):`???`]}),(0,E.jsxs)(`span`,{title:`Attack Power`,children:[(0,E.jsx)(`b`,{children:`✦`}),t===`player`||i(`ap`)?Br(`ap`,Y(e,`ap`)):`???`]}),",
    "show effective AS and AP in combat HUD",
)

# The production debug console exercises the exact same APIs and shop component.
repl(
    "[[`forge`,`◉`,`Forge & Wheel`],[`combat`,`⚔`,`Combat`],",
    "[[`forge`,`◉`,`Forge & Wheel`],[`items`,`◆`,`Build Expansion`],[`combat`,`⚔`,`Combat`],",
    "add Build Expansion debug category",
)
repl(
    "className:`debug-console-body`,children:[cr===`forge`&&",
    "className:`debug-console-body`,children:[cr===`items`&&(0,E.jsx)(RIFT_DEBUG_ITEM_PANEL,{run:w,onCommit:T}),cr===`forge`&&",
    "mount item grant, remove, Shard, stat, recipe, and shop debug controls",
)
repl(
    "(0,E.jsxs)(`label`,{className:`wide`,children:[(0,E.jsx)(`span`,{children:`Weapon`}),(0,E.jsx)(`select`,{value:$r,onChange:e=>ti(e.target.value),children:y.map(e=>(0,E.jsxs)(`option`,{value:e.name,children:[e.name,` · `,e.type,` · `,e.rarity]},e.name))})]}),",
    "(0,E.jsxs)(`div`,{className:`debug-weaponless-notice wide`,children:[(0,E.jsx)(`span`,{children:`Starting Armament`}),(0,E.jsx)(`strong`,{children:`WEAPONLESS · USE BUILD EXPANSION LAB TO GRANT ITEMS`})]}),",
    "remove the legacy debug weapon selector",
)
repl(
    "className:`${a?`capped`:``} ${o&&!a?`ready`:``}`,children:[",
    "className:`${a?`capped`:``} ${o&&!a?`ready`:``} stat-${e}`,children:[",
    "give AS and AP distinct Stat Menu styling",
)
repl(
    "(0,E.jsx)(`strong`,{children:Br(e,t)})",
    "(0,E.jsx)(`strong`,{children:RIFT_ITEM_STAT_BONUS(w.player,e)?`${Br(e,t)} · ITEMS → ${Br(e,Y(w.player,e))}`:Br(e,t)})",
    "show effective item-adjusted values in the Stat Menu",
)

# User-facing identity and source language must not retain the removed model.
repl("Higher AP and Durability.", "Higher Attack Strength and Durability.", "clarify Orc physical growth")
repl("Higher AP, Durability, and Speed.", "Higher Attack Strength, Durability, and Speed.", "clarify Beast physical growth")
repl("Higher AP, Durability, Speed, Energy, and Regeneration.", "Higher AS, AP, Durability, Speed, Energy, and Regeneration.", "clarify Demigod mixed growth")
repl("City-Level AP · currently ${Br(`ap`,Y(a,`ap`))}", "City-Level AS · currently ${Br(`as`,Y(a,`as`))}", "make City Sword an AS requirement")
repl("o.includes(`warCitySword`)&&Y(a,`ap`)<6", "o.includes(`warCitySword`)&&Y(a,`as`)<6", "validate City Sword with AS before targeting")
repl("u.includes(`warCitySword`)&&Y(i,`ap`)<6", "u.includes(`warCitySword`)&&Y(i,`as`)<6", "enforce City Sword with AS")
repl("City-Level Attack Potency", "City-Level Attack Strength", "explain City Sword source")
repl("let a=Math.round(38+Y(i,`ap`)*7.5+Y(i,`combatSkill`)*3.2)", "let a=Math.round(38+Y(i,`as`)*7.5+Y(i,`combatSkill`)*3.2)", "make physical Time Loop barrier breaking use AS")
repl("let r=t.move;return Y(e,`ap`)*1.7+", "let r=t.move;return RIFT_OFFENSE_TIER(e,t)*1.7+", "score player actions with their declared offense")
repl("i=t.action.move,a=Y(t.fighter,`ap`)*1.68+", "i=t.action.move,a=RIFT_OFFENSE_TIER(t.fighter,t.action)*1.68+", "score copied and AI actions with inherited offense")
repl("r.tiers={...r.tiers,ap:M(Math.round(Y(t,`ap`)-(n.tierDrop??4)+Math.max(0,i-1)*2),0,19),", "r.tiers={...r.tiers,as:M(Math.round(Y(t,`as`)-(n.tierDrop??4)+Math.max(0,i-1)*2),0,19),ap:M(Math.round(Y(t,`ap`)-(n.tierDrop??4)+Math.max(0,i-1)*2),0,19),", "give generated summons independent AS and AP")
repl("t.trait.name===`Apex Pressure`&&Y(t,`ap`)>Y(n,`ap`)", "t.trait.name===`Apex Pressure`&&RIFT_OFFENSE_TIER(t,a)>RIFT_OFFENSE_TIER(n,a)", "compare Apex Pressure with the active damage source")
repl("(16+Y(n,`ap`)*3.4)*1.105**(Y(n,`ap`)-Y(t,`durability`))", "(16+Y(n,`as`)*3.4)*1.105**(Y(n,`as`)-Y(t,`durability`))", "make physical Counterstance use AS")
repl("let r=7+Y(t,`ap`)*.72+", "let r=7+RIFT_OFFENSE_TIER(t,a)*.72+", "derive posture pressure from the active offense source")
repl("d*1.4+Y(t,`ap`)*2", "d*1.4+Y(t,`as`)*2", "make physical knockback structure damage use AS")
repl("Math.round(120+Y(t,`ap`)*13)", "Math.round(120+Y(t,`as`)*13)", "make Road Roller physical integrity use AS")
repl("38+Y(i,`ap`)*6.2", "38+Y(i,`as`)*6.2", "make King Crimson Crashout use AS")
repl("32+Y(i,`ap`)*4", "32+Y(i,`as`)*4", "make Crashout structure damage use AS")
repl("M(.24+Y(i,`ap`)*.012,.28,.52)", "M(.24+Y(i,`as`)*.012,.28,.52)", "make Projection collision use AS")
repl("let t=Y(i,`ap`)+3,n=Y(i,`durability`)", "let t=Y(i,`as`)+3,n=Y(i,`durability`)", "make Fa Jin physical strain use AS")
repl("${Br(`ap`,t)} output exceeds", "${Br(`as`,t)} output exceeds", "label Fa Jin strain as AS")
repl("Math.min(.08,Y(n,`ap`)*.004)", ".04", "remove AP from non-standard falling damage")
repl("e.tiers.speed>=e.tiers.ap+2", "e.tiers.speed>=Math.max(e.tiers.as,e.tiers.ap)+2", "compare Nemesis pursuit against both offense stats")
repl("e.enemy.tiers.ap=M(e.enemy.tiers.ap+1,0,19)", "e.enemy.tiers.as=M(e.enemy.tiers.as+1,0,19),e.enemy.tiers.ap=M(e.enemy.tiers.ap+1,0,19)", "give generated elites both offense growth paths")
repl("t.enemy.tiers.ap+=1", "t.enemy.tiers.as+=1,t.enemy.tiers.ap+=1", "give debug elites both offense growth paths")
repl("ALL FIVE IDENTITY WHEELS FORCED", "ALL THREE IDENTITY WHEELS FORCED", "update forced wheel debug feedback")
repl("FIVE-STEP IDENTITY OVERRIDE", "THREE-STEP IDENTITY OVERRIDE", "update wheel lab copy")
repl(
    "Bind run-only affinities, forge Race, Trait, Weapon Type, Weapon, and Special Power, then grow nine stats through combat-earned XP.",
    "Bind run-only affinities, forge Race, Trait, and Special Power, then earn weapons, armor, relics, and recipes while ten stats grow through combat-earned XP.",
    "rewrite the home build promise",
)

# Remaining old labels refer to supernatural boons or legacy descriptions. The
# source audit requires the removed term to disappear completely.
s = s.replace("Attack Potency", "Attack Power")
if "Attack Potency" in s:
    raise SystemExit("Attack Potency survived the Build Expansion migration")
if "label:`Weapon Type`" in s or "C=[{id:`race`" not in s:
    raise SystemExit("Weapon identity wheel survived the Build Expansion migration")

js_path.write_text(s)
css += "\n" + "\n".join(part.read_text() for part in css_parts)
css_path.write_text(css)

print("Applied Riftbound Build Expansion:")
for change in changes:
    print(" -", change)
print(f" - catalog payload: {sum(1 for _ in payload.splitlines())} lines")
