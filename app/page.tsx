import { Github, Presentation } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { EventGrid } from '@/components/EventGrid';
import { LabelFilter } from '@/components/LabelFilter';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import type { Metadata } from 'next';
import { HomeTabs } from './_components/HomeTabs';

export const metadata: Metadata = {
  title: 'Event Hub',
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <div className="min-h-screen pb-16">
      <header className="bg-background sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)]">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="font-sans text-base font-bold tracking-tight sm:text-lg">Event Hub</h1>
            <div className="flex items-center gap-2">
              <Link
                href="/slides/2"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Presentation className="size-4" />
              </Link>
              <Link
                href="https://github.com/aurorascharff/next16-event-hub"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="size-4" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <Suspense>
            <LabelFilter />
          </Suspense>
        </div>
      </header>

      <Suspense>
        <HomeTabs>
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
            <EventGrid searchParams={searchParams} />
          </div>
        </HomeTabs>
      </Suspense>
    </div>
  );
}
