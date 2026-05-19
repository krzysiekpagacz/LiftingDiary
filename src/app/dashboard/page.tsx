export const dynamic = 'force-dynamic';

import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";
import { DatePicker } from "./_components/date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;

  const date = dateParam ? new Date(`${dateParam}T12:00:00`) : new Date();
  const workoutList = await getWorkoutsForDate(userId!, date);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            View your workouts by date
          </p>
        </div>

        <DatePicker date={date} />

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Workouts — {format(date, "do MMM yyyy")}
          </h2>

          {workoutList.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Dumbbell className="mb-3 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No workouts logged for this date.
                </p>
              </CardContent>
            </Card>
          ) : (
            workoutList.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {workout.title ?? "Untitled Workout"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {workout.workoutExercises.map((we) => {
                      const workingSets = we.sets.filter((s) => !s.isWarmup);
                      const maxWeight = workingSets.reduce(
                        (max, s) =>
                          s.weightKg && parseFloat(s.weightKg) > max
                            ? parseFloat(s.weightKg)
                            : max,
                        0,
                      );
                      return (
                        <li
                          key={we.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{we.exercise.name}</span>
                          <span className="text-muted-foreground">
                            {workingSets.length} set
                            {workingSets.length !== 1 ? "s" : ""}
                            {maxWeight > 0 ? ` @ ${maxWeight} kg` : ""}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
