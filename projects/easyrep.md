# EasyRep

Setup:
- Profile: lovable
- Repo: tarekmania/easyrep
- Cadence: daily
- Merge: tarek
- Notes: Lovable syncs main both ways. Never push to main. No database migrations or Supabase changes without a Needs Tarek item. The new design stays behind the switch.

Goal: SME fleets in DACH buy EasyRep, and enough of them pay for the Series A story

## Route

### Telematics core
> tracking, trips, inspections, alerts, billing export
- [x] Demo tenant & trip processing · 08ba1b4
- [x] MFK (vehicle inspection) tracking · 893eb10
- [x] Billing export · 2a5745f
- [x] Location filter for the fleet · e458c4a
- [x] Faster per-vehicle trip scan · 767d14d
- [x] Alerts & fault codes · d13370e
- [x] Invoicing through the platform · ee0d6a0

### Website that converts
> new homepage, partner page for workshops, real screenshots
- [x] New homepage (Wise-style) · 5082ba7
- [x] Press & ETH credibility section · c577c32
- [x] Garage partner page /werkstaetten · b84206e
- [x] Realistic app screenshots · 7cc3e17
- [x] Garage portal screenshots · 5acf2ad

### App redesign
> every screen in the new design, new design becomes the default
- [x] Per-user redesign switch · c37e906
- [x] Login, forgot & reset redesigned · 1883cfd
- [x] Overview, map & zones redesigned · d13370e
- [x] New login shown to everyone · fdeb97a
- [x] Security hardening pass · d3e9b5a
- [x] Vehicle list and vehicle page · fe54d9f
- [x] Trips and driving behaviour · 5dbc42f
- [x] Alerts and service orders · afb65ac
- [x] Users, invitations and settings · 457d3e3
- [x] Devices and connections under settings · 7ec6a9b
- [x] Reports and exports · 7ec6a9b
- [x] Driver area redesigned (phone first) · 0f31569
- [x] Garage portal and onboarding (group 9) · a2a67ec
- [ ] Phone layout checked on all screens
- [ ] New design default for all customers
- [ ] Old design removed

### Lead machine
> qualified leads, 50 cold mails a day, workshop campaign, demo bookings
- [ ] Qualified leads from Google Maps signals
- [ ] Lead scoring by fleet size and industry
- [ ] Mail domains warmed up
- [ ] 50 cold mails a day running
- [ ] Workshop partner campaign live
- [ ] Savings calculator on the homepage
- [ ] Demo booking from mail to calendar

### Paying fleets
> first large fleet contract signed, more paying fleets live
- [ ] Large fleet contract signed
- [ ] Trackers installed on the contract fleet
- [ ] First fleet won through a workshop
- [ ] 5 paying fleets
- [ ] 10 paying fleets

## Notes
- Workshops: partner page, workshop portal and invoicing through the platform belong to station 2 and 1.
- The sales tool (needs analysis and proposals) is its own line: EasyRep Sales.
- Business milestones (contracts, live fleets) can only be ticked from "Done (Tarek's word)".

## Done (Tarek's word)

## Decisions
- 2026-11-27 Planned the default switch as one code constant (missing choice = new design, explicit old choice kept), no migration: same easy undo as the login decision; the four pages still old do not block it
- 2026-11-26 Built the audit's phone fixes on a branch without a pull request: the review budget is full (3 of 3), the pull request opens on the first run with room
- 2026-11-25 Closed my PR #18 (group 8 mockups and inventory): Tarek built and merged group 8 in #19, so it only added reference files and held a review slot
- 2026-11-25 Phone check done as a code audit first; the fixes go into one pull request when the review budget has room
- 2026-11-24 Merge stays with Tarek: live product with paying fleets, synced with Lovable

## Needs Tarek
- [ ] 2026-11-27 Review slot blocked: the phone fixes wait on a branch until Bilaro #1, Noble Drive #1 or Tischlein #1 is merged or closed (https://github.com/tarekmania/easyrep/tree/station/phone-layout)

## Log
- 2026-11-27: No new commits on main, review budget full (3 of 3). Planned "New design default for all customers": switch rules, what is still old, the change and its tests (docs/easyrep/2026-11-27-default-rollout.md)
- 2026-11-26: No new commits on main. Review budget full: built fixes 1-3 and 5 from the phone audit on station/phone-layout, build ok, no pull request yet (https://github.com/tarekmania/easyrep/tree/station/phone-layout)
- 2026-11-25: Tarek merged the redesign groups 6 to 9 (#16, #17, #19 to #23); closed obsolete #18; review budget full, so wrote the phone layout audit with 5 concrete fixes (docs/easyrep/2026-11-25-phone-layout-audit.md)
- 2026-11-24: Vehicles (group 4) and trips/drivers (group 5) are merged; prepared group 8: mockups copied and inventory of settings, devices and reports written (https://github.com/tarekmania/easyrep/pull/18)
