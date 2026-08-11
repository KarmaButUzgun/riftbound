function RIFT_RECIPE_NODE({itemId,fighter,onSelect,root=false,lineage=[]}) {
  if(lineage.includes(itemId))return null;
  const item=RIFT_ITEM(itemId);
  if(!item)return null;
  const owned=RIFT_OWNS_ITEM(fighter,item.id),children=(item.recipe||[]).filter(id=>!lineage.includes(id));
  const price=owned?`OWNED`:item.recipe.length?`${item.combineCost} ◆ COMBINE`:`${item.price} ◆`;
  return (0,E.jsxs)(`div`,{className:`recipe-graph-node ${root?`root`:``} ${owned?`owned`:``}`,children:[
    (0,E.jsxs)(`button`,{type:`button`,className:`recipe-graph-card rarity-${item.rarity.toLowerCase()}`,style:{"--node-accent":item.accent},onClick:()=>onSelect?.(item.id),title:`Inspect ${item.name}`,children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:root?`small`:`tiny`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:item.name}),(0,E.jsx)(`small`,{children:price})]}),owned&&(0,E.jsx)(`em`,{children:`✓`})]}),
    children.length>0&&(0,E.jsx)(`div`,{className:`recipe-graph-children`,children:children.map((id,index)=>(0,E.jsx)(RIFT_RECIPE_NODE,{itemId:id,fighter,onSelect,lineage:[...lineage,itemId]},`${id}-${index}`))})
  ]});
}

function RIFT_RECIPE_VIEW({item,fighter,onSelect}) {
  if(!item)return null;
  return (0,E.jsxs)(`section`,{className:`rift-recipe-graph`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`BUILD PATH`}),(0,E.jsx)(`strong`,{children:item.recipe.length?`COMPONENT TREE`:`BASE COMPONENT`})]}),(0,E.jsx)(`em`,{children:item.recipe.length?`OWNED PIECES REDUCE THE PRICE`:`PURCHASES DIRECTLY`})]}),
    (0,E.jsx)(`div`,{className:`recipe-graph-scroll`,children:(0,E.jsx)(RIFT_RECIPE_NODE,{itemId:item.id,fighter,onSelect,root:true})})
  ]});
}

