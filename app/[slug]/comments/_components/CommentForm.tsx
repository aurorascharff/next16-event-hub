'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Input } from '@/components/ui/input';
import { addComment } from '@/data/actions/comment';

type Props = {
  eventSlug: string;
};

export function CommentForm({ eventSlug }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function submitAction(formData: FormData) {
    formRef.current?.reset();
    const result = await addComment(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <form ref={formRef} className="flex gap-2">
      <Input name="content" placeholder="Add a comment..." required className="flex-1" />
      <SubmitButton action={submitAction}>Post</SubmitButton>
    </form>
  );
}
