import { Suspense } from 'react';
import { getEventBySlug } from '@/data/queries/event';
import type { Metadata } from 'next';
import { SessionTabs } from './_components/SessionTabs';

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
    <div className="min-h-screen pb-16">
      <Suspense>
        <SessionTabs>
          <div className="mx-auto max-w-2xl px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-6 sm:pb-8 sm:pt-[calc(env(safe-area-inset-top)+2rem)]">
            {children}
          </div>
        </SessionTabs>
      </Suspense>
    </div>
  );
}
