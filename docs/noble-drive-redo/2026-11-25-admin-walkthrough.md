# Noble Drive: admin walkthrough with the B&G team

Step: "Admin walkthrough with the client team" (station Handed over). Script for Tarek to run the session; built from the admin pages on main `c4eb854` (`src/pages/admin/`). About 60 minutes. Best done after the live test (one real booking, card and cash), so that booking can be shown end to end.

## Before the session

- One admin login per person who will use the admin (Einstellungen → Benutzer & Rollen → «Neue E-Mail einladen»). Check each person can sign in at `/admin/login`.
- One test booking from the public site with ID photos, so the booking detail is not empty. Delete it afterwards («Buchung endgültig löschen?»).
- Firmenstammdaten and the extension discounts («Verlängerungs-Rabatte») filled in, since they appear on contracts and prices.

## Agenda

| Min | Page | Show | Let them do |
|---|---|---|---|
| 0-5 | Dashboard («B&G Cockpit») | Upcoming pick-ups, latest bookings, fleet calendar, 12-week chart | Find tomorrow's pick-ups |
| 5-20 | Buchungen → a booking | Status and payment status, ID front/back with recognised data («Erkannte Daten», only empty fields are overwritten), contract, pick-up and return protocol, reminder sent, follow-up bookings (extensions) | Take over the ID data; set a booking to picked up |
| 20-25 | Buchungen → «Neue Buchung» | Manual booking for phone customers: vehicle, period, daily rate, total | Enter a phone booking |
| 25-35 | Fahrzeuge | Availability, manual status and blocks («Sperre hinzufügen») with optional auto reset, upcoming bookings per vehicle | Block a car for service until a date |
| 35-40 | Verträge | Generated rental contracts, signed or not, printed or not | Print an unprinted contract |
| 40-45 | Fahrer / Kunden | Driver licence check and validity, customers with and without bookings | Find a customer's history |
| 45-50 | Behördenauskunft | Who drove a car at a given date and time (for fines and police requests) | Look up a vehicle at a past time |
| 50-55 | Berichte / Aktivität | Revenue per month and per vehicle, top vehicles; full log of every admin action | — |
| 55-60 | Questions | Collect wishes and problems | — |

## What to write down

- Every problem or wish in one line, with the page. These become the steps of "Client feedback fixed"; Tarek can paste them in a chat and the Commandcenter records them.
- Who in the team does what (bookings, cars, contracts), so the roles in Einstellungen match.
- Whether the test week («Test week with real bookings») can start, and from which day.

## Not part of the session

Payment provider settings, SMS and e-mail provider keys, domain: those stay with Tarek.
