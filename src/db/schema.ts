import {
  pgTable, serial, text, integer, boolean,
  numeric, timestamp, index,
} from 'drizzle-orm/pg-core';

export const exerciseCatalog = pgTable('exercise_catalog', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  muscleGroup: text('muscle_group'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const workouts = pgTable('workouts', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title'),
  date: timestamp('date').defaultNow().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [index('workouts_user_id_idx').on(t.userId)]);

export const workoutExercises = pgTable('workout_exercises', {
  id: serial('id').primaryKey(),
  workoutId: integer('workout_id').notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: integer('exercise_id').notNull()
    .references(() => exerciseCatalog.id),
  order: integer('order').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sets = pgTable('sets', {
  id: serial('id').primaryKey(),
  workoutExerciseId: integer('workout_exercise_id').notNull()
    .references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  reps: integer('reps'),
  weightKg: numeric('weight_kg', { precision: 6, scale: 2 }),
  rpe: numeric('rpe', { precision: 3, scale: 1 }),
  durationSeconds: integer('duration_seconds'),
  isWarmup: boolean('is_warmup').default(false).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
