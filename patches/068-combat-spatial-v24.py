from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('068-combat-spatial-v24-parts');runtime_path=parts/'01-runtime.js';style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V24 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Spatial Ability Grammar V24'
if marker in bundle or '--rift-v24-marker' in css: raise SystemExit('V24 already applied')
for required in ['RIFT_V24_SPATIAL_TYPES','RIFT_V24_CLASSIFY','RIFT_V24_SPATIAL_LAYER','RIFT_V24_COVERAGE']:
    if required not in runtime: raise SystemExit(f'V24 payload missing {required}')

old='function zs({battlefield:e,player:t,enemy:n,auxiliaryCombatants:r=[],playerTeam:i=Si,activeTargetId:a=`enemy`,timeState:o,epitaph:s,mini:c=!1,mode:l=`inspect`,point:u,aim:d,movePreview:f,effect:p,hoverPoint:m,hoverLabel:h,onPoint:g,onHover:_,onSelectTarget:v})'
new='function zs({battlefield:e,player:t,enemy:n,auxiliaryCombatants:r=[],playerTeam:i=Si,activeTargetId:a=`enemy`,timeState:o,epitaph:s,mini:c=!1,mode:l=`inspect`,point:u,aim:d,action:RIFT_V24_ACTION,movePreview:f,effect:p,hoverPoint:m,hoverLabel:h,onPoint:g,onHover:_,onSelectTarget:v})'
if bundle.count(old)!=1: raise SystemExit(f'V24 map signature seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='mode:t,point:i,aim:a,movePreview:S,effect:s'
new='mode:t,point:i,aim:a,action:n,movePreview:S,effect:s'
if bundle.count(old)!=1: raise SystemExit(f'V24 map action bridge seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='d&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`div`,{className:`map-range-ring'
new='d&&(0,E.jsx)(RIFT_V24_SPATIAL_LAYER,{battlefield:e,action:RIFT_V24_ACTION,fighter:t,aim:d}),d&&(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`div`,{className:`map-range-ring'
if bundle.count(old)!=1: raise SystemExit(f'V24 aim layer seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='(0,E.jsx)(`b`,{children:b.shape.toUpperCase()})'
new='(0,E.jsx)(`b`,{children:RIFT_V24_CLASSIFY(n,U(e,v)?.fighter||e.player,b).label})'
if bundle.count(old)!=1: raise SystemExit(f'V24 map shape label seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

old='`${preview.shape.toUpperCase()} CONTACT`'
new='`${preview.spatialLabel||preview.shape.toUpperCase()} CONTACT`'
if bundle.count(old)!=1: raise SystemExit(f'V24 combat preview label seam changed: {bundle.count(old)}')
bundle=bundle.replace(old,new,1)

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V24 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V24 Combat Reforged + Spatial Ability Grammar:')
print(' - every catalog move receives a presentation-only spatial footprint while resolver geometry stays untouched')
print(' - arc swings, thrusts, dash cuts, cones, beams, projectiles, barrages, scatters, rings, waves, fields, walls, chains, grabs, ricochets, summons, and teleports render distinctly')
print(' - Heavy Swing now draws a weapon-facing arc, with weapon-aware variants for Yamato, Beowulf, firearms, and Devil Arms')
print(' - tactical inspector and combat preview use truthful spatial labels, coverage audits, and reduced-motion-safe footprints')
