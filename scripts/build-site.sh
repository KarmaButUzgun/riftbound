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

# The recovered bundle keeps stable filenames between patches. Tag mutable assets with
# the deployment commit so a normal refresh cannot get stuck on an older Pages cache.
CACHE_TAG="${GITHUB_SHA:-local}"
python3 - "$SITE_DIR" "$CACHE_TAG" <<'PY'
from pathlib import Path
import sys

site = Path(sys.argv[1])
tag = sys.argv[2]

index = site / "index.html"
text = index.read_text()
text = text.replace('./assets/riftbound.css"', f'./assets/riftbound.css?v={tag}"')
text = text.replace('./entry.js"', f'./entry.js?v={tag}"')
index.write_text(text)

entry = site / "entry.js"
text = entry.read_text()
text = text.replace('./assets/framework-CXnKph_e.js"', f'./assets/framework-CXnKph_e.js?v={tag}"')
text = text.replace('./assets/page-F6OuavDb.js"', f'./assets/page-F6OuavDb.js?v={tag}"')
entry.write_text(text)
PY

printf '{"base":"%s","patches":%d,"commit":"%s"}\n' \
  "$BASE_ZIP" "${#patches[@]}" "${GITHUB_SHA:-local}" > "$SITE_DIR/riftbound-build.json"

echo "Built Riftbound site in $SITE_DIR"
