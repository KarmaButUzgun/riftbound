from pathlib import Path
import sys

root=Path(sys.argv[1])
bundle_path=root/'assets/page-F6OuavDb.js'
css_path=root/'assets/riftbound.css'
if not bundle_path.is_file() or not css_path.is_file():
    raise SystemExit('V14: production bundle/CSS missing')
text=bundle_path.read_text()
css=css_path.read_text()
marker='/* Riftbound Beneath The Drowning Update V14 */'
if marker in text:
    raise SystemExit('V14 already applied')

def once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f'V14 {label}: expected one anchor, found {count}')
    text=text.replace(old,new,1)

# 1) New items before reference-lore normalization/catalog freeze.
anchor='''  for(const RIFT_REFERENCE_LORE_ITEM of items){'''
insert='''  add({"id":"gluttony-ring","name":"Gluttony Ring","rarity":"Epic","category":"Relic","price":360,"stats":{"ap":4},"recipe":["devil-coin","fate-die","mana-prism"],"glyph":"◉","accent":"#a856ff","lore":"The ring that once belonged to the unreliable coward.","passive":"Gluttony: destroying enemy or neutral battlefield objects grants Shards. Objects you own cannot be farmed for Shards.","passiveId":"gluttonyRing","reference":"Beneath The Drowning","tags":["economy","object-break"]});
  add({"id":"cursed-promise-ring","name":"Cursed Promise Ring","rarity":"Legendary","category":"Relic","price":1020,"stats":{},"recipe":["sorcerer's-index","causal-abacus","saint's-reliquary"],"glyph":"◌","accent":"#b49cff","lore":"A promise carried in cursed metal, binding borrowed technique and manifested devotion to the same vow.","passive":"Copied and stolen abilities gain accuracy and critical chance. Summons regenerate slightly each turn and gain 20% Movement.","passiveId":"cursedPromise","reference":"Jujutsu Kaisen","tags":["copy","summon","crit"]});
  add({"id":"pilot-goggles","name":"Pilot Goggles","rarity":"Legendary","category":"Utility","price":1120,"stats":{"energy":4,"as":4,"ap":4},"recipe":["redline-gauntlet","twin-prism","aurora-capacitor"],"glyph":"◍","accent":"#72d7ff","lore":"The goggles that belong to the Champion of Dreams, who once saved the world through love and compassion. These are his goggles that denied fate and expectations.","passive":"Endless Love: when a Special crits, refund its Energy cost and cooldown. When an Ultimate crits, restart Ultimate charge at 50%.","passiveId":"endlessLove","reference":"Beneath The Drowning","tags":["crit","refund","build-defining"]});

'''+anchor
once(anchor,insert,'item catalog insertion')

