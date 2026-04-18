'use client';

import { toast } from 'sonner';
import { addQuestion } from '@/data/actions/question';
import { QuestionForm } from './QuestionForm';

type Props = {
  eventSlug: string;
  currentUser: string | null;
  questionCount: number;
  sort: React.ReactNode;
  children: React.ReactNode;
};

export function BasicQuestionForm({ eventSlug, questionCount, sort, children }: Props) {
  async function postAction(content: string) {
    const formData = new FormData();
    formData.set('content', content);
    const result = await addQuestion(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <>
      <div className="bg-background sticky top-[env(safe-area-inset-top)] z-10 space-y-3 pt-5 pb-3">
        <QuestionForm postAction={postAction} />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            {questionCount} question{questionCount !== 1 ? 's' : ''}
          </span>
          {sort}
        </div>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </>
  );
}
