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
      <div className="py-20 text-center">
        <p className="text-muted-foreground text-lg">No spots match your filters.</p>
        <p className="text-muted-foreground mt-1 text-sm">Try a different combination.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {spots.map(spot => {
        return (
          <ViewTransition key={spot.slug} name={`spot-${spot.slug}`}>
            <Link
              href={`/${spot.slug}`}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-lg',
                'bg-card hover:border-foreground/20',
                spot.featured && 'sm:col-span-2 sm:flex-row',
              )}
            >
              <div
                className={cn(
                  'h-1.5 w-full shrink-0',
                  getCategoryStripeColor(spot.category),
                  spot.featured && 'sm:h-auto sm:w-1.5',
                )}
              />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium',
                        getCategoryColor(spot.category),
                      )}
                    >
                      {getCategoryLabel(spot.category)}
                    </span>
                    {spot.featured && (
                      <Star className="size-3.5 fill-amber-500 text-amber-500" />
                    )}
                  </div>
                  <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                    <MapPin className="size-3" />
                    {spot.neighborhood}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold leading-tight group-hover:underline">
                    {spot.name}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
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
