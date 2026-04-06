import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { CommentCard } from './_components/CommentCard';
import { CommentForm } from './_components/CommentForm';

export default async function CommentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={
      <ViewTransition exit="slide-down">
        <FeedSkeleton />
      </ViewTransition>
    }>
      <ViewTransition enter="slide-up" default="none">
        <CommentFeed slug={slug} />
      </ViewTransition>
    </Suspense>
  );
}

async function CommentFeed({ slug }: { slug: string }) {
  const currentUser = await getCurrentUser();
  const comments = await getCommentsByEvent(slug, currentUser);

  return (
    <div className="space-y-3">
      <CommentForm eventSlug={slug} />
      <div className="space-y-2">
        {comments.map(comment => {
          return (
            <ViewTransition key={comment.id} name={`comment-${comment.id}`} enter="slide-up">
              <CommentCard comment={comment} currentUser={currentUser} />
            </ViewTransition>
          );
        })}
        {comments.length === 0 && (
          <EmptyState message="No comments yet. Start the conversation!" />
        )}
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full rounded-lg" />
      <div className="space-y-3">
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
    </div>
  );
}
