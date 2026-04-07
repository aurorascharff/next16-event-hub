import { Presentation } from 'lucide-react';
import Link from 'next/link';
import { Suspense, ViewTransition } from 'react';
import { EventGrid, EventGridSkeleton } from '@/components/EventGrid';
import { LabelFilter, LabelFilterSkeleton } from '@/components/LabelFilter';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserMenu } from '@/components/common/UserMenu';
import { GithubIcon } from '@/components/ui/icons/GithubIcon';
import { HomeTabs } from './_components/HomeTabs';
import type { Metadata } from 'next';

export const unstable_instant = {
  prefetch: 'runtime',
  samples: [
    {
      cookies: [{ name: 'event-hub-user', value: 'testuser' }],
      searchParams: { day: 'day-1', label: null },
    },
    {
      cookies: [{ name: 'event-hub-user', value: null }],
      searchParams: { day: 'day-1', label: null },
    },
  ],
};

export const metadata: Metadata = {
  description: 'Browse sessions, post comments, ask questions, and favorite sessions at the conference.',
  title: 'Event Hub',
};

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-back': 'slide-from-left' }}
      exit={{ default: 'none', 'nav-forward': 'slide-to-left' }}
      default="none"
    >
      <div className="group min-h-screen pb-16">
        <header className="bg-background sticky top-[env(safe-area-inset-top)] z-30 border-b">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="font-sans text-base font-bold tracking-tight sm:text-lg">Event Hub</h1>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href="/slides/2"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Open slides"
                  >
                    <Presentation className="size-4" />
                  </Link>
                  <Link
                    href="https://github.com/aurorascharff/next16-event-hub"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="View source on GitHub"
                  >
                    <GithubIcon className="size-4" />
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Suspense>
                  <UserMenu />
                </Suspense>
                <ThemeToggle />
              </div>
            </div>
            <Suspense fallback={<LabelFilterSkeleton />}>
              <LabelFilter />
            </Suspense>
          </div>
        </header>
        <HomeTabs>
          <div className="mx-auto max-w-4xl px-4 py-6 transition-opacity group-has-data-pending:opacity-50 sm:px-6">
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
      </div>
    </ViewTransition>
  );
}
