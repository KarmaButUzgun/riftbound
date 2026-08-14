const RIFT_V311_MARKER=`Riftbound Codex Preview Accuracy V31.1`;
const RIFT_V311_VERSION=`31.1`;
const RIFT_V311_PREVIEW_VERSION=2;
const RIFT_V311_BOARD=Object.freeze({width:120,height:64,originX:10,originY:34});
const RIFT_V311_CINEMATIC_MOVE_VISUAL=RIFT_V31_MOVE_VISUAL;
const RIFT_V311_TOKENS=new Set([`self`,`command`,`guard`,`charge`,`slam`,`area`,`barrage`,`impact`,`dash`,`strike`,`wave`,`counter`,`melee`,`cone`,`movement`,`field`,`pierce`,`time`,`rewind`,`projectile`,`delayed`,`global`,`target`,`burst`,`moving`,`wall`,`point`,`falling`,`multi`,`fracture`,`beam`,`heal`,`tether`,`compress`,`stealth`,`slash`,`sink`,`transform`,`teleport`,`portal`,`extract`,`mark`,`debuff`,`lock`,`freeze`,`curse`,`guarantee`,`dispel`,`drain`,`copy`,`summon`,`convert`,`drill`,`trap`,`explosions`,`spin`,`cut`,`sweep`,`combination`,`crossfire`,`persistent`,`rising`,`arc`,`foresight`,`outcome`,`skip`,`slide`,`flight`,`revert`,`origin`,`line`,`orbit`,`adapt`,`dodge`,`devour`,`domain`,`rune`,`disarm`,`soul`,`path`,`ally`,`split`,`scythe`,`steal`]);

