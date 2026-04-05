'use client';

import { useActionState, useRef } from 'react';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Textarea } from '@/components/ui/textarea';
import { addQuestion, type QuestionActionResult } from '@/data/actions/question';

type Props = {
  eventSlug: string;
};

export function QuestionForm({ eventSlug }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function submitAction(_prev: QuestionActionResult | null, formData: FormData) {
    const result = await addQuestion(eventSlug, formData);
    if (result.success) {
      formRef.current?.reset();
    }
    return result;
  }

  const [state, action] = useActionState(submitAction, null);

  return (
    <form ref={formRef} action={action} className="flex gap-2">
      <Textarea
        name="content"
        placeholder="Ask a question..."
        required
        rows={1}
        className="min-h-[38px] flex-1 resize-none"
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      />
      <SubmitButton size="sm">Ask</SubmitButton>
      {state && !state.success && (
        <p className="text-destructive text-xs">{state.error}</p>
      )}
    </form>
  );
}
