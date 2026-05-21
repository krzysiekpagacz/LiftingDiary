# Changelog

## New Feature

Added an edit workout page at `/dashboard/workout/[workout_id]` allowing users to update a workout's title, date, and notes via a form with Zod-validated server action. Added `getWorkoutById` and `updateWorkout` data helpers to `data/workouts.ts` to support the feature. (direct merge from `edit-workout-page`)
