import { Clock, MapPin } from 'lucide-react';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { BackButton } from '@/components/common/BackButton';
import { Skeleton } from '@/components/ui/skeleton';
import { getEventBySlug, getEvents } from '@/data/queries/event';
import { getDayLabel, parseLabels } from '@/lib/utils';
import type { Metadata } from 'next';
import { SessionTabs } from './_components/SessionTabs';

// export async function generateStaticParams() {
//   const events = await getEvents();
//   return events.map(event => {
//     return { slug: event.slug };
//   });
// }

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: event.description,
    title: `${event.name} | Event Hub`,
  };
}

export default function SessionLayout({ children, params }: LayoutProps<'/[slug]'>) {

  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-forward': 'slide-from-right' }}
      exit={{ default: 'none', 'nav-back': 'slide-to-right' }}
      default="none"
    >
      <div className="min-h-screen pb-16">
        <header className="bg-background sticky top-0 z-30 border-b" style={{ viewTransitionName: 'header' }}>
          <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
            <BackButton href="/" size="sm">
              ← Sessions
            </BackButton>
          </div>
        </header>
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">
          <ViewTransition>
            <Suspense fallback={<EventDetailsSkeleton />}>
              <EventDetails params={params} />
            </Suspense>
          </ViewTransition>
          {children}
        </div>

        <Suspense>
          <SessionTabs />
        </Suspense>
      </div>
    </ViewTransition>
  );
}

async function EventDetails({ params }: Pick<LayoutProps<'/[slug]'>, 'params'>) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return (
    <article className="mb-6">
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
      <h1 className="font-sans text-lg font-bold tracking-tight sm:text-3xl">{event.name}</h1>
      {event.speaker && (
        <div className="mt-2 flex items-center gap-2 sm:mt-4 sm:gap-3">
          <Avatar name={event.speaker} variant="speaker" size="lg" />
          <span className="text-sm font-medium">{event.speaker}</span>
        </div>
      )}
    </article>
  );
}

function EventDetailsSkeleton() {
  return (
    <article className="mb-6">
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
      <Skeleton className="h-7 w-full sm:h-9" />
      <Skeleton className="mt-1 h-5 w-3/5 sm:h-7" />
      <div className="mt-2 flex items-center gap-2 sm:mt-4 sm:gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-5 w-36" />
      </div>
    </article>
  );
}
