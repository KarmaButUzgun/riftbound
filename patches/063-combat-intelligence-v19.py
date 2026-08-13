from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('063-combat-intelligence-v19-parts')
runtime_path=parts/'01-runtime.js'
style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V19 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Combat Intelligence V19'
if marker in bundle or '--rift-v19-marker' in css: raise SystemExit('V19 already applied')
for required in ['RIFT_V19_AI_PERSONALITY','RIFT_V19_ACTION_SCORE','RIFT_V19_ACTION_PREVIEW','RIFT_V19_TIMELINE','RIFT_V19_COMBAT_STRIP']:
    if required not in runtime: raise SystemExit(f'V19 payload missing {required}')
hud='(RIFT_COOP_EXPOSE_RUNTIME(w,$o,yt,A||!!Jt),(0,E.jsx)(RIFT_COMBAT_LOADOUT_HUD,{run:w,opponent:xl||w.enemy,onAction:$o,selectedActionId:yt,busy:A||!!Jt}))'
replacement='(RIFT_COOP_EXPOSE_RUNTIME(w,$o,yt,A||!!Jt),(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(RIFT_V19_COMBAT_STRIP,{run:w,selectedActionId:yt,busy:A||!!Jt}),(0,E.jsx)(RIFT_COMBAT_LOADOUT_HUD,{run:w,opponent:xl||w.enemy,onAction:$o,selectedActionId:yt,busy:A||!!Jt})]}))'
if bundle.count(hud)!=1: raise SystemExit(f'V19 combat HUD seam changed: {bundle.count(hud)}')
bundle=bundle.replace(hud,replacement,1)
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V19 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V19 Combat Intelligence:')
print(' - six explainable AI personalities with health, Energy, control, finisher, repetition, and defense-aware action scoring')
print(' - live combat timeline and selected-action preview for damage, accuracy, geometry, range, and contact')
print(' - encounter-budget director adds measured compensation and reward for route-generated difficulty variance')
print(' - versioned combat-intelligence API, decision telemetry, responsive timeline UI, and save migration')
