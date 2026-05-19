import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NewWorkoutForm } from "./_components/new-workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;
  const initialDate = dateParam ? new Date(`${dateParam}T12:00:00`) : new Date();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New Workout</h1>
          <p className="text-sm text-muted-foreground">
            Log a new training session
          </p>
        </div>
        <NewWorkoutForm initialDate={initialDate} />
      </div>
    </div>
  );
}
