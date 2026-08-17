from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('087-v36-loadout-stability-parts')
runtime=(parts/'01-runtime.js').read_text().strip(); styles=(parts/'02-styles.css').read_text().strip()
bundle=bundle_path.read_text(); css=css_path.read_text()
if 'RIFTBOUND_V36_3' in bundle: raise SystemExit('V36.3 already applied')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V36.3 {label}: expected once, found {count}')
    return text.replace(old,new,1)

for marker in ['RIFTBOUND_V36_2','RIFT_V362_SWOON_CINEMA_MS','RIFT_V36_ENFORCE_HEARTBREAKER','RIFT_V351_REWRITE_ACTIONS','RIFT_V35_RENDER_FX']:
    if marker not in bundle: raise SystemExit(f'V36.3 requires {marker}')

# Decay wound remains a same-combat heal ceiling, but never silently follows the player into the next fight.
old_keep='[`apBuff`,`speedBuff`,`skillBuff`,`spiralEvolutions`,`faJin`,`ofaInherited`,`weaponDestroyed`,`decayWound`,`symbolEvolved`,`immenseRegen`]'
new_keep='[`apBuff`,`speedBuff`,`skillBuff`,`spiralEvolutions`,`faJin`,`ofaInherited`,`weaponDestroyed`,`symbolEvolved`,`immenseRegen`]'
bundle=once(bundle,old_keep,new_keep,'clear cross-floor Decay wound')

# Full Manifestation should arrive materially sooner through Partial Rika pressure, without shrinking the 100-point bar.
old_rika='Math.max(4,Math.round(damage/Math.max(1,target.maxHp)*55))'
new_rika='Math.max(6,Math.round(damage/Math.max(1,target.maxHp)*75))'
bundle=once(bundle,old_rika,new_rika,'increase Rika manifestation gain')

# Heartbreaker owns its click-time cinematic just like SWOON: no generic Ultimate card first.
anchor='if(e.type===`ultimate`&&(e.move?.tags||[]).includes(`v36Swoon`)){j(!0),RIFT_V36_SW0ON_CUTSCENE(),window.setTimeout(()=>{xo(w,e,`player`),Jo(e,!0)},RIFT_V362_SWOON_CINEMA_MS);return}if(e.type===`ultimate`){'
replacement='if(e.type===`ultimate`&&(e.move?.tags||[]).includes(`v36Swoon`)){j(!0),RIFT_V36_SW0ON_CUTSCENE(),window.setTimeout(()=>{xo(w,e,`player`),Jo(e,!0)},RIFT_V362_SWOON_CINEMA_MS);return}if(e.type===`ultimate`&&(e.move?.tags||[]).includes(`v35Heartbreaker`)){j(!0),RIFT_V363_HEARTBREAKER_CUTSCENE(),window.setTimeout(()=>{xo(w,e,`player`),Jo(e,!0)},RIFT_V363_HEARTBREAKER_CINEMA_MS);return}if(e.type===`ultimate`){'
bundle=once(bundle,anchor,replacement,'Heartbreaker authored Ultimate cinematic')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V36.3 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)
print('Applied Riftbound V36.3 · Active Loadout + Viego Stability')
