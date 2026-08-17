from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
parts=Path(__file__).with_name('090-v36-takeover-live-deck-parts')
runtime_path=parts/'01-runtime.js'
for path in [bundle_path,runtime_path]:
    if not path.is_file(): raise SystemExit(f'V36.6 missing {path}')

bundle=bundle_path.read_text(); runtime=runtime_path.read_text().strip()
if 'RIFTBOUND_V36_6' in bundle: raise SystemExit('V36.6 already applied')
for marker in ['RIFTBOUND_V36_5','RIFT_V365_TAKEOVER_ACTION','RIFT_ACTIVE_LOADOUT_REGISTER','RIFT_V35_BEGIN_TAKEOVER']:
    if marker not in bundle: raise SystemExit(f'V36.6 requires {marker}')
for marker in ['RIFT_V366_CAPTURE_BORROWED_ACTIONS','RIFT_V366_BEGIN_TAKEOVER','takeoverLiveDeck']:
    if marker not in runtime: raise SystemExit(f'V36.6 payload missing {marker}')

# The floor-clear Takeover prompt is deliberately outside React. V36.5 stopped changing fighter.power,
# so that DOM-only mutation no longer incidentally caused the action deck to refresh. Expose the stable
# run-state setter from the root component so a successful floor-clear possession can publish a cloned run.
react_anchor='[Fi,Li]=(0,r.useState)(``),Ki=(0,r.useRef)(null)'
react_replacement='[Fi,Li]=(0,r.useState)(``),RIFT_V366_REACT_RUN_SETTER=(globalThis.__RIFTBOUND_REACT_RUN_SETTER__=T),Ki=(0,r.useRef)(null)'
if bundle.count(react_anchor)!=1: raise SystemExit(f'V36.6 React run-setter anchor changed: {bundle.count(react_anchor)}')
bundle=bundle.replace(react_anchor,react_replacement,1)

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V36.6 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)

# Chain the newest regression after all V36.5 compatibility rewrites.
wrapper=Path.cwd()/'scripts'/'prepare-v35-verifier-compat.mjs'
if wrapper.is_file():
    line="await import('./prepare-v366-verifier-compat.mjs');"
    text=wrapper.read_text()
    text='\n'.join(row for row in text.splitlines() if row.strip()!=line)
    wrapper.write_text(text.rstrip()+'\n'+line+'\n')

print('Applied Riftbound V36.6 · Takeover Live Deck')
