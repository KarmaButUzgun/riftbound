from pathlib import Path
import sys


root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("fullscreen-armory-parts")

bundle = bundle_path.read_text()
css = css_path.read_text()


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return source.replace(old, new, 1)


def replace_between(source: str, start: str, end: str, replacement: str, label: str) -> str:
    start_index = source.find(start)
    if start_index < 0:
        raise SystemExit(f"{label}: start anchor missing")
    end_index = source.find(end, start_index)
    if end_index < 0:
        raise SystemExit(f"{label}: end anchor missing")
    if source.find(start, start_index + len(start)) >= 0:
        raise SystemExit(f"{label}: start anchor is not unique")
    return source[:start_index] + replacement.rstrip() + "\n" + source[end_index:]


ui_path = parts_dir / "01-shop-shell.js"
style_path = parts_dir / "02-shop-shell.css"
if not ui_path.is_file() or not style_path.is_file():
    raise SystemExit("Fullscreen Armory payload is incomplete")

ui = ui_path.read_text().strip()
styles = style_path.read_text().strip()
if not ui.startswith("function RIFT_ITEM_SHOP(") or "armory-viewport" not in ui:
    raise SystemExit("Fullscreen Armory UI payload failed validation")
if not styles.startswith("/* Fullscreen Armory"):
    raise SystemExit("Fullscreen Armory stylesheet payload failed validation")

bundle = replace_between(
    bundle,
    "function RIFT_ITEM_SHOP(",
    "\nfunction RIFT_BUILD_SUMMARY(",
    ui,
    "replace the inline Armory with a fullscreen shell",
)
bundle = replace_once(
    bundle,
    "(0,E.jsxs)(`small`,{children:[`BUILD EXPANSION · `,w.shopOffers.length,` OFFERS`]})",
    "(0,E.jsx)(`small`,{children:`BUILD EXPANSION · FULL CATALOG`})",
    "remove obsolete offer count from the intermission header",
)

if "/* Fullscreen Armory" in css:
    raise SystemExit("Fullscreen Armory styles were already injected")
css = css.rstrip() + "\n\n" + styles + "\n"

bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Fullscreen Armory:")
print(" - the intermission uses a compact Open Armory entrance")
print(" - the shop owns the viewport and locks background scrolling")
print(" - catalog, detail, recipe, and loadout panes scroll independently")
print(" - Escape and Return to Floor close the Armory")