function RIFT_ITEM_DETAIL({item,fighter,plan,onBuy,onSelect,recommended=false}) {
  if(!item)return (0,E.jsx)(`aside`,{className:`rift-item-detail shop-detail-pane empty`,children:`Choose an item to inspect its recipe, upgrades, stats, and exact purchase cost.`});
  const active=item.category===`Weapon`?RIFT_ACTIVE_ITEM(fighter):null,buildsInto=RIFT_ITEM_CATALOG.filter(entry=>entry.recipe.includes(item.id)),owned=RIFT_OWNS_ITEM(fighter,item.id);
  return (0,E.jsxs)(`aside`,{className:`rift-item-detail shop-detail-pane rarity-${item.rarity.toLowerCase()}`,style:{"--detail":item.accent},children:[
    (0,E.jsxs)(`header`,{className:`shop-detail-header`,children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`hero`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`${item.rarity} · ${item.category}${recommended?` · RECOMMENDED`:``}`}),(0,E.jsx)(`h3`,{children:item.name}),(0,E.jsx)(`em`,{children:item.reference})]}),owned&&(0,E.jsx)(`i`,{className:`owned-item-pill`,children:`OWNED`})]}),
    (0,E.jsx)(RIFT_ITEM_STATS,{item}),(0,E.jsx)(RIFT_ITEM_STAT_PREVIEW,{item,fighter,plan}),
    (0,E.jsxs)(`section`,{className:`item-passive-copy`,children:[(0,E.jsx)(`small`,{children:item.passiveId?`UNIQUE PASSIVE`:`ITEM PROPERTY`}),(0,E.jsx)(`strong`,{children:item.passiveId?item.passiveId.replace(/([A-Z])/g,` $1`).toUpperCase():`RELIABLE COMPONENT`}),(0,E.jsx)(`p`,{children:item.passive}),item.cooldown>0&&(0,E.jsxs)(`em`,{children:[`INTERNAL COOLDOWN · `,item.cooldown,` OWNER TURNS`]})]}),
    item.weapon&&(0,E.jsxs)(`div`,{className:`weapon-scaling-line`,children:[(0,E.jsx)(`b`,{children:item.weapon.damageType===`Hybrid`?`AS/AP`:item.weapon.damageType===`Magic`?`AP`:`AS`}),(0,E.jsxs)(`span`,{children:[item.weapon.damageType.toUpperCase(),` WEAPON ATTACK · `,item.weapon.range.toFixed(1),`m · `,item.weapon.cost,` ENERGY`]})]}),
    active&&active.id!==item.id&&(0,E.jsxs)(`div`,{className:`item-compare`,children:[(0,E.jsx)(`small`,{children:`COMPARE TO ACTIVE WEAPON`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(RIFT_ITEM_ICON,{item:active,size:`tiny`}),(0,E.jsx)(`b`,{children:active.name}),(0,E.jsx)(`em`,{children:RIFT_ITEM_STAT_TEXT(active)})]})]}),
    (0,E.jsx)(RIFT_RECIPE_VIEW,{item,fighter,onSelect}),
    (0,E.jsxs)(`section`,{className:`item-builds-into shop-upgrade-row`,children:[(0,E.jsxs)(`header`,{children:[(0,E.jsx)(`small`,{children:`BUILDS INTO`}),(0,E.jsxs)(`em`,{children:[buildsInto.length,` DIRECT UPGRADE${buildsInto.length===1?``:`S`}`]})]}),(0,E.jsx)(`div`,{children:buildsInto.length?buildsInto.map(next=>(0,E.jsxs)(`button`,{type:`button`,onClick:()=>onSelect?.(next.id),style:{"--upgrade":next.accent},title:`Inspect ${next.name}`,children:[(0,E.jsx)(RIFT_ITEM_ICON,{item:next,size:`tiny`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:next.name}),(0,E.jsxs)(`small`,{children:[next.price,` ◆ · `,next.rarity]})]})]},next.id)):(0,E.jsx)(`p`,{children:item.rarity===`Legendary`?`This is a final Legendary capstone.`:`This item has no direct upgrade.`})})]}),
    item.rarity===`Legendary`&&(0,E.jsxs)(`div`,{className:`legendary-ownership-law`,children:[(0,E.jsx)(`b`,{children:`UNIQUE OWNERSHIP`}),(0,E.jsx)(`span`,{children:`Only one copy of this Legendary can exist in the six-slot build. Selling it permits a later rebuild.`})]}),
    (0,E.jsxs)(`blockquote`,{children:[`“`,item.lore,`”`]}),
    (0,E.jsxs)(`footer`,{className:`shop-purchase-bar`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:plan?.consumeUids?.length?`${plan.consumeUids.length} OWNED COMPONENT${plan.consumeUids.length===1?``:`S`} APPLIED`:`TOTAL PURCHASE COST`}),(0,E.jsxs)(`strong`,{children:[plan?.cost??item.price,` ◆`]})]}),(0,E.jsx)(`button`,{type:`button`,onClick:onBuy,disabled:!plan?.ok,className:`item-buy-button`,title:plan?.ok?`Purchase ${item.name}`:plan?.reason,children:plan?.ok?(item.recipe.length?`BUILD ITEM`:`BUY ITEM`):plan?.reason||`UNAVAILABLE`})]})
  ]});
}

