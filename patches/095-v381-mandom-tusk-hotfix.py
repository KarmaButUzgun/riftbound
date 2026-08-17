from pathlib import Path
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
path=root/'assets/page-F6OuavDb.js'
text=path.read_text()

# Mandom has no Ultimate. Legacy VFX/cinematic lookup flattened the Stand move lists
# with a literal null Ultimate and then dereferenced `.name` inside findIndex.
null_moves='n?[...n.nonSummoned,...n.summoned,n.ultimate]:[]'
if text.count(null_moves)!=2:
    raise SystemExit(f'V38.1 nullable Stand VFX anchor changed: {text.count(null_moves)}')
text=text.replace(null_moves,'n?[...n.nonSummoned,...n.summoned,n.ultimate].filter(Boolean):[]')

# Mandom is shoulder-bound, but its revolver is not melee-ranged. The Stand range also
# feeds authored presentation/Codex surfaces, while explicit V38 geometry owns targeting.
mandom='Object.freeze({name:`Mandom`,rarity:`Legendary`,glyph:`⌚`,accent:`#b9a58d`,range:0,'
if text.count(mandom)!=1:
    raise SystemExit(f'V38.1 Mandom range anchor changed: {text.count(mandom)}')
text=text.replace(mandom,'Object.freeze({name:`Mandom`,rarity:`Legendary`,glyph:`⌚`,accent:`#b9a58d`,range:48,')

geometry='if(tags.includes(`v38Chuminin`))return{requiresAim:true,shape:`target`,range:9999,radius:3,ignoresCover:true,label:`DEFENSE TEAR · MAP-WIDE`,naturalRange:true};if(tags.includes(`v38MandomRewind`)'
geometry_fixed='if(tags.includes(`v38Chuminin`))return{requiresAim:true,shape:`target`,range:9999,radius:3,ignoresCover:true,label:`DEFENSE TEAR · MAP-WIDE`,naturalRange:true};if(tags.includes(`v38Ricoshoot`))return{requiresAim:true,shape:`projectile`,range:54,radius:2,ignoresCover:false,label:`RICOSHOOT · REVOLVER 54m`,naturalRange:true};if(tags.includes(`v38Shoot`))return{requiresAim:true,shape:`projectile`,range:48,radius:2,ignoresCover:false,label:`REVOLVER SHOT · 48m`,naturalRange:true};if(tags.includes(`v38QuickRevolver`))return{requiresAim:true,shape:`projectile`,range:44,radius:2,ignoresCover:false,label:`QUICK REVOLVER · 44m`,naturalRange:true};if(tags.includes(`v38MandomRewind`)'
if text.count(geometry)!=1:
    raise SystemExit(f'V38.1 firearm geometry anchor changed: {text.count(geometry)}')
text=text.replace(geometry,geometry_fixed)

# Basic Strike intentionally receives Infinite Rotation semantics in Act 4, but unlike
# Specials it has no `move` object in the legacy action deck. Build a safe move shell.
act4='if(RIFT_V38_ACT(f)===4&&(a.type===`strike`||tags.includes(`v38Tusk`)))return{...a,cost:tags.includes(`v38HerbalTea`)?0:a.cost,move:{...a.move,cost:tags.includes(`v38HerbalTea`)?0:a.move.cost,tags:[...new Set([...tags,`guaranteedHit`,`causality`,`causal`,`v38InfiniteSpin`])]}};'
act4_fixed='if(RIFT_V38_ACT(f)===4&&(a.type===`strike`||tags.includes(`v38Tusk`))){const nextCost=tags.includes(`v38HerbalTea`)?0:Number(a.move?.cost??a.cost??0);return{...a,cost:nextCost,move:{...(a.move||{}),name:a.move?.name||a.name,description:a.move?.description||a.description,cost:nextCost,power:Number(a.move?.power||0),destruction:Number(a.move?.destruction||0),tags:[...new Set([...tags,`guaranteedHit`,`causality`,`causal`,`v38InfiniteSpin`])]}}};'
if text.count(act4)!=1:
    raise SystemExit(f'V38.1 Tusk Act 4 action anchor changed: {text.count(act4)}')
text=text.replace(act4,act4_fixed)

export='export{xs as default};'
if text.count(export)!=1:
    raise SystemExit(f'V38.1 export seam changed: {text.count(export)}')
text=text.replace(export,'globalThis.RIFTBOUND_V38_1=Object.freeze({version:`38.1`,hotfix:`Mandom + Tusk`});'+export)

path.write_text(text)
print('Applied Riftbound V38.1 · Mandom + Tusk Hotfix')
print(' - null-safe Stand VFX lookup for Stands without Ultimates')
print(' - Mandom Shoot 48m / Ricoshoot 54m and D4C Quick Revolver 44m firearm geometry')
print(' - direct Tusk Act 4 action decks safely synthesize Infinite Rotation Strike metadata')
