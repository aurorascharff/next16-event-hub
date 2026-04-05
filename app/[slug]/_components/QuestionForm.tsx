'use client';

import { InlineForm } from '@/components/design/InlineForm';

type Props = {
  onSubmit: (content: string) => void;
  isPending: boolean;
};

export function QuestionForm({ onSubmit, isPending }: Props) {
  function handleAction(formData: FormData) {
    const content = (formData.get('content') as string)?.trim();
    if (!content) return;
    onSubmit(content);
  }

  return (
    <InlineForm
      action={handleAction}
      placeholder="Ask a question..."
      submitLabel="Ask"
      disabled={isPending}
    />
  );
}
