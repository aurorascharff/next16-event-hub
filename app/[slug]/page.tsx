import { Suspense } from 'react';
import { CenteredSpinner } from '@/components/ui/spinner';
import { CommentForm } from '@/features/comment/components/comment-form';
import { CommentList } from '@/features/comment/components/comment-list';
import { EventDetails } from '@/features/event/components/event-details';

export default function SessionPage({ params }: PageProps<'/[slug]'>) {
  return (
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-8">
          <Suspense>
            {params.then(({ slug }) => {
              return (
                <>
                  <EventDetails slug={slug} />
                  <div className="border-border/60 border-t pt-8">
                    <div className="mb-6 min-h-9">
                      <CommentForm />
                    </div>
                    <Suspense fallback={<CenteredSpinner />}>
                      <CommentList slug={slug} />
                    </Suspense>
                  </div>
                </>
              );
            })}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
