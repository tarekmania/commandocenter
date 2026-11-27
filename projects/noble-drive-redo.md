# Noble Drive

Setup:
- Profile: build
- Repo: tarekmania/noble-drive-redo
- Cadence: daily
- Merge: tarek
- Notes: Client project for B&G Autovermietung. Anything the client sees or decides is a Needs Tarek item.

Goal: B&G Autovermietung's customers book and pay online, and the team runs everything from one admin

## Route

### Vehicle catalog
> listing, availability, DE/EN
- [x] Vehicle listing with logos · e51ce33
- [x] Grouped models, live availability · 9d4feb4
- [x] Multi-language site (DE/EN) · 59d831a

### Booking flow
> contract, signature, payment, hourly billing
- [x] Signature, contract & checkout · 874ed30
- [x] Pay-on-pickup wording update · a3ce082
- [x] Hourly billing · 843e6de
- [x] Payment step in checkout · 7344875
- [x] Booking button re-enabled · ac14156

### Admin & CRM
> bookings, customers, protocol, secure uploads
- [x] Collapsible admin sidebar · b4546ba
- [x] Booking delete with confirm dialog · c4eb854
- [x] Protocol/log on bookings · 907a90a
- [x] Locked down public writes/uploads · 935a55a

### Live
> own domain, e-mail and SMS notifications
- [x] Custom domain & DNS · 49c9658
- [x] Email notification infra · a4f2882
- [x] SMS notifications · Tarek
- [ ] Reminders reach short and hourly rentals
- [ ] Booking and reminder mails tested end to end
- [ ] Real payment tested with a live booking

### Handed over
> client accepted the system and uses it daily
- [ ] Admin walkthrough with the client team
- [ ] Test week with real bookings
- [ ] Client feedback fixed
- [ ] Client signs off
- [ ] Final invoice paid

## Notes
- Client project for B&G Autovermietung.

## Done (Tarek's word)

## Decisions
- 2026-11-27 Added the step "Reminders reach short and hourly rentals" before the end-to-end test: the hourly run only looked at a one-hour slice, so hourly rentals, a missed run or a failed send got no reminder; built the fix on a branch without a pull request because the review budget is full
- 2026-11-26 Wrote the test week plan myself (what each booking must go through, a 10-minute daily check, pass criteria); running it with the team needs Tarek and comes after the walkthrough
- 2026-11-25 Wrote the walkthrough script myself instead of leaving "plan the walkthrough" to Tarek: only holding the session needs him
- 2026-11-24 Merge stays with Tarek: client project, B&G's customers book on it

## Needs Tarek
- [ ] 2026-11-24 Review and merge the live test checklist PR (https://github.com/tarekmania/noble-drive-redo/pull/1)
- [ ] 2026-11-24 Run the live test with one real booking (card and cash) following docs/live-test.md; check the hourly rental-reminders schedule exists
- [ ] 2026-11-25 Hold the admin walkthrough with the B&G team using the script (docs/noble-drive-redo/2026-11-25-admin-walkthrough.md)

## Log
- 2026-11-27: No new commits on main, PR #1 still open, review budget full. Found that rental-reminders misses short rentals and missed runs; built catch-up windows with tests on a branch, tests 13/13 and build ok, no pull request yet (https://github.com/tarekmania/noble-drive-redo/tree/station/reminder-catch-up)
- 2026-11-26: No new commits on main, PR #1 still open; review budget full, so wrote the test week plan from the booking, payment and reminder code (docs/noble-drive-redo/2026-11-26-test-week.md)
- 2026-11-25: No new commits on main; review budget full, so wrote the 60-minute admin walkthrough script for the B&G team (docs/noble-drive-redo/2026-11-25-admin-walkthrough.md)
- 2026-11-24: SMS found already built; wrote the live test checklist and fixed a stuck-pending SMS case when the gateway key is missing (https://github.com/tarekmania/noble-drive-redo/pull/1)
