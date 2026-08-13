from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('071-living-rift-v27-parts');runtime_path=parts/'01-runtime.js';style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V27 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Living Rift V27'
if marker in bundle or '--rift-v27-marker' in css: raise SystemExit('V27 already applied')
for required in ['RIFT_V27_ARENA_IDENTITY','RIFT_V27_PRESENTATION','RIFT_V27_AUDIO_BUS','RIFT_V27_ENVIRONMENT_STATE']:
    if required not in runtime: raise SystemExit(f'V27 payload missing {required}')
old='(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e}),(0,E.jsx)(`div`,{className:`map-floor-texture`'
new='(0,E.jsx)(RIFT_V27_PRESENTATION,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e}),(0,E.jsx)(`div`,{className:`map-floor-texture`'
if bundle.count(old)!=1: raise SystemExit(f'V27 battlefield layer seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V27 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V27 Living Rift:')
print(' - all twenty arena themes receive layered depth, lighting, ambience identity, hazard language, and destruction scars')
print(' - character silhouettes gain health, guard, stun, transformation, weapon, and status-sensitive presentation states')
print(' - shared line, arc, trail, shockwave, distortion, debris, lighting, afterimage, and timeline effect primitives replace ad-hoc visual noise')
print(' - category audio bus reacts to Open Core action, contact, damage, movement, status, and environment events')
