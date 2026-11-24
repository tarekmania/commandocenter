# Tempo30: local ghosts (step between multiplayer phase 1 and phase 2)

Paste everything below the line into Claude Code in the Tempo30 project on your PC (Unity editor open, MCP bridge connected).

---

Task: build **local ghost cars** for races, as planned in `docs/claude/multiplayer-plan.md` section 6 ("Ghost cars and online best times") and section 7 ("Between 1 and 2: local ghosts"). No networking, no Steam: only the player's own best run per race and class, saved locally and raced against.

Before you start, read `CLAUDE.md` and these topic files: `docs/claude/races-and-ai-driving.md`, `docs/claude/net.md`, `docs/claude/net-world-sync.md`, `docs/claude/vehicles.md`, `docs/claude/ui-and-settings.md`, `docs/claude/versioning.md`, `docs/claude/testing-and-measurement.md`. Their rules are binding (assembly references, no Play mode unless I ask, report format, commit and stop).

## What to build

1. **Recording.** While the player drives a race, record the player's car at 20 Hz from the start signal to the finish: position, rotation, forward speed, and the few input bits the visuals need (brake, steering, lights). Target about 30 bytes a sample. Keep the recording in memory during the race; nothing is written until the race is finished.
2. **Saving.** When a finished run becomes the new best time of its race and class (the same rule `BestTimes` in `Gameplay/RaceSettings.cs` already uses, including `RaceSystem.PlayerClass` and the "any class" entries), write its ghost next to `besttimes.json` in the player's save folder: one file per race and class, compact binary, with a small header (file version, race id, class, vehicle id, sample rate, sample count, total time). A run that is not a new best writes nothing. A damaged or unknown-version file is ignored, never a crash.
3. **Playback.** When the player starts a race and a ghost exists for that race and the class of the vehicle the player sits in, show it as a translucent car of the ghost's vehicle, played back on the race clock (interpolated between samples, starting on the start signal). No collisions with anything, no effect on traffic, police, pedestrians, props or the race result; not on the minimap's player marker. Sound off or very quiet. Wheels turn and steer, brake lights follow the recorded bits.
   - The plan says the ghost uses **the same component as the remote car proxy**. Today the proxy lives in `Net` (`Net/NetCar.cs`), and `Gameplay`, `Vehicles` and `Tests` may not reference `Net`. Find the part of the proxy that is plain interpolation and visuals (no Fusion types) and move it into an assembly both can use (`Vehicles` is the likely home), so `NetCar` and the ghost share it. If that move is larger than it looks (more than the interpolation and visual update), stop after the analysis and tell me what it would take, instead of building a second copy.
4. **Settings and UI.** One switch in the race settings (or the existing settings page the races use): "Ghost: on / off", default on, a `GameSettings` entry like the others. The race list shows a small marker on races that have a ghost for the current class. No other UI.
5. **Online.** In an online session (`Core.Session` says so) no ghost is recorded or shown.
6. **Versioning.** Add the notes under "Unreleased" in `CHANGELOG.md` as `docs/claude/versioning.md` says.

## Tests (EditMode only, as `CLAUDE.md` says)

- The ghost file round-trips: write a recording, read it back, same samples within the stored precision; a file with a wrong version or cut short reads as "no ghost".
- Interpolation: at a time between two samples the pose and speed lie between them; before the first sample the ghost is at the start, after the last it stays at the finish.
- Saving rule: only a new best time of the race and class writes a ghost; a slower run leaves the file unchanged; a run in a vehicle of no class writes no class-bound ghost.
- If you move the proxy's interpolation, the existing tests around the remote car still pass (run the related EditMode tests, then the full EditMode suite once before committing).

Do not run PlayMode tests, Play mode, measurement drives or captures.

## Done when

- It compiles, the related EditMode tests and then the full EditMode suite pass.
- Committed and pushed on a branch `ghosts-local` with a message naming the task. Then stop.
- Your report: what changed, what was not done and why, and the manual playtest checklist, for example: drive race X once, finish, drive it again and see the ghost start with you; beat it and check the ghost is replaced; switch the ghost off in the settings; change to a vehicle of another class and see no ghost; join an online session and see no ghost.
