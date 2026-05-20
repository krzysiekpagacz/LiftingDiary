"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  title: z.string().max(200).optional(),
  date: z.coerce.date(),
  notes: z.string().max(2000).optional(),
});

export async function updateWorkoutAction(params: {
  workoutId: number;
  title?: string;
  date: string;
  notes?: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false as const, error: "Unauthenticated" };

  const parsed = UpdateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().formErrors.join(", ") };
  }

  const { workoutId, ...data } = parsed.data;
  const workout = await updateWorkout(workoutId, userId, data);
  if (!workout) return { success: false as const, error: "Workout not found" };

  const redirectTo = `/dashboard?date=${data.date.toISOString().split("T")[0]}`;
  return { success: true as const, data: workout, redirectTo };
}
