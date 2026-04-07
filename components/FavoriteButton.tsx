'use client';

import { Heart } from 'lucide-react';
import { useOptimistic } from 'react';
import { toggleFavorite } from '@/data/actions/favorite';
import { cn } from '@/lib/utils';

type Props = {
  eventSlug: string;
  hasFavorited: boolean;
};

export function FavoriteButton({ eventSlug, hasFavorited }: Props) {
  const [optimisticHasFavorited, setOptimisticHasFavorited] = useOptimistic(hasFavorited, current => {
    return !current;
  });

  return (
    <form
      style={{ viewTransitionName: 'none' }}
      action={async () => {
        setOptimisticHasFavorited(null);
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
          optimisticHasFavorited ? 'text-primary' : 'text-muted-foreground hover:text-primary',
        )}
        aria-label={optimisticHasFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={cn('size-4', optimisticHasFavorited && 'fill-current')} />
      </button>
    </form>
  );
}
