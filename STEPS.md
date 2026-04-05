# DEMO STEPS

## Setup and starting point

- The app is a Miami city guide — a public-facing directory of spots (restaurants, bars, beaches, art, nightlife, cafés) and a dashboard for curating them. The public side is static/cached, the dashboard is dynamic.
- Built with Next.js 16 App Router, Prisma ORM and PostgreSQL, Tailwind CSS. Using React Server Components for data fetching and Cache Components for the static/dynamic hybrid.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. This is the bad UX we had from the beginning. Let's fix it by designing the appropriate in-between states.

## 1. Page Load — streaming the shell

Before: [load code/data] → [render]
After: [load static shell] → [stream] → [load dynamic data] → [complete]

- The initial loading state is a global spinner — the whole page is hidden while data loads. Delete loading.tsx.
- With cacheComponents, the shell (header, tabs, sort button) is statically rendered. The dynamic data (spot list) streams in via Suspense.
- Add Suspense boundaries around the SpotList with skeleton components that match the content structure. Skeletons give users a sense of the content structure and make loading feel faster.
- Now the shell renders instantly, and the spot list streams in with a stable skeleton. Better FCP, better LCP.
- Use the React Devtools Suspense panel to pin skeletons and design them to match content. No CLS.
- Do the same for the spot detail page — split header and content into separate Suspense boundaries so the header streams first.
- Fix the edit page — switch from loading.tsx to Suspense with skeleton.
- The static shell is prefetched for instant navigations.

## 2. Navigation — transitioning between pages

Before: [load code/data] → [render]
After: [load minimal code/data] → [stream in transition, interruptible] → [complete]

- Clicking a spot card to go to its detail page: the navigation is wrapped in a transition by the router. The old page stays visible and interactive while the new page loads.
- Add ViewTransition for slide animations between list and detail views. This gives users a contextual transition that communicates spatial relationship — "I'm going deeper."
- Use the SlideRightTransition component (wrapping ViewTransition with slide-from-right/slide-to-left classes) for navigating to detail pages.
- Use SlideLeftTransition for going back to the list.
- Add shared element transitions with `<ViewTransition name={...} share="morph">` on spot cards — the card morphs into the detail view.

## 3. Update existing page with query params — optimistic filters

Before: [load new data] → [render]
After: [update UI with optimistic filter + pending state] → [load new data] → [stream/render]

- Filter tabs (All, Published, Drafts, Featured, Archived) use search params and refetch data from the server — an async routing navigation.
- Use the TabList design component with action prop. The component owns the optimistic tab switch, the transition keeping content visible, and the pending indicator. The consumer just passes `value` and `changeAction` — no manual useOptimistic or useTransition.
- This is the "action props" pattern: most devs shouldn't need to use startTransition themselves if they're using a transition-based router and UI components with action props. The design component abstracts the async coordination.
- SortButton: Use startTransition + useOptimistic for responsive sort. Here we show the primitives directly to contrast with the action prop approach.
- The spot list stays visible during the data load. No blank screen, no global spinner.

## 4. Update existing page without changing the URL

Before: [load new data] → [render]
After: [optimistic update] → [load new data] → [stream/render]

- "Show more" pattern at the bottom of the spot list — load additional spots without changing the URL.
- Use startTransition to keep the existing content visible while more data loads.
- Could also show an inline expand/collapse for spot previews in the list — click to reveal description without navigating.

## 5. Mutations — instant feedback

Before: [submit form] → [wait] → [render]
After: [submit form] → [optimistic interruptible/reconcilable update] → [render]

- **ArchiveButton**: useOptimistic for immediate UI update. The archive icon toggles instantly, rolls back automatically on failure. Use `data-pending` and CSS `has()` for glimmer effect on the card.
- **FeatureButton**: Same pattern — optimistic star toggle, automatic rollback, toast on error.
- Click archive on multiple spots, then switch tabs — the entire interaction is synced automatically with Async React. No weird states.
- **SpotForm** (create/edit): Pessimistic mutation with useActionState. The SubmitButton design component uses useFormStatus to show pending state — consistent feedback across all forms.
- **DeleteSpotButton**: Transition-based delete with confirmation dialog and pending spinner.
- Toast on error for user feedback. useOptimistic handles rollback automatically, so no manual error state management.

## 6. ViewTransitions — making changes feel intentional

- Animation is all about in-between states. ViewTransition smooths the moments where content changes.
- **Suspense reveals**: Skeleton slides down, content slides up. Staggered timing so skeleton leaves before content arrives.
- **List reordering**: When sorting changes, spot cards animate to their new positions via `<ViewTransition key={...}>` on each card.
- **Shared elements**: Spot card morphs into detail view with `share="morph"`.
- **Page navigations**: Directional slides communicate spatial relationship (forward = right, back = left).
- Use `default="none"` to prevent unintended animations on revalidation or background refreshes.
- These coexist because they fire at different moments: nav slides during navigation (with transition types), Suspense reveals when data streams (no type).

## Bonus: Eliminating in-between states

- Sometimes in-between states are not desirable. You can sometimes eliminate them entirely:
  - **Prefetching**: The static shell is prefetched by the router, so navigations to cached pages are instant.
  - **Prerendering with cacheComponents**: The dashboard shell, tabs, and sort button are all prerendered — no loading state needed for them.
  - The goal is not "no loading states" — the goal is **predictable states**.

## Review

- Before: Long paints, janky layouts, global spinners, frozen interactions.
- After: Instant shell, stable skeletons, optimistic feedback, smooth animations.
- The interactions themselves are not actually any faster — it's all about designing the in-between states.
- FCP, INP, and CLS improvements come from the same patterns that make the UX feel better.
