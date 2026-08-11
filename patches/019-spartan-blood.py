from pathlib import Path
import sys


root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("spartan-blood-parts")

bundle = bundle_path.read_text()
css = css_path.read_text()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return source.replace(old, new, 1)


runtime_path = parts_dir / "01-runtime.js"
ui_path = parts_dir / "02-ui.js"
style_path = parts_dir / "03-styles.css"
expected = [runtime_path, ui_path, style_path]
if not all(path.is_file() for path in expected):
    raise SystemExit("Spartan Blood payload is incomplete")

runtime = runtime_path.read_text().strip()
ui = ui_path.read_text().strip()
styles = style_path.read_text().strip()
if not runtime.startswith("const RIFT_SPARTAN_VERSION") or "RIFT_SPARTAN_EXECUTE_EARLY" not in runtime:
    raise SystemExit("Spartan Blood runtime payload failed validation")
if not ui.startswith("function RIFT_SPARTAN_RESOURCE_DOCK") or "function RIFT_INVENTORY_MANAGER" not in ui:
    raise SystemExit("Spartan Blood UI payload failed validation")
if not styles.startswith("/* Spartan Blood"):
    raise SystemExit("Spartan Blood stylesheet payload failed validation")

bundle = replace_once(
    bundle,
    "const RIFT_ITEM_RARITIES = [`Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`];",
    "const RIFT_ITEM_RARITIES = [`Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`, `Mythical`];",
    "add the Mythical item tier",
)
bundle = replace_once(
    bundle,
    "const RIFT_ITEM_RARITY_COLOR = {Common:`#aeb8c8`,Uncommon:`#5ce0a0`,Rare:`#54cfff`,Epic:`#a77bff`,Legendary:`#ffc25a`};",
    "const RIFT_ITEM_RARITY_COLOR = {Common:`#aeb8c8`,Uncommon:`#5ce0a0`,Rare:`#54cfff`,Epic:`#a77bff`,Legendary:`#ffc25a`,Mythical:`#ff365f`};",
    "color the Mythical item tier",
)
bundle = replace_once(
    bundle,
    "[`yamato-riftcutter`,`Yamato · Riftcutter`,`Weapon`,1040,[`eclipse-glaive`,`afterimage-coat`],{as:6,ap:6,speed:5},`閻`,`riftcutter`,3,`Every third weapon hit cuts distance itself, bypassing 18% defense as hybrid damage.`,`A reference blade sharpened on the border between worlds.`,`Devil May Cry`]",
    "[`yamato-riftcutter`,`Yamato`,`Weapon`,1040,[`eclipse-glaive`,`afterimage-coat`],{as:6,ap:6,speed:5},`閻`,`yamatoMovementTheft`,1,`Every third successful hit steals half of the target's next-turn Movement Points and transfers the exact amount to the wielder.`,`A reference blade sharpened on the border between worlds.`,`Devil May Cry`]",
    "rework Yamato around exact Movement theft",
)

