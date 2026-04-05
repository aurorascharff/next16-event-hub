import { Clock, MapPin } from 'lucide-react';
import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { BackButton } from '@/components/BackButton';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getCommentsByEvent } from '@/data/queries/comment';
import { getEventBySlug, getEvents } from '@/data/queries/event';
import { getQuestionsByEvent } from '@/data/queries/question';
import { getAvatarUrl, getDayLabel } from '@/lib/utils';
import { ActiveUsers } from './_components/ActiveUsers';
import { SessionContent } from './_components/SessionContent';
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

export default async function SessionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  return (
    <div className="min-h-screen">
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
              <ActiveUsersLoader slug={slug} />
            </Suspense>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <ViewTransition name={`event-${slug}`}>
          <article className="mb-8">
            <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-medium uppercase tracking-wider">
                {getDayLabel(event.day)}
              </span>
              {event.track && (
                <>
                  <span className="text-border">·</span>
                  <span className="uppercase tracking-wider">{event.track}</span>
                </>
              )}
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

            <h1 className="font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {event.name}
            </h1>

            {event.speaker && (
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={getAvatarUrl(event.speaker, 'shapes')}
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
        </ViewTransition>

        <Suspense fallback={<FeedSkeleton />}>
          <SessionContentLoader slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}

async function ActiveUsersLoader({ slug }: { slug: string }) {
  const userName = await getCurrentUser();
  return <ActiveUsers eventSlug={slug} currentUser={userName} />;
}

async function SessionContentLoader({ slug }: { slug: string }) {
  const userName = await getCurrentUser();
  const commentsPromise = getCommentsByEvent(slug);
  const questionsPromise = getQuestionsByEvent(slug);

  return (
    <SessionContent
      commentsPromise={commentsPromise}
      questionsPromise={questionsPromise}
      eventSlug={slug}
      currentUser={userName}
    />
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex border-b">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="ml-2 h-8 w-24" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
