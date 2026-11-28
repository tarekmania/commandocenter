# Bilaro: design pass audit against DESIGN.md

Step: "Design pass on all main screens" (station Tester-ready). Read from main `7ffc176`. Written while the review budget is full, so the fixes can go into one small pull request when there is room. Checked by reading the code against `DESIGN.md`, not by screenshots.

## What already follows DESIGN.md

- One `Button` component (`src/ui/index.tsx`) with the variants primary, secondary, outline, ghost, danger; default is secondary.
- One indigo action per band holds on the main pages: Bank (header «Kontoauszug importieren», list band «Alle sicheren buchen»), Belege (header «Foto aufnehmen», list band «Alle sicheren buchen»), Anlagen (header «Anlage erfassen», due band «Abschreibungen buchen»). The other primaries are in drawers, confirm steps or empty states.
- No decorative gradients outside `src/index.css`; no `ß` in labels; weights above 600 only in printed documents (payslip, statements, invoice PDF), which is correct for print.
- Vehicle and MFK wording is behind `FEATURES.vehicles = false` (`src/app/features.ts`), so the garage wording does not show for new companies.

## Problems found

### 1. Green and yellow badges outside the AI score (most visible)

DESIGN.md: green, yellow and red are only for AI scores, except the states "paid" and "overdue". These badges break the rule, so a user reads them as a score:

| Where | Badge | Proposed tone |
|---|---|---|
| `src/features/sales/model.ts:174`, `src/features/contacts/data.ts:65` | Angenommen (quote) green | indigo (`blue`) |
| `src/features/sales/model.ts:177` | Verrechnet (credit note) green | neutral |
| `src/features/sales/model.ts:178` | Mahnung Versendet/Erstellt yellow | neutral |
| `src/features/sales/model.ts:181`, `src/features/contacts/data.ts:66` | Teilbezahlt yellow | indigo |
| `src/features/sales/SalesListPage.tsx:148` | Gemahnt «n. Stufe» yellow | neutral for stage 1–2, red from stage 3 (it is overdue) |
| `src/features/settings/RemindersTab.tsx:110` | Stufe 2 yellow | same rule as above |
| `src/features/bank/LineDrawer.tsx:266`, `src/features/receipts/ReceiptsPage.tsx:395`, `src/features/receipts/ReceiptDrawer.tsx:155` | Gebucht green | neutral with the check icon |
| `src/features/bank/BankPage.tsx:492-493` | Saldo «Stimmt» green, «Differenz bestätigt» yellow | neutral with check; «Differenz bestätigt» neutral |
| `src/features/contacts/ContactDetailPage.tsx:141` | Archiviert yellow | neutral |

Kept: «Bezahlt» green (paid), «überfällig» red (overdue), the score legend on `/start` (`StartPage.tsx:159`, it explains the score).

The cleanest change is one helper `statusTone(kind)` next to `Badge`, so the rule lives in one place, plus a test that `docStatus` never returns green or yellow except for paid.

### 2. Colours written as hex instead of tokens

| File | Value | Token |
|---|---|---|
| `src/features/dashboard/IncomeChart.tsx:7-8` | `#533afd`, `#b9b9f9` | `var(--primary)`; the light series has no token: add `primary-soft` (or use `hairline-strong`) |
| `src/features/reports/reports.css:23` | `#f5c2cf` (late aging cell) | `score-red-bg` is for scores; use `hairline-strong` plus red text, or add a `danger-soft` token |
| `src/features/reports/reports.css:40` | `#f3f4f6` (opening row, print) | `canvas-soft` |
| `src/features/closing/closing.css:45-46` | `#425466`, `#0a2540` | `body`; `#0a2540` is not in the palette, use `ink` |
| `src/features/accounting/accounting.css:73` | `#ddd` (print card border) | `hairline-strong` |
| dashboard, takeover, import, receipts, contacts, auth CSS | `#fff` on navy or indigo | `on-primary` / `canvas` |

### 3. Inline styles instead of shared classes

Most inline styles are paddings on cards and wrapping rows: `BankPage.tsx` 24, `JournalPage.tsx` 14, `AssetsPage.tsx` 13, `ContactImport.tsx` 10, `LineDrawer.tsx` 10, `DashboardPage.tsx` 9. The same values repeat (`padding: '0 24px 16px'` three times on the bank page alone). Two utilities in `src/index.css` cover most of them: `.card-pad` (`0 24px 16px`) and `.card-pad-top` (`18px 24px`); the unstyled text buttons (`BankPage.tsx`, `textAlign: 'left', background: 'none', border: 0 …`) become one `.link-row` class.

## The change, in order

1. Badge tones (problem 1): one helper, nine call sites, one test. Biggest visible effect, no layout change.
2. Tokens (problem 2): CSS only, plus the chart colours read from CSS variables.
3. Inline styles (problem 3): the three pages with the most, Bank, Journal, Anlagen; the rest in a later pass.

Check: `npm run build`, `npm run lint`, `npm test`; then open Verkauf, Bank, Belege, Kontakt-Detail and Berichte on the test project and compare badges with the score colours.

## Risk

Visual only, no data and no logic touched. Undo is a revert of one pull request.
