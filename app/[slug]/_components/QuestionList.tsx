'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useTransition, ViewTransition } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';
import { ChipGroup } from '@/components/design/ChipGroup';
import { EmptyState } from '@/components/common/EmptyState';
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

  const { data: questions, mutate } = useSWR<Question[]>(
    `/api/events/${eventSlug}/questions`,
    fetcher,
    { fallbackData: initialQuestions, refreshInterval: 3000 },
  );

  const [pendingItems, setPendingItems] = useState<Question[]>([]);
  const [isPending, startTransition] = useTransition();

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
    if (sort === 'top') {
      sorted.sort((a, b) => {
        return b.votes - a.votes;
      });
    } else {
      sorted.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    return sorted;
  }, [allQuestions, sort]);

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
            <ViewTransition key={question.id} enter="slide-up">
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
