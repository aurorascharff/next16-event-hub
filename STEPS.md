# DEMO STEPS

## Setup and starting point

- The app is Event Hub — a live session companion for this conference. Attendees can browse sessions, post comments, ask and upvote questions, and favorite sessions. It's a great example because it covers all the in-between states: page loads, navigations, filtering, mutations, and background updates.
- The setup is the Next.js 16 App Router, Prisma ORM, Tailwind CSS. Using React Server Components as the data fetching layer. Cache Components for the static/dynamic hybrid. For live data, questions poll with `startTransition` + `router.refresh()`.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. You can see the bad UX — blank screens, frozen buttons, no feedback. Let's fix it by designing the appropriate in-between states.

## Page Load

The first in-between state. Before: `[load code/data] → [render]`. After: `[load static shell] → [stream] → [load dynamic data] → [complete]`.

- The home page loads the session grid — right now it's a global spinner. With cache components, we get an error if we don't have a Suspense boundary. But we don't want to hide the whole page.
- Push Suspense down the tree so the shell — the header, day tabs, label pills — renders immediately while only the session grid streams in. Wrap EventGrid in Suspense with a skeleton fallback that mimics the card grid layout.
- Now the shell appears instantly, then the session grid streams in. The shell is statically prerendered with cache components. Better FCP, better LCP.
- Same for the session detail page. The session info (title, speaker, schedule) streams in via Suspense. Comments and questions are dynamic — they need their own Suspense boundaries with skeletons.
- Wrap CommentFeed and QuestionFeed in Suspense with skeleton fallbacks. Each skeleton should match the shape of the content — input field skeleton, then card skeletons. Use the React Devtools Suspense panel to pin skeletons and verify there's no CLS.
- What about errors? Add an `error.tsx` boundary to show a user-friendly error message while layouts preserve the surrounding UI. Collaborate with the designer to create intentional error states.
- Add ViewTransition animations to the Suspense reveals. Wrap the skeleton fallback with `exit="slide-down"` and the loaded content with `enter="slide-up"`. The skeleton slides away and content slides in — making the transition feel intentional.

## Navigation

Navigating to a brand new page. Before: `[load code/data] → [render]`. After: `[load minimal code/data] → [stream in transition, interruptible] → [complete]`.

- Clicking a session card navigates to the detail page. Add directional ViewTransition — the home page slides left, the detail page slides in from the right. Going back reverses it.
- The BackButton uses `addTransitionType('nav-back')` inside `startTransition` to trigger the reverse slide. The Link on session cards uses `transitionTypes={['nav-forward']}`.

### Mutation + Navigation

- We can combine a mutation and a navigation in the same transition. The BackButton accepts an optional action prop. It calls the action and `router.push` inside the same `startTransition`. React treats the whole thing as one atomic transition — one smooth animation, not two separate state changes.
- This works because `startTransition` is async-aware. You can await a server action and then trigger navigation, and React coordinates everything.

## Updating a Page with Query Params

Filtering — technically a navigation, but conceptually you're on the "same page." Before: `[load new data] → [render]`. After: `[update UI with optimistic filter] → [load new data] → [stream/render]`.

- Switching between Day 1 and Day 2 refetches the session grid from the server. Right now there's no feedback — the UI freezes.
- The day tabs are a BottomNav design component. It uses `useOptimistic` and `useTransition` internally — the active tab switches instantly while the content loads in the background. The old content stays visible and interactive. The parent just passes an array of routes, no async React code needed.
- The label filter pills work the same way — ChipGroup owns its `useOptimistic` + `useTransition` internally. Clicking "React" or "Performance" instantly highlights the pill while the filtered grid loads.
- This is the **action props pattern**. Most devs shouldn't need to use `startTransition` themselves if they're using a transition-based router and UI components with action props. Design components like BottomNav, ChipGroup, SubmitButton, and BackButton abstract away the async coordination. The consumer passes data and callbacks; the component handles transitions, optimistic state, and pending indicators.
- Let's look at how ChipGroup works inside — `useOptimistic` for instant feedback, `useTransition` to keep old content visible. This is what design components abstract away from you.

## Updating a Page Without Changing the URL

Background updates where no user action triggers the change. Before: `[load new data] → [render]`. After: `[optimistic update] → [load new data] → [stream/render]`.

