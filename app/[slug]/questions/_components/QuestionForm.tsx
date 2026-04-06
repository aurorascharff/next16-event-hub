'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
  postAction: (content: string) => Promise<void>;
};

export function QuestionForm({ postAction }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function submitAction(formData: FormData) {
    const content = (formData.get('content') as string)?.trim();
    if (!content) return;
    formRef.current?.reset();
    await postAction(content);
  }

  return (
    <form ref={formRef} action={submitAction} className="flex gap-2">
      <Input name="content" placeholder="Ask a question..." required className="flex-1" />
      <Button type="submit">Ask</Button>
    </form>
  );
}
