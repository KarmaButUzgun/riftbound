from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
bundle_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
parts=Path(__file__).with_name('092-v36-aesthetic-codex-parts')
runtime_paths=sorted(parts.glob('*-runtime.js')); styles_path=parts/'02-styles.css'
for path in [bundle_path,css_path,styles_path]:
    if not path.is_file(): raise SystemExit(f'V36.8 missing {path}')
if not runtime_paths: raise SystemExit('V36.8 runtime parts missing')

bundle=bundle_path.read_text(); css=css_path.read_text(); runtime='\n'.join(path.read_text().strip() for path in runtime_paths); styles=styles_path.read_text().strip()
if 'RIFTBOUND_V36_8' in bundle: raise SystemExit('V36.8 already applied')
for marker in ['RIFTBOUND_V36_7','RIFT_V31_POWER_PROFILE','RIFT_V31_PROFILE_STAGE','RIFT_ITEM_DETAIL']:
    if marker not in bundle: raise SystemExit(f'V36.8 requires {marker}')


def replace_once(text,old,new,label):
    count=text.count(old)
    if count!=1: raise SystemExit(f'V36.8 {label}: expected once, found {count}')
    return text.replace(old,new,1)

# Wheel: keep internal rarity for roll math/color, but present clean rarity plus authored flavor/mechanical copy.
bundle=replace_once(bundle,
'g.filter(e=>e.rollable!==!1).map(e=>({name:e.name,rarity:e.rarity,description:e.passive,glyph:e.glyph,value:e}))',
'g.filter(e=>e.rollable!==!1).map(e=>({name:e.name,rarity:e.rarity,displayRarity:RIFT_V368_POWER_RARITY(e),description:RIFT_V368_POWER_INFO(e).flavor,mechanicalDescription:RIFT_V368_POWER_INFO(e).mechanical,glyph:e.glyph,value:e}))',
'wheel power copy')
bundle=replace_once(bundle,
'(0,E.jsxs)(`div`,{className:`wheel-result`,style:{"--rarity":a[Wl.rarity].color},children:[(0,E.jsxs)(`span`,{children:[Wl.rarity,` result`]}),(0,E.jsx)(`p`,{children:Wl.description})]})',
'(0,E.jsxs)(`div`,{className:`wheel-result`,style:{"--rarity":a[Wl.rarity].color},children:[(0,E.jsxs)(`span`,{children:[Wl.displayRarity||Wl.rarity,` result`]}),(0,E.jsx)(`p`,{className:`wheel-flavor`,children:Wl.description}),(0,E.jsx)(`p`,{className:`wheel-mechanics`,children:Wl.mechanicalDescription||Wl.description})]})',
'wheel result presentation')
bundle=replace_once(bundle,
'let e=g.find(e=>e.name===gi)||g[0],t={name:e.name,rarity:e.rarity,description:e.passive,glyph:e.glyph,value:e}',
'let e=g.find(e=>e.name===gi)||g[0],t={name:e.name,rarity:e.rarity,displayRarity:RIFT_V368_POWER_RARITY(e),description:RIFT_V368_POWER_INFO(e).flavor,mechanicalDescription:RIFT_V368_POWER_INFO(e).mechanical,glyph:e.glyph,value:e}',
'debug wheel copy')

# Armory: never expose internal passive IDs as the visible passive title.
bundle=replace_once(bundle,
'(0,E.jsx)(`strong`,{children:item.passiveId?item.passiveId.replace(/([A-Z])/g,` $1`).toUpperCase():`RELIABLE COMPONENT`})',
'(0,E.jsx)(`strong`,{children:RIFT_V368_PASSIVE_TITLE(item)})',
'item passive title')

