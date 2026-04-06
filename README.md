# Next 16 Event Hub

An interactive, live event companion app exploring Async React patterns with optimistic UI, transition-based polling, and View Transitions. Attendees can browse sessions, post comments, ask and upvote questions, favorite sessions, and see who's actively watching.

Built with Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (Base UI), Prisma (SQLite), and SWR (presence only).

## Getting Started

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                      # Pages and layouts
components/
  common/                 # Shared utility components
  design/                 # Action prop components
  ui/                     # shadcn/ui primitives
data/
  actions/                # Server Actions
  queries/                # Data fetching with cache()
hooks/                    # Custom hooks
lib/                      # Utility functions
prisma/                   # Schema and seed data
```

- **components/ui** — shadcn/ui components. Add with `npx shadcn@latest add <component-name>`
- **components/design** — Components that expose action props and handle async coordination internally (BottomNav, ChipGroup, SubmitButton)
- **components/common** — Shared utility components without complex async logic

Every route folder should contain everything it needs. Components and functions live at the nearest shared space in the hierarchy.

**Naming:** PascalCase for components, kebab-case for folders, camelCase for functions/hooks. Suffix transition-based functions with "Action".

## Key Patterns

**Cache Components:** Uses `cacheComponents: true` to statically render server components that don't access dynamic data. Keep pages non-async and push dynamic data access into `<Suspense>` boundaries to maximize the static shell.

**Async React:** Replace manual `isLoading`/`isError` state with React 19's coordination primitives — `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries, and `use()` for reading promises during render.

**Live Data Sync:** Questions poll via `startTransition(() => router.refresh())` — updates flow through React's transition system, coordinating with `useOptimistic`, `useDeferredValue`, and ViewTransition. Active users use SWR for lightweight presence polling.

## Development Flow

- **Fetching data** — Queries in `data/queries/`, wrapped with `cache()`. Await in Server Components directly.
- **Mutating data** — Server Actions in `data/actions/` with `"use server"`. Invalidate with `refresh()`. Use `useOptimistic` for instant feedback.
- **Caching** — Add `"use cache"` with `cacheTag()` to pages, components, or functions to include them in the static shell.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s.

## Database

Uses Prisma with SQLite (local `dev.db` file). No external database needed.

```bash
pnpm run prisma.push     # Push schema to DB
pnpm run prisma.seed     # Seed with session data
pnpm run prisma.studio   # Open Prisma Studio
```

## Deployment

```bash
pnpm run build
```

See the [Next.js deployment docs](https://nextjs.org/docs/deployment) for more details.
