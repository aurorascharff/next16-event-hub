import { Clock, HelpCircle, MapPin, MessageCircle } from 'lucide-react';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { BackButton } from '@/components/common/BackButton';
import { BottomNav } from '@/components/design/BottomNav';
import { Skeleton } from '@/components/ui/skeleton';
import { getEventBySlug, getEvents } from '@/data/queries/event';
import { getDayLabel, parseLabels } from '@/lib/utils';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map(event => {
    return { slug: event.slug };
  });
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: event.description,
    title: `${event.name} | Event Hub`,
  };
}

export default async function SessionLayout({ children, params }: LayoutProps<'/[slug]'>) {
  const { slug } = await params;

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
          <Suspense fallback={<EventDetailsSkeleton />}>
            <EventDetails slug={slug} />
          </Suspense>
          {children}
        </div>

        <BottomNav
          tabs={[
            { href: `/${slug}/comments`, icon: <MessageCircle className="size-4" />, label: 'Comments' },
            { href: `/${slug}/questions`, icon: <HelpCircle className="size-4" />, label: 'Questions' },
          ]}
        />
      </div>
    </ViewTransition>
  );
}

async function EventDetails({ slug }: { slug: string }) {
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
      <p className="text-muted-foreground mt-2 line-clamp-2 text-xs leading-relaxed sm:mt-4 sm:line-clamp-none sm:text-sm">
        {event.description}
      </p>
    </article>
  );
}

function EventDetailsSkeleton() {
  return (
    <article className="mb-6">
      <div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-4 sm:gap-3">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="mb-2 h-6 w-4/5 sm:mb-4 sm:h-8" />
      <div className="flex items-center gap-2 sm:gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="mt-2 h-3 w-full sm:mt-4" />
      <Skeleton className="mt-1 h-3 w-3/4 sm:mt-2" />
    </article>
  );
}
