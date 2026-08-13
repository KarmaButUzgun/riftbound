from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('065-preservation-v21-parts')
runtime_path=parts/'01-runtime.js'
style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V21 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Preservation Boundary V21'
if marker in bundle or '--rift-v21-marker' in css: raise SystemExit('V21 already applied')
for required in ['RIFT_V21_ABILITY_CONSTITUTION','RIFT_V21_SAVE_VAULT','RIFT_V21_GOLDEN_SCENARIO','RIFT_V21_BACKUP_RAW']:
    if required not in runtime: raise SystemExit(f'V21 payload missing {required}')

old='if(e)try{let n=Oa(e);T(n),n.player.hp<=0'
new='if(e)try{RIFT_V21_BACKUP_RAW(e,`pre-migration`);let n=Oa(e);T(n),n.player.hp<=0'
if bundle.count(old)!=1: raise SystemExit(f'V21 migration backup seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='window.localStorage.setItem(te,JSON.stringify(e))'
new='RIFT_V21_WRITE_STORAGE(te,e,`profile`)'
if bundle.count(old)!=1: raise SystemExit(f'V21 profile write seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)
old='w?window.localStorage.setItem(ne,JSON.stringify(w)):window.localStorage.removeItem(ne)'
new='w?RIFT_V21_WRITE_STORAGE(ne,w,`run`):window.localStorage.removeItem(ne)'
if bundle.count(old)!=1: raise SystemExit(f'V21 run write seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V21 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V21 Preservation:')
print(' - immutable ability constitution with deterministic mechanical fingerprints and golden-scenario hashes')
print(' - automatic pre-migration/write backups, named save slots, export/import, recovery, and bounded rollback history')
print(' - deterministic replay recorder, crash context, schema-21 migration, and visible Save Vault')
