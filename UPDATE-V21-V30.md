# Riftbound V21-V30 - Remastered Roadmap and Full Update Log

Release: **V30 - Riftbound Remastered**

This release completes the entire V21 through V30 roadmap. Its governing rule is strict: no Special Power or Stand ability mechanics are changed. The remaster rebuilds the systems around those abilities so they are safer to preserve, clearer to read, more expressive on the battlefield, easier to operate, and easier to extend.

## Release contract

| Contract | Certified result |
|---|---:|
| Immutable recovered base | v0.3.0 |
| Ability baseline | V20.0.1 |
| Ability constitution | `7598b438` |
| Preserved ability definitions | 57 |
| Preserved moves | 221 |
| Ability changes | 0 |
| Spatially typed moves | 221 / 221 |
| Supported spatial types | 29 |
| Spatial families used by the catalog | 22 |
| Items | 210 |
| Special Powers | 50 |
| Routes | 30 |
| Arenas | 20 |
| Save schema | 30 |
| Co-op protocol | 3 |

## Completed roadmap

| Version | Milestone | Status | Release proof |
|---|---|---|---|
| V21 | Preservation | Complete | Constitution lock, save vault, backups, replays |
| V22 | Open Core | Complete | Events, registries, state hashes, legacy adapter |
| V23 | Interface Reborn | Complete | Shared UI language and four-input navigation |
| V24 | Combat Reforged | Complete | 221/221 spatial coverage, Heavy Swing weapon arc |
| V25 | Armory Complete | Complete | Unified decisions, legal slots, deltas, sale undo |
| V26 | Ascension Reframed | Complete | Atlas, run identity, route history, metrics, teaching |
| V27 | Living Rift | Complete | Twenty arena identities, scars, stances, audio bus |
| V28 | Combat Intelligence II | Complete | Fair tactical context and between-battle direction |
| V29 | Bound Together | Complete | Protocol-3 recovery, resync, partner HUD, desync guard |
| V30 | Remastered | Complete | Certification, compatibility, offline install shell |

## V21 - Preservation

### Ability constitution

- Captured every V20.0.1 Special Power and Stand definition before later remaster layers run.
- Fingerprinted name, cost, power, destruction, hit count, tags, channel, rarity, passive identity, rollability, and mechanical metadata.
- Locked the complete baseline to constitution hash `7598b438`.
- Added a runtime assertion and a release certification failure if even one protected move drifts.
- Kept the constitution independent from the V24 visual classifier so a presentation change cannot silently become a mechanic change.

### Saves, recovery, and replay

- Added automatic recovery points before migrations and before meaningful profile/run writes.
- Bounded recovery history to eight complete points.
- Added twelve named save slots with create, update, activate, remove, export, and import operations.
- Added exact restore behavior for both present and intentionally absent profile/run records.
- Rejects imported vaults whose ability constitution conflicts with the release.
- Added deterministic state hashing, replay input records, replay export, and golden-scenario hashes.
- Added a visible Save Vault without replacing the normal local save flow.

## V22 - Open Core

- Added twelve typed runtime events for action start/finish, movement, contact, damage, healing, resources, statuses, environment destruction, and committed state.
- Added a bounded event history and subscription API.
- Added canonical fighter and run views plus stable state hashes.
- Prevented aggregate action diffs from double-reporting damage already emitted by the damage resolver.
- Added complete registries for 50 powers, 210 items, 24 races, and 48 traits.
- Added registry validation for move catalogs and recipe references.
- Added stable priority ordering for effect queues.
- Added seeded random utilities and state shadow comparison.
- Preserved the original resolver, movement, and damage functions behind a legacy adapter while making Open Core the default contract.

## V23 - Interface Reborn

