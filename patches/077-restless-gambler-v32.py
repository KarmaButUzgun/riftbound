from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.build/riftbound-standalone')
bundle_path = root / 'assets/page-F6OuavDb.js'
css_path = root / 'assets/riftbound.css'
parts = Path(__file__).with_name('077-restless-gambler-v32-parts')
runtime_path = parts / '01-runtime.js'
style_path = parts / '02-styles.css'

for path in [bundle_path, css_path, runtime_path, style_path]:
    if not path.is_file():
        raise SystemExit(f'V32 missing {path}')

bundle = bundle_path.read_text()
css = css_path.read_text()
runtime = runtime_path.read_text().strip()
styles = style_path.read_text().strip()

if 'Riftbound Restless Gambler V32' in bundle or '--rift-v32-marker' in css:
    raise SystemExit('V32 already applied')

for required in [
    'RIFT_V32_POWER',
    'RIFT_V32_START_DOMAIN',
    'RIFT_V32_START_JACKPOT',
    'RIFT_V32_ROLL',
    'RIFT_V32_GAMBLER_HUD',
    'RIFT_V32_INSTALL_PREVIEWS',
    'RIFTBOUND_RESTLESS_GAMBLER',
]:
    if required not in runtime:
        raise SystemExit(f'V32 payload missing {required}')

for required in [
    'Riftbound Codex Ascendant V31',
    'Riftbound Codex Preview Accuracy V31.1',
    'Riftbound Remastered V30',
    'Riftbound Preservation Boundary V21',
]:
    if required not in bundle:
        raise SystemExit(f'V32 requires release seam: {required}')

def replace_once(source, old, new, label):
    count = source.count(old)
    if count != 1:
        raise SystemExit(f'V32 {label} seam count {count}, expected 1')
    return source.replace(old, new, 1)

hud_seam = '(0,E.jsx)(`div`,{className:`action-grid ${Fn(w.player'
bundle = replace_once(
    bundle,
    hud_seam,
    '(0,E.jsx)(RIFT_V32_GAMBLER_HUD,{fighter:w.player,run:w}),(0,E.jsx)(`div`,{className:`action-grid ${Fn(w.player',
    'combat HUD',
)
bundle = replace_once(bundle, 'SCHEMA 31', 'SCHEMA 32', 'Codex schema label')

export = 'export{xs as default};'
if bundle.count(export) != 1:
    raise SystemExit('V32 export seam changed')
bundle = bundle.replace(export, runtime + '\n' + export, 1)
css = css.rstrip() + '\n\n' + styles + '\n'

bundle_path.write_text(bundle)
css_path.write_text(css)

print('Applied Riftbound V32 Restless Gambler:')
print(' - registered one fully playable Legendary Special Power with seven Codex techniques')
print(' - wired Rough Energy, six-segment Fever, deterministic XXX rolls, and guaranteed maximum-Fever Jackpot')
print(' - created solid Train Door wind-up geometry, Jackpot move replacement, regeneration, free Energy, and triple Movement')
print(' - added cinematic gambling HUD, green Jackpot aura, bespoke map effects, synthesized bass, and a persistent music setting')
print(' - preserved the complete pre-V32 ability constitution while extending it by exactly one power and four body moves')
