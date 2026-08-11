from pathlib import Path
import sys

root = Path(sys.argv[1])
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("gameplay-comfort-parts")
style_path = parts_dir / "01-styles.css"

if not css_path.is_file():
    raise SystemExit("Gameplay Comfort Pass: missing Riftbound stylesheet")
if not style_path.is_file():
    raise SystemExit("Gameplay Comfort Pass: missing style payload")

css = css_path.read_text()
styles = style_path.read_text().strip()
marker = "/* Riftbound Gameplay Comfort Pass · desktop-first 100% zoom layout */"

if not styles.startswith(marker):
    raise SystemExit("Gameplay Comfort Pass: style payload failed validation")
if marker in css:
    raise SystemExit("Gameplay Comfort Pass: styles were already injected")

# This pass is intentionally CSS-only. It changes information density and viewport
# behavior without touching combat, movement costs, targeting, saves, or resolver
# state. That keeps the formatting pass safe while movement mechanics are evaluated
# separately after players can actually see the battlefield comfortably.
css = css.rstrip() + "\n\n" + styles + "\n"
css_path.write_text(css)

print("Applied Gameplay Comfort Pass:")
print(" - compact 100% zoom combat layout for 1080p and laptop-height displays")
print(" - shorter fighter/loadout/world-integrity surfaces without removing information")
print(" - tactical movement strip condensed with a larger full-width Move button")
print(" - five-column desktop and six-column short-screen action layouts")
print(" - cooldown metadata no longer forces oversized action cards")
print(" - mobile behavior remains under the existing <=820px layout rules")
