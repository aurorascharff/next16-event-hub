import { connection } from 'next/dist/server/web/exports';
import { Suspense, ViewTransition } from 'react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { NavForward } from '@/components/animations';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { getEventBySlug, getEvents, getUserFavorites } from '@/data/queries/event';
import { CommentCard } from './_components/CommentCard';
import { CommentForm } from './_components/CommentForm';
import { EventDetails, EventDetailsSkeleton } from './_components/EventDetails';
import type { Metadata } from 'next';

export const unstable_prefetch = 'force-runtime';

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
    <NavForward>
      <div className="min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-8">
            <div className="min-h-72 sm:min-h-96">
              <Suspense fallback={<EventDetailsSkeleton />}>
                <EventDetails slug={slug}>
                  <Suspense fallback={<Skeleton className="size-6 shrink-0 rounded-md" />}>
                    <FavoriteStatus slug={slug} />
                  </Suspense>
                </EventDetails>
              </Suspense>
            </div>
            <div className="border-border/60 border-t pt-8">
              <div className="mb-6 min-h-9">
                <CommentForm />
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
          </div>
        </div>
      </div>
    </NavForward>
  );
}

async function FavoriteStatus({ slug }: { slug: string }) {
  const currentUser = await getCurrentUser();
  const favorites = currentUser ? await getUserFavorites(currentUser) : new Set<string>();
  return <FavoriteButton eventSlug={slug} favorited={favorites.has(slug)} />;
}

async function CommentList({ slug }: { slug: string }) {
  await connection();
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
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
