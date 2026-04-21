# DEMO STEPS

GitHub: https://github.com/aurorascharff/next16-event-hub

## Slide 1: Title

- (Open /slides) Hey everyone! I'm Aurora Scharff — I work on the Next.js developer experience at Vercel.
- This is my first time at React Miami — super excited to be here. Cant wait to hang out with you all, talk about React, and show off some cool new features.
- Today we're talking about designing the in-between states with Async React. Let's get started.

## Opening

- (Exit slides, show the app) To demonstrate these concepts, I built an app.
- This is Event Hub — a demo conference companion app with session data. You can browse sessions for different days Day 1 and Day 2, favorite the talks you want to see, view details and comment, ask questions and upvote them.
- However, this app feels kind of broken. Can you see why?
- When switching between Day 1 and Day 2, the whole thing locks up while it loads. Now go to a session — see those two little spinners? When the content loads, everything jumps down. Navigating to questions page is delayed. And when upvoting a question, the UI just freezes until the server responds. Same issue for the adding of a question.
- And look at the favorites. Favorite a session, no feedback until the server responds.
- And on slow networks, all these problems become way more apparent.
- It's not the actions themselves — it's what happens in between. The moments between a user action and the final UI. They don't show up as bugs, tests won't catch them. But they're exactly what makes an app feel broken to your users. This isn't really a performance problem — it's a coordination problem. What if React itself could handle that? Let's look at the render cycle to understand where the gaps are.

## Slide 2: React Render Cycle

- (Open /slides/2) Alright, the React render cycle — you've probably seen this before. Event → Update → Render → Commit. You click something, React figures out what changed, re-renders, and updates the DOM. Pretty straightforward when everything is synchronous.

## Slide 3: React Render Cycle — In-Between States

- But what happens when things are async? Now there are gaps. Between Event and Update — the user clicked but nothing happened yet, that's the "busy" state. Between Update and Render — we're waiting for data, that's "loading". Between Render and Commit — the new UI is ready but hasn't appeared yet, that's "done". These gaps are the in-between states — and trying to manage all of them by hand is exactly the coordination problem we just saw.

## Slide 4: Async React Render Cycle — Transitions

- (Open /slides/4) So how do we fix this? The React team introduced Async React. It's a set of primitives that handle async coordination declaratively. And the key piece is transitions. A transition wraps the entire render cycle, coordinates the async work, and batches all updates together as an "Action". It commits them when they're all ready — so you don't get those weird flickers between states.

## Slide 5: Async React Render Cycle — Primitives

- And there's a primitive we can use to close each gap. useOptimistic() spans Event through Update, it gives instant feedback during the busy phase. Suspense spans Update through Render, it shows a placeholder while data loads. And ViewTransition spans Render through Commit, it animates the new content into the DOM instead of popping it in.

## Slide 6: Async React Render Cycle — Clean

- And here's the cool part — when things are fast enough, the user never sees any of this. The busy, loading, done labels just disappear. It all feels instant. However, on slow networks, these states are crucial. They keep users informed and engaged instead of staring at a blank screen or a frozen UI. That's really the goal — design these in-between states so they're there when you need them, but invisible when things are fast.

## Slide 7: Where the Gaps Are

- (Open /slides/7) So there are really three places where async creates these gaps.
- **Data loading** — fetching data from the server. That's where you get blank screens, spinners, layout shifts.
- **Navigation** — switching tabs, filtering, going to a different page. That's where the UI locks up and content flashes in.
- **Mutations** — submitting data, toggling state. That's where buttons freeze and nothing gives feedback.
- And these primitives really shine when the framework integrates them — the router, the data layer, the design system. We're using Next.js 16 App Router with React Server Components, that's just one way to use Async React, any framework that integrates with transitions and Suspense works.
- So let's go fix our app!
- (Exit slides, back to the app)

## Data Loading

### Suspense Boundaries — Home Page

- Right now, the initial page load is actually blocked. We actually get an error overlay: "Next.js encountered uncached data during the initial render." Next.js is letting us know we have a performance problem — it shows us three ways to fix it: cache the data with 'use cache', move it inside Suspense, or opt out with export const instant = false. We'll go with Suspense.
- This is where Suspense comes in. It works with Suspense-enabled data sources like RSCs. Give it a fallback, and you decide where loading states go and what they look like declaratively.
- Looking at our error, EventGrid is the blocking component. Let's wrap it in Suspense with a skeleton fallback that matches the card grid. Now the shell — header, day tabs, label pills — shows up immediately, and only the session grid streams in, content shows up instantly.

### Suspense Reveal Animation — Home Page

