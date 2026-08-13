import fs from 'node:fs';

const path = '.build/riftbound-standalone/assets/page-F6OuavDb.js';
const source = fs.readFileSync(path, 'utf8');
const need = (text, label) => {
  if (!source.includes(text)) throw new Error(`V16.1 map hotkeys missing: ${label}`);
};

need('/* Riftbound Map Combat Hotkeys V16.1 */', 'runtime marker');
need('if(xt){if(e.key===`Escape`){e.preventDefault(),St(!1),Ot(null);return}if(he===`run`&&w?.phase===`combat`&&!et&&!Ut){let t=Number(e.key)-1,n=La(w.player);if(t>=0&&t<n.length){e.preventDefault(),kt&&yt!==n[t].id&&(jt(null),wt(`inspect`),Ot(null)),$o(n[t]);return}}return}', 'map-open 1–8 dispatcher');
need('1–8 MOVES · ESC CLOSES MAP · MOVEMENT DOES NOT SPEND YOUR ACTION', 'discoverability footer');
need('let n=Number(e.key)-1,r=La(w.player);n>=0&&n<r.length&&$o(r[n])', 'original closed-map hotkey dispatcher');
if (source.includes('if(xt){e.key===`Escape`&&(St(!1),Ot(null));return}')) {
  throw new Error('V16.1 map hotkeys regression: old map-open swallow branch still exists');
}
if ((source.match(/\/\* Riftbound Map Combat Hotkeys V16\.1 \*\//g) || []).length !== 1) {
  throw new Error('V16.1 map hotkeys marker must exist exactly once');
}
console.log('V16.1 map hotkeys verified: 1–8 reuse the normal action picker while tactical map is open, stale aim clears on slot changes, Escape still closes the map, and the footer advertises the controls.');
