# Riftbound

Riftbound is a standalone turn-based ascension RPG rebuilt from an immutable recovered client and evolved through deterministic runtime patches.

Current patch release: **V32 - Restless Gambler**

Immutable base: **v0.3.0 - Cursed Child**

The current runtime contains:

- 210 items, including 70 Legendary and 26 Mythical items
- 51 Special Powers
- 50 public Power profiles and all 7 Stands in the interactive Codex
- 255 displayed Power and Stand techniques with detailed combat intelligence
- 30 routes
- 20 arenas
- 58 preserved ability definitions containing 225 Special Power and Stand moves
- 29 spatial presentation types, with every one of the 225 moves classified
- a six-slot build system and full Armory workflow
- host-authoritative two-player LAN co-op with protocol-3 recovery and resync

## V32 Restless Gambler

V32 adds the Legendary Restless Gambler as a complete combat system, not a cosmetic Codex entry.

- Rough Energy makes successful physical strikes stack Bleed up to six.
- Failed accuracy and dodge outcomes, plus minimum-damage Chromatic Balls rolls, build a six-segment Fever bar. Every two Fever segments add one Attack Strength, Durability, and Speed tier.
- Private Pure Love Train begins every battle at 100% Ultimate. Its twelve-turn domain rolls an XXX line after every two Special techniques.
- Odd rolls extend the domain, even rolls restore 24% maximum Energy, consecutive lines fully heal and refresh power cooldowns, and three matching digits trigger Jackpot. Maximum Fever guarantees that next Jackpot.
- Jackpot lasts twenty combatant turns with free replacement techniques, full Energy, 8% maximum-HP regeneration each turn, triple Movement, a huge green aura, and synthesized bass. It grants no invulnerability, so anti-heal and lethal burst remain real counters.
- Train Door is a solid, destructible battlefield object with a one-turn warning. Its closing threshold damages and Stuns caught hostiles, then remains as cover.
- The Codex includes seven explicit, mechanics-backed cinematic previews across the normal and Jackpot movesets.
- Jackpot bass can be disabled independently in Accessibility settings.

The balance contract and implementation record are in [UPDATE-V32-RESTLESS-GAMBLER.md](UPDATE-V32-RESTLESS-GAMBLER.md).

## V31 Codex Ascendant

V31 remasters the Special Power and Stand Codex into a cinematic, fully interactive archive while preserving the locked V20.0.1 ability constitution.

- Click any Power or Stand technique to open its complete dossier.
- Read authored description, damage class, scaling, power coefficient, sequence coefficient, reference damage, hit count, Energy cost, destruction, target mode, core geometry, range, spatial family, requirements, effects, and resolver flags.
- Browse all 49 public Special Power profiles and all 7 Stands, including partial manifestation, summoned commands, Ultimates, and Star Platinum's authored evolution overrides.
- Search by profile, move, description, role, or effect. Filter by rarity, damage class, tactical role, and spatial shape.
- Pin one move and select another for a six-metric side-by-side comparison.
- Navigate with keyboard, mouse, touch, or controller-oriented focus behavior. Reduced motion, high contrast, large text, and responsive layouts remain supported.
- Reference damage is explicitly labeled as a Tier 10 training estimate. Live output still depends on the active build, defender, statuses, terrain, hit logic, and authored resolver.
- Ability constitution `7598b438` remains exact: 57 protected definitions, 221 protected moves, and zero mechanical changes.

The V31 roadmap and implementation record are in [UPDATE-V31-CODEX-ASCENDANT.md](UPDATE-V31-CODEX-ASCENDANT.md).

### V31.1 preview accuracy

The Codex tactical preview no longer uses the V24 text classifier. All 255 displayed techniques now have explicit mechanics-backed visual contracts covering acquisition, origin, target, travel path, actual range, actual radius, contact shape, timing, and persistent aftermath. Those contracts drive the original stable V31 cinematic DOM renderer, preserving its working layout while correcting which ability shape each card depicts. The preview verifier rejects missing contracts, generic fallbacks, and any attempt to replace the cinematic renderer with the broken SVG stage.

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
npm run verify:v31
npm run verify:previews
npm run verify:v32
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
