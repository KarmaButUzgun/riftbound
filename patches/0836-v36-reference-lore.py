from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
path=root/'assets/page-F6OuavDb.js'
text=path.read_text()
anchor='RIFT_REFERENCE_LORE_V6=Object.freeze({'
if text.count(anchor)!=1: raise SystemExit(f'V36 reference-lore registry anchor changed: {text.count(anchor)}')
entries='`Shadow Crystal`:`A Dark crystal that catches one final breath and refuses to let it become the last.`,`Shadow Mantle`:`A mantle made for a battle that normal armor was never supposed to survive.`,'
path.write_text(text.replace(anchor,anchor+entries,1))
print('Extended canonical V6 reference lore with Shadow Crystal and Shadow Mantle before freeze.')
