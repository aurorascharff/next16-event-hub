# DEMO STEPS

## Setup and starting point

- The app is Event Hub — a live session companion for this conference. Attendees can browse sessions, post comments, ask and upvote questions, favorite sessions, and see who's actively watching. It's a great example because it has all three async coordination patterns — data loading, navigations, and mutations — plus a live data sync layer on top.
- The setup is the Next.js 16 App Router, Prisma ORM with SQLite, Tailwind CSS, SWR for live polling. Using React Server Components as my data fetching framework. I also use Next.js Cache Components here for the static/dynamic hybrid.
- Demo app: Data fetching has been slowed down to simulate worse network conditions. You can see this is the bad UX we had from the beginning in the slides. Let's fix it by designing the appropriate in-between states.

## Async Data Loading

- Let's work on our data loading. The home page loads the session grid — right now it's a global spinner. Let's fix that.
- With cache components, we get an error if we don't have a Suspense boundary. But we don't want to hide the whole page. Let's push Suspense down the tree so the shell — the header, day tabs, label pills — renders immediately while only the session grid streams in.
- Wrap the EventGrid in Suspense with a skeleton fallback. Skeletons give users a sense of the content structure and make loading feel faster. Use a skeleton component that mimics the card grid layout.
- Now we can see the shell of the page instantly, and then the session grid streams in. The shell is statically prerendered with cache components, so it's prefetched for instant navigations. Better FCP, better LCP.
- Let's do the same for the session detail page. The session info (title, speaker, schedule) is cached and prerendered. But the comments, questions, and active users are dynamic — they need Suspense boundaries with their own skeletons.
- Wrap CommentFeed and QuestionFeed in Suspense with skeleton fallbacks. Each skeleton should match the shape of the content — an input field skeleton, then a few card skeletons.
- Let's use the new React Devtools Suspense panel to pin these skeletons and make sure there's no CLS. The shape of the skeleton should match the shape of the loaded content.
- What about errors? What if a data fetch throws? Our app breaks. Let's add an error.tsx boundary. This way, we can show a user-friendly error message and use layouts to preserve the surrounding UI. Collaborate with the designer to create intentional error states.
- Add ViewTransition animations to our Suspense reveals. Wrap the skeleton fallback in ViewTransition with `exit="slide-down"` and the loaded content with `enter="slide-up"`. This creates a smooth handoff — the skeleton slides away and the content slides in, making the transition feel intentional instead of jarring.

## Async Navigations

- We also have navigations in this app that are delayed. Switching between Day 1 and Day 2 refetches the session grid from the server. Right now there's no feedback — the UI freezes.
- The day tabs are a BottomNav design component. What if this component could handle its own async coordination? It uses useOptimistic and useTransition internally — the active tab switches instantly while the content loads in the background. The old content stays visible and interactive. The parent just passes an array of routes and an optional action, no async React code needed.
- This is the "action props" pattern from the slides. Most devs shouldn't need to use startTransition themselves if they're using a transition-based router and UI components that handle their own async state.
- The label filter pills work the same way — they use the ChipGroup design component which also owns its useOptimistic + useTransition internally. Clicking "React" or "Performance" instantly highlights the pill while the filtered grid loads.
- Design components like BottomNav, ChipGroup, and BackButton abstract away the complexities of async interactions. The consumer passes data and callbacks — the component handles transitions, optimistic state, and pending indicators internally. As we see more of these primitives adopted by design systems and component libraries, we can integrate these patterns without building them from scratch.
- Now let's try the raw Async React primitives. Let's look at how ChipGroup works inside — useOptimistic for instant feedback, useTransition to keep the old content visible. This is what design components abstract away from you.
- Let's add animations to our navigations. Clicking a session card should feel like navigating forward — the home page slides left and the detail page slides in from the right. Going back reverses it. Add ViewTransition with directional transition types. The BackButton uses addTransitionType('nav-back') inside startTransition to trigger the reverse slide.
- Let's animate the list reordering when we sort questions. Wrap each QuestionCard in ViewTransition with a key. When the sort changes, questions smoothly slide to their new positions.

