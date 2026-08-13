from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
client_path=root/'assets/riftbound-coop.js'
parts=Path(__file__).with_name('064-authority-accessibility-v20-parts')
runtime_path=parts/'01-runtime.js'
style_path=parts/'02-styles.css'
for path in [bundle_path,css_path,client_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V20 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();client=client_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip()
marker='Riftbound Authority Accessibility and Effects V20'
if marker in bundle or '--rift-v20-marker' in css: raise SystemExit('V20 already applied')
for required in ['RIFT_V20_APPLY_COOP_INTENT','RIFT_V20_SNAPSHOT_EXTRAS','RIFT_V20_ACCESS_PANEL','RIFT_V20_START_PERFORMANCE_GOVERNOR']:
    if required not in runtime: raise SystemExit(f'V20 payload missing {required}')
for required in ['data-coop-action','intent-result','intentSequence','snapshotExtras','bridgeContext']:
    if required not in client: raise SystemExit(f'V20 co-op client missing {required}')
old_helper='function RIFT_COOP_EXPOSE_RUNTIME(run,onAction,selectedActionId,busy){try{globalThis.RIFT_COOP_EXPOSE_RUN?.(run,onAction,selectedActionId,busy)}catch{}return null}'
new_helper='function RIFT_COOP_EXPOSE_RUNTIME(run,onAction,selectedActionId,busy,commit){try{RIFT_V20_COOP_EXPOSE(run,onAction,selectedActionId,busy,commit),globalThis.RIFT_COOP_EXPOSE_RUN?.(run,onAction,selectedActionId,busy,commit)}catch{}return null}'
if bundle.count(old_helper)!=1: raise SystemExit(f'V20 co-op helper seam changed: {bundle.count(old_helper)}')
bundle=bundle.replace(old_helper,new_helper,1)
call='RIFT_COOP_EXPOSE_RUNTIME(w,$o,yt,A||!!Jt)'
if bundle.count(call)!=1: raise SystemExit(f'V20 commit bridge seam changed: {bundle.count(call)}')
bundle=bundle.replace(call,'RIFT_COOP_EXPOSE_RUNTIME(w,$o,yt,A||!!Jt,T)',1)
aux='if(Zo(e,t.fighter,n,t.id),t.fighter.statuses.pochitaCompanion){'
aux_replacement='if(Zo(e,t.fighter,n,t.id),t.fighter.statuses.v20CoopAlly){t.intent=null,t.fighter.hp>0&&Qo(e,t.fighter);return}if(t.fighter.statuses.pochitaCompanion){'
if bundle.count(aux)!=1: raise SystemExit(f'V20 ally automation seam changed: {bundle.count(aux)}')
bundle=bundle.replace(aux,aux_replacement,1)
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V20 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V20 Authority + Accessibility + Effects:')
print(' - host-authoritative Player 2 ally with validated movement, one action per turn, acknowledgements, and no AI double-control')
print(' - protocol-v2 co-op snapshots expose live ally HP, Energy, MP, legal actions, targets, and turn availability')
print(' - reduced motion, high contrast, large text, keyboard focus, live announcements, and four effect-density modes')
print(' - adaptive FPS governor, bounded prioritized effect echoes, V20 migration, release manifest, and diagnostics')
