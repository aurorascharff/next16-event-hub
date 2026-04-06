# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Setup

```bash
pnpm install        # Install dependencies
pnpm run dev        # Start dev server (defaults to http://localhost:3000)
```

## Build & Lint

```bash
pnpm run build      # Production build
pnpm run lint       # ESLint check
```

Always run `pnpm run build` and `pnpm run lint` before committing. Fix any errors before finishing.

## Tech Stack

- Next.js 16 App Router with React 19 Server Components
- TypeScript strict mode
- Tailwind CSS 4.x
- shadcn/ui components (`components/ui/`)
- Base UI (`@base-ui/react`) for custom interactive components
- Prisma with SQLite (`@prisma/adapter-libsql`)
- SWR for client-side polling
- Zod for validation
- Sonner for toasts
- next-themes for dark/light mode

## Next.js 16 APIs (Not in Training Data)

These APIs are new in Next.js 16 and may not be in model training data:

- `forbidden()` / `unauthorized()` - Throw from Server Components/Actions to trigger `forbidden.tsx` or `unauthorized.tsx`
- `cookies()` / `headers()` - Now async, must be awaited
- `connection()` - For dynamic rendering opt-in
- `'use cache'` directive - For caching with `cacheLife()` and `cacheTag()`
- `revalidateTag()` - Invalidate cache tags (use with `'max'` profile)
- `refresh()` - Refresh client router from Server Actions
- `after()` - Run code after response is sent

## Code Style

- **Components**: PascalCase files (`MyComponent.tsx`)
- **Folders**: kebab-case (`my-folder/`)
- **Utils/hooks**: camelCase (`useMyHook.ts`, `myUtil.ts`)
- Use `type` over `interface` unless declaration merging is needed
- Use `cn` util for conditional Tailwind classes
- Use Base UI for custom interactive components not in shadcn/ui
- Add shadcn/ui components with `npx shadcn@latest add <component-name>`

## Folder Structure

```text
app/
  page.tsx                    # Home — session list with day tabs + label filter
  layout.tsx                  # Root layout (auth gate, theme, fonts)
  [slug]/
    layout.tsx                # Session layout (header, event info, bottom nav)
    page.tsx                  # Redirects to /[slug]/comments
    comments/page.tsx         # Comment feed
    questions/page.tsx        # Q&A feed with sort
    _components/              # Session-local components
  api/events/[slug]/          # SWR polling endpoints
    questions/route.ts        # GET questions
    presence/route.ts         # GET active users
components/
  common/                     # Shared utility components (Avatar, EmptyState, AuthGate, ThemeToggle, ThemeProvider)
  design/                     # Design components with async React logic (BottomNav, ChipGroup, InlineForm, SubmitButton)
  ui/                         # shadcn/ui primitives
  BackButton.tsx              # Navigate + mutate in one transition
  EventGrid.tsx               # Async server component — session cards
  LabelFilter.tsx             # Label filter chips
data/
  queries/                    # Server-side queries with cache()
  actions/                    # Server Actions (mutations with refresh())
lib/
  utils.ts                    # Utilities (cn, timeAgo, parseTime, avatar URLs)
prisma/                       # Prisma schema and seeds
```

- **components/common** — Shared utility components without complex async logic
- **components/design** — Design components that encapsulate `useOptimistic`, `useTransition`, and `startTransition` internally. Consumers pass data and callbacks; the component handles transition mechanics.
- **components/ui** — shadcn/ui primitives
- **data/queries** — Server-side data fetching with `cache()` for deduplication
- **data/actions** — Server Actions with `"use server"` for mutations. Use `refresh()` to invalidate the client router.
- **app/api** — API routes for SWR client-side polling (questions, presence)

Route-specific code goes in `_components` folders. Shared code lives at the nearest common ancestor.

## Development Flow

Push dynamic data access (`searchParams`, `cookies()`, `headers()`, uncached fetches) as deep as possible in the component tree to maximize static content. Async components accessing dynamic data should be wrapped in `<Suspense>` with skeleton fallbacks.

- **Fetching data** — Create queries in `data/queries/`, call in Server Components. Use `cache()` for deduplication.
- **Mutating data** — Create Server Actions in `data/actions/` with `"use server"`. Use `refresh()` to invalidate. Use `useOptimistic` for instant feedback.
- **Live data** — Server-render initial data, pass to client components as `fallbackData` for SWR polling. Use `useSWRConfig().mutate` after actions for immediate revalidation.
- **Navigate + mutate** — Wrap both a server action and `router.push()` in a single `startTransition` for atomic mutation + navigation (see `BackButton`).

## Server Components (Default)

- All components are Server Components unless `'use client'` is added
- Can be `async` and fetch data with `await`
- Wrap in `<Suspense>` with fallbacks when needed
- Use `React.cache()` for data fetching functions

## Client Components

Add `'use client'` only when needed for:

- Event handlers, hooks, browser APIs
- `useOptimistic()` for optimistic updates
- `useFormStatus()` for form pending state
- `useTransition()` for non-blocking updates
- `useDeferredValue()` for deferred rendering that triggers view transitions
- `router.push()` for client-side navigation

## Data Fetching & Mutations

```typescript
// Queries - use cache() for deduplication
export const getEvents = cache(async (day?: string, label?: string) => {
  'use cache';
  cacheTag('events');
  return prisma.event.findMany({ ... });
});

// Actions - use "use server" directive
export async function addComment(eventSlug: string, formData: FormData) {
  "use server";
  // ... create comment
  refresh();
}
```

Use `startTransition` or `useTransition` for pending state and automatic error handling.

## Prisma

```bash
pnpm run prisma.push    # Push schema changes to DB
pnpm run prisma.seed    # Seed the database
pnpm run prisma.studio  # Open Prisma Studio
pnpm run prisma.migrate # Run migrations
pnpm run prisma.generate # Generate Prisma client
```

## Error Handling

- Use `error.tsx` for error boundaries
- Use `not-found.tsx` with `notFound()` for 404 pages
- Use `toast.success()`, `toast.error()` from Sonner for user feedback

## Important Files

- `db.ts` - Prisma client instance (SQLite via libsql adapter)
- `prisma/schema.prisma` - Database schema (Event, Comment, Question, Presence)
- `lib/utils.ts` - Utility functions including `cn()`, `timeAgo()`, `parseTime()`, avatar URLs
- `components.json` - shadcn/ui configuration
