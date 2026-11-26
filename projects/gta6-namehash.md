# GTA6 Namehash

Setup:
- Profile: build
- Repo: tarekmania/gta6-namehash
- Cadence: weekly
- Merge: auto
- Notes: A separate scheduled task already refreshes confirmed.json; do not touch that file. Names only from public lists, never from game files (strings read out of GTA 6 data, like rage-tools-vi's corpus names, stay out). While TrinitronClient/GTA6-Asset-Info is not public, the format notes to resolve against are the fork branch tarekmania/gta6-asset-info `docs/surface-and-field-names` (notes as of 2026-11-24).

Goal: GTA 6 tool authors resolve any hash to a name instead of guessing

## Route

### Hash dictionary
> joaat exact and lowercase, names from public sources
- [x] Joaat hashing: exact & lowercase · 1e38c45
- [x] Build dictionary from public sources · 1e38c45
- [x] ~309k names, ~498k hashes committed · 1e38c45

### CLI lookup
> resolve hashes from files or stdin, list unresolved
- [x] Resolve hashes via CLI or stdin · 1e38c45
- [x] Resolve hashes across files/trees · 1e38c45
- [x] List unresolved hashes · 1e38c45
- [x] Mark matches as candidates, not confirmed · 02149cc
- [x] Confirmed tier from other RE projects · c96156d

### Wider coverage
> more public name lists, remaining format hashes
- [ ] Close remaining format-note hashes
- [ ] Add more public name lists
- [x] Checked RDR2 lists: not used · 777215f
- [x] Checked rage-tools-vi's 36,952 names: 36,305 are CodeWalker's, most of the rest come from game files; not used · 2026-11-25

### Adoption
> used by SixNG and GTA6 Asset Info, known in the scene
- [x] Release with a clear README and licence · 1e38c45
- [ ] Release v0.1 tagged
- [x] Announced in the GTA 6 research scene · awesome-gta6-reverse-engineering · 2026-11-23
- [x] Used by SixNG: `sixng names --namehash` · holdmysocks/SixNG eff6945 (#175) · 2026-11-24
- [x] Credited in SixNG's third-party notices · holdmysocks/SixNG 929b656 (#179) · 2026-11-24
- [x] Scene listing shows coverage and the SixNG import · Ahmet-Dedeler/awesome-gta6-reverse-engineering#26 · 2026-11-25
- [ ] Used inside GTA6 Asset Info (upstream not public since 2026-11-25)

## Done (Tarek's word)

## Decisions
- 2026-11-26 Format notes come from the fork branch docs/surface-and-field-names while upstream is not public, and the confirmed layer never shrinks in that time: names confirmed earlier stay
- 2026-11-26 README coverage should use the same count as the scene listing (471 of 874 backticked hashes in the notes, 458 confirmed): fix pull request #1 before merging it, it still says 384 of 1,706
- 2026-11-26 rage-tools-vi's names are not added: almost all are already in, the new ones were read from game files
- 2026-11-26 Ticked SixNG use, the notices credit and the listing update: merged upstream (Tarek, chat 2026-11-24/25)
- 2026-11-24 Listing in the scene's awesome list counts as the announcement; Tarek's fork of that list stays off the map, its work belongs here
- 2026-11-24 The sources check pull request is reviewed and merged by the station master (Merge auto), no review by Tarek
- 2026-11-24 First release v0.1 is tagged once the sources check is merged

## Needs Tarek

## Log
- 2026-11-24: Tested RAGE-StringsDatabase against the 1,322 unnamed hashes in the upstream notes: no real gain, recorded in SOURCES.md; README coverage updated to 384 of 1,706 (https://github.com/tarekmania/gta6-namehash/pull/1)
