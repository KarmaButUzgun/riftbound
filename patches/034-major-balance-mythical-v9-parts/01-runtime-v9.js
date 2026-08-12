/* Riftbound Major Balance + Mythical Expansion V9 */
const RIFT_V9_META_KEY=`riftbound-v9-meta`;

function RIFT_V9_META(){try{const raw=localStorage.getItem(RIFT_V9_META_KEY);
return raw?{calamityUnlocked:false,afo50:false,...JSON.parse(raw)}:{calamityUnlocked:false,afo50:false}}catch{return{calamityUnlocked:false,afo50:false}}}
function RIFT_V9_SAVE_META(meta){try{localStorage.setItem(RIFT_V9_META_KEY,JSON.stringify(meta))}catch{}return meta}
function RIFT_V9_SYNC_META(run){if(!run)return RIFT_V9_META();
const meta=RIFT_V9_META();
if((run.floor||1)>50&&!meta.calamityUnlocked)meta.calamityUnlocked=true;
if((run.floor||1)>50&&run.player?.power?.name===`All For One`)meta.afo50=true;
RIFT_V9_SAVE_META(meta);
return meta}
const RIFT_V9_AFO=g.find(power=>power.name===`All For One`);
if(RIFT_V9_AFO){RIFT_V9_AFO.rarity=`Calamity`;
RIFT_V9_AFO.rarityLabel=`Calamity · Floor 50 Unlock`;
Object.defineProperty(RIFT_V9_AFO,`rollable`,{configurable:true,get(){return !!RIFT_V9_META().calamityUnlocked}})}
const RIFT_V9_SYMBOL=g.find(power=>power.name===`Symbol of Fear`);
if(RIFT_V9_SYMBOL)RIFT_V9_SYMBOL.rarityLabel=`Unrollable · Decay Evolution · AFO Floor 50 Required`;

ti=e=>({Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4,Mythic:5,Calamity:5,Chromatic:6})[e]??0;

function RIFT_V9_POWER(name){return g.find(power=>power.name===name)}
function RIFT_V9_TAG(powerName,moveName,...tags){const move=RIFT_V9_POWER(powerName)?.moves?.find(move=>move.name===moveName);
if(move)move.tags=[...new Set([...(move.tags||[]),...tags])];
return move}
for(const power of [RIFT_V9_POWER(`Pyrokinesis`)])if(power){power.passive=`Burning Ground: every damaging technique scales fully from Attack Power. Fireball leaves a 3-turn burning field;
 Inferno leaves a much larger 5-turn field.`;
power.moves.forEach(move=>move.tags=[...new Set([...(move.tags||[]),`scalingAP`])]);
RIFT_V9_TAG(`Pyrokinesis`,`Fireball`,`pyroBurningGround`);
RIFT_V9_TAG(`Pyrokinesis`,`Inferno`,`pyroInfernoGround`)}
{const p=RIFT_V9_POWER(`Light Manipulation`);
if(p)p.passive=`Photon Body: normal Movement Point maximum and reserve are doubled after all additive movement modifiers are resolved.`}
{const p=RIFT_V9_POWER(`Blood Sorcery`);
if(p){p.passive=`Hemostatic Curse: damaging Blood Sorcery abilities apply stackable Anti-Heal for 2 turns. Each stack cuts healing by 15%, capped at 75%.`;
p.moves.forEach(move=>{if((move.power||0)>0)move.tags=[...new Set([...(move.tags||[]),`bloodAntiHeal`])]})}}
RIFT_V9_TAG(`Shrine`,`Cleave`,`shrineAdaptiveCleave`);

RIFT_V9_TAG(`Anti-Spiral`,`Infinity Big Bang Storm`,`causality`);

RIFT_V9_TAG(`One For All`,`Faux 100%`,`faux100Blitz`,`noProjectile`);

RIFT_V9_TAG(`Gravity Manipulation`,`Gravity Crush`,`gravityMpCrush`);

{const p=RIFT_V9_POWER(`One For All`),prime=RIFT_V9_POWER(`One For All Prime`);
if(p&&prime)p.passive=`Might: ${prime.passive}`}
const RIFT_V9_BASE_MT=mt;
mt=function RIFT_V9_MT(fighter){let value=RIFT_V9_BASE_MT(fighter);
if(fighter?.power?.name===`Light Manipulation`)value*=2;
return value};

const RIFT_V9_BASE_OO=oo;
oo=function RIFT_V9_HEAL(fighter,amount){const stacks=Math.max(0,Math.min(5,fighter?.statuses?.antiHealStacks||0));
const cut=Math.min(.75,stacks*.15);
return RIFT_V9_BASE_OO(fighter,Number(amount||0)*(1-cut))};

