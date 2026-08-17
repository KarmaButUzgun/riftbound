from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
path=root/'assets/page-F6OuavDb.js'
text=path.read_text()
old='accent:`#9b5cff`,passiveId:`v36HoldBreath`'
new='accent:`#9b5cff`,cooldown:1,passiveId:`v36HoldBreath`'
if text.count(old)!=1: raise SystemExit(f'V36 Shadow Crystal contract anchor changed: {text.count(old)}')
path.write_text(text.replace(old,new,1))
print('Hardened Shadow Crystal Legendary cooldown metadata; once-per-fight Hold Breath remains authoritative.')
