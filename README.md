# Riftbound

Standalone recovered Riftbound client and live deployment source.

Current base release: **v0.3.0 — Cursed Child**

## Deployment

The repository keeps `riftbound-standalone-v0.3.0.zip` as an immutable recovered base. GitHub Actions extracts that archive, applies every Python patch in `patches/` in filename order, and publishes only the playable static files (`index.html`, `entry.js`, and `assets/`).

Workflow: `.github/workflows/deploy-pages.yml`

Build script: `scripts/build-site.sh`

## Updating Riftbound

Normal updates should be added as deterministic patch files under `patches/` rather than replacing the full archive. This lets new powers, mechanics, balancing, bug fixes, and visual effects deploy automatically without repeatedly uploading the full game.

Browser saves remain local to the deployed site's origin.
