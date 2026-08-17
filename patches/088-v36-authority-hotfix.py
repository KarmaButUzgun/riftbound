from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('088-v36-authority-hotfix-parts')
runtime=(parts/'01-runtime.js').read_text().strip()
bundle=bundle_path.read_text()
css=css_path.read_text()

if 'RIFTBOUND_V36_4' in bundle:
    raise SystemExit('V36.4 already applied')
for marker in ['RIFTBOUND_V36_3','RIFT_V363_RESOLVE','RIFT_V35_RESTORE_TAKEOVER','RIFT_V35_REFRESH_POOLS']:
    if marker not in bundle:
        raise SystemExit(f'V36.4 requires {marker}')

# V36.3 accidentally marked the exact two properties animated by SWOON keyframes as !important.
# CSS animations cannot override those declarations, so the slash remained permanently invisible on the black veil.
swoon_bad='transform:translate(-20%,-50%) rotate(1deg) scaleX(.15)!important;transform-origin:100% 50%!important;opacity:0!important}'
swoon_good='transform:translate(-20%,-50%) rotate(1deg) scaleX(.15);transform-origin:100% 50%!important;opacity:0}'
if css.count(swoon_bad)!=1:
    raise SystemExit(f'V36.4 SWOON authority anchor: expected once, found {css.count(swoon_bad)}')
css=css.replace(swoon_bad,swoon_good,1)

export='export{xs as default};'
if bundle.count(export)!=1:
    raise SystemExit('V36.4 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)
css_path.write_text(css)
print('Applied Riftbound V36.4 · Authority Hotfix')
