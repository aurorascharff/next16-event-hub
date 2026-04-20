import { Suspense, ViewTransition } from 'react';
import { getEventBySlug } from '@/data/queries/event';
import SessionTabs from './_components/SessionTabs';
import type { Metadata } from 'next';

export const prefetch = 'runtime';

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
      update={{ default: 'none', 'tab-switch': 'auto' }}
      default="none"
    >
      <div className="min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">{children}</div>
        <Suspense>
          <SessionTabs />
        </Suspense>
      </div>
    </ViewTransition>
  );
}