- Questions need to update when other attendees upvote or ask new questions. We poll using the `usePolling` hook — it calls `startTransition(() => router.refresh())` every 5 seconds. This refreshes the server components, fetching fresh data. The new `initialQuestions` flow down as props to the client component.
- Because it's inside `startTransition`, the update coordinates with `useOptimistic` (in-flight optimistic values stay stable), `useDeferredValue` (reorders get deferred into concurrent renders), and ViewTransition (new questions enter with slide-up animation).
- This is the key insight — `router.refresh()` inside `startTransition` keeps everything in React's transition system. There's no competing data layer that updates outside of transitions. Upvotes, sort switches, and background polls all go through the same pipeline.
- Animate list reordering when questions change rank. Wrap each QuestionCard in ViewTransition with a unique key. React automatically captures before/after positions and animates the reorder — no manual transition types needed. `useDeferredValue` on the sorted array defers the reorder into a concurrent render so ViewTransition can capture the positions.

## Mutations

Form submissions and interactions. Before: `[submit form] → [render]`. After: `[submit form] → [optimistic interruptible update] → [render]`.

### Optimistic Mutations

- **FavoriteButton**: Tapping the star on a session card. We wrap it in a `<form action>` — React handles the transition automatically. `useOptimistic` with a boolean reducer toggle fills the star instantly. `e.stopPropagation()` on the form prevents the card link navigation. This is the pattern — use `action` on forms so you don't need `startTransition` yourself.
- **LikeButton**: Tapping the heart on a comment. `useOptimistic` with a reducer that manages both `hasLiked` and `likes` count in a single state object. The reducer calculates from the current optimistic state, not the original props — so toggling works correctly in both directions.
- **UpvoteButton**: Same pattern for question upvotes. `useOptimistic` for instant vote count. Since each QuestionCard is wrapped in ViewTransition with a unique key, the list smoothly reorders when a vote changes the ranking — for both the upvoter and other users watching via live polling.
- Notice how `useOptimistic` automatically rolls back the UI if the mutation fails. We just add a toast on error.
- **DeleteComment**: `useTransition` with pending opacity on the card — it fades while deleting. ViewTransition exit animation plays when it's removed from the list.

### Adding Content

- Adding a comment is a form submission — `SubmitButton` is a design component that uses `useOptimistic(false)` with `formAction` to show a spinner while the server processes. The button owns its own pending state — the consumer just passes an `action` prop.
- For questions, we go further — the question appears in the list immediately via `useOptimistic` with a reducer in QuestionList. The temp question gets a client-generated UUID (`crypto.randomUUID()`) that we pass to the server action — so the optimistic and real question share the same ID, and the React key stays stable. No duplicate flash on settle.
- The reducer also has a safety check — if the real question already exists in the base data (from a background refresh), it deduplicates by matching the ID.
- Ask your designer what these loading states and toasts should look like. They usually have additional insight.

## Eliminating In-Between States

Sometimes in-between states are not desirable — and you can eliminate them entirely with caching and prerendering. The best loading state is no loading state.

- Add `'use cache'` with `cacheTag('events')` to the `getEvents` query. The session grid data is now cached across requests — subsequent page loads skip the database entirely. After a mutation, `refresh()` updates the current user immediately.
- Add `generateStaticParams` to the session layout. This tells Next.js to pre-render all session pages at build time — every slug is known ahead of time. Users navigate to pre-built HTML with zero loading state. The router prefetches the static shell — navigation feels instant. Suspense skeletons only show for truly dynamic data like comments and questions.
- Combine both: the home page shell is cached, session detail pages are statically generated, and dynamic content streams in via Suspense. The static parts are prefetched by the router, making navigations feel instant.
- Optimistic updates also eliminate in-between states — the FavoriteButton, LikeButton, and UpvoteButton all update instantly because `useOptimistic` skips the wait entirely.

## Review

- Let me get rid of all my changes and show you the difference before and after.
- Before, we had blank screens and jumping layouts, global spinners and frozen buttons, no error boundaries, and harsh transitions.
- Here is the after. We have skeleton placeholders and reserved space, local feedback and optimistic UI, smooth and contextual transitions, and live data. These improvements also reduce First Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift.
- Remember, the interactions themselves are not actually any faster. It's all about designing the in-between states — and sometimes eliminating them entirely.
- Collaborate with your designers on every in-between state. They usually have insight you didn't think of.
