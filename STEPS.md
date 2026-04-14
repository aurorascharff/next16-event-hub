# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Slide 1: Title

- (Open `/slides`) Intro slide — Designing the In-Between States with Async React.
- Introduce yourself: Aurora Scharff, DX Engineer at Vercel working on Next.js developer experience. From Norway.
- First time at React Miami — excited to be here.

## Opening

- (Exit slides, show the app) I'm the first speaker — so we need a conference app to keep track of everything happening here. Good news, I built one. Let me show you.
- The app is Event Hub — a live session companion for this conference. We can browse sessions, post comments, ask and upvote questions, and favorite sessions. Demo all features.
- ...but wait, this thing is terrible. What's wrong with it? What do you see? (Listen to audience) Flickering, delays, layout shifts, lack of feedback.
- These are the in-between states — the moments between a user action and the final UI. And here's the thing: these aren't DX problems. They're UX problems. That's why we often forget about them — they don't show up as bugs, they don't break tests. But they're what make an app feel broken to your users.
- Let's look at specific problems:
  - **Global spinner**: The whole app is behind a single spinner in the root layout — the user sees a blank page with a spinner until all data loads. No static shell, no progressive rendering.
  - **Layout shift on session page**: Navigate to a session — two centered spinners as placeholders. When content loads, the event details push the comment section down. No space reserved.
  - **No feedback**: Delete a comment — the card just disappears after a delay with no indication. Like, upvote, switch tabs — the UI freezes until the server responds. No pending states anywhere.
  - **Frozen navigation**: Switch day tabs or label filters — the UI locks up while new data loads. No optimistic feedback.
- How would we normally try to fix this? Open `FavoriteButton` — it's fetching favorite status client-side via `useEffect` from an API endpoint, then managing local state with `useState`. But this creates new problems:
  - **Initial state mismatch**: Navigate to the Favorites tab — hearts start unfilled and pop to filled after a moment. The server knows the user favorited these, but the client has to fetch that state separately.
  - **Mutation + navigation conflict**: Unfavorite a couple of sessions in the Favorites tab, then switch to Day 1 — the unfavorited items briefly flash with filled hearts because mutations and navigations don't coordinate.
- The traditional approach makes it worse, not better. Leave it broken — we'll come back and fix it properly later.
- This isn't a performance problem — it's a coordination problem. Mutations, navigation, and loading states all run in separate pipelines that don't talk to each other. What if React itself could coordinate all of that? To understand where the gaps are, let's look at the react render cycle.

## Slide 2: React Render Cycle

- (Open `/slides/2`) The React render cycle.
- Basic cycle — Event → Update → Render → Commit. A user click triggers an update, causes a re-render, which is committed to DOM.

## Slide 3: React Render Cycle — In-Between States

- Now bring async into this. Between Event and Update there's a "busy" state — the user did something and is waiting. Between Update and Render there's a "loading" state — data is being fetched. Between Render and Commit there's a "done" state — the new UI is ready but not yet visible. These are the in-between states — and managing them manually is the coordination problem we just saw.

## Slide 4: Async React Render Cycle — Transitions

- (Open `/slides/4`) To solve this coordination problem, the React team introduced a new concept called Async React — a set of primitives built on top of concurrent rendering that handle async coordination declaratively. The key is transitions. A transition wraps the entire render cycle, coordinates the async work, and ensures updates happen smoothly. It batches all updates together as an "Action" and commits them when they're all done — avoiding weird flickers in the UI.

## Slide 5: Async React Render Cycle — Primitives

- Each primitive spans across phases. `useOptimistic()` covers Event through Update — instant feedback during the busy phase. `<Suspense>` covers Update through Render — placeholder while data loads. `<ViewTransition>` covers Render through Commit — animate the final change into the DOM.

## Slide 6: Async React Render Cycle — Clean

- The real magic — when things are fast enough, the user never sees the in-between states at all. The busy, loading, and done labels disappear. The whole interaction just feels instant. That's the goal — design the in-between states so they're there when needed, but invisible when things are fast. (Credit: Async React talk at React Conf)

## Slide 7: Where the Gaps Are

- (Open `/slides/7`) Think about what happens in our apps. There are three places where async creates gaps in the UI.
- **Data loading** — the page fetches sessions, comments, questions from the server. That's where we get blank screens, spinners, and layout shifts.
- **Mutations** — the user submits a comment, toggles a favorite, upvotes a question. That's where we get frozen buttons, no feedback, and stale state.
- **Navigation** — the user switches tabs, filters by label, navigates to a session. That's where the UI locks up and content flashes.
- We've been managing each of these manually — and they don't coordinate. Now we have the primitives to handle all three declaratively. Let's go fix the app.
- (Exit slides, back to the app)

## Setup and Starting Point

- The setup is the Next.js 16 App Router, Prisma ORM, Tailwind CSS. Using React Server Components as the data fetching layer.
- Data fetching has been slowed down to simulate worse network conditions. Let's start with data loading, then tackle navigation, then mutations.

## Data Loading

### 1) Page Load

