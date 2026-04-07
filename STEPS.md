# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Slide 1: Title

- (Open `/slides`) Intro slide — Designing the In-Between States with Async React.
- Introduce yourself: Aurora Scharff, DX Engineer at Vercel working on Next.js developer experience. React Certification Lead at certificates.dev. From Norway.
- First time at React Miami — excited to be here.

## Opening

- (Exit slides, show the app) I'm the first speaker — so we need a conference app to keep track of everything happening here. Good news, I built one. Let me show you.
- The app is Event Hub — a live session companion for this conference. Attendees can browse sessions, post comments, ask and upvote questions, and favorite sessions. It covers all the in-between states: page loads, navigations, filtering, mutations, and background updates.
- ...but wait, this thing is terrible. What's wrong with it? What do you see? (Listen to audience) Flickering, delays, layout shifts, lack of feedback.
- These are the in-between states — the moments between a user action and the final UI. And here's the thing: these aren't DX problems. They're UX problems. That's why we often forget about them — they don't show up as bugs, they don't break tests. But they're what make an app feel broken to your users.
- How would we normally try to fix this? Open `FavoriteButton` — it's already using `useState` + `useEffect` to manage local favorite state. Tap a few hearts quickly, then switch to the Favorites tab. Watch the flickering — the heart fills, reverts, fills again. Stale data, re-render cascades. The traditional approach makes it worse, not better. Leave it broken — we'll come back and fix it properly later.
- So how does Async React solve this? Let's look at where it fits in the render cycle.

## Slide 2: Async React Render Cycle — Basic

- (Open `/slides/2`) The React render cycle.
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

- The setup is the Next.js 16 App Router, Prisma ORM, Tailwind CSS. Using React Server Components as the data fetching layer.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. You can see the bad UX — blank screens, frozen buttons, no feedback. Let's fix it by designing the appropriate in-between states.

## In-Between States by Interaction

### 1) Page Load

- Right now the page blocks on all code and data, then renders everything at once. We want to render the static shell first, stream in dynamic data, and complete progressively. We want: load the static shell first, stream in dynamic data, then complete. The home page blocks — EventGrid is an async server component with no Suspense boundary, so the entire route waits for data before rendering anything.
- On page load, we see an error. This is Cache Components (`cacheComponents: true` in `next.config.ts`) — the Next.js 16 rendering model. There are no longer static OR dynamic pages; every route is a mix. Cache Components requires us to be explicit about async work: either cache it with `'use cache'` or stream it with `<Suspense>`. Right now this async component has neither, so the framework is telling us the entire route is blocking on this data — a built-in signal that we have a potential performance problem.
- Fix: wrap EventGrid in `<Suspense>` with a skeleton fallback that mimics the card grid layout. Now the shell — header, day tabs, label pills — renders immediately while only the session grid streams in. Better FCP, better LCP.
- Navigate to the session detail page. It already has Suspense, but with two centered spinners as fallbacks. The data loads and the spinners disappear — notice the CLS when the event details push the comment section down. Fix: first replace the spinners with proper skeleton fallbacks that reserve the right amount of space. Each skeleton should match the shape of the content. Use the React Devtools Suspense panel to pin skeletons and verify there's no CLS.
- APIs: `Suspense`, streaming Server Components.

### 2) Route Navigation

- When navigating to a new page, the browser loads all code and data before rendering — a blank gap. With Suspense, we can stream in minimal code first and progressively fill in the rest.
- Navigate to the questions page — it has no Suspense boundaries at all, so the whole page blocks. Wrap EventHeader and QuestionFeed in Suspense with skeleton fallbacks. Now the header and question feed stream in progressively instead of blocking. We'll add animations to navigations later.

### 3) Query Param Navigation

- Filtering is technically a navigation, but conceptually you're on the same page. Without transitions, the UI freezes while new data loads. With optimistic updates, we can update the filter immediately and stream in the new data behind the scenes. Switching between Day 1 and Day 2 refetches the session grid from the server. Right now there's no feedback — the UI freezes.
- What if these components could handle their own async coordination? Look at BottomNav — right now it takes an `onChange` callback. When you click a tab, it calls `onChange` and that's it. No transition, no optimistic state, the UI just freezes until the navigation completes.
- Let's turn `onChange` into an `action` prop. This is the **action props pattern**: a design component exposes a prop like `action`, `changeAction`, or `submitAction` — the naming signals it will run inside a transition. Inside, the component uses `useOptimistic` and `useTransition` to handle pending states and instant feedback. The consumer just passes data and a callback; the component does the rest.
- Now the day tabs switch instantly while content loads in the background. The old content stays visible and interactive. The parent just passes an array of routes, no async React code needed.
- The label filter pills use ChipGroup — same idea. Clicking "React" or "Performance" instantly highlights the pill while the filtered grid loads. Just pass an action, the component does the rest. When the Favorites tab is active, the label filter hides — no conflicting state.
- Note: the sort toggle in QuestionList already uses `action` — it's an internal detail, not something we change in the demo. It needs to be in a transition so list animations fire correctly later.
- This is the key insight: most devs shouldn't need to use `startTransition` themselves if they're using a transition-based router and UI components with action props. As the Async React Working Group standardizes these patterns across routers, data libraries, and design systems, you can integrate them without building the coordination from scratch.
- Let's look at how ChipGroup works inside — `useOptimistic` for instant feedback, `useTransition` to keep old content visible. This is what design components abstract away from you.

