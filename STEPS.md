# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Opening

- So many fun things happening at this conference — how do we keep track of them all? I built an app for that. Let me show you.
- (Show the app) What do you see? What sucks about it? (Listen to audience) Flickering, delays, layout shifts, lack of feedback — the in-between states.
- Let's fix it with Async React.

## The Async React Render Cycle

- Every interaction follows the same cycle: **Event → Update → Render → Commit**. In Async React, this entire cycle happens inside a **transition** — a concurrent, interruptible render that React can coordinate.
- The in-between states live in the gaps of this cycle. Between the event and the commit, the user is waiting. Async React gives us primitives to design what happens during that wait:
  - **`useOptimistic()`** — Show the result before it's real. Fires instantly at the Update phase, rolls back automatically if the server disagrees.
  - **`<Suspense>`** — Show a placeholder while async data loads during Render. The shell renders immediately, dynamic content streams in.
  - **`<ViewTransition>`** — Animate the Commit. When React swaps old DOM for new, ViewTransition captures the before/after and animates the change.
- These three primitives map directly to the render cycle. Together they cover every in-between state: instant feedback, loading boundaries, and animated commits.

## The Problem: useEffect Flickering

- Before we start fixing, let's make it worse. Show the classic `useEffect` + `useState` + `isLoading` pattern — fetch in the client, set state, render. Watch the flickering, the layout jumps, the waterfall.
- This is what React 19 replaces. Remove the `useEffect` approach, bring back Server Components and Suspense. Now let's design the proper in-between states.

## Setup and Starting Point

- The app is Event Hub — a live session companion for this conference. Attendees can browse sessions, post comments, ask and upvote questions, and favorite sessions. It covers all the in-between states: page loads, navigations, filtering, mutations, and background updates.
- The setup is the Next.js 16 App Router, Prisma ORM, Tailwind CSS. Using React Server Components as the data fetching layer. All data queries are wrapped with React `cache()` for request deduplication — multiple components can call the same query and it only hits the database once per request. Cache Components for the static/dynamic hybrid. For live data, questions poll with `startTransition` + `router.refresh()`.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. You can see the bad UX — blank screens, frozen buttons, no feedback. Let's fix it by designing the appropriate in-between states.

## Page Load

The first in-between state. Before: `[load code/data] → [render]`. After: `[load static shell] → [stream] → [load dynamic data] → [complete]`.

- The home page loads the session grid — right now it's a global spinner. With cache components, we get an error if we don't have a Suspense boundary. But we don't want to hide the whole page.
- Push Suspense down the tree so the shell — the header, day tabs, label pills — renders immediately while only the session grid streams in. Wrap EventGrid in Suspense with a skeleton fallback that mimics the card grid layout.
- Now the shell appears instantly, then the session grid streams in. The shell is statically prerendered with cache components. Better FCP, better LCP.
- Same for the session detail page. The session info (title, speaker, schedule) streams in via Suspense. The layout uses `generateMetadata` to set the page title and description from the event data — this runs server-side and doesn't block rendering. Comments and questions are dynamic — they need their own Suspense boundaries with skeletons.
- Wrap CommentFeed and QuestionFeed in Suspense with skeleton fallbacks. Each skeleton should match the shape of the content — input field skeleton, then card skeletons. Use the React Devtools Suspense panel to pin skeletons and verify there's no CLS.

## Navigation

Navigating to a brand new page. Before: `[load code/data] → [render]`. After: `[load minimal code/data] → [stream in transition, interruptible] → [complete]`.

- Clicking a session card navigates to the detail page. Right now there's no visual feedback during the transition — it just jumps. We'll add animations later.

### Mutation + Navigation

- We can combine mutations and navigation in the same transition. Favorite a few sessions by tapping the heart, then switch to the Favorites tab. The favorites appear immediately — `useOptimistic` handles the instant heart fill, and when you switch tabs, React coordinates the tab transition and the fresh server data in a single render pass.
- This works because both the `FavoriteButton` form action and the `BottomNav` tab switch go through React's transition system. There's no competing state — optimistic updates settle naturally when the server responds with `refresh()`.

## Updating a Page with Query Params

Filtering — technically a navigation, but conceptually you're on the "same page." Before: `[load new data] → [render]`. After: `[update UI with optimistic filter] → [load new data] → [stream/render]`.

- Switching between Day 1 and Day 2 refetches the session grid from the server. Right now there's no feedback — the UI freezes.
- What if these components could handle their own async coordination? The day tabs and favorites use BottomNav — a design component with an action prop. It uses `Route<T>` from Next.js typed routes for type-safe hrefs. The active tab switches instantly while the content loads in the background. The old content stays visible and interactive. The parent just passes an array of routes, no async React code needed.
- The label filter pills use ChipGroup — same idea. Clicking "React" or "Performance" instantly highlights the pill while the filtered grid loads. Just pass an action, the component does the rest. When the Favorites tab is active, the label filter hides — no conflicting state.
- This is the **action props pattern**. Most devs shouldn't need to use `startTransition` themselves if they're using a transition-based router and UI components with action props. Design components like BottomNav, ChipGroup, and SubmitButton abstract away the async coordination. The consumer passes data and callbacks; the component handles transitions, optimistic state, and pending indicators.
- Let's look at how ChipGroup works inside — `useOptimistic` for instant feedback, `useTransition` to keep old content visible. This is what design components abstract away from you. As we see more of these Async React primitives being adopted by design systems and component libraries, we can integrate these patterns without building them from scratch.

