import fs from 'node:fs';
const js=fs.readFileSync(process.argv[2]||'.build/riftbound-standalone/assets/page-F6OuavDb.js','utf8');
const css=fs.readFileSync(process.argv[3]||'.build/riftbound-standalone/assets/riftbound.css','utf8');
const need=(hay,text,label)=>{if(!hay.includes(text))throw new Error(`V16.5 missing ${label}`)};
need(js,'/* Riftbound Armory Virtualization V16.5 */','runtime marker');
need(js,'function RIFT_V165_VIRTUAL_CATALOG','virtual catalog component');
need(js,'Math.floor(el.scrollTop/70)*70','quantized scroll rendering');
need(js,'const overscan=280','bounded overscan');
need(js,'RIFT_V165_VIRTUAL_CATALOG_MEMO','memoized virtual catalog');
need(js,'onQuickBuy,onHover:null,onFavorite','catalog hover isolation');
need(js,'title:`${item.name} · ${item.price} Shards · ${RIFT_ITEM_STAT_TEXT(item)}`','native catalog tooltip');
need(js,'catalogScroll:v165CatalogMemory?.catalogScroll||0','BACK scroll snapshot');
need(js,'restoreToken:history.length','BACK scroll restore token');
need(css,'.v165-virtual-space','virtual canvas CSS');
need(css,'grid-template-columns:repeat(var(--v165-cols),minmax(0,1fr))!important','virtual row columns');
const begin=js.indexOf('/* Riftbound Armory Smoothness + Spiral Uncap V16.4 */');
const end=js.indexOf('function RIFT_V16_SCALE_FIGHTER',begin);
if(begin<0||end<0)throw new Error('could not isolate final V16 Armory');
const finalShop=js.slice(begin,end);
if(finalShop.includes('groups.map(group=>'))throw new Error('V16.5 regression: final Armory still mounts every rarity group/item at once');
if(finalShop.includes('onMouseEnter:event=>onHover?.(item.id,event)'))throw new Error('V16.5 regression: catalog hover still rerenders parent tooltip state');
if((js.match(/\/\* Riftbound Armory Virtualization V16\.5 \*\//g)||[]).length!==1)throw new Error('V16.5 marker must exist exactly once');

const sizes=[46,48,44,42,30];
const width=724,height=620,overscan=280,rowH=140,headerH=34;
const cols=Math.max(2,Math.min(8,Math.floor(Math.max(260,width-16)/120)));
let rows=[],top=0,id=0;
for(const count of sizes){rows.push({kind:'header',top,height:headerH,items:0});top+=headerH;for(let i=0;i<count;i+=cols){const n=Math.min(cols,count-i);rows.push({kind:'items',top,height:rowH,items:n});top+=rowH;id+=n}}
if(id!==210)throw new Error(`model expected 210 items, got ${id}`);
let worst=0;
for(let scroll=0;scroll<=Math.max(0,top-height);scroll+=70){const from=Math.max(0,scroll-overscan),to=scroll+height+overscan;const mounted=rows.filter(r=>r.top+r.height>=from&&r.top<=to).reduce((n,r)=>n+r.items,0);worst=Math.max(worst,mounted)}
if(worst>60)throw new Error(`virtual window mounts too many catalog tiles: ${worst}`);
console.log(`V16.5 Armory virtualization verified: 210-item catalog window mounts at most ${worst} tiles in the desktop model, hover fan-out removed, BACK memory preserved.`);
