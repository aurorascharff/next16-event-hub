'use client';

import { Star } from 'lucide-react';
import { useOptimistic } from 'react';
import { toast } from 'sonner';
import { toggleFeatureSpot } from '@/data/actions/spot';
import { cn } from '@/lib/utils';

type Props = {
  slug: string;
  featured: boolean | null;
};

export function FeatureButton({ slug, featured }: Props) {
  const [optimisticFeatured, setOptimisticFeatured] = useOptimistic(featured ?? false);
  const isPending = optimisticFeatured !== (featured ?? false);

  return (
    <form
      data-pending={isPending || undefined}
      action={async () => {
        const newValue = !optimisticFeatured;
        setOptimisticFeatured(newValue);
        const result = await toggleFeatureSpot(slug, newValue);
        if (!result.success) {
          toast.error(result.error);
        }
      }}
      onClick={e => {
        return e.stopPropagation();
      }}
    >
      <button
        type="submit"
        aria-label={optimisticFeatured ? 'Remove from featured' : 'Add to featured'}
        className={cn(
          'group rounded-md p-1.5 transition-colors disabled:opacity-50',
          optimisticFeatured ? 'bg-amber-500/15' : 'hover:bg-muted',
        )}
      >
        <Star
          strokeWidth={optimisticFeatured ? 2.5 : 1.5}
          className={cn(
            'size-4 transition-colors',
            optimisticFeatured
              ? 'fill-amber-500 text-amber-500'
              : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
      </button>
    </form>
  );
}
