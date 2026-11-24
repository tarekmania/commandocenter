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

## Needs Tarek
- [ ] 2026-11-24 Review and merge the live test checklist PR (https://github.com/tarekmania/noble-drive-redo/pull/1)
- [ ] 2026-11-24 Run the live test with one real booking (card and cash) following docs/live-test.md; check the hourly rental-reminders schedule exists
- [ ] 2026-11-24 Plan the admin walkthrough with the B&G team

## Log
- 2026-11-24: SMS found already built; wrote the live test checklist and fixed a stuck-pending SMS case when the gateway key is missing (https://github.com/tarekmania/noble-drive-redo/pull/1)
