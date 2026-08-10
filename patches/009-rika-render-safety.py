from pathlib import Path
import sys

root = Path(sys.argv[1])
js_path = root / 'assets/page-F6OuavDb.js'
css_path = root / 'assets/riftbound.css'
entry_path = root / 'entry.js'
s = js_path.read_text()
css = css_path.read_text()
entry = entry_path.read_text()
changes = []

def repl(old, new, label, count=1, optional=False):
    global s
    actual = s.count(old)
    if actual != count:
        if optional and actual == 0:
            print(f'SKIP: {label}')
            return False
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    s = s.replace(old, new, count)
    changes.append(label)
    return True

# The previous visual pass added an entire custom JSX subtree for Rika inside the
# tactical-map auxiliary token. Summoning Rika is the first moment that subtree
# becomes live. Keep the unique class hooks but go back to the battle map's proven
# native token DOM; the distinct Rika silhouette is now drawn with CSS only.
old_children = '''children:[t.fighter.statuses.rikaCompanion&&(0,E.jsxs)(`span`,{className:`rika-map-avatar`,"aria-hidden":`true`,children:[(0,E.jsx)(`i`,{className:`rika-aura`}),(0,E.jsx)(`i`,{className:`rika-horn left`}),(0,E.jsx)(`i`,{className:`rika-horn right`}),(0,E.jsx)(`b`,{className:`rika-eye`}),(0,E.jsx)(`em`,{className:`rika-mouth`}),(0,E.jsx)(`i`,{className:`rika-arm left`}),(0,E.jsx)(`i`,{className:`rika-arm right`})]}),(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:t.fighter.power.glyph}),!c&&(0,E.jsx)(`span`,{children:t.fighter.statuses.rikaCompanion?t.fighter.statuses.rikaFull?`RIKA · FULL`:`RIKA`:r?`ALLY`:t.role===`rogue`?`ROGUE`:`FOE`})]}'''
new_children = '''children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`b`,{children:t.fighter.statuses.rikaCompanion?t.fighter.statuses.rikaFull?`愛`:`里`:t.fighter.power?.glyph||`?`}),!c&&(0,E.jsx)(`span`,{children:t.fighter.statuses.rikaCompanion?t.fighter.statuses.rikaFull?`RIKA · FULL`:`RIKA`:r?`ALLY`:t.role===`rogue`?`ROGUE`:`FOE`})]}'''
repl(old_children, new_children, 'remove fragile Rika JSX avatar subtree')

# The cursed-energy tether was another Rika-only render branch. Remove the extra
# JSX line entirely; a safe aura/ring keeps the bond visually legible without
# calculating another render-time geometry object for every Rika token.
bond = '''r.filter(t=>t.fighter.statuses.rikaCompanion&&Ei(e,t.id)).map(t=>(0,E.jsxs)(`div`,{className:`map-rika-bond ${t.fighter.statuses.rikaFull?`full`:``}`,style:S(W(e,t.fighter.statuses.rikaOwnerId),Ei(e,t.id).position),"aria-hidden":`true`,children:[(0,E.jsx)(`i`,{}),(0,E.jsx)(`i`,{})]},`rika-bond-${t.id}`)),'''
repl(bond, '', 'remove fragile Rika render-time bond JSX')

# Any auxiliary unit with incomplete cosmetic metadata should still be renderable.
old_accent = '''"--fighter":B(t.fighter)?or(t.fighter):t.fighter.power.accent'''
new_accent = '''"--fighter":B(t.fighter)?or(t.fighter):t.fighter.power?.accent||`#f5baff`'''
repl(old_accent, new_accent, 'make auxiliary power accent render-safe')

# Rika's dock can render during the exact state transition where the fighter hint
# exists but its battlefield unit is being added/removed. Never call toFixed on a
# transition value without normalizing it to a number first.
for old, new, label in [
    ('Oi(w,w.player.statuses.rikaCombatHint.id).toFixed(1)', 'Number(Oi(w,w.player.statuses.rikaCombatHint.id)||0).toFixed(1)', 'harden Rika summary current MP'),
    ('ji(w,w.player.statuses.rikaCombatHint.id).toFixed(1)', 'Number(ji(w,w.player.statuses.rikaCombatHint.id)||0).toFixed(1)', 'harden Rika summary max MP'),
    ('Oi(w,w.player.statuses.rikaCombatHint?.id).toFixed(1)', 'Number(Oi(w,w.player.statuses.rikaCombatHint?.id)||0).toFixed(1)', 'harden Move Rika current MP'),
    ('ji(w,w.player.statuses.rikaCombatHint?.id).toFixed(1)', 'Number(ji(w,w.player.statuses.rikaCombatHint?.id)||0).toFixed(1)', 'harden Move Rika max MP'),
]:
    if old in s:
        s = s.replace(old, new)
        changes.append(label)

