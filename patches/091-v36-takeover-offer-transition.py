from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
parts=Path(__file__).with_name('091-v36-takeover-offer-transition-parts')
runtime_path=parts/'01-runtime.js'
for path in [bundle_path,runtime_path]:
    if not path.is_file(): raise SystemExit(f'V36.7 missing {path}')

bundle=bundle_path.read_text(); runtime=runtime_path.read_text().strip()
if 'RIFTBOUND_V36_7' in bundle: raise SystemExit('V36.7 already applied')
for marker in ['RIFTBOUND_V36_6','RIFT_V366_BEGIN_TAKEOVER','RIFT_V365_ENFORCE_TAKEOVER_IDENTITY']:
    if marker not in bundle: raise SystemExit(f'V36.7 requires {marker}')
for marker in ['RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER','takeoverOfferCarriesIntoNextFloor']:
    if marker not in runtime: raise SystemExit(f'V36.7 payload missing {marker}')

# This is the real offer -> next-floor bug. The intermission TAKEOVER button successfully creates
# v35Takeover, but the ordinary next-floor callback immediately rebuilds player.statuses from a tiny
# persistent-status whitelist that did not include v35Takeover. Replace that exact production seam
# with a helper that preserves the same historical whitelist plus the accepted Takeover shell.
status_anchor='e.player.statuses=Object.fromEntries(Object.entries(e.player.statuses).filter(([e])=>[`apBuff`,`speedBuff`,`skillBuff`,`spiralEvolutions`,`faJin`,`ofaInherited`,`weaponDestroyed`,`symbolEvolved`,`immenseRegen`].includes(e)))'
status_replacement='RIFT_V367_PREPARE_NEXT_FLOOR_PLAYER(e.player)'
if bundle.count(status_anchor)!=1: raise SystemExit(f'V36.7 next-floor status cleanup anchor changed: {bundle.count(status_anchor)}')
bundle=bundle.replace(status_anchor,status_replacement,1)

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V36.7 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)

# Chain the newest regression after every older V36 compatibility rewrite.
wrapper=Path.cwd()/'scripts'/'prepare-v35-verifier-compat.mjs'
if wrapper.is_file():
    line="await import('./prepare-v367-verifier-compat.mjs');"
    text=wrapper.read_text()
    text='\n'.join(row for row in text.splitlines() if row.strip()!=line)
    wrapper.write_text(text.rstrip()+'\n'+line+'\n')

print('Applied Riftbound V36.7 · Takeover Offer Transition')
