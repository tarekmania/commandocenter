# EasyRep: phone layout audit of the new design

Step: "Phone layout checked on all screens" (station App redesign). Code audit of `src/redesign` at main `a2a67ec`, for widths 360-390 px. Written while the review budget was full, so the fix can go into one pull request on the next run.

## What already works on phones

- Shell: sidebar hidden under 768 px, bottom bar with 44 px targets and safe-area padding, search collapses to an icon (`styles/shell.css`).
- Every wide table except one sits in `.er-scroll` (horizontal scroll inside its panel).
- Stat tiles drop to 2 columns under 768 px (vehicles, trips, drivers, alerts, portal, reports, workshop).
- Two-pane layouts (alerts, rules, customers, trips, reports, settings) stack to one column at 900-1100 px.
- Map cards become a bottom sheet under 768 px (`.er-lmap .er-mapcard`, `width: auto !important` beats the inline 340 px of the zone editor).
- Dialogs: `ErDialog` uses `min(width, 100vw - 32px)`.
- Workshop board scrolls sideways on purpose (5 columns × 240 px).

## Problems found

| # | Where | Problem on a 375 px phone | Fix |
|---|---|---|---|
| 1 | `styles/design-system.css:259` `.er-formgrid` | Always 2 columns. Used in vehicle, driver and rule dialogs, devices and the phone-first driver home. In a dialog the content is 287 px wide, so each field is about 135 px: labels wrap, dates and plates get cut. | `@media (max-width: 559px) { .er-formgrid { grid-template-columns: minmax(0, 1fr); } }` |
| 2 | `styles/shell.css:113` `.er-modal` | 28 px padding and `top: max(48px, 10vh)` leave little room; with the keyboard open the actions scroll out of view. | Under 768 px: `padding: 20px; top: 16px; max-height: calc(100dvh - 32px);` |
| 3 | `pages/drivers/DriverPage.tsx:244` week table | The only table without `.er-scroll`. 5 columns fit at 375 px today, but German labels or long values push the page sideways. | Wrap it in `<div className="er-scroll">`. |
| 4 | `styles/design-system.css:355` `.er-table td { white-space: nowrap; }` | Fine inside `.er-scroll`, but combined with #3 it is what makes the page overflow. | Covered by #3. |
| 5 | `styles/design-system.css:220` `.er-search` | 320 px fixed width between 768 and 1199 px next to the org switch; tablets in portrait can push the top bar. | `width: min(320px, 40vw)` |

Not a problem: `.er-attn .er-row` (176 px first column) is no longer used by any page; the overview uses `.er-attnrow`.

## Pages still in the old design inside the new shell

Every dashboard route not in `src/redesign/redesignedRoutes.ts` renders the legacy page in `.er-legacy`. These are not part of this check; they go with "Old design removed".

## How to check after the fix

Run the app, sign in with the demo tenant, switch the new design on, and open each route in `redesignedRoutes.ts` at 375 × 812 (Playwright `devices['iPhone 13']`). Pass = no horizontal page scroll (`document.documentElement.scrollWidth <= innerWidth`) and every dialog's buttons visible. Do it on Tarek's preview as well before ticking the step.
