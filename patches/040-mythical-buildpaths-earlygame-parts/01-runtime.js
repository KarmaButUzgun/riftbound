/* Riftbound Mythical Build Paths + Early Game V12 */
const RIFT_V12_MYTHICAL_RECIPES=Object.freeze({
  'air-force-gloves':{parts:['beowulf-devil-arms','speed-force-tachyon'],combine:180},
  'zeta-suit':{parts:['nanosuit-2','aegis-of-the-last-city'],combine:180},
  'bandits-secret':{parts:['grimoire-of-infinite-pages','death-note-fragment'],combine:210},
  'open-domain':{parts:['absolute-territory','six-eyes-monocle'],combine:240},
  'sukuna-finger':{parts:['red-stone-of-aja','death-note-fragment'],combine:260},
  'anduril-flame-west':{parts:['master-sword-awakened','ashbringer-dawn'],combine:180},
  'black-barrel':{parts:['bfg-argent-core','anti-life-equation-shard'],combine:180},
  'moonlight-greatsword-mythic':{parts:['excalibur-protocol','elder-wand-elder-rule'],combine:180},
  'sling-ring':{parts:['portal-device-aperture','green-lantern-ring'],combine:160},
  'hogyoku-orb':{parts:['omnitrix-prime','phoenix-regalia'],combine:250},
  'millennium-puzzle':{parts:['six-eyes-monocle','black-pearl-compass'],combine:180},
  'gunbai-reflector':{parts:['vibranium-echo-shell','aegis-of-the-last-city'],combine:260},
  'rule-breaker-dagger':{parts:['hidden-blade-assassin','one-ring-of-absence'],combine:180},
  'sandevistan-apogee':{parts:['speed-force-tachyon','nanosuit-2'],combine:180},
  'iron-halo':{parts:['aegis-of-the-last-city','absolute-territory'],combine:240},
  'stone-mask':{parts:['red-stone-of-aja','berserker-armor'],combine:200},
  'flying-raijin-kunai':{parts:['portal-device-aperture','gungnir-certain-line'],combine:220},
  'mimic-tear-ashes':{parts:['omnitrix-prime','save-crystal-zero'],combine:180},
  'prison-realm':{parts:['absolute-territory','one-ring-of-absence'],combine:260},
  'arc-reactor':{parts:['green-lantern-ring','bfg-argent-core'],combine:180},
  'deathly-hallows':{parts:['elder-wand-elder-rule','cloak-of-invisibility','memory-shard'],combine:220},
  'doom-crucible':{parts:['blade-of-olympus','bfg-argent-core'],combine:180},
  'beskar-spear-mythic':{parts:['vibranium-echo-shell','gungnir-certain-line'],combine:260},
  'choice-scarf-mythic':{parts:['sonic-power-sneakers','black-pearl-compass'],combine:180}
});
for(const [id,tree] of Object.entries(RIFT_V12_MYTHICAL_RECIPES)){
  const item=RIFT_ITEM(id);
  if(!item)continue;
  item.recipe.splice(0,item.recipe.length,...tree.parts);
}
try{RIFT_SHOP_PERF_BUILDS_INTO_CACHE?.clear?.()}catch{}
const RIFT_V12_BASE_RECIPE_PLAN=RIFT_RECIPE_PLAN;
RIFT_RECIPE_PLAN=function RIFT_V12_RECIPE_PLAN(fighter,itemId){
  const plan=RIFT_V12_BASE_RECIPE_PLAN(fighter,itemId),tree=RIFT_V12_MYTHICAL_RECIPES[itemId];
  if(!tree||!plan?.ok)return plan;
  return {...plan,cost:plan.cost+tree.combine,v12CombineCost:tree.combine};
};

