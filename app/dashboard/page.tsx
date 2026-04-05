import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { SlideLeftTransition } from '@/components/ui/animations';
import { buttonVariants } from '@/components/ui/button';
import { SortButton, SortButtonSkeleton } from './_components/SortButton';
import { SpotList, SpotListSkeleton } from './_components/SpotList';
import { SpotTabs, SpotTabsSkeleton } from './_components/SpotTabs';

export default function DashboardPage({ searchParams }: PageProps<'/dashboard'>) {
  return (
    <SlideLeftTransition>
      <div className="bg-muted/20 min-h-screen dark:bg-transparent">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Dashboard</h1>
              <p className="text-muted-foreground mt-2 text-lg">Manage your Miami spots</p>
            </div>
            <HeaderLinks />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <Suspense fallback={<SpotTabsSkeleton />}>
              <SpotTabs />
            </Suspense>
            <Suspense fallback={<SortButtonSkeleton />}>
              <SortButton />
            </Suspense>
          </div>
          <ErrorBoundary label="Failed to load spots" fullWidth>
            <Suspense
              fallback={
                <ViewTransition exit="slide-down">
                  <SpotListSkeleton />
                </ViewTransition>
              }
            >
              <ViewTransition enter="slide-up" exit="slide-down">
                <SpotList searchParams={searchParams} />
              </ViewTransition>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </SlideLeftTransition>
  );
}

function HeaderLinks() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link href="/" className={buttonVariants({ size: 'sm', variant: 'outline' }) + ' sm:size-auto sm:px-4 sm:py-2'}>
        View Guide
      </Link>
      <Link href="/dashboard/new" className={buttonVariants({ size: 'sm' }) + ' sm:size-auto sm:px-4 sm:py-2'}>
        <Plus className="size-4 sm:hidden" />
        <span className="hidden sm:inline">Add Spot</span>
      </Link>
    </div>
  );
}
