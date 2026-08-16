# V33 Tactical Grammar

V33 turns Riftbound's spatial vocabulary into a live combat-mechanics layer. The release keeps the protected V32 ability definitions and constitution intact, but changes how authored techniques are acquired, aimed, visualized, moved through, collided with, persisted, and resolved on the tactical battlefield.

## Design goal

Before V33, Riftbound had a rich V31.1 preview vocabulary, but many techniques still collapsed onto the same few runtime interactions: select a target or point, draw a broad core shape, then resolve. V33 promotes the already-authored per-technique contracts into actual tactical behavior.

Every public Power and Stand technique is retyped individually from its explicit V31.1/V32 contract. There are no public fallback classifications.

## Mechanical grammar

A V33 tactical type describes six independent dimensions:

- **Input:** self, unit, point, line, equipment, selector, timeline, or retained-history interaction.
- **Timing:** immediate, sequence, reaction, charge, committed, delayed, persistent, domain, foresight, or rewind.
- **Trajectory:** projectile, ricochet, beam, line, cone, wave, arc, dash, lunge, drill, falling strike, teleport, tether, summon path, construct, or no traversed path.
- **Collision:** first-contact, single, multi-contact, pierce, area, global, linked, solid, threshold, pursuit, or rules-field interaction.
- **Aftermath:** none, field, wall, trap, tether, mark, summon, launch, shockwave, equipment lock, state change, time state, future lock, or full state restoration.
- **Counterplay:** cover, spacing, lane exit, telegraph exit, breaking geometry, cleansing links, denying destinations, authored time/causality responses, anti-heal, or domain interaction.

The catalog must expose at least 64 distinct **used** tactical types. In practice, full authored preview patterns plus canon-specific overrides create a substantially larger vocabulary than the old broad spatial family list.

## Canon-specific mechanics

V33 applies explicit overrides where a broad pattern is not enough to represent the technique faithfully. Examples include:

- Hollow Purple as an annihilation beam.
- Kamehameha as a charge beam.
- Go Beyond as a causal pursuit projectile.
- Road Roller as an off-map falling crush.
- Za Warudo and Stopped World as timeline-state techniques rather than ordinary self buffs.
- King Crimson Time Erasure as an erased route and Epitaph as future scripting.
- Master of Time and Return to Zero as retained-history / causal state restoration.
- Authentic Mutual Love and Malevolent Shrine as rule-field domains.
- Ora barrages as advancing barrages.
- Giga Drill Break as a committed drill lunge.
- Faux 100% as a high-speed dash combo.
- Forceful Decay as equipment-targeting disarm pressure.
- Chromatic Balls as a ricochet projectile.
- Train Door as a delayed closing construct trap.
- Relentless Luck as a blink slam with an impact shockwave.

## Tactical map and resolver integration

V33 wraps the final V32 targeting and resolver chain rather than rewriting protected move definitions.

- `Tt()` keeps the core hit shape but now returns the richer tactical type, input mode, timing, trajectory, collision model, aftermath, and counterplay.
- `At()` attaches the mechanical path to aim solutions, including distinct ricochet, falling, teleport, arc, tether, and direct paths.
- `Yt()` sends the tactical type into the combat-map motion renderer, allowing ricochets, falls, blinks, drills, sweeps, barrages, domains, fields, tethers, traps, and summons to read differently in live combat.
- `rs()` records the resolved tactical contract and applies ability-driven dash/blink/lunge movement when the legacy technique did not already reposition its actor.
- Action cards and the targeting harness show the V33 mechanical type instead of only the broad core shape.
- Persistent tactical echoes are bounded and respect reduced-motion rules.

## Preservation

V33 does **not** mutate the protected Special Power or Stand move definitions. Costs, coefficients, tags, hit counts, and V32 constitution identity remain untouched. The tactical layer is additive and is reported separately as `mechanicsChanged: true` / `constitutionChanged: false`.

Save schema advances to 33 and stores a bounded tactical-action history for debugging, replay analysis, and future balance work.

## Verification

`verify-tactical-grammar-v33.mjs` certifies:

- all 255 currently displayed Power and Stand techniques receive explicit tactical contracts;
- zero public fallbacks;
- at least 64 used tactical types;
- diversity across input, timing, trajectory, collision, and aftermath dimensions;
- key canon overrides including Restless Gambler and King Crimson Requiem;
- ability-driven lunge repositioning;
- dynamic Codex rebuild coverage;
- exact preservation of the V32 constitution and the original `7598b438` V20.0.1 base constitution.

Both pull-request and production deployment workflows run V32 and V33 verification after the historical test matrix.
