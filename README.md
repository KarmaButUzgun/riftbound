# Riftbound

Standalone recovered Riftbound client and live deployment source.

Current base release: **v0.3.0 — Cursed Child**

Current patch stack: **Combat Loadout HUD**, layered over **Spartan Blood**, **Full Catalog Armory**, **Build Expansion**, and **The Bizarre Update, Part 2**

## Deployment

The repository keeps `riftbound-standalone-v0.3.0.zip` as an immutable recovered base. GitHub Actions extracts that archive, applies every Python patch in `patches/` in filename order, and publishes only the playable static files (`index.html`, `entry.js`, and `assets/`).

Workflow: `.github/workflows/deploy-pages.yml`

Build script: `scripts/build-site.sh`

Runtime verification:

- `node scripts/verify-bizarre-update.mjs`
- `node scripts/verify-build-expansion.mjs`
- `node scripts/verify-spartan-blood.mjs`

Build Expansion removes weapon rolls, starts every new run weaponless, adds a six-slot inventory, provides 125 data-driven items with smart recipes, 35 unique Legendary passives, and one Mythical capstone, and splits offensive progression into Attack Strength and Attack Power. The Full Catalog Armory makes every item available on every floor in a deterministic three-pane shop with category browsing, search, recommendations, interactive component trees, clickable upgrade paths, and exact smart-build pricing. Its compact intermission entrance opens a viewport-owned Armory, so the game page stays fixed while the catalog, item details, recipes, and loadout use independent contained panes.

Spartan Blood adds its Mythic race and two Mythical powers, three dedicated weapon slots, capped weapon reforging, Flair and style systems, Devil Combo progression, differentiated Devil Triggers, weapon-specific combat laws, and the full Judgement Cut time-stop finisher. The update also includes purpose-built AI, migration-safe saves, battle history, battlefield models, responsive combat controls, and red or violet cinematic effects.

The Combat Loadout HUD uses the former anomaly-only column for universal player and selected-opponent six-slot item rails. Spartan Blood weapon switching now happens through the player rail while retaining full-action and Combo bonus-action rules; dedicated switch cards no longer clutter the move grid. The follow-up also repairs weaponless Cursed Child action generation and mirrors Devil Trigger wings from one shared centerline.

## Updating Riftbound

Normal updates should be added as deterministic patch files under `patches/` rather than replacing the full archive. This lets new powers, mechanics, balancing, bug fixes, and visual effects deploy automatically without repeatedly uploading the full game.

Browser saves remain local to the deployed site's origin.
