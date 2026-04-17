# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Slide 1: Title

- (Open `/slides`) Hey everyone! I'm Aurora Scharff — I'm a DX Engineer at Vercel, working on the Next.js developer experience. I'm from Norway, and this is my first time at React Miami — super excited to be here.
- Today we're talking about designing the in-between states with Async React. But first, let me show you something.

## Opening

- (Exit slides, show the app) We have two days of great talks and we need a way to keep track of everything. So I built a conference app!
- This is Event Hub — a live session companion for React Miami. You can browse all the sessions, post comments, ask questions and upvote them, favorite the talks you want to see. I've already added some test comments and questions on my session so we have something to look at. (Navigate to "In-Between States" session, show the comments, questions with upvotes, and the favorited session.)
- Alright, looks pretty good right? ...but actually, this app feels kind of broken. Can you see why? (Let audience react) Yeah — flickering, things jumping around, no feedback when you click stuff, the whole page freezing.
- So where's the problem? It's not the actions themselves — it's what happens in between. The moments between a user action and the final UI. We can call these the in-between states. They don't show up as bugs, tests won't catch them. But they're exactly what makes an app feel broken to your users.
- Let me show you some specific ones:
  - **Global spinner**: The whole app sits behind one big spinner. You see nothing until everything loads. Not great.
  - **Layout shift**: Go to a session — you get two little spinners. When the content loads, everything jumps down. Ouch.
  - **Frozen navigation**: Switch between Day 1 and Day 2 — the whole thing locks up while it loads. No feedback at all.
  - **No feedback on mutations**: Delete a comment — nothing happens for a sec, then it just vanishes. Upvote a question — the UI just freezes until the server responds. No indication that anything is happening.
- So how would we normally fix this? Let's look at `FavoriteButton` — it's doing the classic thing: `useEffect` to fetch favorite status from an API endpoint, then local `useState` to manage it. Sound familiar? But watch what happens:
  - Go to the Favorites tab — the hearts start empty and then pop to filled after a beat. The server knows you favorited these, but the client has to re-fetch that separately.
  - Now unfavorite a couple sessions, then switch to Day 1 — see that? The hearts briefly flash back as filled. Mutations and navigation aren't talking to each other.
- So the traditional approach actually made things worse. Let's leave it broken for now — we'll come back and fix it properly.
- And just to drive it home — let's see what this looks like on a real-world connection. (Open DevTools → Network → Slow 3G, reload the page.) Blank screen. Nothing. For seconds. That global spinner is the only thing between the user and a white page. This is what your users on spotty conference Wi-Fi actually experience.
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

### Suspense Boundaries — Home Page

- Right now the whole app has one big `<Suspense>` in the root layout wrapping everything. So you see nothing until all the data is ready — just a spinner. What we want instead is to show a static shell right away and stream in the dynamic parts as they load.
- So let's remove that global Suspense from the root layout. And... we get an error. This is Cache Components (`cacheComponents: true` in `next.config.ts`) — the Next.js 16 rendering model. Basically, it's the framework saying "hey, you have async components blocking this route — you need to be explicit about how to handle them." Either cache them with `'use cache'` or stream them with `<Suspense>`. It's actually really helpful — it points you right to the spots that need attention.
- So this is where `<Suspense>` comes in — the first primitive from the render cycle. Suspense is declarative: you place a boundary around any async component, give it a fallback, and it handles the data fetching for you. You decide where loading states go and what they look like. Each boundary works independently — they compose naturally without knowing about each other.
- Let's wrap EventGrid in `<Suspense>` with a skeleton fallback that matches the card grid. Now the shell — header, day tabs, label pills — shows up immediately, and only the session grid streams in. This shell is completely static, so it can be cached and served from a CDN anywhere in the world. Your users get content instantly. Better FCP, better LCP.
- The idea is simple: push dynamic data deep in the component tree, wrap it in Suspense, and the framework handles the rest. That's how you get "show the shell first, stream the rest."
- Now let's apply the same pattern to the rest of the app.
- **Session detail page**: It already has Suspense, but the top boundary has no fallback and the bottom one just has a centered spinner. When content loads, the comment section jumps down — classic layout shift. Fix: proper skeleton fallbacks that reserve the right space. (Use React Devtools Suspense panel to pin skeletons and check for CLS.)
- **Questions page**: No Suspense at all — navigate there and the whole page blocks. Use the `questionsSuspense` snippet to wrap EventHeader and QuestionFeed in Suspense with skeleton fallbacks. Now they stream in independently.

