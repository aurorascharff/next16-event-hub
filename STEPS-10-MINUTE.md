    # 10-MINUTE DEMO STEPS — NEXT.JS 16.3

    GitHub: https://github.com/aurorascharff/next16-event-hub

    Branch flow: `start` → `main`

    Scope: one Async React example each for data loading, navigation, and mutation. Compare three Suspense boundary shapes on the session page, add reveal animation only after the loading sequence is right, then do the day tabs and favorite heart on the home page. Skip label-filter refactoring, questions, polling, and the extended app walkthrough.

    ## 0:00–1:15 — Intro

    - (Open `/slides`.) Hey everyone! I'm Aurora Scharff, and I work on the Next.js developer experience at Vercel.
    - Today I want to show you one idea: asynchronous work does not have to make an interface feel slow.
    - This is Event Hub, a Next.js 16.3 conference app. It can load sessions, navigate between days, and save favorites. All three work, but each leaves a gap where the UI feels frozen.
    - We will fix one loading gap, one navigation gap, and one mutation gap with Async React.

    ## 1:15–2:30 — The Async React model

    - (Move quickly through slides 2–7.) A synchronous interaction moves from event to update to render to commit.
    - Async work opens gaps in that cycle: **busy**, while an action is in flight; **loading**, while React waits for data; and **done**, when the result is ready to appear.
    - React gives us declarative coordination primitives for those gaps. Suspense coordinates loading UI and `useOptimistic()` inside a transition gives immediate feedback.
    - Next.js App Router supplies the framework integration: async Server Components can suspend, and navigations already run in transitions.
    - Back to the editor. We will use the strongest example from each part of the full demo.

    ## 2:30–5:30 — Async data loading: three Suspense shapes

    - Open a session. The event details and comments are async Server Components on different clocks: the details start arriving quickly, while comments deliberately take 3 seconds.
    - Suspense is more than a spinner. The boundary decides which fallback appears and which pieces reveal together. The network decides when data is ready; we decide how that wait is presented in the component tree.
    - Open `app/[slug]/page.tsx`. Import `EventDetailsSkeleton` and `CommentListSkeleton` beside their matching Server Components.

    ### 1. Sibling boundaries: stream independently, then shift

    - Keep the two boundaries separate. Leave the details boundary without a fallback and replace the comments spinner with `CommentListSkeleton`.
    - Reload. The form and comments fallback paint immediately, and each async region can stream on its own clock. That gives us an early First Contentful Paint, but the lower UI starts too high and jumps when the unknown-height details arrive: Cumulative Layout Shift.
    - We have other valid ways to handle unknown content. We could constrain the region and make it scrollable, or add Show more / Show less. The right solution depends on the UI. Here we are comparing how Suspense boundary shapes orchestrate the reveal.

    ### 2. One large boundary: stable, but waits for everything

    - Try the opposite extreme: use one Suspense boundary around `EventDetails`, `CommentForm`, and `CommentList`, with `EventDetailsSkeleton` as the fallback.
    - Reload. The intermediate shift is gone because the page swaps once, but the useful event content now waits for the slow comments. We improved CLS by delaying the session's meaningful FCP until the slowest child is ready.

    ### 3. Nested boundaries: early and stable

    - Keep that outer details boundary, but put a second Suspense around `CommentList` with `CommentListSkeleton`. The outer boundary owns the unknown-height details and everything positioned beneath them; the inner boundary owns the slower list.
    - In `EventDetails`, give the slower `FavoriteStatus` its own Suspense boundary with a small heart skeleton so it does not hold back the 350ms details.
    - Reload. The details and form reveal first, with the comments skeleton already in the correct position. The favorite heart resolves independently, then the comments replace their skeleton at 3 seconds. Nesting does not sequence the queries; it sequences what React is allowed to reveal.
    - This is the balance we want: an early, useful FCP without the CLS. We chose the loading UI and reveal order instead of letting response timing arrange the page.

    ### Add animation last

    - Only after the boundary structure is right, replace the three Suspense boundaries with `AnimatedSuspense` while keeping the same fallbacks and nesting. Use the default crossfade for details and the heart, and `animation="slide"` for the comments list.
    - Show `components/ui/animated-suspense.tsx` briefly. It is Suspense plus ViewTransition around the fallback and resolved content; animation changes the reveal, not the data behavior or boundary ownership.
    - React's `<ViewTransition>` became stable in React 19.3, released September 9, 2026, only a couple of weeks ago. `AnimatedSuspense` is our small reusable wrapper around that stable primitive.
    - Reload once more: same early, stable nested reveal, now with crossfades for local details and a vertical slide for the list.

    ## 5:30–7:00 — Async navigation: the day tabs

    - Return to the home page.
    - Click Day 2. The URL navigation starts, but the selected tab does not change until the new Server Component result arrives.
    - Open `features/event/components/home-tabs.tsx`. Change the `BottomNav` prop from `onChange` to `action`; keep the callback calling `router.push(href)`.
    - Try the tabs again. The selection updates immediately while the grid catches up. Click Day 2 and then Day 1 quickly: transitions are interruptible, so the latest intent wins.
    - Open `components/ui/bottom-nav.tsx` briefly. The design component wraps its action in `useTransition()`, writes an optimistic active index with `useOptimistic()`, and exposes pending styling. The app-level consumer only describes the navigation.
    - Next.js already transitions `router.push()`. The surrounding transition exists so the reusable control can coordinate its own optimistic and pending UI with that navigation.
    - That is the action-prop pattern: put the async coordination in the component that owns the interaction.

    ## 7:00–9:00 — Async mutation: optimistic favorite

    - Click a heart. The server mutation works, but the icon waits for the response.
    - Open `features/event/components/favorite-button.tsx`. Add `useOptimistic(favorited, current => !current)` so the heart can show the expected result immediately.
    - Replace the click-only button with a `<form action={...}>` and move `toggleFavorite(eventSlug)` into the form Action. Call the optimistic setter before awaiting the mutation.
    - Keep `e.stopPropagation()` on the submit button so favoriting a card does not open the session.
    - If the mutation fails, we usually want to give the user some feedback. In this demo the Server Action returns an error message, so await it as `const error = await toggleFavorite(eventSlug)` and call `toast.error(error)` when it returns one. We do not need a client-side `try/catch` for that returned result. Another valid choice is to let an unexpected thrown error reach a higher error boundary.
    - React runs the form Action in a transition. The optimistic heart lasts while the Action is pending, settles to the refreshed server value on success, and rolls back automatically when the action returns without changing the server value. The toast makes that local rollback understandable.

    ## 9:00–10:00 — Outro

    - We fixed three different async gaps with three small, composable changes.
    - For **data loading**, three boundary shapes made the tradeoff visible: siblings streamed early but shifted, one large boundary waited for everything, and nesting gave us an early, stable reveal. AnimatedSuspense polished that final structure afterward.
    - For **navigation**, the design component coordinated optimistic selection and pending UI in a transition.
    - For **mutation**, a form Action coordinated an optimistic heart, automatic rollback, and a returned-error toast.
    - The server did not get faster. The interface got clearer because we designed what happens while we wait.
    - That is the Async React mental model I want you to take away: loading, navigation, and mutation are all part of the render cycle, so model them declaratively instead of rebuilding coordination with effects and loading flags.
    - The full repository and longer demo include View Transitions, more Suspense boundaries, optimistic questions and upvotes, and background refreshes. Thank you!
