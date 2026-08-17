from pathlib import Path
import base64
import gzip
import shutil
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('094-v38-another-jojo-parts')
runtime_paths=sorted(parts.glob('01-runtime-*.b64'))
styles_path=parts/'02-styles.css.gz.b64'
portrait_paths=sorted(parts.glob('v38-*.svg'))
for path in [bundle_path,css_path,*runtime_paths,styles_path,*portrait_paths]:
    if not path.is_file(): raise SystemExit(f'V38 missing {path}')
if not runtime_paths: raise SystemExit('V38 runtime payload chunks missing')
if len(portrait_paths)!=6: raise SystemExit(f'V38 requires 6 Stand portrait assets, found {len(portrait_paths)}')
runtime=gzip.decompress(base64.b64decode(''.join(path.read_text().strip() for path in runtime_paths))).decode().strip()
styles=gzip.decompress(base64.b64decode(styles_path.read_text().strip())).decode().strip()
bundle=bundle_path.read_text();css=css_path.read_text()
if 'Riftbound Another JoJo Update V38' in bundle or '--rift-v38-marker:38' in css: raise SystemExit('V38 already applied')
for marker in ['RIFTBOUND_V37','RIFT_V37_BATTLEFIELD_FX','RIFT_V37_RESOURCE_DOCK','RIFT_MASTER_OF_TIME','RIFT_RECORD_SNAPSHOT','RIFT_V37_BASE_RS']:
    if marker not in bundle: raise SystemExit(f'V38 requires {marker}')
for marker in ['RIFT_V38_STANDS','RIFT_V38_MANDOM_REWIND','RIFT_V38_SPAWN_CLONE','RIFT_V38_VALENTINE','RIFT_V38_BATTLEFIELD_FX','RIFT_V38_ULT_CINEMATIC','RIFTBOUND_V38']:
    if marker not in runtime: raise SystemExit(f'V38 payload missing {marker}')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V38 {label}: expected once, found {count}')
    return text.replace(old,new,1)

layer='(0,E.jsx)(RIFT_V37_BATTLEFIELD_FX,{battlefield:e}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'
bundle=once(bundle,layer,'(0,E.jsx)(RIFT_V37_BATTLEFIELD_FX,{battlefield:e}),(0,E.jsx)(RIFT_V38_ULT_CINEMATIC,{battlefield:e}),(0,E.jsx)(RIFT_V38_BATTLEFIELD_FX,{battlefield:e}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})','battlefield presentation mount')
dock='(0,E.jsx)(RIFT_V37_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})'
bundle=once(bundle,dock,dock+',(0,E.jsx)(RIFT_V38_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})','resource dock mount')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V38 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
for portrait in portrait_paths:
    shutil.copyfile(portrait,root/'assets'/portrait.name)

wrapper=Path.cwd()/'scripts'/'prepare-v35-verifier-compat.mjs'
if wrapper.is_file():
    line="await import('./prepare-v38-verifier-compat.mjs');"
    text=wrapper.read_text()
    text='\n'.join(row for row in text.splitlines() if row.strip()!=line)
    wrapper.write_text(text.rstrip()+'\n'+line+'\n')

print('Applied Riftbound V38 · Another JoJo Update')
print(' - Mandom: six-round Gunslinger economy, attached manifestation, real ricochet geometry and exact 4-turn rewind / 4-turn cooldown loop')
print(' - D4C: parallel fighter cloning, Dirty Deeds HP pressure, compulsory global Target routing, Dojan and five-turn Love Train')
print(' - Tusk Acts 1-4: Spin + Nails, Fibonacci, Floor-earned evolution, Nail Holes, wormholes and conditional Infinite Rotation')
print(' - Floor 40 Tusk route: two-phase Funny Valentine calamity with permanent Phase-2 Love Train and mid-fight Act 4 awakening')
print(' - six authored vector Stand portraits, dedicated resource docks, battlefield indicators and cinematic layers')
