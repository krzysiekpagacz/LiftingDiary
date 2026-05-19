# Data Mutations

## ⚠️ CRITICAL RULES — READ THIS FIRST

> **ALL data mutations MUST follow a two-layer pattern:**
>
> 1. A **`/data` helper function** that wraps the Drizzle ORM call — this is the only place that touches `db`.
> 2. A **Server Action** in a colocated `actions.ts` file that validates inputs, resolves the current user, and calls the helper.
>
> Do NOT mutate data:
> - Directly inside Server Components or Client Components
> - In route handlers (`app/api/` endpoints)
> - By calling `db` from anywhere outside `src/data/`
> - Using raw SQL (`db.execute`, template literals, `sql` tagged queries)
>
> There are **no exceptions** to these rules.

---

## Layer 1 — `/data` Mutation Helpers

All Drizzle `insert`, `update`, and `delete` calls must live as plain async functions inside `src/data/`. Server Actions call these helpers; they never touch `db` directly.

**Rules for mutation helpers:**

- Use **Drizzle ORM** exclusively — no raw SQL.
- Every helper that mutates user-owned data **must** accept a `userId` parameter and include it in the `where` clause (for updates/deletes) or as a column value (for inserts).
- Helpers are plain async functions — no classes, no decorators.
- A helper must do exactly one thing. Do not bundle unrelated mutations into one helper.

### Example structure

```
src/data/
  workouts.ts        # createWorkout, updateWorkout, deleteWorkout, …
  sets.ts            # createSet, updateSet, deleteSet, …
  exercises.ts       # createExerciseCatalogEntry, …
```

### Example helpers

```ts
// src/data/workouts.ts
import { db, workouts } from "@/db";
import { eq, and } from "drizzle-orm";

export async function createWorkout(userId: string, title: string, date: Date) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, title, date })
    .returning();
  return workout;
}

export async function deleteWorkout(workoutId: number, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

> Note the `userId` guard in the `where` clause on the delete helper. This prevents one user from deleting another user's data even if a bad `workoutId` is supplied.

---

## Layer 2 — Server Actions (`actions.ts`)

All Server Actions must live in a file named `actions.ts` colocated with the route segment or component that uses them.

### Rules for Server Actions

| Rule | Detail |
|------|--------|
| **File name** | Must be `actions.ts` — no other name is accepted. |
| **Directive** | Must start with `"use server"`. |
| **Parameters** | Must be explicitly typed TypeScript — `FormData` is **not** permitted as a parameter type. |
| **Validation** | Every action **must** validate its arguments with **Zod** before doing anything else. |
| **User identity** | `userId` is always obtained from Clerk's `auth()` inside the action — never accepted as a parameter. |
| **DB access** | Actions call `/data` helpers only — never `db` directly. |
| **Return type** | Return a discriminated union `{ success: true; data?: ... } \| { success: false; error: string }` so callers can handle errors without throwing. |
| **Redirects** | Do **not** call `redirect()` inside a Server Action. Return `{ success: true; redirectTo?: string }` and let the Client Component call `router.push()` after the action resolves. |

### Colocated file layout

```
src/app/workouts/[id]/
  page.tsx           # Server Component — reads data
  actions.ts         # Server Actions — mutates data
  _components/
    edit-form.tsx    # Client Component — calls the action
```

### Example Server Action

```ts
// src/app/workouts/[id]/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { deleteWorkout } from "@/data/workouts";

const DeleteWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
});

export async function deleteWorkoutAction(params: { workoutId: number }) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthenticated" };

  const parsed = DeleteWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors.toString() };
  }

  await deleteWorkout(parsed.data.workoutId, userId);
  return { success: true };
}
```

### Calling a Server Action from a Client Component

```tsx
// src/app/workouts/[id]/_components/delete-button.tsx
"use client";

import { deleteWorkoutAction } from "../actions";

export function DeleteButton({ workoutId }: { workoutId: number }) {
  async function handleClick() {
    const result = await deleteWorkoutAction({ workoutId });
    if (!result.success) {
      console.error(result.error);
    }
  }

  return <button onClick={handleClick}>Delete workout</button>;
}
```

---

## Data Ownership / Authorization

The same ownership model that applies to reads applies to mutations.

- Every `/data` mutation helper that touches user-owned rows **must** include `eq(table.userId, userId)` in the `where` clause.
- Never fetch a row and check ownership in the action — enforce it in the query.
- `userId` always comes from Clerk's `auth()` inside the Server Action — it is **never** accepted from the client as a parameter.

---

## Zod Validation Reference

Define the Zod schema adjacent to the action that uses it. Do not share schemas between unrelated actions.

```ts
// Correct — co-defined, specific to this action
const UpdateSetSchema = z.object({
  setId: z.number().int().positive(),
  reps: z.number().int().min(1).optional(),
  weightKg: z.number().min(0).optional(),
  rpe: z.number().min(1).max(10).optional(),
});
```

Use `safeParse` (not `parse`) so validation failures return a structured error instead of throwing.