- OK so our data is streaming in now, but when content loads, it just pops in. We want to animate that, add a **done** state so the new UI transitions in smoothly. This is where ViewTransition comes in. ViewTransitions are triggered when elements update in a transition, a Suspense, or a deferred update. So when a Suspense boundary resolves, React can automatically animate the result into the new UI.
- Let's add a ViewTransition around the EventGrid to make it crossfade, which is the default.
- ViewTransitions also have activators based on how the component behaves, which we can add custom CSS to.
- Wrap the skeleton fallback with exit="slide-down" and the content with enter="slide-up". Now as we stream in the content, the skeleton exits the DOM and the content enters and animates.
- We designed our first inbetween state successfully! The app already feels way smoother.

### Suspense — Session Detail Page

- Now let's apply the same pattern to other parts of the app's loading states.
- Session detail page: It already has Suspense, but the top boundary has no fallback and the bottom one just has a centered spinner. When content loads, the comment section jumps down — classic layout shift. Fix: proper skeleton fallbacks that reserve the right space. Add skeletons.
- Also animate them. Let's just do a crossfade on the comment section. I'm not going to need it on the details, we'll see why later.
- (Use React Devtools Suspense panel to pin skeletons and check for CLS.)
- **Questions page**: No Suspense at all — navigate there and the whole page blocks and delays with no feedback. Use the questionsSuspense snippet to wrap QuestionFeed in Suspense with a skeleton fallback and ViewTransition reveal. We already know the pattern: Suspense for the **loading** state, ViewTransition for the **done** state. Now the feed streams in with smooth motion.
- That's all of our loading states designed. Every page streams in with skeletons and animations instead of blocking.

### Directional Navigation

- Navigation feels smooth now, but when we actually navigate to a session, the content just pops in. We need to animate that **done** state. There's no sense of place — you don't know where you came from or how to get back. Directional animations fix this. Going forward slides in from the right, going back from the left. The list feels "behind" the detail. You feel like you know where you are.
- We have two reusable wrappers: NavForward and NavBack — each is just a ViewTransition with type-keyed enter/exit maps. Wrap the session page in NavForward and the home page in NavBack. Add transitionTypes={['nav-forward']} to the event card Link, and addTransitionType('nav-back') on the back SessionTabs back inside action. Same ViewTransition primitive, just with directional CSS.

## Navigation

### Query Param Navigation — Home Page

