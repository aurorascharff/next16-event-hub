# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Slide 1: Title

- (Open /slides) Hey everyone! I'm Aurora Scharff — I work on the Next.js developer experience at Vercel.
- This is my first time at React Miami — super excited to be here. Cant wait to hang out with you all, talk about React, and show off some cool new features.
- Today we're talking about designing the in-between states with Async React. Let's get started.

## Opening

- (Exit slides, show the app) To demonstrate these concepts, I built an app.
- This is Event Hub — a demo conference companion app with fictional session data. You can browse sessions, post comments, ask questions and upvote them, favorite the talks you want to see. I've added some test data so we have something to look at. (Navigate to "In-Between States" session, show the comments, questions with upvotes, and the favorited session.)
- Alright, looks pretty good right? ...but actually, this app feels kind of broken. Can you see why? (Let audience react) Yeah — flickering, things jumping around, no feedback when you click stuff, the whole page freezing.
- So where's the problem? It's not the actions themselves — it's what happens in between. The moments between a user action and the final UI. They don't show up as bugs, tests won't catch them. But they're exactly what makes an app feel broken to your users.
- Let me show you some specific ones:
  - **Global spinner**: The whole app sits behind one big spinner. You see nothing until everything loads. Not great.
  - **Layout shift**: Go to a session — you get two little spinners. When the content loads, everything jumps down. Ouch.
  - **Frozen navigation**: Switch between Day 1 and Day 2 — the whole thing locks up while it loads. No feedback at all.
  - **No feedback on mutations**: Upvote a question — the UI just freezes until the server responds. No indication that anything is happening.
- So how would we normally fix this? Let's look at FavoriteButton — it's doing the classic thing: useEffect to fetch favorite status from an API endpoint, then local useState to manage it. Sound familiar? But watch what happens:
  - Go to the Favorites tab — the hearts start empty and then pop to filled after a beat. The server knows you favorited these, but the client has to re-fetch that separately.
  - Now unfavorite a couple sessions, then switch to Day 1 — see that? The hearts briefly flash back as filled. Mutations and navigation aren't talking to each other.
- So the traditional approach actually made things worse. Let's leave it broken for now — we'll come back and fix it properly.
- Let's also see what this looks like on a real-world connection. (Open DevTools → Network → Slow 3G, reload the page.) Blank screen. Nothing. For seconds. That global spinner is the only thing between the user and a white page. This is what your users on spotty conference Wi-Fi actually experience.
- Here's what I want you to take away: this isn't really a performance problem — it's a coordination problem. Loading, mutations, navigation — they're all running in their own little worlds with no coordination. What if React itself could handle that? Let's look at the render cycle to understand where the gaps are.

## Slide 2: React Render Cycle

- (Open /slides/2) Alright, the React render cycle — you've probably seen this before. Event → Update → Render → Commit. You click something, React figures out what changed, re-renders, and updates the DOM. Pretty straightforward when everything is synchronous.

## Slide 3: React Render Cycle — In-Between States

- But what happens when things are async? Now there are gaps. Between Event and Update — the user clicked but nothing happened yet, that's the "busy" state. Between Update and Render — we're waiting for data, that's "loading". Between Render and Commit — the new UI is ready but hasn't appeared yet, that's "done". These gaps are the in-between states — and trying to manage all of them by hand is exactly the coordination problem we just saw.

## Slide 4: Async React Render Cycle — Transitions

- (Open /slides/4) So how do we fix this? The React team introduced Async React. It's a set of primitives that handle async coordination declaratively. And the key piece is transitions. A transition wraps the entire render cycle, coordinates the async work, and batches all updates together as an "Action". It commits them when they're all ready — so you don't get those weird flickers between states.

## Slide 5: Async React Render Cycle — Primitives

- And there's a primitive for each phase. useOptimistic() spans Event through Update, it gives instant feedback during the busy phase. Suspense spans Update through Render, it shows a placeholder while data loads. And ViewTransition spans Render through Commit, it animates the new content into the DOM instead of popping it in.

## Slide 6: Async React Render Cycle — Clean

