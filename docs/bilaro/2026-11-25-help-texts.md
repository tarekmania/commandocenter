# Bilaro: help texts on the main screens

Step: "Help texts and first-login guide" (station Tester-ready). Planned while the review budget was full; the build goes into one pull request on a later run.

## What exists (main `7ffc176`)

- First-login guide: `/start` with three paths (new, switch, later) and seven setup tasks with progress read from the data (`src/features/onboarding/`, since 9681925, start page only for new companies since 7ffc176). That half of the step is done.
- Every main page has a one-line `PageHeader` subtitle.
- Missing: help where SME owners get stuck on a concept, not on a page. There is no help component yet (only Cmd+K and the «Rückmeldung» button).

## Proposal

One small component `src/ui/HelpTip.tsx`: a «?» button next to a label that opens a popover with 1-3 sentences and an optional «Mehr» link. Texts live in one file `src/lib/helpTexts.ts` (id → title, text), so they can be edited in one place and searched by Cmd+K («Was ist ein Stichtag?»). No new dependency: use the existing popover/drawer pattern from `src/ui`.

## Draft texts (German, Swiss spelling)

| id | Where | Text |
|---|---|---|
| `score` | Bank and Belege, the coloured score | Grün: Bilaro ist sicher und Sie können mit «Alle sicheren buchen» bestätigen. Gelb: bitte kurz prüfen. Rot: Bilaro kennt diese Zahlung noch nicht – wählen Sie das Konto, Bilaro merkt es sich für das nächste Mal. |
| `stichtag` | Daten übernehmen | Bis zum Stichtag bucht Ihr bisheriges Programm, ab dem Stichtag bucht Bilaro. So zählt keine Zahlung doppelt und keine fehlt. |
| `storno` | Buchungen, Rechnung stornieren | Gebuchtes wird nie gelöscht. Ein Storno bucht dasselbe in umgekehrter Richtung; beide Buchungen bleiben sichtbar, wie es das Gesetz verlangt. |
| `mwst-methode` | Einstellungen → MWST | Vereinbarte Entgelte: die MWST zählt, sobald die Rechnung geschrieben ist. Vereinnahmte Entgelte: erst wenn das Geld da ist. Im Zweifel steht die Methode im Brief der ESTV. |
| `saldosteuersatz` | Einstellungen → MWST | Mit Saldosteuersatz rechnen Sie die MWST pauschal auf dem Umsatz ab und ziehen keine Vorsteuer ab. Bilaro rechnet dann ohne Vorsteuer auf Belegen. |
| `spaeter` | Bank, «Später» | Legt eine Zahlung zur Seite, ohne sie zu buchen. Sie bleibt offen und kommt mit «Zurückholen» wieder. |
| `qr-rechnung` | Rechnung, Einzahlungsschein | Der QR-Einzahlungsschein braucht eine QR-IBAN oder IBAN Ihres Bankkontos. Zahlungen mit der Referenz erkennt Bilaro auf dem Auszug von selbst. |
| `mahnstufe` | Rechnungen, Mahnen | Jede Stufe setzt eine neue Frist. Gebühren und Verzugszins legen Sie unter Einstellungen → Mahnwesen fest; Bilaro bucht sie mit. |
| `abschluss` | Jahresabschluss | Der Assistent führt in sieben Schritten zum Abschluss. Danach ist das Jahr gesperrt; Korrekturen gehen nur noch über das neue Jahr. |
| `rollen` | Einstellungen → Team | Inhaber: alles. Treuhänder: alles ausser Team. Mitarbeitende: Verkauf, Kontakte, Belege hochladen. Nur lesen: sieht alles, ändert nichts. |

Each text must be checked against the code before it ships (for example the closing lock and the Saldosteuersatz handling).

## Build order for the pull request

1. `HelpTip` + `helpTexts.ts` with a test that every id used in the UI exists.
2. Place the tips at the ten spots above.
3. Cmd+K: add the help texts as a search group.
4. `npm run build`, `npm test`, `npm run lint`.
