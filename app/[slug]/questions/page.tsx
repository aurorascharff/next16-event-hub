import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getQuestionsByEvent } from '@/data/queries/question';
import { QuestionList } from './_components/QuestionList';

export default function QuestionsPage({ params }: PageProps<'/[slug]/questions'>) {
  return (
    <Suspense fallback={
      <ViewTransition exit="slide-down">
        <FeedSkeleton />
      </ViewTransition>
    }>
      <ViewTransition enter="slide-up" default="none">
        <QuestionFeed params={params} />
      </ViewTransition>
    </Suspense>
  );
}

async function QuestionFeed({ params }: Pick<PageProps<'/[slug]/questions'>, 'params'>) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();
  const questions = await getQuestionsByEvent(slug, currentUser);
  return <QuestionList initialQuestions={questions} eventSlug={slug} currentUser={currentUser} />;
}

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full rounded-lg" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => {
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
    </div>
  );
}