# Clean persistent UI surfaces that were presenting update/release engineering as game content.
for old,new,label in [
    ('<small>V20 CONTROL CENTER</small>','<small>DISPLAY & ACCESSIBILITY</small>','access panel release label'),
    ('<small>V21 PRESERVATION</small>','<small>SAVE MANAGEMENT</small>','save vault release label'),
    ('${backups.length} recovery points · ability lock ${RIFT_V21_CONSTITUTION.hash}','${backups.length} recovery points','save vault constitution hash'),
    ('<small>V26 ASCENSION REFRAMED</small>','<small>ASCENSION ROUTE</small>','atlas release label'),
    ('`THE LIVING ARCHIVE · ASCENDANT EDITION`','`THE LIVING ARCHIVE`','codex edition label'),
    ('`V31 FEATURE ARCHIVE`','`TECHNIQUE ARCHIVE`','codex feature label'),
    ('`Enter the remastered archive for authored descriptions, damage intelligence, scaling, geometry, reference output, requirements, effects, and direct move comparison.`','`Study Special Powers and Stands through their techniques, damage, scaling, geometry, requirements, effects, and direct comparisons.`','codex portal copy'),
    ('`REFERENCE DAMAGE`','`ESTIMATED DAMAGE`','move damage label'),
    ('`Authored effect resolver`','`SPECIAL EFFECT`','special effect label'),
    ('`AUTHORED EFFECTS`','`EFFECTS`','effects label'),
    ('`MECHANICS-BACKED · EXPLICIT MOVE CONTRACT`','`TACTICAL SEQUENCE`','preview implementation label'),
    ('`No authored description is available for this technique.`','`No description is available for this technique.`','missing move copy'),
    ('`Awakened overrides earned through the authored evolution`','`Awakened techniques earned through evolution`','evolution implementation copy'),
    ('`New adaptation persists by authored rules`','`New adaptation persists after it is learned`','adaptation implementation copy'),
    ('`Ascend one authored transformation stage`','`Ascend one transformation stage`','transformation implementation copy'),
    ('`authored time response`','`temporal response`','time implementation label'),
    ('`authored special counter`','`special counter`','counter implementation label'),
    ('`Presentation preview · mechanics unchanged`','`TACTICAL PREVIEW`','preview preservation note'),
    ('`BUILD EXPANSION · READ ONLY IN COMBAT`','`CURRENT LOADOUT · READ ONLY IN COMBAT`','combat build update label'),
    ('`BUILD EXPANSION · FULL CATALOG`','`FULL ITEM CATALOG`','shop update label'),
    ('`WAYFARER ARMORY · MEMORY · FAVORITES · BUILD ORDERS`','`FAVORITES · RECIPES · BUILD ORDERS`','armory update label'),
    ('`Your Armory view now survives floors and saves.`','`Plan your build, inspect recipes, and return whenever you need to rework the loadout.`','armory update explanation'),
    ('`WAYFARER QOL · PERSISTENT ARMORY`','`BUILD WORKSPACE`','persistent armory update label'),
    ('<small>V23 INTERFACE REBORN</small>','<small>INPUT & INTERFACE</small>','interface update label'),
]:
    bundle=replace_once(bundle,old,new,label)


# V25 was stamped onto both the closed and open Armory headers.
if bundle.count('`V25 · ARMORY COMPLETE`')!=2: raise SystemExit(f"V36.8 Armory release stamp count changed: {bundle.count('`V25 · ARMORY COMPLETE`')}")
bundle=bundle.replace('`V25 · ARMORY COMPLETE`','`ARMORY`')

# Player-facing mechanics text should describe the finished game, not the update that introduced it.
bundle=replace_once(bundle,' (3-turn Riftbound cooldown)',' (3-turn cooldown)','BORK branded cooldown note')

# Clean rarity presentation anywhere ordinary players can inspect a power outside the Codex.
bundle=replace_once(bundle,'w.lootOffer.power.rarityLabel||w.lootOffer.power.rarity','RIFT_V368_POWER_RARITY(w.lootOffer.power)','loot power rarity')
bundle=replace_once(bundle,'e.power.rarityLabel||e.power.rarity','RIFT_V368_POWER_RARITY(e.power)','build sheet power rarity')
bundle=replace_once(bundle,'w.lootOffer.power.passive','RIFT_V368_POWER_PASSIVE(w.lootOffer.power)','loot power passive')
bundle=replace_once(bundle,'children:e.power.passive','children:RIFT_V368_POWER_PASSIVE(e.power)','build sheet power passive')
# Debug selectors also use the same clean taxonomy so screenshots/tools never reintroduce explanatory rarity labels.
bundle=replace_once(bundle,'e.name,` · `,e.rarityLabel||e.rarity','e.name,` · `,RIFT_V368_POWER_RARITY(e)','debug power rarity')
bundle=replace_once(bundle,'Gl.rarityLabel||Gl.rarity','RIFT_V368_POWER_RARITY(Gl)','debug effect rarity')


# Tactical counterplay copy is visible in the Codex; describe the counter, not the resolver that implements it.
if bundle.count('causality / authored time response')!=2: raise SystemExit(f"V36.8 authored time-response count changed: {bundle.count('causality / authored time response')}")
bundle=bundle.replace('causality / authored time response','causality / temporal response')

# Naturalize the two V31 summary sentences that literally described implementation methodology.
old='` On the archive standard it previews at ${reference.damage} damage before live build, target, status, terrain, and resolver effects.`'
new='` Estimated damage: ${reference.damage} before target defenses, statuses, terrain, and combat modifiers.`'
bundle=replace_once(bundle,old,new,'move estimate methodology')
old='` Its result is governed by authored effects rather than the generic damage coefficient.`'
new='` Its result is driven by special effects rather than a standard damage coefficient.`'
bundle=replace_once(bundle,old,new,'special resolver methodology')

export='export{xs as default};'
if bundle.count(export)!=1: raise SystemExit('V36.8 export seam changed')
bundle=bundle.replace(export,runtime+'\n'+export,1)
css=css.rstrip()+'\n\n'+styles+'\n'
bundle_path.write_text(bundle); css_path.write_text(css)

# Run the aesthetic verifier after every older V36 compatibility rewrite.
wrapper=Path.cwd()/'scripts'/'prepare-v35-verifier-compat.mjs'
if wrapper.is_file():
    line="await import('./prepare-v368-verifier-compat.mjs');"
    text=wrapper.read_text()
    text='\n'.join(row for row in text.splitlines() if row.strip()!=line)
    wrapper.write_text(text.rstrip()+'\n'+line+'\n')

print('Applied Riftbound V36.8 · Aesthetic Codex + Clean Player Copy')
