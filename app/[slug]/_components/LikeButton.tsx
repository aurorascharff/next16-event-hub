'use client';

import { Heart } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { toggleLike } from '@/data/actions/comment';
import { cn } from '@/lib/utils';

type Props = {
  commentId: string;
  eventSlug: string;
  likes: number;
};

export function LikeButton({ commentId, eventSlug, likes }: Props) {
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(likes, (current) => {
    return current + 1;
  });
  const [isPending, startTransition] = useTransition();

  function handleLike() {
    startTransition(async () => {
      setOptimisticLikes(1);
      await toggleLike(commentId, eventSlug);
    });
  }

  return (
    <button
      onClick={handleLike}
      data-pending={isPending || undefined}
      className={cn(
        'flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] transition-colors',
        'text-muted-foreground hover:text-primary',
        'data-[pending]:text-primary data-[pending]:animate-pulse',
        optimisticLikes > 0 && 'text-primary',
      )}
      aria-label={`Like (${optimisticLikes})`}
    >
      <Heart className={cn('size-3', optimisticLikes > 0 && 'fill-current')} />
      {optimisticLikes > 0 && <span>{optimisticLikes}</span>}
    </button>
  );
}
