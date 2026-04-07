'use client';

import { Heart } from 'lucide-react';
import { toggleLike } from '@/data/actions/comment';
import { cn } from '@/lib/utils';

type Props = {
  commentId: string;
  eventSlug: string;
  likes: number;
  hasLiked: boolean;
};

export function LikeButton({ commentId, eventSlug, likes, hasLiked }: Props) {
  return (
    <form onSubmit={async e => { e.preventDefault(); await toggleLike(commentId, eventSlug); }}>
      <button
        type="submit"
        className={cn(
          'flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors',
          hasLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary',
        )}
        aria-label={`Like (${likes})`}
      >
        <Heart className={cn('size-3.5', hasLiked && 'fill-current')} />
        {likes > 0 && <span>{likes}</span>}
      </button>
    </form>
  );
}
