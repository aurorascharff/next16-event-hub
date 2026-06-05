import { Suspense, ViewTransition } from 'react';
import { NavBack } from '@/components/animations';
import { PageContainer, PageShell } from '@/components/page-shell';
import { SiteHeader } from '@/components/site-header';
import { EventGrid, EventGridSkeleton } from '@/features/event/components/event-grid';
import HomeTabs from '@/features/event/components/home-tabs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
  title: 'Event Hub',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <NavBack>
      <PageShell className="group">
        <SiteHeader />
        <PageContainer size="wide" className="transition-opacity group-has-data-pending:opacity-50">
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
        </PageContainer>
        <Suspense>
          <HomeTabs />
        </Suspense>
      </PageShell>
    </NavBack>
  );
}
