# 10-MINUTE DEMO STEPS — NEXT.JS 16.3

GitHub: https://github.com/aurorascharff/next16-event-hub

Branch flow: `start` → `main`

Scope: one Async React example each for data loading, navigation, and mutation. Use the nested Suspense reveal on the session page, then the day tabs and favorite heart on the home page. Skip View Transitions, label-filter refactoring, questions, polling, and the extended app walkthrough.

## 0:00–1:15 — Intro

- (Open `/slides`.) Hey everyone! I'm Aurora Scharff, and I work on the Next.js developer experience at Vercel.
- Today I want to show you one idea: asynchronous work does not have to make an interface feel slow.
- This is Event Hub, a Next.js 16.3 conference app. It can load sessions, navigate between days, and save favorites. All three work, but each leaves a gap where the UI feels frozen.
- We will fix one loading gap, one navigation gap, and one mutation gap with Async React.

## 1:15–2:30 — The Async React model

- (Move quickly through slides 2–7.) A synchronous interaction moves from event to update to render to commit.
- Async work opens gaps in that cycle: **busy**, while an action is in flight; **loading**, while React waits for data; and **done**, when the result is ready to appear.
- React gives us declarative coordination primitives for those gaps. Today we need only two: Suspense for loading and `useOptimistic()` inside a transition for immediate feedback.
- Next.js App Router supplies the framework integration: async Server Components can suspend, and navigations already run in transitions.
- Back to the editor. We will use the strongest example from each part of the full demo.

## 2:30–4:45 — Async data loading: nested Suspense

- Open a session. Its two async regions already have Suspense boundaries, but the details boundary has no fallback and the comments use a generic spinner. The page reveals in awkward jumps.
- Open `app/[slug]/page.tsx`. Import `EventDetailsSkeleton` and `CommentListSkeleton` beside their matching Server Components.
- Give the outer boundary `fallback={<EventDetailsSkeleton />}`. Extend that boundary around the event details, comment form, and the inner comments boundary.
- Replace the inner boundary's spinner with `fallback={<CommentListSkeleton />}>`.
- Reload the session. The outer boundary first reserves the whole details area. Once the event is ready, React reveals the details and form together while the nested boundary keeps a correctly shaped comments skeleton in place. The comments then stream in as the second reveal.
- This is why nested boundaries are interesting: they express the reveal order in the component tree. We get two coordinated stages without loading flags, effects, or moving the queries to the client.

## 4:45–6:45 — Async navigation: the day tabs

- Return to the home page.
- Click Day 2. The URL navigation starts, but the selected tab does not change until the new Server Component result arrives.
- Open `features/event/components/home-tabs.tsx`. Change the `BottomNav` prop from `onChange` to `action`; keep the callback calling `router.push(href)`.
- Try the tabs again. The selection updates immediately while the grid catches up. Click Day 2 and then Day 1 quickly: transitions are interruptible, so the latest intent wins.
- Open `components/ui/bottom-nav.tsx` briefly. The design component wraps its action in `useTransition()`, writes an optimistic active index with `useOptimistic()`, and exposes pending styling. The app-level consumer only describes the navigation.
- Next.js already transitions `router.push()`. The surrounding transition exists so the reusable control can coordinate its own optimistic and pending UI with that navigation.
- That is the action-prop pattern: put the async coordination in the component that owns the interaction.

## 6:45–8:45 — Async mutation: optimistic favorite

- Click a heart. The server mutation works, but the icon waits for the response.
- Open `features/event/components/favorite-button.tsx`. Add `useOptimistic(favorited, current => !current)` so the heart can show the expected result immediately.
- Add a second `useOptimistic(false)` value for a pending removal. Capture whether the heart is currently favorited before toggling, set the removal value only for that direction, and put `data-removing={removing || undefined}` on the button.
- Replace the click-only button with a `<form action={...}>` and move `toggleFavorite(eventSlug)` into the form Action. Call the optimistic setter before awaiting the mutation.
- Keep `e.stopPropagation()` on the submit button so favoriting a card does not open the session.
- React runs the form Action in a transition. The optimistic state lasts while the Action is pending, settles to the refreshed server value on success, and rolls back automatically on failure.
- The starter already applies `has-data-removing:opacity-50` to cards only in the Favorites view. Remove a favorite there: the heart empties immediately, the whole outgoing card fades while the Action is pending, and the refreshed server result removes it.
- Add `toast.error('Could not update favorite. Try again.')` in the client-side catch. Optimistic success is already visible; only failure needs an extra message.
- This one interaction now demonstrates both sides of Async React feedback: optimistic state communicates the expected result, while pending styling communicates that the server is still finishing the work.

## 8:45–10:00 — Outro

- We fixed three different async gaps with three small, composable changes.
- For **data loading**, nested Suspense boundaries gave two Server Component regions a deliberate reveal order.
- For **navigation**, the design component coordinated optimistic selection and pending UI in a transition.
- For **mutation**, a form Action coordinated an optimistic heart, a pending-removal fade, and automatic rollback.
- The server did not get faster. The interface got clearer because we designed what happens while we wait.
- That is the Async React mental model I want you to take away: loading, navigation, and mutation are all part of the render cycle, so model them declaratively instead of rebuilding coordination with effects and loading flags.
- The full repository and longer demo include View Transitions, more Suspense boundaries, optimistic questions and upvotes, and background refreshes. Thank you!
