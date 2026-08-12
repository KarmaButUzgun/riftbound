from pathlib import Path
import sys
root=Path(sys.argv[1]); bundle_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('040-mythical-buildpaths-earlygame-parts'); runtime_path=parts/'01-runtime.js'; styles_path=parts/'02-styles.css'
for path in (bundle_path,css_path,runtime_path,styles_path):
    if not path.is_file(): raise SystemExit(f'V12: missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=styles_path.read_text().strip();marker='/* Riftbound Mythical Build Paths + Early Game V12 */'
if marker in bundle or marker in css: raise SystemExit('V12 already applied')
if not runtime.startswith(marker) or not styles.startswith(marker): raise SystemExit('V12 payload marker missing')
export_marker='export{xs as default};'
if bundle.count(export_marker)!=1: raise SystemExit('V12 export seam changed')
bundle=bundle.replace(export_marker,runtime+'\n'+export_marker,1);css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied V12: Mythical build paths, flat readable build-path UI, and gentler Floors 1-9; Floor 10 Wamuu unchanged.')
