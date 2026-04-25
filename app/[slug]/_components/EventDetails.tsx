import { Clock, MapPin } from 'lucide-react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Avatar } from '@/components/common/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getEventBySlug, getUserFavorites } from '@/data/queries/event';
import { getDayLabel, parseLabels } from '@/lib/utils';
import type { ReactNode } from 'react';

export async function EventDetails({ slug, children }: { slug: string; children?: ReactNode }) {
  const event = await getEventBySlug(slug);
  return (
    <article className="space-y-4 sm:space-y-5">
      <div>
        <SessionMetaStrip dayLabel={getDayLabel(event.day)} location={event.location} time={event.time} />
        <SessionLabelChips labels={parseLabels(event.labels)} />
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h1 className="line-clamp-2 min-h-[2lh] font-sans text-xl font-bold tracking-tight sm:text-3xl">
            {event.name}
          </h1>
          {children}
        </div>
        {event.speaker && (
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Avatar name={event.speaker} variant="speaker" size="lg" />
            <span className="text-foreground/80 text-sm font-medium sm:text-base">{event.speaker}</span>
          </div>
        )}
        <div className="h-40 overflow-y-auto sm:h-44">
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-[15px]">{event.description}</p>
        </div>
      </div>
    </article>
  );
}

export async function FavoriteStatus({ slug }: { slug: string }) {
  const currentUser = await getCurrentUser();
  const favorites = currentUser ? await getUserFavorites(currentUser) : new Set<string>();
  return <FavoriteButton eventSlug={slug} favorited={favorites.has(slug)} />;
}

export function EventDetailsSkeleton() {
  return (
    <article className="space-y-4 sm:space-y-5">
      <div>
        <SessionMetaStripSkeleton />
        <SessionLabelChipsSkeleton />
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-14 w-4/5 rounded-md sm:h-19" />
          <Skeleton className="size-6 shrink-0 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="h-40 overflow-hidden sm:h-44">
          <div className="space-y-2 sm:space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </article>
  );
}

type SessionMetaStripProps = {
  dayLabel: string;
  location: string;
  time: string;
};

function SessionMetaStrip({ dayLabel, time, location }: SessionMetaStripProps) {
  return (
    <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
      <span className="font-semibold tracking-wide uppercase">{dayLabel}</span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden />
        <span className="tabular-nums">{time}</span>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        <span>{location}</span>
      </span>
    </div>
  );
}

type SessionLabelChipsProps = {
  labels: string[];
};

function SessionLabelChips({ labels }: SessionLabelChipsProps) {
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {labels.map(label => {
        return (
          <span
            key={label}
            className="border-border/60 bg-secondary/80 text-secondary-foreground rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize sm:text-sm"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

function SessionMetaStripSkeleton() {
  return (
    <div className="mb-2 flex items-center gap-3">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function SessionLabelChipsSkeleton() {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      <Skeleton className="h-6 w-16 rounded-md" />
      <Skeleton className="h-6 w-24 rounded-md" />
    </div>
  );
}
