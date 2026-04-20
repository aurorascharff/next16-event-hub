import { Suspense } from 'react';
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
    <>
      {children}
      <Suspense>
        <SessionTabs />
      </Suspense>
    </>
  );
}
