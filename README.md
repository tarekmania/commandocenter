# Commandcenter

A wall screen that shows Tarek's projects as a rail network map. Each project is a line, each milestone a station, and AI agents at work are trains. Nothing on it is maintained by hand.

## How it works

1. **A push to any project repo** is noticed within a minute by the Cloudflare worker (`worker/`), which checks GitHub every minute.
2. The worker wakes the **rater** (`.github/workflows/rate.yml`). It waits 45 seconds so pushes that arrive together are rated together.
3. `collect.mjs` gathers the facts from GitHub: last push, commits of the last 14 days, open pull requests, `PROJECT.md` and README.
4. **Claude** (Claude Code, on the Claude subscription) reads the facts and follows `RATER.md`: stations, position, task, held or not, which lines go on the map, the headline. It writes `lines/*.json` and `state.json`.
5. `finalize.mjs` checks the result, adds the facts that must not come from AI (last push, today's starting point for the white "moved today" stretch) and falls back to the last good state if the output is broken.
6. The worker serves the screen (`screen/index.html`) and `state.json` to the Mac mini. The screen reloads the state every 30 seconds and shows the arrival screen when a line reaches a new station.

A daily run at 06:07 catches lines that went quiet without a push.

## Steering a project

Put a `PROJECT.md` into a project repo when you want to set things yourself. The rater always follows it. Useful lines:

```
Name: EasyRep
Stations: Telematics core, Website relaunch, Partner page, App redesign, Lead system
Waiting: PostFinance to approve payments
```

## Secrets

GitHub repo secrets (Settings → Secrets and variables → Actions):
- `CLAUDE_CODE_OAUTH_TOKEN`: from `claude setup-token`
- `CC_READ_TOKEN`: fine-grained token, all repositories, read access to Contents, Metadata and Pull requests

Worker secrets (`npx wrangler secret put …`):
- `CC_READ_TOKEN`: the same read token
- `CC_DISPATCH_TOKEN`: fine-grained token, only this repo, Contents read and write, Actions read
- `SCREEN_KEY`: a long random word; the screen URL is `https://commandocenter.<your-subdomain>.workers.dev/?key=<SCREEN_KEY>`
