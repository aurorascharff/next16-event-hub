import { Suspense, ViewTransition } from 'react';
import { NavForward } from '@/components/animations';
import { PageContainer, PageShell } from '@/components/page-shell';
import { CommentForm } from '@/features/comment/components/comment-form';
import { CommentList, CommentListSkeleton } from '@/features/comment/components/comment-list';
import { EventDetails, EventDetailsSkeleton } from '@/features/event/components/event-details';

export default function SessionPage({ params }: PageProps<'/[slug]'>) {
  return (
    <NavForward>
      <PageShell>
        <PageContainer>
          <div className="flex flex-col gap-8">
            <Suspense fallback={<EventDetailsSkeleton />}>
              {params.then(({ slug }) => (
                <>
                  <ViewTransition>
                    <EventDetails slug={slug} />
                  </ViewTransition>
                  <div className="border-border/60 border-t pt-8">
                    <div className="mb-6 min-h-9">
                      <CommentForm />
                    </div>
                    <Suspense
                      fallback={
                        <ViewTransition exit="slide-down">
                          <CommentListSkeleton />
                        </ViewTransition>
                      }
                    >
                      <ViewTransition enter="slide-up" default="none">
                        <CommentList slug={slug} />
                      </ViewTransition>
                    </Suspense>
                  </div>
                </>
              ))}
            </Suspense>
          </div>
        </PageContainer>
      </PageShell>
    </NavForward>
  );
}
