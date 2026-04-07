import { Suspense, ViewTransition } from 'react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { getEventBySlug, getEvents, getUserFavorites } from '@/data/queries/event';
import { CommentCard } from './_components/CommentCard';
import { CommentForm } from './_components/CommentForm';
import { EventDetails } from './_components/EventDetails';
import type { Metadata } from 'next';

export const unstable_instant = {
  prefetch: 'runtime',
  samples: [
    {
      params: { slug: 'opening-party' },
      cookies: [{ name: 'event-hub-user', value: 'testuser' }],
    },
    {
      params: { slug: 'opening-party' },
      cookies: [{ name: 'event-hub-user', value: null }],
    },
  ],
};

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: event.description,
    title: `${event.name} | Event Hub`,
  };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(event => {
    return { slug: event.slug };
  });
}

export default async function SessionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  return (
    <div className="flex flex-col gap-6">
      <div className="min-h-56 sm:min-h-72">
        <EventDetails slug={slug}>
          <Suspense fallback={<Skeleton className="size-6 shrink-0 rounded-md" />}>
            <FavoriteStatus slug={slug} />
          </Suspense>
        </EventDetails>
        <Suspense
          fallback={
            <div className="mt-4 min-h-9">
              <CommentFormSkeleton />
            </div>
          }
        >
          <div className="mt-4 min-h-9">
            <CommentForm />
          </div>
        </Suspense>
      </div>
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <CommentListSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" default="none">
          <CommentList slug={slug} />
        </ViewTransition>
      </Suspense>
    </div>
  );
}

async function CommentList({ slug }: { slug: string }) {
  const currentUser = await getCurrentUser();
  const comments = await getCommentsByEvent(slug, currentUser);

  return (
    <div className="space-y-2">
      {comments.map(comment => {
        return (
          <ViewTransition key={comment.id}>
            <CommentCard comment={comment} currentUser={currentUser} />
          </ViewTransition>
        );
      })}
      {comments.length === 0 && <EmptyState message="No comments yet. Start the conversation!" />}
    </div>
  );
}

function CommentListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => {
        return (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
            <Skeleton className="size-7 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

async function FavoriteStatus({ slug }: { slug: string }) {
  const currentUser = await getCurrentUser();
  const favorites = currentUser ? await getUserFavorites(currentUser) : new Set<string>();
  return <FavoriteButton eventSlug={slug} hasFavorited={favorites.has(slug)} />;
}

function CommentFormSkeleton() {
  return (
    <div className="flex min-h-9 gap-2">
      <Skeleton className="h-9 flex-1 rounded-md" />
      <Skeleton className="h-9 w-14 shrink-0 rounded-md" />
    </div>
  );
}