# 2) Add Aura Accumulation + debug/full Mutated power before Speedster.
old='''m(`Great Power`,`Spend all Energy on one immense, Guard-Breaking punch.`,100,3.2,3.1,[`physical`,`guardbreak`,`allEnergy`])]},{name:`Speedster`'''
new='''m(`Great Power`,`Spend all Energy on one immense, Guard-Breaking punch.`,100,3.2,3.1,[`physical`,`guardbreak`,`allEnergy`])]},{name:`Aura Accumulation`,rarity:`Common`,passive:`Fighting Prowess: the lower your HP, the higher your Speed, Attack Strength, Battle IQ, and Combat Skill.`,damageType:`Physical`,glyph:`氣`,accent:`#78d7ff`,reference:`Beneath The Drowning`,moves:[m(`Bone Breaker`,`Launch forward and smash the target. The impact sends an airwave through the space behind them.`,14,1.18,1.45,[`physical`,`scalingAS`,`v14BoneBreaker`]),m(`Smart Counter`,`Enter a counter stance for one turn. An incoming AS-Dominant attack is fully countered; if nothing valid is countered, lose half your MP next turn.`,10,0,.4,[`v14SmartCounter`,`selfCast`]),m(`Bone Breaker Rapid`,`A vicious twelve-hit slum-boxing barrage. It deals more native damage than Super Strength's barrage but cannot trigger on-hit item passives.`,25,.19,.85,[`physical`,`scalingAS`,`multi`,`noItemProc`,`v14Rapid`],12),m(`Super Duper Bone Breaker`,`Requires 100% Energy. A devastating close-range punch that Cripples the target and launches a widening cone of destructive pressure beyond them.`,100,3.7,4.4,[`physical`,`scalingAS`,`guardbreak`,`allEnergy`,`v14SuperDuper`])]},{name:`Mutated Aura Accumulation`,rarity:`Mythic`,rarityLabel:`Unrollable · Hidden Questline`,rollable:!1,enemyRollable:!1,codexHidden:!0,passive:`Fighting Prowess. True Resolve. Six inherited patterns converge into one impossible fighting style.`,damageType:`Physical`,glyph:`愛`,accent:`#a7e7ff`,reference:`Beneath The Drowning`,moves:[m(`Whipsaint Breaker`,`Fire blood whips from the wrists. Grapple terrain, or reel into an enemy and deliver an amplified Bone Breaker.`,15,1.48,1.4,[`physical`,`scalingAS`,`v14Whipsaint`,`v14BoneBreaker`,`v14Haisha`]),m(`Repeat`,`Repeat the last kinetic action at 120% effectiveness. Bonus Action, once per turn; expensive and halves next turn's MP.`,32,0,0,[`v14Repeat`,`bonusAction`,`selfCast`,`v14Haisha`]),m(`Translucency`,`Turn the body into reflective crystal. Become invisible to pick attacks, partially reflect light, gain Durability, but lose mobility.`,24,0,.2,[`v14Translucency`,`selfCast`,`v14Haisha`]),m(`Mach Beyond`,`Assemble the entire inherited toolkit into one blitzing punch. Requires F-Inertia, Whipsaint ready, a fresh Air Jump, and Repeat ready.`,100,4.15,4.2,[`physical`,`scalingAS`,`v14MachBeyond`,`guardbreak`,`allEnergy`,`v14Haisha`])]},{name:`Speedster`'''
once(old,new,'Aura Accumulation power insertion')

# 3) Crit hook for F-Inertia, Cursed Promise Ring, Pilot Goggles.
once('(h.includes(`crit`)||Pn(i).tags.includes(`crit`))&&Math.random()<.22?', '(h.includes(`crit`)||Pn(i).tags.includes(`crit`)||RIFT_V14_CAN_CRIT(i,n,h))&&Math.random()<RIFT_V14_CRIT_CHANCE(i,n,h)?', 'crit classifier/chance hook')
once('if(de>0&&C&&h.includes(`standStrike`)', 'if(de>0&&C)RIFT_V14_ON_CRIT(e,i,n,h,de);if(de>0&&C&&h.includes(`standStrike`)', 'post-crit item hook')

# 4) Hide hidden route from Codex.
once('it===`powers`&&g.map(', 'it===`powers`&&g.filter(e=>!e.codexHidden).map(', 'Codex hidden power filter')

# 5) Keep V14 utilities outside main move grid.
once('wl.filter(e=>!e.move?.tags?.includes(`spardaWeaponSwitch`)).map(', 'wl.filter(e=>!e.move?.tags?.includes(`spardaWeaponSwitch`)&&!e.move?.tags?.includes(`v14UtilityButton`)).map(', 'main action grid utility filter')
old='''}),!!kn(w.player).length&&'''
new='''}),(0,E.jsx)(`div`,{className:`v14-utility-strip`,children:wl.filter(e=>e.move?.tags?.includes(`v14UtilityButton`)).map(e=>{let o=qa(w,e,A,!!Jt,xl||w.enemy),t=Va(w.player,e);return(0,E.jsxs)(`button`,{type:`button`,className:`v14-utility-button ${e.id===`v14-pass`?`v14-pass-button`:``}`,disabled:!!o,onClick:()=>$o(e),title:o||e.description,children:[(0,E.jsx)(`b`,{children:e.glyph}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:e.move?.tags?.includes(`bonusAction`)?`UTILITY · BONUS ACTION`:`UTILITY · FULL TURN`}),(0,E.jsx)(`strong`,{children:e.name})]}),(0,E.jsx)(`em`,{children:o?o:t?`${t}T CD`:e.id===`v14-air-jump`?`${RIFT_V14_AIR_COST(w.player)} ENERGY`:e.id===`v14-f-inertia`?`RECOIL ACTIVE`:`SPEND TURN`})]},e.id)})}),!!kn(w.player).length&&'''
once(old,new,'utility strip render')

