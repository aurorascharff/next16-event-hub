# Miami Spots

A curated Miami city guide exploring Async React patterns with Next.js 16. Features a public cached guide and a dynamic dashboard for managing spots, with streaming, Suspense boundaries, optimistic updates, and view transitions.

Built with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui (Base UI).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

This project uses Prisma with PostgreSQL. Set up your `DATABASE_URL` in a `.env` file, then:

```bash
npm run prisma.push     # Push schema to DB
npm run prisma.seed     # Seed with Miami spots
npm run prisma.studio   # Open Prisma Studio
```

## Project Structure

```
app/                      # Pages and layouts
  [slug]/                 # Public spot detail page
  dashboard/              # Dashboard for managing spots
    _components/          # Dashboard components
    [slug]/               # Spot detail in dashboard
    new/                  # Add new spot
components/
  design/                 # Action prop components (TabList, SubmitButton)
  errors/                 # Error and status components
  ui/                     # shadcn/ui primitives
data/
  queries/                # Data fetching with cache()
  actions/                # Server Actions
lib/
  utils.ts                # Utilities, categories, neighborhoods
```

## Key Patterns

**Cache Components:** Uses `cacheComponents: true` to statically render server components that don't access dynamic data. Keep pages non-async and push dynamic data access into `<Suspense>` boundaries to maximize the static shell.

**Async React:** Replace manual `isLoading`/`isError` state with React 19 primitives — `useTransition`, `useOptimistic`, `Suspense`, and `use()`.

**Action Props:** Design components like `TabList` expose an `action` prop and handle transitions + optimistic updates internally, so consumers only pass `value` and `changeAction`.

## The App

- **Public guide** (`/`) — Browse published Miami spots, cached with `'use cache'`
- **Spot detail** (`/[slug]`) — Full write-up with category, neighborhood, and markdown content
- **Dashboard** (`/dashboard`) — Manage spots with filter tabs, sort, archive, and feature toggles
- **CRUD** — Add, edit, delete spots with form validation and feedback

### Categories

Restaurants, Bars, Beaches, Art, Nightlife, Cafés

### Neighborhoods

South Beach, Wynwood, Little Havana, Brickell, Downtown, Coconut Grove, Design District, Coral Gables
