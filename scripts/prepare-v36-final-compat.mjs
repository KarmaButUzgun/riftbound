import {readFile,writeFile} from 'node:fs/promises';
async function patch(path,pairs){let text=await readFile(path,'utf8');for(const [from,to] of pairs)text=text.replaceAll(from,to);await writeFile(path,text)}
await patch('scripts/verify-build-expansion.mjs',[[`size,211`,`size,213`],[`size,71`,`size,72`],[`mythical.length,26`,`mythical.length,27`],[`myths.length,26`,`myths.length,27`]]);
{
 const path='scripts/verify-reference-lore-v6.mjs';
 let text=await readFile(path,'utf8');
 const pattern=/const referenced=items\.filter[\s\S]*?const runtimeGlobals=/;
 const replacement=`const referenced=items.filter(item=>item.reference&&item.reference!=='Original');\nassert.equal(referenced.length,81);\nassert.equal(Object.keys(lore).length,79);\nconst historical=referenced.filter(item=>lore[item.name]);\nassert.equal(historical.length,79);\nassert.deepEqual(historical.map(item=>item.name).sort(),Object.keys(lore).sort());\nfor(const item of historical){assert.equal(item.lore,lore[item.name],\`${'${item.name}'} lore should use the explicit V6 entry\`);assert.ok(item.lore.length<=190,\`${'${item.name}'} lore is too long for the V6 detail panel\`);}\nconst explicit=referenced.filter(item=>!lore[item.name]);\nassert.deepEqual(explicit.map(item=>item.name).sort(),['Shadow Crystal','Shadow Mantle']);\nfor(const item of explicit)assert.ok(item.lore&&item.lore.length>20&&item.lore.length<=190,\`${'${item.name}'} must carry concise authored V36 lore\`);\nconst refs=referenced.map(item=>item.reference).join(' · ');\nfor(const item of referenced){assert.ok(item.reference&&item.reference!=='Original',\`${'${item.name}'} should carry explicit reference metadata\`);assert.ok(item.reference.length<=72,\`${'${item.name}'} reference label is too long\`);}\nconst coverage=test.RIFT_REFERENCE_LORE_V6_COVERAGE();\nassert.equal(coverage.referenced,81);assert.equal(coverage.entries,79);\nconst runtimeGlobals=`;
 if(!pattern.test(text))throw new Error('V36 V6 coverage block anchor changed');
 text=text.replace(pattern,replacement).replaceAll('Reference lore V6 verified for 79 external-reference items.','Reference lore V6 verified for 81 external-reference items, including two explicit V36 Dark entries.');
 await writeFile(path,text);
}
console.log('Applied V36 final live-count and reference-lore compatibility sweep.');
