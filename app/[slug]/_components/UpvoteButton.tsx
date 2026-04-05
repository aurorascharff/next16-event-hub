'use client';

import { ChevronUp } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { upvoteQuestion } from '@/data/actions/question';
import { cn } from '@/lib/utils';

type Props = {
  questionId: string;
  eventSlug: string;
  votes: number;
};

export function UpvoteButton({ questionId, eventSlug, votes }: Props) {
  const [optimisticVotes, setOptimisticVotes] = useOptimistic(votes, (current) => {
    return current + 1;
  });
  const [isPending, startTransition] = useTransition();

  function handleUpvote() {
    startTransition(async () => {
      setOptimisticVotes(1);
      await upvoteQuestion(questionId, eventSlug);
    });
  }

  return (
    <button
      onClick={handleUpvote}
      data-pending={isPending || undefined}
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-[10px] font-bold transition-all',
        'text-muted-foreground hover:bg-primary/10 hover:text-primary',
        'data-[pending]:text-primary data-[pending]:animate-pulse',
      )}
      aria-label={`Upvote (${optimisticVotes})`}
    >
      <ChevronUp className="size-4" />
      <span>{optimisticVotes}</span>
    </button>
  );
}
