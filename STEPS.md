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
- When switching between Day 1 and Day 2, the whole thing locks up while it loads. And look at the favorites. Favorite a session, no feedback until the server responds. Now go to a session. When the content loads, everything jumps down. And, navigating to questions page is delayed. And when upvoting a question, the UI just freezes until the server responds. Same issue for the adding of a question.
- And on slow networks, all these problems become way more apparent.
- It's not the actions themselves — it's what happens in between. The moments between a user action and the final UI. They don't show up as bugs, tests won't catch them. But they're exactly what makes an app feel broken to your users. And the thing is, the interactions themselves aren't actually slow. The data fetching, the navigation, the mutations, they all work. It's the gaps between them that are completely undesigned. That's a coordination problem, not a performance problem.
- Now, you could try to solve this yourself with useEffect and useState — track loading flags, manage error states, coordinate overlapping requests, handle race conditions. But that's a ton of boilerplate, and these independent effects don't know about each other. Your loading spinner doesn't know about your optimistic update. Your navigation doesn't know about your mutation. You end up with bugs and weird intermediate states that are really hard to track down. What if React could handle that coordination for us? Let's look at the render cycle to understand where these gaps are.

## Slide 2: React Render Cycle

- (Open /slides/2) Alright, the React render cycle. Event — the user clicks something. Update — React figures out what changed. Render — it re-renders the components. Commit — updates the DOM. Pretty straightforward when everything is synchronous.

## Slide 3: React Render Cycle — In-Between States

- But what happens when things are async? Now there are potential gaps. Between Event and Update, the user clicked but nothing happened yet, a "busy" state. Between Update and Render, we're waiting for data, "loading". Between Render and Commit, the new UI is ready but hasn't appeared yet, that's "done". These are the in-between states — and that's what our app is missing right now. These are UX problems, not DX problems, and they're commonly forgotten or not done right.

## Slide 4: Async React Render Cycle — Transitions

- (Open /slides/4) So how do we fix this? The React team introduced Async React. It's a set of primitives that handle async coordination declaratively. And the key piece is transitions. A transition wraps the entire render cycle, coordinates the async work, and batches all updates together as an "Action". It commits them when they're all ready, so you don't get weird flickers between states.

## Slide 5: Async React Render Cycle — Primitives

- And there's a primitive we can use to close each gap. useOptimistic() spans Event through Update, it can give instant feedback during the busy phase. Suspense spans Update through Render, it can show a placeholder while data loads. And ViewTransition spans Render through Commit, it can animate the new content into the DOM instead of popping it in. We can add whichever is suitable for our interaction. On slow networks, these states are crucial. They keep users informed and engaged instead of staring at a blank screen or a frozen UI.

## Slide 6: Async React Render Cycle — Clean

- But here's the cool part — when things are fast enough, the user never sees any of this. The busy, loading, done states just disappear. It all feels instant. That's really the goal — design these in-between states so they're there when you need them, but invisible when things are fast.

## Slide 7: Where the Gaps Are

- (Open /slides/7) So there are really three places where async creates these gaps.
- **Async Data loading** — fetching data from the server. That's where you get blank screens, spinners, layout shifts.
- **Async Navigation** — switching tabs, filtering, going to a different page. That's where the UI locks up and content flashes in.
- **Async Mutations** — submitting data, toggling state. That's where buttons freeze and nothing gives feedback.
- These primitives really shine when the framework integrates them. You would want the router wrapping navigation in transitions, and the data layer using Suspense. The design system exposing action props is something we build ourselves. We're using Next.js App Router with React Server Components, which gives us the router and data layer integration. Any framework that integrates with transitions and Suspense works.
- So let's go fix our app!
- (Exit slides, back to the app. Switch to editor).

## Async Data Loading

### Suspense Boundaries — Home Page

- Let's start with the first gap — async data loading. Right now, the initial page load is actually blocked. There's a delay loading the page. We actually get an error overlay: "Next.js encountered uncached data during the initial render." Next.js is letting us know we have a potential performance problem. I'm using cacheComponents, so with this Next.js ensures our app stays fast with these errors. It shows us three ways to fix it: cache the data with 'use cache', move it inside Suspense, or opt out with export const instant = false. We're going to with Suspense for this one.
- Suspense works with Suspense-enabled data sources like RSCs or libraries that provide hooks like useSuspenseQuery. You give it a fallback, and you decide where loading states go and what they look like declaratively.
- Looking at our error, it's caused by my queries to events on the home page. EventGrid is the blocking component. It's a server component that fetches data. Let's wrap it in Suspense with a skeleton fallback that matches the card grid.
- When skeletons match the shape of the real content, loading actually feels faster and stays predictable. Now the shell — header, day tabs, label pills — shows up immediately, and the session grid streams in when the data is ready.
- And on the performance side, the server fetches and streams directly instead of client round trips. The shell is static and becomes part of the Partial Prerender — it's served from the CDN and prefetched by the router, so it shows up instantly. The dynamic content streams in behind it. We still get to compose everything with components and local data fetching.

### Suspense Reveal Animation — Home Page

