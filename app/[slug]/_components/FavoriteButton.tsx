'use client';

import { Heart } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { toggleFavorite } from '@/data/actions/favorite';
import { cn } from '@/lib/utils';

type Props = {
  spotSlug: string;
  isFavorited: boolean;
  favoriteCount: number;
};

export function FavoriteButton({ spotSlug, isFavorited, favoriteCount }: Props) {
  const [optimistic, setOptimistic] = useOptimistic(
    { count: favoriteCount, favorited: isFavorited },
    (_state, newFavorited: boolean) => {
      return {
        count: _state.count + (newFavorited ? 1 : -1),
        favorited: newFavorited,
      };
    },
  );
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      setOptimistic(!optimistic.favorited);
      await toggleFavorite(spotSlug, optimistic.favorited);
    });
  }

  return (
    <button
      onClick={handleToggle}
      data-pending={isPending || undefined}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
        'data-[pending]:animate-pulse',
        optimistic.favorited
          ? 'bg-primary/15 text-primary border-primary/30 border'
          : 'bg-muted text-muted-foreground hover:text-foreground',
      )}
    >
      <Heart
        className={cn(
          'size-3.5 transition-all',
          optimistic.favorited && 'fill-current',
        )}
      />
      <span>{optimistic.count}</span>
    </button>
  );
}
