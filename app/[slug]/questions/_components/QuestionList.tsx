'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useEffect, useDeferredValue, useOptimistic, ViewTransition } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { ChipGroup } from '@/components/design/ChipGroup';
import { addQuestion } from '@/data/actions/question';
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

type Props = {
  initialQuestions: Question[];
  eventSlug: string;
  currentUser: string | null;
};

export function QuestionList({ initialQuestions, eventSlug, currentUser }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortValue) || 'top';

  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        router.refresh();
      });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [router]);

  const [optimisticQuestions, addOptimisticQuestion] = useOptimistic(
    initialQuestions,
    (current, newQuestion: Question) => {
      if (current.some(q => {return q.id === newQuestion.id})) {
        return current;
      }
      return [newQuestion, ...current];
    },
  );

  async function handleAddQuestion(content: string) {
    const id = crypto.randomUUID();
    const tempQuestion: Question = {
      content,
      createdAt: new Date().toISOString(),
      eventSlug,
      hasVoted: false,
      id,
      userName: currentUser ?? 'You',
      votes: 0,
    };

    addOptimisticQuestion(tempQuestion);
    const formData = new FormData();
    formData.set('content', content);
    formData.set('id', id);
    const result = await addQuestion(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  function handleSortChange(value: SortValue) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'top') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '?');
  }

  const sorted = [...optimisticQuestions].sort((a, b) => {
    if (sort === 'top') {
      return b.votes - a.votes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const sortedQuestions = useDeferredValue(sorted);

  const sortOptions: { label: string; value: SortValue }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Newest', value: 'newest' },
  ];

  return (
    <div className="space-y-3">
      <QuestionForm onSubmit={handleAddQuestion} />

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="bg-emerald-500 inline-block size-1.5 animate-pulse rounded-full" />
          Live · {optimisticQuestions.length} question{optimisticQuestions.length !== 1 ? 's' : ''}
        </span>
        <ChipGroup
          items={sortOptions}
          value={sort}
          onChange={handleSortChange}
          variant="toggle"
        />
      </div>

      <div className="space-y-2">
        {sortedQuestions.map(question => {
          return (
            <ViewTransition
              key={question.id}
              enter="slide-up"
            >
              <QuestionCard question={question} />
            </ViewTransition>
          );
        })}
        {sortedQuestions.length === 0 && (
          <EmptyState message="No questions yet. Be the first to ask!" />
        )}
      </div>
    </div>
  );
}
