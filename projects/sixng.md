# SixNG

Setup:
- Profile: contribute
- Repo: tarekmania/SixNG
- Cadence: weekly
- Merge: tarek
- Notes: Fork of holdmysocks/SixNG, the GTA VI asset extractor. Prepare changes on a branch in the fork; opening the upstream pull request is a Needs Tarek item. No tiny pull requests: batch names into one. Pull request texts short and factual, only the change.

Goal: SixNG names every GTA VI struct and field by itself, straight from gta6-namehash

## Route

### Struct and field names
> provable names for SixNG's unknown hashes, sent upstream in batches
- [x] Struct names merged upstream · Tarek
- [x] Map-format structs and more fields merged upstream · Tarek

### Namehash import
> SixNG reads a gta6-namehash dictionary as a last-resort name source
- [x] Import a namehash dictionary as last resort · 880fdfd · 2026-11-24
- [x] Import pull request merged upstream · eff6945 (#175) · 2026-11-24
- [x] Notices thank the gta6-namehash contributors · 929b656 (#179) · 2026-11-24

### Textures
> BCPack texture chunk decode, tiling, tint palettes
- [x] BCPack BC1 decode · 08e7457 · 2026-11-21
- [x] BCPack BC3/4/5/6H/7 decode · a4063d3 · 2026-11-22
- [x] Texture tiling, mip counts, tint palettes, arrays · 37f52ae · 2026-11-22

### Peds & clothing
> ped clothing, faces, hair and drawables to GLB
- [x] Ped clothing: 8-influence skinning, body shape · c39f615 · 2026-11-22
- [x] Ped heads: face textures, grooms/hair as GLB · d207a54 · 2026-11-22
- [x] Drawable dictionaries, rebuilt normals · 4c496f2 · 2026-11-22

### Map 3D
> stream the whole map within RAM/VRAM caps
- [x] Stream whole map within RAM/VRAM caps · 42603f2 · 2026-11-21
- [x] Map cells, coverage fallbacks, ground fills · 94f699e · 2026-11-22
- [x] Smoother streaming, freed GPU memory · 3af3a69 · 2026-11-22

### Audio
> sound banks and music streams from audio.rpf
- [x] Sound banks: find, play, export · cb9833d · 2026-11-21
- [x] Multichannel music, PCM/XMA2 export · 908a301 · 2026-11-22

### World data
> vehicle tables, shader names, localised text
- [x] PSO files: vehicle handling and tables · dc64093 · 2026-11-21
- [x] Shader, parameter and meta field names resolved · 9b4f281 · 2026-11-21
- [x] Localised text tables decoded · 0619601 · 2026-11-22

### Library GUI
> library, viewer, jobs and textures tabs
- [x] Library home, viewer Parts panel · 668d8c1 · 2026-11-21
- [x] Jobs tab, Textures tab browsing · 9e66cd0 · 2026-11-22
- [x] Vehicle data shown in model viewer · 2f67255 · 2026-11-21

### Cross-platform builds
> macOS support and CI on all platforms
- [x] macOS support: file manager, settings, memory budget · e4d1380 · 2026-11-21
- [x] Universal macOS app, CI for Windows/macOS/Linux · e077498 · 2026-11-22

### Interior entities
> interior-local and group-local placement scope, read from MLO files
- [x] Mark interior-local and group-local placements (interior-entities) · 9381c68 · 2026-11-21

### Video extraction
> Bink cutscene videos and UI texture atlases carved from the install
- [x] Carve Bink videos, export UI texture stores · 3399080 · 2026-11-21

### Names without hand work
> new names reach SixNG through the dictionary, not one pull request per name
- [ ] Users get the dictionary without a manual download (release asset of gta6-namehash that `sixng names --namehash` points to in the README)
- [ ] Names confirmed in SixNG flow back into namehash
- [ ] Maintainer updates names without Tarek

## Done (Tarek's word)
- 2026-11-24 Pull request for the namehash import submitted upstream

## Decisions
- 2026-11-25 New station «Video extraction» from 2026-11-21's work, placed before «Names without hand work»
- 2026-11-25 New station «Interior entities» from 2026-11-21's work, placed before «Names without hand work»
- 2026-11-25 New station «Textures» from 2026-11-22's work, placed before «Names without hand work»
- 2026-11-25 New station «Peds & clothing» from 2026-11-22's work, placed before «Names without hand work»
- 2026-11-25 New station «Map 3D» from 2026-11-22's work, placed before «Names without hand work»
- 2026-11-25 New station «Audio» from 2026-11-22's work, placed before «Names without hand work»
- 2026-11-25 New station «World data» from 2026-11-22's work, placed before «Names without hand work»
- 2026-11-25 New station «Library GUI» from 2026-11-22's work, placed before «Names without hand work»
- 2026-11-25 New station «Cross-platform builds» from 2026-11-22's work, placed before «Names without hand work»
- 2026-11-25 "SixNG ships with the dictionary" changed to a release-asset route: dictionary.json is 16.5 MB and does not belong in the SixNG repo; SixNG's import (#175) already reads the file as it is
- 2026-11-25 Ticked the import step: upstream merged it as eff6945 (#175), with notices in #179
- 2026-11-24 SixNG is its own line: Tarek's own work lives in this fork (namehash import), next to GTA6 Asset Info
- 2026-11-24 Goal is that the maintainer uses gta6-namehash directly, so names stop depending on Tarek's pull requests (Tarek, chat)

## Needs Tarek

## Log
- 2026-11-25: Upstream merged the namehash import (#175) and the notices (#179); plan for the next station adjusted, no branch needed this run
