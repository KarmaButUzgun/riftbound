from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
js_path=root/'assets/page-F6OuavDb.js'; css_path=root/'assets/riftbound.css'
s=js_path.read_text(); css=css_path.read_text()
marker='/* Riftbound Armory Render Isolation V16.6 */'
if marker in s: raise SystemExit('already applied')

# Stabilize initial and active Armory memory objects so memoized catalog can actually stay asleep.
old='initial=RIFT_V16_ARMORY_MEMORY(run,initialOwner,catalog);'
new='initial=(0,r.useMemo)(()=>RIFT_V16_ARMORY_MEMORY(run,initialOwner,catalog),[run,initialOwner,catalog]);'
if s.count(old)!=1: raise SystemExit(f'initial memory anchor {s.count(old)}')
s=s.replace(old,new,1)
old='const v165CatalogMemory=RIFT_V16_ARMORY_MEMORY(run,shopOwner,catalog),memorySnapshot='
new='const v165CatalogMemory=(0,r.useMemo)(()=>RIFT_V16_ARMORY_MEMORY(run,shopOwner,catalog),[run,shopOwner,catalog]),memorySnapshot='
if s.count(old)!=1: raise SystemExit(f'active memory anchor {s.count(old)}')
s=s.replace(old,new,1)

# Replace catalog tile with a low-node silhouette. Full premium art remains in detail and hover tooltip.
tile_start=s.index('function RIFT_V16_CATALOG_TILE({item,fighter,selected,recommended,favorite,onSelect,onQuickBuy,onHover,onFavorite,pulse=false})')
tile_end=s.index('const RIFT_V16_CATALOG_TILE_MEMO=', tile_start)
new_tile=r'''/* Riftbound Armory Render Isolation V16.6 */
function RIFT_V166_CATALOG_FAMILY(item){let kind=``;try{kind=String(RIFT_ITEM_LITERAL_KIND(item)||``).toLowerCase()}catch{kind=String(item?.iconKind||item?.category||``).toLowerCase()}if(/sword|katana|blade|dagger|saber|spear|kunai|arrow|axe|hammer|drill|chain/.test(kind))return `blade`;if(/gun|cannon|rifle|pistol|launcher/.test(kind))return `gun`;if(/armor|plate|suit|cloak|robe|boots|harness|shield/.test(kind))return `armor`;if(/book|tome|manual|note|page|grimoire/.test(kind))return `book`;if(/ring|orb|gem|crystal|stone|sphere|relic|medallion|coin|puzzle/.test(kind))return `relic`;if(/gauntlet|glove|wrist/.test(kind))return `gauntlet`;if(/device|battery|reactor|chip|clock|radar|lens|goggles|monocle/.test(kind))return `device`;return String(item?.category||`relic`).toLowerCase().replace(/[^a-z0-9]+/g,``)}
function RIFT_V166_CATALOG_ICON({item,pulse=false}){if(!item)return (0,E.jsx)(`span`,{className:`rift-item-icon v166-catalog-icon empty`});let family=RIFT_V166_CATALOG_FAMILY(item);return (0,E.jsx)(`span`,{className:`rift-item-icon v166-catalog-icon family-${family} rarity-${item.rarity.toLowerCase()} ${pulse?`purchase-pop`:``}`,style:{"--item-a":item.accent},title:item.name,"aria-hidden":true,children:(0,E.jsx)(`i`,{})})}
function RIFT_V16_CATALOG_TILE({item,fighter,selected,recommended,favorite,onSelect,onQuickBuy,onHover,onFavorite,pulse=false}){const owned=RIFT_OWNS_ITEM(fighter,item.id);return (0,E.jsxs)(`div`,{className:`v16-catalog-shell`,children:[(0,E.jsxs)(`button`,{type:`button`,className:`catalog-item-tile catalog-item-v2 rarity-${item.rarity.toLowerCase()} ${selected?`selected`:``} ${recommended?`recommended`:``} ${owned?`owned`:``} ${pulse?`just-purchased`:``}`,style:{"--tile-accent":item.accent},"aria-label":`${item.name}, ${item.price} Shards`,onClick:()=>onSelect(item.id),onMouseDown:event=>{if(event.button===1)event.preventDefault()},onAuxClick:event=>{if(event.button!==1)return;event.preventDefault();event.stopPropagation();onQuickBuy?.(item.id,event)},onMouseEnter:event=>onHover?.(item.id,event),onMouseLeave:()=>onHover?.(null),children:[(0,E.jsx)(RIFT_V166_CATALOG_ICON,{item,pulse}),(0,E.jsx)(`strong`,{children:item.name}),(0,E.jsxs)(`span`,{children:[item.price,` ◆`]}),recommended&&(0,E.jsx)(`i`,{children:`◎`}),owned&&(0,E.jsx)(`em`,{children:`✓`})]}),(0,E.jsx)(`button`,{type:`button`,className:`v16-tile-favorite`,onClick:event=>{event.preventDefault();event.stopPropagation();onFavorite(item.id)},title:favorite?`Unfavorite`:`Favorite`,children:favorite?`★`:`☆`})]})}
'''
s=s[:tile_start]+new_tile+s[tile_end:]

