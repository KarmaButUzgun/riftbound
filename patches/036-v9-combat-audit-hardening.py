from pathlib import Path
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
parts=Path(__file__).with_name('036-v9-combat-audit-hardening-parts')
runtime_parts=sorted(parts.glob('*.js'))
if not bundle_path.is_file(): raise SystemExit(f'V9 combat audit missing {bundle_path}')
if not runtime_parts: raise SystemExit(f'V9 combat audit missing runtime parts in {parts}')
bundle=bundle_path.read_text(); runtime='\n'.join(path.read_text().strip() for path in runtime_parts)
marker='/* Riftbound V9 Combat Audit Hardening */'
if marker in bundle: raise SystemExit('V9 combat audit already applied')

def repl(old,new,label):
    global bundle
    count=bundle.count(old)
    if count!=1: raise SystemExit(f'V9 combat audit {label}: expected once, found {count}')
    bundle=bundle.replace(old,new,1)

# Reuse the exact existing One For All Prime Might branches for base One For All.
repl('i=cr(e)?2:1','i=(cr(e)||sr(e))?2:1','share Prime Might movement multiplier')
repl('cr(e)&&[`as`,`durability`,`speed`].includes(t)','(cr(e)||sr(e))&&[`as`,`durability`,`speed`].includes(t)','share Prime Might stat tiers')
repl('g=e?cr(i)?1.36:1.2','g=e?1.36','share Prime Might Smash power')
repl('_=e?cr(i)?1.52:1.25','_=e?1.52','share Prime Might Smash destruction')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V9 combat audit export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)
print(f'Applied V9 combat audit hardening ({len(runtime_parts)} runtime parts): base OFA reuses Prime Might, Cleave penetrates real Durability, Faux 100% damages crossed targets, Mythical is a first-class tier, duplicate Mythical save state is sanitized, and all Mythicals have production mechanics')
