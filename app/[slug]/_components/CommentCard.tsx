import { Trash2 } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { SubmitButton } from '@/components/design/SubmitButton';
import { deleteComment } from '@/data/actions/comment';
import { cn, timeAgo } from '@/lib/utils';
import type { Comment } from '@/types';
import { LikeButton } from './LikeButton';

type Props = {
  comment: Comment;
  currentUser: string | null;
};

export function CommentCard({ comment, currentUser }: Props) {
  const isOwner = currentUser === comment.userName;

  return (
    <div
      className={cn('group flex items-start gap-3 rounded-lg border p-3 transition-opacity')}
    >
      <Avatar name={comment.userName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{comment.userName}</span>
          <span className="text-muted-foreground text-xs">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{comment.content}</p>
      </div>
      <div className="flex items-center gap-1">
        <LikeButton
          commentId={comment.id}
          eventSlug={comment.eventSlug}
          likes={comment.likes}
          hasLiked={comment.hasLiked}
        />
        {isOwner && (
          <form>
            <SubmitButton
              action={deleteComment.bind(null, comment.id, comment.eventSlug)}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive size-auto rounded p-1 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Delete comment"
            >
              <Trash2 className="size-3" />
            </SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
