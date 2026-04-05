import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getSpots } from '@/data/queries/spot';
import { CategoryFilter } from './_components/CategoryFilter';
import { NeighborhoodFilter } from './_components/NeighborhoodFilter';
import { SpotGrid } from './_components/SpotGrid';

type Props = {
  searchParams: Promise<{ category?: string; neighborhood?: string }>;
};

export default function HomePage({ searchParams }: Props) {
  return (
    <div className="min-h-screen">
      <header
        className="bg-background/90 sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ viewTransitionName: 'header' }}
      >
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <div className="mb-2 flex items-baseline justify-between">
            <h1 className="text-primary text-lg font-bold tracking-tight sm:text-xl">
              Miami Spots
            </h1>
            <span className="text-muted-foreground hidden text-xs sm:block">
              A curated guide
            </span>
          </div>
          <Suspense fallback={<FiltersSkeleton />}>
            <div className="flex flex-col gap-2">
              <CategoryFilter />
              <NeighborhoodFilter />
            </div>
          </Suspense>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <Suspense fallback={<SpotGridSkeleton />}>
          <SpotGridLoader searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function SpotGridLoader({ searchParams }: { searchParams: Promise<{ category?: string; neighborhood?: string }> }) {
  const { category, neighborhood } = await searchParams;
  const spots = await getSpots(category, neighborhood);
  return <SpotGrid spots={spots} />;
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => {
          return <Skeleton key={i} className="h-7 w-16 rounded-full" />;
        })}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => {
          return <Skeleton key={i} className="h-7 w-20 rounded-full" />;
        })}
      </div>
    </div>
  );
}

function SpotGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => {
        return (
          <div key={i} className="bg-card overflow-hidden rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mb-2 h-5 w-3/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-4/5" />
          </div>
        );
      })}
    </div>
  );
}
