'use client';

import { useSearchParams } from 'next/navigation';
import { ViewTransition } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { UpvoteButton } from '@/features/question/components/upvote-button';
import { cn, timeAgo } from '@/lib/utils';
import type { Question, SortValue } from '@/types/question';

export function QuestionList({ questions }: { questions: Question[] }) {
  const searchParams = useSearchParams();
  const sort = (searchParams.get('sort') as SortValue) || 'top';
  const sorted = sortQuestions(questions, sort);

  return (
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
  );
}

export function QuestionCard({ question, pending }: { question: Question; pending?: boolean }) {
  return (
    <div className={cn('flex items-start gap-2 rounded-lg border p-3', pending && 'opacity-60')}>
      <UpvoteButton
        questionId={question.id}
        eventSlug={question.eventSlug}
        votes={question.votes}
        hasVoted={question.hasVoted}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-relaxed break-words">{question.content}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Avatar name={question.userName} size="xs" />
          <span className="text-muted-foreground text-xs">{question.userName}</span>
          <span className="text-muted-foreground text-xs">·</span>
          {pending ? (
            <span className="text-muted-foreground animate-pulse text-xs">Sending...</span>
          ) : (
            <span className="text-muted-foreground text-xs">{timeAgo(question.createdAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function sortQuestions(questions: Question[], sort: SortValue) {
  return [...questions].sort((a, b) => {
    if (sort === 'top') {
      return b.votes - a.votes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
