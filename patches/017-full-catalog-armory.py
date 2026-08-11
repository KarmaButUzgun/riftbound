from pathlib import Path
import sys


root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("full-catalog-armory-parts")

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


ui_path = parts_dir / "01-shop-ui.js"
style_path = parts_dir / "02-shop-styles.css"
if not ui_path.is_file() or not style_path.is_file():
    raise SystemExit("Full Catalog Armory payload is incomplete")

ui = ui_path.read_text().strip()
styles = style_path.read_text().strip()
if not ui.startswith("function RIFT_RECIPE_NODE(") or "function RIFT_ITEM_SHOP(" not in ui:
    raise SystemExit("Full Catalog Armory UI payload failed validation")
if "/* Full Catalog Armory" not in styles:
    raise SystemExit("Full Catalog Armory stylesheet payload failed validation")

bundle = replace_once(
    bundle,
    "const RIFT_BUILD_EXPANSION_VERSION = 1;",
    "const RIFT_BUILD_EXPANSION_VERSION = 2;",
    "bump Build Expansion save marker",
)
bundle = replace_once(
    bundle,
    "  run.shopOffers = Array.isArray(run.shopOffers) ? run.shopOffers.map(offer => typeof offer === `string` ? RIFT_ITEM(offer) : RIFT_ITEM(offer?.id)).filter(Boolean) : [];",
    "  run.shopOffers = [];",
    "discard obsolete random offer payloads from saves",
)
bundle = replace_between(
    bundle,
    "function RIFT_SHOP_OFFERS(",
    "\nconst RIFT_SCALING_OVERRIDES",
    """function RIFT_SHOP_OFFERS(floor = 1, fighter = null) {
  void floor;
  void fighter;
  return RIFT_ITEM_CATALOG.slice();
}""",
    "replace rotating offers with the complete catalog",
)
bundle = replace_once(
    bundle,
    "function Ea(e,t=0){return RIFT_SHOP_OFFERS(e)}",
    "function Ea(){return[]}",
    "stop persisting redundant shop offer snapshots",
)
bundle = replace_between(
    bundle,
    "function RIFT_RECIPE_VIEW(",
    "\nfunction RIFT_BUILD_SUMMARY(",
    ui,
    "replace the Armory interface",
)

if "/* Full Catalog Armory" in css:
    raise SystemExit("Full Catalog Armory styles were already injected")
css = css.rstrip() + "\n\n" + styles + "\n"

bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Full Catalog Armory:")
print(" - all 120 items are deterministic and available on every floor")
print(" - obsolete offer arrays are removed from normalized saves")
print(" - the Armory uses a three-pane catalog, build graph, and loadout dock")
