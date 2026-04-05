'use client';

import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { use, ViewTransition } from 'react';
import { cn, getAvatarUrl, getDayLabel } from '@/lib/utils';

type EventCard = {
  slug: string;
  name: string;
  description: string;
  day: string;
  track: string | null;
  time: string;
  speaker: string | null;
  location: string;
};

type Props = {
  eventsPromise: Promise<EventCard[]>;
};

export function EventGrid({ eventsPromise }: Props) {
  const events = use(eventsPromise);

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
          <ViewTransition key={event.slug} name={`event-${event.slug}`}>
            <Link
              href={`/${event.slug}`}
              className={cn(
                'group block rounded-lg border p-4 transition-all',
                'bg-card hover:border-primary/40',
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                    {getDayLabel(event.day)}
                  </span>
                  {event.track && (
                    <>
                      <span className="text-border">·</span>
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                        {event.track}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-muted-foreground flex items-center gap-1 text-[10px]">
                  <Clock className="size-2.5" />
                  {event.time}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold leading-snug transition-colors group-hover:text-primary">
                {event.name}
              </h3>
              {event.speaker && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={getAvatarUrl(event.speaker, 'shapes')}
                    alt=""
                    className="size-5 rounded-full"
                  />
                  <span className="text-muted-foreground text-xs">{event.speaker}</span>
                </div>
              )}
              <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed">
                {event.description}
              </p>
              <div className="text-muted-foreground mt-3 flex items-center gap-3 text-[10px]">
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