// Every row is authored against one displayed move, in the same order as its source profile.
// Tuple: [move name, visual contract, acquisition, resolution, aftermath, optional overrides].
const RIFT_V311_PROFILE_SPECS=Object.freeze({
 [`Stand Manifestation`]:[
  [`Stand Focus`,`self-command`,`Self`,`Open the linked Stand technique set`,`No battlefield contact`],
  [`Stand Guard`,`self-guard`,`Self`,`Route defense through the linked Stand`,`Guard state only`],
  [`Stand Command`,`self-command`,`Self`,`Issue the selected Stand command`,`Command resolves through the chosen Stand move`],
  [`Stand Covenant`,`self-command`,`Self`,`Release the linked Stand Ultimate`,`Ultimate behavior comes from the active Stand`,{rangeText:`SELF`,radiusText:`COMMAND`}],
 ],
 [`Super Strength`]:[
  [`Wind Up`,`self-charge`,`Self`,`Store one Wind Up stack`,`Next attack is empowered · three stacks break Guard`],
  [`Crush`,`self-slam`,`Ground at the caster`,`Drive force into the ground`,`Close impact and structural damage`,{anchor:`self`}],
  [`Barrage`,`area-barrage`,`Ground point within 38m`,`Ten hits occupy a 7m-radius area`,`Each hit can trigger on-hit effects`],
  [`Great Power`,`area-impact`,`Ground point within 38m`,`One immense punch fills a 9.8m-radius impact`,`Guard Break`],
 ],
 [`Aura Accumulation`]:[
  [`Bone Breaker`,`dash-strike-wave`,`Aim line up to 13m`,`Lunge into the target`,`Pressure wave continues through the space behind`],
  [`Smart Counter`,`self-counter`,`Self`,`Counter the next AS-dominant attack`,`Failure costs half next-turn Movement`],
  [`Bone Breaker Rapid`,`area-barrage`,`Ground point within 38m`,`Twelve hits occupy a 7.2m-radius area`,`No item-proc triggers`],
  [`Super Duper Bone Breaker`,`melee-cone`,`Target within 11.5m`,`Close punch Cripples the target`,`15m widening pressure cone continues beyond`],
 ],
 [`Speedster`]:[
  [`Velocity Shift`,`self-movement`,`Self`,`Restore Movement as a bonus action`,`Sharpen the next approach`],
  [`Speedmirage`,`melee-strike-field`,`Nearby target`,`Fast strike raises miss chance`,`May form a tornado around the contact point`],
  [`Phase`,`melee-pierce`,`Nearby target`,`Vibrate through the body and strike the heart`,`Defense is ignored`],
  [`Time Portal`,`time-rewind`,`Third-most-recent Ultimate snapshot`,`Restore the complete recorded combat state`,`Permanent rewards remain outside the rewind`,{targetKind:`none`,anchor:`self`,rangeText:`TIMELINE`,radiusText:`FULL STATE`}],
 ],
 [`Pyrokinesis`]:[
  [`Fireball`,`projectile-field`,`Aim line up to 38m`,`Projectile hits in a 3.1m contact radius`,`Burning Ground persists for 3 turns`],
  [`Flame Pillar`,`area-delayed-field`,`Chosen burning area`,`Mark, Burn, and damage occupants`,`Pillar detonates after 1 owner turn`],
  [`Combustion`,`global-target-burst`,`Every enemy carrying Burn`,`Consume each target's Burn stacks`,`Targets without Burn are untouched`],
  [`Flame Tornado`,`global-moving-field`,`Battlefield`,`Create a moving burning hurricane`,`Persists for 5 owner turns · Ultimate remains locked`],
 ],
 [`Cryokinesis`]:[
  [`Ice Shard`,`projectile-wall`,`Aim line to one target`,`Shard applies Chill`,`A Chilled target becomes a destructible Ice Block`],
  [`Ice Barrier`,`wall-point`,`Any legal point within 24m`,`Raise a 3.4m AP-scaled ice wall`,`Cannot occupy an enemy position`],
  [`Blizzard`,`area-field`,`Ground point within 28m`,`Create a 12m-radius snow field`,`3 turns · halves Movement · damages everyone except caster`],
  [`Ice Age`,`global-field`,`Every other combatant`,`Freeze the entire battlefield`,`Damage, Stun, and Chill allies and enemies alike`],
 ],
 [`Electrokinesis`]:[
  [`Lightning Bolt`,`projectile`,`Aim line up to 52m`,`Fast accurate bolt contacts one target`,`Chance to Stun`],
  [`Arc Current`,`projectile-multi`,`One target within 42.9m`,`Three electric contacts in a 4.4m spread`,`Builds Static rapidly`],
  [`Overload`,`projectile`,`One target within 42.9m`,`Consume Static at contact`,`Jams the enemy weapon`],
  [`Thunder God`,`falling-strike`,`Chosen target within 42.9m`,`Thunder descends vertically onto the target`,`Stun and Guard Break`],
 ],
 [`Aerokinesis`]:[
  [`Air Cannon`,`projectile-wave`,`Aim line up to 47m`,`Compressed-air front impacts the target`,`Punishing knockback`],
  [`Tailwind`,`self-movement`,`Self`,`Wrap the caster in a following wind`,`Temporary Speed and dodge increase`],
  [`Vacuum Sphere`,`projectile-field`,`One target within 42.9m`,`Remove air in a 2.8m sphere around the target`,`Accuracy is reduced`],
  [`Worldstorm`,`area-barrage`,`Ground point within 42.9m`,`Five storm hits occupy a 4.4m-radius area`,`Colossal structural destruction`],
 ],
 [`Earthshaping`]:[
  [`Stone Fist`,`melee-strike`,`Nearby target`,`Slow armored punch`,`Heavy impact`],
  [`Earthen Bulwark`,`self-wall`,`Self`,`Raise a destructible barrier around the caster`,`Barrier persists until broken`],
  [`Fault Line`,`target-fracture`,`Ground beneath one target within 42.9m`,`Split the floor under the target`,`Grounded target may be Stunned`],
  [`Continental Rupture`,`global-wave`,`Battlefield ground through the selected target`,`Ruptures propagate from below`,`Guard Break and severe terrain destruction`],
 ],
 [`Hydrokinesis`]:[
  [`Pressure Jet`,`beam`,`Aim line to one target within 42.9m`,`Focused water stream contacts continuously`,`Partially pierces Guard`],
  [`Healing Current`,`self-heal`,`Self`,`Living water restores HP`,`No hostile footprint`],
  [`Crushing Tide`,`projectile-wave`,`One target within 42.9m`,`A moving tide engulfs the target`,`Accuracy is reduced`],
  [`Primordial Ocean`,`global-field`,`Every grounded combatant`,`Flood the battlefield`,`Non-flying enemies drown`],
 ],
 [`Telekinesis`]:[
  [`Force Throw`,`target-movement`,`One target within 42.9m`,`Weaponize and hurl the target's mass`,`Forced displacement`],
  [`Psychic Grip`,`tether`,`One target within 42.9m`,`Hold the target with a psychic tether`,`Restrains and reduces dodge`],
  [`Object Storm`,`projectile-multi`,`One target within 42.9m`,`Six debris projectiles converge in a 4.4m spread`,`Environmental objects become ammunition`],
  [`Telekinetic Compression`,`target-compress`,`One target within 42.9m`,`Force closes from every direction`,`Guard is partially pierced`],
 ],
 [`Shadow Manipulation`]:[
  [`Shadow Step`,`self-stealth`,`Self`,`Vanish into shadow`,`Next attack is empowered and guided`],
  [`Umbral Blades`,`projectile-slash-multi`,`One target within 42.9m`,`Three shadow slashes converge`,`High critical chance`],
  [`Lightless Domain`,`target-field`,`One target within 42.9m`,`Enclose the target in supernatural darkness`,`Target is Blinded`],
  [`Shadow Burial`,`target-sink`,`One target within 42.9m`,`Drag the target beneath a shadow boundary`,`Healing is suppressed`],
 ],
 [`Light Manipulation`]:[
  [`Light Ray`,`beam`,`Aim line up to 53.9m`,`Narrow light beam pierces the target`,`Extremely accurate · partial Guard pierce`],
  [`Hard-Light Shield`,`self-portal-guard`,`Self`,`Create a hard-light shell`,`Reflects magical damage`],
  [`Solar Flash`,`projectile-burst`,`One target within 42.9m`,`Light detonates at the target`,`Blind for 1 turn`],
  [`Heaven’s Lance`,`falling-strike`,`One target within 42.9m`,`Holy column descends vertically`,`Spirit-slaying Guard Break`],
 ],
 [`Biomancy`]:[
  [`Flesh Mend`,`self-heal`,`Self`,`Regrow damaged tissue`,`Restore HP`],
  [`Nerve Strike`,`projectile`,`One target within 42.9m`,`Biological disruption contacts the target`,`Combat Skill is reduced`],
  [`Forced Mutation`,`self-transform`,`Self`,`Apply a situational mutation`,`Delayed recoil follows the temporary boost`],
  [`Perfect Organism`,`self-heal-transform`,`Self`,`Fully heal and cleanse`,`Adapt to the next damage type`],
 ],
 [`Decay`]:[
  [`Destruction`,`projectile-field`,`Aim point within 42.9m`,`Decay contacts the surroundings`,`Spreads through terrain with extreme structural damage`],
  [`Forceful Decay`,`projectile-mark`,`Enemy weapon within 42.9m`,`Decay disables the weapon for 2 turns`,`Critical contact destroys it permanently`],
  [`Hatred`,`tether`,`One target within 42.9m`,`Seize the target in a decaying hold`,`Continuous irreparable damage and anti-heal`],
  [`Let it all be destroyed.`,`global-wave-field`,`Ground at the caster`,`Unavoidable decay wave crosses the battlefield`,`Terrain advances directly through City ruin`],
 ],
 [`Gravity Manipulation`]:[
  [`Gravity Well`,`area-field`,`Ground point within 42m`,`Create an 8.5m gravity well`,`Pull, slow, and crush occupants`],
  [`Repulsion`,`cone-wave`,`Forward cone up to 31m`,`Repulsive front fills a 6.4m half-width`,`Knockback and prepared-action disruption`],
  [`Gravity Crush`,`target-compress`,`One target within 42.9m`,`Gravity closes around the target`,`Punishes high Durability and crushes Movement`],
  [`Event Horizon`,`area-field`,`Ground point within 48m`,`Create a 10m black-hole field`,`Pulls occupants and disables Flight`],
 ],
 [`Spatial Manipulation`]:[
  [`Rift Cut`,`line-slash`,`Aim line up to 46m`,`2.5m-wide cut travels through space`,`Partially ignores Durability`],
  [`Displacement`,`self-teleport-guard`,`Self`,`Shift out of the next attack's path`,`Temporary dodge state`],
  [`Redirecting Portal`,`self-portal-guard`,`Self`,`Place a portal across the next incoming path`,`Returns part of the attack to its source`],
  [`Dimensional Severance`,`line-slash`,`Aim line up to 72m`,`3.8m-wide severance separates the target from space`,`Pierces conventional defense`],
 ],
 [`Soul Manipulation`]:[
  [`Spirit Rend`,`projectile-slash`,`One target within 42.9m`,`Ethereal cut contacts the soul`,`Regeneration is suppressed`],
  [`Soul Chain`,`tether`,`One target within 42.9m`,`Bind body and soul with a chain`,`Restrains and reduces healing`],
  [`Essence Drain`,`tether-drain`,`One target within 42.9m`,`Pull essence back to the caster`,`Damage returns as Energy`],
  [`Soul Exile`,`target-extract`,`One target within 54m`,`Tear the soul away from its vessel`,`Death-piercing contact`],
 ],
 [`Chronostasis`]:[
  [`Delay Wound`,`target-mark-delayed`,`One enemy anywhere on the battlefield`,`Place a causal wound marker`,`Detonates after the enemy's next action`],
  [`Stolen Moment`,`target-debuff`,`One target within 42.9m`,`Steal temporal momentum`,`Speed and accuracy are reduced`],
  [`Time Lock`,`target-lock`,`One target within 42.9m`,`Seal one random move in time`,`Lock lasts 1 turn`],
  [`Stopped World`,`time-freeze`,`Self and surrounding timeline`,`Take another action while time is stopped`,`Ordinary time resumes afterward`,{targetKind:`none`,anchor:`self`,rangeText:`TIMELINE`,radiusText:`TIME STATE`}],
 ],
 [`Fate Manipulation`]:[
  [`Misfortune`,`target-curse`,`One enemy anywhere on the battlefield`,`Damage and curse the next chance roll`,`Curse waits for the next valid roll`],
  [`Chosen Outcome`,`self-guarantee`,`Self`,`Fix the next applicable hit result`,`Next accuracy roll is guaranteed`],
  [`Severed Possibility`,`target-dispel`,`One enemy anywhere on the battlefield`,`Remove one buff`,`Erased possibility becomes damage`],
  [`Inevitable End`,`target-mark-delayed`,`One enemy anywhere on the battlefield`,`Mark the target's ending`,`Fate detonates after 3 turns`],
 ],
 [`Concept Erasure`]:[
  [`Erase Distance`,`teleport-strike`,`One target within 42.9m`,`Delete the gap and connect instantly`,`Unavoidable contact`],
  [`Erase Defense`,`target-debuff`,`One target within 42.9m`,`Delete part of the target's defense`,`Defense remains reduced temporarily`],
  [`Erase Motion`,`target-lock`,`One target within 42.9m`,`Delete movement and reaction options`,`Dodges, counters, and movement reactions are suppressed`],
  [`Erase Being`,`global-target`,`One enemy anywhere on the battlefield`,`Attempt conceptual deletion`,`Result depends on relative AP and resistance`],
 ],
 [`Reactive Evolution`]:[
  [`Adaptive Strike`,`melee-strike`,`Nearby target`,`Strike with the currently optimal damage type`,`Damage type adapts at resolution`],
  [`Survival Mutation`,`self-transform`,`Self`,`Develop a counter to the last harmful effect`,`New adaptation persists by authored rules`],
  [`Predatory Growth`,`melee-strike-drain`,`Nearby target`,`Strike and sample the target`,`Temporarily echo their best stat`],
  [`Apex Form`,`self-transform`,`Self`,`Preserve adaptations and enter Apex Form`,`Core stats are greatly enhanced`],
 ],
 [`Cosmic Dominion`]:[
  [`Starfall`,`falling-area`,`One target within 42.9m`,`A condensed star falls onto the target`,`Burn at the impact point`],
  [`Cosmic Expansion`,`target-field`,`One target within 42.9m`,`Stretch space around the target`,`Accuracy is reduced`],
  [`Galactic Collapse`,`area-field`,`Ground point within 48m`,`Collapse matter into a 10m area`,`Targets are drawn inward`],
  [`End of All Things`,`global-burst`,`Battlefield and chosen enemy`,`Catastrophic cosmic impact`,`Massive environment-stage advance`],
 ],
 [`Sonokinesis`]:[
  [`Resonant Shot`,`projectile-pierce`,`One target within 42.9m`,`Condensed note pierces the target`,`Builds Resonance and breaks Posture`],
  [`Dead Air`,`target-field`,`One target within 42.9m`,`Erase sound around the target`,`Special moves are Silenced for the next action`],
  [`Harmonic Aegis`,`self-guard`,`Self`,`Tune a reactive shield`,`Widens the next Perfect Guard window`],
  [`World Symphony`,`area-barrage`,`Ground point within 42.9m`,`Multi-hit sonic crescendo fills a 4.4m area`,`Consumes Resonance and shatters Guard`],
 ],
 [`Alchemy`]:[
  [`Combat Transmutation`,`melee-strike`,`Nearby target`,`Strike with the best available damage type`,`Harvest one Reagent`],
  [`Panacea Draft`,`self-heal`,`Self`,`Drink the transmuted draft`,`Heal, cleanse one effect, and harvest a Reagent`],
  [`Volatile Homunculus`,`area-summon-barrage`,`Ground point within 38m`,`Three-hit construct occupies a 7.5m area`,`Hits may Burn, Chill, or Shock`],
  [`Philosopher’s Sun`,`projectile-impact-self-heal-guard`,`One target within 42.9m`,`Golden star impacts the target`,`Consumed Reagents also heal and shield the caster`,{secondaryAtSelf:true}],
 ],
 [`Blood Sorcery`]:[
  [`Blood Lance`,`projectile-pierce`,`One target within 42.9m`,`Crimson spear pierces accurately`,`Bleed and healing denial · paid with HP`],
  [`Sanguine Thread`,`tether-drain`,`One target within 42.9m`,`Bind the target's wounds to the caster`,`Damage heals the caster and deepens Bleed`],
  [`Hemorrhage`,`target-burst`,`Bleeding target within 42.9m`,`Collapse every Bleed stack at once`,`More existing Bleed creates a larger rupture`],
  [`Scarlet Eclipse`,`wave-target-heal`,`One enemy within 42.9m`,`Unavoidable blood tide hits the target`,`Damage restores the caster's body`,{secondaryAtSelf:true}],
 ],
 [`Ferrokinetics`]:[
  [`Magnetic Draw`,`target-disarm`,`Enemy weapon within 42.9m`,`Pull the weapon off-line`,`Weapon is disabled for one action`],
  [`Living Armor`,`self-orbit-guard`,`Self`,`Orbit stored metal around the caster`,`Gain Shield and restore Posture from Alloy`],
  [`Rail Crown`,`beam-barrage`,`Aim line up to 53.9m`,`Hyper-accurate metal-shard stream`,`Alloy adds extra hits`],
  [`Iron Tempest`,`global-barrage`,`Entire battlefield`,`Magnetize weapons, armor, and structures`,`Arena-wide storm and Guard Break`],
 ],
 [`Runeweaving`]:[
  [`Inscribe`,`self-rune`,`Self`,`Write one living Rune as a bonus action`,`Stores up to 5 without ending the turn`],
  [`Ward Script`,`self-guard`,`Self`,`Consume up to 2 Runes for a ward`,`Shield plus resistance to the next harmful status`],
  [`Detonation Glyph`,`target-burst`,`Ground beneath one target within 42.9m`,`Detonate every stored Rune`,`Each Rune increases damage and destruction`],
  [`World Formula`,`global-domain`,`Entire battlefield`,`Rewrite the arena as one spell circle`,`Runes amplify damage and force a World Break`],
 ],
 [`Beast Pact`]:[
  [`Pack Mark`,`target-mark`,`One target within 42.9m`,`Mark the prey`,`Future hits reveal intel and build Hunt faster`],
  [`Predator’s Leap`,`dash-strike`,`Nearby target`,`Pounce into a physical maul`,`Speed scales damage and Posture pressure`],
  [`Borrowed Fang`,`melee-adapt`,`Nearby target`,`Strike using the best answering beast aspect`,`Adapts to the last damage type suffered`],
  [`The Wild Hunt`,`cone-summon`,`Prey inside a 23.2m cone`,`Ancestral pack converges on the target`,`Hunt stacks become extra attackers`],
 ],
 [`Dream Dominion`]:[
  [`Nightmare Seed`,`target-mark`,`One target within 42.9m`,`Plant a Dream Mark`,`Mark damages the target whenever they miss`],
  [`Lucid Step`,`self-dodge`,`Self`,`Enter a lucid state as a bonus action`,`Dodge is greatly raised until the next move`],
  [`Sleep Paralysis`,`target-lock`,`Marked target within 42.9m`,`Crush the mind between waking and sleep`,`More Dream Marks raise Stun chance`],
  [`Waking End`,`target-burst`,`Marked target within 42.9m`,`End every stored nightmare at once`,`Consumes marks for true damage and disorientation`],
 ],
 [`Void Hunger`]:[
  [`Null Bite`,`tether-drain`,`One target within 42.9m`,`Bite Energy out of the target`,`Stolen Energy becomes Hunger`],
  [`Devour Technique`,`target-drain`,`One target within 42.9m`,`Consume part of the target's Ultimate charge`,`Silences Special moves`],
  [`Empty Throne`,`self-guard`,`Self`,`Turn Hunger inward`,`Create a void shield and cleanse one debuff`],
  [`Eventide Maw`,`global-devour`,`Entire battlefield`,`Open a battlefield-sized absence`,`Hunger becomes true damage and catastrophic ruin`],
 ],
 [`Shrine`]:[
  [`Dismantle`,`line-slash`,`Invisible aim line up to 52m`,`One cursed slash crosses the line`,`Extreme environmental destruction`],
  [`Cleave`,`melee-slash-barrage`,`Nearby target`,`Read the target, then cut repeatedly`,`Adaptive pierce uses normal hit and critical rules`],
  [`Divine Furnace`,`projectile-area`,`Aim line up to 92m`,`Charged flaming arrow impacts an 8.2m area`,`Burn, Guard Break, and enormous terrain loss`],
  [`Malevolent Shrine`,`global-domain`,`Caster-centered battlefield domain`,`Manifest a destructible altar and eight local slashes`,`Ends immediately if the altar is destroyed`],
 ],
 [`Cursed Child`]:[
  [`Reversed Cursed Technique`,`projectile-heal`,`Self, ally, or cursed enemy within 30m`,`Positive energy reconstructs the selected target`,`Heals living allies · damages undead and spirits`],
  [`Swordsmanship`,`self-counter`,`Self`,`Catch the next direct strike or projectile`,`Counterattack follows the incoming line`],
  [`Mimicry`,`self-command`,`Self`,`Open the copied-technique arsenal`,`Chosen copied move supplies its own footprint`],
  [`Authentic Mutual Love`,`domain`,`26m around the caster`,`Close a barrier and choose the recurring sure-hit`,`10 owner turns · random copied-technique katana each turn`],
 ],
 [`Rika Manifestation`]:[
  [`Rending Claw`,`melee-strike`,`Nearest target`,`Rika tears through the target`,`Guard Break`],
  [`Bite`,`melee-strike-copy`,`Target within 4.8m`,`Rika mauls the target`,`Critical or killing Bite copies an offensive technique`],
  [`Protect`,`self-guard`,`Rika's user`,`Rika wraps around the user`,`Thick cursed shield`],
  [`Pure Love`,`beam`,`Aim line up to 42.9m`,`Catastrophic cursed beam contacts the target`,`Full Manifestation ends after firing`],
 ],
 [`Ki Warrior`]:[
  [`Ki Blast`,`projectile`,`Aim line up to 58m`,`Fast concentrated Ki bolt`,`Accurate and cannot be conventionally countered`],
  [`Instant Transmission`,`teleport`,`Self`,`Vanish beyond perception`,`Massive dodge increase until next turn`],
  [`Kamehameha!`,`beam`,`Aim line up to 105m`,`Sustained 3.8m-wide Ki beam`,`Drains Energy and tears through terrain`],
  [`Transform`,`self-transform`,`Self`,`Ascend one authored transformation stage`,`Unclashable transformation state`],
 ],
 [`Limitless`]:[
  [`Blue`,`area-field`,`Aim point within 34m`,`Create a 4.8m attractive singularity`,`Pulls targets and can cause terrain collisions`],
  [`Red`,`beam-wave`,`Aim line up to 68m`,`3.5m repulsive beam shatters Guard`,`Pushes away from the beam path`],
  [`Purple`,`beam`,`Aim line up to 118m`,`4.4m true-damage beam erases through the lane`,`Requires separate 100% Hollow charge`],
  [`Infinite Void`,`domain`,`24m around the caster`,`Flood enclosed targets with endless information`,`3-turn Stun, then 4-turn Special burnout`],
 ],
 [`Spiral Being`]:[
  [`Evolve`,`self-convert`,`Self`,`Convert all Spiral Energy into Stat XP`,`XP favors stats where the enemy is ahead`],
  [`Refuse`,`self-heal`,`Self`,`Spend 25% of current Spiral Energy`,`Heal scales with spend and cleanses all harmful statuses`],
  [`Probability Manipulation`,`self-guarantee`,`Self`,`Fix the next offensive outcome as a critical hit`,`Bonus action · boosted non-Ultimate builds Ultimate`],
  [`Giga Drill Break`,`line-drill`,`Aim line up to 42.9m`,`Absolute drill travels down the 2.8m lane`,`Ignores defenses and death-prevention on contact`],
 ],
 [`Anti-Spiral`]:[
  [`Despair`,`target-debuff`,`One target within 13m`,`Impose existential collapse`,`Temporarily lowers every stat tier`],
  [`Imitate`,`target-copy`,`Opponent's last move`,`Replay an energy-free facsimile`,`Primes the next Despair`],
  [`Reform`,`self-heal`,`Self`,`Reassemble from abstract information`,`Restore HP and cleanse every harmful effect`],
  [`Infinity Big Bang Storm`,`global-burst`,`Entire battlefield and chosen enemy`,`Detonate a newborn universe`,`Survivor absorbs the blast and refills Energy`],
 ],
 [`One For All`]:[
  [`Fa Jin`,`self-charge`,`Self`,`Store kinetic motion in the Fa Jin bar`,`At 100%, empower the next offense with possible recoil`],
  [`Blackwhip`,`tether`,`Enemy or solid terrain within 34m`,`Bind an enemy or grapple to terrain`,`Enemy loses one turn · next physical hit crits`],
  [`Gearshift`,`self-charge`,`Self`,`Add one temporary Speed tier as a bonus action`,`All stacks return later as recoil`],
  [`Faux 100%`,`dash-strike`,`Aim line up to 48m`,`Unguardable high-speed line impact`,`Consumes Gearshift, Fa Jin, and at least 80% Energy`],
 ],
 [`One For All Prime`]:[
  [`Detroit Smash`,`melee-cone`,`Target within 7.4m`,`Close punch strikes the target`,`8.5m pressure wave damages enemies behind`],
  [`Delaware Smash`,`projectile-wave`,`Aim line up to 72m`,`Precise compressed-air shockwave`,`Bonus action · up to 3 shots in one turn`],
  [`Wyoming Smash`,`teleport-falling-area`,`Chosen landing point within 56m`,`Leap and hammer a 10.5m impact crater`,`Movement is not spent`],
  [`United States of Smash`,`melee-cone-field`,`Critical-wound target within 8.2m`,`Final punch fills a 15.5m pressure cone`,`Roaming tornado persists until combat ends`],
 ],
 [`Projection Sorcery`]:[
  [`Projection`,`teleport-strike`,`Chosen point within 42m`,`Traverse the framed route without Movement cost`,`Colliding with a framed opponent shatters the frame`],
  [`Air Crash`,`line-trap`,`Straight line up to 40m`,`Place 24 glass frames across a 5.2m lane`,`Striking one panel collapses the whole sequence`],
  [`Projection Barrage`,`melee-orbit-barrage`,`Framed target within 6.2m`,`Orbit and strike from every angle`,`Cannot be countered`],
  [`Time Cell Moon Palace`,`domain`,`23m around the caster`,`Close an 8-turn barrier domain`,`Movement-bearing actions cut non-owners at cellular level`],
 ],
 [`Bomb Hybrid`]:[
  [`Nobel`,`area-trap`,`Chosen region within 64m`,`Scatter concealed dynamite through a 15m radius`,`Detonates at the beginning of the next owner turn`],
  [`William Mills`,`cone-explosions`,`Forward cone up to 62m`,`Sequential blasts fill a 14m half-width`,`Crosses fighters, cover, and structures`],
  [`Parker Parrot`,`teleport-falling-area`,`Chosen landing point within 72m`,`Explosion-launch into a 13m impact blast`,`Guard Break`],
  [`Oppenheimer`,`self-area-field`,`Caster as ground zero`,`24m nuclear detonation centered on self`,`Persistent Radiation Field`],
 ],
 [`Chainsaw Hybrid`]:[
  [`RAGHHHH`,`dash-spin`,`Aim line up to 48m`,`Chainsaw tornado tears through a 5.5m lane`,`Cuts every fighter and structure crossed`],
  [`SPEEDBLITZ`,`dash-cut`,`Aim line up to 66m`,`Blink through a 3.8m cutting lane`,`Slower targets are cut on traversal`],
  [`Pierce`,`melee-pierce`,`Target within 6.2m`,`Drive the chainsaw through the target`,`Severe Bleeding and Guard Break`],
  [`I WANT TO HAVE S**`,`area-dash-barrage`,`Marked 18m-radius area within 54m`,`Blitz throughout the area and strike everything`,`Conventional Speed dodging is bypassed`],
 ],
 [`True Chainsaw Man`]:[
  [`RAGHHHH`,`dash-spin`,`Aim line up to 48m`,`Black-armored chainsaw tornado fills a 5.5m lane`,`Expanded impact and environmental ruin`],
  [`SPEEDBLITZ`,`dash-cut`,`Aim line up to 66m`,`Disappear through a 3.8m cutting lane`,`No-reaction traversal leaves slower bodies divided`],
  [`Pierce`,`melee-pierce`,`Target within 6.2m`,`Impale and continue cutting`,`Severe Bleeding and Guard Break`],
  [`Forget`,`area-dash-barrage`,`Marked 18m-radius area within 54m`,`Erase distance and assault everything inside`,`Killed target may be eaten and conceptually erased`],
 ],
 [`War Devil Hybrid`]:[
  [`Bang`,`projectile`,`Aim line up to 82m`,`Invisible force round crosses a 3.8m lane`,`Guard Break, Bleed, and building-level impact`],
  [`Ratatata!`,`line-barrage`,`Aim lane up to 76m`,`Fourteen invisible rounds fill a 5.2m corridor`,`Builds Bleed and shreds structures`],
  [`City Sword`,`line-sweep`,`Aim line up to 104m`,`10.5m-wide city-sized sword stroke`,`Extreme ruin and long recovery`],
  [`I LOVE AMERICA!`,`falling-area-field`,`Chosen point within 124m`,`Nuclear strike fills a 22m radius`,`Persistent radioactive field`],
 ],
 [`All For One`]:[
  [`Air Cannon`,`projectile-wave`,`Aim line up to 47m`,`Compressed stolen-force blast`,`Accurate knockback`],
  [`Rivet Stab`,`projectile-multi-tether`,`One target within 32m`,`Three black rivets pierce and bind`,`Restrains and partially pierces defense`],
  [`Impact Reversal`,`self-guard`,`Self`,`Layer a kinetic shield`,`Returns the next attack`],
  [`All For Me`,`target-steal`,`Opponent below 30% HP within 13m`,`Steal the target's Special Power`,`Factor persists in storage for the run`],
 ],
 [`Symbol of Fear`]:[
  [`All For One`,`self-command`,`Self`,`Open the stolen-factor archive`,`Chosen stored base move supplies its own footprint`],
  [`Awakened Decay`,`global-wave-field`,`Ground at the caster`,`City-consuming decay wave crosses the battlefield`,`Consumes every point of Energy`],
  [`Immense Regeneration`,`self-heal`,`Self`,`Restore a large portion of HP immediately`,`Aggressive regeneration persists for 3 turns`],
  [`Omni-Factor Unleash`,`global-combination`,`Selected opponents and battlefield`,`Combine chosen stored offensive Ultimates`,`Each added factor changes cost, accuracy, and destruction`],
 ],
 [`Human of Sparta`]:[
  [`Backflip`,`teleport-crossfire`,`Backward destination within 14m`,`Arc over the crossed lane`,`May fire through a crossed hostile`],
  [`Let's Rock!`,`projectile-persistent`,`Aim line from the current weapon`,`Throw the weapon into the battlefield`,`Weapon remains until physically recovered`],
  [`Over Here!`,`self-area-barrage`,`10m around the caster`,`Five weapon blitzes fill the close area`,`Hits everything in the 18m reach envelope`],
  [`Devil Trigger`,`self-transform`,`Self`,`Assume the crimson winged devil form`,`Persists for 4 owner turns`],
 ],
 [`Devil of Sparta`]:[
  [`Air Combo`,`melee-rising-barrage`,`Target within 6m`,`Three-hit rising weapon sequence`,`Sequence adapts to the active Devil Arm`],
  [`Heavy Swing`,`melee-arc`,`Forward 9m weapon arc`,`Committed Devil Arm sweep`,`Arc width and variant follow the equipped arm`],
  [`Blitz`,`dash-cut`,`15m lane`,`Cross the lane in a weapon-led burst`,`Cuts along the 2.8m corridor`],
  [`Devil Trigger`,`self-transform`,`Self`,`Assume the violet winged devil form`,`Persists for 6 owner turns`],
 ],
 [`Star Platinum`]:[
  [`Quick Jab`,`melee-strike`,`Nearest enemy within 5.8m`,`Partial Stand fist appears, strikes, and vanishes`,`Precision strike`],
  [`Heavy Guard`,`self-guard`,`Stand user`,`Star Platinum receives incoming force`,`Stand absorbs Posture damage for one exchange`],
  [`Stand Jump`,`teleport`,`Chosen destination within 83.1m`,`Stand launches the user through the route`,`No Movement Points spent`],
  [`Left Hook`,`melee-strike`,`Target within 6.2m`,`Heavy precision hook`,`May inflict Bleed, Brain Damage, or Crippled`],
  [`Launch`,`projectile`,`Physical object and target within 54m`,`Throw the selected object as a real projectile`,`Force reflects object size and integrity`],
  [`Star Finger`,`melee-pierce`,`Target within 12m`,`Extended fingers pierce along a 2.2m line`,`Precision contact`],
  [`7-Page Ora`,`melee-barrage`,`Seized target within 6.4m`,`Twenty-eight hits over a 3-turn beatdown`,`Stun, Guard Break, then enormous Knockback`],
  [`Quick Stop`,`teleport-strike`,`Destination within 83.1m and nearby enemy`,`Relocate through stopped time, then jab`,`Up to 3× Movement reserve`],
  [`ORA ORA ORA!`,`melee-barrage`,`Target within 6.4m`,`Sixteen precise rush hits`,`May inflict Left Hook injuries`],
  [`Za Warudo!`,`time-freeze`,`Entire battlefield timeline`,`Stop causality for 1 turn`,`After 5 uses, matures to 3 turns for the run`,{targetKind:`many`,anchor:`self`,visualRange:120,visualRadius:64,rangeText:`BATTLEFIELD`,radiusText:`TIME STATE`}],
 ],
 [`The World`]:[
  [`Quick Stop`,`teleport-strike`,`Destination within 83.1m and nearby enemy`,`Relocate through stopped time, then jab`,`Precision contact`],
  [`Heavy Guard`,`self-guard`,`Stand user`,`The World receives incoming force`,`Stand absorbs Posture damage for one exchange`],
  [`Stand Jump`,`teleport`,`Chosen destination within 83.1m`,`The World launches its user`,`No Movement Points spent`],
  [`Knives`,`projectile-multi`,`Target within 48m`,`Three knives travel in a triangular spread`,`Knives freeze in place during stopped time`],
  [`ROADO ROLLAR DAA!`,`falling-area-trap`,`Chosen area within 68m`,`Road roller crashes into an 11m radius`,`Roller remains as a destructible trap`],
  [`MUDA MUDA MUDA!`,`melee-barrage`,`Target within 6.5m`,`Fourteen heavy Stand-rush hits`,`No reaction window`],
  [`Za Warudo!`,`time-freeze`,`Entire battlefield timeline`,`Stop ordinary causality for 3 turns`,`The World's strikes strengthen while time is frozen`,{targetKind:`many`,anchor:`self`,visualRange:120,visualRadius:64,rangeText:`BATTLEFIELD`,radiusText:`TIME STATE`}],
 ],
 [`King Crimson`]:[
  [`Time Erasure`,`time-skip`,`Chosen destination within 83.1m`,`Reposition through missing frames`,`Broken afterimages replace ordinary travel`],
  [`Crashout`,`self-area-barrage`,`9m around the user`,`Two partial Stand arms smash the close area`,`Breakable terrain is also struck`],
  [`Epitaph`,`time-foresight`,`Opponent's next 3 turns`,`Reveal actions, routes, and future positions`,`Future becomes fixed once seen`],
  [`21st Century Schizoid Man`,`melee-pierce`,`Target within 6.2m`,`Abrupt chest-piercing strike`,`Bleeding · no reaction window`],
  [`Mirrors`,`time-outcome`,`Next incoming attack`,`Fix a permanent 50/50 result`,`Outcome is dodge or failed dodge`],
  [`Moonchild`,`projectile`,`Nearby opponent within 17m`,`Throw previously shed blood into their eyes`,`Blind`],
  [`A Man, A City`,`time-skip`,`Next 3 enemy turns`,`Erase the user's interaction while determined events play`,`User may only reposition until normal time returns`,{targetKind:`many`,anchor:`self`,visualRange:120,rangeText:`3 ENEMY TURNS`,radiusText:`TIMELINE`}],
 ],
 [`Soft & Wet`]:[
  [`Shovel`,`melee-strike`,`Target within 5.8m`,`Hit the target with the handed-over shovel`,`No hidden secondary footprint`],
  [`No-Friction`,`self-slide`,`Self and traveled ground`,`Remove ground friction for 1 turn`,`Movement becomes 1.5× sliding momentum`],
  [`ORA!`,`melee-strike-mark`,`Target within 6m`,`Quick close Stand strike`,`Removes one valid Aspect for 1 turn`],
  [`Plunder`,`projectile-mark`,`Target within 50m`,`Weak physical bubble steals one Aspect`,`Property returns after bubble destruction or 3 turns`],
  [`Explosive Bubbles`,`area-trap`,`Chosen area within 46m`,`Seed contact mines through an 8.5m radius`,`Mines persist until crossed and detonated`],
  [`Lift`,`self-flight-guard`,`Self`,`Raise the user into Flight inside a bubble`,`First ordinary hit destroys bubble instead of dealing damage`],
  [`Go Beyond`,`global-projectile`,`Tagged location or enemy anywhere on the battlefield`,`Non-existent spinning bubble crosses all conventional barriers`,`Wildly inaccurate without a tagged location`],
 ],
 [`Gold Experience`]:[
  [`Frog`,`self-summon-guard`,`Beside the Stand user`,`Create one visible frog`,`For one enemy exchange, protected-user damage reflects through it`],
  [`Heal`,`projectile-heal`,`Self or ally within 25m`,`Generated tissue reconstructs the target`,`Strong heal followed by 1 lost turn from pain`],
  [`Quick Muda`,`melee-strike-summon`,`Target within 13m`,`Gold Experience flashes in and punches`,`Stand remains manifested · hit marks target for Scorpions`],
  [`Muda Barrage`,`area-barrage-guard`,`Target or empty 8m-radius area within 38m`,`Fourteen-hit rush attacks a target`,`Empty aim creates a 1-turn projectile interception rush`],
  [`Scorpions`,`summon-path`,`Target previously hit by Quick Muda within 25m`,`Generate 3 physical Scorpions`,`They path to the mark and apply Poison`],
  [`Life Form`,`summon-ally`,`Destroyed object or corpse within 25m`,`Transform it into one random living ally`,`Ally fights for 3 turns and reflects half incoming damage`],
  [`Delay Punch`,`melee-soul-split`,`Target within 13m`,`Punch consciousness out of sync with the body`,`Soul can only move back until recombination`],
 ],
 [`Gold Experience Requiem`]:[
  [`Lifebeam`,`beam-summon`,`Aim line up to 53.9m`,`Penetrating life-force lance wounds the target`,`Wound births 3 Scorpions that pursue immediately`],
  [`Heal`,`global-heal`,`Self or ally anywhere on the battlefield`,`Perfect life reconstruction`,`No agony-stun`],
  [`Quick Muda`,`melee-strike-summon`,`Target within 13m`,`GER manifests and lands a precision punch`,`GER remains fully summoned`],
  [`Causality Punch`,`global-melee-strike`,`One target anywhere on the battlefield`,`Causality-level physical punch at the target`,`Challenges defensive exceptions at contact`,{visualRange:6.2,visualRadius:2.5,radiusText:`CONTACT r 2.5m`}],
  [`Reality Bend`,`teleport`,`Any valid battlefield point`,`Causality resolves with the user already there`,`No travel path`],
  [`Revert to Zero`,`self-revert`,`Opponent's previous turn`,`Return its consequences to zero`,`Costs and cooldowns remain spent`],
  [`Infinite Death Loop`,`global-melee-barrage`,`One target anywhere on the battlefield`,`Twenty-four-hit Requiem MUDA barrage`,`A lethal finish installs the endless death loop`,{visualRange:6.4,visualRadius:3.2,radiusText:`CONTACT r 3.2m`}],
 ],
 [`King Crimson Requiem`]:[
  [`Time Erasure`,`time-skip`,`Any valid battlefield destination`,`Erase a stronger interval and reposition`,`Missing-frame route`],
  [`Crashout`,`self-area-barrage`,`9m around the user`,`Four discontinuous arms pulverize the close area`,`Guard Break and terrain damage`],
  [`Epitaph`,`time-foresight`,`Opponent's next 5 turns`,`Determine actions, routes, and positions`,`Five-turn future becomes fixed`],
  [`Time Erasing Scythe`,`global-line-scythe`,`One target anywhere on the battlefield`,`Crimson scythe loses frames along its trajectory`,`Causality-level slash at contact`,{visualRadius:3.8,radiusText:`SCYTHE 3.8m`}],
  [`Time Loop`,`target-wall`,`One target anywhere on the battlefield`,`Seal the target in a 4m breakable temporal barrier`,`Interior interaction only · looping passive damage`],
  [`Time Dodge`,`teleport-origin-field`,`Any valid battlefield destination`,`Skip instantly to the destination`,`Origin remains as a temporary causal glitch hazard`,{anchor:`self`}],
  [`Master of Time`,`self-rewind`,`Any retained combat snapshot`,`Restore fighters, resources, objects, and hazards`,`Entire match state returns to the chosen turn`],
 ],
});

