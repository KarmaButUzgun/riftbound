from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('069-armory-complete-v25-parts');runtime_path=parts/'01-runtime.js';style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V25 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Armory Complete V25'
if marker in bundle or '--rift-v25-marker' in css: raise SystemExit('V25 already applied')
for required in ['RIFT_V25_ITEM_DECISION','RIFT_V25_DECISION_PANEL','RIFT_V25_UNDO_SALE','RIFT_V25_UNDO_BAR']:
    if required not in runtime: raise SystemExit(f'V25 payload missing {required}')

old='(0,E.jsx)(RIFT_ITEM_STATS,{item}),(0,E.jsx)(RIFT_ITEM_STAT_PREVIEW,{item,fighter,plan}),(0,E.jsxs)(`section`,{className:`v17-passive`'
new='(0,E.jsx)(RIFT_ITEM_STATS,{item}),(0,E.jsx)(RIFT_ITEM_STAT_PREVIEW,{item,fighter,plan}),(0,E.jsx)(RIFT_V25_DECISION_PANEL,{item,fighter,plan}),(0,E.jsxs)(`section`,{className:`v17-passive`'
if bundle.count(old)!=1: raise SystemExit(f'V25 inspector seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='(0,E.jsx)(RIFT_V17_INSPECTOR,{item:selected,fighter,plan,onBuy:()=>buy(selected.id),onInspect:inspect,onRecipeBuy:buy,favorite:favorites.has(selected?.id),onFavorite:()=>selected&&toggleFavorite(selected.id)})'
new='(0,E.jsx)(RIFT_V17_INSPECTOR,{item:selected,fighter,plan,shards:run.shards,onBuy:()=>buy(selected.id),onInspect:inspect,onRecipeBuy:buy,favorite:favorites.has(selected?.id),onFavorite:()=>selected&&toggleFavorite(selected.id)})'
if bundle.count(old)!=1: raise SystemExit(f'V25 inspector economy seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='function RIFT_V17_INSPECTOR({item,fighter,plan,onBuy,onInspect,onRecipeBuy,favorite,onFavorite})'
new='function RIFT_V17_INSPECTOR({item,fighter,plan,shards=0,onBuy,onInspect,onRecipeBuy,favorite,onFavorite})'
if bundle.count(old)!=1: raise SystemExit(f'V25 inspector signature seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='(0,E.jsx)(RIFT_V25_DECISION_PANEL,{item,fighter,plan})'
new='(0,E.jsx)(RIFT_V25_DECISION_PANEL,{item,fighter,plan,shards})'
if bundle.count(old)!=1: raise SystemExit(f'V25 decision economy seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='rikaShop?(0,E.jsx)(RIFT_V13_RIKA_INVENTORY_MANAGER,{run,onCommit}):(0,E.jsx)(RIFT_INVENTORY_MANAGER_MEMO,{run,onCommit}),warnings.length>0'
new='rikaShop?(0,E.jsx)(RIFT_V13_RIKA_INVENTORY_MANAGER,{run,onCommit}):(0,E.jsx)(RIFT_INVENTORY_MANAGER_MEMO,{run,onCommit}),(0,E.jsx)(RIFT_V25_UNDO_BAR,{run,onCommit}),warnings.length>0'
if bundle.count(old)!=1: raise SystemExit(f'V25 inventory seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)
if bundle.count('V17 · ARMORY REFORGED')<1: raise SystemExit('V25 Armory visible branding seam changed')
bundle=bundle.replace('V17 · ARMORY REFORGED','V25 · ARMORY COMPLETE')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V25 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V25 Armory Complete:')
print(' - purchase decisions now show compatible slot, exact stat delta, recipe progress, build relevance, ownership, and conflict warnings together')
print(' - build-plan previews expose all three archetypes without declaring one mandatory answer')
print(' - recent sales are recoverable through a bounded, shard-safe undo transaction')
print(' - the five Armory workspaces now read as one continuous workbench across desktop and mobile')
