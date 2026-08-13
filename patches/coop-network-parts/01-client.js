const API = '/api';
const STORAGE_KEY = 'riftbound-coop-session-v1';

const state = {
  enabled: false, connected: false, room: null, playerId: null, token: null, role: null,
  eventSource: null, run: null, bridge: null, snapshotTimer: null, heartbeatTimer: null,
  lastSnapshotHash: '', lastSnapshotRevision: 0, remoteSnapshot: null, lastEventRevision: 0,
  intentSequence: 0, lastIntentResult: null, bridgeContext: null,
};

function authHeaders() { return { 'content-type': 'application/json', 'x-rift-player': state.playerId || '', 'x-rift-token': state.token || '' }; }
function saveSession() {
  if (!state.room || !state.playerId || !state.token) return localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ roomId: state.room.id, playerId: state.playerId, token: state.token, role: state.role, intentSequence: state.intentSequence }));
}
function loadSession() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } }
function clearSession() { localStorage.removeItem(STORAGE_KEY); state.room = null; state.playerId = null; state.token = null; state.role = null; }
async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}
function cloneSafe(value) {
  const seen = new WeakSet();
  return JSON.parse(JSON.stringify(value, (key, item) => {
    if (typeof item === 'function') return undefined;
    if (item && typeof item === 'object') { if (seen.has(item)) return undefined; seen.add(item); }
    return item;
  }));
}
function compactFighter(fighter) {
  if (!fighter) return null;
  return {
    name: fighter.name, hp: fighter.hp, maxHp: fighter.maxHp, energy: fighter.energy, maxEnergy: fighter.maxEnergy,
    ultimate: fighter.ultimate, race: fighter.race?.name, trait: fighter.trait?.name, power: fighter.power?.name,
    tiers: fighter.tiers, statuses: fighter.statuses, inventory: fighter.inventory, itemCooldowns: fighter.itemCooldowns,
    sparda: fighter.sparda, position: fighter.position,
  };
}
function snapshotRun(run) {
  if (!run) return null;
  const aux = (run.auxiliaryCombatants || []).map(entry => ({ id: entry.id, team: entry.team, role: entry.role, fighter: compactFighter(entry.fighter) }));
  let coop = null;
  try { coop = state.bridge?.snapshotExtras?.(run, state.bridgeContext) || null; } catch {}
  return cloneSafe({
    phase: run.phase, floor: run.floor, turn: run.turn, round: run.round, shards: run.shards,
    player: compactFighter(run.player), enemy: compactFighter(run.enemy), auxiliaryCombatants: aux,
    battlefield: run.battlefield, encounter: run.encounter, revealed: run.revealed, history: (run.history || []).slice(-80),
    coop,
  });
}
function hashSnapshot(value) { const text = JSON.stringify(value); let h = 2166136261; for (let i=0;i<text.length;i++){ h ^= text.charCodeAt(i); h = Math.imul(h,16777619); } return `${text.length}:${h>>>0}`; }

