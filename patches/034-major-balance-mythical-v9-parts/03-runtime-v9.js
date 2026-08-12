if(ids.includes(`banditsSecret`)&&tags.includes(`borrowedPower`))value*=1.22;
if(ids.includes(`banditsSecret`)&&tags.includes(`borrowedPower`)&&target?.power?.name&&tags.includes(`source:${target.power.name}`))value*=1.22;
if(ids.includes(`blackBarrel`)&&target&&(target.tiers?.regeneration||0)>=10)value*=1.35;
if(ids.includes(`andurilHeir`)&&itemAction===`weapon`&&target?.statuses?.boss)value*=1.28;
if(ids.includes(`moonlightGreatsword`)&&itemAction===`weapon`&&attacker.energy/Math.max(1,attacker.maxEnergy)>.5)value*=1.2;
if(ids.includes(`choiceScarf`)&&itemAction===`special`&&attacker.lastOffense===attacker.statuses.riftItemActionName)value*=1.18;
return value};

const RIFT_V9_BASE_ITEM_IN=RIFT_ITEM_INCOMING;
RIFT_ITEM_INCOMING=function RIFT_V9_ITEM_IN(run,attacker,target,amount,tags=[]){let value=RIFT_V9_BASE_ITEM_IN(run,attacker,target,amount,tags);
const ids=RIFT_ITEM_INSTANCES(target).map(x=>RIFT_ITEM(x.itemId)?.passiveId);
if(ids.includes(`zetaSuit`)&&tags.includes(`selfDamage`))value*=target.hp/Math.max(1,target.maxHp)<.5?.25:.5;
if(ids.includes(`beskarSpear`)&&target.guard)value*=.78;
if(ids.includes(`ironHalo`)&&!tags.some(t=>[`causality`,`deathPierce`].includes(t)))value*=.9;
return value};

const RIFT_V9_BASE_ITEM_AFTER=RIFT_ITEM_AFTER_DAMAGE;
RIFT_ITEM_AFTER_DAMAGE=function RIFT_V9_ITEM_AFTER(run,attacker,target,damage,tags=[]){RIFT_V9_BASE_ITEM_AFTER(run,attacker,target,damage,tags);
if(damage<=0)return;
const ids=RIFT_ITEM_INSTANCES(attacker).map(x=>RIFT_ITEM(x.itemId)?.passiveId);
if(ids.includes(`airForce`)&&attacker.statuses.riftItemActionType===`weapon`&&!tags.includes(`itemProc`)){const before=Oo(run,target),push=Z(run,attacker,target,Oo(run,attacker),14),after=Oo(run,target);
const collision=(run.battlefield.features||[]).some(f=>f.solid&&f.integrity>0&&I(f.position,after)<=f.radius+2.5);
if(collision){target.statuses.stun=Math.max(1,target.statuses.stun||0);
G(run,`AIR FORCE COLLISION // ${target.name} hits solid terrain after ${push.toFixed(1)}m of knockback and is stunned.`,`mythic`)}}if(ids.includes(`airForce`)&&attacker.statuses.riftItemActionType===`strike`&&!tags.includes(`itemProc`)){const push=Z(run,attacker,target,Oo(run,attacker),10);
RIFT_ITEM_PROC_DAMAGE(run,attacker,target,Math.max(1,Math.round(damage*.28)),RIFT_HAS_PASSIVE(attacker,`airForce`),[`physical`,`force`,`itemProc`]);
G(run,`AIR FORCE // Compressed air detonates behind the Strike, adding damage and ${push.toFixed(1)}m knockback.`,`mythic`)}if(ids.includes(`hogyoku`)&&attacker.hp/Math.max(1,attacker.maxHp)<.35&&!attacker.statuses.v9Hogyoku){attacker.statuses.v9Hogyoku=1;
attacker.tiers.ap=M(attacker.tiers.ap+2,0,19);
attacker.tiers.durability=M(attacker.tiers.durability+2,0,19);
G(run,`HŌGYOKU // Crisis is answered with evolution. AP and Durability rise by 2 tiers for this fight.`,`mythic`)}if(ids.includes(`ruleBreaker`)&&attacker.statuses.riftItemActionType===`weapon`){[`speedBuff`,`dodgeBuff`,`apBuff`,`defenseUp`,`reflect`].forEach(k=>delete target.statuses[k])}if(ids.includes(`doomCrucible`)&&target.hp>0&&target.hp/target.maxHp<=.15&&attacker.statuses.riftItemActionType===`weapon`)target.hp=0};

