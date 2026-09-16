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
  const [removing, setRemoving] = useOptimistic(false);

  return (
    <form
      action={async () => {
        const willRemove = optimisticFavorited;
        setOptimisticFavorited(null);
        if (willRemove) setRemoving(true);
        const result = await toggleFavorite(eventSlug);
        if (result.error) toast.error(result.error);
      }}
    >
      <button
        onClick={e => {
          e.stopPropagation();
        }}
        type="submit"
        data-removing={removing || undefined}
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
