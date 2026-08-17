from pathlib import Path
import base64
import gzip
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('093-v37-final-touch-parts')
runtime_paths=sorted(parts.glob('01-runtime-*.b64'))
styles_path=parts/'02-styles.css.gz.b64'
for path in [bundle_path,css_path,*runtime_paths,styles_path]:
    if not path.is_file(): raise SystemExit(f'V37 missing {path}')
if not runtime_paths: raise SystemExit('V37 runtime payload chunks missing')
runtime_b64=''.join(path.read_text().strip() for path in runtime_paths)
bundle=bundle_path.read_text();css=css_path.read_text();runtime=gzip.decompress(base64.b64decode(runtime_b64)).decode().strip();styles=gzip.decompress(base64.b64decode(styles_path.read_text())).decode().strip()
if 'Riftbound The Final Touch V37' in bundle or '--rift-v37-marker:37' in css: raise SystemExit('V37 already applied')
for marker in ['RIFTBOUND_V36_8','RIFT_V368_POWER_INFO','RIFT_V36_BATTLEFIELD_FX','RIFT_V36_RESOURCE_DOCK','RIFT_ITEM_SHOP','RIFT_PREPARE_COMBAT_ITEMS','RIFT_V16_APPLY_ROUTE']:
    if marker not in bundle: raise SystemExit(f'V37 requires {marker}')
for marker in ['RIFT_V37_STARTER_CATALOG','RIFT_V37_POWER','RIFT_V37_SWAP','RIFT_V37_START_FRENZY','RIFT_V37_BATTLEFIELD_FX','RIFT_V37_ULT_CINEMATIC','RIFTBOUND_V37']:
    if marker not in runtime: raise SystemExit(f'V37 payload missing {marker}')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V37 {label}: expected once, found {count}')
    return text.replace(old,new,1)

layer='(0,E.jsx)(RIFT_V36_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'
bundle=once(bundle,layer,'(0,E.jsx)(RIFT_V36_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V37_ULT_CINEMATIC,{battlefield:e}),(0,E.jsx)(RIFT_V37_BATTLEFIELD_FX,{battlefield:e}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})','battlefield presentation mount')
dock='(0,E.jsx)(RIFT_V36_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})'
bundle=once(bundle,dock,dock+',(0,E.jsx)(RIFT_V37_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})','resource dock mount')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V37 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)

wrapper=Path.cwd()/'scripts'/'prepare-v35-verifier-compat.mjs'
if wrapper.is_file():
    line="await import('./prepare-v37-verifier-compat.mjs');"
    text=wrapper.read_text()
    text='\n'.join(row for row in text.splitlines() if row.strip()!=line)
    wrapper.write_text(text.rstrip()+'\n'+line+'\n')

print('Applied Riftbound V37 · The Final Touch')
print(' - six exclusive 200-Shard Starter Items live outside the normal shop catalog')
print(' - Starter Item selection is mandatory before the first route and persists in ordinary inventory/save state')
print(' - Boogie Woogie joins the Special Power wheel and Codex with swap, Infuse, moving Pebble, Frenzie, Besto Friendo and Black Flash')
print(' - Support Relic creates a floor-scoped AI ally only when the player otherwise has no living ally')
print(' - dedicated clap audio, Black Flash hit treatment, Frenzie cinematic, battlefield anchors and combat resource dock')
