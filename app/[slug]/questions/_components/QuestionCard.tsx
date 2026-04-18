import { Avatar } from '@/components/common/Avatar';
import { cn, timeAgo } from '@/lib/utils';
import type { Question } from '@/types';
import { UpvoteButton } from './UpvoteButton';

type Props = {
  question: Question;
  pending?: boolean;
};

export function QuestionCard({ question, pending }: Props) {
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
