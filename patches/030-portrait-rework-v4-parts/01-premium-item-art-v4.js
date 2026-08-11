/* Riftbound Portrait Rework V4 · Six Stones quality bar for every item */
const RIFT_PORTRAIT_V4_VERSION=4;
const RIFT_ITEM_V4_PROFILE_CACHE=globalThis.__RIFT_ITEM_V4_PROFILE_CACHE__||(globalThis.__RIFT_ITEM_V4_PROFILE_CACHE__=new Map());

const RIFT_V4_MATERIAL_BY_KIND={
  sword:`steel`,longsword:`steel`,katana:`steel`,greatsword:`steel`,saber:`energy`,axe:`steel`,hammer:`steel`,spear:`steel`,arrow:`wood`,bow:`wood`,chainblade:`steel`,drill:`steel`,gun:`tech`,portalgun:`tech`,gravitygun:`tech`,bfg:`tech`,gauntlet:`steel`,hiddenblade:`steel`,stone:`stone`,shield:`steel`,chestplate:`steel`,cloak:`cloth`,robe:`cloth`,suit:`tech`,harness:`leather`,belt:`leather`,boots:`leather`,wand:`wood`,book:`paper`,ring:`metal`,crown:`metal`,monocle:`glass`,lens:`glass`,medallion:`metal`,reliquary:`metal`,seal:`wax`,coin:`metal`,die:`stone`,bone:`bone`,gem:`crystal`,crystal:`crystal`,shard:`crystal`,orb:`crystal`,sphere:`tech`,pill:`ceramic`,vial:`glass`,moss:`organic`,thread:`cloth`,cloth:`cloth`,compass:`metal`,radar:`tech`,wrist:`tech`,clock:`metal`,hourglass:`glass`,gear:`metal`,battery:`tech`,device:`tech`,chip:`tech`,abacus:`wood`,relic:`metal`
};
function RIFT_ITEM_V4_MATERIAL(item,kind){
  const text=`${item?.id||``} ${item?.name||``} ${item?.lore||``}`.toLowerCase();
  if(/bone|ivory/.test(text))return `bone`;
  if(/moss|living|organic|hide/.test(text)&&![`chestplate`,`cloak`,`boots`].includes(kind))return `organic`;
  if(/cloth|silk|thread|robe|cloak|mantle|coat/.test(text))return `cloth`;
  if(/leather|belt|harness|boots|soles/.test(text))return `leather`;
  if(/crystal|gem|emerald|prism|shard/.test(text))return `crystal`;
  if(/book|tome|codex|grimoire|index/.test(text))return `paper`;
  if(/wood|wand|bow|spear/.test(text)&&![`saber`].includes(kind))return RIFT_V4_MATERIAL_BY_KIND[kind]||`wood`;
  return RIFT_V4_MATERIAL_BY_KIND[kind]||`metal`;
}
function RIFT_ITEM_V4_PROFILE(item,kind){
  if(!item)return {material:`empty`,craft:0,style:{}};
  const cacheKey=`${item.id}:${kind}`;const cached=RIFT_ITEM_V4_PROFILE_CACHE.get(cacheKey);if(cached)return cached;
  const h=RIFT_ITEM_HASH(`${item.id}:portrait-v4`),h2=RIFT_ITEM_HASH(`${item.id}:portrait-v4-detail`);
  const profile={material:RIFT_ITEM_V4_MATERIAL(item,kind),craft:h%6,style:{
    '--item-a':item.accent||`#6cc6c1`,'--item-b':`hsl(${(h+47)%360} 72% 61%)`,'--item-c':`hsl(${(h2+181)%360} 55% 31%)`,
    '--object-tilt':`${(h%5)-2}deg`,'--object-shift':`${(h2%5)-2}%`,'--craft-hi':`hsl(${(h+19)%360} 28% 88%)`,'--craft-lo':`hsl(${(h2+211)%360} 38% 18%)`,
    '--detail-x':`${42+(h%17)}%`,'--detail-y':`${32+(h2%23)}%`
  }};
  RIFT_ITEM_V4_PROFILE_CACHE.set(cacheKey,profile);return profile;
}

RIFT_ITEM_ICON=function RIFT_ITEM_ICON({item,size=`normal`,pulse=false}){
  if(!item)return (0,E.jsx)(`span`,{className:`rift-item-icon art-icon art-v3 art-v4 literal-empty ${size}`,"aria-hidden":true,children:(0,E.jsx)(`i`,{className:`art-main`})});
  const kind=RIFT_ITEM_LITERAL_KIND(item),special=RIFT_ITEM_LITERAL_SPECIAL(item),profile=RIFT_ITEM_V4_PROFILE(item,kind),specialClass=special?` ref-${special}`:``;
  return (0,E.jsxs)(`span`,{className:`rift-item-icon art-icon art-v3 art-v4 literal-${kind} material-${profile.material} craft-${profile.craft}${specialClass} ${size} rarity-${item.rarity.toLowerCase()} ${pulse?`purchase-pop`:``}`,style:profile.style,title:item.name,"data-art-id":item.id,"data-literal-kind":kind,"data-art-quality":`v4`,children:[
    (0,E.jsx)(`i`,{className:`art-frame`}),(0,E.jsx)(`i`,{className:`art-back`}),(0,E.jsx)(`i`,{className:`art-shadow`}),(0,E.jsx)(`i`,{className:`art-main`}),(0,E.jsx)(`i`,{className:`art-material`}),(0,E.jsx)(`i`,{className:`art-detail`}),(0,E.jsx)(`i`,{className:`art-accent`}),(0,E.jsx)(`i`,{className:`art-highlight`}),(0,E.jsx)(`i`,{className:`art-rune`}),(0,E.jsx)(`i`,{className:`art-gemlight`})
  ]});
};