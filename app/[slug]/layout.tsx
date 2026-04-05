import { Clock, HelpCircle, MapPin, MessageCircle } from 'lucide-react';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { BackButton } from '@/components/BackButton';
import { BottomNav } from '@/components/design/BottomNav';
import { getEventBySlug, getEvents } from '@/data/queries/event';
import { getAvatarUrl, getDayLabel, parseLabels } from '@/lib/utils';
import { ActiveUsers } from './_components/ActiveUsers';
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

export default async function SessionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  return (
    <ViewTransition
      enter={{ default: 'none', 'nav-forward': 'slide-from-right' }}
      exit={{ default: 'none', 'nav-back': 'slide-to-right' }}
      default="none"
    >
      <div className="min-h-screen pb-16">
        <header
          className="bg-background/80 sticky top-0 z-30 border-b backdrop-blur-md"
          style={{ viewTransitionName: 'header' }}
        >
          <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <BackButton href="/" size="sm">
                ← Sessions
              </BackButton>
              <Suspense>
                <ActiveUsers eventSlug={slug} />
              </Suspense>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <article className="mb-8">
            <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-medium uppercase tracking-wider">
                {getDayLabel(event.day)}
              </span>
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
              <div className="mb-4 flex flex-wrap gap-1.5">
                {parseLabels(event.labels).map(label => {
                  return (
                    <span
                      key={label}
                      className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs capitalize"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>
            )}

            <h1 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {event.name}
            </h1>

            {event.speaker && (
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={getAvatarUrl(event.speaker, 'speaker')}
                  alt=""
                  className="size-8 rounded-full"
                />
                <span className="text-sm font-medium">{event.speaker}</span>
              </div>
            )}

            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              {event.description}
            </p>
          </article>

          {children}
        </div>

        <Suspense>
          <BottomNav
            tabs={[
              { href: `/${slug}/comments`, icon: <MessageCircle className="size-4" />, label: 'Comments' },
              { href: `/${slug}/questions`, icon: <HelpCircle className="size-4" />, label: 'Questions' },
            ]}
          />
        </Suspense>
      </div>
    </ViewTransition>
  );
}
