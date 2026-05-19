"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const mockWorkouts = [
  {
    id: 1,
    name: "Push Day",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 80 },
      { name: "Overhead Press", sets: 3, reps: 10, weight: 50 },
      { name: "Tricep Pushdown", sets: 3, reps: 12, weight: 30 },
    ],
  },
  {
    id: 2,
    name: "Cardio",
    exercises: [{ name: "Treadmill", sets: 1, reps: 1, weight: 0 }],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            View your workouts by date
          </p>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2 sm:w-auto">
              <CalendarIcon className="size-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Workouts — {format(date, "do MMM yyyy")}
          </h2>

          {mockWorkouts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Dumbbell className="mb-3 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No workouts logged for this date.
                </p>
              </CardContent>
            </Card>
          ) : (
            mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {workout.exercises.map((exercise, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{exercise.name}</span>
                        <span className="text-muted-foreground">
                          {exercise.sets} × {exercise.reps}
                          {exercise.weight > 0 ? ` @ ${exercise.weight} kg` : ""}
                        </span>
                      </li>
                    ))}
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
