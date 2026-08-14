# V32 Restless Gambler

V32 adds Restless Gambler as a Legendary Special Power with an authored base kit, a separate Jackpot kit, persistent combat geometry, deterministic gambling rules, a dedicated HUD, effects, audio, AI use, save compatibility, and seven exact Codex previews.

## Final balance contract

| System | Rule |
| --- | --- |
| Rough Energy | Successful physical strikes add one Bleed stack. Lucky Shot applies it on every hit. Rough Blast immediately sets Bleed to 6/6. |
| Fever | Six segments maximum. Failed hit or dodge outcomes and minimum-tier Chromatic Balls add one. Every two segments grant +1 Attack Strength, Durability, and Speed tier. |
| Domain | Private Pure Love Train starts every encounter at 100% Ultimate and lasts 12 combatant turns, with a hard cap of 18. Every two Special techniques roll three digits. |
| Odd roll | Adds one domain turn, up to the 18-turn cap. |
| Even roll | Restores 24% maximum Energy. |
| Consecutive roll | Ascending or descending sequences such as 123 or 654 fully heal and refresh power cooldowns. |
| Matching roll | Three matching digits trigger Jackpot. Six Fever guarantees this result on the next domain and is then consumed. |
| Jackpot | Lasts 20 combatant turns. Energy is kept full, Jackpot techniques cost zero, 8% maximum HP is regenerated each turn, and Movement is tripled. |
| Counterplay | Jackpot is not invulnerability or death prevention. Anti-heal modifies its recovery through the normal healing resolver, and a lethal hit can still kill the Gambler. |
| Audio | A synthesized bass line follows the green Jackpot state and can be disabled through the independent Jackpot Bass accessibility setting. |

## Techniques

### Base kit

- **Chromatic Balls:** 13 Energy. Three projectile contacts with one of six deterministic damage multipliers: 0.55×, 0.78×, 1.00×, 1.25×, 1.55×, or 1.90×. The minimum line adds Fever.
- **Train Door:** 18 Energy. Places a solid destructible door within 30m. After one combatant turn it closes across a 3.2m threshold, damages and Stuns caught hostiles, and remains as cover for the rest of its seven-turn life.
- **Rough Blast:** 24 Energy. A 6m uppercut with 1.28 power, heavy knockback, and immediate maximum Bleed.
- **Private Pure Love Train:** 100 Ultimate. Opens the gambling domain and its two-Special roll cadence.

### Jackpot override

- **Lucky Shot:** Free eight-hit barrage. Each hit carries Rough Energy.
- **Relentless Luck:** Free 24m blink slam with a 7m hostile-only shockwave.
- **Fever Punch:** Free committed melee strike with 2.08 power, Guard Break, extreme knockback, and high destruction.

## Presentation and accessibility

- A six-cell Fever meter, roll history, next-roll counter, domain clock, and Jackpot clock sit above the combat actions.
- Domain state adds reel lines, green station light, and dedicated battlefield effects.
- Jackpot adds a full green aura, pulse treatment, replacement-action styling, and a generated bass sequence without shipping a copyrighted track.
- Reduced-motion, high-contrast, effect-density, master audio, music volume, and the new Jackpot Bass setting all continue to control the presentation.
- The seven Codex techniques use explicit contracts and the stable cinematic DOM renderer. No generic fallback or SVG replacement is allowed.

## Compatibility and certification

- Runtime schema advances to 32.
- The original `7598b438` constitution remains independently verified as the exact pre-V32 base.
- The additive V32 constitution is `3684c969`, representing 58 ability definitions and 225 authored body moves.
- The public Codex now exposes 57 profiles and 255 techniques, all with explicit previews and zero fallbacks.
- Save Vault import accepts both the preserved base constitution and the additive V32 constitution.
- The release verifier exercises Fever capping, the maximum-Fever guarantee, normal domain entry, solid Train Door closure, the seven preview mappings, music setting markers, and both constitution hashes.
