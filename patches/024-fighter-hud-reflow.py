from pathlib import Path
import sys

root = Path(sys.argv[1])
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("fighter-hud-reflow-parts")
style_path = parts_dir / "01-styles.css"

if not css_path.is_file():
    raise SystemExit("Fighter HUD Reflow: missing Riftbound stylesheet")
if not style_path.is_file():
    raise SystemExit("Fighter HUD Reflow: missing style payload")

css = css_path.read_text()
styles = style_path.read_text().strip()
marker = "/* Riftbound Fighter HUD Reflow · wide compact identity deck */"

if not styles.startswith(marker):
    raise SystemExit("Fighter HUD Reflow: style payload failed validation")
if marker in css:
    raise SystemExit("Fighter HUD Reflow: styles were already injected")

css = css.rstrip() + "\n\n" + styles + "\n"
css_path.write_text(css)

print("Applied Fighter HUD Reflow:")
print(" - fighter resources use two-column lanes instead of one tall stack")
print(" - player and enemy panels share a wide two-column combat head")
print(" - loadouts/anomaly become a thin full-width ribbon below fighter identity")
print(" - tactical formation becomes a compact horizontal roster bar")
print(" - target/intent information stays readable without consuming another screen row")
