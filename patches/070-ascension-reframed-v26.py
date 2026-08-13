from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('070-ascension-reframed-v26-parts');runtime_path=parts/'01-runtime.js';style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V26 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Ascension Reframed V26'
if marker in bundle or '--rift-v26-marker' in css: raise SystemExit('V26 already applied')
for required in ['RIFT_V26_ASCENSION_MODEL','RIFT_V26_RUN_SUMMARY','RIFT_V26_TUTORIAL','RIFT_V26_ASCENSION_PANEL']:
    if required not in runtime: raise SystemExit(f'V26 payload missing {required}')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V26 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V26 Ascension Reframed:')
print(' - deterministic run identity, route chronicle, milestone map, risk/reward previews, and between-floor objective model')
print(' - contextual tutorials appear only when movement, items, Stands, domains, Rika, power resources, or co-op become relevant')
print(' - run conclusions summarize damage, healing, movement, actions, efficiency, build, route, and replay hash')
print(' - visible Ascension Atlas keeps the route, seed, discoveries, and current objective one action away')