# 6) Whisper/cutscene/unlock overlays before successor surface.
once('w.phase===`successor`&&w.successorOffer&&', 'w.phase===`v14AaWhisper`&&(0,E.jsx)(RIFT_V14_AA_WHISPER,{run:w,onCommit:T}),(0,E.jsx)(RIFT_V14_MACH_CUTSCENE,{run:w}),(0,E.jsx)(RIFT_V14_UNLOCK_TOAST,{run:w}),w.phase===`successor`&&w.successorOffer&&', 'V14 overlay render')

# 7) Translucency map visibility classes.
player_old='''className:`map-fighter player ${n.moving?`actively-moving`:``} ${t.statuses.projectionFrame?`projection-framed`:``} ${t.statuses.infinity?`infinity`:``} ${t.statuses.hakiArmamentCoat?`armament-coated`:``} ${t.statuses.hakiConquerorCoat?`conqueror-coated`:``} ${t.statuses.hakiDodge?`observation-active`:``} ${t.statuses.soulSeparated?`soul-body`:``} ${e.elevation.player?`elevated`:``} ${RIFT_SPARTAN_MODEL_CLASS(t)}`'''
player_new='''className:`map-fighter player ${n.moving?`actively-moving`:``} ${t.statuses.projectionFrame?`projection-framed`:``} ${t.statuses.infinity?`infinity`:``} ${t.statuses.hakiArmamentCoat?`armament-coated`:``} ${t.statuses.hakiConquerorCoat?`conqueror-coated`:``} ${t.statuses.hakiDodge?`observation-active`:``} ${t.statuses.soulSeparated?`soul-body`:``} ${e.elevation.player?`elevated`:``} ${t.statuses.v14Translucent?`v14-translucent-self`:``} ${RIFT_SPARTAN_MODEL_CLASS(t)}`'''
if text.count(player_old)==1:
    text=text.replace(player_old,player_new,1)
else:
    raise SystemExit(f'V14 player translucency class anchor expected one, found {text.count(player_old)}')
enemy_old='''className:`map-fighter enemy ${t.moving?`actively-moving`:``} ${n.statuses.projectionFrame?`projection-framed`:``} ${a===`enemy`?`selected-target`:``} ${n.hp<=0?`defeated`:``} ${n.statuses.infinity?`infinity`:``} ${n.statuses.hakiArmamentCoat?`armament-coated`:``} ${n.statuses.hakiConquerorCoat?`conqueror-coated`:``} ${n.statuses.hakiDodge?`observation-active`:``} ${n.statuses.soulSeparated?`soul-body`:``} ${e.elevation.enemy?`elevated`:``} ${RIFT_SPARTAN_MODEL_CLASS(n)}`'''
enemy_new='''className:`map-fighter enemy ${t.moving?`actively-moving`:``} ${n.statuses.projectionFrame?`projection-framed`:``} ${a===`enemy`?`selected-target`:``} ${n.hp<=0?`defeated`:``} ${n.statuses.infinity?`infinity`:``} ${n.statuses.hakiArmamentCoat?`armament-coated`:``} ${n.statuses.hakiConquerorCoat?`conqueror-coated`:``} ${n.statuses.hakiDodge?`observation-active`:``} ${n.statuses.soulSeparated?`soul-body`:``} ${e.elevation.enemy?`elevated`:``} ${n.statuses.v14Translucent?`v14-translucent-hidden`:``} ${RIFT_SPARTAN_MODEL_CLASS(n)}`'''
if text.count(enemy_old)==1:
    text=text.replace(enemy_old,enemy_new,1)
else:
    raise SystemExit(f'V14 enemy translucency class anchor expected one, found {text.count(enemy_old)}')

# 8) Runtime payload just before export.
parts=Path(__file__).with_name('047-btd-v14-parts')
Runtime_path=parts/'01-runtime-v14.js'
Styles_path=parts/'02-styles-v14.css'
if not Runtime_path.is_file() or not Styles_path.is_file(): raise SystemExit('V14 payload not unpacked')
runtime=Runtime_path.read_text()
export='export{xs as default};'
if text.count(export)!=1:
    raise SystemExit(f'V14 export seam expected one, found {text.count(export)}')
text=text.replace(export,runtime+'\n'+export,1)

# 9) Styles.
styles=Styles_path.read_text()
css+='\n'+styles+'\n'

bundle_path.write_text(text)
css_path.write_text(css)
print('Applied V14: Beneath The Drowning items, Aura Accumulation, hidden Haisha route, Pass Turn, and Mach Beyond presentation.')