# Replace virtual catalog with a tighter window and local delayed rich hover state.
vc_start=s.index('function RIFT_V165_VIRTUAL_CATALOG({groups,fighter,selectedId,recommended,favorites,onSelect,onQuickBuy,onFavorite,pulseId,memory,restoreToken})')
vc_end=s.index('const RIFT_V165_VIRTUAL_CATALOG_MEMO=', vc_start)
new_vc=r'''function RIFT_V165_VIRTUAL_CATALOG({groups,fighter,selectedId,recommended,favorites,onSelect,onQuickBuy,onFavorite,pulseId,memory,restoreToken}){
 const rowH=132,headerH=32,overscan=80,scrollRef=(0,r.useRef)(null),rafRef=(0,r.useRef)(0),hoverTimer=(0,r.useRef)(0),[metrics,setMetrics]=(0,r.useState)(()=>({top:Number(memory?.catalogScroll||0),height:620,width:760})),[localHover,setLocalHover]=(0,r.useState)(null);
 const read=()=>{let el=scrollRef.current;if(!el)return;let next={top:Math.floor(el.scrollTop/rowH)*rowH,height:el.clientHeight||620,width:el.clientWidth||760};setMetrics(prev=>Math.abs(prev.top-next.top)<1&&prev.height===next.height&&prev.width===next.width?prev:next)};
 (0,r.useEffect)(()=>{let el=scrollRef.current;if(!el)return;el.scrollTop=Number(memory?.catalogScroll||0);read();let ro=typeof ResizeObserver!==`undefined`?new ResizeObserver(()=>read()):null;ro?.observe(el);return()=>{ro?.disconnect();if(rafRef.current&&typeof cancelAnimationFrame!==`undefined`)cancelAnimationFrame(rafRef.current);if(hoverTimer.current)clearTimeout(hoverTimer.current)}},[memory,restoreToken]);
 const onScroll=event=>{if(memory)memory.catalogScroll=event.currentTarget.scrollTop;if(localHover)setLocalHover(null);if(hoverTimer.current){clearTimeout(hoverTimer.current);hoverTimer.current=0}if(rafRef.current)return;rafRef.current=requestAnimationFrame(()=>{rafRef.current=0;read()})};
 const hoverAt=(id,event)=>{if(hoverTimer.current){clearTimeout(hoverTimer.current);hoverTimer.current=0}if(!id){setLocalHover(null);return}const point={id,x:event?.clientX??0,y:event?.clientY??0};hoverTimer.current=setTimeout(()=>{hoverTimer.current=0;setLocalHover(point)},70)};
 const cols=Math.max(2,Math.min(5,Math.floor(Math.max(260,metrics.width-16)/126)));
 const model=(0,r.useMemo)(()=>{let rows=[],top=0;for(const group of groups){rows.push({kind:`header`,tier:group.tier,count:group.items.length,top,height:headerH});top+=headerH;for(let i=0;i<group.items.length;i+=cols){rows.push({kind:`items`,tier:group.tier,items:group.items.slice(i,i+cols),top,height:rowH});top+=rowH}}return{rows,total:Math.max(top,1)}},[groups,cols]);
 const from=Math.max(0,metrics.top-overscan),to=metrics.top+metrics.height+overscan,visible=(0,r.useMemo)(()=>model.rows.filter(row=>row.top+row.height>=from&&row.top<=to),[model,from,to]);
 const rendered=visible.map((row,index)=>{if(row.kind===`header`)return (0,E.jsxs)(`header`,{className:`v165-tier-header rarity-${row.tier.toLowerCase()}`,style:{top:row.top,height:row.height},children:[(0,E.jsx)(`strong`,{children:row.tier.toUpperCase()}),(0,E.jsxs)(`span`,{children:[row.count,` ITEM${row.count===1?``:`S`}`]})]},`${row.tier}-h`);return (0,E.jsx)(`div`,{className:`catalog-icon-grid v165-virtual-row`,style:{top:row.top,height:row.height,"--v165-cols":cols},children:row.items.map(item=>(0,E.jsx)(RIFT_V16_CATALOG_TILE_MEMO,{item,fighter,selected:selectedId===item.id,recommended:recommended.has(item.id),favorite:favorites.has(item.id),onSelect,onQuickBuy,onHover:hoverAt,onFavorite,pulse:pulseId===item.id},item.id))},`${row.tier}-${row.top}-${index}`)});
 const hoverItem=localHover?.id?RIFT_ITEM(localHover.id):null;
 return (0,E.jsxs)(E.Fragment,{children:[hoverItem&&(0,E.jsx)(RIFT_ITEM_TOOLTIP,{item:hoverItem,fighter,point:localHover}),(0,E.jsx)(`div`,{ref:scrollRef,className:`shop-catalog-scroll v165-virtual-scroll v166-isolated-catalog`,onScroll,children:(0,E.jsx)(`div`,{className:`v165-virtual-space`,style:{height:model.total},children:rendered})})]});
}
'''
s=s[:vc_start]+new_vc+s[vc_end:]

