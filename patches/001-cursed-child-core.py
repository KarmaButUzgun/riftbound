from pathlib import Path
import sys

root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/rift03/riftbound-standalone')
js_path = root / 'assets/page-F6OuavDb.js'
css_path = root / 'assets/riftbound.css'
s = js_path.read_text()
css = css_path.read_text()
changes=[]

def repl(old,new,label,count=1):
    global s
    actual=s.count(old)
    if actual!=count:
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    s=s.replace(old,new,count)
    changes.append(label)

def add_before(anchor,text,label,count=1):
    global s
    actual=s.count(anchor)
    if actual!=count:
        raise SystemExit(f'{label}: expected anchor {count}, found {actual}')
    s=s.replace(anchor,text+anchor,count)
    changes.append(label)

# 1. Correct Cursed Child's actual four-move kit.
old_moves='''name:`Cursed Child`,rarity:`Mythic`,passive:`Monstrous Reserves quadruple base Cursed Energy. Rika can fight independently under Hunt, Protect, or Hold commands. Full Manifestation lasts fifteen owner turns, massively accelerates Cursed Energy regeneration, and unlocks Mimicry.`,damageType:`Hybrid`,glyph:`愛`,accent:`#f4b9ff`,moves:[m(`Reversed Cursed Technique`,`Aim at yourself or an ally to restore HP with positive energy. Undead and cursed-spirit enemies are damaged instead.`,24,0,0,[`magic`,`cursedRct`]),m(`Mimicry`,`Open the copied-technique arsenal. The menu has no universal cooldown; each copied technique recovers independently for three owner turns. Requires Fully Manifested Rika.`,0,0,0,[`mimicryMenu`,`bonusAction`,`selfCast`]),m(`Rika`,`Manifest Rika partially as an allied AI combatant. Partial Rika is a potent physical fighter but grants no personal buffs.`,0,0,0,[`rikaPartialSummon`,`selfCast`]),m(`Authentic Mutual Love`,`Expand a closed barrier domain for ten fighter turns. The preselected copied technique becomes a recurring sure-hit, while a new katana carrying a random non-Ultimate offensive technique replaces your weapon every turn.`,84,0,.65,[`magic`,`authenticMutualLove`,`domainAdvantage`])]'''
new_moves='''name:`Cursed Child`,rarity:`Mythic`,passive:`Monstrous Reserves quadruple base Cursed Energy. Rika can fight independently under Hunt, Protect, or Hold commands. Full Manifestation lasts fifteen owner turns, massively accelerates Cursed Energy regeneration, and unlocks Mimicry.`,damageType:`Hybrid`,glyph:`愛`,accent:`#f4b9ff`,moves:[m(`Reversed Cursed Technique`,`Aim at yourself or an ally to restore HP with positive energy. Undead and cursed-spirit enemies are damaged instead.`,24,0,0,[`magic`,`cursedRct`]),m(`Swordsmanship`,`Enter a live sword parry without replacing Guard. The next direct strike is caught and countered; incoming projectiles are cut back down their own line.`,0,0,0,[`cursedSwordParry`,`selfCast`]),m(`Mimicry`,`Open the copied-technique arsenal and choose one technique to use. Opening Mimicry spends no action and has no universal cooldown; each copied technique recovers independently for three owner turns. Requires Fully Manifested Rika.`,0,0,0,[`mimicryMenu`,`freeAction`,`selfCast`]),m(`Authentic Mutual Love`,`Choose one copied technique, then expand a closed barrier domain for ten owner turns. The chosen technique becomes the recurring sure-hit, while a new katana carrying a random non-Ultimate offensive technique replaces your weapon every turn.`,84,0,.65,[`magic`,`authenticMutualLove`,`domainAdvantage`])]'''
repl(old_moves,new_moves,'restore Guard and make Swordsmanship move 2 / Mimicry move 3')