- Now let's handle async navigation. I click between tabs and nothing updates. We need to add a **busy** state in the UI so you know something is happening. The tabs navigate via search params, so every click triggers a server round trip for new data. Technically it's a navigation, but conceptually you're on the same page. We want the tabs to switch instantly while fresh data loads behind the scenes.
- Look at HomeTabs, using BottomNav. Right now it takes an onChange callback. What if the component could handle the async coordination for us?
- So let's just change onChange to action.
- Try it now... see?
- (And watch this, if I click Day 2 and then Day 1 before it finishes, it just picks up the latest one. These transitions are interruptible.)
- So what just happened? Let's look inside BottomNav. This is startTransition and useOptimistic in action. BottomNav wraps our callback in a transition and optimistically updates the active tab immediately. That optimistic value shows while the transition runs, then settles to the real value. It also dims the non-active tabs while the transition is running.
- This is called the **action props pattern** — the design component handles async coordination so consumers just pass a callback. The convention is that an action name means it runs in a transition.
- Now the label filter pills, same problem, no feedback, also navigating via query params with router.push. Right now LabelFilter passes onChange. Change it to action, and rename to changeAction to adhere to convention. Now, the pills highlight instantly. Async coordination is built in.
- (In this case, the design component didn't include any build in pending state. But as the consumer, we can add one. So in LabelFilter, we add our own useOptimistic, call it inside the action, and set data-pending on the wrapper div. It falls back to false after the transition. The grid already has group-has-data-pending:opacity-50, so it fades automatically. The pending state just bubbles up through CSS.)
- And here's the thing. If your UI components expose action props, you just plug things together. The async coordination lives in the component, not in your app code. Component libraries like Base UI and Radix can adopt the action prop pattern, so your dropdowns, autocompletes, tabs, they'll handle all of this for you out of the box.
- Navigation in-between states, done. Tabs switch instantly, content fades in, and we barely wrote any async code ourselves.

## Mutations

Now let's handle async mutations. Everything works, but nothing gives feedback. We need a **busy** state for our mutations. The favorite, the upvote, the question submit, they all just freeze until the server responds. This is where useOptimistic comes in.

### Session Page

- **FavoriteButton**: Switch useState to useOptimistic to toggle the heart instantly. Replace onClick with a form action, React wraps it in a transition automatically. Same action props pattern as BottomNav and ToggleGroup.
- Now tap a few favorites, switch to the Favorites tab. See? Mutations and navigation go through the same transition system, so it all coordinates.

### Questions Page

- **UpvoteButton**: Same idea, same **busy** state pattern. Let's use the upvoteOptimistic snippet. It replaces onSubmit with action, useOptimistic with a reducer that increments the count and disables the button. Upvoting is one-way (no un-vote), so the reducer only goes in one direction.
- **Optimistic Create**: Submitting a question also just waits for the server, no **busy** state at all. Let's replace BasicQuestionForm and the count/sort row with OptimisticQuestions. Again, useOptimistic, this time with an empty array for pending items. They show above the list with "Sending..." and reduced opacity. When the server responds, refresh() updates the real list and the optimistic state settles.

### List Animation

- That's our **busy** states for mutations designed. Every action gives instant feedback now.
- But there's no animation when items change in the list. We can add a **done** state here too, same ViewTransition primitive. Since mutations and background updates all run inside transitions, ViewTransition can animate the results. Wrap each item in ViewTransition key={uniqueId}, the key lets React track items across renders. Do this for QuestionCards (key={item.id}). Now new items fade in, deleted ones fade out, and upvotes reorder smoothly.

### Background Update — Questions Page

- Now that we have mutations on this page, let's handle the other direction — data coming in from the server without any user action. Right now you have to refresh the browser to see new questions or upvotes from other attendees.
- Let's add a usePolling hook to OptimisticQuestions that calls startTransition(() => router.refresh()) every few seconds. This refreshes the server components, fetching fresh data. And because it's wrapped in startTransition, it coordinates with everything else — I can keep interacting, upvoting, submitting, while fresh data streams in. Same transition system tying it all together.
- Let me show you. (Open two browser windows side by side on the same questions page.) I'll submit a question in this window... and watch the other one. (Submit a question in the left window, it appears in the right window within a few seconds via polling.)
- Mutation in-between states, done. useOptimistic for instant feedback, ViewTransition for smooth animation, startTransition tying it all together.

## Eliminating In-Between States — Session Page

Sometimes the best in-between state is no state at all.

- Look at EventDetails — right now it fetches the event and the user's favorite status together. The cookie dependency makes the whole thing dynamic. But the event info doesn't change per user, right? So let's move the favorite out and pass it as children. Now EventDetails only needs getEventBySlug.
- Add 'use cache' and now the whole rendered output — title, speaker, labels, description — is cached per slug. The children (FavoriteButton) pass through without affecting the cache. Think of it like the donut pattern, but for caching. We already have generateStaticParams on this page, so all slugs are known at build time. That means the cached output becomes part of the static shell through Partial Prerendering. The router prefetches it, navigation feels instant. Skeletons only show for truly dynamic stuff like comments, questions, and favorite status.

## Offline Support

- One more thing before we wrap up the code. All the Suspense boundaries and static shells we just built? They make offline support possible. There's an experimental Next.js feature that detects when the connection drops and automatically recovers when it comes back, streaming in fresh data to replace the skeletons.
- Let's add an offline indicator so you actually see what's happening. (Add the OfflineIndicator component using the useOffline hook.) When the connection drops, a bar appears. When it comes back, the hook triggers recovery and content streams in automatically.
- We'll see this in action on the deployed app in a moment.

## Review & Wrap-Up

- Remember how the app looked at the start? (Revert all changes.) Blank screens, jumping layouts, frozen tabs, no feedback on clicks, harsh transitions.
- (Open [next16-event-hub.vercel.app](https://next16-event-hub.vercel.app)) Now the deployed version with all our changes. (Walk through the app — navigate to a session, show comments, questions, favorites.) Submit a question, it shows up optimistically. Upvote another one, the list reorders with animation. Favorite a session, switch to the Favorites tab. Everything just works.
- Let's try it to slow down the network too.. (DevTools → Slow 3G, reload.) The static shell shows up instantly, header, tabs, skeletons, all from the CDN. Content streams in as it arrives. Optimistic updates still feel instant because they're client-side. Same slow network, completely different experience.
- Now let's take it further, switch to Offline. (Navigate to a session.) The static shell still loads from cache. The offline indicator tells you what's happening. Now switch back to No Throttling, content streams in and fills the skeletons. And the app just picks right back up.
- The interactions aren't any faster. The server is the same speed. It's all about designing the in-between states — and sometimes eliminating them entirely. Talk to your designers about what these states should look like!
- Now — you're not going to hand-code every ViewTransition from scratch. Agent skills are knowledge files that teach your coding agent patterns like these. I created one for view transitions as part of my work at Vercel. (Show the .agents/skills/ folder.)
  - **vercel-react-view-transitions** — covers all the animations we just saw: Suspense reveals, directional navigation, list reorder, shared elements. Ready-to-use CSS recipes. Works in Cursor, Codex, Claude Code.
  - I'm also working on an **async-react** skill for the rest — Suspense boundaries, optimistic updates, action props, pending states.
- (Open /slides/8 — Resources slide with QR codes.) Here are the links — scan the QR codes. Source code on GitHub, View Transitions skill on skills.sh.
- Thank you!
