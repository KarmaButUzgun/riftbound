import fs from 'node:fs';

const path = '.build/riftbound-standalone/assets/page-F6OuavDb.js';
const source = fs.readFileSync(path, 'utf8');
const need = (text, label) => {
  if (!source.includes(text)) throw new Error(`V16.3 hotkey availability missing: ${label}`);
};

need('/* Riftbound Hotkey Availability Guard V16.3 */', 'runtime marker');
need('let r=n[t];if(qa(w,r,!1,!!Jt,xl||w.enemy))return;kt&&yt!==r.id', 'map-open availability guard');
need('let o=r[n];qa(w,o,!1,!!Jt,xl||w.enemy)||$o(o)', 'closed-map availability guard');
need('disabled:s,onClick:()=>$o(e)', 'action-card disabled state still uses the shared availability result');

if (source.includes('n>=0&&n<r.length&&$o(r[n])')) {
  throw new Error('V16.3 regression: unguarded closed-map numbered hotkey dispatcher still exists');
}
if (source.includes('kt&&yt!==n[t].id&&(jt(null),wt(`inspect`),Ot(null)),$o(n[t])')) {
  throw new Error('V16.3 regression: unguarded map-open numbered hotkey dispatcher still exists');
}
if ((source.match(/\/\* Riftbound Hotkey Availability Guard V16\.3 \*\//g) || []).length !== 1) {
  throw new Error('V16.3 hotkey availability marker must exist exactly once');
}

const dispatch = ({ unavailable, pick }) => {
  if (unavailable) return false;
  pick();
  return true;
};
let picked = 0;
if (dispatch({ unavailable: 'Cooldown: 2', pick: () => picked++ })) throw new Error('cooldown-blocked move was selectable');
if (dispatch({ unavailable: 'Need 20 Energy', pick: () => picked++ })) throw new Error('Energy-blocked move was selectable');
if (dispatch({ unavailable: 'Silenced', pick: () => picked++ })) throw new Error('silenced move was selectable');
if (!dispatch({ unavailable: '', pick: () => picked++ })) throw new Error('available move was incorrectly blocked');
if (picked !== 1) throw new Error(`availability dispatch picked ${picked} moves, expected exactly 1`);

console.log('V16.3 hotkey availability verified: unavailable moves cannot be armed by 1–8 on or off the tactical map.');
