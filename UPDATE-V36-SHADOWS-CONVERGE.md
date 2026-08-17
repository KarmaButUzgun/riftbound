# V36 · Shadows Converge

V36 adds the Deltarune Shadow item line and The Roaring Knight, reworks Symbol of Fear around an internal All For One archive and persistent Quirk Factor Mutations, and hardens Ruined King Takeover so Heartbreaker is structurally part of the temporary possession shell.

## Shadow Crystal — Legendary
- +5 Energy, +2 AP.
- Hold Breath: once per fight, lethal damage leaves the owner at exactly 1 HP instead. The next damaging attack is guaranteed not to miss. The spent flag, not the one-turn catalog cooldown metadata, is the authoritative once-per-fight limiter.

## Shadow Mantle — Mythical
- +6 Durability and no offensive stats.
- True Darkness halves causality-level damaging attacks before the normal damage resolver.
- The one-Mythical inventory cap remains authoritative.

Both items use authored vector portraits so the shop/Armory presentation remains sharp at every UI scale.

## The Roaring Knight — Mythic
- Uses no Energy for power techniques.
- Rest becomes Roar: next-turn 1.5× Movement efficiency, flight, and stronger Darker Darker Yet Darker unseen-technique pressure.
- Darker Darker Yet Darker gives first-seen techniques bonus AP damage per target per fight, forces non-causal True Damage back through ordinary armor, and adds Strike damage against non-Human races.
- Crystal Barrage telegraphs a large Dark zone, then rains Corrosive crystals one combatant turn later.
- Dark Sword fires three weapon-like sword bullets from behind the Knight and preserves ordinary on-hit behavior.
- Slice is a long sword lane; successful contact seeds delayed corrosive crystals at the hit location.
- SWOON is global non-causal True Damage. Its cinematic is intentionally minimal: black screen, one slow white slash, no cinematic title. Hit targets get the battlefield SWOON mark afterward.
- Battlefield presentation keeps the Knight pitch-black, levitating and afterimage-heavy; Roar opens the silhouette into the more monstrous chest-eye form.

## Symbol of Fear rework
- Immense Regeneration doubles every heal/regeneration source. While anti-heal is active, anti-heal does **not** reduce base healing; it suppresses only the x2 passive for its duration.
- All For One remains one main action and one internal archive picker. Decay and Stolen Quirks are injected into that existing storage UI; they never become extra top-level combat buttons.
- Repeating the same stored technique back-to-back diminishes its output to 76%, 58%, then 46% until a different stored technique is used.
- Built-in Decay: Destruction is now a self-centered visible ground-decay AOE; Forceful Decay and Hatred use fixed Strike range. Awakened Ruin is available from the existing Omni-Factor picker.
- Built-in Stolen Quirks: Radio Waves hides player HP/Energy/cooldown telemetry for the next round, Rivet Stab inflicts Bleed, Air Cannon is a large destructive wave.
- Focused Regeneration heals 36% max HP before Immense Regeneration, cleanses debuffs, then self-stuns for the next turn.
- Focused Regeneration has an 8% base Quirk Factor Mutation chance, +3.5 percentage points per detected stolen archive power, capped at 38%.
- Ten non-duplicate persistent kiss/curse mutations: Springlike Limbs, Hypertrophy, Spearlike Bones, Air Walk, Force Field Organ, Black Lightning, Fanged Jaw, Spiked Growth, Ooze Glands, Hardening.
- Mutation mechanics persist on the fighter object through the run; battlefield token layers compose as mutations accumulate.
- Accelerator Rings is a 34m destructive dash (40m with Springlike Limbs) that damages crossed enemies and pulverizes destructible route geometry.
- The existing Symbol of Fear Ultimate remains otherwise unchanged.

## Ruined King Takeover hardening
V35.1 filtered the visible action array but the post-floor possession UI could still rebuild from the borrowed power shell and lose Heartbreaker. V36 fixes the state boundary itself:
- after Takeover begins, the temporary borrowed `power.moves[3]` is replaced by Ruined King Heartbreaker;
- the same replacement is enforced after fighter and run normalization;
- the final action surface still strips any slot-8/Ultimate leakage as defense-in-depth.

The possessed body therefore keeps its first three normal techniques/passives/items/stats while its Ultimate slot is Viego's free Heartbreaker. Heartbreaker still ejects Viego immediately after resolution.

## Release foundation
- Schema: 36.
- Items: 213.
- Registered powers: 55.
- Visible power profiles: 54.
- Displayed Codex techniques: 272.
- Live ability constitution: 62 definitions / 241 body moves, hash `dc25a499` on the current build.
- Historical V20.0.1 foundation hash remains `7598b438`.
- V33 tactical grammar and V34 battlefield VFX grammar remain the underlying spatial/presentation foundations.
