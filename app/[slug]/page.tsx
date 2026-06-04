import { Suspense, ViewTransition } from 'react';
import { NavForward } from '@/components/animations';
import { CommentForm } from '@/features/comment/components/comment-form';
import { CommentList, CommentListSkeleton } from '@/features/comment/components/comment-list';
import { EventDetails, EventDetailsSkeleton } from '@/features/event/components/event-details';

export default function SessionPage({ params }: PageProps<'/[slug]'>) {
  return (
    <NavForward>
      <div className="min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-8">
            <Suspense fallback={<EventDetailsSkeleton />}>
              {params.then(({ slug }) => {
                return (
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
                );
              })}
            </Suspense>
          </div>
        </div>
      </div>
    </NavForward>
  );
}
