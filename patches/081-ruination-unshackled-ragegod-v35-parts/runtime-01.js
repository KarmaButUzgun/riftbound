const RIFT_V35_MARKER=`Riftbound Sovereigns of Ruin V35`;
const RIFT_V35_VERSION=35;
const RIFT_V35_RUINED=`Ruined King`,RIFT_V35_UNSHACKLED=`The Unshackled`,RIFT_V35_RAGEGOD=`Ragegod`;
const RIFT_V35_RAGE_MAX=100,RIFT_V35_TAKEOVER_TURNS=5,RIFT_V35_WRATH_TURNS=5;
const RIFT_V35_COPY=(value)=>value==null?value:P(value);
const RIFT_V35_MOVE=(name,description,cost,power,destruction,tags=[],hits=1,glyph=`✦`)=>({name,description,cost,power,destruction,tags:[...tags],hits,glyph});

/* ---------- NEW POWERS ---------- */
const RIFT_V35_RUINED_POWER={
 name:RIFT_V35_RUINED,rarity:`Legendary`,damageType:`Hybrid`,glyph:`♚`,accent:`#54f0a3`,reference:`League of Legends · Viego`,
 passive:`TAKEOVER — enemies killed by the Ruined King leave wraiths. Attack a wraith to possess its body for 5 owner turns, heal 20% max HP, and temporarily inherit its stats, items, passive shell, and first three techniques. Its Ultimate is never inherited; Heartbreaker replaces it and is free while possessed. Heartbreaker immediately ejects Viego from the body.`,
 codexDescription:`The Black Mist turns defeated enemies into temporary identities. Harrowed Path is a persistent camouflage zone, Spectral Maw combines a short body dash with a separate stunning mist projectile, and Heartbreaker cashes possession into an execution teleport.`,
 moves:[
  RIFT_V35_MOVE(`Blade of the Ruined King`,`Thrust the spectral zweihander through a short directional lane. The hit gains bonus Physical damage equal to 10% of the victim's current HP. A successful hit refreshes this technique immediately.`,14,.92,1.15,[`physical`,`melee`,`line`,`scalingAS`,`v35ViegoQ`],1,`劍`),
  RIFT_V35_MOVE(`Spectral Maw`,`Dash a short distance while launching a concentrated Black Mist projectile down the same line. The projectile scales with AP and stuns the first enemy it catches.`,20,1.06,.72,[`magic`,`projectile`,`dash`,`stun`,`scalingAP`,`v35ViegoW`],1,`霧`),
  RIFT_V35_MOVE(`Harrowed Path`,`Spread the Black Mist across a large region for 3 turns. Inside it your Movement spend is 1.5× efficient, weapon attacks and Strike are more accurate, and you are invisible to direct targeting until you attack. Area effects can still hit you.`,24,0,.25,[`magic`,`field`,`stealth`,`v35ViegoE`],1,`闇`),
  RIFT_V35_MOVE(`Heartbreaker`,`Teleport into the selected impact zone and rupture it with the spectral blade. Damage rises against missing HP. While possessing a body this cast is free and immediately ends Takeover.`,100,1.62,2.2,[`physical`,`teleport`,`area`,`scalingAS`,`v35Heartbreaker`,`allEnergy`],1,`心`),
 ]
};
const RIFT_V35_UNSHACKLED_POWER={
 name:RIFT_V35_UNSHACKLED,rarity:`Legendary`,damageType:`Hybrid`,glyph:`⛓`,accent:`#8fe7dd`,reference:`League of Legends · Sylas`,
 passive:`PETRICITE BURST — casting a technique stores one Petricite charge, up to 3. Strike consumes one charge to release bonus AP damage in an AOE centered on Sylas. Charges persist until spent, but never between floors.`,
 codexDescription:`A close-range spell thief built around chain geometry and opponent knowledge. Chain Lash leaves a delayed detonation, Abscond opens a two-turn Abduct recast, and Hijack steals the enemy Ultimate that is actually available now.`,
 moves:[
  RIFT_V35_MOVE(`Chain Lash`,`Lash both chains so they intersect at the aimed point for AS damage. One turn later the same coordinate erupts in a Petricite explosion that deals AP damage.`,16,.9,.85,[`physical`,`line`,`scalingAS`,`v35ChainLash`],1,`╳`),
  RIFT_V35_MOVE(`Kingslayer`,`Dash into fixed Strike range, slam the target with AP damage, and heal for 20% of damage actually dealt. This range does not scale from the Range stat.`,22,1.22,.7,[`magic`,`melee`,`dashAttack`,`scalingAP`,`v35Kingslayer`],1,`王`),
  RIFT_V35_MOVE(`Abscond`,`Dash to a nearby valid point. For the next 2 owner turns, Abduct becomes available as the chain recast.`,18,0,.25,[`movement`,`dash`,`v35Abscond`],1,`↗`),
  RIFT_V35_MOVE(`Hijack`,`At 50% Ultimate, steal one currently available enemy Ultimate and store a free cast. After stealing from that enemy once, every later theft from the same enemy costs 100% Ultimate. Borrowed techniques use Sylas's stats and waive their original passive prerequisites.`,0,0,.15,[`command`,`copy`,`v35Hijack`,`selfCast`],1,`奪`),
 ]
};
const RIFT_V35_ABDUCT_MOVE=RIFT_V35_MOVE(`Abduct`,`Fire a long Petricite chain at an enemy. On hit, stun them and grapple yourself toward their body. Cannot target objects.`,0,.46,.35,[`magic`,`projectile`,`tether`,`dashAttack`,`stun`,`v35Abduct`],1,`鏈`);
const RIFT_V35_SUPER=g.find(power=>power.name===`Super Strength`);
const RIFT_V35_RAGE_COSTS=[0,18,24];
const RIFT_V35_RAGE_MOVES=(RIFT_V35_SUPER?.moves||[]).slice(0,3).map((move,index)=>({...RIFT_V35_COPY(move),cost:0,tags:[...(move.tags||[]),`v35RageMove`,`v35RageCost:${RIFT_V35_RAGE_COSTS[index]||0}`],rageCost:RIFT_V35_RAGE_COSTS[index]||0}));
const RIFT_V35_RAGEGOD_POWER={
 name:RIFT_V35_RAGEGOD,rarity:`Calamity`,rarityLabel:`Calamity · Clear Floor 10 with Super Strength`,enemyRollable:false,damageType:`Physical`,glyph:`☠`,accent:`#ff5648`,reference:`Riftbound · Berserker Ascension`,
 passive:`BERSERKER — Energy is replaced by Rage. Taking damage fills Rage and Super Strength techniques spend it. Reaching 100% ignites Berserker Mode; Rage then drains every owner turn until empty while incoming damage can refill it. Berserker raises Speed, Attack Strength, Durability, and Regeneration, with the bonus scaling from AP.`,
 codexDescription:`A Calamity evolution unlocked by proving Super Strength through Floor 10. AS builds keep the inherited physical kit reliable; AP builds deliberately sacrifice neutral consistency to cash in on a much more violent Berserker transformation.`,
 moves:[...RIFT_V35_RAGE_MOVES,RIFT_V35_MOVE(`Wrath of the Undying`,`For 5 owner turns lethal damage is clamped above 1% max HP. Causality can still kill you — unless Berserker Mode is active, in which case even Causality cannot finish you until Wrath ends.`,0,0,.2,[`selfCast`,`v35Wrath`,`ultimate`],1,`怒`)]
};
for(const power of [RIFT_V35_RUINED_POWER,RIFT_V35_UNSHACKLED_POWER,RIFT_V35_RAGEGOD_POWER])if(!g.some(entry=>entry.name===power.name))g.push(power);
try{for(const power of [RIFT_V35_RUINED_POWER,RIFT_V35_UNSHACKLED_POWER,RIFT_V35_RAGEGOD_POWER])RIFT_V22_REGISTRY?.powers?.set(power.name,power)}catch{}
if(typeof Ee===`object`)Ee.Calamity=Math.max(Number(Ee.Calamity||0),5200);

/* Ragegod meta gate: clearing Floor 10 means a Super Strength run has advanced to Floor 11. */
const RIFT_V35_META_KEY=`riftbound-v35-meta`;
function RIFT_V35_META(){try{return{ragegodUnlocked:false,...JSON.parse(localStorage.getItem(RIFT_V35_META_KEY)||`{}`)}}catch{return{ragegodUnlocked:false}}}
function RIFT_V35_SAVE_META(meta){try{localStorage.setItem(RIFT_V35_META_KEY,JSON.stringify(meta))}catch{}return meta}
