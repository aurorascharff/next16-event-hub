import { Skeleton } from '@/components/ui/skeleton';
import { getQuestionsByEvent } from '@/features/question/question-queries';
import { QuestionList } from '@/features/question/components/question-list';
import { QuestionSort } from '@/features/question/components/question-sort';
import { getCurrentUser } from '@/features/user/user-queries';

type Props = {
  slug: string;
};

export async function QuestionFeed({ slug }: Props) {
  const currentUser = await getCurrentUser();
  const questions = await getQuestionsByEvent(slug, currentUser);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live · {questions.length} question{questions.length !== 1 ? 's' : ''}
        </span>
        <QuestionSort />
      </div>
      <QuestionList questions={questions} />
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
