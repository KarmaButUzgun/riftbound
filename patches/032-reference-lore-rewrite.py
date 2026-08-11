from pathlib import Path
import re
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
parts=Path(__file__).with_name('032-reference-lore-rewrite-parts')
payload_path=parts/'01-reference-lore-v6.js'
for path in (bundle_path,payload_path):
    if not path.is_file(): raise SystemExit(f'Reference Lore V6: missing {path}')

bundle=bundle_path.read_text()
payload=payload_path.read_text().strip()
marker='/* Riftbound Reference Lore Rewrite V6 · in-world copy for every external artifact */'
if not payload.startswith(marker): raise SystemExit('Reference Lore V6: runtime payload failed validation')
if marker in bundle: raise SystemExit('Reference Lore V6: already applied')
entry_count=len(re.findall(r"^  '[^']+':`",payload,re.M))
if entry_count!=79: raise SystemExit(f'Reference Lore V6: expected 79 authored lore entries, found {entry_count}')

# The catalog freezes every item before RIFT_ITEM_CATALOG escapes its constructor.
# Keep the authored map top-level for verification, but apply it inside the constructor
# immediately before combine-cost calculation / Object.freeze.
loop_marker='\nfor(const RIFT_REFERENCE_LORE_ITEM of RIFT_ITEM_CATALOG){'
loop_at=payload.find(loop_marker)
if loop_at<0: raise SystemExit('Reference Lore V6: payload application loop marker missing')
map_payload=payload[:loop_at].rstrip()

catalog_anchor='const RIFT_ITEM_CATALOG = (() => {'
if bundle.count(catalog_anchor)!=1: raise SystemExit(f'Reference Lore V6: catalog anchor expected once, found {bundle.count(catalog_anchor)}')
bundle=bundle.replace(catalog_anchor,map_payload+'\n'+catalog_anchor,1)

freeze_anchor='  const byId = new Map(items.map(item => [item.id, item]));'
if bundle.count(freeze_anchor)!=1: raise SystemExit(f'Reference Lore V6: pre-freeze anchor expected once, found {bundle.count(freeze_anchor)}')
apply_payload='''  for(const RIFT_REFERENCE_LORE_ITEM of items){
    const RIFT_REFERENCE_LORE_COPY=RIFT_REFERENCE_LORE_V6[RIFT_REFERENCE_LORE_ITEM.id];
    if(RIFT_REFERENCE_LORE_COPY)RIFT_REFERENCE_LORE_ITEM.lore=RIFT_REFERENCE_LORE_COPY;
  }
'''
bundle=bundle.replace(freeze_anchor,apply_payload+freeze_anchor,1)

bundle_path.write_text(bundle)
print('Applied Riftbound Reference Lore Rewrite V6:')
print(' - all 79 externally-referenced catalog items receive bespoke in-world lore before catalog freeze')
print(' - generic reference/translation/fourth-wall phrasing is removed from final item descriptions')
print(' - existing item mechanics, prices, portraits, recipes, source labels, and catalog immutability are unchanged')
