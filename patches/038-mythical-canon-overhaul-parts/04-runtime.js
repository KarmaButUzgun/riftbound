const RIFT_V10_MYTHIC_ICON_BASE=RIFT_ITEM_ICON;
RIFT_ITEM_ICON=function RIFT_V10_MYTHIC_ICON(args){
  const {item,size=`normal`,pulse=false}=args||{},canon=item?RIFT_MYTHICAL_CANON_PROFILES[item.id]:null;
  if(!item||item.id===`sparda-devil-sword`||!canon)return RIFT_V10_MYTHIC_ICON_BASE(args||{});
  const kind=canon.kind||RIFT_ITEM_LITERAL_KIND(item),style=RIFT_LEGENDARY_CANON_STYLE(canon,item,{});
  return (0,E.jsxs)(`span`,{className:`rift-item-icon art-icon art-v3 art-v4 art-v5 art-v10 literal-${kind} canon-${canon.visualKey} ${size} rarity-${item.rarity.toLowerCase()} ${pulse?`purchase-pop`:``}`,style,title:`${item.name} · ${canon.source}`,"data-art-id":item.id,"data-literal-kind":kind,"data-art-quality":`v10`,"data-canon-profile":canon.visualKey,"data-canon-source":canon.source,children:[
    (0,E.jsx)(`i`,{className:`art-frame`}),(0,E.jsx)(`i`,{className:`art-back`}),(0,E.jsx)(`i`,{className:`art-shadow`}),(0,E.jsx)(`i`,{className:`art-main`}),(0,E.jsx)(`i`,{className:`art-material`}),(0,E.jsx)(`i`,{className:`art-detail`}),(0,E.jsx)(`i`,{className:`art-accent`}),(0,E.jsx)(`i`,{className:`art-highlight`}),(0,E.jsx)(`i`,{className:`art-rune`}),(0,E.jsx)(`i`,{className:`art-gemlight`}),(0,E.jsx)(`i`,{className:`canon-glow`}),(0,E.jsx)(`i`,{className:`canon-main`}),(0,E.jsx)(`i`,{className:`canon-secondary`}),(0,E.jsx)(`i`,{className:`canon-detail`}),(0,E.jsx)(`i`,{className:`canon-mark`})
  ]});
};
