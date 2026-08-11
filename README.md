# Riftbound

Standalone recovered Riftbound client and live deployment source.

Current base release: **v0.3.0 — Cursed Child**

Current patch stack: **Full Catalog Armory**, layered over **Build Expansion** and **The Bizarre Update, Part 2**

## Deployment

The repository keeps `riftbound-standalone-v0.3.0.zip` as an immutable recovered base. GitHub Actions extracts that archive, applies every Python patch in `patches/` in filename order, and publishes only the playable static files (`index.html`, `entry.js`, and `assets/`).

Workflow: `.github/workflows/deploy-pages.yml`

Build script: `scripts/build-site.sh`

Runtime verification:

- `node scripts/verify-bizarre-update.mjs`
- `node scripts/verify-build-expansion.mjs`

Build Expansion removes weapon rolls, starts every new run weaponless, adds a six-slot inventory, provides 120 data-driven items with smart recipes and 32 unique Legendary passives, and splits offensive progression into Attack Strength and Attack Power. The Full Catalog Armory makes every item available on every floor in a deterministic three-pane shop with category browsing, search, recommendations, interactive component trees, clickable upgrade paths, and exact smart-build pricing. Its compact intermission entrance opens a viewport-owned Armory, so the game page stays fixed while the catalog, item details, recipes, and loadout use independent contained panes.

## Updating Riftbound

Normal updates should be added as deterministic patch files under `patches/` rather than replacing the full archive. This lets new powers, mechanics, balancing, bug fixes, and visual effects deploy automatically without repeatedly uploading the full game.

Browser saves remain local to the deployed site's origin.
