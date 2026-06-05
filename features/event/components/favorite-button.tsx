'use client';

import { Heart } from 'lucide-react';
import { useOptimistic } from 'react';
import { toast } from 'sonner';
import { toggleFavorite } from '@/features/event/event-actions';
import { cn } from '@/lib/utils';

type Props = {
  eventSlug: string;
  favorited?: boolean;
};

export function FavoriteButton({ eventSlug, favorited }: Props) {
  const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(favorited, current => {
    return !current;
  });

  return (
    <form
      action={async () => {
        setOptimisticFavorited(null);
        try {
          await toggleFavorite(eventSlug);
        } catch {
          toast.error('Could not update favorite. Try again.');
        }
      }}
    >
      <button
        onClick={e => {
          e.stopPropagation();
        }}
        type="submit"
        className={cn(
          'cursor-pointer rounded p-1.5 transition-colors',
          optimisticFavorited ? 'text-primary' : 'text-muted-foreground hover:text-primary',
        )}
        aria-label={optimisticFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={cn('size-5', optimisticFavorited && 'fill-current')} />
      </button>
    </form>
  );
}
