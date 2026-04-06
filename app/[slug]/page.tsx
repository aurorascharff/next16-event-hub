import { Suspense, ViewTransition } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { getEventBySlug } from '@/data/queries/event';
import type { Metadata } from 'next';
import { CommentCard } from './_components/CommentCard';
import { CommentForm } from './_components/CommentForm';
import { EventDetails, EventDetailsSkeleton } from './_components/EventDetails';

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: event.description,
    title: `${event.name} | Event Hub`,
  };
}

export default function SessionPage({ params }: PageProps<'/[slug]'>) {
  return (
    <>
      <div className="min-h-56 sm:min-h-72">
        <Suspense
          fallback={
            <ViewTransition exit="auto">
              <EventDetailsSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="auto" default="none">
            <EventDetails params={params} />
          </ViewTransition>
        </Suspense>
      </div>
      <div className="mt-4 space-y-3">
        <Suspense fallback={<CommentFormSkeleton />}>
          <CommentForm />
        </Suspense>
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <CommentListSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <CommentList params={params} />
          </ViewTransition>
        </Suspense>
      </div>
    </>
  );
}

async function CommentList({ params }: Pick<PageProps<'/[slug]'>, 'params'>) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();
  const comments = await getCommentsByEvent(slug, currentUser);

  return (
    <div className="space-y-2">
      {comments.map(comment => {
        return (
          <ViewTransition key={comment.id} name={`comment-${comment.id}`} enter="slide-up" default="none">
            <CommentCard comment={comment} currentUser={currentUser} />
          </ViewTransition>
        );
      })}
      {comments.length === 0 && <EmptyState message="No comments yet. Start the conversation!" />}
    </div>
  );
}

function CommentFormSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-9 flex-1 rounded-md" />
      <Skeleton className="h-9 w-14 rounded-md" />
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
