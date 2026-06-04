# Next 16 Event Hub

An event companion app exploring Async React and streaming with Next.js 16, React 19, Tailwind CSS, Prisma, and shadcn/ui.

Built with Next.js 16, React 19, Tailwind CSS v4, shadcn/ui (Base UI), and Prisma.

## Getting Started

```bash
pnpm install
pnpm prisma.push
pnpm prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/          # Pages and layouts
features/     # Domain folders (event, comment, question, user) — queries, actions, components
components/   # UI primitives, theme, and app-shell singletons
types/        # Domain types
lib/          # Utility functions
prisma/       # Schema and seed data
```

Each feature folder owns its queries (`<domain>-queries.ts`), actions (`<domain>-actions.ts`), and components (`components/`). Pages in `app/` only compose feature components — they never contain domain logic.

**Naming:** kebab-case filenames, PascalCase component exports, camelCase functions. Suffix transition-based functions with "Action".

## Key Patterns

**Async React:** Replace manual `isLoading`/`isError` state with React 19's coordination primitives — `useTransition` for tracking async work, `useOptimistic` for instant feedback, `Suspense` for loading boundaries, and `use()` for reading promises during render.

## Development Flow

- **Fetching data** — Queries in `features/<domain>/<domain>-queries.ts`, wrapped with `cache()`. Await in Server Components directly.
- **Mutating data** — Server Actions in `features/<domain>/<domain>-actions.ts` with `"use server"`. Invalidate with `refresh()`. Use `useOptimistic` for instant feedback.
- **Errors** — `error.tsx` for boundaries, `not-found.tsx` + `notFound()` for 404s.

## Database

Uses Prisma with PostgreSQL.

```bash
pnpm prisma.push     # Push schema to DB
pnpm prisma.seed     # Seed with session data
pnpm prisma.studio   # Open Prisma Studio
```

## Development Tools

Uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) with format-on-save in VS Code. Configuration in `eslint.config.mjs` and `.prettierrc`.

## Deployment

```bash
pnpm run build
```

See the [Next.js deployment docs](https://nextjs.org/docs/deployment) for more details.
