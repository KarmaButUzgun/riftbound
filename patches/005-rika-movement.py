from pathlib import Path
import sys

root = Path(sys.argv[1])
js_path = root / 'assets/page-F6OuavDb.js'
s = js_path.read_text()
changes = []
has_cursed_ui = 'function RIFT_RIKA_ACTIONS(' in s and 'className:`rika-command-dock`' in s

def repl(old, new, label, count=1, optional=False):
    global s
    actual = s.count(old)
    if actual != count:
        if optional and actual == 0:
            print(f'SKIP (intermediate build): {label}')
            return False
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    s = s.replace(old, new, count)
    changes.append(label)
    return True

# 1. Rika spawns beside her owner instead of letting the generic spawn resolver
# accept the owner's exact origin as a legal tile.
anchor = 'function RIFT_SUMMON_RIKA(e,t,n,r){'
helper = '''function RIFT_RIKA_SPAWN_POINT(e,t){let n=W(e,t),r=H(e).filter(e=>e.id!==t&&e.fighter.hp>0).map(e=>W(e,e.id)),i=U(e,t)?.team===e.playerTeam?0:Math.PI;for(let a=0;a<16;a+=1){let o=i+a/16*Math.PI*2,s={x:M(n.x+Math.cos(o)*4.8,4,e.battlefield.width-4),y:M(n.y+Math.sin(o)*4.8,4,e.battlefield.height-4)};if(I(s,n)>=3.6&&!Rt(e.battlefield,s)&&r.every(e=>I(e,s)>=5.5))return s}let a={x:M(n.x+Math.cos(i)*7,4,e.battlefield.width-4),y:M(n.y+Math.sin(i)*7,4,e.battlefield.height-4)};return Wi(e.battlefield,a,[n,...r])}'''
repl(anchor, helper + anchor, 'add adjacent Rika spawn resolver')

old = 'let a=RIFT_BUILD_RIKA(n,t,r),o=`rika-${F()}`,s=Wi(e.battlefield,W(e,n),Ft(e,n).map(e=>e.position)),c=mt(a);'
new = 'let a=RIFT_BUILD_RIKA(n,t,r),o=`rika-${F()}`,s=RIFT_RIKA_SPAWN_POINT(e,n),c=mt(a);'
repl(old, new, 'spawn Rika beside owner')

# 2. The owner and their own Rika are mutually non-blocking movement occupants.
# Other fighters still collide with Rika normally.
old = 'function Ft(e,t){let n=Cn(t);return H(e).filter(e=>e.id!==t&&e.id!==n&&e.fighter.hp>0).map(t=>({id:t.id,name:t.fighter.name,position:W(e,t.id)}))}'
new = 'function Ft(e,t){let n=Cn(t),r=U(e,t),i=r?.fighter.statuses?.rikaOwnerId||null;return H(e).filter(e=>e.id!==t&&e.id!==n&&e.fighter.hp>0&&!(e.fighter.statuses?.rikaCompanion&&e.fighter.statuses.rikaOwnerId===t)&&!(i&&e.id===i)).map(t=>({id:t.id,name:t.fighter.name,position:W(e,t.id)}))}'
repl(old, new, 'make owner and Rika pass through each other')

# 3. Rika gets a movement command in her own dock. It opens a dedicated RIKA
# map mode rather than hijacking Pochita / Control's generic companion mode.
old = 'if(t){for(let[r,i,a]of[[`hunt`,`牙`,`Prioritize Bite and aggressive close combat.`]'
new = 'if(t){n.push({id:`rika-move`,name:`Move Rika`,description:`Open the tactical map and reposition Rika using her own independent Movement Points. This never spends the user’s action or MP.`,glyph:`➤`,type:`special`,cost:0,move:{name:`Rika Movement`,description:`Reposition Rika using her own Movement Points.`,cost:0,power:0,destruction:0,tags:[`rikaManualMove`,`freeAction`,`selfCast`]},sourcePower:`Cursed Child`});for(let[r,i,a]of[[`hunt`,`牙`,`Prioritize Bite and aggressive close combat.`]'
repl(old, new, 'add Move Rika command', optional=not has_cursed_ui)

