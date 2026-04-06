import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { getCurrentUser } from '@/data/queries/auth';
import { getEvents, getUserFavorites } from '@/data/queries/event';
import { cn, getDayLabel, parseLabels } from '@/lib/utils';

export async function EventGrid({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const sp = await searchParams;
  const label = typeof sp.label === 'string' ? sp.label : undefined;
  const isFavorites = label === 'favorites';
  const day = isFavorites ? undefined : typeof sp.day === 'string' ? sp.day : 'day-1';
  const currentUser = await getCurrentUser();
  const favoritesSlugs = currentUser ? await getUserFavorites(currentUser) : new Set<string>();
  let events = (await getEvents(day, isFavorites ? undefined : label)).map(event => ({
    ...event,
    hasFavorited: favoritesSlugs.has(event.slug),
  }));
  if (isFavorites) {
    events = events.filter(e => e.hasFavorited);
  }

  if (events.length === 0) {
    return <EmptyState message="No sessions match your filters." hint="Try a different combination." />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {events.map(event => {
        return (
          <ViewTransition key={event.slug}>
            <Link
              href={`/${event.slug}`}
              transitionTypes={['nav-forward']}
              className={cn('group block rounded-lg border p-4 transition-all', 'bg-card hover:border-primary/40')}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    {getDayLabel(event.day)}
                  </span>
                  <span className="text-border">·</span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="size-2.5" />
                    {event.time}
                  </span>
                </div>
                <FavoriteButton eventSlug={event.slug} hasFavorited={event.hasFavorited} />
              </div>
              {parseLabels(event.labels).length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {parseLabels(event.labels).map(label => {
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
                  <span className="text-muted-foreground text-xs">{event.speaker}</span>
                </div>
              )}
              <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">{event.description}</p>
              <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="size-2.5" />
                  {event.location}
                </span>
              </div>
            </Link>
          </ViewTransition>
        );
      })}
    </div>
  );
}
