# GTA6 Asset Info

Setup:
- Profile: contribute
- Repo: tarekmania/GTA6-Asset-Info
- Cadence: weekly
- Notes: Fork of TrinitronClient/GTA6-Asset-Info. Prepare changes on a branch in the fork; opening the upstream pull request is a Needs Tarek item. Pull request texts short and factual, only the change.

Goal: Every GTA VI asset format is documented and named, so the scene can read all of it

Stations (in this order):
1. Containers & resources
2. Textures
3. Models, vehicles & peds
4. Map, world & collision
5. Fully named (struct and field names resolved, hash keys mapped to names)

Notes:
- This is a fork of TrinitronClient/GTA6-Asset-Info. Tarek contributes mostly names (hash to name) and merged pull requests upstream count as done.
- Related tools: SixNG (asset extractor) and the own resolver gta6-namehash.

Plan (open steps, in order; tick only with evidence):
Fully named:
- Next names PR: branch station/names-batch-2026-11-24 ready (8 names)
- Collision ids named: 257 of 398 ids named upstream (#165, 84 % of triangles); the rest needs game data
- Hash keys mapped with gta6-namehash: every hash in the notes that the dictionary can resolve is named or in the branch above; the rest needs new name sources or the executable

## Needs Tarek
- [ ] 2026-11-24 Open the upstream PR from https://github.com/tarekmania/gta6-asset-info/tree/station/names-batch-2026-11-24 — "Name eight more hashes": case-sensitive joaat matches that fit the notes' meaning: clipDictionaryName, clipName (§17), ScaleY, ScaleX, Indices, AspectRatio (§11), volOuterColour (§7), probably Category (§19).

## Log
- 2026-11-24: Ran gta6-namehash over current upstream notes; 8 new names verified and prepared on station/names-batch-2026-11-24 (based on upstream main). Upstream merged #165 (collision surface names) today.