# 4. Tactical map knows Rika as a distinct movable entity with her own MP pool.
old = 'ee=e.auxiliaryCombatants.find(t=>t.team===e.playerTeam&&t.fighter.hp>0&&(t.fighter.statuses.pochitaCompanion||t.fighter.statuses.controlSlave)),x=t===`stand`&&e.player.stand?.summoned?Cn(`player`):t===`companion`&&ee?ee.id:`player`'
new = 'ee=e.auxiliaryCombatants.find(t=>t.team===e.playerTeam&&t.fighter.hp>0&&(t.fighter.statuses.pochitaCompanion||t.fighter.statuses.controlSlave)),rikaUnit=e.auxiliaryCombatants.find(t=>t.team===e.playerTeam&&t.fighter.hp>0&&t.fighter.statuses.rikaCompanion&&t.fighter.statuses.rikaOwnerId===`player`),x=t===`stand`&&e.player.stand?.summoned?Cn(`player`):t===`rika`&&rikaUnit?rikaUnit.id:t===`companion`&&ee?ee.id:`player`'
repl(old, new, 'add dedicated Rika map actor')

old = ']}),ee&&(0,E.jsxs)(`button`,{type:`button`,className:t===`companion`?`active`:``,onClick:()=>u(`companion`)'
new = ']}),rikaUnit&&(0,E.jsxs)(`button`,{type:`button`,className:t===`rika`?`active`:``,onClick:()=>u(`rika`),disabled:c||Oi(e,rikaUnit.id)<=0,children:[(0,E.jsx)(`b`,{children:`愛`}),(0,E.jsxs)(`span`,{children:[`RIKA`,(0,E.jsx)(`small`,{children:`Move with own MP`})]})]}),ee&&(0,E.jsxs)(`button`,{type:`button`,className:t===`companion`?`active`:``,onClick:()=>u(`companion`)'
repl(old, new, 'add Rika mode button to tactical map')

old = 'hoverPoint:t===`move`||t===`companion`||t===`stand`?m:null'
new = 'hoverPoint:t===`move`||t===`companion`||t===`rika`||t===`stand`?m:null'
repl(old, new, 'show Rika route hover preview')

old = 'children:t===`stand`?`STAND ENTITY · PHASES PHYSICAL TERRAIN`:e.battlefield.elevation.player?`HIGH GROUND · ranged accuracy improved`:`GROUND LEVEL`'
new = 'children:t===`stand`?`STAND ENTITY · PHASES PHYSICAL TERRAIN`:t===`rika`?`RIKA ENTITY · INDEPENDENT MOVEMENT RESERVE`:e.battlefield.elevation.player?`HIGH GROUND · ranged accuracy improved`:`GROUND LEVEL`'
repl(old, new, 'identify Rika position card')

old = 't===`move`||t===`companion`?`HOVER FOR EXACT MP COST · CLICK TO MOVE OR ADVANCE AS FAR AS POSSIBLE`'
new = 't===`move`||t===`companion`||t===`rika`?`HOVER FOR EXACT MP COST · CLICK TO MOVE OR ADVANCE AS FAR AS POSSIBLE`'
repl(old, new, 'give Rika movement footer instructions')

