import { Avatar } from '@/components/common/Avatar';
import { timeAgo } from '@/lib/utils';
import type { Comment } from '@/types';
import { DeleteButton } from './DeleteButton';

type Props = {
  comment: Comment;
  currentUser: string | null;
};

export async function CommentCard({ comment, currentUser }: Props) {
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
      {isOwner && <DeleteButton commentId={comment.id} eventSlug={comment.eventSlug} />}
    </div>
  );
}
