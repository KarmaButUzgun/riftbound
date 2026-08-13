# Riftbound V17-V20 - Full Update Log

Release: **V20 - Consolidation Arc**

This release combines the complete V17 through V20 roadmap into one deterministic patch stack. It updates the Armory, builds, balance tooling, encounters, AI, combat information, co-op, accessibility, effects, performance controls, save migration, diagnostics, testing, and deployment.

## Release inventory

| System | V20 total |
|---|---:|
| Items | 210 |
| Legendary items | 70 |
| Mythical items | 26 |
| Special Powers | 50 |
| Routes | 30 |
| Arenas | 20 |
| Armory primary modes | 5 |
| AI personalities | 6 |
| Adaptive paths per power | 3 |
| Save schema | 20 |
| Co-op protocol | 2 |

## V17 - Foundation Update

### Runtime and data contracts

- Added a forward-only run schema migration beginning at version 17.
- Added an explicit effect-priority table for causality, rewind, death prevention, invulnerability, counters, guard, shields, damage, status, movement, healing, resources, and presentation.
- Added stable effect ordering that preserves insertion order when priorities tie.
- Added a reusable action-legality result with actor, action, geometry, cost, cooldown, tags, and a player-readable failure reason.
- Added bounded runtime error diagnostics for ordinary errors and rejected promises.
- Added `globalThis.RIFTBOUND_DIAGNOSTICS` as the stable diagnostics surface.
- Added `globalThis.RIFTBOUND_MANIFEST` as a machine-readable catalog of items, powers, routes, arenas, counts, and runtime capabilities.
- Added deterministic build-time generation of `_site/riftbound-manifest.json`.

### Armory Reforged

- Replaced the previous dense three-pane shop with a complete full-screen Armory architecture.
- Added five first-class modes: Build, Browse, Craft, Inventory, and Favorites.
- Added a persistent command bar containing six equipped slots, Shards, floor, active Yuta/Rika inventory owner, and Return to Floor.
- Added a focused Armory launcher for intermission screens.
- Added search across names, passives, references, and stats.
- Added category chips plus rarity and stat filters.
- Added Recommended, Affordable, Components, Price Low, Price High, and Name sorting.
- Added a row-virtualized catalog that mounts only visible items and preserves scroll position per owner.
- Added persistent browsing memory per Yuta/Rika owner.
- Added visible Buy or Build controls directly on every catalog card.
- Added owned, component-progress, strong-fit, availability, and locked states.
- Added a compact inspector with Overview, Recipe, Upgrades, and Lore tabs.
- Added exact live stats, passive trigger, cooldown, recipe, price, and owned-component information.
- Added an upgrade browser using reverse recipe relationships.
- Added a goal-oriented Craft view with a pinned target, missing component types, component navigation, and exact completion cost.
- Added an Inventory workbench without leaving the Armory.
- Preserved authored item portraits in detail, recipe, inventory, and loadout surfaces while retaining lightweight catalog silhouettes for scrolling performance.
- Added mobile layouts for the command bar, inspector, filters, catalog, and workbench.
- Added Armory keyboard controls for search, buy/build, favorites, selection, and close.
- Removed the custom stale-prop memo comparator from item cards so current purchase callbacks and run state always reach visible cards.

## V18 - Balance Lab and Adaptive Builds

### Adaptive build paths

- Added exactly three six-item paths for every power: Signature, Pressure, and Control or Survival.
- Kept authored V16 identity guides as the seed for Signature paths.
- Added power profiling for physical, hybrid, ranged, control, and Energy-heavy kits.
- Added item scoring for scaling compatibility, secondary stats, weapon need, equipped items, category diversity, owned components, invested value, affordability, rarity, Mythical limits, and budget band.
- Added deterministic six-item selection with unique items and at most one Mythical in every path.
- Added an explicit next build target and one-click Build Now flow.
- Added composition warnings for an empty weapon slot, illegal Mythical count, AS/AP mismatch, glass builds, Energy-starved expensive kits, and duplicate investment.

### Balance and economy systems

- Added weighted item power budgets for every rarity.
- Added move output budgets using cost, damage, destruction, hits, utility tags, and Ultimate status.
- Added a runtime balance audit with ordered item and move outliers.
- Added floor-based economy budgets for expected income, wallet, inventory progress, and refresh cost.
- Added encounter budgets using hostile count, hazards, structures, floor, boss state, and elite state.
- Replaced static shop recommendations with component, affordability, and current-build-aware recommendations.
- Added deterministic AI equipment roles so ordinary enemies no longer converge on one identical best-in-slot loadout.
- Preserved custom Spartan Blood weapon logic while applying adaptive equipment to ordinary fighters.
- Added version 18 save state for economy and encounter analysis.
- Exposed `globalThis.RIFTBOUND_BALANCE_LAB`.

## V19 - Combat Intelligence

### Explainable enemy AI