## Updating a Page Without Changing the URL

Background updates where no user action triggers the change. Before: `[load new data] → [render]`. After: `[optimistic update] → [load new data] → [stream/render]`.

- Questions need to update when other attendees upvote or ask new questions. We poll using the `usePolling` hook — it calls `startTransition(() => router.refresh())` every 5 seconds. This refreshes the server components, fetching fresh data. The new `initialQuestions` flow down as props to the client component.
- Because it's inside `startTransition`, the update coordinates with `useOptimistic` — in-flight optimistic values stay stable while fresh data arrives.
- This is the key insight — `router.refresh()` inside `startTransition` keeps everything in React's transition system. There's no competing data layer that updates outside of transitions. Upvotes, sort switches, and background polls all go through the same pipeline.

## Mutations

Form submissions and interactions. Before: `[submit form] → [render]`. After: `[submit form] → [optimistic interruptible update] → [render]`.

### Optimistic Mutations

- **FavoriteButton**: Tapping the heart on a session card. We wrap it in a `<form action>` — React handles the transition automatically. `useOptimistic` with a boolean reducer toggle fills the heart instantly. `e.stopPropagation()` on the form prevents the card link navigation. This is the pattern — use `action` on forms so you don't need `startTransition` yourself.
- **LikeButton**: Tapping the heart on a comment. `useOptimistic` with a reducer that manages both `hasLiked` and `likes` count in a single state object. The reducer calculates from the current optimistic state, not the original props — so toggling works correctly in both directions.
- **UpvoteButton**: Same pattern for question upvotes, but with two separate `useOptimistic` hooks — one for the vote count, one for the `hasVoted` boolean.
- Notice how `useOptimistic` automatically rolls back the UI if the mutation fails. We just add a toast on error. On the server side, every action calls `refresh()` after the mutation to invalidate the client router — so all server components re-render with fresh data.
- **DeleteComment**: `useTransition` with pending opacity on the card — it fades while deleting.
- When we tap a few favorites and then switch to the Favorites tab, the entire interaction stays synced automatically with Async React, avoiding any weird states. This is the mutation + navigation pattern in action — multiple optimistic mutations followed by a tab switch, all coordinated through React's transition system.

### Adding Content

- Adding a comment is a form submission. The SubmitButton is a design component — it uses `useOptimistic(false)` with `formAction` to show a spinner while the server processes. The button owns its own pending state, the consumer just passes an `action` prop.
- For questions, we go further — the question appears in the list immediately via `useOptimistic` with a reducer in QuestionList. The temp question gets a client-generated UUID (`crypto.randomUUID()`) that we pass to the server action — so the optimistic and real question share the same ID, and the React key stays stable. No duplicate flash on settle.
- The reducer also has a safety check — if the real question already exists in the base data (from a background refresh), it deduplicates by matching the ID.

## Animations

Making in-between states feel intentional with ViewTransition. Every animation here works with the transition system we've already set up — `startTransition`, `useOptimistic`.

### Page Load Reveals

- Add ViewTransition to the Suspense reveals. Wrap the skeleton fallback with `exit="slide-down"` and the loaded content with `enter="slide-up"`. The skeleton slides away and content slides in — making the loading feel intentional rather than jarring.

### Directional Navigation

- Add directional ViewTransition to navigation. The home page slides left when entering a session, and the detail page slides in from the right. Going back reverses it.
- The session detail page uses BottomNav with a "Back" tab that has `transitionTypes: ['nav-back']` to trigger the reverse slide. The Link on session cards uses `transitionTypes={['nav-forward']}`. BottomNav adds a `'tab-switch'` transition type on every tab click and forwards the tab's `transitionTypes` via `addTransitionType` inside `startTransition`.

### Tab Switch Crossfade

- BottomNav wraps children in `<ViewTransition>` with `default="none"` and `enter={{ default: 'none', 'tab-switch': 'crossfade' }}`. Swapping between tabs crossfades the content smoothly, but other transitions (like navigating into a session) are unaffected because they don't have the `'tab-switch'` type.

### List Animations

- Wrap each QuestionCard in ViewTransition with a unique key. React automatically captures before/after positions and animates the reorder when votes change the ranking — no manual transition types needed. The sort switch already goes through `startTransition` via ChipGroup's action prop, so ViewTransition can capture the positions.
- Each comment is wrapped in ViewTransition with a unique key and `name`, so the exit animation plays when a comment is deleted, and new comments enter with `slide-up`.
- Because background polling also goes through `startTransition`, reorders from other users' votes animate the same way.

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
- Remember, the interactions themselves are not actually any faster. It's all about designing the in-between states — and sometimes eliminating them entirely. Collaborate with your designers on what these states should look like.

## Live Q&A

- Let's try it out! The questions page has a QR code button in the header — tap it to open a scannable QR code linking directly to this session's Q&A. Scan with your phone to join.
- As you submit questions and upvote, watch how everything stays in sync — optimistic updates, background polling, and ViewTransition list animations all coordinating through the same transition system we built.
- The app's home page has a link to the GitHub repo — check it out for the full source code.
- If you want to try adding View Transitions to your own app with AI assistance, install the [View Transitions agent skill](https://skills.sh/vercel-labs/agent-skills/vercel-react-view-transitions) — it teaches your coding agent the patterns, CSS recipes, and Next.js integration from this talk.
