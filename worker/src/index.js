// Commandcenter worker
// 1. Every minute: looks for new pushes in Tarek's repos and wakes the rater in GitHub Actions.
// 2. Serves the wall screen and its state to the Mac mini (protected by SCREEN_KEY).
import SCREEN from '../../screen/index.html';

const API = 'https://api.github.com';
const CC = 'tarekmania/commandocenter';
const INCLUDE_FORKS = ['tarekmania/GTA6-Asset-Info'];

const gh = (path, token, init = {}) => fetch(API + path, {
  ...init,
  headers: {
    Authorization: 'Bearer ' + token,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'commandcenter-worker',
    ...(init.headers || {})
  }
});

// The screen is read from the repo, so changes to screen/index.html go live without a deploy.
// The copy bundled at deploy time is the fallback.
let screenCache = { at: 0, html: null };
async function readScreen(env) {
  if (screenCache.html && Date.now() - screenCache.at < 60000) return screenCache.html;
  try {
    const res = await gh(`/repos/${CC}/contents/screen/index.html`, env.CC_DISPATCH_TOKEN, { headers: { Accept: 'application/vnd.github.raw' } });
    if (res.ok) { const html = await res.text(); if (html.includes('</html>')) { screenCache = { at: Date.now(), html }; return html; } }
  } catch {}
  return screenCache.html || SCREEN;
}

async function readState(env) {
  const res = await gh(`/repos/${CC}/contents/state.json`, env.CC_DISPATCH_TOKEN, { headers: { Accept: 'application/vnd.github.raw' } });
  if (!res.ok) return null;
  return res.text();
}

async function checkForPushes(env) {
  const reposRes = await gh('/user/repos?per_page=15&sort=pushed&affiliation=owner,collaborator,organization_member', env.CC_READ_TOKEN);
  if (!reposRes.ok) return 'repos ' + reposRes.status;
  const repos = (await reposRes.json()).filter(r => r.full_name !== CC && (!r.fork || INCLUDE_FORKS.includes(r.full_name)));
  const newest = repos.reduce((m, r) => (r.pushed_at > m ? r.pushed_at : m), '');
  const stateText = await readState(env);
  const lastSeen = stateText ? (JSON.parse(stateText).lastSeenPush || '') : '';
  if (!newest || newest <= lastSeen) return 'no new push';

  const runsRes = await gh(`/repos/${CC}/actions/runs?per_page=5`, env.CC_DISPATCH_TOKEN);
  if (runsRes.ok) {
    const runs = (await runsRes.json()).workflow_runs || [];
    if (runs.some(r => r.status === 'queued' || r.status === 'in_progress' || r.status === 'waiting' || r.status === 'pending')) return 'rater already running';
  }
  const d = await gh(`/repos/${CC}/dispatches`, env.CC_DISPATCH_TOKEN, {
    method: 'POST',
    body: JSON.stringify({ event_type: 'project-push', client_payload: { newest } })
  });
  return 'dispatch ' + d.status;
}


async function diagnose(env) {
  const out = { time: new Date().toISOString(), secrets: {
    CC_READ_TOKEN: !!env.CC_READ_TOKEN, CC_DISPATCH_TOKEN: !!env.CC_DISPATCH_TOKEN, SCREEN_KEY: !!env.SCREEN_KEY } };
  const same = env.CC_READ_TOKEN && env.CC_READ_TOKEN === env.CC_DISPATCH_TOKEN;
  out.readAndDispatchAreTheSameToken = !!same;

  const r = await gh('/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator,organization_member', env.CC_READ_TOKEN);
  const repos = r.ok ? await r.json() : [];
  const counted = repos.filter(x => x.full_name !== CC && (!x.fork || INCLUDE_FORKS.includes(x.full_name)));
  const newest = counted.reduce((m, x) => (x.pushed_at > m.pushed_at ? x : m), { pushed_at: '' });
  out.readToken = { status: r.status, reposVisible: repos.length, privateVisible: repos.filter(x => x.private).length,
    newestPush: newest.full_name ? newest.full_name + ' ' + newest.pushed_at : null };

  const st = await readState(env);
  out.stateJson = st ? 'ok' : 'not readable';
  const lastSeen = st ? (JSON.parse(st).lastSeenPush || '') : '';
  out.lastSeenPush = lastSeen;
  out.newPushWaiting = !!newest.pushed_at && newest.pushed_at > lastSeen;

  const runs = await gh(`/repos/${CC}/actions/runs?per_page=5`, env.CC_DISPATCH_TOKEN);
  out.dispatchToken = { readRuns: runs.status };
  const test = await gh(`/repos/${CC}/dispatches`, env.CC_DISPATCH_TOKEN, {
    method: 'POST', body: JSON.stringify({ event_type: 'diag-test' })
  });
  out.dispatchToken.sendDispatch = test.status;
  if (test.status !== 204) out.dispatchToken.message = (await test.text()).slice(0, 200);
  out.verdict =
    r.status !== 200 ? 'read token does not work (status ' + r.status + ')' :
    !out.readToken.privateVisible ? 'read token only sees public repos' :
    test.status !== 204 ? 'dispatch token cannot start runs (status ' + test.status + ')' :
    'tokens are fine';
  return out;
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkForPushes(env).then(r => console.log(r)));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!env.SCREEN_KEY || key !== env.SCREEN_KEY) return new Response('Not found', { status: 404 });

    if (url.pathname === '/diag') {
      return new Response(JSON.stringify(await diagnose(env), null, 2), { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
    }

    if (url.pathname === '/screen-version') {
      const html = await readScreen(env);
      let h = 0; for (let i = 0; i < html.length; i++) h = (h * 31 + html.charCodeAt(i)) | 0;
      return new Response(String(h >>> 0), { headers: { 'cache-control': 'no-store' } });
    }

    if (url.pathname === '/state.json') {
      const cache = caches.default;
      const cacheKey = new Request(url.origin + '/state.json');
      let res = await cache.match(cacheKey);
      if (!res) {
        const text = await readState(env);
        if (!text) return new Response('{"error":"no state yet"}', { status: 503, headers: { 'content-type': 'application/json' } });
        res = new Response(text, { headers: { 'content-type': 'application/json', 'cache-control': 'max-age=15' } });
        await cache.put(cacheKey, res.clone());
      }
      return new Response(res.body, { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
    }

    if (url.pathname === '/') {
      return new Response(await readScreen(env), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
    }
    return new Response('Not found', { status: 404 });
  }
};
