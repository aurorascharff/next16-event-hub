---
name: nextjs-app-architecture
description: Architecture patterns for Next.js 16 App Router apps with cacheComponents, Suspense streaming, and feature-sliced design. Use when building a new app, adding or refactoring features, scaffolding pages, designing loading states, structuring feature folders, setting up data fetching with caching, or placing client/server boundaries. Also for RSC composition, Suspense placement, skeleton design, CLS prevention, and cache invalidation.
---

# Next.js App Architecture

Use when building or refactoring Next.js 16+ App Router apps with `cacheComponents: true`. Follow these steps in order.

## The model

`cacheComponents: true` builds a static shell at build and streams dynamic content per request:

- **Static shell**: synchronous content, `'use cache'` components, and Suspense fallbacks prerender at build
- **Dynamic holes**: async components without `'use cache'` stream in behind `<Suspense>` at request time
- **Build constraint**: any async work without `'use cache'` must sit inside `<Suspense>`, or the build fails
- Pages stay synchronous. Use `params.then()` instead of `await params` to keep the page out of the static-shell exit path

## Step 1: Locate or create the feature folder

Check if the domain already has a feature folder under `features/`. If it does, use it. If not, create one:

```
features/<domain>/
  <domain>-queries.ts   # Server-only queries with 'use cache'
  <domain>-actions.ts   # Server actions with 'use server'
  components/           # Self-contained async components + skeletons
```

If the code you're working with has domain logic scattered across pages or mixed into other folders, refactor it into this structure first. Move queries into `<domain>-queries.ts`, actions into `<domain>-actions.ts`, and components into `components/`. Pages in `app/` should only compose feature components, never contain domain logic.

### How many features?

Keep the feature list short. One folder per **domain noun a user would recognize**, not per database table or technical concern. Merge aggressively when one concept only exists in service of another:

- A `favorite` or `bookmark` concept that only attaches to one parent entity (events, posts) belongs inside that parent's feature folder, not its own.
- A `like`, `repost`, `vote`, or `reaction` concept on a piece of content belongs with that content's feature.
- `auth` / `session` / `current user` belongs in a single `user` folder, not split across multiple folders.
- A new folder is justified when the concept has its own queries, its own pages or routes, AND is referenced from at least two other features.

If you find yourself making a feature folder with one query, one action, and one button, fold it into the parent feature instead.

### Action file naming

Actions for a feature always go in `<folder>-actions.ts`, matching the folder name — even when the mutation operates on a sub-concept. `toggleFavorite` in `features/event/` lives in `event-actions.ts`, not `favorite-actions.ts`. The folder is the source of truth for the name. Same for queries: `<folder>-queries.ts`.

## Step 2: Write the queries

Create `<domain>-queries.ts`. Mark it with `import 'server-only'`. Wrap every query in `cache()` from React for request deduplication. Without it, the same query called from multiple components in the same render will hit the database multiple times. Add `'use cache'` + `cacheTag` + `cacheLife`.

```tsx
import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { cache } from 'react';

export const getFeed = cache(async (userId: string) => {
  'use cache';
  cacheTag('feed', `feed-${userId}`);
  cacheLife('seconds');
  return db.post.findMany({ where: { userId } });
});
```

If the query reads cookies or session data, use `'use cache: private'` to scope the cache per user.

## Step 3: Write the actions

Create `<domain>-actions.ts`. Mark with `'use server'`. Always verify auth and validate input inside the action. Call `updateTag()` to invalidate the matching cache tags. Return `{ ok, error }`.

```tsx
'use server';
export async function createPost(formData: FormData) {
  const user = await verifyUser();
  const parsed = schema.safeParse({ body: formData.get('body') });
  if (!parsed.success) return { error: parsed.error.issues[0].message, ok: false as const };

  await db.post.create({ data: { body: parsed.data.body, userId: user.id } });
  updateTag('feed');
  return { ok: true as const };
}
```

The `cacheTag` in the query and the `updateTag` in the action live in the same feature folder. This is the full cycle: tag, cache, invalidate.

Client components import server actions directly. Don't pass an action as a prop to call it:

```tsx
// Right
'use client';
import { likePost } from '@/features/post/post-actions';

export function LikeButton({ postId }: { postId: string }) {
  return <button onClick={() => likePost(postId)}>Like</button>;
}

// Wrong
async function Post({ id }: { id: string }) {
  return <LikeButton postId={id} onLike={likePost} />;
}
```

Exception: bind a parameterized action when the child shouldn't know about the id: `onAction={deletePost.bind(null, post.id)}`.

## Step 4: Build the component

Create an async server component in `features/<domain>/components/`. Reuse existing components in the feature folder before adding new ones. Export a skeleton from the same file.

