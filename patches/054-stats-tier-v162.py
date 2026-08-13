from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle=root/'assets/page-F6OuavDb.js'
s=bundle.read_text()
marker='/* Riftbound Stats Tier Hotfix V16.2 */'
if marker in s: raise SystemExit('V16.2 already applied')
old='function Br(e,t){return t<u[e].length?u[e][Math.max(0,t)].name:`${u[e][19].name} +${t-19}`}'
new=marker+'\nfunction Br(e,t){let n=e===`as`?u.ap:u[e],r=Number.isFinite(t)?t:0;if(!n?.length)return`T${Math.max(1,r+1)}`;return r<n.length?n[Math.max(0,r)].name:`${n[n.length-1].name} +${r-(n.length-1)}`} '
if s.count(old)!=1: raise SystemExit(f'V16.2 Br anchor expected once, found {s.count(old)}')
s=s.replace(old,new,1)
bundle.write_text(s)
print('Applied Riftbound Stats Tier Hotfix V16.2')
