from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('093-final-touch-v37-parts')
runtime_path=parts/'01-runtime.js.gz.b64'
style_path=parts/'02-styles.css.gz.b64'
for path in [bundle_path,css_path,runtime_path,style_path]:
    if not path.is_file(): raise SystemExit(f'V37 missing {path}')
import base64,gzip
def decode(path): return gzip.decompress(base64.b64decode(path.read_text())).decode()
bundle=bundle_path.read_text();css=css_path.read_text();runtime=decode(runtime_path).strip();styles=decode(style_path).strip()
if 'Riftbound The Final Touch V37' in bundle or '--rift-v37-marker:37' in css: raise SystemExit('V37 already applied')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V37 {label}: expected once, found {count}')
    return text.replace(old,new,1)

for marker in ['RIFTBOUND_V36_8','RIFT_V368_POWER_COPY','RIFT_V36_BATTLEFIELD_FX','RIFT_V36_RESOURCE_DOCK','RIFT_ITEMIZATION_REWORK_CATALOG','RIFT_ITEM_SHOP','RIFT_V20_ALLY_ID','RIFT_V34_BATTLEFIELD_FX']:
    if marker not in bundle: raise SystemExit(f'V37 requires {marker}')
for marker in ['RIFT_V37_POWER','RIFT_V37_ACQUIRE_STARTER','RIFT_V37_ENSURE_SUPPORT_ALLY','RIFT_V37_SWAP','RIFT_V37_START_FRENZY','RIFT_V37_BATTLEFIELD_FX','RIFT_V37_ULT_CINEMATIC','RIFTBOUND_V37']:
    if marker not in runtime: raise SystemExit(f'V37 runtime payload missing {marker}')

catalog_anchor='RIFT_ITEMIZATION_REWORK_CATALOG(items,add);'
starter_items=r'''add({id:`v37-bruisers-knife`,name:`Bruiser's Knife`,rarity:`Common`,category:`Weapon`,price:200,stats:{as:4,regeneration:2},glyph:`†`,accent:`#ff856b`,passiveId:`v37BruiserKnife`,passive:`STARTER ONLY — 3% Lifesteal. Winning each floor permanently adds +1% Lifesteal for this run, capped after Floor 10.`,lore:`A plain knife with one ugly promise: every room you survive makes the next cut feed you more.`,reference:`Riftbound · The Final Touch`,tags:[`starterOnly`,`v37`,`bruiser`,`lifesteal`],weapon:{range:3.8,damageType:`Physical`,cost:4,attackTags:[`physical`,`weapon`,`v37StarterWeapon`]}});
add({id:`v37-supports-relic`,name:`Support's Relic`,rarity:`Common`,category:`Relic`,price:200,stats:{energy:4,battleIq:2,iq:2,as:-2},glyph:`♡`,accent:`#74dfff`,passiveId:`v37SupportRelic`,passive:`STARTER ONLY — Besto Friendo Route: if you would enter combat without an ally, the Rift generates one with a floor-appropriate power, stats and item build. This includes bosses.`,lore:`It is heavier when carried alone. The moment a second heartbeat enters the room, it becomes almost weightless.`,reference:`Riftbound · The Final Touch`,tags:[`starterOnly`,`v37`,`support`,`ally`]});
add({id:`v37-rangers-bow`,name:`Ranger's Bow`,rarity:`Common`,category:`Weapon`,price:200,stats:{range:4,as:2},glyph:`⌁`,accent:`#8ce57e`,passiveId:`v37RangerBow`,passive:`STARTER ONLY — weapon attacks have 10% Armor Piercing.`,lore:`A light bow built for the first decision of a run: stand farther away and make that distance matter.`,reference:`Riftbound · The Final Touch`,tags:[`starterOnly`,`v37`,`ranger`,`armorPierce`],weapon:{range:18,damageType:`Physical`,cost:5,attackTags:[`physical`,`weapon`,`ranged`,`v37StarterWeapon`]}});
add({id:`v37-tanks-armor`,name:`Tank's Armor`,rarity:`Common`,category:`Armor`,price:200,stats:{durability:6},glyph:`⬡`,accent:`#9eb7d5`,passiveId:`v37TankArmor`,passive:`STARTER ONLY — Heartpower: Basic Strikes add physical damage equal to 5% of your maximum HP.`,lore:`A slab of armor designed around a simple philosophy: if the body is the weapon, make the body enormous.`,reference:`Riftbound · The Final Touch`,tags:[`starterOnly`,`v37`,`tank`,`heartpower`]});
add({id:`v37-bossraiders-gem`,name:`Bossraider's Gem`,rarity:`Common`,category:`Relic`,price:200,stats:{},glyph:`♛`,accent:`#ffcc69`,passiveId:`v37BossraiderGem`,passive:`STARTER ONLY — Outnumbered: if the enemy team begins larger than yours, gain +3 to every stat. For every two additional enemies beyond that disadvantage, gain another +1 to every stat for the encounter.`,lore:`The gem does not glow when victory is fair. It only wakes when the room has made a mistake counting you out.`,reference:`Riftbound · The Final Touch`,tags:[`starterOnly`,`v37`,`bossraider`,`outnumbered`]});
add({id:`v37-mages-book`,name:`Mage's Book`,rarity:`Common`,category:`Weapon`,price:200,stats:{ap:4},glyph:`墨`,accent:`#c48cff`,passiveId:`v37MageBook`,passive:`STARTER ONLY — Sorcerer's Knowledge: each unique enemy technique you learn during the fight grants +4% AP-scaled damage against that enemy, up to +40%.`,lore:`The margins fill themselves only after the enemy makes a mistake in front of you. Knowledge becomes ammunition by the next line.`,reference:`Riftbound · The Final Touch`,tags:[`starterOnly`,`v37`,`mage`,`intel`],weapon:{range:16,damageType:`Magic`,cost:6,attackTags:[`magic`,`weapon`,`ranged`,`v37StarterWeapon`]}});
'''
bundle=once(bundle,catalog_anchor,catalog_anchor+'\n'+starter_items,'starter item catalog insertion')

layer_anchor='(0,E.jsx)(RIFT_V36_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'
bundle=once(bundle,layer_anchor,'(0,E.jsx)(RIFT_V36_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V37_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V37_ULT_CINEMATIC,{battlefield:e}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})','mount V37 battlefield FX and single Ultimate cinematic')
dock_anchor='(0,E.jsx)(RIFT_V36_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})'
bundle=once(bundle,dock_anchor,dock_anchor+',(0,E.jsx)(RIFT_V37_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})','mount Boogie Woogie resource dock')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V37 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)

compat=Path('scripts/prepare-v35-verifier-compat.mjs')
if not compat.is_file(): raise SystemExit('V37 verifier compatibility wrapper missing')
text=compat.read_text();line="await import('./prepare-v37-verifier-compat.mjs');"
text='\n'.join(row for row in text.splitlines() if row.strip()!=line).rstrip()+'\n'+line+'\n';compat.write_text(text)
print('Applied Riftbound V37 · The Final Touch: six exclusive Starter Items, Support ally route, Epic Boogie Woogie, cursed-object swaps, moving pebble, Frenzie/Black Flash, procedural clap audio, dedicated Ultimate cinematic, Codex profile, and V37 regression compatibility.')