catalog_anchor = "  legends.forEach(([id,name,category,price,recipe,stats,glyph,passiveId,cooldown,passive,lore,reference]) => add({id,name,rarity:`Legendary`,category,price,recipe,stats,glyph,passiveId,cooldown,passive,lore,reference,tags:[`unique`,`buildDefining`]}));"
catalog_additions = catalog_anchor + r'''

  add({id:`rebellion-devil-greatsword`,name:`Rebellion`,rarity:`Epic`,category:`Weapon`,price:548,recipe:[`rift-duelist-arsenal`,`hellbound-covenant`],stats:{as:7,ap:2,durability:2,combatSkill:3},glyph:`†`,passiveId:`rebellionResource`,cooldown:1,passive:`Every successful hit restores a compatible primary resource. Flair is supported directly; Combo never advances from this passive.`,lore:`A massive demonic Greatsword that answers blood before command.`,reference:`Devil May Cry`,tags:[`spartanWeapon`,`greatsword`],weapon:{range:4.2,damageType:`Physical`,cost:14,attackTags:[`physical`,`weapon`,`heavy`,`spardaWeapon:rebellion-devil-greatsword`]}});
  add({id:`ebony-ivory`,name:`Ebony & Ivory`,rarity:`Legendary`,category:`Weapon`,price:1085,recipe:[`witchfire-repeater`,`horizon-command`],stats:{as:4,ap:4,speed:4,range:7,combatSkill:4},glyph:`双`,passiveId:`ebonyIvoryTwinHit`,cooldown:1,passive:`A standard weapon attack fires two real shots. Each hit runs valid on-hit effects while once-per-action passives remain protected.`,lore:`Opposite pistols tuned to one impossible rhythm.`,reference:`Devil May Cry`,tags:[`unique`,`buildDefining`,`spartanWeapon`,`dualPistols`],weapon:{range:22,damageType:`Physical`,cost:10,attackTags:[`physical`,`weapon`,`projectile`,`multi`,`spardaWeapon:ebony-ivory`]}});
  add({id:`beowulf-devil-arms`,name:`Beowulf`,rarity:`Legendary`,category:`Weapon`,price:1070,recipe:[`godhand-array`,`archmage-circuit`],stats:{as:9,ap:4,durability:4,combatSkill:5},glyph:`拳`,passiveId:`beowulfDemonicBeam`,cooldown:1,passive:`Every third successful hit empowers the next damaging move with a move-shaped demonic energy beam.`,lore:`Gauntlets and greaves that turn disciplined impact into white-hot demonic light.`,reference:`Devil May Cry`,tags:[`unique`,`buildDefining`,`spartanWeapon`,`gauntlets`],weapon:{range:3.8,damageType:`Physical`,cost:12,attackTags:[`physical`,`weapon`,`heavy`,`spardaWeapon:beowulf-devil-arms`]}});
  add({id:`mirage-edge`,name:`Mirage Edge`,rarity:`Legendary`,category:`Weapon`,price:1095,recipe:[`eclipse-glaive`,`perfect-algorithm`],stats:{as:6,ap:7,speed:5,energy:3},glyph:`幻`,passiveId:`mirageUltimateDrain`,cooldown:1,passive:`A critical hit drains valid Ultimate charge and transfers exactly what the wielder can receive.`,lore:`A spectral blade whose edge is the memory of an edge.`,reference:`Devil May Cry`,tags:[`unique`,`buildDefining`,`spartanWeapon`,`spectralSword`],weapon:{range:5.4,damageType:`Hybrid`,cost:14,attackTags:[`physical`,`magic`,`hybrid`,`weapon`,`crit`,`spardaWeapon:mirage-edge`]}});
  add({id:`sparda-devil-sword`,name:`Sparda`,rarity:`Mythical`,category:`Weapon`,price:1540,recipe:[`rebellion-devil-greatsword`,`yamato-riftcutter`,`ebony-ivory`],stats:{as:11,ap:9,durability:5,range:5,combatSkill:5},glyph:`魔`,passiveId:`spardaLivingLegacy`,cooldown:1,passive:`Close strikes are physical and inflict Bleed. Long lines release hybrid demonic waves. Both penetrate 20% of effective Durability.`,lore:`The living legacy of the Dark Knight, heavy with a world once split in two.`,reference:`Devil May Cry`,tags:[`unique`,`buildDefining`,`spartanWeapon`,`mythical`,`greatsword`],weapon:{range:18,damageType:`Hybrid`,cost:18,attackTags:[`physical`,`magic`,`hybrid`,`weapon`,`spardaLivingLegacy`,`spardaWeapon:sparda-devil-sword`]}});'''
bundle = replace_once(bundle, catalog_anchor, catalog_additions, "add all Spartan weapons")

