# Tutti: runbook for the first scan with a real budget

Step: "First scan with a real budget" (station First profitable flip). Read from `station/gearbox-costs` (#7, on top of the stack #5/#6), README sections Flip finder, Valuation, Flags, Settings. Written while the stack waits for Tarek's merge; it works the same from the branch or after the merge.

## Before the scan (10 minutes, once)

1. Start the app on the stack branch (`cd backend && npm install && npm start`, open http://localhost:3001), or `npm run scan` in the terminal.
2. Einstellungen, check the cost assumptions against what a flip really costs you: `BASE_COST` (cleaning, transport, plates), `MFK_COST`, `REPAIR_PCT`, `SELL_DISCOUNT`, `TIMING_BELT_COST`, the gearbox risk cost from #7. These decide the profit figure more than anything else. Change them in the app, not in `.env`, so CLI and app agree.
3. Leave the comparable windows and `KM_ADJUST_PER_10K` at their defaults for the first scan: they can only be calibrated with real sale prices, which the first flips will give.

## The scan

- Scan page: budget = the most you would really pay **including** the costs (the tool marks deals where price + costs is over budget, but sorts them last).
- Private sellers only (default), listing age 30 days, max candidates 300. No brand filter for the first run, so the result shows which brands the tool finds best.
- Expect about 300 detail requests plus comparable searches; tutti throttles after about 150 requests within minutes, so the scan pauses and slows itself. Let it run; Ctrl+C or «Abbrechen» stops cleanly and «Fortsetzen» resumes.
- Write the PDF report at the end (Deals page or `npm run scan -- --budget <CHF> --pdf`), so the result of the first scan is kept as it was.

## Reading the deals (per deal, before any contact)

A deal is only worth a call when all of these hold:

| Check | Where | Go | Stop |
|---|---|---|---|
| Confidence | deal card | medium or high | low is never shown as a deal; «widened window» means fewer exact comparables, look twice |
| Comparables | deal detail, list with links | at least 8, most private, same generation of the model | comparables of another generation, or mostly dealers |
| Sold data | value steps | resale base from removed listings is the strongest | only asking prices: treat profit as an upper bound |
| Flags | card and detail | none, or soft ones already priced (MFK, rust, warning light) | scam warning, dealer?, hint WhatsApp + phone only |
| Known costs | cost breakdown, `known` | belt/gearbox listed and priced, or the text says done | engine named in knownCosts but text unclear: ask the seller first |
| Liquidity | detail | several similar listings in the last 60 days, short days on market | almost no similar listings: hard to sell again |
| Days online, price history | detail | recent, or price dropped | long online without a drop: likely a reason |

Then open the listing and the comparable search on tutti.ch and look at the photos yourself: the tool reads condition only from the text.

## After the scan: record it in the tool

- Feedback on every deal you looked at: gut / schlecht (with a note why). «schlecht» notes are what the next keyword and cost changes come from.
- When a car is bought: «gekauft» with the price; when sold: «verkauft» with the price. These are the first real sale prices to calibrate `SELL_DISCOUNT` and the km adjustment, and the input for the planned flip ledger (docs/tutti-price-expert/2026-11-27-flip-ledger.md).

## What the station master does with the result

- From the «schlecht» notes: new hard/soft keywords or exceptions in `keywords.js`, new known costs only when a real listing shows one (decision of 2026-11-26).
- From the first sold car: compare its sale price with `resale_value`; if the gap is larger than `SELL_DISCOUNT`, propose a new default.

## Done when

One scan with a real budget is finished, its report is saved, and every shown deal has gut or schlecht. That ticks "First scan with a real budget"; Tarek says it in a chat ("Done (Tarek's word)").