const RIFT_V9_BASE_ITEM_PREVENT=RIFT_ITEM_PREVENT_DEATH;
RIFT_ITEM_PREVENT_DEATH=function RIFT_V9_ITEM_PREVENT(run,target,attacker,tags=[]){if(RIFT_V9_BASE_ITEM_PREVENT(run,target,attacker,tags))return true;
const ids=RIFT_ITEM_INSTANCES(target).map(x=>RIFT_ITEM(x.itemId)?.passiveId);
if(ids.includes(`hallows`)&&!target.statuses.v9HallowsUsed&&!tags.includes(`deathPierce`)){target.statuses.v9HallowsUsed=1;
target.hp=Math.max(1,Math.round(target.maxHp*.2));
target.statuses.itemInvisible=1;
G(run,`DEATHLY HALLOWS // Death is met, escaped, and left holding an empty cloak.`,`mythic`);
return true}return false};

const RIFT_V9_BASE_TURN=RIFT_ITEM_TURN_END;
RIFT_ITEM_TURN_END=function RIFT_V9_TURN(run,fighter){RIFT_V9_BASE_TURN(run,fighter);
if(fighter.statuses.antiHealTurns>0&&--fighter.statuses.antiHealTurns<=0){delete fighter.statuses.antiHealTurns;
delete fighter.statuses.antiHealStacks}if(fighter.statuses.gravityMpCut?.turns>0&&--fighter.statuses.gravityMpCut.turns<=0)delete fighter.statuses.gravityMpCut;
if(RIFT_HAS_PASSIVE(fighter,`arcReactor`)&&fighter.energy>fighter.maxEnergy*.85)fighter.shield=Math.min(fighter.maxHp*.3,(fighter.shield||0)+Math.round(fighter.maxHp*.04));
if(RIFT_HAS_PASSIVE(fighter,`stoneMask`)&&fighter.hp/fighter.maxHp<.5)fighter.hp=Math.min(fighter.maxHp,fighter.hp+Math.round(fighter.maxHp*.035))};

const RIFT_V9_BASE_BUY=RIFT_BUY_ITEM;
RIFT_BUY_ITEM=function RIFT_V9_BUY(run,itemId){const item=RIFT_ITEM(itemId);
if(item?.rarity===`Mythical`){const owned=RIFT_ITEM_INSTANCES(run.player).map(x=>RIFT_ITEM(x.itemId)).find(x=>x?.rarity===`Mythical`&&x.id!==itemId);
if(owned)return{ok:false,item,reason:`MYTHICAL SLOT OCCUPIED · ${owned.name} is already your one Mythical.`}}return RIFT_V9_BASE_BUY(run,itemId)};

const RIFT_V9_BASE_NORMALIZE=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function RIFT_V9_NORMALIZE(run){RIFT_V9_BASE_NORMALIZE(run);
const meta=RIFT_V9_SYNC_META(run);
run.metaProgression={...(run.metaProgression||{}),calamityUnlocked:meta.calamityUnlocked,afo50:meta.afo50};
if(run.player){if(run.player.power?.name===`One For All`){run.player.supplementalPowers=[];
run.player.activeSupplementalPower=null}run.player.statuses.rikaSummon=Number.isFinite(run.player.statuses.rikaSummon)?run.player.statuses.rikaSummon:0;
run.player.statuses.vesselExtra=RIFT_HAS_PASSIVE(run.player,`sukunaFinger`)?1:0;
if(RIFT_HAS_PASSIVE(run.player,`sukunaFinger`)&&run.player.trait?.name===`Vessel`)run.player.statuses.vesselMythicDiscount=.35}return run};

function RIFT_V9_GIVE_ENEMY_ITEMS(run,fighter){if(!fighter||run.floor<=5)return;
RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
fighter.inventory=Array(6).fill(null);
const maxItems=Math.min(6,1+Math.floor((run.floor-6)/8));
const maxRank=run.floor<12?1:run.floor<22?2:run.floor<34?3:run.floor<44?4:5;
const rarityRank={Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4,Mythical:5};
const pool=RIFT_ITEM_CATALOG.filter(item=>(rarityRank[item.rarity]??0)<=maxRank&&item.rarity!==`Mythical`||run.floor>=45&&item.rarity===`Mythical`).sort((a,b)=>RIFT_ITEM_SCORE(b,fighter)-RIFT_ITEM_SCORE(a,fighter));
let picked=[];
for(const item of pool){if(picked.length>=maxItems)break;
if(item.rarity===`Mythical`&&picked.some(x=>x.rarity===`Mythical`))continue;
if(item.category===`Weapon`&&picked.some(x=>x.category===`Weapon`))continue;