bundle = replace_once(
    bundle,
    "return {uid:raw.uid || RIFT_UID(`gear`),itemId:raw.itemId,invested:Math.max(0,Math.round(raw.invested || RIFT_ITEM(raw.itemId).price)),...(raw.legacyWeapon?{legacyWeapon:{...raw.legacyWeapon}}:{})};",
    "return {uid:raw.uid || RIFT_UID(`gear`),itemId:raw.itemId,invested:Math.max(0,Math.round(raw.invested || RIFT_ITEM(raw.itemId).price)),reforge:M(Math.round(raw.reforge||0),0,5),...(raw.legacyWeapon?{legacyWeapon:{...raw.legacyWeapon}}:{})};",
    "preserve capped reforge levels in saves",
)
bundle = replace_once(
    bundle,
    "return {uid:RIFT_UID(`gear`),itemId:String(itemId),invested:Math.max(0,Math.round(invested || 0)),...extra};",
    "return {uid:RIFT_UID(`gear`),itemId:String(itemId),invested:Math.max(0,Math.round(invested || 0)),...extra,reforge:M(Math.round(extra.reforge||0),0,5)};",
    "initialize stable reforge levels on new item instances",
)
bundle = replace_once(
    bundle,
    "let n=.0025+t.tiers.regeneration*.00135;",
    "let n=.0025+Y(t,`regeneration`)*.00135;",
    "stack regeneration from race, items, and Devil Trigger exactly once",
)
bundle = replace_once(
    bundle,
    "G(e,`UNITED STATES TORNADO // The roaming vortex catches ${r.fighter.name} for ${i} damage and drags their footing sideways.`,`environment`)",
    "G(e,t.mechanic===`spardaPowerTornado`?`POWER OF SPARTA // Yamato's travelling tornado catches ${r.fighter.name} for ${i} damage and lifts their footing.`:`UNITED STATES TORNADO // The roaming vortex catches ${r.fighter.name} for ${i} damage and drags their footing sideways.`,`environment`)",
    "give Power of Sparta its own travelling-tornado history",
)

bundle = replace_once(
    bundle,
    "if(n.type!==`guard`",
    "if(RIFT_SPARTAN_EXECUTE_EARLY(e,i,a,n,{tone:o,actorId:s,targetId:c}))return;if(n.type!==`guard`",
    "route Spartan state actions through the combat resolver",
)
bundle = replace_once(
    bundle,
    "if(i.lastMove=P(n),Ha(i,n),",
    "if(({tags:h,power:g,destruction:_}=RIFT_SPARTAN_PREPARE_ATTACK(e,i,a,n,h,g,_,{actorId:s,targetId:c})),i.lastMove=P(n),Ha(i,n),",
    "adapt weapon, style, Flair, and beam properties before resolution",
)
bundle = replace_once(
    bundle,
    "i.statuses.guaranteedHit=0,i.statuses.spiralCertainty=0",
    "RIFT_SPARTAN_RESOLVE_ACTION(e,i,a,n,{hit:le&&!ue,critical:C,damage:de,tags:h,actorId:s,targetId:c}),i.statuses.guaranteedHit=0,i.statuses.spiralCertainty=0",
    "separate per-ability Combo progression from per-hit procs",
)

fighter_class = "className:`fighter-panel ${t} ${l?`spiral-wielder`:``} ${u?`ofa-wielder`:``} ${d?`anti-wielder`:``} ${f?`limitless-wielder`:``} ${p?`afo-wielder`:``} ${m?`symbol-wielder`:``} ${h?`decay-wielder`:``} ${g?`shrine-wielder`:``} ${_?`ki-wielder ki-form-${V(e)}`:``} ${v?`perfect-body`:``} ${y?`legendary-saiyan`:``}`"
bundle = replace_once(
    bundle,
    fighter_class,
    fighter_class[:-1] + " ${RIFT_SPARTAN_FIGHTER_CLASS(e)}`",
    "identify Spartan combat panels",
)
bundle = replace_once(
    bundle,
    "masked:t===`enemy`&&!i(`energy`)}),S&&e.haki&&",
    "masked:t===`enemy`&&!i(`energy`)}),(0,E.jsx)(RIFT_SPARTAN_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)}),(0,E.jsx)(RIFT_SPARTAN_CINEMATIC,{fighter:e}),S&&e.haki&&",
    "mount Flair, Combo, style, weapon, and cinematic readouts",
)

