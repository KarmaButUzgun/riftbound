from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
js_path=root/'assets/page-F6OuavDb.js'
if not js_path.is_file(): raise SystemExit(f'V16.8 missing {js_path}')
s=js_path.read_text()
marker='/* Riftbound Armory Portrait Restoration V16.8 */'
if marker in s: raise SystemExit('V16.8 already applied')

# The V16.6 lightweight silhouette is intentional only in the scrolling catalog.
# Keep that optimized catalog path, while preserving the original authored
# RIFT_ITEM_ICON portraits everywhere else (hover cards, detail, recipes,
# inventory/loadouts and other item surfaces).
anchor='function RIFT_V16_CATALOG_TILE({item,fighter,selected,recommended,favorite,onSelect,onQuickBuy,onHover,onFavorite,pulse=false})'
if s.count(anchor)!=1:
    raise SystemExit(f'V16.8 catalog tile anchor expected once, found {s.count(anchor)}')
if s.count('children:[(0,E.jsx)(RIFT_V166_CATALOG_ICON,{item,pulse}),(0,E.jsx)(`strong`,{children:item.name})')!=1:
    raise SystemExit('V16.8 expected catalog-only silhouette renderer')
if 'function RIFT_V166_CATALOG_ICON' not in s:
    raise SystemExit('V16.8 missing lightweight catalog icon helper')
if 'RIFT_ITEM_TOOLTIP,{item:hoverItem,fighter,point:localHover}' not in s:
    raise SystemExit('V16.8 missing rich authored hover preview path')
s=s.replace(anchor,marker+'\n'+anchor,1)

js_path.write_text(s)
print('Applied Riftbound Armory Portrait Split V16.8')
print(' - lightweight silhouettes remain only in the scrolling catalog grid')
print(' - authored portraits remain in hover, detail, recipe, loadout, inventory, and other surfaces')
print(' - V16.5/V16.6 virtualization and memoization remain intact')