- And here's the cool part — when things are fast enough, the user never sees any of this. The busy, loading, done labels just disappear. It all feels instant. That's really the goal — design these in-between states so they're there when you need them, but invisible when things are fast. (Credit: Async React talk at React Conf)

## Slide 7: Where the Gaps Are

- (Open /slides/7) So think about what happens in our app. There are really three places where async creates these gaps.
- **Data loading** — we're fetching sessions, comments, questions from the server. That's where you get blank screens, spinners, layout shifts.
- **Navigation** — switching tabs, filtering, going to a different page. That's where the UI locks up and content flashes in.
- **Mutations** — someone submits a comment, taps a heart, upvotes a question. That's where buttons freeze, nothing gives feedback, state goes stale.
- We've been handling each of these on our own — and they don't talk to each other. But now we have the primitives to handle all three.
- And these primitives really shine when the framework integrates them — the router, the data layer, the design system. We're using Next.js 16 App Router with React Server Components, that's just one way to use Async React, any framework that integrates with transitions and Suspense works. I've slowed down the data fetching on purpose so you can actually see what's happening. Let's go fix our app!
- (Exit slides, back to the app)

## Data Loading

### Suspense Boundaries — Home Page

- Right now the whole app has one big Suspense in the root layout wrapping everything. So you see nothing until all the data is ready — just a spinner. What we want instead is to show a static shell right away and stream in the dynamic parts as they load.
- So let's remove that global Suspense from the root layout. And... we get an error overlay: "Next.js encountered uncached data during the initial render." This makes sense because right now our initial load is blocked without that loading state we had. Next.js is pointing us right to the problem and giving you the fix. It shows you three ways to fix it — cache the data with 'use cache', move it inside Suspense, or opt out with export const instant = false. We'll go with Suspense.
- Suspense is the primitive for the **loading** state from our render cycle. You place a boundary around any async component, give it a fallback, and you decide where loading states go and what they look like.
- Eventgrid is the blocking component. Let's wrap EventGrid in Suspense with a skeleton fallback that matches the card grid. Now the shell — header, day tabs, label pills — shows up immediately, and only the session grid streams in. This shell is completely static, so it can be cached and served from a CDN anywhere in the world. Your users get content instantly. Better FCP, better LCP.

### Suspense Reveal Animation — Home Page

- OK so our skeletons handle the **loading** state — but when content loads, it just pops in. That's the **done** state from our render cycle — the new UI is ready but hasn't appeared yet. ViewTransition is the primitive for this phase. ViewTransitions are triggered when elements update in a transition, a Suspense, or a deferred update. So when a Suspense boundary resolves, React will automatically animate the result into the new UI.
- ViewTransition has activators based on how the component behaves: enter means it's added to the DOM, exit means it's removed, update means something changed inside it, and name is for shared element transitions between two ViewTransitions. We can add custom animations for each one.
- Wrap the skeleton fallback with exit="slide-down" and the content with enter="slide-up". Now when the skeleton exits the DOM and the content enters, they animate. Default is a cross-fade, but we customize with CSS for the slide effect.

### Suspense — Session Detail Page

- Now let's apply the same pattern to the rest of the apps loading states.
- Session detail page: It already has Suspense, but the top boundary has no fallback and the bottom one just has a centered spinner. When content loads, the comment section jumps down — classic layout shift. Fix: proper skeleton fallbacks that reserve the right space.
- Also animate them. Let's just do a some crossfade on the comment section. I'm not going to need it on the details, we'll see why later.
- (Use React Devtools Suspense panel to pin skeletons and check for CLS.)
- **Questions page**: No Suspense at all — navigate there and the whole page blocks. Use the questionsSuspense snippet to wrap QuestionFeed in Suspense with a skeleton fallback and ViewTransition reveal. We already know the pattern: Suspense for the **loading** state, ViewTransition for the **done** state. The snippet handles both together. Now the feed streams in with smooth motion.

## Navigation

### Query Param Navigation — Home Page

