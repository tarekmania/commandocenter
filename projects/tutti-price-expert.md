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
- [ ] Budget per search setting
- [ ] Cost traps per model (belts, gearboxes)

### Web app
> scan from the browser, deals and settings
- [ ] Merge the web app PR
- [ ] Merge the report PR

### Online & shareable
> runs on the own server, flip.easyrep.ch, others can use it
- [ ] Running on the own server
- [ ] Reachable at flip.easyrep.ch
- [ ] Login so only invited people can scan

### First profitable flip
> a car bought through Tutti and sold with profit
- [ ] First scan with a real budget
- [ ] Car inspected and bought
- [ ] Car sold with profit
- [ ] Profit noted per flip in the tool

## Notes
- Runs only on command, no background process, no Telegram for now.
- The work of stations 1 to 3 sits in stacked pull requests #1 to #5: merging #5 is the next step.

## Done (Tarek's word)

## Decisions
- 2026-11-24 Merge is auto: Tarek's own tool, no users yet, runs only on command
- 2026-11-24 The five stacked pull requests are merged as one through #5 after the apostrophe tests are fixed; #1 to #4 are closed as contained in #5

## Needs Tarek

## Log
- 2026-11-24: No new work: the plan builds on the five unmerged PRs. Checked the stack: linear, #5 contains all; backend tests 93/93, frontend build ok, 4 frontend tests depend on the ICU number format
