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
      <header className="bg-background/80 sticky top-0 z-30 border-b backdrop-blur-sm" style={{ viewTransitionName: 'header' }}>
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h1 className="text-xl font-bold tracking-tight">Miami Spots</h1>
              <p className="text-muted-foreground text-sm">A curated guide to the city</p>
            </div>
            <Suspense fallback={<FiltersSkeleton />}>
              <CategoryFilter />
              <NeighborhoodFilter />
            </Suspense>
          </div>
        </div>
      </header>
      <div className="container mx-auto max-w-5xl px-4 py-6">
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
    <>
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
    </>
  );
}

function SpotGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => {
        return (
          <div key={i} className="flex flex-col overflow-hidden rounded-xl border">
            <Skeleton className="h-1.5 w-full rounded-none" />
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-1 h-4 w-3/4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
