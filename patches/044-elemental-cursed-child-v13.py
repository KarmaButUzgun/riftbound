from pathlib import Path
import sys

root=Path(sys.argv[1]); bundle_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
if not bundle_path.is_file() or not css_path.is_file(): raise SystemExit('V13: production bundle/CSS missing')
bundle=bundle_path.read_text(); css=css_path.read_text(); marker='/* Riftbound Elemental + Cursed Child Rework V13 */'
if marker in bundle or marker in css: raise SystemExit('V13 already applied')
parts=Path(__file__).with_name('044-elemental-cursed-child-v13-parts')
runtime=(parts/'01-runtime-v13.js').read_text(); styles=(parts/'02-styles-v13.css').read_text()

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V13 {label}: expected one anchor, found {count}')
    return text.replace(old,new,1)

# Add two first-class catalog items before the frozen final catalog/reference-lore normalization pass.
# combineCost lives directly on the objects so it is present before the catalog freeze in every build path.
old='''RIFT_ITEMIZATION_REWORK_CATALOG(items,add);\n\n  for(const RIFT_REFERENCE_LORE_ITEM of items){'''
insert='''RIFT_ITEMIZATION_REWORK_CATALOG(items,add);\n\n  add({"id":"the-namegiver","name":"The Namegiver","rarity":"Mythical","category":"Relic","price":2100,"combineCost":90,"stats":{},"recipe":["death-note-fragment","grimoire-of-infinite-pages"],"glyph":"أ","accent":"#c9a9ff","lore":"The essence of the Demon King ‘Esma’. Creating a new future for us all, a future he himself would regret. The Namegiver makes ideas real, a power desired by the worst creatures.","passive":"+20% Armor Penetration. Give Name: once per fight, make your next ability Causality-Level. If it was already Causality-Level, reduce its cooldown by 1 turn; a Causality-Level Ultimate begins again at 30% charge after use. Causality-Level healing can restore normally unhealable damage.","passiveId":"namegiver","reference":"Beneath The Drowning","tags":["mythical","build-defining","causality-item"]});\n  add({"id":"simple-domain-manual","name":"Simple Domain Manual","rarity":"Legendary","category":"Magic","price":1030,"combineCost":261,"stats":{"ap":7,"combatSkill":4},"recipe":["sorcerer's-index","causal-abacus","anti-magic-carapace"],"glyph":"簡","accent":"#85ddff","lore":"A jujutsu manual preserving the anti-domain technique of planting a small barrier around the user and stripping guaranteed techniques of their sure-hit authority.","passive":"Simple Domain: create a destructible barrier around yourself. Sure-hit effects cannot resolve on you while it stands. Moving or doing anything except Guarding or Resting collapses it.","passiveId":"simpleDomainManual","cooldown":10,"reference":"Jujutsu Kaisen","tags":["anti-domain","sure-hit-counter","build-defining"]});\n\n  for(const RIFT_REFERENCE_LORE_ITEM of items){'''
bundle=once(bundle,old,insert,'item catalog insertion')

# The starter intermission must enter Floor 1, not advance the run to Floor 2.
old='''e.routeHistory.push(t.id),e.routeHistory=e.routeHistory.slice(-20),e.floor+=1,e.turn=1,e.combatSnapshots=[]'''
new='''e.routeHistory.push(t.id),e.routeHistory=e.routeHistory.slice(-20),e.v13StarterIntermission?delete e.v13StarterIntermission:e.floor+=1,e.turn=1,e.combatSnapshots=[]'''
bundle=once(bundle,old,new,'starter Floor 1 route transition')

# Starter-intermission copy is cosmetic; late UI wrappers may own a different exact JSX shape.
old='''w.phase===`intermission`&&(0,E.jsxs)(`div`,{className:`intermission`,children:[(0,E.jsxs)(`div`,{className:`intermission-copy`,children:[(0,E.jsxs)(`span`,{className:`eyebrow`,children:[(0,E.jsx)(`i`,{}),` FLOOR ${w.floor} CLEARED`]}),(0,E.jsxs)(`h1`,{children:[`THE RIFT`,(0,E.jsx)(`br`,{}),(0,E.jsx)(`em`,{children:`OFFERS A BREATH.`})]}),(0,E.jsx)(`p`,{children:`Spend your Shards, study the next routes, then choose how the descent continues.`})]}),'''
new='''w.phase===`intermission`&&(0,E.jsxs)(`div`,{className:`intermission ${w.v13StarterIntermission?`v13-starter-armory`:``}`,children:[(0,E.jsxs)(`div`,{className:`intermission-copy`,children:[(0,E.jsxs)(`span`,{className:`eyebrow`,children:[(0,E.jsx)(`i`,{}),w.v13StarterIntermission?` STARTER ARMORY · FLOOR 1 AHEAD`:` FLOOR ${w.floor} CLEARED`]}),(0,E.jsxs)(`h1`,{children:w.v13StarterIntermission?[`PREPARE`,(0,E.jsx)(`br`,{}),(0,E.jsx)(`em`,{children:`BEFORE THE RIFT.`})]:[`THE RIFT`,(0,E.jsx)(`br`,{}),(0,E.jsx)(`em`,{children:`OFFERS A BREATH.`})]}),(0,E.jsx)(`p`,{children:w.v13StarterIntermission?`You begin with 200 Shards. Buy a starter item, inspect your build, then choose the first route into Floor 1.`:`Spend your Shards, study the next routes, then choose how the descent continues.`})]}),'''
if old in bundle: bundle=bundle.replace(old,new,1)