- Right now the whole app has a single global `<Suspense>` with a centered spinner in the root layout wrapping `{children}`. Every page blocks on all data behind that one spinner — the user sees nothing until everything is ready. Instead of loading all code and data and then rendering, we want to render the static shell first, stream in dynamic data, and complete progressively.
- Step 1: Remove the global Suspense from the root layout. On page load, we now see an error. This is Cache Components (`cacheComponents: true` in `next.config.ts`) — the Next.js 16 rendering model. There are no longer static OR dynamic pages; every route is a mix. The framework is telling us we have a performance problem: these async components are blocking the entire route. Cache Components forces us to be explicit — either cache it with `'use cache'` or stream it with `<Suspense>`. This is a good thing — it's the framework helping us find and fix the exact spots where data loading blocks rendering.
- This is where `<Suspense>` comes in — the first primitive from the render cycle. Suspense is declarative: you place a boundary around any async component, give it a fallback, and it catches the data fetching for you. You decide where loading states go and what they look like. Each boundary works independently — they compose naturally without knowing about each other.
- Fix: wrap EventGrid in `<Suspense>` with a skeleton fallback that mimics the card grid layout. Now the shell — header, day tabs, label pills — renders immediately while only the session grid streams in. This shell is static — it can be cached and served instantly from a CDN anywhere in the world, so the user gets the fastest possible experience with the most amount of content up front. Better FCP, better LCP.
- Navigate to the session detail page. It already has Suspense, but the top boundary has no fallback at all and the bottom one uses a centered spinner. When the event details load, the whole comment section jumps down — clear CLS. Fix: add proper skeleton fallbacks that reserve the right amount of space for both boundaries. Each skeleton should match the shape of the content. Use the React Devtools Suspense panel to pin skeletons and verify there's no CLS.
- The key idea: push dynamic data access deep in the component tree, wrap it in Suspense, and the framework handles the rest. That's what makes "render the static shell first, stream the rest" possible.

### 2) Route Navigation

- Still data loading — but now during navigation. When navigating to a new page, without Suspense the browser loads all code and data before rendering — a blank gap. With Suspense, we can show destination skeletons immediately and stream in data progressively. Navigation in the App Router already runs inside a transition — the old page stays visible and interactive while the new page loads.
- Navigate to the questions page — it has no Suspense boundaries at all, so the whole page blocks. Wrap EventHeader and QuestionFeed in Suspense with skeleton fallbacks. Now the header and question feed stream in progressively instead of blocking. We'll add animations to navigations later.
- Same in-between state as page load — loading — and the same primitive: `<Suspense>`. But here the router also plays a role. It wraps every navigation in a `startTransition` automatically, so the old page stays interactive while each Suspense boundary on the destination page resolves independently.

## Navigation

### 3) Query Param Navigation

- Now let's tackle navigation — the second pillar. Filtering is technically a navigation, but conceptually you're on the same page. Right now, clicking a filter freezes the UI while new data loads and then renders. We want the filter to update instantly — optimistic feedback — while fresh data loads in the background. Switching between Day 1 and Day 2 refetches the session grid from the server. Right now there's no feedback — the UI freezes.
- What if these components could handle their own async coordination? Look at BottomNav — right now it takes an `onChange` callback. When you click a tab, it calls `onChange` and that's it. No transition, no optimistic state, the UI just freezes until the navigation completes.
- Let's turn `onChange` into an `action` prop. This is the **action props pattern**: a design component exposes a prop like `action`, `changeAction`, or `submitAction` — the naming signals it will run inside a transition. Inside, the component uses `useOptimistic` and `useTransition` to handle pending states and instant feedback. The consumer just passes data and a callback; the component does the rest.
- Now the day tabs switch instantly while content loads in the background. The old content stays visible and interactive. The parent just passes an array of routes, no async React code needed.
- The label filter pills use ChipGroup — same idea. Clicking "React" or "Performance" instantly highlights the pill while the filtered grid loads. Just pass an action, the component does the rest. When the Favorites tab is active, the label filter hides — no conflicting state.
- Note: the sort toggle in QuestionList already uses `action` — it's an internal detail, not something we change in the demo. It needs to be in a transition so list animations fire correctly later.
- This is the key insight: most devs shouldn't need to use `startTransition` themselves if they're using a transition-based router and UI components with action props. As the Async React Working Group standardizes these patterns across routers, data libraries, and design systems, you can integrate them without building the coordination from scratch.
- Let's look at how ChipGroup works inside — `useOptimistic` for instant feedback, `useTransition` to keep old content visible. This is what design components abstract away from you.
- The in-between state here is busy — the user did something and is waiting. The primitives are `useOptimistic` and `useTransition`, and the action props pattern abstracts them away so consumers don't need to think about it.

## Mutations

### 4) Background Update