function ensureUi() {
  if (document.getElementById('rift-coop-root')) return;
  const root = document.createElement('div'); root.id = 'rift-coop-root';
  root.innerHTML = `
    <button id="rift-coop-toggle" type="button">CO-OP</button>
    <section id="rift-coop-panel" hidden>
      <header><span><small>RIFTBOUND</small><strong>LAN CO-OP</strong></span><button id="rift-coop-close" type="button">×</button></header>
      <div id="rift-coop-offline">
        <label>PLAYER NAME<input id="rift-coop-name" maxlength="28" placeholder="Hunter"></label>
        <div class="rift-coop-row"><button id="rift-coop-host" type="button">HOST RUN</button><button id="rift-coop-join-open" type="button">JOIN RUN</button></div>
        <div id="rift-coop-join-box" hidden><label>ROOM CODE<input id="rift-coop-code" maxlength="6" placeholder="ABC123"></label><button id="rift-coop-join" type="button">CONNECT</button></div>
      </div>
      <div id="rift-coop-online" hidden>
        <div class="rift-coop-room"><small>ROOM</small><strong id="rift-coop-room-code">------</strong><button id="rift-coop-copy" type="button">COPY LAN LINK</button></div>
        <div id="rift-coop-players"></div>
        <div class="rift-coop-row"><button id="rift-coop-ready" type="button">READY</button><button id="rift-coop-leave" type="button">LEAVE</button></div>
        <div id="rift-coop-run"><small>AUTHORITATIVE RUN</small><strong id="rift-coop-run-title">WAITING FOR HOST STATE</strong><span id="rift-coop-run-detail">The host owns reality.</span></div>
        <section id="rift-coop-ally"><small>PLAYER 2 · ALLY COMMAND</small><strong>WAITING FOR COMBAT LINK</strong><span>Ready both players to manifest the co-op ally.</span></section>
      </div>
      <footer id="rift-coop-status">LAN SERVER DETECTED</footer>
    </section>`;
  document.body.appendChild(root);
  const $ = id => document.getElementById(id);
  $('rift-coop-toggle').onclick = () => $('rift-coop-panel').hidden = !$('rift-coop-panel').hidden;
  $('rift-coop-close').onclick = () => $('rift-coop-panel').hidden = true;
  $('rift-coop-join-open').onclick = () => $('rift-coop-join-box').hidden = !$('rift-coop-join-box').hidden;
  $('rift-coop-host').onclick = () => hostRoom($('rift-coop-name').value);
  $('rift-coop-join').onclick = () => joinRoom($('rift-coop-code').value, $('rift-coop-name').value);
  $('rift-coop-ready').onclick = () => setReady(!currentPlayer()?.ready);
  $('rift-coop-leave').onclick = leaveRoom;
  $('rift-coop-copy').onclick = async () => { try { await navigator.clipboard.writeText(location.href); setStatus('LAN link copied.'); } catch { setStatus('Copy failed — send your LAN URL manually.'); } };
  root.addEventListener('click', event => {
    const action = event.target.closest('[data-coop-action]');
    if (action) { requestPartnerAction(action.dataset.coopAction, action.dataset.coopTarget || null); return; }
    const move = event.target.closest('[data-coop-move]');
    if (move) requestPartnerMove(move.dataset.coopMove);
  });
}
function $(id) { return document.getElementById(id); }
function setStatus(message, danger = false) { const el = $('rift-coop-status'); if (el) { el.textContent = message; el.classList.toggle('danger', danger); } }
function currentPlayer() { return state.room?.players?.find(p => p.id === state.playerId) || null; }
function renderAllyController(snapshot) {
  const root = $('rift-coop-ally'); if (!root) return;
  const coop = snapshot?.coop;
  if (!state.room?.started) { root.innerHTML = '<small>PLAYER 2 · ALLY COMMAND</small><strong>ROOM PAUSED</strong><span>Both players must be connected and ready.</span>'; return; }
  if (!coop?.ally) { root.innerHTML = '<small>PLAYER 2 · ALLY COMMAND</small><strong>ALLY MATERIALIZING</strong><span>The host is creating the authoritative fighter.</span>'; return; }
  const ally = coop.ally, result = state.lastIntentResult;
  const header = `<div class="rift-coop-ally-head"><span><small>${state.role === 'partner' ? 'YOU CONTROL' : 'PARTNER CONTROLS'}</small><strong>${escapeHtml(ally.name)}</strong><em>${Math.max(0,Math.round(ally.hp))}/${Math.max(1,Math.round(ally.maxHp))} HP · ${Math.round(ally.energy)}/${Math.round(ally.maxEnergy)} ENERGY</em></span><b>${coop.canAct ? 'READY' : 'SPENT'}</b></div>`;
  const actions = (coop.actions || []).map(action => `<button type="button" data-coop-action="${escapeHtml(action.id)}" data-coop-target="${escapeHtml(action.targetId || '')}" ${state.role !== 'partner' || action.disabled ? 'disabled' : ''}><b>${escapeHtml(action.slot)}</b><span><strong>${escapeHtml(action.name)}</strong><small>${action.cost} ENERGY${action.reason ? ` · ${escapeHtml(action.reason)}` : ''}</small></span></button>`).join('');
  const movement = `<div class="rift-coop-move"><button type="button" data-coop-move="up" ${state.role !== 'partner' || !coop.canMove ? 'disabled' : ''}>↑</button><button type="button" data-coop-move="left" ${state.role !== 'partner' || !coop.canMove ? 'disabled' : ''}>←</button><button type="button" data-coop-move="down" ${state.role !== 'partner' || !coop.canMove ? 'disabled' : ''}>↓</button><button type="button" data-coop-move="right" ${state.role !== 'partner' || !coop.canMove ? 'disabled' : ''}>→</button><span>${Number(coop.movement || 0).toFixed(1)} MP</span></div>`;
  root.innerHTML = `${header}<div class="rift-coop-actions">${actions || '<span>No legal actions available.</span>'}</div>${movement}${result ? `<footer class="${result.ok ? 'ok' : 'bad'}">${escapeHtml(result.message)}</footer>` : ''}`;
}
function render() {
  ensureUi(); const online = !!state.room && !!state.playerId;
  $('rift-coop-offline').hidden = online; $('rift-coop-online').hidden = !online;
  $('rift-coop-toggle').classList.toggle('connected', online); $('rift-coop-toggle').textContent = online ? `CO-OP · ${state.room.id}` : 'CO-OP';
  if (!online) return;
  $('rift-coop-room-code').textContent = state.room.id;
  $('rift-coop-players').innerHTML = (state.room.players || []).map(p => `<article class="${p.connected?'online':'offline'} ${p.ready?'ready':''}"><b>${p.slot === 1 ? 'P1' : 'P2'}</b><span><strong>${escapeHtml(p.name)}</strong><small>${p.host?'HOST':'PARTNER'} · ${p.connected?'CONNECTED':'OFFLINE'}</small></span><em>${p.ready?'READY':'NOT READY'}</em></article>`).join('') || '<article><span>Waiting for partner...</span></article>';
  const me = currentPlayer(); $('rift-coop-ready').textContent = me?.ready ? 'UNREADY' : 'READY';
  const snap = state.role === 'host' ? snapshotRun(state.run) : state.remoteSnapshot?.state;
  if (snap) { $('rift-coop-run-title').textContent = `${snap.phase || 'RUN'} · FLOOR ${snap.floor ?? '?'} · TURN ${snap.turn ?? '?'}`.toUpperCase(); $('rift-coop-run-detail').textContent = `${snap.player?.name || 'P1'} · ${snap.player?.power || 'Unknown'}${snap.enemy ? `  VS  ${snap.enemy.name || 'Enemy'} · ${snap.enemy.power || 'Unknown'}` : ''}`; }
  else { $('rift-coop-run-title').textContent = state.room.started ? 'RUN LINK ACTIVE' : 'WAITING FOR BOTH PLAYERS'; $('rift-coop-run-detail').textContent = state.role === 'host' ? 'Start or continue Riftbound; snapshots publish automatically.' : 'Waiting for the host to expose the live run.'; }
  renderAllyController(snap);
}
function escapeHtml(text) { return String(text ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

async function hostRoom(name) {
  try { const data = await request('/rooms', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ name }) }); connectSession(data); setStatus('Room created. Send your friend the LAN link + room code.'); }
  catch (e) { setStatus(e.message, true); }
}
async function joinRoom(code, name) {
  code = String(code || '').trim().toUpperCase(); if (!code) return setStatus('Enter a room code.', true);
  try { const data = await request(`/rooms/${encodeURIComponent(code)}/join`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ name }) }); connectSession(data); setStatus('Joined. Ready up when your build is prepared.'); }
  catch (e) { setStatus(e.message, true); }
}
function connectSession(data) {
  state.room = data.room; state.playerId = data.playerId; state.token = data.token; state.role = data.role; state.connected = true; saveSession(); openEvents(); startHeartbeat(); startSnapshotPublisher(); render();
}
async function setReady(ready) {
  try { const data = await request(`/rooms/${state.room.id}/ready`, { method:'POST', headers:authHeaders(), body:JSON.stringify({ready}) }); state.room = data.room; render(); }
  catch(e){ setStatus(e.message,true); }
}
async function leaveRoom() {
  try { if (state.room) await request(`/rooms/${state.room.id}/leave`, {method:'POST',headers:authHeaders(),body:'{}'}); } catch {}
  stopNetworking(); clearSession(); render(); setStatus('Left room.');
}
function stopNetworking() { state.eventSource?.close(); state.eventSource = null; clearInterval(state.heartbeatTimer); clearInterval(state.snapshotTimer); state.heartbeatTimer = null; state.snapshotTimer = null; state.connected = false; }
function startHeartbeat() { clearInterval(state.heartbeatTimer); state.heartbeatTimer = setInterval(async()=>{ if(!state.room)return; try { const data=await request(`/rooms/${state.room.id}/heartbeat`,{method:'POST',headers:authHeaders(),body:'{}'}); state.room=data.room; render(); } catch(e){ setStatus(`Connection: ${e.message}`,true); } },5000); }
function startSnapshotPublisher() {
  clearInterval(state.snapshotTimer); if (state.role !== 'host') return;
  state.snapshotTimer = setInterval(async()=>{ if(!state.room || !state.run)return; const snap=snapshotRun(state.run); if(!snap)return; const hash=hashSnapshot(snap); if(hash===state.lastSnapshotHash)return; state.lastSnapshotHash=hash; try{ await request(`/rooms/${state.room.id}/snapshot`,{method:'POST',headers:authHeaders(),body:JSON.stringify({state:snap,phase:snap.phase,turn:snap.turn})}); }catch(e){ setStatus(`Snapshot failed: ${e.message}`,true); } },350);
}
function openEvents() {
  state.eventSource?.close(); if (!state.room) return;
  const url = `${API}/rooms/${encodeURIComponent(state.room.id)}/events?playerId=${encodeURIComponent(state.playerId)}&token=${encodeURIComponent(state.token)}&since=${state.lastEventRevision}`;
  const es = new EventSource(url); state.eventSource = es;
  es.addEventListener('hello', e => { try { const data=JSON.parse(e.data); state.room=data.room; render(); } catch {} });
  const handle = async e => {
    try { const event=JSON.parse(e.data); state.lastEventRevision=Math.max(state.lastEventRevision,event.revision||0);
      if (['player-joined','player-left','ready-changed','room-started','room-paused','room-created'].includes(event.type)) await refreshState();
      if (event.type === 'snapshot' && state.role !== 'host') await refreshState();
      if (event.type === 'intent' && state.role === 'host') await handleIntent(event.payload);
      if (event.type === 'intent-result') { state.lastIntentResult=event.payload; render(); }
    } catch {}
  };
  for (const type of ['player-joined','player-left','ready-changed','room-started','room-paused','room-created','snapshot','intent','intent-result']) es.addEventListener(type,handle);
  es.onopen=()=>setStatus('LAN sync online.'); es.onerror=()=>setStatus('LAN sync reconnecting…',true);
}
async function refreshState() { if(!state.room)return; try { const data=await request(`/rooms/${state.room.id}/state`,{headers:authHeaders()}); state.room=data.room; state.remoteSnapshot=data.snapshot; state.lastSnapshotRevision=data.snapshotRevision||0; render(); } catch(e){ setStatus(e.message,true); } }
async function sendIntent(type,payload={}) {
  if(!state.room)throw new Error('Not in a co-op room');
  const sequence=++state.intentSequence;saveSession();
  return request(`/rooms/${state.room.id}/intent`,{method:'POST',headers:authHeaders(),body:JSON.stringify({type,payload,sequence})});
}
async function handleIntent(intent) {
  if (!intent || intent.playerId === state.playerId) return;
  let result;
  if (state.bridge?.applyIntent) {
    try { result = await state.bridge.applyIntent(intent, state.run, state.bridgeContext); }
    catch (e) { result = {ok:false,message:e.message}; setStatus(`Game bridge rejected input: ${e.message}`,true); }
  } else {
    window.dispatchEvent(new CustomEvent('riftbound:coop-intent',{detail:intent}));
    result = {ok:false,message:'Game bridge is not ready'};
  }
  try { await request(`/rooms/${state.room.id}/intent-result`,{method:'POST',headers:authHeaders(),body:JSON.stringify({intentId:intent.id,ok:result?.ok===true,message:result?.message})}); } catch {}
}
async function requestPartnerAction(actionId,targetId=null) { try { await coopApi.requestAction(actionId,targetId); setStatus('Ally command sent to the host.'); } catch(e) { setStatus(e.message,true); } }
async function requestPartnerMove(direction) {
  const snap=state.remoteSnapshot?.state,position=snap?.coop?.position;if(!position)return setStatus('Ally position is unavailable.',true);
  const delta={up:[0,-7],down:[0,7],left:[-7,0],right:[7,0]}[direction];if(!delta)return;
  try { await coopApi.requestMove('coop-ally',{x:position.x+delta[0],y:position.y+delta[1]});setStatus('Ally movement sent to the host.'); } catch(e) { setStatus(e.message,true); }
}

