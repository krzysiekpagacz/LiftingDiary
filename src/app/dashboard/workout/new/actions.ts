"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  title: z.string().max(200).optional(),
  date: z.coerce.date(),
  notes: z.string().max(2000).optional(),
});

export async function createWorkoutAction(params: {
  title?: string;
  date: string;
  notes?: string;
}) {
  const { userId } = await auth();
  if (!userId) return { success: false as const, error: "Unauthenticated" };

  const parsed = CreateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.flatten().formErrors.join(", ") };
  }

  const workout = await createWorkout(userId, parsed.data);
  const redirectTo = `/dashboard?date=${parsed.data.date.toISOString().split("T")[0]}`;
  return { success: true as const, data: workout, redirectTo };
}