const RIFT_V9_BASE_TO=To;
To=function RIFT_V9_AFTER_HIT(run,attacker,target,tags,damage,action){if(damage>0&&RIFT_RIKA_FIGHTER(attacker)&&attacker.statuses.rikaOwnerId){const owner=U(run,attacker.statuses.rikaOwnerId)?.fighter;
if(owner&&RIFT_CURSED_CHILD(owner)){owner.statuses.rikaSummon=Math.min(100,(owner.statuses.rikaSummon||0)+Math.max(4,Math.round(damage/Math.max(1,target.maxHp)*55)));
G(run,`RIKA SUMMON BAR // Partial Rika pressure fills ${Math.round(owner.statuses.rikaSummon)} / 100.`,`mythic`)}}if(damage>0&&tags.includes(`bloodAntiHeal`)){target.statuses.antiHealStacks=Math.min(5,(target.statuses.antiHealStacks||0)+1);
target.statuses.antiHealTurns=2;
G(run,`ANTI-HEAL ×${target.statuses.antiHealStacks} // ${Math.round(Math.min(.75,target.statuses.antiHealStacks*.15)*100)}% healing reduction for 2 turns.`,attacker===run.player?`player`:`enemy`)}if(damage>0&&tags.includes(`shrineAdaptiveCleave`)){const key=RIFT_ACTOR_ID_FOR_FIGHTER(run,attacker)||attacker.name;
target.statuses.cleaveAdaptation=target.statuses.cleaveAdaptation||{};
target.statuses.cleaveAdaptation[key]=Math.min(70,(target.statuses.cleaveAdaptation[key]||0)+10);
G(run,`CLEAVE ADAPTATION // ${target.name} now suffers ${target.statuses.cleaveAdaptation[key]}% Durability negation from this Shrine user.`,`mythic`)}if(damage>0&&tags.includes(`pyroBurningGround`)&&action?.aim?.target)RIFT_V9_BURN_ZONE(run,attacker,action.aim.target,6,3,.22,`Fireball`);
if(damage>0&&tags.includes(`pyroInfernoGround`)){const pos=action?.aim?.target||Oo(run,target);
RIFT_V9_BURN_ZONE(run,attacker,pos,13,5,.34,`Inferno`)}if(damage>0&&tags.includes(`gravityMpCrush`)){const id=RIFT_ACTOR_ID_FOR_FIGHTER(run,target);
if(id){const before=ji(run,id),cut=Math.max(0,before*.5);
Mi(run,id,before-cut);
Ai(run,id,Math.min(Oi(run,id),before-cut));
target.statuses.gravityMpCut={amount:cut,turns:2};
const bonus=Math.min(target.maxHp*.22,cut*(2.4+Y(attacker,`ap`)*.18));
target.hp-=Math.max(0,Math.round(bonus));
G(run,`GRAVITY CRUSH // ${cut.toFixed(1)} MP removed;
 compressed movement mass adds ${Math.round(bonus)} damage.`,`limit`)}}RIFT_V9_BASE_TO(run,attacker,target,tags,damage,action)};

function RIFT_V9_BURN_ZONE(run,owner,position,radius,turns,power,label){run.battlefield.hazards.push({id:`v9-burn-${F()}`,kind:`fire`,label:`${label} · Burning Ground`,position:{...position},radius,power:1+Y(owner,`ap`)*power,turns,owner:jo(run,owner),ownerId:RIFT_ACTOR_ID_FOR_FIGHTER(run,owner),accent:`#ff642e`,mechanic:`v9BurningGround`});
G(run,`${label.toUpperCase()} · BURNING GROUND // ${radius}m field persists for ${turns} turns.`,`environment`)}

const RIFT_V9_BASE_LA=La;
La=function RIFT_V9_ACTIONS(fighter){let actions=RIFT_V9_BASE_LA(fighter);
if(RIFT_HAS_PASSIVE(fighter,`openDomain`)&&fighter.power?.moves?.some(m=>(m.tags||[]).some(t=>String(t).toLowerCase().includes(`domain`))))actions.push({id:`v9-open-domain-toggle`,slot:90,name:fighter.statuses.openDomain?`Close Domain Barrier`:`Open Domain Barrier`,description:fighter.statuses.openDomain?`Restore the closed barrier: smaller territory, sealed escape.`:`Bonus action. Remove the barrier and greatly expand Domain radius;