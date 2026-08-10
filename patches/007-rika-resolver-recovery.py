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

# 1. Root cause: Protect reused `o` for both the Rika fighter object and the
# movement distance. The new `let o = ... ht(o)` references itself while it is
# still in the temporal dead zone and throws inside the delayed combat resolver.
old = '''if(o.statuses.rikaCompanion){let n=o.statuses.rikaCommand||`hunt`;if(n===`hold`)return r;if(n===`protect`){let n=o.statuses.rikaOwnerId,i=U(e,n),a=i?W(e,n):null;if(a&&I(l,a)>7.5&&Oi(e,t)>0){let n=a.x-l.x,r=a.y-l.y,i=Math.max(1,Math.hypot(n,r)),o=Math.min(Math.max(0,I(l,a)-5.5),Oi(e,t)*ht(o));o>.1&&Gt(e,t,{x:l.x+n/i*o,y:l.y+r/i*o}),l=W(e,t),f=I(l,u)}}}'''
new = '''if(o.statuses.rikaCompanion){let n=o.statuses.rikaCommand||`hunt`;if(n===`hold`)return r;if(n===`protect`){let n=o.statuses.rikaOwnerId,i=U(e,n),a=i?W(e,n):null;if(a&&I(l,a)>7.5&&Oi(e,t)>0){let n=a.x-l.x,r=a.y-l.y,i=Math.max(1,Math.hypot(n,r)),m=Math.min(Math.max(0,I(l,a)-5.5),Oi(e,t)*ht(o));m>.1&&Gt(e,t,{x:l.x+n/i*m,y:l.y+r/i*m}),l=W(e,t),f=I(l,u)}}}'''
repl(old, new, 'fix Rika Protect TDZ crash')

# 2. Rika controls do not need to regenerate every enemy/ally intent. Doing so
# from an out-of-turn companion command is unnecessary and makes the command
# path touch much more of combat resolution than it should.
old = '''a=()=>{ls(t),T(t),bt(null),jt(null),Za(`target`)}'''
new = '''a=()=>{T(t),bt(null),jt(null),Za(`target`)}'''
repl(old, new, 'keep Rika controls out of global intent planning')

# Give a newly summoned Rika an intent of her own without replanning the whole
# encounter. This is safe to overwrite at the normal end-of-round ls() refresh.
old = '''let e=RIFT_SUMMON_RIKA(t,n,`player`,!1);if(!e){Ft(`RIKA UNAVAILABLE // The manifestation cannot answer right now.`),Za(`blocked`);return}a(),Ft(`RIKA MANIFESTED // Partial Rika enters independently. Your action is still available.`);return'''
new = '''let e=RIFT_SUMMON_RIKA(t,n,`player`,!1);if(!e){Ft(`RIKA UNAVAILABLE // The manifestation cannot answer right now.`),Za(`blocked`);return}let r=cs(t,e.id);e.intent=r?as(t,e.id,r.id):null,a(),Ft(`RIKA MANIFESTED // Partial Rika enters independently. Your action is still available.`);return'''
repl(old, new, 'plan Partial Rika independently after summon')

old = '''let o=RIFT_SUMMON_RIKA(t,n,`player`,!0);if(!o){Ft(`FULL RIKA UNAVAILABLE // Full Manifestation has already been spent or sealed.`),Za(`blocked`);return}n.energy=Math.max(0,n.energy-r),a(),Ft(`FULL RIKA MANIFESTED // ${r} Cursed Energy spent. Your action is still available.`);return'''
new = '''let o=RIFT_SUMMON_RIKA(t,n,`player`,!0);if(!o){Ft(`FULL RIKA UNAVAILABLE // Full Manifestation has already been spent or sealed.`),Za(`blocked`);return}n.energy=Math.max(0,n.energy-r);let s=cs(t,o.id);o.intent=s?as(t,o.id,s.id):null,a(),Ft(`FULL RIKA MANIFESTED // ${r} Cursed Energy spent. Your action is still available.`);return'''
repl(old, new, 'plan Full Rika independently after summon')

# Changing Hunt / Protect / Hold should immediately invalidate the old plan and
# rebuild only Rika's next intent from the new directive.
old = '''e.fighter.statuses.rikaCommand=r,n.statuses.rikaCombatHint={id:e.id,full:!!e.fighter.statuses.rikaFull,ultimate:e.fighter.ultimate,command:r},G(t,`RIKA COMMAND // ${r.toUpperCase()} directive received immediately.`,`mythic`),a(),Ft(`RIKA · ${r.toUpperCase()} // Directive updated. Your action is still available.`);return'''
new = '''e.fighter.statuses.rikaCommand=r;let o=cs(t,e.id);e.intent=o?as(t,e.id,o.id):null,n.statuses.rikaCombatHint={id:e.id,full:!!e.fighter.statuses.rikaFull,ultimate:e.fighter.ultimate,command:r},G(t,`RIKA COMMAND // ${r.toUpperCase()} directive received immediately.`,`mythic`),a(),Ft(`RIKA · ${r.toUpperCase()} // Directive updated. Your action is still available.`);return'''
repl(old, new, 'refresh only Rika intent after a command')

# 3. Make the delayed turn resolver exception-safe. Any future auxiliary AI bug
# now preserves the current combat snapshot and, most importantly, releases the
# global busy lock instead of soft-locking the run forever.
old = '''window.setTimeout(()=>{let e=P(r);if(fs(e)){ko(e);return}'''
new = '''window.setTimeout(()=>{let e=P(r);try{if(fs(e)){ko(e);return}'''
repl(old, new, 'wrap delayed combat resolver in try block')

old = '''}s()},c>0?de+fe+un(`Limitless`,`Black Flash`,!1)+320:s?ln(`Symbol of Fear`)+160:e.type===`ultimate`?1280:650)'''
new = '''}s()}catch(t){console.error(`RIFTBOUND COMBAT RESOLVER RECOVERED`,t),T(P(e)),Xe(``),j(!1),Ft(`COMBAT RECOVERED // An auxiliary action failed safely instead of locking the fight.`)}},c>0?de+fe+un(`Limitless`,`Black Flash`,!1)+320:s?ln(`Symbol of Fear`)+160:e.type===`ultimate`?1280:650)'''
repl(old, new, 'release busy lock if delayed resolver throws')

# 4. Last-resort watchdog for a resolver that gets stranded without throwing
# (for example, a future effect that forgets to finish a callback). Normal
# ult/cinematic states are excluded and ordinary resolution finishes long before
# this seven-second threshold.
anchor = '''Yo=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||A||Jt)return;'''
watchdog = '''RIFT_COMBAT_BUSY_WATCHDOG=(0,r.useEffect)(()=>{if(!A||!w||w.phase!==`combat`||Jt||Vt||tn)return;let e=window.setTimeout(()=>{j(!1),Xe(``),Ft(`COMBAT RECOVERY // A stalled resolver was released. Your turn is available again.`)},7e3);return()=>window.clearTimeout(e)},[A,Jt,Vt,tn,w?.phase,w?.turn]),'''
repl(anchor, watchdog + anchor, 'add stalled-combat watchdog')

js_path.write_text(s)
print('Applied Rika resolver recovery update:')
for c in changes:
    print(' -', c)
