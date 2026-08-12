from pathlib import Path
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('037-shop-mythical-visibility-parts')
runtime_path=parts/'01-runtime.js'
styles_path=parts/'02-styles.css'
for path in (bundle_path,css_path,runtime_path,styles_path):
    if not path.is_file(): raise SystemExit(f'Shop Mythical Visibility: missing {path}')

bundle=bundle_path.read_text(); css=css_path.read_text(); runtime=runtime_path.read_text().strip(); styles=styles_path.read_text().strip()
marker='/* Riftbound Shop Mythical Visibility + Build Strip */'
if marker in bundle or marker in css: raise SystemExit('Shop Mythical Visibility: already applied')
if not runtime.startswith(marker) or not styles.startswith(marker): raise SystemExit('Shop Mythical Visibility: payload validation failed')

def replace_once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'Shop Mythical Visibility: {label} expected once, found {count}')
    return text.replace(old,new,1)

# V9 hardening accidentally made Mythicals invisible in the Armory until Floor 35.
# The Armory is explicitly a deterministic full-catalog shop, so availability must not be floor-gated.
old_offers='RIFT_SHOP_OFFERS=function RIFT_V9_SHOP_OFFERS(floor=1,fighter=null){const offers=RIFT_V9_HARDEN_OFFERS(floor,fighter);return Number(floor)<35?offers.filter(item=>item.rarity!==`Mythical`):offers};'
new_offers='RIFT_SHOP_OFFERS=function RIFT_V9_SHOP_OFFERS(floor=1,fighter=null){return RIFT_V9_HARDEN_OFFERS(floor,fighter)};'
bundle=replace_once(bundle,old_offers,new_offers,'remove Mythical floor gate')

# Target only the final V2/V7 production shop override.
shop_anchor='RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){'
shop_start=bundle.rfind(shop_anchor)
if shop_start<0: raise SystemExit('Shop Mythical Visibility: final shop override missing')
shop_end=bundle.find('\n};',shop_start)
if shop_end<0: raise SystemExit('Shop Mythical Visibility: final shop boundary missing')
shop_end+=3
shop=bundle[shop_start:shop_end]
if 'armory-current-build-strip' in shop: raise SystemExit('Shop Mythical Visibility: build strip already wired')
feedback_anchor='    feedback&&(0,E.jsxs)(`div`,{className:`purchase-feedback '
if shop.count(feedback_anchor)!=1: raise SystemExit(f'Shop Mythical Visibility: feedback anchor count {shop.count(feedback_anchor)}')
shop=shop.replace(feedback_anchor,'    (0,E.jsx)(RIFT_SHOP_BUILD_STRIP,{fighter:run.player}),\n'+feedback_anchor,1)

# Define the compact strip immediately before the final shop override so it is available to the production component.
bundle=bundle[:shop_start]+runtime+'\n'+shop+bundle[shop_end:]
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)
print('Applied Shop Mythical Visibility + Build Strip:')
print(' - all 25 Mythicals remain visible in the deterministic Armory on every floor')
print(' - one-Mythical ownership and purchase restrictions remain unchanged')
print(' - current six-slot build is always visible inside the open Armory')
