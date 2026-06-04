import { EventHeader } from '@/features/event/components/event-header';
import { QuestionFeed } from '@/features/question/components/question-feed';
import { QuestionForm } from '@/features/question/components/question-form';
import { getCurrentUser } from '@/features/user/user-queries';
import type { SortValue } from '@/types/question';

export default function QuestionsPage({ params, searchParams }: PageProps<'/[slug]/questions'>) {
  return (
    <div className="min-h-[calc(100dvh-env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="space-y-3 pb-14">
          {Promise.all([params, searchParams, getCurrentUser()]).then(([{ slug }, sp, currentUser]) => {
            const sort = (sp.sort as SortValue) || 'top';
            return (
              <>
                <EventHeader slug={slug} />
                <QuestionFeed slug={slug} sort={sort} />
                <QuestionForm eventSlug={slug} currentUser={currentUser} />
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
