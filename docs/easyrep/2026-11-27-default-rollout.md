# EasyRep: plan for "New design default for all customers"

Step: "New design default for all customers" (station App redesign), the step after the phone fixes (branch `station/phone-layout`). Read from main `a2a67ec`. Written while the review budget was full, so the change can be built in one small pull request when there is room.

## How the switch works today

- `src/redesign/newUi.ts`: `resolveNewUi(available, preference) = available && preference`.
  - `available`: the user's own organisation has `org_features.new_ui_beta = true` (only the demo seed sets it, `supabase/functions/_shared/seedHaustechnikDemo.ts:157`).
  - `preference`: `user_preferences.new_ui` of the user; a missing row counts as `false` (`parsePreference`).
- The browser keeps a copy (`localStorage easyrep_new_ui`) for first paint and the 404 page.
- Login, forgot and reset password are already new for everyone (`NEW_AUTH_PAGES_FOR_ALL = true` in `src/redesign/DashboardLayout.tsx`).
- `PageSwitch` gives mechanics (workshop users) the old page inside the new shell on the four `fleetOnly` routes: vehicles, vehicle page, maintenance, reports.

So today a real customer sees the new design only if their org has the beta row and the user switched it on.

## What is still old inside the new shell

| Route | Old page | Who opens it | Blocks the default? |
|---|---|---|---|
| `/dashboard/requests/:id` | `RequestDetail.tsx` (313 lines) | fleet managers from workshop orders | No: renders in `.er-legacy`, works |
| `/dashboard/portal/calendar` | `WorkshopCalendar.tsx` (1,484 lines) | workshops | No, same |
| `/dashboard/super-admin` | `SuperAdmin.tsx` (296 lines) | only EasyRep staff | No |
| vehicles, vehicle, maintenance, reports for mechanics | old pages | workshops | No, same |

None of these blocks the default: they keep working, they only look old. They belong to the next step, "Old design removed".

## The change (no database migration, no Supabase setting)

Same pattern as the login decision of 19 Nov: one constant in code, easy to undo.

1. `newUi.ts`: add `export const NEW_UI_DEFAULT_FOR_ALL = true;` and make the preference tri-state:
   - `parsePreference(undefined | null) -> null` (no choice made), `true`/`false` as today.
   - `resolveNewUi(available, preference)`: when `NEW_UI_DEFAULT_FOR_ALL`, return `preference !== false` (everyone gets the new design unless they explicitly chose the old one); otherwise the current rule.
2. `useNewUi.ts`: with `NEW_UI_DEFAULT_FOR_ALL`, `useNewUiAvailable()` returns `available: true` without the org query, so the switch in the user menu is shown to everyone (it becomes the way back to the old design).
3. `readStoredNewUi()`: a missing localStorage key means "new" when `NEW_UI_DEFAULT_FOR_ALL`, so the first paint does not flash the old layout.
4. Tests in `src/redesign/newUi.test.ts`: missing preference -> new; explicit `false` -> old; constant off -> old behaviour unchanged.
5. Pull request text: what changes for customers, and that setting the constant to `false` undoes it.

Check: `npm run build`, `npx vitest run src/redesign`, then the phone check from `2026-11-25-phone-layout-audit.md` at 375 x 812 on the demo tenant, with a user who has no `new_ui` row.

## Order

1. Phone fixes pull request (`station/phone-layout`) merged.
2. This change as its own pull request; Tarek merges it, which is the moment customers see the new design.
3. Two weeks later, "Old design removed": drop the switch, `AppLayout`, the 17 legacy pages behind `PageSwitch` and redesign the four still-old pages above, in groups like the redesign.

## Risk

- Customers see the new design at once after the merge. Undo = one constant, no data touched.
- Users who switched the new design off keep the old one; nobody loses a choice.
