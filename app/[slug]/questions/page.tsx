import { Suspense, ViewTransition } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getEventBySlug } from '@/data/queries/event';
import { getQuestionsByEvent } from '@/data/queries/question';
import type { Metadata } from 'next';
import { QrCodeDialog } from './_components/QrCodeDialog';
import { QuestionList } from './_components/QuestionList';

export async function generateMetadata({ params }: PageProps<'/[slug]/questions'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: `Ask and vote on questions for ${event.name}`,
    title: `Questions · ${event.name} | Event Hub`,
  };
}

export default function QuestionsPage({ params }: PageProps<'/[slug]/questions'>) {
  return (
    <>
      <ViewTransition>
        <Suspense fallback={<HeaderSkeleton />}>
          <EventHeader params={params} />
        </Suspense>
      </ViewTransition>
      <div className="mt-3">
        <Suspense
          fallback={
            <ViewTransition exit="slide-down">
              <FeedSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition enter="slide-up" default="none">
            <QuestionFeed params={params} />
          </ViewTransition>
        </Suspense>
      </div>
    </>
  );
}

async function EventHeader({ params }: Pick<PageProps<'/[slug]/questions'>, 'params'>) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return (
    <div className="flex items-center gap-3">
      {event.speaker && <Avatar name={event.speaker} variant="speaker" size="lg" />}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-sans text-sm font-bold tracking-tight sm:text-base">{event.name}</h1>
        {event.speaker && <p className="text-muted-foreground text-xs">{event.speaker}</p>}
      </div>
      <QrCodeDialog eventName={event.name} />
    </div>
  );
}

async function QuestionFeed({ params }: Pick<PageProps<'/[slug]/questions'>, 'params'>) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();
  const questions = await getQuestionsByEvent(slug, currentUser);
  return <QuestionList initialQuestions={questions} eventSlug={slug} currentUser={currentUser} />;
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-14 rounded-md" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => {
          return (
            <div key={i} className="flex items-start gap-2 rounded-lg border p-3">
              <Skeleton className="h-10 w-8 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