function RIFT_V311_TOKENS_FOR(pattern){const tokens=String(pattern||``).split(`-`).filter(Boolean);for(const token of tokens)if(!RIFT_V311_TOKENS.has(token))throw new Error(`V31.1 unknown preview token: ${token} in ${pattern}`);return tokens}
function RIFT_V311_HAS(preview,token){return preview.tokens.includes(token)}
function RIFT_V311_NUM(value,digits=1){const number=Number(value||0);return Number.isInteger(number)?String(number):number.toFixed(digits).replace(/\.0+$/,``)}
function RIFT_V311_PRIMARY_TYPE(tokens){const has=token=>tokens.includes(token);if(has(`teleport`)||has(`skip`))return`teleport`;if(has(`dash`)&&has(`cut`))return`dashSlash`;if(has(`dash`))return`dash`;if(has(`beam`))return`beam`;if(has(`drill`)||has(`line`))return`line`;if(has(`projectile`))return`projectile`;if(has(`cone`))return`cone`;if(has(`wall`))return`wall`;if(has(`tether`))return`tether`;if(has(`falling`))return`rain`;if(has(`arc`)||has(`sweep`))return`arc`;if(has(`domain`))return`field`;if(has(`field`))return`field`;if(has(`area`)||has(`slam`))return`area`;if(has(`summon`))return`summon`;if(has(`barrage`))return`barrage`;if(has(`pierce`))return`thrust`;if(has(`melee`)||has(`strike`))return`strike`;if(has(`global`)&&has(`burst`))return`area`;if(has(`target`)||has(`mark`)||has(`lock`)||has(`curse`)||has(`debuff`))return`target`;return`self`}
function RIFT_V311_PATTERN_LABEL(tokens){const has=token=>tokens.includes(token);let base;if(has(`global`)&&has(`melee`))base=`GLOBAL ACQUIRE → MELEE`;else if(has(`global`)&&has(`projectile`))base=`GLOBAL ACQUIRE → PROJECTILE`;else if(has(`global`)&&has(`line`))base=`GLOBAL ACQUIRE → LINE`;else if(has(`global`)&&has(`heal`))base=`GLOBAL ALLY → HEAL`;else if(has(`global`)&&has(`target`))base=`GLOBAL TARGET`;else base=has(`global`)?`BATTLEFIELD`:has(`domain`)?`DOMAIN`:has(`teleport`)?`TELEPORT`:has(`dash`)&&has(`cut`)?`DASH CUT`:has(`dash`)?`DASH PATH`:has(`beam`)?`BEAM`:has(`drill`)?`DRILL LINE`:has(`line`)?`LINE`:has(`projectile`)?`PROJECTILE`:has(`cone`)?`CONE`:has(`wall`)?`WALL`:has(`tether`)?`TETHER`:has(`falling`)?`FALLING STRIKE`:has(`arc`)?`WEAPON ARC`:has(`area`)?`AREA`:has(`melee`)?`MELEE`:has(`target`)?`TARGETED`:`SELF`;const additions=[];if(has(`barrage`)||has(`multi`))additions.push(`MULTI-HIT`);if(has(`field`))additions.push(`FIELD`);if(has(`trap`))additions.push(`TRAP`);if(has(`summon`))additions.push(`SUMMON`);if(has(`guard`))additions.push(`GUARD`);if(has(`heal`)&&!base.includes(`HEAL`))additions.push(`HEAL`);if(has(`rewind`)||has(`revert`))additions.push(`REWIND`);if(has(`freeze`))additions.push(`TIME STOP`);return[base,...additions].filter((value,index,array)=>array.indexOf(value)===index).join(` → `)}
function RIFT_V311_TARGET_KIND(target,tokens,options){if(options.targetKind)return options.targetKind;const text=String(target||``).toLowerCase();if(tokens[0]===`self`||tokens.includes(`domain`)||text===`self`)return`none`;if(text.includes(`ally`))return`ally`;if(text.includes(`ground`)||text.includes(`point`)||text.includes(`area`)||text.includes(`region`)||text.includes(`destination`)||text.includes(`line`)||text.includes(`lane`)||text.includes(`cone`)||text.includes(`location`))return`point`;if(text.includes(`one target`)||text.includes(`one enemy`)||text.includes(`chosen enemy`)||text.includes(`opponent`))return`enemy`;if(tokens.includes(`global`)||text.includes(`every `)||text.includes(`entire battlefield`)||text.includes(`battlefield and`))return`many`;return`enemy`}
function RIFT_V311_RANGE_TEXT(move){const raw=Number(move?.geometry?.range||0);if(move?.geometry?.shape===`global`||raw>=120)return`BATTLEFIELD`;if(raw<=0)return`SELF`;return`${RIFT_V311_NUM(raw)}m`}
function RIFT_V311_RADIUS_TEXT(move){const radius=Number(move?.geometry?.radius||0);if(move?.geometry?.shape===`global`||radius>=64)return`FULL FIELD`;if(radius<=0)return`POINT`;return`r ${RIFT_V311_NUM(radius)}m`}
function RIFT_V311_BUILD_PREVIEW(move,spec,profile){const[name,pattern,acquisition,resolution,aftermath,rawOptions={}]=spec;if(name!==move.name)throw new Error(`V31.1 preview order mismatch for ${profile.name}: expected ${move.name}, received ${name}`);const tokens=RIFT_V311_TOKENS_FOR(pattern),options=rawOptions||{},rawRange=Number(move.geometry?.range||0),rawRadius=Number(move.geometry?.radius||0),visualRange=Number(options.visualRange??(rawRange>=120?120:rawRange)),visualRadius=Number(options.visualRadius??(rawRadius>=64?64:rawRadius)),targetKind=RIFT_V311_TARGET_KIND(acquisition,tokens,options),primaryType=RIFT_V311_PRIMARY_TYPE(tokens),definition=RIFT_V24_SPATIAL_TYPES[primaryType]||RIFT_V24_SPATIAL_TYPES.target,anchor=options.anchor||((tokens[0]===`self`||tokens.includes(`domain`))?`self`:`target`),phases=[{id:`acquire`,label:`ACQUIRE`,value:acquisition},{id:`resolve`,label:`RESOLVE`,value:resolution},aftermath?{id:`after`,label:`AFTERMATH`,value:aftermath}:null].filter(Boolean);return{version:RIFT_V311_PREVIEW_VERSION,patch:RIFT_V311_VERSION,explicit:true,fallback:false,key:`${profile.name}|${move.slot}|${move.name}`,pattern,tokens,label:RIFT_V311_PATTERN_LABEL(tokens),primaryType,glyph:definition.glyph,acquisition,resolution,aftermath:aftermath||`No persistent battlefield state`,phases,targetKind,anchor,secondaryAtSelf:Boolean(options.secondaryAtSelf),visualRange,visualRadius,geometry:{shape:move.geometry.shape,range:rawRange,radius:rawRadius,requiresAim:Boolean(move.geometry.requiresAim),ignoresCover:Boolean(move.geometry.ignoresCover),rangeText:options.rangeText||RIFT_V311_RANGE_TEXT(move),radiusText:options.radiusText||RIFT_V311_RADIUS_TEXT(move)},mechanicsSource:`resolver geometry + explicit authored move contract`,mechanicsChanged:false}}
function RIFT_V311_INSTALL_PREVIEWS(catalog=RIFT_V31_CATALOG){const seenProfiles=new Set(),seenMoves=new Set();let installed=0;for(const profile of catalog.profiles){const specs=RIFT_V311_PROFILE_SPECS[profile.name];if(!specs)throw new Error(`V31.1 missing profile preview contract: ${profile.name}`);if(specs.length!==profile.moves.length)throw new Error(`V31.1 preview count mismatch for ${profile.name}: ${specs.length}/${profile.moves.length}`);seenProfiles.add(profile.name);for(let index=0;index<profile.moves.length;index+=1){const move=profile.moves[index],preview=RIFT_V311_BUILD_PREVIEW(move,specs[index],profile);if(seenMoves.has(preview.key))throw new Error(`V31.1 duplicate preview contract: ${preview.key}`);seenMoves.add(preview.key);move.preview=preview;const definition=RIFT_V24_SPATIAL_TYPES[preview.primaryType]||RIFT_V24_SPATIAL_TYPES.target;move.spatial={...move.spatial,type:preview.primaryType,label:preview.label,glyph:definition.glyph,family:definition.family,coreShape:move.geometry.shape,presentationOnly:true,mechanicsChanged:false,previewVersion:RIFT_V311_PREVIEW_VERSION,previewRenderer:`v31-cinematic`};installed+=1}profile.spatialTypes=RIFT_V31_UNIQUE(profile.moves.map(move=>move.spatial.type));profile.searchText=[profile.searchText,...profile.moves.flatMap(move=>[move.preview.label,move.preview.acquisition,move.preview.resolution,move.preview.aftermath])].join(` `).toLowerCase()}const orphanProfiles=Object.keys(RIFT_V311_PROFILE_SPECS).filter(name=>!seenProfiles.has(name));if(orphanProfiles.length)throw new Error(`V31.1 orphan preview profiles: ${orphanProfiles.join(`, `)}`);if(installed!==catalog.totals.moves)throw new Error(`V31.1 preview coverage mismatch: ${installed}/${catalog.totals.moves}`);catalog.spatialTypes=RIFT_V31_UNIQUE(catalog.moves.map(move=>move.spatial.type)).sort();catalog.preview={version:RIFT_V311_PREVIEW_VERSION,patch:RIFT_V311_VERSION,explicit:installed,fallbacks:0,profiles:seenProfiles.size,patterns:RIFT_V31_UNIQUE(catalog.moves.map(move=>move.preview.pattern)).sort(),renderer:`v31-cinematic`,layout:`stable-dom`,mechanicsChanged:false};return catalog.preview}