# Simple Domain must intercept Infinite Void's direct stun path, which does not pass through the generic damage resolver.
old='''n||(o.forEach(e=>{e.fighter.statuses.infiniteVoidStun=Math.max(t?2:3,e.fighter.statuses.infiniteVoidStun||0),delete e.fighter.statuses.stun}),i.statuses.limitlessCooldown=5'''
new='''n||(o.forEach(x=>{if(RIFT_V13_SIMPLE_ACTIVE(e,x.fighter))return;x.fighter.statuses.infiniteVoidStun=Math.max(t?2:3,x.fighter.statuses.infiniteVoidStun||0),delete x.fighter.statuses.stun}),i.statuses.limitlessCooldown=5'''
bundle=once(bundle,old,new,'Infinite Void Simple Domain guard')

# Patch the authoritative V11/V2 Armory override, not an older historical shop body.
shop_anchor='RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){'
shop_start=bundle.rfind(shop_anchor)
if shop_start<0: raise SystemExit('V13 final Armory override missing')
shop_end=bundle.find('\n};',shop_start)
if shop_end<0: raise SystemExit('V13 final Armory boundary missing')
shop_end+=3
shop=bundle[shop_start:shop_end]
shop=once(shop,
'''[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false);''',
'''[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false),[shopOwner,setShopOwner]=(0,r.useState)(`yuta`);const rikaShop=RIFT_CURSED_CHILD(run.player)&&shopOwner===`rika`,shopFighter=rikaShop?RIFT_V13_RIKA_SHOP_FIGHTER(run):run.player;''',
'Armory owner state')
shop=once(shop,'RIFT_SHOP_OFFERS(run.floor,run.player)','RIFT_SHOP_OFFERS(run.floor,shopFighter)','Armory owner catalog')
shop=shop.replace('RIFT_RECOMMENDED_ITEMS(run.player,catalog,10)','RIFT_RECOMMENDED_ITEMS(shopFighter,catalog,10)')
shop=shop.replace('RIFT_RECIPE_PLAN(run.player,selected.id)','RIFT_RECIPE_PLAN(shopFighter,selected.id)')
shop=shop.replace('RIFT_BUILD_PROFILE(run.player)','RIFT_BUILD_PROFILE(shopFighter)')
shop=shop.replace('run.player.inventory.filter(Boolean).length','(rikaShop?RIFT_V13_NORMALIZE_RIKA_STORAGE(run.player):run.player.inventory).filter(Boolean).length')
shop=shop.replace('fighter:run.player','fighter:shopFighter')
shop=shop.replace('RIFT_ITEM_TOOLTIP,{item:hoverItem,fighter:run.player','RIFT_ITEM_TOOLTIP,{item:hoverItem,fighter:shopFighter')
shop=shop.replace('RIFT_CATALOG_TILE,{item,fighter:run.player','RIFT_CATALOG_TILE,{item,fighter:shopFighter')
shop=shop.replace('RIFT_ITEM_DETAIL,{item:selected,fighter:run.player','RIFT_ITEM_DETAIL,{item:selected,fighter:shopFighter')
shop=shop.replace('const next=P(run),result=RIFT_BUY_ITEM(next,selected.id);','const next=P(run),result=rikaShop?RIFT_V13_RIKA_ITEM(next,selected.id):RIFT_BUY_ITEM(next,selected.id);')
shop=shop.replace('const next=P(run),result=RIFT_BUY_ITEM(next,id);','const next=P(run),result=rikaShop?RIFT_V13_RIKA_ITEM(next,id):RIFT_BUY_ITEM(next,id);')
shop=once(shop,
'''(0,E.jsxs)(`button`,{type:`button`,className:`armory-loadout-toggle`,onClick:()=>setLoadoutOpen(open=>!open),"aria-expanded":loadoutOpen,children:[loadoutOpen?`HIDE BUILD TOOLS · `:`MANAGE BUILD · `,ownedCount,`/6`]}),''',
'''RIFT_CURSED_CHILD(run.player)&&(0,E.jsx)(`button`,{type:`button`,className:`v13-rika-shop-toggle ${rikaShop?`active`:``}`,onClick:()=>{setShopOwner(v=>v===`rika`?`yuta`:`rika`);setSelectedId(null);setHover(null);setFeedback(null)},children:rikaShop?`VIEW YUTA BUILD`:`VIEW RIKA BUILD`}),(0,E.jsxs)(`button`,{type:`button`,className:`armory-loadout-toggle`,onClick:()=>setLoadoutOpen(open=>!open),"aria-expanded":loadoutOpen,children:[loadoutOpen?`HIDE BUILD TOOLS · `:`MANAGE BUILD · `,ownedCount,`/6`]}),''',
'Rika Armory toggle')
shop=once(shop,
'''(0,E.jsx)(`div`,{className:`armory-loadout-wrap ${loadoutOpen?`is-open`:`is-collapsed`}`,children:(0,E.jsx)(RIFT_INVENTORY_MANAGER,{run,onCommit})})''',
'''(0,E.jsx)(`div`,{className:`armory-loadout-wrap ${loadoutOpen?`is-open`:`is-collapsed`}`,children:rikaShop?(0,E.jsx)(RIFT_V13_RIKA_INVENTORY_MANAGER,{run,onCommit}):(0,E.jsx)(RIFT_INVENTORY_MANAGER,{run,onCommit})})''',
'Rika Armory inventory manager')
bundle=bundle[:shop_start]+shop+bundle[shop_end:]

# Runtime goes last so it wraps all prior systems and owns final gameplay behavior.
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V13 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css+='\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied V13: Cryo/Pyro reworks, killable equipped Rika, Namegiver, Simple Domain Manual, and 200-Shard starter Armory.')
