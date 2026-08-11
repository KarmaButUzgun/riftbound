from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("028-shop-portrait-rework-v2-parts")
ui_path = parts_dir / "01-shop-portrait-v2.js"
style_path = parts_dir / "02-shop-portrait-v2.css"

for path in (bundle_path, css_path, ui_path, style_path):
    if not path.is_file():
        raise SystemExit(f"Shop + Portrait Rework V2: missing {path}")

bundle = bundle_path.read_text()
css = css_path.read_text()
ui = ui_path.read_text().strip()
styles = style_path.read_text().strip()
js_marker = "/* Riftbound Shop + Portrait Rework V2 · final runtime overrides */"
css_marker = "/* Riftbound Shop + Portrait Rework V2 · fullscreen vertical shop + individually profiled portraits */"

if not ui.startswith(js_marker):
    raise SystemExit("Shop + Portrait Rework V2: UI payload failed validation")
if not styles.startswith(css_marker):
    raise SystemExit("Shop + Portrait Rework V2: stylesheet payload failed validation")
if js_marker in bundle or css_marker in css:
    raise SystemExit("Shop + Portrait Rework V2: already applied")

# Itemization Expansion (026) intentionally installs late UI overrides before Ea().
# Installing V2 at the same final runtime seam makes this shop authoritative after
# every older fullscreen/itemization/art patch has finished mutating the bundle.
anchor = "function Ea("
if bundle.count(anchor) != 1:
    raise SystemExit(f"Shop + Portrait Rework V2: late runtime anchor expected once, found {bundle.count(anchor)}")
bundle = bundle.replace(anchor, ui + "\n" + anchor, 1)

css = css.rstrip() + "\n\n" + styles + "\n"
bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Riftbound Shop + Portrait Rework V2:")
print(" - final runtime override restores a reliable fullscreen Armory after late itemization UI")
print(" - catalog/category/detail/loadout panes use viewport-safe vertical scrolling with horizontal overflow suppressed")
print(" - Escape, backdrop close, and Return to Floor cleanly release body scroll and hover state")
print(" - recipe component double-click buys directly with duplicate-purchase and single-click selection guards")
print(" - hover tooltips are cursor-aware and clamped inside the viewport")
print(" - all item portraits use cached per-item composition profiles plus reference-specific Legendary motifs")
print(" - catalog sections use content-visibility containment to keep the 120-item shop responsive")
