from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("025-action-grid-lock-parts")
style_path = parts_dir / "01-styles.css"

if not bundle_path.is_file() or not css_path.is_file():
    raise SystemExit("Action Deck Lock: missing production bundle or stylesheet")
if not style_path.is_file():
    raise SystemExit("Action Deck Lock: missing style payload")

bundle = bundle_path.read_text()
css = css_path.read_text()
styles = style_path.read_text().strip()
marker = "/* Riftbound Action Deck Lock · fixed 4x2 core command layout */"

if not styles.startswith(marker):
    raise SystemExit("Action Deck Lock: style payload failed validation")
if marker in css:
    raise SystemExit("Action Deck Lock: styles were already injected")

old_filter = '''function RIFT_FILTER_WEAPON_ACTIONS(fighter,actions) {
  if (RIFT_ACTIVE_ITEM(fighter) || Mn(fighter) || fighter.statuses?.authenticLoveWeapon) return actions;
  return actions.filter(action=>action.id!==`weapon`);
}'''
new_filter = '''function RIFT_FILTER_WEAPON_ACTIONS(fighter,actions) {
  if (RIFT_ACTIVE_ITEM(fighter) || Mn(fighter) || fighter.statuses?.authenticLoveWeapon) return actions;
  return actions.map(action=>action.id===`weapon`?{...action,name:`Weapon Slot`,description:`No weapon equipped. This command slot is reserved for your active weapon. Equip a Weapon in inventory slot 1 to unlock it.`,glyph:`∅`,cost:0,weaponSlotLocked:true}:action);
}'''
if bundle.count(old_filter) != 1:
    raise SystemExit(f"Action Deck Lock: weapon filter anchor expected once, found {bundle.count(old_filter)}")
bundle = bundle.replace(old_filter, new_filter, 1)

qa_anchor = 'if(n||r)return`Combat is resolving`;if(a.statuses.soulSeparated&&!o.includes(`soulDrift`))'
qa_replacement = 'if(n||r)return`Combat is resolving`;if(t.weaponSlotLocked)return`No weapon equipped · equip a Weapon in inventory slot 1`;if(a.statuses.soulSeparated&&!o.includes(`soulDrift`))'
if bundle.count(qa_anchor) != 1:
    raise SystemExit(f"Action Deck Lock: action validation anchor expected once, found {bundle.count(qa_anchor)}")
bundle = bundle.replace(qa_anchor, qa_replacement, 1)

css = css.rstrip() + "\n\n" + styles + "\n"
bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Action Deck Lock:")
print(" - core action deck is always four columns wide on desktop")
print(" - canonical slots 1-8 form a stable 4x2 command block")
print(" - weaponless fighters keep slot 4 as a visible locked Weapon Slot")
print(" - equipping a weapon restores the real weapon action in the same position")
print(" - mobile uses a two-column fallback without changing action order")
