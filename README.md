# Riftbound

Riftbound is a standalone turn-based ascension RPG rebuilt from an immutable recovered client and evolved through deterministic runtime patches.

Current patch release: **V30 - Riftbound Remastered**

Immutable base: **v0.3.0 - Cursed Child**

The current runtime contains:

- 210 items, including 70 Legendary and 26 Mythical items
- 50 Special Powers
- 30 routes
- 20 arenas
- 57 preserved ability definitions containing 221 Special Power and Stand moves
- 29 spatial presentation types, with every one of the 221 moves classified
- a six-slot build system and full Armory workflow
- host-authoritative two-player LAN co-op with protocol-3 recovery and resync

## V21-V30 Remastered release

The complete V21-V30 roadmap is implemented and certified:

- **V21 Preservation:** immutable ability constitution `7598b438`, deterministic hashes and replays, automatic recovery points, named save slots, and vault import/export.
- **V22 Open Core:** typed event bus, canonical state views and hashes, complete content registries, ordered effects, seeded utilities, shadow comparison, and a legacy resolver adapter.
- **V23 Interface Reborn:** one design language across Ascension, Combat, Workshop, and System, geometric keyboard/controller focus, touch support, remappable bindings, and adaptive input prompts.
- **V24 Combat Reforged:** presentation-only spatial grammar for all 221 Special Power and Stand moves. Heavy Swing is now a weapon-facing arc, while beams, waves, thrusts, dash cuts, fields, walls, barrages, chains, summons, teleports, and other families read differently on the tactical map.
- **V25 Armory Complete:** exact build-decision context, legal slot and recipe state, stat deltas, path relevance, conflict warnings, and shard-safe sale undo.
- **V26 Ascension Reframed:** run identity and seed controls, route chronicle, milestone atlas, risk/reward previews, contextual teaching, persistent per-run metrics, and final summaries.
- **V27 Living Rift:** twenty matched arena identities, layered depth and light, environment scars, fighter stance language, shared effect primitives, and reactive audio categories.
- **V28 Combat Intelligence II:** geometry, cover, hazards, cooldowns, resources, Ultimate pressure, allies, escape paths, and observed-action reasoning using public combat information only.
- **V29 Bound Together:** protocol-3 co-op, heartbeat pause/recovery, state-hash desync rejection, explicit resync, acknowledgement history, network health, and a complete partner build/target/action HUD.
- **V30 Remastered:** schema-30 compatibility, boot certification, offline shell, install manifest, release panel, and final rollback metadata.

The roadmap and full implementation log are in [UPDATE-V21-V30.md](UPDATE-V21-V30.md).

## V17-V20 release

V20 consolidates four major update layers:

- **V17 Foundation + Armory Reforged:** versioned migrations, runtime diagnostics, effect priorities, a generated content manifest, and a complete shop GUI replacement with Build, Browse, Craft, Inventory, and Favorites modes.
- **V18 Balance Lab + Adaptive Builds:** three six-item archetypes per power, component and affordability-aware recommendations, build warnings, role-varied enemy equipment, and machine-readable item, move, economy, and encounter budgets.
- **V19 Combat Intelligence:** six explainable AI personalities, target-aware action scoring, a live turn timeline, damage/accuracy/range previews, and route encounter compensation.
- **V20 Authority + Accessibility + Effects:** a separately controlled Player 2 ally, validated protocol-v2 intent resolution, reduced motion, high contrast, larger interface text, effect-density controls, and adaptive effects throttling.

The earlier consolidation log remains in [UPDATE-V17-V20.md](UPDATE-V17-V20.md).

## Build and deployment

The repository keeps `riftbound-standalone-v0.3.0.zip` unchanged. The build extracts it, applies every Python patch in `patches/` in filename order, validates the resulting JavaScript, and publishes only the playable static site.

```bash
npm run build
```

Generated output:

- `_site/index.html`
- `_site/entry.js`
- `_site/assets/`
- `_site/riftbound-build.json`
- `_site/riftbound-manifest.json`
- `_site/manifest.webmanifest`
- `_site/riftbound-sw.js`
- `_site/riftbound-icon.svg`

GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`. Pull-request verification is defined in `.github/workflows/test-build.yml`.

Focused release checks:

```bash
npm run verify:v20
npm run verify:v30
npm run verify:coop
npm run verify:release
```

Both workflows also run the complete historical verifier stack so the remaster remains compatible with Bizarre Update, itemization, Mythicals, Cursed Child, Beneath The Drowning, Combat Fluidity, Wayfarer, Spartan Blood, and the earlier co-op transport.

## Armory Reforged

Open the Armory from an intermission floor. Its persistent command bar keeps the six equipped slots, Shards, floor, active Yuta/Rika owner, and Return to Floor control visible.

Primary modes:

- **Build:** three adaptive build directions, an explicit next target, owned-state progress, and compatibility warnings.
- **Browse:** search, category chips, rarity/stat filters, sorting, a virtualized catalog, visible Buy/Build buttons, and a compact inspector.
- **Craft:** one pinned target, owned-component consumption, missing-component navigation, and the exact remaining Shard cost.
- **Inventory:** equip, reorder, replace, and sell without leaving the Armory.
- **Favorites:** the same complete catalog workflow filtered to saved items.

Keyboard controls inside the Armory:

- `/` focuses search
- `B` buys or builds the inspected item when legal
- `F` toggles its favorite state
- Left/Right selects adjacent visible items
- `Escape` returns to the floor

## LAN co-op

Co-op requires Node.js 20+ and two devices on the same LAN or Wi-Fi.

```bash
npm run coop
```

The server prints:

- `http://localhost:3000` for the host
- `http://<LAN-IP>:3000` for the second device

Open **CO-OP** in the lower-right corner. The host creates a room, the partner joins with its six-character code, and both players ready up. During combat, Player 2 receives a separate Rift Echo ally with its own HP, Energy, Movement Points, equipment, and action list.

The host remains authoritative under protocol 3:

- only Player 2 can issue ally commands
- commands are authenticated, sequenced, rate-limited, and schema-validated
- Player 2 may move only `coop-ally`
- one ally action is accepted per host turn
- the host resolves the action and publishes an acknowledgement
- the normal auxiliary AI loop cannot double-control the co-op ally
- stale state hashes are rejected before resolution
- missed heartbeats pause the room without deleting its recovery snapshot
- authenticated reconnects restore the latest snapshot and acknowledgement history
- either player can request a full authoritative resync

Co-op activates only when the local server responds. GitHub Pages remains a normal single-player deployment.

## Accessibility and effects

The **ACCESS** control in the lower-left corner provides:

- reduced motion
- high contrast and non-color state cues
- larger interface text
- Auto, High, Medium, or Low effect density

Auto density samples frame rate and lowers nonessential effects when rendering pressure rises. Combat state, keyboard focus, labels, and live announcements remain available at every density.

## Updating Riftbound

Add normal updates as deterministic patch files under `patches/` instead of replacing the recovered archive. Keep migrations forward-compatible, expose new system contracts through the runtime manifest or diagnostics APIs, add focused verification, and retain the exact-build workflow.

Browser saves remain local to the deployed origin. LAN room state is intentionally ephemeral and lives in host memory.
