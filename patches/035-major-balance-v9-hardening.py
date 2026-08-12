from pathlib import Path
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('035-major-balance-v9-hardening-parts')
runtime_path=parts/'01-runtime.js'
styles_path=parts/'02-styles.css'
for path in (bundle_path,css_path,runtime_path,styles_path):
    if not path.is_file(): raise SystemExit(f'V9 hardening missing {path}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=styles_path.read_text().strip()
marker='/* Riftbound Major Balance V9 Hardening */'
if marker in bundle: raise SystemExit('V9 hardening already applied')

def repl(old,new,label,required=True):
    global bundle
    count=bundle.count(old)
    if count!=1:
        if required: raise SystemExit(f'V9 hardening {label}: expected once, found {count}')
        print(f'V9 hardening cosmetic skip {label}: found {count}')
        return False
    bundle=bundle.replace(old,new,1)
    return True

status='e.statuses.huntersMark>0&&t.push(`HUNTER ×${e.statuses.huntersMark}`)'
repl(status,status+',e.statuses.antiHealStacks>0&&t.push(`ANTI-HEAL ×${e.statuses.antiHealStacks} · ${Math.ceil(e.statuses.antiHealTurns||0)}T · ${Math.round(Math.min(.75,e.statuses.antiHealStacks*.15)*100)}%`),e.statuses.cleaveAdaptation&&Object.keys(e.statuses.cleaveAdaptation).length&&t.push(`CLEAVE PEN ${Math.max(...Object.values(e.statuses.cleaveAdaptation))}%`),RIFT_CURSED_CHILD(e)&&!e.statuses.rikaCombatHint&&!e.statuses.rikaLocked&&t.push(`RIKA SUMMON ${Math.round(e.statuses.rikaSummon||0)}%`)','status rail integration',False)
repl('RIFT_CURSED_CHILD(w.player)&&(0,E.jsxs)(`details`,{className:`rika-command-dock`,children:[',
     'RIFT_CURSED_CHILD(w.player)&&(0,E.jsxs)(`details`,{className:`rika-command-dock`,style:{"--rika-summon":`${Math.round(w.player.statuses.rikaSummon||0)}%`},children:[',
     'Rika dock progress variable',False)
repl('w.player.statuses.rikaCombatHint?`PARTIAL MANIFESTATION · AUTONOMOUS ALLY`:`Not manifested. Choose Partial or Full Rika.`',
     'w.player.statuses.rikaCombatHint?`PARTIAL MANIFESTATION · SUMMON BAR ${Math.round(w.player.statuses.rikaSummon||0)}%`:`RIKA SUMMON BAR · ${Math.round(w.player.statuses.rikaSummon||0)} / 100 · Deal damage with Partial Rika to unlock Full Rika.`',
     'Rika dock progress copy',False)
price_count=bundle.count('"price":420')
if price_count!=24: raise SystemExit(f'V9 Mythical price audit expected 24 new items, found {price_count}')
bundle=bundle.replace('"price":420','"price":1680')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V9 hardening export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Major Balance V9 hardening: production scaling, copy restrictions, Mythical ownership/progression, status UI, Gravity restoration, 1680-shard Mythical commitment pricing, and build-defining Mythical hooks')
