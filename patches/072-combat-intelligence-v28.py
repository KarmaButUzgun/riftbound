from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
part=Path(__file__).with_name('072-combat-intelligence-v28-parts')/'01-runtime.js'
for path in [bundle_path,part]:
    if not path.is_file(): raise SystemExit(f'V28 missing {path}')
bundle=bundle_path.read_text();runtime=part.read_text().strip()
marker='Riftbound Combat Intelligence II V28'
if marker in bundle: raise SystemExit('V28 already applied')
for required in ['RIFT_V28_TACTICAL_CONTEXT','RIFT_V28_ACTION_SCORE','RIFT_V28_ENCOUNTER_DIRECTOR','RIFT_V28_EXPLAIN']:
    if required not in runtime: raise SystemExit(f'V28 payload missing {required}')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V28 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);bundle_path.write_text(bundle)
print('Applied Riftbound V28 Combat Intelligence II:')
print(' - enemies reason over geometry, cover, hazards, cooldowns, resources, Ultimate pressure, allies, escape paths, and observed player habits')
print(' - personality weights remain distinct, explanations expose the largest scoring factors, and hidden player decisions stay unreadable')
print(' - encounter direction acts only between battles, recommends composition/reward pressure, and never modifies an ability')
