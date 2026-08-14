# Riftbound V31 - Codex Ascendant Roadmap and Update Log

Release: **V31 - Codex Ascendant**

V31 turns the Codex into a first-class combat reference. Its governing rule is the same preservation contract established in V21: presentation and explanation may become dramatically better, but the protected abilities do not change.

## Release contract

| Contract | Certified result |
|---|---:|
| Immutable recovered base | v0.3.0 |
| Save schema | 31 |
| Ability constitution | `7598b438` |
| Protected definitions | 57 |
| Protected moves | 221 |
| Mechanical ability changes | 0 |
| Registered Special Powers | 50 |
| Public Power profiles | 49 |
| Hidden authored profiles | 1 |
| Stand profiles | 7 |
| Public archive profiles | 56 |
| Displayed techniques | 248 |
| Authored evolution overrides | 3 |
| Supported spatial types | 29 |

The 248 displayed techniques include all 196 moves from the 49 public Power profiles, all partial and summoned Stand commands, all Stand Ultimates, and three authored Star Platinum evolution overrides. The V21 constitution remains the mechanical certification authority for its 221 protected Power and summoned-Stand moves.

## Completed roadmap

| Track | Status | Release proof |
|---|---|---|
| Cinematic archive shell | Complete | Full-width three-pane interface, dynamic identity art, tactical stage |
| Power and Stand dossiers | Complete | 56 public profiles and 248 displayed techniques |
| Move intelligence | Complete | Damage, scaling, coefficients, reference output, geometry, requirements, effects |
| Search and discovery | Complete | Full-text search plus rarity, damage, role, and shape filters |
| Direct comparison | Complete | Pin workflow and six normalized comparison metrics |
| Input and accessibility | Complete | Keyboard controls, focus states, touch layouts, reduced motion, contrast, large text |
| Preservation and migration | Complete | Schema 31, constitution `7598b438`, zero ability changes |
| Release verification | Complete | Dedicated V31 verifier plus complete historical CI matrix |

## Archive experience

### Cinematic identity stage

- Replaced the former three-column card grid with a profile browser, identity stage, and move inspector.
- Uses each Power or Stand's authored glyph and accent to drive the active scene.
- Preserves the Systems, Devils, Races, Traits, and Weapons categories inside the same new visual language.
- Adds direct portals from Systems to the Power and Stand archives.
- Fits large desktop, laptop-height, tablet, and phone viewports without hiding content.

### Power profiles

- Exposes all 49 profiles intended for public Codex discovery.
- Keeps Mutated Aura Accumulation hidden because its authored `codexHidden` contract remains authoritative.
- Groups the normal three techniques and Ultimate into one clear technique array.
- Shows rollability, rarity, damage families, tactical roles, passive doctrine, and full authored descriptions.

### Stand profiles

- Exposes all seven Stand definitions.
- Separates Partial Manifestation, Summoned Commands, and Stand Ultimate sections.
- Includes Star Platinum: The World's three authored overrides as a distinct evolution group.
- Shows Stand range, personality, linked passive doctrine, and every available command.

## Move intelligence

Every displayed technique includes:

- authored name and description
- slot and manifestation group
- Physical, Supernatural, Hybrid, True / Causal, Special, or Utility damage class
- Attack Strength, Attack Power, Hybrid, or non-standard scaling
- original power coefficient
- indicative full-sequence coefficient
- Tier 10 reference damage and accuracy preview
- original Energy or Ultimate cost
- original hit count and destruction coefficient
- V24 spatial presentation family
- resolver core shape, target mode, and reference range
- curated requirements and authored effects
- human-readable resolver flags in an expandable technical section

Reference damage uses the existing V19 preview estimator with a Tier 10 attacker and Tier 10 training target. It is a comparison baseline, not a promise of live output. The live resolver still owns build scaling, target mitigation, statuses, terrain, cover, multi-hit behavior, special effects, and every authored exception.

## Tactical preview

