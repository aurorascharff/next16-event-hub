# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Slide 1: Title

- (Open `/slides`) Hey everyone! I'm Aurora Scharff — I'm a DX Engineer at Vercel, working on the Next.js developer experience. I'm from Norway, and this is my first time at React Miami — super excited to be here.
- Today we're talking about designing the in-between states with Async React. But first, let me show you something.

## Opening

- (Exit slides, show the app) So I'm the first speaker today — which means we need a conference app to keep track of everything that's happening here. Good news, I built one!
- This is Event Hub — a live session companion for React Miami. You can browse all the sessions, post comments, ask questions and upvote them, favorite the talks you want to see. I've already added some test comments and questions on my session so we have something to look at. (Navigate to "In-Between States" session, show the comments with likes, questions with upvotes, and the favorited session.)
- Alright, looks pretty good right? ...but actually, play around with it for a second. What do you notice? (Let audience react) Yeah — flickering, things jumping around, no feedback when you click stuff, the whole page freezing.
- These are the in-between states — the moments between a user action and the final UI. They don't show up as bugs, tests won't catch them. But they're exactly what makes an app feel broken to your users.
- Let me show you some specific ones:
  - **Global spinner**: The whole app sits behind one big spinner. You see nothing until everything loads. Not great.
  - **Layout shift**: Go to a session — you get two little spinners. When the content loads, everything jumps down. Ouch.
  - **No feedback**: Delete a comment — nothing happens for a sec, then it just vanishes. Like a comment, upvote a question, switch tabs — the UI just... freezes. No indication that anything is happening.
  - **Frozen navigation**: Switch between Day 1 and Day 2 — the whole thing locks up while it loads.
- So how would we normally fix this? Let's look at `FavoriteButton` — it's doing the classic thing: `useEffect` to fetch favorite status from an API endpoint, then local `useState` to manage it. Sound familiar? But watch what happens:
  - Go to the Favorites tab — the hearts start empty and then pop to filled after a beat. The server knows you favorited these, but the client has to re-fetch that separately.
  - Now unfavorite a couple sessions, then switch to Day 1 — see that? The hearts briefly flash back as filled. Mutations and navigation aren't talking to each other.
- So the traditional approach actually made things worse. Let's leave it broken for now — we'll come back and fix it properly.
- Here's what I want you to take away: this isn't really a performance problem — it's a coordination problem. Loading, mutations, navigation — they're all running in their own little worlds with no coordination. What if React itself could handle that? Let's look at the render cycle to understand where the gaps are.

## Slide 2: React Render Cycle

- (Open `/slides/2`) Alright, the React render cycle — you've probably seen this before. Event → Update → Render → Commit. You click something, React figures out what changed, re-renders, and updates the DOM. Pretty straightforward when everything is synchronous.

## Slide 3: React Render Cycle — In-Between States

- But what happens when things are async? Now there are gaps. Between Event and Update — the user clicked but nothing happened yet, that's the "busy" state. Between Update and Render — we're waiting for data, that's "loading". Between Render and Commit — the new UI is ready but hasn't appeared yet, that's "done". These gaps are the in-between states — and trying to manage all of them by hand is exactly the coordination problem we just saw.

## Slide 4: Async React Render Cycle — Transitions

- (Open `/slides/4`) So how do we fix this? The React team introduced Async React — the combination of React 18's concurrent features and React 19's coordination APIs. It's a set of primitives that handle async coordination declaratively. And the key piece is transitions. A transition wraps the entire render cycle, coordinates the async work, and batches all updates together as an "Action". It commits them when they're all ready — so you don't get those weird flickers between states.

## Slide 5: Async React Render Cycle — Primitives

- And there's a primitive for each phase. `useOptimistic()` spans Event through Update — it gives instant feedback during the busy phase. `<Suspense>` spans Update through Render — it shows a placeholder while data loads. And `<ViewTransition>` spans Render through Commit — it animates the new content into the DOM instead of popping it in.

## Slide 6: Async React Render Cycle — Clean

- And here's the cool part — when things are fast enough, the user never sees any of this. The busy, loading, done labels just disappear. It all feels instant. That's really the goal — design these in-between states so they're there when you need them, but invisible when things are fast. (Credit: Async React talk at React Conf)

## Slide 7: Where the Gaps Are

