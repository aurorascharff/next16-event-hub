import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getEvents } from '@/data/queries/event';
import { DayFilter } from './_components/DayFilter';
import { EventGrid } from './_components/EventGrid';
import { TrackFilter } from './_components/TrackFilter';

type Props = {
  searchParams: Promise<{ day?: string; track?: string }>;
};

export default function HomePage({ searchParams }: Props) {
  return (
    <div className="min-h-screen">
      <header
        className="bg-background/80 sticky top-0 z-30 border-b backdrop-blur-md"
        style={{ viewTransitionName: 'header' }}
      >
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h1 className="font-sans text-base font-bold tracking-tight sm:text-lg">
              Event Hub
            </h1>
            <span className="text-primary text-xs font-medium">
              React Miami 2026
            </span>
          </div>
          <Suspense fallback={<FiltersSkeleton />}>
            <div className="flex flex-col gap-2">
              <DayFilter />
              <TrackFilter />
            </div>
          </Suspense>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Suspense fallback={<EventGridSkeleton />}>
          <EventGridLoader searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function EventGridLoader({ searchParams }: { searchParams: Promise<{ day?: string; track?: string }> }) {
  const { day, track } = await searchParams;
  return <EventGrid eventsPromise={getEvents(day, track)} />;
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => {
          return <Skeleton key={i} className="h-7 w-16 rounded-full" />;
        })}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => {
          return <Skeleton key={i} className="h-7 w-20 rounded-full" />;
        })}
      </div>
    </div>
  );
}

function EventGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => {
        return (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="mb-2 h-4 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-3/5" />
          </div>
        );
      })}
    </div>
  );
}