## Navigation

### Query Param Navigation — Home Page + Session Page

- Now navigation. Filtering is technically a navigation, but you're still on the same page. Try switching between Day 1 and Day 2 — the UI freezes while new data loads. We want the tab to switch instantly while fresh data loads behind the scenes.
- Look at BottomNav — it's a design component, meaning it handles async coordination internally so consumers don't have to. Right now it takes an `onChange` callback. You click a tab, it calls `onChange`, and that's it. No transition, no optimistic state, the UI just freezes until the navigation completes. What if the component itself could handle this for us?
- Let's just change `onChange` to `action`. That's all we change on the consumer side — one prop name. Try it now — the day tabs switch instantly. The old content stays visible while new data loads in the background. Same thing for the session tabs.
- So what's happening inside? When the prop is called `action`, BottomNav wraps the callback in `startTransition` and uses `useOptimistic` to update the active tab immediately. It also dims the non-active tabs while the transition is running — that feedback makes sense inside the component. Quick terminology: any async function called inside `startTransition` is an "Action" in React's model — React tracks its pending state, batches the updates, and bubbles errors to error boundaries. That's why the prop is called `action` — it signals that the component will run it inside a transition. This is the **action props pattern** — the design component handles the async coordination so consumers just pass a callback and everything works.
- Now the label filter pills — same idea with ChipGroup, also navigating via query params with `router.push`. Right now LabelFilter passes `onChange` — same problem, no transition. Change it to `action` and the pills highlight instantly. That's ChipGroup's `useOptimistic` kicking in, same as BottomNav.
- But what about fading the grid while filtered data loads? That's not really ChipGroup's job — it's about the surrounding content. So in LabelFilter, we add our own `useTransition`, wrap the `router.push` in it, and set `data-pending` on the wrapper div. The grid already has `group-has-data-pending:opacity-50`, so it fades automatically. The pending state just bubbles up through CSS.
- The key insight: most developers shouldn't need to use `startTransition` themselves. If your router wraps navigation in transitions and your UI components expose action props, you just plug things together. As these patterns get adopted across routers, data libraries, and design systems, it gets even easier.
- The in-between state here is busy — and the action props pattern handles it so consumers don't need to think about async coordination.

## Mutations

Now mutations. There are two kinds of work here. Some things are actively broken — like the FavoriteButton with its `useEffect` + `useState` that doesn't coordinate with navigation. That's a legacy pattern we need to fix. Other things just need coordination added — the delete button works, the upvote works, they just have no feedback. Let's look at both.

### Session Page

- **DeleteButton**: Not everything needs an optimistic update — sometimes you just need feedback. Right now deleting a comment has zero feedback — it just disappears after a delay. Let's use `useTransition` directly to add pending state. Extract a `DeleteButton` that wraps the delete in `startTransition` and sets `data-pending` on itself while it's running. On the parent `CommentCard`, `has-data-pending:opacity-50` is already there — same `data-pending` pattern we used on the label filter, but with CSS `:has()`. The whole card fades when any child is pending, without the card needing to be a client component. Simple feedback, no optimistic state needed.
- **FavoriteButton**: Remember the broken `useEffect` heart from the opening? Let's fix it properly. Delete the API endpoint (`app/api/favorites/[slug]/route.ts`), remove the `useEffect` fetch and local state, add back the `hasFavorited` prop from the server, and replace the `onClick` with a `<form action>`. A form's `action` prop works just like the `action` prop on BottomNav or ChipGroup — React wraps it in a transition automatically. So we add `useOptimistic` with a boolean reducer to toggle the heart immediately, and the transition system handles the rest. Now tap a few favorites, then switch to the Favorites tab — no flickering, no stale data. Compare this to the broken version from the opening. Mutations and navigation both go through the transition system, so `useOptimistic` handles the instant heart fill and when you switch tabs, React coordinates everything in a single render pass. Optimistic updates settle naturally when the server responds with `refresh()`.

