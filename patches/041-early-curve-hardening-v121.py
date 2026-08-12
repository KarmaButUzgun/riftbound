from pathlib import Path
import sys
root=Path(sys.argv[1]); bundle_path=root/'assets/page-F6OuavDb.js'
if not bundle_path.is_file(): raise SystemExit(f'V12.1: missing {bundle_path}')
bundle=bundle_path.read_text();marker='/* Riftbound Early Curve Hardening V12.1 */'
if marker in bundle: raise SystemExit('V12.1 already applied')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V12.1 {label}: expected once, found {count}')
    return text.replace(old,new,1)

bundle=once(bundle,
'function RIFT_V12_EARLY_APPLIES(floor,boss=false){return !boss&&Number(floor)>=1&&Number(floor)<=9}',
'function RIFT_V12_EARLY_APPLIES(floor,boss=false){return Number(floor)>=1&&Number(floor)<=9}',
'include early bosses in onboarding')

bundle=once(bundle,
'e.elite=!r&&!requiemGate&&!e.boss&&t.id===`hunt`&&Math.random()<.58',
'e.elite=!r&&!requiemGate&&!e.boss&&e.floor>=10&&t.id===`hunt`&&Math.random()<.58',
'gate Hunt elites')

old_trial='t.id===`trial`&&(D.forEach(t=>{e.enemy.tiers[t]=M(e.enemy.tiers[t]+1,0,19)}),e.enemy.ultimate=100,e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.1),G(e,`OATHBOUND LAW // Every enemy stat rises one tier. Their Ultimate is already awake.`,`limit`))'
new_trial='t.id===`trial`&&(e.floor<=9?(e.enemy.ultimate=Math.min(45,(e.enemy.ultimate||0)+30),e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.05),G(e,`OATHBOUND LAW // Early ascent trial: the foe gains a light ward and partial Ultimate charge. The full oath awakens after Wamuu.`,`limit`)):(D.forEach(t=>{e.enemy.tiers[t]=M(e.enemy.tiers[t]+1,0,19)}),e.enemy.ultimate=100,e.enemy.energy=e.enemy.maxEnergy,e.enemy.shield+=Math.round(e.enemy.maxHp*.1),G(e,`OATHBOUND LAW // Every enemy stat rises one tier. Their Ultimate is already awake.`,`limit`)))'
bundle=once(bundle,old_trial,new_trial,'soften early Trial')

old_ruin='t.id===`ruin`&&(e.environmentStage=Math.random()<.5?1:2,e.environmentProgress=34,e.battlefield.hazards.push({id:`route-ruin-${e.floor}`,kind:`collapse`,label:`Cataclysm fault`,position:{x:53,y:31},radius:12,power:1.45,turns:99,owner:`system`,accent:`#ff6c75`}),G(e,`CATACLYSM VEIN // The arena begins at ${b[e.environmentStage].name}. Every impact leans toward the next World Break.`,`environment`))'
new_ruin='t.id===`ruin`&&(e.floor<=9?(e.environmentStage=0,e.environmentProgress=12,e.battlefield.hazards.push({id:`route-ruin-${e.floor}`,kind:`collapse`,label:`Dormant cataclysm fault`,position:{x:53,y:31},radius:9,power:.72,turns:99,owner:`system`,accent:`#ff6c75`}),G(e,`CATACLYSM VEIN // The early fault is unstable but dormant. It teaches World Break pressure without beginning inside a catastrophe.`,`environment`)):(e.environmentStage=Math.random()<.5?1:2,e.environmentProgress=34,e.battlefield.hazards.push({id:`route-ruin-${e.floor}`,kind:`collapse`,label:`Cataclysm fault`,position:{x:53,y:31},radius:12,power:1.45,turns:99,owner:`system`,accent:`#ff6c75`}),G(e,`CATACLYSM VEIN // The arena begins at ${b[e.environmentStage].name}. Every impact leans toward the next World Break.`,`environment`)))'
bundle=once(bundle,old_ruin,new_ruin,'soften early Ruin')

runtime=r'''/* Riftbound Early Curve Hardening V12.1 */
const RIFT_V121_BASE_DEVIL_GATE=ua;
ua=function RIFT_V121_DEVIL_GATE(run,blocked){if((Number(run?.floor)||0)<=9)return false;return RIFT_V121_BASE_DEVIL_GATE(run,blocked)};
const RIFT_V121_BASE_NEMESIS_GATE=Xi;
Xi=function RIFT_V121_NEMESIS_GATE(run,floor){if((Number(floor)||0)<=9)return null;return RIFT_V121_BASE_NEMESIS_GATE(run,floor)};
'''.strip()
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V12.1 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
bundle_path.write_text(bundle)
print('Applied Early Curve Hardening V12.1: ordinary Floors 1-9 bosses are softened, early spike events are gated, and Wamuu remains unchanged.')
