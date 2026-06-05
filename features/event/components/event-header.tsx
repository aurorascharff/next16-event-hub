import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getEventBySlug } from '@/features/event/event-queries';

export async function EventHeader({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);
  return (
    <div className="flex items-center gap-3">
      {event.speaker && <Avatar name={event.speaker} variant="speaker" size="lg" />}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-sans text-lg font-bold tracking-tight sm:text-xl">{event.name}</h1>
        {event.speaker && <p className="text-muted-foreground text-xs sm:text-sm">{event.speaker}</p>}
      </div>
    </div>
  );
}

export function EventHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