# 2. Rika gets its own independent action source, never appended to the classic move bar.
anchor='''function RIFT_RIKA_COMBATANT(e,t){return(e.auxiliaryCombatants||[]).find(e=>e.fighter.statuses?.rikaCompanion&&e.fighter.statuses.rikaOwnerId===t&&e.fighter.hp>0)||null}'''
rika_actions=r'''function RIFT_RIKA_ACTIONS(e){if(!RIFT_CURSED_CHILD(e))return[];RIFT_PREP_CURSED_CHILD(e);let t=e.statuses.rikaCombatHint,n=[];if(!t&&!e.statuses.rikaLocked)n.push({id:`rika-partial`,name:`Partial Rika`,description:`Manifest Rika as an autonomous allied fighter. Partial Rika grants no personal buffs and leaves Mimicry sealed.`,glyph:`里`,type:`special`,cost:0,move:{name:`Partial Manifestation`,description:`Give Rika a partial body beside her user.`,cost:0,power:0,destruction:0,tags:[`rikaPartialSummon`,`selfCast`]},sourcePower:`Cursed Child`});if(!e.statuses.rikaLocked&&!e.statuses.rikaFullSpent&&!t?.full)n.push({id:`rika-full`,name:`Full Manifestation`,description:`Manifest Rika completely for 15 owner turns. Full Rika is stronger, unlocks Mimicry, and massively accelerates Cursed Energy regeneration. This can happen only once per fight.`,glyph:`愛`,type:`special`,cost:Rr(e,28),move:{name:`Full Manifestation`,description:`Give the Queen of Curses a complete body.`,cost:28,power:0,destruction:0,tags:[`rikaFullManifest`,`selfCast`]},sourcePower:`Cursed Child`});if(t){for(let[r,i,a]of[[`hunt`,`牙`,`Prioritize Bite and aggressive close combat.`],[`protect`,`護`,`Stay close to the user and use defensive protection when pressure rises.`],[`hold`,`止`,`Hold position and defend instead of pursuing targets.`]])n.push({id:`rika-command-${r}`,name:r[0].toUpperCase()+r.slice(1),description:a,glyph:i,type:`special`,cost:0,move:{name:`Rika Command · ${r}`,description:a,cost:0,power:0,destruction:0,tags:[`rikaCommand`,`rikaCommand:${r}`,`bonusAction`,`selfCast`]},sourcePower:`Cursed Child`});t.full&&n.push({id:`rika-pure-love-command`,name:`Pure Love`,description:`Command Fully Manifested Rika to unleash her catastrophic beam. Requires 100% Rika Ultimate and returns Rika to Partial Manifestation afterward.`,glyph:`純`,type:`special`,cost:0,move:{name:`Pure Love · Command`,description:`Order Rika to release Pure Love.`,cost:0,power:0,destruction:0,tags:[`rikaPureLoveCommand`,`bonusAction`,`selfCast`]},sourcePower:`Cursed Child`})}return n}'''
repl(anchor,rika_actions+anchor,'add dedicated Rika control action source')

# 3. Main action list: no Guard replacement, no Rika buttons, no sure-hit cycling, no copied-technique explosion.
start=s.find('if(RIFT_CURSED_CHILD(e)){RIFT_PREP_CURSED_CHILD(e);C[1]=')
if start<0: raise SystemExit('main Cursed Child action block start not found')
marker='}w&&T&&!Qn(e)&&C.push'
end=s.find(marker,start)
if end<0: raise SystemExit('main Cursed Child action block end not found')
replacement='''if(RIFT_CURSED_CHILD(e)){RIFT_PREP_CURSED_CHILD(e);C[7].cost=Rr(e,84);if(e.statuses.authenticLoveWeapon&&C[3])C[3]={...C[3],name:`Domain Katana · ${e.statuses.authenticLoveWeapon.move.name}`,description:`A temporary katana carrying ${e.statuses.authenticLoveWeapon.sourcePower} · ${e.statuses.authenticLoveWeapon.move.name}. A successful weapon hit releases the embedded technique at reduced output.`,glyph:`刀`,domainTechnique:P(e.statuses.authenticLoveWeapon)}}'''
s=s[:start]+replacement+s[end+1:]
changes.append('remove Cursed Child buttonfest from classic action list')

