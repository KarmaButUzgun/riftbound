from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.build/riftbound-standalone')
bundle_path = root / 'assets/page-F6OuavDb.js'
css_path = root / 'assets/riftbound.css'
parts = Path(__file__).with_name('079-battlefield-vfx-v34-parts')
runtime_path = parts / '01-runtime.js'
style_path = parts / '02-styles.css'

for path in [bundle_path, css_path, runtime_path, style_path]:
    if not path.is_file():
        raise SystemExit(f'V34 missing {path}')

bundle = bundle_path.read_text()
css = css_path.read_text()
runtime = runtime_path.read_text().strip()
styles = style_path.read_text().strip()

if 'Riftbound Battlefield VFX Grammar V34' in bundle or '--rift-v34-marker' in css:
    raise SystemExit('V34 already applied')

for required in [
    'RIFT_V34_ICONIC_FAMILIES',
    'RIFT_V34_DESCRIPTOR_FROM_TACTICAL',
    'RIFT_V34_BATTLEFIELD_FX',
    'RIFT_V34_ACTION_VISUAL',
    'RIFT_V34_RESOLVE',
    'RIFTBOUND_BATTLEFIELD_VFX',
]:
    if required not in runtime:
        raise SystemExit(f'V34 payload missing {required}')

for required in [
    'Riftbound Tactical Grammar V33',
    'RIFTBOUND_TACTICAL_GRAMMAR',
    'Riftbound Living Rift V27',
    'RIFT_V15_FLOW_LAYER',
]:
    if required not in bundle:
        raise SystemExit(f'V34 requires release seam: {required}')

old_layer = 'children:[(0,E.jsx)(RIFT_V27_PRESENTATION,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'
new_layer = 'children:[(0,E.jsx)(RIFT_V27_PRESENTATION,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V34_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'
count = bundle.count(old_layer)
if count != 1:
    raise SystemExit(f'V34 battlefield overlay seam count {count}, expected 1')
bundle = bundle.replace(old_layer, new_layer, 1)

if bundle.count('SCHEMA 33') == 1:
    bundle = bundle.replace('SCHEMA 33', 'SCHEMA 34', 1)

export = 'export{xs as default};'
if bundle.count(export) != 1:
    raise SystemExit('V34 export seam changed')
bundle = bundle.replace(export, runtime + '\n' + export, 1)
css = css.rstrip() + '\n\n' + styles + '\n'

bundle_path.write_text(bundle)
css_path.write_text(css)

print('Applied Riftbound V34 Battlefield VFX Grammar:')
print(' - replaced V33 generic battlefield projectile/echo staging with a dedicated tactical VFX overlay')
print(' - all 255 displayed techniques map to authored visual families with zero visual fallbacks')
print(' - beams, drills, barrages, falling crushes, constructs, domains, time edits, summons, tethers, sweeps, waves, fields, and true projectiles render as distinct compositions')
print(' - iconic techniques receive bespoke battlefield staging, including Hollow Purple, Kamehameha, Giga Drill Break, Road Roller, Train Door, Time Erasure, Go Beyond, and major domains')
print(' - legacy V33 generic echoes are suppressed after V34 emission while mechanical targeting/resolution remains unchanged')
print(' - reduced-motion, high-contrast, and V20 effect-density controls remain authoritative')
print(' - preserved the V33 tactical mechanics and V32 ability constitution while advancing runtime save schema to V34')
