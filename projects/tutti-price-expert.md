# Tutti

Setup:
- Profile: build
- Repo: tarekmania/tutti-price-expert
- Cadence: daily
- Notes: Five older pull requests wait for review. Runs only on command, no background jobs, no Telegram.

Goal: Tutti finds cars on tutti.ch far below market value, and the flips make money

Stations (in this order):
1. API client (tutti.ch data without a browser scraper)
2. Flip finder (market value adjusted for km, filters, known cost traps, budget per search)
3. Web app (scan from the browser, deals and settings)
4. Online & shareable (runs on the own server, flip.easyrep.ch, others can use it)
5. First profitable flip (a car bought through Tutti and sold with profit)

Notes:
- Runs only on command, no background process, no Telegram for now.
- The work of stations 1 to 3 sits in open pull requests: merging them is the next step.

Plan (open steps, in order; tick only with evidence):
API client:
- Review and merge the API client PR
Flip finder:
- Merge the flip finder PRs
- Budget per search setting
- Cost traps per model (belts, gearboxes)
Web app:
- Merge the web app PR
- Merge the report PR
Online & shareable:
- Running on the own server
- Reachable at flip.easyrep.ch
- Login so only invited people can scan
First profitable flip:
- First scan with a real budget
- Car inspected and bought
- Car sold with profit
- Profit noted per flip in the tool

## Needs Tarek
- [ ] 2026-11-24 Review and merge the five stacked PRs; they form one line (#1 ⊂ #2 ⊂ #3 ⊂ #4 ⊂ #5), so merge in order 1→5, or merge #5 alone and close the others (https://github.com/tarekmania/tutti-price-expert/pull/5). Checked on #5: backend 93/93 tests pass, frontend builds; 4 frontend tests fail only where Node's ICU 78 writes CHF 12'000 with a plain apostrophe instead of ’ (tests hard-code ’)

## Log
- 2026-11-24: No new work: the plan builds on the five unmerged PRs. Checked the stack: linear, #5 contains all; backend tests 93/93, frontend build ok, 4 frontend tests depend on the ICU number format
