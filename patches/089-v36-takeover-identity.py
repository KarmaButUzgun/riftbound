from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
parts=Path(__file__).with_name('089-v36-takeover-identity-parts')
runtime_path=parts/'01-runtime.js'
for path in [bundle_path,runtime_path]:
    if not path.is_file(): raise SystemExit(f'V36.5 missing {path}')

bundle=bundle_path.read_text(); runtime=runtime_path.read_text().strip()
if 'RIFTBOUND_V36_5' in bundle: raise SystemExit('V36.5 already applied')
for marker in ['RIFTBOUND_V36_4','RIFT_V36_ENFORCE_HEARTBREAKER','RIFT_ACTIVE_LOADOUT_REGISTER','RIFT_V351_POOL_STATE','RIFT_V351_APPLY_POOL_STATE']:
    if marker not in bundle: raise SystemExit(f'V36.5 requires {marker}')
for marker in ['RIFT_V365_ENFORCE_TAKEOVER_IDENTITY','RIFT_V365_BEGIN_TAKEOVER','RIFT_V365_TAKEOVER_ACTION','takeoverIdentityStable']:
    if marker not in runtime: raise SystemExit(f'V36.5 payload missing {marker}')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V36.5 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)

# This build wrapper is itself extended by V36 compatibility patches. Append V36.5 last so its
# identity regression runs after every older hotfix compatibility rewrite.
wrapper=Path.cwd()/'scripts'/'prepare-v35-verifier-compat.mjs'
if wrapper.is_file():
    line="await import('./prepare-v365-verifier-compat.mjs');"
    text=wrapper.read_text()
    text='\n'.join(row for row in text.splitlines() if row.strip()!=line)
    wrapper.write_text(text.rstrip()+'\n'+line+'\n')

print('Applied Riftbound V36.5 · Takeover Identity Separation')