player_map_class = "className:`map-fighter player ${n.moving?`actively-moving`:``} ${t.statuses.projectionFrame?`projection-framed`:``} ${t.statuses.infinity?`infinity`:``} ${t.statuses.hakiArmamentCoat?`armament-coated`:``} ${t.statuses.hakiConquerorCoat?`conqueror-coated`:``} ${t.statuses.hakiDodge?`observation-active`:``} ${t.statuses.soulSeparated?`soul-body`:``} ${e.elevation.player?`elevated`:``}`"
enemy_map_class = "className:`map-fighter enemy ${t.moving?`actively-moving`:``} ${n.statuses.projectionFrame?`projection-framed`:``} ${a===`enemy`?`selected-target`:``} ${n.hp<=0?`defeated`:``} ${n.statuses.infinity?`infinity`:``} ${n.statuses.hakiArmamentCoat?`armament-coated`:``} ${n.statuses.hakiConquerorCoat?`conqueror-coated`:``} ${n.statuses.hakiDodge?`observation-active`:``} ${n.statuses.soulSeparated?`soul-body`:``} ${e.elevation.enemy?`elevated`:``}`"
bundle = replace_once(bundle, player_map_class, player_map_class[:-1] + " ${RIFT_SPARTAN_MODEL_CLASS(t)}`", "give the player a Spartan model state")
bundle = replace_once(bundle, enemy_map_class, enemy_map_class[:-1] + " ${RIFT_SPARTAN_MODEL_CLASS(n)}`", "give the enemy a Spartan model state")
bundle = replace_once(
    bundle,
    "children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:t.power.glyph}),!c&&(0,E.jsx)(`span`,{children:`YOU`})]",
    "children:[(0,E.jsx)(RIFT_SPARTAN_MODEL,{fighter:t}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:t.power.glyph}),!c&&(0,E.jsx)(`span`,{children:`YOU`})]",
    "render the player's anatomical Devil Trigger model",
)
bundle = replace_once(
    bundle,
    "children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:n.power.glyph}),!c&&(0,E.jsx)(`span`,{children:`FOE`})]",
    "children:[(0,E.jsx)(RIFT_SPARTAN_MODEL,{fighter:n}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:n.power.glyph}),!c&&(0,E.jsx)(`span`,{children:`FOE`})]",
    "render the enemy's anatomical Devil Trigger model",
)

