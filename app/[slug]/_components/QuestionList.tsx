'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useOptimistic, useState, useTransition, ViewTransition } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { addQuestion } from '@/data/actions/question';
import { cn } from '@/lib/utils';
import { QuestionCard } from './QuestionCard';
import { QuestionForm } from './QuestionForm';

type Question = {
  id: string;
  content: string;
  userName: string;
  votes: number;
  hasVoted: boolean;
  eventSlug: string;
  createdAt: Date | string;
};

type SortValue = 'top' | 'newest';

const fetcher = (url: string) => {return fetch(url).then(res => {return res.json()})};

type Props = {
  initialQuestions: Question[];
  eventSlug: string;
  currentUser: string | null;
};

export function QuestionList({ initialQuestions, eventSlug, currentUser }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortValue) || 'top';
  const [optimisticSort, setOptimisticSort] = useOptimistic(sort);

  const { data: questions, mutate } = useSWR<Question[]>(
    `/api/events/${eventSlug}/questions`,
    fetcher,
    { fallbackData: initialQuestions, refreshInterval: 3000 },
  );

  const [pendingItems, setPendingItems] = useState<Question[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSortChange(value: SortValue) {
    startTransition(() => {
      setOptimisticSort(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'top') {
        params.delete('sort');
      } else {
        params.set('sort', value);
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : '?');
    });
  }

  function handleAddQuestion(content: string) {
    const tempId = `temp-${Date.now()}`;
    const tempQuestion: Question = {
      content,
      createdAt: new Date().toISOString(),
      eventSlug,
      hasVoted: false,
      id: tempId,
      userName: currentUser ?? 'You',
      votes: 0,
    };

    startTransition(async () => {
      setPendingItems(prev => { return [tempQuestion, ...prev]; });
      const formData = new FormData();
      formData.set('content', content);
      const result = await addQuestion(eventSlug, formData);
      if (!result.success) {
        toast.error(result.error);
        setPendingItems(prev => { return prev.filter(q => { return q.id !== tempId; }); });
        return;
      }
      await mutate();
      setPendingItems(prev => { return prev.filter(q => { return q.id !== tempId; }); });
    });
  }

  const allQuestions = useMemo(() => {
    return [...pendingItems, ...(questions ?? [])];
  }, [pendingItems, questions]);

  const sortedQuestions = useMemo(() => {
    const sorted = [...allQuestions];
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
  }, [allQuestions, optimisticSort]);

  const sortOptions: { label: string; value: SortValue }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Newest', value: 'newest' },
  ];

  return (
    <div className="space-y-3">
      <QuestionForm onSubmit={handleAddQuestion} isPending={isPending} />

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {allQuestions.length} question{allQuestions.length !== 1 ? 's' : ''}
        </span>
        <div className="bg-muted flex rounded-full p-0.5">
          {sortOptions.map(option => {
            return (
              <button
                key={option.value}
                onClick={() => {
                  handleSortChange(option.value);
                }}
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium transition-all',
                  optimisticSort === option.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {sortedQuestions.map(question => {
          return (
            <ViewTransition key={question.id} enter="slide-up">
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
