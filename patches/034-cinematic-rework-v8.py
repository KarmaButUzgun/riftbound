from pathlib import Path
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('034-cinematic-rework-v8-parts')
runtime_parts=sorted(parts.glob('*-runtime-v8.js'))
style_parts=sorted(parts.glob('*-styles-v8.css'))
for path in (bundle_path,css_path):
    if not path.is_file(): raise SystemExit(f'Cinematic Rework V8: missing {path}')
if not runtime_parts or not style_parts: raise SystemExit('Cinematic Rework V8: runtime/style parts missing')

bundle=bundle_path.read_text(); css=css_path.read_text(); runtime='\n'.join(path.read_text().strip() for path in runtime_parts); styles='\n'.join(path.read_text().strip() for path in style_parts)
js_marker='/* Riftbound Cinematic Rework V8 · literal canon-authentic ultimates and transformations */'
css_marker='/* Riftbound Cinematic Rework V8 · Yoru-quality literal cinematic staging */'
if not runtime.startswith(js_marker): raise SystemExit('Cinematic Rework V8: runtime payload failed validation')
if not styles.startswith(css_marker): raise SystemExit('Cinematic Rework V8: stylesheet payload failed validation')
if js_marker in bundle or css_marker in css: raise SystemExit('Cinematic Rework V8: already applied')

# V8 deliberately replaces only the cinematic presentation layer. Combat, move resolution,
# cutscene scheduling, Yoru's approved nuclear sequence, and scene timing remain owned by the
# existing runtime. Insert after the production Ds renderer so its exact Yoru implementation
# can be captured and delegated to unchanged.
anchor='function Os({state:e,timeLeft:t,onInput:n})'
pos=bundle.find(anchor)
if pos<0: raise SystemExit('Cinematic Rework V8: post-cinematic anchor missing')
ds_pos=bundle.rfind('function Ds({scene:e})',0,pos)
if ds_pos<0: raise SystemExit('Cinematic Rework V8: production cinematic renderer missing')
if bundle.find('war-nuclear-cinema',ds_pos,pos)<0: raise SystemExit('Cinematic Rework V8: approved Yoru nuclear renderer missing from production Ds')
if bundle.find('function RIFT_SPARTAN_CINEMATIC',0,ds_pos)<0: raise SystemExit('Cinematic Rework V8: Spartan cinematic missing')
if bundle.find('function RIFT_REQUIEM_OVERLAY',pos)<0: raise SystemExit('Cinematic Rework V8: Requiem overlay missing')

bundle=bundle[:pos]+runtime+'\n'+bundle[pos:]
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)
print('Applied Riftbound Cinematic Rework V8:')
print(' - every current Ultimate receives a literal profile with its own subject, stage, prop, action, and impact language')
print(' - current transformation cinematics, Requiem evolution, and Devil of Sparta cinematics are rebuilt with literal staging')
print(' - the approved Yoru nuclear cutscene is delegated to the exact previous renderer unchanged')
print(' - combat mechanics, balance, scene timing, and cutscene scheduling are unchanged')
