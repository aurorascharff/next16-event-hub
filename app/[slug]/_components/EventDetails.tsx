import { Clock, MapPin } from 'lucide-react';
import { ViewTransition } from 'react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Avatar } from '@/components/common/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getAdjacentEvents, getEventBySlug, getUserFavorites } from '@/data/queries/event';
import { cn, getDayLabel, parseLabels } from '@/lib/utils';
import { SessionPrevNextNav, SessionPrevNextNavSkeleton } from './SessionPrevNextNav';

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
    <ViewTransition name={`event-${slug}`} share="auto" default="none">
      <article>
        <SessionMetaStrip dayLabel={getDayLabel(event.day)} location={event.location} time={event.time} />
        <SessionLabelChips labels={parseLabels(event.labels)} />
        <SessionPrevNextNav
          next={next ? { name: next.name, slug: next.slug } : null}
          nextTransitionTypes={['nav-forward']}
          prev={prev ? { name: prev.name, slug: prev.slug } : null}
          prevTransitionTypes={['nav-back']}
        />
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
          <div className="h-20 overflow-y-auto sm:h-24">
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">{event.description}</p>
          </div>
        </div>
      </article>
    </ViewTransition>
  );
}

export function EventDetailsSkeleton({ slug }: { slug?: string }) {
  const skeleton = (
    <article>
      <MetaStripSkeleton />
      <LabelChipsSkeleton />
      <SessionPrevNextNavSkeleton />
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-14 w-4/5 rounded-md sm:h-18" />
          <Skeleton className="size-6 shrink-0 rounded-md" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="max-h-20 overflow-hidden sm:max-h-24">
          <div className="space-y-1.5 sm:space-y-2.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </div>
      </div>
    </article>
  );
  if (slug) {
    return (
      <ViewTransition name={`event-${slug}`} share="auto" default="none">
        {skeleton}
      </ViewTransition>
    );
  }
  return skeleton;
}

type SessionMetaStripProps = {
  dayLabel: string;
  location: string;
  time: string;
};

function SessionMetaStrip({ dayLabel, time, location }: SessionMetaStripProps) {
  return (
    <div className="mb-2 w-fit max-w-full sm:mb-3">
      <p
        className={cn(
          'text-foreground/92 border-border/70 inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-md border',
          'bg-muted/60 px-2 py-1 text-[11px] leading-snug shadow-sm sm:gap-x-2 sm:px-2.5 sm:py-1.5 sm:text-xs',
        )}
      >
        <span className="text-muted-foreground shrink-0 font-semibold tracking-wide uppercase">{dayLabel}</span>
        <span className="text-muted-foreground/50 select-none" aria-hidden>
          ·
        </span>
        <span className="inline-flex shrink-0 items-center gap-1">
          <Clock className="text-foreground/75 size-3 sm:size-3.5" aria-hidden />
          <span className="tabular-nums">{time}</span>
        </span>
        <span className="text-muted-foreground/50 select-none" aria-hidden>
          ·
        </span>
        <span className="inline-flex min-w-0 items-center gap-1">
          <MapPin className="text-foreground/75 size-3 shrink-0 sm:size-3.5" aria-hidden />
          <span className="min-w-0 break-words">{location}</span>
        </span>
      </p>
    </div>
  );
}

type SessionLabelChipsProps = {
  labels: string[];
};

function SessionLabelChips({ labels }: SessionLabelChipsProps) {
  if (labels.length === 0) return null;
  return (
    <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2">
      {labels.map(label => {
        return (
          <span
            key={label}
            className="border-border/60 bg-secondary/80 text-secondary-foreground rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize sm:text-xs"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

function MetaStripSkeleton() {
  return (
    <div className="mb-2 w-fit max-w-full sm:mb-3">
      <Skeleton className="h-7 w-[min(100%,18rem)] rounded-md sm:h-8" />
    </div>
  );
}

function LabelChipsSkeleton() {
  return (
    <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2">
      <Skeleton className="h-6 w-16 rounded-md" />
      <Skeleton className="h-6 w-24 rounded-md" />
    </div>
  );
}
