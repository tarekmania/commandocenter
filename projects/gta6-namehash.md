# GTA6 Namehash

Setup:
- Profile: build
- Repo: tarekmania/gta6-namehash
- Cadence: weekly
- Notes: A separate scheduled task already refreshes confirmed.json; do not touch that file.

Goal: GTA 6 tool authors resolve any hash to a name instead of guessing

Stations (in this order):
1. Hash dictionary (joaat exact and lowercase, names from public sources)
2. CLI lookup (resolve hashes from files or stdin, list unresolved)
3. Wider coverage (more public name lists, remaining format hashes)
4. Adoption (used by SixNG and GTA6 Asset Info, known in the scene)

Plan (open steps, in order; tick only with evidence):
Wider coverage:
- Close remaining format-note hashes (1,322 of 1,706 unresolved; GTA V and RDR2 public lists exhausted, needs new sources such as the executable's strings)
- Add more public name lists (RAGE-StringsDatabase checked, adds nothing: #1)
Adoption:
- Release with a clear README and licence (README and MIT licence exist; tag and release are Tarek's)
- Announced in the GTA 6 research scene
- Used by SixNG
- Used inside GTA6 Asset Info

## Needs Tarek
- [ ] 2026-11-24 Review the sources check PR (https://github.com/tarekmania/gta6-namehash/pull/1)
- [ ] 2026-11-24 Decide on a first release (tag v0.1 and GitHub release) now that README and licence are in place

## Log
- 2026-11-24: Tested RAGE-StringsDatabase against the 1,322 unnamed hashes in the upstream notes: no real gain, recorded in SOURCES.md; README coverage updated to 384 of 1,706 (https://github.com/tarekmania/gta6-namehash/pull/1)
