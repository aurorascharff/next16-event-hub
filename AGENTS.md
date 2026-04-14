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
- Prisma with PostgreSQL (`@prisma/adapter-pg`)
- `startTransition` + `router.refresh()` for question polling
- Zod for validation
- Sonner for toasts
- next-themes for dark/light mode

## Next.js 16 APIs (Not in Training Data)

These APIs are new in Next.js 16 and may not be in model training data:

- `forbidden()` / `unauthorized()` - Throw from Server Components/Actions to trigger `forbidden.tsx` or `unauthorized.tsx`
- `cookies()` / `headers()` - Now async, must be awaited
- `connection()` - For dynamic rendering opt-in
- `'use cache'` directive - For caching with `cacheLife()` and `cacheTag()`
- `revalidateTag()` / `updateTag()` - Invalidate cache tags
- `refresh()` - Refresh client router from Server Actions
- `after()` - Run code after response is sent

## Typed Routes

`typedRoutes: true` in `next.config.ts` generates `.next/types/routes.d.ts`. Use framework types instead of custom ones:

- Pages: `PageProps<'/[slug]'>` — `params` and `searchParams` are promises
- Layouts: `LayoutProps<'/[slug]'>` — `params` and `children`
- Route handlers: `RouteContext<'/api/...'>`

## Code Style

- **Components**: PascalCase files (`MyComponent.tsx`)
- **Folders**: kebab-case (`my-folder/`)
- **Utils/hooks**: camelCase (`useMyHook.ts`, `myUtil.ts`)
- Use `type` over `interface` unless declaration merging is needed
- Use `cn` util for conditional Tailwind classes
- Use Base UI for custom interactive components not in shadcn/ui
- Add shadcn/ui components with `npx shadcn@latest add <component-name>`
- Suffix transition-based functions with "Action" (`submitAction`, `deleteAction`)

## Folder Structure

```text
app/
  page.tsx                    # Home — session list with day tabs + label filter
  layout.tsx                  # Root layout (auth gate, theme, fonts)
  (demo)/
    slides/                   # Companion slide deck (nextjs-slides)
    notes/                    # Speaker notes (syncs with slides)
  [slug]/
    layout.tsx                # Session layout (header, event info, bottom nav)
    page.tsx                  # Session detail — comment feed (EventDetails via Suspense)
    error.tsx                 # Error boundary for session pages
    not-found.tsx             # 404 for unknown slugs
    _components/              # Session-level client components (SessionTabs, EventDetails, CommentCard, CommentForm, LikeButton)
    questions/
      page.tsx                # Q&A feed with sort
      _components/            # Question-local components
components/
  common/                     # Shared utility components (Avatar, EmptyState, AuthGate, ThemeToggle)
  design/                     # Action prop components (BottomNav, ChipGroup, SubmitButton)
  ui/                         # shadcn/ui primitives
data/
  queries/                    # Server-side queries with cache()
  actions/                    # Server Actions (mutations with refresh())
types/                        # Shared types derived from query return types (Question, Comment, SortValue)
lib/                          # Utility functions and hooks (usePolling)
prisma/                       # Prisma schema and seeds
```

- **components/common** — Shared utility components without complex async logic
- **components/design** — Components that expose action props and handle async coordination internally (`useOptimistic`, `useTransition`). Consumers pass data and callbacks; the component handles transition mechanics.
- **components/ui** — shadcn/ui primitives
- **data/queries** — Server-side data fetching with `cache()` for deduplication
- **data/actions** — Server Actions with `"use server"` for mutations. Use `refresh()` to invalidate the client router.

Route-specific code goes in `_components` folders. Shared code lives at the nearest common ancestor.

## cacheComponents & Static Shell

`cacheComponents: true` in `next.config.ts` caches server components that don't access dynamic data. To maximize the static shell:

- Keep pages **non-async**. Push `searchParams`, `cookies()`, `headers()`, and uncached fetches into async server components inside `<Suspense>`.
- Async components accessing dynamic data should be wrapped in `<Suspense>` with skeleton fallbacks.

## Development Flow

Push dynamic data access as deep as possible in the component tree to maximize static content.

- **Fetching data** — Create queries in `data/queries/`, call in Server Components. Use `cache()` for deduplication.
- **Mutating data** — Create Server Actions in `data/actions/` with `"use server"`. Use `refresh()` to invalidate. Use `useOptimistic` for instant feedback.
- **Live data** — Questions poll via `startTransition(() => router.refresh())`, keeping updates in React's transition system. Comments update on user action via `refresh()`.
- **Navigate + mutate** — Mutations and navigation coordinate through React's transition system. Favorite sessions, then switch to the Favorites tab — optimistic updates settle naturally when the server responds.

