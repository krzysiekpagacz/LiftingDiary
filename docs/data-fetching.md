# Data Fetching

## ⚠️ CRITICAL RULE — READ THIS FIRST

> **ALL data fetching MUST be done exclusively via React Server Components.**
>
> Do NOT fetch data in:
> - Route handlers (`app/api/` endpoints)
> - Client components (`"use client"`)
> - `useEffect` / `fetch` calls on the client
> - Any mechanism other than Server Components
>
> There are **no exceptions** to this rule.

## `/data` — Database Query Helpers

All database queries must live as helper functions inside the `/data` directory. Server Components call these helpers; they never query the database directly.

**Rules for `/data` helpers:**

- Use **Drizzle ORM** exclusively — no raw SQL (`db.execute`, template literals, `sql` tagged queries, etc.)
- Every helper that returns user-owned data **must** accept a `userId` parameter and filter by it
- Helpers are plain async functions — no classes, no decorators

### Example structure

```
/data
  workouts.ts       # getWorkouts, getWorkoutById, …
  exercises.ts      # getExerciseCatalog, …
  sets.ts           # getSetsForWorkoutExercise, …
```

### Example helper

```ts
// data/workouts.ts
import { db, workouts } from "@/db";
import { eq, and } from "drizzle-orm";

export async function getWorkoutById(workoutId: string, userId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}
```

### Example Server Component

```tsx
// app/workouts/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getWorkoutById } from "@/data/workouts";

export default async function WorkoutPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const workout = await getWorkoutById(params.id, userId!);
  // render …
}
```

## Data Ownership / Authorization

Logged-in users may **only** access their own data.

- Every `/data` helper that returns user-owned rows **must** include a `userId` filter in the Drizzle `where` clause.
- Never return all rows and filter in the component — filter in the query.
- Passing the wrong `userId` (or omitting it) must result in no rows returned, not an error that could leak data.

The `userId` always comes from Clerk's `auth()` helper called inside the Server Component — it is never accepted from query params, request bodies, or any client-supplied source.
