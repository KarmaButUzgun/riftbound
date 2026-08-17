# Riftbound V35 · Sovereigns of Ruin

V35 is an intentional live-content expansion above the protected V20.0.1 foundation. It adds three complete Special Powers, one Legendary weapon, a new Calamity unlock rule, a dedicated sovereign/chain/berserker battlefield presentation layer, and a structural combat-curve pass aimed at the floor-5-to-10 one-shot spike and late-run damage inflation.

## Release contract

- Schema: **35**
- Release: **V35 · Sovereigns of Ruin**
- Registered Special Powers: **54**
- Public Power profiles: **53**
- Stand profiles: **7**
- Total Codex profiles: **60**
- Displayed techniques: **268**
- Items: **211**
- Legendary items: **71**
- Mythical items: **26**
- Historical V20.0.1 constitution remains certified at `7598b438`.
- V35 intentionally expands the live constitution to **61 ability definitions / 237 body moves**. Old mechanics are preserved; the three new powers account for the new definitions and twelve body techniques.
- V33 remains the historical tactical foundation for the original 255 displayed techniques.
- V34 remains the historical general battlefield-VFX grammar for those original techniques. V35 layers bespoke authored effects above it.

## Legendary item · Blade of The Ruined King

Riftbound's BORK keeps the League identity but translates the economy into Riftbound stats and Movement Points.

- Weapon · Legendary.
- +3 Attack Strength, +2 Speed, +2 Combat Skill, +1 Regeneration.
- Successful basic Strike / weapon contact adds **9% of the victim's current HP** as bonus Physical damage.
- Heals the wielder for **10% of post-mitigation damage dealt**.
- Every third successful basic hit on the same target triggers **Clawing Shadows**: Movement efficiency is reduced by 30% for 2 turns.
- Clawing Shadows has a 3-owner-turn Riftbound cooldown.
- Only the active weapon can trigger the passive.

## Legendary · Ruined King

### Takeover

The Ruined King's kills create bodies rather than permanent stolen-technique inventory.

- Killing the last enemy leaves a post-floor Takeover offer. The player may accept or decline.
- In multi-enemy encounters, the victim becomes an inert battlefield wraith for 3 turns. The wraith cannot move, attack, react, or take ordinary turns. Striking its location activates Takeover.
- Takeover lasts 5 owner turns and heals Viego for 20% max HP before the shell swap.
- The stolen shell replaces race, trait, stats, active equipment, weapon, boons, Stand state, passive/status shell, Energy pool, HP scale, and normal technique set.
- The stolen Ultimate is never inherited. Heartbreaker remains Viego's Ultimate and is free during Takeover.
- HP percentage is preserved through body transitions so possession does not create a second health bar.
- The borrowed inventory is read-only: no selling, buying over it, moving items, or Spartan reforging.
- On expiry, Viego's complete original build returns at the possessed body's current battlefield position.
- Heartbreaker immediately ends Takeover after the execution resolves.

### M1 · Blade of the Ruined King

- 7.5m short directional zweihander thrust.
- Physical / AS-facing contact.
- Adds 10% of the victim's **current HP** after a successful hit.
- A successful hit clears its cooldown immediately.
- Battlefield staging is a body-committed spectral sword thrust, not a projectile.

### M2 · Spectral Maw

- Viego dashes up to 6m.
- A separate Black Mist Maw projectile continues down the aimed line up to 20m.
- The projectile scales from AP and Stuns on successful contact.
- Presentation separates Viego's dash trail from the Maw body so the technique reads as two simultaneous pieces of motion.

### M3 · Harrowed Path

- Place a 14m-radius Black Mist region within 18m.
- Persists for 3 turns; 5-turn cooldown.
- Movement spent while Viego remains in his own mist is 1.5× efficient.
- Strike/weapon accuracy is increased inside the mist.
- Viego becomes invisible to direct targeting until he attacks.
- AOE, domains, shockwaves, explosions, waves, cones, sweeps, radiation, and environmental damage can still hit him.
- The battlefield layer renders Harrowed Path as persistent Black Mist world geometry with spectral particulate, crown motifs, occlusion, and a faded fighter silhouette.

