import { Presentation } from 'lucide-react';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { EventGrid, EventGridSkeleton } from '@/components/EventGrid';
import { LabelFilter, LabelFilterSkeleton } from '@/components/LabelFilter';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { BottomNavSkeleton } from '@/components/design/BottomNav';
import { GithubIcon } from '@/components/ui/icons/GithubIcon';
import { HomeTabs } from './_components/HomeTabs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
  title: 'Event Hub',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <div className="min-h-screen pb-16">
      <header className="bg-background sticky top-[env(safe-area-inset-top)] z-30 border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="font-sans text-base font-bold tracking-tight sm:text-lg">Event Hub</h1>
            <div className="flex items-center gap-2">
              <Link href="/slides/2" className="text-muted-foreground hover:text-foreground transition-colors">
                <Presentation className="size-4" />
              </Link>
              <Link
                href="https://github.com/aurorascharff/next16-event-hub"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="size-4" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <Suspense fallback={<LabelFilterSkeleton />}>
            <LabelFilter />
          </Suspense>
        </div>
      </header>

      <Suspense fallback={<BottomNavSkeleton count={3} />}>
        <HomeTabs>
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
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
          </div>
        </HomeTabs>
      </Suspense>
    </div>
  );
}