bundle = replace_once(
    bundle,
    "o=(w.skillPoints||0)>0,",
    "o=(w.skillPoints||0)>0&&w.player.race.name!==`Spartan Blood`,",
    "disable manual stat investment for Spartan Blood",
)
bundle = replace_once(
    bundle,
    "children:`Stats train themselves slowly through use. Stat XP automatically converts into permanent levels when a threshold is reached. Player Level earns Skill Points, which can be invested into any uncapped stat for an immediate level.`",
    "children:w.player.race.name===`Spartan Blood`?`Spartan Blood grows only through accelerated natural Stat XP, weapons, items, and capped reforging. Manual stat investment is sealed.`:`Stats train themselves slowly through use. Stat XP automatically converts into permanent levels when a threshold is reached. Player Level earns Skill Points, which can be invested into any uncapped stat for an immediate level.`",
    "explain Spartan natural training",
)
bundle = replace_once(
    bundle,
    "children:a?`AFFINITY CAP`:o?`INVEST 1 SKILL POINT`:`NO SKILL POINTS`",
    "children:w.player.race.name===`Spartan Blood`?`NATURAL TRAINING ONLY`:a?`AFFINITY CAP`:o?`INVEST 1 SKILL POINT`:`NO SKILL POINTS`",
    "label sealed Spartan stat controls",
)
bundle = replace_once(
    bundle,
    "children:w.phase===`combat`?`SPIRAL EXCEPTION · Skill Point investment costs no combat action.`:`NATURAL TRAINING · Stat XP levels automatically. Spend Player Level points here.`",
    "children:w.player.race.name===`Spartan Blood`?`SPARTAN BLOOD · NATURAL TRAINING +45% · PERSONAL SKILL POINT INVESTMENT DISABLED`:w.phase===`combat`?`SPIRAL EXCEPTION · Skill Point investment costs no combat action.`:`NATURAL TRAINING · Stat XP levels automatically. Spend Player Level points here.`",
    "surface the Spartan progression law",
)
bundle = replace_once(
    bundle,
    "item.rarity===`Legendary`?`This is a final Legendary capstone.`:`This item has no direct upgrade.`",
    "[`Legendary`,`Mythical`].includes(item.rarity)?`This is a final ${item.rarity} capstone.`:`This item has no direct upgrade.`",
    "present Mythical items as final capstones",
)
bundle = replace_once(
    bundle,
    "item.rarity===`Legendary`&&(0,E.jsxs)(`div`,{className:`legendary-ownership-law`",
    "[`Legendary`,`Mythical`].includes(item.rarity)&&(0,E.jsxs)(`div`,{className:`legendary-ownership-law`",
    "show unique ownership law for Mythical items",
)
bundle = replace_once(
    bundle,
    "Only one copy of this Legendary can exist in the six-slot build. Selling it permits a later rebuild.",
    "Only one copy of this Legendary or Mythical item can exist in the six-slot build. Selling it permits a later rebuild.",
    "generalize the unique item explanation",
)
bundle = replace_once(
    bundle,
    "let score = item.rarity === `Legendary` ? 18 : item.rarity === `Epic` ? 10 : 4;",
    "let score = item.rarity === `Mythical` ? 28 : item.rarity === `Legendary` ? 18 : item.rarity === `Epic` ? 10 : 4;",
    "score Mythical recommendations above Legendary items",
)
bundle = replace_once(
    bundle,
    "if (item.rarity === `Legendary` && RIFT_OWNS_ITEM(fighter,item.id)) score = -1e4;",
    "if ([`Legendary`,`Mythical`].includes(item.rarity) && RIFT_OWNS_ITEM(fighter,item.id)) score = -1e4;",
    "exclude owned Mythical items from recommendations",
)
bundle = replace_once(
    bundle,
    "radius:item.rarity===`Legendary`?8:5",
    "radius:item.rarity===`Mythical`?10:item.rarity===`Legendary`?8:5",
    "give Mythical item procs the strongest visual radius",
)

bundle = replace_once(
    bundle,
    "function RIFT_INVENTORY_MANAGER(",
    "function RIFT_INVENTORY_MANAGER_LEGACY(",
    "retire the pre-Spartan inventory manager",
)

payload = runtime + "\n\n" + ui
bundle = replace_once(bundle, "function Ea(){return[]}", payload + "\nfunction Ea(){return[]}", "inject the Spartan Blood expansion")

if "/* Spartan Blood" in css:
    raise SystemExit("Spartan Blood styles were already injected")
css = css.rstrip() + "\n\n" + styles + "\n"

bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Spartan Blood:")
print(" - Mythic race, Human of Sparta, and Devil of Sparta archetypes")
print(" - three weapon slots inside the existing six-slot inventory")
print(" - capped reforging and six Devil Hunter weapons")
print(" - Flair, styles, Combo thresholds, Devil Triggers, and Judgement Cut")
print(" - centralized per-hit weapon procs, AI, save normalization, VFX, and combat UI")
