import { Suspense, ViewTransition } from 'react';
import { EventGrid, EventGridSkeleton } from '@/components/EventGrid';
import HomeTabs from '@/components/HomeTabs';
import { NavBack } from '@/components/animations';
import { SiteHeader } from '@/components/common/SiteHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
  title: 'Event Hub',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <NavBack>
      <div className="group min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-4 py-6 transition-opacity group-has-data-pending:opacity-50 sm:px-6">
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
        <Suspense>
          <HomeTabs />
        </Suspense>
      </div>
    </NavBack>
  );
}