function RIFT_V311_SVG(tag,props={},children=undefined){const next={...props},resolved=children===undefined?next.children:children;delete next.children;return RIFT_V31_J(tag,{...next,children:resolved})}
function RIFT_V311_SVGS(tag,props={},children=undefined){const next={...props},resolved=children===undefined?next.children:children;delete next.children;return RIFT_V31_JS(tag,{...next,children:resolved})}
function RIFT_V311_UNIT(kind,x,y,label,key){return RIFT_V311_SVGS(`g`,{className:`v311-unit ${kind}`,transform:`translate(${x} ${y})`,key},[RIFT_V311_SVG(`circle`,{r:2.35}),RIFT_V311_SVG(`circle`,{className:`core`,r:.8}),RIFT_V311_SVG(`text`,{x:0,y:5.3,textAnchor:`middle`,children:label})])}
function RIFT_V311_LINE_PATH(x1,y1,x2,y2,bend=0){const middle=(x1+x2)/2;return`M ${x1} ${y1} Q ${middle} ${Math.min(y1,y2)-bend} ${x2} ${y2}`}
function RIFT_V311_BOARD_GEOMETRY(preview){const ox=RIFT_V311_BOARD.originX,oy=RIFT_V311_BOARD.originY,selfOnly=preview.targetKind===`none`,range=Math.max(0,Math.min(102,Number(preview.visualRange||0))),tx=selfOnly?ox:Math.min(112,ox+Math.max(range,preview.targetKind===`many`?82:0)),ty=oy,radius=Math.max(1.6,Math.min(28,Number(preview.visualRadius||0)));return{ox,oy,tx,ty,radius,range}}
function RIFT_V311_EFFECTS(preview,geometry){const{ox,oy,tx,ty,radius}=geometry,has=token=>RIFT_V311_HAS(preview,token),effects=[],anchorX=preview.anchor===`self`?ox:tx,anchorY=preview.anchor===`self`?oy:ty,path=RIFT_V311_LINE_PATH(ox,oy,tx,ty,has(`wave`)?8:0),globalEffect=has(`global`)&&!has(`melee`)&&!has(`projectile`)&&!has(`line`)&&!has(`heal`)&&(preview.targetKind===`many`||has(`field`)||has(`domain`)||has(`devour`)||has(`combination`)),key=(name,index=0)=>`${name}-${index}`;
 if(globalEffect){effects.push(RIFT_V311_SVG(`rect`,{className:`v311-global-field`,x:1,y:1,width:118,height:62,rx:2,key:key(`global`)}));if(has(`moving`))effects.push(RIFT_V311_SVG(`path`,{className:`v311-moving-route`,d:`M 8 49 C 35 8, 67 55, 113 15`,key:key(`moving`)}))}
 if(has(`freeze`))effects.push(RIFT_V311_SVG(`rect`,{className:`v311-time-field`,x:1,y:1,width:118,height:62,rx:2,key:key(`time-field`)}));
 if(has(`domain`))effects.push(RIFT_V311_SVG(`circle`,{className:`v311-domain`,cx:ox,cy:oy,r:radius,key:key(`domain`)}));
 if((has(`area`)||has(`field`)||has(`slam`)||has(`trap`))&&!globalEffect)effects.push(RIFT_V311_SVG(`circle`,{className:`v311-footprint ${has(`field`)?`field`:``}`,cx:anchorX,cy:anchorY,r:radius,key:key(`area`)}));
 if(has(`field`)&&!globalEffect)effects.push(RIFT_V311_SVG(`circle`,{className:`v311-field-ring`,cx:anchorX,cy:anchorY,r:Math.min(30,radius+2.3),key:key(`field`)}));
 if(has(`wall`)){const wx=anchorX,half=Math.max(5,Math.min(18,radius*1.6));effects.push(RIFT_V311_SVG(`path`,{className:`v311-wall`,d:`M ${wx} ${anchorY-half} L ${wx} ${anchorY+half}`,key:key(`wall`)}))}
 if(has(`cone`)){const half=Math.max(5,Math.min(22,radius));effects.push(RIFT_V311_SVG(`path`,{className:`v311-cone`,d:`M ${ox} ${oy} L ${tx} ${ty-half} L ${tx} ${ty+half} Z`,key:key(`cone`)}))}
 if(has(`line`)||has(`drill`)||has(`sweep`)){const half=Math.max(1.2,Math.min(8,radius));effects.push(RIFT_V311_SVG(`path`,{className:`v311-line ${has(`sweep`)?`sweep`:``}`,d:`M ${ox} ${oy-half} L ${tx} ${ty-half} L ${tx} ${ty+half} L ${ox} ${oy+half} Z`,key:key(`line`)}))}
 if(has(`beam`))effects.push(RIFT_V311_SVG(`path`,{className:`v311-beam`,d:path,style:{strokeWidth:Math.max(2,Math.min(8,radius*1.35))},key:key(`beam`)}));
 if(has(`projectile`)){effects.push(RIFT_V311_SVG(`path`,{className:`v311-route projectile`,d:path,key:key(`projectile-route`)}));const px=ox+(tx-ox)*.58,py=oy+(ty-oy)*.58;effects.push(RIFT_V311_SVG(`circle`,{className:`v311-projectile`,cx:px,cy:py,r:has(`multi`)?1.15:1.7,key:key(`projectile`)}))}
 if(has(`multi`)&&has(`projectile`))for(let index=-1;index<=1;index+=1)effects.push(RIFT_V311_SVG(`path`,{className:`v311-route multi`,d:RIFT_V311_LINE_PATH(ox,oy+index*2.1,tx,ty+index*2.1),key:key(`multi-route`,index)}));
 if(has(`dash`)||has(`teleport`)||has(`skip`)){effects.push(RIFT_V311_SVG(`path`,{className:`v311-route ${has(`teleport`)||has(`skip`)?`teleport`:`dash`}`,d:path,key:key(`travel`)}));effects.push(RIFT_V311_SVG(`circle`,{className:`v311-ghost-origin`,cx:ox,cy:oy,r:3.4,key:key(`ghost`)}))}
 if(has(`tether`))effects.push(RIFT_V311_SVG(`path`,{className:`v311-tether`,d:RIFT_V311_LINE_PATH(ox,oy,tx,ty,10),key:key(`tether`)}));
 if(has(`movement`)&&preview.tokens[0]===`target`){effects.push(RIFT_V311_SVG(`path`,{className:`v311-route dash`,d:`M ${tx} ${ty} L ${Math.min(116,tx+13)} ${ty-5}`,key:key(`target-movement`)}));effects.push(RIFT_V311_SVG(`circle`,{className:`v311-ghost-origin enemy`,cx:tx,cy:ty,r:3.4,key:key(`target-ghost`)}))}
 if(has(`wave`)){effects.push(RIFT_V311_SVG(`path`,{className:`v311-wave`,d:`M ${tx-6} ${ty-8} Q ${tx+2} ${ty} ${tx-6} ${ty+8}`,key:key(`wave`,0)}));effects.push(RIFT_V311_SVG(`path`,{className:`v311-wave faint`,d:`M ${tx-1} ${ty-11} Q ${tx+10} ${ty} ${tx-1} ${ty+11}`,key:key(`wave`,1)}))}
 if(has(`arc`))effects.push(RIFT_V311_SVG(`path`,{className:`v311-arc`,d:`M ${ox+1} ${oy+9} A 14 14 0 0 1 ${tx+3} ${ty-9}`,key:key(`arc`)}));
 if(has(`falling`)){effects.push(RIFT_V311_SVG(`path`,{className:`v311-falling`,d:`M ${tx} 3 L ${tx} ${ty-2}`,key:key(`falling`)}));effects.push(RIFT_V311_SVG(`path`,{className:`v311-falling-head`,d:`M ${tx-3} ${ty-7} L ${tx} ${ty-2} L ${tx+3} ${ty-7}`,key:key(`falling-head`)}))}
 if(has(`barrage`)){const count=globalEffect?11:7;for(let index=0;index<count;index+=1){const angle=(index-(count-1)/2)*.44,spread=globalEffect?18:Math.max(5,radius),sx=globalEffect?8+(index*9.8)%106:Math.max(ox,tx-spread),sy=globalEffect?10+(index*13)%43:ty+Math.sin(angle)*spread,ex=globalEffect?sx+5:tx+Math.cos(angle)*spread*.55,ey=globalEffect?sy+3:ty+Math.sin(angle)*spread*.15;effects.push(RIFT_V311_SVG(`path`,{className:`v311-barrage-stroke`,d:`M ${sx} ${sy} L ${ex} ${ey}`,key:key(`barrage`,index)}))}}
 if(has(`trap`)){for(let index=0;index<6;index+=1){const angle=index/6*Math.PI*2,rr=radius*.62;effects.push(RIFT_V311_SVG(`path`,{className:`v311-trap`,d:`M ${anchorX+Math.cos(angle)*rr-1.4} ${anchorY+Math.sin(angle)*rr} l 2.8 0 M ${anchorX+Math.cos(angle)*rr} ${anchorY+Math.sin(angle)*rr-1.4} l 0 2.8`,key:key(`trap`,index)}))}}
 if(has(`summon`)){for(let index=0;index<3;index+=1){const angle=index/3*Math.PI*2-.5,effective=Math.max(4,Math.min(9,radius*.6));effects.push(RIFT_V311_SVG(`polygon`,{className:`v311-summon`,points:`${anchorX+Math.cos(angle)*effective},${anchorY+Math.sin(angle)*effective-2} ${anchorX+Math.cos(angle)*effective+2},${anchorY+Math.sin(angle)*effective} ${anchorX+Math.cos(angle)*effective},${anchorY+Math.sin(angle)*effective+2} ${anchorX+Math.cos(angle)*effective-2},${anchorY+Math.sin(angle)*effective}`,key:key(`summon`,index)}))}}
 if(has(`strike`)||has(`impact`)||has(`pierce`)||has(`burst`)||has(`compress`)||has(`fracture`)||has(`sink`)||has(`extract`)){effects.push(RIFT_V311_SVG(`circle`,{className:`v311-contact`,cx:anchorX,cy:anchorY,r:Math.max(3,Math.min(8,radius)),key:key(`contact`)}));effects.push(RIFT_V311_SVG(`path`,{className:`v311-contact-cross`,d:`M ${anchorX-4} ${anchorY-4} L ${anchorX+4} ${anchorY+4} M ${anchorX+4} ${anchorY-4} L ${anchorX-4} ${anchorY+4}`,key:key(`contact-cross`)}))}
 if(has(`fracture`))effects.push(RIFT_V311_SVG(`path`,{className:`v311-fracture`,d:`M ${ox} ${oy+3} l 10 -4 7 6 9 -8 11 5 10 -7 12 5`,key:key(`fracture`)}));
 if(has(`guard`)){effects.push(RIFT_V311_SVG(`path`,{className:`v311-guard`,d:`M ${ox-1} ${oy-9} Q ${ox+12} ${oy} ${ox-1} ${oy+9}`,key:key(`guard`)}))}
 if(has(`orbit`)){effects.push(RIFT_V311_SVG(`ellipse`,{className:`v311-orbit`,cx:ox,cy:oy,rx:8,ry:4.5,key:key(`orbit`)}));for(let index=0;index<4;index+=1)effects.push(RIFT_V311_SVG(`circle`,{className:`v311-orbit-node`,cx:ox+Math.cos(index*Math.PI/2)*8,cy:oy+Math.sin(index*Math.PI/2)*4.5,r:1,key:key(`orbit-node`,index)}))}
 if(has(`heal`)){const healX=preview.secondaryAtSelf?ox:anchorX,healY=preview.secondaryAtSelf?oy:anchorY;effects.push(RIFT_V311_SVG(`path`,{className:`v311-heal`,d:`M ${healX-4} ${healY} L ${healX+4} ${healY} M ${healX} ${healY-4} L ${healX} ${healY+4}`,key:key(`heal`)}))}
 if(has(`transform`)||has(`charge`)||has(`rune`)||has(`guarantee`)){for(let index=0;index<8;index+=1){const angle=index/8*Math.PI*2;effects.push(RIFT_V311_SVG(`path`,{className:`v311-aura-ray`,d:`M ${ox+Math.cos(angle)*4} ${oy+Math.sin(angle)*4} L ${ox+Math.cos(angle)*8} ${oy+Math.sin(angle)*8}`,key:key(`aura`,index)}))}}
 if(has(`time`)||has(`rewind`)||has(`revert`)||has(`foresight`)||has(`outcome`)){effects.push(RIFT_V311_SVG(`circle`,{className:`v311-time-ring`,cx:anchorX,cy:anchorY,r:9,key:key(`time-ring`)}));effects.push(RIFT_V311_SVG(`path`,{className:`v311-time-hand`,d:`M ${anchorX} ${anchorY} L ${anchorX} ${anchorY-6} M ${anchorX} ${anchorY} L ${anchorX+4} ${anchorY+2}`,key:key(`time-hand`)}))}
 if(has(`mark`)||has(`lock`)||has(`curse`)||has(`debuff`)||has(`dispel`)||has(`drain`)||has(`copy`)||has(`steal`)){effects.push(RIFT_V311_SVG(`circle`,{className:`v311-mark`,cx:tx,cy:ty,r:5.8,key:key(`mark`)}));effects.push(RIFT_V311_SVG(`circle`,{className:`v311-mark inner`,cx:tx,cy:ty,r:3.5,key:key(`mark-inner`)}))}
 return effects}
