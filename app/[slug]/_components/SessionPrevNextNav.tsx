import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

export type AdjacentSessionRef = {
  name: string;
  slug: string;
};

type SessionPrevNextNavProps = {
  next: AdjacentSessionRef | null;
  /** When set, passed to `<Link transitionTypes>` (e.g. `['nav-forward']` for the full demo). */
  nextTransitionTypes?: string[];
  prev: AdjacentSessionRef | null;
  /** When set, passed to `<Link transitionTypes>` (e.g. `['nav-back']` for the full demo). */
  prevTransitionTypes?: string[];
};

const navLinkClass =
  'border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors sm:min-h-10 sm:px-3 sm:py-2';

export function SessionPrevNextNav({ next, nextTransitionTypes, prev, prevTransitionTypes }: SessionPrevNextNavProps) {
  if (!prev && !next) return null;
  return (
    <nav
      className={cn(
        'mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3',
        prev && next && 'justify-between',
        prev && !next && 'justify-start',
        !prev && next && 'justify-end',
      )}
      aria-label="Prev and next"
    >
      {prev ? (
        <Link
          href={`/${prev.slug}` as Route}
          className={navLinkClass}
          {...(prevTransitionTypes ? { transitionTypes: prevTransitionTypes } : {})}
          aria-label={`Previous session: ${prev.name}`}
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          Prev
        </Link>
      ) : null}
      {next ? (
        <Link
          href={`/${next.slug}` as Route}
          className={navLinkClass}
          {...(nextTransitionTypes ? { transitionTypes: nextTransitionTypes } : {})}
          aria-label={`Next session: ${next.name}`}
        >
          Next
          <ChevronRight className="size-4 shrink-0" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}

export function SessionPrevNextNavSkeleton() {
  return (
    <div className="mb-4 flex justify-between gap-2 sm:mb-5 sm:gap-3">
      <Skeleton className="h-9 w-20 rounded-lg sm:h-10" />
      <Skeleton className="h-9 w-20 rounded-lg sm:h-10" />
    </div>
  );
}
