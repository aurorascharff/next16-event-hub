'use client';

import { ChevronUp } from 'lucide-react';
import { useOptimistic } from 'react';
import { upvoteQuestion } from '@/data/actions/question';
import { cn } from '@/lib/utils';

type Props = {
  questionId: string;
  eventSlug: string;
  votes: number;
  hasVoted: boolean;
};

export function UpvoteButton({ questionId, eventSlug, votes, hasVoted }: Props) {
  const [optimisticVotes, setOptimisticVotes] = useOptimistic(votes);
  const [optimisticHasVoted, setOptimisticHasVoted] = useOptimistic(hasVoted);

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        await upvoteQuestion(questionId, eventSlug);
      }}
    >
      <button
        type="submit"
        disabled={optimisticHasVoted}
        className={cn(
          'flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-xs font-bold transition-all',
          hasVoted ? 'text-primary' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer',
        )}
        aria-label={`Upvote (${optimisticVotes})`}
      >
        <ChevronUp className={cn('size-5', optimisticHasVoted && 'fill-current')} />
        <span>{optimisticVotes}</span>
      </button>
    </form>
  );
}
