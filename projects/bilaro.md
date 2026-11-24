# Bilaro

Setup:
- Profile: build
- Repo: tarekmania/bilaro
- Cadence: daily
- Merge: tarek
- Notes: main deploys to Cloudflare, so all work goes through pull requests.

Goal: Swiss SMEs move from bexio to Bilaro and pay for it

## Route

### Core bookkeeping
> journal, receipts, bank, VAT, statements, invoices, dunning
- [x] Chart of accounts, journal & statements · 56c1913
- [x] Receipts, bank & VAT · 7b345c4
- [x] Period picker & open invoices · 2738741
- [x] Dunning fees and default interest · 5028250
- [x] Two-factor sign-in & team roles · 9681925
- [x] Stripe subscription & webhook · c26f7a9
- [x] Pay supplier invoices via payment file · 032833d
- [x] Swiss payroll: payslips & Lohnausweis · 752ce99

### bexio takeover
> import from bexio export files, balances by cut-off date
- [x] Import bexio contacts & invoices · 1650f9f
- [x] Balance takeover by cut-off date · 9681925
- [x] Fix takeover issues from feedback · f5a647b

### Year-end & VAT
> closing assistant, VAT reconciliation and XML, fixed assets
- [x] Year-end closing assistant · 7f4cfc6
- [x] VAT reconciliation and MWST-XML export · 5028250
- [x] Fixed assets with depreciation · 5133276

### AI connector
> Claude connector with read tools and confirmed write tools
- [x] MCP server with OAuth consent · 2c92149
- [x] Consent page expiry handling · 0dab1ca
- [x] Read tools: search, ledger, accounts · a5c1051
- [x] Write tools with preview & confirm · ee02c4d

### Tester-ready
> feedback rounds fixed, design on the level of the best tools
- [x] Tester round 1: takeover & MWST · f5a647b
- [x] Tester round 2: invoices & contacts · 2738741
- [ ] Tester round 3: bank import & receipts
- [ ] Design pass on all main screens
- [ ] Receipt upload from the phone
- [ ] Real bexio imports of 3 test companies
- [ ] Help texts and first-login guide

### Paying customers
> own company's books in Bilaro, first SMEs fully off bexio, public pricing and sign-up
- [ ] Own company closes 2026 in Bilaro
- [ ] Pricing page on bilaro.ch
- [ ] Self sign-up with trial and Stripe
- [ ] First fiduciary partner using Bilaro
- [ ] First 3 paying SMEs
- [ ] First SME fully off bexio
- [ ] 10 paying SMEs

## Notes
- Billing, roles and two-factor sign-in belong to Core bookkeeping.
- No longer focused on garages; Swiss SMEs in general.

## Done (Tarek's word)

## Needs Tarek
- [ ] 2026-11-24 Review and merge the phone receipts PR (https://github.com/tarekmania/bilaro/pull/1)
- [ ] 2026-11-24 Run tester round 3 (bank import & receipts) with the testers and share the feedback
- [ ] 2026-11-24 Provide bexio export files of 3 test companies for the real import test

## Log
- 2026-11-24: Receipt upload from the phone: installable web app (manifest, icons, shortcut) and phone link on Belege; build, lint and 310 tests ok (https://github.com/tarekmania/bilaro/pull/1)
