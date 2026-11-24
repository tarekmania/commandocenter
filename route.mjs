// Reads and writes the one project file: projects/<id>.md.
// The file is the only copy of a project's goal, route and steps.

const clean = s => String(s || '').trim();

export function parseProject(md) {
  if (!md) return null;
  const out = { name: null, setup: {}, goal: null, stations: [], needs: [], done: [], decisions: [] };
  const lines = md.split('\n');
  let section = null, station = null;
  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    let m;
    if ((m = line.match(/^# (.+)$/)) && !out.name) { out.name = clean(m[1]); continue; }
    if ((m = line.match(/^## (.+)$/))) {
      const t = clean(m[1]).toLowerCase();
      section = t.startsWith('route') ? 'route' : t.startsWith('needs') ? 'needs' : t.startsWith('done') ? 'done' : t.startsWith('decision') ? 'decisions' : t.startsWith('log') ? 'log' : 'other';
      station = null;
      continue;
    }
    if (section === null || section === 'setup') {
      if (/^Setup:/i.test(line)) { section = 'setup'; continue; }
      if ((m = line.match(/^Goal:\s*(.+)$/i))) { out.goal = clean(m[1]); section = null; continue; }
      if (section === 'setup' && (m = line.match(/^-\s*(\w+):\s*(.*)$/))) { out.setup[m[1].toLowerCase()] = clean(m[2]); continue; }
    }
    if (section === 'route') {
      if ((m = line.match(/^### (?:\d+[.)]\s*)?(.+)$/))) { station = { name: clean(m[1]).slice(0, 40), desc: '', steps: [] }; out.stations.push(station); continue; }
      if (station && (m = line.match(/^>\s*(.+)$/))) { station.desc = clean(m[1]); continue; }
      if (station && (m = line.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.+)$/))) {
        // "- [x] step · <ref> · <YYYY-MM-DD>": reference and the day it was done are both optional.
        const parts = clean(m[2]).split(/\s+·\s+/);
        const t = parts.shift();
        const on = parts.find(x => /^\d{4}-\d{2}-\d{2}$/.test(x)) || null;
        const ref = parts.find(x => x !== on) || null;
        station.steps.push({ t: t.slice(0, 80), done: m[1] !== ' ', ref, on });
      }
      continue;
    }
    if (section === 'needs' && (m = line.match(/^\s*[-*]\s+\[ \]\s+(.+)$/))) out.needs.push(clean(m[1]));
    if (section === 'done' && (m = line.match(/^\s*[-*]\s+(.+)$/))) out.done.push(clean(m[1]));
    // "- YYYY-MM-DD what Claude decided, and why"
    if (section === 'decisions' && (m = line.match(/^\s*[-*]\s+(?:(\d{4}-\d{2}-\d{2})\s*[:·-]?\s*)?(.+)$/))) out.decisions.push({ on: m[1] || null, t: clean(m[2]) });
  }
  out.stations = out.stations.filter(s => s.steps.length);
  return out;
}

export function routeSection(stations) {
  let s = '## Route\n';
  for (const st of stations) {
    s += `\n### ${st.name}\n`;
    if (st.desc) s += `> ${st.desc}\n`;
    for (const x of st.steps) s += `- [${x.done ? 'x' : ' '}] ${x.t}${x.ref ? ' · ' + x.ref : ''}${x.on ? ' · ' + x.on : ''}\n`;
  }
  return s;
}
