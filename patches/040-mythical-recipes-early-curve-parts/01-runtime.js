/* Riftbound Mythical Recipes + Early Curve V12 */
const RIFT_V12_BASE_ENEMY_FACTORY=ri;
ri=function RIFT_V12_ENEMY_FACTORY(floor,boss,player,erased=[]){
  const fighter=RIFT_V12_BASE_ENEMY_FACTORY(floor,boss,player,erased),f=Number(floor)||1;
  if(f>=1&&f<=9){
    const progress=(f-1)/8,hpScale=(boss?.82:.70)+progress*(boss?.13:.18),energyScale=.84+progress*.11;
    fighter.maxHp=Math.max(90,Math.round(fighter.maxHp*hpScale));fighter.hp=fighter.maxHp;
    fighter.maxEnergy=Math.max(36,Math.round(fighter.maxEnergy*energyScale));fighter.energy=fighter.maxEnergy;
    const penalty=f<=3?2:f<=7?1:0;
    if(penalty>0)for(const stat of [`as`,`ap`,`durability`,`speed`,`combatSkill`])fighter.tiers[stat]=Math.max(0,(fighter.tiers[stat]||0)-penalty);
    fighter.maxPosture=Math.max(55,Math.round(fighter.maxPosture*(.84+progress*.12)));fighter.posture=0;
    fighter.ultimate=Math.min(fighter.ultimate||0,boss?20:10);
    fighter.statuses.tacticalRank=Math.min(fighter.statuses.tacticalRank||0,boss?3:2);
    fighter.statuses.patternShift=0;fighter.statuses.defensiveInstinct=0;fighter.statuses.v12EarlyCurve=1;
  }
  return fighter;
};
const RIFT_V12_BASE_FORMATION=wi;
wi=function RIFT_V12_FORMATION(floor,boss,forcedDuel=false){
  const f=Number(floor)||1;
  if(f>=1&&f<=9)return{mode:`duel`,label:boss?`1 VS 1 · EARLY BOSS DUEL`:`1 VS 1 · ASCENT DUEL`,allies:0,extraOpponents:0,rogues:0,primaryHpScale:1,auxiliaryHpScale:1,tierPenalty:0};
  return RIFT_V12_BASE_FORMATION(floor,boss,forcedDuel);
};
const RIFT_V12_BASE_DEVIL_GATE=ua;
ua=function RIFT_V12_DEVIL_GATE(run,blocked){if((run?.floor||0)<=9)return!1;return RIFT_V12_BASE_DEVIL_GATE(run,blocked)};
const RIFT_V12_BASE_NEMESIS_GATE=Xi;
Xi=function RIFT_V12_NEMESIS_GATE(run,floor){if((Number(floor)||0)<=9)return null;return RIFT_V12_BASE_NEMESIS_GATE(run,floor)};

function RIFT_V12_RECIPE_CARD({item,fighter,onSelect,result=false}){
  const owned=!!item&&RIFT_OWNS_ITEM(fighter,item.id),hasRecipe=!!item?.recipe?.length;
  if(!item)return null;
  return (0,E.jsxs)(`button`,{type:`button`,className:`v12-recipe-card rarity-${item.rarity.toLowerCase()} ${owned?`owned`:``} ${result?`result`:``}`,style:{"--recipe-accent":item.accent},onClick:()=>onSelect?.(item.id),title:result?item.name:`Inspect ${item.name}${hasRecipe?` recipe`:``}`,children:[
    (0,E.jsx)(RIFT_ITEM_ICON,{item,size:result?`small`:`tiny`}),
    (0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:item.name}),(0,E.jsx)(`small`,{children:result?`${item.rarity} RESULT`:owned?`OWNED · READY`:hasRecipe?`${item.rarity} · VIEW RECIPE`:`${item.rarity} · BUY DIRECT`})]}),
    owned&&!result&&(0,E.jsx)(`em`,{children:`✓`})
  ]});
}
RIFT_RECIPE_VIEW=function RIFT_V12_RECIPE_VIEW({item,fighter,onSelect}){
  if(!item)return null;
  const components=(item.recipe||[]).map(id=>RIFT_ITEM(id)).filter(Boolean);
  if(!components.length)return (0,E.jsxs)(`section`,{className:`rift-recipe-graph rift-recipe-simple direct`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`RECIPE`}),(0,E.jsx)(`strong`,{children:`DIRECT PURCHASE`})]}),(0,E.jsx)(`em`,{children:`NO COMPONENTS REQUIRED`})]}),
    (0,E.jsx)(`div`,{className:`v12-direct-recipe`,children:(0,E.jsx)(RIFT_V12_RECIPE_CARD,{item,fighter,onSelect,result:true})})
  ]});
  return (0,E.jsxs)(`section`,{className:`rift-recipe-graph rift-recipe-simple`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`BUILD RECIPE`}),(0,E.jsxs)(`strong`,{children:[components.length,` COMPONENT${components.length===1?``:`S`}`]})]}),(0,E.jsx)(`em`,{children:`CLICK A COMPONENT TO SEE ITS RECIPE`})]}),
    (0,E.jsxs)(`div`,{className:`v12-recipe-flow`,children:[
      (0,E.jsxs)(`div`,{className:`v12-recipe-stage requirements`,children:[(0,E.jsx)(`label`,{children:`1 · REQUIRE`}),(0,E.jsx)(`div`,{className:`v12-recipe-components`,children:components.map(component=>(0,E.jsx)(RIFT_V12_RECIPE_CARD,{item:component,fighter,onSelect},component.id))})]}),
      (0,E.jsx)(`b`,{className:`v12-recipe-arrow`,children:`→`}),
      (0,E.jsxs)(`div`,{className:`v12-recipe-stage combine`,children:[(0,E.jsx)(`label`,{children:`2 · COMBINE`}),(0,E.jsxs)(`strong`,{children:[`+`,item.combineCost||0,` ◆`]}),(0,E.jsx)(`small`,{children:`CRAFTING FEE`})]}),
      (0,E.jsx)(`b`,{className:`v12-recipe-arrow`,children:`→`}),
      (0,E.jsxs)(`div`,{className:`v12-recipe-stage result`,children:[(0,E.jsx)(`label`,{children:`3 · RESULT`}),(0,E.jsx)(RIFT_V12_RECIPE_CARD,{item,fighter,onSelect,result:true})]})
    ]}),
    (0,E.jsx)(`p`,{className:`v12-recipe-help`,children:`Owned components are consumed automatically. Missing components are purchased through their own recipe when you build.`})
  ]});
};
