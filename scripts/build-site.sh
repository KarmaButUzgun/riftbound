#!/usr/bin/env bash
set -euo pipefail

BASE_ZIP="${RIFTBOUND_BASE_ZIP:-riftbound-standalone-v0.3.0.zip}"
WORK_DIR="${RIFTBOUND_WORK_DIR:-.build}"
SITE_DIR="${RIFTBOUND_SITE_DIR:-_site}"

if [[ ! -f "$BASE_ZIP" ]]; then
  echo "Missing Riftbound base archive: $BASE_ZIP" >&2
  exit 1
fi

rm -rf "$WORK_DIR" "$SITE_DIR"
mkdir -p "$WORK_DIR" "$SITE_DIR"
unzip -q "$BASE_ZIP" -d "$WORK_DIR"

GAME_DIR="$WORK_DIR/riftbound-standalone"
if [[ ! -f "$GAME_DIR/index.html" || ! -f "$GAME_DIR/entry.js" || ! -d "$GAME_DIR/assets" ]]; then
  echo "Base archive does not contain the expected Riftbound standalone layout." >&2
  exit 1
fi

shopt -s nullglob
patches=(patches/*.py)
for patch in "${patches[@]}"; do
  echo "Applying ${patch}"
  python3 "$patch" "$GAME_DIR"
done
shopt -u nullglob

# Never publish a patch set that leaves the production bundle syntactically invalid.
node --check "$GAME_DIR/assets/page-F6OuavDb.js"

cp "$GAME_DIR/index.html" "$SITE_DIR/index.html"
cp "$GAME_DIR/entry.js" "$SITE_DIR/entry.js"
cp -R "$GAME_DIR/assets" "$SITE_DIR/assets"
touch "$SITE_DIR/.nojekyll"

# Cache-bust the deployment without splitting shared ES-module singletons.
# Every relative JS import receives the SAME deployment tag, so entry.js and the
# game bundle resolve React/framework/runtime modules to identical URLs.
CACHE_TAG="${GITHUB_SHA:-local}"
python3 - "$SITE_DIR" "$CACHE_TAG" <<'PY'
from pathlib import Path
import re
import sys

site = Path(sys.argv[1])
tag = sys.argv[2]

index = site / "index.html"
text = index.read_text()
text = text.replace('./assets/riftbound.css"', f'./assets/riftbound.css?v={tag}"')
text = text.replace('./entry.js"', f'./entry.js?v={tag}"')
index.write_text(text)

# Static ES-module imports: import ... from "./x.js" and import "./x.js".
static_import = re.compile(r'((?:from|import)\s*["\'])(\./[^"\']+\.js)(["\'])')
# Dynamic ES-module imports: import("./x.js").
dynamic_import = re.compile(r'(import\(\s*["\'])(\./[^"\']+\.js)(["\']\s*\))')

js_files = [site / "entry.js", *sorted((site / "assets").glob("*.js"))]
for path in js_files:
    source = path.read_text()
    source = static_import.sub(lambda m: f'{m.group(1)}{m.group(2)}?v={tag}{m.group(3)}', source)
    source = dynamic_import.sub(lambda m: f'{m.group(1)}{m.group(2)}?v={tag}{m.group(3)}', source)
    path.write_text(source)

# Catch the exact regression that blanked the site: shared framework/runtime imports
# must resolve to one tagged URL everywhere in the published module graph.
for path in js_files:
    source = path.read_text()
    for match in re.finditer(r'["\'](\./[^"\']+\.js)(?:\?v=([^"\']+))?["\']', source):
        imported, imported_tag = match.groups()
        if imported_tag != tag:
            raise SystemExit(f"Unversioned/mismatched module import in {path}: {imported}")
PY

# Query strings do not alter JS syntax, but check the published entry and game bundle too.
node --check "$SITE_DIR/entry.js"
node --check "$SITE_DIR/assets/page-F6OuavDb.js"

printf '{"base":"%s","patches":%d,"commit":"%s"}\n' \
  "$BASE_ZIP" "${#patches[@]}" "${GITHUB_SHA:-local}" > "$SITE_DIR/riftbound-build.json"
node scripts/generate-runtime-manifest.mjs "$GAME_DIR" "$SITE_DIR/riftbound-manifest.json"

echo "Built Riftbound site in $SITE_DIR"
