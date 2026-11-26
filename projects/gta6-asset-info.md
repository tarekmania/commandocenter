# GTA6 Asset Info

Setup:
- Profile: contribute
- Repo: tarekmania/GTA6-Asset-Info
- Cadence: paused
- Merge: tarek
- Notes: Fork of TrinitronClient/GTA6-Asset-Info. Prepare changes on a branch in the fork; opening the upstream pull request is a Needs Tarek item. Pull request texts short and factual, only the change. The upstream repo is not public since 2026-11-25: check with `git ls-remote https://github.com/TrinitronClient/GTA6-Asset-Info` and resume only when it answers again. Format pages name no tools (the maintainer removed tool names after a merge). No tiny pull requests: names reach the scene through gta6-namehash and SixNG's import, not one docs PR per name.

Goal: Every GTA VI asset format is documented and named, so the scene can read all of it

## Route

### Containers & resources
- [x] RPF9 header & payload layout · bad5bc2
- [x] Resource/system & graphics pages · bad5bc2
- [x] Audio (ADAT), PSO graph & shaders · 9feb253
- [ ] RPF9 TOC encryption

### Textures
- [x] Texture dicts & Xbox BC tiling · a2b53f7
- [x] ttpf store layouts (Gfx10, 1-byte) · 9ad5a5c
- [x] BCPack BC1 decode (98.4% coverage) · e9d9ca5
- [x] Video (Bink2) & UI atlases · f76ffb8
- [ ] BCPack BC3/4/5/6H/7 decode

### Models, vehicles & peds
- [x] Drawables, LODs, skeletons, skinning · 3739c82
- [x] Vehicle parts, damage, handling data · 3739c82
- [x] Ped clothing skinning & body shape · 6a6e6cd
- [x] Ped head faces via material presets · d47428f
- [ ] Wheel scale, liveries, colours

### Map, world & collision
- [x] Meta resources & LOD hierarchy · 3c6e02c
- [x] Collision bounds & surface ids · 5080ce5
- [x] Navmesh, lights & road graph · 1ddcacd
- [x] Collision ID to name mapping: TERRAIN_ names, DEFAULT for the default id · 273ae2b · 2026-11-24

### Fully named
> struct and field names resolved, hash keys mapped to names
- [x] Shader & parameter names resolved · 3739c82
- [x] Material names via lowercase JOAAT · a124af5
- [x] Map field hashes verified (PSIN overlap) · 1ddcacd
- [x] Next names PR batched from the watcher: ten field and struct names · 273ae2b · 2026-11-24
- [ ] Collision ids named (258 of 398 named; the rest are not in any public list)
- [ ] Hash keys mapped with gta6-namehash

## Notes
- This is a fork of TrinitronClient/GTA6-Asset-Info. Tarek contributes mostly names (hash to name) and merged pull requests upstream count as done.
- Related tools: SixNG (asset extractor) and the own resolver gta6-namehash.

## Done (Tarek's word)
- 2026-11-24 Pull request with the collision surface names and ten more hash names merged upstream

## Decisions
- 2026-11-26 Cadence paused: the upstream repo stopped being public on 2026-11-25, so there is nothing to contribute to; resume when it is public again
- 2026-11-26 Dropped the Needs Tarek item for station/names-batch-2026-11-24: its upstream is gone; the branch stays as it is and is rebased if upstream returns
- 2026-11-26 Ticked collision names and the batched names PR: merged upstream on 2026-11-24 (Tarek, chat 2026-11-24)
- 2026-11-24 Merge stays with Tarek: pull requests to the upstream project go out under his name

## Needs Tarek

## Log
- 2026-11-24: Ran gta6-namehash over current upstream notes; 8 new names verified and prepared on station/names-batch-2026-11-24 (based on upstream main). Upstream merged #165 (collision surface names) today.
