# Health Center

Setup:
- Profile: plan
- Repo: none
- Cadence: weekly
- Merge: auto
- Notes: No repo yet. Must run on Android; a web app is fine. All data is stored so an AI can read it and give real answers; without that the app has no point. No personal health data in this public repo, only the product plan.

Goal: One Android app holds food, training, notes and watch data, and an AI answers from all of it

## Route

### Plan
> what it does, how the data is stored, which stack
- [x] Features and requirements set · Tarek · 2026-11-24
- [x] Data model for food, training, notes and body data · docs/health-center/2026-11-25-data-model.md · 2026-11-25
- [ ] Stack chosen: Android web app with its own data store
- [ ] Repo created and linked here

### Food
> meals and recipes without typing
- [ ] Log a meal by chat, voice or photo
- [ ] Calorie estimate per meal
- [ ] Save recipes, also from Instagram cooking videos

### Training
> sport with sets and plans
- [ ] Exercises with sets and reps
- [ ] Training plans
- [ ] History per exercise

### Body and watch
> notes on how he feels, data from the smartwatch
- [ ] Notes on sensations and issues
- [ ] Smartwatch connected: heart rate and steps

### AI overview
> one place that knows everything and answers
- [ ] AI answers from all the data
- [ ] Weekly overview
- [ ] Used every day on the phone

## Done (Tarek's word)
- 2026-11-24 Features set: recipes, calories by chat, voice or photo, health notes, training with sets and plans, smartwatch data, AI over all data

## Decisions
- 2026-11-25 Data model written as one timeline table plus detail tables and a nightly daily summary, so the AI reads a month in 30 rows; the stack must answer five test questions (docs/health-center/2026-11-25-data-model.md)
- 2026-11-25 Stack step notes that watch data from Health Connect needs a native bridge: a pure web app cannot read it
- 2026-11-24 Added to the Commandcenter without a repo: the plan exists in chats; the line shows up now and gets its repo when one is created
- 2026-11-24 Profile plan for now: the station master writes the data model and stack proposal into docs/health-center/ before any code
- 2026-11-24 Merge auto: Tarek's own app with no other users

## Needs Tarek

## Log
- 2026-11-25: Wrote the data model for food, training, notes and watch data with five test questions (docs/health-center/2026-11-25-data-model.md)
