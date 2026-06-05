import { Suspense } from 'react';
import { PageContainer, PageShell } from '@/components/page-shell';
import { CenteredSpinner } from '@/components/ui/spinner';
import { CommentForm } from '@/features/comment/components/comment-form';
import { CommentList } from '@/features/comment/components/comment-list';
import { EventDetails } from '@/features/event/components/event-details';

export default async function SessionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;

  return (
    <PageShell>
      <PageContainer>
        <div className="flex flex-col gap-8">
          <Suspense>
            <EventDetails slug={slug} />
          </Suspense>
          <div className="border-border/60 border-t pt-8">
            <div className="mb-6 min-h-9">
              <CommentForm />
            </div>
            <Suspense fallback={<CenteredSpinner />}>
              <CommentList slug={slug} />
            </Suspense>
          </div>
        </div>
      </PageContainer>
    </PageShell>
  );
}
