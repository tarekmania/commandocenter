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

### Names without hand work
> new names reach SixNG through the dictionary, not one pull request per name
- [ ] Users get the dictionary without a manual download (release asset of gta6-namehash that `sixng names --namehash` points to in the README)
- [ ] Names confirmed in SixNG flow back into namehash
- [ ] Maintainer updates names without Tarek

## Done (Tarek's word)
- 2026-11-24 Pull request for the namehash import submitted upstream

## Decisions
- 2026-11-25 "SixNG ships with the dictionary" changed to a release-asset route: dictionary.json is 16.5 MB and does not belong in the SixNG repo; SixNG's import (#175) already reads the file as it is
- 2026-11-25 Ticked the import step: upstream merged it as eff6945 (#175), with notices in #179
- 2026-11-24 SixNG is its own line: Tarek's own work lives in this fork (namehash import), next to GTA6 Asset Info
- 2026-11-24 Goal is that the maintainer uses gta6-namehash directly, so names stop depending on Tarek's pull requests (Tarek, chat)

## Needs Tarek

## Log
- 2026-11-25: Upstream merged the namehash import (#175) and the notices (#179); plan for the next station adjusted, no branch needed this run
