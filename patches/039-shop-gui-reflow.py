from pathlib import Path
import sys
root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('039-shop-gui-reflow-parts'); runtime_path=parts/'01-runtime.js'; styles_path=parts/'02-styles.css'
for path in (bundle_path,css_path,runtime_path,styles_path):
    if not path.is_file(): raise SystemExit(f'Shop GUI Reflow V11: missing {path}')
bundle=bundle_path.read_text(); css=css_path.read_text(); runtime=runtime_path.read_text().strip(); styles=styles_path.read_text().strip()
marker='/* Riftbound Shop GUI Reflow + Mythical Alignment V11 */'
if marker in bundle or marker in css: raise SystemExit('Shop GUI Reflow V11: already applied')
if not runtime.startswith(marker) or not styles.startswith(marker): raise SystemExit('Shop GUI Reflow V11: payload validation failed')
def replace_once(text,old,new,label):
    c=text.count(old)
    if c!=1: raise SystemExit(f'Shop GUI Reflow V11: {label} expected once, found {c}')
    return text.replace(old,new,1)
# Target only the final production shop override; earlier historical implementations remain inert.
shop_anchor='RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){'
shop_start=bundle.rfind(shop_anchor)
if shop_start<0: raise SystemExit('Shop GUI Reflow V11: final shop override missing')
shop_end=bundle.find('\n};',shop_start)
if shop_end<0: raise SystemExit('Shop GUI Reflow V11: final shop boundary missing')
shop_end+=3
shop=bundle[shop_start:shop_end]
shop=replace_once(shop,'    (0,E.jsx)(RIFT_SHOP_BUILD_STRIP,{fighter:run.player}),\n','', 'remove duplicate build strip render')
old_state='[loadoutOpen,setLoadoutOpen]=(0,r.useState)(()=>typeof window===`undefined`?true:!window.matchMedia(`(max-width: 860px), (max-height: 680px)`).matches);'
shop=replace_once(shop,old_state,'[loadoutOpen,setLoadoutOpen]=(0,r.useState)(false);','compact loadout default')
old_toggle='children:[`LOADOUT `,ownedCount,`/6`]'
new_toggle='children:[loadoutOpen?`HIDE BUILD TOOLS · `:`MANAGE BUILD · `,ownedCount,`/6`]'
shop=replace_once(shop,old_toggle,new_toggle,'loadout toggle label')
bundle=bundle[:shop_start]+shop+bundle[shop_end:]
# Mount the V11 portrait renderer at the final export seam.
export_marker='export{xs as default};'
if bundle.count(export_marker)!=1: raise SystemExit('Shop GUI Reflow V11: export seam changed')
bundle=bundle.replace(export_marker,runtime+'\n'+export_marker,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)
print('Applied Shop GUI Reflow + Mythical Alignment V11:')
print(' - removed the duplicate read-only build strip')
print(' - kept one compact always-visible six-slot dock with optional management controls')
print(' - widened the detail/build-tree pane and restored recipe graph scrolling/height')
print(' - normalized all 24 V10 Mythical portraits through a shared whole-object alignment stage')
