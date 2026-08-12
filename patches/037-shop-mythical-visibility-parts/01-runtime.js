/* Riftbound Shop Mythical Visibility + Build Strip */
function RIFT_SHOP_BUILD_STRIP({fighter}){
  RIFT_NORMALIZE_FIGHTER_BUILD(fighter);
  const slots=Array.from({length:6},(_,slot)=>fighter.inventory?.[slot]||null);
  return (0,E.jsxs)(`section`,{className:`armory-current-build-strip`,"aria-label":`Current six-slot build`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`CURRENT BUILD`}),(0,E.jsx)(`strong`,{children:`YOUR SIX ITEMS`})]}),(0,E.jsx)(`em`,{children:`ALWAYS VISIBLE WHILE SHOPPING`})]}),
    (0,E.jsx)(`div`,{className:`armory-current-build-slots`,children:slots.map((instance,slot)=>{const item=instance?RIFT_ITEM(instance.itemId):null;return (0,E.jsxs)(`article`,{className:`armory-current-build-slot ${slot===0?`weapon-slot`:``} ${item?`filled rarity-${item.rarity.toLowerCase()}`:`empty`}`,title:item?`${item.name} · ${RIFT_ITEM_STAT_TEXT(item)}`:`Empty slot ${slot}`,children:[(0,E.jsx)(`small`,{children:slot===0?`W`:String(slot)}),(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`tiny`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`strong`,{children:item?.name||`EMPTY`}),(0,E.jsx)(`em`,{children:item?.rarity||`OPEN SLOT`})]})]},slot)})})
  ]});
}
