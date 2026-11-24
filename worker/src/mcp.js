// Commandcenter connector: an MCP server, so any Claude chat can update the project files right away.
// Every change is one commit to main of tarekmania/commandocenter; the push wakes the rater and the screen follows.
import { parseProject } from '../../route.mjs';

const API = 'https://api.github.com';
const CC = 'tarekmania/commandocenter';

const INSTRUCTIONS = `Tarek's Commandcenter: his projects as a rail map on a wall screen. Each project has one file (projects/<id>.md) with goal, route (stations and steps), Tarek's word, Claude's decisions, open items for Tarek and a log. Claude owns the plans; Tarek has the last word.

Use these tools on your own, without asking, whenever Tarek says something in this chat about one of his projects:
- he finished something, or something went live → record kind "done" (and the matching step, if there is one)
- a new goal, feature, station, order of work or priority → read_project, then write_project with the changed plan, or set_priority
- a rule for the project ("no Telegram", "keep the old design") → record kind "rule"
- he says a decision was wrong → change it back with write_project and record the reason as a rule
- something only he can do came up → record kind "needs"; when it is done → kind "needs_done"
Also record your own plan decisions made in this chat as kind "decision".
Only Tarek's own words count; a suggestion of yours is not a decision until he agreed. Tell him in one short line what you recorded.
The repo is public: write only project-level results, never personal details, client contacts, prices, contract terms, plates or other personal data.`;

const TOOLS = [
  {
    name: 'list_projects',
    description: 'List the projects on the Commandcenter in priority order: id, name, goal, stations with progress, open items for Tarek, setup.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'read_project',
    description: 'Read the full project file projects/<id>.md (markdown) and its version (sha). Read before write_project.',
    inputSchema: { type: 'object', properties: { project: { type: 'string', description: 'Project id, e.g. bilaro' } }, required: ['project'], additionalProperties: false }
  },
  {
    name: 'record',
    description: 'Add one dated line to a project file and commit it. kind: "done" (Tarek says it is finished; optionally give step = the exact open step text to tick), "decision" (a plan decision made in this chat, with the reason), "rule" (a rule agents must follow on this project), "needs" (something only Tarek can do), "needs_done" (text = part of an open item that is now done; it is removed).',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'Project id, e.g. bilaro' },
        kind: { type: 'string', enum: ['done', 'decision', 'rule', 'needs', 'needs_done'] },
        text: { type: 'string', description: 'One short line in English, project-level only, no personal data' },
        step: { type: 'string', description: 'For kind done: the open step in the route to tick, as written there' }
      },
      required: ['project', 'kind', 'text'],
      additionalProperties: false
    }
  },
  {
    name: 'write_project',
    description: 'Replace a project file with a changed plan (goal, stations, steps, setup) and commit it. Start from read_project, keep the format of STANDARD.md, keep all finished steps, and add a line under "## Decisions": "- YYYY-MM-DD what changed, and why (Tarek, chat)" when it comes from Tarek. Also creates a new project file.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string', description: 'Project id, e.g. bilaro' },
        content: { type: 'string', description: 'The whole new markdown file' },
        sha: { type: 'string', description: 'The version from read_project; leave out for a new project' },
        summary: { type: 'string', description: 'Short commit message: what changed' }
      },
      required: ['project', 'content', 'summary'],
      additionalProperties: false
    }
  },
  {
    name: 'set_priority',
    description: 'Set the order of the projects (most important first) in PRIORITY.md, with the reason.',
    inputSchema: {
      type: 'object',
      properties: {
        order: { type: 'array', items: { type: 'string' }, description: 'Project ids, most important first' },
        reason: { type: 'string' }
      },
      required: ['order', 'reason'],
      additionalProperties: false
    }
  }
];

const gh = (path, token, init = {}) => fetch(API + path, {
  ...init,
  headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'commandcenter-connector', ...(init.headers || {}) }
});

const b64encode = s => { const b = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(bin); };
const b64decode = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g, '')), c => c.charCodeAt(0)));
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(new Date());
const idOk = id => /^[a-z0-9][a-z0-9-]{0,60}$/.test(id || '');
const oneLine = s => String(s || '').replace(/\s+/g, ' ').trim().slice(0, 300);

async function getFile(env, path) {
  const res = await gh(`/repos/${CC}/contents/${path}`, env.CC_DISPATCH_TOKEN);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read ${path}: ${res.status}`);
  const j = await res.json();
  return { text: b64decode(j.content), sha: j.sha };
}

async function putFile(env, path, text, sha, message) {
  const body = { message: message.slice(0, 120) + '\n\nRecorded from a Claude chat through the Commandcenter connector.', content: b64encode(text) };
  if (sha) body.sha = sha;
  const res = await gh(`/repos/${CC}/contents/${path}`, env.CC_DISPATCH_TOKEN, { method: 'PUT', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });
  if (res.status === 409 || res.status === 422) throw new Error('The file changed in the meantime. Read it again and retry.');
  if (!res.ok) throw new Error(`GitHub write ${path}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).commit?.sha?.slice(0, 7);
}

