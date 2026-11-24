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

## Needs Tarek
- [ ] 2026-11-24 Review the open redesign PRs: alerts (https://github.com/tarekmania/easyrep/pull/16), workshop (https://github.com/tarekmania/easyrep/pull/17), group 8 inventory (https://github.com/tarekmania/easyrep/pull/18)

## Log
- 2026-11-24: Vehicles (group 4) and trips/drivers (group 5) are merged; prepared group 8: mockups copied and inventory of settings, devices and reports written (https://github.com/tarekmania/easyrep/pull/18)
