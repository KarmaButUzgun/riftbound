from pathlib import Path
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('033-shop-performance-v7-parts')
runtime_path=parts/'01-shop-performance-v7.js'
styles_path=parts/'02-shop-performance-v7.css'
for path in (bundle_path,css_path,runtime_path,styles_path):
    if not path.is_file(): raise SystemExit(f'Shop Performance V7: missing {path}')

bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=styles_path.read_text().strip()
js_marker='/* Riftbound Shop Performance V7 · render and compositor optimization */'
css_marker='/* Riftbound Shop Performance V7 · low-churn catalog compositing */'
if not runtime.startswith(js_marker): raise SystemExit('Shop Performance V7: runtime payload failed validation')
if not styles.startswith(css_marker): raise SystemExit('Shop Performance V7: stylesheet payload failed validation')
if js_marker in bundle or css_marker in css: raise SystemExit('Shop Performance V7: already applied')

def replace_once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'Shop Performance V7: {label} expected once, found {count}')
    return text.replace(old,new,1)

# Cache the reverse-recipe lookup used by the detail pane instead of scanning all 181 items
# whenever hover/selection causes the shop shell to render.
bundle=replace_once(
    bundle,
    'buildsInto=RIFT_ITEM_CATALOG.filter(entry=>entry.recipe.includes(item.id))',
    'buildsInto=RIFT_SHOP_PERF_BUILDS_INTO(item.id)',
    'builds-into cache wiring'
)

shop_anchor='RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){'
if bundle.count(shop_anchor)!=1: raise SystemExit(f'Shop Performance V7: final shop anchor expected once, found {bundle.count(shop_anchor)}')

# Remove per-pixel React hover updates from the final catalog tile. Mouse enter still opens
# the same tooltip at a cursor-aware/clamped position; moving inside one tile no longer rerenders 181 cards.
tile_start=bundle.rfind('RIFT_CATALOG_TILE=function RIFT_CATALOG_TILE(',0,bundle.index(shop_anchor))
if tile_start<0: raise SystemExit('Shop Performance V7: final catalog tile override missing')
tile_end=bundle.index(shop_anchor)
tile=bundle[tile_start:tile_end]
tile=replace_once(
    tile,
    'onMouseEnter:event=>onHover?.(item.id,event),onMouseMove:event=>onHover?.(item.id,event),onMouseLeave:',
    'onMouseEnter:event=>onHover?.(item.id,event),onMouseLeave:',
    'catalog mousemove churn removal'
)
bundle=bundle[:tile_start]+tile+bundle[tile_end:]

# Memo wrappers must be initialized after the final V5 tile/detail functions exist, but before
# the shop function is invoked. The original functions remain available for existing verifiers.
bundle=bundle.replace(shop_anchor,runtime+'\n'+shop_anchor,1)
shop_start=bundle.index(shop_anchor)
shop_end=bundle.index('function Ea(',shop_start)
shop=bundle[shop_start:shop_end]

shop=replace_once(
    shop,
    'RIFT_NORMALIZE_RUN_BUILD(run);const catalog=RIFT_SHOP_OFFERS(run.floor,run.player),launchRef=(0,r.useRef)(null);',
    'RIFT_NORMALIZE_RUN_BUILD(run);const catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,run.player),[run.floor,run.player]),launchRef=(0,r.useRef)(null);',
    'catalog memoization'
)
shop=replace_once(
    shop,
    'const recommendedIds=RIFT_RECOMMENDED_ITEMS(run.player,catalog,10),recommended=new Set(recommendedIds),normalizedQuery=query.trim().toLowerCase();',
    'const recommendedIds=(0,r.useMemo)(()=>RIFT_RECOMMENDED_ITEMS(run.player,catalog,10),[run.player,catalog]),recommended=(0,r.useMemo)(()=>new Set(recommendedIds),[recommendedIds]),normalizedQuery=query.trim().toLowerCase();',
    'recommendation memoization'
)
shop=replace_once(
    shop,
    '(!normalizedQuery||`${item.name} ${item.category} ${item.rarity} ${item.passive} ${item.lore} ${item.reference} ${RIFT_ITEM_STAT_TEXT(item)}`.toLowerCase().includes(normalizedQuery))',
    '(!normalizedQuery||RIFT_SHOP_PERF_SEARCH_TEXT(item).includes(normalizedQuery))',
    'search-index cache wiring'
)
shop=replace_once(
    shop,
    'plan=selected?RIFT_RECIPE_PLAN(run.player,selected.id):null,profile=RIFT_BUILD_PROFILE(run.player)',
    'plan=(0,r.useMemo)(()=>selected?RIFT_RECIPE_PLAN(run.player,selected.id):null,[run.player,selected?.id]),profile=(0,r.useMemo)(()=>RIFT_BUILD_PROFILE(run.player),[run.player])',
    'detail plan/profile memoization'
)
shop=replace_once(
    shop,
    'const hoverAt=(id,event)=>{if(!id){setHover(null);return}setHover({id,x:event?.clientX??0,y:event?.clientY??0})};',
    'const hoverAt=(id,event)=>{if(!id){setHover(current=>current?null:current);return}const x=event?.clientX??0,y=event?.clientY??0;setHover(current=>current?.id===id?current:{id,x,y})};',
    'hover state dedupe'
)
shop=replace_once(
    shop,
    '(0,E.jsx)(RIFT_CATALOG_TILE,{item,fighter:run.player,selected:selected?.id===item.id,recommended:recommended.has(item.id),onSelect:inspect,onQuickBuy:catalogQuickBuy,onHover:hoverAt,pulse:pulseId===item.id},item.id)',
    '(0,E.jsx)(RIFT_CATALOG_TILE_MEMO,{item,fighter:run.player,selected:selected?.id===item.id,recommended:recommended.has(item.id),onSelect:inspect,onQuickBuy:catalogQuickBuy,onHover:hoverAt,pulse:pulseId===item.id},item.id)',
    'memoized catalog tile rendering'
)
shop=replace_once(
    shop,
    '(0,E.jsx)(RIFT_ITEM_DETAIL,{item:selected,fighter:run.player,plan,onBuy:buySelected,onSelect:inspect,onQuickBuy:quickBuy,onHover:hoverAt,recommended:recommended.has(selected?.id),pulseId})',
    '(0,E.jsx)(RIFT_ITEM_DETAIL_MEMO,{item:selected,fighter:run.player,plan,onBuy:buySelected,onSelect:inspect,onQuickBuy:quickBuy,onHover:hoverAt,recommended:recommended.has(selected?.id),pulseId})',
    'memoized item detail rendering'
)
shop=replace_once(
    shop,
    '(0,E.jsx)(RIFT_INVENTORY_MANAGER,{run,onCommit})',
    '(0,E.jsx)(RIFT_INVENTORY_MANAGER_MEMO,{run,onCommit})',
    'memoized inventory rendering'
)

bundle=bundle[:shop_start]+shop+bundle[shop_end:]
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound Shop Performance V7:')
print(' - catalog tiles, detail pane, and inventory are memoized across hover-only shop renders')
print(' - catalog hover no longer writes React state on every mousemove pixel')
print(' - catalog/recommendation/recipe-plan/build-profile/search/reverse-recipe work is cached or memoized')
print(' - offscreen tiles use content-visibility and strict paint/layout containment')
print(' - expensive fullscreen and sticky-header backdrop blur is removed during catalog scrolling')
print(' - item portraits, recipes, purchase logic, middle-click quick-buy, and shop layout are unchanged')
