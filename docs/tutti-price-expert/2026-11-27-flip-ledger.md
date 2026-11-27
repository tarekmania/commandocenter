# Tutti: plan for "Profit noted per flip in the tool"

Step: "Profit noted per flip in the tool" (station First profitable flip). Read from branch `station/gearbox-costs` (#7, on top of the unmerged stack #1 to #6). Written instead of a new stacked pull request: the stack has waited since 13 Nov and every further branch on top makes it harder to merge.

## What exists

- `feedback` table (`backend/src/db/migrations/001_init.sql`): `listing_id`, `verdict` (`good | bad | bought | sold`), `resale_price`, `note`, `created_at`. Append-only.
- `POST /api/listings/:id/feedback` (`backend/src/app/api.js`) writes it; `GET /api/stats` counts it.
- `reported` table: `price_at_report` and `profit_at_report` for every deal shown, so the tool's own forecast is already kept.
- The web app (`frontend-app/`) does not call the feedback route at all: there is no way to mark a car as bought or sold in the interface.
- Missing for a real profit: the price actually paid (often below the listing price after haggling), the real costs (repairs, MFK, transfer, ads) and the dates.

## The change (one pull request after the stack is merged)

1. Migration `004_flips.sql`:
   ```sql
   CREATE TABLE flips (
     listing_id TEXT PRIMARY KEY REFERENCES listings (id),
     bought_at TEXT NOT NULL,
     buy_price INTEGER NOT NULL,
     costs TEXT NOT NULL DEFAULT '[]',   -- JSON [{label, amount}]
     sold_at TEXT,
     sell_price INTEGER,
     note TEXT,
     updated_at TEXT NOT NULL
   );
   ```
   One row per car, editable (unlike `feedback`). The `bought`/`sold` feedback verdicts stay for the existing stats.
2. Backend `backend/src/flip/ledger.js` (pure): `flipResult(flip, reported)` returns real profit (`sell_price - buy_price - sum(costs)`), days held, and the forecast from `reported.profit_at_report` with the difference. Unit tests next to the other `flip/` tests.
3. Routes: `PUT /api/flips/:listingId` (create or update, same validation style as the feedback route), `GET /api/flips` (all flips with `flipResult`, totals).
4. Web app: a «Gekauft» button on `DealCard` opens a small form (price paid, date); a «Flips» view lists each car with costs, sale and profit, and the total. Amounts with `format.ts` (Swiss ’).
5. Feedback loop: in the «Flips» view show forecast vs real per car. When real costs keep beating a cost trap (for example the DQ200 risk cost of CHF 2500), that is the evidence to change the default in `knownCosts.js`.

Check: backend tests, frontend tests and build, one flip entered by hand in the local app.

## Order

1. Tarek merges the stack (#6 and #7 into #5, #5 into master).
2. This change as its own branch from master.
3. Ticks "Profit noted per flip in the tool"; "First scan with a real budget" and the buying and selling stay with Tarek.