- (Open `/slides/7`) So think about what happens in our app. There are really three places where async creates these gaps.
- **Data loading** — we're fetching sessions, comments, questions from the server. That's where you get blank screens, spinners, layout shifts.
- **Mutations** — someone submits a comment, taps a heart, upvotes a question. That's where buttons freeze, nothing gives feedback, state goes stale.
- **Navigation** — switching tabs, filtering, going to a different page. That's where the UI locks up and content flashes in.
- We've been handling each of these on our own — and they don't talk to each other. But now we have the primitives to handle all three. So let's go fix our app!
- (Exit slides, back to the app)

## Setup and Starting Point

- Quick context on the setup — Next.js 16 App Router, Prisma, Tailwind. We're using React Server Components for data fetching. And I've slowed down the data fetching on purpose so you can actually see what's happening — otherwise it'd be too fast on localhost.
- We'll go through this in three parts: data loading first, then navigation, then mutations. Let's dive in.

## Data Loading

### Suspense Boundaries

- Right now the whole app has one big `<Suspense>` in the root layout wrapping everything. So you see nothing until all the data is ready — just a spinner. What we want instead is to show a static shell right away and stream in the dynamic parts as they load.
- So let's remove that global Suspense from the root layout. And... we get an error. This is Cache Components (`cacheComponents: true` in `next.config.ts`) — the Next.js 16 rendering model. Basically, it's the framework saying "hey, you have async components blocking this route — you need to be explicit about how to handle them." Either cache them with `'use cache'` or stream them with `<Suspense>`. It's actually really helpful — it points you right to the spots that need attention.
- So this is where `<Suspense>` comes in — the first primitive from the render cycle. Suspense is declarative: you place a boundary around any async component, give it a fallback, and it handles the data fetching for you. You decide where loading states go and what they look like. Each boundary works independently — they compose naturally without knowing about each other.
- Let's wrap EventGrid in `<Suspense>` with a skeleton fallback that matches the card grid. Now the shell — header, day tabs, label pills — shows up immediately, and only the session grid streams in. This shell is completely static, so it can be cached and served from a CDN anywhere in the world. Your users get content instantly. Better FCP, better LCP.
- The idea is simple: push dynamic data deep in the component tree, wrap it in Suspense, and the framework handles the rest. That's how you get "show the shell first, stream the rest."
- Now let's apply the same pattern to the rest of the app.
- **Session detail page**: It already has Suspense, but the top boundary has no fallback and the bottom one just has a centered spinner. When content loads, the comment section jumps down — classic layout shift. Fix: proper skeleton fallbacks that reserve the right space. (Use React Devtools Suspense panel to pin skeletons and check for CLS.)
- **Questions page**: No Suspense at all — navigate there and the whole page blocks. Use the `questionsSuspense` snippet to wrap EventHeader and QuestionFeed in Suspense with skeleton fallbacks. Now they stream in independently.

## Navigation

### Query Param Navigation

- Now navigation — the second pillar. Filtering is technically a navigation, but you're still on the same page. Try switching between Day 1 and Day 2 — the UI freezes while new data loads. We want the tab to switch instantly while fresh data loads behind the scenes.
- Look at BottomNav — right now it takes an `onChange` callback. You click a tab, it calls `onChange`, and that's it. No transition, no optimistic state, the UI just freezes until the navigation completes. What if the component itself could handle this for us?
- Let's change `onChange` to an `action` prop. That's all we do on the consumer side — just rename the prop. But inside BottomNav, `action` signals that this callback will run inside a transition. The component uses `useOptimistic` and `useTransition` internally to give instant feedback and keep old content visible. This is the **action props pattern** — the same pattern used in the Async React demo at React Conf, where `SearchInput`, `TabList`, `CompleteButton` all work this way.
- Now the day tabs switch instantly. The old content stays visible while new data loads. The parent just passes an array of routes — no async React code needed.
- The label filter pills use ChipGroup — same pattern. Click "React" or "Performance" and the pill highlights right away while the filtered grid loads. When Favorites tab is active, the filter hides automatically.
- The key insight: most developers shouldn't need to use `startTransition` themselves. If your router wraps navigation in transitions and your UI components expose action props, you just plug things together. The Async React Working Group is standardizing these patterns across routers, data libraries, and design systems.
- Let me show you how ChipGroup works inside — `useOptimistic` for instant feedback, `useTransition` to keep old content visible. That's what the design component abstracts away.
- The in-between state here is busy — and the action props pattern handles it so consumers don't need to think about async coordination.

## Mutations

### Background Update

