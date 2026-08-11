from pathlib import Path
import sys
s=(Path(sys.argv[1])/'assets/page-F6OuavDb.js').read_text()
needle='statuses.infinity'
idx=0
print('BIZARRE PROBE: auxiliary map class candidates')
while True:
    i=s.find(needle,idx)
    if i<0: break
    chunk=s[max(0,i-260):i+520]
    if 'map-fighter' in chunk or 'elevated' in chunk or 'auxiliary' in chunk:
        print('---')
        print(chunk)
    idx=i+1