- OK so our data is streaming in now, but when content loads, it just pops in. That's the **done** state, we want to design it so the new UI transitions in smoothly. This is where ViewTransition comes in. ViewTransitions are triggered when elements update in a transition, a Suspense, or a deferred update. So when a Suspense boundary resolves, React can animate the fallback into the new UI.
- Let's add a ViewTransition around the EventGrid to make it crossfade, which is the default.
- ViewTransitions also have activators based on how the component behaves, which we can add custom CSS to.
- Wrap the skeleton fallback with exit="slide-down" and the content with enter="slide-up". Now as we stream in the content, the skeleton exits the DOM and the content enters and animates.
- We designed our first inbetween state successfully! The app already feels way smoother.

### Suspense — Session Detail Page

- Now let's apply the same pattern to the rest of our async data loading.
- Session detail page: It already has Suspense, but the top boundary has no fallback and the bottom one just has a centered spinner. When content loads, the comment section jumps down — classic layout shift. Fix: proper skeleton fallbacks that reserve the right space. Add skeletons. App feels better and predicable with this in-between state. No CLS.
- Also animate them. Let's just do a crossfade on the comment section. I'm not going to need it on the details, we'll see why later.
- (Use React Devtools Suspense panel to pin skeletons and check for CLS.)
- **Questions page**: No Suspense at all — navigate there and the whole page blocks and delays with no feedback. Reloading the page will give me the guidance error we saw before from cacheComponents. Use the questionsSuspense snippet to wrap QuestionFeed in Suspense with a skeleton fallback and ViewTransition reveal. Same pattern — Suspense for the **loading** state, ViewTransition for the **done** state. Now the feed streams in with smooth motion and unblocks the page load.
- That's async data loading designed. Every page streams in with skeletons and animations instead of blocking.

## Async Navigation

### Query Param Navigation — Home Page

