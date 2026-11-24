# Tempo 30

Setup:
- Profile: local
- Repo: tarekmania/tempo30
- Cadence: weekly
- Merge: tarek
- Notes: Unity project with Git LFS on Tarek's PC. Agents plan and write the Claude Code prompt for the next step; Tarek runs it and playtests himself.

Goal: Tempo30 is on Steam: a funny multiplayer arcade racer in Zurich that players buy

## Route

### Core driving
> vehicles, handling, races, AI drivers
- [x] Vehicle system & test track · c90c18e
- [x] 15 drivable vehicles, stats · 6ac0816
- [x] AI driving & checkpoint races · 2e75a45
- [x] Handling Profile B tuned · 1312818
- [x] Sound: engines, crashes, sirens · c63d0ea
- [x] Stutter/perf fixes & logging · fa16648

### Zurich city
> drivable Zurich, landmarks, street dressing; final map about 15 to 20 km
- [x] Import POLYGON City/Town · b98b01a
- [x] Zurich landmarks (3 churches) · 2332811
- [x] Facade kit per building type · 4bc9ff4
- [x] Terrain fixes, survey rounds 1-4 · f85dc37
- [x] Street dressing: billboards, ads · 633b8e5
- [x] Pigeons & radio (city atmosphere) · 5b047e8
- [ ] Fix city survey round 2 bugs
- [ ] Re-run city survey after fixes
- [ ] More districts, map 15-20 km

### Traffic & police
> traffic, trams, buses, pedestrians, chases, fines
- [x] Trams & line buses running · 828674c
- [x] Pedestrians stay off the road · 80723cb
- [x] Police chases, fines, cameras · c704bd8
- [x] Traffic AI cooperates in races · da7bb7b

### Multiplayer
> rooms, shared traffic, PC and Mac together
- [x] Shared-mode network design · bca77e5
- [x] Photon Fusion 2 rooms by code · 565e739
- [x] Shared traffic, trams & buses · 7a8fb04
- [x] 4 rounds of network bug tests · a8bdb33
- [ ] Local ghost cars (before phase 2)
- [ ] Multiplayer phase 2: races & modes online

### Public reveal
> Steam page, first Reddit post, demo build
- [ ] Name and trademark check
- [ ] Steamworks account
- [ ] Steam page with trailer and screenshots
- [ ] First Reddit post
- [ ] Demo build for a Steam festival

### Early Access
> paid release on Steam with many districts, English and German
- [ ] English and German texts and voices
- [ ] Price set
- [ ] Early Access release on Steam

## Done (Tarek's word)

## Needs Tarek
- [ ] 2026-11-24 Run the local ghosts prompt in Claude Code and playtest it (prompts/tempo30/2026-11-24-local-ghosts.md)
- [ ] 2026-11-24 Confirm the order: the repo's multiplayer plan puts city growth after multiplayer phase 2, while the stations list Zurich city first; the plan above follows the repo

## Log
- 2026-11-24: Wrote the Claude Code prompt for local ghost cars, the planned step before multiplayer phase 2 (prompts/tempo30/2026-11-24-local-ghosts.md); plan reordered to match the repo's multiplayer plan
