import { Avatar } from '@/components/ui/avatar';
import { UpvoteButton } from '@/features/question/components/upvote-button';
import { cn, timeAgo } from '@/lib/utils';
import type { Question } from '@/types/question';

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
