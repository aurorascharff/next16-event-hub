import { Suspense, ViewTransition } from 'react';
import { getEventBySlug, getEvents } from '@/data/queries/event';
import type { Metadata } from 'next';
import { SessionTabs } from './_components/SessionTabs';

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(event => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: event.description,
    title: `${event.name} | Event Hub`,
  };
}

export default function SessionLayout({ children }: LayoutProps<'/[slug]'>) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-forward': 'slide-from-right' }}
      exit={{ default: 'none', 'nav-back': 'slide-to-right' }}
      default="none"
    >
      <div className="min-h-screen pb-16">
        <Suspense>
          <SessionTabs>
            <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">{children}</div>
          </SessionTabs>
        </Suspense>
      </div>
    </ViewTransition>
  );
}