Default to async server components. They `await` their own queries directly:

```tsx
import { getUnreadNotificationCount } from '@/features/notifications/notifications-queries';

export async function NotificationsBadge() {
  const count = await getUnreadNotificationCount();
  if (count === 0) return null;
  return <span aria-label={`${count} unread`}>{count}</span>;
}
```

```tsx
<Suspense>
  <NotificationsBadge />
</Suspense>
```

Pass a promise + `use()` only when the consumer must be a client component (hooks, event handlers, browser APIs). Name promise props with a `Promise` suffix:

```tsx
<Suspense fallback={<TagListSkeleton />}>
  <TagPicker itemsPromise={getTags()} />
</Suspense>
```

```tsx
'use client';
import { use } from 'react';

export function TagPicker({ itemsPromise }: { itemsPromise: Promise<Tag[]> }) {
  const items = use(itemsPromise);
}
```

Server components take plain values as props (strings, IDs), never promises. When a parent already has the data from its own query, pass it as a prop instead of having the child refetch. For example, `<Feed>` fetches the post list and passes each `post` object to `<Post post={post} />`. There's no reason for `<Post>` to refetch its own row by id when the parent already has it.

A list with its skeleton, in one file:

```tsx
export async function Feed({ userId }: { userId: string }) {
  const posts = await getFeed(userId);
  return (
    <ul>
      {posts.map(p => (
        <Post key={p.id} post={p} />
      ))}
    </ul>
  );
}

export function FeedSkeleton() {
  return (
    <ul>
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i}>
          <Skeleton className="h-24" />
        </li>
      ))}
    </ul>
  );
}
```

Group related components in one file when they're always used together or one is a natural building block for another. A card and its grid live in the same file. For example, `genre-card.tsx` exports `GenrePill`, `GenreCard`, `GenreGrid`, `GenreGridSkeleton`. Don't split shared UI primitives prematurely though, wait until three call sites need the same shape before extracting. Two sidebar widgets that happen to look similar but render different data shapes are not the same component, the visuals diverge as soon as one needs an extra slot.

For single-use sub-components (a metadata strip inside one card, a header used only by one detail view, a list item only rendered by its list), inline them as **non-exported** functions in the same file. Don't make them their own file or their own export just because they're a separate JSX block. Exports are for things other files will import. Internal structure is for readability inside one file.

Server/client boundary blocks some grouping. An async server component and its `'use client'` helper can't share a file. Keep them as siblings in the same folder.

When a client component needs server data but should own its loading state (a sidebar badge, a popover that fetches on mount), pass the unresolved promise from the server and resolve it with `use()` on the client. Wrap the consumer in `<Suspense>`.

### Skeleton design rules

1. Match the real component's layout: flex direction, gaps, padding, breakpoints
2. Include all structural elements: avatar circles, action button placeholders, image squares
3. Responsive visibility must match (`hidden sm:block` in real = same in skeleton)
4. Show 2-5 placeholders for variable-length lists, not the real count
5. Don't include skeletons for inner Suspense content, those have their own boundaries

If the entire component output can be cached, put `'use cache'` on the component directly instead of on the query:

```tsx
async function TrendingTags() {
  'use cache';
  cacheTag('trending');
  cacheLife('minutes');

  const tags = await db.tag.findMany({ orderBy: { count: 'desc' }, take: 6 });
  return (
    <ul>
      {tags.map(t => (
        <li key={t.name}>#{t.name}</li>
      ))}
    </ul>
  );
}
```

## Step 5: Decide the client boundary

Push `'use client'` as deep as possible. Only add it when you need hooks, event handlers, or browser APIs.

If the component needs interactive pieces, keep the server component as the parent and render client leaves:

```tsx
async function PostDetail({ id }: { id: string }) {
  const [post, userState] = await Promise.all([getPost(id), getPostUserState(id)]);
  return (
    <article>
      <PostBody body={post.body} />
      <PostActions userState={userState} /> {/* 'use client' leaf */}
    </article>
  );
}
```

Server content can flow into client components as children:

```tsx
<ComposerForm
  avatar={
    <Suspense fallback={<AvatarSkeleton />}>
      <CurrentUserAvatar />
    </Suspense>
  }
/>
```

The client component doesn't know where the avatar came from. Composition crosses the boundary.

Use `useOptimistic` for instant feedback on mutations. Skip success toasts when the optimistic UI already shows the result. Only toast on error.