function RIFT_V311_RULER(preview,geometry){const{ox,tx}=geometry;if(preview.targetKind===`none`||tx===ox)return null;return RIFT_V311_SVGS(`g`,{className:`v311-ruler`,children:[RIFT_V311_SVG(`path`,{d:`M ${ox} 58 L ${tx} 58`}),RIFT_V311_SVG(`path`,{d:`M ${ox} 56 L ${ox} 60 M ${tx} 56 L ${tx} 60`}),RIFT_V311_SVG(`text`,{x:(ox+tx)/2,y:56.3,textAnchor:`middle`,children:preview.geometry.rangeText})]})}
function RIFT_V311_ACTORS(preview,geometry,move){const{ox,oy,tx,ty}=geometry,actors=[RIFT_V311_UNIT(`origin`,ox,oy,move.profileKind===`stand`?move.glyph:`YOU`,`origin`)];if(preview.targetKind===`enemy`)actors.push(RIFT_V311_UNIT(`enemy`,tx,ty,`TARGET`,`target`));else if(preview.targetKind===`ally`)actors.push(RIFT_V311_UNIT(`ally`,tx,ty,`ALLY`,`ally`));else if(preview.targetKind===`point`)actors.push(RIFT_V311_SVGS(`g`,{className:`v311-point`,transform:`translate(${tx} ${ty})`,key:`point`,children:[RIFT_V311_SVG(`circle`,{r:3.2}),RIFT_V311_SVG(`path`,{d:`M -5 0 L 5 0 M 0 -5 L 0 5`}),RIFT_V311_SVG(`text`,{x:0,y:6.2,textAnchor:`middle`,children:`AIM`})]}));else if(preview.targetKind===`many`){[[82,17],[101,32],[77,48]].forEach((position,index)=>actors.push(RIFT_V311_UNIT(`enemy`,position[0],position[1],`T${index+1}`,`target-${index}`)))}return actors}
function RIFT_V311_MOVE_VISUAL({move}){const preview=move.preview,geometry=RIFT_V311_BOARD_GEOMETRY(preview),aria=`${move.profileName} ${move.name}. ${preview.acquisition}. ${preview.resolution}. ${preview.aftermath}. Actual ${preview.geometry.rangeText} range and ${preview.geometry.radiusText} footprint.`;return RIFT_V31_JS(`section`,{className:`v311-preview`,'aria-label':aria,children:[RIFT_V31_JS(`div`,{className:`v311-stage`,children:[RIFT_V31_JS(`div`,{className:`v311-geometry-badges`,children:[RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:`RANGE`}),RIFT_V31_J(`b`,{children:preview.geometry.rangeText})]}),RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:`FOOTPRINT`}),RIFT_V31_J(`b`,{children:preview.geometry.radiusText})]})]}),RIFT_V31_JS(`svg`,{className:`v311-board`,viewBox:`0 0 120 64`,'aria-hidden':`true`,children:[RIFT_V31_JS(`g`,{className:`v311-grid`,children:Array.from({length:13},(_,index)=>RIFT_V311_SVG(`path`,{d:`M ${index*10} 0 L ${index*10} 64`,key:`vx-${index}`})).concat(Array.from({length:9},(_,index)=>RIFT_V311_SVG(`path`,{d:`M 0 ${index*8} L 120 ${index*8}`,key:`hy-${index}`})))}),RIFT_V31_J(RIFT_V31_FRAGMENT,{children:RIFT_V311_EFFECTS(preview,geometry)}),RIFT_V31_J(RIFT_V31_FRAGMENT,{children:RIFT_V311_ACTORS(preview,geometry,move)}),RIFT_V311_RULER(preview,geometry)]}),RIFT_V31_JS(`span`,{className:`v311-stage-caption`,children:[RIFT_V31_J(`b`,{children:preview.glyph}),RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`strong`,{children:preview.label}),RIFT_V31_J(`small`,{children:`MECHANICS-BACKED · EXPLICIT MOVE CONTRACT`})]})]})]}),RIFT_V31_J(`ol`,{className:`v311-sequence`,children:preview.phases.map((phase,index)=>RIFT_V31_JS(`li`,{children:[RIFT_V31_J(`b`,{children:String(index+1).padStart(2,`0`)}),RIFT_V31_JS(`span`,{children:[RIFT_V31_J(`small`,{children:phase.label}),RIFT_V31_J(`strong`,{children:phase.value})]})]},phase.id))})]})}

