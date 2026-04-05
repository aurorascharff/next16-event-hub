import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { getEvents } from '@/data/queries/event';
import { cn, getAvatarUrl, getDayLabel, parseLabels } from '@/lib/utils';

type Props = {
  searchParams: Promise<{ day?: string; label?: string }>;
};

export async function EventGrid({ searchParams }: Props) {
  const { day = 'day-1', label } = await searchParams;
  const events = await getEvents(day, label);

  if (events.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No sessions match your filters.</p>
        <p className="text-muted-foreground mt-1 text-xs">Try a different combination.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {events.map(event => {
        return (
          <ViewTransition key={event.slug}>
            <Link
              href={`/${event.slug}`}
              transitionTypes={['nav-forward']}
              className={cn(
                'group block rounded-lg border p-4 transition-all',
                'bg-card hover:border-primary/40',
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                    {getDayLabel(event.day)}
                  </span>
                  <span className="text-border">·</span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Clock className="size-2.5" />
                    {event.time}
                  </span>
                </div>
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
              <h3 className="text-sm font-semibold leading-snug transition-colors group-hover:text-primary sm:text-[15px]">
                {event.name}
              </h3>
              {event.speaker && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={getAvatarUrl(event.speaker, 'speaker')}
                    alt=""
                    className="size-5 rounded-full"
                  />
                  <span className="text-muted-foreground text-xs">{event.speaker}</span>
                </div>
              )}
              <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
                {event.description}
              </p>
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
