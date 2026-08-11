from pathlib import Path
import base64
import gzip
import json

parts_dir = Path(__file__).parent / "bizarre-parts"
parts = sorted(parts_dir.glob("part-*.txt"))
if not parts:
    raise SystemExit("Bizarre Update payload parts are missing")
encoded = "".join(p.read_text().strip() for p in parts)
items = json.loads(gzip.decompress(base64.b64decode(encoded)).decode())
expected = [
    "014-gold-experience-core.py",
    "015-requiem-arrow-event.py",
    "016-ger-causality-deathloop.py",
    "017-kcr-time-architecture.py",
    "018-bizarre-rewind-ui.py",
    "019-bizarre-visuals.py",
    "020-bizarre-hardening.py",
]
names = [item.get("name") for item in items]
if names != expected:
    raise SystemExit(f"Unexpected Bizarre payload manifest: {names!r}")
for item in items:
    name = item["name"]
    print(f"== Bizarre subpatch: {name} ==")
    namespace = {"__name__": "__main__", "__file__": name}
    exec(compile(item["code"], name, "exec"), namespace, namespace)
print("Bizarre Update Part 2 payload applied successfully")
