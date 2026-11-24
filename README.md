# Commandcenter

A wall screen that shows Tarek's projects as a rail network map. Each project is a line, each milestone a station, and AI agents at work are trains. Nothing on it is maintained by hand.

## How it works

1. **Every project has one file**, `projects/<id>.md`: goal, stations, steps, Tarek's word, Claude's decisions, what waits for Tarek. `STANDARD.md` is the rulebook. Claude owns the plans; Tarek has the last word.
2. **A push to any repo** (forks too, once Tarek has his own commits in them) is noticed within a minute by the Cloudflare worker (`worker/`), which wakes the rater (`.github/workflows/rate.yml`).
3. `collect.mjs` gathers the facts from GitHub for the repos that changed. **Claude** follows `RATER.md`: ticks finished steps and adds work no step foresaw. `finalize.mjs` builds `state.json` without AI. Projects without a repo yet (`Repo: none`) come from their file alone.
4. **Claude chats write to the project files directly** through the Commandcenter connector (`worker/src/mcp.js`): something done, a new plan, a rule, a decision. The address is shown at `/connector?key=<SCREEN_KEY>`; add it as a custom connector in Claude.
5. **The station master** (a nightly scheduled task, `WORKER.md`) catches up on what chats missed, keeps each plan right, does the next step per project and sends a morning note.
6. The worker serves the screen (`screen/index.html`, read from this repo) and `state.json` to the Mac mini.

## Secrets

GitHub repo secrets (Settings → Secrets and variables → Actions):
- `CLAUDE_CODE_OAUTH_TOKEN`: from `claude setup-token`
- `CC_READ_TOKEN`: fine-grained token, all repositories, read access to Contents, Metadata and Pull requests

Worker secrets (`npx wrangler secret put …`):
- `CC_READ_TOKEN`: the same read token
- `CC_DISPATCH_TOKEN`: fine-grained token, only this repo, Contents read and write, Actions read
- `SCREEN_KEY`: a long random word; the screen URL is `https://commandocenter.<your-subdomain>.workers.dev/?key=<SCREEN_KEY>`
