import fs from 'node:fs';
import path from 'node:path';
const root=process.argv[2]||'.build/riftbound-standalone';
const js=fs.readFileSync(path.join(root,'assets/page-F6OuavDb.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/riftbound.css'),'utf8');
const need=(text,needle,label)=>{if(!text.includes(needle))throw new Error(`Armory verification missing ${label}`)};
need(js,'/* Riftbound Armory Render Isolation V16.6 */','V16.6 runtime marker');
need(js,'/* Riftbound Armory Portrait Restoration V16.8 */','V16.8 portrait-split marker');
need(css,'/* Riftbound Armory Render Isolation V16.6 */','V16.6 style marker');
need(js,'function RIFT_V166_CATALOG_ICON','lightweight catalog silhouette renderer');
need(js,'children:[(0,E.jsx)(RIFT_V166_CATALOG_ICON,{item,pulse})','catalog-only silhouette path');
need(js,'function RIFT_ITEM_ICON','authored portrait renderer');
need(js,'[localHover,setLocalHover]=(0,r.useState)(null)','catalog-local hover state');
need(js,'RIFT_ITEM_TOOLTIP,{item:hoverItem,fighter,point:localHover}','rich authored hover card path');
need(js,'onHover:hoverAt','local hover event routing');
need(js,'initial=(0,r.useMemo)(()=>RIFT_V16_ARMORY_MEMORY(run,initialOwner,catalog),[run,initialOwner,catalog])','stable initial Armory memory');
need(js,'const v165CatalogMemory=(0,r.useMemo)(()=>RIFT_V16_ARMORY_MEMORY(run,shopOwner,catalog),[run,shopOwner,catalog])','stable virtual-catalog memory');
need(js,'const RIFT_V164_CATALOG=RIFT_ITEM_CATALOG.slice();','restored cached catalog dependency');
need(js,'const RIFT_V164_CATEGORY_COUNTS=Object.fromEntries(','restored category-count dependency');
need(js,'const RIFT_V164_ITEM_DETAIL_MEMO=(0,r.memo)(RIFT_V16_ITEM_DETAIL','restored detail-memo dependency');
need(js,'const rowH=132,headerH=32,overscan=80','tighter virtual window');
need(js,'Math.min(5,Math.floor(Math.max(260,metrics.width-16)/126))','five-column mount cap');
need(css,'.v16-armory .v166-catalog-icon','catalog silhouette CSS');
need(css,'.v16-armory .item-hover-tooltip-v2{backdrop-filter:none!important','tooltip compositor isolation');
if(js.includes('children:[(0,E.jsx)(RIFT_ITEM_ICON,{item,size:`small`,pulse}),(0,E.jsx)(`strong`,{children:item.name})'))throw new Error('catalog grid regressed to full authored portraits');
if(js.includes('title:`${item.name} · ${item.price} Shards · ${RIFT_ITEM_STAT_TEXT(item)}`'))throw new Error('Armory still uses V16.5 native-title catalog fallback');
const authoredUses=(js.match(/RIFT_ITEM_ICON/g)||[]).length;
if(authoredUses<2)throw new Error(`authored portrait renderer appears only ${authoredUses} time(s); expected it to remain available outside catalog`);
const shopAt=js.indexOf('RIFT_ITEM_SHOP=function RIFT_V16_ITEM_SHOP');
for(const name of ['RIFT_V164_CATALOG','RIFT_V164_CATEGORY_COUNTS','RIFT_V164_ITEM_DETAIL_MEMO']){const defAt=js.indexOf(`const ${name}=`);if(defAt<0||shopAt<0||defAt>shopAt)throw new Error(`Armory dependency ${name} is not defined before shop render`)}
const groupSizes=[42,42,42,42,42],cols=5,rowH=132,headerH=32,overscan=80,viewport=620;
let rows=[],top=0;
for(const count of groupSizes){rows.push({kind:'header',top,height:headerH,count:0});top+=headerH;for(let i=0;i<count;i+=cols){rows.push({kind:'items',top,height:rowH,count:Math.min(cols,count-i)});top+=rowH}}
let maxMounted=0;
for(let scroll=0;scroll<=top;scroll+=10){const quantized=Math.floor(scroll/rowH)*rowH,from=Math.max(0,quantized-overscan),to=quantized+viewport+overscan;const mounted=rows.filter(row=>row.kind==='items'&&row.top+row.height>=from&&row.top<=to).reduce((n,row)=>n+row.count,0);maxMounted=Math.max(maxMounted,mounted)}
if(maxMounted>35)throw new Error(`Armory desktop virtual window mounted ${maxMounted} items, expected <=35`);
console.log(`Armory verified: catalog-only silhouettes, authored portraits preserved elsewhere, rich hover intact, stable memo inputs, max ${maxMounted}/210 desktop tiles mounted.`);
