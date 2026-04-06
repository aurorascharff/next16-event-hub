import { Calendar } from 'lucide-react';
import { Suspense, ViewTransition } from 'react';
import { EventGrid } from '@/components/EventGrid';
import { LabelFilter } from '@/components/LabelFilter';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { BottomNav } from '@/components/design/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';

const dayTabs = [
  { href: '/?day=day-1' as '/', icon: <Calendar className="size-4" />, label: 'Day 1' },
  { href: '/?day=day-2' as '/', icon: <Calendar className="size-4" />, label: 'Day 2' },
];

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-back': 'slide-from-left' }}
      exit={{ default: 'none', 'nav-forward': 'slide-to-left' }}
      default="none"
    >
      <div className="min-h-screen pb-16">
        <header className="bg-background sticky top-0 z-30 border-b" style={{ viewTransitionName: 'header' }}>
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <h1 className="font-sans text-base font-bold tracking-tight sm:text-lg">Event Hub</h1>
              <ThemeToggle />
            </div>
            <Suspense fallback={<FiltersSkeleton />}>
              <LabelFilter />
            </Suspense>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <Suspense
            fallback={
              <ViewTransition exit="slide-down">
                <EventGridSkeleton />
              </ViewTransition>
            }
          >
            <ViewTransition enter="slide-up" default="none">
              <EventGrid searchParams={searchParams} />
            </ViewTransition>
          </Suspense>
        </div>

        <Suspense fallback={<BottomNavSkeleton />}>
          <DayNav searchParams={searchParams} />
        </Suspense>
      </div>
    </ViewTransition>
  );
}

async function DayNav({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const sp = await searchParams;
  const day = typeof sp.day === 'string' ? sp.day : 'day-1';
  return <BottomNav tabs={dayTabs} activeIndex={day === 'day-2' ? 1 : 0} />;
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => {
        return <Skeleton key={i} className="h-7 w-16 rounded-full" />;
      })}
    </div>
  );
}

function BottomNavSkeleton() {
  return (
    <nav
      className="bg-background fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)]"
      style={{ viewTransitionName: 'bottom-nav' }}
    >
      <div className="mx-auto flex max-w-4xl">
        <div className="flex flex-1 flex-col items-center gap-0.5 py-2.5">
          <div className="size-4" />
          <span className="text-xs opacity-0">Day 1</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-0.5 py-2.5">
          <div className="size-4" />
          <span className="text-xs opacity-0">Day 2</span>
        </div>
      </div>
    </nav>
  );
}

function EventGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => {
        return (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-14" />
              </div>
              <Skeleton className="size-5 rounded" />
            </div>
            <div className="mb-2 flex gap-1">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-4 w-4/5" />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-3/5" />
            <div className="mt-3 flex items-center gap-1">
              <Skeleton className="h-2.5 w-2.5" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
