import { Suspense, ViewTransition } from 'react';
import { PageContainer, PageShell } from '@/components/page-shell';
import { Poller } from '@/components/poller';
import { EventHeader, EventHeaderSkeleton } from '@/features/event/components/event-header';
import { QuestionFeed, QuestionFeedSkeleton } from '@/features/question/components/question-feed';
import { OptimisticQuestions } from '@/features/question/components/question-form';
import { getCurrentUser } from '@/features/user/user-queries';
import type { SortValue } from '@/types/question';

export default function QuestionsPage({ params, searchParams }: PageProps<'/[slug]/questions'>) {
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
                  <ViewTransition exit="slide-down">
                    <QuestionFeedSkeleton />
                  </ViewTransition>
                </>
              }
            >
              {Promise.all([params, searchParams, getCurrentUser()]).then(([{ slug }, sp, currentUser]) => {
                const sort = (sp.sort as SortValue) || 'top';
                return (
                  <>
                    <EventHeader slug={slug} />
                    <ViewTransition enter="slide-up" default="none">
                      <Poller />
                      <OptimisticQuestions eventSlug={slug} currentUser={currentUser} />
                      <QuestionFeed slug={slug} sort={sort} />
                    </ViewTransition>
                  </>
                );
              })}
            </Suspense>
          </div>
        </PageContainer>
      </PageShell>
    </ViewTransition>
  );
}