- Added shared surface, spacing, typography, color, focus, status, empty-state, disabled-state, and responsive tokens.
- Distinguished Ascension, Combat, Workshop, and System spaces without fragmenting the application.
- Added automatic mouse, keyboard, touch, and controller detection.
- Added remappable action bindings with duplicate-binding protection.
- Added a geometric focus graph for directional controller and keyboard navigation.
- Kept all primary operations available without hover.
- Added a visible control deck and adaptive input readout.
- Preserved the V20 reduced-motion, contrast, large-text, and effect-density contracts.

## V24 - Combat Reforged and Spatial Ability Grammar

This milestone is presentation-only. Resolver geometry, costs, damage, destruction, tags, hit counts, effects, and legal targets remain governed by the V20 ability constitution.

### Grammar

The renderer supports self, target, strike, arc, sweep, thrust, dash, dash cut, line, beam, projectile, cone, wave, area, ring, field, wall, cross cut, barrage, scatter, chain, tether, grab, ricochet, summon, teleport, control zone, orbit, and falling-area presentations.

- Classified all 200 Special Power moves and all 21 Stand moves.
- Certified 221 of 221 moves with no untyped entry.
- Twenty-two families are currently exercised by the catalog, so the visual vocabulary cannot collapse back to pick, area, and beam.
- Kept the core geometry label available alongside the new presentation label.
- Added truthful labels to the tactical inspector and selected-action preview.
- Kept the original aim ring and contact calculation as quiet mechanical references beneath the expressive layer.

### Heavy Swing

- `Devil of Sparta / Heavy Swing` now classifies as `WEAPON ARC`.
- The default preview is a 126-degree greatsword sweep centered on the actor and faced toward the aim point.
- Yamato, Beowulf, firearm, and Devil Arm contexts receive different arc widths and visual variants.
- The move remains cost 0, power 1.35, destruction 1.8, with its original tags and resolver behavior.

## V25 - Armory Complete

- Added one decision panel that joins legal slot, exact recipe state, owned components, missing components, stat delta, affordability, build-path relevance, and conflicts.
- Uses the actual recipe planner slot instead of suggesting a replacement the purchase pipeline cannot perform.
- Passes the live Shard balance into the decision surface.
- Preserved all three adaptive paths as alternatives instead of presenting one mandatory answer.
- Added a fifteen-minute sale undo that restores the exact item instance and UID.
- Undo deducts the exact refund, respects the weapon slot, never places armor in slot 0, enforces the Mythical commitment, and prevents unique Legendary duplication.
- Kept Build, Browse, Craft, Inventory, and Favorites inside one continuous workbench.

## V26 - Ascension Reframed

- Added visible run identity and optional custom seed storage.
- Added a bounded route chronicle with floor, route, risk, reward, HP, Shards, and timestamp context.
- Added an Ascension Atlas for current objective, upcoming route choices, build count, discoveries, and milestone progress.
- Added milestones at Floors 1, 5, 10, 20, 35, and 50.
- Added contextual teaching for movement, items, Stands, domains, Rika, power resources, and co-op.
- Added persistent per-run metrics for actions, damage, healing, movement, resources, and most-used actions.
- Resets metrics on a new run and preserves them with saves.
- Added run conclusions with build, route, replay hash, and canonical state hash.

## V27 - Living Rift

- Matched presentation identities to all twenty actual arena theme IDs, including Sunken Forge and Gravity Cathedral.
- Added far, middle, near, light, ambience, floor, fighter, and effect depth relationships.
- Added arena-specific palette, light angle, ambience, and hazard language.
- Added persistent visual scars from broken structures and active hazards.
- Added ready, guarding, staggered, critical, transformed, and defeated fighter states.
- Added shared line, arc, trail, shockwave, distortion, debris, light, afterimage, and timeline primitives.
- Added impact, ability, environment, interface, and music audio categories.
- Connected Open Core events to restrained impact, movement, status, and environment cues.
- Respects reduced motion and does not make audio a gameplay requirement.

## V28 - Combat Intelligence II

