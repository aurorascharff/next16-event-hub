'use client';

import { toast } from 'sonner';
import { addQuestion } from '@/data/actions/question';
import { QuestionForm } from './QuestionForm';

type Props = {
  eventSlug: string;
};

export function BasicQuestionForm({ eventSlug }: Props) {
  async function postAction(content: string) {
    const formData = new FormData();
    formData.set('content', content);
    const result = await addQuestion(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return <QuestionForm postAction={postAction} />;
}
