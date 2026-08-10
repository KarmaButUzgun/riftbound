from pathlib import Path
import sys
root=Path(sys.argv[1])
js_path=root/'assets/page-F6OuavDb.js'
s=js_path.read_text()
def repl(old,new,label,count=1):
    global s
    actual=s.count(old)
    if actual!=count: raise SystemExit(f'{label}: expected {count}, found {actual}')
    s=s.replace(old,new,count)
# 7. Selector callbacks: technique selection either arms/uses the chosen copy, or engraves it then launches the domain.
anchor='''Zs=(0,r.useCallback)(e=>{Wt(t=>{if(!t||t.kind!==`ultimate`)return t;'''
callbacks=r'''RIFT_UI_PICK_MIMIC=(0,r.useCallback)((e,t)=>{if(!w||w.phase!==`combat`||A||!RIFT_CURSED_CHILD(w.player))return;let n=RIFT_MIMIC_ACTION(w.player,e,t),r=qa(w,n,A,!!Jt,w.enemy);if(r){Ft(`MIMICRY LOCKED // ${r}`),q(`blocked`);return}Wt(null),bt(null);let i=Tt(n,w.player);if(i.requiresAim){jt(P(n)),wt(`aim`),Ot({...W(w,Bi(w).id)}),Ft(`${n.name.toUpperCase()} // Mimicry selected. Place the actual copied technique on the tactical map.`),St(!0),Za(`target`);return}Xo(n)},[Xo,A,Jt,Za,q,w]),RIFT_UI_PICK_DOMAIN=(0,r.useCallback)(e=>{if(!w||w.phase!==`combat`||A||!Ut||Ut.kind!==`cursed-domain`||!RIFT_CURSED_CHILD(w.player)||!Ut.action)return;let t={...P(Ut.action),domainSureHitId:e.id};Wt(null),bt(null),Xo(t)},[Xo,A,Ut,w]),'''
repl(anchor,callbacks+anchor,'add Mimicry and domain picker callbacks')

# 8. Rika's entire interface lives in a compact native toggle above the normal action bar.
anchor='''(0,E.jsx)(`div`,{className:`action-grid ${Fn(w.player,`Spiral Being`)?'''
rika_ui=r'''RIFT_CURSED_CHILD(w.player)&&(0,E.jsxs)(`details`,{className:`rika-command-dock`,children:[(0,E.jsxs)(`summary`,{children:[(0,E.jsx)(`b`,{children:`里`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`CURSED CHILD · COMPANION CONTROL`}),(0,E.jsx)(`strong`,{children:`RIKA`}),(0,E.jsx)(`p`,{children:w.player.statuses.rikaLocked?`Manifestation exhausted for this fight.`:w.player.statuses.rikaCombatHint?.full?`FULL MANIFESTATION · ${Math.max(0,w.player.statuses.rikaFullTurns||0)} TURNS REMAIN`:w.player.statuses.rikaCombatHint?`PARTIAL MANIFESTATION · AUTONOMOUS ALLY`:`Not manifested. Choose Partial or Full Rika.`})]}),(0,E.jsxs)(`em`,{children:[w.player.statuses.rikaLocked?`SEALED`:w.player.statuses.rikaCombatHint?.full?`${Math.round(w.player.statuses.rikaCombatHint.ultimate||0)}% PURE LOVE`:w.player.statuses.rikaCombatHint?String(w.player.statuses.rikaCombatHint.command||`hunt`).toUpperCase():`OPEN CONTROLS`,(0,E.jsx)(`i`,{children:`⌄`})]})]}),(0,E.jsx)(`div`,{className:`rika-control-grid`,children:RIFT_RIKA_ACTIONS(w.player).map(e=>{let t=qa(w,e,A,!!Jt,xl||w.enemy);return(0,E.jsxs)(`button`,{type:`button`,className:e.id===`rika-pure-love-command`?`pure-love`:e.id===`rika-full`?`full-rika`:`` ,disabled:!!t,onClick:()=>Xo(e),title:t||e.description,children:[(0,E.jsx)(`b`,{children:e.glyph}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:e.id.startsWith(`rika-command-`)?`AI DIRECTIVE`:e.id===`rika-pure-love-command`?`RIKA ULTIMATE`:`MANIFESTATION`}),(0,E.jsx)(`strong`,{children:e.name}),(0,E.jsx)(`p`,{children:e.description})]}),(0,E.jsx)(`em`,{children:t||Wa(e,w.player)})]},e.id)})}),!RIFT_RIKA_ACTIONS(w.player).length&&(0,E.jsx)(`p`,{className:`rika-control-empty`,children:`Rika cannot be issued any further commands this fight.`})]}),'''
repl(anchor,rika_ui+anchor,'render Rika as its own collapsible control section')
js_path.write_text(s)
print("Applied Cursed Child selector callbacks and Rika dock")