### Mutation + Navigation

- Here's something cool — we can combine a mutation and a navigation in the same transition for a seamless experience. When the user taps the back button to leave a session, we also want to clean up their presence record.
- The BackButton accepts an optional action prop. It calls leavePresence and router.push inside the same startTransition. React treats the whole thing as one atomic transition — one smooth animation, not two separate state changes.
- This works because startTransition is async-aware. You can await a server action and then trigger navigation, and React coordinates everything.

## Async Mutations

- Now let's work on our mutations. When we interact — liking, upvoting, commenting — we need instant feedback. The async part is the server function call. Let's make each interaction feel immediate.

### Optimistic Mutations

- **FavoriteButton**: Tapping the star on a session card. We use useOptimistic with a boolean reducer toggle — the star fills instantly. e.preventDefault() + e.stopPropagation() prevent the card link navigation. When we filter by "Favorites" in the label pills, the server filters by the user's favorite records.
- **LikeButton**: Tapping the heart on a comment. We use useOptimistic with a reducer that manages both hasLiked and likes count in a single state object. The reducer calculates from the current optimistic state, not the original props — so toggling works correctly in both directions. Like increments, unlike decrements.
- **UpvoteButton**: Same pattern for question upvotes. useOptimistic for instant vote count.
- Notice how useOptimistic automatically rolls back the UI if the mutation fails. We just add a toast on error.
- **DeleteComment**: useTransition with pending opacity on the card — it fades while deleting. ViewTransition exit animation plays when it's removed from the list.

### Adding Content

- Adding a comment is a form submission — the InlineForm component handles the form reset and shows a spinner on the submit button while the server processes. This uses useOptimistic(false) internally for its pending state.
- For questions, we go further — the question appears in the list immediately via useOptimistic with a reducer in QuestionList. The temp question gets a client-generated UUID (crypto.randomUUID()) that we pass to the server action — so the optimistic and real question share the same ID, and the React key stays stable. No duplicate flash on settle.
- The reducer also has a safety check — if the real question already exists in the base data (from a background refresh), it deduplicates by matching content and userName.
- Ask your designer what these loading states and toasts should look like. They usually have additional insight.

## Live Data Sync

- Everything so far has been about in-between states — what happens between a user action and the result. But this app also has a background data cycle that runs without user action. Questions need to update when other attendees upvote, and you should see who else is watching the session.
- This is a different pattern. The server renders the initial data in async RSCs and passes it to client components as props. Then SWR takes over with polling — every 3 seconds for questions, every 5 seconds for active users. The initial server data is the starting point, SWR keeps it fresh.
- After mutations, SWR mutate() triggers an immediate revalidation so the UI stays in sync without waiting for the next poll cycle.
- We use useDeferredValue on the sorted question array so that when SWR polls and the ranking changes (someone else upvoted), the list reorder goes through a React transition and animates with ViewTransition.
- Active users are tracked via a presence heartbeat — a useEffect interval calls the recordPresence server action every 10 seconds. When you leave, leavePresence cleans up (inside that mutation+navigation transition we saw earlier).
- The live data layer sits on top of the async patterns — it reuses the same optimistic and animation infrastructure but drives it from background polling instead of user actions.

## Review

- Let me get rid of all my changes and show you the difference before and after.
- Before, we had blank screens and jumping layouts, global spinners and frozen buttons, no error boundaries, and harsh transitions.
- Here is the after. We have skeleton placeholders and reserved space, local feedback and optimistic UI, smooth and contextual transitions, and live data. These improvements also reduce First Contentful Paint, Interaction to Next Paint and Cumulative Layout Shift.
- Remember, the interactions themselves are not actually any faster. It's all about designing the in-between states.
- Sometimes in-between states are not desirable — and you can eliminate them entirely with prefetching and prerendering. The session detail header is prerendered. Navigations to cached pages are instant. Optimistic updates remove the in-between state altogether. The goal is not "no loading states" — the goal is predictable, intentional states.
- Collaborate with your designers on every in-between state. They usually have insight you didn't think of.
