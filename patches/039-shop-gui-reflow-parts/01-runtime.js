/* Riftbound Shop GUI Reflow + Mythical Alignment V11 */
const RIFT_V11_MYTHICAL_ALIGNMENT=Object.freeze({
'air-force-gloves':{scale:1.08,x:'-.5%',y:'-2.5%'},
'zeta-suit':{scale:1.02,x:'0%',y:'0%'},
'bandits-secret':{scale:1.08,x:'0%',y:'-.5%'},
'open-domain':{scale:1.04,x:'0%',y:'-6%'},
'sukuna-finger':{scale:1.04,x:'0%',y:'4.5%'},
'anduril-flame-west':{scale:.84,x:'0%',y:'-1%'},
'black-barrel':{scale:.95,x:'.5%',y:'-5.5%'},
'moonlight-greatsword-mythic':{scale:.91,x:'0%',y:'1%'},
'sling-ring':{scale:1.08,x:'-.5%',y:'3%'},
'hogyoku-orb':{scale:1.08,x:'0%',y:'4%'},
'millennium-puzzle':{scale:1.02,x:'0%',y:'5%'},
'gunbai-reflector':{scale:.99,x:'3.5%',y:'-3.5%'},
'rule-breaker-dagger':{scale:.96,x:'0%',y:'2%'},
'sandevistan-apogee':{scale:1.02,x:'2%',y:'3.5%'},
'iron-halo':{scale:1.06,x:'0%',y:'2%'},
'stone-mask':{scale:1.06,x:'0%',y:'2%'},
'flying-raijin-kunai':{scale:1.00,x:'.5%',y:'4%'},
'mimic-tear-ashes':{scale:1.06,x:'0%',y:'-3%'},
'prison-realm':{scale:1.06,x:'0%',y:'2%'},
'arc-reactor':{scale:1.06,x:'0%',y:'2%'},
'deathly-hallows':{scale:1.06,x:'0%',y:'2%'},
'doom-crucible':{scale:.90,x:'0%',y:'1.5%'},
'beskar-spear-mythic':{scale:.91,x:'-.5%',y:'5%'},
'choice-scarf-mythic':{scale:.96,x:'0%',y:'.5%'}
});
const RIFT_V11_ITEM_ICON_BASE=RIFT_ITEM_ICON;
RIFT_ITEM_ICON=function RIFT_V11_ITEM_ICON(args){
  const {item,size=`normal`,pulse=false}=args||{},canon=item?RIFT_MYTHICAL_CANON_PROFILES?.[item.id]:null,align=item?RIFT_V11_MYTHICAL_ALIGNMENT[item.id]:null;
  if(!item||item.id===`sparda-devil-sword`||!canon||!align)return RIFT_V11_ITEM_ICON_BASE(args||{});
  const kind=canon.kind||RIFT_ITEM_LITERAL_KIND(item),style={...RIFT_LEGENDARY_CANON_STYLE(canon,item,{}),'--v11-art-scale':align.scale,'--v11-art-x':align.x,'--v11-art-y':align.y};
  return (0,E.jsxs)(`span`,{className:`rift-item-icon art-icon art-v3 art-v4 art-v5 art-v10 art-v11 literal-${kind} canon-${canon.visualKey} ${size} rarity-${item.rarity.toLowerCase()} ${pulse?`purchase-pop`:``}`,style,title:`${item.name} · ${canon.source}`,"data-art-id":item.id,"data-literal-kind":kind,"data-art-quality":`v11`,"data-canon-profile":canon.visualKey,"data-canon-source":canon.source,children:[
    (0,E.jsx)(`i`,{className:`art-frame`}),(0,E.jsx)(`i`,{className:`art-back`}),(0,E.jsx)(`i`,{className:`art-shadow`}),(0,E.jsx)(`i`,{className:`art-main`}),(0,E.jsx)(`i`,{className:`art-material`}),(0,E.jsx)(`i`,{className:`art-detail`}),(0,E.jsx)(`i`,{className:`art-accent`}),(0,E.jsx)(`i`,{className:`art-highlight`}),(0,E.jsx)(`i`,{className:`art-rune`}),(0,E.jsx)(`i`,{className:`art-gemlight`}),
    (0,E.jsxs)(`span`,{className:`rift-v11-art-stage`,children:[(0,E.jsx)(`i`,{className:`canon-glow`}),(0,E.jsx)(`i`,{className:`canon-main`}),(0,E.jsx)(`i`,{className:`canon-secondary`}),(0,E.jsx)(`i`,{className:`canon-detail`}),(0,E.jsx)(`i`,{className:`canon-mark`})]})
  ]});
};
