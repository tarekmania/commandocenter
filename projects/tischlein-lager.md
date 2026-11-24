# Tischlein Lager

Setup:
- Profile: build
- Repo: tarekmania/tischlein-lager
- Cadence: weekly
- Notes: Built for Tischlein deck dich. Anything the client sees or decides is a Needs Tarek item.

Goal: Tischlein deck dich runs its warehouses on this tool instead of Rocklog, and buys it

Stations (in this order):
1. Warehouse model (3D warehouse, real layout, stock)
2. Picking & stock (picklists, goods-in, expiry, barcode, Excel import)
3. Drivers & sites (driver app on the phone, several sites, management overview)
4. Presented (documents and presentation for the team and management)
5. Pilot (the real team in Staufen works with it)
6. Sold & rolled out (contract signed, Rocklog switched off)

Plan (open steps, in order; tick only with evidence):
Presented:
- On-site presentation to management
Pilot:
- Pilot with the real team in Staufen
- Drivers use the phone app daily
- Pilot feedback fixed
- Vans tracked with EasyRep trackers (CSV import of EasyRep trips into the comparison: #1; next: upload in the admin, real plates)
Sold & rolled out:
- Offer and price sent
- Contract signed
- Data moved over from Rocklog
- Rocklog switched off
- Second site onboarded

## Needs Tarek
- [ ] 2026-11-24 Review the EasyRep trip import PR (https://github.com/tarekmania/tischlein-lager/pull/1)
- [ ] 2026-11-24 Schedule the on-site presentation to management in Staufen
- [ ] 2026-11-24 Give the plates of the Tischlein vans and confirm the tour gap (120 min) for the EasyRep match

## Log
- 2026-11-24: Built the import of EasyRep's trip export («Fahrten einzeln») into the driver-record comparison, with tests (https://github.com/tarekmania/tischlein-lager/pull/1)
