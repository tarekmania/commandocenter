# Tischlein Lager

Setup:
- Profile: build
- Repo: tarekmania/tischlein-lager
- Cadence: weekly
- Merge: tarek
- Notes: Built for Tischlein deck dich. Anything the client sees or decides is a Needs Tarek item.

Goal: Tischlein deck dich runs its warehouses on this tool instead of Rocklog, and buys it

## Route

### Warehouse model
> 3D warehouse, real layout, stock
- [x] Scaffold, layout & domain model · 83543e5
- [x] Static 3D scene from layout · 2af0aed
- [x] Seed inventory & tooltips · dc6b3ab
- [x] Real layout, fleet & tour plan · 7208f64
- [x] Sim clock, vehicles & workers · b594083

### Picking & stock
> picklists, goods-in, expiry, barcode, Excel import
- [x] Picklists & Lieferschein · ed8137f
- [x] Stock entries & expiry rules · f301b9d
- [x] Barcode scan & Excel import · 834a006
- [x] Direct storage at goods-in · 1f9a5f1
- [x] Weight-based F&G/FriPro goods · 9a588f9

### Drivers & sites
> driver app on the phone, several sites, management overview
- [x] Driver app: trips & Spender · 67fec99
- [x] Live mode: roles, multi-site · 846bc61
- [x] Transfers & institutions · 680202b
- [x] Test access for stakeholders · 7a2189e

### Presented
> documents and presentation for the team and management
- [x] 5 presentation docs for staff · 14d9aad
- [x] Review fixes on stock overview · f0f7486
- [ ] On-site presentation to management

### Pilot
> the real team in Staufen works with it
- [x] Test deploy on Cloudflare Pages · 483b3e4
- [ ] Pilot with the real team in Staufen
- [ ] Drivers use the phone app daily
- [ ] Pilot feedback fixed
- [ ] Vans tracked with EasyRep trackers

### Sold & rolled out
> contract signed, Rocklog switched off
- [ ] Offer and price sent
- [ ] Contract signed
- [ ] Data moved over from Rocklog
- [ ] Rocklog switched off
- [ ] Second site onboarded

## Done (Tarek's word)

## Needs Tarek
- [ ] 2026-11-24 Review the EasyRep trip import PR (https://github.com/tarekmania/tischlein-lager/pull/1)
- [ ] 2026-11-24 Schedule the on-site presentation to management in Staufen
- [ ] 2026-11-24 Give the plates of the Tischlein vans and confirm the tour gap (120 min) for the EasyRep match

## Log
- 2026-11-24: Built the import of EasyRep's trip export («Fahrten einzeln») into the driver-record comparison, with tests (https://github.com/tarekmania/tischlein-lager/pull/1)
