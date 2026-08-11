from pathlib import Path
import re
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('031-legendary-portrait-v5-parts')
ui_path=parts/'01-legendary-canon-art-v5.js'
styles_path=parts/'02-legendary-canon-art-v5.css'
for path in (bundle_path,css_path,ui_path,styles_path):
    if not path.is_file(): raise SystemExit(f'Legendary Portrait V5: missing {path}')

bundle=bundle_path.read_text();css=css_path.read_text();ui=ui_path.read_text().strip();styles=styles_path.read_text().strip()
js_marker='/* Riftbound Legendary Portrait Rework V5 · bespoke canon-faithful high-rarity art */'
css_marker='/* Riftbound Legendary Portrait Rework V5 · bespoke canon-faithful hero portraits */'
if not ui.startswith(js_marker): raise SystemExit('Legendary Portrait V5: runtime payload failed validation')
if not styles.startswith(css_marker): raise SystemExit('Legendary Portrait V5: stylesheet payload failed validation')
if js_marker in bundle or css_marker in css: raise SystemExit('Legendary Portrait V5: already applied')
profile_count=len(re.findall(r"^  '[^']+':P\(",ui,re.M))
if profile_count!=68: raise SystemExit(f'Legendary Portrait V5: expected 68 bespoke high-rarity profiles, found {profile_count}')

anchor='function Ea('
if bundle.count(anchor)!=1: raise SystemExit(f'Legendary Portrait V5: late runtime anchor expected once, found {bundle.count(anchor)}')
bundle=bundle.replace(anchor,ui+'\n'+anchor,1)

# Catalog middle-click quick-buy. This deliberately reuses RIFT_BUY_ITEM instead of
# introducing a parallel purchase path, so shard, recipe, slot, and ownership rules stay centralized.
def replace_once(old,new,label):
    global bundle
    count=bundle.count(old)
    if count!=1: raise SystemExit(f'Legendary Portrait V5: {label} expected once, found {count}')
    bundle=bundle.replace(old,new,1)

replace_once(
    'RIFT_CATALOG_TILE=function RIFT_CATALOG_TILE({item,fighter,selected,recommended,onSelect,onHover,pulse=false}){',
    'RIFT_CATALOG_TILE=function RIFT_CATALOG_TILE({item,fighter,selected,recommended,onSelect,onQuickBuy,onHover,pulse=false}){',
    'catalog tile quick-buy prop'
)
replace_once(
    'style:{"--tile-accent":item.accent},onClick:()=>onSelect(item.id),onMouseEnter:',
    'style:{"--tile-accent":item.accent},onClick:()=>onSelect(item.id),onMouseDown:event=>{if(event.button===1)event.preventDefault()},onAuxClick:event=>{if(event.button!==1)return;event.preventDefault();event.stopPropagation();onQuickBuy?.(item.id,event)},onMouseEnter:',
    'catalog tile auxclick handler'
)
old_quick='const quickBuy=id=>{const item=RIFT_ITEM(id);if(!item)return;const now=Date.now(),guard=globalThis.__RIFT_RECIPE_DBLCLICK_V2__||{};if(guard.id===id&&now-guard.time<420)return;globalThis.__RIFT_RECIPE_DBLCLICK_V2__={id,time:now};const next=P(run),result=RIFT_BUY_ITEM(next,id);flash(result,id);if(result.ok){onCommit(next);setSelectedId(id)}};'
new_quick='const executeQuickBuy=(id,{selectAfter=false,dedupe=false}={})=>{const item=RIFT_ITEM(id);if(!item)return null;if(dedupe){const now=Date.now(),guard=globalThis.__RIFT_RECIPE_DBLCLICK_V2__||{};if(guard.id===id&&now-guard.time<420)return null;globalThis.__RIFT_RECIPE_DBLCLICK_V2__={id,time:now}}const next=P(run),result=RIFT_BUY_ITEM(next,id);flash(result,id);if(result.ok){onCommit(next);if(selectAfter)setSelectedId(id)}return result};const quickBuy=id=>executeQuickBuy(id,{selectAfter:true,dedupe:true});const catalogQuickBuy=id=>executeQuickBuy(id,{selectAfter:false,dedupe:false});'
replace_once(old_quick,new_quick,'shared quick-buy purchase pipeline')
replace_once(
    'onSelect:inspect,onHover:hoverAt,pulse:pulseId===item.id',
    'onSelect:inspect,onQuickBuy:catalogQuickBuy,onHover:hoverAt,pulse:pulseId===item.id',
    'catalog tile quick-buy wiring'
)

css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound Legendary Portrait Rework V5:')
print(' - all 67 Legendary items plus Mythical Sparda receive explicit bespoke canon profiles')
print(' - high-rarity art no longer trusts randomized iconKind or generic sword-family geometry')
print(' - Sparda uses its awakened organic spine/twin-blade/red-gem silhouette instead of a generic sword')
print(' - every high-rarity profile has a unique visual key, composition, materials, and canonical cue set')
print(' - the approved Gauntlet of Six Stones portrait is preserved as the visual benchmark')
print(' - middle mouse / wheel click buys catalog items directly through RIFT_BUY_ITEM without opening detail view')
print(' - left click inspection and recipe double-click purchase remain unchanged')
