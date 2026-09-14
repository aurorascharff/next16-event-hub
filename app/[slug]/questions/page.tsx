import { ViewTransition } from 'react';
import { PageContainer, PageShell } from '@/components/page-shell';
import { Poller } from '@/components/poller';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
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
            <AnimatedSuspense
              fallback={
                <>
                  <EventHeaderSkeleton />
                  <QuestionFeedHeaderSkeleton />
                </>
              }
            >
              <EventHeader slug={slug} />
              <QuestionFeedHeader slug={slug} />
            </AnimatedSuspense>
            <Poller />
            <OptimisticQuestionForm eventSlug={slug} />
            <AnimatedSuspense fallback={<QuestionFeedSkeleton />}>
              <QuestionFeed slug={slug} />
            </AnimatedSuspense>
          </div>
        </PageContainer>
      </PageShell>
    </ViewTransition>
  );
}
