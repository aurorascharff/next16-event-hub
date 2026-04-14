'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { EmptyState } from '@/components/common/EmptyState';
import { ChipGroup } from '@/components/design/ChipGroup';
import { addQuestion } from '@/data/actions/question';
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

  async function postAction(content: string) {
    const formData = new FormData();
    formData.set('content', content);
    const result = await addQuestion(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  function sortChange(value: SortValue) {
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

  return (
    <div className="space-y-3">
      <QuestionForm postAction={postAction} />
      <div className="flex items-center justify-between">
        <QuestionCount count={initialQuestions.length} />
        <ChipGroup items={sortOptions} value={sort} action={sortChange} variant="toggle" />
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

function QuestionCount({ count }: { count: number }) {
  return (
    <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
      {count} question{count !== 1 ? 's' : ''}
    </span>
  );
}
