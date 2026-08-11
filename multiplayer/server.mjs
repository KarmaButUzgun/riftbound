import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { networkInterfaces } from 'node:os';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SITE_DIR = resolve(process.env.RIFTBOUND_SITE_DIR || join(ROOT, '_site'));
const PORT = Number(process.env.PORT || process.env.RIFTBOUND_COOP_PORT || 3000);
const HOST = process.env.RIFTBOUND_COOP_HOST || '0.0.0.0';
const MAX_BODY = 2 * 1024 * 1024;
const ROOM_TTL = 1000 * 60 * 60 * 8;
const rooms = new Map();

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2'
};

function id(bytes = 9) { return randomBytes(bytes).toString('base64url'); }
function roomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i += 1) out += alphabet[randomBytes(1)[0] % alphabet.length];
  return out;
}
function cleanName(value, fallback = 'Hunter') {
  const name = String(value || '').replace(/[<>\r\n]/g, '').trim().slice(0, 28);
  return name || fallback;
}
function publicPlayer(p) { return { id: p.id, name: p.name, slot: p.slot, ready: !!p.ready, connected: !!p.connected, host: !!p.host, lastSeen: p.lastSeen }; }
function publicRoom(room) {
  return {
    id: room.id,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    started: !!room.started,
    revision: room.revision,
    players: [...room.players.values()].sort((a,b)=>a.slot-b.slot).map(publicPlayer),
    snapshotRevision: room.snapshotRevision,
    hasSnapshot: !!room.snapshot,
  };
}
function touch(room) { room.updatedAt = Date.now(); }
function emit(room, type, payload = {}) {
  room.revision += 1; touch(room);
  const event = { revision: room.revision, type, at: Date.now(), payload };
  room.events.push(event); if (room.events.length > 120) room.events.splice(0, room.events.length - 120);
  const frame = `id: ${event.revision}\nevent: ${type}\ndata: ${JSON.stringify(event)}\n\n`;
  for (const client of room.sse.values()) {
    try { client.write(frame); } catch {}
  }
  return event;
}
function json(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(data), 'cache-control': 'no-store' });
  res.end(data);
}
function bad(res, status, message) { json(res, status, { ok: false, error: message }); }
async function readJson(req) {
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > MAX_BODY) throw new Error('Request body too large'); chunks.push(chunk); }
  if (!chunks.length) return {};
  const text = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(text);
}
function auth(room, playerId, token) {
  const p = room?.players.get(String(playerId || ''));
  return p && p.token === token ? p : null;
}
function findLanIp() {
  for (const group of Object.values(networkInterfaces())) for (const item of group || []) {
    if (item.family === 'IPv4' && !item.internal) return item.address;
  }
  return '127.0.0.1';
}
function createRoom(name) {
  let code; do { code = roomCode(); } while (rooms.has(code));
  const token = id(18), playerId = id(8), now = Date.now();
  const room = { id: code, createdAt: now, updatedAt: now, revision: 0, snapshotRevision: 0, snapshot: null, started: false, players: new Map(), sse: new Map(), events: [], intents: [] };
  room.players.set(playerId, { id: playerId, token, name: cleanName(name, 'Host'), slot: 1, ready: false, connected: true, host: true, lastSeen: now });
  rooms.set(code, room); emit(room, 'room-created', publicRoom(room));
  return { room, playerId, token };
}
function joinRoom(room, name) {
  if ([...room.players.values()].filter(p=>p.connected).length >= 2) throw new Error('Room is full');
  const reusable = [...room.players.values()].find(p=>!p.connected && !p.host);
  const playerId = reusable?.id || id(8), token = id(18), now = Date.now();
  const player = { id: playerId, token, name: cleanName(name, 'Partner'), slot: 2, ready: false, connected: true, host: false, lastSeen: now };
  room.players.set(playerId, player); emit(room, 'player-joined', { player: publicPlayer(player), room: publicRoom(room) });
  return { playerId, token };
}
function maybeStart(room) {
  const active = [...room.players.values()].filter(p=>p.connected);
  const ready = active.length === 2 && active.every(p=>p.ready);
  if (ready && !room.started) { room.started = true; emit(room, 'room-started', publicRoom(room)); }
  if (!ready && room.started) { room.started = false; emit(room, 'room-paused', publicRoom(room)); }
}

setInterval(() => {
  const cutoff = Date.now() - ROOM_TTL;
  for (const [code, room] of rooms) if (room.updatedAt < cutoff) {
    for (const res of room.sse.values()) { try { res.end(); } catch {} }
    rooms.delete(code);
  }
}, 60_000).unref();

