'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';
import { InlineForm } from '@/components/design/InlineForm';
import { addComment, type CommentActionResult } from '@/data/actions/comment';

type Props = {
  eventSlug: string;
};

export function CommentForm({ eventSlug }: Props) {
  async function submitAction(_prev: CommentActionResult | null, formData: FormData) {
    const result = await addComment(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
    return result;
  }

  const [, action] = useActionState(submitAction, null);

  return <InlineForm action={action} placeholder="Add a comment..." submitLabel="Post" />;
}