function RIFT_INVENTORY_MANAGER({run,onCommit}) {
  const [selected,setSelected]=(0,r.useState)(0),fighter=run.player;
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  const act=(kind,slot,target)=>{const next=P(run);let result;if(kind===`sell`)result=RIFT_SELL_ITEM(next,slot);else result=RIFT_MOVE_ITEM(next.player,slot,target);if(result.ok){onCommit(next);if(kind===`move`)setSelected(target);}return result;};
  return (0,E.jsxs)(`section`,{className:`rift-inventory-manager shop-inventory-dock`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`CURRENT BUILD`}),(0,E.jsx)(`strong`,{children:`SIX-SLOT LOADOUT`})]}),(0,E.jsx)(`em`,{children:`SLOT 0 ACCEPTS WEAPONS ONLY`})]}),
    (0,E.jsx)(`div`,{className:`rift-inventory-grid`,children:fighter.inventory.map((instance,slot)=>{const item=instance?RIFT_ITEM(instance.itemId):null,cd=item?.passiveId?fighter.itemCooldowns?.[RIFT_ITEM_COOLDOWN_KEY(item)]||0:0;return(0,E.jsxs)(`button`,{type:`button`,className:`inventory-slot ${slot===0?`weapon-slot`:``} ${selected===slot?`selected`:``} ${item?`rarity-${item.rarity.toLowerCase()}`:`empty`}`,onClick:()=>setSelected(slot),children:[(0,E.jsx)(`small`,{children:slot===0?`0 · WEAPON`:`SLOT ${slot}`}),(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`tiny`}),(0,E.jsx)(`strong`,{children:item?.name||`EMPTY`}),(0,E.jsx)(`em`,{children:cd?`${cd}T COOLDOWN`:item?.rarity||`OPEN`})]},slot)} )}),
    (()=>{const instance=fighter.inventory[selected],item=instance?RIFT_ITEM(instance.itemId):null;if(!item)return(0,E.jsx)(`p`,{className:`inventory-hint`,children:selected===0?`Equip a weapon here to unlock the weapon action.`:`Open slot. Components grant their stats while waiting to be built into an upgrade.`});return(0,E.jsxs)(`div`,{className:`inventory-controls`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:item.name}),(0,E.jsx)(`small`,{children:RIFT_ITEM_STAT_TEXT(item)})]}),selected>0&&item.category===`Weapon`&&(0,E.jsx)(`button`,{type:`button`,onClick:()=>act(`move`,selected,0),children:`EQUIP`}),selected===0&&(0,E.jsx)(`button`,{type:`button`,disabled:!fighter.inventory.slice(1).some(slot=>!slot),onClick:()=>{const free=fighter.inventory.findIndex((slot,index)=>index>0&&!slot);free>0&&act(`move`,0,free)},children:`UNEQUIP`}),selected>1&&(0,E.jsx)(`button`,{type:`button`,onClick:()=>act(`move`,selected,selected-1),children:`← MOVE`}),selected>0&&selected<5&&(0,E.jsx)(`button`,{type:`button`,onClick:()=>act(`move`,selected,selected+1),children:`MOVE →`}),(0,E.jsx)(`button`,{type:`button`,className:`sell`,onClick:()=>act(`sell`,selected),children:`SELL · ${Math.max(1,Math.floor((instance.invested||item.price)*.6))} ◆`})]});})()
  ]});
}

function RIFT_CATALOG_TILE({item,fighter,selected,recommended,onSelect}) {
  const owned=RIFT_OWNS_ITEM(fighter,item.id);
  return (0,E.jsxs)(`button`,{type:`button`,className:`catalog-item-tile rarity-${item.rarity.toLowerCase()} ${selected?`selected`:``} ${recommended?`recommended`:``} ${owned?`owned`:``}`,style:{"--tile-accent":item.accent},onClick:()=>onSelect(item.id),title:`${item.name} · ${RIFT_ITEM_STAT_TEXT(item)}`,"aria-pressed":selected,children:[
    (0,E.jsx)(RIFT_ITEM_ICON,{item,size:`small`}),(0,E.jsx)(`strong`,{children:item.name}),(0,E.jsxs)(`span`,{children:[item.price,` ◆`]}),recommended&&(0,E.jsx)(`i`,{children:`★`}),owned&&(0,E.jsx)(`em`,{children:`✓`})
  ]});
}

