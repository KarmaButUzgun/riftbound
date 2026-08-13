from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('.build/riftbound-standalone')
bundle_path = root / 'assets/page-F6OuavDb.js'
css_path = root / 'assets/riftbound.css'
parts = Path(__file__).with_name('075-codex-ascendant-v31-parts')
runtime_path = parts / '01-runtime.js'
style_path = parts / '02-styles.css'

for path in [bundle_path, css_path, runtime_path, style_path]:
    if not path.is_file():
        raise SystemExit(f'V31 missing {path}')

bundle = bundle_path.read_text()
css = css_path.read_text()
runtime = runtime_path.read_text().strip()
styles = style_path.read_text().strip()

if 'Riftbound Codex Ascendant V31' in bundle or '--rift-v31-marker' in css:
    raise SystemExit('V31 already applied')

for required in [
    'RIFT_V31_BUILD_CATALOG',
    'RIFT_V31_MOVE_INTELLIGENCE',
    'RIFT_V31_COMPARE_MOVES',
    'RIFT_V31_CODEX',
    'RIFTBOUND_CODEX',
]:
    if required not in runtime:
        raise SystemExit(f'V31 payload missing {required}')

codex_start = 'et===`codex`&&(0,E.jsxs)(`div`,{className:`codex-content`,children:['
codex_end = 'et===`vault`&&'
if bundle.count(codex_start) != 1 or bundle.count(codex_end) != 1:
    raise SystemExit('V31 Codex component seam changed')

start = bundle.index(codex_start)
end = bundle.index(codex_end, start)
replacement = (
    'et===`codex`&&(0,E.jsx)(RIFT_V31_CODEX,'
    '{tab:it,onTab:lt,systems:ct,stands:h,powers:g,devils:Je,races:d,traits:p,weapons:y,rarities:a,version:ie}),'
)
bundle = bundle[:start] + replacement + bundle[end:]

export = 'export{xs as default};'
if bundle.count(export) != 1:
    raise SystemExit('V31 export seam changed')
bundle = bundle.replace(export, runtime + '\n' + export, 1)
css = css.rstrip() + '\n\n' + styles + '\n'

bundle_path.write_text(bundle)
css_path.write_text(css)

print('Applied Riftbound V31 Codex Ascendant:')
print(' - cinematic Power Archive for every visible Special Power and all seven Stands')
print(' - interactive move dossiers with damage class, coefficients, reference damage, geometry, effects, and requirements')
print(' - search, filters, keyboard navigation, move comparison, responsive layouts, and accessible motion controls')
print(' - ability constitution preserved with zero mechanical changes')
