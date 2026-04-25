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
  const [optimisticVotes, addUpvote] = useOptimistic(
    {
      hasVoted,
      votes,
    },
    (prev, increment: number) => {
      if (prev.hasVoted) {
        return prev;
      }

      return { hasVoted: true, votes: prev.votes + increment };
    },
  );

  return (
    <form
      action={async () => {
        addUpvote(1);
        await upvoteQuestion(questionId, eventSlug);
      }}
    >
      <button
        type="submit"
        disabled={optimisticVotes.hasVoted}
        className={cn(
          'flex flex-col items-center gap-0.5 rounded-md px-2 py-1 text-xs font-bold transition-all',
          optimisticVotes.hasVoted
            ? 'text-primary'
            : 'text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer',
        )}
        aria-label={`Upvote (${optimisticVotes.votes})`}
      >
        <ChevronUp className={cn('size-5', optimisticVotes.hasVoted && 'fill-current')} />
        <span>{optimisticVotes.votes}</span>
      </button>
    </form>
  );
}