# CSS-only Rika identity. This intentionally uses only the original map token's
# existing i/b/span elements, so React has no Rika-specific DOM branch to mount.
css += r'''
/* Riftbound v0.3.3 · render-safe Rika battlefield identity */
.map-fighter.rika-companion{--rika:#f5baff!important;width:44px!important;height:44px!important;border:2px solid #f1c8ff!important;border-radius:46% 46% 38% 38%!important;background:radial-gradient(circle at 50% 34%,#fff 0 3%,#c55cdb 4% 9%,#16091c 10% 58%,#060408 59% 100%)!important;box-shadow:0 0 0 3px #5b246966,0 0 18px #f5baff88,inset 0 -8px 14px #000!important;overflow:visible!important;z-index:17!important;filter:none!important}.map-fighter.rika-companion>i{display:block!important;position:absolute!important;inset:-7px!important;border:1px solid #f5baff6b!important;border-radius:50%!important;background:transparent!important;box-shadow:0 0 13px #f5baff55!important;animation:rika-safe-aura 1.55s ease-in-out infinite!important}.map-fighter.rika-companion>i:before,.map-fighter.rika-companion>i:after{content:"";position:absolute;top:-8px;width:14px;height:22px;background:linear-gradient(#ffeaff,#a84cbb 54%,#17091b);clip-path:polygon(50% 0,100% 100%,22% 76%,0 100%)}.map-fighter.rika-companion>i:before{left:3px;transform:rotate(-23deg)}.map-fighter.rika-companion>i:after{right:3px;transform:scaleX(-1) rotate(-23deg)}.map-fighter.rika-companion>b{display:grid!important;place-items:center!important;position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-42%)!important;width:24px!important;height:19px!important;color:#fff!important;background:#160817!important;border:1px solid #f5baffaa!important;border-radius:45% 45% 55% 55%!important;font:900 12px var(--font-display)!important;text-shadow:0 0 8px #fff,0 0 14px #ef75ff!important;box-shadow:inset 0 -5px 0 #09030b,0 0 9px #f5baff55!important}.map-fighter.rika-companion>b:after{content:"";position:absolute;left:4px;right:4px;bottom:-6px;height:5px;border-bottom:2px solid #fff;border-radius:0 0 50% 50%;filter:drop-shadow(0 0 3px #f5baff)}.map-fighter.rika-companion>span:last-child{color:#ffe6ff!important;background:#120816e8!important;border:1px solid #f5baff66!important;box-shadow:0 0 10px #f5baff35!important;text-shadow:0 0 7px #f5baff!important}.map-fighter.rika-full{width:50px!important;height:50px!important;box-shadow:0 0 0 4px #fff5,0 0 28px #f5baffcc,inset 0 -9px 16px #000!important}.map-fighter.rika-full>i{inset:-10px!important;border-width:2px!important;animation-duration:.85s!important}.map-fighter.rika-full>b{transform:translate(-50%,-42%) scale(1.12)!important}.map-fighter.rika-companion.actively-moving{animation:rika-safe-lunge .32s ease-in-out infinite alternate}@keyframes rika-safe-aura{0%,100%{opacity:.45;transform:rotate(-4deg) scale(.94)}50%{opacity:1;transform:rotate(5deg) scale(1.08)}}@keyframes rika-safe-lunge{from{translate:0 0}to{translate:0 -3px}}
'''

# A blank navy screen is useless diagnostics. Install a tiny top-level crash
# reporter before React hydrates so any future runtime exception is visible in
# the browser itself, including errors from event handlers and rejected promises.
if '__RIFTBOUND_FATAL_OVERLAY__' not in entry:
    diagnostic = r'''
function __RIFTBOUND_FATAL_OVERLAY__(error, source = "runtime") {
  try {
    const message = error?.stack || error?.message || String(error || "Unknown error");
    let panel = document.getElementById("riftbound-fatal-overlay");
    if (!panel) {
      panel = document.createElement("pre");
      panel.id = "riftbound-fatal-overlay";
      Object.assign(panel.style, {
        position: "fixed", inset: "12px", zIndex: "2147483647", overflow: "auto",
        margin: "0", padding: "16px", whiteSpace: "pre-wrap", background: "#10080eef",
        color: "#ffd6e8", border: "1px solid #ff6ea5", font: "12px/1.5 monospace"
      });
      document.body.appendChild(panel);
    }
    panel.textContent = `RIFTBOUND RUNTIME ERROR [${source}]\n\n${message}`;
  } catch (_) {}
}
window.addEventListener("error", event => __RIFTBOUND_FATAL_OVERLAY__(event.error || event.message, "error"));
window.addEventListener("unhandledrejection", event => __RIFTBOUND_FATAL_OVERLAY__(event.reason, "promise"));

'''
    entry = diagnostic + entry

js_path.write_text(s)
css_path.write_text(css)
entry_path.write_text(entry)
print('Applied Rika render-safety hotfix:')
for c in changes:
    print(' -', c)
