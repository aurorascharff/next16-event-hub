import { Suspense } from 'react';
import { ViewTransition } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/data/queries/auth';
import { getQuestionsByEvent } from '@/data/queries/question';
import { QuestionList } from '../_components/QuestionList';

export default async function QuestionsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={
      <ViewTransition exit="slide-down">
        <FeedSkeleton />
      </ViewTransition>
    }>
      <ViewTransition enter="slide-up" default="none">
        <QuestionFeed slug={slug} />
      </ViewTransition>
    </Suspense>
  );
}

async function QuestionFeed({ slug }: { slug: string }) {
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
