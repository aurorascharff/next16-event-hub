import { Suspense } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { CenteredSpinner } from '@/components/ui/spinner';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { CommentCard } from './_components/CommentCard';
import { CommentForm } from './_components/CommentForm';
import { EventDetails } from './_components/EventDetails';
// eslint-disable-next-line import/order, autofix/no-unused-vars
import { ViewTransition } from 'react';

export default async function SessionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;

  return (
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-8">
          <Suspense>
            <div className="min-h-72 sm:min-h-96">
              <EventDetails slug={slug} />
            </div>
          </Suspense>
          <div className="border-border/60 border-t pt-8">
            <div className="mb-6 min-h-9">
              <CommentForm />
            </div>
            <Suspense fallback={<CenteredSpinner />}>
              <CommentList slug={slug} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

async function CommentList({ slug }: { slug: string }) {
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
// eslint-disable-next-line autofix/no-unused-vars
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
