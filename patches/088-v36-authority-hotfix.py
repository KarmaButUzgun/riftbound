from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
parts=Path(__file__).with_name('088-v36-authority-hotfix-parts')
runtime=(parts/'01-runtime.js').read_text().strip()
bundle=bundle_path.read_text()

if 'RIFTBOUND_V36_4' in bundle:
    raise SystemExit('V36.4 already applied')
for marker in ['RIFTBOUND_V36_3','RIFT_V363_RESOLVE','RIFT_V35_RESTORE_TAKEOVER','RIFT_V35_REFRESH_POOLS']:
    if marker not in bundle:
        raise SystemExit(f'V36.4 requires {marker}')

export='export{xs as default};'
if bundle.count(export)!=1:
    raise SystemExit('V36.4 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)
print('Applied Riftbound V36.4 · Authority Hotfix')