### Ultimate · Heartbreaker

- Teleport to the selected 7.5m-radius execution zone.
- Deals authored Physical AOE damage with additional scaling from each victim's missing HP.
- Uses ordinary Ultimate charge outside Takeover.
- Costs no Ultimate during Takeover.
- Casting it while possessed tears Viego out of the stolen body immediately after the rupture.
- The V35 staging uses a large crown-shaped execution seal, inward Black Mist collapse, spectral blade rupture, and violent outward soul shards.

## Legendary · The Unshackled

### Passive · Petricite Burst

- Casting a technique grants one Petricite charge, maximum 3.
- Strike consumes exactly one charge.
- A successful empowered Strike releases bonus AP damage in a 6m AOE centered on Sylas.
- Charges remain until used but reset between floors.

### M1 · Chain Lash

- Two Petricite chains cross at the aimed coordinate for the immediate AS-facing hit.
- The coordinate remains marked in world geometry.
- One turn later the exact point detonates for AP damage in a 5.5m radius.
- The delayed rupture does not follow a target who leaves.

### M2 · Kingslayer

- Fixed 5.2m engagement range; Range stat does not increase it.
- Sylas lunges into contact and deals AP damage.
- Heals for 20% of damage actually dealt.

### M3 · Abscond / Abduct

- Abscond is an 11m free-point dash.
- It opens the Abduct recast for 2 owner turns.
- Abduct fires a 22m enemy-only chain. Terrain and objects are invalid targets.
- Successful contact Stuns the victim and grapples Sylas to them.
- Using Abduct, or allowing its recast window to expire, starts a 3-turn Abscond recovery.

### Ultimate · Hijack

Hijack's charge model is target-history aware rather than two generic ammunition pips.

- A target Sylas has not stolen from this battle costs **50% Ultimate**.
- Once he has stolen that enemy's currently available Ultimate, every later theft from that same enemy costs **100% Ultimate** for the remainder of the battle.
- A fresh enemy is still a 50% target.
- Hijack only copies an Ultimate currently available to the victim at the theft moment.
- The stolen Ultimate is stored as one free cast and disappears after use.
- Stolen damage/healing uses Sylas's stats, not the victim's.
- Passive prerequisites belonging to the original character are waived for the stolen cast only; Sylas is not granted the passive system itself.
- Bespoke adapters cover state-heavy Ultimates such as Judgement Cut and Devil Trigger so they resolve without secretly creating Vergil's Combo/Yamato engine.

## Calamity · Ragegod

Ragegod is a mastery evolution rather than an ordinary Wheel result.

### Unlock

- Ragegod becomes rollable only after a run using **Super Strength** clears Floor 10 and advances to Floor 11.
- The unlock is stored as meta progression.
- Ragegod is not enemy-rollable.

### Passive · Berserker

- Ragegod has no Energy pool.
- His first three techniques are the exact Super Strength M1/M2/M3 definitions, translated to Rage costs.
- Rage costs: Wind Up 0, Crush 18, Barrage 24.
- Incoming damage fills Rage relative to max HP, with bounded per-packet gain so multihit and giant single hits both remain useful without instantly pinning the bar.
- At 100 Rage, Berserker Mode automatically begins.
- Berserker drains 14 Rage per owner turn; taking damage can refill the bar during the mode.
- When Rage reaches zero, Berserker ends.
- Berserker increases Attack Strength, Durability, Speed, and Regeneration.
- The physical-stat bonus scales from AP, intentionally preserving three viable build identities:
  - **AS-heavy:** strongest neutral Super Strength fundamentals, weakest transformation cash-in.
  - **AP-heavy:** weaker neutral physicals, largest Berserker stat eruption.
  - **Hybrid:** consistent middle path.

### Ultimate · Wrath of the Undying

- 5 owner turns.
- Ordinary lethal damage cannot reduce Ragegod below 1% max HP.
- Damage still lands and therefore can feed Rage.
- Causality can normally bypass Wrath and kill him.
- If Berserker Mode is active, Wrath also clamps causality-lethal damage to 1% for its remaining duration.
- Wrath does not grant immunity to Stun, displacement, sealing, control, anti-heal, or other non-death counterplay.

