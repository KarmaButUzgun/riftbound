from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
js_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
if not js_path.is_file() or not css_path.is_file(): raise SystemExit('V16.4 missing built assets')
s=js_path.read_text(); css=css_path.read_text()
marker='/* Riftbound Armory Smoothness + Spiral Uncap V16.4 */'
if marker in s: raise SystemExit('V16.4 already applied')

def rep(old,new,label,count=1):
    global s
    n=s.count(old)
    if n!=count: raise SystemExit(f'V16.4 {label}: expected {count}, found {n}')
    s=s.replace(old,new,count)

# Spiral Energy must survive every normal build refresh. Preserve overflow above maxEnergy while item-derived max Energy changes.
old='fighter.maxEnergy=Math.max(1,fighter.maxEnergy+energyDelta);fighter.energy=energyDelta>=0?Math.min(fighter.maxEnergy,fighter.energy+energyDelta):Math.min(fighter.energy,fighter.maxEnergy);'
new='let v164SpiralOverflow=In(fighter)?Math.max(0,fighter.energy-fighter.maxEnergy):0,v164SpiralBase=In(fighter)?Math.min(fighter.energy,fighter.maxEnergy):0;fighter.maxEnergy=Math.max(1,fighter.maxEnergy+energyDelta);fighter.energy=In(fighter)?Math.max(0,Math.min(fighter.maxEnergy,v164SpiralBase+(energyDelta>0?energyDelta:0))+v164SpiralOverflow):energyDelta>=0?Math.min(fighter.maxEnergy,fighter.energy+energyDelta):Math.min(fighter.energy,fighter.maxEnergy);'
rep(old,new,'Spiral refresh overflow')

# Other generic restore/rewind paths must not silently clamp Spiral storage either.
rep('r.energy=Math.min(r.maxEnergy,n.energy),r.ultimate=M(n.ultimate,0,100)', 'r.energy=In(r)?Math.max(0,n.energy):Math.min(r.maxEnergy,n.energy),r.ultimate=M(n.ultimate,0,100)', 'RTZ Spiral restore')
rep('r===`energy`&&(n.maxEnergy=Math.min(n.maxEnergy,Zr(n,n.tiers.energy)),n.energy=Math.min(n.energy,n.maxEnergy))', 'r===`energy`&&(n.maxEnergy=Math.min(n.maxEnergy,Zr(n,n.tiers.energy)),n.energy=In(n)?Math.max(0,n.energy):Math.min(n.energy,n.maxEnergy))', 'Devil pact Spiral preservation')
for old,new,label in [
 ('target.energy=Math.min(target.maxEnergy,target.energy+Math.round(target.maxEnergy*.35))','target.energy=In(target)?target.energy+Math.round(target.maxEnergy*.35):Math.min(target.maxEnergy,target.energy+Math.round(target.maxEnergy*.35))','Sevenfold Spiral gain'),
 ('attacker.energy=Math.min(attacker.maxEnergy,attacker.energy+5)','attacker.energy=In(attacker)?attacker.energy+5:Math.min(attacker.maxEnergy,attacker.energy+5)','Witcher Spiral gain'),
 ('attacker.energy=Math.min(attacker.maxEnergy,attacker.energy+Math.round(attacker.maxEnergy*.14))','attacker.energy=In(attacker)?attacker.energy+Math.round(attacker.maxEnergy*.14):Math.min(attacker.maxEnergy,attacker.energy+Math.round(attacker.maxEnergy*.14))','Argent Spiral gain'),
 ('fighter.energy=Math.min(fighter.maxEnergy,fighter.energy+tt.cost)','fighter.energy=In(fighter)?fighter.energy+tt.cost:Math.min(fighter.maxEnergy,fighter.energy+tt.cost)','Time Turner Spiral gain'),
 ('loser.energy=Math.min(loser.maxEnergy,loser.energy+Math.round(loser.maxEnergy*.12))','loser.energy=In(loser)?loser.energy+Math.round(loser.maxEnergy*.12):Math.min(loser.maxEnergy,loser.energy+Math.round(loser.maxEnergy*.12))','Puzzle Spiral gain'),
]: rep(old,new,label)

