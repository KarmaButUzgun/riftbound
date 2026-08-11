from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
style_path = Path(__file__).with_name("027-item-art-overhaul-parts") / "01-maximal-item-art.css"

for path in (bundle_path, css_path, style_path):
    if not path.is_file():
        raise SystemExit(f"Item Art Overhaul: missing {path}")

bundle = bundle_path.read_text()
css = css_path.read_text()
styles = style_path.read_text().strip()
marker = "/* Riftbound Item Portrait Overhaul · maximalist equipment art */"
if not styles.startswith(marker):
    raise SystemExit("Item Art Overhaul: style payload failed validation")
if marker in css:
    raise SystemExit("Item Art Overhaul: already applied")

old_icon = '''RIFT_ITEM_ICON=function RIFT_ITEM_ICON({item,size=`normal`}){if(!item)return (0,E.jsx)(`span`,{className:`rift-item-icon art-icon empty ${size}`,children:(0,E.jsx)(`i`,{})});const hash=RIFT_ITEM_HASH(item.id),kind=item.iconKind||`relic`,variant=item.iconVariant??hash%8;return (0,E.jsxs)(`span`,{className:`rift-item-icon art-icon ${size} rarity-${item.rarity.toLowerCase()} art-${kind} variant-${variant}`,style:{"--item-a":item.accent,"--item-b":`hsl(${(hash+77)%360} 78% 58%)`,"--item-c":`hsl(${(hash+181)%360} 72% 42%)`},title:item.name,children:[(0,E.jsx)(`i`,{className:`art-back`}),(0,E.jsx)(`i`,{className:`art-main`}),(0,E.jsx)(`i`,{className:`art-detail`})]});};'''
new_icon = '''RIFT_ITEM_ICON=function RIFT_ITEM_ICON({item,size=`normal`}){if(!item)return (0,E.jsx)(`span`,{className:`rift-item-icon art-icon empty ${size}`,children:(0,E.jsx)(`i`,{})});const hash=RIFT_ITEM_HASH(item.id),kind=item.iconKind||`relic`,variant=item.iconVariant??hash%8;return (0,E.jsxs)(`span`,{className:`rift-item-icon art-icon ${size} rarity-${item.rarity.toLowerCase()} art-${kind} variant-${variant}`,style:{"--item-a":item.accent,"--item-b":`hsl(${(hash+77)%360} 78% 58%)`,"--item-c":`hsl(${(hash+181)%360} 72% 42%)`},title:item.name,children:[(0,E.jsx)(`i`,{className:`art-frame`}),(0,E.jsx)(`i`,{className:`art-aura`}),(0,E.jsx)(`i`,{className:`art-shadow`}),(0,E.jsx)(`i`,{className:`art-back`}),(0,E.jsx)(`i`,{className:`art-main`}),(0,E.jsx)(`i`,{className:`art-detail`}),(0,E.jsx)(`i`,{className:`art-rune`}),(0,E.jsx)(`i`,{className:`art-flare`}),(0,E.jsx)(`i`,{className:`art-gemlight`})]});};'''
if bundle.count(old_icon) != 1:
    raise SystemExit(f"Item Art Overhaul: icon renderer anchor expected once, found {bundle.count(old_icon)}")
bundle = bundle.replace(old_icon, new_icon, 1)

old_click = '''onClick:()=>onSelect?.(item.id),onDoubleClick:event=>{event.preventDefault();event.stopPropagation();if(!root&&!owned)onQuickBuy?.(item.id,event)}'''
new_click = '''onClick:event=>{event.preventDefault();event.stopPropagation();if(root||owned){onSelect?.(item.id);return}if(event.detail>=2){const pending=globalThis.__RIFT_RECIPE_CLICK_TIMER__;if(pending?.handle)clearTimeout(pending.handle);globalThis.__RIFT_RECIPE_CLICK_TIMER__=null;onQuickBuy?.(item.id,event);return}const prior=globalThis.__RIFT_RECIPE_CLICK_TIMER__;if(prior?.handle)clearTimeout(prior.handle);const handle=setTimeout(()=>{onSelect?.(item.id);if(globalThis.__RIFT_RECIPE_CLICK_TIMER__?.handle===handle)globalThis.__RIFT_RECIPE_CLICK_TIMER__=null},240);globalThis.__RIFT_RECIPE_CLICK_TIMER__={id:item.id,handle}},onDoubleClick:event=>{event.preventDefault();event.stopPropagation()}'''
if bundle.count(old_click) != 1:
    raise SystemExit(f"Item Art Overhaul: recipe click anchor expected once, found {bundle.count(old_click)}")
bundle = bundle.replace(old_click, new_click, 1)

replacements = {
    'title:root?`Selected final item`:`Double-click to buy/build ${item.name}`': 'title:root?`Selected final item`:`Inspect or purchase ${item.name}`',
    ',!root&&!owned&&(0,E.jsx)(`em`,{children:`DOUBLE-CLICK BUY`})': '',
    'item.recipe.length?`HOVER TO INSPECT · DOUBLE-CLICK A COMPONENT TO BUY`:`PURCHASES DIRECTLY`': 'item.recipe.length?`HOVER TO INSPECT · INTERACTIVE COMPONENT TREE`:`PURCHASES DIRECTLY`',
    '`FULL CATALOG · LIVE RECIPES · DOUBLE-CLICK COMPONENTS`': '`FULL CATALOG · LIVE RECIPES · BUILDCRAFT`',
}
for old, new in replacements.items():
    if bundle.count(old) != 1:
        raise SystemExit(f"Item Art Overhaul: copy anchor expected once: {old[:52]!r}, found {bundle.count(old)}")
    bundle = bundle.replace(old, new, 1)

css = css.rstrip() + "\n\n" + styles + "\n"
bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Item Art Overhaul:")
print(" - recipe component double-click now resolves before selection can replace the clicked node")
print(" - removed DOUBLE-CLICK BUY instructional copy from the Armory")
print(" - item portraits now use layered frame, aura, shadow, rune, flare, and gem-light art")
print(" - weapon, armor, relic, magic, utility, and Legendary icon families have materially different silhouettes")
print(" - Legendary/Mythical portraits receive stronger presentation without changing item mechanics")
