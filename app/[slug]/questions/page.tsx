import { PageContainer, PageShell } from '@/components/page-shell';
import { EventHeader } from '@/features/event/components/event-header';
import { QuestionFeed } from '@/features/question/components/question-feed';
import { QuestionForm } from '@/features/question/components/question-form';
import { getCurrentUser } from '@/features/user/user-queries';
import type { SortValue } from '@/types/question';

export default function QuestionsPage({ params, searchParams }: PageProps<'/[slug]/questions'>) {
  return (
    <PageShell>
      <PageContainer>
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
      </PageContainer>
    </PageShell>
  );
}
