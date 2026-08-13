from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
part=Path(__file__).with_name('062-balance-builds-v18-parts')/'01-runtime.js'
for path in [bundle_path,part]:
    if not path.is_file(): raise SystemExit(f'V18 missing {path}')
bundle=bundle_path.read_text();runtime=part.read_text().strip()
marker='Riftbound Balance Lab and Adaptive Builds V18'
if marker in bundle: raise SystemExit('V18 already applied')
for required in ['RIFT_V18_ARCHETYPES','RIFT_V18_ITEM_SCORE','RIFT_V18_BALANCE_LAB','RIFT_V18_BUILD_WARNINGS','RIFT_V18_ENCOUNTER_BUDGET']:
    if required not in runtime: raise SystemExit(f'V18 payload missing {required}')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V18 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)
print('Applied Riftbound V18 Balance Lab + Adaptive Builds:')
print(' - three six-item adaptive archetypes per power with authored Signature, Pressure, and Control/Survival identities')
print(' - affordability, owned-component, rarity, slot, scaling, and composition-aware recommendations')
print(' - actionable build compatibility warnings and deterministic role-varied enemy equipment')
print(' - versioned item, move, encounter, and economy budgets with machine-readable outlier diagnostics')
