import { Suspense } from 'react';
import { EventGrid, EventGridSkeleton } from '@/components/EventGrid';
import HomeTabs from '@/components/HomeTabs';
import { SiteHeader } from '@/components/common/SiteHeader';
import type { Metadata } from 'next';
// eslint-disable-next-line import/order
import { ViewTransition } from 'react';

export const metadata: Metadata = {
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
  title: 'Event Hub',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
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
          <ViewTransition enter="slide-up">
            <EventGrid searchParams={searchParams} />
          </ViewTransition>
        </Suspense>
      </div>
      <Suspense>
        <HomeTabs />
      </Suspense>
    </div>
  );
}
