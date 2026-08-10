from pathlib import Path
import sys

root = Path(sys.argv[1])
js_path = root / 'assets/page-F6OuavDb.js'
s = js_path.read_text()
changes = []

def repl(old, new, label, count=1):
    global s
    actual = s.count(old)
    if actual != count:
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    s = s.replace(old, new, count)
    changes.append(label)

# RCE: callback variable `e` was shadowing the entire run object, then being
# passed into W() as if a combatant entry were the run.
old = '''function RIFT_RCE(e,t,n){let r=n.aim?.target||Oo(e,t),i=H(e).filter(e=>e.fighter.hp>0).map(e=>({c:e,d:I(W(e,e.id),r)})).sort((e,t)=>e.d-t.d)[0]?.c||Do(e,t),a=Do(e,t),o=i&&a&&i.team===a.team,s=i?.fighter;'''
new = '''function RIFT_RCE(e,t,n){let r=n.aim?.target||Oo(e,t),i=H(e).filter(x=>x.fighter.hp>0).map(x=>({c:x,d:I(W(e,x.id),r)})).sort((e,t)=>e.d-t.d)[0]?.c||Do(e,t),a=Do(e,t),o=i&&a&&i.team===a.team,s=i?.fighter;'''
repl(old, new, 'fix RCE battlefield scan shadowing')

# Same bug in Cursed Speech's radius scan.
old = '''function RIFT_CURSED_SPEECH(e,t,n){let r=W(e,n),i=H(e).filter(e=>e.id!==n&&e.fighter.hp>0&&I(W(e,e.id),r)<=18);'''
new = '''function RIFT_CURSED_SPEECH(e,t,n){let r=W(e,n),i=H(e).filter(x=>x.id!==n&&x.fighter.hp>0&&I(W(e,x.id),r)<=18);'''
repl(old, new, 'fix Cursed Speech battlefield scan shadowing')

# Same bug introduced in Rika's adjacent-spawn resolver.
old = '''function RIFT_RIKA_SPAWN_POINT(e,t){let n=W(e,t),r=H(e).filter(e=>e.id!==t&&e.fighter.hp>0).map(e=>W(e,e.id)),i=U(e,t)?.team===e.playerTeam?0:Math.PI;'''
new = '''function RIFT_RIKA_SPAWN_POINT(e,t){let n=W(e,t),r=H(e).filter(x=>x.id!==t&&x.fighter.hp>0).map(x=>W(e,x.id)),i=U(e,t)?.team===e.playerTeam?0:Math.PI;'''
repl(old, new, 'fix Rika adjacent-spawn battlefield scan shadowing')

# Summon / dismiss / Hunt / Protect / Hold / Pure Love are companion controls,
# not player actions. A player-action resolver lock must never make them inert.
old = '''RIFT_UI_RIKA_CONTROL=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||A||!RIFT_CURSED_CHILD(w.player))return;'''
new = '''RIFT_UI_RIKA_CONTROL=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||!RIFT_CURSED_CHILD(w.player))return;'''
repl(old, new, 'allow Rika controls independently of player resolver busy flag')

old = '''e.id.startsWith(`rika-`)?A?`COMBAT IS RESOLVING`:e.id===`rika-pure-love-command`&&(!w.player.statuses.rikaCombatHint?.full||w.player.statuses.rikaCombatHint.ultimate<100)?`PURE LOVE NOT READY`:``:qa(w,e,A,!!Jt,xl||w.enemy)'''
new = '''e.id.startsWith(`rika-`)?e.id===`rika-pure-love-command`&&(!w.player.statuses.rikaCombatHint?.full||w.player.statuses.rikaCombatHint.ultimate<100)?`PURE LOVE NOT READY`:``:qa(w,e,A,!!Jt,xl||w.enemy)'''
repl(old, new, 'do not disable Rika commands while player action resolver is busy')

# Last-line defense: if a future Cursed Child custom handler throws after busy
# has been armed, keep the normal turn handoff alive instead of permanently
# stranding the whole HUD. Non-Cursed-Child exceptions still surface normally.
old = '''rs(r,`player`,e,{attacker:r.player,target:t.fighter,actorId:`player`,targetId:t.id,tone:`player`}),o||vo(r,`player`)'''
new = '''(()=>{try{rs(r,`player`,e,{attacker:r.player,target:t.fighter,actorId:`player`,targetId:t.id,tone:`player`})}catch(n){if(!RIFT_CURSED_CHILD(r.player))throw n;console.error(`Cursed Child action resolver recovered`,n),G(r,`CURSED CHILD RESOLVER RECOVERY // ${n?.message||n}. The action pipeline recovered instead of soft-locking combat.`,`system`)}})(),o||vo(r,`player`)'''
repl(old, new, 'guard Cursed Child player action execution from permanent busy soft-lock')

js_path.write_text(s)
print('Applied Cursed Child resolver/shadowing hotfix:')
for c in changes:
    print(' -', c)
