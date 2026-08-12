from pathlib import Path
import sys

root=Path(sys.argv[1]); path=root/'assets/page-F6OuavDb.js'
if not path.is_file(): raise SystemExit('V14 Legendary contract hardening: bundle missing')
text=path.read_text()

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1: raise SystemExit(f'V14 Legendary contract hardening {label}: expected one anchor, found {count}')
    text=text.replace(old,new,1)

# Riftbound's established Legendary schema carries a positive internal cooldown field,
# including passive-oriented Legendaries. These values are bookkeeping only and do not
# add an activation button or change the user-authored passive behavior.
once('"passiveId":"cursedPromise","reference":"Jujutsu Kaisen"', '"passiveId":"cursedPromise","cooldown":1,"reference":"Jujutsu Kaisen"', 'Cursed Promise cooldown contract')
once('"passiveId":"endlessLove","reference":"Beneath The Drowning"', '"passiveId":"endlessLove","cooldown":1,"reference":"Beneath The Drowning"', 'Pilot Goggles cooldown contract')
path.write_text(text)
print('Hardened V14 Legendary catalog contract: Cursed Promise Ring and Pilot Goggles retain passive behavior with standard internal cooldown metadata.')
