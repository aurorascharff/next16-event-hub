# DEMO STEPS

## Setup and starting point

- The app is Event Hub — a live session companion for React Miami 2026. Attendees can browse sessions, post comments, ask and upvote questions, and see who's actively watching each session.
- Built with Next.js 16 App Router, Prisma ORM with SQLite, Tailwind CSS, SWR for live polling. Using React Server Components for data fetching and Cache Components for the static/dynamic hybrid.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. This is the bad UX we had from the beginning. Let's fix it by designing the appropriate in-between states.

## 1. Page Load — streaming the shell

Before: [load code/data] → [render]
After: [load static shell] → [stream] → [load dynamic data] → [complete]

- With cacheComponents, the shell (header, day tabs, label pills) is statically rendered. Dynamic data (session grid) streams in via Suspense.
- Add Suspense boundaries around the EventGrid with skeleton components that match the content structure. Skeletons give users a sense of the content structure and make loading feel faster.
- Now the shell renders instantly, and the session grid streams in with a stable skeleton. Better FCP, better LCP.
- Do the same for the session detail page — the session info is cached, while comments, questions, and active users stream in via separate Suspense boundaries.
- The static shell is prefetched for instant navigations.

## 2. Navigation — transitioning between pages

Before: [load code/data] → [render]
After: [load minimal code/data] → [stream in transition, interruptible] → [complete]

- Clicking a session card to go to its detail page: the navigation is wrapped in a transition by the router. The old page stays visible and interactive while the new page loads.
- Add ViewTransition for shared element transitions on session cards — the card morphs into the detail view.
- Suspense reveals on the detail page use slide-up/slide-down ViewTransition animations — the skeleton slides down and the comments content slides up.

## 3. Update existing page with query params — optimistic filters

Before: [load new data] → [render]
After: [update UI with optimistic filter + pending state] → [load new data] → [stream/render]

- Day tabs (All, Day 1, Day 2, Workshops) use the TabList design component with action prop. The component owns the optimistic tab switch, the transition keeping content visible, and the pending indicator. The consumer just passes `tabs`, `activeTab`, and `changeAction`.
- This is the "action props" pattern: most devs shouldn't need to use startTransition themselves if they're using a transition-based router and UI components with action props.
- Label pills (react, performance, architecture, design, ai, etc.) use useOptimistic + useTransition directly — contrasting the action prop approach with the raw primitives.
- The session grid stays visible during the data load. No blank screen, no global spinner.

## 4. Update existing page without changing the URL

Before: [load new data] → [render]
After: [optimistic update] → [load new data] → [stream/render]

- Session detail tabs (Comments / Questions) switch content without changing the URL using useState.
- Question sort toggle (Top / Newest) uses useOptimistic + startTransition for responsive client-side reordering.

## 5. Mutations — instant feedback

Before: [submit form] → [wait] → [render]
After: [submit form] → [optimistic interruptible/reconcilable update] → [render]

- **CommentForm**: useActionState for form submission with automatic error handling. SubmitButton design component uses useFormStatus for pending state. Cmd+Enter to submit.
- **LikeButton**: useOptimistic for immediate like count increment. useSWRConfig().mutate for immediate SWR revalidation so the optimistic value doesn't flicker back to stale data.
- **QuestionForm**: Same useActionState pattern as comments.
- **UpvoteButton**: useOptimistic for immediate vote count increment. Same SWR mutate pattern as likes.
- **DeleteComment**: useTransition with pending opacity on the card. ViewTransition exit animation when the comment is removed.
- Comments and questions enter the list with ViewTransition slide-up animations.

## 6. Live data — SWR polling with server data handoff

- Initial data is fetched on the server and passed as a promise to client components.
- Client components unwrap the promise with `use()` and pass it as SWR `fallbackData`.
- SWR polls the API routes every 3 seconds for comments/questions and every 5 seconds for active users.
- After mutations, `useSWRConfig().mutate` triggers an immediate revalidation so the UI stays in sync without waiting for the next poll.
- Active users are tracked via a presence heartbeat (useEffect interval calling recordPresence server action every 10 seconds).

## 7. ViewTransitions — making changes feel intentional

- Animation is all about in-between states. ViewTransition smooths the moments where content changes.
- **Suspense reveals**: Skeleton slides down, content slides up. Staggered timing so skeleton leaves before content arrives.
- **Live comments/questions**: Each new item enters with a slide-up ViewTransition.
- **Shared elements**: Session card morphs into detail view with `<ViewTransition name={...}>`.
- Use `default="none"` to prevent unintended animations on SWR revalidation or background refreshes.

## Bonus: Eliminating in-between states

- Sometimes in-between states are not desirable. You can sometimes eliminate them entirely:
  - **Prefetching**: The static shell is prefetched by the router, so navigations to cached pages are instant.
  - **Prerendering with cacheComponents**: The session detail header, metadata, and speaker info are all prerendered — no loading state needed for them.
  - The goal is not "no loading states" — the goal is **predictable states**.

## Review

- Before: Long paints, janky layouts, global spinners, frozen interactions.
- After: Instant shell, stable skeletons, optimistic feedback, smooth animations, live data.
- The interactions themselves are not actually any faster — it's all about designing the in-between states.
- FCP, INP, and CLS improvements come from the same patterns that make the UX feel better.
