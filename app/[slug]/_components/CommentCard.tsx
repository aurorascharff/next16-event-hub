import { Avatar } from '@/components/common/Avatar';
import { timeAgo } from '@/lib/utils';
import type { Comment } from '@/types';
import { DeleteButton } from './DeleteButton';
import { LikeButton } from './LikeButton';

type Props = {
  comment: Comment;
  currentUser: string | null;
};

export function CommentCard({ comment, currentUser }: Props) {
  const isOwner = currentUser === comment.userName;

  return (
    <div className="group flex items-start gap-3 rounded-lg border p-3 transition-opacity has-data-pending:opacity-50">
      <Avatar name={comment.userName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{comment.userName}</span>
          <span className="text-muted-foreground text-xs">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed wrap-break-word">{comment.content}</p>
      </div>
      <div className="flex items-center gap-1">
        <LikeButton
          commentId={comment.id}
          eventSlug={comment.eventSlug}
          likes={comment.likes}
          hasLiked={comment.hasLiked}
        />
        {isOwner && <DeleteButton commentId={comment.id} eventSlug={comment.eventSlug} />}
      </div>
    </div>
  );
}
