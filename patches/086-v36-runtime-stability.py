from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('086-v36-runtime-stability-parts')
runtime=(parts/'01-runtime.js').read_text().strip()
styles=(parts/'02-styles.css').read_text().strip()
bundle=bundle_path.read_text(); css=css_path.read_text()
if 'RIFTBOUND_V36_2' in bundle: raise SystemExit('V36.2 already applied')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V36.2 {label}: expected once, found {count}')
    return text.replace(old,new,1)

# Symbol has two built-in factors even before it has looted a defeated power.
bundle=once(bundle,'o.includes(`symbolFactorWheel`)&&xr(a).length===0?`No stolen factor available`:','o.includes(`symbolFactorWheel`)&&xr(a).length===0&&!yr(a)?`No stolen factor available`:','allow Symbol built-in AFO storage')
bundle=once(bundle,'vr(w.player)?`ACTIVE: ${Cr(w.player).name}`:`${Bl.length} STOLEN POWERS`','vr(w.player)?`ACTIVE: ${Cr(w.player).name}`:yr(w.player)?`${RIFT_V36_SYMBOL_BUILTINS(w.player).length} BUILT-IN · ${Bl.length} LOOTED`:`${Bl.length} STOLEN POWERS`','Symbol storage heading')
bundle=once(bundle,'Bl.map((e,t)=>(0,E.jsx)(`i`,{className:vr(w.player)&&(w.player.activePowerIndex||0)===t+1?`active`:``,style:{"--factor":e.accent},title:`${t+1}. ${e.name}`,children:e.glyph},`${e.name}-${t}`))','(yr(w.player)?[...RIFT_V36_SYMBOL_BUILTINS(w.player),...Bl]:Bl).map((e,t)=>(0,E.jsx)(`i`,{className:vr(w.player)&&(w.player.activePowerIndex||0)===t+1?`active`:``,style:{"--factor":e.accent},title:yr(w.player)&&t<RIFT_V36_SYMBOL_BUILTINS(w.player).length?`BUILT-IN · ${e.name}`:`${t+1}. ${e.name}`,children:e.glyph},`${e.name}-${t}`))','Symbol storage built-in icons')
bundle=once(bundle,'!Bl.length&&(0,E.jsx)(`em`,{children:`NO STOLEN FACTORS YET`})','!Bl.length&&!yr(w.player)&&(0,E.jsx)(`em`,{children:`NO STOLEN FACTORS YET`})','Symbol storage empty label')
bundle=once(bundle,'yr(w.player)?`${Bl.length} FACTORS`:`${Bl.length}/${xe}`','yr(w.player)?`${RIFT_V36_SYMBOL_BUILTINS(w.player).length} BUILT-IN · ${Bl.length} LOOTED`:`${Bl.length}/${xe}`','Symbol storage count')

# SWOON owns the Ultimate click cinematic. Do not create the generic Ultimate scene first.
ult='if(r&&J(t,e.name,e.type===`ultimate`),e.type===`ultimate`){'
replacement='r&&J(t,e.name,e.type===`ultimate`);if(e.type===`ultimate`&&(e.move?.tags||[]).includes(`v36Swoon`)){j(!0),RIFT_V36_SW0ON_CUTSCENE(),window.setTimeout(()=>{xo(w,e,`player`),Jo(e,!0)},RIFT_V362_SWOON_CINEMA_MS);return}if(e.type===`ultimate`){'
bundle=once(bundle,ult,replacement,'replace generic SWOON cinematic')
bundle=once(bundle,'if(typeof document!==`undefined`)RIFT_V36_SW0ON_CUTSCENE();','/* V36.2: SWOON cinematic already played in the Ultimate click path. */','remove resolver-side duplicate SWOON cinematic')

# Accelerator Rings should derive missing roster positions from the actual battlefield actor.
bundle=once(bundle,'RIFT_V36_SEGMENT_DISTANCE(entry.position,dash.from,dash.dest)<=4','RIFT_V36_SEGMENT_DISTANCE(entry.position||RIFT_V362_ENTRY_POINT(run,entry),dash.from,dash.dest)<=4','Accelerator Rings safe roster point')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V36.2 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V36.2 · Runtime Stability')