- Now navigation — this is the **busy** state from our render cycle, between Event and Update. The user clicked but nothing has changed yet. Try switching between Day 1 and Day 2 — the UI freezes. We want the tab to switch instantly while fresh data loads behind the scenes.
- Look at BottomNav. Right now it takes an onChange callback. What if the component itself could handle async coordination for us?
- Let's just change onChange to action. That's all we change on the consumer side — one prop name. Try it now — the day tabs switch instantly. The old content stays visible while new data loads in the background. Same thing for the session tabs.
- So what's happening inside? When the prop is called action, BottomNav wraps it in startTransition and uses useOptimistic to update the active tab immediately. The optimistic state shows for as long as the transition runs, then settles to the real value. It also dims the non-active tabs while the transition is running.
- So quick thing on terminology: any async function called inside startTransition is an "Action". React tracks its pending state and bubbles errors to error boundaries. That's why the prop is called action. Notice the naming — we need to mark our deferred behavior so the parent knows this is happening in a transition. Think about React's own form component: it has onSubmit or action. Same idea. This is the **action props pattern** — the design component handles async coordination so consumers just pass a callback.
- Now the label filter pills — same idea with ToggleGroup, also navigating via query params with router.push. Right now LabelFilter passes onChange — same problem, no transition. Change it to action and the pills highlight instantly. That's ToggleGroup's useOptimistic kicking in, same as BottomNav.
- But what about fading the grid while filtered data loads? That's not really ToggleGroup's job — it's about the surrounding content. So in LabelFilter, we add our own useOptimistic, call it inside the action, and set data-pending on the wrapper div. It falls back to false after the transition. The grid already has group-has-data-pending:opacity-50, so it fades automatically. The pending state just bubbles up through CSS.
- And here's the thing, most developers shouldn't need to use startTransition and useOptimistic themselves. If your UI components expose action props, you just plug things together. As headless libraries like Base UI and Radix adopt this pattern, dropdowns, autocompletes, tabs — they all just work. The async coordination lives in the component, not in your app code.

### Directional Navigation

- We handled the **busy** state with action props, now let's handle the **done** state too. Right now, navigating to a session just pops the content in. There's no sense of place — you don't know where you came from or how to get back. Directional animations fix this. Going forward slides in from the right, going back from the left. The list feels "behind" the detail. Users feel like they know where they are.
- We have two reusable wrappers: NavForward and NavBack — each is just a ViewTransition with type-keyed enter/exit maps. Wrap the session page in NavForward and the home page in NavBack. Add transitionTypes={['nav-forward']} to the event card Link, and addTransitionType('nav-back') on the back SessionTabs back. Same ViewTransition primitive, just with directional CSS.

## Mutations

Now mutations. There are two kinds of work here. Some things are actively broken — like the FavoriteButton with its useEffect + useState that doesn't coordinate with navigation. That's a legacy pattern we need to fix. Other things just need coordination added — the delete button works, the upvote works, they just have no feedback. Let's look at all of them.

### Session Page

- **FavoriteButton**: Remember the broken hearts from the opening? Let's fix this. Delete the API endpoint, rip out the useEffect and local state, get the favorited prop from the server instead. Switch useState to useOptimistic to toggle instantly. Replace onClick with a form action — same as BottomNav and ToggleGroup, React wraps it in a transition automatically. The optimistic value shows while the transition runs, then settles to the real server state.
- Now tap a few favorites, switch to the Favorites tab. See? It just works. Mutations and navigation go through the same transition system, so it all coordinates. And we simplified a bunch of clunky code.

### Questions Page

- **UpvoteButton**: Same idea here, let's use the upvoteOptimistic snippet. It replaces onSubmit with action — again, the naming tells us this is happening in a transition. useOptimistic with a reducer that increments the count and disables the button. Upvoting is one-way (no un-vote), so the reducer only goes in one direction.
- **Optimistic Create**: Submitting a question also just waits for the server, no feedback at all. Let's replace BasicQuestionForm and the count/sort row with OptimisticQuestions. The server renders the real list, the client component uses useOptimistic([]) for pending items. They show above the list with "Sending..." and reduced opacity. When the server responds, refresh() updates the real list and the optimistic state resets.

### List Animation

- Now let's handle the **done** state for our mutations. Our mutations and background updates all run inside transitions, so we can animate list changes too. Wrap each item in ViewTransition key={uniqueId}, the key lets React track items across renders. Do this for QuestionCards (key={item.id}). Now new items fade in, deleted ones fade out, and upvotes reorder smoothly.

