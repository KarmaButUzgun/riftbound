from pathlib import Path
import sys

root=Path(sys.argv[1]); path=root/'assets/page-F6OuavDb.js'
if not path.is_file(): raise SystemExit('V13 shop memo hardening: bundle missing')
text=path.read_text()

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1: raise SystemExit(f'V13 shop memo hardening {label}: expected one anchor, found {count}')
    text=text.replace(old,new,1)

once(
'catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,shopFighter),[run.floor,run.player])',
'catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,shopFighter),[run.floor,shopFighter])',
'catalog owner dependency')
once(
'recommendedIds=(0,r.useMemo)(()=>RIFT_RECOMMENDED_ITEMS(shopFighter,catalog,10),[run.player,catalog])',
'recommendedIds=(0,r.useMemo)(()=>RIFT_RECOMMENDED_ITEMS(shopFighter,catalog,10),[shopFighter,catalog])',
'recommendation owner dependency')
once(
'plan=(0,r.useMemo)(()=>selected?RIFT_RECIPE_PLAN(shopFighter,selected.id):null,[run.player,selected?.id]),profile=(0,r.useMemo)(()=>RIFT_BUILD_PROFILE(shopFighter),[run.player])',
'plan=(0,r.useMemo)(()=>selected?RIFT_RECIPE_PLAN(shopFighter,selected.id):null,[shopFighter,selected?.id]),profile=(0,r.useMemo)(()=>RIFT_BUILD_PROFILE(shopFighter),[shopFighter])',
'plan/profile owner dependencies')

path.write_text(text)
print('Hardened V13 Rika Armory memo dependencies: catalog, recommendations, recipe plan, and build profile now follow the active inventory owner.')
