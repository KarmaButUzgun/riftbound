from pathlib import Path
import sys

root = Path(sys.argv[1])
js_path = root / 'assets/page-F6OuavDb.js'
s = js_path.read_text()
changes=[]

def repl(old,new,label,count=1):
    global s
    actual=s.count(old)
    if actual!=count:
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    s=s.replace(old,new,count)
    changes.append(label)

# 1. Posture is a meter that fills toward maxPosture. A fresh fighter at posture=0
# is healthy, not broken. The actual break handler resets posture to 0 and marks
# the victim exposed/stunned, so the status rail should key off exposed.
repl(
    'e.posture<=0&&t.push(`POSTURE BROKEN`)',
    'e.statuses.exposed>0&&t.push(`POSTURE BROKEN`)',
    'fix inverted POSTURE BROKEN status readout'
)

# 2. Harden migration arrays before code calls forEach/some/length. This keeps
# older/intermediate or partially-written saves from crashing Oa().
repl(
    'e.nemeses=e.nemeses||[],e.nemeses.forEach',
    'e.nemeses=Array.isArray(e.nemeses)?e.nemeses:[],e.nemeses.forEach',
    'normalize nemeses array during migration'
)
repl(
    'e.chronicle=e.chronicle||[],e.devilEncounter=',
    'e.chronicle=Array.isArray(e.chronicle)?e.chronicle:[],e.devilEncounter=',
    'normalize chronicle array during migration'
)
repl(
    'e.nemesisCallResponses=e.nemesisCallResponses||[],e.salvationOffer=',
    'e.nemesisCallResponses=Array.isArray(e.nemesisCallResponses)?e.nemesisCallResponses:[],e.salvationOffer=',
    'normalize nemesis response array during migration'
)
repl(
    'e.auxiliaryCombatants=e.auxiliaryCombatants||[],e.auxiliaryCombatants.forEach',
    'e.auxiliaryCombatants=Array.isArray(e.auxiliaryCombatants)?e.auxiliaryCombatants:[],e.auxiliaryCombatants.forEach',
    'normalize auxiliary combatants array during migration'
)
repl(
    'e.routeChoices=e.routeChoices||[],e.routeHistory=e.routeHistory||[],e.selectedRoute=',
    'e.routeChoices=Array.isArray(e.routeChoices)?e.routeChoices:[],e.routeHistory=Array.isArray(e.routeHistory)?e.routeHistory:[],e.shopOffers=Array.isArray(e.shopOffers)?e.shopOffers:[],e.selectedRoute=',
    'normalize route/shop arrays before intermission migration'
)

# 3. Profile and run were loaded inside one try/catch whose catch always deleted
# the RUN key. A corrupt profile could therefore erase an otherwise valid run.
old_boot = '''window.setTimeout(()=>{try{let e=window.localStorage.getItem(te),n=window.localStorage.getItem(ne);if(e){let n=JSON.parse(e);t({...st,...n,equipped:{...st.equipped,...n.equipped||{}},wheelLuck:{...st.wheelLuck,...n.wheelLuck||{}},pendingAffinities:{...Me,...n.pendingAffinities||{}}})}if(n){let e=Oa(JSON.parse(n));T(e),e.player.hp<=0&&e.player.statuses.vesselSalvationPending&&e.salvationOffer&&(Rn(!0),j(!0))}}catch{window.localStorage.removeItem(ne)}o(!0)},0)'''
new_boot = '''window.setTimeout(()=>{let e=null,n=null;try{e=window.localStorage.getItem(te)}catch(t){console.error(`RIFTBOUND PROFILE STORAGE READ FAILED`,t)}try{n=window.localStorage.getItem(ne)}catch(t){console.error(`RIFTBOUND RUN STORAGE READ FAILED`,t)}if(e)try{let n=JSON.parse(e);t({...st,...n,equipped:{...st.equipped,...n.equipped||{}},wheelLuck:{...st.wheelLuck,...n.wheelLuck||{}},pendingAffinities:{...Me,...n.pendingAffinities||{}}})}catch(t){console.error(`RIFTBOUND PROFILE SAVE WAS INVALID`,t);try{window.localStorage.removeItem(te)}catch{}}if(n){let e=null;try{e=JSON.parse(n)}catch(t){console.error(`RIFTBOUND RUN SAVE JSON WAS INVALID`,t);try{window.localStorage.removeItem(ne)}catch{}}if(e)try{let n=Oa(e);T(n),n.player.hp<=0&&n.player.statuses.vesselSalvationPending&&n.salvationOffer&&(Rn(!0),j(!0))}catch(t){console.error(`RIFTBOUND RUN MIGRATION FAILED; RAW SAVE PRESERVED`,t)}}o(!0)},0)'''
repl(old_boot,new_boot,'separate profile/run recovery and preserve valid run data')

# 4. Browser storage can throw (quota/security/private-mode restrictions). These
# React effects used to let that exception escape and potentially blank the app.
old_profile_write='''(0,r.useEffect)(()=>{if(!n)return;window.localStorage.setItem(te,JSON.stringify(e));let t=window.setTimeout(()=>f(Date.now()),0);return()=>window.clearTimeout(t)},[e,n])'''
new_profile_write='''(0,r.useEffect)(()=>{if(!n)return;try{window.localStorage.setItem(te,JSON.stringify(e))}catch(t){console.error(`RIFTBOUND PROFILE SAVE WRITE FAILED`,t)}let t=window.setTimeout(()=>f(Date.now()),0);return()=>window.clearTimeout(t)},[e,n])'''
repl(old_profile_write,new_profile_write,'contain profile localStorage write failures')

old_run_write='''(0,r.useEffect)(()=>{if(!n)return;w?window.localStorage.setItem(ne,JSON.stringify(w)):window.localStorage.removeItem(ne);let e=window.setTimeout(()=>f(Date.now()),0);return()=>window.clearTimeout(e)},[w,n])'''
new_run_write='''(0,r.useEffect)(()=>{if(!n)return;try{w?window.localStorage.setItem(ne,JSON.stringify(w)):window.localStorage.removeItem(ne)}catch(e){console.error(`RIFTBOUND RUN SAVE WRITE FAILED`,e)}let e=window.setTimeout(()=>f(Date.now()),0);return()=>window.clearTimeout(e)},[w,n])'''
repl(old_run_write,new_run_write,'contain run localStorage write failures')

js_path.write_text(s)
print('Applied core stability audit fixes:')
for c in changes:
    print(' -',c)
