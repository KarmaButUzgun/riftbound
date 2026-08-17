/* V36 vector portrait finalizer. */
const RIFT_V36_VECTOR_ICON_BASE=RIFT_ITEM_ICON;
RIFT_ITEM_ICON=function RIFT_V36_VECTOR_ITEM_ICON({item,size=`normal`}){if(item?.id===RIFT_V36_CRYSTAL||item?.id===RIFT_V36_MANTLE)return(0,E.jsx)(`span`,{className:`rift-item-icon art-icon ${size} rarity-${String(item.rarity||``).toLowerCase()} v36-shadow-portrait ${item.id}`,style:{"--item-a":item.accent},title:item.name,children:(0,E.jsx)(`img`,{src:`./assets/v36-${item.id}.svg`,alt:``,draggable:false,"aria-hidden":true})});return RIFT_V36_VECTOR_ICON_BASE({item,size})};
