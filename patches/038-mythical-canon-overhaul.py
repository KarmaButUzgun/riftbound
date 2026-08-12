from pathlib import Path
import sys, re, json

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('038-mythical-canon-overhaul-parts')
runtime_path=parts/'01-runtime.js'
styles_path=parts/'02-styles.css'
for path in (bundle_path,css_path,runtime_path,styles_path):
    if not path.is_file(): raise SystemExit(f'Mythical Canon Overhaul: missing {path}')

bundle=bundle_path.read_text(); css=css_path.read_text(); runtime=runtime_path.read_text().strip(); styles=styles_path.read_text().strip()
marker='/* Riftbound Mythical Canon Portrait + Balance V10 */'
if marker in bundle or marker in css: raise SystemExit('Mythical Canon Overhaul: already applied')
if not runtime.startswith(marker) or not styles.startswith(marker): raise SystemExit('Mythical Canon Overhaul: payload validation failed')

def replace_once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'Mythical Canon Overhaul: {label} expected once, found {count}')
    return text.replace(old,new,1)

updates={
  'air-force-gloves': {'price':2100,'stats':{'as':4,'speed':4,'range':3,'combatSkill':1}},
  'zeta-suit': {'price':2100,'stats':{'durability':5,'speed':3,'energy':2,'regeneration':1}},
  'bandits-secret': {'price':2100,'stats':{'battleIq':4,'ap':3,'iq':2,'energy':1}},
  'open-domain': {'price':2100,'stats':{'ap':4,'range':4,'battleIq':2,'energy':1}},
  'sukuna-finger': {'price':2100,'stats':{'ap':2,'energy':3,'durability':1,'regeneration':2},'passive':'Increases your current AP by 30%. Grants Vessel in addition to the original Trait; existing Vessels pay 35% less transformation cost.'},
  'anduril-flame-west': {'price':2100,'stats':{'as':4,'combatSkill':4,'battleIq':2,'durability':1}},
  'black-barrel': {'price':2100,'stats':{'ap':4,'range':4,'battleIq':3,'combatSkill':1}},
  'moonlight-greatsword-mythic': {'price':2100,'stats':{'as':3,'ap':4,'range':2,'energy':2}},
  'sling-ring': {'price':2100,'stats':{'speed':3,'range':4,'battleIq':3,'energy':1}},
  'hogyoku-orb': {'price':2100,'stats':{'ap':3,'durability':3,'regeneration':3,'energy':2}},
  'millennium-puzzle': {'price':2100,'stats':{'battleIq':5,'iq':4,'energy':1}},
  'gunbai-reflector': {'price':2100,'stats':{'as':3,'durability':4,'battleIq':3,'combatSkill':1}},
  'rule-breaker-dagger': {'price':2100,'stats':{'ap':3,'combatSkill':3,'speed':2,'battleIq':1}},
  'sandevistan-apogee': {'price':2100,'stats':{'speed':5,'combatSkill':3,'as':2,'battleIq':1}},
  'iron-halo': {'price':2100,'stats':{'durability':5,'energy':3,'regeneration':2}},
  'stone-mask': {'price':2100,'stats':{'as':3,'regeneration':4,'durability':2,'speed':1}},
  'flying-raijin-kunai': {'price':2100,'stats':{'speed':4,'range':3,'battleIq':3,'combatSkill':1}},
  'mimic-tear-ashes': {'price':2100,'stats':{'durability':3,'regeneration':4,'battleIq':2}},
  'prison-realm': {'price':2100,'stats':{'battleIq':4,'range':3,'durability':2,'energy':1}},
  'arc-reactor': {'price':2100,'stats':{'ap':4,'energy':4,'durability':1,'regeneration':1}},
  'deathly-hallows': {'price':2100,'stats':{'iq':4,'regeneration':2,'battleIq':2,'energy':1}},
  'doom-crucible': {'price':2100,'stats':{'as':4,'ap':3,'combatSkill':3,'speed':1}},
  'beskar-spear-mythic': {'price':2100,'stats':{'as':3,'durability':4,'combatSkill':3,'range':1}},
  'choice-scarf-mythic': {'price':2100,'stats':{'speed':5,'range':2,'battleIq':2,'as':1}},
}

