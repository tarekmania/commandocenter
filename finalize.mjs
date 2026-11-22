// Runs after the rater. Validates its output, adds the facts that must not come from AI,
// and falls back to the previous state if the output is broken.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const read = (p, fallback) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fallback; } };
const evidence = read('work/evidence.json', { repos: [] });
const prev = read('work/prev-state.json', null);
const next = read('state.json', null);

const zurichDay = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
const pushOf = id => evidence.repos.find(r => r.id === id)?.pushedAt || null;
const hex = /^#[0-9a-fA-F]{6}$/;
const states = new Set(['moving', 'held', 'parked']);

function valid(s) {
  if (!s || typeof s.headline !== 'string' || !Array.isArray(s.lines) || !Array.isArray(s.depot)) return false;
  if (s.lines.length > 8) return false;
  for (const l of s.lines) {
    if (!l.id || !l.name || !Array.isArray(l.stations) || l.stations.length < 2 || l.stations.length > 8) return false;
    if (!Number.isInteger(l.at) || l.at < 0 || l.at > l.stations.length - 1) return false;
    if (typeof l.progress !== 'number' || l.progress < 0 || l.progress > 1) return false;
    if (!states.has(l.state) || !hex.test(l.color || '')) return false;
  }
  return true;
}

let out;
if (valid(next)) {
  out = next;
} else if (prev) {
  console.error('rater output invalid, keeping previous state');
  out = prev;
} else {
  console.error('rater output invalid and no previous state');
  process.exit(1);
}

const prevLine = id => prev?.lines?.find(l => l.id === id);
const newDay = !prev || prev.day !== zurichDay;

for (const l of out.lines) {
  l.progress = Math.round(Math.min(1, Math.max(0, l.progress)) * 100) / 100;
  l.lastPush = pushOf(l.id);
  if (l.at >= l.stations.length - 1) { l.at = l.stations.length - 1; l.progress = 0; }
  const p = prevLine(l.id);
  if (newDay) {
    l.todayFrom = p ? { at: p.at, progress: p.progress } : { at: l.at, progress: l.progress };
  } else {
    l.todayFrom = p?.todayFrom || { at: l.at, progress: l.progress };
  }
  if (p && (l.at < p.at || (l.at === p.at && l.progress < p.progress - 0.001))) {
    l.todayFrom = { at: l.at, progress: l.progress };
  }
}

out.day = zurichDay;
out.updatedAt = new Date().toISOString();
out.lastSeenPush = evidence.lastSeenPush || prev?.lastSeenPush || null;
writeFileSync('state.json', JSON.stringify(out, null, 2) + '\n');
console.log(`state ok: ${out.lines.length} lines, ${out.depot.length} in depot`);
