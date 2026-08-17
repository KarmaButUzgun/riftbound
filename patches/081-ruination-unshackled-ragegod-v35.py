from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('081-ruination-unshackled-ragegod-v35-parts')
runtime_paths=sorted(parts.glob('runtime-*.js'))
style_paths=sorted(parts.glob('styles-*.css'))
for path in [bundle_path,css_path,*runtime_paths,*style_paths]:
    if not path.is_file(): raise SystemExit(f'V35 missing {path}')
if not runtime_paths or not style_paths: raise SystemExit('V35 payload parts missing')
bundle=bundle_path.read_text();css=css_path.read_text();runtime=''.join(path.read_text() for path in runtime_paths).strip();styles=''.join(path.read_text() for path in style_paths).strip()
if 'Riftbound Sovereigns of Ruin V35' in bundle or '--rift-v35-marker:35' in css: raise SystemExit('V35 already applied')

def once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V35 {label}: expected once, found {count}')
    return text.replace(old,new,1)

for marker in ['Riftbound Battlefield VFX Grammar V34','RIFTBOUND_BATTLEFIELD_VFX','Riftbound Tactical Grammar V33','RIFT_SPARTAN_RESOURCE_DOCK','RIFT_V18_ASSIGN_AI_BUILD','RIFT_ITEMIZATION_REWORK_CATALOG']:
    if marker not in bundle: raise SystemExit(f'V35 requires {marker}')
for marker in ['RIFT_V35_RUINED_POWER','RIFT_V35_UNSHACKLED_POWER','RIFT_V35_RAGEGOD_POWER','RIFT_V35_BATTLEFIELD_FX','RIFT_V35_BALANCE_DAMAGE','RIFTBOUND_V35']:
    if marker not in runtime: raise SystemExit(f'V35 payload missing {marker}')

# Legendary BORK: current League identity adapted to Riftbound's AS/Speed/MP economy.
# It also follows Riftbound's mature Legendary crafting contract instead of bypassing the Armory graph.
catalog_anchor='RIFT_ITEMIZATION_REWORK_CATALOG(items,add);'
bork=r'''add({id:`blade-ruined-king`,name:`Blade of The Ruined King`,rarity:`Legendary`,category:`Weapon`,price:980,recipe:[`riftsteel-sabre`,`duelist-grip`],combineCost:220,stats:{as:3,speed:2,combatSkill:2,regeneration:1},glyph:`♚`,passiveId:`v35BladeRuinedKing`,cooldown:3,passive:`Basic Strikes and weapon attacks deal 9% of the target's current HP as bonus physical damage and heal for 10% of post-mitigation damage. Every third successful basic hit on the same target applies Clawing Shadows, reducing Movement efficiency by 30% for 2 turns (3-turn Riftbound cooldown).`,lore:`A spectral zweihander bound to the Ruined King's endless hunt.`,reference:`League of Legends · Blade of the Ruined King`,tags:[`unique`,`buildDefining`,`v35`,`viego`,`onHit`],weapon:{range:4.8,damageType:`Physical`,cost:12,attackTags:[`physical`,`weapon`,`v35BorkWeapon`]}});
'''
bundle=once(bundle,catalog_anchor,bork+catalog_anchor,'add Blade of The Ruined King')

# Damage curve hook: compress impossible ordinary packets before HP subtraction.
damage_anchor='let l=Math.max(0,Math.round(o));'
bundle=once(bundle,damage_anchor,'o=RIFT_V35_BALANCE_DAMAGE(e,t,n,o,a);'+damage_anchor,'damage sanity hook')
# Rage/Wrath must run after raw damage lands but before the legacy death resolver decides the fighter is dead.
hp_anchor='n.hp-=l,RIFT_ITEM_AFTER_DAMAGE(e,t,n,l,a),'
bundle=once(bundle,hp_anchor,'n.hp-=l,RIFT_V35_AFTER_RAW_DAMAGE(e,t,n,l,a),RIFT_ITEM_AFTER_DAMAGE(e,t,n,l,a),','raw damage / Wrath hook')

# Battlefield presentation: V35 is a second authored world layer above V34's general tactical grammar.
layer_anchor='(0,E.jsx)(RIFT_V34_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})'
bundle=once(bundle,layer_anchor,'(0,E.jsx)(RIFT_V34_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V35_BATTLEFIELD_FX,{battlefield:e,player:t,enemy:n}),(0,E.jsx)(RIFT_V15_FLOW_LAYER,{battlefield:e})','mount V35 battlefield FX')

# Universal combat HUD resource readout after Spartan's dock.
dock_anchor='(0,E.jsx)(RIFT_SPARTAN_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})'
bundle=once(bundle,dock_anchor,dock_anchor+',(0,E.jsx)(RIFT_V35_RESOURCE_DOCK,{fighter:e,masked:t===`enemy`&&!i(`power`)})','mount V35 resource dock')

if bundle.count('SCHEMA 34')==1: bundle=bundle.replace('SCHEMA 34','SCHEMA 35',1)
export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V35 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle);css_path.write_text(css)
print('Applied Riftbound V35 · Sovereigns of Ruin:')
print(' - Legendary Blade of The Ruined King with current-health on-hit, lifesteal, and Clawing Shadows MP slow')
print(' - Legendary Ruined King with wraith Takeover, Black Mist field, Spectral Maw, and Heartbreaker possession exit')
print(' - Legendary The Unshackled with Petricite Burst, delayed Chain Lash, Abscond/Abduct, and 50/100 Hijack taxation')
print(' - Calamity Ragegod gated behind clearing Floor 10 with Super Strength, using Rage/Berserker and Wrath of the Undying')
print(' - Durability now structurally raises maximum HP and ordinary damage packets use target-HP-aware burst compression')
print(' - early/midgame AI item budgets are staged; Wamuu caps at 3 items while All For One can carry all 6')
print(' - dedicated V35 battlefield FX layer gives Viego bespoke Black Mist, wraith, possession, blade, and Heartbreaker staging')
