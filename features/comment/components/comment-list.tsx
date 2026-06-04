import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { getCommentsByEvent } from '@/features/comment/comment-queries';
import { DeleteButton } from '@/features/comment/components/delete-button';
import { getCurrentUser } from '@/features/user/user-queries';
import { timeAgo } from '@/lib/utils';
import type { Comment } from '@/types/comment';

export async function CommentList({ slug }: { slug: string }) {
  const currentUser = await getCurrentUser();
  const comments = await getCommentsByEvent(slug, currentUser);

  if (comments.length === 0) {
    return <EmptyState message="No comments yet. Start the conversation!" />;
  }

  return (
    <div className="space-y-2">
      {comments.map(comment => {
        return <CommentCard key={comment.id} comment={comment} currentUser={currentUser} />;
      })}
    </div>
  );
}

function CommentCard({ comment, currentUser }: { comment: Comment; currentUser: string | null }) {
  const isOwner = currentUser === comment.userName;

  return (
    <div className="group flex items-start gap-3 rounded-lg border p-3 has-data-pending:opacity-50">
      <Avatar name={comment.userName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.userName}</span>
          <span className="text-muted-foreground text-xs">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed wrap-break-word">{comment.content}</p>
      </div>
      {isOwner && <DeleteButton commentId={comment.id} eventSlug={comment.eventSlug} />}
    </div>
  );
}

export function CommentListSkeleton() {
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
