# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A lifting diary web app built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Requirements

- **Node.js >= 20.9.0** (Next.js 16 requirement)

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # run ESLint (Next.js core-web-vitals + typescript rules)
```

No test runner is configured yet.

## Architecture

Uses the **App Router** (`app/` directory) with React Server Components by default. Key conventions:

- `app/layout.tsx` — root layout; sets global fonts (Geist) and base Tailwind classes
- `app/page.tsx` — home route (`/`)
- `app/globals.css` — global styles; Tailwind is loaded here via PostCSS

New routes go under `app/` as folders with a `page.tsx`. Nested layouts follow the same pattern with `layout.tsx`.

## Next.js Version Warning

This project uses **Next.js 16**, which has breaking changes from what most training data covers. Before writing routing, caching, or data-fetching code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices — APIs, conventions, and file structure may differ from older Next.js versions.

- For slow client-side navigations: `Suspense` alone is not enough; also export `unstable_instant` from the route. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.mdx`.

## Tailwind CSS v4

This project uses **Tailwind v4** with the PostCSS plugin (`@tailwindcss/postcss`). Configuration is done in CSS, not `tailwind.config.js`. Utility class names and theme tokens may differ from v3.
