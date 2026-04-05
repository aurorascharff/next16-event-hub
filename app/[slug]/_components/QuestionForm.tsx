'use client';

import { useRef } from 'react';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  onSubmit: (content: string) => void;
  isPending: boolean;
};

export function QuestionForm({ onSubmit, isPending }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    const content = (formData.get('content') as string)?.trim();
    if (!content) return;
    onSubmit(content);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2">
      <Textarea
        name="content"
        placeholder="Ask a question..."
        required
        rows={1}
        className="h-8 min-h-0 flex-1 resize-none py-1.5"
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      />
      <SubmitButton size="sm" disabled={isPending}>Ask</SubmitButton>
    </form>
  );
}
