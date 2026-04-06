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
  const [optimisticLike, setOptimisticLike] = useOptimistic({ hasLiked, likes }, current => {
    return {
      hasLiked: !current.hasLiked,
      likes: current.likes + (current.hasLiked ? -1 : 1),
    };
  });
  const [, startTransition] = useTransition();

  function handleLike() {
    startTransition(async () => {
      setOptimisticLike(null);
      await toggleLike(commentId, eventSlug);
    });
  }

  return (
    <button
      onClick={handleLike}
      className={cn(
        'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors',
        optimisticLike.hasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary',
      )}
      aria-label={`Like (${optimisticLike.likes})`}
    >
      <Heart className={cn('size-3.5', optimisticLike.hasLiked && 'fill-current')} />
      {optimisticLike.likes > 0 && <span>{optimisticLike.likes}</span>}
    </button>
  );
}
