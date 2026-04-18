import { Suspense, ViewTransition } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getEventBySlug } from '@/data/queries/event';
import { getQuestionsByEvent } from '@/data/queries/question';
import type { SortValue } from '@/types';
import { OptimisticQuestions } from './_components/OptimisticQuestions';
import { QrCodeDialog } from './_components/QrCodeDialog';
import { QuestionCard } from './_components/QuestionCard';
import { QuestionSort } from './_components/QuestionSort';
import type { Metadata } from 'next';

export const unstable_prefetch = 'runtime';

export async function generateMetadata({ params }: PageProps<'/[slug]/questions'>): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    description: `Ask and vote on questions for ${event.name}`,
    title: `Questions · ${event.name} | Event Hub`,
  };
}

export default async function QuestionsPage({ params, searchParams }: PageProps<'/[slug]/questions'>) {
  return (
    <div>
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <QuestionFeedSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition enter="slide-up" default="none">
          <QuestionFeed params={params} searchParams={searchParams}>
            <Suspense fallback={<EventHeaderSkeleton />}>
              <EventHeader params={params} />
            </Suspense>
          </QuestionFeed>
        </ViewTransition>
      </Suspense>
    </div>
  );
}

async function QuestionFeed({
  params,
  searchParams,
  children,
}: Pick<PageProps<'/[slug]/questions'>, 'params' | 'searchParams'> & { children: React.ReactNode }) {
  const { slug } = await params;
  const { sort: sortParam } = await searchParams;
  const sort = (sortParam as SortValue) || 'top';
  const currentUser = await getCurrentUser();
  const questions = await getQuestionsByEvent(slug, currentUser);

  const sorted = [...questions].sort((a, b) => {
    if (sort === 'top') {
      return b.votes - a.votes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <OptimisticQuestions
      eventSlug={slug}
      currentUser={currentUser}
      questionCount={questions.length}
      header={children}
      sort={<QuestionSort />}
    >
      <div className="space-y-2">
        {sorted.map(question => {
          return (
            <ViewTransition key={question.id}>
              <QuestionCard question={question} />
            </ViewTransition>
          );
        })}
        {sorted.length === 0 && <EmptyState message="No questions yet. Be the first to ask!" />}
      </div>
    </OptimisticQuestions>
  );
}

async function EventHeader({ params }: Pick<PageProps<'/[slug]/questions'>, 'params'>) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return (
    <div className="flex items-center gap-3">
      {event.speaker && <Avatar name={event.speaker} variant="speaker" size="lg" />}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-sans text-base font-bold tracking-tight sm:text-lg">{event.name}</h1>
        {event.speaker && <p className="text-muted-foreground text-xs sm:text-sm">{event.speaker}</p>}
      </div>
      <QrCodeDialog eventName={event.name} />
    </div>
  );
}

function EventHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3.5 w-24" />
      </div>
    </div>
  );
}

function QuestionFeedSkeleton() {
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
