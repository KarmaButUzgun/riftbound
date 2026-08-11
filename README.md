# Riftbound

Standalone recovered Riftbound client and live deployment source.

Current base release: **v0.3.0 — Cursed Child**

Current patch stack: **Itemization Expansion + Combat UI Reflow**, layered over **LAN Co-op Alpha**, **Combat Loadout HUD**, **Spartan Blood**, **Full Catalog Armory**, **Build Expansion**, and **The Bizarre Update, Part 2**.

## Deployment

The repository keeps `riftbound-standalone-v0.3.0.zip` as an immutable recovered base. GitHub Actions extracts that archive, applies every Python patch in `patches/` in filename order, and publishes only the playable static files (`index.html`, `entry.js`, and `assets/`).

Workflow: `.github/workflows/deploy-pages.yml`

Build script: `scripts/build-site.sh`

Runtime verification:

- `node scripts/verify-bizarre-update.mjs`
- `node scripts/verify-build-expansion.mjs`
- `node scripts/verify-itemization-expansion.mjs`
- `node scripts/verify-spartan-blood.mjs`
- `node scripts/verify-coop-network.mjs`

Build Expansion removes weapon rolls, starts every new run weaponless, adds a six-slot inventory, and splits offensive progression into Attack Strength and Attack Power. The current item catalog contains **181 data-driven items**, **67 Legendary items/passive identities**, and **one Mythical capstone** after the Itemization Expansion. The expansion adds exactly 32 new fiction-reference Legendaries plus 24 new lower-rarity components, reworks existing Common/Uncommon/Epic identities while preserving Rebellion, and broadens recipe routes around physical, AP, hybrid, crit, status, movement, defense, sustain, summon, Stand, Devil, weapon, Ultimate, cooldown, and tactical builds.

The Full Catalog Armory makes every item available on every floor in a deterministic three-pane shop. The Itemization Expansion upgrades that workflow with designed non-text item portraits, immediate hover tooltips, explicit passive trigger/cooldown language, live component trees, guarded double-click component purchasing, fast purchase feedback, and recipe/inventory updates without leaving the build view. Level-Up/Affinity caps now describe natural progression only; item bonuses are uncapped equipment contributions, and the UI separates Base, Level-Up Cap, Item Bonus, and Effective Stat values.

Recent combat UI reflow work targets comfortable play at normal browser zoom: fighter sheets use width instead of long vertical stacks, loadouts/anomaly sit in a compact horizontal ribbon, tactical formation is a roster rail, the battlefield shell places movement/minimap and field state beside the arena, and the action deck stays a stable 4×2 layout. Weaponless fighters retain a visible locked weapon-action slot so move positions do not reshuffle when a weapon is equipped.

Spartan Blood adds its Mythic race and two Mythical powers, three dedicated weapon slots, capped weapon reforging, Flair and style systems, Devil Combo progression, differentiated Devil Triggers, weapon-specific combat laws, and the full Judgement Cut time-stop finisher. The update also includes purpose-built AI, migration-safe saves, battle history, battlefield models, responsive combat controls, and red or violet cinematic effects.

The Combat Loadout HUD uses the former anomaly-only space for universal player and selected-opponent six-slot item rails. Spartan Blood weapon switching happens through the player rail while retaining full-action and Combo bonus-action rules; dedicated switch cards no longer clutter the move grid.

## LAN Co-op Alpha

Riftbound now includes a dependency-free local multiplayer host and in-game Host/Join lobby foundation. It is deliberately host-authoritative: the host publishes the canonical run snapshot, room events travel over Server-Sent Events, and partner inputs are submitted as authenticated intents for resolver-side execution.

Requirements: Node.js 20+ and two devices on the same LAN/Wi-Fi.

From the repository root run:

```bash
npm run coop
```

The command rebuilds the current patch stack and starts the local host. It prints two addresses:

- `http://localhost:3000` — open this on the host computer.
- `http://<LAN-IP>:3000` — send this address to the friend on the same network.

Open the **CO-OP** control in the lower-right corner, choose **HOST RUN**, send the six-character room code to the partner, then have both players ready up. Session credentials are stored only in each browser and the room itself lives in host memory.

This first network milestone provides the LAN transport/lobby/state-authority layer and exposes the current Riftbound run to that bridge. Normal GitHub Pages play stays single-player because the co-op UI only activates when the local server answers `/api/health`. The next resolver stage connects remote intents to a separately owned allied fighter so two players can independently act inside the same roguelike combat state.

## Updating Riftbound

Normal updates should be added as deterministic patch files under `patches/` rather than replacing the full archive. This lets new powers, mechanics, balancing, bug fixes, visual effects, UI work, and network integration deploy without repeatedly uploading the full game.

Browser saves remain local to the deployed site's origin. LAN room state is intentionally ephemeral in the Alpha host.
