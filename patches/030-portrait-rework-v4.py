from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("030-portrait-rework-v4-parts")
ui_path = parts_dir / "01-premium-item-art-v4.js"
style_path = parts_dir / "02-premium-item-art-v4.css"

for path in (bundle_path, css_path, ui_path, style_path):
    if not path.is_file():
        raise SystemExit(f"Portrait Rework V4: missing {path}")

bundle = bundle_path.read_text()
css = css_path.read_text()
ui = ui_path.read_text().strip()
styles = style_path.read_text().strip()
js_marker = "/* Riftbound Portrait Rework V4 · Six Stones quality bar for every item */"
css_marker = "/* Riftbound Portrait Rework V4 · Six Stones-quality premium literal portraits */"
v3_marker = "/* Riftbound Portrait Rework V3 · literal object-first item art */"

if not ui.startswith(js_marker):
    raise SystemExit("Portrait Rework V4: runtime payload failed validation")
if not styles.startswith(css_marker):
    raise SystemExit("Portrait Rework V4: stylesheet payload failed validation")
if js_marker in bundle or css_marker in css:
    raise SystemExit("Portrait Rework V4: already applied")
if v3_marker not in bundle:
    raise SystemExit("Portrait Rework V4: V3 runtime must exist before V4")

# V3 owns literal classification. V4 deliberately reuses that stable semantic layer,
# then replaces the final icon renderer with a higher-detail material/construction pass.
# Injecting at the final runtime seam makes V4 authoritative without touching shop UX.
anchor = "function Ea("
if bundle.count(anchor) != 1:
    raise SystemExit(f"Portrait Rework V4: late runtime anchor expected once, found {bundle.count(anchor)}")
bundle = bundle.replace(anchor, ui + "\n" + anchor, 1)
css = css.rstrip() + "\n\n" + styles + "\n"

bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Riftbound Portrait Rework V4:")
print(" - Six Stones is the visual quality bar for the full catalog")
print(" - all portraits gain dedicated material, accent, and highlight construction layers")
print(" - inherited universal pseudo-element streak/slash decoration is hard-disabled")
print(" - weapon, armor, wearable, relic, magic, device, and component families gain richer object-specific detailing")
print(" - iconic reference items keep literal identity and receive controlled reference-specific polish")
print(" - Six Stones keeps its gold armored glove and six distinct stones")
print(" - fullscreen Armory, tooltips, recipes, purchases, and loadouts remain owned by the existing shop runtime")