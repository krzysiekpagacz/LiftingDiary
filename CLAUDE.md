# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs-first rule

**Before writing any code, always read the relevant file(s) in `docs/` first.** The docs directory contains binding standards that override general conventions. Currently:

- `docs/ui.md` — UI component library rules, date formatting, and shadcn/ui configuration
- `docs/data-fetching.md` — **data fetching rules (Server Components only, `/data` helpers, ownership)**
- `docs/data-mutations.md` — **data mutation rules (Server Actions, `/data` helpers, Zod validation)**
- `docs/auth.md` — **auth rules (Clerk only, `auth()` usage, route protection, no custom auth)**

## Commands

```bash
npm run dev       # start dev server at http://localhost:3000
npm run build     # production build
npm run lint      # ESLint (no test suite currently)
```

Database (requires `DATABASE_URL` env var):

```bash
npx drizzle-kit generate   # generate migration from schema changes
npx drizzle-kit migrate    # apply pending migrations
npx drizzle-kit studio     # open Drizzle Studio GUI
```

## Architecture

**Next.js 16 App Router** project with Clerk auth, Neon PostgreSQL, and Drizzle ORM.

## Code Generation Guidelines
IMPORTANT: When generating any code, ALWAYS first refer to the relevant documentation files within the /docs directory to understand existing patterns, conventions, and best practices before implementation:
- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md


### Auth — Clerk

`src/middleware.ts` runs `clerkMiddleware()` on every request (excluding static assets). The root layout wraps the entire app in `<ClerkProvider>`. User identity in server code is obtained via Clerk's `auth()` helper. The `userId` from Clerk is stored directly in DB rows (e.g. `workouts.userId`) — there is no separate users table.

### Database — Drizzle + Neon

`src/db/index.ts` exports a singleton `db` instance using `drizzle-orm/neon-http` (serverless HTTP driver, not WebSockets). It also re-exports everything from `src/db/schema.ts`, so import DB and table references from `@/db`.

Schema relationships (`src/db/schema.ts`):
- `exerciseCatalog` — global exercise library
- `workouts` — one per session, owned by a Clerk `userId`
- `workoutExercises` — join between a workout and an exercise, with ordering
- `sets` — individual sets within a `workoutExercise` (reps, weight, RPE, duration)

Cascade deletes are configured: deleting a `workout` removes its `workoutExercises`; deleting a `workoutExercise` removes its `sets`.

### UI

Only **shadcn/ui** components are permitted (see `docs/ui.md`). Installed components live in `components/ui/` — do not modify them. Add new ones with:

```bash
npx shadcn@latest add <component-name>
```

All dates must be formatted with **date-fns** using the `"do MMM yyyy"` format token (e.g. `"1st Sep 2025"`). No other date library or manual formatting.

shadcn/ui config: style `radix-nova`, base color `neutral`, CSS variables enabled, icon library `lucide`.