async function resumeSession() {
  const saved=loadSession(); if(!saved)return;
  state.room={id:saved.roomId};state.playerId=saved.playerId;state.token=saved.token;state.role=saved.role;state.intentSequence=Number(saved.intentSequence||0);
  try { const data=await request(`/rooms/${saved.roomId}/state`,{headers:authHeaders()}); state.room=data.room;state.remoteSnapshot=data.snapshot;state.connected=true;openEvents();startHeartbeat();startSnapshotPublisher();render();setStatus('Co-op session restored.'); }
  catch { clearSession(); render(); }
}

const coopApi = {
  get state(){ return state; },
  exposeRun(run, context={}) { state.run=run; state.bridgeContext=context; if (state.role==='host') render(); },
  registerGameBridge(bridge) { state.bridge=bridge||null; },
  sendIntent,
  requestAction(actionId,targetId=null,aim=null){ return sendIntent('action',{actionId,targetId,aim}); },
  requestMove(actorId,position){ return sendIntent('move',{actorId,position}); },
  snapshotRun,
};
window.RIFT_COOP = coopApi;
window.RIFT_COOP_EXPOSE_RUN = (run,onAction,selectedActionId,busy,commit) => coopApi.exposeRun(run,{onAction,selectedActionId,busy,commit,actions:()=>{try{return typeof La==='function'?La(run.player):[]}catch{return[]}}});

(async function boot(){
  try { const health=await request('/health'); if(!health?.ok)return; state.enabled=true; ensureUi(); render(); await resumeSession(); }
  catch { /* GitHub Pages / ordinary single-player: no local co-op server, no overlay. */ }
})();
