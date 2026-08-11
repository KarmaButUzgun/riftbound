from pathlib import Path
import sys


root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("combat-loadout-hud-parts")

bundle = bundle_path.read_text()
css = css_path.read_text()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return source.replace(old, new, 1)


ui_path = parts_dir / "01-ui.js"
style_path = parts_dir / "02-styles.css"
if not ui_path.is_file() or not style_path.is_file():
    raise SystemExit("Combat loadout HUD payload is incomplete")

ui = ui_path.read_text().strip()
styles = style_path.read_text().strip()
if not ui.startswith("function RIFT_COMBAT_LOADOUT_RAIL") or "function RIFT_COMBAT_LOADOUT_HUD" not in ui:
    raise SystemExit("Combat loadout HUD UI payload failed validation")
if not styles.startswith("/* Universal combat loadout HUD"):
    raise SystemExit("Combat loadout HUD stylesheet payload failed validation")

bundle = replace_once(
    bundle,
    "RIFT_PREP_CURSED_CHILD(e);C[7].cost=Rr(e,84);",
    "RIFT_PREP_CURSED_CHILD(e);let RIFT_CURSED_ULTIMATE=C.find(e=>e?.id===`ultimate`);RIFT_CURSED_ULTIMATE&&(RIFT_CURSED_ULTIMATE.cost=Rr(e,84));",
    "make Cursed Child Ultimate lookup weaponless-safe",
)

bundle = replace_once(
    bundle,
    "children:wl.map(e=>{let t=Tt(e,w.player)",
    "children:wl.filter(e=>!e.move?.tags?.includes(`spardaWeaponSwitch`)).map(e=>{let t=Tt(e,w.player)",
    "move Spartan weapon switches out of the action-card grid",
)

old_encounter = '''(0,E.jsxs)(`div`,{className:`encounter-chip`,style:{"--encounter":w.encounter.accent},children:[(0,E.jsx)(`small`,{children:`FLOOR ANOMALY`}),(0,E.jsx)(`strong`,{children:w.encounter.name}),(0,E.jsx)(`span`,{children:w.encounter.description})]})'''
new_encounter = '''(0,E.jsx)(RIFT_COMBAT_LOADOUT_HUD,{run:w,opponent:xl||w.enemy,onAction:$o,selectedActionId:yt,busy:A||!!Jt})'''
bundle = replace_once(bundle, old_encounter, new_encounter, "mount universal combat loadout HUD")

bundle = replace_once(
    bundle,
    "function Ea(){return[]}",
    ui + "\nfunction Ea(){return[]}",
    "inject universal combat loadout HUD",
)

if "/* Universal combat loadout HUD" in css:
    raise SystemExit("Combat loadout HUD styles were already injected")
css = css.rstrip() + "\n\n" + styles + "\n"

bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Combat Loadout HUD follow-up:")
print(" - player and selected-opponent six-slot item rails surround Floor Anomaly")
print(" - Spartan weapon switching moved from action cards into the player item rail")
print(" - enemy loadouts preserve Weapon-intel concealment")
print(" - Cursed Child Ultimate cost lookup is safe for weaponless builds")
print(" - Devil Trigger right wings mirror from the shared body centerline")
