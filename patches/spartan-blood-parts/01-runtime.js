const RIFT_SPARTAN_VERSION = 1;
const RIFT_SPARTAN_RACE = `Spartan Blood`;
const RIFT_SPARTAN_HUMAN = `Human of Sparta`;
const RIFT_SPARTAN_DEVIL = `Devil of Sparta`;
const RIFT_SPARTAN_STYLES = [`Trickster`,`Royal Guard`,`Swordmaster`,`Gunslinger`];
const RIFT_SPARTAN_WEAPON_IDS = Object.freeze({
  rebellion:`rebellion-devil-greatsword`,
  ebony:`ebony-ivory`,
  yamato:`yamato-riftcutter`,
  beowulf:`beowulf-devil-arms`,
  mirage:`mirage-edge`,
  sparda:`sparda-devil-sword`,
});
const RIFT_SPARTAN_PASSIVE_CHANNELS = Object.freeze({
  rebellionResource:`rebellionResource`,
  ebonyIvoryTwinHit:`ebonyIvoryTwinHit`,
  yamatoMovementTheft:`yamatoMovementTheft`,
  beowulfDemonicBeam:`beowulfDemonicBeam`,
  mirageUltimateDrain:`mirageUltimateDrain`,
  spardaLivingLegacy:`spardaLivingLegacy`,
});

if (!d.some(entry => entry.name === RIFT_SPARTAN_RACE)) d.push({
  name:RIFT_SPARTAN_RACE,
  rarity:`Mythic`,
  description:`Three equipped weapon slots inside the six-slot inventory, +45% natural Stat XP, sealed manual stat investment, reforging, and superior regeneration.`,
  glyph:`血`,
});

if (!g.some(entry => entry.name === RIFT_SPARTAN_HUMAN)) g.push({
  name:RIFT_SPARTAN_HUMAN,
  rarity:`Mythic`,
  rarityLabel:`Mythical`,
  passive:`Flair replaces the visible Energy economy. Taunts, critical hits, and kills build Flair; Style Switch rewrites all three techniques.`,
  damageType:`Hybrid`,
  glyph:`D`,
  accent:`#ff294f`,
  moves:[
    m(`Backflip`,`Trickster movement that can fire through a crossed hostile.`,0,0,0,[`spardaBackflip`,`selfCast`]),
    m(`Let's Rock!`,`Throw the current weapon into the battlefield until it is physically recovered.`,0,1.12,1.15,[`physical`,`weapon`,`projectile`,`spardaLetsRock`]),
    m(`Over Here!`,`Blitz the close area repeatedly with the current weapon.`,0,.36,1.05,[`physical`,`weapon`,`multi`,`selfAoe`,`spardaOverHere`],5),
    m(`Devil Trigger`,`Assume the crimson winged devil form for four owner turns.`,100,0,0,[`spardaDevilTrigger`,`spardaHumanTrigger`,`selfCast`]),
  ],
});

if (!g.some(entry => entry.name === RIFT_SPARTAN_DEVIL)) g.push({
  name:RIFT_SPARTAN_DEVIL,
  rarity:`Mythic`,
  rarityLabel:`Mythical`,
  passive:`Four Combo bars remove move cooldowns in sequence, unlock lifesteal and bonus weapon switching, then let Yamato replace Devil Trigger with Judgement Cut.`,
  damageType:`Hybrid`,
  glyph:`V`,
  accent:`#9b61ff`,
  moves:[
    m(`Air Combo`,`A rising weapon sequence adapted to the current Devil Arm.`,0,.52,1,[`physical`,`weapon`,`multi`,`spardaAirCombo`],3),
    m(`Heavy Swing`,`A committed Devil Arm blow adapted to the current weapon.`,0,1.35,1.8,[`physical`,`weapon`,`heavy`,`spardaHeavySwing`]),
    m(`Blitz`,`Cross the lane in a weapon-led burst.`,0,1.46,1.65,[`physical`,`weapon`,`spardaBlitz`]),
    m(`Devil Trigger`,`Assume the controlled violet winged devil form for six owner turns.`,100,0,0,[`spardaDevilTrigger`,`spardaDevilTriggerVergil`,`selfCast`]),
  ],
});

function RIFT_SPARTAN_IS(fighter) {
  return !!fighter && (fighter.race?.name === RIFT_SPARTAN_RACE || fighter.power?.name === RIFT_SPARTAN_HUMAN || fighter.power?.name === RIFT_SPARTAN_DEVIL);
}
function RIFT_SPARTAN_KIND(fighter) {
  return fighter?.power?.name === RIFT_SPARTAN_HUMAN ? `human` : fighter?.power?.name === RIFT_SPARTAN_DEVIL ? `devil` : `blood`;
}
function RIFT_SPARTAN_STATE(fighter) {
  if (!RIFT_SPARTAN_IS(fighter)) return null;
  const state = fighter.sparda && typeof fighter.sparda === `object` ? fighter.sparda : {};
  state.version = RIFT_SPARTAN_VERSION;
  state.kind = RIFT_SPARTAN_KIND(fighter);
  state.style = RIFT_SPARTAN_STYLES.includes(state.style) ? state.style : `Trickster`;
  state.flair = M(Number(state.flair)||0,0,100);
  state.comboBars = M(Math.round(Number(state.comboBars)||0),0,4);
  if(state.kind===`devil`&&state.comboBars>3&&fighter.inventory?.[0]?.itemId!==RIFT_SPARTAN_WEAPON_IDS.yamato)state.comboBars=3;
  state.hitCounters = state.hitCounters && typeof state.hitCounters === `object` ? state.hitCounters : {};
  state.unavailable = state.unavailable && typeof state.unavailable === `object` ? state.unavailable : {};
  state.beowulfPrimed = !!state.beowulfPrimed;
  state.empowered = !!state.empowered;
  state.flairLatched = !!state.flairLatched;
  state.devTrigger = state.devTrigger && typeof state.devTrigger === `object` ? state.devTrigger : null;
  state.barrage = state.barrage && typeof state.barrage === `object` ? state.barrage : null;
  state.actionSerial = Math.max(0,Math.round(state.actionSerial||0));
  const owned = new Set((fighter.inventory||[]).filter(Boolean).map(instance=>instance.uid));
  Object.keys(state.unavailable).forEach(uid=>{if(!owned.has(uid))delete state.unavailable[uid]});
  fighter.sparda = state;
  return state;
}
function RIFT_SPARTAN_POWER(fighter,name) { return fighter?.power?.name === name; }
function RIFT_SPARTAN_INSTANCE(fighter,uid) { return (fighter?.inventory||[]).find(instance=>instance?.uid===uid)||null; }
function RIFT_SPARTAN_SLOT(fighter,uid) { return (fighter?.inventory||[]).findIndex(instance=>instance?.uid===uid); }
function RIFT_SPARTAN_UNAVAILABLE(fighter,uid) { return !!RIFT_SPARTAN_STATE(fighter)?.unavailable?.[uid]; }
function RIFT_SPARTAN_EQUIPPED_WEAPONS(fighter) {
  if (!RIFT_SPARTAN_IS(fighter)) return [];
  return [0,1,2].map(slot=>({slot,instance:fighter.inventory?.[slot]||null})).map(entry=>({...entry,item:entry.instance?RIFT_ITEM(entry.instance.itemId):null})).filter(entry=>entry.item?.category===`Weapon`);
}
function RIFT_SPARTAN_ACTIVE_INSTANCE(fighter) {
  const instance=fighter?.inventory?.[0];
  return instance&&RIFT_ITEM(instance.itemId)?.category===`Weapon`&&!RIFT_SPARTAN_UNAVAILABLE(fighter,instance.uid)?instance:null;
}
function RIFT_SPARTAN_ACTIVE_ID(fighter) { return RIFT_SPARTAN_ACTIVE_INSTANCE(fighter)?.itemId||null; }
function RIFT_SPARTAN_REFORGE_LEVEL(fighter,instanceOrUid) {
  const instance=typeof instanceOrUid===`string`?RIFT_SPARTAN_INSTANCE(fighter,instanceOrUid):instanceOrUid;
  return M(Math.round(instance?.reforge||0),0,5);
}
function RIFT_SPARTAN_REFORGE_STRENGTH(fighter,itemId) {
  const current=fighter?.inventory?.[0],instance=current?.itemId===itemId?current:(fighter?.inventory||[]).filter(entry=>entry?.itemId===itemId).sort((a,b)=>RIFT_SPARTAN_REFORGE_LEVEL(fighter,b)-RIFT_SPARTAN_REFORGE_LEVEL(fighter,a))[0];
  return 1+RIFT_SPARTAN_REFORGE_LEVEL(fighter,instance)*.08;
}
function RIFT_SPARTAN_REFORGE_COST(fighter,uid) {
  const instance=RIFT_SPARTAN_INSTANCE(fighter,uid),item=instance?RIFT_ITEM(instance.itemId):null,level=RIFT_SPARTAN_REFORGE_LEVEL(fighter,instance);
  if(!item||level>=5)return 0;
  return Math.max(24,Math.round((item.price*.115+22)*(1+level*.82)));
}
function RIFT_SPARTAN_REFORGE(run,uid) {
  RIFT_NORMALIZE_RUN_BUILD(run);
  if(!RIFT_SPARTAN_IS(run.player))return{ok:false,reason:`Only Spartan Blood can reforge owned items.`};
  const instance=RIFT_SPARTAN_INSTANCE(run.player,uid),item=instance?RIFT_ITEM(instance.itemId):null;
  if(!instance||!item)return{ok:false,reason:`That item is no longer owned.`};
  const level=RIFT_SPARTAN_REFORGE_LEVEL(run.player,instance);
  if(level>=5)return{ok:false,reason:`${item.name} is already Reforge +5.`};
  const cost=RIFT_SPARTAN_REFORGE_COST(run.player,uid);
  if((run.shards||0)<cost)return{ok:false,reason:`Need ${cost-(run.shards||0)} more Shards.`};
  run.shards-=cost;instance.reforge=level+1;instance.invested=Math.max(item.price,instance.invested||0)+cost;
  RIFT_SYNC_WEAPON(run.player);RIFT_REFRESH_ITEM_POOLS(run.player);
  const message=`REFORGED ${item.name} · +${instance.reforge}/5 · ${cost} ◆`;
  run.itemFeed=Array.isArray(run.itemFeed)?run.itemFeed:[];run.itemFeed.push({id:RIFT_UID(`reforge`),tone:`mythical`,message,itemId:item.id});run.itemFeed=run.itemFeed.slice(-8);
  try{G(run,`SPARTAN FORGE // ${message}. Weapon force, item tiers, and compatible passive output rise together.`,`mythic`)}catch{}
  return{ok:true,item,instance,cost,message};
}

const RIFT_SPARTAN_BASE_VR=Vr;
Vr=function(race,trait,tiers){const out=RIFT_SPARTAN_BASE_VR(race,trait,tiers);if(race?.name===RIFT_SPARTAN_RACE){out.as+=1;out.ap+=1;out.combatSkill+=1;out.regeneration+=2}return out};
const RIFT_SPARTAN_BASE_HR=Hr;
Hr=function(name,race,trait,power,weaponType,weapon,tiers){
  if([RIFT_SPARTAN_HUMAN,RIFT_SPARTAN_DEVIL].includes(power?.name)&&race?.name!==RIFT_SPARTAN_RACE)race=P(d.find(entry=>entry.name===RIFT_SPARTAN_RACE));
  const fighter=RIFT_SPARTAN_BASE_HR(name,race,trait,power,weaponType,weapon,tiers);RIFT_SPARTAN_STATE(fighter);return fighter;
};
const RIFT_SPARTAN_BASE_NORMALIZE_FIGHTER=RIFT_NORMALIZE_FIGHTER_BUILD;
RIFT_NORMALIZE_FIGHTER_BUILD=function(fighter){
  const normalized=RIFT_SPARTAN_BASE_NORMALIZE_FIGHTER(fighter);
  if(!normalized)return normalized;
  if([RIFT_SPARTAN_HUMAN,RIFT_SPARTAN_DEVIL].includes(normalized.power?.name)&&normalized.race?.name!==RIFT_SPARTAN_RACE){
    normalized.race=P(d.find(entry=>entry.name===RIFT_SPARTAN_RACE));
    if(!normalized.statuses.spardaRaceCorrected){normalized.tiers.as+=1;normalized.tiers.ap+=1;normalized.tiers.combatSkill+=1;normalized.tiers.regeneration+=2;normalized.statuses.spardaRaceCorrected=1}
  }
  if(RIFT_SPARTAN_IS(normalized)){
    for(let slot=0;slot<3;slot+=1){const instance=normalized.inventory[slot],item=instance?RIFT_ITEM(instance.itemId):null;if(item&&item.category!==`Weapon`){const destination=[3,4,5].find(index=>!normalized.inventory[index]);if(destination!==void 0)[normalized.inventory[slot],normalized.inventory[destination]]=[normalized.inventory[destination],normalized.inventory[slot]]}}
    for(let slot=3;slot<6;slot+=1){const instance=normalized.inventory[slot],item=instance?RIFT_ITEM(instance.itemId):null;if(item?.category===`Weapon`){const destination=[0,1,2].find(index=>!normalized.inventory[index]);if(destination!==void 0)[normalized.inventory[slot],normalized.inventory[destination]]=[normalized.inventory[destination],normalized.inventory[slot]]}}
    RIFT_SYNC_WEAPON(normalized);
  }
  RIFT_SPARTAN_STATE(normalized);return normalized;
};
const RIFT_SPARTAN_BASE_NORMALIZE_RUN=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function(run){const out=RIFT_SPARTAN_BASE_NORMALIZE_RUN(run);if(out?.player)RIFT_SPARTAN_STATE(out.player);if(out?.enemy)RIFT_SPARTAN_STATE(out.enemy);(out?.auxiliaryCombatants||[]).forEach(entry=>RIFT_SPARTAN_STATE(entry?.fighter));return out};