- Now let's handle async navigation. I click between tabs and nothing updates. That's the **busy** state, we need to design it so you know something is happening. The tabs navigate via search params, so every click triggers a server round trip for new data. Technically it's a navigation, but conceptually you're on the same page. We want the tabs to switch instantly while fresh data loads behind the scenes.
- Look at HomeTabs, using BottomNav. BottomNav and ToggleGroup are part of my design layer for this React Miami themed app. Right now it takes an onChange callback. What if the component could handle the async coordination for us?
- So let's just change onChange to action.
- Try it now... see? The active tab updates immediately, and the content follows when it arrives.
- (And watch this, if I click Day 2 and then Day 1 before it finishes, it just picks up the latest one. These transitions are interruptible.)
- So what just happened? Let's look inside BottomNav. This is startTransition and useOptimistic in action. BottomNav wraps our callback in a transition and optimistically updates the active tab immediately. That optimistic value shows while the transition runs, then settles to the real value. It also dims the non-active tabs while the transition is running.
- Remember from the slides, any async function called inside a transition is an "Action". So the convention is: when a prop is called action, it means it runs in a transition. This is the **action props pattern** — the design component handles async coordination so consumers just pass a callback.
- Now the label filter pills, same problem, no feedback, also navigating via query params with router.push. Right now LabelFilter passes onChange. Change it to action, and rename to changeAction to adhere to convention. Because the prop is called action, that's the contract — we expect the component to handle the async coordination internally. And it does. The pills highlight instantly.
- (In this case, the design component didn't include any build in pending state. But as the consumer, we can add one. So in LabelFilter, we add our own useOptimistic, call it inside the action, and set data-pending on the wrapper div. It falls back to false after the transition. The grid already has group-has-data-pending:opacity-50, so it fades automatically. The pending state just bubbles up through CSS.)
- And here's the thing. If your UI components expose action props, you just plug things together. The async coordination lives in the component, not in your app code. Component libraries like Base UI and Radix can adopt the action prop pattern, so your dropdowns, autocompletes, tabs, they'll handle all of this for you out of the box.
- That's async navigation designed, they feel instant and responsive instead of frozen and janky.

### Directional Navigation

- Navigation feels smooth now, but when we actually navigate to a session, there's no sense of place — you don't know where you came from or how to get back. Directional animations fix this. We want going forward to slide in from the right, going back from the left. So the list feels "behind" the detail and you know where you are.
- Wrap the session page in NavForward. We have two reusable wrappers: NavForward and NavBack — each is just a ViewTransition with type-keyed enter/exit maps. Wrap the home page in NavBack. To trigger the correct animation, we add transitionTypes={['nav-forward']} to the event card Link, and addTransitionType('nav-back') on the back SessionTabs back inside action. Same ViewTransition primitive, just with directional CSS. Our app now has a real sense of place and smooth directional motion.

## Async Mutations

Now let's handle async mutations. Everything works, but nothing gives feedback. The favorite, the upvote, the question submit, they all just freeze until the server responds. For mutations like these that are unlikely to fail, we can actually eliminate the **busy** state entirely with optimistic updates. And if something does go wrong, useOptimistic can roll back automatically.

### Session Page

- **FavoriteButton**: Switch useState to useOptimistic to toggle the heart instantly. Replace onClick with a form action, React wraps it in a transition automatically. Same action props pattern as BottomNav and ToggleGroup.
- Now tap a few favorites, switch to the Favorites tab. Mutations and navigation go through the same transition system, so it all coordinates and we don't get any intermediate states here.

### Questions Page

- **UpvoteButton**: Same idea, eliminate the wait. Use the upvoteOptimistic snippet. useOptimistic with a reducer that increments the count. Replaces onSubmit with action and remove preventdefault. Upvoting is one-way (no un-vote), so the reducer only goes in one direction. After the server refresh, the question settles to the real vote count, and moves its position in the list if needed. If the server fails, it rolls back to the previous count.
- **Optimistic Create**: Submitting a question also just waits for the server. Let's replace BasicQuestionForm and the count/sort row with OptimisticQuestions. Again, useOptimistic, this time with an empty array for pending items. They show above the list with "Sending..." and reduced opacity. When the server responds, refresh() updates the real list and the optimistic state settles. We eliminated all the busy states on this page, it feels super responsive and smooth now.

### List Animation

- But there's no animation when items change in the list. Would be nice to see the change on upvote. The **done** state is undesigned. And because we're using transitions on all our mutations and updates, this means we can easily add animations with the same ViewTransition primitive. All we have to do is wrap each item in ViewTransition. Do this for QuestionCards (key={item.id}). Now upvotes reorder smoothly as the server update settles.

### Background Update — Questions Page

- Now that we have mutations on this page, let's handle the other direction — data coming in from the server without any user action. Right now you have to refresh the browser to see new questions or upvotes from other attendees.
- Let's add a usePolling hook to OptimisticQuestions that calls startTransition(() => router.refresh()) every few seconds. This re-renders the server components on the server.
- Let me show you. Open two browser windows side by side on the same questions page. I'll submit a question in this window... and watch the other one. Submit a question in the left window, it appears in the right window within a few seconds via polling. Upvote a question in the left window, it smoothly updates the vote count and reorders in the right window. All without any manual refresh.

## Eliminating In-Between States — Session Page

We eliminated the **busy** state with useOptimistic. Now let's eliminate the **loading** state too, with Next.js caching.

- Look at EventDetails — right now it fetches the event and the user's favorite status together. The cookie dependency makes the whole thing dynamic. But the event info doesn't change per user, right? So let's pass in the dynamic content as props.
- Add 'use cache' and now the whole component — title, speaker, labels, description — is cached per slug. Same Partial Prerendering we saw on the home page — the cached output joins the static shell, prefetched and instant. Skeletons only show for truly dynamic stuff like comments, questions, and favorite status.

## Offline Support

- One more thing before we wrap up the code. All the Suspense boundaries and static shells we just built? They make offline support possible. There's an experimental Next.js feature that detects when the connection drops and automatically recovers when it comes back, streaming in fresh data to replace the skeletons.
- Let's add an offline indicator so you actually see what's happening. It's using our upcoming useOffline hook. We'll see this in action on the deployed app in a moment. I added a few more enhancements there too.

## Review & Wrap-Up

- Remember how the app looked at the start? Revert all changes. Blank screens, jumping layouts, frozen tabs, no feedback on clicks, harsh transitions.
- Open [next16-event-hub.vercel.app](https://next16-event-hub.vercel.app). Now the deployed version with all our changes. Walk through the app — navigate to a session, show comments, questions, favorites. Submit a question, it shows up optimistically. Upvote another one, the list reorders with animation. Favorite a session, switch to the Favorites tab. Everything just works.
- Let's try it to slow down the network too. (DevTools → Slow 3G, reload.) The static shell shows up instantly, header, tabs, skeletons, all from the CDN. Content streams in as it arrives. Optimistic updates still feel instant because they're client-side.
- Now let's take it further, switch to Offline. (Navigate to a session.) The static shell still loads from cache. The offline indicator tells you what's happening. Now switch back to No Throttling, content streams in and fills the skeletons. And the app just picks right back up.
- The interactions aren't any faster. The server is the same speed. It's all about designing the in-between states, and sometimes eliminating them entirely. And simultaneously this will improve Core Web Vitals like First Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift which is great for performance and SEO.
- This is a small demo app, but these patterns scale. Server components stream data without client round trips, caching and PPR guarantee fast loads, and Async React coordinates everything in between. Your app is performant by default, and with designed in-between states it actually feels that way too. Your users will thank you — they'll love your apps and won't quit them.
- (Go back to code) Now — you're not going to hand-code every ViewTransition from scratch. Agent skills are knowledge files that teach your coding agent patterns like these. I created one for view transitions as part of my work at Vercel. (Show the .agents/skills/ folder.)
  - **vercel-react-view-transitions** — covers all the animations we just saw: Suspense reveals, directional navigation, list reorder, shared elements. Ready-to-use CSS recipes. Works in Cursor, Codex, Claude Code.
  - I'm also working on an **async-react** skill for the rest — Suspense boundaries, optimistic updates, action props, pending states.
- (Swipe back to first localhost page with the slide 7) Here are the links — scan the QR codes. Source code on GitHub, View Transitions skill on skills.sh.
- Thank you guys for having me here at React Miami!