- Before we get into user mutations, let's handle the other direction — data coming in from the server without any user action. Right now the questions page is static — you have to refresh the browser to see new questions or upvotes from other attendees.
- Let's add a `usePolling` hook that calls `startTransition(() => router.refresh())` every few seconds. This refreshes the server components, fetching fresh data. The new `initialQuestions` flow down as props to the client component.
- Because it's inside `startTransition`, the update coordinates with `useOptimistic` — if you're in the middle of upvoting a question, your optimistic state stays stable while fresh data arrives. Upvotes, sort changes, and background polls all go through the same pipeline — there's no competing data layer that updates outside of transitions.
- The in-between state here is ideally invisible — there's no user action to respond to, so the best outcome is that fresh data just appears without disrupting anything.

### User Mutations

Now the third pillar — user-driven mutations. The user taps a heart, upvotes a question, deletes a comment. Right now the flow is: click, wait for the server, then render. We want to flip that — show the change immediately, then reconcile when the server confirms. Not everything has a design component with an action prop — sometimes you use `useOptimistic` and `useTransition` directly. Let's go through each one.

#### Pessimistic Mutations

- **DeleteButton**: Right now deleting a comment has no feedback — it just disappears after a delay. Let's extract a `DeleteButton` that uses `useTransition` and sets `data-pending` on itself while deleting. On the parent `CommentCard`, we add `has-data-pending:opacity-50` — CSS `:has()` lets the whole card fade when any child is pending, without the card needing to be a client component.
- **Label filter pending**: Same `:has()` pattern works for the label filter. `ChipGroup` already sets `data-pending` on its root when a transition is in flight. We wrap the filter and grid in a `group` container, and add `group-has-data-pending:opacity-50` on the grid — so the event grid fades while filtered data loads. No extra client component needed; the pending state bubbles up through CSS from ChipGroup through the server-rendered layout.

#### Optimistic Mutations

- **FavoriteButton**: Remember the broken `useEffect` heart from the opening? Let's fix it properly. Delete the API endpoint (`app/api/favorites/[slug]/route.ts`), remove the `useEffect` fetch and local state, add back the `hasFavorited` prop from the server, and replace the `onClick` with a `<form action>`. A form's `action` prop works just like the `action` prop on BottomNav or ChipGroup — React wraps it in a transition automatically. So we add `useOptimistic` with a boolean reducer to toggle the heart immediately, and the transition system handles the rest.
- **Mutation + Navigation**: Tap a few favorites, then switch to the Favorites tab. No flickering, no stale data — compare this to the broken version from the opening. This works because mutations and navigation both go through the transition system — `useOptimistic` handles the instant heart fill, and when you switch tabs, React coordinates the tab transition and fresh server data in a single render pass. Optimistic updates settle naturally when the server responds with `refresh()`.
- **LikeButton**: Change `onSubmit` to `action` to get into a transition, then add `useOptimistic`. The reducer manages both `hasLiked` and `likes` in a single state object, calculating from the current optimistic state so toggling works correctly in both directions.
- **UpvoteButton**: Same pattern — use the `upvoteOptimistic` snippet. It replaces `onSubmit` with `action`, adds `useOptimistic` with a reducer that increments the count and disables the button. Upvoting is one-way (no un-vote), so the reducer only goes in one direction.
- `useOptimistic` automatically rolls back if the action fails — just add a toast on error. On the server side, every action calls `refresh()` to invalidate the client router so all server components re-render with fresh data.

#### Optimistic Create (Questions)

- Right now submitting a question waits for the server before it shows up. Let's add `useOptimistic` in QuestionList so the question appears immediately. The trick: generate a UUID on the client with `crypto.randomUUID()` and pass it to the server action — so the optimistic item and the real one share the same ID. No duplicate flash when the server responds.
- Also add a safety check in the reducer — if the question already exists in the base data (maybe from a background poll), deduplicate by ID.
- All of these mutations are the same in-between state — busy — and the same primitives: `useOptimistic` and `action`. Whether it's a form action or an action prop, React tracks pending state, errors go to error boundaries, and optimistic values settle when the server confirms. Same pipeline as navigation and background updates — everything coordinates together.

## Animations (Commit Polish)

The final phase — animations. The in-between state is "done" — the new UI is ready but hasn't appeared on screen yet. Without animations, Suspense reveals pop in, navigations jump, and list reorders snap. `<ViewTransition>` makes these moments feel intentional.

