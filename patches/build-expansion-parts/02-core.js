const RIFT_BUILD_EXPANSION_VERSION = 1;
function RIFT_UID(prefix = `item`) {
  try { return `${prefix}-${F()}`; } catch { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
}
function RIFT_EMPTY_WEAPON() {
  return {name:`Weaponless`,rarity:`Common`,description:`No weapon is equipped. Find or build one in an Item Shop, then move it into slot 0.`,glyph:`∅`,cost:0,type:`None`,empty:true,itemId:null,damageType:`Physical`,tags:[`weaponless`]};
}
function RIFT_ITEM_INSTANCE(itemId, invested = 0, extra = {}) {
  return {uid:RIFT_UID(`gear`),itemId:String(itemId),invested:Math.max(0,Math.round(invested || 0)),...extra};
}
function RIFT_ITEM_INSTANCES(fighter) {
  return Array.isArray(fighter?.inventory) ? fighter.inventory.filter(Boolean) : [];
}
function RIFT_OWNS_ITEM(fighter, itemId) {
  return RIFT_ITEM_INSTANCES(fighter).some(instance => instance.itemId === itemId);
}
function RIFT_ACTIVE_ITEM(fighter) {
  const instance = fighter?.inventory?.[0];
  const item = instance ? RIFT_ITEM(instance.itemId) : null;
  return item?.category === `Weapon` ? item : null;
}
function RIFT_SYNC_WEAPON(fighter) {
  if (!fighter) return RIFT_EMPTY_WEAPON();
  const instance = fighter.inventory?.[0];
  const item = instance ? RIFT_ITEM(instance.itemId) : null;
  if (!item || item.category !== `Weapon`) return fighter.weapon = RIFT_EMPTY_WEAPON();
  const legacy = instance.legacyWeapon && typeof instance.legacyWeapon === `object` ? instance.legacyWeapon : null;
  const weapon = item.weapon || {};
  fighter.weapon = {
    name: legacy?.name || item.name,
    rarity: item.rarity,
    description: legacy ? `${legacy.description || item.description || item.passive} · Preserved as a migrated Legacy Armament.` : `${item.passive} ${item.lore}`,
    glyph: legacy?.glyph || item.glyph,
    cost: Math.max(0, Math.round(weapon.cost || legacy?.cost || 0)),
    type: `Item Weapon`,
    itemId: item.id,
    damageType: weapon.damageType || `Physical`,
    tags: [...(weapon.attackTags || [`physical`,`weapon`])],
    range: weapon.range || 3,
    power: .82 + RIFT_ITEM_RARITIES.indexOf(item.rarity)*.1 + Math.max(0,item.stats?.as||0)*.018 + Math.max(0,item.stats?.ap||0)*.018,
    destruction: .58 + RIFT_ITEM_RARITIES.indexOf(item.rarity)*.16 + Math.max(0,item.stats?.as||0)*.035,
    accuracy: Math.min(.16,Math.max(0,item.stats?.combatSkill||0)*.012+Math.max(0,item.stats?.battleIq||0)*.006),
  };
  return fighter.weapon;
}
function RIFT_REFRESH_ITEM_POOLS(fighter) {
  if(!fighter||!Number.isFinite(fighter.maxHp)||!Number.isFinite(fighter.maxEnergy))return fighter;
  const previous=fighter.itemDerived||{hp:0,energy:0,posture:0};
  let hp=Math.round(RIFT_ITEM_STAT_BONUS(fighter,`durability`)*44),energy=Math.round(RIFT_ITEM_STAT_BONUS(fighter,`energy`)*9),posture=Math.round(RIFT_ITEM_STAT_BONUS(fighter,`durability`)*4+RIFT_ITEM_STAT_BONUS(fighter,`combatSkill`)*2);
  if(fighter.race?.name===`Fairy`)hp=Math.round(hp*.84);if(fighter.race?.name===`Titanblood`)hp=Math.round(hp*1.22);
  if(fighter.race?.name===`Elf`)energy=Math.round(energy*1.22);if(fighter.race?.name===`Magiborn`)energy=Math.round(energy*1.28);if(fighter.race?.name===`Saiyan`)energy=Math.round(energy*1.22);if(fighter.trait?.name===`Legendary Saiyan`)energy=Math.round(energy*1.65);if(fighter.trait?.name===`Zenin`)energy*=2;if(fighter.power?.name===`Cursed Child`)energy*=4;
  const hpDelta=hp-(previous.hp||0),energyDelta=energy-(previous.energy||0),postureDelta=posture-(previous.posture||0);
  fighter.maxHp=Math.max(1,fighter.maxHp+hpDelta);fighter.hp=hpDelta>=0?Math.min(fighter.maxHp,fighter.hp+hpDelta):Math.min(fighter.hp,fighter.maxHp);
  fighter.maxEnergy=Math.max(1,fighter.maxEnergy+energyDelta);fighter.energy=energyDelta>=0?Math.min(fighter.maxEnergy,fighter.energy+energyDelta):Math.min(fighter.energy,fighter.maxEnergy);
  if(Number.isFinite(fighter.maxPosture)){fighter.maxPosture=Math.max(1,fighter.maxPosture+postureDelta);fighter.posture=Math.min(fighter.posture||0,fighter.maxPosture);}
  fighter.itemDerived={hp,energy,posture};return fighter;
}
function RIFT_NORMALIZE_FIGHTER_BUILD(fighter) {
  if (!fighter || typeof fighter !== `object`) return fighter;
  fighter.tiers = fighter.tiers || {};
  fighter.tiers.as = Number.isFinite(fighter.tiers.as) ? fighter.tiers.as : Math.max(0, Math.round(fighter.tiers.ap || 0));
  fighter.tiers.ap = Number.isFinite(fighter.tiers.ap) ? fighter.tiers.ap : fighter.tiers.as;
  fighter.statXp = fighter.statXp || {};
  fighter.statXp.as = Number.isFinite(fighter.statXp.as) ? fighter.statXp.as : 0;
  fighter.statXp.ap = Number.isFinite(fighter.statXp.ap) ? fighter.statXp.ap : 0;
  fighter.statCaps = fighter.statCaps || {};
  fighter.statCaps.as = Number.isFinite(fighter.statCaps.as) ? fighter.statCaps.as : Number.isFinite(fighter.statCaps.ap) ? fighter.statCaps.ap : 19;
  fighter.statCaps.ap = Number.isFinite(fighter.statCaps.ap) ? fighter.statCaps.ap : 19;
  fighter.statuses = fighter.statuses || {};
  const hadInventory = Array.isArray(fighter.inventory);
  const oldWeapon = fighter.weapon && !fighter.weapon.empty && fighter.weapon.name !== `Weaponless` ? {...fighter.weapon} : null;
  const source = hadInventory ? fighter.inventory.slice(0,6) : [];
  fighter.inventory = Array.from({length:6}, (_, index) => {
    const raw = source[index];
    if (!raw) return null;
    if (typeof raw === `string`) return RIFT_ITEM(raw) ? RIFT_ITEM_INSTANCE(raw, RIFT_ITEM(raw).price) : null;
    if (!RIFT_ITEM(raw.itemId)) return null;
    return {uid:raw.uid || RIFT_UID(`gear`),itemId:raw.itemId,invested:Math.max(0,Math.round(raw.invested || RIFT_ITEM(raw.itemId).price)),...(raw.legacyWeapon?{legacyWeapon:{...raw.legacyWeapon}}:{})};
  });
  if (!hadInventory && oldWeapon) fighter.inventory[0] = RIFT_ITEM_INSTANCE(`rift-heirloom`, 40, {legacyWeapon:oldWeapon});
  if (fighter.inventory[0] && RIFT_ITEM(fighter.inventory[0].itemId)?.category !== `Weapon`) {
    const free = fighter.inventory.findIndex((slot,index) => index > 0 && !slot);
    if (free > 0) [fighter.inventory[0], fighter.inventory[free]] = [null, fighter.inventory[0]];
    else fighter.inventory[0] = null;
  }
  fighter.buildExpansionVersion = RIFT_BUILD_EXPANSION_VERSION;
  fighter.itemCooldowns = fighter.itemCooldowns && typeof fighter.itemCooldowns === `object` ? fighter.itemCooldowns : {};
  RIFT_SYNC_WEAPON(fighter);
  RIFT_REFRESH_ITEM_POOLS(fighter);
  return fighter;
}
function RIFT_NORMALIZE_RUN_BUILD(run) {
  if (!run || typeof run !== `object`) return run;
  RIFT_NORMALIZE_FIGHTER_BUILD(run.player);
  RIFT_NORMALIZE_FIGHTER_BUILD(run.enemy);
  (run.auxiliaryCombatants || []).forEach(entry => RIFT_NORMALIZE_FIGHTER_BUILD(entry?.fighter));
  (run.nemeses || []).forEach(entry => RIFT_NORMALIZE_FIGHTER_BUILD(entry?.fighter));
  run.itemActionSerial = Number.isFinite(run.itemActionSerial) ? run.itemActionSerial : 0;
  run.itemFeed = Array.isArray(run.itemFeed) ? run.itemFeed.slice(-8) : [];
  run.ownedLegendaries = RIFT_ITEM_INSTANCES(run.player).map(instance => RIFT_ITEM(instance.itemId)).filter(item => item?.rarity === `Legendary`).map(item => item.id);
  run.shopOffers = Array.isArray(run.shopOffers) ? run.shopOffers.map(offer => typeof offer === `string` ? RIFT_ITEM(offer) : RIFT_ITEM(offer?.id)).filter(Boolean) : [];
  run.buildExpansionVersion = RIFT_BUILD_EXPANSION_VERSION;
  return run;
}
function RIFT_ITEM_STAT_BONUS(fighter, stat) {
  return RIFT_ITEM_INSTANCES(fighter).reduce((sum, instance) => sum + Number(RIFT_ITEM(instance.itemId)?.stats?.[stat] || 0), 0);
}
function RIFT_ITEM_STAT_TOTALS(fighter) {
  return Object.fromEntries(RIFT_ITEM_STAT_KEYS.map(stat => [stat, RIFT_ITEM_STAT_BONUS(fighter, stat)]));
}
function RIFT_ITEM_STAT_TEXT(item) {
  const labels = {as:`AS`,ap:`AP`,durability:`DUR`,speed:`SPD`,range:`RNG`,iq:`IQ`,battleIq:`BIQ`,combatSkill:`CS`,energy:`ENG`,regeneration:`REG`};
  return RIFT_ITEM_STAT_KEYS.filter(stat => Number(item?.stats?.[stat])).map(stat => `${item.stats[stat] > 0 ? `+` : ``}${item.stats[stat]} ${labels[stat]}`).join(` · `) || `No direct stat tiers`;
}
function RIFT_FREE_SLOT_FOR(inventory, item) {
  if (item?.category === `Weapon` && !inventory[0]) return 0;
  for (let index = 1; index < 6; index += 1) if (!inventory[index]) return index;
  return -1;
}
function RIFT_MOVE_ITEM(fighter, from, to) {
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  from = Math.round(Number(from)); to = Math.round(Number(to));
  if (from < 0 || from > 5 || to < 0 || to > 5 || from === to) return {ok:false,reason:`Choose two different inventory slots.`};
  const moving = fighter.inventory[from];
  const displaced = fighter.inventory[to];
  if (!moving) return {ok:false,reason:`That slot is empty.`};
  if (to === 0 && RIFT_ITEM(moving.itemId)?.category !== `Weapon`) return {ok:false,reason:`Only weapons can occupy active slot 0.`};
  if (from === 0 && displaced && RIFT_ITEM(displaced.itemId)?.category !== `Weapon`) return {ok:false,reason:`Armor and relics cannot be swapped into active slot 0.`};
  [fighter.inventory[from],fighter.inventory[to]] = [displaced,moving];
  RIFT_SYNC_WEAPON(fighter);
  return {ok:true,reason:to === 0 ? `${RIFT_ITEM(moving.itemId).name} equipped immediately.` : from === 0 ? `Weapon unequipped. You are now weaponless.` : `Item moved.`};
}
function RIFT_RECIPE_PLAN(fighter, itemId) {
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  const target = RIFT_ITEM(itemId);
  if (!target) return {ok:false,reason:`Unknown item.`};
  if (target.rarity === `Legendary` && RIFT_OWNS_ITEM(fighter,target.id)) return {ok:false,reason:`Unique Legendary: only one ${target.name} may be owned.`};
  const available = fighter.inventory.map((instance,slot) => instance ? {instance,slot} : null).filter(Boolean);
  const used = new Set();
  const missing = [];
  const consumed = [];
  let cost = 0;
  const satisfy = (id, ancestry = []) => {
    if (ancestry.includes(id)) throw new Error(`Cyclic recipe: ${[...ancestry,id].join(` -> `)}`);
    const owned = available.find(entry => !used.has(entry.instance.uid) && entry.instance.itemId === id);
    if (owned) { used.add(owned.instance.uid); consumed.push(owned); return; }
    const item = RIFT_ITEM(id);
    if (!item) throw new Error(`Missing recipe item ${id}`);
    if (!item.recipe.length) { cost += item.price; missing.push(id); return; }
    item.recipe.forEach(component => satisfy(component,[...ancestry,id]));
    cost += item.combineCost;
  };
  try { target.recipe.length ? (target.recipe.forEach(component => satisfy(component,[target.id])), cost += target.combineCost) : (cost = target.price, missing.push(target.id)); }
  catch (error) { return {ok:false,reason:error.message}; }
  const simulated = fighter.inventory.map(instance => instance ? {...instance} : null);
  consumed.forEach(entry => { simulated[entry.slot] = null; });
  const slot = RIFT_FREE_SLOT_FOR(simulated,target);
  if (slot < 0) return {ok:false,reason:target.category === `Weapon` && !simulated.slice(1).some(slot=>!slot) ? `No legal slot remains. Sell or consume an item first.` : `Inventory full. Sell or use components before building this item.`};
  return {ok:true,item:target,cost:Math.max(0,Math.round(cost)),missing,consumeUids:consumed.map(entry=>entry.instance.uid),consumeSlots:consumed.map(entry=>entry.slot),slot,ownedValue:consumed.reduce((sum,entry)=>sum+(entry.instance.invested||RIFT_ITEM(entry.instance.itemId)?.price||0),0)};
}
function RIFT_BUY_ITEM(run, itemId) {
  RIFT_NORMALIZE_RUN_BUILD(run);
  const plan = RIFT_RECIPE_PLAN(run.player,itemId);
  if (!plan.ok) return plan;
  if ((run.shards || 0) < plan.cost) return {...plan,ok:false,reason:`Need ${plan.cost - (run.shards || 0)} more Shards.`};
  const consumed = new Set(plan.consumeUids);
  run.player.inventory = run.player.inventory.map(instance => instance && consumed.has(instance.uid) ? null : instance);
  const instance = RIFT_ITEM_INSTANCE(itemId, plan.cost + plan.ownedValue);
  run.player.inventory[plan.slot] = instance;
  run.shards = Math.max(0,(run.shards || 0)-plan.cost);
  RIFT_SYNC_WEAPON(run.player);
  RIFT_REFRESH_ITEM_POOLS(run.player);
  run.ownedLegendaries = RIFT_ITEM_INSTANCES(run.player).map(entry=>RIFT_ITEM(entry.itemId)).filter(item=>item?.rarity===`Legendary`).map(item=>item.id);
  const built = plan.item.recipe.length && plan.consumeUids.length;
  const message = `${built?`BUILT`:`ACQUIRED`} ${plan.item.name} · ${plan.cost} ◆${plan.consumeUids.length?` · ${plan.consumeUids.length} owned component${plan.consumeUids.length===1?``:`s`} consumed`:``}`;
  run.itemFeed.push({id:RIFT_UID(`purchase`),tone:plan.item.rarity.toLowerCase(),message,itemId});
  run.itemFeed = run.itemFeed.slice(-8);
  try { G(run,`ITEM SHOP // ${message}.`,plan.item.rarity===`Legendary`?`mythic`:`system`); } catch {}
  return {...plan,ok:true,instance,message};
}
function RIFT_SELL_ITEM(run, slot) {
  RIFT_NORMALIZE_RUN_BUILD(run);
  slot = Math.round(Number(slot));
  const instance = run.player.inventory[slot];
  if (!instance) return {ok:false,reason:`That slot is empty.`};
  const item = RIFT_ITEM(instance.itemId);
  const refund = Math.max(1,Math.floor((instance.invested || item.price)*.6));
  run.player.inventory[slot] = null;
  run.shards = (run.shards || 0) + refund;
  RIFT_SYNC_WEAPON(run.player);
  RIFT_REFRESH_ITEM_POOLS(run.player);
  run.ownedLegendaries = RIFT_ITEM_INSTANCES(run.player).map(entry=>RIFT_ITEM(entry.itemId)).filter(entry=>entry?.rarity===`Legendary`).map(entry=>entry.id);
  const message = `SOLD ${item.name} · +${refund} ◆`;
  run.itemFeed.push({id:RIFT_UID(`sale`),tone:`sale`,message,itemId:item.id});
  run.itemFeed = run.itemFeed.slice(-8);
  return {ok:true,item,refund,message};
}
function RIFT_RECIPE_TREE(itemId, seen = new Set()) {
  const item = RIFT_ITEM(itemId);
  if (!item || seen.has(itemId)) return null;
  const next = new Set(seen); next.add(itemId);
  return {id:item.id,name:item.name,rarity:item.rarity,price:item.price,combineCost:item.combineCost,children:item.recipe.map(id=>RIFT_RECIPE_TREE(id,next)).filter(Boolean)};
}
function RIFT_RECIPE_FLAT(itemId) {
  const tree = RIFT_RECIPE_TREE(itemId), rows=[];
  const visit = (node,depth=0) => { if (!node) return; rows.push({...node,depth}); node.children.forEach(child=>visit(child,depth+1)); };
  visit(tree); return rows;
}
function RIFT_BUILD_PROFILE(fighter) {
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  const totals = RIFT_ITEM_STAT_TOTALS(fighter);
  const physical = totals.as*3 + totals.combatSkill + totals.durability*.4;
  const magic = totals.ap*3 + totals.energy + totals.iq*.6;
  const defense = totals.durability*2.3 + totals.regeneration*1.7;
  const utility = totals.speed + totals.range + totals.battleIq + totals.iq*.5;
  const dominant = [[`Physical`,physical],[`Arcane`,magic],[`Fortress`,defense],[`Tactical`,utility]].sort((a,b)=>b[1]-a[1])[0];
  return {name:dominant[1] > 0 ? dominant[0] : `Unformed`,physical,magic,defense,utility,totals,weapon:RIFT_ACTIVE_ITEM(fighter)};
}
function RIFT_ITEM_SCORE(item, fighter) {
  const declared = fighter?.power?.damageType;
  const power = declared === `Physical` || (!declared && fighter?.power?.moves?.flatMap(move=>move.tags||[]).includes(`physical`)) ? `Physical` : `Magic`;
  const stats = item.stats || {};
  let score = item.rarity === `Legendary` ? 18 : item.rarity === `Epic` ? 10 : 4;
  score += power === `Physical` ? (stats.as||0)*5+(stats.combatSkill||0)*2 : (stats.ap||0)*5+(stats.energy||0)*1.5;
  score += (stats.durability||0)*1.3+(stats.speed||0)+(stats.range||0)*.8+(stats.battleIq||0)*.7;
  if (!RIFT_ACTIVE_ITEM(fighter) && item.category === `Weapon`) score += 16;
  if (item.rarity === `Legendary` && RIFT_OWNS_ITEM(fighter,item.id)) score = -1e4;
  return score;
}
function RIFT_RECOMMENDED_ITEMS(fighter, offers, count = 4) {
  return [...offers].sort((a,b)=>RIFT_ITEM_SCORE(b,fighter)-RIFT_ITEM_SCORE(a,fighter)).slice(0,count).map(item=>item.id);
}
function RIFT_SHOP_OFFERS(floor, fighter = null) {
  const maxRank = floor >= 10 ? 4 : floor >= 6 ? 3 : floor >= 3 ? 2 : 1;
  const eligible = RIFT_ITEM_CATALOG.filter(item => RIFT_ITEM_RARITIES.indexOf(item.rarity) <= maxRank && !(item.rarity === `Legendary` && fighter && RIFT_OWNS_ITEM(fighter,item.id)));
  const weighted = eligible.map(item => ({item,key:Math.random()/(1+RIFT_ITEM_RARITIES.indexOf(item.rarity)*.55)})).sort((a,b)=>b.key-a.key).map(entry=>entry.item);
  const chosen=[];
  const add = item => item && !chosen.some(entry=>entry.id===item.id) && chosen.push(item);
  if(maxRank>=4)add((fighter?[...eligible].sort((a,b)=>RIFT_ITEM_SCORE(b,fighter)-RIFT_ITEM_SCORE(a,fighter)):weighted).find(item=>item.rarity===`Legendary`));
  if(maxRank>=3)add(weighted.find(item=>item.rarity===`Epic`));
  if(maxRank>=2)add(weighted.find(item=>item.rarity===`Rare`));
  RIFT_ITEM_CATEGORIES.forEach(category => add(weighted.find(item=>item.category===category)));
  if (fighter) RIFT_RECOMMENDED_ITEMS(fighter,eligible,5).forEach(id=>add(RIFT_ITEM(id)));
  weighted.forEach(item=>chosen.length<Math.min(18,12+Math.floor(floor/2))&&add(item));
  return chosen;
}

const RIFT_SCALING_OVERRIDES = new Map([
  [`Black Flash`,{mode:`Hybrid`,as:.58,ap:.42}],
  [`Divergent Fist`,{mode:`Hybrid`,as:.65,ap:.35}],
  [`World Cutting Slash`,{mode:`AP`,as:0,ap:1}],
  [`Malevolent Shrine`,{mode:`AP`,as:0,ap:1}],
  [`Hollow Purple`,{mode:`AP`,as:0,ap:1}],
  [`Maximum Purple`,{mode:`AP`,as:0,ap:1}],
  [`Big Bang Storm`,{mode:`AP`,as:0,ap:1}],
  [`Divine Departure`,{mode:`Hybrid`,as:.55,ap:.45}],
  [`Road Roller`,{mode:`AS`,as:1,ap:0}],
  [`Consecutive Normal Punches`,{mode:`AS`,as:1,ap:0}],
  [`Thunderstruck`,{mode:`AP`,as:0,ap:1}],
  [`Knockback Collision`,{mode:`Special`,as:0,ap:0}],
]);
function RIFT_ACTION_SCALING(action, fighter = null) {
  const move = action?.move || action || {};
  const override = RIFT_SCALING_OVERRIDES.get(move.name || action?.name);
  if (override) return {...override};
  const tags = [...(move.tags || []),...(action?.tags || [])];
  if (tags.includes(`scalingSpecial`) || tags.includes(`environment`) && !tags.includes(`physical`) && !tags.includes(`magic`)) return {mode:`Special`,as:0,ap:0};
  if (tags.includes(`scalingHybrid`) || tags.includes(`hybrid`) || tags.includes(`physical`) && tags.includes(`magic`)) return {mode:`Hybrid`,as:.5,ap:.5};
  if (tags.includes(`scalingAS`) || tags.includes(`physical`) || action?.type === `strike`) return {mode:`AS`,as:1,ap:0};
  if (tags.includes(`scalingAP`) || tags.some(tag=>[`magic`,`curse`,`cursed`,`energy`,`beam`,`spatial`,`reality`,`standAbility`,`devilAbility`].includes(tag))) return {mode:`AP`,as:0,ap:1};
  if (tags.includes(`causality`) || tags.includes(`causal`)) return {mode:`Special`,as:0,ap:0};
  if (action?.type === `weapon`) {
    const type = RIFT_ACTIVE_ITEM(fighter)?.weapon?.damageType || fighter?.weapon?.damageType || `Physical`;
    return type === `Hybrid` ? {mode:`Hybrid`,as:.55,ap:.45} : type === `Magic` ? {mode:`AP`,as:0,ap:1} : {mode:`AS`,as:1,ap:0};
  }
  const type = fighter?.power?.damageType || fighter?.power?.type;
  return type === `Physical` ? {mode:`AS`,as:1,ap:0} : type === `Hybrid` ? {mode:`Hybrid`,as:.5,ap:.5} : {mode:`AP`,as:0,ap:1};
}
function RIFT_SCALING_LABEL(action, fighter = null) {
  const scaling = RIFT_ACTION_SCALING(action,fighter);
  return scaling.mode === `Hybrid` ? `HYBRID · ${Math.round(scaling.as*100)}% AS / ${Math.round(scaling.ap*100)}% AP` : scaling.mode === `Special` ? `SPECIAL · NON-STANDARD` : `${scaling.mode} SCALING`;
}
function RIFT_OFFENSE_TIER(fighter, actionOrTags = null) {
  if(!fighter)return 0;const action=Array.isArray(actionOrTags)?{tags:actionOrTags}:actionOrTags,scaling=action?RIFT_ACTION_SCALING(action,fighter):fighter.statuses?.riftItemActionScaling||RIFT_ACTION_SCALING({},fighter),as=Number(Y(fighter,`as`)||0),ap=Number(Y(fighter,`ap`)||0);
  return scaling.mode===`AS`?as:scaling.mode===`AP`?ap:scaling.mode===`Hybrid`?as*(scaling.as||.5)+ap*(scaling.ap||.5):0;
}
function RIFT_BEGIN_ITEM_ACTION(run, fighter, action) {
  if (!run || !fighter) return;
  run.itemActionSerial = (run.itemActionSerial || 0) + 1;
  fighter.statuses = fighter.statuses || {};
  fighter.statuses.riftItemActionId = run.itemActionSerial;
  fighter.statuses.riftItemActionScaling = RIFT_ACTION_SCALING(action,fighter);
  fighter.statuses.riftItemActionType = action?.type || `special`;
  fighter.statuses.riftItemActionName = action?.name || action?.move?.name || `Action`;
  fighter.statuses.riftLastActionCost = Math.max(0,Number(action?.cost || action?.move?.cost || 0));
  const tags=action?.move?.tags||[];
  const omnitrix=RIFT_HAS_PASSIVE(fighter,`omnitrix`);
  if(omnitrix&&tags.some(tag=>[`transform`,`kiTransform`,`spiralEvolve`,`devilTransform`,`hybridTransform`].includes(tag))&&RIFT_ITEM_TRIGGER(run,fighter,omnitrix)){
    const physical=RIFT_ACTION_SCALING(action,fighter).mode===`AS`||fighter.power?.damageType===`Physical`;
    fighter.statuses[physical?`itemOmnitrixAs`:`itemOmnitrixAp`]=2;
    fighter.shield=Math.max(fighter.shield||0,Math.round(fighter.maxHp*.15));
    RIFT_ITEM_VFX(run,fighter,omnitrix);
  }
  if (action?.type === `ultimate`) fighter.statuses.itemUltimateUsed = run.itemActionSerial;
}
function RIFT_DAMAGE_SCALING(run, attacker, tags = []) {
  if (!attacker?.tiers || tags.includes(`itemProc`) || tags.includes(`noScalingSwap`)) return {mode:`Special`,as:0,ap:0,factor:1};
  let scaling = attacker.statuses?.riftItemActionScaling;
  if (!scaling || tags.includes(`environment`)) scaling = RIFT_ACTION_SCALING({tags},attacker);
  if (scaling.mode === `Special`) return {...scaling,factor:1};
  const oldAp = Number(Y(attacker,`ap`) || 0);
  const selected = RIFT_OFFENSE_TIER(attacker,{tags});
  const factor = Math.max(.02,Math.min(50,((26+selected*4.5)/Math.max(1,26+oldAp*4.5))*1.105**(selected-oldAp)));
  return {...scaling,factor};
}
function RIFT_ITEM_COOLDOWN_KEY(item) { return `itemCd_${item?.passiveId || item?.id || `unknown`}`; }
function RIFT_ITEM_READY(fighter,item) { return !!item && !(fighter.itemCooldowns?.[RIFT_ITEM_COOLDOWN_KEY(item)] > 0); }
function RIFT_ITEM_PROC_ONCE(run,fighter,item,channel=`effect`) {
  if (!item) return false;
  const action = fighter.statuses?.riftItemActionId || run?.itemActionSerial || 0;
  const key = `itemProc_${item.passiveId || item.id}_${channel}`;
  if (fighter.statuses?.[key] === action) return false;
  fighter.statuses[key] = action;
  return true;
}
function RIFT_ITEM_TRIGGER(run,fighter,item) {
  if (!item) return false;
  if (!RIFT_ITEM_READY(fighter,item) || !RIFT_ITEM_PROC_ONCE(run,fighter,item)) return false;
  if (item.cooldown) fighter.itemCooldowns[RIFT_ITEM_COOLDOWN_KEY(item)] = item.cooldown + 1;
  return true;
}
function RIFT_ITEM_VFX(run,fighter,item,kind=`burst`,target=null) {
  if (!run?.battlefield?.effectEchoes) return;
  let origin={x:50,y:32},destination={x:50,y:32};
  try { const actor=RIFT_ACTOR_ID_FOR_FIGHTER(run,fighter); if(actor) origin={...W(run,actor)}; const victim=target&&RIFT_ACTOR_ID_FOR_FIGHTER(run,target); if(victim) destination={...W(run,victim)}; else destination={...origin}; } catch {}
  run.battlefield.effectEchoes.push({id:`item-${item.id}-${RIFT_UID(`vfx`)}`,className:`build-item-vfx item-vfx-${item.passiveId||item.id}`,shape:kind===`line`?`line`:`area`,motion:`burst`,origin,target:destination,radius:item.rarity===`Legendary`?8:5,accent:item.accent,secondary:`#ffffff`,tertiary:`#090b14`,turns:2});
}
function RIFT_ITEM_LOG(run,item,text,tone=`system`) { try { G(run,`${item.name.toUpperCase()} // ${text}`,item.rarity===`Legendary`?`mythic`:tone); } catch {} }
function RIFT_HAS_PASSIVE(fighter,passiveId) { return RIFT_ITEM_INSTANCES(fighter).map(instance=>RIFT_ITEM(instance.itemId)).find(item=>item?.passiveId===passiveId||item?.id===passiveId) || null; }
function RIFT_ITEM_OUTGOING(run, attacker, target, amount, tags = []) {
  if (!attacker || tags.includes(`itemProc`) || tags.includes(`noItemProc`)) return amount;
  RIFT_NORMALIZE_FIGHTER_BUILD(attacker);
  let value = Number(amount || 0), scaling = RIFT_DAMAGE_SCALING(run,attacker,tags), mode=scaling.mode;
  value *= scaling.factor;
  const ratio = attacker.hp/Math.max(1,attacker.maxHp);
  const type = attacker.statuses?.riftItemActionType;
  const action = attacker.statuses?.riftItemActionId || 0;
  const mult = (id,factor,condition=true) => { const item=RIFT_HAS_PASSIVE(attacker,id); if(item&&condition){value*=factor;if(RIFT_ITEM_PROC_ONCE(run,attacker,item,`visual`))RIFT_ITEM_VFX(run,attacker,item,`burst`,target);} };
  mult(`berserkerArmor`,1.24,ratio<.45&&mode===`AS`);
  mult(`dragonslayer`,1.2,mode===`AS`&&(run?.boss||target?.statuses?.boss));
  mult(`spiralDrill`,1.18,mode===`Hybrid`&&attacker.energy/Math.max(1,attacker.maxEnergy)>.7);
  mult(`outerCompass`,1.12,(attacker.statuses?.riftLastAimDistance||0)>12);
  mult(`sixEyesItem`,1.14,mode===`AP`&&(attacker.statuses?.riftLastActionCost||0)>=35&&RIFT_ITEM_READY(attacker,RIFT_HAS_PASSIVE(attacker,`sixEyesItem`)));
  mult(`oneRing`,1.15,mode===`AP`&&ratio<.35);
  mult(`horizon`,1.07,(attacker.statuses?.riftLastAimDistance||0)>0);
  mult(`hybridFury`,1.12,mode===`Hybrid`&&attacker.devilHybrid?.transformed);
  mult(`godhand`,1.2,mode===`AS`&&action%4===0);
  mult(`northStar`,1.3,mode===`AS`&&action%5===0);
  mult(`tachyon`,1.18,!!attacker.statuses?.itemTachyonCharged);
  if (attacker.statuses?.itemTachyonCharged) delete attacker.statuses.itemTachyonCharged;
  mult(`worldRend`,1.32,type===`weapon`&&!!attacker.statuses?.itemWorldRendPrimed);
  if(type===`weapon`) delete attacker.statuses.itemWorldRendPrimed;
  mult(`olympusBlade`,1.24,type===`ultimate`&&mode!==`AP`&&attacker.energy>0);
  mult(`sixStones`,1.2,!!attacker.statuses?.itemSixStonesPrimed);
  if(attacker.statuses?.itemSixStonesPrimed) delete attacker.statuses.itemSixStonesPrimed;
  mult(`infiniteGrimoire`,1.08,mode===`AP`);
  mult(`celestialDragonscale`,1+Math.min(.18,(attacker.statuses?.itemAlternatingScale||0)*.06),mode===`AS`||mode===`AP`);
  if (type===`ultimate`) { attacker.statuses.itemWorldRendPrimed=1; attacker.statuses.itemSixStonesPrimed=1; }
  const certain=RIFT_HAS_PASSIVE(attacker,`certainLine`);if(certain&&type===`weapon`&&RIFT_ITEM_TRIGGER(run,attacker,certain)){value*=1.18;attacker.statuses.itemCertainLine=1;RIFT_ITEM_VFX(run,attacker,certain,`line`,target);}
  const requiem=RIFT_HAS_PASSIVE(attacker,`requiemArrow`);if(requiem&&type===`ultimate`&&attacker.stand&&RIFT_ITEM_TRIGGER(run,attacker,requiem)){value*=1.22;attacker.ultimate=Math.min(100,(attacker.ultimate||0)+25);RIFT_ITEM_VFX(run,attacker,requiem,`burst`,target);}
  if(mode===`AS`&&attacker.statuses.itemOmnitrixAs>0)value*=1.1;
  if(mode===`AP`&&attacker.statuses.itemOmnitrixAp>0)value*=1.1;
  return Math.max(0,value);
}
function RIFT_ITEM_INCOMING(run, attacker, target, amount, tags = []) {
  if (!target || tags.includes(`itemProc`) || tags.includes(`noItemProc`)) return amount;
  RIFT_NORMALIZE_FIGHTER_BUILD(target);
  let value=Number(amount||0), scaling=RIFT_DAMAGE_SCALING(run,attacker,tags);
  const reduce = (id,factor,condition=true,trigger=false) => { const item=RIFT_HAS_PASSIVE(target,id); if(item&&condition&&(!trigger||RIFT_ITEM_TRIGGER(run,target,item))){value*=factor;if(trigger||RIFT_ITEM_PROC_ONCE(run,target,item,`defenseVisual`))RIFT_ITEM_VFX(run,target,item,`burst`,attacker);return true} return false; };
  reduce(`lastCity`,.9,target.hp/Math.max(1,target.maxHp)>.7);
  reduce(`absoluteTerritory`,.6,scaling.mode===`AP`,true);
  reduce(`kamuiWeave`,.3,!tags.some(tag=>[`causality`,`causal`,`absolute`,`deathPierce`].includes(tag)),true);
  reduce(`invisibility`,.55,!!target.statuses.itemInvisible,true);
  if(target.statuses.itemInvisible) delete target.statuses.itemInvisible;
  reduce(`echoShell`,.82,true,false);
  if(RIFT_HAS_PASSIVE(target,`echoShell`)) target.statuses.itemEchoStored=Math.min(target.maxHp*.2,(target.statuses.itemEchoStored||0)+value*.18);
  reduce(`dragonscale`,1-Math.min(.18,(target.statuses.itemAlternatingScale||0)*.06));
  return Math.max(0,value);
}
function RIFT_ITEM_PROC_DAMAGE(run,attacker,target,amount,item,tags=[`magic`]) {
  if (!target || target.hp<=0 || amount<=0) return 0;
  RIFT_ITEM_VFX(run,attacker,item,`line`,target);
  return go(run,attacker,target,amount,tags.includes(`magic`),[...tags,`itemProc`,`noItemProc`,`noCounter`]);
}
function RIFT_ITEM_AFTER_DAMAGE(run,attacker,target,damage,tags=[]) {
  if (!attacker || !target || damage<=0 || tags.includes(`itemProc`) || tags.includes(`noItemProc`)) return;
  const mode=RIFT_DAMAGE_SCALING(run,attacker,tags).mode,type=attacker.statuses?.riftItemActionType,action=attacker.statuses?.riftItemActionId||0;
  const proc = (id,portion,procTags=[`magic`],condition=true) => { const item=RIFT_HAS_PASSIVE(attacker,id); if(item&&condition&&RIFT_ITEM_TRIGGER(run,attacker,item)){RIFT_ITEM_PROC_DAMAGE(run,attacker,target,Math.max(1,Math.round(damage*portion)),item,procTags);RIFT_ITEM_LOG(run,item,`A secondary effect resolves without recursively triggering item passives.`);} };
  proc(`spellEcho`,.22,[`magic`,`spellEcho`],mode===`AP`);
  proc(`spellshot`,.16,[`magic`,`spellshot`],action%3===0);
  proc(`lastThunder`,.24,[`magic`,`lightning`],type===`weapon`);
  proc(`riftcutter`,.18,[`physical`,`magic`,`hybrid`],type===`weapon`&&action%3===0);
  proc(`excalibur`,.28,[`physical`,`magic`,`hybrid`],type===`weapon`&&action%3===0);
  proc(`aja`,.26,[`magic`,`beam`],mode===`AP`&&tags.some(tag=>[`beam`,`projectile`,`energy`].includes(tag)));
  proc(`infiniteGrimoire`,.24,[`magic`,`spellEcho`],mode===`AP`&&action%3===0);
  proc(`weaponTempo`,.12,[`physical`],type===`weapon`&&action%2===0);
  const heal = (id,portion,condition=true) => { const item=RIFT_HAS_PASSIVE(attacker,id); if(item&&condition&&RIFT_ITEM_PROC_ONCE(run,attacker,item)){const amount=Math.max(1,Math.round(damage*portion));attacker.hp=Math.min(attacker.maxHp,attacker.hp+amount);RIFT_ITEM_VFX(run,attacker,item);}};
  heal(`heartKey`,.04,mode===`Hybrid`&&type===`weapon`);
  heal(`bloodstar`,.05,attacker.hp/Math.max(1,attacker.maxHp)<.4&&mode===`AS`);
  if(RIFT_HAS_PASSIVE(attacker,`echoShell`)&&attacker.statuses.itemEchoStored>0&&mode===`AS`){const stored=attacker.statuses.itemEchoStored;attacker.statuses.itemEchoStored=0;target.hp-=Math.round(stored);}
  const death=RIFT_HAS_PASSIVE(attacker,`deathNote`); if(death&&target.hp>0&&target.hp/Math.max(1,target.maxHp)<=.18&&!tags.some(tag=>[`deathImmune`,`environment`].includes(tag))&&RIFT_ITEM_TRIGGER(run,attacker,death)){target.hp=0;RIFT_ITEM_VFX(run,attacker,death,`line`,target);RIFT_ITEM_LOG(run,death,`${target.name}'s conventional conclusion is written.`);}
  if(mode===`AS`||mode===`AP`){const last=attacker.statuses.itemLastScale;if(last&&last!==mode)attacker.statuses.itemAlternatingScale=Math.min(3,(attacker.statuses.itemAlternatingScale||0)+1);attacker.statuses.itemLastScale=mode;}
  const anti=RIFT_HAS_PASSIVE(attacker,`antiLife`);if(anti&&type===`ultimate`&&mode===`AP`&&RIFT_ITEM_TRIGGER(run,attacker,anti)){target.statuses.despairPenalty=Math.max(target.statuses.despairPenalty||0,2);target.statuses.itemAntiLifeTurns=3;RIFT_ITEM_VFX(run,attacker,anti,`line`,target);}
}
function RIFT_ITEM_PREVENT_DEATH(run,target,attacker,tags=[]) {
  if (!target || target.hp>0 || tags.includes(`deathPierce`)) return false;
  const revive = (id,hpRatio,shieldRatio=0) => { const item=RIFT_HAS_PASSIVE(target,id); if(!item||target.statuses[`itemFight_${id}`])return false;target.statuses[`itemFight_${id}`]=1;target.hp=Math.max(1,Math.round(target.maxHp*hpRatio));target.shield=Math.max(target.shield||0,Math.round(target.maxHp*shieldRatio));RIFT_ITEM_VFX(run,target,item);RIFT_ITEM_LOG(run,item,`${target.name} refuses lethal damage.`);return true; };
  if(revive(`lastCity`,.18,.2))return true;
  if(revive(`phoenix`,.32,.06)){if(attacker?.hp>0)RIFT_ITEM_PROC_DAMAGE(run,target,attacker,target.maxHp*.12,RIFT_HAS_PASSIVE(target,`phoenix`),[`magic`,`fire`]);return true;}
  const crystal=RIFT_HAS_PASSIVE(target,`saveCrystal`),point=target.statuses.itemSavePoint;if(crystal&&point&&!target.statuses.itemFight_saveCrystal){target.statuses.itemFight_saveCrystal=1;target.hp=Math.max(1,point.hp);target.energy=point.energy;target.ultimate=point.ultimate;target.shield=point.shield;RIFT_ITEM_VFX(run,target,crystal);RIFT_ITEM_LOG(run,crystal,`Combat resources return to the saved turn. Inventory and Shards remain outside the rewind.`);return true;}
  if(revive(`sevenfold`,.28,0)){target.energy=Math.min(target.maxEnergy,target.energy+Math.round(target.maxEnergy*.35));return true;}
  return false;
}
function RIFT_TICK_ITEM_COOLDOWNS(fighter) {
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  Object.keys(fighter.itemCooldowns).forEach(key=>{if(fighter.itemCooldowns[key]>0)fighter.itemCooldowns[key]-=1;if(fighter.itemCooldowns[key]<=0)delete fighter.itemCooldowns[key];});
}
function RIFT_ITEM_TURN_END(run,fighter) {
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  const green=RIFT_HAS_PASSIVE(fighter,`green-engine`);if(green&&!fighter.statuses.wasHit){fighter.hp=Math.min(fighter.maxHp,fighter.hp+Math.round(fighter.maxHp*.02));}
  if(RIFT_HAS_PASSIVE(fighter,`tachyon`)&&(fighter.statuses.projectionMovementThisTurn||0)>=10)fighter.statuses.itemTachyonCharged=1;
  if(RIFT_HAS_PASSIVE(fighter,`invisibility`)&&(fighter.statuses.projectionMovementThisTurn||0)>=6)fighter.statuses.itemInvisible=1;
  if(RIFT_HAS_PASSIVE(fighter,`saveCrystal`))fighter.statuses.itemSavePoint={hp:Math.max(1,fighter.hp),energy:fighter.energy,ultimate:fighter.ultimate,shield:fighter.shield||0};
  const avalon=RIFT_HAS_PASSIVE(fighter,`avalon`);if(avalon&&fighter.hp/Math.max(1,fighter.maxHp)<.3&&RIFT_ITEM_TRIGGER(run,fighter,avalon)){fighter.hp=Math.min(fighter.maxHp,fighter.hp+Math.round(fighter.maxHp*.22));fighter.posture=0;for(const key of [`burn`,`chill`,`static`,`stun`,`blind`,`restrained`,`speedDown`,`skillDown`,`antiRegen`,`defenseDown`,`fearPenalty`])delete fighter.statuses[key];RIFT_ITEM_VFX(run,fighter,avalon);RIFT_ITEM_LOG(run,avalon,`${fighter.name} enters a one-turn sanctuary.`);}
  if(fighter.statuses.itemOmnitrixAs>0&&--fighter.statuses.itemOmnitrixAs<=0)delete fighter.statuses.itemOmnitrixAs;
  if(fighter.statuses.itemOmnitrixAp>0&&--fighter.statuses.itemOmnitrixAp<=0)delete fighter.statuses.itemOmnitrixAp;
  if(fighter.statuses.itemAntiLifeTurns>0&&--fighter.statuses.itemAntiLifeTurns<=0){delete fighter.statuses.itemAntiLifeTurns;delete fighter.statuses.despairPenalty;}
}
function RIFT_PREPARE_COMBAT_ITEMS(run) {
  RIFT_NORMALIZE_RUN_BUILD(run);
  if(run.enemy)RIFT_ASSIGN_AI_BUILD(run.enemy,run.floor||1,!!run.boss);
  (run.auxiliaryCombatants||[]).filter(entry=>entry?.role!==`ally`).forEach(entry=>RIFT_ASSIGN_AI_BUILD(entry.fighter,run.floor||1,false));
  const fighters=[];
  if(run.player)fighters.push(run.player);if(run.enemy)fighters.push(run.enemy);(run.auxiliaryCombatants||[]).forEach(entry=>entry?.fighter&&fighters.push(entry.fighter));
  fighters.forEach(fighter=>{Object.keys(fighter.statuses).filter(key=>key.startsWith(`itemFight_`)||key.startsWith(`itemProc_`)).forEach(key=>delete fighter.statuses[key]);fighter.statuses.itemAlternatingScale=0;delete fighter.statuses.itemLastScale;if(RIFT_HAS_PASSIVE(fighter,`saveCrystal`))fighter.statuses.itemSavePoint={hp:fighter.hp,energy:fighter.energy,ultimate:fighter.ultimate,shield:fighter.shield||0};const covenant=RIFT_HAS_PASSIVE(fighter,`hybridFury`);if(covenant&&fighter.devilHybrid?.transformed)fighter.shield=Math.max(fighter.shield||0,Math.round(fighter.maxHp*.15));});
}
function RIFT_ASSIGN_AI_BUILD(fighter,floor=1,boss=false) {
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  if(fighter.aiItemFloor===floor&&RIFT_ITEM_INSTANCES(fighter).length)return fighter;
  fighter.inventory=Array(6).fill(null);
  const slots=Math.max(1,Math.min(6,1+Math.floor(floor/2)+(boss?2:0)));
  const maxRank=floor>=10?4:floor>=6?3:floor>=3?2:1;
  const pool=RIFT_ITEM_CATALOG.filter(item=>RIFT_ITEM_RARITIES.indexOf(item.rarity)<=maxRank).sort((a,b)=>RIFT_ITEM_SCORE(b,fighter)-RIFT_ITEM_SCORE(a,fighter));
  let weapon=pool.find(item=>item.category===`Weapon`);if(weapon)fighter.inventory[0]=RIFT_ITEM_INSTANCE(weapon.id,weapon.price);
  let index=1;for(const item of pool){if(index>=slots||index>=6)break;if(item.category===`Weapon`||item.rarity===`Legendary`&&RIFT_OWNS_ITEM(fighter,item.id))continue;fighter.inventory[index++]=RIFT_ITEM_INSTANCE(item.id,item.price);}
  fighter.aiItemFloor=floor;RIFT_SYNC_WEAPON(fighter);RIFT_REFRESH_ITEM_POOLS(fighter);return fighter;
}
function RIFT_FILTER_WEAPON_ACTIONS(fighter,actions) {
  if (RIFT_ACTIVE_ITEM(fighter) || Mn(fighter) || fighter.statuses?.authenticLoveWeapon) return actions;
  return actions.filter(action=>action.id!==`weapon`);
}
function RIFT_MOVE_AUDIT() {
  const rows=[];
  const inspect=(owner,moves,source)=>{(moves||[]).forEach((move,index)=>{if((move.power||0)>0||move.hits>0||move.tags?.some(tag=>[`physical`,`magic`,`beam`,`projectile`,`destruction`,`trueDamage`].includes(tag)))rows.push({owner,source,index,name:move.name,scaling:RIFT_ACTION_SCALING(move,{power:{damageType:source}}).mode,tags:[...(move.tags||[])]});});};
  try { g.forEach(power=>inspect(power.name,power.moves,power.damageType));h.forEach(stand=>{inspect(stand.name,stand.moves||stand.partial||stand.summoned,stand.damageType||`Hybrid`);inspect(stand.name,stand.evolved?.moves,stand.damageType||`Hybrid`);}); } catch {}
  return rows;
}
const RIFT_BUILD_EXPANSION_API = Object.freeze({version:RIFT_BUILD_EXPANSION_VERSION,catalog:RIFT_ITEM_CATALOG,item:RIFT_ITEM,normalizeFighter:RIFT_NORMALIZE_FIGHTER_BUILD,normalizeRun:RIFT_NORMALIZE_RUN_BUILD,recipePlan:RIFT_RECIPE_PLAN,buy:RIFT_BUY_ITEM,sell:RIFT_SELL_ITEM,move:RIFT_MOVE_ITEM,offers:RIFT_SHOP_OFFERS,scaling:RIFT_ACTION_SCALING,scalingLabel:RIFT_SCALING_LABEL,offenseTier:RIFT_OFFENSE_TIER,assignAI:RIFT_ASSIGN_AI_BUILD,auditMoves:RIFT_MOVE_AUDIT});
globalThis.__RIFT_BUILD_EXPANSION__ = RIFT_BUILD_EXPANSION_API;