- Renders distinct miniature presentations for beams, lines, projectiles, thrusts, arcs, barrages, areas, fields, walls, chains, teleports, summons, and other V24 families.
- Keeps the underlying core geometry visible alongside the expressive spatial label.
- Marks the preview as presentation-only and mechanics-unchanged.
- Adds a small correction table for obvious Stand presentation cases such as Left Hook, Launch, Star Finger, Road Roller, Bubble Plunder, and Life Generation. These corrections affect only Codex illustration.

## Search, filters, and comparison

- Search covers profile names, move names, descriptions, passive text, tactical roles, and technical effect labels.
- Filters cover rarity, damage class, tactical role, and spatial family.
- Empty results provide a one-action reset.
- Compare pins any move and keeps it pinned while another profile or move is selected.
- Comparison reports power coefficient, reference damage, Energy cost, destruction, hit count, and reference range with directional deltas.

## Controls and accessibility

| Input | Action |
|---|---|
| Up / Down | Previous or next filtered profile |
| Left / Right | Previous or next technique |
| `/` | Focus Codex search |
| `C` | Pin or unpin selected technique |
| Escape | Close the active comparison before the Codex |
| Pointer / touch | Select all profiles, moves, filters, and controls directly |

- All interactive controls have visible focus treatment.
- Profile selection uses listbox semantics and selected state.
- Technique selection exposes pressed state.
- Move changes are announced through a polite live region.
- Reduced-motion settings stop archive motion and tactical animation.
- High contrast and large text settings extend into the new archive.

## Persistence and compatibility

- Existing saves normalize forward to schema 31.
- The migration adds only an archive metadata namespace.
- V30 certification remains intact beneath V31.
- The recovered v0.3.0 archive remains unchanged.
- The complete site still rebuilds by applying deterministic patches in filename order.
- GitHub Pages and LAN co-op behavior remain unchanged outside the Codex.

## Verification

The V31 verifier checks:

- exact schema and release identity
- 50 registered Powers, 49 visible Power profiles, 1 hidden authored profile, 7 Stands, 56 profiles, and 248 displayed techniques
- unique profile and move IDs
- complete descriptions, coefficients, costs, hit counts, destruction, scaling, damage classes, geometry, spatial types, requirements, effects, and reference metadata
- all three Star Platinum evolution overrides
- Physical Stand strike classification, Utility guard/time-stop classification, and explicit Stand spatial corrections
- full-text search, every filter family, and normalized move comparison
- V21 constitution hash `7598b438`, 57 definitions, 221 protected moves, and zero ability changes
- V24 221/221 spatial certification and V30 boot certification
- runtime markers, replacement of the legacy Codex grid, responsive styles, reduced motion, high contrast, published manifest parity, and static build artifacts

Both pull-request and Pages workflows run V31 after the complete historical release matrix.

## V31.1 - Preview Accuracy correction

The initial V31 tactical cards reused the V24 presentation classifier. That classifier was designed to add flavor to live combat effects, not to serve as a precise move diagram, so it could collapse multiple phases or select a misleading family from descriptive text.

V31.1 removes that classifier from the Codex preview path. All 248 displayed techniques now have an explicit contract with:

- actual resolver range, radius, origin, target mode, and core geometry;
- authored acquisition, resolution, and aftermath phases;
- distinct paths for projectiles, beams, lines, cones, falls, dashes, teleports, walls, tethers, traps, summons, domains, fields, global effects, time manipulation, transformation, healing, and defense;
- accurate multi-stage combinations such as projectile into persistent field, impact into summon, teleport into strike, strike into pressure cone, and detonation into lingering radiation;
- a fixed 120m by 64m reference field with meter rulers instead of fixed source and target positions;
- exhaustive verification requiring 248 explicit contracts and zero generic fallbacks.

The ability constitution remains `7598b438`. This correction changes presentation only and makes zero ability-mechanic changes.

### Renderer repair

The first V31.1 deployment incorrectly replaced the established cinematic DOM stage with an SVG tactical board. Global application typography leaked into the SVG text nodes, producing oversized actor labels and an unusable preview. The repair restores the exact V31 cinematic renderer and keeps the 248 explicit contracts solely as the authoritative ability-to-visual mapping. The working layout is preserved; only the depicted spatial family and its ability-specific label are corrected.
