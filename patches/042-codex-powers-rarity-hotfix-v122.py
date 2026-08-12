from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / 'assets/page-F6OuavDb.js'
if not bundle_path.is_file():
    raise SystemExit(f'V12.2: missing {bundle_path}')

bundle = bundle_path.read_text()
old = 'style:{color:a[e.rarity].color},children:e.rarityLabel||e.rarity'
new = 'style:{color:a[e.rarity]?.color||e.accent||`#d8c9ff`},children:e.rarityLabel||e.rarity'
count = bundle.count(old)
if count != 1:
    raise SystemExit(f'V12.2 Codex Powers rarity anchor: expected once, found {count}')

bundle = bundle.replace(old, new, 1)
bundle_path.write_text(bundle)
print('Applied Codex Powers Rarity Hotfix V12.2: special rarities fall back to the power accent instead of crashing the Codex.')
