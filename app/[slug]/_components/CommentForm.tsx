'use client';

import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Input } from '@/components/ui/input';
import { addComment } from '@/data/actions/comment';

export function CommentForm() {
  const { slug } = useParams<{ slug: string }>();
  const formRef = useRef<HTMLFormElement>(null);

  async function submitAction(formData: FormData) {
    const result = await addComment(slug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return (
    <form ref={formRef} className="flex min-h-9 gap-2">
      <Input name="content" placeholder="Add a comment..." required className="flex-1" />
      <SubmitButton action={submitAction}>Post</SubmitButton>
    </form>
  );
}
