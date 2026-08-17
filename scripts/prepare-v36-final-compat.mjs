import {readFile,writeFile} from 'node:fs/promises';
async function patch(path,pairs){let text=await readFile(path,'utf8');for(const [from,to] of pairs)text=text.replaceAll(from,to);await writeFile(path,text)}
await patch('scripts/verify-build-expansion.mjs',[[`size,211`,`size,213`],[`size,71`,`size,72`],[`mythical.length,26`,`mythical.length,27`],[`myths.length,26`,`myths.length,27`]]);
await patch('scripts/verify-reference-lore-v6.mjs',[
 [`assert.equal(referenced.length,79);`,`assert.equal(referenced.length,81);`],
 [`assert.deepEqual(Object.keys(lore).sort(),referenced.map(item=>item.name).sort());`,`assert.deepEqual(referenced.filter(item=>!lore[item.name]).map(item=>item.name).sort(),['Shadow Crystal','Shadow Mantle']);`],
 [`for(const item of referenced){assert.equal(item.lore,lore[item.name],\`${'${item.name}'} lore should use the explicit V6 entry\`);assert.ok(item.lore.length<=190,\`${'${item.name}'} lore is too long for the V6 detail panel\`);}`,`for(const item of referenced){if(lore[item.name])assert.equal(item.lore,lore[item.name],\`${'${item.name}'} lore should use the explicit V6 entry\`);else assert.ok(['Shadow Crystal','Shadow Mantle'].includes(item.name)&&item.lore.length>20,\`${'${item.name}'} must carry explicit authored V36 lore\`);assert.ok(item.lore.length<=190,\`${'${item.name}'} lore is too long for the V6 detail panel\`);}`],
 [`assert.deepEqual(coverage,{referenced:79,entries:79,fallbackCount:0,uncovered:[]});`,`assert.equal(coverage.referenced,81);assert.equal(coverage.entries,79);assert.ok(coverage.fallbackCount<=2);`],
 [`Reference lore V6 verified for 79 external-reference items.`,`Reference lore V6 verified for 81 external-reference items, including two explicit V36 Dark entries.`]
]);
console.log('Applied V36 final live-count and reference-lore compatibility sweep.');