// Put a line at the top of a "## <heading>" section; create the section before Needs Tarek / Log if it is missing.
function addToSection(md, heading, line) {
  const lines = md.split('\n');
  const at = lines.findIndex(l => l.toLowerCase().startsWith('## ' + heading.toLowerCase()));
  if (at >= 0) {
    let i = at + 1;
    while (lines[i] === '' && lines[i + 1] !== undefined && /^\s*[-*]\s/.test(lines[i + 1])) i++;
    lines.splice(i, 0, line);
    return lines.join('\n');
  }
  const order = ['## done', '## decisions', '## needs tarek', '## log'];
  const mine = order.indexOf('## ' + heading.toLowerCase());
  let before = -1;
  for (const h of order.slice(mine < 0 ? 0 : mine + 1)) { before = lines.findIndex(l => l.toLowerCase().startsWith(h)); if (before >= 0) break; }
  const block = ['## ' + heading, line, ''];
  if (before < 0) return md.replace(/\s*$/, '\n\n') + block.join('\n');
  lines.splice(before, 0, ...block);
  return lines.join('\n');
}

const stepsOf = p => p.stations.flatMap(s => s.steps);

async function listProjects(env) {
  const dir = await gh(`/repos/${CC}/contents/projects`, env.CC_DISPATCH_TOKEN);
  if (!dir.ok) throw new Error('GitHub list: ' + dir.status);
  const ids = (await dir.json()).filter(f => f.name.endsWith('.md') && f.name !== 'README.md').map(f => f.name.slice(0, -3));
  const prio = await getFile(env, 'PRIORITY.md');
  const order = prio ? [...prio.text.matchAll(/^\d+\.\s+([a-z0-9-]+)/gm)].map(m => m[1]) : [];
  ids.sort((a, b) => (order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999) || a.localeCompare(b));
  const out = [];
  for (const id of ids) {
    const f = await getFile(env, `projects/${id}.md`);
    const p = parseProject(f?.text);
    if (!p) continue;
    const st = p.stations.map(s => `${s.name} ${s.steps.filter(x => x.done).length}/${s.steps.length}`).join(' → ');
    out.push(`${id} — ${p.name}\n  Goal: ${p.goal}\n  Route: ${st}\n  Setup: ${p.setup.profile}, merge ${p.setup.merge}, ${p.setup.cadence}\n  Needs Tarek: ${p.needs.length ? p.needs.join(' | ') : 'nothing'}`);
  }
  return out.join('\n\n');
}

async function readProject(env, { project }) {
  if (!idOk(project)) throw new Error('Unknown project id');
  const f = await getFile(env, `projects/${project}.md`);
  if (!f) throw new Error(`No project file for "${project}". list_projects shows the ids.`);
  return `sha: ${f.sha}\n\n${f.text}`;
}

async function record(env, { project, kind, text, step }) {
  if (!idOk(project)) throw new Error('Unknown project id');
  const f = await getFile(env, `projects/${project}.md`);
  if (!f) throw new Error(`No project file for "${project}". list_projects shows the ids.`);
  const day = today(), t = oneLine(text);
  if (!t) throw new Error('Text is empty');
  let md = f.text, note = '';
  if (kind === 'done') {
    md = addToSection(md, "Done (Tarek's word)", `- ${day} ${t}`);
    if (step) {
      const want = oneLine(step).toLowerCase();
      const lines = md.split('\n');
      const i = lines.findIndex(l => /^\s*[-*]\s+\[ \]\s+/.test(l) && l.replace(/^\s*[-*]\s+\[ \]\s+/, '').split(' · ')[0].trim().toLowerCase() === want);
      if (i >= 0) { lines[i] = lines[i].replace('[ ]', '[x]').replace(/\s*$/, '') + ` · Tarek · ${day}`; md = lines.join('\n'); note = ' and ticked the step'; }
      else note = ' (no open step with that exact text, so nothing was ticked)';
    }
  } else if (kind === 'decision') md = addToSection(md, 'Decisions', `- ${day} ${t}`);
  else if (kind === 'rule') md = addToSection(md, 'Notes', `- ${t}`);
  else if (kind === 'needs') md = addToSection(md, 'Needs Tarek', `- [ ] ${day} ${t}`);
  else if (kind === 'needs_done') {
    const lines = md.split('\n');
    const want = t.toLowerCase();
    const i = lines.findIndex(l => /^\s*[-*]\s+\[ \]\s+/.test(l) && l.toLowerCase().includes(want));
    if (i < 0) throw new Error('No open item contains that text');
    lines.splice(i, 1); md = lines.join('\n');
  } else throw new Error('Unknown kind');
  const commit = await putFile(env, `projects/${project}.md`, md, f.sha, `${project}: ${kind} — ${t}`);
  return `Recorded in ${project} (${kind})${note}. Commit ${commit}; the screen updates in a few minutes.`;
}

