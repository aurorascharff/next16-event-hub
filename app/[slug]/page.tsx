import { Suspense } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { CenteredSpinner } from '@/components/ui/spinner';
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
      <Suspense fallback={<CenteredSpinner />}>
        <EventDetails params={params} />
      </Suspense>
      <div className="mt-4 space-y-3">
        <CommentForm />
        <Suspense fallback={<CenteredSpinner />}>
          <CommentList params={params} />
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
        return <CommentCard key={comment.id} comment={comment} currentUser={currentUser} />;
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