# 5. Parent map click handler moves Rika with Gt(), which already consumes the
# selected unit's own movement reserve and respects terrain/routes.
old = 'if(Ct===`companion`){let t=P(w),n=t.auxiliaryCombatants.find(e=>e.team===t.playerTeam&&(e.fighter.statuses.pochitaCompanion||e.fighter.statuses.controlSlave));'
new = 'if(Ct===`rika`){let t=P(w),n=t.auxiliaryCombatants.find(e=>e.team===t.playerTeam&&e.fighter.statuses.rikaCompanion&&e.fighter.statuses.rikaOwnerId===`player`);if(!n){Ft(`RIKA MOVEMENT UNAVAILABLE // Manifest Rika first.`),Za(`blocked`);return}let r=Gt(t,n.id,e);if(!r.moved){Ft(`RIKA ROUTE DENIED // ${r.reason}`),Za(`blocked`);return}T(t),Ot(W(t,n.id)),Ft(`RIKA MOVED // ${n.fighter.name} travels ${r.traveledDistance.toFixed(1)}m. ${Oi(t,n.id).toFixed(1)} / ${ji(t,n.id).toFixed(1)} MP remains.`),Za(`move`);return}if(Ct===`companion`){let t=P(w),n=t.auxiliaryCombatants.find(e=>e.team===t.playerTeam&&(e.fighter.statuses.pochitaCompanion||e.fighter.statuses.controlSlave));'
repl(old, new, 'move Rika using her own MP')

old = 'e===`companion`?`COMPANION MODE // Click a legal destination for Pochita or the active Control slave. This does not spend your action.`'
new = 'e===`rika`?`RIKA MOVEMENT // Click a legal destination. Rika spends her own Movement Points; your action and MP are untouched.`:e===`companion`?`COMPANION MODE // Click a legal destination for Pochita or the active Control slave. This does not spend your action.`'
repl(old, new, 'add Rika map mode instructions')

# 6. Wire the dock's movement command to the dedicated map mode and display the
# actual Rika movement pool in the dock. These anchors exist after patch 002.
old = 'let t=qa(w,e,A,!!Jt,xl||w.enemy);return(0,E.jsxs)(`button`'
new = 'let t=e.id===`rika-move`?(Oi(w,w.player.statuses.rikaCombatHint?.id)<=0?`NO MOVEMENT POINTS`:``):qa(w,e,A,!!Jt,xl||w.enemy);return(0,E.jsxs)(`button`'
repl(old, new, 'disable Move Rika at zero MP', optional=not has_cursed_ui)

old = 'disabled:!!t,onClick:()=>Xo(e),title:t||e.description'
new = 'disabled:!!t,onClick:()=>{if(e.id===`rika-move`){wt(`rika`),Ot(null),Ft(`RIKA MOVEMENT // Choose a destination. Rika spends her own MP; your action and MP are untouched.`),St(!0),Za(`target`);return}Xo(e)},title:t||e.description'
repl(old, new, 'wire Move Rika to tactical map', optional=not has_cursed_ui)

old = '(0,E.jsx)(`em`,{children:t||Wa(e,w.player)})]},e.id)})'
new = '(0,E.jsx)(`em`,{children:e.id===`rika-move`?`${Oi(w,w.player.statuses.rikaCombatHint?.id).toFixed(1)} / ${ji(w,w.player.statuses.rikaCombatHint?.id).toFixed(1)} MP`:t||Wa(e,w.player)})]},e.id)})'
repl(old, new, 'show Rika MP on Move control', optional=not has_cursed_ui)

old = 'w.player.statuses.rikaCombatHint?.full?`FULL MANIFESTATION · ${Math.max(0,w.player.statuses.rikaFullTurns||0)} TURNS REMAIN`:w.player.statuses.rikaCombatHint?`PARTIAL MANIFESTATION · AUTONOMOUS ALLY`'
new = 'w.player.statuses.rikaCombatHint?.full?`FULL MANIFESTATION · ${Math.max(0,w.player.statuses.rikaFullTurns||0)} TURNS · ${Oi(w,w.player.statuses.rikaCombatHint.id).toFixed(1)}/${ji(w,w.player.statuses.rikaCombatHint.id).toFixed(1)} MP`:w.player.statuses.rikaCombatHint?`PARTIAL MANIFESTATION · ${Oi(w,w.player.statuses.rikaCombatHint.id).toFixed(1)}/${ji(w,w.player.statuses.rikaCombatHint.id).toFixed(1)} MP · AUTONOMOUS ALLY`'
repl(old, new, 'show Rika MP in dock summary', optional=not has_cursed_ui)

js_path.write_text(s)
print('Applied Rika movement / collision update:')
for c in changes:
    print(' -', c)
