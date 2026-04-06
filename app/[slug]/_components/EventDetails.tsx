import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/common/Avatar';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getAdjacentEvents, getEventBySlug, getUserFavorites } from '@/data/queries/event';
import { cn, getDayLabel, parseLabels } from '@/lib/utils';
import type { Route } from 'next';

export async function EventDetails({ params }: Pick<PageProps<'/[slug]'>, 'params'>) {
  const { slug } = await params;
  const [event, currentUser, { prev, next }] = await Promise.all([
    getEventBySlug(slug),
    getCurrentUser(),
    getAdjacentEvents(slug),
  ]);
  const favorites = currentUser ? await getUserFavorites(currentUser) : new Set<string>();
  const hasFavorited = favorites.has(slug);
  return (
    <article>
      <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-2 text-xs sm:mb-4 sm:gap-3">
        <span className="font-medium tracking-wider uppercase">{getDayLabel(event.day)}</span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          {event.time}
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5" />
          {event.location}
        </span>
      </div>
      {parseLabels(event.labels).length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1 sm:mb-4 sm:gap-1.5">
          {parseLabels(event.labels).map(label => {
            return (
              <span
                key={label}
                className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs capitalize sm:px-2.5"
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
      {(prev || next) && (
        <nav
          className={cn(
            'mb-4 grid gap-2 sm:mb-5 sm:gap-3',
            prev && next ? 'grid-cols-2' : 'grid-cols-1',
            next && !prev && 'justify-items-end'
          )}
          aria-label="Prev and next"
        >
          {prev ? (
            <Link
              href={`/${prev.slug}` as Route}
              transitionTypes={['nav-back']}
              className="border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground flex min-h-10 w-full items-center justify-start gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              aria-label={`Previous session: ${prev.name}`}
            >
              <ChevronLeft className="size-4 shrink-0" aria-hidden />
              Prev
            </Link>
          ) : null}
          {next ? (
            <Link
              href={`/${next.slug}` as Route}
              transitionTypes={['nav-forward']}
              className="border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground flex min-h-10 w-full items-center justify-end gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              aria-label={`Next session: ${next.name}`}
            >
              Next
              <ChevronRight className="size-4 shrink-0" aria-hidden />
            </Link>
          ) : null}
        </nav>
      )}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="line-clamp-2 min-h-[2lh] font-sans text-lg font-bold tracking-tight sm:text-3xl">
            {event.name}
          </h1>
          <FavoriteButton eventSlug={slug} hasFavorited={hasFavorited} />
        </div>
        {event.speaker && (
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar name={event.speaker} variant="speaker" size="lg" />
            <span className="text-sm font-medium">{event.speaker}</span>
          </div>
        )}
        <div className="max-h-20 overflow-y-auto sm:max-h-24">
          <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">{event.description}</p>
        </div>
      </div>
    </article>
  );
}

export function EventDetailsSkeleton() {
  return (
    <article>
      <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-3">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mb-2 flex flex-wrap gap-1 sm:mb-4 sm:gap-1.5">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-5 sm:gap-3">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-8 w-4/5 sm:h-10" />
          <Skeleton className="size-9 shrink-0 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </article>
  );
}