css += r'''
/* Riftbound Armory Render Isolation V16.6 */
.v16-armory .v166-isolated-catalog{overflow-anchor:none!important;isolation:isolate}
.v16-armory .v166-catalog-icon{position:relative!important;width:62px!important;height:62px!important;display:grid!important;place-items:center!important;overflow:hidden!important;border-radius:9px!important;border:1px solid color-mix(in srgb,var(--item-a) 40%,#384550)!important;background:#071019!important;contain:strict!important;isolation:isolate!important;box-shadow:inset 0 0 0 1px #ffffff08!important;filter:none!important;transform:none!important}
.v16-armory .v166-catalog-icon:before{content:"";position:absolute;inset:8px;border-radius:50%;background:color-mix(in srgb,var(--item-a) 16%,transparent);opacity:.8}
.v16-armory .v166-catalog-icon:after{content:"";position:absolute;left:12%;right:12%;bottom:8%;height:2px;background:var(--item-a);opacity:.55}
.v16-armory .v166-catalog-icon>i{position:relative!important;z-index:2!important;display:block!important;width:34px!important;height:34px!important;background:var(--item-a)!important;opacity:.92!important;box-shadow:none!important;filter:none!important;animation:none!important;transform:none!important}
.v16-armory .v166-catalog-icon.family-blade>i{width:8px!important;height:42px!important;border-radius:6px 6px 2px 2px!important;clip-path:polygon(35% 0,65% 0,72% 70%,100% 76%,100% 84%,65% 82%,62% 100%,38% 100%,35% 82%,0 84%,0 76%,28% 70%)!important;transform:rotate(28deg)!important}
.v16-armory .v166-catalog-icon.family-gun>i{width:38px!important;height:22px!important;clip-path:polygon(0 18%,74% 18%,100% 0,100% 45%,72% 55%,60% 100%,40% 100%,42% 58%,0 58%)!important}
.v16-armory .v166-catalog-icon.family-armor>i{width:38px!important;height:38px!important;clip-path:polygon(50% 0,94% 18%,84% 74%,50% 100%,16% 74%,6% 18%)!important}
.v16-armory .v166-catalog-icon.family-book>i{width:38px!important;height:32px!important;border-radius:3px!important;clip-path:polygon(0 4%,46% 0,50% 8%,54% 0,100% 4%,94% 100%,54% 92%,50% 100%,46% 92%,6% 100%)!important}
.v16-armory .v166-catalog-icon.family-relic>i{width:32px!important;height:32px!important;border-radius:50%!important;box-shadow:inset 0 0 0 8px #071019!important}
.v16-armory .v166-catalog-icon.family-gauntlet>i{width:34px!important;height:38px!important;border-radius:12px 12px 8px 8px!important;clip-path:polygon(16% 0,34% 0,38% 28%,43% 0,59% 0,61% 28%,67% 4%,84% 8%,82% 47%,100% 57%,82% 100%,19% 100%,0 60%,13% 43%)!important}
.v16-armory .v166-catalog-icon.family-device>i{width:36px!important;height:30px!important;border-radius:7px!important;box-shadow:inset 0 0 0 8px #071019!important}
.v16-armory .v166-catalog-icon.family-magic>i{width:30px!important;height:30px!important;transform:rotate(45deg)!important;border-radius:5px!important}
.v16-armory .v166-catalog-icon.family-defense>i,.v16-armory .v166-catalog-icon.family-physical>i{width:34px!important;height:34px!important;clip-path:polygon(50% 0,100% 24%,86% 84%,50% 100%,14% 84%,0 24%)!important}
.v16-armory .item-hover-tooltip-v2{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:#08111bf8!important;box-shadow:0 14px 34px #000d,0 0 14px color-mix(in srgb,var(--tip) 14%,transparent)!important}
.v16-armory .shop-detail-pane>.itemization-recipe,.v16-armory .shop-detail-pane>.item-builds-into,.v16-armory .shop-detail-pane>.item-lore{content-visibility:auto;contain:layout paint style;contain-intrinsic-size:260px}
'''

js_path.write_text(s); css_path.write_text(css)
print('Applied Riftbound Armory Render Isolation V16.6')
