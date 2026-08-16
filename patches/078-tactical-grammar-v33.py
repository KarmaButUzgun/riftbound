from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.build/riftbound-standalone')
bundle_path = root / 'assets/page-F6OuavDb.js'
css_path = root / 'assets/riftbound.css'
parts = Path(__file__).with_name('078-tactical-grammar-v33-parts')
runtime_path = parts / '01-runtime.js'
style_path = parts / '02-styles.css'

for path in [bundle_path, css_path, runtime_path, style_path]:
    if not path.is_file():
        raise SystemExit(f'V33 missing {path}')

bundle = bundle_path.read_text()
css = css_path.read_text()
runtime = runtime_path.read_text().strip()
styles = style_path.read_text().strip()

if 'Riftbound Tactical Grammar V33' in bundle or '--rift-v33-marker' in css:
    raise SystemExit('V33 already applied')

for required in [
    'RIFT_V33_CANON_OVERRIDES',
    'RIFT_V33_INSTALL_CATALOG',
    'RIFT_V33_TARGET_PROFILE',
    'RIFT_V33_AIM',
    'RIFT_V33_ACTION_VISUAL',
    'RIFT_V33_RESOLVE',
    'RIFTBOUND_TACTICAL_GRAMMAR',
]:
    if required not in runtime:
        raise SystemExit(f'V33 payload missing {required}')

for required in [
    'Riftbound Restless Gambler V32',
    'Riftbound Codex Preview Accuracy V31.1',
    'Riftbound Codex Ascendant V31',
    'Riftbound Remastered V30',
    'Riftbound Preservation Boundary V21',
]:
    if required not in bundle:
        raise SystemExit(f'V33 requires release seam: {required}')

# Surface the richer mechanical type on ordinary action cards. Tt() retains the
# core resolver shape separately, so this changes the language/usage layer rather
# than replacing hit geometry with a display-only label.
old_action_range = 'children:t.requiresAim?`⌖ ${t.naturalRange?`NATURAL`:`RANGE STAT`} · ${t.range.toFixed(1)}m · ${t.shape.toUpperCase()}`:`◎ ${t.label}`'
new_action_range = 'children:t.requiresAim?`⌖ ${t.naturalRange?`NATURAL`:`RANGE STAT`} · ${t.range.toFixed(1)}m · ${t.tacticalLabel||t.shape.toUpperCase()}`:`◎ ${t.tacticalLabel||t.label}`'
count = bundle.count(old_action_range)
if count != 1:
    raise SystemExit(f'V33 action-card tactical type seam count {count}, expected 1')
bundle = bundle.replace(old_action_range, new_action_range, 1)

old_debug_range = 'children:t.requiresAim?`${t.shape} · ${t.range.toFixed(1)}m`:t.label'
new_debug_range = 'children:t.requiresAim?`${t.tacticalLabel||t.shape} · ${t.range.toFixed(1)}m`:(t.tacticalLabel||t.label)'
count = bundle.count(old_debug_range)
if count != 1:
    raise SystemExit(f'V33 debug targeting type seam count {count}, expected 1')
bundle = bundle.replace(old_debug_range, new_debug_range, 1)

if bundle.count('SCHEMA 32') == 1:
    bundle = bundle.replace('SCHEMA 32', 'SCHEMA 33', 1)

export = 'export{xs as default};'
if bundle.count(export) != 1:
    raise SystemExit('V33 export seam changed')
bundle = bundle.replace(export, runtime + '\n' + export, 1)
css = css.rstrip() + '\n\n' + styles + '\n'

bundle_path.write_text(bundle)
css_path.write_text(css)

print('Applied Riftbound V33 Tactical Grammar:')
print(' - converted every explicit V31.1/V32 Power and Stand preview contract into a live mechanical tactical type')
print(' - added 64+ used mechanical types with distinct input, timing, trajectory, collision, aftermath, and counterplay contracts')
print(' - wrapped combat targeting, aim solutions, tactical-map motion, and action resolution without mutating protected ability definitions')
print(' - added canon-specific behavior overrides for iconic time, domain, beam, dash, barrage, summon, rewind, trap, and Jackpot techniques')
print(' - ability-driven dash/blink/lunge movement now resolves on the battlefield when the legacy resolver did not already reposition the actor')
print(' - preserved the V32 ability constitution while advancing runtime save schema to V33')