- Before we get to user-driven mutations, let's handle the other direction — data coming in from the server. Sometimes the page needs to update without any user action — background updates where fresh data arrives from the server. Right now the questions page is static — you have to refresh the browser to see new questions or upvotes from other attendees. Without transitions, new data would flash in and disrupt whatever the user is doing. We want to poll in a transition, reconcile fresh data with any in-flight optimistic state, and update seamlessly.
- Add a `usePolling` hook that calls `startTransition(() => router.refresh())` every 5 seconds. This refreshes the server components, fetching fresh data. The new `initialQuestions` flow down as props to the client component.
- Because it's inside `startTransition`, the update coordinates with `useOptimistic` — in-flight optimistic values stay stable while fresh data arrives. There's no competing data layer that updates outside of transitions. Upvotes, sort switches, and background polls all go through the same pipeline.
- The in-between state here is ideally invisible — there's no user action to respond to, so the best outcome is that fresh data just appears. The primitive is `startTransition` — it coordinates background polls with in-flight optimistic values so nothing flashes or fights.

### 5) User Mutations

Now the third pillar — user-driven mutations. Form submissions and interactions — the user does something and expects instant feedback. Right now the flow is: submit, wait for the server, then render — the UI freezes. We want to flip that: submit, show an optimistic update immediately, then reconcile when the server confirms. Not everything has a design component with an action prop — sometimes you need custom async coordination with `useOptimistic` and `useTransition` directly. That's fine too. Let's fix each one.

#### Pessimistic Mutations

- **DeleteButton**: Right now deleting a comment has no feedback — the card just disappears after a delay. Extract a `DeleteButton` that uses `useTransition` and sets `data-pending` on itself when deleting. On the parent `CommentCard` row, use `has-data-pending:opacity-50` — CSS `:has()` lets the whole card fade when any child is pending, without the card needing to be a client component.
- **Label filter pending**: The same `:has()` pattern works for the label filter. `ChipGroup` already sets `data-pending` on its root when a transition is in flight. The home page wraps the filter and grid in a `group` container, and the grid wrapper uses `group-has-data-pending:opacity-50` — so the event grid fades while new filtered data loads. No extra client component needed; the CSS bubbles up from ChipGroup through the server-rendered layout.

#### Optimistic Mutations

- **FavoriteButton**: Remember the broken `useEffect` heart from the opening? Let's fix it properly. Delete the API endpoint (`app/api/favorites/[slug]/route.ts`), remove the `useEffect` fetch and local state, add back the `hasFavorited` prop from the server, and replace the `onClick` with a `<form action>`. Here's the key insight: a form's `action` prop is just like the `action` prop on BottomNav or ChipGroup — React wraps it in a transition automatically. So we get `useOptimistic` for free. Add `useOptimistic` with a boolean reducer to toggle the heart immediately — and the transition system handles the rest.
- **Mutation + Navigation**: Tap a few favorites, then switch to the Favorites tab. No flickering, no stale data — compare this to the broken version from the opening. This works because mutations and navigation both go through the transition system — `useOptimistic` handles the instant heart fill, and when you switch tabs, React coordinates the tab transition and the fresh server data in a single render pass. Optimistic updates settle naturally when the server responds with `refresh()`.
- **LikeButton**: Currently uses `onSubmit` — change to `action` to get into a transition, then add `useOptimistic`. The reducer manages both `hasLiked` and `likes` in a single state object, calculating from the current optimistic state so toggling works correctly in both directions.
- **UpvoteButton**: Same — change `onSubmit` to `action`, add `useOptimistic`. Upvoting is one-way (no un-vote), so the reducer just increments the count and disables the button.
- `useOptimistic` automatically rolls back if the action fails — just add a toast on error. On the server side, every action calls `refresh()` to invalidate the client router so all server components re-render with fresh data.

#### Optimistic Create (Questions)

- Right now submitting a question waits for the server before it appears in the list. Add `useOptimistic` with a reducer in QuestionList so the question appears immediately. Use the `optimisticCreate` snippet — it generates a client-side UUID (`crypto.randomUUID()`) and passes it to the server action so the optimistic and real question share the same ID and the React key stays stable. No duplicate flash on settle.
- Add a safety check in the reducer — if the real question already exists in the base data (from a background refresh), deduplicate by matching the ID.
- The in-between state for all mutations is busy — and the primitives are `useOptimistic` and `action` (whether that's a form action or an action prop). Actions are async functions wrapped in transitions — React tracks pending state automatically, errors bubble to error boundaries, and optimistic values settle when the server responds with `refresh()`. This is the same transition system as navigation and background updates — everything coordinates through a single pipeline.

## Animations (Commit Polish)

The final phase — the commit. The in-between state is done — the new UI is ready but not yet visible on screen. Without animations, Suspense reveals pop in, navigations jump, and list reorders snap. `<ViewTransition>` makes these moments feel intentional.

- How do ViewTransitions trigger? They activate when DOM changes happen inside a React transition — `startTransition`, `useOptimistic`, or `Suspense` resolving. We've already set all of that up. So as long as you're using Async React, you get all of this for free — just wrap elements in `<ViewTransition>` and the browser animates the changes. By default it cross-fades, but we can customize with CSS classes and props.
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
- We already have `generateStaticParams` on the session page, so all slugs are known at build time and `params` resolves during the build. That means the cached EventDetails output becomes part of the static shell via Partial Prerendering. The router prefetches this shell — navigation feels instant. Suspense skeletons only show for truly dynamic data like comments, questions, and favorite status.
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
