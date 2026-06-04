import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { getQuestionsByEvent } from '@/features/question/question-queries';
import { QuestionCard } from '@/features/question/components/question-card';
import { QuestionSort } from '@/features/question/components/question-sort';
import { getCurrentUser } from '@/features/user/user-queries';
import type { Question, SortValue } from '@/types/question';

type Props = {
  slug: string;
  sort: SortValue;
};

export async function QuestionFeed({ slug, sort }: Props) {
  const currentUser = await getCurrentUser();
  const questions = await getQuestionsByEvent(slug, currentUser);
  const sorted = sortQuestions(questions, sort);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live · {questions.length} question{questions.length !== 1 ? 's' : ''}
        </span>
        <QuestionSort />
      </div>
      <div className="space-y-2">
        {sorted.map(question => {
          return <QuestionCard key={question.id} question={question} />;
        })}
        {sorted.length === 0 && <EmptyState message="No questions yet. Be the first to ask!" />}
      </div>
    </>
  );
}

export function QuestionFeedSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => {
          return (
            <div key={i} className="flex items-start gap-2 rounded-lg border p-3">
              <Skeleton className="h-10 w-8 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          );
        })}
      </div>
    </>
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