const RIFT_SPARTAN_BASE_STAT_BONUS=RIFT_ITEM_STAT_BONUS;
RIFT_ITEM_STAT_BONUS=function(fighter,stat){
  const base=RIFT_SPARTAN_BASE_STAT_BONUS(fighter,stat);
  if(!RIFT_SPARTAN_IS(fighter))return base;
  return base+(fighter.inventory||[]).filter(Boolean).reduce((sum,instance)=>{const value=Number(RIFT_ITEM(instance.itemId)?.stats?.[stat]||0),level=RIFT_SPARTAN_REFORGE_LEVEL(fighter,instance);return value>0?sum+value*level*.055:sum},0);
};
const RIFT_SPARTAN_BASE_SPEND=RIFT_SPEND_SKILL_POINT;
RIFT_SPEND_SKILL_POINT=function(run,stat){if(run?.player?.race?.name===RIFT_SPARTAN_RACE)return false;return RIFT_SPARTAN_BASE_SPEND(run,stat)};
const RIFT_SPARTAN_BASE_QR=qr;
qr=function(fighter,gains){if(fighter?.race?.name===RIFT_SPARTAN_RACE){gains=Object.fromEntries(Object.entries(gains||{}).map(([key,value])=>[key,Math.max(0,Math.round(Number(value||0)*1.45))]))}return RIFT_SPARTAN_BASE_QR(fighter,gains)};

const RIFT_SPARTAN_BASE_FREE_SLOT=RIFT_FREE_SLOT_FOR;
const RIFT_SPARTAN_BASE_RECIPE_PLAN=RIFT_RECIPE_PLAN;
RIFT_RECIPE_PLAN=function(fighter,itemId){
  const item=RIFT_ITEM(itemId);
  if(item&&[`Legendary`,`Mythical`].includes(item.rarity)&&RIFT_OWNS_ITEM(fighter,item.id))return{ok:false,reason:`Unique ${item.rarity}: only one ${item.name} may be owned.`};
  if(!RIFT_SPARTAN_IS(fighter))return RIFT_SPARTAN_BASE_RECIPE_PLAN(fighter,itemId);
  const original=RIFT_FREE_SLOT_FOR;
  RIFT_FREE_SLOT_FOR=(inventory,target)=>{const range=target?.category===`Weapon`?[0,1,2]:[3,4,5];return range.find(index=>!inventory[index])??-1};
  try{return RIFT_SPARTAN_BASE_RECIPE_PLAN(fighter,itemId)}finally{RIFT_FREE_SLOT_FOR=original}
};
const RIFT_SPARTAN_BASE_MOVE_ITEM=RIFT_MOVE_ITEM;
RIFT_MOVE_ITEM=function(fighter,from,to){
  if(!RIFT_SPARTAN_IS(fighter))return RIFT_SPARTAN_BASE_MOVE_ITEM(fighter,from,to);
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);from=Math.round(Number(from));to=Math.round(Number(to));
  const moving=fighter.inventory?.[from],displaced=fighter.inventory?.[to];
  if(!moving)return{ok:false,reason:`That slot is empty.`};
  const movingWeapon=RIFT_ITEM(moving.itemId)?.category===`Weapon`,displacedWeapon=displaced&&RIFT_ITEM(displaced.itemId)?.category===`Weapon`;
  if(movingWeapon&&to>2||!movingWeapon&&to<3)return{ok:false,reason:movingWeapon?`Spartan weapons occupy slots I, II, or III.`:`Items other than weapons occupy loadout slots 3 to 5.`};
  if(displaced&&(displacedWeapon&&from>2||!displacedWeapon&&from<3))return{ok:false,reason:`That swap would place an item in the wrong Spartan slot group.`};
  return RIFT_SPARTAN_BASE_MOVE_ITEM(fighter,from,to);
};

const RIFT_SPARTAN_BASE_ACTIVE_ITEM=RIFT_ACTIVE_ITEM;
RIFT_ACTIVE_ITEM=function(fighter){const item=RIFT_SPARTAN_BASE_ACTIVE_ITEM(fighter),instance=fighter?.inventory?.[0];return item&&instance&&!RIFT_SPARTAN_UNAVAILABLE(fighter,instance.uid)?item:null};
const RIFT_SPARTAN_BASE_SYNC_WEAPON=RIFT_SYNC_WEAPON;
RIFT_SYNC_WEAPON=function(fighter){
  let weapon=RIFT_SPARTAN_BASE_SYNC_WEAPON(fighter);
  if(!RIFT_SPARTAN_IS(fighter))return weapon;
  const instance=fighter.inventory?.[0],item=instance?RIFT_ITEM(instance.itemId):null;
  if(!item||item.category!==`Weapon`||RIFT_SPARTAN_UNAVAILABLE(fighter,instance.uid))return fighter.weapon=RIFT_EMPTY_WEAPON();
  const level=RIFT_SPARTAN_REFORGE_LEVEL(fighter,instance),factor=1+level*.07;
  weapon.power*=factor;weapon.destruction*=1+level*.06;weapon.reforge=level;weapon.uid=instance.uid;
  weapon.tags=[...new Set([...(weapon.tags||[]),`spardaWeapon:${item.id}`])];
  const profiles={
    [RIFT_SPARTAN_WEAPON_IDS.rebellion]:{range:4.2,power:1.16,destruction:1.55,tags:[`physical`,`weapon`,`heavy`,`greatsword`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.rebellion}`]},
    [RIFT_SPARTAN_WEAPON_IDS.ebony]:{range:22,power:.66,destruction:.38,tags:[`physical`,`weapon`,`projectile`,`multi`,`dualPistols`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.ebony}`]},
    [RIFT_SPARTAN_WEAPON_IDS.yamato]:{range:6.2,power:1.08,destruction:1.08,tags:[`physical`,`magic`,`hybrid`,`weapon`,`crit`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.yamato}`]},
    [RIFT_SPARTAN_WEAPON_IDS.beowulf]:{range:3.8,power:1.24,destruction:1.42,tags:[`physical`,`weapon`,`heavy`,`gauntlets`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.beowulf}`]},
    [RIFT_SPARTAN_WEAPON_IDS.mirage]:{range:5.4,power:1.12,destruction:1.16,tags:[`physical`,`magic`,`hybrid`,`weapon`,`crit`,`spectral`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.mirage}`]},
    [RIFT_SPARTAN_WEAPON_IDS.sparda]:{range:18,power:1.34,destruction:1.78,tags:[`physical`,`magic`,`hybrid`,`weapon`,`heavy`,`spardaLivingLegacy`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.sparda}`]},
  };
  const profile=profiles[item.id];if(profile){weapon={...weapon,...profile,power:profile.power*factor,destruction:profile.destruction*(1+level*.06)};fighter.weapon=weapon}
  return weapon;
};
const RIFT_SPARTAN_BASE_FILTER_WEAPON=RIFT_FILTER_WEAPON_ACTIONS;
RIFT_FILTER_WEAPON_ACTIONS=function(fighter,actions){const filtered=RIFT_SPARTAN_BASE_FILTER_WEAPON(fighter,actions);return RIFT_SPARTAN_IS(fighter)&&!RIFT_SPARTAN_ACTIVE_INSTANCE(fighter)?filtered.filter(action=>action.id!==`weapon`):filtered};
const RIFT_SPARTAN_BASE_SELL=RIFT_SELL_ITEM;
RIFT_SELL_ITEM=function(run,slot){const uid=run?.player?.inventory?.[slot]?.uid,result=RIFT_SPARTAN_BASE_SELL(run,slot);if(result.ok&&uid&&RIFT_SPARTAN_STATE(run.player))delete run.player.sparda.unavailable[uid];return result};

const RIFT_SPARTAN_BASE_ASSIGN_AI=RIFT_ASSIGN_AI_BUILD;
RIFT_ASSIGN_AI_BUILD=function(fighter,floor=1,boss=false){
  const out=RIFT_SPARTAN_BASE_ASSIGN_AI(fighter,floor,boss);
  if(!RIFT_SPARTAN_IS(out))return out;
  const state=RIFT_SPARTAN_STATE(out),preferred=state.kind===`devil`?[RIFT_SPARTAN_WEAPON_IDS.yamato,RIFT_SPARTAN_WEAPON_IDS.beowulf,RIFT_SPARTAN_WEAPON_IDS.mirage]:[RIFT_SPARTAN_WEAPON_IDS.rebellion,RIFT_SPARTAN_WEAPON_IDS.ebony,boss||floor>=10?RIFT_SPARTAN_WEAPON_IDS.sparda:RIFT_SPARTAN_WEAPON_IDS.yamato];
  const nonWeapons=(out.inventory||[]).filter(instance=>instance&&RIFT_ITEM(instance.itemId)?.category!==`Weapon`).slice(0,3);
  out.inventory=Array(6).fill(null);preferred.forEach((id,index)=>out.inventory[index]=RIFT_ITEM_INSTANCE(id,RIFT_ITEM(id).price));nonWeapons.forEach((instance,index)=>out.inventory[index+3]=instance);
  RIFT_SYNC_WEAPON(out);RIFT_REFRESH_ITEM_POOLS(out);return out;
};

