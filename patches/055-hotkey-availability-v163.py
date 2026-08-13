from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
if not bundle_path.is_file(): raise SystemExit(f'Hotkey Availability V16.3: missing {bundle_path}')
bundle=bundle_path.read_text()
marker='/* Riftbound Hotkey Availability Guard V16.3 */'
if marker in bundle: raise SystemExit('Hotkey Availability V16.3: already applied')

old_map='if(t>=0&&t<n.length){e.preventDefault(),kt&&yt!==n[t].id&&(jt(null),wt(`inspect`),Ot(null)),$o(n[t]);return}'
new_map=marker+'if(t>=0&&t<n.length){e.preventDefault();let r=n[t];if(qa(w,r,!1,!!Jt,xl||w.enemy))return;kt&&yt!==r.id&&(jt(null),wt(`inspect`),Ot(null)),$o(r);return}'
count=bundle.count(old_map)
if count!=1: raise SystemExit(f'Hotkey Availability V16.3: map hotkey anchor expected once, found {count}')
bundle=bundle.replace(old_map,new_map,1)

old_closed='let n=Number(e.key)-1,r=La(w.player);n>=0&&n<r.length&&$o(r[n])'
new_closed='let n=Number(e.key)-1,r=La(w.player);if(n>=0&&n<r.length){let o=r[n];qa(w,o,!1,!!Jt,xl||w.enemy)||$o(o)}'
count=bundle.count(old_closed)
if count!=1: raise SystemExit(f'Hotkey Availability V16.3: closed-map hotkey anchor expected once, found {count}')
bundle=bundle.replace(old_closed,new_closed,1)

bundle_path.write_text(bundle)
print('Applied Riftbound Hotkey Availability Guard V16.3')
print(' - numbered hotkeys now consult the same unavailable-reason resolver as action-card buttons')
print(' - cooldown, Energy, Silence, once-per-turn, setup, form, and other disabled states cannot be armed')
print(' - map-open and closed-map keyboard dispatchers are both guarded')
