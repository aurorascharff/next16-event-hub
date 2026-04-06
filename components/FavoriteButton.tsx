'use client';

import { Star } from 'lucide-react';
import { useOptimistic } from 'react';
import { toggleFavorite } from '@/data/actions/favorite';
import { cn } from '@/lib/utils';

type Props = {
  eventSlug: string;
  hasFavorited: boolean;
};

export function FavoriteButton({ eventSlug, hasFavorited }: Props) {
  const [optimisticHasFavorited, toggleOptimistic] = useOptimistic(hasFavorited, current => {
    return !current;
  });

  return (
    <form
      action={async () => {
        toggleOptimistic(null);
        await toggleFavorite(eventSlug);
      }}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <button
        type="submit"
        className={cn(
          'cursor-pointer rounded p-1 transition-colors',
          optimisticHasFavorited ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500',
        )}
        aria-label={optimisticHasFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star className={cn('size-4', optimisticHasFavorited && 'fill-current')} />
      </button>
    </form>
  );
}
