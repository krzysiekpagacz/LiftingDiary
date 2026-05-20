import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./_components/edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workout_id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { workout_id } = await params;
  const workoutId = parseInt(workout_id, 10);
  if (isNaN(workoutId)) notFound();

  const workout = await getWorkoutById(workoutId, userId);
  if (!workout) notFound();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Workout</h1>
          <p className="text-sm text-muted-foreground">
            Update your training session details
          </p>
        </div>
        <EditWorkoutForm
          workoutId={workout.id}
          initialTitle={workout.title}
          initialDate={workout.date}
          initialNotes={workout.notes}
        />
      </div>
    </div>
  );
}