function RIFT_SPARTAN_ACTION(id,slot,name,description,glyph,type,tags=[],power=0,destruction=0,hits=1,moveIndex=void 0,extra={}) {
  return {id,slot,name,description,glyph,type,cost:0,move:{name,description,cost:0,power,destruction,hits,tags:[...tags]},moveIndex,sourcePower:extra.sourcePower||`Spartan Blood`,...extra};
}
function RIFT_SPARTAN_WEAPON_TAG(fighter) { const id=RIFT_SPARTAN_ACTIVE_ID(fighter);return id?`spardaWeapon:${id}`:null; }
function RIFT_SPARTAN_STYLE_MOVES(fighter) {
  const state=RIFT_SPARTAN_STATE(fighter),weaponTag=RIFT_SPARTAN_WEAPON_TAG(fighter),weaponName=RIFT_ACTIVE_ITEM(fighter)?.name||`bare hands`,beam=state.beowulfPrimed?[`spardaBeowulfBeam`]:[];
  if(state.style===`Royal Guard`)return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Redirect`,`Guard one incoming projectile and send its resolved force back down the same line.`,`↶`,`special`,[`spardaRedirect`,`selfCast`],0,0,1,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Slam`,`For one enemy exchange, negate a melee hit and counter-slam. A ranged hit or no hit stuns you for one turn.`,`⬡`,`special`,[`spardaSlam`,`selfCast`],0,0,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Perfect Guard`,`The next blocked hit deals zero damage and crushes the attacker's Posture.`,`◈`,`special`,[`spardaPerfectGuard`,`selfCast`],0,0,1,2),
  ];
  if(state.style===`Swordmaster`)return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Slice and Dice`,`A close circular series with ${weaponName}; every component is a real hit.`,`✣`,`special`,[`physical`,`weapon`,`multi`,`selfAoe`,`spardaSliceDice`,...(weaponTag?[weaponTag]:[]),...beam],.34,1.15,4,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Thrust`,`Drive ${weaponName} through the line, then hurl the target into the opposite direction and possible collision.`,`➤`,`special`,[`physical`,`weapon`,`pierce`,`force`,`spardaThrust`,...(weaponTag?[weaponTag]:[]),...beam],1.34,1.72,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Cyclone`,`Double Movement Points and carve the selected route through enemies and objects. Full Flair prevents the recovery stun.`,`◎`,`special`,[`physical`,`weapon`,`spardaCyclone`,...(weaponTag?[weaponTag]:[]),...beam],0,2.1,1,2),
  ];
  if(state.style===`Gunslinger`)return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Bang Bang Bang`,`Dash along the firing line while three automatic shots chase the selected target.`,`双`,`special`,[`physical`,`projectile`,`multi`,`spardaBangBangBang`,...(weaponTag?[weaponTag]:[]),...beam],.4,.55,3,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Headshot`,`A critically tuned shot that pierces ordinary cover and obstacles.`,`⌖`,`special`,[`physical`,`projectile`,`pierce`,`crit`,`spardaHeadshot`,...(weaponTag?[weaponTag]:[]),...beam],1.42,.78,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Barrage`,`Lock one firing direction for three owner turns. Automatic volleys continue while Movement Points are halved.`,`▰`,`special`,[`physical`,`projectile`,`multi`,`spardaBarrage`,...(weaponTag?[weaponTag]:[]),...beam],.25,.66,5,2),
  ];
  return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Backflip`,`Vault to the selected point. Crossing a hostile fires one opportunistic shot without stopping the movement.`,`↟`,`special`,[`physical`,`projectile`,`spardaBackflip`,...beam],0,.35,1,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Let's Rock!`,`Throw ${weaponName} as a physical battlefield object. It remains unavailable until recovered.`,`†`,`special`,[`physical`,`weapon`,`projectile`,`spardaLetsRock`,...(weaponTag?[weaponTag]:[]),...beam],1.16,1.3,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Over Here!`,`Repeatedly blitz the close area with ${weaponName}; current weapon shape and on-hit effects are preserved.`,`✦`,`special`,[`physical`,`weapon`,`multi`,`selfAoe`,`spardaOverHere`,...(weaponTag?[weaponTag]:[]),...beam],.37,1.25,5,2),
  ];
}
function RIFT_SPARTAN_DEVIL_MOVES(fighter) {
  const id=RIFT_SPARTAN_ACTIVE_ID(fighter),tag=id?`spardaWeapon:${id}`:`spardaUnarmed`,beam=RIFT_SPARTAN_STATE(fighter).beowulfPrimed?[`spardaBeowulfBeam`]:[];
  if(id===RIFT_SPARTAN_WEAPON_IDS.yamato)return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Bury the Light`,`A rising Yamato sequence that launches and stuns a target not already airborne.`,`閻`,`special`,[`physical`,`magic`,`hybrid`,`weapon`,`multi`,`spardaBuryLight`,tag,...beam],.47,1.05,4,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Power of Sparta`,`Send a travelling Yamato tornado forward until solid terrain ends its line.`,`颶`,`special`,[`physical`,`magic`,`hybrid`,`weapon`,`line`,`spardaPowerSparta`,tag,...beam],1.08,1.55,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Where Is Your Motivation?`,`A controlled storm of Yamato slices. Every cut runs on-hit effects; Combo advances only once.`,`絶`,`special`,[`physical`,`magic`,`hybrid`,`weapon`,`multi`,`crit`,`spardaMotivation`,tag,...beam],.31,1.45,7,2),
  ];
  if(id===RIFT_SPARTAN_WEAPON_IDS.beowulf)return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Uppercut`,`Beowulf launches the target into a longer aerial lock.`,`拳`,`special`,[`physical`,`weapon`,`heavy`,`spardaUppercut`,tag,...beam],1.22,1.35,1,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Crush`,`A segmented Beowulf earthquake travels through the selected lane and shatters objects in sequence.`,`裂`,`special`,[`physical`,`weapon`,`line`,`heavy`,`spardaCrush`,tag,...beam],1.38,2.15,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Destroy`,`Leap to a selected area and drive Beowulf down in a destructive impact shorter than the Prime inheritance jump.`,`墜`,`special`,[`physical`,`weapon`,`heavy`,`area`,`spardaDestroy`,tag,...beam],1.65,2.35,1,2),
  ];
  if(id===RIFT_SPARTAN_WEAPON_IDS.mirage)return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Spectral Sword`,`Mirage Edge leaves the inventory, attacks independently for one owner turn with valid on-hit effects, then returns.`,`幻`,`special`,[`physical`,`magic`,`hybrid`,`weapon`,`multi`,`spardaSpectralSword`,tag,...beam],.58,1.05,2,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Command`,`Command Mirage Edge independently for two owner turns. It returns and automatically becomes current.`,`令`,`special`,[`physical`,`magic`,`hybrid`,`weapon`,`spardaMirageCommand`,tag,...beam],1.22,1.35,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Soar`,`Bonus action. Mirage Edge yields to the next weapon, doubles Movement Points, grants temporary flight, and cuts every crossed hostile.`,`翔`,`special`,[`physical`,`magic`,`hybrid`,`weapon`,`bonusAction`,`spardaSoar`,tag,...beam],0,1.2,1,2),
  ];
  return[
    RIFT_SPARTAN_ACTION(`power-1`,5,`Air Combo`,`A rising three-hit sequence adapted to the current Devil Arm.`,`↟`,`special`,[`physical`,`weapon`,`multi`,`spardaAirCombo`,tag,...beam],.5,1.05,3,0),
    RIFT_SPARTAN_ACTION(`power-2`,6,`Heavy Swing`,`Commit the current Devil Arm to a crushing, posture-heavy swing.`,`⬣`,`special`,[`physical`,`weapon`,`heavy`,`spardaHeavySwing`,tag,...beam],1.38,1.85,1,1),
    RIFT_SPARTAN_ACTION(`power-3`,7,`Blitz`,`Cross the attack lane in a fast Devil Arm burst.`,`ϟ`,`special`,[`physical`,`weapon`,`line`,`spardaBlitz`,tag,...beam],1.48,1.65,1,2),
  ];
}
function RIFT_SPARTAN_ACTIONS(fighter,baseActions) {
  if(!RIFT_SPARTAN_IS(fighter))return baseActions;
  const state=RIFT_SPARTAN_STATE(fighter),kind=state.kind;
  let actions=baseActions.map(action=>({...action}));
  const set=(id,replacement)=>{const index=actions.findIndex(action=>action.id===id);if(index>=0)actions[index]=replacement;else actions.push(replacement)};
  const active=RIFT_ACTIVE_ITEM(fighter),weapon=actions.find(action=>action.id===`weapon`);
  if(weapon){weapon.cost=0;weapon.description=`CURRENT WEAPON · ${active?.name||fighter.weapon.name}. Spartan Blood attacks do not spend the hidden Energy reserve.`;weapon.move={name:weapon.name,description:weapon.description,cost:0,power:0,destruction:0,tags:[`spardaStandardWeapon`,...(RIFT_SPARTAN_WEAPON_TAG(fighter)?[RIFT_SPARTAN_WEAPON_TAG(fighter)]:[])]}}
  if(kind===`human`){
    if(state.style===`Gunslinger`)set(`strike`,RIFT_SPARTAN_ACTION(`strike`,1,`Shoot`,`A ranged replacement for Strike. Damage climbs with distance to the target.`,`⌖`,`strike`,[`physical`,`projectile`,`spardaShoot`],.8,.3));
    set(`rest`,RIFT_SPARTAN_ACTION(`rest`,3,`Taunt`,`Deal no damage. Perform a randomized pose, dance, gun trick, or roast to generate Flair.`,`♪`,`rest`,[`spardaTaunt`,`selfCast`]));
    RIFT_SPARTAN_STYLE_MOVES(fighter).forEach(move=>set(move.id,move));
    set(`ultimate`,RIFT_SPARTAN_ACTION(`ultimate`,8,`Devil Trigger`,`Transform into a red and crimson winged demon for four owner turns. Full Flair extends it by two.`,`魔`,`ultimate`,[`spardaDevilTrigger`,`spardaHumanTrigger`,`selfCast`],0,0,1,3,{sourcePower:RIFT_SPARTAN_HUMAN}));
    RIFT_SPARTAN_STYLES.filter(style=>style!==state.style).forEach((style,index)=>actions.push(RIFT_SPARTAN_ACTION(`sparda-style-${qt(style)}`,`S${index+1}`,`Style Switch · ${style}`,`Use the full turn to enter ${style}. All three style techniques update immediately.`,`◆`,`rest`,[`spardaStyleSwitch:${style}`,`selfCast`])));
  } else if(kind===`devil`){
    if(state.comboBars>3&&RIFT_SPARTAN_ACTIVE_ID(fighter)!==RIFT_SPARTAN_WEAPON_IDS.yamato)state.comboBars=3;
    set(`rest`,RIFT_SPARTAN_ACTION(`rest`,3,`Recover`,`Restore a small amount of HP through a restrained violet pulse. One owner turn cooldown.`,`◒`,`rest`,[`spardaRecover`,`selfCast`]));
    RIFT_SPARTAN_DEVIL_MOVES(fighter).forEach(move=>set(move.id,move));
    const judgement=state.comboBars>=4&&RIFT_SPARTAN_ACTIVE_ID(fighter)===RIFT_SPARTAN_WEAPON_IDS.yamato;
    set(`ultimate`,judgement?RIFT_SPARTAN_ACTION(`ultimate`,8,`Judgement Cut`,`Choose a large area. Time stops, many cuts queue, the blade sheathes, and every impact resolves together without ending an active Devil Trigger.`,`閻`,`ultimate`,[`physical`,`magic`,`hybrid`,`weapon`,`spardaJudgementCut`],0,3.3,12,3,{sourcePower:RIFT_SPARTAN_DEVIL}):RIFT_SPARTAN_ACTION(`ultimate`,8,`Devil Trigger`,`Transform into a controlled purple and violet winged demon for six owner turns.`,`魔`,`ultimate`,[`spardaDevilTrigger`,`spardaDevilTriggerVergil`,`selfCast`],0,0,1,3,{sourcePower:RIFT_SPARTAN_DEVIL}));
  }
  const switchBonus=kind===`devil`&&state.comboBars>=3;
  RIFT_SPARTAN_EQUIPPED_WEAPONS(fighter).filter(entry=>entry.slot!==0&&!RIFT_SPARTAN_UNAVAILABLE(fighter,entry.instance.uid)).forEach((entry,index)=>actions.push(RIFT_SPARTAN_ACTION(`sparda-switch-${entry.instance.uid}`,`W${index+1}`,`${switchBonus?`Bonus `:``}Switch · ${entry.item.name}`,`${switchBonus?`Combo bar 3 converts this to a Bonus Action.`:`Uses the full action.`} The selected weapon becomes current immediately.`,`↻`,`rest`,[`spardaWeaponSwitch`,...(switchBonus?[`bonusAction`]:[]),`selfCast`],0,0,1,void 0,{weaponUid:entry.instance.uid})));
  return actions;
}
const RIFT_SPARTAN_BASE_LA=La;
La=function(fighter){return RIFT_SPARTAN_ACTIONS(fighter,RIFT_SPARTAN_BASE_LA(fighter))};

const RIFT_SPARTAN_BASE_TT=Tt;
Tt=function(action,fighter){
  const tags=action?.move?.tags||[];
  const has=tag=>tags.includes(tag),self=()=>({requiresAim:false,shape:`self`,range:0,radius:4,ignoresCover:true,label:`SELF`,naturalRange:true});let profile;
  if(tags.some(tag=>tag.startsWith(`spardaStyleSwitch:`))||has(`spardaWeaponSwitch`)||has(`spardaTaunt`)||has(`spardaRecover`)||has(`spardaRedirect`)||has(`spardaSlam`)||has(`spardaPerfectGuard`)||has(`spardaDevilTrigger`))profile=self();
  else if(has(`spardaBackflip`))profile={requiresAim:true,shape:`teleport`,range:14,radius:2.4,ignoresCover:true,label:`BACKFLIP · OBSTACLE HOP`,naturalRange:true};
  else if(has(`spardaCyclone`))profile={requiresAim:true,shape:`line`,range:26,radius:3.2,ignoresCover:false,label:`CYCLONE ROUTE`,naturalRange:true};
  else if(has(`spardaSoar`))profile={requiresAim:true,shape:`teleport`,range:24,radius:3.2,ignoresCover:true,label:`SOAR ROUTE`,naturalRange:true};
  else if(has(`spardaJudgementCut`))profile={requiresAim:true,shape:`area`,range:48,radius:13,ignoresCover:true,label:`JUDGEMENT FIELD`,naturalRange:true};
  else if(has(`spardaOverHere`))profile={requiresAim:true,shape:`area`,range:18,radius:10,ignoresCover:true,label:`SELECTED BLITZ AREA`,naturalRange:true};
  else if(has(`spardaSliceDice`))profile={requiresAim:false,shape:`area`,range:0,radius:7,ignoresCover:true,label:`CLOSE AREA`,naturalRange:true};
  else if(has(`spardaDestroy`))profile={requiresAim:true,shape:`area`,range:18,radius:7.5,ignoresCover:false,label:`DEMONIC DESCENT`,naturalRange:true};
  else if(has(`spardaCrush`))profile={requiresAim:true,shape:`line`,range:28,radius:4.2,ignoresCover:false,label:`SEGMENTED EARTHQUAKE`,naturalRange:true};
  else if(has(`spardaPowerSparta`))profile={requiresAim:true,shape:`line`,range:32,radius:5.5,ignoresCover:false,label:`TRAVELLING TORNADO`,naturalRange:true};
  else if(has(`spardaBarrage`))profile={requiresAim:true,shape:`cone`,range:32,radius:5.8,ignoresCover:false,label:`FIXED FIRING DIRECTION`,naturalRange:true};
  else if(has(`spardaHeadshot`))profile={requiresAim:true,shape:`projectile`,range:40,radius:1.8,ignoresCover:true,label:`COVER-PIERCING HEADSHOT`,naturalRange:true};
  else if(has(`spardaShoot`)||has(`spardaBangBangBang`))profile={requiresAim:true,shape:`projectile`,range:has(`spardaShoot`)?28:24,radius:2.2,ignoresCover:false,label:`GUNFIRE`,naturalRange:true};
  else if(has(`spardaThrust`)||has(`spardaMotivation`)||has(`spardaBlitz`))profile={requiresAim:true,shape:`line`,range:has(`spardaThrust`)?13:15,radius:2.8,ignoresCover:false,label:`WEAPON LINE`,naturalRange:true};
  else if(has(`spardaHeavySwing`))profile={requiresAim:true,shape:`cone`,range:9,radius:4.5,ignoresCover:false,label:`DIRECTIONAL HEAVY SWEEP`,naturalRange:true};
  else if(has(`spardaBuryLight`)||has(`spardaUppercut`)||has(`spardaAirCombo`)||has(`spardaSpectralSword`))profile={requiresAim:true,shape:`melee`,range:6,radius:2.7,ignoresCover:false,label:`DEVIL ARM REACH`,naturalRange:true};
  else profile=RIFT_SPARTAN_BASE_TT(action,fighter);
  if(has(`spardaBeowulfBeam`)&&profile&&!has(`selfCast`))profile={...profile,requiresAim:true,shape:profile.shape===`area`?`area`:profile.shape===`line`?`line`:`beam`,range:Math.max(24,profile.range||0),ignoresCover:false,label:`BEOWULF · MOVE-SHAPED DEMONIC BEAM`};
  return profile;
};

const RIFT_SPARTAN_BASE_KR=kr;
kr=(fighter,target)=>RIFT_SPARTAN_POWER(fighter,RIFT_SPARTAN_HUMAN)?fighter.ultimate>=80:RIFT_SPARTAN_POWER(fighter,RIFT_SPARTAN_DEVIL)?fighter.ultimate>=100:RIFT_SPARTAN_BASE_KR(fighter,target);
const RIFT_SPARTAN_BASE_VA=Va;
function RIFT_SPARTAN_MOVE_COOLDOWN_KEY(fighter,action){const state=RIFT_SPARTAN_STATE(fighter);return state&&[`human`,`devil`].includes(state.kind)&&Number.isFinite(action?.moveIndex)&&action.moveIndex>=0&&action.moveIndex<3?`standardCooldown_spartan-${state.kind}_${action.moveIndex}`:null}
Va=function(fighter,action){const state=RIFT_SPARTAN_STATE(fighter),key=RIFT_SPARTAN_MOVE_COOLDOWN_KEY(fighter,action);if(key){if(state.kind===`devil`&&state.comboBars>=action.moveIndex+1)return 0;return Math.max(0,Math.ceil(fighter.statuses[key]||0))}return RIFT_SPARTAN_BASE_VA(fighter,action)};
const RIFT_SPARTAN_BASE_HA=Ha;
Ha=function(fighter,action){
  const state=RIFT_SPARTAN_STATE(fighter),key=RIFT_SPARTAN_MOVE_COOLDOWN_KEY(fighter,action);
  if(key){if(state.kind===`devil`&&state.comboBars>=action.moveIndex+1){delete fighter.statuses[key];return}const turns=state.kind===`human`&&state.devTrigger&&action.moveIndex===2?2:action.moveIndex+1;fighter.statuses[key]=Math.max(fighter.statuses[key]||0,turns+1);return}
  RIFT_SPARTAN_BASE_HA(fighter,action);
};
const RIFT_SPARTAN_BASE_WA=Wa;
Wa=function(action,fighter,wide=false){const tags=action?.move?.tags||[],state=RIFT_SPARTAN_STATE(fighter);if(!state)return RIFT_SPARTAN_BASE_WA(action,fighter,wide);if(tags.includes(`spardaWeaponSwitch`))return tags.includes(`bonusAction`)?`BONUS SWITCH`:`FULL ACTION`;if(tags.some(tag=>tag.startsWith(`spardaStyleSwitch:`)))return`STYLE TURN`;if(tags.includes(`spardaTaunt`))return`GENERATES FLAIR`;if(tags.includes(`spardaRecover`))return fighter.statuses.spardaRecoverCooldown>0?`${Math.max(1,fighter.statuses.spardaRecoverCooldown-1)}T COOLDOWN`:`RECOVER READY`;return state.kind===`human`?`FLAIR TECHNIQUE · FREE`:`COMBO ${state.comboBars}/4 · FREE`};
const RIFT_SPARTAN_BASE_GA=Ga;
Ga=function(move,fighter){const tags=move?.tags||[],state=RIFT_SPARTAN_STATE(fighter);if(!state)return RIFT_SPARTAN_BASE_GA(move,fighter);if(tags.includes(`spardaJudgementCut`))return`100% ULTIMATE · COMBO 4 · YAMATO`;if(tags.includes(`spardaDevilTrigger`))return`${state.kind===`human`?`80`:`100`}% ULTIMATE`;return state.kind===`human`?`${Math.round(state.flair)}% FLAIR · NO ENERGY`:`COMBO ${state.comboBars}/4 · NO ENERGY`};
const RIFT_SPARTAN_BASE_KA=Ka;
Ka=function(fighter,target){const state=RIFT_SPARTAN_STATE(fighter);if(!state)return RIFT_SPARTAN_BASE_KA(fighter,target);return state.kind===`human`?`${Math.round(fighter.ultimate)}% TRIGGER · ${Math.round(state.flair)}% FLAIR · ${state.style.toUpperCase()}`:`${Math.round(fighter.ultimate)}% TRIGGER · COMBO ${state.comboBars}/4${state.devTrigger?` · DT ${state.devTrigger.turns}T`:``}`};
const RIFT_SPARTAN_BASE_LR=Lr;
Lr=fighter=>RIFT_SPARTAN_POWER(fighter,RIFT_SPARTAN_HUMAN)?`Flair`:RIFT_SPARTAN_POWER(fighter,RIFT_SPARTAN_DEVIL)?`Combo`:RIFT_SPARTAN_BASE_LR(fighter);

