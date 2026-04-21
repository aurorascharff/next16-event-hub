'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toggleFavorite } from '@/data/actions/favorite';
import { cn } from '@/lib/utils';

type Props = {
  eventSlug: string;
  favorited?: boolean;
};

export function FavoriteButton({ eventSlug }: Props) {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetch(`/api/favorites/${eventSlug}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        return setIsFavorited(data.hasFavorited);
      });
  }, [eventSlug]);

  return (
    <button
      onClick={async e => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorited(!isFavorited);
        await toggleFavorite(eventSlug);
      }}
      className={cn(
        'cursor-pointer rounded p-1.5 transition-colors',
        isFavorited ? 'text-primary' : 'text-muted-foreground hover:text-primary',
      )}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={cn('size-5', isFavorited && 'fill-current')} />
    </button>
  );
}
