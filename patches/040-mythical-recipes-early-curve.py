from pathlib import Path
import sys,re,json
root=Path(sys.argv[1]);bundle_path=root/'assets/page-F6OuavDb.js';css_path=root/'assets/riftbound.css';parts=Path(__file__).with_name('040-mythical-recipes-early-curve-parts');runtime_path=parts/'01-runtime.js';styles_path=parts/'02-styles.css'
for p in (bundle_path,css_path,runtime_path,styles_path):
    if not p.is_file(): raise SystemExit(f'V12: missing {p}')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=runtime_path.read_text().strip();styles=styles_path.read_text().strip();marker='/* Riftbound Mythical Recipes + Early Curve V12 */'
if marker in bundle or marker in css: raise SystemExit('V12 already applied')

def once(text,old,new,label):
    c=text.count(old)
    if c!=1: raise SystemExit(f'V12 {label}: expected once, found {c}')
    return text.replace(old,new,1)
recipes={
'air-force-gloves':(['fists-of-the-north-star','sonic-power-sneakers'],150),
'zeta-suit':(['nanosuit-2','speed-force-tachyon'],120),
'bandits-secret':(['grimoire-of-infinite-pages','omnitrix-prime'],150),
'open-domain':(['anti-life-equation-shard','absolute-territory'],150),
'sukuna-finger':(['red-stone-of-aja','one-ring-of-absence'],160),
'anduril-flame-west':(['excalibur-protocol','ashbringer-dawn'],140),
'black-barrel':(['bfg-argent-core','vats-coprocessor'],350),
'moonlight-greatsword-mythic':(['master-sword-awakened','elder-wand-elder-rule'],100),
'sling-ring':(['portal-device-aperture','compass-of-the-outer-rift'],150),
'hogyoku-orb':(['chaos-emerald-core','red-stone-of-aja'],80),
'millennium-puzzle':(['red-stone-of-aja','death-note-fragment'],180),
'gunbai-reflector':(['vibranium-echo-shell','darksaber-mandalore'],150),
'rule-breaker-dagger':(['keyblade-between-hearts','hidden-blade-assassin'],120),
'sandevistan-apogee':(['speed-force-tachyon','vats-coprocessor'],620),
'iron-halo':(['aegis-of-the-last-city','absolute-territory'],300),
'stone-mask':(['red-stone-of-aja','phoenix-regalia'],180),
'flying-raijin-kunai':(['gungnir-certain-line','portal-device-aperture'],130),
'mimic-tear-ashes':(['omnitrix-prime','save-crystal-zero'],80),
'prison-realm':(['one-ring-of-absence','absolute-territory'],180),
'arc-reactor':(['green-lantern-ring','argent-battery'],500),
'deathly-hallows':(['elder-wand-elder-rule','cloak-of-invisibility'],180),
'doom-crucible':(['blade-of-olympus','bfg-argent-core'],80),
'beskar-spear-mythic':(['darksaber-mandalore','vibranium-echo-shell'],160),
'choice-scarf-mythic':(['sonic-power-sneakers','speed-force-tachyon'],120),
}
pattern=re.compile(r'add\((\{.*?\})\);',re.S);seen=set()
def rewrite(m):
    raw=m.group(1)
    try:d=json.loads(raw)
    except Exception:return m.group(0)
    if d.get('id') not in recipes:return m.group(0)
    recipe,fee=recipes[d['id']];d['recipe']=recipe;d['combineCost']=fee;seen.add(d['id'])
    return 'add('+json.dumps(d,ensure_ascii=False,separators=(',',':'))+');'
bundle=pattern.sub(rewrite,bundle)
if seen!=set(recipes): raise SystemExit(f'V12 recipe rewrite missing {sorted(set(recipes)-seen)}')
# No early Hunt elite spike.
bundle=once(bundle,'e.elite=!r&&!requiemGate&&!e.boss&&t.id===`hunt`&&Math.random()<.58','e.elite=!r&&!requiemGate&&!e.boss&&e.floor>=10&&t.id===`hunt`&&Math.random()<.58','elite gate')
# Trial is still a risk route in the onboarding band, but no turn-zero Ultimate/stat wall.
old_trial='t.id===`trial`&&(D.forEach(t=>{e.enemy.tiers[t]=M(e.enemy.tiers[t]+1,0,19)}),e.enemy.ultimate=100,e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.1),G(e,`OATHBOUND LAW // Every enemy stat rises one tier. Their Ultimate is already awake.`,`limit`))'
new_trial='t.id===`trial`&&(e.floor<=9?(e.enemy.ultimate=Math.min(45,(e.enemy.ultimate||0)+30),e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.05),G(e,`OATHBOUND LAW // Early ascent trial: the foe gains a light ward and partial Ultimate charge, but the full oath awakens only after Wamuu.`,`limit`)):(D.forEach(t=>{e.enemy.tiers[t]=M(e.enemy.tiers[t]+1,0,19)}),e.enemy.ultimate=100,e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.1),G(e,`OATHBOUND LAW // Every enemy stat rises one tier. Their Ultimate is already awake.`,`limit`)))'
bundle=once(bundle,old_trial,new_trial,'early trial')
# Ruin remains dangerous, but no Cataclysm-stage head start before Wamuu.
old_ruin='t.id===`ruin`&&(e.environmentStage=Math.random()<.5?1:2,e.environmentProgress=34,e.battlefield.hazards.push({id:`route-ruin-${e.floor}`,kind:`collapse`,label:`Cataclysm fault`,position:{x:53,y:31},radius:12,power:1.45,turns:99,owner:`system`,accent:`#ff6c75`}),G(e,`CATACLYSM VEIN // The arena begins at ${b[e.environmentStage].name}. Every impact leans toward the next World Break.`,`environment`))'
new_ruin='t.id===`ruin`&&(e.floor<=9?(e.environmentStage=0,e.environmentProgress=12,e.battlefield.hazards.push({id:`route-ruin-${e.floor}`,kind:`collapse`,label:`Dormant cataclysm fault`,position:{x:53,y:31},radius:9,power:.72,turns:99,owner:`system`,accent:`#ff6c75`}),G(e,`CATACLYSM VEIN // The early fault is unstable but dormant. It teaches World Break pressure without starting the fight inside a catastrophe.`,`environment`)):(e.environmentStage=Math.random()<.5?1:2,e.environmentProgress=34,e.battlefield.hazards.push({id:`route-ruin-${e.floor}`,kind:`collapse`,label:`Cataclysm fault`,position:{x:53,y:31},radius:12,power:1.45,turns:99,owner:`system`,accent:`#ff6c75`}),G(e,`CATACLYSM VEIN // The arena begins at ${b[e.environmentStage].name}. Every impact leans toward the next World Break.`,`environment`)))'
bundle=once(bundle,old_ruin,new_ruin,'early ruin')
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V12 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1);css=css.rstrip()+'\n\n'+styles+'\n';bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Mythical Recipes + Early Curve V12')
