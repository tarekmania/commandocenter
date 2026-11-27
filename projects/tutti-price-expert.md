# Tutti

Setup:
- Profile: build
- Repo: tarekmania/tutti-price-expert
- Cadence: daily
- Merge: auto
- Notes: Runs only on command, no background jobs, no Telegram.

Goal: Tutti finds cars on tutti.ch far below market value, and the flips make money

## Route

### API client
> tutti.ch data without a browser scraper
- [ ] Review and merge the API client PR

### Flip finder
> market value adjusted for km, filters, known cost traps, budget per search
- [ ] Merge the flip finder PRs
- [ ] Budget per search setting (in #5: budget per scan, deals over budget incl. costs marked)
- [ ] Cost traps per model (belts, gearboxes): belts in #5, dry dual-clutch gearboxes in #7

### Web app
> scan from the browser, deals and settings
- [ ] Merge the web app PR
- [ ] Merge the report PR

### Online & shareable
> runs on the own server, flip.easyrep.ch, others can use it
- [ ] Running on the own server
- [ ] Reachable at flip.easyrep.ch
- [ ] Login so only invited people can scan (password login and Caddy setup built in #5)

### First profitable flip
> a car bought through Tutti and sold with profit
- [ ] First scan with a real budget
- [ ] Car inspected and bought
- [ ] Car sold with profit
- [ ] Profit noted per flip in the tool

## Notes
- Runs only on command, no background process, no Telegram for now.
- The work of stations 1 to 3 sits in stacked pull requests #1 to #5 (Tarek's own sessions, not station pull requests): merging #5 is the next step. #5 also holds the server setup (deploy/, Infomaniak VPS) for station 4.

## Done (Tarek's word)

## Decisions
- 2026-11-27 Planned the flip ledger instead of building it on top of #7: the stack has waited since 13 Nov and a fourth layer makes it harder to merge; the existing feedback table has no purchase price or costs, so a separate flips table is planned (docs/tutti-price-expert/2026-11-27-flip-ledger.md)
- 2026-11-26 Gearbox cost traps cover only the two well-known dry dual-clutch gearboxes (VW DQ200, Ford PowerShift) from 100'000 km, as a risk cost of CHF 2500 editable in the settings; more models only when a real listing shows one (https://github.com/tarekmania/tutti-price-expert/pull/7)
- 2026-11-26 #7 is stacked on #6 and stays open: this run may not merge, and it must go in after the stack
- 2026-11-25 The station master does not merge the stack itself: #1 to #5 are not its own pull requests and the scheduled run says never merge; merging goes to Tarek
- 2026-11-25 Fixed the ICU test failures in the app, not in the tests: format.ts now always prints ’, so the app looks the same on every machine (https://github.com/tarekmania/tutti-price-expert/pull/6)
- 2026-11-24 Merge is auto: Tarek's own tool, no users yet, runs only on command
- 2026-11-24 The five stacked pull requests are merged as one through #5 after the apostrophe tests are fixed; #1 to #4 are closed as contained in #5

## Needs Tarek
- [ ] 2026-11-26 Merge the stack: #6 and #7 into it, then #5 into master and close #1 to #4 as contained (https://github.com/tarekmania/tutti-price-expert/pull/7)

## Log
- 2026-11-27: No new commits, stack #1 to #7 still open. Found the login and server setup already built in #5 (noted on the route); planned the flip ledger for after the merge (docs/tutti-price-expert/2026-11-27-flip-ledger.md)
- 2026-11-26: Stack still unmerged, no new commits. Budget per search is already in #5. Built gearbox cost traps (DQ200, PowerShift) on top of #6; backend 94/94, frontend 13/13, build ok (https://github.com/tarekmania/tutti-price-expert/pull/7)
- 2026-11-25: Fixed the 4 ICU-dependent frontend tests in format.ts on top of #5; frontend 13/13, build ok, backend 93/93 (https://github.com/tarekmania/tutti-price-expert/pull/6)
- 2026-11-24: No new work: the plan builds on the five unmerged PRs. Checked the stack: linear, #5 contains all; backend tests 93/93, frontend build ok, 4 frontend tests depend on the ICU number format
