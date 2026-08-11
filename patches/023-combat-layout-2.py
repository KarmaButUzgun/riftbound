from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle_path = root / "assets" / "page-F6OuavDb.js"
css_path = root / "assets" / "riftbound.css"
parts_dir = Path(__file__).with_name("combat-layout-2-parts")
style_path = parts_dir / "01-styles.css"

if not bundle_path.is_file() or not css_path.is_file():
    raise SystemExit("Combat Layout 2.0: missing production bundle or stylesheet")
if not style_path.is_file():
    raise SystemExit("Combat Layout 2.0: missing style payload")

bundle = bundle_path.read_text()
css = css_path.read_text()
styles = style_path.read_text().strip()
marker = "/* Riftbound Combat Layout 2.0 · horizontal battlefield shell */"

if not styles.startswith(marker):
    raise SystemExit("Combat Layout 2.0: style payload failed validation")
if marker in css:
    raise SystemExit("Combat Layout 2.0: styles were already injected")

start_anchor = '(0,E.jsxs)(`div`,{className:`arena env-stage-${w.environmentStage} smoke-density-${Ll} ${Jt?`resolving-death`:``}`,children:['
if bundle.count(start_anchor) != 1:
    raise SystemExit(f"Combat Layout 2.0: arena anchor expected once, found {bundle.count(start_anchor)}")

end_anchor = 'St(!0),Za(`target`)}}),w.pochita.alive&&!w.pochita.heart'
if bundle.count(end_anchor) != 1:
    raise SystemExit(f"Combat Layout 2.0: spatial HUD end anchor expected once, found {bundle.count(end_anchor)}")

bundle = bundle.replace(
    start_anchor,
    '(0,E.jsxs)(`div`,{className:`combat-stage-layout`,children:[' + start_anchor,
    1,
)
bundle = bundle.replace(
    end_anchor,
    'St(!0),Za(`target`)}})]}),w.pochita.alive&&!w.pochita.heart',
    1,
)

css = css.rstrip() + "\n\n" + styles + "\n"
bundle_path.write_text(bundle)
css_path.write_text(css)

print("Applied Combat Layout 2.0:")
print(" - battlefield, movement controls, and World Integrity now share one horizontal stage")
print(" - movement/minimap becomes a permanent left tactical sidebar on desktop")
print(" - World Integrity becomes a compact right battlefield sidebar")
print(" - arena remains the visual center instead of being one more vertical strip")
print(" - smaller displays automatically fall back to the existing stacked layout")
