# Auth Coding Standards

## Authentication Provider

**This app uses [Clerk](https://clerk.com) exclusively for authentication.**

Do not implement custom auth logic, session management, or JWT handling. All identity concerns are delegated to Clerk.

## Middleware

`src/middleware.ts` runs `clerkMiddleware()` on every request, excluding static assets. Do not modify the matcher or replace `clerkMiddleware` with custom middleware.

```ts
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();
```

## Getting the Current User

Obtain the authenticated user's identity inside **Server Components and Server Actions** with Clerk's `auth()` helper:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

**Rules:**

- `userId` is the single source of truth for the current user — never accept it from query params, request bodies, cookies, or any client-supplied source.
- `auth()` is async — always `await` it.
- If `userId` is `null` the user is unauthenticated. Guard accordingly or rely on route protection (see below).

## Route Protection

Protect routes by checking `userId` at the top of a Server Component or layout before any data fetching:

```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  // …
}
```

Do not use client-side checks as the primary guard — server-side is the authoritative boundary.

## User Identity in the Database

There is **no separate users table.** The Clerk `userId` string is stored directly on rows that require ownership (e.g. `workouts.userId`).

- Always write the Clerk `userId` into the row at creation time.
- Always filter by `userId` when reading or mutating user-owned rows (see `docs/data-fetching.md`).

## UI Components

Use Clerk's pre-built React components for sign-in/sign-up flows and user management:

| Component | Purpose |
|-----------|---------|
| `<SignIn />` | Sign-in page |
| `<SignUp />` | Sign-up page |
| `<UserButton />` | Avatar + account menu (nav bar) |
| `<SignedIn>` / `<SignedOut>` | Conditional rendering by auth state |

Import from `@clerk/nextjs`:

```tsx
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
```

## What NOT to Do

- Do not call `auth()` inside Client Components — it is a server-only API.
- Do not store `userId` in React state, `localStorage`, or URL params and read it back as a trusted value.
- Do not build custom session cookies or token refresh logic.
- Do not bypass Clerk's middleware for authenticated routes.
