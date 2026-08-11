from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
index_path = root / "index.html"
parts_dir = Path(__file__).with_name("coop-network-parts")

bundle = bundle_path.read_text()
css = css_path.read_text()
index = index_path.read_text()
client_path = parts_dir / "01-client.js"
style_path = parts_dir / "02-styles.css"
if not client_path.is_file() or not style_path.is_file():
    raise SystemExit("Co-op network payload is incomplete")
client = client_path.read_text().strip()
styles = style_path.read_text().strip()
if "window.RIFT_COOP = coopApi" not in client or not styles.startswith("/* Riftbound LAN Co-op Alpha"):
    raise SystemExit("Co-op network payload failed validation")


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one anchor, found {count}")
    return source.replace(old, new, 1)

helper = '''function RIFT_COOP_EXPOSE_RUNTIME(run,onAction,selectedActionId,busy){try{globalThis.RIFT_COOP_EXPOSE_RUN?.(run,onAction,selectedActionId,busy)}catch{}return null}'''
if helper not in bundle:
    bundle = replace_once(bundle, "function Ea(){return[]}", helper + "\nfunction Ea(){return[]}", "inject co-op runtime bridge")

hud = '''(0,E.jsx)(RIFT_COMBAT_LOADOUT_HUD,{run:w,opponent:xl||w.enemy,onAction:$o,selectedActionId:yt,busy:A||!!Jt})'''
bridged = '''(RIFT_COOP_EXPOSE_RUNTIME(w,$o,yt,A||!!Jt),(0,E.jsx)(RIFT_COMBAT_LOADOUT_HUD,{run:w,opponent:xl||w.enemy,onAction:$o,selectedActionId:yt,busy:A||!!Jt}))'''
bundle = replace_once(bundle, hud, bridged, "publish authoritative combat state to co-op bridge")

script_tag = '<script type="module" src="./assets/riftbound-coop.js"></script>'
if script_tag not in index:
    if "</body>" not in index:
        raise SystemExit("Co-op client injection anchor </body> is missing")
    index = index.replace("</body>", f"  {script_tag}\n</body>", 1)

if "/* Riftbound LAN Co-op Alpha" not in css:
    css = css.rstrip() + "\n\n" + styles + "\n"

(root / "assets" / "riftbound-coop.js").write_text(client + "\n")
bundle_path.write_text(bundle)
css_path.write_text(css)
index_path.write_text(index)

print("Applied LAN Co-op Alpha:")
print(" - local Node host detection and in-game Host/Join lobby overlay")
print(" - authenticated two-player rooms, readiness, heartbeat, leave/rejoin session persistence")
print(" - SSE room events and host-authoritative live run snapshots")
print(" - runtime bridge exposing current combat/run state without changing normal GitHub Pages single-player")
print(" - remote intent bus reserved for authoritative ally movement/actions in the next resolver stage")