function RIFT_SPARTAN_BLOCK_REASON(run,action,fighter) {
  const state=RIFT_SPARTAN_STATE(fighter);if(!state)return null;const tags=action?.move?.tags||[];
  if(tags.includes(`spardaRecover`)&&(fighter.statuses.spardaRecoverCooldown||0)>0)return`Recover cooldown · ${Math.max(1,Math.ceil(fighter.statuses.spardaRecoverCooldown-1))} owner turn`;
  if(tags.includes(`spardaDevilTrigger`)&&state.devTrigger)return`Devil Trigger is already active · ${state.devTrigger.turns} owner turns remain`;
  if(tags.includes(`spardaDevilTrigger`)&&fighter.ultimate<(state.kind===`human`?80:100))return`Devil Trigger requires ${state.kind===`human`?80:100}% Ultimate charge`;
  if(tags.includes(`spardaJudgementCut`)){if(state.comboBars<4)return`Judgement Cut requires Combo bar 4`;if(RIFT_SPARTAN_ACTIVE_ID(fighter)!==RIFT_SPARTAN_WEAPON_IDS.yamato)return`Judgement Cut requires Yamato as current weapon`;if(fighter.ultimate<100)return`Judgement Cut requires full Ultimate charge`}
  if(run&&tags.includes(`spardaWeaponSwitch`)&&tags.includes(`bonusAction`)&&fighter.statuses.spardaSwitchTurn===run.turn)return`Bonus weapon switch already used this turn`;
  if(run&&tags.includes(`spardaSoar`)&&fighter.statuses.spardaSoarTurn===run.turn)return`Soar bonus action already used this turn`;
  if(tags.includes(`spardaLetsRock`)&&!RIFT_SPARTAN_ACTIVE_INSTANCE(fighter))return`No current weapon can be thrown`;
  return null;
}
const RIFT_SPARTAN_BASE_QA=qa;
qa=function(run,action,resolving,locked,target){const custom=RIFT_SPARTAN_BLOCK_REASON(run,action,run.player);return custom||RIFT_SPARTAN_BASE_QA(run,action,resolving,locked,target)};

function RIFT_SPARTAN_VFX(run,fighter,kind,target=null,options={}) {
  if(!run?.battlefield?.effectEchoes)return;const actorId=RIFT_ACTOR_ID_FOR_FIGHTER(run,fighter),origin=actorId?{...W(run,actorId)}:{x:50,y:32},destination=target?{...target}:{...origin},human=RIFT_SPARTAN_KIND(fighter)===`human`;
  run.battlefield.effectEchoes.push({id:`sparda-${kind}-${F()}`,className:`sparda-vfx sparda-${kind} ${human?`dante-red`:`vergil-violet`}`,shape:options.shape||`area`,motion:options.motion||`burst`,origin,target:destination,radius:options.radius||6,accent:options.accent||(human?`#ff244d`:`#9d62ff`),secondary:options.secondary||`#ffffff`,tertiary:options.tertiary||(human?`#32000b`:`#120027`),signature:options.signature||kind,turns:options.turns||2});
}
function RIFT_SPARTAN_LOG(run,fighter,lines,tone=`mythic`) { try{G(run,N(lines),tone)}catch{} }
function RIFT_SPARTAN_GAIN_FLAIR(run,fighter,amount,reason) {
  const state=RIFT_SPARTAN_STATE(fighter);if(state?.kind!==`human`)return 0;
  if(state.style===`Trickster`)amount*=1.18;
  const before=state.flair;state.flair=M(state.flair+amount,0,100);
  if(state.flair>=100&&!state.flairLatched){state.flairLatched=true;state.empowered=true;if(fighter.ultimate<80)fighter.ultimate=M(fighter.ultimate+35,0,100);RIFT_SPARTAN_VFX(run,fighter,`flair-max`,null,{radius:8});RIFT_SPARTAN_LOG(run,fighter,[`SMOKIN' SEXY STYLE // ${fighter.name} reaches 100% Flair. The next damaging move is empowered.`,`FLAIR MAXIMUM // ${fighter.name}'s next attack becomes the performance's red-hot finish.`])}
  if(state.flair>before)try{G(run,`FLAIR +${Math.round(state.flair-before)} // ${reason} · ${Math.round(state.flair)}%`,fighter===run.player?`player`:`enemy`)}catch{}
  return state.flair-before;
}
function RIFT_SPARTAN_CONSUME_FLAIR(run,fighter,label) {
  const state=RIFT_SPARTAN_STATE(fighter);if(!state?.empowered)return false;state.empowered=false;state.flair=0;state.flairLatched=false;RIFT_SPARTAN_LOG(run,fighter,[`FLAIR RELEASE // ${label} consumes the full style gauge in a crimson finish.`,`JACKPOT // Full Flair detonates through ${label}; the gauge returns to zero.`]);return true;
}
function RIFT_SPARTAN_ACTOR(run,fighter){return RIFT_ACTOR_ID_FOR_FIGHTER(run,fighter)||Do(run,fighter)?.id||null}
function RIFT_SPARTAN_HOSTILES(run,actorId){const actor=U(run,actorId);return actor?H(run).filter(entry=>entry.id!==actorId&&entry.fighter.hp>0&&entry.team!==actor.team):[]}
function RIFT_SPARTAN_RAW(attacker,target,power=1){const offense=Y(attacker,`ap`),defense=Y(target,`durability`);return(26+offense*4.5)*power*1.105**(offense-defense)*lt(.94,1.06)}
function RIFT_SPARTAN_PATH_TARGETS(run,actorId,start,end,width=3){return RIFT_SPARTAN_HOSTILES(run,actorId).filter(entry=>dt(W(run,entry.id),start,end)<=width+O&&I(start,W(run,entry.id))<=I(start,end)+O)}
function RIFT_SPARTAN_FINISH_EARLY(fighter,action){fighter.lastMove=P(action);Ha(fighter,action);fighter.lastActions=[action.type,...(fighter.lastActions||[])].slice(0,3)}
function RIFT_SPARTAN_MARK_ATTACK(run,fighter,action,hit,damage,target,context={}){RIFT_SPARTAN_RESOLVE_ACTION(run,fighter,target,action,{hit,critical:false,damage,tags:action.move?.tags||[],actorId:context.actorId,targetId:context.targetId,early:true})}

function RIFT_SPARTAN_SWITCH_WEAPON(run,fighter,uid,bonus=false) {
  const slot=RIFT_SPARTAN_SLOT(fighter,uid),state=RIFT_SPARTAN_STATE(fighter);if(slot<1||slot>2||state.unavailable[uid])return false;
  [fighter.inventory[0],fighter.inventory[slot]]=[fighter.inventory[slot],fighter.inventory[0]];RIFT_SYNC_WEAPON(fighter);fighter.statuses.spardaSwitchTurn=run.turn;if(bonus)fighter.statuses.bonusWindow=1;
  if(state.kind===`devil`&&state.comboBars>3&&RIFT_SPARTAN_ACTIVE_ID(fighter)!==RIFT_SPARTAN_WEAPON_IDS.yamato){state.comboBars=3;RIFT_SPARTAN_LOG(run,fighter,[`COMBO BAR 4 RELEASED // Maximum Combo requires Yamato as the current weapon.`],fighter===run.player?`player`:`enemy`)}
  RIFT_SPARTAN_VFX(run,fighter,`weapon-switch`,W(run,RIFT_SPARTAN_ACTOR(run,fighter)),{motion:`dash`,shape:`line`,radius:3});
  RIFT_SPARTAN_LOG(run,fighter,[`DEVIL ARM SWITCH // ${fighter.name} draws ${RIFT_ACTIVE_ITEM(fighter)?.name}. Every weapon-dependent move updates immediately.`,`WEAPON CHANGE // ${RIFT_ACTIVE_ITEM(fighter)?.name} takes the current slot${bonus?` without yielding the turn`:``}.`],fighter===run.player?`player`:`enemy`);return true;
}
function RIFT_SPARTAN_DETACH_WEAPON(run,fighter,mode,remaining,target,autoEquip=false) {
  const state=RIFT_SPARTAN_STATE(fighter),instance=RIFT_SPARTAN_ACTIVE_INSTANCE(fighter);if(!state||!instance)return null;
  const item=RIFT_ITEM(instance.itemId),actorId=RIFT_SPARTAN_ACTOR(run,fighter),position=target?{...target}:{...W(run,actorId)};
  state.unavailable[instance.uid]={uid:instance.uid,itemId:instance.itemId,mode,remaining,position,autoEquip,ownerId:actorId,detachedTurn:run.turn};
  run.battlefield.features.push({id:`sparda-weapon-${instance.uid}`,kind:`spardaWeapon`,label:`${item.name} · ${mode.toUpperCase()}`,position,radius:1.4,solid:false,cover:0,destructible:false,integrity:1,maxIntegrity:1,accent:item.accent,ownerId:actorId,weaponUid:instance.uid});
  const replacement=RIFT_SPARTAN_EQUIPPED_WEAPONS(fighter).find(entry=>entry.slot>0&&!state.unavailable[entry.instance.uid]);if(replacement)[fighter.inventory[0],fighter.inventory[replacement.slot]]=[fighter.inventory[replacement.slot],fighter.inventory[0]];
  RIFT_SYNC_WEAPON(fighter);RIFT_SPARTAN_VFX(run,fighter,mode,position,{shape:`projectile`,motion:`projectile`,radius:4,accent:item.accent});return state.unavailable[instance.uid];
}
function RIFT_SPARTAN_RETURN_WEAPON(run,fighter,uid,autoEquip=false) {
  const state=RIFT_SPARTAN_STATE(fighter),entry=state?.unavailable?.[uid];if(!entry)return false;delete state.unavailable[uid];run.battlefield.features=run.battlefield.features.filter(feature=>feature.weaponUid!==uid);
  const slot=RIFT_SPARTAN_SLOT(fighter,uid);if(autoEquip&&slot>0)[fighter.inventory[0],fighter.inventory[slot]]=[fighter.inventory[slot],fighter.inventory[0]];RIFT_SYNC_WEAPON(fighter);
  const item=RIFT_ITEM(entry.itemId);RIFT_SPARTAN_VFX(run,fighter,`weapon-return`,W(run,RIFT_SPARTAN_ACTOR(run,fighter)),{shape:`line`,motion:`projectile`,radius:3,accent:item?.accent});RIFT_SPARTAN_LOG(run,fighter,[`DEVIL ARM RETURN // ${item?.name||`The weapon`} snaps back into ${fighter.name}'s three-slot rack.`,`WEAPON RECOVERED // ${fighter.name} reclaims ${item?.name||`the detached weapon`}${autoEquip?` as current`:``}.`]);return true;
}

