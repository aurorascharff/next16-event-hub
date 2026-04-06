# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Slide 1: Title

- (Open `/slides`) Intro slide — Designing the In-Between States with Async React. Introduce yourself.

## Opening

- (Exit slides, show the app) I'm the first speaker — so we need a conference app to keep track of everything happening here. Good news, I built one. Let me show you.
- The app is Event Hub — a live session companion for this conference. Attendees can browse sessions, post comments, ask and upvote questions, and favorite sessions. It covers all the in-between states: page loads, navigations, filtering, mutations, and background updates.
- ...but wait, this thing is terrible. What's wrong with it? What do you see? (Listen to audience) Flickering, delays, layout shifts, lack of feedback.
- These are the in-between states — the moments between a user action and the final UI. And here's the thing: these aren't DX problems. They're UX problems. That's why we often forget about them — they don't show up as bugs, they don't break tests. But they're what make an app feel broken to your users.
- Let's make it worse. Show the `useEffect` + `useState` pattern — the heart button managing favorite state locally. Tap a few hearts quickly, then switch to the Favorites tab. Watch the flickering — the heart fills, reverts, fills again. Stale data, re-render cascades.

## Slide 2: Async React Render Cycle — Basic

- (Open `/slides/2`) Let's look at the React render cycle to understand where Async React fits in.
- Basic cycle — Event → Update → Render → Commit. A user click triggers an update, causes a re-render, which is committed to DOM.

## Slide 3: Async React Render Cycle — In-Between States

- Now bring async into this. The user clicked something, which triggered an async update — a "busy" state. After the Update, there's another async call to load data — a "loading" state. After Render, a "done" state before Commit. These in-between states are what make the app feel broken.

## Slide 4: Async React Render Cycle — Transitions

- The key to Async React is transitions. A transition coordinates the async work and ensures the render and commit cycle happens smoothly. It batches all updates together as an "Action" and commits them when they're all done — avoiding weird flickers in the UI.

## Slide 5: Async React Render Cycle — Primitives

- We can decide what primitive is most suitable for each phase. `useOptimistic()` for the busy/update phase — instant feedback. `<Suspense>` for the loading/render phase — placeholder while data loads. `<ViewTransition>` for the done/commit phase — animate the change.

## Slide 6: Async React Render Cycle — Clean

- The real magic — when async operations take very little time to complete, the whole interaction feels synchronous. The busy/loading/done labels disappear. Under 150ms feels synchronous; above 150ms the in-between states appear. That's the goal. (Credit: Async React talk at React Conf)
- (Exit slides, back to the app) Remove the `useEffect` approach, bring back Server Components and the transition system. Now let's fix the app.

## Setup and Starting Point

- The setup is the Next.js 16 App Router, Prisma ORM, Tailwind CSS. Using React Server Components as the data fetching layer. All data queries are wrapped with React `cache()` for request deduplication — multiple components can call the same query and it only hits the database once per request. Cache Components for the static/dynamic hybrid. For live data, questions poll with `startTransition` + `router.refresh()`.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. You can see the bad UX — blank screens, frozen buttons, no feedback. Let's fix it by designing the appropriate in-between states.

## Page Load

- The home page blocks — EventGrid is an async server component with no Suspense boundary, so the entire route waits for data before rendering anything. Fix: wrap EventGrid in `<Suspense>` with a skeleton fallback that mimics the card grid layout. Now the shell — header, day tabs, label pills — renders immediately while only the session grid streams in. Better FCP, better LCP.
- Navigate to the session detail page. It already has Suspense, but with a generic spinner as the fallback — notice the CLS when the event details load in and push the comment section down. Fix: replace the spinner with proper skeleton fallbacks that reserve the right amount of space. Each skeleton should match the shape of the content. Use the React Devtools Suspense panel to pin skeletons and verify there's no CLS.
- Do the same for the questions page — wrap EventHeader and QuestionFeed in Suspense with skeleton fallbacks.

