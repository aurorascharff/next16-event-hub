'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, ViewTransition } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { ChipGroup } from '@/components/design/ChipGroup';
import { addQuestion } from '@/data/actions/question';
import { usePolling } from '@/lib/usePolling';
import type { Question, SortValue } from '@/types';
import { QuestionCard } from './QuestionCard';
import { QuestionForm } from './QuestionForm';

const sortOptions: { label: string; value: SortValue }[] = [
  { label: 'Top', value: 'top' },
  { label: 'Newest', value: 'newest' },
];

type Props = {
  initialQuestions: Question[];
  eventSlug: string;
  currentUser: string | null;
};

export function QuestionList({ initialQuestions, eventSlug, currentUser }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortValue) || 'top';

  usePolling(5000);

  const [optimisticQuestions, setOptimisticQuestions] = useOptimistic(
    initialQuestions,
    (current, newQuestion: Question) => {
      if (
        current.some(q => {
          return q.id === newQuestion.id;
        })
      ) {
        return current;
      }
      return [newQuestion, ...current];
    },
  );

  async function postAction(content: string) {
    const id = crypto.randomUUID();
    const tempQuestion: Question = {
      content,
      createdAt: new Date(),
      eventSlug,
      hasVoted: false,
      id,
      userName: currentUser ?? 'You',
      votes: 0,
    };

    setOptimisticQuestions(tempQuestion);
    const formData = new FormData();
    formData.set('content', content);
    formData.set('id', id);
    const result = await addQuestion(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  function sortAction(value: SortValue) {
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

  return (
    <div className="space-y-3">
      <div className="bg-background sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-10 space-y-3 pb-3">
        <QuestionForm postAction={postAction} />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live · {optimisticQuestions.length} question{optimisticQuestions.length !== 1 ? 's' : ''}
          </span>
          <ChipGroup items={sortOptions} value={sort} action={sortAction} variant="toggle" />
        </div>
      </div>
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
    </div>
  );
}
