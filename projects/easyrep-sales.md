# EasyRep Sales

Setup:
- Profile: build
- Repo: tarekmania/easyrep-sales
- Cadence: weekly
- Merge: auto
- Notes: Served from GitHub Pages on main. No database; data stays in the browser.

Goal: Every EasyRep sales talk runs on one needs analysis and ends with a tailored proposal

## Route

### Needs analysis
> standard questions, saved in the browser
- [x] Standard question flow · 2428a56
- [x] Save/load analysis as a file · 2428a56
- [x] Import vehicle lists (Excel) · 2428a56

### Proposal
> branded PDF showing how EasyRep solves the customer's problems
- [x] Branded PDF proposal in-browser · 2428a56
- [x] Solutions text mapped to customer pains · 2428a56

### Team rollout
> shared with the sales team, prices and content editable
- [x] Editable prices & content · 2428a56
- [x] Per-industry question order · 2428a56
- [ ] Shared with the whole sales team
- [ ] Example analysis for the top industries
- [ ] Tool linked in the sales team's demo prep

### Used in real deals
> proposals sent to prospects, feedback worked in
- [ ] First 5 proposals sent to prospects
- [ ] Sales team feedback worked in
- [ ] Outcome noted per proposal (won or lost)

## Done (Tarek's word)

## Decisions
- 2026-11-24 Merge is auto: internal tool for the sales team, no database, a bad change is undone with one revert
- 2026-11-24 Industry templates get a filled example analysis per industry; preset answers are left out so every talk stays open
- 2026-11-24 «Demo booking mail» is read as the confirmation mail a prospect gets after booking a demo; the internal tool link stays out of it, so the step becomes «Tool linked in the sales team's demo prep»

## Needs Tarek
- [ ] 2026-11-24 Share the tool with the sales team (GitHub Pages link or the shared version) and say who uses it

## Log
- 2026-11-24: Nothing built: the open steps need Tarek (sharing, mail link, real deals) or a decision (what an industry template is); won/lost tracking already exists in the tool