# 4. Swordsmanship is a normal defensive move, not Guard, and intentionally has no cooldown.
old='''function za(e){let t=e.move?.tags||[];return!e.move||!Number.isFinite(e.moveIndex)||(e.moveIndex||0)<0||(e.moveIndex||0)>2||e.type===`guard`||e.type===`rest`||e.type===`strike`||e.type===`weapon`||e.type===`ultimate`||e.cost<=0||t.includes(`bonusAction`)||t.includes(`freeAction`)||t.includes(`passive`)?0:(e.moveIndex||0)+1}'''
new='''function za(e){let t=e.move?.tags||[];return!e.move||!Number.isFinite(e.moveIndex)||(e.moveIndex||0)<0||(e.moveIndex||0)>2||e.type===`guard`||e.type===`rest`||e.type===`strike`||e.type===`weapon`||e.type===`ultimate`||e.cost<=0||t.includes(`bonusAction`)||t.includes(`freeAction`)||t.includes(`passive`)||t.includes(`cursedSwordParry`)?0:(e.moveIndex||0)+1}'''
repl(old,new,'make Swordsmanship repeatable like Guard')

# Explicit targeting label for the parry stance.
old='''if(e.type===`guard`||e.type===`rest`)return{requiresAim:!1,shape:`self`,range:0,radius:3.8,ignoresCover:!0,label:`SELF`,naturalRange:!0};if(n.includes(`standJump`)'''
new='''if(e.type===`guard`||e.type===`rest`)return{requiresAim:!1,shape:`self`,range:0,radius:3.8,ignoresCover:!0,label:`SELF`,naturalRange:!0};if(n.includes(`cursedSwordParry`))return{requiresAim:!1,shape:`self`,range:0,radius:3.8,ignoresCover:!0,label:`PARRY STANCE`,naturalRange:!0};if(n.includes(`standJump`)'''
repl(old,new,'give Swordsmanship a self/parry targeting profile')

# Swordsmanship must arm its parry even though it is now a special move instead of type=guard.
old='''if(n.type!==`guard`&&!(Bn(i)&&i.statuses.perfectBodyGuard)&&(i.guard=!1,delete i.statuses.infinity),n.type===`guard`){'''
new='''if(n.type!==`guard`&&!(Bn(i)&&i.statuses.perfectBodyGuard)&&(i.guard=!1,delete i.statuses.infinity),u.includes(`cursedSwordParry`)){i.lastMove=P(n),i.statuses.cursedSwordParry=1,G(e,`SWORDSMANSHIP // ${i.name} settles into a live parry without giving up the normal Guard option. Direct strikes will be countered and projectile lines can be returned.`,`mythic`);return}if(n.type===`guard`){'''
repl(old,new,'execute Swordsmanship as move 2 instead of Guard')

# 5. Authentic Mutual Love consumes the technique chosen by the pre-cast picker.
old='''if(h.includes(`authenticMutualLove`)){let t=zo(e,i,s,`authenticMutualLove`),r=RIFT_MIMIC_BY_ID(i,i.statuses.authenticLoveSureHitId)||i.mimicryInventory?.[0];'''
new='''if(h.includes(`authenticMutualLove`)){n.domainSureHitId&&(i.statuses.authenticLoveSureHitId=n.domainSureHitId);let t=zo(e,i,s,`authenticMutualLove`),r=RIFT_MIMIC_BY_ID(i,i.statuses.authenticLoveSureHitId)||i.mimicryInventory?.[0];'''
repl(old,new,'bind selected sure-hit once when domain is cast')

# 6. Clicking Mimicry/domain immediately opens their selector GUIs instead of selecting a card twice.
old='''$o=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||A||Jt)return;if(yt!==e.id){bt(e.id),q(`click`);return}if(bt(null),yr(w.player)&&e.move?.tags?.includes(`symbolFactorWheel`)){'''
new='''$o=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||A||Jt)return;if(RIFT_CURSED_CHILD(w.player)&&e.move?.tags?.includes(`mimicryMenu`)){if(qa(w,e,A,!!Jt,w.enemy))return;bt(null),Wt({kind:`cursed-mimicry`,selected:[]}),q(`click`);return}if(RIFT_CURSED_CHILD(w.player)&&e.move?.tags?.includes(`authenticMutualLove`)){if(qa(w,e,A,!!Jt,w.enemy))return;bt(null),Wt({kind:`cursed-domain`,selected:[],action:P(e)}),q(`limit`);return}if(yt!==e.id){bt(e.id),q(`click`);return}if(bt(null),yr(w.player)&&e.move?.tags?.includes(`symbolFactorWheel`)){'''
repl(old,new,'open Mimicry and sure-hit selectors directly from core moves')

js_path.write_text(s)
print("Applied Cursed Child core action architecture")