### 4) Background Update

- Sometimes the page needs to update without any user action — background updates where fresh data arrives from the server. Without transitions, new data would flash in and disrupt whatever the user is doing. Right now the questions page is static — you have to refresh the browser to see new questions or upvotes from other attendees.
- Add a `usePolling` hook that calls `startTransition(() => router.refresh())` every 5 seconds. This refreshes the server components, fetching fresh data. The new `initialQuestions` flow down as props to the client component.
- Because it's inside `startTransition`, the update coordinates with `useOptimistic` — in-flight optimistic values stay stable while fresh data arrives. There's no competing data layer that updates outside of transitions. Upvotes, sort switches, and background polls all go through the same pipeline.

### 5) Mutations

Form submissions and interactions — the user does something and expects instant feedback. Right now the UI either freezes or waits for the server round-trip before showing any change. Not everything has a design component with an action prop — sometimes you need custom async coordination with `useOptimistic` and `useTransition` directly. That's fine too. Let's fix each one.

#### Pessimistic Mutations

- **DeleteButton**: Right now deleting a comment has no feedback — the card just disappears after a delay. Extract a `DeleteButton` that uses `useTransition` and sets `data-pending` on itself when deleting. On the parent `CommentCard` row, use `has-data-pending:opacity-50` — CSS `:has()` lets the whole card fade when any child is pending, without the card needing to be a client component.

#### Optimistic Mutations

- **FavoriteButton**: Remember the broken `useEffect` heart from the opening? Let's fix it properly. Remove the local state approach and replace the `onClick` with a `<form action>`. Here's the key insight: a form's `action` prop is just like the `action` prop on BottomNav or ChipGroup — React wraps it in a transition automatically. So we get `useOptimistic` for free. Add `useOptimistic` with a boolean reducer to toggle the heart immediately — and the transition system handles the rest.
- **Mutation + Navigation**: Tap a few favorites, then switch to the Favorites tab. No flickering, no stale data. This works because mutations and navigation both go through the transition system — `useOptimistic` handles the instant heart fill, and when you switch tabs, React coordinates the tab transition and the fresh server data in a single render pass. Optimistic updates settle naturally when the server responds with `refresh()`.
- **LikeButton**: Currently uses `onSubmit` — change to `action` to get into a transition, then add `useOptimistic`. The reducer manages both `hasLiked` and `likes` in a single state object, calculating from the current optimistic state so toggling works correctly in both directions.
- **UpvoteButton**: Same — change `onSubmit` to `action`, add `useOptimistic`. Upvoting is one-way (no un-vote), so the reducer just increments the count and disables the button.
- `useOptimistic` automatically rolls back if the action fails — just add a toast on error. On the server side, every action calls `refresh()` to invalidate the client router so all server components re-render with fresh data.

#### Optimistic Create (Questions)

- Right now submitting a question waits for the server before it appears in the list. Add `useOptimistic` with a reducer in QuestionList so the question appears immediately. Use the `optimisticCreate` snippet — it generates a client-side UUID (`crypto.randomUUID()`) and passes it to the server action so the optimistic and real question share the same ID and the React key stays stable. No duplicate flash on settle.
- Add a safety check in the reducer — if the real question already exists in the base data (from a background refresh), deduplicate by matching the ID.

## Animations (Commit Polish)

The final phase — the commit. Without animations, Suspense reveals pop in, navigations jump, and list reorders snap. `<ViewTransition>` makes these in-between states feel intentional.

