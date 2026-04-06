'use client';

import { InlineForm } from '@/components/design/InlineForm';

type Props = {
  onSubmit: (content: string) => Promise<void>;
};

export function QuestionForm({ onSubmit }: Props) {
  async function handleAction(formData: FormData) {
    const content = (formData.get('content') as string)?.trim();
    if (!content) return;
    await onSubmit(content);
  }

  return (
    <InlineForm
      action={handleAction}
      placeholder="Ask a question..."
      submitLabel="Ask"
    />
  );
}
