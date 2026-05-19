import { db, workouts } from "../src/db";
import { eq, and, gte, lt } from "drizzle-orm";
import { startOfDay, addDays } from "date-fns";

export async function createWorkout(
  userId: string,
  data: { title?: string; date: Date; notes?: string },
) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, ...data })
    .returning();
  return workout;
}

export async function getWorkoutsForDate(userId: string, date: Date) {
  const start = startOfDay(date);
  const end = addDays(start, 1);

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.date, start),
      lt(workouts.date, end),
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  });
}