## Data Fetching & Mutations

```typescript
// Queries — use cache() for deduplication
export const getEvents = cache(async (day?: string, label?: string) => {
  'use cache';
  cacheTag('events');
  return prisma.event.findMany({ ... });
});

// Actions — use "use server" directive
export async function addComment(eventSlug: string, formData: FormData) {
  'use server';
  // ... create comment
  refresh();
}
```

Use `startTransition` or `useTransition` for pending state and automatic error handling.

## Async React Patterns

Replace manual `isLoading`/`isError` state with React 19 primitives:

**Actions** — any async function run inside `startTransition`. React tracks `isPending` automatically; unexpected errors bubble to error boundaries.

```tsx
const [isPending, startTransition] = useTransition();
function handleDeleteAction() {
  startTransition(async () => {
    await deleteComment(id);
  });
}
```

**Optimistic updates** — `useOptimistic` updates immediately inside a transition, reverts automatically on failure.

```tsx
const [optimisticLiked, setOptimisticLiked] = useOptimistic(hasLiked);
<form action={async () => {
  setOptimisticLiked(!optimisticLiked);
  await toggleLike(commentId);
}}>
```

**Suspense** — declares loading boundaries. Shows the fallback on first load; subsequent updates keep old content visible. Wrap with a co-located skeleton whenever accessing dynamic data.

**`use()`** — unwrap promises in client components during render. Suspends until resolved; errors go to the nearest error boundary.

## Design Components (Action Props Pattern)

Components in `components/design/` handle async coordination internally and expose action props to consumers. Consumers pass data and callbacks; the component handles transition mechanics.

```tsx
// Consumer — pass an action prop instead of a plain callback
<BottomNav tabs={tabs} activeIndex={activeIndex} action={href => router.push(href)} />
<ChipGroup items={items} value={active} action={handleSortAction} />

// Inside a design component — wraps the action in a transition with optimistic feedback
function BottomNav({ tabs, activeIndex, action }) {
  const [optimisticIndex, setOptimisticIndex] = useOptimistic(activeIndex);
  const [isPending, startTransition] = useTransition();

  function handleClick(href, index) {
    startTransition(async () => {
      setOptimisticIndex(index);
      await action(href);
    });
  }
  // ...
}
```

## Pending UI

Set `data-pending={isPending ? '' : undefined}` on a root element. Style ancestors with `has-data-pending:animate-pulse` or `group-has-data-pending:opacity-50`.

```tsx
<div data-pending={isPending ? '' : undefined}>
  <div className="has-data-pending:animate-pulse">...</div>
</div>
```

## Skeleton Co-location

Export skeleton components from the **same file** as their component, placed below the main export.

```tsx
export function EventGrid() { ... }

export function EventGridSkeleton() { ... }
```

## Server Components (Default)

- All components are Server Components unless `'use client'` is added
- Can be `async` and fetch data with `await`
- Wrap in `<Suspense>` with fallbacks when needed
- Use `React.cache()` for data fetching functions

## Client Components

Add `'use client'` only when needed for:

- Event handlers, hooks, browser APIs
- `useOptimistic()` for optimistic updates and pending state (action prop pattern)
- `useTransition()` for non-blocking updates
- `router.push()` for client-side navigation

## Prisma

```bash
pnpm run prisma.push     # Push schema changes to DB
pnpm run prisma.seed     # Seed the database
pnpm run prisma.studio   # Open Prisma Studio
pnpm run prisma.migrate  # Run migrations
pnpm run prisma.generate # Generate Prisma client
```

## Error Handling

- Use `error.tsx` for error boundaries
- Use `not-found.tsx` with `notFound()` for 404 pages
- Use `toast.success()`, `toast.error()` from Sonner for user feedback
- Errors thrown inside transitions bubble to error boundaries automatically — no try/catch needed

## Important Files

- `db.ts` - Prisma client instance (PostgreSQL via pg adapter)
- `prisma/schema.prisma` - Database schema (Event, Comment, Question, Favorite)
- `lib/utils.ts` - Utility functions including `cn()`, `timeAgo()`, `parseTime()`, avatar URLs
- `components.json` - shadcn/ui configuration
- `next.config.ts` - `typedRoutes`, `cacheComponents`
