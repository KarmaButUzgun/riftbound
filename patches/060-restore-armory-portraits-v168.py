from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
js_path=root/'assets/page-F6OuavDb.js'
if not js_path.is_file(): raise SystemExit(f'V16.8 missing {js_path}')
s=js_path.read_text()
marker='/* Riftbound Armory Portrait Restoration V16.8 */'
if marker in s: raise SystemExit('V16.8 already applied')

old='children:[(0,E.jsx)(RIFT_V166_CATALOG_ICON,{item,pulse}),(0,E.jsx)(`strong`,{children:item.name})'
new='children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`small`,pulse}),(0,E.jsx)(`strong`,{children:item.name})'
if s.count(old)!=1:
    raise SystemExit(f'V16.8 catalog portrait anchor expected once, found {s.count(old)}')
s=s.replace(old,new,1)

# V16.6 introduced silhouette-only catalog helpers. Once the original authored
# RIFT_ITEM_ICON portrait renderer is back in the tile, remove those dead helpers
# so the optimization cannot silently fall back to portrait-less browse art again.
helper_start=s.find('function RIFT_V166_CATALOG_FAMILY(item)')
tile_start=s.find('function RIFT_V16_CATALOG_TILE(', helper_start)
if helper_start<0 or tile_start<0:
    raise SystemExit('V16.8 could not locate V16.6 silhouette helper block')
s=s[:helper_start]+marker+'\n'+s[tile_start:]

js_path.write_text(s)
print('Applied Riftbound Armory Portrait Restoration V16.8')
print(' - restored authored item portraits in catalog tiles')
print(' - retained V16.5/V16.6 virtualization and memoization')
print(' - removed dead silhouette-only catalog renderer')
