import { Github, Presentation } from 'lucide-react';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { EventGrid } from '@/components/EventGrid';
import { LabelFilter } from '@/components/LabelFilter';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { BottomNavSkeleton } from '@/components/design/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { HomeTabs } from './_components/HomeTabs';

export const metadata: Metadata = {
  title: 'Event Hub',
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-back': 'slide-from-left' }}
      exit={{ default: 'none', 'nav-forward': 'slide-to-left' }}
      default="none"
    >
      <div className="min-h-screen pb-16">
        <header className="bg-background sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)]">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <h1 className="font-sans text-base font-bold tracking-tight sm:text-lg">Event Hub</h1>
              <div className="flex items-center gap-2">
                <Link
                  href="/slides/2"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Presentation className="size-4" />
                </Link>
                <Link
                  href="https://github.com/aurorascharff/next16-event-hub"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="size-4" />
                </Link>
                <ThemeToggle />
              </div>
            </div>
            <Suspense fallback={<FiltersSkeleton />}>
              <LabelFilter />
            </Suspense>
          </div>
        </header>

        <Suspense fallback={<BottomNavSkeleton count={3} />}>
          <HomeTabs>
            <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
              <Suspense
                fallback={
                  <ViewTransition exit="slide-down">
                    <EventGridSkeleton />
                  </ViewTransition>
                }
              >
                <ViewTransition enter="slide-up" update={{ 'tab-switch': 'auto', default: 'none' }} default="none">
                  <EventGrid searchParams={searchParams} />
                </ViewTransition>
              </Suspense>
            </div>
          </HomeTabs>
        </Suspense>
      </div>
    </ViewTransition>
  );
}


function FiltersSkeleton() {
  return (
    <div className="flex gap-1.5 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => {
        return <Skeleton key={i} className="h-7 w-18 shrink-0 rounded-full" />;
      })}
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
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="size-5 rounded" />
            </div>
            <div className="mb-2 flex gap-1">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-18 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="mt-1 h-4 w-3/5" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="mt-2 h-3.5 w-full" />
            <Skeleton className="mt-1 h-3.5 w-3/5" />
            <div className="mt-3 flex items-center gap-1">
              <Skeleton className="size-3" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
