# Riftbound deployment patches

`riftbound-standalone-v0.3.0.zip` is the immutable recovered base build.

Future Riftbound updates live here as small Python patches instead of replacing the full game archive. During deployment, `scripts/build-site.sh` extracts the base archive and runs every `patches/*.py` file in filename order.

Each patch receives the extracted game root as its first argument:

```python
from pathlib import Path
import sys

root = Path(sys.argv[1])
bundle = root / "assets" / "page-F6OuavDb.js"
css = root / "assets" / "riftbound.css"
```

Use numeric prefixes so patch order is explicit, for example:

- `010-cursed-child-hotfix.py`
- `020-new-power.py`
- `030-boss-update.py`

Patches should be deterministic and fail loudly if their expected source anchors are missing. This keeps deployments reproducible and prevents silent corruption of the recovered bundle.

Large patches may keep readable runtime and stylesheet payloads in a named `*-parts/` directory. The parent patch must validate the exact manifest before injection. `016-build-expansion.py`, for example, composes the catalog, item rules, UI, and styles from `build-expansion-parts/` while keeping every bundle edit anchor-checked.
