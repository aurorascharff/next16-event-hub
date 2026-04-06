import { Clock, MapPin } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getEventBySlug, getUserFavorites } from '@/data/queries/event';
import { getDayLabel, parseLabels } from '@/lib/utils';

export async function EventDetails({ params }: Pick<PageProps<'/[slug]'>, 'params'>) {
  const { slug } = await params;
  const [event, currentUser] = await Promise.all([getEventBySlug(slug), getCurrentUser()]);
  const favorites = currentUser ? await getUserFavorites(currentUser) : new Set<string>();
  const hasFavorited = favorites.has(slug);
  return (
    <article>
      <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-2 text-xs sm:mb-4 sm:gap-3">
        <span className="font-medium tracking-wider uppercase">{getDayLabel(event.day)}</span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {event.time}
        </span>
        <span className="text-border">·</span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3" />
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
      <div className="flex items-start justify-between gap-2">
        <h1 className="font-sans text-lg font-bold tracking-tight sm:text-3xl">{event.name}</h1>
        <FavoriteButton eventSlug={slug} hasFavorited={hasFavorited} />
      </div>
      {event.speaker && (
        <div className="mt-2 flex items-center gap-2 sm:mt-4 sm:gap-3">
          <Avatar name={event.speaker} variant="speaker" size="lg" />
          <span className="text-sm font-medium">{event.speaker}</span>
        </div>
      )}
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
      <div className="space-y-1">
        <Skeleton className="h-5 w-full sm:h-7" />
        <Skeleton className="h-5 w-4/5 sm:h-7" />
      </div>
      <div className="mt-2 flex items-center gap-2 sm:mt-4 sm:gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
    </article>
  );
}
