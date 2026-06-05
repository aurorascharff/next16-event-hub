import { Suspense } from 'react';
import { PageContainer, PageShell } from '@/components/page-shell';
import { EventHeader, EventHeaderSkeleton } from '@/features/event/components/event-header';
import { QuestionFeed } from '@/features/question/components/question-feed';
import { QuestionForm } from '@/features/question/components/question-form';

export default async function QuestionsPage({ params }: PageProps<'/[slug]/questions'>) {
  const { slug } = await params;

  return (
    <PageShell>
      <PageContainer>
        <div className="space-y-3 pb-14">
          <Suspense fallback={<EventHeaderSkeleton />}>
            <EventHeader slug={slug} />
          </Suspense>
          <QuestionFeed slug={slug} />
          <QuestionForm eventSlug={slug} />
        </div>
      </PageContainer>
    </PageShell>
  );
}
