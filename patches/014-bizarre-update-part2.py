from pathlib import Path
import base64
import gzip
import hashlib
import json

parts_dir = Path(__file__).parent / "bizarre-parts"
parts = sorted(parts_dir.glob("part-*.txt"))
if not parts:
    raise SystemExit("Bizarre Update payload parts are missing")
expected_hashes = {
    "part-01.txt": "ad9f7abc50587fab95f7b35e20cec94becb5051d5da8283aa3fb1572dcc2bed5",
    "part-02.txt": "da751d96f8aa6fd46266f80e4211f39087009718943623ec67ee47eb01f28b76",
    "part-03.txt": "96b4a34346637f6bb68472723b9ce23eea1536193ad2366c98974fa9e06fbf5e",
    "part-04a.txt": "5c172aa8d9147596abb74ffb9d23a1ea9aec8a06041e1a5ecfeabcc28cf9b1eb",
    "part-04b.txt": "53d89e43e3886274af4480b3769625fd96ecbbeee4cdf6512242ebd6782a80c4",
    "part-04c.txt": "a9f2b0cf5533fabf8b9f4a99f6b8547db94b7dcc6afd6b67e133cd36856f0e40",
    "part-04d.txt": "05fd1804eeb6c0e02b97b5deb671a50e23d151266c5c6825ca2852db8d0e877d",
    "part-05.txt": "b4fb342d3b9ca8e2ef5940ebee7167e90ead69dfb90dfde956e5c7fa594ad0a1",
    "part-06.txt": "13c635906c5953be7d60508e60d493a9affd27c23276d82be9ff2590c82e2d16",
    "part-07.txt": "b341a5341d193d9068275f08b376556e7667a7868502db4986af77b0f525512e",
    "part-08.txt": "26daadccc853d212f41f4c3bfb94f5d7000d19d5e2be1ec9c875ead93b9fb25b",
}
actual_names = [p.name for p in parts]
if actual_names != list(expected_hashes):
    raise SystemExit(f"Unexpected Bizarre payload chunks: {actual_names!r}")
for part in parts:
    actual = hashlib.sha256(part.read_bytes()).hexdigest()
    expected = expected_hashes.get(part.name)
    if expected != actual:
        raise SystemExit(f"Bizarre payload integrity failure: {part.name} expected {expected}, got {actual}")
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
    code = item["code"]
    if name == "019-bizarre-visuals.py":
        old = """old='''${t.fighter.statuses.infinity?`infinity`:``} ${n.elevation?`elevated`:``}`'''\nnew='''${t.fighter.statuses.infinity?`infinity`:``} ${t.fighter.statuses.soulSeparated?`soul-body`:``} ${t.fighter.statuses.geLifeform?`ge-lifeform`:``} ${t.fighter.statuses.geScorpion?`ge-scorpion`:``} ${n.elevation?`elevated`:``}`'''"""
        new = """old='''${t.fighter.statuses.infinity?`infinity`:``} ${t.fighter.statuses.rikaCompanion?`rika-companion ${t.fighter.statuses.rikaFull?`rika-full`:`rika-partial`}`:``} ${n.elevation?`elevated`:``}`'''\nnew='''${t.fighter.statuses.infinity?`infinity`:``} ${t.fighter.statuses.rikaCompanion?`rika-companion ${t.fighter.statuses.rikaFull?`rika-full`:`rika-partial`}`:``} ${t.fighter.statuses.soulSeparated?`soul-body`:``} ${t.fighter.statuses.geLifeform?`ge-lifeform`:``} ${t.fighter.statuses.geScorpion?`ge-scorpion`:``} ${n.elevation?`elevated`:``}`'''"""
        if old not in code:
            raise SystemExit("Bizarre production compatibility source anchor missing in 019")
        code = code.replace(old, new, 1)
    print(f"== Bizarre subpatch: {name} ==")
    namespace = {"__name__": "__main__", "__file__": name}
    exec(compile(code, name, "exec"), namespace, namespace)
print("Bizarre Update Part 2 payload applied successfully")