pattern=re.compile(r'add\((\{.*?\})\);',re.S)
seen=set()
def rewrite_item(match):
    raw=match.group(1)
    try: data=json.loads(raw)
    except Exception: return match.group(0)
    item_id=data.get('id')
    patch=updates.get(item_id)
    if not patch: return match.group(0)
    data['price']=patch['price']; data['stats']=patch['stats']
    if 'passive' in patch: data['passive']=patch['passive']
    seen.add(item_id)
    return 'add('+json.dumps(data,ensure_ascii=False,separators=(',',':'))+');'
bundle=pattern.sub(rewrite_item,bundle)
if seen!=set(updates): raise SystemExit(f'Mythical Canon Overhaul: missing Mythical rewrites {sorted(set(updates)-seen)}')

# Sukuna's Finger is a Deathcap-style AP amplifier now, not a damage multiplier.
bundle=replace_once(bundle,'if(ids.includes(`sukunaFinger`)&&RIFT_DAMAGE_SCALING(run,attacker,tags).mode===`AP`)value*=1.3;','', 'remove Sukuna AP damage multiplier')
bundle=replace_once(bundle,'e.statuses.standAspect_ability>0&&[`ap`,`energy`].includes(t)&&(r-=2),Math.max(0,r)}','e.statuses.standAspect_ability>0&&[`ap`,`energy`].includes(t)&&(r-=2),t===`ap`&&RIFT_HAS_PASSIVE(e,`sukunaFinger`)&&(r*=1.3),Math.max(0,r)}','apply Sukuna current AP multiplier')
bundle=bundle.replace('sukunaFinger:`apMultiplier+extraVessel`','sukunaFinger:`currentApMultiplier+extraVessel`',1)

# Preserve early-floor pacing, then ramp Shards harder later so a 2100-Shard Mythical is a realistic mid/late-run commitment.
old_reward='let t=e.routeHistory.at(-1),n=18+e.floor*4+(e.boss?45:0),r=(e.boss?8:Math.random()<.22?2:0)+Math.floor(e.floor/20),i=20+e.floor*3+(e.boss?55:0)+(e.elite?38+e.floor*2:0);if(t===`hunt`&&(i=Math.round(i*1.55)),(e.boss||e.elite)&&e.player.boons?.includes(`scavenger`)&&(i=Math.round(i*1.3)),e.pendingMoney+=n,e.pendingGems+=r,e.shards+=i,'
new_reward='let t=e.routeHistory.at(-1),n=18+e.floor*4+(e.boss?45:0),r=(e.boss?8:Math.random()<.22?2:0)+Math.floor(e.floor/20),i=20+e.floor*3+Math.floor(e.floor*e.floor/24)+(e.boss?70+e.floor*2:0)+(e.elite?38+e.floor*2:0);if(t===`hunt`&&(i=Math.round(i*1.45)),(e.boss||e.elite)&&e.player.boons?.includes(`scavenger`)&&(i=Math.round(i*1.25)),e.pendingMoney+=n,e.pendingGems+=r,e.shards+=i,'
bundle=replace_once(bundle,old_reward,new_reward,'rebalance floor clear Shards')
old_vault='let t=25+e.floor*3;e.shards+=t,G(e,`HIDDEN CACHE // The Wayfarer’s vein yields ${t} Shards before combat.`,`player`)'
new_vault='let t=25+e.floor*3+Math.floor(e.floor*e.floor/30);e.shards+=t,G(e,`HIDDEN CACHE // The Wayfarer’s vein yields ${t} Shards before combat.`,`player`)'
bundle=replace_once(bundle,old_vault,new_vault,'rebalance vault Shards')

# Mount the literal V10 canon renderer after the old V9 renderer so the abstract V9 portrait path is never used for these 24 items.
export_marker='export{xs as default};'
if bundle.count(export_marker)!=1: raise SystemExit('Mythical Canon Overhaul: export seam changed')
bundle=bundle.replace(export_marker,runtime+'\n'+export_marker,1)
css=css.rstrip()+'\n\n'+styles+'\n'

bundle_path.write_text(bundle); css_path.write_text(css)
print('Applied Mythical Canon Portrait + Balance V10:')
print(' - 24 new Mythicals route through bespoke V5-style literal canon profiles; Sparda remains unchanged')
print(' - abstract V9 glyph/halo portrait path is bypassed for all 24 new Mythicals')
print(' - Mythical stats are substantially stronger and item-appropriate; direct-buy price is 2100 Shards')
print(' - Sukuna Finger increases current AP by 30% instead of multiplying AP damage')
print(' - Shard rewards preserve early pacing and scale harder through mid/late dungeon floors')
