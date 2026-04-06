'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { ChipGroup } from '@/components/design/ChipGroup';
import { addQuestion } from '@/data/actions/question';
import type { Question, SortValue } from '@/types';
import { QuestionCard } from './QuestionCard';
import { QuestionForm } from './QuestionForm';

type Props = {
  initialQuestions: Question[];
  eventSlug: string;
  currentUser: string | null;
};

export function QuestionList({ initialQuestions, eventSlug }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortValue) || 'top';

  async function postAction(content: string) {
    const id = crypto.randomUUID();
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

  const sorted = [...initialQuestions].sort((a, b) => {
    if (sort === 'top') {
      return b.votes - a.votes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const sortOptions: { label: string; value: SortValue }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Newest', value: 'newest' },
  ];

  return (
    <div className="space-y-3">
      <QuestionForm postAction={postAction} />
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          {initialQuestions.length} question{initialQuestions.length !== 1 ? 's' : ''}
        </span>
        <ChipGroup items={sortOptions} value={sort} action={sortAction} variant="toggle" />
      </div>

      <div className="space-y-2">
        {sorted.map(question => {
          return <QuestionCard key={question.id} question={question} />;
        })}
        {sorted.length === 0 && <EmptyState message="No questions yet. Be the first to ask!" />}
      </div>
    </div>
  );
}
