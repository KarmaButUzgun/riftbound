from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('.build/riftbound-standalone')
p=root/'assets/page-F6OuavDb.js'
s=p.read_text()
old=''' const overscan=280,from=Math.max(0,metrics.top-overscan),to=metrics.top+metrics.height+overscan,visible=(0,r.useMemo)(()=>model.rows.filter(row=>row.top+row.height>=from&&row.top<=to),[model,from,to]);
 return (0,E.jsx)(`div`,{ref:scrollRef,className:`shop-catalog-scroll v165-virtual-scroll`,onScroll,children:(0,E.jsx)(`div`,{className:`v165-virtual-space`,style:{height:model.total},children:visible.map((row,index)=>row.kind===`header`?(0,E.jsxs)(`header`,{className:`v165-tier-header rarity-${row.tier.toLowerCase()}`,style:{top:row.top,height:row.height},children:[(0,E.jsx)(`strong`,{children:row.tier.toUpperCase()}),(0,E.jsxs)(`span`,{children:[row.count,` ITEM${row.count===1?``:`S`}`]})]},`${row.tier}-h`):(0,E.jsx)(`div`,{className:`catalog-icon-grid v165-virtual-row`,style:{top:row.top,height:row.height,"--v165-cols":cols},children:row.items.map(item=>(0,E.jsx)(RIFT_V16_CATALOG_TILE_MEMO,{item,fighter,selected:selectedId===item.id,recommended:recommended.has(item.id),favorite:favorites.has(item.id),onSelect,onQuickBuy,onHover:null,onFavorite,pulse:pulseId===item.id},item.id))},`${row.tier}-${row.top}-${index}`))})})});
}'''
new=''' const overscan=280,from=Math.max(0,metrics.top-overscan),to=metrics.top+metrics.height+overscan,visible=(0,r.useMemo)(()=>model.rows.filter(row=>row.top+row.height>=from&&row.top<=to),[model,from,to]);
 const rendered=visible.map((row,index)=>{if(row.kind===`header`)return (0,E.jsxs)(`header`,{className:`v165-tier-header rarity-${row.tier.toLowerCase()}`,style:{top:row.top,height:row.height},children:[(0,E.jsx)(`strong`,{children:row.tier.toUpperCase()}),(0,E.jsxs)(`span`,{children:[row.count,` ITEM${row.count===1?``:`S`}`]})]},`${row.tier}-h`);return (0,E.jsx)(`div`,{className:`catalog-icon-grid v165-virtual-row`,style:{top:row.top,height:row.height,"--v165-cols":cols},children:row.items.map(item=>(0,E.jsx)(RIFT_V16_CATALOG_TILE_MEMO,{item,fighter,selected:selectedId===item.id,recommended:recommended.has(item.id),favorite:favorites.has(item.id),onSelect,onQuickBuy,onHover:null,onFavorite,pulse:pulseId===item.id},item.id))},`${row.tier}-${row.top}-${index}`)});
 return (0,E.jsx)(`div`,{ref:scrollRef,className:`shop-catalog-scroll v165-virtual-scroll`,onScroll,children:(0,E.jsx)(`div`,{className:`v165-virtual-space`,style:{height:model.total},children:rendered})});
}'''
n=s.count(old)
if n==1:
    p.write_text(s.replace(old,new,1))
    print('Hardened V16.5 virtual catalog render syntax')
elif 'const rendered=visible.map((row,index)=>' in s:
    print('V16.5 virtual catalog render already hardened')
else:
    raise SystemExit(f'V16.5 syntax hardening anchor expected once, found {n}')