# Armory: keep expensive normalization off local hover/filter rerenders and stabilize Rika fighter identity.
rep('RIFT_NORMALIZE_RUN_BUILD(run);RIFT_V16_NORMALIZE_RUN(run);const initialOwner=', '(0,r.useMemo)(()=>{RIFT_NORMALIZE_RUN_BUILD(run);RIFT_V16_NORMALIZE_RUN(run);return run},[run]);const initialOwner=', 'normalize once per run prop')
old_sf='shopFighter=rikaShop?RIFT_V13_RIKA_SHOP_FIGHTER(run):run.player,catalog=(0,r.useMemo)(()=>RIFT_SHOP_OFFERS(run.floor,shopFighter),[run.floor,shopFighter])'
pos=s.rfind(old_sf)
if pos<0: raise SystemExit('V16.4 stable shop fighter/catalog anchor missing')
s=s[:pos]+'shopFighter=(0,r.useMemo)(()=>rikaShop?RIFT_V13_RIKA_SHOP_FIGHTER(run):run.player,[run,rikaShop]),catalog=RIFT_V164_CATALOG'+s[pos+len(old_sf):]

old_memo='const RIFT_V16_CATALOG_TILE_MEMO=(0,r.memo)(RIFT_V16_CATALOG_TILE);'
new_memo=marker+'''\nconst RIFT_V164_CATALOG=RIFT_ITEM_CATALOG.slice();\nconst RIFT_V164_CATEGORY_COUNTS=Object.fromEntries(RIFT_ITEM_CATEGORIES.map(category=>[category,RIFT_V164_CATALOG.reduce((count,item)=>count+(item.category===category),0)]));\nconst RIFT_V164_ITEM_DETAIL_MEMO=(0,r.memo)(RIFT_V16_ITEM_DETAIL,(prev,next)=>prev.item===next.item&&prev.fighter===next.fighter&&prev.plan===next.plan&&prev.recommended===next.recommended&&prev.pulseId===next.pulseId&&prev.canBack===next.canBack&&prev.favorite===next.favorite);\nconst RIFT_V16_CATALOG_TILE_MEMO=(0,r.memo)(RIFT_V16_CATALOG_TILE,(prev,next)=>prev.item===next.item&&prev.fighter===next.fighter&&prev.selected===next.selected&&prev.recommended===next.recommended&&prev.favorite===next.favorite&&prev.pulse===next.pulse);'''
rep(old_memo,new_memo,'memoized tiles/detail')

