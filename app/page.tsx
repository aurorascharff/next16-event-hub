import { SiteHeader } from '@/components/site-header';
import { EventGrid } from '@/features/event/components/event-grid';
import HomeTabs from '@/features/event/components/home-tabs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
  title: 'Event Hub',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <div className="group min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-6 transition-opacity group-has-data-pending:opacity-50 sm:px-6">
        <EventGrid searchParams={searchParams} />
      </div>
      <HomeTabs />
    </div>
  );
}
