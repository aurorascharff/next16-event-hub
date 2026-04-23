import { Suspense } from 'react';
import { getEventBySlug, getEvents } from '@/data/queries/event';
import SessionTabs from './_components/SessionTabs';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: event.description,
    title: `${event.name} | Event Hub`,
  };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(event => {
    return { slug: event.slug };
  });
}

export default function SessionLayout({ children }: LayoutProps<'/[slug]'>) {
  return (
    <>
      {children}
      <Suspense>
        <SessionTabs />
      </Suspense>
    </>
  );
}
