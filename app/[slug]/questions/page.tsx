// eslint-disable-next-line autofix/no-unused-vars
import { Suspense, ViewTransition } from 'react';
import { PageContainer, PageShell } from '@/components/page-shell';
import { EventHeader, EventHeaderSkeleton } from '@/features/event/components/event-header';
import {
  QuestionFeed,
  QuestionFeedHeader,
  QuestionFeedHeaderSkeleton,
} from '@/features/question/components/question-feed';
import { QuestionForm } from '@/features/question/components/question-form';

export default async function QuestionsPage({ params }: PageProps<'/[slug]/questions'>) {
  const { slug } = await params;

  return (
    <PageShell>
      <PageContainer>
        <div className="space-y-3 pb-14">
          <Suspense
            fallback={
              <>
                <EventHeaderSkeleton />
                <QuestionFeedHeaderSkeleton />
              </>
            }
          >
            <EventHeader slug={slug} />
            <QuestionFeedHeader slug={slug} />
          </Suspense>
          <QuestionForm eventSlug={slug} />
          <QuestionFeed slug={slug} />
        </div>
      </PageContainer>
    </PageShell>
  );
}
