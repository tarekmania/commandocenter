// Commandcenter worker
// 1. Every minute: looks for new pushes in Tarek's repos and wakes the rater in GitHub Actions.
// 2. Serves the wall screen and its state to the Mac mini (protected by SCREEN_KEY).
import SCREEN from '../../screen/index.html';

const API = 'https://api.github.com';
const CC = 'tarekmania/commandocenter';

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

async function readState(env) {
  const res = await gh(`/repos/${CC}/contents/state.json`, env.CC_READ_TOKEN, { headers: { Accept: 'application/vnd.github.raw' } });
  if (!res.ok) return null;
  return res.text();
}

async function checkForPushes(env) {
  const reposRes = await gh('/user/repos?per_page=15&sort=pushed&affiliation=owner,collaborator,organization_member', env.CC_READ_TOKEN);
  if (!reposRes.ok) return 'repos ' + reposRes.status;
  const repos = (await reposRes.json()).filter(r => r.full_name !== CC && !r.fork);
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

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkForPushes(env).then(r => console.log(r)));
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!env.SCREEN_KEY || key !== env.SCREEN_KEY) return new Response('Not found', { status: 404 });

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
      return new Response(SCREEN, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
    }
    return new Response('Not found', { status: 404 });
  }
};
