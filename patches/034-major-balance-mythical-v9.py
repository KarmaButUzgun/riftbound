from pathlib import Path
import sys
root=Path(sys.argv[1]); bundle_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('034-major-balance-mythical-v9-parts')
runtime=(parts/'01-major-balance-v9.js').read_text().strip(); styles=(parts/'02-major-balance-v9.css').read_text().strip(); mythics=(parts/'03-mythical-catalog-v9.js').read_text().strip()
bundle=bundle_path.read_text(); css=css_path.read_text()
marker='/* Riftbound Major Balance + Mythical Expansion V9 */'
if marker in bundle: raise SystemExit('V9 already applied')
anchor='RIFT_ITEMIZATION_REWORK_CATALOG(items,add);'
if bundle.count(anchor)!=1: raise SystemExit(f'V9 catalog anchor count {bundle.count(anchor)}')
bundle=bundle.replace(anchor,mythics+'\n'+anchor,1)
repls={
'passive:`+2 Speed tiers, a larger movement reserve, and superior stride efficiency.`':'passive:`Chronal Runner: +2 Speed tiers, a larger movement reserve, superior stride efficiency, and a true Ultimate-history rewind.`',
'm(`Time Portal`,`Rewind everything except yourself to three turns ago.`,100,0,0,[`allEnergy`,`rewind`])':'m(`Time Portal`,`Restore the complete combat state tied to the third-most-recent prior Ultimate activation. Permanent rewards and inventory progression remain outside the rewind.`,100,0,0,[`allEnergy`,`rewindUltimate3`,`causality`])',
'passive:`Resist blindness, illusions, and shadow effects.`':'passive:`Photon Body: resist blindness, illusions, and shadow effects. Normal Movement Points are doubled.`',
}
for old,new in repls.items():
    if old not in bundle: raise SystemExit('V9 missing source anchor: '+old[:80])
    bundle=bundle.replace(old,new,1)
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V9 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)
print('Applied Riftbound Major Balance + Mythical Expansion V9')
