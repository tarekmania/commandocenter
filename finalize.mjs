// Runs after the rater. Merges each line's roadmap (lines/<id>.json) into the screen state,
// computes the train position from the steps, adds the facts that must not come from AI,
// and falls back to the previous values wherever the rater's output is broken.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const ROADMAP_VERSION = 3; // bump to make the rater redraft every route from the full history

const read = (p, fallback) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fallback; } };
const evidence = read('work/evidence.json', { repos: [] });
const prev = read('work/prev-state.json', null);
const next = read('state.json', null);

const zurichDay = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
const ev = id => evidence.repos.find(r => r.id === id) || null;
const hex = /^#[0-9a-fA-F]{6}$/;
const states = new Set(['moving', 'held', 'parked']);
const str = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);

function cleanRoute(stations) {
  if (!Array.isArray(stations) || stations.length < 2 || stations.length > 8) return null;
  const out = [];
  for (const s of stations) {
    const name = str(s && s.name, 40);
    if (!name || !Array.isArray(s.steps) || s.steps.length < 1 || s.steps.length > 12) return null;
    const steps = [];
    for (const st of s.steps) {
      const t = str(st && st.t, 60);
      if (!t) return null;
      steps.push({ t, done: st.done === true });
    }
    out.push({ name, steps });
  }
  return out;
}

// Position, in stations: each station counts by the share of its steps that are done, so loose
// ends in an early station do not pin the train to the start. The first station is the origin.
function position(route) {
  const n = route.length;
  const sum = route.reduce((a, s) => a + s.steps.filter(x => x.done).length / s.steps.length, 0);
  if (route.every(s => s.steps.every(x => x.done))) return { at: n - 1, progress: 0 };
  const p = Math.min(n - 1 - 0.01, Math.max(0, sum - 1));
  const at = Math.floor(p);
  return { at, progress: Math.round((p - at) * 100) / 100 };
}

function validState(s) {
  if (!s || typeof s.headline !== 'string' || !Array.isArray(s.lines) || !Array.isArray(s.depot)) return false;
  if (s.lines.length > 8) return false;
  return s.lines.every(l => l && l.id && states.has(l.state) && hex.test(l.color || ''));
}

let base;
if (validState(next)) base = next;
else if (prev) { console.error('rater state invalid, keeping previous state'); base = prev; }
else { console.error('rater state invalid and no previous state'); process.exit(1); }

const prevLine = id => prev?.lines?.find(l => l.id === id);
const newDay = !prev || prev.day !== zurichDay;
const lines = [];

for (const l of base.lines) {
  const file = read(`lines/${l.id}.json`, {});
  const p = prevLine(l.id);
  const e = ev(l.id);

  // The project's own ROADMAP.md always wins.
  let route = cleanRoute(e?.roadmap?.stations) || cleanRoute(file.stations);
  let goal = str(e?.roadmap?.goal, 120) || str(file.goal, 120);
  if (!route && p && Array.isArray(p.steps)) {
    console.error(`${l.id}: roadmap invalid, keeping previous`);
    route = p.stations.map((name, i) => ({ name, steps: p.steps[i] || [] }));
    goal = goal || p.goal || null;
  }
  if (!route) {
    if (p) { console.error(`${l.id}: no usable roadmap, keeping the previous line as it was`); lines.push({ ...p, lastPush: e?.pushedAt || p.lastPush }); }
    else console.error(`${l.id}: no usable roadmap, line skipped`);
    continue;
  }

  const pos = position(route);

  const all = route.flatMap(s => s.steps);
  const out = {
    id: l.id,
    repo: file.repo || e?.repo || p?.repo || null,
    name: str(file.name, 30) || p?.name || l.id,
    color: l.color,
    goal: goal || null,
    stations: route.map(s => s.name),
    steps: route.map(s => s.steps),
    at: pos.at,
    progress: pos.progress,
    stepsDone: all.filter(s => s.done).length,
    stepsTotal: all.length,
    state: l.state,
    task: str(file.task, 60) || p?.task || '',
    held: l.state === 'held' && file.held && str(file.held.reason, 40)
      ? { reason: str(file.held.reason, 40), since: str(file.held.since, 10) || zurichDay }
      : null,
    runsWeek: Number.isInteger(l.runsWeek) ? Math.min(99, Math.max(0, l.runsWeek)) : (p?.runsWeek || 0),
    lastPush: e?.pushedAt || p?.lastPush || null
  };
  if (out.state === 'held' && !out.held) out.held = { reason: 'held', since: zurichDay };

  if (newDay) out.todayFrom = p ? { at: p.at, progress: p.progress } : { at: out.at, progress: out.progress };
  else out.todayFrom = p?.todayFrom || { at: out.at, progress: out.progress };
  if (out.todayFrom.at > out.at || (out.todayFrom.at === out.at && out.todayFrom.progress > out.progress + 0.001)) {
    out.todayFrom = { at: out.at, progress: out.progress };
  }
  lines.push(out);
}

const result = {
  headline: base.headline.slice(0, 120),
  lines,
  depot: base.depot.map(d => ({ id: d.id, repo: d.repo || null, name: d.name || d.id })),
  day: zurichDay,
  updatedAt: new Date().toISOString(),
  lastSeenPush: evidence.lastSeenPush || prev?.lastSeenPush || null
};
writeFileSync('state.json', JSON.stringify(result, null, 2) + '\n');

// Mark every valid roadmap as drafted under the current rules, so the next run only keeps it current.
for (const f of readdirSync('lines').filter(f => f.endsWith('.json'))) {
  const file = read(`lines/${f}`, null);
  if (file && cleanRoute(file.stations) && file.goal && file.v !== ROADMAP_VERSION) {
    writeFileSync(`lines/${f}`, JSON.stringify({ ...file, v: ROADMAP_VERSION }, null, 2) + '\n');
  }
}
console.log(`state ok: ${lines.length} lines, ${result.depot.length} in depot, ${lines.reduce((a, l) => a + l.stepsTotal, 0)} steps`);
