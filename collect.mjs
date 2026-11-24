// Collects evidence from GitHub for the rater. No AI here: only facts.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const TOKEN = process.env.GH_READ_TOKEN;
const SELF = process.env.CC_REPO || 'tarekmania/commandocenter';
if (!TOKEN) { console.error('GH_READ_TOKEN missing'); process.exit(1); }

const gh = async (path, raw = false) => {
  const res = await fetch('https://api.github.com' + path, {
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (res.status === 404 || res.status === 409) return null;
  if (!res.ok) throw new Error(path + ' -> ' + res.status);
  return raw ? res.text() : res.json();
};

const DAY = 86400000;
const now = Date.now();
const since14 = new Date(now - 14 * DAY).toISOString();
const lineFile = id => { try { return JSON.parse(readFileSync(`lines/${id}.json`, 'utf8')); } catch { return null; } };
const projectFile = id => { try { return readFileSync(`projects/${id}.md`, 'utf8'); } catch { return null; } };
const hash = s => createHash('sha1').update(s || '').digest('hex').slice(0, 12);
const prevState = (() => { try { return JSON.parse(readFileSync('state.json', 'utf8')); } catch { return {}; } })();
const prevHeads = prevState.heads || {}, prevPf = prevState.projectHashes || {};
// FULL=1 (manual run) rates every project; otherwise only projects whose main branch or project file changed.
const FULL = process.env.FULL === '1';

// ROADMAP.md in a project repo is the source of truth when it exists.
// Format: "# Goal" + one line, then "## <station>" headings with "- [x] step" / "- [ ] step" lists.
function parseRoadmap(md) {
  if (!md) return null;
  let goal = '', section = null;
  const stations = [];
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const title = h[2].replace(/[✓✔]/g, '').trim();
      if (/^goal\b/i.test(title)) { section = 'goal'; continue; }
      if (h[1].length >= 2) { section = 'station'; stations.push({ name: title.replace(/^\d+[.)]\s*/, '').slice(0, 40), steps: [] }); continue; }
      section = null; continue;
    }
    if (section === 'goal' && line && !goal) { goal = line.replace(/^[-*]\s*/, '').slice(0, 120); continue; }
    const st = line.match(/^[-*]\s+\[( |x|X)\]\s+(.*)$/);
    if (st && section === 'station') stations[stations.length - 1].steps.push({ t: st[2].trim().slice(0, 60), done: st[1] !== ' ' });
  }
  const real = stations.filter(s => s.steps.length);
  return real.length >= 2 ? { goal, stations: real } : null;
}

const INCLUDE_FORKS = ['tarekmania/GTA6-Asset-Info'];

const repos = [];
for (let page = 1; page <= 3; page++) {
  const batch = await gh(`/user/repos?per_page=100&page=${page}&sort=pushed&affiliation=owner,collaborator,organization_member`);
  if (!batch || !batch.length) break;
  repos.push(...batch);
  if (batch.length < 100) break;
}

console.log(`token sees ${repos.length} repos: ${repos.map(r => r.full_name).join(', ')}`);

const evidence = [];
for (const r of repos) {
  if (r.full_name === SELF || r.archived) continue;
  if (r.fork && !INCLUDE_FORKS.includes(r.full_name)) continue;
  const ageDays = (now - Date.parse(r.pushed_at)) / DAY;
  if (ageDays > 120) continue;
  const id = r.name.toLowerCase();
  const pf = projectFile(id);
  const known = lineFile(id);
  const commits = (await gh(`/repos/${r.full_name}/commits?since=${since14}&per_page=100`)) || [];
  let head = commits[0]?.sha;
  if (!head) head = (await gh(`/repos/${r.full_name}/branches/${encodeURIComponent(r.default_branch)}`))?.commit?.sha || null;
  head = head ? head.slice(0, 12) : null;
  const pfHash = pf ? hash(pf) : null;
  const hasDraft = !!(known && known.goal && Array.isArray(known.stations) && typeof known.stations[0] === 'object');
  const changed = FULL || prevHeads[id] !== head || prevPf[id] !== pfHash || (!pf && !hasDraft);
  const commits7d = commits.filter(c => (now - Date.parse(c.commit.author?.date || c.commit.committer?.date)) < 7 * DAY).length;
  const base = { id, repo: r.full_name, pushedAt: r.pushed_at, head, pfHash, commits7d, hasProjectFile: !!pf, changed };
  if (!changed) { evidence.push(base); continue; }
  // A repo without a project file and without a draft gets its whole history, so the rater can draft the big picture once.
  const needsDraft = !pf && !hasDraft;
  let history = null;
  if (needsDraft) {
    history = [];
    for (let page = 1; page <= 4; page++) {
      const b = await gh(`/repos/${r.full_name}/commits?per_page=100&page=${page}`);
      if (!b || !b.length) break;
      history.push(...b.map(c => `${(c.commit.author?.date || '').slice(0, 10)} ${c.sha.slice(0, 7)} ${(c.commit.message || '').split('\n')[0].slice(0, 120)}`));
      if (b.length < 100) break;
    }
  }
  const roadmapMd = await gh(`/repos/${r.full_name}/contents/ROADMAP.md`, true);
  const readme = needsDraft ? await gh(`/repos/${r.full_name}/readme`, true) : null;
  const pulls = (await gh(`/repos/${r.full_name}/pulls?state=open&per_page=20`)) || [];
  const merged = ((await gh(`/repos/${r.full_name}/pulls?state=closed&per_page=20&sort=updated&direction=desc`)) || [])
    .filter(p => p.merged_at && (now - Date.parse(p.merged_at)) < 14 * DAY);
  evidence.push({
    ...base,
    description: r.description || '',
    defaultBranch: r.default_branch,
    needsDraft,
    commits14d: commits.map(c => ({
      sha: c.sha.slice(0, 7),
      date: c.commit.author?.date || c.commit.committer?.date,
      message: (c.commit.message || '').split('\n').filter(Boolean).slice(0, 3).join(' / ').slice(0, 240)
    })),
    history,
    openPulls: pulls.map(p => ({ number: p.number, title: p.title.slice(0, 160), branch: p.head?.ref, updatedAt: p.updated_at })),
    mergedPulls: merged.map(p => ({ number: p.number, title: p.title.slice(0, 160), branch: p.head?.ref, mergedAt: p.merged_at, sha: (p.merge_commit_sha || '').slice(0, 7) })),
    roadmap: parseRoadmap(roadmapMd),
    readme: readme ? readme.slice(0, 8000) : null
  });
}

mkdirSync('work', { recursive: true });
const lastSeenPush = evidence.reduce((m, e) => (e.pushedAt > m ? e.pushedAt : m), '');
writeFileSync('work/evidence.json', JSON.stringify({ collectedAt: new Date().toISOString(), lastSeenPush, repos: evidence }, null, 2));
const changedIds = evidence.filter(e => e.changed).map(e => e.id);
writeFileSync('work/changed.txt', changedIds.join('\n'));
console.log(`evidence for ${evidence.length} repos, last push ${lastSeenPush}, changed: ${changedIds.join(', ') || 'none'}`);
