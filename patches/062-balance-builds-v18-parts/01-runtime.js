const RIFT_V18_MARKER=`Riftbound Balance Lab and Adaptive Builds V18`;
const RIFT_V18_VERSION=18;
const RIFT_V18_RARITY_RANK=Object.freeze({Common:0,Uncommon:1,Rare:2,Epic:3,Legendary:4,Mythical:5});
const RIFT_V18_STAT_WEIGHTS=Object.freeze({as:4.4,ap:4.4,durability:3.2,regeneration:3.6,speed:2.5,range:2.1,energy:1.7,combatSkill:2.6,battleIq:2.2,iq:1.8});
const RIFT_V18_ROLE_LABELS=Object.freeze({signature:`SIGNATURE`,pressure:`PRESSURE`,control:`CONTROL`,survival:`SURVIVAL`});
function RIFT_V18_POWER_PROFILE(fighter){
 const moves=fighter?.power?.moves||[],tags=moves.flatMap(move=>move.tags||[]),declared=fighter?.power?.damageType||``;
 const physical=declared===`Physical`||tags.filter(tag=>[`physical`,`weapon`,`force`,`crit`].includes(tag)).length>tags.filter(tag=>[`magic`,`curse`,`energy`,`beam`,`spatial`].includes(tag)).length;
 const hybrid=declared===`Hybrid`||tags.includes(`hybrid`)||tags.includes(`scalingHybrid`);
 const ranged=tags.filter(tag=>[`beam`,`projectile`,`line`,`area`].includes(tag)).length;
 const control=tags.filter(tag=>[`stun`,`restrained`,`force`,`guardbreak`,`spatial`,`slow`].includes(tag)).length;
 const expensive=moves.reduce((sum,move)=>sum+Number(move.cost||0),0)/Math.max(1,moves.length);
 return{physical,hybrid,ranged,control,expensive,primary:hybrid?`hybrid`:physical?`as`:`ap`,secondary:hybrid?`ap`:physical?`combatSkill`:`energy`};
}
function RIFT_V18_ITEM_BUDGET(item){
 const stats=item?.stats||{},statValue=Object.entries(RIFT_V18_STAT_WEIGHTS).reduce((sum,[key,weight])=>sum+Math.max(0,Number(stats[key]||0))*weight,0);
 const text=`${item?.passive||``} ${item?.description||``}`.toLowerCase(),mechanicHits=[`damage`,`heal`,`shield`,`energy`,`cooldown`,`movement`,`critical`,`stun`,`guard`,`ultimate`,`copy`,`summon`,`revive`].filter(word=>text.includes(word)).length;
 const passiveValue=Math.min(42,mechanicHits*3.5+(item?.passiveId?7:0)+(item?.cooldown?Math.max(2,8-Number(item.cooldown)):0));
 const weaponValue=item?.category===`Weapon`?8+Number(item?.weapon?.power||0)*5+Number(item?.weapon?.range||0)*.22:0;
 const total=Math.round((statValue+passiveValue+weaponValue)*10)/10,target={Common:15,Uncommon:28,Rare:43,Epic:63,Legendary:92,Mythical:128}[item?.rarity]||28;
 return{itemId:item?.id||null,total,target,delta:Math.round((total-target)*10)/10,ratio:target?Math.round(total/target*100)/100:1,status:total>target*1.34?`over`:total<target*.58?`under`:`band`};
}
function RIFT_V18_MOVE_BUDGET(move,power=null){
 const cost=Math.max(0,Number(move?.cost||0)),damage=Math.max(0,Number(move?.power||0)),destruction=Math.max(0,Number(move?.destruction||0)),hits=Math.max(1,Number(move?.hits||1));
 const tags=move?.tags||[],utility=tags.filter(tag=>[`stun`,`guardbreak`,`force`,`area`,`line`,`multi`,`trueDamage`,`guaranteedHit`,`heal`,`shield`,`summon`,`causality`].includes(tag)).length;
 const output=damage*Math.min(2.4,1+(hits-1)*.34)*34+destruction*8+utility*7;
 const target=move===power?.moves?.[3]?96:Math.max(18,22+cost*1.22),ratio=Math.round(output/Math.max(1,target)*100)/100;
 return{name:move?.name||`Unknown`,cost,output:Math.round(output*10)/10,target:Math.round(target*10)/10,ratio,status:ratio>1.65?`over`:ratio<.38&&damage>0?`under`:`band`};
}
function RIFT_V18_BALANCE_LAB(){
 const items=RIFT_ITEM_CATALOG.map(RIFT_V18_ITEM_BUDGET),moves=g.flatMap(power=>(power.moves||[]).map(move=>({...RIFT_V18_MOVE_BUDGET(move,power),power:power.name})));
 return{version:18,generatedAt:Date.now(),counts:{items:items.length,moves:moves.length,itemOutliers:items.filter(row=>row.status!==`band`).length,moveOutliers:moves.filter(row=>row.status!==`band`).length},itemOutliers:items.filter(row=>row.status!==`band`).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta)),moveOutliers:moves.filter(row=>row.status!==`band`).sort((a,b)=>Math.abs(1-b.ratio)-Math.abs(1-a.ratio))};
}
function RIFT_V18_FOCUS_SCORE(item,focus,profile){
 const stats=item?.stats||{};let score=0;
 if(focus===`signature`)score+=(stats[profile.primary]||0)*8+(stats[profile.secondary]||0)*4+(profile.ranged?(stats.range||0)*2:0)+(profile.expensive>34?(stats.energy||0)*2:0);
 if(focus===`pressure`)score+=(stats.as||0)*6+(stats.ap||0)*6+(stats.combatSkill||0)*3+(stats.speed||0)*2+(item.category===`Weapon`?8:0);
 if(focus===`control`)score+=(stats.battleIq||0)*5+(stats.iq||0)*4+(stats.range||0)*3+(stats.energy||0)*2+(profile.control?6:0);
 if(focus===`survival`)score+=(stats.durability||0)*7+(stats.regeneration||0)*7+(stats.speed||0)*2+(stats.energy||0)*1.5;
 return score;
}
function RIFT_V18_ITEM_SCORE(fighter,item,{plan=null,shards=0,focus=`signature`,selected=[]}={}){
 if(!item)return-1e9;const profile=RIFT_V18_POWER_PROFILE(fighter),stats=item.stats||{},owned=RIFT_OWNS_ITEM(fighter,item.id),rank=RIFT_V18_RARITY_RANK[item.rarity]??1;
 let score=10+rank*5+RIFT_V18_FOCUS_SCORE(item,focus,profile);
 score+=(stats.durability||0)*1.4+(stats.regeneration||0)*1.5+(stats.speed||0)+(stats.battleIq||0)*.8;
 plan=plan||RIFT_RECIPE_PLAN(fighter,item.id);if(plan?.consumeUids?.length)score+=plan.consumeUids.length*12+Math.min(12,(plan.ownedValue||0)/60);
 if(plan?.ok&&plan.cost<=shards)score+=10;if(plan?.ok&&shards>0)score+=Math.max(-14,8-plan.cost/Math.max(40,shards)*8);
 if(item.category===`Weapon`&&!RIFT_ACTIVE_ITEM(fighter))score+=24;
 if(selected.some(entry=>entry.category===item.category))score-=focus===`pressure`?2:7;
 if(owned)score-=36;if(item.rarity===`Legendary`&&owned)score=-1e6;
 if(item.rarity===`Mythical`&&(selected.some(entry=>entry.rarity===`Mythical`)||RIFT_ITEM_INSTANCES(fighter).some(entry=>RIFT_ITEM(entry.itemId)?.rarity===`Mythical`&&!owned)))score=-1e6;
 const budget=RIFT_V18_ITEM_BUDGET(item);if(budget.status===`under`)score-=6;if(budget.status===`over`)score+=3;
 return Math.round(score*100)/100;
}
function RIFT_V18_PICK_PATH(fighter,catalog,focus,seedIds=[],shards=0){
 const picked=[],plans=new Map(),planFor=item=>{if(!plans.has(item.id))plans.set(item.id,RIFT_RECIPE_PLAN(fighter,item.id));return plans.get(item.id)},add=item=>{if(!item||picked.some(entry=>entry.id===item.id)||item.category===`Weapon`&&picked.some(entry=>entry.category===`Weapon`)||item.rarity===`Mythical`&&picked.some(entry=>entry.rarity===`Mythical`))return false;picked.push(item);return true};
 for(const id of seedIds)add(RIFT_ITEM(id));
 let pool=[...catalog];while(picked.length<6&&pool.length){pool.sort((a,b)=>RIFT_V18_ITEM_SCORE(fighter,b,{focus,selected:picked,shards,plan:planFor(b)})-RIFT_V18_ITEM_SCORE(fighter,a,{focus,selected:picked,shards,plan:planFor(a)})||a.name.localeCompare(b.name));let next=pool.shift();add(next)}
 return picked.slice(0,6);
}
function RIFT_V18_ARCHETYPES(fighter,catalog=RIFT_ITEM_CATALOG,shards=0){
 const authored=RIFT_V16_GUIDE(fighter),seed=[...(authored?.core||[])].map(entry=>typeof entry===`string`?entry:entry?.id).filter(Boolean),profile=RIFT_V18_POWER_PROFILE(fighter);
 const secondary=profile.control>=2?`control`:`survival`;
 return[
  {id:`signature`,label:RIFT_V18_ROLE_LABELS.signature,name:`${RIFT_V16_IDENTITY(fighter)} Core`,description:`Authored power identity, upgraded around the items already in your six slots.`,items:RIFT_V18_PICK_PATH(fighter,catalog,`signature`,seed,shards)},
  {id:`pressure`,label:RIFT_V18_ROLE_LABELS.pressure,name:profile.physical?`Riftbreaker`:`Overchannel`,description:profile.physical?`Attack Strength, speed, weapon pressure, and decisive breaks.`:`Ability Power, Energy, tempo, and repeatable technique pressure.`,items:RIFT_V18_PICK_PATH(fighter,catalog,`pressure`,[],shards)},
  {id:secondary,label:RIFT_V18_ROLE_LABELS[secondary],name:secondary===`control`?`Battlefield Architect`:`Last Light`,description:secondary===`control`?`Range, Energy, battle IQ, and control-layer reliability.`:`Durability, regeneration, safe tempo, and comeback stability.`,items:RIFT_V18_PICK_PATH(fighter,catalog,secondary,[],shards)}
 ];
}
function RIFT_V18_BUILD_WARNINGS(fighter){
 const instances=RIFT_ITEM_INSTANCES(fighter),items=instances.map(entry=>RIFT_ITEM(entry.itemId)).filter(Boolean),totals=RIFT_ITEM_STAT_TOTALS(fighter),profile=RIFT_V18_POWER_PROFILE(fighter),warnings=[];
 if(!RIFT_ACTIVE_ITEM(fighter))warnings.push(`Weapon slot empty: slot 4 remains locked and one of six inventory slots is not contributing.`);
 if(items.filter(item=>item.rarity===`Mythical`).length>1)warnings.push(`Illegal Mythical composition detected. Keep exactly one Mythical commitment.`);
 if(profile.primary===`as`&&(totals.ap||0)>(totals.as||0)*1.7+4)warnings.push(`Your items lean AP, but this power scales primarily from Attack Strength.`);
 if(profile.primary===`ap`&&(totals.as||0)>(totals.ap||0)*1.7+4)warnings.push(`Your items lean AS, but this power scales primarily from Ability Power.`);
 if(instances.length>=4&&(totals.durability||0)+(totals.regeneration||0)<3)warnings.push(`Glass build: no meaningful Durability or Regeneration safety layer.`);
 if(profile.expensive>34&&(totals.energy||0)<3)warnings.push(`Energy pressure: the average technique cost is high and the build has little Energy support.`);
 const duplicateIds=items.filter((item,index)=>items.findIndex(other=>other.id===item.id)!==index).map(item=>item.name);if(duplicateIds.length)warnings.push(`Duplicate investment: ${[...new Set(duplicateIds)].join(`, `)}.`);
 return warnings;
}
function RIFT_V18_ECONOMY_BUDGET(floor=1,{boss=false,elite=false}={}){
 floor=Math.max(1,Number(floor||1));const expectedOwned=Math.min(6,1+Math.floor(floor/3)),income=Math.round(95+floor*18+(boss?120:0)+(elite?55:0)),targetWallet=Math.round(140+floor*32);
 return{floor,income,targetWallet,expectedOwned,refreshCost:Math.round(45+floor*4),boss,elite};
}
function RIFT_V18_ENCOUNTER_BUDGET(run){
 const floor=Math.max(1,Number(run?.floor||1)),hostiles=(run?.auxiliaryCombatants||[]).filter(entry=>entry.team!==run.playerTeam&&entry.fighter?.hp>0).length+Number(run?.enemy?.hp>0),hazards=run?.battlefield?.hazards?.length||0,features=run?.battlefield?.features?.filter(feature=>(feature.integrity||0)>0).length||0;
 const capacity=Math.round(8+floor*1.45+(run?.boss?8:0)+(run?.elite?4:0)),spent=Math.round(hostiles*6+hazards*2.2+features*.55);
 return{floor,capacity,spent,headroom:capacity-spent,band:spent>capacity*1.32?`over`:spent<capacity*.52?`under`:`target`,hostiles,hazards,features};
}
const RIFT_V18_BASE_RECOMMENDED_ITEMS=RIFT_RECOMMENDED_ITEMS;
RIFT_RECOMMENDED_ITEMS=function RIFT_V18_RECOMMENDED_ITEMS(fighter,offers,count=4){
 const shards=Number(globalThis.__RIFT_V18_ACTIVE_SHARDS__||0);
 return[...offers].sort((a,b)=>RIFT_V18_ITEM_SCORE(fighter,b,{plan:RIFT_RECIPE_PLAN(fighter,b.id),shards})-RIFT_V18_ITEM_SCORE(fighter,a,{plan:RIFT_RECIPE_PLAN(fighter,a.id),shards})||a.name.localeCompare(b.name)).slice(0,count).map(item=>item.id);
};
const RIFT_V18_BASE_ASSIGN_AI_BUILD=RIFT_ASSIGN_AI_BUILD;
RIFT_ASSIGN_AI_BUILD=function RIFT_V18_ASSIGN_AI_BUILD(fighter,floor=1,boss=false){
 const out=RIFT_V18_BASE_ASSIGN_AI_BUILD(fighter,floor,boss);if(!out||typeof RIFT_SPARTAN_IS===`function`&&RIFT_SPARTAN_IS(out))return out;
 const allowed=RIFT_ITEM_CATALOG.filter(item=>(RIFT_V18_RARITY_RANK[item.rarity]??0)<=Math.min(boss&&floor>=20?5:4,floor>=10?4:floor>=6?3:floor>=3?2:1));
 const paths=RIFT_V18_ARCHETYPES(out,allowed),hash=[...String(out.name||out.power?.name||``)].reduce((sum,char)=>sum+char.charCodeAt(0),floor),path=paths[Math.abs(hash+floor+(boss?1:0))%paths.length];
 const slots=Math.max(1,Math.min(6,1+Math.floor(floor/2)+(boss?2:0))),selected=path.items.slice(0,slots),weapon=selected.find(item=>item.category===`Weapon`)||allowed.find(item=>item.category===`Weapon`);
 out.inventory=Array(6).fill(null);if(weapon)out.inventory[0]=RIFT_ITEM_INSTANCE(weapon.id,weapon.price);
 let slot=1;for(const item of selected){if(slot>=6)break;if(item.id===weapon?.id||item.category===`Weapon`)continue;out.inventory[slot++]=RIFT_ITEM_INSTANCE(item.id,item.price)}
 out.aiBuildRole=path.id;out.aiItemFloor=floor;RIFT_SYNC_WEAPON(out);RIFT_REFRESH_ITEM_POOLS(out);return out;
};
const RIFT_V18_BASE_NORMALIZE_RUN_BUILD=RIFT_NORMALIZE_RUN_BUILD;
RIFT_NORMALIZE_RUN_BUILD=function RIFT_V18_NORMALIZE_RUN_BUILD(run){
 run=RIFT_V18_BASE_NORMALIZE_RUN_BUILD(run);if(!run||typeof run!==`object`)return run;
 run.riftboundSchemaVersion=Math.max(18,Number(run.riftboundSchemaVersion||0));run.v18Balance=run.v18Balance&&typeof run.v18Balance===`object`?run.v18Balance:{};
 run.v18Balance.economy=RIFT_V18_ECONOMY_BUDGET(run.floor,{boss:run.boss,elite:run.elite});run.v18Balance.encounter=RIFT_V18_ENCOUNTER_BUDGET(run);return run;
};
globalThis.RIFTBOUND_BALANCE_LAB={version:18,itemBudget:RIFT_V18_ITEM_BUDGET,moveBudget:RIFT_V18_MOVE_BUDGET,audit:RIFT_V18_BALANCE_LAB,archetypes:RIFT_V18_ARCHETYPES,economy:RIFT_V18_ECONOMY_BUDGET,encounter:RIFT_V18_ENCOUNTER_BUDGET};
globalThis.RIFTBOUND_MANIFEST={...globalThis.RIFTBOUND_MANIFEST,schemaVersion:18,balance:{archetypesPerPower:3,itemBudgetVersion:1,moveBudgetVersion:1}};
if(globalThis.RIFTBOUND_DIAGNOSTICS)globalThis.RIFTBOUND_DIAGNOSTICS={...globalThis.RIFTBOUND_DIAGNOSTICS,version:18,balance:()=>RIFT_V18_BALANCE_LAB()};