### Questions Page

- **UpvoteButton**: Same pattern — use the `upvoteOptimistic` snippet. It replaces `onSubmit` with `action`, adds `useOptimistic` with a reducer that increments the count and disables the button. Upvoting is one-way (no un-vote), so the reducer only goes in one direction.
- **Optimistic Create**: Right now submitting a question waits for the server before it shows up. Let's add `useOptimistic` in QuestionList so the question appears immediately. The trick: generate a UUID on the client with `crypto.randomUUID()` and pass it to the server action — so the optimistic item and the real one share the same ID. No duplicate flash. Add a dedup check in the reducer for background polls, and a toast on error — `useOptimistic` rolls back automatically if the action fails.

### Background Update — Questions Page

- Now that we have mutations on this page, let's handle the other direction — data coming in from the server without any user action. Right now you have to refresh the browser to see new questions or upvotes from other attendees.
- Let's add a `usePolling` hook that calls `startTransition(() => router.refresh())` every few seconds. This refreshes the server components, fetching fresh data. The new `initialQuestions` flow down as props to the client component.
- Because it's inside `startTransition`, the update coordinates with `useOptimistic` — if you're in the middle of upvoting a question, your optimistic state stays stable while fresh data arrives. Upvotes, sort changes, and background polls all go through the same pipeline — there's no competing data layer that updates outside of transitions.
- The in-between state here is ideally invisible — fresh data just appears without disrupting anything. And because it shares the same transition pipeline as user mutations, everything coordinates naturally.

## Animations (Commit Polish)

The final phase — animations. The in-between state is "done" — the new UI is ready but hasn't appeared on screen yet. Without animations, Suspense reveals pop in, navigations jump, and list reorders snap. `<ViewTransition>` makes these moments feel intentional.

- How do ViewTransitions trigger? They activate when DOM changes happen inside a React transition — `startTransition`, `useOptimistic`, or `Suspense` resolving. We've already set all of that up, so we get this for free. Just wrap elements in `<ViewTransition>` and the browser animates the changes. Default is a cross-fade, but we can customize with CSS.

### Suspense Reveal Motion — Home Page

- Let's add ViewTransition to the Suspense reveals. Wrap the skeleton with `exit="slide-down"` and the content with `enter="slide-up"`. Now the skeleton slides away and content slides in — feels intentional instead of jarring.

### Directional Navigation — Home Page + Session Layout

- Let's make navigation feel directional — going to a session slides in from the right, going back slides from the left. Add `transitionTypes={['nav-forward']}` to the event card `<Link>`, wrap the home page content and session layout in matching `<ViewTransition>` wrappers with slide classes, and add `addTransitionType('nav-back')` on the back button. Now it feels like a real app.

### Tab Content Crossfade — Home Page + Session Page

- Add `<ViewTransition>` around the `children` in `HomeTabs` and `SessionTabs` — gives you a nice crossfade when switching tabs.

### List Animation — Home Page + Questions Page + Session Page

- Wrap each item in a `<ViewTransition key={uniqueId}>` — the key lets React track individual items across renders. Do this for event cards in EventGrid (`key={event.slug}` with `update={{ filter: 'auto', default: 'none' }}`), QuestionCards (`key={item.id}`), and CommentCards (`key={comment.id}`). Now cards animate to new positions on filter/sort, new items fade in, deleted ones fade out, and upvotes reorder smoothly. (The sort toggle in QuestionList already uses `action`, so sort changes run in a transition and list animations fire correctly.)