## Combat-curve repair

### The floor 5-10 equipment spike

V18's historical AI builder used:

`1 + floor(floor / 2) + boss bonus`, capped at six slots.

That meant a Floor-10 boss could already receive six equipped items. V35 keeps V18's deterministic item selection but trims the final loadout to a staged encounter budget:

- normal enemies: 0 items before Floor 5, 1 before Floor 10, 2 before Floor 15, then gradual growth;
- ordinary bosses: 1 item before Floor 10, 3 before Floor 20, then gradual growth;
- **Wamuu:** hard-authored 3-item cap;
- **All For One:** authored full six-item boss build.

This removes the accidental early full-build spike without deleting boss build identity.

### Durability now means health, too

Real Durability tiers now structurally increase max HP on top of item-derived HP. The bonus scales approximately 6% of base HP per effective Durability tier, with a +135% structural ceiling. Existing item HP is reconciled so repeated normalization cannot duplicate the bonus.

This gives Durability builds an actual health pool large enough for their defensive stat to matter and raises boss survivability through normal build logic rather than arbitrary HP inflation.

### Ordinary burst compression

Late-run stat/item multiplication could produce ordinary 32k Strikes against bosses whose health pools were only several thousand. V35 adds target-HP-aware packet sanity after all authored/item output is calculated:

- Strike / weapon: 38% max-HP soft point, 62% hard packet ceiling.
- Special: 52% soft, 80% hard.
- Ultimate: 78% soft, 115% hard.
- Damage above the soft point still contributes at 16%, preserving the value of extreme builds without allowing ordinary packets to scale without relation to the encounter's HP pool.
- Causality / death-authority packets bypass this ordinary compression.

Example certification: a 32,000 ordinary Strike into a 5,000-HP victim resolves to roughly 3,100 damage instead of 32,000, while a 32,000 causality packet remains 32,000.

## Battlefield presentation

V35 retains V34's general visual grammar but owns an additional bespoke layer for these kits.

Viego receives the most aggressive treatment:

- spectral zweihander lane and blade shards for Q;
- separate body dash and monstrous Black Mist Maw for W;
- persistent Harrowed Path world geometry with layered mist, drifting soul motes, crown glyphs, and camouflage silhouette treatment;
- visible dead-enemy wraiths with crown/eye/body motifs that remain on the map for possession;
- a possession-collapse transition when Takeover begins and a soul-tear transition when it ends;
- Heartbreaker uses an oversized execution crown, collapsing mist ring, blade rupture, and outward spectral debris rather than a generic circle flash.

Sylas receives crossing Petricite chains, persistent delayed Chain Lash marks, grapple lines, Petricite Strike bursts, and Hijack theft/cast staging. Ragegod receives a live Rage aura, Berserker ignition, AP-scaled transformation intensity, and a five-turn Wrath death-clamp sigil.

Reduced motion, low effect density, high contrast, and mobile layouts remain supported.

## Save compatibility

- V35 exports save vaults with the new V35 constitution hash.
- V35 accepts V35, V32 (`3684c969`), and protected V20 (`7598b438`) vault hashes.
- Unknown constitution hashes are rejected.
- The V20/V30/V31/V31.1/V32/V34 regression suites are adapted at verification time so they continue certifying the historical layer they own instead of falsely requiring the live V35 catalog to remain frozen at old counts.

## Verification

`scripts/verify-sovereigns-v35.mjs` certifies:

- all three powers and their authored move names;
- Ragegod's exact Super Strength M1/M2/M3 inheritance and Rage costs;
- BORK rarity/category/passive identity;
- 268-technique live Codex coverage with explicit preview/tactical/VFX data for every new technique;
- the exact 50% first-target / 100% repeat-target Hijack rule;
- ordinary burst compression and causality bypass;
- Wamuu / All For One / floor-10 item budgets;
- the expanded 61-definition / 237-move live constitution over protected base hash `7598b438`;
- continued V33 tactical and V34 battlefield-VFX availability beneath the release.
