// Collects evidence from GitHub for the rater. No AI here: only facts.
import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';

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
const knownLines = existsSync('lines') ? readdirSync('lines').filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')) : [];

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
  if (r.full_name === SELF || r.fork || r.archived) continue;
  const ageDays = (now - Date.parse(r.pushed_at)) / DAY;
  if (ageDays > 120) continue;
  const id = r.name.toLowerCase();
  const commits = (await gh(`/repos/${r.full_name}/commits?since=${since14}&per_page=60`)) || [];
  const project = await gh(`/repos/${r.full_name}/contents/PROJECT.md`, true);
  const readme = knownLines.includes(id) ? null : await gh(`/repos/${r.full_name}/readme`, true);
  const pulls = (await gh(`/repos/${r.full_name}/pulls?state=open&per_page=20`)) || [];
  evidence.push({
    id,
    repo: r.full_name,
    description: r.description || '',
    pushedAt: r.pushed_at,
    defaultBranch: r.default_branch,
    commits14d: commits.map(c => ({
      sha: c.sha.slice(0, 7),
      date: c.commit.author?.date || c.commit.committer?.date,
      message: (c.commit.message || '').split('\n')[0].slice(0, 160)
    })),
    openPulls: pulls.map(p => ({ number: p.number, title: p.title.slice(0, 160), updatedAt: p.updated_at })),
    projectMd: project ? project.slice(0, 8000) : null,
    readme: readme ? readme.slice(0, 4000) : null
  });
}

mkdirSync('work', { recursive: true });
const lastSeenPush = evidence.reduce((m, e) => (e.pushedAt > m ? e.pushedAt : m), '');
writeFileSync('work/evidence.json', JSON.stringify({ collectedAt: new Date().toISOString(), lastSeenPush, repos: evidence }, null, 2));
console.log(`evidence for ${evidence.length} repos, last push ${lastSeenPush}`);
