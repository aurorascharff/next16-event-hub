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
  page.tsx                  # Home — session list with day tabs + label filter
  layout.tsx                # Root layout (auth gate, theme, fonts)
  [slug]/
    layout.tsx              # Session layout (header, event info, bottom nav)
    page.tsx                # Redirects to comments
    comments/page.tsx       # Comment feed (server-rendered, Suspense)
    questions/page.tsx      # Q&A feed (server-rendered → SWR handoff)
    _components/            # Session-local components
  api/events/[slug]/        # SWR polling endpoints (questions, presence)
components/
  common/                   # Shared utility components (Avatar, EmptyState, AuthGate, ThemeToggle)
  design/                   # Design components with async React (BottomNav, ChipGroup, InlineForm, SubmitButton)
  ui/                       # shadcn/ui primitives
  BackButton.tsx            # Navigate + mutate in one transition
  EventGrid.tsx             # Async server component — session cards
  LabelFilter.tsx           # Label filter chips
data/
  queries/                  # Server-side data fetching with cache()
  actions/                  # Server Actions (mutations with refresh())
lib/
  utils.ts                  # Utilities (cn, timeAgo, parseTime, avatar URLs)
prisma/
  schema.prisma             # Database schema
  seed.ts                   # React Miami 2026 session seed data
```

## The App

- **Session list** (`/`) — Browse React Miami 2026 sessions by day (bottom tabs) and label (filter chips)
- **Comments** (`/[slug]/comments`) — Live comment feed with likes, delete own comments
- **Questions** (`/[slug]/questions`) — Live Q&A with upvotes, sort by Top/Newest with animated reorder
- **Active users** — See who's currently viewing a session (presence tracking)
- **Auth** — Cookie-based demo identity (enter a display name to participate)

## Async React Patterns Demonstrated

| Pattern | Where | React APIs |
|---------|-------|------------|
| Page load streaming | Session detail pages | `Suspense`, Cache Components (`cacheComponents`) |
| Navigation transitions | List → detail, back button | `startTransition`, `addTransitionType`, `ViewTransition` |
| Query param filtering | Day tabs, label pills, sort toggle | `useOptimistic`, `startTransition` (via design components) |
| Update without URL change | Question list reorder on upvote | `useDeferredValue`, `ViewTransition` |
| Mutations | Comments, likes, upvotes, questions | `useActionState`, `useOptimistic`, `useTransition` |
| Navigate + mutate | Back button leaves session + navigates | Single `startTransition` wrapping server action + `router.push` |
| View Transitions | Page slides, Suspense reveals, list reorder | `<ViewTransition>`, `transitionTypes`, CSS view-transition API |
| Actions pattern | BottomNav, ChipGroup, InlineForm, BackButton | Components encapsulate `startTransition` + `useOptimistic` internally |
| Eliminating in-between states | Session pages, event list | `generateStaticParams`, `cache()`, SWR `fallbackData` |

## Component Architecture

- **`components/design/`** — Self-contained components with async/interactive logic (`useOptimistic`, `useTransition`). Consumers pass data and callbacks; the component handles all transition mechanics internally.
- **`components/common/`** — Shared utility components without complex async logic (Avatar, EmptyState, AuthGate, ThemeToggle, ThemeProvider).
- **`components/ui/`** — shadcn/ui primitives (Button, Input, Dialog, Tooltip, Skeleton, Spinner).
- **`app/[slug]/_components/`** — Route-local components only used within the session detail pages.
