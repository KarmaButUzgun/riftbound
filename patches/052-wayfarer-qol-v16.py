from pathlib import Path
import base64
import gzip
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('052-wayfarer-qol-v16-parts')
runtime_parts=sorted(parts.glob('01-runtime-*.b64'))
styles_path=parts/'02-styles.css.gz.b64'
for path in (bundle_path,css_path,styles_path):
    if not path.is_file(): raise SystemExit(f'Wayfarer V16: missing {path}')
if len(runtime_parts)!=6: raise SystemExit(f'Wayfarer V16: expected 6 runtime payload chunks, found {len(runtime_parts)}')
bundle=bundle_path.read_text(); css=css_path.read_text()
try:
    runtime=gzip.decompress(base64.b64decode(''.join(path.read_text().strip() for path in runtime_parts))).decode().strip()
    styles=gzip.decompress(base64.b64decode(styles_path.read_text())).decode().strip()
except Exception as exc:
    raise SystemExit(f'Wayfarer V16: payload decode failed: {exc}')
marker='/* Riftbound Wayfarer QoL Update V16 */'
if not runtime.startswith(marker) or not styles.startswith(marker): raise SystemExit('Wayfarer V16: payload validation failed')
if marker in bundle or marker in css: raise SystemExit('Wayfarer V16: already applied')

def replace_exact(old,new,label,count=1):
    global bundle
    actual=bundle.count(old)
    if actual!=count: raise SystemExit(f'Wayfarer V16: {label} expected {count}, found {actual}')
    bundle=bundle.replace(old,new,count)

# Every route draft receives the current run, so floor gates, archetype diversity, and
# recent-route exclusion work for starter intermission, normal clears, and debug rerolls.
replace_exact('e.routeChoices=Ta()','e.routeChoices=RIFT_V16_ROUTE_CHOICES(e)','run route drafts',4)
replace_exact('run.routeChoices=Ta()','run.routeChoices=RIFT_V16_ROUTE_CHOICES(run)','starter route draft',1)

# Unwritten Door resolves from the eligible, non-recent V16 route pool.
replace_exact('t.id===`unknown`&&(t=N(He.filter(e=>e.id!==`unknown`)))','t.id===`unknown`&&(t=RIFT_V16_RESOLVE_UNKNOWN(e))','Unwritten Door resolver')

# Devil's Shortcut must act before the encounter log and battlefield are built. It upgrades
# the existing Devil gate path rather than replacing later combat state after initialization.
replace_exact('let a=ua(e,r||!!requiemGate),o=e.devilEncounter;','let a=ua(e,r||!!requiemGate);t.id===`devils-shortcut`&&!a&&(a=RIFT_V16_FORCE_DEVIL_GATE(e));let o=e.devilEncounter;','Devil Shortcut gate')

# Apply route-specific mechanics only after the base game has created the combatants, map,
# items, and the six historical route effects. This keeps V16 additive and save-safe.
old='t.id===`trial`&&(e.floor<=9?(e.enemy.ultimate=Math.min(45,(e.enemy.ultimate||0)+30),e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.05),G(e,`OATHBOUND LAW // Early ascent trial: the foe gains a light ward and partial Ultimate charge. The full oath awakens after Wamuu.`,`limit`)):(D.forEach(t=>{e.enemy.tiers[t]=M(e.enemy.tiers[t]+1,0,19)}),e.enemy.ultimate=100,e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.1),G(e,`OATHBOUND LAW // Every enemy stat rises one tier. Their Ultimate is already awake.`,`limit`))),Nt(e,`player`)'
new='t.id===`trial`&&(e.floor<=9?(e.enemy.ultimate=Math.min(45,(e.enemy.ultimate||0)+30),e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.05),G(e,`OATHBOUND LAW // Early ascent trial: the foe gains a light ward and partial Ultimate charge. The full oath awakens after Wamuu.`,`limit`)):(D.forEach(t=>{e.enemy.tiers[t]=M(e.enemy.tiers[t]+1,0,19)}),e.enemy.ultimate=100,e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.1),G(e,`OATHBOUND LAW // Every enemy stat rises one tier. Their Ultimate is already awake.`,`limit`))),RIFT_V16_APPLY_ROUTE(e,t),Nt(e,`player`)'
replace_exact(old,new,'route mechanics mount')

# V16 owns the final production shop override and shared route wrappers. Insert at the final
# export seam so all prior V7/V11/V13/V15 functions exist before V16 captures/wraps them.
export_marker='export{xs as default};'
if bundle.count(export_marker)!=1: raise SystemExit('Wayfarer V16: export seam changed')
bundle=bundle.replace(export_marker,runtime+'\n'+export_marker,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)
print('Applied Riftbound Wayfarer QoL Update V16:')
print(' - Armory browsing state persists per Yuta/Rika owner across floors and saves')
print(' - Favorites persist per Special Power lineage in local storage')
print(' - every current Special Power and Stand receives an authored six-item build order with alternatives')
print(' - nested item navigation has a literal BACK button and scroll restoration')
print(' - recipe BUY is a separate event target and never navigates')
print(' - route pool expands from 6 to 30 with floor gates, anti-repeat memory, and archetype-diverse drafts')
print(' - arena pool expands from 8 to 20 and 24 new route mechanics are wired into encounter setup')
