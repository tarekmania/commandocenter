# GTA6 Asset Info

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
- Next names PR batched from the watcher
- Collision ids named
- Hash keys mapped with gta6-namehash
