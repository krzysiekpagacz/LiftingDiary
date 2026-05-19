# UI Coding Standards

## Component Library

**Only shadcn/ui components are permitted in this project.**

Do not create custom UI components. Every piece of UI must be built exclusively from shadcn/ui components. If a required component does not exist in the current installation, add it via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Installed components live in `components/ui/`. Do not modify them unless shadcn/ui provides no configuration path for the needed change.

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/). No other date formatting library or manual string construction is permitted.

Dates are displayed in the following format: ordinal day, abbreviated month, full year.

| Date | Formatted output |
|------|-----------------|
| 2025-09-01 | 1st Sep 2025 |
| 2026-08-02 | 2nd Aug 2026 |
| 2024-01-03 | 3rd Jan 2024 |
| 2022-06-04 | 4th Jun 2022 |

Use the `do MMM yyyy` format token:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // "1st Sep 2025"
```

## shadcn/ui Configuration

The project uses the following shadcn/ui setup (see `components.json`):

- **Style:** radix-nova
- **Base color:** neutral
- **CSS variables:** enabled
- **Icon library:** lucide
- **Component alias:** `@/components/ui`
