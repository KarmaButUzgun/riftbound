from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('067-interface-reborn-v23-parts');runtime_path=parts/'01-runtime.js';style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V23 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Interface Reborn V23'
if marker in bundle or '--rift-v23-marker' in css: raise SystemExit('V23 already applied')
for required in ['RIFT_V23_FOCUS_GRAPH','RIFT_V23_INPUT_ROUTER','RIFT_V23_SYSTEM_PANEL','RIFT_V23_DECORATE_UI','RIFT_V23_INSTALL_BRIDGES','RIFT_V23_SYNTHETIC_KEY','RIFT_V23_ROUTE_KEY']:
    if required not in runtime: raise SystemExit(f'V23 payload missing {required}')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V23 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V23 Interface Reborn:')
print(' - shared spacing, typography, surface, control, status, focus, empty, disabled, and responsive design language')
print(' - automatic Ascension/Combat/Workshop space labeling and mouse, keyboard, touch, and controller input detection')
print(' - remappable input router, geometric focus graph, gamepad polling, and visible system controls')
