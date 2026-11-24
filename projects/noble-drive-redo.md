# Noble Drive

Setup:
- Profile: build
- Repo: tarekmania/noble-drive-redo
- Cadence: daily
- Notes: Client project for B&G Autovermietung. Anything the client sees or decides is a Needs Tarek item.

Goal: B&G Autovermietung's customers book and pay online, and the team runs everything from one admin

Stations (in this order):
1. Vehicle catalog (listing, availability, DE/EN)
2. Booking flow (contract, signature, payment, hourly billing)
3. Admin & CRM (bookings, customers, protocol, secure uploads)
4. Live (own domain, e-mail and SMS notifications)
5. Handed over (client accepted the system and uses it daily)

Notes:
- Client project for B&G Autovermietung.

Plan (open steps, in order; tick only with evidence):
Live:
- SMS notifications (built: confirmation, pickup and return reminders; live test open)
- Booking and reminder mails tested end to end (checklist: docs/live-test.md in #1)
- Real payment tested with a live booking (same checklist)
Handed over:
- Admin walkthrough with the client team
- Test week with real bookings
- Client feedback fixed
- Client signs off
- Final invoice paid

## Needs Tarek
- [ ] 2026-11-24 Review and merge the live test checklist PR (https://github.com/tarekmania/noble-drive-redo/pull/1)
- [ ] 2026-11-24 Run the live test with one real booking (card and cash) following docs/live-test.md; check the hourly rental-reminders schedule exists
- [ ] 2026-11-24 Plan the admin walkthrough with the B&G team

## Log
- 2026-11-24: SMS found already built; wrote the live test checklist and fixed a stuck-pending SMS case when the gateway key is missing (https://github.com/tarekmania/noble-drive-redo/pull/1)