function RIFT_ITEM_SHOP({run,onCommit}) {
  RIFT_NORMALIZE_RUN_BUILD(run);
  const catalog=RIFT_SHOP_OFFERS(run.floor,run.player);
  const [view,setView]=(0,r.useState)(`All`),[category,setCategory]=(0,r.useState)(`All`),[rarity,setRarity]=(0,r.useState)(`All`),[query,setQuery]=(0,r.useState)(``),[selectedId,setSelectedId]=(0,r.useState)(catalog[0]?.id||null),[feedback,setFeedback]=(0,r.useState)(null);
  const recommendedIds=RIFT_RECOMMENDED_ITEMS(run.player,catalog,8),recommended=new Set(recommendedIds),normalizedQuery=query.trim().toLowerCase();
  const filtered=catalog.filter(item=>(view!==`Recommended`||recommended.has(item.id))&&(category===`All`||item.category===category)&&(rarity===`All`||item.rarity===rarity)&&(!normalizedQuery||`${item.name} ${item.category} ${item.rarity} ${item.passive} ${item.lore} ${item.reference} ${RIFT_ITEM_STAT_TEXT(item)}`.toLowerCase().includes(normalizedQuery)));
  const groups=RIFT_ITEM_RARITIES.map(tier=>({tier,items:filtered.filter(item=>item.rarity===tier)})).filter(group=>group.items.length),selected=RIFT_ITEM(selectedId)||filtered[0]||catalog[0]||null,plan=selected?RIFT_RECIPE_PLAN(run.player,selected.id):null,profile=RIFT_BUILD_PROFILE(run.player);
  const pickCategory=value=>{setView(`All`);setCategory(value);const first=catalog.find(item=>value===`All`||item.category===value);if(first)setSelectedId(first.id);};
  const pickRecommended=()=>{setView(`Recommended`);setCategory(`All`);if(recommendedIds[0])setSelectedId(recommendedIds[0]);};
  const buy=()=>{if(!selected)return;const next=P(run),result=RIFT_BUY_ITEM(next,selected.id);setFeedback(result);if(result.ok){onCommit(next);try{window.setTimeout(()=>setFeedback(null),2400)}catch{}}};
  return (0,E.jsxs)(`div`,{className:`build-expansion-shop full-catalog-armory`,children:[
    (0,E.jsxs)(`header`,{className:`armory-header shop-command-header`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`ALL ITEMS · ALWAYS AVAILABLE · SMART RECIPES`}),(0,E.jsx)(`h2`,{children:`RIFTBOUND ARMORY`})]}),(0,E.jsxs)(`strong`,{children:[`◆ `,run.shards||0]}),(0,E.jsxs)(`em`,{children:[catalog.length,` ITEMS · FLOOR `,run.floor]})]}),
    feedback&&(0,E.jsxs)(`div`,{className:`purchase-feedback ${feedback.ok?`success`:`failure`}`,children:[(0,E.jsx)(`b`,{children:feedback.ok?`✓`:`!`}),(0,E.jsx)(`span`,{children:feedback.message||feedback.reason})]}),
    (0,E.jsxs)(`div`,{className:`league-shop-layout`,children:[
      (0,E.jsxs)(`nav`,{className:`shop-category-rail`,"aria-label":`Item shop categories`,children:[
        (0,E.jsx)(`small`,{className:`rail-heading`,children:`BROWSE`}),
        (0,E.jsxs)(`button`,{type:`button`,className:`rail-tab ${view===`All`&&category===`All`?`active`:``}`,onClick:()=>pickCategory(`All`),children:[(0,E.jsx)(`b`,{children:`▦`}),(0,E.jsx)(`span`,{children:`All Items`}),(0,E.jsx)(`em`,{children:catalog.length})]}),
        (0,E.jsxs)(`button`,{type:`button`,className:`rail-tab recommended-tab ${view===`Recommended`?`active`:``}`,onClick:pickRecommended,children:[(0,E.jsx)(`b`,{children:`★`}),(0,E.jsx)(`span`,{children:`Recommended`}),(0,E.jsx)(`em`,{children:recommendedIds.length})]}),
        (0,E.jsx)(`div`,{className:`rail-divider`}),
        RIFT_ITEM_CATEGORIES.map(value=>(0,E.jsxs)(`button`,{type:`button`,className:`rail-tab ${view===`All`&&category===value?`active`:``}`,onClick:()=>pickCategory(value),children:[(0,E.jsx)(`b`,{children:value===`Weapon`?`†`:value===`Defense`?`⬡`:value===`Armor`?`♜`:value===`Relic`?`◇`:value===`Magic`?`✦`:value===`Physical`?`拳`:`⌘`}),(0,E.jsx)(`span`,{children:value}),(0,E.jsx)(`em`,{children:catalog.filter(item=>item.category===value).length})]},value)),
        (0,E.jsxs)(`section`,{className:`shop-profile-card`,children:[(0,E.jsx)(`small`,{children:`BUILD PROFILE`}),(0,E.jsx)(`strong`,{children:profile.name.toUpperCase()}),(0,E.jsx)(`span`,{children:`Recommendations read your power source, current tiers, and open slots.`})]})
      ]}),
      (0,E.jsxs)(`main`,{className:`shop-catalog-pane`,children:[
        (0,E.jsxs)(`header`,{className:`catalog-toolbar`,children:[(0,E.jsxs)(`label`,{children:[(0,E.jsx)(`b`,{children:`⌕`}),(0,E.jsx)(`input`,{value:query,onChange:event=>setQuery(event.target.value),placeholder:`Search all items…`,"aria-label":`Search all shop items`})]}),(0,E.jsx)(`select`,{value:rarity,onChange:event=>setRarity(event.target.value),"aria-label":`Filter item rarity`,children:[`All`,...RIFT_ITEM_RARITIES].map(value=>(0,E.jsx)(`option`,{value,children:value===`All`?`ALL TIERS`:value.toUpperCase()},value))}),(0,E.jsxs)(`em`,{children:[filtered.length,` SHOWN`]})]}),
        (0,E.jsx)(`div`,{className:`shop-catalog-scroll`,children:groups.length?groups.map(group=>(0,E.jsxs)(`section`,{className:`catalog-tier-section rarity-${group.tier.toLowerCase()}`,children:[(0,E.jsxs)(`header`,{children:[(0,E.jsx)(`strong`,{children:group.tier.toUpperCase()}),(0,E.jsxs)(`span`,{children:[group.items.length,` ITEM${group.items.length===1?``:`S`}`]})]}),(0,E.jsx)(`div`,{className:`catalog-icon-grid`,children:group.items.map(item=>(0,E.jsx)(RIFT_CATALOG_TILE,{item,fighter:run.player,selected:selected?.id===item.id,recommended:recommended.has(item.id),onSelect:setSelectedId},item.id))})]},group.tier)):(0,E.jsxs)(`div`,{className:`empty-catalog-state`,children:[(0,E.jsx)(`b`,{children:`NO ITEMS MATCH`}),(0,E.jsx)(`span`,{children:`Clear the search or choose another category.`})]})})
      ]}),
      (0,E.jsx)(RIFT_ITEM_DETAIL,{item:selected,fighter:run.player,plan,onBuy:buy,onSelect:setSelectedId,recommended:recommended.has(selected?.id)})
    ]}),
    (0,E.jsx)(RIFT_INVENTORY_MANAGER,{run,onCommit})
  ]});
}
