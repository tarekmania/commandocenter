// Builds the screen state. No AI decisions here: the route comes from projects/<id>.md
// (or the rater's first draft for new repos), the state from the push dates, the order from the most recent work.
import { readFileSync, writeFileSync } from 'node:fs';
import { parseProject } from './route.mjs';

const read = (p, fallback) => { try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fallback; } };
const text = p => { try { return readFileSync(p, 'utf8'); } catch { return null; } };
const evidence = read('work/evidence.json', { repos: [] });
const prev = read('work/prev-state.json', null) || read('state.json', null);

const DAY = 86400000, now = Date.now();
const zurichDay = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
const str = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
const PALETTE = ['#f4c430', '#3cb46e', '#f2892b', '#8fb3ff', '#c98b4f', '#d94f9a', '#a8c83a', '#1fb5b0', '#e8706a', '#b39ddb'];
const MAX_ON_MAP = 8;


function cleanRoute(stations) {
  if (!Array.isArray(stations) || stations.length < 2 || stations.length > 8) return null;
  const out = [];
  for (const s of stations) {
    const name = str(s && s.name, 40);
    if (!name || !Array.isArray(s.steps) || s.steps.length < 1 || s.steps.length > 20) return null;
    out.push({ name, steps: s.steps.map(x => {
      const step = { t: str(x && x.t, 80) || '…', done: x && x.done === true };
      if (step.done && x.on) step.on = x.on;
      return step;
    }) });
  }
  return out;
}

// Position, in stations: each station counts by the share of its steps that are done, so loose
// ends in an early station do not pin the train to the start. The first station is the origin.
function position(route) {
  const n = route.length;
  if (route.every(s => s.steps.every(x => x.done))) return { at: n - 1, progress: 0 };
  const sum = route.reduce((a, s) => a + s.steps.filter(x => x.done).length / s.steps.length, 0);
  const p = Math.min(n - 1 - 0.01, Math.max(0, sum - 1));
  const at = Math.floor(p);
  return { at, progress: Math.round((p - at) * 100) / 100 };
}

function needsOf(items) {
  return items.slice(0, 8).map(raw => {
    const m = raw.match(/^(?:(\d{4}-\d{2}-\d{2})\s+)?(.+)$/);
    const links = (m[2].match(/https?:\/\/[^)\s,]+/g) || []).slice(0, 4);
    const t = m[2].replace(/\(?\s*https?:\/\/[^\s)]+\)?/g, '').replace(/\s+([,.;:])/g, '$1').replace(/[\s,;:(]+$/, '').replace(/\s{2,}/g, ' ').trim();
    return { t: t.slice(0, 160), since: m[1] || null, link: links[0] || null, links };
  });
}

const prevLine = id => prev?.lines?.find(l => l.id === id) || null;
const newDay = !prev || prev.day !== zurichDay;
const candidates = [];

