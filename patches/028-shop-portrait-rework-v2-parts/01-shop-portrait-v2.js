/* Riftbound Shop + Portrait Rework V2 · final runtime overrides */
const RIFT_SHOP_ART_V2_VERSION=2;
const RIFT_ITEM_ART_CACHE=globalThis.__RIFT_ITEM_ART_CACHE__||(globalThis.__RIFT_ITEM_ART_CACHE__=new Map());
const RIFT_LEGENDARY_ART_MOTIFS={
  'master-sword-awakened':'sacred','zangetsu-moonfang':'moon','nichirin-sunsteel':'sun','leviathan-returning-axe':'frost',
  'blades-of-chaos-chain':'chaos','buster-sword-limit':'limit','masamune-long-reach':'wing','elder-wand-elder-rule':'arcane',
  'green-lantern-ring':'lantern','chaos-emerald-core':'emerald','sonic-power-sneakers':'speed','matrix-red-pill':'matrix',
  'predator-cloak-module':'predator','nanosuit-2':'nanosuit','lightsaber-kyber-core':'kyber','darksaber-mandalore':'dark',
  'frostmourne-soulsteel':'soul','ashbringer-dawn':'holy','hidden-blade-assassin':'assassin','gravity-gun-zero-point':'gravity',
  'portal-device-aperture':'portal','bfg-argent-core':'argent','master-ball-command':'capture','necronomicon-ex-mortis':'necronomicon',
  'dragon-radar-targeting':'radar','witcher-medallion-wolf':'wolf','pipboy-vats-3000':'vats','time-turner-hourglass':'time',
  'black-pearl-compass':'compass','berserkers-draupnir':'draupnir','stand-arrow-bow':'stand','devil-breaker-overdrive':'devil'
};
function RIFT_ITEM_ART_MOTIF(item){
  if(!item)return `empty`;
  if(RIFT_LEGENDARY_ART_MOTIFS[item.id])return RIFT_LEGENDARY_ART_MOTIFS[item.id];
  const text=`${item.id} ${item.name} ${item.reference||``} ${item.lore||``}`.toLowerCase();
  const motifs=[
    [`blood`,`blood`],[`moon`,`moon`],[`sun`,`sun`],[`frost`,`frost`],[`ice`,`frost`],[`fire`,`chaos`],[`hell`,`chaos`],[`devil`,`devil`],
    [`void`,`void`],[`abyss`,`void`],[`star`,`cosmic`],[`cosmic`,`cosmic`],[`lightning`,`storm`],[`storm`,`storm`],[`time`,`time`],[`hourglass`,`time`],
    [`portal`,`portal`],[`gravity`,`gravity`],[`book`,`book`],[`tome`,`book`],[`mask`,`mask`],[`eye`,`eye`],[`crown`,`crown`],[`ring`,`ring`],
    [`blade`,`blade`],[`sword`,`blade`],[`armor`,`armor`],[`shield`,`shield`],[`cloak`,`cloak`],[`boots`,`speed`],[`gun`,`gun`],[`wand`,`arcane`]
  ];
  for(const [needle,motif] of motifs)if(text.includes(needle))return motif;
  return String(item.category||item.iconKind||`relic`).toLowerCase().replace(/[^a-z0-9]+/g,``)||`relic`;
}
function RIFT_ITEM_ART_PROFILE(item){
  if(!item)return null;
  const cached=RIFT_ITEM_ART_CACHE.get(item.id);if(cached)return cached;
  const h=RIFT_ITEM_HASH(item.id),h2=RIFT_ITEM_HASH(`${item.id}:portrait-v2`),h3=RIFT_ITEM_HASH(`${item.id}:${item.reference||``}:composition`);
  const profile={
    motif:RIFT_ITEM_ART_MOTIF(item),composition:h3%12,variant:h2%16,
    style:{
      '--item-a':item.accent||`#6cc6c1`,'--item-b':`hsl(${(h+71)%360} 86% 61%)`,'--item-c':`hsl(${(h2+193)%360} 74% 39%)`,
      '--art-angle':`${(h%91)-45}deg`,'--art-angle-2':`${(h2%121)-60}deg`,'--art-angle-soft':`${(((h%91)-45)*.28).toFixed(1)}deg`,'--art-angle-detail':`${(-((h%91)-45)*.18).toFixed(1)}deg`,'--art-angle-half':`${(((h%91)-45)*.5).toFixed(1)}deg`,'--art-angle-half-neg':`${(-((h%91)-45)*.5).toFixed(1)}deg`,'--art-scale':`${(.84+(h3%25)/100).toFixed(2)}`,'--art-scale-up':`${(.92+(h3%25)/100).toFixed(2)}`,'--art-scale-up2':`${(.96+(h3%25)/100).toFixed(2)}`,'--art-scale-down':`${(.76+(h3%25)/100).toFixed(2)}`,
      '--art-x':`${31+h%39}%`,'--art-y':`${25+h2%48}%`,'--art-aura-x':`${18+h3%65}%`,'--art-aura-y':`${13+h%67}%`,
      '--art-spark-x':`${9+h2%82}%`,'--art-spark-y':`${8+h3%80}%`,'--art-cut':`${6+h%18}%`,'--art-depth':`${42+h2%39}%`
    }
  };
  RIFT_ITEM_ART_CACHE.set(item.id,profile);return profile;
}
RIFT_ITEM_ICON=function RIFT_ITEM_ICON({item,size=`normal`,pulse=false}){
  if(!item)return (0,E.jsx)(`span`,{className:`rift-item-icon art-icon art-v2 empty ${size}`,"aria-hidden":true,children:(0,E.jsx)(`i`,{className:`art-main`})});
  const profile=RIFT_ITEM_ART_PROFILE(item),kind=String(item.iconKind||item.category||`relic`).toLowerCase().replace(/[^a-z0-9]+/g,``);
  return (0,E.jsxs)(`span`,{className:`rift-item-icon art-icon art-v2 ${size} rarity-${item.rarity.toLowerCase()} art-${kind} motif-${profile.motif} composition-${profile.composition} variant-${profile.variant} ${pulse?`purchase-pop`:``}`,style:profile.style,title:item.name,"data-art-id":item.id,children:[
    (0,E.jsx)(`i`,{className:`art-frame`}),(0,E.jsx)(`i`,{className:`art-atmosphere`}),(0,E.jsx)(`i`,{className:`art-aura`}),(0,E.jsx)(`i`,{className:`art-shadow`}),(0,E.jsx)(`i`,{className:`art-back`}),(0,E.jsx)(`i`,{className:`art-main`}),(0,E.jsx)(`i`,{className:`art-detail`}),(0,E.jsx)(`i`,{className:`art-rune`}),(0,E.jsx)(`i`,{className:`art-foreground`}),(0,E.jsx)(`i`,{className:`art-flare`}),(0,E.jsx)(`i`,{className:`art-gemlight`}),(0,E.jsx)(`i`,{className:`art-spark`})
  ]});
};
function RIFT_TOOLTIP_POSITION(point){
  if(typeof window===`undefined`)return {left:16,top:16};
  const vw=Math.max(320,window.innerWidth||320),vh=Math.max(320,window.innerHeight||320),w=Math.min(390,vw-24),h=Math.min(430,vh-24),px=Number(point?.x??vw*.55),py=Number(point?.y??vh*.35);
  let left=px+18,top=py+18;if(left+w>vw-10)left=px-w-18;if(top+h>vh-10)top=py-h-18;left=Math.max(10,Math.min(left,vw-w-10));top=Math.max(10,Math.min(top,vh-h-10));return {left,top,width:w};
}
RIFT_ITEM_TOOLTIP=function RIFT_ITEM_TOOLTIP({item,fighter,point}){
  if(!item)return null;const plan=fighter?RIFT_RECIPE_PLAN(fighter,item.id):null,pos=RIFT_TOOLTIP_POSITION(point);
  return (0,E.jsxs)(`aside`,{className:`item-hover-tooltip item-hover-tooltip-v2 rarity-${item.rarity.toLowerCase()}`,style:{...pos,"--tip":item.accent},role:`tooltip`,children:[
    (0,E.jsxs)(`header`,{children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`small`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`${item.rarity} · ${item.category}`}),(0,E.jsx)(`strong`,{children:item.name}),(0,E.jsx)(`em`,{children:item.reference||`Riftbound`})]}),(0,E.jsxs)(`b`,{children:[plan?.cost??item.price,` ◆`]})]}),
    (0,E.jsx)(RIFT_ITEM_STATS,{item}),(0,E.jsxs)(`section`,{children:[(0,E.jsx)(`small`,{children:`PASSIVE / PROPERTY`}),(0,E.jsx)(`p`,{children:item.passive}),(0,E.jsxs)(`div`,{children:[(0,E.jsxs)(`span`,{children:[`TRIGGER · `,RIFT_ITEM_TRIGGER_LABEL(item)]}),item.cooldown>0&&(0,E.jsxs)(`span`,{children:[`COOLDOWN · `,item.cooldown,` OWNER TURNS`]})]})]}),(0,E.jsx)(`blockquote`,{children:item.lore})
  ]});
};
RIFT_RECIPE_NODE=function RIFT_RECIPE_NODE({itemId,fighter,onSelect,onQuickBuy,onHover,root=false,lineage=[]}){
  if(lineage.includes(itemId))return null;const item=RIFT_ITEM(itemId);if(!item)return null;
  const owned=RIFT_OWNS_ITEM(fighter,item.id),children=(item.recipe||[]).filter(id=>!lineage.includes(id)),price=owned?`OWNED`:item.recipe.length?`${item.combineCost} ◆ COMBINE`:`${item.price} ◆`;
  const click=event=>{event.preventDefault();event.stopPropagation();if(root||owned){onSelect?.(item.id);return}if(event.detail>=2){const pending=globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__;if(pending?.handle)clearTimeout(pending.handle);globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__=null;onQuickBuy?.(item.id,event);return}const prior=globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__;if(prior?.handle)clearTimeout(prior.handle);const handle=setTimeout(()=>{onSelect?.(item.id);if(globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__?.handle===handle)globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__=null},220);globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__={id:item.id,handle};};
  return (0,E.jsxs)(`div`,{className:`recipe-graph-node ${root?`root`:``} ${owned?`owned`:``}`,children:[
    (0,E.jsxs)(`button`,{type:`button`,className:`recipe-graph-card rarity-${item.rarity.toLowerCase()}`,style:{"--node-accent":item.accent},onClick:click,onDoubleClick:event=>{event.preventDefault();event.stopPropagation()},onMouseEnter:event=>onHover?.(item.id,event),onMouseMove:event=>onHover?.(item.id,event),onMouseLeave:()=>onHover?.(null),title:root?`Selected final item`:`Double-click to buy ${item.name}`,children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:root?`small`:`tiny`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:item.name}),(0,E.jsx)(`small`,{children:price})]}),owned&&(0,E.jsx)(`strong`,{children:`✓`})]}),
    children.length>0&&(0,E.jsx)(`div`,{className:`recipe-graph-children`,children:children.map((id,index)=>(0,E.jsx)(RIFT_RECIPE_NODE,{itemId:id,fighter,onSelect,onQuickBuy,onHover,lineage:[...lineage,itemId]},`${id}-${index}`))})
  ]});
};
RIFT_RECIPE_VIEW=function RIFT_RECIPE_VIEW({item,fighter,onSelect,onQuickBuy,onHover}){
  if(!item)return null;return (0,E.jsxs)(`section`,{className:`rift-recipe-graph itemization-recipe recipe-v2`,children:[(0,E.jsxs)(`header`,{children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`BUILD PATH`}),(0,E.jsx)(`strong`,{children:item.recipe.length?`LIVE COMPONENT TREE`:`BASE COMPONENT`})]}),(0,E.jsx)(`em`,{children:item.recipe.length?`DOUBLE-CLICK A COMPONENT TO BUY IT DIRECTLY`:`PURCHASES DIRECTLY`})]}),(0,E.jsx)(`div`,{className:`recipe-graph-scroll`,children:(0,E.jsx)(RIFT_RECIPE_NODE,{itemId:item.id,fighter,onSelect,onQuickBuy,onHover,root:true})})]});
};
RIFT_ITEM_DETAIL=function RIFT_ITEM_DETAIL({item,fighter,plan,onBuy,onSelect,onQuickBuy,onHover,recommended=false,pulseId=null}){
  if(!item)return (0,E.jsx)(`aside`,{className:`rift-item-detail shop-detail-pane empty`,children:`Choose an item to inspect its recipe, upgrades, stats, passive, and exact purchase cost.`});
  const active=item.category===`Weapon`?RIFT_ACTIVE_ITEM(fighter):null,buildsInto=RIFT_ITEM_CATALOG.filter(entry=>entry.recipe.includes(item.id)),owned=RIFT_OWNS_ITEM(fighter,item.id);
  return (0,E.jsxs)(`aside`,{className:`rift-item-detail shop-detail-pane shop-detail-v2 rarity-${item.rarity.toLowerCase()}`,style:{"--detail":item.accent},children:[
    (0,E.jsxs)(`header`,{className:`shop-detail-header`,children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`hero`,pulse:pulseId===item.id}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`${item.rarity} · ${item.category}${recommended?` · RECOMMENDED`:``}`}),(0,E.jsx)(`h3`,{children:item.name}),(0,E.jsx)(`em`,{children:item.reference||`Riftbound Original`})]}),owned&&(0,E.jsx)(`i`,{className:`owned-item-pill`,children:`OWNED`})]}),
    (0,E.jsx)(RIFT_ITEM_STATS,{item}),(0,E.jsx)(RIFT_ITEM_STAT_PREVIEW,{item,fighter,plan}),
    (0,E.jsxs)(`section`,{className:`item-passive-copy`,children:[(0,E.jsx)(`small`,{children:item.passiveId?`UNIQUE PASSIVE`:`ITEM PROPERTY`}),(0,E.jsx)(`strong`,{children:item.passiveId?item.passiveId.replace(/([A-Z])/g,` $1`).toUpperCase():`SPECIALIZED COMPONENT`}),(0,E.jsx)(`p`,{children:item.passive}),(0,E.jsxs)(`div`,{className:`passive-rule-row`,children:[(0,E.jsxs)(`span`,{children:[`TRIGGER · `,RIFT_ITEM_TRIGGER_LABEL(item)]}),item.cooldown>0&&(0,E.jsxs)(`span`,{children:[`COOLDOWN · `,item.cooldown,`T`]})]})]}),
    item.weapon&&(0,E.jsxs)(`div`,{className:`weapon-scaling-line`,children:[(0,E.jsx)(`b`,{children:item.weapon.damageType===`Hybrid`?`AS/AP`:item.weapon.damageType===`Magic`?`AP`:`AS`}),(0,E.jsxs)(`span`,{children:[item.weapon.damageType.toUpperCase(),` WEAPON · `,item.weapon.range.toFixed(1),`m · `,item.weapon.cost,` ENERGY`]})]}),
    active&&active.id!==item.id&&(0,E.jsxs)(`div`,{className:`item-compare`,children:[(0,E.jsx)(`small`,{children:`COMPARE TO ACTIVE WEAPON`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(RIFT_ITEM_ICON,{item:active,size:`tiny`}),(0,E.jsx)(`b`,{children:active.name}),(0,E.jsx)(`em`,{children:RIFT_ITEM_STAT_TEXT(active)})]})]}),
    (0,E.jsx)(RIFT_RECIPE_VIEW,{item,fighter,onSelect,onQuickBuy,onHover}),
    (0,E.jsxs)(`section`,{className:`item-builds-into shop-upgrade-row`,children:[(0,E.jsxs)(`header`,{children:[(0,E.jsx)(`small`,{children:`BUILDS INTO`}),(0,E.jsxs)(`em`,{children:[buildsInto.length,` DIRECT UPGRADE${buildsInto.length===1?``:`S`}`]})]}),(0,E.jsx)(`div`,{children:buildsInto.length?buildsInto.map(next=>(0,E.jsxs)(`button`,{type:`button`,onClick:()=>onSelect?.(next.id),onMouseEnter:event=>onHover?.(next.id,event),onMouseMove:event=>onHover?.(next.id,event),onMouseLeave:()=>onHover?.(null),style:{"--upgrade":next.accent},children:[(0,E.jsx)(RIFT_ITEM_ICON,{item:next,size:`tiny`}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`b`,{children:next.name}),(0,E.jsxs)(`small`,{children:[next.price,` ◆ · `,next.rarity]})]})]},next.id)):(0,E.jsx)(`p`,{children:[`Legendary`,`Mythical`].includes(item.rarity)?`Final capstone item.`:`No direct upgrade.`})})]}),
    [`Legendary`,`Mythical`].includes(item.rarity)&&(0,E.jsxs)(`div`,{className:`legendary-ownership-law`,children:[(0,E.jsx)(`b`,{children:`UNIQUE OWNERSHIP`}),(0,E.jsx)(`span`,{children:`Only one copy of this specific high-rarity item can exist in the six-slot build.`})]}),
    (0,E.jsxs)(`blockquote`,{children:[`“`,item.lore,`”`]}),
    (0,E.jsxs)(`footer`,{className:`shop-purchase-bar`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:plan?.consumeUids?.length?`${plan.consumeUids.length} OWNED COMPONENT${plan.consumeUids.length===1?``:`S`} APPLIED`:`TOTAL PURCHASE COST`}),(0,E.jsxs)(`strong`,{children:[plan?.cost??item.price,` ◆`]})]}),(0,E.jsx)(`button`,{type:`button`,onClick:onBuy,disabled:!plan?.ok,className:`item-buy-button`,title:plan?.ok?`Purchase ${item.name}`:plan?.reason,children:plan?.ok?(item.recipe.length?`BUILD ITEM`:`BUY ITEM`):plan?.reason||`UNAVAILABLE`})]})
  ]});
};
RIFT_CATALOG_TILE=function RIFT_CATALOG_TILE({item,fighter,selected,recommended,onSelect,onHover,pulse=false}){
  const owned=RIFT_OWNS_ITEM(fighter,item.id);return (0,E.jsxs)(`button`,{type:`button`,className:`catalog-item-tile catalog-item-v2 rarity-${item.rarity.toLowerCase()} ${selected?`selected`:``} ${recommended?`recommended`:``} ${owned?`owned`:``} ${pulse?`just-purchased`:``}`,style:{"--tile-accent":item.accent},onClick:()=>onSelect(item.id),onMouseEnter:event=>onHover?.(item.id,event),onMouseMove:event=>onHover?.(item.id,event),onMouseLeave:()=>onHover?.(null),"aria-pressed":selected,children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`small`,pulse}),(0,E.jsx)(`strong`,{children:item.name}),(0,E.jsxs)(`span`,{children:[item.price,` ◆`]}),recommended&&(0,E.jsx)(`i`,{children:`★`}),owned&&(0,E.jsx)(`em`,{children:`✓`})]});
};
RIFT_ITEM_SHOP=function RIFT_ITEM_SHOP({run,onCommit}){
  RIFT_NORMALIZE_RUN_BUILD(run);const catalog=RIFT_SHOP_OFFERS(run.floor,run.player),launchRef=(0,r.useRef)(null);
  const [isOpen,setIsOpen]=(0,r.useState)(false),[view,setView]=(0,r.useState)(`All`),[category,setCategory]=(0,r.useState)(`All`),[rarity,setRarity]=(0,r.useState)(`All`),[statFilter,setStatFilter]=(0,r.useState)(`All`),[query,setQuery]=(0,r.useState)(``),[selectedId,setSelectedId]=(0,r.useState)(catalog[0]?.id||null),[hover,setHover]=(0,r.useState)(null),[feedback,setFeedback]=(0,r.useState)(null),[pulseId,setPulseId]=(0,r.useState)(null),[mobilePanel,setMobilePanel]=(0,r.useState)(`catalog`),[loadoutOpen,setLoadoutOpen]=(0,r.useState)(()=>typeof window===`undefined`?true:!window.matchMedia(`(max-width: 860px), (max-height: 680px)`).matches);
  const clearRecipeTimer=()=>{const pending=globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__;if(pending?.handle)clearTimeout(pending.handle);globalThis.__RIFT_RECIPE_CLICK_TIMER_V2__=null;};
  const closeShop=()=>{clearRecipeTimer();setHover(null);setFeedback(null);setIsOpen(false);try{window.setTimeout(()=>launchRef.current?.focus(),0)}catch{}};
  (0,r.useEffect)(()=>{if(!isOpen||typeof document===`undefined`)return;const root=document.documentElement,body=document.body,closeOnEscape=event=>{if(event.key===`Escape`){event.preventDefault();event.stopPropagation();closeShop()}};root.classList.add(`rift-armory-open-v2`);body.classList.add(`rift-armory-open-v2`);window.addEventListener(`keydown`,closeOnEscape,true);return()=>{clearRecipeTimer();window.removeEventListener(`keydown`,closeOnEscape,true);root.classList.remove(`rift-armory-open-v2`);body.classList.remove(`rift-armory-open-v2`)}},[isOpen]);
  const recommendedIds=RIFT_RECOMMENDED_ITEMS(run.player,catalog,10),recommended=new Set(recommendedIds),normalizedQuery=query.trim().toLowerCase();
  const statMatch=item=>statFilter===`All`||(statFilter===`AS`&&(item.stats?.as||0)>0)||(statFilter===`AP`&&(item.stats?.ap||0)>0)||(statFilter===`Defense`&&((item.stats?.durability||0)>0||(item.stats?.regeneration||0)>0))||(statFilter===`Utility`&&[`speed`,`energy`,`range`,`battleIq`,`iq`,`combatSkill`].some(key=>(item.stats?.[key]||0)>0));
  const filtered=catalog.filter(item=>(view!==`Recommended`||recommended.has(item.id))&&(category===`All`||item.category===category)&&(rarity===`All`||item.rarity===rarity)&&statMatch(item)&&(!normalizedQuery||`${item.name} ${item.category} ${item.rarity} ${item.passive} ${item.lore} ${item.reference} ${RIFT_ITEM_STAT_TEXT(item)}`.toLowerCase().includes(normalizedQuery)));
  const groups=RIFT_ITEM_RARITIES.map(tier=>({tier,items:filtered.filter(item=>item.rarity===tier)})).filter(group=>group.items.length),selected=RIFT_ITEM(selectedId)||filtered[0]||catalog[0]||null,plan=selected?RIFT_RECIPE_PLAN(run.player,selected.id):null,profile=RIFT_BUILD_PROFILE(run.player),ownedCount=run.player.inventory.filter(Boolean).length,hoverItem=hover?.id?RIFT_ITEM(hover.id):null;
  const hoverAt=(id,event)=>{if(!id){setHover(null);return}setHover({id,x:event?.clientX??0,y:event?.clientY??0})};
  const inspect=id=>{setSelectedId(id);setMobilePanel(`detail`)};
  const flash=(result,id)=>{setFeedback(result);if(result.ok){setPulseId(id);try{window.setTimeout(()=>setPulseId(null),560);window.setTimeout(()=>setFeedback(null),2200)}catch{}}};
  const buySelected=()=>{if(!selected)return;const next=P(run),result=RIFT_BUY_ITEM(next,selected.id);flash(result,selected.id);if(result.ok)onCommit(next)};
  const quickBuy=id=>{const item=RIFT_ITEM(id);if(!item)return;const now=Date.now(),guard=globalThis.__RIFT_RECIPE_DBLCLICK_V2__||{};if(guard.id===id&&now-guard.time<420)return;globalThis.__RIFT_RECIPE_DBLCLICK_V2__={id,time:now};const next=P(run),result=RIFT_BUY_ITEM(next,id);flash(result,id);if(result.ok){onCommit(next);setSelectedId(id)}};
  const pickCategory=value=>{setView(`All`);setCategory(value);setMobilePanel(`catalog`);const first=catalog.find(item=>(value===`All`||item.category===value)&&(rarity===`All`||item.rarity===rarity));if(first)setSelectedId(first.id)};
  const pickRecommended=()=>{setView(`Recommended`);setCategory(`All`);setMobilePanel(`catalog`);if(recommendedIds[0])setSelectedId(recommendedIds[0])};
  if(!isOpen)return (0,E.jsxs)(`section`,{className:`armory-launcher armory-launcher-v2`,"aria-label":`Riftbound Armory entrance`,children:[
    (0,E.jsxs)(`div`,{className:`armory-launcher-copy`,children:[(0,E.jsx)(`small`,{children:`FULL CATALOG · VERTICAL SHOP · 120 UNIQUE PORTRAITS`}),(0,E.jsx)(`h2`,{children:`RIFTBOUND ARMORY`}),(0,E.jsx)(`p`,{children:`Open the dedicated full-screen shop to inspect every item, recipe, build path, and six-slot loadout without leaving the floor flow.`})]}),
    (0,E.jsx)(`div`,{className:`armory-launcher-slots`,role:`list`,"aria-label":`${ownedCount} of 6 loadout slots filled`,children:run.player.inventory.map((instance,slot)=>{const item=instance?RIFT_ITEM(instance.itemId):null;return(0,E.jsxs)(`span`,{className:`armory-launcher-slot ${slot===0?`weapon`:``} ${item?`filled`:`empty`}`,role:`listitem`,title:item?.name||`Open slot ${slot}`,children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`tiny`}),(0,E.jsx)(`b`,{children:slot===0?`W`:slot})]},slot)})}),
    (0,E.jsxs)(`div`,{className:`armory-launcher-status`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`AVAILABLE`}),(0,E.jsxs)(`strong`,{children:[catalog.length,` ITEMS`]})]}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`CURRENT BUILD`}),(0,E.jsxs)(`strong`,{children:[ownedCount,` / 6`]})]}),(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`SHARDS`}),(0,E.jsxs)(`strong`,{children:[`◆ `,run.shards||0]})]})]}),
    (0,E.jsxs)(`button`,{ref:launchRef,type:`button`,className:`armory-open-button`,onClick:()=>setIsOpen(true),"aria-haspopup":`dialog`,children:[(0,E.jsx)(`span`,{children:`OPEN ARMORY`}),(0,E.jsx)(`small`,{children:`ENTER FULL-SCREEN SHOP`})]})
  ]});
  return (0,E.jsx)(`div`,{className:`armory-viewport armory-viewport-v2`,role:`dialog`,"aria-modal":true,"aria-label":`Riftbound Armory`,onPointerDown:event=>{if(event.target===event.currentTarget)closeShop()},children:(0,E.jsxs)(`div`,{className:`build-expansion-shop full-catalog-armory armory-is-open rift-shop-v2 ${loadoutOpen?`loadout-expanded`:`loadout-collapsed`}`,children:[
    hoverItem&&(0,E.jsx)(RIFT_ITEM_TOOLTIP,{item:hoverItem,fighter:run.player,point:hover}),
    (0,E.jsxs)(`header`,{className:`armory-header shop-command-header`,children:[(0,E.jsxs)(`span`,{children:[(0,E.jsx)(`small`,{children:`FULL CATALOG · VERTICAL BROWSING · LIVE RECIPES`}),(0,E.jsx)(`h2`,{children:`RIFTBOUND ARMORY`})]}),(0,E.jsxs)(`div`,{className:`armory-header-actions`,children:[(0,E.jsxs)(`strong`,{children:[`◆ `,run.shards||0]}),(0,E.jsxs)(`em`,{children:[filtered.length,` SHOWN · FLOOR `,run.floor]}),(0,E.jsxs)(`button`,{type:`button`,className:`armory-loadout-toggle`,onClick:()=>setLoadoutOpen(open=>!open),"aria-expanded":loadoutOpen,children:[`LOADOUT `,ownedCount,`/6`]}),(0,E.jsxs)(`button`,{type:`button`,className:`armory-close-button`,onClick:closeShop,autoFocus:true,children:[(0,E.jsx)(`span`,{children:`RETURN TO FLOOR`}),(0,E.jsx)(`b`,{children:`ESC`})]})]})]}),
    feedback&&(0,E.jsxs)(`div`,{className:`purchase-feedback ${feedback.ok?`success`:`failure`} ${feedback.ok&&[`Legendary`,`Mythical`].includes(RIFT_ITEM(pulseId)?.rarity)?`legendary-complete`:``}`,role:`status`,children:[(0,E.jsx)(`b`,{children:feedback.ok?`✓`:`!`}),(0,E.jsx)(`span`,{children:feedback.message||feedback.reason})]}),
    (0,E.jsxs)(`div`,{className:`league-shop-layout mobile-panel-${mobilePanel}`,children:[
      (0,E.jsxs)(`div`,{className:`shop-mobile-tabs`,role:`tablist`,"aria-label":`Armory view`,children:[(0,E.jsx)(`button`,{type:`button`,role:`tab`,"aria-selected":mobilePanel===`catalog`,className:mobilePanel===`catalog`?`active`:``,onClick:()=>setMobilePanel(`catalog`),children:`CATALOG`}),(0,E.jsx)(`button`,{type:`button`,role:`tab`,"aria-selected":mobilePanel===`detail`,className:mobilePanel===`detail`?`active`:``,onClick:()=>setMobilePanel(`detail`),children:selected?`ITEM & BUILD`:`ITEM DETAILS`})]}),
      (0,E.jsxs)(`nav`,{className:`shop-category-rail`,"aria-label":`Item shop categories and filters`,children:[
        (0,E.jsx)(`small`,{className:`rail-heading`,children:`BROWSE`}),(0,E.jsxs)(`button`,{type:`button`,className:`rail-tab ${view===`All`&&category===`All`?`active`:``}`,onClick:()=>pickCategory(`All`),children:[(0,E.jsx)(`b`,{children:`▦`}),(0,E.jsx)(`span`,{children:`All Items`}),(0,E.jsx)(`em`,{children:catalog.length})]}),(0,E.jsxs)(`button`,{type:`button`,className:`rail-tab recommended-tab ${view===`Recommended`?`active`:``}`,onClick:pickRecommended,children:[(0,E.jsx)(`b`,{children:`★`}),(0,E.jsx)(`span`,{children:`Recommended`}),(0,E.jsx)(`em`,{children:recommendedIds.length})]}),(0,E.jsx)(`div`,{className:`rail-divider`}),
        RIFT_ITEM_CATEGORIES.map(value=>(0,E.jsxs)(`button`,{type:`button`,className:`rail-tab ${view===`All`&&category===value?`active`:``}`,onClick:()=>pickCategory(value),children:[(0,E.jsx)(`b`,{children:value===`Weapon`?`†`:value===`Defense`?`⬡`:value===`Armor`?`♜`:value===`Relic`?`◇`:value===`Magic`?`✦`:value===`Physical`?`拳`:`⌘`}),(0,E.jsx)(`span`,{children:value}),(0,E.jsx)(`em`,{children:catalog.filter(item=>item.category===value).length})]},value)),
        (0,E.jsx)(`small`,{className:`rail-heading rail-subheading`,children:`STAT FOCUS`}),(0,E.jsx)(`div`,{className:`rail-filter-grid`,children:[`All`,`AS`,`AP`,`Defense`,`Utility`].map(value=>(0,E.jsx)(`button`,{type:`button`,className:statFilter===value?`active`:``,onClick:()=>setStatFilter(value),children:value===`All`?`ANY`:value},value))}),
        (0,E.jsx)(`small`,{className:`rail-heading rail-subheading`,children:`RARITY`}),(0,E.jsx)(`div`,{className:`rail-rarity-stack`,children:[`All`,...RIFT_ITEM_RARITIES].map(value=>(0,E.jsx)(`button`,{type:`button`,className:`rarity-filter rarity-${String(value).toLowerCase()} ${rarity===value?`active`:``}`,onClick:()=>setRarity(value),children:value===`All`?`ALL TIERS`:value.toUpperCase()},value))}),
        (0,E.jsxs)(`section`,{className:`shop-profile-card`,children:[(0,E.jsx)(`small`,{children:`BUILD PROFILE`}),(0,E.jsx)(`strong`,{children:profile.name.toUpperCase()}),(0,E.jsx)(`span`,{children:`Recommendations read your power source, current tiers, and open slots.`})]})
      ]}),
      (0,E.jsxs)(`main`,{className:`shop-catalog-pane`,children:[(0,E.jsxs)(`header`,{className:`catalog-toolbar`,children:[(0,E.jsxs)(`label`,{children:[(0,E.jsx)(`b`,{children:`⌕`}),(0,E.jsx)(`input`,{value:query,onChange:event=>setQuery(event.target.value),placeholder:`Search name, stat, passive, lore, reference…`,"aria-label":`Search all shop items`})]}),(0,E.jsxs)(`button`,{type:`button`,className:`catalog-clear-button`,onClick:()=>{setQuery(``);setRarity(`All`);setStatFilter(`All`);setCategory(`All`);setView(`All`)},children:[`RESET · `,filtered.length]})]}),(0,E.jsx)(`div`,{className:`shop-catalog-scroll`,children:groups.length?groups.map(group=>(0,E.jsxs)(`section`,{className:`catalog-tier-section rarity-${group.tier.toLowerCase()}`,children:[(0,E.jsxs)(`header`,{children:[(0,E.jsx)(`strong`,{children:group.tier.toUpperCase()}),(0,E.jsxs)(`span`,{children:[group.items.length,` ITEM${group.items.length===1?``:`S`}`]})]}),(0,E.jsx)(`div`,{className:`catalog-icon-grid`,children:group.items.map(item=>(0,E.jsx)(RIFT_CATALOG_TILE,{item,fighter:run.player,selected:selected?.id===item.id,recommended:recommended.has(item.id),onSelect:inspect,onHover:hoverAt,pulse:pulseId===item.id},item.id))})]},group.tier)):(0,E.jsxs)(`div`,{className:`empty-catalog-state`,children:[(0,E.jsx)(`b`,{children:`NO ITEMS MATCH`}),(0,E.jsx)(`span`,{children:`Clear the search or choose another vertical filter.`})]})})]}),
      (0,E.jsx)(RIFT_ITEM_DETAIL,{item:selected,fighter:run.player,plan,onBuy:buySelected,onSelect:inspect,onQuickBuy:quickBuy,onHover:hoverAt,recommended:recommended.has(selected?.id),pulseId})
    ]}),
    (0,E.jsx)(`div`,{className:`armory-loadout-wrap ${loadoutOpen?`is-open`:`is-collapsed`}`,children:(0,E.jsx)(RIFT_INVENTORY_MANAGER,{run,onCommit})})
  ]})});
};