- Extended the six V19 personalities with geometry, range, cover, hazards, cooldown congestion, Energy, Ultimate threat, allies, hostile count, escape paths, finishers, and observed repetition.
- Records the largest positive and negative factors for each chosen action.
- Reads visible positions, visible statuses, revealed equipment, performed actions, and public resources only.
- Does not read hidden player decisions.
- Preserved authored Calamity, Rika, and special encounter behavior.
- Added a between-battle director that recommends relief, pressure, or hold based on encounter budget and run condition.
- The director never modifies an ability and only adjusts future encounter composition context and reward pressure.

## V29 - Bound Together

- Upgraded the local/LAN service to protocol 3 while keeping host authority.
- Added authoritative snapshot state hashes and partner expected-state hashes.
- Rejects a stale partner command before it reaches the resolver and asks for a full resync.
- Added explicit recovery and resync endpoints.
- Added bounded acknowledgement and recovery histories.
- Made intent-result publication idempotent so duplicate host acknowledgements cannot replace the first result.
- Added heartbeat expiry, automatic room pause, authenticated reconnect, and automatic resume when both ready players return.
- Added network state, latency, snapshot age, state hash, and acknowledgement history to the co-op UI.
- Expanded the partner HUD with its own loadout, stats, visible targets, distances, action geometry, exact disabled reasons, readiness, movement, and authority state.
- Kept Player 2 restricted to `coop-ally`, with one ally action per host turn and independent legal movement.
- Host migration remains deliberately outside the release contract.

## V30 - Riftbound Remastered

- Added the final schema-30 migration and release identity.
- Added a boot certification report covering preservation, registry validity, Open Core, spatial coverage, saves, interface, Armory, Ascension, arenas, intelligence, and co-op.
- Added a visible V30 certification panel.
- Added explicit compatibility metadata for the legacy adapter, save floor/ceiling, rollback window, immutable base, and zero ability changes.
- Added an install manifest, maskable scalable icon, theme metadata, and an offline shell service worker.
- The service worker never intercepts `/api/` co-op requests.
- Navigation remains network-first with an offline app-shell fallback.
- GitHub Pages and pull-request workflows now run the V30 verifier after the complete historical matrix.

## Verification

The V30 verifier checks:

- exact constitution hash and all 57 definitions / 221 moves
- deterministic golden hashes, replay records, state hashes, seeded utilities, and shadow comparison
- complete item, power, race, and trait registries
- all 221 spatial mappings, exact constitution parity, at least twenty used visual families, Stand inclusion, and Heavy Swing's arc contract
- Armory, Ascension, Living Rift, AI, co-op, PWA, release markers, and manifest parity
- all eleven release certification gates

The protocol test checks host/join, readiness, snapshot hashes, stale-state rejection, explicit resync, valid commands, stale sequences, impersonation, actor ownership, idempotent acknowledgements, heartbeat pause, authenticated recovery, and automatic resume.

The full historical CI matrix remains green from the Bizarre Update through V20, plus the standalone V13.1, V16.1, V16.2, V16.3, V16.5, and V16.6 workflows.

## Roadmap continuation

The next completed milestone is [V31 - Codex Ascendant](UPDATE-V31-CODEX-ASCENDANT.md), a cinematic and interactive remaster of the Special Power and Stand archive. It adds move intelligence, reference damage, filters, tactical previews, and direct comparison without changing the V21 ability constitution.

## Compatibility and rollback

- Existing saves normalize forward through schema 30.
- A valid pre-migration recovery point is retained before conversion.
- Named save slots are additive and do not replace the normal save keys.
- The recovered v0.3.0 archive remains byte-for-byte untouched.
- Every release is still rebuilt by applying deterministic patches in filename order.
- Open Core owns the default contract; the previous resolver remains callable through the adapter.
- GitHub Pages remains single-player when the local co-op API is absent.
- LAN rooms remain ephemeral server memory, while browser runs remain local to their origin.
