import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { getEventBySlug } from '@/data/queries/event';
import { CommentCard } from './_components/CommentCard';
import { CommentForm } from './_components/CommentForm';
import { EventDetails, EventDetailsSkeleton } from './_components/EventDetails';

export default function SessionPage({ params }: PageProps<'/[slug]'>) {
  return (
    <>
      <div className="min-h-56 sm:min-h-72">
        <ViewTransition>
          <Suspense fallback={<EventDetailsSkeleton />}>
            <EventDetails params={params} />
          </Suspense>
        </ViewTransition>
        <ViewTransition>
          <Suspense fallback={<EventDescriptionSkeleton />}>
            <EventDescription params={params} />
          </Suspense>
        </ViewTransition>
      </div>
      <div className="mt-4 space-y-3">
        <Suspense
          fallback={
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-9 w-14 rounded-md" />a
            </div>
          }
        >
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

async function EventDescription({ params }: Pick<PageProps<'/[slug]'>, 'params'>) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return (
    <div className="mt-2 max-h-20 overflow-y-auto sm:max-h-24">
      <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">{event.description}</p>
    </div>
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
          <ViewTransition key={comment.id} name={`comment-${comment.id}`} enter="slide-up">
            <CommentCard comment={comment} currentUser={currentUser} />
          </ViewTransition>
        );
      })}
      {comments.length === 0 && <EmptyState message="No comments yet. Start the conversation!" />}
    </div>
  );
}

function EventDescriptionSkeleton() {
  return (
    <div className="mt-5 h-22 space-y-1.5 sm:h-26">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
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
