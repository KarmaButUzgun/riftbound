from pathlib import Path
import sys

root=Path(sys.argv[1]); path=root/'assets/page-F6OuavDb.js'
if not path.is_file(): raise SystemExit('V13.1 shopFighter TDZ hotfix: bundle missing')
text=path.read_text()
marker='/* Riftbound V13.1 shopFighter TDZ hotfix */'
if marker in text: raise SystemExit('V13.1 shopFighter TDZ hotfix already applied')

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1: raise SystemExit(f'V13.1 shopFighter TDZ hotfix {label}: expected one anchor, found {count}')
    text=text.replace(old,new,1)

# V13 originally rewired the catalog memo to use shopFighter, but declared shopFighter
# later in the same component after the memo had already evaluated. Move the owner hook
# and derived owner fighter ahead of the first shopFighter read.
once(
'''RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){\n  RIFT_NORMALIZE_RUN_BUILD(run);const catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,shopFighter),[run.floor,shopFighter]),launchRef=(0,r.useRef)(null);''',
'''RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){\n  RIFT_NORMALIZE_RUN_BUILD(run);const [shopOwner,setShopOwner]=(0,r.useState)(`yuta`),rikaShop=RIFT_CURSED_CHILD(run.player)&&shopOwner===`rika`,shopFighter=rikaShop?RIFT_V13_RIKA_SHOP_FIGHTER(run):run.player,catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,shopFighter),[run.floor,shopFighter]),launchRef=(0,r.useRef)(null);''',
'early owner initialization')

once(
'''[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false),[shopOwner,setShopOwner]=(0,r.useState)(`yuta`);const rikaShop=RIFT_CURSED_CHILD(run.player)&&shopOwner===`rika`,shopFighter=rikaShop?RIFT_V13_RIKA_SHOP_FIGHTER(run):run.player;''',
'''[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false);''',
'remove late owner initialization')

# Leave an explicit production marker beside the final component for deployment/debug audits.
text=text.replace('RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){',marker+'\nRIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){',1)
path.write_text(text)
print('Applied V13.1: shopOwner/rikaShop/shopFighter now initialize before the Armory catalog memo, eliminating the production TDZ crash.')
