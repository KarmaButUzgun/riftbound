/* Riftbound Portrait Rework V3 · literal object-first item art */
const RIFT_PORTRAIT_V3_VERSION=3;
const RIFT_LITERAL_KIND_CACHE=globalThis.__RIFT_LITERAL_KIND_CACHE__||(globalThis.__RIFT_LITERAL_KIND_CACHE__=new Map());

/* Reference items are mapped to the object they actually are. Effects never replace this shape. */
const RIFT_LITERAL_REFERENCE_KINDS={
  'master-sword-awakened':'sword','zangetsu-moonfang':'greatsword','nichirin-sunsteel':'katana','leviathan-returning-axe':'axe',
  'blades-of-chaos-chain':'chainblade','buster-sword-limit':'greatsword','masamune-long-reach':'longsword','elder-wand-elder-rule':'wand',
  'green-lantern-ring':'ring','chaos-emerald-core':'gem','sonic-power-sneakers':'boots','matrix-red-pill':'pill',
  'predator-cloak-module':'cloak','nanosuit-2':'suit','lightsaber-kyber-core':'saber','darksaber-mandalore':'saber',
  'frostmourne-soulsteel':'greatsword','ashbringer-dawn':'greatsword','hidden-blade-assassin':'hiddenblade','gravity-gun-zero-point':'gravitygun',
  'portal-device-aperture':'portalgun','bfg-argent-core':'bfg','master-ball-command':'sphere','necronomicon-ex-mortis':'book',
  'dragon-radar-targeting':'radar','witcher-medallion-wolf':'medallion','pipboy-vats-3000':'wrist','time-turner-hourglass':'hourglass',
  'black-pearl-compass':'compass','berserkers-draupnir':'spear','stand-arrow-bow':'arrow','devil-breaker-overdrive':'gauntlet',
  'gauntlet-of-six-stones':'gauntlet','six-eyes-monocle':'monocle','spiral-core-drill':'drill','blade-of-olympus':'greatsword',
  'save-crystal-zero':'crystal','speed-force-tachyon':'device','anti-life-equation-shard':'shard','fists-of-the-north-star':'gauntlet'
};
const RIFT_LITERAL_SPECIAL_REFS={
  'gauntlet-of-six-stones':'six-stones','master-sword-awakened':'master-sword','zangetsu-moonfang':'zangetsu','portal-device-aperture':'portal-device',
  'frostmourne-soulsteel':'frostmourne','lightsaber-kyber-core':'lightsaber','gravity-gun-zero-point':'gravity-gun','time-turner-hourglass':'time-turner',
  'pipboy-vats-3000':'pipboy','hidden-blade-assassin':'hidden-blade','black-pearl-compass':'black-pearl-compass','dragon-radar-targeting':'dragon-radar',
  'master-ball-command':'master-ball','devil-breaker-overdrive':'devil-breaker','necronomicon-ex-mortis':'necronomicon','elder-wand-elder-rule':'elder-wand',
  'green-lantern-ring':'lantern-ring','chaos-emerald-core':'chaos-emerald','sonic-power-sneakers':'power-sneakers','leviathan-returning-axe':'leviathan-axe',
  'blades-of-chaos-chain':'chaos-blades','buster-sword-limit':'buster-sword','masamune-long-reach':'masamune','nanosuit-2':'nanosuit',
  'darksaber-mandalore':'darksaber','ashbringer-dawn':'ashbringer','bfg-argent-core':'bfg','witcher-medallion-wolf':'witcher-medallion',
  'berserkers-draupnir':'draupnir','stand-arrow-bow':'stand-arrow','nichirin-sunsteel':'nichirin','matrix-red-pill':'red-pill',
  'predator-cloak-module':'predator-cloak'
};

