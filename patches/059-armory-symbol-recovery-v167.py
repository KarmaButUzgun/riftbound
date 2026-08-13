from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
js_path=root/'assets/page-F6OuavDb.js'
if not js_path.is_file(): raise SystemExit(f'V16.7 missing {js_path}')
s=js_path.read_text()
marker='/* Riftbound Armory Symbol Recovery V16.7 */'
if marker in s: raise SystemExit('V16.7 already applied')

# V16.6 replaced the catalog-tile section and accidentally sliced out three V16.4
# shared constants that the final Armory still references at render time.
for name in ('RIFT_V164_CATALOG','RIFT_V164_CATEGORY_COUNTS','RIFT_V164_ITEM_DETAIL_MEMO'):
    if f'const {name}=' in s:
        raise SystemExit(f'V16.7 expected missing {name}, but a definition already exists')

anchor='/* Riftbound Armory Render Isolation V16.6 */'
if s.count(anchor)!=1:
    raise SystemExit(f'V16.7 V16.6 anchor expected once, found {s.count(anchor)}')

defs=marker+'''\nconst RIFT_V164_CATALOG=RIFT_ITEM_CATALOG.slice();\nconst RIFT_V164_CATEGORY_COUNTS=Object.fromEntries(RIFT_ITEM_CATEGORIES.map(category=>[category,RIFT_V164_CATALOG.reduce((count,item)=>count+(item.category===category),0)]));\nconst RIFT_V164_ITEM_DETAIL_MEMO=(0,r.memo)(RIFT_V16_ITEM_DETAIL,(prev,next)=>prev.item===next.item&&prev.fighter===next.fighter&&prev.plan===next.plan&&prev.recommended===next.recommended&&prev.pulseId===next.pulseId&&prev.canBack===next.canBack&&prev.favorite===next.favorite);\n'''
s=s.replace(anchor,defs+anchor,1)
js_path.write_text(s)
print('Applied Riftbound Armory Symbol Recovery V16.7')
print(' - restored cached Armory catalog')
print(' - restored cached category counts')
print(' - restored memoized item detail renderer')
