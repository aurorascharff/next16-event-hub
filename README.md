# Event Hub

A live session companion app for React Miami 2026 — browse conference sessions, post comments, ask questions with upvotes, and see who's actively watching. Built to demonstrate Async React patterns for the talk "Designing the In-Between States with Async React."

Built with Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (Base UI), Prisma (SQLite), and SWR.

## Getting Started

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Uses Prisma with SQLite (local `dev.db` file). No external database needed.

```bash
pnpm run prisma.push     # Push schema to DB
pnpm run prisma.seed     # Seed with React Miami sessions
pnpm run prisma.studio   # Open Prisma Studio
```

## Project Structure

```
app/
  _components/            # Home page components (AuthGate, filters, grid)
  [slug]/                 # Session detail page
    _components/          # Comments, questions, presence, tabs
  api/events/[slug]/      # SWR polling endpoints (questions, presence)
components/
  design/                 # Design components with async React (BottomNav, ChipGroup, InlineForm, SubmitButton)
  ui/                     # shadcn/ui primitives
data/
  queries/                # Server-side data fetching with cache()
  actions/                # Server Actions (mutations)
lib/
  utils.ts                # Utilities, labels, avatar URLs
prisma/
  schema.prisma           # Database schema
  seed.ts                 # React Miami session seed data
```

## Key Patterns

**Cache Components (PPR):** Uses `cacheComponents: true` to statically prerender server components that don't access dynamic data. The session detail page shell renders instantly while comments and presence stream in via Suspense.

**Async React Primitives:** Replaces manual `isLoading`/`isError` state with `useTransition`, `useOptimistic`, `Suspense`, `use()`, `useActionState`, and `useFormStatus`.

**Action Props:** Design components like `TabList` expose a `changeAction` prop and handle transitions + optimistic updates internally.

**SWR Polling:** Live comments, questions, and active user presence poll via SWR with server-rendered initial data passed through `use()` as `fallbackData`.

**View Transitions:** Suspense reveals animate with slide-up/down. Individual comments and questions enter with `ViewTransition`. Session cards use shared element transitions.

## The App

- **Session list** (`/`) — Browse React Miami 2026 sessions, filter by day and labels
- **Session detail** (`/[slug]`) — Cached session info + live comments, Q&A with upvotes, and active user presence
- **Auth** — Cookie-based demo identity (enter a display name to participate)

### Async React Patterns Demonstrated

| Pattern | Where | React APIs |
|---------|-------|------------|
| Page load streaming | Session detail page | `Suspense`, `use()`, Cache Components |
| Navigation transitions | List → detail | `startTransition`, `ViewTransition` |
| Optimistic filters | Day tabs, label pills | `useOptimistic`, `useTransition`, action props |
| Mutations | Comments, likes, upvotes | `useActionState`, `useOptimistic`, `useTransition` |
| Live data | Comment feed, presence | `use()` → SWR handoff, `useSWRConfig().mutate` |
| Animations | Suspense reveals, list enter | `ViewTransition`, CSS view-transition API |
