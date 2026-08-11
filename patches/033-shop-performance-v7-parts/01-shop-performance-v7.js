/* Riftbound Shop Performance V7 · render and compositor optimization */
const RIFT_SHOP_PERF_V7_VERSION=7;
const RIFT_SHOP_PERF_SEARCH_CACHE=globalThis.__RIFT_SHOP_PERF_SEARCH_CACHE__||(globalThis.__RIFT_SHOP_PERF_SEARCH_CACHE__=new Map());
const RIFT_SHOP_PERF_BUILDS_INTO_CACHE=globalThis.__RIFT_SHOP_PERF_BUILDS_INTO_CACHE__||(globalThis.__RIFT_SHOP_PERF_BUILDS_INTO_CACHE__=new Map());
function RIFT_SHOP_PERF_SEARCH_TEXT(item){
  if(!item)return ``;
  const cached=RIFT_SHOP_PERF_SEARCH_CACHE.get(item.id);if(cached)return cached;
  const text=`${item.name} ${item.category} ${item.rarity} ${item.passive||``} ${item.lore||``} ${item.reference||``} ${RIFT_ITEM_STAT_TEXT(item)}`.toLowerCase();
  RIFT_SHOP_PERF_SEARCH_CACHE.set(item.id,text);return text;
}
function RIFT_SHOP_PERF_BUILDS_INTO(itemId){
  const cached=RIFT_SHOP_PERF_BUILDS_INTO_CACHE.get(itemId);if(cached)return cached;
  const result=RIFT_ITEM_CATALOG.filter(entry=>entry.recipe.includes(itemId));
  RIFT_SHOP_PERF_BUILDS_INTO_CACHE.set(itemId,result);return result;
}
const RIFT_CATALOG_TILE_MEMO=(0,r.memo)(RIFT_CATALOG_TILE,(prev,next)=>prev.item===next.item&&prev.fighter===next.fighter&&prev.selected===next.selected&&prev.recommended===next.recommended&&prev.pulse===next.pulse);
const RIFT_ITEM_DETAIL_MEMO=(0,r.memo)(RIFT_ITEM_DETAIL,(prev,next)=>prev.item===next.item&&prev.fighter===next.fighter&&prev.plan===next.plan&&prev.recommended===next.recommended&&prev.pulseId===next.pulseId);
const RIFT_INVENTORY_MANAGER_MEMO=(0,r.memo)(RIFT_INVENTORY_MANAGER,(prev,next)=>prev.run===next.run);
