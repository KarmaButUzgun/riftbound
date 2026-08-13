import fs from 'node:fs';
const js=fs.readFileSync(process.argv[2]||'.build/riftbound-standalone/assets/page-F6OuavDb.js','utf8');
const css=fs.readFileSync(process.argv[3]||'.build/riftbound-standalone/assets/riftbound.css','utf8');
function need(text,label){if(!js.includes(text))throw new Error(`V16.5 missing ${label}`)}
need('/* Riftbound Armory Virtualization V16.5 */','runtime marker');
need('function RIFT_V165_VIRTUAL_CATALOG','virtual catalog');
need('RIFT_V165_VIRTUAL_CATALOG_MEMO','memoized catalog');
need('catalogScroll:v165CatalogMemory?.catalogScroll||0','scroll memory');
need('restoreToken:history.length','scroll restore token');
if(!css.includes('.v165-virtual-space'))throw new Error('V16.5 missing virtual canvas CSS');
const v166=js.includes('/* Riftbound Armory Render Isolation V16.6 */');
const v168=js.includes('/* Riftbound Armory Portrait Restoration V16.8 */');
if(v166){
  need('const rowH=132,headerH=32,overscan=80','V16.6 row model');
  need('Math.floor(el.scrollTop/rowH)*rowH','V16.6 scroll quantization');
  need('RIFT_ITEM_TOOLTIP,{item:hoverItem,fighter,point:localHover}','V16.6 rich hover');
  if(v168){
    need('RIFT_V166_CATALOG_ICON','V16.8 catalog silhouette');
    need('function RIFT_ITEM_ICON','V16.8 authored portrait renderer');
  }else{
    need('RIFT_V166_CATALOG_ICON','V16.6 lightweight art');
  }
}else{
  need('Math.floor(el.scrollTop/70)*70','V16.5 scroll quantization');
  need('const overscan=280','V16.5 overscan');
}
const sizes=[46,48,44,42,30],width=724,height=620,rowH=v166?132:140,headerH=v166?32:34,overscan=v166?80:280,maxCols=v166?5:8,colWidth=v166?126:120,step=v166?132:70;
const cols=Math.max(2,Math.min(maxCols,Math.floor(Math.max(260,width-16)/colWidth)));
let rows=[],top=0,total=0;
for(const count of sizes){rows.push({top,height:headerH,items:0});top+=headerH;for(let i=0;i<count;i+=cols){const n=Math.min(cols,count-i);rows.push({top,height:rowH,items:n});top+=rowH;total+=n}}
if(total!==210)throw new Error(`expected 210 catalog items, got ${total}`);
let worst=0;
for(let scroll=0;scroll<=top;scroll+=step){const q=v166?Math.floor(scroll/rowH)*rowH:scroll,from=Math.max(0,q-overscan),to=q+height+overscan;let mounted=0;for(const row of rows)if(row.top+row.height>=from&&row.top<=to)mounted+=row.items;worst=Math.max(worst,mounted)}
const limit=v166?35:60;if(worst>limit)throw new Error(`virtual window mounted ${worst}, limit ${limit}`);
console.log(`V16.5 virtualization verified${v166?' with V16.6 isolation':''}${v168?' and catalog silhouettes':''}: max ${worst}/210 desktop tiles.`);
