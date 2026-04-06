'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toggleFavorite } from '@/data/actions/favorite';
import { cn } from '@/lib/utils';

type Props = {
  eventSlug: string;
  hasFavorited: boolean;
};

export function FavoriteButton({ eventSlug, hasFavorited }: Props) {
  const [isFavorited, setIsFavorited] = useState(hasFavorited);

  useEffect(() => {
    setIsFavorited(hasFavorited);
  }, [hasFavorited]);

  return (
    <button
      type="button"
      onClick={async e => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
        await toggleFavorite(eventSlug);
      }}
      className={cn(
        'cursor-pointer rounded p-1 transition-colors',
        isFavorited ? 'text-primary' : 'text-muted-foreground hover:text-primary',
      )}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={cn('size-4', isFavorited && 'fill-current')} />
    </button>
  );
}