function RIFT_SPARTAN_JUDGEMENT_CUT(run,fighter,action,context) {
  const state=RIFT_SPARTAN_STATE(fighter),center=action.aim?.target||W(run,context.targetId),actorId=context.actorId,radius=13;
  if(!state||state.comboBars<4||RIFT_SPARTAN_ACTIVE_ID(fighter)!==RIFT_SPARTAN_WEAPON_IDS.yamato||fighter.ultimate<100)return false;
  fighter.ultimate=0;fighter.statuses.spardaCinematic={kind:`judgement`,title:`JUDGEMENT CUT`,subtitle:`All outcomes arrive after the sheathe.`,ttl:2,activatedTurn:run.turn};
  run.timeState={mode:`stopped`,ownerId:actorId,remainingTurns:0,queuedDamage:[],startedTurn:run.turn,counterActorId:null,counterUsed:false};
  RIFT_SPARTAN_VFX(run,fighter,`judgement-field`,center,{shape:`area`,radius,accent:`#e7193f`,secondary:`#ffffff`,tertiary:`#160022`,turns:3});
  for(let index=0;index<18;index+=1){const angle=Math.PI*2*index/18,r=2+(index%6)*1.7,point={x:M(center.x+Math.cos(angle)*r,1,run.battlefield.width-1),y:M(center.y+Math.sin(angle)*r,1,run.battlefield.height-1)};RIFT_SPARTAN_VFX(run,fighter,`judgement-cut`,point,{shape:`line`,motion:`beam`,radius:2.2,accent:index%3===0?`#ff294f`:`#ffffff`,secondary:`#b87aff`,turns:3})}
  const victims=H(run).filter(entry=>entry.id!==actorId&&entry.fighter.hp>0&&I(W(run,entry.id),center)<=radius+O);
  victims.forEach(entry=>{for(let cut=0;cut<9&&entry.fighter.hp>0&&!run.timelineRestoredByKcr;cut+=1)go(run,fighter,entry.fighter,RIFT_SPARTAN_RAW(fighter,entry.fighter,.22),true,[`physical`,`magic`,`hybrid`,`weapon`,`spardaJudgementCut`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.yamato}`,`noCounter`])});
  if(run.timelineRestoredByKcr){try{G(run,`REVERT TO ZERO // Judgement Cut's stopped interval returns to a point before Yamato could leave its sheath.`,`mythic`)}catch{}return true}
  run.battlefield.features.filter(feature=>feature.integrity>0&&I(feature.position,center)<=radius+feature.radius).forEach(feature=>Io(run,feature,fighter,Math.max(55,Math.round(Y(fighter,`as`)*8+Y(fighter,`ap`)*7)),`Judgement Cut convergence`));
  RIFT_SPARTAN_LOG(run,fighter,[`JUDGEMENT CUT // Violet time locks around the selected field. ${victims.length} target${victims.length===1?``:`s`} receive nine silent cuts each. Yamato clicks into its sheath.`,`BLADE SHEATHED // White circles collapse inside one red boundary. The frozen damage has nowhere left to wait.`]);
  _o(run);if(run.timelineRestoredByKcr)return true;state.attackedTurn=run.turn;state.comboBars=4;RIFT_SPARTAN_FINISH_EARLY(fighter,action);return true;
}

function RIFT_SPARTAN_AERIALIZE(fighter,turns,includeSpentTurn=false) {
  if(!fighter||turns<=0)return;const current=fighter.statuses.spardaAerialFlight,state=RIFT_SPARTAN_STATE(fighter);
  fighter.statuses.spardaAerialFlight={turns:Math.max(current?.turns||0,turns+(includeSpentTurn?1:0)),baseFlight:current?.baseFlight??(state?.devTrigger?!!state.devTrigger.baseFlight:!!fighter.flight)};fighter.flight=true;
}

function RIFT_SPARTAN_EXECUTE_EARLY(run,attacker,target,action,context={}) {
  const state=RIFT_SPARTAN_STATE(attacker);if(!state)return false;const tags=action?.move?.tags||[],has=tag=>tags.includes(tag),actorId=context.actorId||RIFT_SPARTAN_ACTOR(run,attacker),aim=action.aim?.target;
  const blocked=RIFT_SPARTAN_BLOCK_REASON(run,action,attacker);if(blocked){try{G(run,`SPARTAN ACTION DENIED // ${blocked}.`,context.tone||`system`)}catch{}return true}
  if(has(`spardaJudgementCut`))return RIFT_SPARTAN_JUDGEMENT_CUT(run,attacker,action,{...context,actorId});
  if(has(`spardaTaunt`)){
    const taunts=[`slides into a shameless dance and points at the enemy on the beat`,`spins both hands through an imaginary gun trick, then blows smoke from empty fingers`,`leans on the current weapon as if the battlefield were a quiet bar`,`offers a theatrical bow, waits for applause, and supplies it personally`,`looks the enemy over and asks if that was supposed to be intimidating`,`rolls one shoulder, grins, and mouths “Come on.”`];
    const line=N(taunts);RIFT_SPARTAN_GAIN_FLAIR(run,attacker,state.style===`Trickster`?34:27,`Taunt · ${state.style}`);if(state.style===`Trickster`)attacker.statuses.spardaTauntDodge=2;
    state.tauntSerial=(Math.round(state.tauntSerial||0)+1)%6;attacker.statuses.spardaTauntPose={variant:state.tauntSerial,activatedTurn:run.turn};RIFT_SPARTAN_VFX(run,attacker,`taunt`,W(run,actorId),{radius:5});RIFT_SPARTAN_LOG(run,attacker,[`TAUNT // ${attacker.name} ${line}.`,`STYLE WITHOUT DAMAGE // ${attacker.name} ${line}. Flair answers the audacity.`],attacker===run.player?`player`:`enemy`);RIFT_SPARTAN_FINISH_EARLY(attacker,action);return true;
  }
  if(has(`spardaRecover`)){
    const healed=oo(attacker,Math.max(1,Math.round(attacker.maxHp*.075)));attacker.statuses.spardaRecoverCooldown=2;RIFT_SPARTAN_VFX(run,attacker,`recover`,W(run,actorId),{radius:4,accent:`#9d62ff`});RIFT_SPARTAN_LOG(run,attacker,[`RECOVER // A restrained violet pulse closes ${healed} HP of damage. No flourish is wasted.`,`DEVIL BLOOD RECOVERY // ${attacker.name} restores ${healed} HP and returns Yamato-hand calm to the stance.`],attacker===run.player?`player`:`enemy`);RIFT_SPARTAN_FINISH_EARLY(attacker,action);return true;
  }
  const styleTag=tags.find(tag=>tag.startsWith(`spardaStyleSwitch:`));if(styleTag){state.style=styleTag.slice(18);attacker.statuses.spardaStyleFlash=2;RIFT_SPARTAN_VFX(run,attacker,`style-${qt(state.style)}`,W(run,actorId),{radius:6});RIFT_SPARTAN_LOG(run,attacker,[`STYLE SWITCH // ${state.style.toUpperCase()} takes all three technique slots.`,`${state.style.toUpperCase()} // ${attacker.name}'s stance, footwork, and weapon posture change together.`],attacker===run.player?`player`:`enemy`);RIFT_SPARTAN_FINISH_EARLY(attacker,action);return true}
  if(has(`spardaWeaponSwitch`)){RIFT_SPARTAN_SWITCH_WEAPON(run,attacker,action.weaponUid,has(`bonusAction`));RIFT_SPARTAN_FINISH_EARLY(attacker,action);return true}
  if(has(`spardaDevilTrigger`)){
    const human=state.kind===`human`,flairExtended=human&&state.flair>=100,duration=(human?4:6)+(flairExtended?2:0);attacker.ultimate=0;if(flairExtended){state.flair=0;state.empowered=false;state.flairLatched=false}
    state.devTrigger={kind:human?`dante`:`vergil`,turns:duration,activatedTurn:run.turn,baseFlight:!!attacker.flight};attacker.flight=true;attacker.statuses.spardaCinematic={kind:human?`dante-trigger`:`vergil-trigger`,title:`DEVIL TRIGGER`,subtitle:human?`Crimson instinct tears free.`:`Violet power accepts its shape.`,ttl:2,activatedTurn:run.turn};
    RIFT_SPARTAN_VFX(run,attacker,human?`dante-trigger`:`vergil-trigger`,W(run,actorId),{radius:11,accent:human?`#ff153f`:`#8f4dff`,turns:4});RIFT_SPARTAN_LOG(run,attacker,human?[`DEVIL TRIGGER // Crimson armor erupts across ${attacker.name}. Horns, claws, and broad red wings tear open as style becomes anatomy.`,`DANTE DEVIL FORM // A red demonic silhouette breaks through the human pose for ${duration} owner turns.`]:[`DEVIL TRIGGER // Violet armor locks into place with controlled precision. Crowned horns and blade-like wings unfold without wasted motion.`,`VERGIL DEVIL FORM // Cool demonic light sharpens ${attacker.name} into a purple winged executioner for ${duration} owner turns.`]);RIFT_SPARTAN_FINISH_EARLY(attacker,action);return true;
  }
  if(has(`spardaRedirect`)||has(`spardaSlam`)||has(`spardaPerfectGuard`)){
    const stance=has(`spardaRedirect`)?`redirect`:has(`spardaSlam`)?`slam`:`perfect`;attacker.statuses.spardaRoyalStance={kind:stance,setTurn:run.turn,triggered:false};attacker.guard=true;RIFT_SPARTAN_VFX(run,attacker,`royal-${stance}`,W(run,actorId),{radius:5,accent:`#ffd86a`});RIFT_SPARTAN_LOG(run,attacker,[`ROYAL GUARD · ${stance.toUpperCase()} // ${attacker.name} fixes the stance for the next incoming exchange.`,`ROYAL RELEASE ARMED // ${stance.toUpperCase()} waits at the exact point of contact.`]);RIFT_SPARTAN_FINISH_EARLY(attacker,action);return true;
  }
  if(has(`spardaOverHere`)){
    if(!aim)return true;const victims=RIFT_SPARTAN_HOSTILES(run,actorId).filter(entry=>I(W(run,entry.id),aim)<=10+O);let total=0,hits=0,multiplier=1;
    if(state.beowulfPrimed&&has(`spardaBeowulfBeam`)){state.beowulfPrimed=false;multiplier*=1.26;RIFT_SPARTAN_LOG(run,attacker,[`BEOWULF · DEMONIC BEAM // The primed force expands through the selected blitz field.`])}
    if(state.kind===`human`&&state.empowered){RIFT_SPARTAN_CONSUME_FLAIR(run,attacker,`Over Here!`);multiplier*=1.34}
    const hitTags=[`physical`,`weapon`,`multi`,`spardaOverHere`,...(has(`spardaBeowulfBeam`)?[`magic`,`beam`,`spardaBeowulfBeam`]:[]),...(RIFT_SPARTAN_WEAPON_TAG(attacker)?[RIFT_SPARTAN_WEAPON_TAG(attacker)]:[])];
    victims.forEach(entry=>{for(let strike=0;strike<5&&entry.fighter.hp>0;strike+=1){total+=go(run,attacker,entry.fighter,RIFT_SPARTAN_RAW(attacker,entry.fighter,.28*multiplier),has(`spardaBeowulfBeam`),hitTags);hits+=1}});
    RIFT_SPARTAN_VFX(run,attacker,`over-here`,aim,{shape:`area`,motion:`dash`,radius:10});RIFT_SPARTAN_LOG(run,attacker,[`OVER HERE! // ${attacker.name} redraws the selected field with ${hits} weapon pass${hits===1?``:`es`} for ${total} total damage.`]);RIFT_SPARTAN_FINISH_EARLY(attacker,action);RIFT_SPARTAN_MARK_ATTACK(run,attacker,action,hits>0,total,target,{...context,actorId});return true;
  }
  if(has(`spardaBangBangBang`)){
    if(!aim)return true;const start={...W(run,actorId)},dx=aim.x-start.x,dy=aim.y-start.y,length=Math.max(1,Math.hypot(dx,dy)),travel=Math.min(8,length),end=Wi(run.battlefield,{x:start.x+dx/length*travel,y:start.y+dy/length*travel},Ft(run,actorId).map(entry=>entry.position));let total=0,hits=0,multiplier=1;
    if(state.beowulfPrimed&&has(`spardaBeowulfBeam`)){state.beowulfPrimed=false;multiplier*=1.26}if(state.empowered){RIFT_SPARTAN_CONSUME_FLAIR(run,attacker,`Bang Bang Bang`);multiplier*=1.34}
    for(let shot=1;shot<=3;shot+=1){const ratio=shot/3,point={x:start.x+(end.x-start.x)*ratio,y:start.y+(end.y-start.y)*ratio},victim=RIFT_SPARTAN_HOSTILES(run,actorId).filter(entry=>I(point,W(run,entry.id))<=24).sort((a,b)=>I(point,W(run,a.id))-I(point,W(run,b.id)))[0];if(victim){total+=go(run,attacker,victim.fighter,RIFT_SPARTAN_RAW(attacker,victim.fighter,.4*multiplier),has(`spardaBeowulfBeam`),[`physical`,`projectile`,`spardaBangBangBang`,...(has(`spardaBeowulfBeam`)?[`magic`,`beam`,`spardaBeowulfBeam`]:[]),...(RIFT_SPARTAN_WEAPON_TAG(attacker)?[RIFT_SPARTAN_WEAPON_TAG(attacker)]:[])]);hits+=1;RIFT_SPARTAN_VFX(run,attacker,`bang-bang-bang`,W(run,victim.id),{shape:`projectile`,motion:`projectile`,radius:2})}}
    ki(run,actorId,end);Vt(run,attacker,end,attacker===run.player?`player`:`enemy`);RIFT_SPARTAN_LOG(run,attacker,[`BANG BANG BANG // ${attacker.name} dashes ${I(start,end).toFixed(1)}m while ${hits} tracking shot${hits===1?``:`s`} select the nearest valid opponent at each beat.`]);RIFT_SPARTAN_FINISH_EARLY(attacker,action);RIFT_SPARTAN_MARK_ATTACK(run,attacker,action,hits>0,total,target,{...context,actorId});return true;
  }
  if(has(`spardaBackflip`)||has(`spardaCyclone`)||has(`spardaSoar`)){
    if(!aim)return true;const start={...W(run,actorId)},end=Wi(run.battlefield,aim,Ft(run,actorId).map(entry=>entry.position)),width=has(`spardaCyclone`)?4:3,hits=RIFT_SPARTAN_PATH_TARGETS(run,actorId,start,end,width);let total=0,beamMultiplier=1;
    if(state.beowulfPrimed&&has(`spardaBeowulfBeam`)){state.beowulfPrimed=false;beamMultiplier=1.26;RIFT_SPARTAN_LOG(run,attacker,[`BEOWULF · DEMONIC BEAM // The primed force stretches through ${action.name}'s movement line.`])}
    if(has(`spardaSoar`)){attacker.statuses.spardaSoarTurn=run.turn;attacker.statuses.spardaSoarFlight=1;attacker.statuses.spardaSoarBaseFlight=state.devTrigger?!!state.devTrigger.baseFlight:!!attacker.flight;attacker.flight=true;Mi(run,actorId,Math.max(ji(run,actorId),ji(run,actorId)*2));Ai(run,actorId,Math.max(Oi(run,actorId),ji(run,actorId)));const active=RIFT_SPARTAN_ACTIVE_INSTANCE(attacker);if(active)RIFT_SPARTAN_DETACH_WEAPON(run,attacker,`soar`,0,end,false);attacker.statuses.bonusWindow=1}
    if(has(`spardaCyclone`)){Mi(run,actorId,Math.max(ji(run,actorId),ji(run,actorId)*2));Ai(run,actorId,Math.max(Oi(run,actorId),ji(run,actorId)));const empowered=RIFT_SPARTAN_CONSUME_FLAIR(run,attacker,`Cyclone`);if(!empowered)attacker.statuses.stun=Math.max(1,attacker.statuses.stun||0)}
    hits.forEach(entry=>{const damage=go(run,attacker,entry.fighter,RIFT_SPARTAN_RAW(attacker,entry.fighter,(has(`spardaCyclone`)?1.08:has(`spardaSoar`)?.72:.52)*beamMultiplier),has(`spardaBeowulfBeam`),[`physical`,has(`spardaSoar`)||has(`spardaBeowulfBeam`)?`magic`:`movement`,has(`spardaCyclone`)?`spardaCyclone`:has(`spardaSoar`)?`spardaSoar`:`spardaBackflip`,...(has(`spardaBeowulfBeam`)?[`beam`,`spardaBeowulfBeam`]:[]),...(RIFT_SPARTAN_WEAPON_TAG(attacker)?[RIFT_SPARTAN_WEAPON_TAG(attacker)]:[])]);total+=damage});
    if(has(`spardaCyclone`))run.battlefield.features.filter(feature=>feature.integrity>0&&dt(feature.position,start,end)<=feature.radius+2).forEach(feature=>Io(run,feature,attacker,Math.round(45+Y(attacker,`as`)*6),`Cyclone route`));
    ki(run,actorId,end);Vt(run,attacker,end,attacker===run.player?`player`:`enemy`);RIFT_SPARTAN_VFX(run,attacker,has(`spardaCyclone`)?`cyclone`:has(`spardaSoar`)?`soar`:`backflip`,end,{shape:`line`,motion:`dash`,radius:width+2});
    RIFT_SPARTAN_LOG(run,attacker,[`${action.name.toUpperCase()} // ${attacker.name} crosses ${I(start,end).toFixed(1)}m and catches ${hits.length} hostile${hits.length===1?``:`s`} for ${total} total damage.`,`DEVIL HUNTER ROUTE // ${action.name} redraws the lane from (${start.x.toFixed(0)}, ${start.y.toFixed(0)}) to (${end.x.toFixed(0)}, ${end.y.toFixed(0)}).`]);RIFT_SPARTAN_FINISH_EARLY(attacker,action);RIFT_SPARTAN_MARK_ATTACK(run,attacker,action,hits.length>0,total,target,{...context,actorId});return true;
  }
  return false;
}

function RIFT_SPARTAN_PREPARE_ATTACK(run,attacker,target,action,tags,power,destruction,context={}) {
  const state=RIFT_SPARTAN_STATE(attacker);if(!state)return{tags,power,destruction};let next=[...tags],g=power,force=destruction,active=RIFT_SPARTAN_ACTIVE_ID(attacker),moveTags=action?.move?.tags||[];
  if(action?.type===`strike`&&moveTags.includes(`spardaShoot`)){next=[`physical`,`projectile`,`spardaShoot`];g=action.move.power;force=action.move.destruction}
  if(active&&!next.some(tag=>tag.startsWith(`spardaWeapon:`))&&[`weapon`,`special`].includes(action?.type))next.push(`spardaWeapon:${active}`);
  if(active===RIFT_SPARTAN_WEAPON_IDS.sparda&&action?.type===`weapon`){const distance=action.aim?.distance??attacker.statuses.riftLastAimDistance??0;if(distance<=4.5){next=next.filter(tag=>![`magic`,`hybrid`,`projectile`,`beam`].includes(tag));next.push(`physical`,`spardaClose`,`bleed`)}else{next=[...new Set([...next,`physical`,`magic`,`hybrid`,`projectile`,`beam`,`spardaWave`])];g*=.92}}
  if(state.beowulfPrimed&&g>0){state.beowulfPrimed=false;next.push(`magic`,`beam`,`spardaBeowulfBeam`);g*=1.26;force*=1.18;RIFT_SPARTAN_VFX(run,attacker,`beowulf-beam`,action.aim?.target||W(run,context.targetId),{shape:action.aim?.shape||`beam`,motion:`beam`,radius:5,accent:`#fff4c8`});RIFT_SPARTAN_LOG(run,attacker,[`BEOWULF · DEMONIC BEAM // The primed third hit follows ${action.name}'s exact geometry.`,`LIGHT BEAST RELEASE // Beowulf adds a ranged demonic answer to ${action.name}.`])}
  if(state.kind===`human`&&state.empowered&&g>0){RIFT_SPARTAN_CONSUME_FLAIR(run,attacker,action.name);next.push(`spardaFlairEmpowered`);g*=1.34;force*=1.24}
  return{tags:[...new Set(next)],power:g,destruction:force};
}

function RIFT_SPARTAN_WEAPON_FROM_HIT(attacker,tags=[]) {
  const tagged=tags.find(tag=>tag.startsWith(`spardaWeapon:`));return tagged?.slice(13)||RIFT_SPARTAN_ACTIVE_ID(attacker);
}
function RIFT_SPARTAN_ON_HIT(run,attacker,target,damage,tags=[]) {
  if(!RIFT_SPARTAN_IS(attacker)||damage<=0||tags.some(tag=>[`itemProc`,`noItemProc`,`environment`,`reflected`,`spardaRedirected`].includes(tag)))return;
  const state=RIFT_SPARTAN_STATE(attacker),weaponId=RIFT_SPARTAN_WEAPON_FROM_HIT(attacker,tags),item=RIFT_ITEM(weaponId);if(!weaponId||!item)return;
  state.hitCounters[weaponId]=Math.max(0,Math.round(state.hitCounters[weaponId]||0))+1;const count=state.hitCounters[weaponId],strength=RIFT_SPARTAN_REFORGE_STRENGTH(attacker,weaponId);
  if(weaponId===RIFT_SPARTAN_WEAPON_IDS.rebellion&&RIFT_ITEM_PROC_ONCE(run,attacker,item,`rebellionResource`)){
    if(state.kind===`human`)RIFT_SPARTAN_GAIN_FLAIR(run,attacker,7*strength,`Rebellion hit`);else if(state.kind!==`devil`){const before=attacker.energy;Ir(attacker,Math.max(2,Math.round(attacker.maxEnergy*.045*strength)));RIFT_SPARTAN_LOG(run,attacker,[`REBELLION // ${attacker.name}'s compatible primary resource rises by ${Math.round(attacker.energy-before)}.`,`DEMONIC GREATSWORD // Rebellion returns ${Math.round(attacker.energy-before)} points to ${Lr(attacker)} without touching an incompatible Combo chain.`],attacker===run.player?`player`:`enemy`)}
  }
  if(weaponId===RIFT_SPARTAN_WEAPON_IDS.ebony){RIFT_SPARTAN_VFX(run,attacker,`ebony-shot`,W(run,RIFT_SPARTAN_ACTOR(run,target)),{shape:`line`,motion:`projectile`,radius:1.8,accent:count%2?`#f4f4f4`:`#252936`,secondary:count%2?`#252936`:`#ffffff`});if(RIFT_ITEM_PROC_ONCE(run,attacker,item,`ebonyTwinHistory`))RIFT_SPARTAN_LOG(run,attacker,[`EBONY & IVORY // Two distinct muzzle flashes release two independently resolved shots.`,`TWIN REPORT // Separate bullets enter the on-hit system without advancing any once-per-ability resource twice.`])}
  if(weaponId===RIFT_SPARTAN_WEAPON_IDS.yamato&&count%3===0){
    const attackerId=RIFT_SPARTAN_ACTOR(run,attacker),targetId=RIFT_SPARTAN_ACTOR(run,target);if(attackerId&&targetId){const nextReserve=ji(run,targetId)*(RIFT_SPARTAN_STATE(target)?.barrage?.turns>0 ? .5 : 1),claims=Array.isArray(target.statuses.spardaYamatoClaims)?target.statuses.spardaYamatoClaims:[],claimed=claims.reduce((sum,claim)=>sum+Math.max(0,Number(claim.amount)||0),0),existing=claims.length?claimed:Math.max(0,target.statuses.spardaYamatoDebt||0),amount=Math.max(0,Math.round(Math.min(nextReserve*.5,nextReserve-existing)*10)/10);if(amount>0){target.statuses.spardaYamatoClaims=[...claims,{sourceId:attackerId,amount}];target.statuses.spardaYamatoDebt=existing+amount;target.statuses.spardaYamatoDebtSource=attackerId;RIFT_SPARTAN_VFX(run,attacker,`yamato-theft`,W(run,targetId),{shape:`line`,motion:`beam`,radius:4,accent:`#a66cff`});RIFT_SPARTAN_LOG(run,attacker,[`YAMATO · THIRD HIT // ${amount.toFixed(1)} Movement Points are severed from ${target.name}'s next refresh and reserved for ${attacker.name}.`,`MOTION SEVERED // Yamato queues an exact transfer without exceeding the reserve that can actually be removed.`])}}
  }
  if(weaponId===RIFT_SPARTAN_WEAPON_IDS.beowulf&&count%3===0){state.beowulfPrimed=true;RIFT_SPARTAN_VFX(run,attacker,`beowulf-prime`,W(run,RIFT_SPARTAN_ACTOR(run,attacker)),{radius:5,accent:`#fff1b8`});RIFT_SPARTAN_LOG(run,attacker,[`BEOWULF · THIRD HIT // The next damaging move now carries a move-shaped demonic beam.`,`BEOWULF PRIMED // White demonic light locks to ${attacker.name}'s next attack geometry.`])}
  if(weaponId===RIFT_SPARTAN_WEAPON_IDS.sparda&&(tags.includes(`spardaClose`)||!tags.includes(`spardaWave`)&&(attacker.statuses.riftLastAimDistance||0)<=4.5)){target.statuses.bleed=Math.min(6,(target.statuses.bleed||0)+1);target.statuses.bleedPower=Math.max(target.statuses.bleedPower||0,1.2*strength);RIFT_SPARTAN_VFX(run,attacker,`sparda-close`,W(run,RIFT_SPARTAN_ACTOR(run,target)),{shape:`line`,motion:`burst`,radius:5,accent:`#ff294f`});if(RIFT_ITEM_PROC_ONCE(run,attacker,item,`spardaBleedHistory`))RIFT_SPARTAN_LOG(run,attacker,[`SPARDA · CLOSE CLEAVE // Demonic steel opens Bleed ${target.statuses.bleed}/6 on ${target.name}.`,`LIVING LEGACY // Sparda's close edge leaves ${target.name} bleeding beneath the demonic impact.`])}else if(weaponId===RIFT_SPARTAN_WEAPON_IDS.sparda&&tags.includes(`spardaWave`))RIFT_SPARTAN_VFX(run,attacker,`sparda-wave`,W(run,RIFT_SPARTAN_ACTOR(run,target)),{shape:`line`,motion:`beam`,radius:6,accent:`#ff294f`,secondary:`#ffcfb8`})
}

const RIFT_SPARTAN_BASE_ITEM_AFTER=RIFT_ITEM_AFTER_DAMAGE;
RIFT_ITEM_AFTER_DAMAGE=function(run,attacker,target,damage,tags=[]){RIFT_SPARTAN_BASE_ITEM_AFTER(run,attacker,target,damage,tags);RIFT_SPARTAN_ON_HIT(run,attacker,target,damage,tags)};
const RIFT_SPARTAN_BASE_ITEM_OUTGOING=RIFT_ITEM_OUTGOING;
RIFT_ITEM_OUTGOING=function(run,attacker,target,amount,tags=[]){
  let value=RIFT_SPARTAN_BASE_ITEM_OUTGOING(run,attacker,target,amount,tags),state=RIFT_SPARTAN_STATE(attacker);if(!state||tags.includes(`itemProc`))return value;const distance=attacker.statuses?.riftLastAimDistance||0;
  const styleDistance=tags.includes(`spardaSliceDice`)?0:distance;
  if(state.kind===`human`&&state.style===`Swordmaster`&&styleDistance<=5)value*=1.08+M((5-styleDistance)*.035,0,.16);
  if(state.kind===`human`&&state.style===`Gunslinger`&&tags.some(tag=>[`projectile`,`spardaShoot`,`spardaHeadshot`,`spardaBarrage`].includes(tag)))value*=1+M(distance*.012,0,.34);
  if(RIFT_SPARTAN_WEAPON_FROM_HIT(attacker,tags)===RIFT_SPARTAN_WEAPON_IDS.sparda)value*=1.105**(Y(target,`durability`)*.2);
  return value;
};
function RIFT_SPARTAN_POSTURE_CRUSH(run,attacker,target,ratio=.55){target.posture=Math.min(target.maxPosture,(target.posture||0)+Math.round(target.maxPosture*ratio));if(target.posture>=target.maxPosture){target.posture=0;target.statuses.stun=Math.max(1,target.statuses.stun||0);target.statuses.exposed=1;target.guard=false}try{G(run,`ROYAL POSTURE // ${target.name}'s stance absorbs ${Math.round(ratio*100)}% maximum Posture pressure.`,`mythic`)}catch{}}
const RIFT_SPARTAN_BASE_ITEM_INCOMING=RIFT_ITEM_INCOMING;
RIFT_ITEM_INCOMING=function(run,attacker,target,amount,tags=[]){
  let value=RIFT_SPARTAN_BASE_ITEM_INCOMING(run,attacker,target,amount,tags),state=RIFT_SPARTAN_STATE(target);if(!state||tags.includes(`spardaRedirected`))return value;const stance=target.statuses.spardaRoyalStance,projectile=tags.some(tag=>[`projectile`,`beam`,`magicProjectile`,`kiBlast`].includes(tag)),melee=!projectile&&!tags.includes(`environment`);
  if(stance?.kind===`redirect`&&projectile){delete target.statuses.spardaRoyalStance;target.guard=false;const reflected=go(run,target,attacker,value*.9,tags.includes(`magic`),[...tags,`spardaRedirected`,`noCounter`,`noItemProc`]);RIFT_SPARTAN_LOG(run,target,[`ROYAL GUARD · REDIRECT // ${target.name} turns the projectile around for ${reflected} resolved damage.`,`REDIRECT // The incoming line reverses without opening a recursive reflection chain.`]);return 0}
  if(stance?.kind===`perfect`&&!tags.includes(`environment`)){delete target.statuses.spardaRoyalStance;target.guard=false;RIFT_SPARTAN_POSTURE_CRUSH(run,target,attacker,.68);RIFT_SPARTAN_LOG(run,target,[`ROYAL GUARD · PERFECT // The next blocked damage becomes exactly zero.`,`PERFECT GUARD // Impact vanishes at ${target.name}'s frame and returns as severe Posture pressure.`]);return 0}
  if(stance?.kind===`slam`&&!tags.includes(`environment`)){delete target.statuses.spardaRoyalStance;target.guard=false;if(melee){const counter=go(run,target,attacker,value*.76,false,[`physical`,`spardaRoyalSlam`,`noCounter`,`noItemProc`]);RIFT_SPARTAN_LOG(run,target,[`ROYAL GUARD · SLAM // The melee impact is negated and ${counter} counter damage drives into ${attacker.name}.`,`SLAM COUNTER // ${target.name} catches the body, not the effect, and answers through the ground.`]);return 0}target.statuses.stun=Math.max(1,target.statuses.stun||0);RIFT_SPARTAN_LOG(run,target,[`SLAM FAILURE // The attack is not melee. ${target.name}'s committed stance breaks and costs the next turn.`])}
  if(state.kind===`human`&&state.style===`Royal Guard`&&target.guard)value*=tags.includes(`guardbreak`)?.78:.68;
  return value;
};

const RIFT_SPARTAN_BASE_ES=es;
es=function(run,attacker,target,tags){const result=RIFT_SPARTAN_BASE_ES(run,attacker,target,tags),state=RIFT_SPARTAN_STATE(target);if(state?.kind===`human`&&state.style===`Trickster`&&target.statuses.spardaTauntDodge>0){result.total=M(result.total+.18,0,.92);result.dangerBonus=Math.max(result.dangerBonus||0,.18)}return result};

function RIFT_SPARTAN_RESOLVE_ACTION(run,attacker,target,action,result={}) {
  const state=RIFT_SPARTAN_STATE(attacker);if(!state)return;const tags=result.tags||action?.move?.tags||[],hit=!!result.hit&&result.damage>0;
  state.actionSerial+=1;
  if(state.kind===`devil`&&!tags.some(tag=>[`spardaDevilTrigger`,`spardaRecover`,`spardaWeaponSwitch`].includes(tag))){
    state.attackedTurn=run.turn;if(hit){const before=state.comboBars,comboCap=RIFT_SPARTAN_ACTIVE_ID(attacker)===RIFT_SPARTAN_WEAPON_IDS.yamato?4:3;state.comboBars=Math.min(comboCap,state.comboBars+1);for(let index=0;index<Math.min(3,state.comboBars);index+=1)delete attacker.statuses[`standardCooldown_spartan-devil_${index}`];if(state.comboBars!==before)RIFT_SPARTAN_LOG(run,attacker,[`COMBO BAR ${state.comboBars}/4 // ${action.name} connects. ${state.comboBars===1?`Move 1 cooldown is gone.`:state.comboBars===2?`Move 2 cooldown and lifesteal awaken.`:state.comboBars===3?`Move 3 cooldown and Bonus weapon switching awaken.`:`Maximum Combo. Yamato becomes Judgement Cut.`}`,`DEVIL COMBO // One successful ability advances exactly once to ${state.comboBars}/4${comboCap===3&&state.comboBars===3?`; Yamato is required for the final bar`:``}.`],attacker===run.player?`player`:`enemy`)}else{if(state.comboBars>0)RIFT_SPARTAN_LOG(run,attacker,[`COMBO BREAK // ${action.name} misses. The four-bar chain returns to zero.`],attacker===run.player?`player`:`enemy`);state.comboBars=0}
    if(hit&&state.comboBars>=2){const healed=oo(attacker,Math.max(1,Math.round(result.damage*.1)));healed>0&&RIFT_SPARTAN_LOG(run,attacker,[`COMBO LIFESTEAL // ${healed} HP returns through the bar 2 blood rhythm.`],attacker===run.player?`player`:`enemy`)}
  }
  if(state.kind===`human`&&result.critical&&hit)RIFT_SPARTAN_GAIN_FLAIR(run,attacker,16,`Critical hit`);
  if(state.kind===`human`&&hit&&target?.hp<=0)RIFT_SPARTAN_GAIN_FLAIR(run,attacker,32,`Kill`);
  if(state.kind===`human`&&hit&&tags.includes(`spardaLetsRock`))RIFT_SPARTAN_GAIN_FLAIR(run,attacker,18,`Let's Rock impact`);
  const weaponId=RIFT_SPARTAN_WEAPON_FROM_HIT(attacker,tags);
  if(result.critical&&hit&&weaponId===RIFT_SPARTAN_WEAPON_IDS.mirage&&target){const transfer=Math.max(0,Math.min(14,target.ultimate||0,100-(attacker.ultimate||0)));if(transfer>0){target.ultimate-=transfer;attacker.ultimate+=transfer;RIFT_SPARTAN_VFX(run,attacker,`mirage-drain`,W(run,result.targetId),{shape:`line`,motion:`beam`,radius:4,accent:`#7f6bff`});RIFT_SPARTAN_LOG(run,attacker,[`MIRAGE EDGE · CRITICAL // ${Math.round(transfer)}% Ultimate charge leaves ${target.name} and arrives intact in ${attacker.name}.`,`SPECTRAL DRAIN // Mirage Edge transfers exactly ${Math.round(transfer)} valid Ultimate charge within both caps.`])}}
  if(tags.includes(`spardaLetsRock`)){const point=action.aim?.target||W(run,result.targetId);RIFT_SPARTAN_DETACH_WEAPON(run,attacker,`thrown`,Infinity,point,false);RIFT_SPARTAN_LOG(run,attacker,[`LET'S ROCK! // ${attacker.name}'s current weapon remains embedded at the marked point and cannot be selected until recovered.`])}
  if(tags.includes(`spardaSpectralSword`))RIFT_SPARTAN_DETACH_WEAPON(run,attacker,`spectral`,1,action.aim?.target||W(run,result.targetId),false);
  if(tags.includes(`spardaMirageCommand`))RIFT_SPARTAN_DETACH_WEAPON(run,attacker,`command`,2,action.aim?.target||W(run,result.targetId),true);
  if(hit&&tags.some(tag=>[`spardaAirCombo`,`spardaBuryLight`,`spardaUppercut`,`spardaSpectralSword`,`spardaPowerSparta`].includes(tag))){const longLaunch=tags.includes(`spardaUppercut`),follow=!tags.includes(`spardaSpectralSword`)&&!tags.includes(`spardaPowerSparta`),stunning=tags.some(tag=>[`spardaBuryLight`,`spardaUppercut`,`spardaPowerSparta`].includes(tag)),appliedStun=stunning&&!target.statuses.stun;RIFT_SPARTAN_AERIALIZE(target,longLaunch?2:1,false);if(follow)RIFT_SPARTAN_AERIALIZE(attacker,longLaunch?2:1,true);if(appliedStun){target.statuses.spardaAirborne=longLaunch?2:1;target.statuses.stun=Math.max(longLaunch?2:1,target.statuses.stun||0)}RIFT_SPARTAN_LOG(run,attacker,[`${action.name.toUpperCase()} // ${target.name} is launched${follow?` with ${attacker.name} following into temporary Flight`:``}${appliedStun?` and stunned`:``}.`])}
  if(hit&&tags.includes(`spardaThrust`))Z(run,attacker,target,action.aim?.origin||W(run,result.actorId),9);
  if(tags.includes(`spardaBangBangBang`)&&action.aim?.target){const actorId=result.actorId||RIFT_SPARTAN_ACTOR(run,attacker),start=W(run,actorId),toward=action.aim.target,ratio=Math.min(1,8/Math.max(1,I(start,toward))),point={x:start.x+(toward.x-start.x)*ratio,y:start.y+(toward.y-start.y)*ratio};ki(run,actorId,Wi(run.battlefield,point,Ft(run,actorId).map(entry=>entry.position)));Vt(run,attacker,W(run,actorId),attacker===run.player?`player`:`enemy`)}
  if(tags.some(tag=>[`spardaBlitz`,`spardaMotivation`].includes(tag))&&action.aim?.target){const actorId=result.actorId||RIFT_SPARTAN_ACTOR(run,attacker),start={...W(run,actorId)},toward=action.aim.target,distance=Math.max(1,I(start,toward)),stop=Math.max(0,distance-O*1.35),point={x:start.x+(toward.x-start.x)/distance*stop,y:start.y+(toward.y-start.y)/distance*stop};ki(run,actorId,Wi(run.battlefield,point,Ft(run,actorId).map(entry=>entry.position)));Vt(run,attacker,W(run,actorId),attacker===run.player?`player`:`enemy`)}
  if(tags.includes(`spardaBarrage`)&&action.aim){const dx=action.aim.target.x-action.aim.origin.x,dy=action.aim.target.y-action.aim.origin.y,length=Math.max(1,Math.hypot(dx,dy));state.barrage={direction:{x:dx/length,y:dy/length},range:length,origin:{...action.aim.origin},target:{...action.aim.target},turns:3,activatedTurn:run.turn};RIFT_SPARTAN_LOG(run,attacker,[`GUNSLINGER · BARRAGE // The firing direction locks for three owner turns. Movement refreshes at half value while automatic shots continue.`])}
  if(tags.includes(`spardaPowerSparta`)&&action.aim){const dx=action.aim.target.x-action.aim.origin.x,dy=action.aim.target.y-action.aim.origin.y,length=Math.max(1,Math.hypot(dx,dy));run.battlefield.hazards.push({id:`sparda-tornado-${F()}`,kind:`tornado`,mechanic:`spardaPowerTornado`,label:`Power of Sparta tornado`,position:{...action.aim.origin},radius:5.5,power:1.3,turns:4,owner:attacker===run.player?`player`:`enemy`,ownerId:result.actorId,accent:`#a168ff`,velocity:{x:dx/length*6.2,y:dy/length*6.2}})}
  if(tags.includes(`spardaCrush`)&&action.aim){for(let index=1;index<=6;index+=1){const ratio=index/6,point={x:action.aim.origin.x+(action.aim.target.x-action.aim.origin.x)*ratio,y:action.aim.origin.y+(action.aim.target.y-action.aim.origin.y)*ratio};run.battlefield.hazards.push({id:`sparda-crush-${F()}`,kind:`crater`,label:`Beowulf · Crush segment`,position:point,radius:2.7,power:.72,turns:3,owner:attacker===run.player?`player`:`enemy`,ownerId:result.actorId,accent:`#fff1c7`})}run.battlefield.features.filter(feature=>feature.integrity>0&&dt(feature.position,action.aim.origin,action.aim.target)<=feature.radius+3).forEach(feature=>Io(run,feature,attacker,Math.round(48+Y(attacker,`as`)*6.5),`Beowulf Crush`))}
  if(tags.includes(`spardaDestroy`)&&action.aim?.target){ki(run,result.actorId,Wi(run.battlefield,action.aim.target,Ft(run,result.actorId).map(entry=>entry.position)));Vt(run,attacker,W(run,result.actorId),attacker===run.player?`player`:`enemy`)}
  if(hit||tags.some(tag=>[`spardaBarrage`,`spardaPowerSparta`,`spardaCrush`,`spardaDestroy`].includes(tag)))RIFT_SPARTAN_VFX(run,attacker,tags.find(tag=>tag.startsWith(`sparda`))||`weapon-art`,action.aim?.target||W(run,result.targetId),{shape:action.aim?.shape||`area`,motion:action.aim?.shape===`line`?`beam`:`burst`,radius:action.aim?.radius||6});
}

function RIFT_SPARTAN_AUTONOMOUS_WEAPONS(run,fighter) {
  const state=RIFT_SPARTAN_STATE(fighter),actorId=RIFT_SPARTAN_ACTOR(run,fighter);if(!state||!actorId)return;
  for(const [uid,entry] of Object.entries(state.unavailable)){
    if(entry.mode===`thrown`){if(I(W(run,actorId),entry.position)<=3)RIFT_SPARTAN_RETURN_WEAPON(run,fighter,uid,false);continue}
    if(![`spectral`,`command`].includes(entry.mode))continue;
    const victim=RIFT_SPARTAN_HOSTILES(run,actorId).sort((a,b)=>I(W(run,actorId),W(run,a.id))-I(W(run,actorId),W(run,b.id)))[0];
    if(victim){RIFT_BEGIN_ITEM_ACTION(run,fighter,{name:entry.mode===`command`?`Mirage Command`:`Spectral Sword`,type:`special`,move:{tags:[`physical`,`magic`,`hybrid`,`weapon`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.mirage}`]}});const damage=go(run,fighter,victim.fighter,RIFT_SPARTAN_RAW(fighter,victim.fighter,.74),true,[`physical`,`magic`,`hybrid`,`weapon`,`spardaAutonomousMirage`,`spardaWeapon:${RIFT_SPARTAN_WEAPON_IDS.mirage}`]);RIFT_SPARTAN_LOG(run,fighter,[`MIRAGE EDGE · ${entry.mode.toUpperCase()} // The independent blade attacks ${victim.fighter.name} for ${damage} and runs valid on-hit effects.`])}
    entry.remaining=Math.max(0,(entry.remaining||0)-1);if(entry.remaining<=0)RIFT_SPARTAN_RETURN_WEAPON(run,fighter,uid,!!entry.autoEquip);
  }
}
function RIFT_SPARTAN_BARRAGE_TICK(run,fighter) {
  const state=RIFT_SPARTAN_STATE(fighter),barrage=state?.barrage,actorId=RIFT_SPARTAN_ACTOR(run,fighter);if(!barrage||!actorId||barrage.turns<=0)return;
  const start={...W(run,actorId)},legacyDx=(barrage.target?.x||start.x)-(barrage.origin?.x||start.x),legacyDy=(barrage.target?.y||start.y)-(barrage.origin?.y||start.y),legacyLength=Math.max(1,Math.hypot(legacyDx,legacyDy)),direction=barrage.direction||{x:legacyDx/legacyLength,y:legacyDy/legacyLength},range=Math.max(8,barrage.range||legacyLength),end={x:M(start.x+direction.x*range,O,run.battlefield.width-O),y:M(start.y+direction.y*range,O,run.battlefield.height-O)};
  barrage.direction=direction;barrage.origin=start;barrage.target=end;barrage.range=range;
  let total=0,hits=0;RIFT_BEGIN_ITEM_ACTION(run,fighter,{name:`Barrage · Sustained`,type:`special`,move:{tags:[`physical`,`projectile`,`spardaBarrage`]}});RIFT_SPARTAN_HOSTILES(run,actorId).filter(entry=>dt(W(run,entry.id),start,end)<=5.8+O).forEach(entry=>{for(let shot=0;shot<3&&entry.fighter.hp>0;shot+=1)total+=go(run,fighter,entry.fighter,RIFT_SPARTAN_RAW(fighter,entry.fighter,.2),false,[`physical`,`projectile`,`spardaBarrage`,...(RIFT_SPARTAN_WEAPON_TAG(fighter)?[RIFT_SPARTAN_WEAPON_TAG(fighter)]:[])]);hits+=1});
  barrage.turns-=1;RIFT_SPARTAN_VFX(run,fighter,`barrage`,end,{shape:`line`,motion:`projectile`,radius:6});RIFT_SPARTAN_LOG(run,fighter,[`BARRAGE · ${barrage.turns}/3 REMAIN // The original firing angle follows ${fighter.name}; ${hits} target${hits===1?``:`s`} take ${total} total gunfire.`],fighter===run.player?`player`:`enemy`);
}
function RIFT_SPARTAN_TURN_START(run,fighter) {
  const state=RIFT_SPARTAN_STATE(fighter);if(!state)return;
  if(fighter.statuses.spardaTauntPose&&fighter.statuses.spardaTauntPose.activatedTurn!==run.turn)delete fighter.statuses.spardaTauntPose;
  if(fighter.statuses.spardaRecoverCooldown>0){fighter.statuses.spardaRecoverCooldown-=1;if(fighter.statuses.spardaRecoverCooldown<=0)delete fighter.statuses.spardaRecoverCooldown}
  if(fighter.statuses.spardaTauntDodge>0){fighter.statuses.spardaTauntDodge-=1;if(fighter.statuses.spardaTauntDodge<=0)delete fighter.statuses.spardaTauntDodge}
  if(fighter.statuses.spardaCinematic&&fighter.statuses.spardaCinematic.activatedTurn!==run.turn){fighter.statuses.spardaCinematic.ttl-=1;if(fighter.statuses.spardaCinematic.ttl<=0)delete fighter.statuses.spardaCinematic}
  const stance=fighter.statuses.spardaRoyalStance;if(stance&&run.turn>stance.setTurn){if(stance.kind===`slam`&&!stance.triggered){fighter.statuses.stun=Math.max(1,fighter.statuses.stun||0);RIFT_SPARTAN_LOG(run,fighter,[`SLAM WHIFF // No melee attack entered the stance. ${fighter.name} loses the next turn to overcommitment.`])}delete fighter.statuses.spardaRoyalStance;fighter.guard=false}
  RIFT_SPARTAN_AUTONOMOUS_WEAPONS(run,fighter);RIFT_SPARTAN_BARRAGE_TICK(run,fighter);
}
function RIFT_SPARTAN_TURN_END(run,fighter) {
  const aerial=fighter?.statuses?.spardaAerialFlight;if(aerial){aerial.turns-=1;if(aerial.turns<=0){fighter.flight=RIFT_SPARTAN_STATE(fighter)?.devTrigger?true:!!aerial.baseFlight;delete fighter.statuses.spardaAerialFlight;delete fighter.statuses.spardaAirborne}}
  for(const tornado of (run?.battlefield?.hazards||[]).filter(hazard=>hazard.mechanic===`spardaPowerTornado`)){const owner=U(run,tornado.ownerId);for(const victim of H(run).filter(entry=>entry.fighter.hp>0&&entry.team!==owner?.team&&I(W(run,entry.id),tornado.position)<=tornado.radius+O)){if(!victim.fighter.statuses.stun){victim.fighter.statuses.stun=1;RIFT_SPARTAN_AERIALIZE(victim.fighter,1,false);try{G(run,`POWER OF SPARTA // ${victim.fighter.name} is lifted and stunned by the travelling Yamato vortex.`,`mythic`)}catch{}}}}
  const stopped=(run?.battlefield?.hazards||[]).filter(hazard=>hazard.mechanic===`spardaPowerTornado`&&(hazard.position.x<=hazard.radius||hazard.position.x>=run.battlefield.width-hazard.radius||hazard.position.y<=hazard.radius||hazard.position.y>=run.battlefield.height-hazard.radius||run.battlefield.features.some(feature=>feature.solid&&feature.integrity>0&&I(feature.position,hazard.position)<=feature.radius+hazard.radius)));if(stopped.length){const ids=new Set(stopped.map(hazard=>hazard.id));run.battlefield.hazards=run.battlefield.hazards.filter(hazard=>!ids.has(hazard.id));try{G(run,`POWER OF SPARTA // The travelling tornado meets a major obstruction and collapses instead of changing direction.`,`mythic`)}catch{}}
  const state=RIFT_SPARTAN_STATE(fighter);if(!state)return;
  if(state.kind===`devil`&&state.attackedTurn!==run.turn){if(state.comboBars>0)RIFT_SPARTAN_LOG(run,fighter,[`COMBO RESET // A full owner turn ends without a successful attack.`],fighter===run.player?`player`:`enemy`);state.comboBars=0}
  if(state.devTrigger&&state.devTrigger.activatedTurn!==run.turn){state.devTrigger.turns-=1;if(state.devTrigger.turns<=0){fighter.flight=state.devTrigger.baseFlight;state.devTrigger=null;RIFT_SPARTAN_VFX(run,fighter,`devil-trigger-end`,W(run,RIFT_SPARTAN_ACTOR(run,fighter)),{radius:7});RIFT_SPARTAN_LOG(run,fighter,[`DEVIL TRIGGER ENDS // Demonic armor folds back into ${fighter.name}. Flight and the +3/+6 surge end cleanly.`])}}
  if(state.barrage&&state.barrage.turns<=0)state.barrage=null;
  if(fighter.statuses.spardaSoarFlight){delete fighter.statuses.spardaSoarFlight;fighter.flight=state.devTrigger?true:!!fighter.statuses.spardaSoarBaseFlight;delete fighter.statuses.spardaSoarBaseFlight;for(const [uid,entry] of Object.entries(state.unavailable))if(entry.mode===`soar`)RIFT_SPARTAN_RETURN_WEAPON(run,fighter,uid,false)}
}
const RIFT_SPARTAN_BASE_NT=Nt;
function RIFT_SPARTAN_SETTLE_YAMATO(run,actorId,fighter){const debt=Math.max(0,Number(fighter?.statuses?.spardaYamatoDebt||0)),removed=Math.min(debt,Oi(run,actorId));if(removed>0){Ai(run,actorId,Math.max(0,Oi(run,actorId)-removed));let remaining=removed,transferred=0,claims=Array.isArray(fighter.statuses.spardaYamatoClaims)?fighter.statuses.spardaYamatoClaims:[];if(!claims.length&&fighter.statuses.spardaYamatoDebtSource)claims=[{sourceId:fighter.statuses.spardaYamatoDebtSource,amount:removed}];for(const claim of claims){const amount=Math.min(remaining,Math.max(0,Number(claim.amount)||0)),source=U(run,claim.sourceId);if(amount>0&&source){Ai(run,claim.sourceId,Oi(run,claim.sourceId)+amount);transferred+=amount}remaining-=amount;if(remaining<=0)break}try{G(run,`YAMATO DEBT // ${fighter.name}'s refreshed Movement loses exactly ${removed.toFixed(1)} MP; ${transferred.toFixed(1)} MP reaches the valid Yamato wielder${transferred===removed?``:` before the remaining claim loses its source`}.`,`mythic`)}catch{}}delete fighter.statuses.spardaYamatoDebt;delete fighter.statuses.spardaYamatoDebtSource;delete fighter.statuses.spardaYamatoClaims}
Nt=function(run,actorId){RIFT_SPARTAN_BASE_NT(run,actorId);const fighter=U(run,actorId)?.fighter||(actorId===`player`?run.player:actorId===`enemy`?run.enemy:null);if(!fighter)return;if(RIFT_SPARTAN_STATE(fighter)?.barrage)Ai(run,actorId,Oi(run,actorId)*.5);RIFT_SPARTAN_SETTLE_YAMATO(run,actorId,fighter)};
const RIFT_SPARTAN_BASE_PT=Pt;
Pt=function(run,actorId){RIFT_SPARTAN_BASE_PT(run,actorId);const fighter=U(run,actorId)?.fighter;if(!fighter)return;if(RIFT_SPARTAN_STATE(fighter)?.barrage)Ai(run,actorId,Oi(run,actorId)*.5);RIFT_SPARTAN_SETTLE_YAMATO(run,actorId,fighter)};
const RIFT_SPARTAN_BASE_ZO=Zo;
Zo=function(run,fighter,tone,actorId){RIFT_SPARTAN_TURN_START(run,fighter);return RIFT_SPARTAN_BASE_ZO(run,fighter,tone,actorId)};
const RIFT_SPARTAN_BASE_QO=Qo;
Qo=function(run,fighter){const result=RIFT_SPARTAN_BASE_QO(run,fighter);RIFT_SPARTAN_TURN_END(run,fighter);return result};

const RIFT_SPARTAN_BASE_Y=Y;
Y=function(fighter,stat){let value=RIFT_SPARTAN_BASE_Y(fighter,stat),state=RIFT_SPARTAN_STATE(fighter);if(state?.devTrigger)value+=stat===`regeneration`?6:3;return value};
const RIFT_SPARTAN_BASE_JA=Ja;
Ja=function(fighter){const list=RIFT_SPARTAN_BASE_JA(fighter),state=RIFT_SPARTAN_STATE(fighter);if(state){if(state.kind===`human`)list.unshift(`FLAIR ${Math.round(state.flair)}% · ${state.style.toUpperCase()}`);if(state.kind===`devil`)list.unshift(`COMBO ${state.comboBars}/4`);if(state.devTrigger)list.unshift(`${state.devTrigger.kind.toUpperCase()} DT ${state.devTrigger.turns}T`);if(Object.keys(state.unavailable).length)list.push(`${Object.keys(state.unavailable).length} WEAPON AWAY`)}return list.slice(0,8)};

const RIFT_SPARTAN_BASE_PREPARE_ITEMS=RIFT_PREPARE_COMBAT_ITEMS;
RIFT_PREPARE_COMBAT_ITEMS=function(run){const result=RIFT_SPARTAN_BASE_PREPARE_ITEMS(run);[run.player,run.enemy,...(run.auxiliaryCombatants||[]).map(entry=>entry.fighter)].filter(Boolean).forEach(fighter=>{const state=RIFT_SPARTAN_STATE(fighter);if(state){state.unavailable={};state.barrage=null;state.beowulfPrimed=false;fighter.statuses.spardaRoyalStance=null;delete fighter.statuses.spardaAerialFlight;delete fighter.statuses.spardaAirborne;RIFT_SYNC_WEAPON(fighter)}});run.battlefield.features=run.battlefield.features.filter(feature=>feature.kind!==`spardaWeapon`);return result};

function RIFT_SPARTAN_AI_CHOICE(fighter,target) {
  const state=RIFT_SPARTAN_STATE(fighter);if(!state||state.kind===`blood`)return null;const actions=La(fighter),usable=actions.filter(action=>Va(fighter,action)<=0&&!RIFT_SPARTAN_BLOCK_REASON(null,action,fighter));
  const findTag=tag=>usable.find(action=>action.move?.tags?.includes(tag)),switchTo=itemId=>usable.find(action=>action.move?.tags?.includes(`spardaWeaponSwitch`)&&RIFT_SPARTAN_INSTANCE(fighter,action.weaponUid)?.itemId===itemId),distance=Math.max(0,Number(fighter.statuses.riftLastAimDistance)||0);
  if(state.kind===`human`){
    const ultimate=usable.find(action=>action.type===`ultimate`);if(ultimate&&kr(fighter,target))return ultimate;
    if(state.flair<38){const taunt=findTag(`spardaTaunt`);if(taunt)return taunt}
    const desired=fighter.hp/fighter.maxHp<.38?`Royal Guard`:target?.hp/Math.max(1,target?.maxHp)<.35?`Swordmaster`:state.flair<70?`Trickster`:`Gunslinger`;
    state.aiDecision=(state.aiDecision||0)+1;if(desired!==state.style&&state.aiDecision%4===0){const swap=usable.find(action=>action.move?.tags?.includes(`spardaStyleSwitch:${desired}`));if(swap)return swap}
    const preferred=state.style===`Gunslinger`||distance>13?RIFT_SPARTAN_WEAPON_IDS.ebony:state.style===`Swordmaster`?RIFT_SPARTAN_WEAPON_IDS.sparda:RIFT_SPARTAN_WEAPON_IDS.rebellion;if(RIFT_SPARTAN_ACTIVE_ID(fighter)!==preferred&&state.aiDecision%3===0){const swap=switchTo(preferred);if(swap)return swap}
  }else{
    const judgement=findTag(`spardaJudgementCut`);if(judgement&&kr(fighter,target))return judgement;
    const trigger=findTag(`spardaDevilTrigger`);if(trigger&&kr(fighter,target)&&!state.devTrigger)return trigger;
    if(fighter.hp/fighter.maxHp<.3){const recover=findTag(`spardaRecover`);if(recover)return recover}
    if(state.comboBars>=3&&RIFT_SPARTAN_ACTIVE_ID(fighter)!==RIFT_SPARTAN_WEAPON_IDS.yamato){const swap=switchTo(RIFT_SPARTAN_WEAPON_IDS.yamato);if(swap)return swap}
    if(state.comboBars<2&&target?.ultimate>=65&&RIFT_SPARTAN_ACTIVE_ID(fighter)!==RIFT_SPARTAN_WEAPON_IDS.mirage){const swap=switchTo(RIFT_SPARTAN_WEAPON_IDS.mirage);if(swap)return swap}
  }
  return usable.filter(action=>[`weapon`,`strike`,`special`].includes(action.type)&&!action.move?.tags?.some(tag=>tag===`spardaWeaponSwitch`||tag.startsWith(`spardaStyleSwitch:`))).sort((a,b)=>(b.move?.power||0)-(a.move?.power||0))[0]||usable[0]||null;
}
const RIFT_SPARTAN_BASE_IS=is;
is=function(fighter,target){return RIFT_SPARTAN_AI_CHOICE(fighter,target)||RIFT_SPARTAN_BASE_IS(fighter,target)};

function RIFT_SPARTAN_FIGHTER_CLASS(fighter){const state=RIFT_SPARTAN_STATE(fighter);return state?`spartan-fighter-panel spartan-${state.kind} style-${qt(state.style)} ${state.devTrigger?`sparda-triggered sparda-trigger-${state.devTrigger.kind}`:``}`:``}
function RIFT_SPARTAN_MODEL_CLASS(fighter){const state=RIFT_SPARTAN_STATE(fighter),weapon=RIFT_SPARTAN_ACTIVE_ID(fighter),taunt=fighter?.statuses?.spardaTauntPose;return state?`spartan-model fighter-${state.kind} ${state.devTrigger?`devil-trigger-active trigger-${state.devTrigger.kind}`:`devil-trigger-dormant`} ${fighter.flight?`sparda-flight`:`sparda-grounded`} ${taunt?`taunt-pose-${M(Math.round(taunt.variant||0),0,5)}`:``} ${weapon?`weapon-${qt(weapon)}`:`weaponless`} style-${qt(state.style)}`:``}

globalThis.__RIFT_SPARTAN_BLOOD__=Object.freeze({version:RIFT_SPARTAN_VERSION,isSpartan:RIFT_SPARTAN_IS,state:RIFT_SPARTAN_STATE,actions:RIFT_SPARTAN_ACTIONS,reforge:RIFT_SPARTAN_REFORGE,reforgeCost:RIFT_SPARTAN_REFORGE_COST,onHit:RIFT_SPARTAN_ON_HIT,resolveAction:RIFT_SPARTAN_RESOLVE_ACTION,switchWeapon:RIFT_SPARTAN_SWITCH_WEAPON,returnWeapon:RIFT_SPARTAN_RETURN_WEAPON,weapons:RIFT_SPARTAN_WEAPON_IDS});
