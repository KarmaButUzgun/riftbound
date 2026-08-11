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

anchor='function Ea('
if bundle.count(anchor)!=1: raise SystemExit(f'Reference Lore V6: late runtime anchor expected once, found {bundle.count(anchor)}')
bundle=bundle.replace(anchor,payload+'\n'+anchor,1)
bundle_path.write_text(bundle)
print('Applied Riftbound Reference Lore Rewrite V6:')
print(' - all 79 externally-referenced catalog items receive bespoke in-world lore')
print(' - generic reference/translation/fourth-wall phrasing is removed from final item descriptions')
print(' - existing item mechanics, prices, portraits, recipes, and source labels are unchanged')
