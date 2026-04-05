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
    (_state, newFavorited: boolean) => {return {
      count: _state.count + (newFavorited ? 1 : -1),
      favorited: newFavorited,
    }},
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
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
        'data-[pending]:animate-pulse',
        optimistic.favorited
          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400'
          : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground',
      )}
    >
      <Heart
        className={cn(
          'size-4 transition-all',
          optimistic.favorited && 'fill-current',
        )}
      />
      <span>{optimistic.count}</span>
    </button>
  );
}
