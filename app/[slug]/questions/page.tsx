import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getEventBySlug } from '@/data/queries/event';
import { getQuestionsByEvent } from '@/data/queries/question';
import type { SortValue } from '@/types';
import { QuestionCard } from './_components/QuestionCard';
import { QuestionForm } from './_components/QuestionForm';
import { QuestionSort } from './_components/QuestionSort';
import type { Metadata } from 'next';
// eslint-disable-next-line import/order, autofix/no-unused-vars
import { ViewTransition } from 'react';

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
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">
        <QuestionFeed params={params} searchParams={searchParams} />
      </div>
    </div>
  );
}

async function QuestionFeed({ params, searchParams }: Pick<PageProps<'/[slug]/questions'>, 'params' | 'searchParams'>) {
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
    <div className="space-y-3 pb-14">
      <EventHeader params={params} />
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live · {questions.length} question{questions.length !== 1 ? 's' : ''}
        </span>
        <QuestionSort />
      </div>
      <div className="space-y-2">
        <QuestionForm eventSlug={slug} currentUser={currentUser} />
        {sorted.map(question => {
          return <QuestionCard key={question.id} question={question} />;
        })}
        {sorted.length === 0 && <EmptyState message="No questions yet. Be the first to ask!" />}
      </div>
    </div>
  );
}

async function EventHeader({ params }: Pick<PageProps<'/[slug]/questions'>, 'params'>) {
  const { slug } = await params;
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

function QuestionFeedSkeleton() {
  return (
    <div className="space-y-3 pb-14">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => {
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