- Added Sentinel, Architect, Conserver, Duelist, Predator, and Storm personalities.
- Assigned personalities from power mechanics, tiers, build role, Energy curve, and a deterministic identity hash.
- Added target-aware action scoring for damage, destruction, Energy, recovery, Guard, shielding, finishers, control, accuracy, critical pressure, repetition, enemy history, and conservation.
- Preserved authored Calamity, Rika, Gold Experience life-form, and Time Loop logic.
- Added safe precondition filters for cooldowns, Energy, Ultimate charge, Hollow Purple, Furnace, Spiral evolution, and Mahoraga/Shrine conflicts.
- Added a bounded decision record with chosen action, personality, score, and top alternatives.

### Combat information

- Added a live turn-order strip for the player, allies, and hostiles.
- Added personality and intended-action tooltips for AI combatants.
- Added selected-action previews for estimated damage, accuracy, scaling, shape, target, distance, range, contact, and legality.
- Added clear range-miss and illegal-action states.
- Added responsive layouts for desktop, compact, and mobile combat screens.

### Encounter director

- Added route-time encounter budget evaluation.
- Over-budget encounters grant a measured player shield and a modest reward multiplier.
- Under-budget encounters grant a measured enemy shield and a smaller reward multiplier.
- Stored the exact compensation and budget state on the run for inspection.
- Added version 19 migration and exposed `globalThis.RIFTBOUND_COMBAT_INTELLIGENCE`.

## V20 - Authority, Accessibility, Effects, and Performance

### Host-authoritative Player 2 ally

- Upgraded the LAN protocol from version 1 to version 2.
- Added a separately owned `coop-ally` fighter when both players are ready and the host is in combat.
- Gave the ally independent HP, Energy, Ultimate, equipment, Movement Points, position, and actions.
- Added a Player 2 action and movement controller to the co-op panel.
- Added live snapshots for ally vitals, position, MP, legal actions, targets, disabled reasons, and per-turn readiness.
- Added host-side resolution against the canonical run state.
- Added host acknowledgements that report success or rejection to Player 2.
- Added one ally action per host turn while preserving independent movement until MP is exhausted.
- Explicitly removed the co-op ally from ordinary AI planning and execution.
- Kept status lifecycle processing when the main turn advances.
- Added automatic transient ally creation and cleanup when room authority changes.

### Protocol validation

- Restricted ally intents to authenticated Player 2 sessions.
- Rejected intents until both players are ready or outside combat.
- Restricted accepted intent types to action and move.
- Added monotonically increasing client sequences, stale-command rejection, and rate limiting.
- Validated action IDs, target IDs, aim coordinates, actor ownership, and destinations.
- Restricted Player 2 movement to `coop-ally`.
- Restricted intent-result publication to the host.
- Bounded room intent and result histories.
- Added a loopback fallback when a host environment blocks network-interface enumeration.

### Accessibility

- Added a persistent Access control center.
- Added reduced motion and high contrast from user choice or operating-system preference.
- Added non-color Ally and Hostile cues.
- Added larger interface text and consistent keyboard focus outlines.
- Added polite live announcements for settings and partner actions.
- Kept action labels, combat state, and keyboard focus at every effect level.

### Effects and performance

- Added Auto, High, Medium, and Low effect density.
- Added a frame-rate governor for Auto mode.
- Low mode removes nonessential particles, ambient layers, screen shake, and expensive filters.
- Medium mode limits excess particle and echo children.
- Added bounded effect-echo histories at 12, 24, or 48 entries depending on density.
- Applied the V17 priority contract before old echoes are trimmed.
- Added reduced-motion overrides for animation, transition, and smooth scrolling.
- Added version 20 save migration and exposed `globalThis.RIFTBOUND_V20`.

## Build, tests, and deployment

- Added syntax validation for every new runtime part and Python patch.
- Added a runtime manifest generator.
- Added a V17-V20 verifier for exact content counts, unique IDs, valid recipes, effect priorities, adaptive paths, Mythical limits, balance coverage, AI scoring, runtime/style markers, and manifest parity.
- Added a live protocol test for health, host/join, readiness, snapshots, valid actions, stale sequences, impersonation, actor ownership, movement, and acknowledgements.
- Added both V20 checks to pull-request and GitHub Pages deployment workflows.
- Retained every historical verifier in both workflows.

## Compatibility

- Existing saves are normalized forward to schema 20.
- The recovered base archive remains unchanged and patch ordering remains deterministic.
- GitHub Pages remains dependency-free single-player.
- LAN co-op remains an opt-in local Node server.
- Existing Yuta/Rika inventories, favorites, item instances, route history, combat snapshots, and previous migration data are preserved.

## V20.0.1 - Armory navigation hotfix

- Fixed a React effect cleanup error that could close the runtime when changing the Armory from Build to Browse, Craft, Inventory, or Favorites.
- Kept Armory browsing-state persistence while ensuring its effect returns no cleanup value.
- Added a regression assertion for the exact effect lifecycle contract.
- Verified the deployed Build, Browse, Craft, Inventory, and Favorites navigation in a rendered browser.