## Navigation

- Clicking a session card navigates to the detail page. Right now there's no visual feedback during the transition — it just jumps. We'll add animations later.

### Mutation + Navigation

- We can combine mutations and navigation in the same transition. Favorite a few sessions by tapping the heart, then switch to the Favorites tab. The favorites appear immediately — `useOptimistic` handles the instant heart fill, and when you switch tabs, React coordinates the tab transition and the fresh server data in a single render pass.
- This works because both the `FavoriteButton` form action and the `BottomNav` tab switch go through React's transition system. There's no competing state — optimistic updates settle naturally when the server responds with `refresh()`.

## Updating a Page with Query Params

- Switching between Day 1 and Day 2 refetches the session grid from the server. Right now there's no feedback — the UI freezes.
- What if these components could handle their own async coordination? The day tabs and favorites use BottomNav — a design component with an action prop. It uses `Route<T>` from Next.js typed routes for type-safe hrefs. The active tab switches instantly while the content loads in the background. The old content stays visible and interactive. The parent just passes an array of routes, no async React code needed.
- The label filter pills use ChipGroup — same idea. Clicking "React" or "Performance" instantly highlights the pill while the filtered grid loads. Just pass an action, the component does the rest. When the Favorites tab is active, the label filter hides — no conflicting state.
- This is the **action props pattern**. Most devs shouldn't need to use `startTransition` themselves if they're using a transition-based router and UI components with action props. Design components like BottomNav, ChipGroup, and SubmitButton abstract away the async coordination. The consumer passes data and callbacks; the component handles transitions, optimistic state, and pending indicators.
- Let's look at how ChipGroup works inside — `useOptimistic` for instant feedback, `useTransition` to keep old content visible. This is what design components abstract away from you. As we see more of these Async React primitives being adopted by design systems and component libraries, we can integrate these patterns without building them from scratch.

## Updating a Page Without Changing the URL

- Questions need to update when other attendees upvote or ask new questions. We poll using the `usePolling` hook — it calls `startTransition(() => router.refresh())` every 5 seconds. This refreshes the server components, fetching fresh data. The new `initialQuestions` flow down as props to the client component.
- Because it's inside `startTransition`, the update coordinates with `useOptimistic` — in-flight optimistic values stay stable while fresh data arrives.
- This is the key insight — `router.refresh()` inside `startTransition` keeps everything in React's transition system. There's no competing data layer that updates outside of transitions. Upvotes, sort switches, and background polls all go through the same pipeline.

## Mutations

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

### Card Morphs (Tab Switch & Filter)

- Each event card in EventGrid has `<ViewTransition name={`event-${event.slug}`} share="auto" update={{ filter: 'auto', 'tab-switch': 'auto', default: 'none' }} default="none">`. Cards that persist across tab or filter changes morph to their new grid positions — other transitions don't animate.
- BottomNav adds `addTransitionType('tab-switch')` on every tab click. ChipGroup adds `addTransitionType('filter')` on every category filter change. Both types are handled by the per-card `update` map.
- BottomNav also wraps children in `<ViewTransition update={{ 'tab-switch': 'auto', default: 'none' }} default="none">`, but because the per-card ViewTransitions are innermost, they claim the DOM mutations — the wrapper doesn't produce a visible crossfade.

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

- Now let's use what we built. Open the QR code — scan it to join this session's Q&A. Submit your questions and upvote the ones you want answered.
- Watch how everything stays in sync — optimistic updates, background polling, and ViewTransition list animations all coordinating through the same transition system we built.
- (Read top-voted questions from the app, answer them live if time allows)
- The app's home page has a link to the GitHub repo — check it out for the full source code.
- If you want to try adding View Transitions to your own app with AI assistance, install the [View Transitions agent skill](https://skills.sh/vercel-labs/agent-skills/vercel-react-view-transitions) — it teaches your coding agent the patterns, CSS recipes, and Next.js integration from this talk.
