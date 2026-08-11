from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("029-portrait-rework-v3-parts")
ui_path = parts_dir / "01-literal-item-art-v3.js"
style_path = parts_dir / "02-literal-item-art-v3.css"

for path in (bundle_path, css_path, ui_path, style_path):
    if not path.is_file():
        raise SystemExit(f"Portrait Rework V3: missing {path}")

bundle = bundle_path.read_text()
css = css_path.read_text()
ui = ui_path.read_text().strip()
styles = style_path.read_text().strip()
js_marker = "/* Riftbound Portrait Rework V3 · literal object-first item art */"
css_marker = "/* Riftbound Portrait Rework V3 · literal silhouette-first equipment portraits */"

if not ui.startswith(js_marker):
    raise SystemExit("Portrait Rework V3: runtime payload failed validation")
if not styles.startswith(css_marker):
    raise SystemExit("Portrait Rework V3: stylesheet payload failed validation")
if js_marker in bundle or css_marker in css:
    raise SystemExit("Portrait Rework V3: already applied")

# Patch 028 owns the shop itself. V3 deliberately touches only portrait semantics
# and is injected after V2 at the same final runtime seam so every shop/loadout/
# recipe/tooltip surface that calls RIFT_ITEM_ICON receives the literal renderer.
anchor = "function Ea("
if bundle.count(anchor) != 1:
    raise SystemExit(f"Portrait Rework V3: late runtime anchor expected once, found {bundle.count(anchor)}")
bundle = bundle.replace(anchor, ui + "\n" + anchor, 1)
css = css.rstrip() + "\n\n" + styles + "\n"

bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Riftbound Portrait Rework V3:")
print(" - every portrait now routes through a literal object-kind classifier before rendering")
print(" - random V2 composition angles no longer control the object silhouette")
print(" - atmosphere/foreground/flare layers are removed from the final icon renderer")
print(" - weapons, armor, devices, relics, tools, and wearable items use concrete silhouette families")
print(" - fiction-reference Legendaries receive explicit object-kind mappings for recognizability")
print(" - Gauntlet of Six Stones renders as a gold armored glove with six visible stones")
print(" - existing fullscreen Armory, tooltip, recipe, and purchase behavior remains owned by V2")
