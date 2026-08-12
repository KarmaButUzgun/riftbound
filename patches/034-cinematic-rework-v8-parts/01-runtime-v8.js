/* Riftbound Cinematic Rework V8 · literal canon-authentic ultimates and transformations */
const RIFT_CINEMATIC_V8_VERSION=8;
const RIFT_CINEMATIC_V8_BASE_Ds=Ds;
const RIFT_CINEMATIC_V8_BASE_SPARTAN=RIFT_SPARTAN_CINEMATIC;
const RIFT_CINEMATIC_V8_BASE_REQUIEM=RIFT_REQUIEM_OVERLAY;
const RIFT_CINEMATIC_V8_P=(id,stage,subject,prop,action,impact,primary,secondary,chapter,beats)=>({id,stage,subject,prop,action,impact,primary,secondary,chapter,beats});
const RIFT_CINEMATIC_V8_ULTIMATES={
  'Stand Manifestation::Stand Covenant':RIFT_CINEMATIC_V8_P('stand-covenant','rooftop','stand-user','stand','summon','aura','#76e8ff','#b78cff','THE WILL BEHIND THE BODY TAKES SHAPE',['BREATH','MANIFEST','STAND']),
  'Super Strength::Great Power':RIFT_CINEMATIC_V8_P('great-power','street','brawler','fist','punch','crater','#ff784e','#ffd36b','ONE PUNCH MOVES THE STREET',['PLANT','WIND','IMPACT']),
  'Speedster::Time Portal':RIFT_CINEMATIC_V8_P('time-portal','highway','speedster','clock','run-rewind','rewind','#50eaff','#f6fbff','THE RUNNER OVERTAKES HIS OWN HISTORY',['SPRINT','BREAK TIME','RETURN']),
  'Pyrokinesis::Inferno':RIFT_CINEMATIC_V8_P('inferno','burning-city','fire-caster','fireball','firestorm','burn-field','#ff542e','#ffbd54','THE GROUND KEEPS BURNING AFTER THE SPELL ENDS',['IGNITE','SPREAD','INFERNO']),
  'Cryokinesis::Absolute Zero':RIFT_CINEMATIC_V8_P('absolute-zero','frozen-street','ice-caster','ice','freeze-wave','ice-prison','#bff8ff','#61bfff','HEAT LEAVES THE BATTLEFIELD',['FROST','LOCK','ABSOLUTE ZERO']),
  'Electrokinesis::Thunder God':RIFT_CINEMATIC_V8_P('thunder-god','storm-city','storm-caster','lightning','thunderfall','electrical-crater','#f5ff65','#7ee8ff','THE SKY FINDS A CONDUCTOR',['CHARGE','ASCEND','STRIKE']),
  'Aerokinesis::Worldstorm':RIFT_CINEMATIC_V8_P('worldstorm','storm-plains','wind-caster','cyclone','worldstorm','debris-ring','#d4fbff','#83d8ff','THE AIR BECOMES A WEAPON SYSTEM',['DRAW IN','SPIN','WORLDSTORM']),
  'Earthshaping::Continental Rupture':RIFT_CINEMATIC_V8_P('continental-rupture','fault-city','earth-caster','fault','rupture','city-split','#d78b58','#ffca75','THE LAND ITSELF BREAKS FORMATION',['ROOT','FRACTURE','RUPTURE']),
  'Hydrokinesis::Primordial Ocean':RIFT_CINEMATIC_V8_P('primordial-ocean','coast-city','water-caster','wave','tidal-rise','flood','#45a8ff','#b4f2ff','THE HORIZON STANDS UP',['DRAW','RISE','DROWN']),
  'Telekinesis::Telekinetic Compression':RIFT_CINEMATIC_V8_P('telekinetic-compression','ruined-courtyard','psychic','debris','compress','implosion','#c78bff','#f0d9ff','EVERY LOOSE OBJECT CHOOSES THE SAME CENTER',['LIFT','ORBIT','CRUSH']),
  'Shadow Manipulation::Shadow Burial':RIFT_CINEMATIC_V8_P('shadow-burial','moonlit-alley','shadow-caster','shadow-hands','drag-down','shadow-grave','#8d5eea','#17111f','THE TARGET LOSES THE RIGHT TO STAND IN LIGHT',['DIM','GRASP','BURY']),
  'Light Manipulation::Heaven’s Lance':RIFT_CINEMATIC_V8_P('heavens-lance','sunlit-ruins','light-caster','light-lance','sky-lance','piercing-flare','#fff8b0','#87eaff','A WEAPON OF LIGHT DESCENDS IN A STRAIGHT LINE',['FOCUS','ALIGN','DESCEND']),
  'Biomancy::Perfect Organism':RIFT_CINEMATIC_V8_P('perfect-organism','laboratory','biomancer','cells','metamorphosis','regrowth','#75ff9e','#f8c3ff','THE BODY REWRITES ITS OWN FAILURE',['TEAR','REBUILD','PERFECT']),
  'Decay::Let it all be destroyed.':RIFT_CINEMATIC_V8_P('decay-city','dense-city','shigaraki','hand','decay-spread','disintegration','#c9b9ff','#51435e','FIVE FINGERS TOUCH THE CITY',['TOUCH','CRACK','ERASE']),
  'Gravity Manipulation::Event Horizon':RIFT_CINEMATIC_V8_P('event-horizon','city-square','gravity-caster','black-hole','collapse','singularity','#9a79ff','#ff7896','EVERYTHING NEARBY STARTS FALLING SIDEWAYS',['BEND','PULL','HORIZON']),
  'Spatial Manipulation::Dimensional Severance':RIFT_CINEMATIC_V8_P('dimensional-severance','industrial-zone','space-caster','rift-blade','space-cut','severed-world','#74eaff','#ff80cf','THE CUT DOES NOT FOLLOW THE WALL',['AIM','SPLIT SPACE','SEVER']),
  'Soul Manipulation::Soul Exile':RIFT_CINEMATIC_V8_P('soul-exile','grave-court','soul-caster','soul','extract','spirit-gate','#7ee9ff','#d28bff','BODY AND SOUL STOP AGREEING',['GRIP','SEPARATE','EXILE']),
  'Chronostasis::Stopped World':RIFT_CINEMATIC_V8_P('stopped-world','clock-street','chronomancer','clock','time-stop','frozen-scene','#85e8ff','#ffe59c','THE SECOND HAND STOPS BETWEEN NUMBERS',['TICK','HALT','ACT']),
  'Fate Manipulation::Inevitable End':RIFT_CINEMATIC_V8_P('inevitable-end','fate-theatre','fate-caster','red-thread','sever-fate','doom','#ff95ca','#f7d7ff','THE FUTURE IS TIED BEFORE IT ARRIVES',['READ','BIND','END']),
  'Concept Erasure::Erase Being':RIFT_CINEMATIC_V8_P('erase-being','white-room','eraser','nameplate','erase','absence','#ff6f96','#ffffff','THE TARGET DISAPPEARS ONE DEFINITION AT A TIME',['NAME','REMOVE','ABSENCE']),
  'Reactive Evolution::Apex Form':RIFT_CINEMATIC_V8_P('apex-form','battlefield-lab','evolver','adaptive-armor','adapt','apex-shell','#93ff9d','#73dfff','EVERY WOUND BECOMES A BLUEPRINT',['RECORD','CHANGE','APEX']),
  'Cosmic Dominion::End of All Things':RIFT_CINEMATIC_V8_P('end-of-all-things','solar-system','cosmic-caster','planet','cosmic-collapse','stellar-end','#79eaff','#ff6f9e','PLANETS BECOME DEBRIS BEFORE THE HAND CLOSES',['ORBIT','COLLAPSE','END']),
  'Sonokinesis::World Symphony':RIFT_CINEMATIC_V8_P('world-symphony','concert-city','sound-caster','sound-ring','resonance','shatter-wave','#86efff','#ef9dff','THE CITY IS FORCED INTO THE SAME NOTE',['TUNE','RESONATE','BREAK']),
  'Alchemy::Philosopher’s Sun':RIFT_CINEMATIC_V8_P('philosophers-sun','stone-hall','alchemist','transmutation','transmute-sun','golden-burst','#ffd869','#ff8866','THE CIRCLE CLOSES AND MATTER ANSWERS',['ARRAY','TRANSMUTE','SUN']),
  'Blood Sorcery::Scarlet Eclipse':RIFT_CINEMATIC_V8_P('scarlet-eclipse','blood-moon','blood-mage','blood-blades','blood-eclipse','hemorrhage','#e5254f','#73112b','EVERY WOUND ANSWERS THE MOON',['DRAW BLOOD','ECLIPSE','RETURN']),
  'Ferrokinetics::Iron Tempest':RIFT_CINEMATIC_V8_P('iron-tempest','scrapyard','metal-caster','metal-shards','metal-storm','shrapnel','#b9d3df','#ffae62','THE SCRAPYARD BECOMES AMMUNITION',['MAGNETIZE','AIM','TEMPEST']),
  'Runeweaving::World Formula':RIFT_CINEMATIC_V8_P('world-formula','rune-floor','runecaster','rune-tablet','inscribe-world','formula-burst','#6de8ff','#ff9fdb','THE FLOOR FINISHES THE EQUATION',['INSCRIBE','LINK','SOLVE']),
