from pathlib import Path
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
if not bundle_path.is_file():
    raise SystemExit('V14.2: production bundle missing')
text=bundle_path.read_text()
marker='/* Riftbound V14.2 save-load null-run hotfix */'
if marker in text:
    raise SystemExit('V14.2 already applied')

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f'V14.2 {label}: expected one anchor, found {count}')
    text=text.replace(old,new,1)

once(
    'function RIFT_V13_ACTOR(run,fighter){return RIFT_ACTOR_ID_FOR_FIGHTER(run,fighter)||null}',
    'function RIFT_V13_ACTOR(run,fighter){if(!run||!fighter)return null;return RIFT_ACTOR_ID_FOR_FIGHTER(run,fighter)||null}',
    'V13 actor null-run guard',
)
once(
    'function RIFT_V13_SIMPLE_ACTIVE(run,f){let feat=RIFT_V13_SIMPLE_FEATURE(run,f),id=RIFT_V13_ACTOR(run,f);return !!(feat&&id&&I(W(run,id),feat.position)<=feat.radius)}',
    'function RIFT_V13_SIMPLE_ACTIVE(run,f){if(!run||!f)return false;let feat=RIFT_V13_SIMPLE_FEATURE(run,f),id=RIFT_V13_ACTOR(run,f);return !!(feat&&id&&I(W(run,id),feat.position)<=feat.radius)}',
    'Simple Domain hydration guard',
)
once(
    'const RIFT_V14_ACTOR=(run,f)=>RIFT_V13_ACTOR?.(run,f)||RIFT_ACTOR_ID_FOR_FIGHTER?.(run,f)||null;',
    'const RIFT_V14_ACTOR=(run,f)=>!run||!f?null:(RIFT_V13_ACTOR?.(run,f)||RIFT_ACTOR_ID_FOR_FIGHTER?.(run,f)||null);',
    'V14 actor null-run guard',
)

export='export{xs as default};'
if text.count(export)!=1:
    raise SystemExit('V14.2 export marker missing')
text=text.replace(export,marker+'\n'+export,1)
bundle_path.write_text(text)
print('Applied V14.2: save-load status rendering no longer dereferences a null run during actor/Simple Domain lookup.')