## Eliminating In-Between States — Session Page

Sometimes the best loading state is no loading state at all. You can just skip it entirely. With Async React, dynamic vs static isn't binary — it's a scale, and you choose how much to make static.

- Look at EventDetails — right now it fetches the event and the user's favorite status together. The cookie dependency makes the whole thing dynamic. But the event info doesn't change per user, right? So let's move the favorite out and pass it as `children`. Now EventDetails only needs `getEventBySlug`.
- Add `'use cache'` with `cacheTag` and now the whole rendered output — title, speaker, labels, description — is cached per slug. The `children` (FavoriteButton) pass through without affecting the cache. Think of it like the donut pattern, but for caching. The cached shell renders instantly; only the tiny FavoriteButton streams in.
- We already have `generateStaticParams` on this page, so all slugs are known at build time. That means the cached output becomes part of the static shell through Partial Prerendering. The router prefetches it — navigation feels instant. Skeletons only show for truly dynamic stuff like comments, questions, and favorite status.
- And remember, optimistic updates also eliminate in-between states — the hearts and upvotes all update instantly because `useOptimistic` skips the wait entirely.

## Review

- Remember how the app looked at the start? (Switch to the `start` branch / stash changes to show the broken version.) Blank screens, jumping layouts, global spinners, frozen buttons, harsh transitions.
- Now let me show you the after. This app is deployed and live right now — with all the changes we just made.
- Remember that Slow 3G blank screen from the start? (Open the deployed app → DevTools → Slow 3G, reload.) The static shell shows up instantly — header, tabs, skeletons — all from the CDN. Content streams in as it arrives. Optimistic updates still feel instant because they're client-side. Same slow network, completely different experience.
- And here's something we're working on — let's go fully offline. (Show `next.config.ts` — `experimental: { useOffline: true }`.) This is a new experimental flag. Now watch — (turn off Wi-Fi, navigate to a session.) The static shell still loads — header, tabs, skeletons all render from the cache. Now turn Wi-Fi back on — the content streams in and fills the skeletons. The app stays usable even with no connection, and recovers gracefully when you're back online.
- The important thing to remember — the actual interactions aren't any faster. The server is the same speed. It's all about designing the in-between states — and sometimes eliminating them entirely. Collaborate with your designers on what these states should look like.
- Now — it's great to learn all of this, but realistically you're not going to be hand-coding every `useOptimistic` reducer and `data-pending` pattern from scratch. So we've created two agent skills for this — knowledge files that teach your coding agent how to implement these patterns correctly. (Show the `.agents/skills/` folder.)
  - **async-react** — handles everything we just did: Suspense boundaries, optimistic updates, action props, pending states. It covers both migration paths — fixing legacy `useState` + `useEffect` patterns, and adding coordination to a non-interactive app.
  - **vercel-react-view-transitions** — handles all the animations: Suspense reveals, directional navigation, list reorder, shared elements. Includes ready-to-use CSS recipes.
  - Both work in Cursor, Codex, Claude Code, and other agent environments. You can grab them from [skills.sh](https://skills.sh).
  - <!-- TODO: Add link / QR to published skills -->

## Live Q&A

- (Open [next16-event-hub.vercel.app](https://next16-event-hub.vercel.app)) This is the deployed version with all the changes we just made. (Walk through the app) Skeleton placeholders, instant feedback, smooth animations, live data — and real improvements to First Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.
- (Navigate to "Designing the In-Between States with Async React", go to the Questions tab.) And this is the session we're in right now. Go ahead and scan the QR code or open the link — submit your questions and upvote the ones you want answered.
- (While audience scans) Watch what happens — questions show up, upvotes move cards around, the list animates. Everything we just built, coordinating together in real time through the same transition system.
- (Read top-voted questions, answer them live)
- The GitHub repo is linked from the app's home page — all the source code is there.
- You can also install this as a PWA — **Add to Home Screen** on mobile or **Install app** in the browser menu. Keep it on your phone for the rest of the conference!
