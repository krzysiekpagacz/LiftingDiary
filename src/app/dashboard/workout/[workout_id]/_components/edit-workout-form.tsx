"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { updateWorkoutAction } from "../actions";

interface EditWorkoutFormProps {
  workoutId: number;
  initialTitle: string | null;
  initialDate: Date;
  initialNotes: string | null;
}

export function EditWorkoutForm({
  workoutId,
  initialTitle,
  initialDate,
  initialNotes,
}: EditWorkoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState<Date>(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;

    startTransition(async () => {
      const result = await updateWorkoutAction({
        workoutId,
        title: title || undefined,
        date: format(date, "yyyy-MM-dd"),
        notes: notes || undefined,
      });
      if (!result.success) {
        setError(result.error);
      } else {
        router.push(result.redirectTo);
      }
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Push Day A"
              maxLength={200}
              defaultValue={initialTitle ?? ""}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  type="button"
                >
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
                      setCalendarOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any notes about this session…"
              maxLength={2000}
              rows={4}
              defaultValue={initialNotes ?? ""}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
