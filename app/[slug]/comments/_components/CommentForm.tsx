'use client';

import { toast } from 'sonner';
import { InlineForm } from '@/components/common/InlineForm';
import { addComment } from '@/data/actions/comment';

type Props = {
  eventSlug: string;
};

export function CommentForm({ eventSlug }: Props) {
  async function handleAction(formData: FormData) {
    const result = await addComment(eventSlug, formData);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  return <InlineForm action={handleAction} placeholder="Add a comment..." submitLabel="Post" />;
}
