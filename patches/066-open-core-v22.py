from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
part=Path(__file__).with_name('066-open-core-v22-parts')/'01-runtime.js'
for path in [bundle_path,part]:
    if not path.is_file(): raise SystemExit(f'V22 missing {path}')
bundle=bundle_path.read_text();runtime=part.read_text().strip()
marker='Riftbound Open Core V22'
if marker in bundle: raise SystemExit('V22 already applied')
for required in ['RIFT_V22_EVENT_BUS','RIFT_V22_ENGINE','RIFT_V22_STATE_HASH','RIFT_V22_SHADOW_COMPARE']:
    if required not in runtime: raise SystemExit(f'V22 payload missing {required}')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V22 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)
print('Applied Riftbound V22 Open Core:')
print(' - deterministic event bus, canonical state views, replay inputs, state hashes, and shadow comparison')
print(' - validated content registries, centralized legality/effect queues, seeded simulation utilities, and legacy resolver adapter')
print(' - action, movement, contact, damage, status, resource, and finish events now drive presentation diagnostics')