for (const e of evidence.repos) {
  const id = e.id;
  const file = read(`lines/${id}.json`, {}) || {};
  if (file.project === false) continue;
  const proj = parseProject(text(`projects/${id}.md`));
  const p = prevLine(id);

  // Route: the repo's own ROADMAP.md, else the project file, else the rater's first draft.
  let route = cleanRoute(e.roadmap?.stations) || cleanRoute(proj?.stations) || cleanRoute(file.stations);
  if (!route && p && Array.isArray(p.steps)) route = p.stations.map((name, i) => ({ name, steps: p.steps[i] || [] }));
  if (!route) { console.error(`${id}: no route yet, skipped`); continue; }
  const goal = str(e.roadmap?.goal, 140) || str(proj?.goal, 140) || str(file.goal, 140) || p?.goal || null;

  const ageDays = e.pushedAt ? (now - Date.parse(e.pushedAt)) / DAY : 999;
  const held = file.held && str(file.held.reason, 40) ? { reason: str(file.held.reason, 40), since: str(file.held.since, 10) || zurichDay } : null;
  const state = held ? 'held' : ageDays <= 7 ? 'moving' : ageDays <= 21 ? 'parked' : 'depot';

  const pos = position(route);
  const all = route.flatMap(s => s.steps);
  const out = {
    id,
    repo: e.repo,
    name: str(proj?.name, 30) || str(file.name, 30) || p?.name || id,
    goal,
    stations: route.map(s => s.name),
    steps: route.map(s => s.steps),
    at: pos.at,
    progress: pos.progress,
    stepsDone: all.filter(s => s.done).length,
    stepsTotal: all.length,
    doneToday: all.filter(s => s.done && s.on === zurichDay).length,
    state,
    task: str(file.task, 60) || p?.task || '',
    held,
    runsWeek: Math.min(99, e.commits7d || 0),
    lastPush: e.pushedAt || p?.lastPush || null,
    needs: needsOf(proj?.needs || []),
    decisions: (proj?.decisions || []).slice().sort((a, b) => String(b.on || '').localeCompare(String(a.on || ''))).slice(0, 6).map(d => ({ on: d.on, t: str(d.t.replace(/\(?\s*https?:\/\/[^\s)]+\)?/g, '').trim(), 160) })),
    profile: proj?.setup?.profile || null,
    draft: !proj
  };
  if (newDay) out.todayFrom = p && p.stations?.length === out.stations.length ? { at: p.at, progress: p.progress } : { at: out.at, progress: out.progress };
  else out.todayFrom = p?.todayFrom || { at: out.at, progress: out.progress };
  if (out.todayFrom.at > out.at || (out.todayFrom.at === out.at && out.todayFrom.progress > out.progress + 0.001)) out.todayFrom = { at: out.at, progress: out.progress };
  candidates.push(out);
}

// The map: the line worked on last is on top. Held lines are always on the map. Depot lines stay off.
const byLastWork = (a, b) => String(b.lastPush).localeCompare(String(a.lastPush));
const live = candidates.filter(l => l.state !== 'depot').sort(byLastWork);
const onMap = [...live.filter(l => l.state === 'held'), ...live.filter(l => l.state !== 'held')].slice(0, MAX_ON_MAP).sort(byLastWork);
const depot = candidates.filter(l => !onMap.includes(l)).sort(byLastWork);

// Colors stay with their line; new lines take the first free one.
const used = new Set();
const prevColor = id => prev?.colors?.[id] || prevLine(id)?.color || null;
for (const l of onMap) { const c = prevColor(l.id); if (c && !used.has(c)) { l.color = c; used.add(c); } }
for (const l of onMap) if (!l.color) { l.color = PALETTE.find(c => !used.has(c)) || PALETTE[0]; used.add(l.color); }
const colors = { ...(prev?.colors || {}) };
for (const l of onMap) colors[l.id] = l.color;

// Headline: facts only, for people walking past the wall.
const list = a => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
const words = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];
const count = n => `${words[n] || n} line${n === 1 ? ' is' : 's are'} moving.`;
const moving = onMap.filter(l => l.state === 'moving'), heldL = onMap.filter(l => l.state === 'held');
const reached = onMap.filter(l => l.todayFrom && l.at > l.todayFrom.at);
let headline = reached.length ? `${list(reached.slice(0, 2).map(l => `${l.name} reached ${l.stations[l.at]}`))}.` : count(moving.length);
if (heldL.length) headline += ` ${list(heldL.map(l => l.name))} ${heldL.length === 1 ? 'is' : 'are'} held at a signal.`;
else if (reached.length) headline += ' ' + count(moving.length);

const heads = {}, projectHashes = {};
for (const e of evidence.repos) { heads[e.id] = e.head; projectHashes[e.id] = e.pfHash; }

const result = {
  headline: headline.slice(0, 120),
  lines: onMap,
  depot: depot.map(d => ({ id: d.id, repo: d.repo, name: d.name })),
  colors,
  day: zurichDay,
  updatedAt: new Date().toISOString(),
  lastSeenPush: evidence.lastSeenPush || prev?.lastSeenPush || null,
  heads,
  projectHashes
};
writeFileSync('state.json', JSON.stringify(result, null, 2) + '\n');
console.log(`state ok: ${onMap.length} lines, ${depot.length} in depot, ${onMap.reduce((a, l) => a + l.stepsTotal, 0)} steps`);
