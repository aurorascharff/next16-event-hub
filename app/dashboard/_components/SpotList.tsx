import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getSpots } from '@/data/queries/spot';
import { cn, formatDate, getCategoryColor, getCategoryLabel } from '@/lib/utils';
import { ArchiveButton } from './ArchiveButton';
import { FeatureButton } from './FeatureButton';

const filterSchema = z.enum(['all', 'published', 'drafts', 'featured', 'archived']).catch('all');
const sortSchema = z.enum(['newest', 'oldest', 'name']).catch('newest');

type Props = {
  searchParams: Promise<{ filter?: string; sort?: string }>;
};

export async function SpotList({ searchParams }: Props) {
  const { filter, sort } = await searchParams;
  const validFilter = filterSchema.parse(filter);
  const validSort = sortSchema.parse(sort);
  const spots = await getSpots(validFilter, validSort);

  if (spots.length === 0) {
    return (
      <Card className="py-16 text-center">
        <CardContent>
          <p className="text-muted-foreground text-lg">
            {validFilter === 'archived'
              ? 'No archived spots.'
              : validFilter === 'drafts'
                ? 'No drafts yet.'
                : validFilter === 'published'
                  ? 'No published spots yet.'
                  : validFilter === 'featured'
                    ? 'No featured spots yet.'
                    : 'No spots yet. Add your first spot!'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {spots.map(spot => {
        return (
          <Link key={spot.slug} href={`/dashboard/${spot.slug}`} className="block">
            <ViewTransition name={`spot-card-${spot.slug}`} share="morph">
              <Card className="hover:bg-muted/50 has-data-pending:bg-muted/70 transition-all duration-200 hover:shadow-md has-data-pending:animate-pulse">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{spot.name}</CardTitle>
                        {!spot.published && (
                          <span className="bg-amber-500/15 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
                            Draft
                          </span>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {spot.neighborhood}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md border px-1.5 py-0 text-xs font-medium',
                            getCategoryColor(spot.category),
                          )}
                        >
                          {getCategoryLabel(spot.category)}
                        </span>
                        <span>{formatDate(spot.createdAt)}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <FeatureButton slug={spot.slug} featured={spot.featured} />
                      <ArchiveButton slug={spot.slug} archived={spot.archived} />
                    </div>
                  </div>
                </CardHeader>
                {spot.description && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">{spot.description}</p>
                  </CardContent>
                )}
              </Card>
            </ViewTransition>
          </Link>
        );
      })}
    </div>
  );
}

export function SpotListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => {
        return (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="size-7 shrink-0 rounded-md" />
                  <Skeleton className="size-7 shrink-0 rounded-md" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-12 w-full sm:h-6" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