For deeper patterns on building interactive client components alongside async React (coordinating `useTransition`, `useOptimistic`, `useActionState`, `data-pending`, Suspense streaming, and caching across server and client in one app), see the [Interactive Apps guide](https://nextjs.org/docs/app/guides/interactive-apps).

### Live data via polling

If the feature needs to reflect updates that happen on the server (other users posting, new notifications, vote counts changing), drop a `<Poller>` client component into the page:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Poller({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), intervalMs);
    const onFocus = () => router.refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [router, intervalMs]);
  return null;
}
```

`router.refresh()` re-renders the server components on the server. Combined with `'use cache'` + `cacheLife('seconds')`, the queries return cached data until they expire, then the next refresh picks up the new data. No WebSockets, no SSE, just the existing cache cycle.

## Step 6: Compose the page

Create the page in `app/`. The page composes feature components with Suspense boundaries. It never fetches data directly.

Use `params.then()` instead of `await params` to keep the page synchronous. Content above the `.then()` pre-renders into the static shell. Use generated `PageProps<'/route'>` and `LayoutProps<'/route'>` types.

### The page owns the Suspense boundary, the feature owns the skeleton

The feature exports the async component and a sibling skeleton. The page imports both and places the boundary. Don't pre-wrap the component in `<Suspense>` inside the feature, that hides the boundary and prevents grouping siblings under a shared parent (e.g. detail + replies inside one `params.then()`).

If a page uses a transition wrapper, place it in the page next to the `<Suspense>` boundary. Feature components should render content and skeletons, not loading or transition wrappers.

Do not create page-local wrapper components whose only job is to group boundary content, such as `HomeLists` or `HomeListsSkeleton`. Keep the resolved JSX and fallback JSX inline in the page so the loading shape, headings, and grouped reveal behavior are visible at the boundary.

```tsx
// features/post/components/post-detail.tsx
export async function PostDetail({ id }: { id: string }) {
  const post = await getPost(id);
  return <article>{post.body}</article>;
}

export function PostDetailSkeleton() {
  return <div className="skeleton h-64 rounded-xl" />;
}
```

```tsx
// app/post/[id]/page.tsx
import { Suspense } from 'react';
import { PostDetail, PostDetailSkeleton } from '@/features/post/components/post-detail';

export default function PostPage({ params }: PageProps<'/post/[id]'>) {
  return (
    <div>
      <PageHeader back title="Post" />
      <Suspense fallback={<PostDetailSkeleton />}>
        {params.then(({ id }) => (
          <>
            <PostDetail id={id} />
            <ErrorBoundary title="Replies didn't load">
              <Suspense fallback={<RepliesSkeleton />}>
                <Replies postId={id} />
              </Suspense>
            </ErrorBoundary>
          </>
        ))}
      </Suspense>
    </div>
  );
}
```

Page chrome sits **above** the `params.then()` so it paints instantly. Never wrap the entire page in a Suspense fallback.

For `searchParams` or both, use the same shape:

```tsx
// searchParams only
export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return searchParams.then(sp => {
    const q = typeof sp.q === 'string' ? sp.q : '';
    return q ? <SearchResults query={q} /> : <EmptyState />;
  });
}

// Both
export default function ProfilePage({ params, searchParams }: PageProps<'/u/[handle]'>) {
  return Promise.all([params, searchParams]).then(([{ handle }, sp]) => (
    <ProfileFeed handle={handle} tab={parseTab(sp.tab)} />
  ));
}
```

Boundary placement:

- Group things that should appear together in one boundary
- Nest boundaries for slower content to stream independently
- Wrap fallible sections in `<ErrorBoundary>`
- Optional: wrap in `<ViewTransition>` for smooth reveals. See [React View Transitions skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-view-transitions)

### Suspense boundary placement rules

1. First section gets its own Suspense with a known-height skeleton fallback
2. Section headings stay outside Suspense when their final position is stable
3. Variable-height sections: group everything below them in the same Suspense, including any headings that would otherwise paint in the wrong vertical position
4. Fixed-height sections: own boundary is safe
5. Variable-length lists: show 2-5 skeleton items, not the real count
6. Inner Suspense content stays out of the outer skeleton
7. Never use `fallback={null}` for visible UI. If a boundary covers UI, give it a real shaped fallback, or group it with a sibling boundary that already has the correct fallback.
8. If the top section's final height is not known, group the following sections in the same boundary so they reveal together and don't jump underneath it.

### Layout-level Suspense

Layouts compose feature components with Suspense the same way pages do. Wrap each in an error boundary.

### Page exports

Optionally add `export const unstable_prefetch = 'force-runtime'` so navigations are backed by prefetched data. Use this for routes where instant-feeling navigation matters (feed, detail pages). Don't put it on every route, each opt-in page runs a full render in the background for every `<Link>` that enters the viewport, which costs server CPU and database load. Routes that change rarely or aren't navigated to often can stay on the default static prefetch.

`generateMetadata` can use `await params`, it runs before the page.