function RIFT_ITEM_LITERAL_KIND(item){
  if(!item)return `empty`;
  const cached=RIFT_LITERAL_KIND_CACHE.get(item.id);if(cached)return cached;
  if(RIFT_LITERAL_REFERENCE_KINDS[item.id]){const kind=RIFT_LITERAL_REFERENCE_KINDS[item.id];RIFT_LITERAL_KIND_CACHE.set(item.id,kind);return kind;}
  const text=`${item.id} ${item.name||``} ${item.iconKind||``} ${item.category||``}`.toLowerCase();
  const rules=[
    [`hidden blade`,`hiddenblade`],[`portal`,`portalgun`],[`gravity gun`,`gravitygun`],[`bfg`,`bfg`],[`lightsaber`,`saber`],[`darksaber`,`saber`],
    [`greatsword`,`greatsword`],[`greatblade`,`greatsword`],[`buster sword`,`greatsword`],[`longblade`,`longsword`],[`masamune`,`longsword`],[`katana`,`katana`],[`nichirin`,`katana`],
    [`sabre`,`sword`],[`saber`,`sword`],[`sword`,`sword`],[`blade`,`sword`],[`axe`,`axe`],[`hammer`,`hammer`],[`maul`,`hammer`],[`drill`,`drill`],
    [`spear`,`spear`],[`glaive`,`spear`],[`arrow`,`arrow`],[`bowstring`,`bow`],[`bow`,`bow`],[`chain`,`chainblade`],[`carbine`,`gun`],[`barrel`,`gun`],[`gun`,`gun`],
    [`gauntlet`,`gauntlet`],[`knuckle`,`gauntlet`],[`fist`,`gauntlet`],[`godhand`,`gauntlet`],[`bracer`,`gauntlet`],[`whetstone`,`stone`],
    [`shield`,`shield`],[`buckler`,`shield`],[`plate`,`chestplate`],[`mail`,`chestplate`],[`carapace`,`chestplate`],[`frame`,`chestplate`],[`armor`,`chestplate`],
    [`cloak`,`cloak`],[`coat`,`cloak`],[`mantle`,`cloak`],[`robe`,`robe`],[`raiment`,`robe`],[`hide`,`chestplate`],[`suit`,`suit`],[`harness`,`harness`],[`belt`,`belt`],[`boots`,`boots`],[`soles`,`boots`],
    [`wand`,`wand`],[`staff`,`wand`],[`hilt`,`sword`],[`book`,`book`],[`grimoire`,`book`],[`codex`,`book`],[`tome`,`book`],[`index`,`book`],
    [`ring`,`ring`],[`circlet`,`crown`],[`crown`,`crown`],[`monocle`,`monocle`],[`lens`,`lens`],[`medallion`,`medallion`],[`reliquary`,`reliquary`],[`seal`,`seal`],[`coin`,`coin`],[`token`,`coin`],[`die`,`die`],[`bone`,`bone`],
    [`emerald`,`gem`],[`gem`,`gem`],[`crystal`,`crystal`],[`prism`,`crystal`],[`shard`,`shard`],[`orb`,`orb`],[`ball`,`sphere`],[`sphere`,`sphere`],
    [`pill`,`pill`],[`vial`,`vial`],[`moss`,`moss`],[`thread`,`thread`],[`cloth`,`cloth`],[`silk`,`cloth`],[`leather`,`cloth`],[`ink`,`vial`],
    [`compass`,`compass`],[`radar`,`radar`],[`pipboy`,`wrist`],[`wrist`,`wrist`],[`watch`,`wrist`],[`chronometer`,`clock`],[`chronal`,`clock`],[`hourglass`,`hourglass`],[`time-turner`,`hourglass`],[`gear`,`gear`],
    [`battery`,`battery`],[`cell`,`battery`],[`capacitor`,`battery`],[`reactor`,`battery`],[`engine`,`device`],[`array`,`device`],[`circuit`,`device`],[`coprocessor`,`chip`],[`chip`,`chip`],[`sensor`,`device`],[`module`,`device`],[`rig`,`device`],[`device`,`device`],[`algorithm`,`chip`],[`abacus`,`abacus`]
  ];
  for(const [needle,kind] of rules)if(text.includes(needle)){RIFT_LITERAL_KIND_CACHE.set(item.id,kind);return kind;}
  const fallback={Weapon:`sword`,Defense:`shield`,Armor:`chestplate`,Relic:`medallion`,Magic:`wand`,Physical:`gauntlet`,Utility:`device`}[item.category]||`relic`;
  RIFT_LITERAL_KIND_CACHE.set(item.id,fallback);return fallback;
}
function RIFT_ITEM_LITERAL_SPECIAL(item){return RIFT_LITERAL_SPECIAL_REFS[item?.id]||``;}
function RIFT_ITEM_LITERAL_STYLE(item){
  const h=RIFT_ITEM_HASH(`${item.id}:literal-v3`),h2=RIFT_ITEM_HASH(`${item.id}:literal-v3-secondary`);
  return {'--item-a':item.accent||`#6cc6c1`,'--item-b':`hsl(${(h+61)%360} 76% 60%)`,'--item-c':`hsl(${(h2+191)%360} 58% 32%)`,'--object-tilt':`${((h%9)-4)}deg`,'--object-shift':`${((h2%7)-3)}%`};
}

RIFT_ITEM_ICON=function RIFT_ITEM_ICON({item,size=`normal`,pulse=false}){
  if(!item)return (0,E.jsx)(`span`,{className:`rift-item-icon art-icon art-v3 literal-empty ${size}`,"aria-hidden":true,children:(0,E.jsx)(`i`,{className:`art-main`})});
  const kind=RIFT_ITEM_LITERAL_KIND(item),special=RIFT_ITEM_LITERAL_SPECIAL(item),specialClass=special?` ref-${special}`:``;
  return (0,E.jsxs)(`span`,{className:`rift-item-icon art-icon art-v3 literal-${kind}${specialClass} ${size} rarity-${item.rarity.toLowerCase()} ${pulse?`purchase-pop`:``}`,style:RIFT_ITEM_LITERAL_STYLE(item),title:item.name,"data-art-id":item.id,"data-literal-kind":kind,children:[
    (0,E.jsx)(`i`,{className:`art-frame`}),(0,E.jsx)(`i`,{className:`art-back`}),(0,E.jsx)(`i`,{className:`art-shadow`}),(0,E.jsx)(`i`,{className:`art-main`}),(0,E.jsx)(`i`,{className:`art-detail`}),(0,E.jsx)(`i`,{className:`art-rune`}),(0,E.jsx)(`i`,{className:`art-gemlight`})
  ]});
};
