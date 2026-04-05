'use client';

import { useActionState, useRef } from 'react';
import { toast } from 'sonner';
import { SubmitButton } from '@/components/design/SubmitButton';
import { Textarea } from '@/components/ui/textarea';
import { addComment, type CommentActionResult } from '@/data/actions/comment';

type Props = {
  eventSlug: string;
};

export function CommentForm({ eventSlug }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  async function submitAction(_prev: CommentActionResult | null, formData: FormData) {
    const result = await addComment(eventSlug, formData);
    if (result.success) {
      formRef.current?.reset();
    } else {
      toast.error(result.error);
    }
    return result;
  }

  const [, action] = useActionState(submitAction, null);

  return (
    <form ref={formRef} action={action} className="flex gap-2">
      <Textarea
        name="content"
        placeholder="Add a comment..."
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
      <SubmitButton size="sm">Post</SubmitButton>
    </form>
  );
}
