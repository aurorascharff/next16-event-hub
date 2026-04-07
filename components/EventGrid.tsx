import { Clock, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { getCurrentUser } from '@/data/queries/auth';
import { getEvents, getUserFavorites } from '@/data/queries/event';
import { cn, getDayLabel, parseLabels } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

export async function EventGrid({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const sp = await searchParams;
  const label = typeof sp.label === 'string' ? sp.label : undefined;
  const isFavorites = label === 'favorites';
  const day = isFavorites ? undefined : typeof sp.day === 'string' ? sp.day : 'day-1';
  const currentUser = await getCurrentUser();
  const favoritesSlugs = currentUser ? await getUserFavorites(currentUser) : new Set<string>();
  let events = (await getEvents(day, isFavorites ? undefined : label)).map(event => {
    return {
      ...event,
      hasFavorited: favoritesSlugs.has(event.slug),
    };
  });
  if (isFavorites) {
    events = events.filter(e => {
      return e.hasFavorited;
    });
  }

  if (events.length === 0) {
    if (isFavorites) {
      return (
        <EmptyState
          icon={<Heart className="size-8" />}
          message="No favorites yet."
          hint="Tap the heart on any session to save it here."
        />
      );
    }
    return <EmptyState message="No sessions match your filters." hint="Try a different combination." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {events.map(event => {
        const labels = parseLabels(event.labels);
        return (
          <Link
            key={event.slug}
            href={`/${event.slug}`}
            className={cn('group block rounded-lg border p-4 transition-all', 'bg-card hover:border-primary/40')}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  {getDayLabel(event.day)}
                </span>
                <span className="text-border">·</span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="size-3" />
                  {event.time}
                </span>
              </div>
              <FavoriteButton eventSlug={event.slug} hasFavorited={event.hasFavorited} />
            </div>
            {labels.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {labels.map(label => {
                  return (
                    <span
                      key={label}
                      className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs capitalize"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}
            <h3 className="group-hover:text-primary text-sm leading-snug font-semibold transition-colors sm:text-[15px]">
              {event.name}
            </h3>
            {event.speaker && (
              <div className="mt-2 flex items-center gap-2">
                <Avatar name={event.speaker} variant="speaker" />
                <span className="text-muted-foreground text-xs font-medium">{event.speaker}</span>
              </div>
            )}
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">{event.description}</p>
            <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {event.location}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function EventGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => {
        return (
          <div key={i} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="size-5 rounded" />
            </div>
            <div className="mb-2 flex gap-1">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-18 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="mt-1 h-4 w-3/5" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-3.5 w-28" />
            </div>
            <Skeleton className="mt-2 h-3.5 w-full" />
            <Skeleton className="mt-1 h-3.5 w-3/5" />
            <div className="mt-3 flex items-center gap-1">
              <Skeleton className="size-3" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
