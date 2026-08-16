from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.build/riftbound-standalone')
bundle_path = root / 'assets/page-F6OuavDb.js'
runtime_path = Path(__file__).with_name('080-battlefield-vfx-v34-iconic-hardening-parts') / '01-runtime.js'
if not bundle_path.is_file() or not runtime_path.is_file():
    raise SystemExit('V34 iconic hardening inputs missing')
bundle = bundle_path.read_text()
runtime = runtime_path.read_text().strip()
if 'Riftbound Battlefield VFX V34 Iconic Hardening' in bundle:
    raise SystemExit('V34 iconic hardening already applied')
for marker in ['Riftbound Battlefield VFX Grammar V34','RIFTBOUND_BATTLEFIELD_VFX','RIFT_V34_REPORT']:
    if marker not in bundle:
        raise SystemExit(f'V34 iconic hardening requires {marker}')
export='export{xs as default};'
if bundle.count(export)!=1:
    raise SystemExit('V34 iconic hardening export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)
print('Applied V34 iconic battlefield hardening: 7-Page Ora, Muda Barrage, and Projection Barrage now participate in the bespoke advancing-barrage visual contract.')
