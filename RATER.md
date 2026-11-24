# Commandcenter rater

Tarek's Commandcenter is a wall screen that shows his projects as a rail network map. Each project is a line that runs to one goal, through stations (milestones), and each station is made of concrete steps.

Your job in this run: for every project that changed since the last run, record what the evidence shows. Everything else (which lines are on the map, moving or parked, colors, headline, the train's position) is computed by a script. Work only with the files named here. Do not run commands.

## Inputs

- `work/changed.txt`: the ids of the projects to look at in this run, one per line. Touch no other project.
- `work/evidence.json`: facts from GitHub. For each changed project: commits of the last 14 days on the main branch, open pull requests, pull requests merged in the last 14 days, and for projects that still need a first draft (`needsDraft: true`) the whole commit history and the README.
- `projects/<id>.md`: the project file, the only copy of the project's goal, route and steps. Written by Tarek and the station master.
- `lines/<id>.json`: your notes on the project from earlier runs.

## For a project that has a project file

1. **Tick steps in its "## Route" section.** A step becomes done when a commit on the main branch or a merged pull request finishes it: change `- [ ]` to `- [x]` and add ` · <short sha>` (or ` · #<pull request number>`) at the end of the line. A line under "## Done (Tarek's word)" also counts: then the reference is ` · Tarek`. Untick a step only when the evidence shows the work was undone. Work that only sits in an open pull request is not done.
2. **Change nothing else in the project file.** Not the wording of steps, not their order, not the goal, the setup, the notes, Needs Tarek or the log. The station master and Tarek own those.
3. **Write `lines/<id>.json`:**

```json
{
  "id": "bilaro",
  "repo": "tarekmania/bilaro",
  "name": "Bilaro",
  "task": "Claude connector: write tools with confirmation",
  "held": null,
  "project": true,
  "evidence": ["ee02c4d Claude connector: prepare and act tools"]
}
```

## For a project without a project file

Write `lines/<id>.json` with a first draft of the route, so the project shows up on the map until the station master creates its project file:

```json
{
  "id": "newtool",
  "repo": "tarekmania/newtool",
  "name": "New Tool",
  "goal": "One sentence: what the world looks like when the project is done",
  "stations": [
    { "name": "First station", "desc": "what belongs to it", "steps": [
      { "t": "A finished piece of work", "done": true, "ref": "3f1a2b9" },
      { "t": "The next piece of work", "done": false }
    ] }
  ],
  "task": "…",
  "held": null,
  "project": true,
  "evidence": ["…"]
}
```

- Draft from the whole history and the README. Goal: one outcome sentence, at most 90 characters, not a feature list or a technology. Stations: 4 to 6 milestones from the start to the goal, 1 to 3 words each, results someone could see or use. The last station is the goal reached. Steps: 2 to 10 per station, at most 40 characters each; tick only what the history shows as finished.
- The route must reach the goal: if the goal is not true today, at least the last station stays open, with the real next moves as open steps (including launch, first users or customers when the goal needs them).
- Set `"project": false` for tutorials, one-off experiments and repos whose README says they are old; they stay off the map.

## Fields in every line file

- **name**: keep it once given; for a new project, a clean human name (`tutti-price-expert` → "Tutti").
- **task**: what the most recent commits work on, at most 50 characters, plain English, no commit jargon. When nothing moved, the last thing that was worked on.
- **held**: only with explicit evidence that the project waits for something outside the code (a `Blocked:` or `Waiting:` line, or commit or pull request text saying so): `{ "reason": "waiting for PostFinance", "since": "2026-11-03" }`, reason at most 40 characters. Otherwise `null`. Open Needs Tarek items alone are not "held".
- **evidence**: the commits or pull requests you used, at most 8, newest first.

## Honesty

Every tick and every drafted step must come from the evidence. Never invent progress, dates or reasons. When the evidence shows nothing new for a project, leave its files unchanged.
