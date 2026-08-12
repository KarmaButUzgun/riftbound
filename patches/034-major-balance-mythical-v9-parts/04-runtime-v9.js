picked.push(item)}picked.forEach((item,index)=>{const slot=item.category===`Weapon`?0:Math.max(1,index);
fighter.inventory[slot]=RIFT_ITEM_INSTANCE(item.id,item.price)});
RIFT_SYNC_WEAPON(fighter);
RIFT_REFRESH_ITEM_POOLS(fighter)}
const RIFT_V9_BASE_GI=Gi;
Gi=function RIFT_V9_GI(run,boss=false){const out=RIFT_V9_BASE_GI(run,boss);
RIFT_V9_GIVE_ENEMY_ITEMS(run,run.enemy);
(run.auxiliaryCombatants||[]).filter(x=>x.team!==run.playerTeam).forEach(x=>RIFT_V9_GIVE_ENEMY_ITEMS(run,x.fighter));
return out};

RIFT_RECOMMENDED_ITEMS=function RIFT_V9_RECOMMENDED_ITEMS(fighter,offers,count=4){const tags=fighter?.power?.moves?.flatMap(m=>m.tags||[])||[],name=fighter?.power?.name||``;
const bonus=item=>{let score=RIFT_ITEM_SCORE(item,fighter);
const id=item.passiveId;
if(name===`Pyrokinesis`&&[`sukunaFinger`,`arcReactor`,`moonlightGreatsword`].includes(id))score+=42;
if(name===`Cursed Child`&&[`banditsSecret`,`openDomain`,`sukunaFinger`].includes(id))score+=44;
if(name===`All For One`&&id===`banditsSecret`)score+=60;
if(name===`War Devil Hybrid`&&id===`banditsSecret`)score+=48;
if(name===`Shrine`&&[`openDomain`,`sukunaFinger`].includes(id))score+=50;
if(name===`One For All`&&[`zetaSuit`,`airForce`].includes(id))score+=55;
if(name===`Bomb Hybrid`&&[`sandevistan`,`zetaSuit`].includes(id))score+=35;
if(fighter?.stand&&[`standArrowMythic`,`millenniumPuzzle`].includes(id))score+=34;
if(tags.includes(`summon`)&&id===`mimicTear`)score+=36;
return score};
return [...offers].sort((a,b)=>bonus(b)-bonus(a)).slice(0,count).map(item=>item.id)};

const RIFT_V9_BASE_SCORE=RIFT_ITEM_SCORE;
RIFT_ITEM_SCORE=function RIFT_V9_SCORE(item,fighter){let score=RIFT_V9_BASE_SCORE(item,fighter);
if(item.rarity===`Mythical`)score+=18;
if(RIFT_ITEM_INSTANCES(fighter).some(x=>RIFT_ITEM(x.itemId)?.rarity===`Mythical`)&&item.rarity===`Mythical`&&!RIFT_OWNS_ITEM(fighter,item.id))score-=1e4;
return score};

const RIFT_V9_BASE_ICON=RIFT_ITEM_ICON;
RIFT_ITEM_ICON=function RIFT_V9_ICON(props){const item=props?.item,profile=item?RIFT_V9_MYTHIC_PROFILE[item.id]:null;
if(item?.rarity!==`Mythical`||!profile)return RIFT_V9_BASE_ICON(props);
return (0,E.jsxs)(`span`,{className:`rift-item-icon art-v9 mythic-v9 mythic-${profile.kind} size-${props?.size||`small`}`,style:{'--item-accent':item.accent},'data-mythic-id':item.id,children:[(0,E.jsx)(`i`,{className:`mythic-v9-core`,children:profile.mark||item.glyph}),(0,E.jsx)(`i`,{className:`mythic-v9-halo`}),(0,E.jsx)(`i`,{className:`mythic-v9-detail`})]})};

const RIFT_V9_MYTHIC_PROFILE={
'air-force-gloves':{kind:`gauntlets`,mark:`風`},'zeta-suit':{kind:`armor`,mark:`Ζ`},'bandits-secret':{kind:`book`,mark:`盗`},'open-domain':{kind:`shrine`,mark:`域`},'sukuna-finger':{kind:`finger`,mark:`宿`},'anduril-flame-west':{kind:`sword`,mark:`✦`},'black-barrel':{kind:`cannon`,mark:`黒`},'moonlight-greatsword-mythic':{kind:`sword`,mark:`☾`},'sling-ring':{kind:`ring`,mark:`◎`},'hogyoku-orb':{kind:`orb`,mark:`崩`},'millennium-puzzle':{kind:`puzzle`,mark:`千`},'gunbai-reflector':{kind:`fan`,mark:`団`},'rule-breaker-dagger':{kind:`dagger`,mark:`破`},'sandevistan-apogee':{kind:`spine`,mark:`時`},'iron-halo':{kind:`halo`,mark:`✠`},'stone-mask':{kind:`mask`,mark:`石`},'flying-raijin-kunai':{kind:`kunai`,mark:`飛`},'mimic-tear-ashes':{kind:`ashes`,mark:`雫`},'prison-realm':{kind:`cube`,mark:`獄`},'arc-reactor':{kind:`reactor`,mark:`ARC`},'deathly-hallows':{kind:`hallows`,mark:`△`},'doom-crucible':{kind:`sword`,mark:`DOOM`},'beskar-spear-mythic':{kind:`spear`,mark:`✦`},'choice-scarf-mythic':{kind:`scarf`,mark:`選`}};

if(typeof window!==`undefined`)window.RIFTBOUND_V9_DEBUG={meta:RIFT_V9_META,unlockCalamity(){let m=RIFT_V9_META();
m.calamityUnlocked=true;
return RIFT_V9_SAVE_META(m)},lockCalamity(){let m=RIFT_V9_META();
m.calamityUnlocked=false;
return RIFT_V9_SAVE_META(m)},markAfo50(){let m=RIFT_V9_META();
m.calamityUnlocked=true;
m.afo50=true;
return RIFT_V9_SAVE_META(m)},grantMythical(run,id){const item=RIFT_ITEM(id);
if(!item||item.rarity!==`Mythical`)return false;
if(RIFT_ITEM_INSTANCES(run.player).some(x=>RIFT_ITEM(x.itemId)?.rarity===`Mythical`))return false;
const slot=RIFT_FREE_SLOT_FOR(run.player.inventory,item);
if(slot<0)return false;
run.player.inventory[slot]=RIFT_ITEM_INSTANCE(id,item.price);
RIFT_NORMALIZE_RUN_BUILD(run);
return true},removeMythical(run){run.player.inventory=run.player.inventory.map(x=>x&&RIFT_ITEM(x.itemId)?.rarity===`Mythical`?null:x);
RIFT_NORMALIZE_RUN_BUILD(run)},testRecommendations(fighter){return RIFT_RECOMMENDED_ITEMS(fighter,RIFT_ITEM_CATALOG,10)}};