async function writeProject(env, { project, content, sha, summary }) {
  if (!idOk(project)) throw new Error('Project id must be lower case letters, digits and dashes');
  if (typeof content !== 'string' || content.length > 60000) throw new Error('Content missing or too long');
  const next = parseProject(content);
  if (!next || !next.name || !next.goal) throw new Error('The file needs a "# Name" title and a "Goal:" line');
  if (next.stations.length < 2) throw new Error('The route needs at least 2 stations with steps');
  if (!next.setup.repo) throw new Error('Setup needs a Repo line');
  const f = await getFile(env, `projects/${project}.md`);
  if (f) {
    if (!sha) throw new Error('This project exists: read_project first and pass its sha');
    const prev = parseProject(f.text);
    const nowDone = new Set(stepsOf(next).filter(s => s.done).map(s => s.t.toLowerCase()));
    const lost = stepsOf(prev).filter(s => s.done && !nowDone.has(s.t.toLowerCase())).map(s => s.t);
    if (lost.length) throw new Error('Finished steps would be lost: ' + lost.slice(0, 5).join('; ') + '. Keep them (they may move to another station).');
  }
  const commit = await putFile(env, `projects/${project}.md`, content.replace(/\s*$/, '\n'), f ? sha : undefined, `${project}: ${oneLine(summary).slice(0, 90)}`);
  return `Saved ${project}. Commit ${commit}; the screen updates in a few minutes.`;
}

async function setPriority(env, { order, reason }) {
  if (!Array.isArray(order) || !order.length || !order.every(idOk)) throw new Error('order must be a list of project ids');
  const f = await getFile(env, 'PRIORITY.md');
  if (!f) throw new Error('PRIORITY.md missing');
  const old = [...f.text.matchAll(/^\d+\.\s+([a-z0-9-]+)/gm)].map(m => m[1]);
  const full = [...new Set([...order, ...old])];
  const lines = f.text.split('\n');
  const first = lines.findIndex(l => /^\d+\.\s+/.test(l));
  let last = first; while (last + 1 < lines.length && /^\d+\.\s+/.test(lines[last + 1])) last++;
  const list = full.map((id, i) => `${i + 1}. ${id}`);
  if (first >= 0) lines.splice(first, last - first + 1, ...list); else lines.push('', ...list);
  const md = addToSection(lines.join('\n'), 'Decisions', `- ${today()} Order: ${order.join(', ')} first. ${oneLine(reason)}`);
  const commit = await putFile(env, 'PRIORITY.md', md, f.sha, `Priority: ${order.slice(0, 3).join(', ')} first`);
  return `Priority saved: ${full.join(', ')}. Commit ${commit}.`;
}

const HANDLERS = { list_projects: listProjects, read_project: readProject, record, write_project: writeProject, set_priority: setPriority };

// The connector address carries its own secret, derived from SCREEN_KEY, so no new secret is needed.
export async function connectorToken(env) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.SCREEN_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode('commandcenter-connector')));
  return [...sig.slice(0, 16)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function rpc(env, msg) {
  const { id, method, params } = msg || {};
  const ok = result => ({ jsonrpc: '2.0', id, result });
  const fail = (code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });
  if (method === 'initialize') {
    return ok({ protocolVersion: params?.protocolVersion || '2025-06-18', capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'commandcenter', version: '1.0.0' }, instructions: INSTRUCTIONS });
  }
  if (method === 'ping') return ok({});
  if (method === 'tools/list') return ok({ tools: TOOLS });
  if (method === 'tools/call') {
    const h = HANDLERS[params?.name];
    if (!h) return fail(-32602, 'Unknown tool');
    try { return ok({ content: [{ type: 'text', text: await h(env, params.arguments || {}) }] }); }
    catch (e) { return ok({ content: [{ type: 'text', text: 'Not saved: ' + e.message }], isError: true }); }
  }
  return fail(-32601, 'Method not found');
}

export async function handleMcp(request, env) {
  if (request.method === 'GET') return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
  if (request.method === 'DELETE') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { status: 400 }); }
  const msgs = Array.isArray(body) ? body : [body];
  const replies = [];
  for (const m of msgs) if (m && m.id !== undefined && m.method) replies.push(await rpc(env, m));
  if (!replies.length) return new Response(null, { status: 202 });
  return Response.json(Array.isArray(body) ? replies : replies[0]);
}
