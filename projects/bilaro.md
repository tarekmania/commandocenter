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
> journal, receipts, bank, VAT, statements, invoices, dunning, billing, roles
- [x] Chart of accounts, journal & statements · 56c1913
- [x] Receipts, bank & VAT · 7b345c4
- [x] Period picker & open invoices · 2738741
- [x] Dunning fees and default interest · 5028250
- [x] Two-factor sign-in & team roles · 9681925
- [x] Stripe subscription & webhook · c26f7a9
- [x] Pay supplier invoices via payment file · 032833d

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

### Payroll
> employees, monthly runs, social insurances, source tax, payslips, Lohnausweis
- [x] Employees and monthly pay runs · 752ce99 · 2026-11-24
- [x] Social insurances, source tax, GAV presets · 752ce99 · 2026-11-24
- [x] Payslips, booking and pain.001 payout · 752ce99 · 2026-11-24
- [x] Extra runs without basic wage · e078deb · 2026-11-24
- [x] Print fixes and mobile run list · bfda129 · 2026-11-24
- [x] Official Lohnausweis (Formular 11) · c955241 · 2026-11-24
- [x] Source-tax rate income and L-GAV 2026 · c955241 · 2026-11-24
- [ ] Payroll run with a real company's data

### Tester-ready
> feedback rounds fixed, design on the level of the best tools
- [x] Tester round 1: takeover & MWST · f5a647b
- [x] Tester round 2: invoices & contacts · 2738741
- [x] Walkthrough fixes: takeover, bank lines, mobile · 7ffc176 · 2026-11-24
- [ ] Tester round 3: bank import & receipts
- [ ] Design pass on all main screens
- [ ] Receipt upload from the phone
- [ ] Real bexio imports of 3 test companies
- [x] First-login guide with setup tasks · 9681925 · 2026-11-11
- [ ] Help texts for the hard concepts (score, cut-off date, reversal, VAT method)

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

## Decisions
- 2026-11-25 Split "Help texts and first-login guide": the guide (/start, seven setup tasks) exists since 9681925; what is missing is help on concepts, planned in docs/bilaro/2026-11-25-help-texts.md
- 2026-11-25 Added the walkthrough fixes (7ffc176) to Tester-ready: real work on main that no step foresaw
- 2026-11-24 Payroll is its own station before Tester-ready: it was built on 2026-11-24 and is a capability of its own, not part of core bookkeeping
- 2026-11-24 Merge stays with Tarek: main deploys the live app that testers use

## Needs Tarek
- [ ] 2026-11-24 Review and merge the phone receipts PR; its Cloudflare preview build failed instantly while the GitHub build and a local build pass, so check the preview build log once (https://github.com/tarekmania/bilaro/pull/1)
- [ ] 2026-11-24 Run tester round 3 (bank import & receipts) with the testers and share the feedback
- [ ] 2026-11-24 Provide bexio export files of 3 test companies for the real import test

## Log
- 2026-11-25: Review budget full (3 of 3 open), no PR. PR #1 still builds locally; planned the help texts with ten draft texts (docs/bilaro/2026-11-25-help-texts.md)
- 2026-11-24: Receipt upload from the phone: installable web app (manifest, icons, shortcut) and phone link on Belege; build, lint and 310 tests ok (https://github.com/tarekmania/bilaro/pull/1)
