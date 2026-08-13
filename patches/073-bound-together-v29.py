from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css';client_path=root/'assets/riftbound-coop.js'
parts=Path(__file__).with_name('073-bound-together-v29-parts');runtime_path=parts/'01-runtime.js';style_path=parts/'02-styles.css';client_part=parts/'03-client.js'
for path in [bundle_path,css_path,client_path,runtime_path,style_path,client_part]:
    if not path.is_file(): raise SystemExit(f'V29 missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();client=client_path.read_text();runtime=runtime_path.read_text().strip();styles=style_path.read_text().strip();client_runtime=client_part.read_text().strip()
marker='Riftbound Bound Together V29'
if marker in bundle or '--rift-v29-marker' in css or marker in client: raise SystemExit('V29 already applied')
for required in ['RIFT_V29_COOP_BRIDGE','RIFT_V29_SESSION_RECOVERY','RIFT_V29_DESYNC_REPORT','RIFT_V29_SNAPSHOT_EXTRAS']:
    if required not in runtime: raise SystemExit(f'V29 payload missing {required}')
for required in ['RIFT_V29_NETWORK','renderNetworkHealth','resyncNow','ackHistory']:
    if required not in client_runtime: raise SystemExit(f'V29 client payload missing {required}')
old="if (['player-joined','player-left','ready-changed','room-started','room-paused','room-created'].includes(event.type)) await refreshState();"
new="if (['player-joined','player-left','player-disconnected','player-reconnected','ready-changed','room-started','room-paused','room-created','resync-requested'].includes(event.type)) await refreshState();"
if client.count(old)!=1: raise SystemExit(f'V29 client recovery refresh seam changed: {client.count(old)}')
client=client.replace(old,new,1)
old="for (const type of ['player-joined','player-left','ready-changed','room-started','room-paused','room-created','snapshot','intent','intent-result']) es.addEventListener(type,handle);"
new="for (const type of ['player-joined','player-left','player-disconnected','player-reconnected','ready-changed','room-started','room-paused','room-created','snapshot','intent','intent-result','resync-requested']) es.addEventListener(type,handle);"
if client.count(old)!=1: raise SystemExit(f'V29 client recovery event seam changed: {client.count(old)}')
client=client.replace(old,new,1)
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V29 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n';client=client.rstrip()+'\n\n'+client_runtime+'\n'
bundle_path.write_text(bundle);css_path.write_text(css);client_path.write_text(client)
print('Applied Riftbound V29 Bound Together:')
print(' - reconnect tickets, session recovery snapshots, explicit resync requests, acknowledgement history, network health, and desync detection')
print(' - partner HUD receives independent action readiness, position, movement, build, target, action geometry, and authority state')
print(' - room pause and duplicate-command safety remain host authoritative; local/LAN transport remains fully supported')
