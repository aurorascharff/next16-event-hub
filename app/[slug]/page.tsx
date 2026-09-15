import { NavForward } from '@/components/animations';
import { PageContainer, PageShell } from '@/components/page-shell';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { CommentForm } from '@/features/comment/components/comment-form';
import { CommentList, CommentListSkeleton } from '@/features/comment/components/comment-list';
import { EventDetails, EventDetailsSkeleton } from '@/features/event/components/event-details';

export default async function SessionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;

  return (
    <NavForward>
      <PageShell>
        <PageContainer>
          <div className="flex flex-col gap-8">
            <AnimatedSuspense fallback={<EventDetailsSkeleton />}>
              <EventDetails slug={slug} />
              <CommentForm />
              <AnimatedSuspense animation="slide" fallback={<CommentListSkeleton />}>
                <CommentList slug={slug} />
              </AnimatedSuspense>
            </AnimatedSuspense>
          </div>
        </PageContainer>
      </PageShell>
    </NavForward>
  );
}
