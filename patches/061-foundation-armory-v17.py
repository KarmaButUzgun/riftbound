from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('061-foundation-armory-v17-parts')
runtime_paths=[parts/'01-foundation.js',parts/'02-armory.js']
style_path=parts/'03-styles.css'
for path in [bundle_path,css_path,*runtime_paths,style_path]:
    if not path.is_file(): raise SystemExit(f'V17 missing {path}')
runtime='\n\n'.join(path.read_text().strip() for path in runtime_paths)
styles=style_path.read_text().strip()
marker='Riftbound Foundation Update V17'
bundle=bundle_path.read_text(); css=css_path.read_text()
if marker in bundle or '--rift-v17-marker' in css: raise SystemExit('V17 already applied')
for required in ['Riftbound Armory Reforged V17','RIFT_V17_ACTION_LEGALITY','RIFT_V17_MANIFEST','RIFT_V17_ITEM_SHOP','RIFT_V17_VIRTUAL_CATALOG']:
    if required not in runtime: raise SystemExit(f'V17 payload missing {required}')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V17 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V17 Foundation + Armory Reforged:')
print(' - versioned run migration, centralized action-legality contract, effect priorities, diagnostics, and runtime manifest')
print(' - complete Armory information-architecture replacement with Build, Browse, Craft, Inventory, and Favorites modes')
print(' - persistent six-slot command bar, visible purchases, virtual catalog, filter chips, sorting, compact inspector tabs, and keyboard controls')
print(' - goal-oriented crafting, adaptive build-home integration, mobile layout, and Yuta/Rika ownership switching')
