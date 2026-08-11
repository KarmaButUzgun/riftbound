u.as=u.ap.map(entry=>({...entry}));
const RIFT_ITEM_RARITIES = [`Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`];
const RIFT_ITEM_CATEGORIES = [`Weapon`, `Defense`, `Armor`, `Relic`, `Magic`, `Physical`, `Utility`];
const RIFT_ITEM_STAT_KEYS = [`as`, `ap`, `durability`, `speed`, `range`, `iq`, `battleIq`, `combatSkill`, `energy`, `regeneration`];
const RIFT_ITEM_RARITY_COLOR = {Common:`#aeb8c8`,Uncommon:`#5ce0a0`,Rare:`#54cfff`,Epic:`#a77bff`,Legendary:`#ffc25a`};
const RIFT_ITEM_CATALOG = (() => {
  const items = [];
  const add = raw => {
    const index = items.length;
    const id = String(raw.id);
    const rarity = raw.rarity || `Common`;
    const category = raw.category || `Utility`;
    const glyphs = [`◇`,`†`,`⌁`,`◈`,`✦`,`⬡`,`☿`,`⌬`,`♢`,`⟡`,`◉`,`⌖`,`∆`,`ϟ`,`☼`,`◌`,`⟁`,`✧`,`⊕`,`⌘`,`♜`,`☾`,`♆`,`⚙`,`♤`,`♧`,`♠`,`♡`,`♛`,`♝`,`♞`,`⊙`,`⌇`,`⧗`,`⟟`,`⟢`,`⌑`,`⍟`,`⎈`,`⏣`,`⫷`,`⫸`,`⋈`,`⊗`,`⊚`,`⟐`,`⧖`,`⨳`];
    const item = {
      id,
      name: raw.name,
      rarity,
      category,
      price: Math.max(1, Math.round(raw.price || 30)),
      stats: {...raw.stats},
      recipe: [...(raw.recipe || [])],
      glyph: raw.glyph || glyphs[index % glyphs.length],
      icon: `rift-item-${id}`,
      accent: raw.accent || RIFT_ITEM_RARITY_COLOR[rarity],
      lore: raw.lore || `${raw.name} crossed a dead rift with its purpose intact.`,
      passive: raw.passive || `A dependable ${category.toLowerCase()} component whose statistics remain useful on their own.`,
      passiveId: raw.passiveId || null,
      cooldown: Math.max(0, Math.round(raw.cooldown || 0)),
      reference: raw.reference || `Riftbound Original`,
      tags: [...(raw.tags || [])],
      weapon: raw.weapon || (category === `Weapon` ? (()=>{const inferred=raw.damageType||((raw.stats?.ap||0)>(raw.stats?.as||0)*1.2?`Magic`:(raw.stats?.ap||0)>0&&(raw.stats?.as||0)>0?`Hybrid`:`Physical`);return {
        range: rarity === `Legendary` ? 5.8 : rarity === `Epic` ? 4.7 : rarity === `Rare` ? 3.9 : 3.1,
        damageType: inferred,
        cost: rarity === `Legendary` ? 18 : rarity === `Epic` ? 12 : rarity === `Rare` ? 8 : 3,
        attackTags: [inferred===`Magic`?`magic`:`physical`,...(inferred===`Hybrid`?[`magic`,`hybrid`]:[]), `weapon`, ...(raw.attackTags || [])],
      }})() : null),
    };
    items.push(item);
    return item;
  };

  const components = [
    [`iron-edge`,`Iron Edge`,`Weapon`,34,{as:1,combatSkill:1},`†`,`A clean blade blank stamped in a forge that no longer exists.`],
    [`duelist-grip`,`Duelist Grip`,`Weapon`,38,{speed:1,combatSkill:1},`⟊`,`The wrap remembers every hand that refused to tremble.`],
    [`astral-bowstring`,`Astral Bowstring`,`Weapon`,42,{range:1,as:1},`⌁`,`Moonlight drawn into a cord and taught to hold tension.`],
    [`hex-barrel`,`Hex Barrel`,`Weapon`,46,{range:1,ap:1},`⌖`,`A rifled focus that gives hostile intent a straight road.`],
    [`spearhead`,`Rift Spearhead`,`Weapon`,44,{as:1,range:1},`∆`,`Its point is always one handspan closer than it appears.`],
    [`chain-coil`,`Gravetide Chain`,`Weapon`,48,{as:1,durability:1},`⛓`,`A drowned executioner's chain, cold even under stars.`],
    [`focus-hilt`,`Focus Hilt`,`Weapon`,52,{ap:1,energy:1},`✦`,`An empty hilt waiting for a thought sharp enough to wield.`],
    [`titan-hammerhead`,`Titan Hammerhead`,`Weapon`,58,{as:2,speed:-1},`⬣`,`A fragment of siege metal that treats walls as suggestions.`],
    [`ward-plate`,`Ward Plate`,`Defense`,32,{durability:1},`⬡`,`Standard issue in cities that expect the sky to attack.`],
    [`living-mail`,`Living Mail`,`Defense`,44,{durability:1,regeneration:1},`♢`,`Its links tighten around wounds before blood can answer.`],
    [`null-cloth`,`Null Cloth`,`Defense`,46,{durability:1,ap:1},`◌`,`A funeral veil that drinks the first color from a spell.`],
    [`bastion-rivet`,`Bastion Rivet`,`Defense`,38,{durability:1,combatSkill:1},`⊙`,`One rivet from a fortress that outlived its continent.`],
    [`kinetic-foam`,`Kinetic Foam`,`Defense`,40,{durability:1,speed:1},`◫`,`Soft at rest, harder than law at the moment of impact.`],
    [`shadowweave`,`Shadowweave`,`Armor`,36,{speed:1,battleIq:1},`☾`,`Cloth woven in the instant between being seen and remembered.`],
    [`star-silk`,`Star Silk`,`Armor`,50,{ap:1,energy:1},`⟡`,`A luminous fiber harvested from the seam of a newborn rift.`],
    [`ember-hide`,`Ember Hide`,`Armor`,45,{as:1,regeneration:1},`☼`,`Warm leather shed by something that slept beneath a volcano.`],
    [`void-leather`,`Void Leather`,`Armor`,54,{durability:1,energy:1},`●`,`It weighs nothing until the universe tries to move it.`],
    [`crown-thread`,`Crown Thread`,`Armor`,52,{iq:1,battleIq:1},`♛`,`Gold filament reserved for rulers who survived prophecy.`],
    [`memory-shard`,`Memory Shard`,`Relic`,31,{iq:1},`◇`,`A stranger's last useful idea, crystallized without a name.`],
    [`fate-die`,`Fate Die`,`Relic`,43,{battleIq:1,speed:1},`⚄`,`Every face has rolled a future that never happened.`],
    [`saint-bone`,`Saint Bone`,`Relic`,47,{regeneration:1,durability:1},`†`,`A reliquary splinter still convinced that mercy is possible.`],
    [`devil-coin`,`Devil Coin`,`Relic`,55,{ap:1,as:1},`◉`,`Spend one side for power. The other side spends you.`],
    [`chronal-gear`,`Chronal Gear`,`Relic`,62,{speed:1,battleIq:1,energy:1},`⧗`,`A clock component filed from a stolen second.`],
    [`mana-prism`,`Mana Prism`,`Magic`,30,{ap:1},`✦`,`A cheap lens that turns raw energy into dangerous intention.`],
    [`cursed-ink`,`Cursed Ink`,`Magic`,41,{ap:1,iq:1},`墨`,`Every sealed word wants to become a command.`],
    [`ether-vial`,`Ether Vial`,`Magic`,38,{energy:1,regeneration:1},`♆`,`Condensed reserve siphoned from a sleeping leyline.`],
    [`spell-lens`,`Spell Lens`,`Magic`,49,{ap:1,range:1},`⌖`,`A monocle ground to reveal where a technique truly begins.`],
    [`whetstone`,`Red Whetstone`,`Physical`,29,{as:1},`⟁`,`It sharpens conviction first and metal second.`],
    [`giant-belt`,`Giant Belt`,`Physical`,43,{as:1,durability:1},`⌑`,`A buckle cut down from armor made for a larger age.`],
    [`hunter-mark`,`Hunter Mark`,`Physical`,47,{as:1,battleIq:1},`⌾`,`The ink warms whenever prey believes it has escaped.`],
    [`berserker-vial`,`Berserker Vial`,`Physical`,51,{as:2,regeneration:-1},`♦`,`A battlefield tonic with no interest in tomorrow.`],
    [`wind-boots`,`Wind Soles`,`Utility`,34,{speed:1},`ϟ`,`They never touch the same patch of earth twice.`],
    [`scout-lens`,`Scout Lens`,`Utility`,35,{range:1,battleIq:1},`⌖`,`Distance becomes a measurement instead of an excuse.`],
    [`battery-cell`,`Rift Battery`,`Utility`,39,{energy:1},`▣`,`A portable reserve with a heartbeat just out of rhythm.`],
    [`mnemonic-chip`,`Mnemonic Chip`,`Utility`,42,{iq:1,combatSkill:1},`⌘`,`It remembers the lesson before the mistake is made.`],
    [`regen-moss`,`Saint's Moss`,`Utility`,37,{regeneration:1},`♧`,`Green life from the quiet side of a battlefield.`],
    [`phase-pin`,`Phase Pin`,`Utility`,45,{speed:1,range:1},`⟐`,`Fastens the wearer's outline to the more convenient location.`],
    [`rift-heirloom`,`Legacy Armament`,`Weapon`,40,{as:1},`†`,`A migrated armament from an older Riftbound run. Its history remains, but future weapons come from shops.`,{damageType:`Physical`,range:3,cost:2,attackTags:[`physical`,`weapon`,`legacyItem`]}],
  ];
  components.forEach(([id,name,category,price,stats,glyph,lore,weapon]) => add({id,name,category,price,stats,glyph,lore,weapon,rarity:price>=50?`Uncommon`:`Common`}));

  const mids = [
    [`riftsteel-sabre`,`Riftsteel Sabre`,`Rare`,`Weapon`,132,[`iron-edge`,`duelist-grip`],{as:2,speed:1,combatSkill:1},`⟊`,`First contact grants +1 Speed for the action.`,`A duelist's answer to unstable distance.`],
    [`moonpiercer`,`Moonpiercer`,`Rare`,`Weapon`,148,[`astral-bowstring`,`spearhead`],{as:2,range:2},`☾`,`Weapon attacks beyond 8m deal 8% more damage.`,`The crescent point hunts targets behind the horizon.`],
    [`hexcaster-carbine`,`Hexcaster Carbine`,`Rare`,`Weapon`,154,[`hex-barrel`,`mana-prism`],{ap:2,range:2},`⌖`,`Its weapon attack uses Attack Power and counts as supernatural.`,`A rifle for mages who grew tired of being interrupted.`],
    [`gravesong-chain`,`Gravesong Chain`,`Rare`,`Weapon`,162,[`chain-coil`,`saint-bone`],{as:2,durability:2},`⛓`,`Weapon hits restore 2% maximum HP once per action.`,`Every link tolls for the hand it drags home.`],
    [`spellblade-focus`,`Spellblade Focus`,`Rare`,`Weapon`,168,[`focus-hilt`,`cursed-ink`],{as:1,ap:2,energy:1},`✦`,`Weapon attacks scale 55% AS and 45% AP.`,`Thought and steel meet at the edge.`],
    [`worldmaul`,`Worldmaul`,`Epic`,`Weapon`,224,[`titan-hammerhead`,`giant-belt`,`bastion-rivet`],{as:4,durability:2,speed:-1},`⬣`,`Weapon hits add heavy posture pressure and structure damage.`,`It was built for opening gates from the wrong side.`],
    [`pilgrim-buckler`,`Pilgrim Buckler`,`Rare`,`Defense`,128,[`ward-plate`,`kinetic-foam`],{durability:2,speed:1},`⬡`,`Guarding creates a 6% max-HP shield.`,`A little fortress that travels with the last survivor.`],
    [`renewal-mail`,`Renewal Mail`,`Rare`,`Defense`,146,[`living-mail`,`regen-moss`],{durability:2,regeneration:2},`♢`,`End-turn healing is 12% stronger.`,`The mail learned anatomy from everyone it failed to save.`],
    [`null-mantle`,`Null Mantle`,`Rare`,`Defense`,158,[`null-cloth`,`star-silk`],{durability:2,ap:1,energy:1},`◌`,`The first supernatural hit each fight is reduced by 18%.`,`Magic enters as thunder and leaves as a whisper.`],
    [`bastion-frame`,`Bastion Frame`,`Rare`,`Defense`,151,[`bastion-rivet`,`ward-plate`,`giant-belt`],{durability:3,as:1},`▣`,`While above 70% HP, gain 8% damage resistance.`,`A fortress reduced to the dimensions of one stubborn body.`],
    [`ghostcoat`,`Ghostcoat`,`Rare`,`Armor`,139,[`shadowweave`,`phase-pin`],{speed:2,battleIq:2},`☾`,`After moving, the next incoming hit deals 8% less damage.`,`It arrives one shadow before its wearer.`],
    [`constellation-robe`,`Constellation Robe`,`Rare`,`Armor`,164,[`star-silk`,`mana-prism`,`ether-vial`],{ap:2,energy:2,range:1},`⟡`,`Specials costing 30+ Energy refund 4 Energy once per turn.`,`Every stitch is a small, opinionated star.`],
    [`cinderplate`,`Cinderplate`,`Rare`,`Armor`,155,[`ember-hide`,`ward-plate`],{as:2,durability:2,regeneration:1},`☼`,`Taking physical damage primes +6% physical damage next action.`,`Heat blooms wherever the armor is struck.`],
    [`voidwalker-hide`,`Voidwalker Hide`,`Epic`,`Armor`,218,[`void-leather`,`null-cloth`,`phase-pin`],{durability:2,energy:2,speed:2},`●`,`Environmental damage is reduced by 35%.`,`Nothing in the void learned how to hold it.`],
    [`oracle-circlet`,`Oracle Circlet`,`Rare`,`Armor`,153,[`crown-thread`,`memory-shard`],{iq:2,battleIq:2,range:1},`♛`,`Recommended-item scoring and enemy intent reveal gain extra precision.`,`A thin crown for those who rule possibilities.`],
    [`loaded-chronometer`,`Loaded Chronometer`,`Rare`,`Relic`,171,[`chronal-gear`,`fate-die`],{speed:2,battleIq:2,energy:1},`⧗`,`Every fourth owner turn restores 5 Energy.`,`Its missing hour is waiting inside the trigger.`],
    [`saint's-reliquary`,`Saint's Reliquary`,`Rare`,`Relic`,147,[`saint-bone`,`living-mail`],{regeneration:2,durability:2},`♢`,`Healing at low HP also grants a small shield.`,`A portable chapel for a faith that refuses extinction.`],
    [`infernal-contract-seal`,`Infernal Contract Seal`,`Epic`,`Relic`,232,[`devil-coin`,`cursed-ink`,`berserker-vial`],{as:2,ap:2,energy:1},`◉`,`Devil and Hybrid techniques deal 10% more damage.`,`The signature is yours. The handwriting is not.`],
    [`causal-abacus`,`Causal Abacus`,`Epic`,`Relic`,238,[`memory-shard`,`fate-die`,`chronal-gear`],{iq:3,battleIq:3},`⌘`,`Once per fight, a missed aimed attack refunds half its Energy.`,`Its beads count causes instead of numbers.`],
    [`sorcerer's-index`,`Sorcerer's Index`,`Rare`,`Magic`,142,[`spell-lens`,`cursed-ink`],{ap:3,iq:1,range:1},`墨`,`A damaging Special marks its target for +5% AP damage next action.`,`Every forbidden technique is filed under consequences.`],
    [`aurora-capacitor`,`Aurora Capacitor`,`Rare`,`Magic`,145,[`ether-vial`,`battery-cell`],{ap:1,energy:3,regeneration:1},`♆`,`Rest restores 8 additional Energy.`,`A bottled dawn connected to a practical terminal.`],
    [`twin-prism`,`Twin Prism`,`Epic`,`Magic`,216,[`mana-prism`,`spell-lens`,`star-silk`],{ap:4,range:2},`✦`,`The first damaging Special each combat echoes for 12% damage.`,`One beam enters. Two answers leave.`],
    [`redline-gauntlet`,`Redline Gauntlet`,`Rare`,`Physical`,136,[`whetstone`,`berserker-vial`],{as:3,speed:1},`♦`,`Below 45% HP, gain 8% physical damage.`,`The safety marks were scraped away deliberately.`],
    [`apex-harness`,`Apex Harness`,`Rare`,`Physical`,152,[`giant-belt`,`hunter-mark`],{as:3,durability:1,battleIq:1},`⌾`,`Deal 7% more physical damage to healthier targets.`,`Predators wear it loose until the chase begins.`],
    [`executioner's-kit`,`Executioner's Kit`,`Epic`,`Physical`,221,[`whetstone`,`hunter-mark`,`duelist-grip`],{as:4,combatSkill:2},`♠`,`Critical physical hits gain 12% damage.`,`Measured, maintained, and never mistaken for mercy.`],
    [`wayfinder-rig`,`Wayfinder Rig`,`Rare`,`Utility`,138,[`wind-boots`,`scout-lens`],{speed:2,range:2,battleIq:1},`⌖`,`Movement allowance increases by 8%.`,`Every buckle points away from yesterday.`],
    [`combat-coprocessor`,`Combat Coprocessor`,`Rare`,`Utility`,156,[`mnemonic-chip`,`battery-cell`],{iq:2,combatSkill:2,energy:1},`⌘`,`The first move cooldown applied each combat is reduced by one turn.`,`A second mind devoted entirely to timing.`],
    [`green-engine`,`Green Engine`,`Rare`,`Utility`,149,[`regen-moss`,`ether-vial`],{regeneration:3,energy:2},`♧`,`At turn end, restore 2% max HP if no direct damage was taken.`,`A patient little ecology in a brass case.`],
    [`phase-compass`,`Phase Compass`,`Epic`,`Utility`,226,[`phase-pin`,`scout-lens`,`chronal-gear`],{speed:3,range:2,battleIq:2},`⟐`,`Your first movement each turn costs 15% less.`,`Its needle points to the place you meant to stand.`],
    [`war-scholar-manual`,`War-Scholar Manual`,`Rare`,`Utility`,160,[`mnemonic-chip`,`memory-shard`,`hunter-mark`],{iq:2,battleIq:2,combatSkill:2},`⌘`,`Hybrid attacks gain +4% damage.`,`A campaign recorded as equations and regrets.`],
  ];
  mids.forEach(([id,name,rarity,category,price,recipe,stats,glyph,passive,lore]) => add({id,name,rarity,category,price,recipe,stats,glyph,passive,lore}));

  const epics = [
    [`rift-duelist-arsenal`,`Rift Duelist Arsenal`,`Weapon`,362,[`riftsteel-sabre`,`executioner's-kit`],{as:5,speed:3,combatSkill:3},`⟊`,`weaponTempo`,2,`Alternating Strike and weapon actions grants stacking tempo, up to 12%.`,`The complete discipline of a school erased mid-salute.`],
    [`starfall-ballista`,`Starfall Ballista`,`Weapon`,384,[`moonpiercer`,`wayfinder-rig`],{as:4,range:5,battleIq:2},`⌁`,`longshot`,1,`Hits beyond 10m deal 15% more damage and paint a falling-star trail.`,`A siege bow calibrated against moving constellations.`],
    [`witchfire-repeater`,`Witchfire Repeater`,`Weapon`,398,[`hexcaster-carbine`,`sorcerer's-index`],{ap:5,range:4,energy:2},`⌖`,`spellshot`,2,`Every third damaging action fires a 16% AP echo.`,`The barrel recites the spell faster than its owner can.`],
    [`eclipse-glaive`,`Eclipse Glaive`,`Weapon`,405,[`spellblade-focus`,`gravesong-chain`],{as:4,ap:4,durability:2},`☾`,`hybridEdge`,2,`Weapon attacks scale as hybrid and heal for 3% of damage.`,`Its two edges disagree about whether flesh or spirit was cut.`],
    [`citadel-heart`,`Citadel Heart`,`Defense`,356,[`bastion-frame`,`pilgrim-buckler`],{durability:6,as:1},`⬡`,`citadel`,3,`After taking 25% max HP in one action, gain a 14% max-HP shield.`,`A fortress core still executing its last order: hold.`],
    [`mercy-protocol`,`Mercy Protocol`,`Defense`,371,[`renewal-mail`,`saint's-reliquary`],{durability:4,regeneration:5},`♢`,`mercy`,3,`Dropping below 35% HP triggers a strong heal once per cooldown.`,`The protocol never asks whether its patient deserves another chance.`],
    [`anti-magic-carapace`,`Anti-Magic Carapace`,`Defense`,389,[`null-mantle`,`voidwalker-hide`],{durability:5,energy:3},`◌`,`spellWard`,3,`The first AP-scaled hit after cooldown is reduced by 28%.`,`A shell grown in a universe where spells were predators.`],
    [`sovereign-raiment`,`Sovereign Raiment`,`Armor`,378,[`oracle-circlet`,`constellation-robe`],{ap:4,iq:3,battleIq:3,energy:2},`♛`,`sovereign`,2,`After using an Ultimate, recover 12% maximum Energy.`,`The stars sewn into its hem orbit whoever wears it.`],
    [`afterimage-coat`,`Afterimage Coat`,`Armor`,365,[`ghostcoat`,`phase-compass`],{speed:6,battleIq:3},`⟐`,`afterimage`,2,`Moving at least 8m grants 14% dodge until your next action.`,`Most witnesses report the coat arriving without a wearer.`],
    [`worldskin`,`Worldskin`,`Armor`,396,[`cinderplate`,`voidwalker-hide`],{as:3,durability:5,regeneration:2},`●`,`worldskin`,2,`Environmental hazards deal 50% less damage; surviving one empowers AS.`,`Armor patched from places that no longer exist.`],
    [`paradox-engine`,`Paradox Engine`,`Relic`,412,[`loaded-chronometer`,`causal-abacus`],{speed:4,iq:4,battleIq:4},`⧗`,`paradox`,4,`Once per cooldown, an enemy Ultimate grants you 18 Energy and a Speed surge.`,`A mechanism that keeps the effect and returns the cause.`],
    [`hellbound-covenant`,`Hellbound Covenant`,`Relic`,418,[`infernal-contract-seal`,`redline-gauntlet`],{as:4,ap:4,energy:2},`◉`,`hybridFury`,2,`Devil Hybrid transformation grants a shield and 12% hybrid damage.`,`A contract written on the inside of a heartbeat.`],
    [`saint-of-zero`,`Saint of Zero`,`Relic`,401,[`saint's-reliquary`,`null-mantle`],{durability:4,regeneration:4,iq:2},`♢`,`cleanse`,4,`At low HP, cleanse common harmful statuses and restore posture.`,`The reliquary is empty because the saint walked away.`],
    [`archmage-circuit`,`Archmage Circuit`,`Magic`,407,[`twin-prism`,`aurora-capacitor`],{ap:7,energy:4,range:2},`✦`,`spellEcho`,3,`The first AP action after cooldown echoes for 22% damage without retriggering items.`,`A complete spell lattice, dangerously eager to be used.`],
    [`abyssal-codex`,`Abyssal Codex`,`Magic`,394,[`sorcerer's-index`,`infernal-contract-seal`],{ap:6,iq:3,energy:2},`墨`,`abyssalMark`,2,`Damaging Specials brand the target; the next AP hit consumes it for 12% more.`,`The index begins with your name and ends with the sea.`],
    [`godhand-array`,`Godhand Array`,`Physical`,409,[`executioner's-kit`,`apex-harness`],{as:7,combatSkill:4},`拳`,`godhand`,2,`Every fourth physical action becomes an empowered strike for 20% more damage.`,`Six vanished masters left one lesson each in the metal.`],
    [`bloodstar-drive`,`Bloodstar Drive`,`Physical`,402,[`redline-gauntlet`,`green-engine`],{as:6,speed:3,regeneration:2},`♦`,`bloodstar`,3,`Below 40% HP, physical damage heals for 5% once per action.`,`A red engine that mistakes danger for fuel.`],
    [`horizon-command`,`Horizon Command`,`Utility`,386,[`wayfinder-rig`,`war-scholar-manual`],{range:4,battleIq:4,combatSkill:3},`⌖`,`horizon`,2,`Aimed attacks gain 8% accuracy and 7% damage.`,`Orders arrive at the horizon before the army does.`],
    [`infinite-reservoir`,`Infinite Reservoir`,`Utility`,399,[`green-engine`,`combat-coprocessor`],{energy:6,regeneration:4,iq:2},`♆`,`reservoir`,2,`Spending 45+ Energy restores 10 Energy after resolution.`,`A finite vessel with a very persuasive name.`],
    [`perfect-algorithm`,`Perfect Algorithm`,`Utility`,421,[`combat-coprocessor`,`causal-abacus`],{iq:5,battleIq:5,combatSkill:4},`⌘`,`calculated`,2,`Once per cooldown, a critical or Perfect Guard reduces all move cooldowns by one.`,`It does not predict victory. It removes every other result.`],
  ];
  epics.forEach(([id,name,category,price,recipe,stats,glyph,passiveId,cooldown,passive,lore]) => add({id,name,rarity:`Epic`,category,price,recipe,stats,glyph,passiveId,cooldown,passive,lore}));

  const legends = [
    [`berserker-armor`,`Berserker Armor`,`Armor`,960,[`worldskin`,`bloodstar-drive`],{as:8,durability:5,regeneration:-2},`狂`,`berserkerArmor`,2,`Below 45% HP, pain becomes +24% physical damage and +2 Speed. Healing above the threshold ends the frenzy.`,`A reference-forged plate that forces a broken body to keep moving.`,`Berserk`],
    [`excalibur-protocol`,`Excalibur Protocol`,`Weapon`,1010,[`rift-duelist-arsenal`,`sovereign-raiment`],{as:7,ap:5,combatSkill:4},`王`,`excalibur`,3,`After three damaging actions, the next weapon attack releases a hybrid beam for 28% bonus damage.`,`A kingly weapon translated into a system the rift can execute.`,`Arthurian legend`],
    [`mjolnir-last-thunder`,`Mjolnir · Last Thunder`,`Weapon`,990,[`worldmaul`,`paradox-engine`],{as:8,ap:4,durability:4},`ϟ`,`lastThunder`,3,`A weapon hit after moving calls lightning for 24% AP damage without replacing the impact.`,`The hammer remembers a final storm even when no sky remains.`,`Norse myth`],
    [`yamato-riftcutter`,`Yamato · Riftcutter`,`Weapon`,1040,[`eclipse-glaive`,`afterimage-coat`],{as:6,ap:6,speed:5},`閻`,`riftcutter`,3,`Every third weapon hit cuts distance itself, bypassing 18% defense as hybrid damage.`,`A reference blade sharpened on the border between worlds.`,`Devil May Cry`],
    [`dragonslayer-black-iron`,`Dragonslayer · Black Iron`,`Weapon`,1000,[`worldmaul`,`godhand-array`],{as:10,durability:4,speed:-1},`竜`,`dragonslayer`,2,`Hits against bosses and larger targets deal 20% more physical damage and massive posture pressure.`,`Too large to be called a sword, too necessary to leave behind.`,`Berserk`],
    [`ea-world-rend`,`Ea · World Rend`,`Weapon`,1120,[`starfall-ballista`,`archmage-circuit`],{as:5,ap:9,range:5},`乖`,`worldRend`,4,`An Ultimate primes the next weapon attack to tear the environment and deal 32% AP echo damage.`,`A reference armament whose rotation remembers the birth of separation.`,`Fate`],
    [`gungnir-certain-line`,`Gungnir · Certain Line`,`Weapon`,970,[`starfall-ballista`,`horizon-command`],{as:7,range:7,battleIq:4},`必中`,`certainLine`,3,`The first aimed weapon attack after cooldown cannot miss and gains 18% physical damage.`,`A spear that arrives at the conclusion before it is thrown.`,`Norse myth`],
    [`keyblade-between-hearts`,`Keyblade · Between Hearts`,`Weapon`,1020,[`spellblade-focus`,`saint-of-zero`,`rift-duelist-arsenal`],{as:5,ap:6,regeneration:3},`鍵`,`heartKey`,3,`Hybrid weapon damage heals 4% and cleanses one minor debuff once per cooldown.`,`It opens what armor, memory, and grief tried to lock.`,`Kingdom Hearts`],
    [`aegis-of-the-last-city`,`Aegis of the Last City`,`Defense`,940,[`citadel-heart`,`anti-magic-carapace`],{durability:10,energy:3},`⬡`,`lastCity`,4,`Lethal damage is prevented once per fight, leaving 18% HP and a 20% max-HP shield.`,`The city fell. Its promise did not.`,`Riftbound Original`],
    [`avalon-unbroken`,`Avalon · Unbroken`,`Defense`,980,[`mercy-protocol`,`saint-of-zero`],{durability:7,regeneration:8},`楽`,`avalon`,4,`Below 30% HP, enter sanctuary for one action: heal, cleanse, and reduce incoming damage by 35%.`,`A distant sheath-shaped paradise refusing the world's verdict.`,`Arthurian legend`],
    [`vibranium-echo-shell`,`Vibranium Echo Shell`,`Defense`,920,[`citadel-heart`,`paradox-engine`],{durability:8,battleIq:4},`◉`,`echoShell`,2,`Stores 18% of direct damage and adds it to the next physical hit, capped by max HP.`,`A reference alloy taught to remember force without worshipping it.`,`Marvel`],
    [`absolute-territory`,`Absolute Territory`,`Defense`,970,[`anti-magic-carapace`,`sovereign-raiment`],{durability:7,ap:5,energy:4},`領`,`absoluteTerritory`,3,`The first AP-scaled attack after cooldown is reduced by 40%; your next AP action gains 12%.`,`A portable boundary where your rules speak first.`,`Riftbound Original`],
    [`cloak-of-invisibility`,`Cloak of Invisibility`,`Armor`,900,[`afterimage-coat`,`horizon-command`],{speed:8,battleIq:5},`隠`,`invisibility`,3,`After moving 6m, the next conventional attack has a sharply reduced hit chance.`,`A reference cloak that hides intent a fraction before the body.`,`Harry Potter`],
    [`kamui-weave`,`Kamui Weave`,`Armor`,990,[`afterimage-coat`,`anti-magic-carapace`],{speed:7,durability:5,energy:3},`神`,`kamuiWeave`,3,`Once per cooldown, a non-causal hit phases through for 70% damage reduction.`,`The weave teaches matter to become negotiable.`,`Naruto`],
    [`phoenix-regalia`,`Phoenix Regalia`,`Armor`,980,[`mercy-protocol`,`sovereign-raiment`],{ap:5,regeneration:7,energy:4},`鳳`,`phoenix`,5,`Once per fight, revive at 32% HP in a solar burst that damages nearby enemies.`,`Ash is only the garment's folded state.`,`Phoenix myth`],
    [`celestial-dragonscale`,`Celestial Dragonscale`,`Armor`,950,[`worldskin`,`constellation-robe`],{as:4,ap:4,durability:8},`龍`,`dragonscale`,3,`Alternating AS and AP actions grants 6% stacking damage resistance, up to 18%.`,`Scale taken from a dragon reflected in a dead world's sky.`,`Riftbound Original`],
    [`red-stone-of-aja`,`Red Stone of Aja`,`Relic`,1030,[`paradox-engine`,`archmage-circuit`],{ap:8,iq:4,energy:4},`赤`,`aja`,3,`A beam or energy attack is refracted once per cooldown for 26% additional AP damage.`,`A flawless reference gem that turns a narrow ray into destiny.`,`JoJo's Bizarre Adventure`],
    [`requiem-arrowhead`,`Requiem Arrowhead`,`Relic`,1100,[`causal-abacus`,`godhand-array`,`saint-of-zero`],{as:4,ap:7,battleIq:6},`矢`,`requiemArrow`,5,`Once per combat, a Stand Ultimate at full charge gains 22% damage and refunds 25 Ultimate charge.`,`An arrow fragment that recognizes resolve but promises nothing.`,`JoJo's Bizarre Adventure`],
    [`dragon-balls-sevenfold`,`Sevenfold Dragon Orbs`,`Relic`,1080,[`infinite-reservoir`,`perfect-algorithm`],{energy:8,regeneration:5,iq:4},`星`,`sevenfold`,5,`Once per fight at low HP, restore 28% HP and 35% Energy. No wish can trigger twice.`,`Seven reference orbs gathered into one rule-bound relic.`,`Dragon Ball`],
    [`death-note-fragment`,`Death Note Fragment`,`Relic`,960,[`abyssal-codex`,`perfect-algorithm`],{ap:7,iq:7,battleIq:3},`死`,`deathNote`,4,`Damage against a target below 18% HP executes conventional life unless death immunity or causal authority forbids it.`,`One page, enough room for a conclusion and its conditions.`,`Death Note`],
    [`omnitrix-prime`,`Omnitrix Prime`,`Relic`,1060,[`hellbound-covenant`,`perfect-algorithm`],{as:5,ap:5,durability:4,energy:4},`⌚`,`omnitrix`,4,`Transformation actions grant a form-matched +2 AS or AP and a 15% max-HP shield.`,`A reference device translating survival into the right body.`,`Ben 10`],
    [`one-ring-of-absence`,`One Ring of Absence`,`Relic`,1000,[`paradox-engine`,`abyssal-codex`],{ap:7,speed:4,iq:3},`環`,`oneRing`,3,`At low HP, become obscured for one turn; outgoing AP damage rises 15%, but healing falls 35%.`,`A reference ring whose emptiness wants an owner.`,`The Lord of the Rings`],
    [`six-eyes-monocle`,`Six Eyes Monocle`,`Magic`,1020,[`archmage-circuit`,`perfect-algorithm`],{ap:9,iq:7,energy:5},`六`,`sixEyesItem`,2,`AP action costs are reduced 8%, and the first high-cost technique each cooldown gains 14% damage.`,`A lens that imitates impossible perception without inheriting its soul.`,`Jujutsu Kaisen`],
    [`grimoire-of-infinite-pages`,`Grimoire of Infinite Pages`,`Magic`,1050,[`abyssal-codex`,`infinite-reservoir`],{ap:10,energy:7,range:3},`∞`,`infiniteGrimoire`,3,`Casting three different Specials primes a free 24% spell echo. Repeats do not advance the page.`,`Its final page is always the spell you have not learned yet.`,`Riftbound Original`],
    [`spiral-core-drill`,`Spiral Core Drill`,`Magic`,1070,[`archmage-circuit`,`godhand-array`],{as:6,ap:8,energy:5},`螺`,`spiralDrill`,3,`Hybrid and Spiral attacks gain 18% damage while Energy exceeds 70%.`,`A reference drill that treats every ceiling as temporary.`,`Gurren Lagann`],
    [`anti-life-equation-shard`,`Anti-Life Equation Shard`,`Magic`,1110,[`abyssal-codex`,`causal-abacus`,`hellbound-covenant`],{ap:11,iq:6},`Ω`,`antiLife`,4,`Once per cooldown, an AP Ultimate applies despair and reduces the target's AP and BIQ by 2.`,`A reference theorem too incomplete to end free will, but complete enough to wound it.`,`DC Comics`],
    [`fists-of-the-north-star`,`Fists of the North Star`,`Physical`,990,[`godhand-array`,`bloodstar-drive`],{as:11,combatSkill:7},`拳`,`northStar`,3,`Every fifth physical action detonates delayed pressure points for 30% bonus damage.`,`A reference discipline that leaves the verdict inside the target.`,`Fist of the North Star`],
    [`gauntlet-of-six-stones`,`Gauntlet of Six Stones`,`Physical`,1130,[`godhand-array`,`paradox-engine`,`sovereign-raiment`],{as:8,ap:8,durability:5},`∞`,`sixStones`,5,`After an Ultimate, the next action gains 20% hybrid damage, a shield, and a unique cosmic burst.`,`A reference gauntlet carrying echoes, not ownership, of six impossible laws.`,`Marvel`],
    [`blade-of-olympus`,`Blade of Olympus`,`Physical`,1040,[`rift-duelist-arsenal`,`hellbound-covenant`],{as:10,ap:5,durability:3},`Ω`,`olympusBlade`,3,`Physical Ultimates consume 10% current Energy to deal 24% bonus hybrid damage.`,`A reference blade that remembers what gods fear about mortals.`,`God of War`],
    [`speed-force-tachyon`,`Speed Force Tachyon`,`Utility`,1010,[`afterimage-coat`,`paradox-engine`],{speed:11,energy:4,battleIq:4},`ϟ`,`tachyon`,3,`Moving 10m charges an afterimage; the next action gains 18% damage and cannot be conventionally countered.`,`A reference particle forever arriving from the next instant.`,`DC Comics`],
    [`compass-of-the-outer-rift`,`Compass of the Outer Rift`,`Utility`,940,[`horizon-command`,`perfect-algorithm`],{range:7,iq:5,battleIq:7},`⎈`,`outerCompass`,2,`Aimed attacks reveal their scaling, cover line, and gain 12% damage beyond 12m.`,`Its needle points beyond the map and is usually correct.`,`Riftbound Original`],
    [`save-crystal-zero`,`Save Crystal Zero`,`Utility`,1090,[`infinite-reservoir`,`saint-of-zero`,`paradox-engine`],{durability:5,energy:6,regeneration:5},`◇`,`saveCrystal`,5,`Once per fight, record the start of your turn. Lethal damage returns combat resources to that record without changing inventory or Shards.`,`A crystal that saves a fighter, never a purchase.`,`Riftbound Original`],
  ];
  legends.forEach(([id,name,category,price,recipe,stats,glyph,passiveId,cooldown,passive,lore,reference]) => add({id,name,rarity:`Legendary`,category,price,recipe,stats,glyph,passiveId,cooldown,passive,lore,reference,tags:[`unique`,`buildDefining`]}));

  const byId = new Map(items.map(item => [item.id, item]));
  for (const item of items) {
    const direct = item.recipe.reduce((sum, id) => sum + (byId.get(id)?.price || 0), 0);
    item.combineCost = item.recipe.length ? Math.max(12, item.price - direct) : 0;
    Object.freeze(item);
  }
  return Object.freeze(items);
})();
const RIFT_ITEM_BY_ID = new Map(RIFT_ITEM_CATALOG.map(item => [item.id, item]));
function RIFT_ITEM(id) { return RIFT_ITEM_BY_ID.get(id) || null; }
