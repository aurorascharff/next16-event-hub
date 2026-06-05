import { Suspense, ViewTransition } from 'react';
import { PageContainer, PageShell } from '@/components/page-shell';
import { Poller } from '@/components/poller';
import { EventHeader, EventHeaderSkeleton } from '@/features/event/components/event-header';
import {
  QuestionFeed,
  QuestionFeedHeader,
  QuestionFeedHeaderSkeleton,
  QuestionFeedSkeleton,
} from '@/features/question/components/question-feed';
import { OptimisticQuestionForm } from '@/features/question/components/question-form';

export default async function QuestionsPage({ params }: PageProps<'/[slug]/questions'>) {
  const { slug } = await params;

  return (
    <ViewTransition
      enter={{ default: 'none', 'tab-switch': 'auto' }}
      exit={{ default: 'none', 'tab-switch': 'auto' }}
      default="none"
    >
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
            <Poller />
            <OptimisticQuestionForm eventSlug={slug} />
            <Suspense
              fallback={
                <ViewTransition exit="slide-down">
                  <QuestionFeedSkeleton />
                </ViewTransition>
              }
            >
              <ViewTransition enter="slide-up" default="none">
                <QuestionFeed slug={slug} />
              </ViewTransition>
            </Suspense>
          </div>
        </PageContainer>
      </PageShell>
    </ViewTransition>
  );
}