- How do ViewTransitions trigger? They activate when DOM changes happen inside a React transition — `startTransition`, `useOptimistic`, or `Suspense` resolving. We've already set all of that up. So as long as you're using Async React, you get all this for free — just wrap elements in `<ViewTransition>` and the browser animates the changes. By default it cross-fades, but we can customize with CSS classes and props.
- For the patterns and CSS recipes we're about to use, I'm using an agent skill — a knowledge file that teaches your coding agent how to implement View Transitions. (Show the `.agents/skills/vercel-react-view-transitions` folder.) You can install it from [skills.sh](https://skills.sh/vercel-labs/agent-skills/vercel-react-view-transitions) and it works in Cursor, Codex, Claude Code, and other agents.

### Suspense Reveal Motion

- Add ViewTransition to the Suspense reveals. Wrap the skeleton fallback with `exit="slide-down"` and the loaded content with `enter="slide-up"`. The skeleton slides away and content slides in — making the loading feel intentional rather than jarring.
- Demo on the EventGrid Suspense boundary — then mention the same pattern applies to comments and questions. Every streaming section can get a coordinated reveal animation.

### Directional Navigation

- Navigation from the home page to a session slides in from the right, and going back slides from the left. Add `transitionTypes={['nav-forward']}` to the event card `<Link>` in EventGrid. Wrap the home page content in a `<ViewTransition>` that exits with `slide-to-left` on `nav-forward` and enters with `slide-from-left` on `nav-back`. Wrap the session layout in a matching `<ViewTransition>` that enters with `slide-from-right` on `nav-forward` and exits with `slide-to-right` on `nav-back`. In SessionTabs, add `addTransitionType('nav-back')` before navigating back to home.

### Tab Content Crossfade

- Add `<ViewTransition>` wrappers around the `children` in `HomeTabs` and `SessionTabs` — this gives tab content a crossfade when switching between tabs. The wrapper lives at the call site, not inside `BottomNav`, so animation scope stays explicit.

### List Animation

- Wrap each event card in EventGrid with `<ViewTransition key={event.slug} update={{ filter: 'auto', default: 'none' }}>`. Cards animate to their new grid positions when switching label filters instead of snapping.
- Wrap each QuestionCard in `<ViewTransition key={item.id}>`. The unique key lets React track each item — cards automatically animate to their new positions when sorting between "Top" and "Newest", when upvotes change the order, or when new items arrive from polling. Also visible when items are added or deleted via mutations.
- New items (optimistic adds, background poll arrivals) and removed items (deletions) also animate via the same keyed ViewTransition — enter and exit are handled by the browser's default cross-fade. The nested VT limitation prevents these from firing unwanted animations during page navigation.
- Same pattern works for comments — wrap each CommentCard in `<ViewTransition key={comment.id}>` for enter/exit animations on add and delete.

## Eliminating In-Between States

Sometimes in-between states are not desirable — and you can eliminate them entirely. The best loading state is no loading state. With Async React, dynamic vs static is a scale — we decide how much static we want.

- Start with EventDetails. Right now it fetches the event and the user's favorite status together — the user-specific cookie dependency forces the whole component to be dynamic. But the event data doesn't change per user. Refactor: move the favorite status out and pass it as `children`. Now EventDetails only calls `getEventBySlug`, which has no dynamic API dependency.
- Add `'use cache'` with `cacheTag` to the EventDetails component. The entire rendered output — title, speaker, labels, description — is cached per slug. The `children` (FavoriteButton) are passed through without affecting the cache entry. This is composable caching — the donut pattern, but for caching. The cached shell renders instantly; only the small FavoriteButton streams in via its own Suspense.
- But we still see a Cache Components error on the session page — `params` is dynamic, and there's no cache or Suspense above the page component reading it. Either add a `loading.tsx`, or tell Next.js which params exist ahead of time. Add `generateStaticParams` to the session page. Now all slugs are known at build time, params resolves during the build, and the cached EventDetails output becomes part of the static shell via Partial Prerendering. The router prefetches this shell — navigation feels instant. Suspense skeletons only show for truly dynamic data like comments, questions, and favorite status.
- Optimistic updates also eliminate in-between states — the FavoriteButton, LikeButton, and UpvoteButton all update instantly because `useOptimistic` skips the wait entirely.

## Review

- Let me get rid of all my changes and show you the difference before and after.
- Before, we had blank screens and jumping layouts, global spinners and frozen buttons, no error boundaries, and harsh transitions.
- Here is the after. We have skeleton placeholders and reserved space, local feedback and optimistic UI, smooth and contextual transitions, and live data. These improvements also reduce First Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift.
- Remember, the interactions themselves are not actually any faster. It's all about designing the in-between states — and sometimes eliminating them entirely. Collaborate with your designers on what these states should look like.
- This app isn't just a demo — it's deployed and live right now. Let's put it to the test.

## Live Q&A

- (Open [next16-event-hub.vercel.app](https://next16-event-hub.vercel.app), navigate to "Designing the In-Between States with Async React", go to the Questions tab.) Here's the session we're in right now. Scan the QR code or open the link — submit your questions and upvote the ones you want answered.
- Watch how everything stays in sync — optimistic updates, background polling, and ViewTransition list animations all coordinating through the same transition system we built.
- (Read top-voted questions from the app, answer them live if time allows)
- The app's home page has a link to the GitHub repo — check it out for the full source code.
- You can also install Event Hub as a PWA (progressive web app): use the browser install prompt, **Add to Home Screen** on mobile, or **Install app** in the menu so the conference companion stays on their home screen like a native app.