const RIFT_V311_PREVIEW_REPORT=RIFT_V311_INSTALL_PREVIEWS();
const RIFT_V311_BASE_BUILD_CATALOG=RIFT_V31_BUILD_CATALOG;
RIFT_V31_BUILD_CATALOG=function RIFT_V311_BUILD_CATALOG(...sources){const catalog=RIFT_V311_BASE_BUILD_CATALOG(...sources);RIFT_V311_INSTALL_PREVIEWS(catalog);return catalog};
RIFT_V31_MOVE_VISUAL=RIFT_V311_CINEMATIC_MOVE_VISUAL;
globalThis.RIFTBOUND_CODEX={...globalThis.RIFTBOUND_CODEX,build:RIFT_V31_BUILD_CATALOG,previewVersion:RIFT_V311_PREVIEW_VERSION,previewPatch:RIFT_V311_VERSION,previewRenderer:`v31-cinematic`,preview:value=>{const move=typeof value===`string`?globalThis.RIFTBOUND_CODEX.move(value):value;return move?.preview||null},previewReport:()=>RIFT_V31_CATALOG.preview};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,codex:{...globalThis.RIFTBOUND_MANIFEST.codex,previewPatch:`V31.1`,previewVersion:RIFT_V311_PREVIEW_VERSION,previewCoverage:RIFT_V311_PREVIEW_REPORT.explicit,previewFallbacks:0,previewRenderer:`v31-cinematic`,previewLayout:`stable-dom`,mechanicsBackedPreviews:true}};
if(globalThis.RIFTBOUND_DIAGNOSTICS)globalThis.RIFTBOUND_DIAGNOSTICS={...globalThis.RIFTBOUND_DIAGNOSTICS,codexPreviews:()=>RIFT_V31_CATALOG.preview};
