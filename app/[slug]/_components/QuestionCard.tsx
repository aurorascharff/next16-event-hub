import { getAvatarUrl } from '@/lib/utils';
import { UpvoteButton } from './UpvoteButton';

type Question = {
  id: string;
  content: string;
  userName: string;
  votes: number;
  hasVoted: boolean;
  eventSlug: string;
  createdAt: Date | string;
};

type Props = {
  question: Question;
};

export function QuestionCard({ question }: Props) {
  return (
    <div className="flex items-start gap-2 rounded-lg border p-3">
      <UpvoteButton
        questionId={question.id}
        eventSlug={question.eventSlug}
        votes={question.votes}
        hasVoted={question.hasVoted}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-relaxed">{question.content}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <img
            src={getAvatarUrl(question.userName)}
            alt=""
            className="size-4 rounded-full"
          />
          <span className="text-muted-foreground text-xs">{question.userName}</span>
        </div>
      </div>
    </div>
  );
}