### Background Update — Questions Page

- Now that we have mutations on this page, let's handle the other direction — data coming in from the server without any user action. Right now you have to refresh the browser to see new questions or upvotes from other attendees.
- Let's add a usePolling hook to OptimisticQuestions that calls startTransition(() => router.refresh()) every few seconds. This refreshes the server components, fetching fresh data. The server-rendered card list updates automatically. And because it uses startTransition, it coordinates with everything else — the user can keep interacting, upvoting, submitting, while fresh data streams in. It all goes through the same transition system.
- Let me show you. (Open two browser windows side by side on the same questions page.) I'll submit a question in this window... and watch the other one. (Submit a question in the left window, it appears in the right window within a few seconds via polling.)

## Eliminating In-Between States — Session Page

Sometimes the best in-between state is no state at all.

- Look at EventDetails — right now it fetches the event and the user's favorite status together. The cookie dependency makes the whole thing dynamic. But the event info doesn't change per user, right? So let's move the favorite out and pass it as children. Now EventDetails only needs getEventBySlug.
- We already have generateStaticParams on this page, so all slugs are known at build time. That means the cached output becomes part of the static shell through Partial Prerendering. The router prefetches it — navigation feels instant. Skeletons only show for truly dynamic stuff like comments, questions, and favorite status.
- Add 'use cache' to EventDetails, and now the whole rendered output — title, speaker, labels, description — is cached per slug. The children (FavoriteButton) pass through without affecting the cache. Think of it like the donut pattern, but for caching. The cached shell renders instantly; only the tiny FavoriteButton streams in.

## Offline Support

- One more thing before we wrap up the code. All the Suspense boundaries and static shells we just built? They make offline support possible. We're working on a new feature in Next.js — it's experimental, coming soon — that detects when the connection drops and automatically recovers when it comes back, streaming in fresh data to replace the skeletons.
- Let's add an offline indicator so the user actually sees what's happening. (Add the OfflineIndicator component using the useOffline hook.) When the connection drops, a bar appears. When it comes back, the hook triggers recovery and content streams in automatically.
- We'll see this in action on the deployed app in a moment.

## Review & Wrap-Up

- Remember how the app looked at the start? (Revert all changes.) Blank screens, jumping layouts, global spinners, frozen buttons, harsh transitions.
- (Open [next16-event-hub.vercel.app](https://next16-event-hub.vercel.app)) Now the deployed version with all our changes. (Walk through the app — navigate to a session, show comments, questions, favorites.) Submit a question, it shows up optimistically. Upvote another one, the list reorders with animation. Favorite a session, switch to the Favorites tab. Everything just works.
- Remember that Slow 3G blank screen from the start? Let's try it on the fixed version. (DevTools → Slow 3G, reload.) The static shell shows up instantly, header, tabs, skeletons, all from the CDN. Content streams in as it arrives. Optimistic updates still feel instant because they're client-side. Same slow network, completely different experience.
- Now let's take it further, switch to Offline. (Navigate to a session.) The static shell still loads from cache. The offline indicator tells the user what's happening. Now switch back to No Throttling, content streams in and fills the skeletons. And the app just picks right back up.
- The interactions aren't any faster. The server is the same speed. It's all about designing the in-between states — and sometimes eliminating them entirely. Talk to your designers about what these states should look like!
- Now — you're not going to hand-code every ViewTransition recipe from scratch. So we've created agent skills — knowledge files that teach your coding agent these patterns. (Show the .agents/skills/ folder.)
  - **vercel-react-view-transitions** — covers all the animations we just saw: Suspense reveals, directional navigation, list reorder, shared elements. Ready-to-use CSS recipes. Works in Cursor, Codex, Claude Code.
  - We're also working on an **async-react** skill for the rest — Suspense boundaries, optimistic updates, action props, pending states. Coming soon.
- (Open /slides/8 — Resources slide with QR codes.) Here are the links — scan the QR codes. Source code on GitHub, View Transitions skill on skills.sh.
- Thank you!
