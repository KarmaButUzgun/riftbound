from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.build/riftbound-standalone')
bundle_path = root / 'assets/page-F6OuavDb.js'
css_path = root / 'assets/riftbound.css'
parts = Path(__file__).with_name('076-codex-preview-accuracy-v311-parts')
runtime_path = parts / '01-runtime.js'
style_path = parts / '02-styles.css'

for path in [bundle_path, css_path, runtime_path, style_path]:
    if not path.is_file():
        raise SystemExit(f'V31.1 preview accuracy missing {path}')

bundle = bundle_path.read_text()
css = css_path.read_text()
runtime = runtime_path.read_text().strip()
styles = style_path.read_text().strip()

if 'Riftbound Codex Preview Accuracy V31.1' in bundle or '--rift-v311-preview-marker' in css:
    raise SystemExit('V31.1 preview accuracy already applied')

for required in [
    'RIFT_V311_PROFILE_SPECS',
    'RIFT_V311_BUILD_PREVIEW',
    'RIFT_V311_INSTALL_PREVIEWS',
    'RIFT_V311_MOVE_VISUAL',
]:
    if required not in runtime:
        raise SystemExit(f'V31.1 preview payload missing {required}')

for required in [
    'Riftbound Codex Ascendant V31',
    'function RIFT_V31_MOVE_VISUAL',
    'const RIFT_V31_CATALOG=RIFT_V31_BUILD_CATALOG();',
]:
    if required not in bundle:
        raise SystemExit(f'V31.1 requires V31 seam: {required}')

export = 'export{xs as default};'
if bundle.count(export) != 1:
    raise SystemExit('V31.1 export seam changed')

bundle = bundle.replace(export, runtime + '\n' + export, 1)
css = css.rstrip() + '\n\n' + styles + '\n'

bundle_path.write_text(bundle)
css_path.write_text(css)

print('Applied Riftbound V31.1 Codex Preview Accuracy:')
print(' - removed heuristic V24 classification from the Codex preview path')
print(' - installed an explicit mechanics-backed contract for all 248 displayed techniques')
print(' - retained the stable V31 cinematic renderer with corrected per-ability shapes and labels')
print(' - preserved the V21 ability constitution with zero mechanical changes')