- How do ViewTransitions trigger? They activate when DOM changes happen inside a React transition — `startTransition`, `useOptimistic`, or `Suspense` resolving. We've already set all of that up, so we get this for free. Just wrap elements in `<ViewTransition>` and the browser animates the changes. Default is a cross-fade, but we can customize with CSS.
- For the CSS recipes, I'm using an agent skill — it's a knowledge file that teaches your coding agent how to implement View Transitions. (Show the `.agents/skills/vercel-react-view-transitions` folder.) You can grab it from [skills.sh](https://skills.sh/vercel-labs/agent-skills/vercel-react-view-transitions) — works in Cursor, Codex, Claude Code, and others.

### Suspense Reveal Motion

- Let's add ViewTransition to the Suspense reveals. Wrap the skeleton with `exit="slide-down"` and the content with `enter="slide-up"`. Now the skeleton slides away and content slides in — feels intentional instead of jarring.
- (Demo on EventGrid) Same pattern works for comments, questions — any streaming section can get this.

### Directional Navigation

- Let's make navigation feel directional — going to a session slides in from the right, going back slides from the left. Add `transitionTypes={['nav-forward']}` to the event card `<Link>`, wrap the home page content and session layout in matching `<ViewTransition>` wrappers with slide classes, and add `addTransitionType('nav-back')` on the back button. Now it feels like a real app.

### Tab Content Crossfade

- Add `<ViewTransition>` around the `children` in `HomeTabs` and `SessionTabs` — gives you a nice crossfade when switching tabs.

### List Animation

- Wrap each event card in EventGrid with `<ViewTransition key={event.slug} update={{ filter: 'auto', default: 'none' }}>`. Now cards animate to their new positions when you switch filters instead of snapping around.
- Same for QuestionCard — `<ViewTransition key={item.id}>`. The unique key lets React track each item, so cards animate when sorting, when upvotes change the order, or when new questions arrive from polling. New items fade in, deleted ones fade out. (The sort toggle in QuestionList already uses `action` — that's why the sort change runs in a transition and the list animation fires correctly.)
- Same pattern works for comments — wrap each CommentCard in `<ViewTransition key={comment.id}>` for enter/exit animations on add and delete.

## Eliminating In-Between States

Sometimes the best loading state is no loading state at all. You can just skip it entirely. With Async React, dynamic vs static isn't binary — it's a scale, and you choose how much to make static.

- Look at EventDetails — right now it fetches the event and the user's favorite status together. The cookie dependency makes the whole thing dynamic. But the event info doesn't change per user, right? So let's move the favorite out and pass it as `children`. Now EventDetails only needs `getEventBySlug`.
- Add `'use cache'` with `cacheTag` and now the whole rendered output — title, speaker, labels, description — is cached per slug. The `children` (FavoriteButton) pass through without affecting the cache. Think of it like the donut pattern, but for caching. The cached shell renders instantly; only the tiny FavoriteButton streams in.
- We already have `generateStaticParams` on this page, so all slugs are known at build time. That means the cached output becomes part of the static shell through Partial Prerendering. The router prefetches it — navigation feels instant. Skeletons only show for truly dynamic stuff like comments, questions, and favorite status.
- And remember, optimistic updates also eliminate in-between states — the hearts, likes, and upvotes all update instantly because `useOptimistic` skips the wait entirely.

## Review

- Remember how the app looked at the start? (Switch to the `start` branch / stash changes to show the broken version.) Blank screens, jumping layouts, global spinners, frozen buttons, harsh transitions.
- Now let me show you the after. This app is deployed and live right now — with all the changes we just made.
- The important thing to remember — the actual interactions aren't any faster. The server is the same speed. It's all about designing the in-between states — and sometimes eliminating them entirely. Collaborate with your designers on what these states should look like.

## Live Q&A

- (Open [next16-event-hub.vercel.app](https://next16-event-hub.vercel.app)) This is the deployed version with all the changes we just made. (Walk through the app) Skeleton placeholders, instant feedback, smooth animations, live data — and real improvements to First Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.
- (Navigate to "Designing the In-Between States with Async React", go to the Questions tab.) And this is the session we're in right now. Go ahead and scan the QR code or open the link — submit your questions and upvote the ones you want answered.
- (While audience scans) Watch what happens — questions show up, upvotes move cards around, the list animates. Everything we just built, coordinating together in real time through the same transition system.
- (Read top-voted questions, answer them live)
- The GitHub repo is linked from the app's home page — all the source code is there.
- You can also install this as a PWA — **Add to Home Screen** on mobile or **Install app** in the browser menu. Keep it on your phone for the rest of the conference!