function RIFT_V12_COMPONENT_COST(fighter,item){
  if(!item)return 0;
  try{const plan=RIFT_RECIPE_PLAN(fighter,item.id);return plan?.ok?plan.cost:item.price}catch{return item.price||0}
}
function RIFT_V12_RECIPE_CARD({item,fighter,onSelect,onQuickBuy,onHover,final=false}){
  const owned=RIFT_OWNS_ITEM(fighter,item.id),cost=RIFT_V12_COMPONENT_COST(fighter,item),hasParts=(item.recipe||[]).length>0;
  return (0,E.jsxs)(`article`,{className:`recipe-v12-card rarity-${item.rarity.toLowerCase()} ${owned?`owned`:``} ${final?`final`:``}`,style:{"--node-accent":item.accent},children:[
    (0,E.jsxs)(`button`,{type:`button`,className:`recipe-v12-inspect`,onClick:()=>onSelect?.(item.id),onMouseEnter:event=>onHover?.(item.id,event),onMouseMove:event=>onHover?.(item.id,event),onMouseLeave:()=>onHover?.(null),children:[
      (0,E.jsx)(RIFT_ITEM_ICON,{item,size:final?`small`:`tiny`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:item.name}),(0,E.jsx)(`small`,{children:final?`${item.rarity} CAPSTONE`:owned?`OWNED`:hasParts?`${item.recipe.length} PART${item.recipe.length===1?``:`S`} INSIDE`:`DIRECT COMPONENT`})]})
    ]}),
    !final&&(0,E.jsx)(`button`,{type:`button`,className:`recipe-v12-buy`,disabled:owned,onClick:event=>{event.preventDefault();event.stopPropagation();if(!owned)onQuickBuy?.(item.id,event)},children:owned?`OWNED`:`${hasParts?`BUILD`:`BUY`} ${cost} ◆`})
  ]});
}
RIFT_RECIPE_VIEW=function RIFT_V12_RECIPE_VIEW({item,fighter,onSelect,onQuickBuy,onHover}){
  if(!item)return null;
  const parts=(item.recipe||[]).map(RIFT_ITEM).filter(Boolean),plan=RIFT_RECIPE_PLAN(fighter,item.id),ownedParts=parts.filter(part=>RIFT_OWNS_ITEM(fighter,part.id)).length;
  if(!parts.length)return (0,E.jsxs)(`section`,{className:`rift-recipe-graph itemization-recipe recipe-v12 direct`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`BUILD PATH`}),(0,E.jsx)(`strong`,{children:`DIRECT PURCHASE`})]}),(0,E.jsx)(`em`,{children:`NO COMPONENTS REQUIRED`})]}),
    (0,E.jsx)(`div`,{className:`recipe-v12-direct`,children:(0,E.jsx)(RIFT_V12_RECIPE_CARD,{item,fighter,onSelect,onQuickBuy,onHover,final:true})})
  ]});
  return (0,E.jsxs)(`section`,{className:`rift-recipe-graph itemization-recipe recipe-v12`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`BUILD PATH`}),(0,E.jsxs)(`strong`,{children:[parts.length,` COMPONENT${parts.length===1?``:`S`} → `,item.name]})]}),(0,E.jsx)(`em`,{children:`CLICK A COMPONENT TO SEE ITS OWN PATH`})]}),
    (0,E.jsxs)(`div`,{className:`recipe-v12-flow`,children:[
      (0,E.jsx)(`div`,{className:`recipe-v12-components`,children:parts.map(part=>(0,E.jsx)(RIFT_V12_RECIPE_CARD,{item:part,fighter,onSelect,onQuickBuy,onHover},part.id))}),
      (0,E.jsx)(`div`,{className:`recipe-v12-arrow`,"aria-hidden":true,children:`→`}),
      (0,E.jsx)(RIFT_V12_RECIPE_CARD,{item,fighter,onSelect,onQuickBuy,onHover,final:true})
    ]}),
    (0,E.jsxs)(`footer`,{className:`recipe-v12-summary`,children:[(0,E.jsxs)(`span`,{children:[ownedParts,` / `,parts.length,` CORE COMPONENTS OWNED`]}),(0,E.jsxs)(`strong`,{children:[plan?.cost??item.price,` ◆ TOTAL`]})]})
  ]});
};

const RIFT_V12_EARLY_PROFILE=Object.freeze({
  1:{tierPenalty:2,hp:.78,energy:.88,tactical:0,ultimate:5},
  4:{tierPenalty:1,hp:.84,energy:.92,tactical:1,ultimate:10},
  7:{tierPenalty:1,hp:.90,energy:.95,tactical:2,ultimate:15}
});
function RIFT_V12_EARLY_TIER(floor){return floor<=3?RIFT_V12_EARLY_PROFILE[1]:floor<=6?RIFT_V12_EARLY_PROFILE[4]:RIFT_V12_EARLY_PROFILE[7]}
function RIFT_V12_EARLY_APPLIES(floor,boss=false){return !boss&&Number(floor)>=1&&Number(floor)<=9}
const RIFT_V12_BASE_WI=wi;
wi=function RIFT_V12_BATTLE_MODE(floor,boss,forced=false){
  if(RIFT_V12_EARLY_APPLIES(floor,boss))return{mode:`duel`,label:`1 VS 1 · RIFT DUEL`,allies:0,extraOpponents:0,rogues:0,primaryHpScale:1,auxiliaryHpScale:1,tierPenalty:0};
  return RIFT_V12_BASE_WI(floor,boss,forced)
};
const RIFT_V12_BASE_RI=ri;
ri=function RIFT_V12_ENEMY(floor,boss,player,excluded=[]){
  const enemy=RIFT_V12_BASE_RI(floor,boss,player,excluded);
  if(!RIFT_V12_EARLY_APPLIES(floor,boss))return enemy;
  const profile=RIFT_V12_EARLY_TIER(floor);
  D.forEach(stat=>{enemy.tiers[stat]=Math.max(0,(enemy.tiers[stat]||0)-profile.tierPenalty)});
  enemy.maxHp=Math.max(80,Math.round(enemy.maxHp*profile.hp));enemy.hp=enemy.maxHp;
  enemy.maxEnergy=Math.max(36,Math.round(enemy.maxEnergy*profile.energy));enemy.energy=enemy.maxEnergy;
  enemy.ultimate=Math.min(enemy.ultimate||0,profile.ultimate);
  enemy.statuses.tacticalRank=profile.tactical;enemy.statuses.patternShift=0;enemy.statuses.defensiveInstinct=0;enemy.statuses.v12EarlyTraining=1;
  return enemy
};
const RIFT_V12_BASE_ENEMY_ITEMS=RIFT_V9_GIVE_ENEMY_ITEMS;
RIFT_V9_GIVE_ENEMY_ITEMS=function RIFT_V12_ENEMY_ITEMS(run,fighter){
  if(run?.floor<=9){
    fighter.inventory=Array(6).fill(null);RIFT_SYNC_WEAPON(fighter);RIFT_REFRESH_ITEM_POOLS(fighter);return fighter.inventory
  }
  return RIFT_V12_BASE_ENEMY_ITEMS(run,fighter)
};