old_block=''' const favorites=(0,r.useMemo)(()=>RIFT_V16_FAVORITE_IDS(shopFighter),[shopFighter,favoriteVersion]),guide=RIFT_V16_GUIDE(shopFighter),recommendedIds=guide.core,recommended=new Set(recommendedIds),normalizedQuery=query.trim().toLowerCase();\n const statMatch=item=>statFilter===`All`||(statFilter===`AS`&&(item.stats?.as||0)>0)||(statFilter===`AP`&&(item.stats?.ap||0)>0)||(statFilter===`Defense`&&((item.stats?.durability||0)>0||(item.stats?.regeneration||0)>0))||(statFilter===`Utility`&&[`speed`,`energy`,`range`,`battleIq`,`iq`,`combatSkill`].some(key=>(item.stats?.[key]||0)>0));\n const filtered=catalog.filter(item=>(view!==`Favorites`||favorites.has(item.id))&&(category===`All`||item.category===category)&&(rarity===`All`||item.rarity===rarity)&&statMatch(item)&&(!normalizedQuery||RIFT_SHOP_PERF_SEARCH_TEXT(item).includes(normalizedQuery))),groups=RIFT_ITEM_RARITIES.map(tier=>({tier,items:filtered.filter(item=>item.rarity===tier)})).filter(group=>group.items.length),selected=RIFT_ITEM(selectedId)||catalog[0]||null,plan=(0,r.useMemo)(()=>selected?RIFT_RECIPE_PLAN(shopFighter,selected.id):null,[shopFighter,selected?.id]),profile=(0,r.useMemo)(()=>RIFT_BUILD_PROFILE(shopFighter),[shopFighter]),ownedCount=(rikaShop?RIFT_V13_NORMALIZE_RIKA_STORAGE(run.player):run.player.inventory).filter(Boolean).length,hoverItem=hover?.id?RIFT_ITEM(hover.id):null;\n'''
new_block=''' const favorites=(0,r.useMemo)(()=>RIFT_V16_FAVORITE_IDS(shopFighter),[shopFighter,favoriteVersion]),guide=(0,r.useMemo)(()=>RIFT_V16_GUIDE(shopFighter),[shopFighter]),recommendedIds=guide.core,recommended=(0,r.useMemo)(()=>new Set(recommendedIds),[recommendedIds]),normalizedQuery=query.trim().toLowerCase();\n const filtered=(0,r.useMemo)(()=>catalog.filter(item=>(view!==`Favorites`||favorites.has(item.id))&&(category===`All`||item.category===category)&&(rarity===`All`||item.rarity===rarity)&&(statFilter===`All`||(statFilter===`AS`&&(item.stats?.as||0)>0)||(statFilter===`AP`&&(item.stats?.ap||0)>0)||(statFilter===`Defense`&&((item.stats?.durability||0)>0||(item.stats?.regeneration||0)>0))||(statFilter===`Utility`&&[`speed`,`energy`,`range`,`battleIq`,`iq`,`combatSkill`].some(key=>(item.stats?.[key]||0)>0)))&&(!normalizedQuery||RIFT_SHOP_PERF_SEARCH_TEXT(item).includes(normalizedQuery))),[catalog,view,favorites,category,rarity,statFilter,normalizedQuery]),groups=(0,r.useMemo)(()=>RIFT_ITEM_RARITIES.map(tier=>({tier,items:filtered.filter(item=>item.rarity===tier)})).filter(group=>group.items.length),[filtered]),selected=RIFT_ITEM(selectedId)||catalog[0]||null,plan=(0,r.useMemo)(()=>selected?RIFT_RECIPE_PLAN(shopFighter,selected.id):null,[shopFighter,selected?.id]),ownedCount=(0,r.useMemo)(()=>(rikaShop?RIFT_V13_NORMALIZE_RIKA_STORAGE(run.player):run.player.inventory).filter(Boolean).length,[run,rikaShop]),hoverItem=hover?.id?RIFT_ITEM(hover.id):null;\n'''
rep(old_block,new_block,'memoize derived catalog work')
old_cc='catalog.filter(item=>item.category===value).length'
pos=s.rfind(old_cc)
if pos<0: raise SystemExit('V16.4 category count anchor missing')
s=s[:pos]+'RIFT_V164_CATEGORY_COUNTS[value]||0'+s[pos+len(old_cc):]
rep('onScroll:event=>{let mem=RIFT_V16_ARMORY_MEMORY(run,shopOwner,catalog);mem.catalogScroll=event.currentTarget.scrollTop}', 'onScroll:event=>{let mem=run.v16Armory?.[shopOwner];if(mem)mem.catalogScroll=event.currentTarget.scrollTop}', 'scroll memory fast path')
rep('(0,E.jsx)(RIFT_V16_ITEM_DETAIL,{item:selected,fighter:shopFighter,plan,onBuy:buySelected,onSelect:inspectNested,onRecipeBuy:recipeBuy,onHover:hoverAt,recommended:recommended.has(selected?.id),pulseId,onBack:goBack,canBack:history.length>0,favorite:favorites.has(selected?.id),onFavorite:()=>selected&&toggleFavorite(selected.id),detailRef})', '(0,E.jsx)(RIFT_V164_ITEM_DETAIL_MEMO,{item:selected,fighter:shopFighter,plan,onBuy:buySelected,onSelect:inspectNested,onRecipeBuy:recipeBuy,onHover:hoverAt,recommended:recommended.has(selected?.id),pulseId,onBack:goBack,canBack:history.length>0,favorite:favorites.has(selected?.id),onFavorite:()=>selected&&toggleFavorite(selected.id),detailRef})', 'memo detail render')

css_marker='/* Riftbound Armory Smoothness V16.4 */'
if css_marker in css: raise SystemExit('V16.4 CSS already applied')
css += '''\n'''+css_marker+'''\n/* Full-screen backdrop blur was one of the Armory's largest compositor costs. Keep the visual depth with an opaque wash instead. */\n.armory-viewport{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:radial-gradient(circle at 50% -20%,#12344a,transparent 43%),#02060bfa!important}\n.full-catalog-armory .shop-purchase-bar{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:#08111bfa!important}\n/* Let the browser skip layout/paint for catalog content far outside the scroll viewport. */\n.v16-armory .catalog-tier-section{content-visibility:auto;contain:layout paint style;contain-intrinsic-size:640px}\n.v16-armory .v16-catalog-shell{content-visibility:auto;contain:layout paint style;contain-intrinsic-size:92px 112px}\n/* Hundreds of tiny catalog portraits do not need continuous ambient animation. Hero/detail art keeps its full presentation. */\n.v16-armory .shop-catalog-pane .catalog-item-tile .rift-item-icon *,\n.v16-armory .shop-catalog-pane .v16-build-guide .rift-item-icon *{animation:none!important}\n.v16-armory .shop-catalog-scroll{overscroll-behavior:contain}\n'''

js_path.write_text(s); css_path.write_text(css)
print('Applied V16.4 Armory Smoothness + Spiral Energy uncap')
