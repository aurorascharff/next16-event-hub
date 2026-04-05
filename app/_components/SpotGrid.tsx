import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { cn, getCategoryColor, getCategoryLabel } from '@/lib/utils';

type SpotCard = {
  slug: string;
  name: string;
  description: string;
  neighborhood: string;
  category: string;
  featured: boolean;
};

type Props = {
  spots: SpotCard[];
};

export function SpotGrid({ spots }: Props) {
  if (spots.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No spots match your filters.</p>
        <p className="text-muted-foreground mt-1 text-sm">Try a different combination.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {spots.map(spot => {
        return (
          <ViewTransition key={spot.slug} name={`spot-${spot.slug}`}>
            <Link
              href={`/${spot.slug}`}
              className={cn(
                'group relative flex overflow-hidden rounded-lg border transition-all',
                'bg-card hover:border-primary/40 hover:shadow-[0_0_20px_-4px] hover:shadow-primary/20',
                spot.featured && 'sm:col-span-2',
              )}
            >
              <div
                className={cn(
                  'w-1 shrink-0',
                  getCategoryStripeColor(spot.category),
                )}
              />
              <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium',
                        getCategoryColor(spot.category),
                      )}
                    >
                      {getCategoryLabel(spot.category)}
                    </span>
                    {spot.featured && (
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                    <MapPin className="size-2.5" />
                    {spot.neighborhood}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">
                    {spot.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </div>
            </Link>
          </ViewTransition>
        );
      })}
    </div>
  );
}

function getCategoryStripeColor(category: string): string {
  const colors: Record<string, string> = {
    art: 'bg-purple-500',
    bar: 'bg-amber-500',
    beach: 'bg-cyan-500',
    cafe: 'bg-orange-500',
    nightlife: 'bg-pink-500',
    restaurant: 'bg-emerald-500',
  };
  return colors[category] ?? 'bg-muted';
}
