'use client';

import { Star } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { toggleFavorite } from '@/data/actions/favorite';
import { cn } from '@/lib/utils';

type Props = {
  eventSlug: string;
  hasFavorited: boolean;
};

export function FavoriteButton({ eventSlug, hasFavorited }: Props) {
  const [optimisticHasFavorited, toggleOptimistic] = useOptimistic(
    hasFavorited,
    (current) => {return !current},
  );
  const [isPending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      toggleOptimistic(null);
      await toggleFavorite(eventSlug);
    });
  }

  return (
    <button
      onClick={handleClick}
      data-pending={isPending || undefined}
      className={cn(
        'rounded p-1 transition-colors',
        optimisticHasFavorited
          ? 'text-yellow-500'
          : 'text-muted-foreground hover:text-yellow-500',
        'data-[pending]:animate-pulse',
      )}
      aria-label={optimisticHasFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={cn('size-4', optimisticHasFavorited && 'fill-current')} />
    </button>
  );
}
