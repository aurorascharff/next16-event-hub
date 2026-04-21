'use client';

import { Heart } from 'lucide-react';
import { toggleFavorite } from '@/data/actions/favorite';
import { cn } from '@/lib/utils';

type Props = {
  eventSlug: string;
  favorited?: boolean;
};

export function FavoriteButton({ eventSlug, favorited = false }: Props) {
  return (
    <button
      onClick={async e => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(eventSlug);
      }}
      className={cn(
        'cursor-pointer rounded p-1.5 transition-colors',
        favorited ? 'text-primary' : 'text-muted-foreground hover:text-primary',
      )}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={cn('size-5', favorited && 'fill-current')} />
    </button>
  );
}
