import { Presentation } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { LabelFilter, LabelFilterSkeleton } from '@/components/LabelFilter';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { UserMenu } from '@/components/common/UserMenu';
import { GithubIcon } from '@/components/ui/icons/GithubIcon';

export function SiteHeader() {
  return (
    <header
      className="bg-background sticky top-[env(safe-area-inset-top)] z-30 border-b"
      style={{ viewTransitionName: 'site-header' }}
    >
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="font-sans text-lg font-bold tracking-tight sm:text-xl">Event Hub</h1>
            <HeaderLinks />
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
  );
}

function HeaderLinks() {
  return (
    <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
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
  );
}
