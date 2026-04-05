'use client';

import { use, useMemo, useOptimistic, useTransition, ViewTransition } from 'react';
import useSWR from 'swr';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { QuestionCard } from './QuestionCard';
import { QuestionForm } from './QuestionForm';

type Question = {
  id: string;
  content: string;
  userName: string;
  votes: number;
  eventSlug: string;
  createdAt: Date | string;
};

type SortValue = 'top' | 'newest';

const fetcher = (url: string) => {return fetch(url).then(res => {return res.json()})};

type Props = {
  questionsPromise: Promise<Question[]>;
  eventSlug: string;
};

export function QuestionFeed({ questionsPromise, eventSlug }: Props) {
  const initialQuestions = use(questionsPromise);

  const { data: questions } = useSWR<Question[]>(
    `/api/events/${eventSlug}/questions`,
    fetcher,
    { fallbackData: initialQuestions, refreshInterval: 3000 },
  );

  const [optimisticSort, setOptimisticSort] = useOptimistic<SortValue>('top');
  const [isSortPending, startSortTransition] = useTransition();

  function handleSortChange(value: SortValue) {
    startSortTransition(() => {
      setOptimisticSort(value);
    });
  }

  const sortedQuestions = useMemo(() => {
    const sorted = [...(questions ?? [])];
    if (optimisticSort === 'top') {
      sorted.sort((a, b) => {
        return b.votes - a.votes;
      });
    } else {
      sorted.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    return sorted;
  }, [questions, optimisticSort]);

  const sorts: { label: string; value: SortValue }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Newest', value: 'newest' },
  ];

  return (
    <div className="space-y-3">
      <QuestionForm eventSlug={eventSlug} />

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {(questions ?? []).length} question{(questions ?? []).length !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <div className="bg-muted flex rounded-full p-0.5">
            {sorts.map(sort => {
              return (
                <button
                  key={sort.value}
                  onClick={() => {
                    handleSortChange(sort.value);
                  }}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-all',
                    optimisticSort === sort.value
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {sort.label}
                </button>
              );
            })}
          </div>
          {isSortPending && <Spinner className="size-3" />}
        </div>
      </div>

      <div className="space-y-2">
        {sortedQuestions.map(question => {
          return (
            <ViewTransition key={question.id} name={`question-${question.id}`} enter="slide-up">
              <QuestionCard question={question} />
            </ViewTransition>
          );
        })}
        {sortedQuestions.length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-xs">
            No questions yet. Be the first to ask!
          </p>
        )}
      </div>
    </div>
  );
}
