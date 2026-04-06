'use client';

import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { deleteComment } from '@/data/actions/comment';
import { cn, timeAgo } from '@/lib/utils';
import { LikeButton } from './LikeButton';

type Comment = {
  id: string;
  content: string;
  userName: string;
  likes: number;
  hasLiked: boolean;
  eventSlug: string;
  createdAt: Date | string;
};

type Props = {
  comment: Comment;
  currentUser: string | null;
};

export function CommentCard({ comment, currentUser }: Props) {
  const [isPending, startTransition] = useTransition();
  const isOwner = currentUser === comment.userName;

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(comment.id, comment.eventSlug);
    });
  }

  return (
    <div
      data-pending={isPending || undefined}
      className={cn(
        'group flex items-start gap-3 rounded-lg border p-3 transition-opacity',
        'data-[pending]:opacity-50',
      )}
    >
      <Avatar name={comment.userName} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{comment.userName}</span>
          <span className="text-muted-foreground text-xs">
            {timeAgo(comment.createdAt)}
          </span>
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
          <button
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Delete comment"
          >
            <Trash2 className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}
