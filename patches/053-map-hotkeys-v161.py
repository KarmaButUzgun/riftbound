from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
if not bundle_path.is_file(): raise SystemExit(f'Map Hotkeys V16.1: missing {bundle_path}')
bundle=bundle_path.read_text()
marker='/* Riftbound Map Combat Hotkeys V16.1 */'
if marker in bundle: raise SystemExit('Map Hotkeys V16.1: already applied')

old='if(xt){e.key===`Escape`&&(St(!1),Ot(null));return}if(e.key===`Escape`){Wt(null),rt(null),Hn(!1);return}'
new=marker+'if(xt){if(e.key===`Escape`){e.preventDefault(),St(!1),Ot(null);return}if(he===`run`&&w?.phase===`combat`&&!et&&!Ut){let t=Number(e.key)-1,n=La(w.player);if(t>=0&&t<n.length){e.preventDefault(),kt&&yt!==n[t].id&&(jt(null),wt(`inspect`),Ot(null)),$o(n[t]);return}}return}if(e.key===`Escape`){Wt(null),rt(null),Hn(!1);return}'
count=bundle.count(old)
if count!=1: raise SystemExit(f'Map Hotkeys V16.1: map keydown anchor expected once, found {count}')
bundle=bundle.replace(old,new,1)

old_footer='ESC CLOSES MAP · MOVEMENT DOES NOT SPEND YOUR ACTION'
new_footer='1–8 MOVES · ESC CLOSES MAP · MOVEMENT DOES NOT SPEND YOUR ACTION'
count=bundle.count(old_footer)
if count!=1: raise SystemExit(f'Map Hotkeys V16.1: map footer anchor expected once, found {count}')
bundle=bundle.replace(old_footer,new_footer,1)

bundle_path.write_text(bundle)
print('Applied Riftbound Map Combat Hotkeys V16.1:')
print(' - keys 1–8 now pass through the normal action picker while the tactical map is open')
print(' - aimed moves arm directly on the already-open map; non-aimed moves keep normal execution rules')
print(' - switching hotkeys while another aim is armed clears the stale reticle before selecting the new move')
print(' - Escape still closes the map and all existing modal/input guards remain intact')
