from pathlib import Path
import shutil
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('082-sovereigns-hotfix-v351-parts')
runtime_path=parts/'01-runtime.js'
style_path=parts/'02-styles.css'
portrait_path=parts/'blade-of-the-ruined-king.webp'
for path in [bundle_path,css_path,runtime_path,style_path,portrait_path]:
    if not path.is_file(): raise SystemExit(f'V35.1 missing {path}')

bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
if 'Riftbound Sovereigns Hotfix V35.1' in bundle or '--rift-v351-marker:351' in css: raise SystemExit('V35.1 already applied')
for marker in ['Riftbound Sovereigns of Ruin V35','RIFT_V35_BEGIN_TAKEOVER','RIFT_V35_HIJACK','RIFT_V35_ABDUCT_MOVE','RIFT_V35_BATTLEFIELD_FX']:
    if marker not in bundle: raise SystemExit(f'V35.1 requires {marker}')
for marker in ['RIFT_V351_MARKER','RIFT_V351_REWRITE_ACTIONS','RIFT_V351_PICK_ULTIMATE','v351FreeHeartbreaker','v351-hijack-cinematic']:
    if marker not in runtime: raise SystemExit(f'V35.1 runtime payload missing {marker}')
if '--rift-v351-marker:351' not in styles or '.v351-bork-portrait' not in styles or '.v351-hijack-cinematic' not in styles:
    raise SystemExit('V35.1 styles payload incomplete')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V35.1 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
shutil.copyfile(portrait_path,root/'assets'/'v35-bork-portrait.webp')
print('Applied Riftbound V35.1 · Sovereigns Hotfix:')
print(' - Takeover preserves post-heal HP percentage through borrowed Durability/item HP normalization')
print(' - borrowed slot-8 Ultimates are stripped; Heartbreaker is the only free Takeover Ultimate')
print(' - Hijack targets an enemy at 36m and ignores the victim Ultimate charge meter when choosing their current Ultimate form')
print(' - Abscond transforms in-place into a 30m Abduct recast for two owner turns')
print(' - Hijack receives a dedicated Petricite extraction cinematic')
print(' - Blade of The Ruined King uses the authored spectral sword portrait')
