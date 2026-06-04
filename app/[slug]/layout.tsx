import { getEventBySlug, getEvents } from '@/features/event/event-queries';
import SessionTabs from '@/features/event/components/session-tabs';
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
      <SessionTabs />
    </>
  );
}
