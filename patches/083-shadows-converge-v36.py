from pathlib import Path
import shutil
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('083-shadows-converge-v36-parts')
runtime_paths=sorted(parts.glob('runtime-*.js'))
style_path=parts/'styles.css'
crystal_path=parts/'shadow-crystal.webp'
mantle_path=parts/'shadow-mantle.webp'
for path in [bundle_path,css_path,*runtime_paths,style_path,crystal_path,mantle_path]:
    if not path.is_file(): raise SystemExit(f'V36 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=''.join(path.read_text() for path in runtime_paths).strip();styles=style_path.read_text().strip()
if 'Riftbound Shadows Converge V36' in bundle or '--rift-v36-marker:36' in css: raise SystemExit('V36 already applied')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V36 {label}: expected once, found {count}')
    return text.replace(old,new,1)

for marker in ['Riftbound Sovereigns Hotfix V35.1','RIFT_V351_REWRITE_ACTIONS','RIFT_V35_BEGIN_TAKEOVER','RIFT_V35_PROFILE','RIFT_ITEMIZATION_REWORK_CATALOG','RIFT_V35_BATTLEFIELD_FX','RIFT_V35_RESOURCE_DOCK']:
    if marker not in bundle: raise SystemExit(f'V36 requires {marker}')
for marker in ['RIFT_V36_KNIGHT_POWER','RIFT_V36_SYMBOL_POWER','RIFT_V36_AFTER_RAW_DAMAGE','RIFT_V36_BATTLEFIELD_FX','RIFTBOUND_V36']:
    if marker not in runtime: raise SystemExit(f'V36 runtime payload missing {marker}')

catalog_anchor='RIFT_ITEMIZATION_REWORK_CATALOG(items,add);'
items=r'''add({id:`shadow-crystal`,name:`Shadow Crystal`,rarity:`Legendary`,category:`Relic`,price:910,recipe:[`constellation-robe`,`memory-shard`],stats:{energy:5,ap:2},glyph:`◆`,accent:`#9b5cff`,passiveId:`v36HoldBreath`,passive:`HOLD BREATH — once per fight, an attack that would kill you instead leaves you at exactly 1 HP. The passive is then spent for the fight, but your next damaging attack cannot miss.`,lore:`A Dark crystal that catches one final breath and refuses to let it become the last.`,reference:`DELTARUNE · Shadow Crystal`,tags:[`unique`,`v36`,`dark`,`deathSave`]});
add({id:`shadow-mantle`,name:`Shadow Mantle`,rarity:`Mythical`,category:`Defense`,price:2140,recipe:[`voidwalker-hide`,`null-mantle`,`bastion-frame`],stats:{durability:6},glyph:`◼`,accent:`#5d34a4`,passiveId:`v36TrueDarkness`,passive:`TRUE DARKNESS — causality-level damaging attacks deal 50% less damage to you. It grants no offensive stats; its entire budget is Defense.`,lore:`A mantle made for a battle that normal armor was never supposed to survive.`,reference:`DELTARUNE · Shadow Mantle`,tags:[`unique`,`mythical`,`v36`,`dark`,`causalityDefense`]});
'''
bundle=once(bundle,catalog_anchor,items+catalog_anchor,'add Shadow Crystal and Shadow Mantle')
raw_anchor='n.hp-=l,RIFT_V35_AFTER_RAW_DAMAGE(e,t,n,l,a),RIFT_ITEM_AFTER_DAMAGE(e,t,n,l,a),'
bundle=once(bundle,raw_anchor,'n.hp-=l,RIFT_V35_AFTER_RAW_DAMAGE(e,t,n,l,a),RIFT_V36_AFTER_RAW_DAMAGE(e,t,n,l,a),RIFT_ITEM_AFTER_DAMAGE(e,t,n,l,a),','Hold Breath raw-death seam')
move_grid='Bl.map(e=>(0,E.jsxs)(`article`,'
bundle=once(bundle,move_grid,'[...RIFT_V36_SYMBOL_BUILTINS(w.player),...Bl].map(e=>(0,E.jsxs)(`article`,','All For One built-in storage list')
move_click='onClick:()=>Xs(e.name,n),children:'
bundle=once(bundle,move_click,'onClick:()=>RIFT_V36_SYMBOL_BUILTIN_NAME(e.name)?(Wt(null),bt(null),Xo(RIFT_V36_SYMBOL_ACTION(w.player,e,n))):Xs(e.name,n),children:','All For One built-in action route')
ult_grid='Vl.map(e=>{let t=Ut.selected.includes(e.name);return(0,E.jsxs)(`button`,'
bundle=once(bundle,ult_grid,'[...RIFT_V36_SYMBOL_ULT_SOURCES(w.player),...Vl].map(e=>{let t=Ut.selected.includes(e.name);return(0,E.jsxs)(`button`,','Omni-Factor built-in Decay source')
ult_click='onClick:()=>Zs(e.name),children:'
bundle=once(bundle,ult_click,'onClick:()=>RIFT_V36_SYMBOL_BUILTIN_NAME(e.name)?(Wt(null),bt(null),Xo(RIFT_V36_SYMBOL_ULT_ACTION(w.player,e))):Zs(e.name),children:','Omni-Factor Decay route')
layer_anchor='(0,E.jsx)(RIFT_V35_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'
bundle=once(bundle,layer_anchor,'(0,E.jsx)(RIFT_V35_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V36_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})','mount V36 battlefield FX')
dock_anchor='(0,E.jsx)(RIFT_V35_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})'
bundle=once(bundle,dock_anchor,dock_anchor+',(0,E.jsx)(RIFT_V36_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})','mount V36 resource dock')
if bundle.count('SCHEMA 35')==1: bundle=bundle.replace('SCHEMA 35','SCHEMA 36',1)
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V36 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
shutil.copyfile(crystal_path,root/'assets'/'v36-shadow-crystal.webp');shutil.copyfile(mantle_path,root/'assets'/'v36-shadow-mantle.webp')
print('Applied Riftbound V36 · Shadows Converge')
