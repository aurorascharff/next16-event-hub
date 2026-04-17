import { Clock, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
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

  const returnParams = new URLSearchParams();
  if (day) returnParams.set('day', day);
  if (label && !isFavorites) returnParams.set('label', label);
  const returnQuery = returnParams.toString();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {events.map(event => {
        const labels = parseLabels(event.labels);
        return (
          <ViewTransition key={event.slug} update={{ default: 'none', filter: 'auto' }} default="none">
            <Link
              href={`/${event.slug}${returnQuery ? `?${returnQuery}` : ''}`}
              transitionTypes={['nav-forward']}
              className={cn('group block rounded-lg border p-4 transition-all', 'bg-card hover:border-primary/40')}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm">
                  <span className="font-semibold tracking-wide uppercase">{getDayLabel(event.day)}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {event.time}
                  </span>
                </div>
                <FavoriteButton eventSlug={event.slug} favorited={event.hasFavorited} />
              </div>
              {labels.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
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
              <h3 className="text-primary font-sans text-base leading-snug font-semibold sm:text-lg">{event.name}</h3>
              {event.speaker && (
                <div className="mt-2 flex items-center gap-2">
                  <Avatar name={event.speaker} variant="speaker" />
                  <span className="text-muted-foreground text-sm font-medium">{event.speaker}</span>
                </div>
              )}
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">{event.description}</p>
              <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs sm:text-sm">
                <MapPin className="size-3.5" />
                <span>{event.location}</span>
              </div>
            </Link>
          </ViewTransition>
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
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-18" />
              </div>
              <Skeleton className="size-5 rounded" />
            </div>
            <div className="mb-2 flex gap-1.5">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-18 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="mt-1.5 h-5 w-3/5" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-3/5" />
            <div className="mt-3 flex items-center gap-1.5">
              <Skeleton className="size-3.5" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