async function api(req, res, url) {
  const parts = url.pathname.split('/').filter(Boolean);
  if (url.pathname === '/api/health' && req.method === 'GET') return json(res, 200, { ok: true, service: 'riftbound-coop', version: 1, transport: 'sse', maxPlayers: 2 });
  if (url.pathname === '/api/rooms' && req.method === 'POST') {
    const body = await readJson(req), created = createRoom(body.name);
    return json(res, 201, { ok: true, room: publicRoom(created.room), playerId: created.playerId, token: created.token, role: 'host' });
  }
  if (parts[0] !== 'api' || parts[1] !== 'rooms' || !parts[2]) return false;
  const code = String(parts[2]).toUpperCase(), room = rooms.get(code);
  if (!room) return bad(res, 404, 'Room not found or expired');
  if (parts[3] === 'join' && req.method === 'POST') {
    try { const joined = joinRoom(room, (await readJson(req)).name); return json(res, 200, { ok: true, room: publicRoom(room), ...joined, role: 'partner' }); }
    catch (error) { return bad(res, 409, error.message); }
  }
  const playerId = req.headers['x-rift-player'] || url.searchParams.get('playerId');
  const token = req.headers['x-rift-token'] || url.searchParams.get('token');
  const player = auth(room, playerId, token);
  if (!player) return bad(res, 401, 'Invalid room credentials');
  player.lastSeen = Date.now(); player.connected = true; touch(room);

  if (parts[3] === 'state' && req.method === 'GET') return json(res, 200, { ok: true, room: publicRoom(room), snapshot: room.snapshot, snapshotRevision: room.snapshotRevision });
  if (parts[3] === 'ready' && req.method === 'POST') {
    const body = await readJson(req); player.ready = body.ready !== false; emit(room, 'ready-changed', { player: publicPlayer(player), room: publicRoom(room) }); maybeStart(room); return json(res, 200, { ok: true, room: publicRoom(room) });
  }
  if (parts[3] === 'heartbeat' && req.method === 'POST') return json(res, 200, { ok: true, room: publicRoom(room) });
  if (parts[3] === 'leave' && req.method === 'POST') {
    player.connected = false; player.ready = false; for (const [key, stream] of room.sse) if (key.startsWith(`${player.id}:`)) { try { stream.end(); } catch {} room.sse.delete(key); }
    emit(room, 'player-left', { player: publicPlayer(player), room: publicRoom(room) }); maybeStart(room); return json(res, 200, { ok: true });
  }
  if (parts[3] === 'snapshot' && req.method === 'POST') {
    if (!player.host) return bad(res, 403, 'Only the host can publish authoritative run state');
    const body = await readJson(req); room.snapshotRevision += 1; room.snapshot = { revision: room.snapshotRevision, at: Date.now(), state: body.state ?? null, phase: body.phase ?? null, turn: body.turn ?? null };
    emit(room, 'snapshot', { snapshotRevision: room.snapshotRevision, phase: room.snapshot.phase, turn: room.snapshot.turn });
    return json(res, 200, { ok: true, snapshotRevision: room.snapshotRevision });
  }
  if (parts[3] === 'intent' && req.method === 'POST') {
    const body = await readJson(req); const intent = { id: id(7), playerId: player.id, slot: player.slot, at: Date.now(), type: String(body.type || 'input').slice(0,40), payload: body.payload ?? null };
    room.intents.push(intent); if (room.intents.length > 80) room.intents.shift(); emit(room, 'intent', intent); return json(res, 202, { ok: true, intentId: intent.id });
  }
  if (parts[3] === 'events' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store', connection: 'keep-alive', 'x-accel-buffering': 'no' });
    res.write(`retry: 1200\nevent: hello\ndata: ${JSON.stringify({ room: publicRoom(room), player: publicPlayer(player) })}\n\n`);
    const key = `${player.id}:${id(4)}`; room.sse.set(key, res); const last = Number(req.headers['last-event-id'] || url.searchParams.get('since') || 0);
    for (const event of room.events.filter(e=>e.revision>last)) res.write(`id: ${event.revision}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
    const ping = setInterval(()=>{ try { res.write(`: ping ${Date.now()}\n\n`); } catch {} }, 15_000);
    req.on('close', ()=>{ clearInterval(ping); room.sse.delete(key); }); return true;
  }
  return bad(res, 404, 'Unknown room endpoint');
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const safe = normalize(pathname).replace(/^([.][.][/\\])+/, '').replace(/^[/\\]+/, '');
  let file = resolve(SITE_DIR, safe);
  if (!file.startsWith(SITE_DIR)) return bad(res, 403, 'Forbidden');
  if (!existsSync(file) || statSync(file).isDirectory()) file = resolve(SITE_DIR, 'index.html');
  if (!existsSync(file)) return bad(res, 503, 'Built site missing. Run npm run coop, not coop:server, for the first start.');
  const ext = extname(file).toLowerCase();
  res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': ext === '.html' ? 'no-store' : 'public, max-age=60' });
  createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  try { if (url.pathname.startsWith('/api/')) { const handled = await api(req, res, url); if (handled !== false) return; } serveStatic(req, res, url); }
  catch (error) { console.error('[coop]', error); if (!res.headersSent) bad(res, 500, error?.message || 'Server error'); else res.end(); }
});

server.listen(PORT, HOST, () => {
  const lan = findLanIp();
  console.log('\nRIFTBOUND CO-OP // LAN ALPHA');
  console.log('--------------------------------');
  console.log(`Host: http://localhost:${PORT}`);
  console.log(`LAN : http://${lan}:${PORT}`);
  console.log('Open Host on your PC. Give the LAN address to your friend on the same network.');
  console.log('The host is authoritative for room/run snapshots and all future combat resolution.\n');
});

export { server, rooms, publicRoom };
