# Health Center: data model

Step: "Data model for food, training, notes and body data" (station Plan). Product plan only; no personal data here.

## Principles

1. **One store the AI can read whole.** Every record has a time, a kind, structured fields and a plain-text summary. The AI gets either SQL access (read-only) or a JSON export of a period; both work because the schema is small and named in plain words.
2. **Keep the raw input.** A meal logged by voice or photo keeps the transcript or photo next to the parsed result, so a wrong estimate can be fixed later and the AI can say how sure it is.
3. **Estimates are marked as estimates.** Calories and macros from a photo or a sentence carry `source` and `confidence`; values from a label or a scale do not.
4. **Units are fixed.** kcal, grams, kg, minutes, beats per minute, metres. Stored in UTC with the local time zone, so "after dinner" questions work while travelling.
5. **Append, don't overwrite.** Corrections create a new version (`replaces_id`); the AI can see what changed.
6. **Export at any time** as one JSON or SQLite file. The data belongs to the user, not to the app.

## Tables

```
entry            -- every logged thing, one row; the AI's timeline
  id, kind (meal|workout|note|metric_batch), at (timestamptz), tz,
  summary (text, one sentence, written by the app),
  raw_text, raw_media_path, source (chat|voice|photo|manual|watch|import),
  replaces_id, created_at

meal             -- kind = meal
  entry_id, meal_type (breakfast|lunch|dinner|snack), recipe_id null,
  kcal, protein_g, carbs_g, fat_g, fibre_g, confidence (0..1)
meal_item
  meal_id, name, amount, unit (g|ml|piece|portion), kcal, protein_g, carbs_g, fat_g,
  food_id null, confidence

food             -- own foods and products with label values per 100 g
  id, name, brand, barcode, kcal_100, protein_100, carbs_100, fat_100, fibre_100

recipe
  id, title, servings, steps (text), source_url (for Instagram reels), source_note,
  kcal_per_serving, protein_g, carbs_g, fat_g, tags[]
recipe_ingredient
  recipe_id, name, amount, unit, food_id null

exercise
  id, name, muscle_group, equipment, kind (strength|cardio|mobility)
plan
  id, name, goal, active (bool)
plan_day
  plan_id, day_index, name
plan_exercise
  plan_day_id, exercise_id, order, sets, reps_min, reps_max, target_weight_kg, rest_s

workout          -- kind = workout
  entry_id, plan_day_id null, duration_min, perceived_effort (1..10)
workout_set
  workout_id, exercise_id, set_index, reps, weight_kg, duration_s, distance_m, rpe

note             -- kind = note: sensations and issues
  entry_id, body_area null, severity (0..10) null, mood (1..5) null, tags[]

metric           -- watch and body data, many small rows
  at, tz, type (heart_rate|resting_hr|hrv|steps|sleep_min|weight_kg|body_fat_pct),
  value, source (watch model or manual), batch_entry_id
daily_summary    -- computed each night, what the AI reads first
  day, kcal_in, protein_g, steps, resting_hr, sleep_min, workouts, notes_count, text
```

## Why this shape

- `entry` gives the AI one timeline across food, training and notes; detail tables hold the numbers it needs for sums and trends.
- `metric` stays narrow because watch data is many rows; `daily_summary` keeps AI context small (a month is 30 rows, not 100'000).
- Recipes are separate from meals so a meal can be "1 serving of recipe X" and calories follow the recipe.

## Questions the model must answer (test list)

- "How much protein did I eat on training days this month compared with rest days?"
- "Since when does my knee hurt, and what did I train the days before?"
- "Which recipes under 600 kcal do I have with chicken?"
- "Is my resting heart rate going up in weeks I sleep less?"
- "How did my bench press develop over 3 months?"

Each one is a join of at most three tables or a read of `daily_summary`. That is the check for the next step (stack): the store must allow these queries on the phone and an export the AI can read.

## Next step

Stack: an installable web app (PWA) on Android with SQLite in the browser (OPFS) or a small hosted Postgres, compared on offline use, watch import (Health Connect needs a native bridge) and AI access.
