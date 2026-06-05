import { PageContainer, PageShell } from '@/components/page-shell';
import { EventHeader } from '@/features/event/components/event-header';
import { QuestionFeed } from '@/features/question/components/question-feed';
import { QuestionForm } from '@/features/question/components/question-form';
import { getCurrentUser } from '@/features/user/user-queries';
import type { SortValue } from '@/types/question';

export default async function QuestionsPage({ params, searchParams }: PageProps<'/[slug]/questions'>) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();

  return (
    <PageShell>
      <PageContainer>
        <div className="space-y-3 pb-14">
          <EventHeader slug={slug} />
          {searchParams.then(sp => (
            <QuestionFeed slug={slug} sort={(sp.sort as SortValue) || 'top'} />
          ))}
          <QuestionForm eventSlug={slug} currentUser={currentUser} />
        </div>
      </PageContainer>
    </PageShell>
  );
}
