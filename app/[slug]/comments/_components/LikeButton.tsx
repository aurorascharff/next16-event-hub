'use client';

import { Heart } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { toggleLike } from '@/data/actions/comment';
import { cn } from '@/lib/utils';

type Props = {
  commentId: string;
  eventSlug: string;
  likes: number;
  hasLiked: boolean;
};

export function LikeButton({ commentId, eventSlug, likes, hasLiked }: Props) {
  const [optimistic, toggleOptimistic] = useOptimistic(
    { hasLiked, likes },
    (current) => {return {
      hasLiked: !current.hasLiked,
      likes: current.likes + (current.hasLiked ? -1 : 1),
    }},
  );
  const [, startTransition] = useTransition();

  function handleLike() {
    startTransition(async () => {
      toggleOptimistic(null);
      await toggleLike(commentId, eventSlug);
    });
  }

  return (
    <button
      onClick={handleLike}
      className={cn(
        'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors',
        optimistic.hasLiked
          ? 'text-primary'
          : 'text-muted-foreground hover:text-primary',
      )}
      aria-label={`Like (${optimistic.likes})`}
    >
      <Heart className={cn('size-3', optimistic.hasLiked && 'fill-current')} />
      {optimistic.likes > 0 && <span>{optimistic.likes}</span>}
    </button>
  );
}
